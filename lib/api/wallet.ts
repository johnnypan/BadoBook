import { supabase } from '../supabase';

// Wallet Types
export interface Wallet {
    id: string;
    user_id: string;
    balance: number;
    currency: string;
}

export interface Transaction {
    id: string;
    wallet_id: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'bonus';
    description: string;
    created_at: string;
}

export interface Coupon {
    id: string;
    code: string;
    title: string;
    description: string;
    discount_type: 'fixed' | 'percentage';
    discount_value: number;
    min_spend: number;
    valid_until: string;
}

export interface UserCoupon {
    id: string;
    coupon_id: string;
    status: 'active' | 'used' | 'expired';
    coupon: Coupon;
}

/**
 * Get user's wallet. If not exists, create one (handled by DB trigger usually, but we fallback safely).
 */
export const getUserWallet = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', userId)
            // @ts-ignore
            .single();

        if (error) {
            // If not found, transaction trigger might haven't run or failed?
            // With trigger, it should be there.
            console.error('Error fetching wallet:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getUserWallet:', error);
        return null;
    }
};

/**
 * Get wallet transactions
 */
export const getWalletTransactions = async (walletId: string) => {
    try {
        const { data, error } = await supabase
            .from('wallet_transactions')
            .select('*')
            .eq('wallet_id', walletId)
            // @ts-ignore
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
};

/**
 * Get user coupons
 */
export const getUserCoupons = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('user_coupons')
            .select(`
                *,
                coupon:coupons(*)
            `)
            .eq('user_id', userId)
            .eq('status', 'active'); // Only active for now

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return [];
    }
};

/**
 * Simulate top-up (In real app, call payment gateway)
 */
export const topUpWallet = async (userId: string, amount: number) => {
    // 1. Get Wallet
    const wallet: any = await getUserWallet(userId);
    if (!wallet) return false;

    // 2. Insert Transaction
    const { error: txError } = await supabase
        .from('wallet_transactions')
        .insert({
            wallet_id: wallet.id,
            amount: amount,
            type: 'deposit',
            description: '在线充值'
        } as any);

    if (txError) {
        console.error('Topup tx error:', txError);
        return false;
    }

    // 3. Update Wallet Balance
    const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: (wallet.balance || 0) + amount } as any)
        .eq('id', wallet.id);

    if (walletError) {
        console.error('Topup update error:', walletError);
        return false;
    }

    return true;
};
