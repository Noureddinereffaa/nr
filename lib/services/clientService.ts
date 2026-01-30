import { supabase, isSupabaseConfigured } from '../supabase';
import { Client } from '../../types';

export const clientService = {
    async getAll(): Promise<Client[]> {
        if (!isSupabaseConfigured() || !supabase) return [];
        // Fetch structured columns + data blob
        const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        // Merge structured properties into the client object to ensure consistency
        return data.map((r: any) => ({
            ...r.data,
            id: r.id,
            name: r.name || r.data?.name,
            email: r.email || r.data?.email,
            phone: r.phone || r.data?.phone,
            company: r.company || r.data?.company,
            status: r.status || r.data?.status || 'lead',
            value: Number(r.value || r.data?.value || 0)
        }));
    },

    /**
     * Finds a client by their email address.
     */
    async getByEmail(email: string): Promise<Client | null> {
        if (!isSupabaseConfigured() || !supabase) return null;

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (!data) return null;

        return {
            ...data.data,
            id: data.id,
            name: data.name || data.data?.name,
            email: data.email || data.data?.email,
            phone: data.phone || data.data?.phone,
            company: data.company || data.data?.company,
            status: data.status || data.data?.status || 'lead',
            value: Number(data.value || data.data?.value || 0)
        };
    },

    async create(client: Partial<Client>): Promise<Client> {
        const id = client.id || 'c-' + Date.now();
        const newClient = { ...client, id } as Client;

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('clients').insert([{
                id,
                name: newClient.name,
                email: newClient.email,
                phone: newClient.phone,
                company: newClient.company,
                status: newClient.status || 'lead',
                value: newClient.value || 0,
                data: newClient
            }]);
            if (error) throw error;
        }

        return newClient;
    },

    async update(id: string, updates: Partial<Client>, currentData: Client): Promise<Client> {
        const updatedClient = { ...currentData, ...updates };

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('clients').update({
                name: updatedClient.name,
                email: updatedClient.email,
                phone: updatedClient.phone,
                company: updatedClient.company,
                status: updatedClient.status,
                value: updatedClient.value,
                data: updatedClient,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            if (error) throw error;
        }

        return updatedClient;
    },

    async delete(id: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('clients').delete().eq('id', id);
            if (error) throw error;
        }
    }
};
