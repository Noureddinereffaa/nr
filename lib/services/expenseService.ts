import { supabase, isSupabaseConfigured } from '../supabase';
import { Expense } from '../../types';

export const expenseService = {
    async getAll(): Promise<Expense[]> {
        if (!isSupabaseConfigured() || !supabase) return [];
        const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        return data.map((r: any) => ({
            ...r.data,
            id: r.id,
            title: r.title || r.data?.title,
            amount: Number(r.amount || r.data?.amount || 0),
            category: r.category || r.data?.category
        }));
    },

    async create(expense: Omit<Expense, 'id' | 'date'>): Promise<Expense> {
        const id = 'exp-' + Date.now();
        const newExpense = { ...expense, id, date: new Date().toISOString() } as Expense;

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('expenses').insert([{
                id,
                title: newExpense.title,
                amount: newExpense.amount,
                category: newExpense.category,
                data: newExpense
            }]);
            if (error) throw error;
        }

        return newExpense;
    },

    async update(id: string, updates: Partial<Expense>, currentData: Expense): Promise<Expense> {
        const updatedExpense = { ...currentData, ...updates };

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('expenses').update({
                title: updatedExpense.title,
                amount: updatedExpense.amount,
                category: updatedExpense.category,
                data: updatedExpense,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            if (error) throw error;
        }

        return updatedExpense;
    },

    async delete(id: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('expenses').delete().eq('id', id);
            if (error) throw error;
        }
    }
};
