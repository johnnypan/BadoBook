import { supabase } from '../supabase';
import type { TeamRequest } from '../../types';

/**
 * Team Service - Handles all team invitation and matching operations
 */

// Get all open team invitations with filters
export const getTeamInvitations = async (filter?: 'all' | 'beginner' | 'expert') => {
    try {
        let query = supabase
            .from('team_invitations')
            .select(`
        *,
        creator:creator_id (
          username,
          avatar_url,
          skill_level
        ),
        team_participants (
          user_id,
          status,
          profiles:user_id (
            username,
            avatar_url
          )
        )
      `)
            .eq('status', 'open')
            .gte('game_date', new Date().toISOString().split('T')[0])
            .order('game_date', { ascending: true });

        const { data, error } = await query;

        if (error) throw error;

        // Transform to frontend TeamRequest type
        let invitations = data.map(invitation => {
            const acceptedParticipants = invitation.team_participants.filter(
                (p: any) => p.status === 'accepted'
            );

            return {
                id: invitation.id,
                venueName: invitation.venue_name,
                level: invitation.skill_level,
                missingCount: invitation.missing_count,
                time: formatDateTime(invitation.game_date, invitation.start_time, invitation.end_time),
                location: invitation.location,
                image: invitation.image_url || 'https://picsum.photos/400/300',
                creator: {
                    name: invitation.creator.username,
                    avatar: invitation.creator.avatar_url || 'https://picsum.photos/100/100',
                    level: invitation.creator.skill_level || '普通球友'
                },
                joinedPlayers: acceptedParticipants.map((p: any) => p.profiles.avatar_url || 'https://picsum.photos/50/50')
            };
        });

        // Apply filter
        if (filter === 'beginner') {
            invitations = invitations.filter(inv =>
                inv.level.includes('入门') || inv.level.includes('进阶') || inv.level.includes('中级')
            );
        } else if (filter === 'expert') {
            invitations = invitations.filter(inv =>
                inv.level.includes('高级') || inv.level.includes('专业')
            );
        }

        return invitations as (TeamRequest & {
            creator: { name: string; avatar: string; level: string };
            joinedPlayers: string[];
        })[];
    } catch (error) {
        console.error('Error fetching team invitations:', error);
        return [];
    }
};

// Create a new team invitation
export const createTeamInvitation = async (invitationData: {
    venueId?: string;
    venueName: string;
    skillLevel: string;
    missingCount: number;
    gameDate: string;
    startTime: string;
    endTime: string;
    location: string;
    imageUrl?: string;
    notes?: string;
}) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('team_invitations')
            .insert({
                creator_id: user.id,
                venue_id: invitationData.venueId,
                venue_name: invitationData.venueName,
                skill_level: invitationData.skillLevel,
                missing_count: invitationData.missingCount,
                game_date: invitationData.gameDate,
                start_time: invitationData.startTime,
                end_time: invitationData.endTime,
                location: invitationData.location,
                image_url: invitationData.imageUrl,
                notes: invitationData.notes,
                status: 'open'
            })
            .select()
            .single();

        if (error) throw error;

        // Add creator as first participant
        await supabase
            .from('team_participants')
            .insert({
                invitation_id: data.id,
                user_id: user.id,
                status: 'accepted'
            });

        return data;
    } catch (error) {
        console.error('Error creating team invitation:', error);
        return null;
    }
};

// Join a team invitation
export const joinTeamInvitation = async (invitationId: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Check if already joined
        const { data: existing } = await supabase
            .from('team_participants')
            .select('id')
            .eq('invitation_id', invitationId)
            .eq('user_id', user.id)
            .single();

        if (existing) {
            throw new Error('Already joined this team');
        }

        // Add as participant with pending status
        const { error } = await supabase
            .from('team_participants')
            .insert({
                invitation_id: invitationId,
                user_id: user.id,
                status: 'pending'
            });

        if (error) throw error;

        // Get invitation creator to send notification
        const { data: invitation } = await supabase
            .from('team_invitations')
            .select('creator_id, venue_name')
            .eq('id', invitationId)
            .single();

        if (invitation) {
            // Get current user profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', user.id)
                .single();

            // Notify creator
            await supabase
                .from('notifications')
                .insert({
                    user_id: invitation.creator_id,
                    type: 'team',
                    title: '新的加入申请',
                    content: `${profile?.username || '用户'} 申请加入您在${invitation.venue_name}的球局`,
                    avatar_url: profile?.avatar_url,
                    related_id: invitationId,
                    is_read: false
                });
        }

        return true;
    } catch (error) {
        console.error('Error joining team:', error);
        return false;
    }
};

// Accept/reject a team join request (for organizers)
export const updateParticipantStatus = async (
    invitationId: string,
    userId: string,
    status: 'accepted' | 'rejected'
) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Verify user is the creator
        const { data: invitation } = await supabase
            .from('team_invitations')
            .select('creator_id, missing_count')
            .eq('id', invitationId)
            .single();

        if (!invitation || invitation.creator_id !== user.id) {
            throw new Error('Not authorized');
        }

        // Update participant status
        const { error } = await supabase
            .from('team_participants')
            .update({ status })
            .eq('invitation_id', invitationId)
            .eq('user_id', userId);

        if (error) throw error;

        // If accepted, update missing count
        if (status === 'accepted') {
            const newMissingCount = Math.max(0, invitation.missing_count - 1);
            await supabase
                .from('team_invitations')
                .update({
                    missing_count: newMissingCount,
                    status: newMissingCount === 0 ? 'full' : 'open'
                })
                .eq('id', invitationId);
        }

        // Notify the participant
        await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                type: 'team',
                title: status === 'accepted' ? '申请已通过' : '申请未通过',
                content: status === 'accepted'
                    ? '您的加入申请已被接受，准备好开始比赛吧！'
                    : '很遗憾，您的加入申请未被接受',
                related_id: invitationId,
                is_read: false
            });

        return true;
    } catch (error) {
        console.error('Error updating participant status:', error);
        return false;
    }
};

// Get team invitation details
export const getTeamInvitationById = async (invitationId: string) => {
    try {
        const { data, error } = await supabase
            .from('team_invitations')
            .select(`
        *,
        creator:creator_id (
          username,
          avatar_url,
          skill_level
        ),
        team_participants (
          user_id,
          status,
          profiles:user_id (
            username,
            avatar_url,
            skill_level
          )
        )
      `)
            .eq('id', invitationId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching team invitation details:', error);
        return null;
    }
};

// Cancel team invitation
export const cancelTeamInvitation = async (invitationId: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('team_invitations')
            .update({ status: 'cancelled' })
            .eq('id', invitationId)
            .eq('creator_id', user.id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error cancelling team invitation:', error);
        return false;
    }
};

// Helper function to format date and time
const formatDateTime = (date: string, startTime: string, endTime: string) => {
    const gameDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateStr = '';
    if (gameDate.toDateString() === today.toDateString()) {
        dateStr = '今天';
    } else if (gameDate.toDateString() === tomorrow.toDateString()) {
        dateStr = '明天';
    } else {
        dateStr = `${gameDate.getMonth() + 1}月${gameDate.getDate()}日`;
    }

    return `${dateStr} ${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
};
