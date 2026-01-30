import { supabase, isSupabaseConfigured } from '../supabase';
import { SystemNotification } from '../../context/UIContext';

export const notificationService = {
    async getAll(): Promise<SystemNotification[]> {
        if (!isSupabaseConfigured() || !supabase) return [];

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        return (data || []).map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            time: n.created_at,
            type: n.type as any,
            read: n.read || false
        }));
    },

    async create(notification: Omit<SystemNotification, 'id' | 'time' | 'read'>): Promise<SystemNotification | null> {
        if (!isSupabaseConfigured() || !supabase) return null;

        const { data, error } = await supabase
            .from('notifications')
            .insert([{
                title: notification.title,
                message: notification.message,
                type: notification.type
            }])
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            title: data.title,
            message: data.message,
            time: data.created_at,
            type: data.type as any,
            read: data.read || false
        };
    },

    async markAsRead(id: string): Promise<void> {
        if (!isSupabaseConfigured() || !supabase) return;

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);

        if (error) throw error;
    },

    async clearAll(): Promise<void> {
        if (!isSupabaseConfigured() || !supabase) return;

        const { error } = await supabase
            .from('notifications')
            .delete()
            .neq('id', 'placeholder'); // Simple way to delete all

        if (error) throw error;
    }
};
