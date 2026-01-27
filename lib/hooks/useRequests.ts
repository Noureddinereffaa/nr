import { useState, useCallback } from 'react';
import { ServiceRequest } from '../types';
import { requestService } from '../services/requestService';
import Logger from '../logger';

export const useRequests = () => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await requestService.getAll();
            setRequests(data);
        } catch (error) {
            Logger.error("Error fetching requests", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addRequest = useCallback(async (request: Omit<ServiceRequest, 'id' | 'date'>) => {
        try {
            const newRequest = await requestService.create(request);
            setRequests(prev => [newRequest, ...prev]);

            // Logging activity for requests
            import('../log-service').then(({ LogService }) => {
                LogService.info(`طلب خدمة جديد: ${newRequest.serviceTitle}`, 'crm', {
                    message: `تم استلام طلب من ${newRequest.clientName}`,
                    client: newRequest.clientName
                });
            });

            return newRequest;
        } catch (error) {
            Logger.error("Error adding request", error);
            throw error;
        }
    }, []);

    const updateRequest = useCallback(async (id: string, updates: Partial<ServiceRequest>) => {
        try {
            const current = requests.find(r => r.id === id);
            if (!current) return;
            const updated = await requestService.update(id, updates, current);
            setRequests(prev => prev.map(r => r.id === id ? updated : r));
            return updated;
        } catch (error) {
            Logger.error("Error updating request", error);
            throw error;
        }
    }, [requests]);

    const deleteRequest = useCallback(async (id: string) => {
        try {
            await requestService.delete(id);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            Logger.error("Error deleting request", error);
            throw error;
        }
    }, []);

    return {
        requests,
        setRequests,
        isLoading,
        refreshRequests,
        addRequest,
        updateRequest,
        deleteRequest
    };
};
