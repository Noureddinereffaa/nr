import { useState, useCallback } from 'react';
import { Client } from '../types';
import { clientService } from '../services/clientService';
import Logger from '../logger';

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshClients = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await clientService.getAll();
            setClients(data);
        } catch (error) {
            Logger.error("Error fetching clients", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addClient = useCallback(async (client: Partial<Client>) => {
        try {
            const newClient = await clientService.create(client);
            setClients(prev => [...prev, newClient]);
            return newClient;
        } catch (error) {
            Logger.error("Error adding client", error);
            throw error;
        }
    }, []);

    const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
        try {
            const current = clients.find(c => c.id === id);
            if (!current) return;
            const updated = await clientService.update(id, updates, current);
            setClients(prev => prev.map(c => c.id === id ? updated : c));
            return updated;
        } catch (error) {
            Logger.error("Error updating client", error);
            throw error;
        }
    }, [clients]);

    const deleteClient = useCallback(async (id: string) => {
        try {
            await clientService.delete(id);
            setClients(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            Logger.error("Error deleting client", error);
            throw error;
        }
    }, []);

    return {
        clients,
        setClients,
        isLoading,
        refreshClients,
        addClient,
        updateClient,
        deleteClient
    };
};
