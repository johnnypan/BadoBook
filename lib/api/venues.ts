import { supabase } from './supabase';
import type { Venue } from '../types';

/**
 * Venue Service - Handles all venue-related operations
 */

// Fetch all venues with optional filters
export const getVenues = async (filters?: {
    tags?: string[];
    priceRange?: { min?: number; max?: number };
    amenities?: string[];
    surfaceType?: string;
    sortBy?: 'distance' | 'price' | 'rating';
}) => {
    try {
        let query = supabase
            .from('venues')
            .select('*');

        // Apply filters
        if (filters?.tags && filters.tags.length > 0) {
            query = query.overlaps('tags', filters.tags);
        }

        if (filters?.priceRange?.min) {
            query = query.gte('price', filters.priceRange.min);
        }

        if (filters?.priceRange?.max) {
            query = query.lte('price', filters.priceRange.max);
        }

        if (filters?.amenities && filters.amenities.length > 0) {
            query = query.contains('amenities', filters.amenities);
        }

        if (filters?.surfaceType && filters.surfaceType !== '全部') {
            query = query.eq('surface_type', filters.surfaceType);
        }

        // Apply sorting
        if (filters?.sortBy === 'price') {
            query = query.order('price', { ascending: true });
        } else if (filters?.sortBy === 'rating') {
            query = query.order('rating', { ascending: false });
        } else {
            // Default: sort by distance (you might want to implement geolocation sorting)
            query = query.order('distance', { ascending: true });
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform database format to frontend Venue type
        return data.map(venue => ({
            id: venue.id,
            name: venue.name,
            rating: venue.rating,
            distance: venue.distance || '未知',
            price: venue.price,
            image: venue.image_url || '',
            tags: venue.tags,
            status: venue.status,
            visitorCount: venue.visitor_count,
            official: venue.is_official,
            amenities: venue.amenities,
            surfaceType: venue.surface_type
        })) as Venue[];
    } catch (error) {
        console.error('Error fetching venues:', error);
        return [];
    }
};

// Get a single venue by ID
export const getVenueById = async (id: string) => {
    try {
        const { data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            rating: data.rating,
            distance: data.distance || '未知',
            price: data.price,
            image: data.image_url || '',
            tags: data.tags,
            status: data.status,
            visitorCount: data.visitor_count,
            official: data.is_official,
            amenities: data.amenities,
            surfaceType: data.surface_type
        } as Venue;
    } catch (error) {
        console.error('Error fetching venue:', error);
        return null;
    }
};

// Get venue reviews
export const getVenueReviews = async (venueId: string) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
            .eq('venue_id', venueId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
};

// Add venue to favorites
export const addToFavorites = async (venueId: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('favorites')
            .insert({ user_id: user.id, venue_id: venueId });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error adding to favorites:', error);
        return false;
    }
};

// Remove venue from favorites
export const removeFromFavorites = async (venueId: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('venue_id', venueId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing from favorites:', error);
        return false;
    }
};

// Check if venue is favorited
export const isFavorited = async (venueId: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data, error } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('venue_id', venueId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
    }
};

// Submit a review
export const submitReview = async (venueId: string, rating: number, comment: string, bookingId?: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('reviews')
            .insert({
                user_id: user.id,
                venue_id: venueId,
                booking_id: bookingId,
                rating,
                comment
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error submitting review:', error);
        return false;
    }
};
