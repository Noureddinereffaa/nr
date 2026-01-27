import { supabase, isSupabaseConfigured } from '../supabase';
import { ServiceRequest } from '../../types';

export const requestService = {
    async getAll(): Promise<ServiceRequest[]> {
        if (!isSupabaseConfigured() || !supabase) return [];
        // Select both structured and data columns for resilience
        const { data, error } = await supabase
            .from('service_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((r: any) => ({
            ...r.data, // Fallback to raw json
            id: r.id,
            serviceTitle: r.service_title || r.data?.serviceTitle,
            clientName: r.client_name || r.data?.clientName,
            clientEmail: r.client_email || r.data?.clientEmail,
            clientPhone: r.client_phone || r.data?.clientPhone,
            status: r.status || r.data?.status || 'new',
            priority: r.priority || r.data?.priority || 'medium',
            value: Number(r.value || r.data?.value || 0),
            date: r.created_at || r.data?.date
        }));
    },

    async create(request: Omit<ServiceRequest, 'id' | 'date'>): Promise<ServiceRequest> {
        const id = 'req-' + Date.now();
        const date = new Date().toISOString();
        const newRequest = {
            ...request,
            id,
            date,
            status: request.status || 'new'
        } as ServiceRequest;

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('service_requests').insert([{
                id,
                client_name: newRequest.clientName,
                service_title: newRequest.serviceTitle,
                client_email: newRequest.clientEmail,
                client_phone: newRequest.clientPhone,
                status: newRequest.status,
                priority: newRequest.priority || 'medium',
                value: newRequest.value || 0,
                data: newRequest
            }]);
            if (error) throw error;
        }

        return newRequest;
    },

    async update(id: string, updates: Partial<ServiceRequest>, currentData: ServiceRequest): Promise<ServiceRequest> {
        const updatedRequest = { ...currentData, ...updates };

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('service_requests').update({
                client_name: updatedRequest.clientName,
                service_title: updatedRequest.serviceTitle,
                status: updatedRequest.status,
                priority: updatedRequest.priority,
                value: updatedRequest.value,
                data: updatedRequest,
                updated_at: new Date().toISOString()
            }).eq('id', id);
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
