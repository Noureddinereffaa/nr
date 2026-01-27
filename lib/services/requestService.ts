import { supabase, isSupabaseConfigured } from '../supabase';
import { ServiceRequest } from '../../types';

export const requestService = {
    async getAll(): Promise<ServiceRequest[]> {
        if (!isSupabaseConfigured() || !supabase) return [];
        const { data, error } = await supabase.from('service_requests').select('*');
        if (error) throw error;
        return data.map((r: any) => ({ ...r, ...(r.data || {}) }));
    },

    async create(request: Omit<ServiceRequest, 'id' | 'date'>): Promise<ServiceRequest> {
        const id = 'req-' + Date.now();
        const newRequest = {
            ...request,
            id,
            date: new Date().toISOString(),
            status: request.status || 'pending'
        } as ServiceRequest;

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('service_requests').insert([{ id, data: newRequest }]);
            if (error) throw error;
        }

        return newRequest;
    },

    async update(id: string, updates: Partial<ServiceRequest>, currentData: ServiceRequest): Promise<ServiceRequest> {
        const updatedRequest = { ...currentData, ...updates };

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('service_requests').update({ data: updatedRequest }).eq('id', id);
            if (error) throw error;
        }

        return updatedRequest;
    },

    async delete(id: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('service_requests').delete().eq('id', id);
            if (error) throw error;
        }
    }
};
