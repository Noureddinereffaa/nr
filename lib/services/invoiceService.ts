import { supabase, isSupabaseConfigured } from '../supabase';
import { Invoice } from '../../types';

export const invoiceService = {
    async getAll(): Promise<Invoice[]> {
        if (!isSupabaseConfigured() || !supabase) return [];
        // Fetch structured columns + data blob
        const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        // Merge structured properties into the invoice object
        return data.map((r: any) => ({
            ...r.data,
            id: r.id,
            invoiceNumber: r.number || r.data?.invoiceNumber,
            clientId: r.client_id || r.data?.clientId,
            client_id: r.client_id || r.data?.clientId,
            projectId: r.project_id || r.data?.projectId,
            project_id: r.project_id || r.data?.projectId,
            amount: Number(r.amount || r.data?.total || 0),
            total: Number(r.amount || r.data?.total || 0),
            status: r.status || r.data?.status || 'draft'
        }));
    },

    async create(invoice: Partial<Invoice>): Promise<Invoice> {
        const id = invoice.id || 'inv-' + Date.now();
        const newInvoice = { ...invoice, id } as Invoice;

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('invoices').insert([{
                id,
                number: newInvoice.invoiceNumber,
                client_id: newInvoice.clientId,
                project_id: newInvoice.projectId,
                amount: newInvoice.total || 0,
                status: newInvoice.status || 'draft',
                data: newInvoice
            }]);
            if (error) throw error;
        }

        return newInvoice;
    },

    async update(id: string, updates: Partial<Invoice>, currentData: Invoice): Promise<Invoice> {
        const updatedInvoice = { ...currentData, ...updates };

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('invoices').update({
                number: updatedInvoice.invoiceNumber,
                client_id: updatedInvoice.clientId,
                project_id: updatedInvoice.projectId,
                amount: updatedInvoice.total,
                status: updatedInvoice.status,
                data: updatedInvoice,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            if (error) throw error;
        }

        return updatedInvoice;
    },

    async delete(id: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('invoices').delete().eq('id', id);
            if (error) throw error;
        }
    }
};
