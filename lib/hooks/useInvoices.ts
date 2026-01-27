import { useState, useCallback } from 'react';
import { Invoice } from '../types';
import { invoiceService } from '../services/invoiceService';
import Logger from '../logger';

export const useInvoices = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await invoiceService.getAll();
            setInvoices(data);
        } catch (error) {
            Logger.error("Error fetching invoices", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addInvoice = useCallback(async (invoice: Partial<Invoice>) => {
        try {
            const newInvoice = await invoiceService.create(invoice);
            setInvoices(prev => [...prev, newInvoice]);
            return newInvoice;
        } catch (error) {
            Logger.error("Error adding invoice", error);
            throw error;
        }
    }, []);

    const updateInvoice = useCallback(async (id: string, updates: Partial<Invoice>) => {
        try {
            const current = invoices.find(i => i.id === id);
            if (!current) return;
            const updated = await invoiceService.update(id, updates, current);
            setInvoices(prev => prev.map(i => i.id === id ? updated : i));
            return updated;
        } catch (error) {
            Logger.error("Error updating invoice", error);
            throw error;
        }
    }, [invoices]);

    const deleteInvoice = useCallback(async (id: string) => {
        try {
            await invoiceService.delete(id);
            setInvoices(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            Logger.error("Error deleting invoice", error);
            throw error;
        }
    }, []);

    return {
        invoices,
        setInvoices,
        isLoading,
        refreshInvoices,
        addInvoice,
        updateInvoice,
        deleteInvoice
    };
};
