// TypeScript types generated from Supabase schema
// This file should be regenerated when the database schema changes
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string
                    full_name: string | null
                    avatar_url: string | null
                    skill_level: string | null
                    bio: string | null
                    phone: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username: string
                    full_name?: string | null
                    avatar_url?: string | null
                    skill_level?: string | null
                    bio?: string | null
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    skill_level?: string | null
                    bio?: string | null
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            venues: {
                Row: {
                    id: string
                    name: string
                    rating: number
                    distance: string | null
                    price: number
                    image_url: string | null
                    tags: string[]
                    status: 'available' | 'busy' | 'full'
                    visitor_count: number
                    is_official: boolean
                    amenities: string[]
                    surface_type: 'PVC' | '实木' | null
                    address: string | null
                    latitude: number | null
                    longitude: number | null
                    phone: string | null
                    opening_hours: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    rating?: number
                    distance?: string | null
                    price: number
                    image_url?: string | null
                    tags?: string[]
                    status?: 'available' | 'busy' | 'full'
                    visitor_count?: number
                    is_official?: boolean
                    amenities?: string[]
                    surface_type?: 'PVC' | '实木' | null
                    address?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    phone?: string | null
                    opening_hours?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    rating?: number
                    distance?: string | null
                    price?: number
                    image_url?: string | null
                    tags?: string[]
                    status?: 'available' | 'busy' | 'full'
                    visitor_count?: number
                    is_official?: boolean
                    amenities?: string[]
                    surface_type?: 'PVC' | '实木' | null
                    address?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    phone?: string | null
                    opening_hours?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    user_id: string
                    venue_id: string
                    venue_name: string
                    court_number: string | null
                    booking_date: string
                    start_time: string
                    end_time: string
                    status: 'upcoming' | 'completed' | 'cancelled'
                    total_price: number
                    payment_status: 'pending' | 'paid' | 'refunded'
                    qr_code: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    venue_id: string
                    venue_name: string
                    court_number?: string | null
                    booking_date: string
                    start_time: string
                    end_time: string
                    status?: 'upcoming' | 'completed' | 'cancelled'
                    total_price: number
                    payment_status?: 'pending' | 'paid' | 'refunded'
                    qr_code?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    venue_id?: string
                    venue_name?: string
                    court_number?: string | null
                    booking_date?: string
                    start_time?: string
                    end_time?: string
                    status?: 'upcoming' | 'completed' | 'cancelled'
                    total_price?: number
                    payment_status?: 'pending' | 'paid' | 'refunded'
                    qr_code?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            booking_participants: {
                Row: {
                    id: string
                    booking_id: string
                    user_id: string
                    is_organizer: boolean
                    joined_at: string
                }
                Insert: {
                    id?: string
                    booking_id: string
                    user_id: string
                    is_organizer?: boolean
                    joined_at?: string
                }
                Update: {
                    id?: string
                    booking_id?: string
                    user_id?: string
                    is_organizer?: boolean
                    joined_at?: string
                }
            }
            team_invitations: {
                Row: {
                    id: string
                    creator_id: string
                    venue_id: string | null
                    venue_name: string
                    skill_level: string
                    missing_count: number
                    game_date: string
                    start_time: string
                    end_time: string
                    location: string
                    image_url: string | null
                    status: 'open' | 'full' | 'cancelled' | 'completed'
                    max_players: number
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    creator_id: string
                    venue_id?: string | null
                    venue_name: string
                    skill_level: string
                    missing_count: number
                    game_date: string
                    start_time: string
                    end_time: string
                    location: string
                    image_url?: string | null
                    status?: 'open' | 'full' | 'cancelled' | 'completed'
                    max_players?: number
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    creator_id?: string
                    venue_id?: string | null
                    venue_name?: string
                    skill_level?: string
                    missing_count?: number
                    game_date?: string
                    start_time?: string
                    end_time?: string
                    location?: string
                    image_url?: string | null
                    status?: 'open' | 'full' | 'cancelled' | 'completed'
                    max_players?: number
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            team_participants: {
                Row: {
                    id: string
                    invitation_id: string
                    user_id: string
                    status: 'pending' | 'accepted' | 'rejected'
                    joined_at: string
                }
                Insert: {
                    id?: string
                    invitation_id: string
                    user_id: string
                    status?: 'pending' | 'accepted' | 'rejected'
                    joined_at?: string
                }
                Update: {
                    id?: string
                    invitation_id?: string
                    user_id?: string
                    status?: 'pending' | 'accepted' | 'rejected'
                    joined_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    type: 'booking' | 'team' | 'system'
                    title: string
                    content: string
                    is_read: boolean
                    related_id: string | null
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'booking' | 'team' | 'system'
                    title: string
                    content: string
                    is_read?: boolean
                    related_id?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'booking' | 'team' | 'system'
                    title?: string
                    content?: string
                    is_read?: boolean
                    related_id?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
            }
            reviews: {
                Row: {
                    id: string
                    user_id: string
                    venue_id: string
                    booking_id: string | null
                    rating: number
                    comment: string | null
                    images: string[]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    venue_id: string
                    booking_id?: string | null
                    rating: number
                    comment?: string | null
                    images?: string[]
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    venue_id?: string
                    booking_id?: string | null
                    rating?: number
                    comment?: string | null
                    images?: string[]
                    created_at?: string
                    updated_at?: string
                }
            }
            favorites: {
                Row: {
                    id: string
                    user_id: string
                    venue_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    venue_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    venue_id?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
