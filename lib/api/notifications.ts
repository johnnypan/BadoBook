import { supabase } from '../supabase';
import type { AppNotification } from '../../types';

/**
 * Notification Service - Handles user notifications
 */

// Get user notifications
export const getNotifications = async (unreadOnly: boolean = false) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (unreadOnly) {
            query = query.eq('is_read', false);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform to frontend AppNotification type
        return data.map(notification => ({
            id: notification.id,
            type: notification.type,
            title: notification.title,
            content: notification.content,
            time: formatNotificationTime(notification.created_at),
            isRead: notification.is_read,
            avatar: notification.avatar_url
        })) as AppNotification[];
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
    }
};

// Delete notification
export const deleteNotification = async (notificationId: string) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting notification:', error);
        return false;
    }
};

// Get unread notification count
export const getUnreadCount = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 0;

        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }
};

// Subscribe to real-time notifications
export const subscribeToNotifications = (callback: (notification: any) => void) => {
    return supabase
        .channel('notifications')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications'
            },
            (payload) => {
                callback(payload.new);
            }
        )
        .subscribe();
};

// Helper function to format notification time
const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;

    return `${date.getMonth() + 1}月${date.getDate()}日`;
};
