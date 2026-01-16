import { supabase } from '../supabase';
import type { Booking } from '../../types';

/**
 * Booking Service - Handles all booking-related operations
 */

// Get user's bookings
export const getUserBookings = async (status?: 'upcoming' | 'completed' | 'cancelled') => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        let query = supabase
            .from('bookings')
            .select(`
        *,
        booking_participants!inner (
          user_id,
          profiles:user_id (
            username,
            avatar_url
          )
        )
      `)
            .eq('user_id', user.id);

        if (status) {
            query = query.eq('status', status);
        }

        query = query.order('booking_date', { ascending: true });

        const { data, error } = await query;

        if (error) throw error;

        // Transform to frontend Booking type
        return data.map(booking => ({
            id: booking.id,
            venueName: booking.venue_name,
            date: formatDate(booking.booking_date),
            time: `${booking.start_time.slice(0, 5)} - ${booking.end_time.slice(0, 5)}`,
            image: '', // You might want to join with venues table to get image
            status: booking.status,
            players: booking.booking_participants.map((p: any) => p.profiles.username)
        })) as Booking[];
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
};

// Create a new booking
export const createBooking = async (bookingData: {
    venueId: string;
    venueName: string;
    courtNumber?: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    notes?: string;
}) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Generate QR code (simple random code for now)
        const qrCode = Math.random().toString(36).substring(2, 9).toUpperCase();

        const { data, error } = await supabase
            .from('bookings')
            .insert({
                user_id: user.id,
                venue_id: bookingData.venueId,
                venue_name: bookingData.venueName,
                court_number: bookingData.courtNumber,
                booking_date: bookingData.bookingDate,
                start_time: bookingData.startTime,
                end_time: bookingData.endTime,
                total_price: bookingData.totalPrice,
                payment_status: 'paid',
                qr_code: qrCode,
                notes: bookingData.notes
            })
            .select()
            .single();

        if (error) throw error;

        // Add user as organizer participant
        await supabase
            .from('booking_participants')
            .insert({
                booking_id: data.id,
                user_id: user.id,
                is_organizer: true
            });

        // Create notification
        await supabase
            .from('notifications')
            .insert({
                user_id: user.id,
                type: 'booking',
                title: '预订确认',
                content: `您在${bookingData.venueName}的预订已确认`,
                is_read: false
            });

        return data;
    } catch (error) {
        console.error('Error creating booking:', error);
        return null;
    }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('bookings')
            .update({
                status: 'cancelled',
                payment_status: 'refunded'
            })
            .eq('id', bookingId)
            .eq('user_id', user.id);

        if (error) throw error;

        // Create notification
        await supabase
            .from('notifications')
            .insert({
                user_id: user.id,
                type: 'booking',
                title: '预订已取消',
                content: '您的预订已成功取消，退款将在3-5个工作日内到账',
                is_read: false
            });

        return true;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return false;
    }
};

// Get booking details
export const getBookingById = async (bookingId: string) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        venues:venue_id (
          name,
          image_url,
          address,
          phone
        ),
        booking_participants (
          user_id,
          is_organizer,
          profiles:user_id (
            username,
            avatar_url,
            skill_level
          )
        )
      `)
            .eq('id', bookingId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching booking details:', error);
        return null;
    }
};

// Add participant to booking
export const addBookingParticipant = async (bookingId: string, userId: string) => {
    try {
        const { error } = await supabase
            .from('booking_participants')
            .insert({
                booking_id: bookingId,
                user_id: userId,
                is_organizer: false
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error adding participant:', error);
        return false;
    }
};

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return `${date.getMonth() + 1}月${date.getDate()}日 (今日)`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return `${date.getMonth() + 1}月${date.getDate()}日 (明天)`;
    } else {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return `${date.getMonth() + 1}月${date.getDate()}日 (${days[date.getDay()]})`;
    }
};
