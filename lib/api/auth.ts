import { supabase } from '../supabase';

/**
 * Authentication Service - Handles user authentication and profile management
 */

// Sign up with email and password
export const signUp = async (email: string, password: string, username: string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    avatar_url: `https://picsum.photos/seed/${username}/100/100`
                }
            }
        });

        if (error) throw error;
        return { user: data.user, error: null };
    } catch (error: any) {
        console.error('Error signing up:', error);
        return { user: null, error: error.message };
    }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
        console.error('Error signing in:', error);
        return { user: null, session: null, error: error.message };
    }
};

// Sign out
export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error signing out:', error);
        return false;
    }
};

// Get current session
export const getSession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
};

// Update user profile
export const updateProfile = async (updates: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
    skill_level?: string;
    bio?: string;
    phone?: string;
}) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
};

// Get user profile
export const getUserProfile = async (userId?: string) => {
    try {
        let targetUserId = userId;

        if (!targetUserId) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            targetUserId = user.id;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', targetUserId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
};
