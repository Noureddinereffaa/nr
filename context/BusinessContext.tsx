import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SERVICES } from '../constants';
import { Client, Project, Invoice, Expense, Service, ServiceRequest } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Logger from '../lib/logger';

// Hooks
import { useClients } from '../lib/hooks/useClients';
import { useProjects } from '../lib/hooks/useProjects';
import { useInvoices } from '../lib/hooks/useInvoices';
import { useExpenses } from '../lib/hooks/useExpenses';
import { useRequests } from '../lib/hooks/useRequests';

interface BusinessContextType {
    clients: Client[];
    projects: Project[];
    invoices: Invoice[];
    expenses: Expense[];
    services: Service[];
    serviceRequests: ServiceRequest[];
    budgets: any[];
    isLoading: boolean;

    // Client Methods
    addClient: (client: Partial<Client>) => Promise<any>;
    updateClient: (id: string, updates: Partial<Client>) => Promise<any>;
    deleteClient: (id: string) => Promise<void>;

    // Project Methods
    addProject: (project: Partial<Project>) => Promise<any>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<any>;
    deleteProject: (id: string) => Promise<void>;

    // Invoice Methods
    addInvoice: (invoice: Partial<Invoice>) => Promise<any>;
    updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<any>;
    deleteInvoice: (id: string) => Promise<void>;

    // Expense Methods
    addExpense: (expense: Omit<Expense, 'id' | 'date'>) => Promise<any>;
    updateExpense: (id: string, data: Partial<Expense>) => Promise<any>;
    deleteExpense: (id: string) => Promise<void>;

    // Request Methods
    addRequest: (request: Omit<ServiceRequest, 'id' | 'date'>) => Promise<any>;
    updateRequest: (id: string, updates: Partial<ServiceRequest>) => Promise<any>;
    deleteRequest: (id: string) => Promise<void>;

    // Service Methods
    addService: (service: Partial<Service>) => Promise<void>;
    updateService: (id: string, updates: Partial<Service>) => Promise<void>;
    deleteService: (id: string) => Promise<void>;

    // Budget Methods
    updateBudget: (id: string, updates: any) => Promise<void>;

    // Global Sync
    refreshBusiness: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Integrate Hooks
    const clientState = useClients();
    const projectState = useProjects();
    const invoiceState = useInvoices();
    const expenseState = useExpenses();
    const requestState = useRequests();

    // Additional States
    const [services, setServices] = useState<Service[]>(SERVICES);
    const [budgets, setBudgets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Data Fetch
    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Refresh all hook states
            await Promise.all([
                clientState.refreshClients(),
                projectState.refreshProjects(),
                invoiceState.refreshInvoices(),
            ]);

            if (isSupabaseConfigured() && supabase) {
                const [exp, req, srv] = await Promise.all([
                    expenseState.refreshExpenses(),
                    requestState.refreshRequests(),
                    supabase.from('services').select('*')
                ]);

                if (srv.data && srv.data.length > 0) {
                    setServices(srv.data.map((r: any) => ({ ...r, ...(r.data || {}) })));
                }
            } else {
                setBudgets([
                    { id: '1', category: 'Marketing', spent: 12000, limit: 50000, currency: 'DZD' },
                    { id: '2', category: 'Operations', spent: 45000, limit: 100000, currency: 'DZD' }
                ]);
            }
        } catch (error) {
            Logger.error("Business Initialization Error", error);
        } finally {
            setIsLoading(false);
        }
    }, [clientState, projectState, invoiceState, expenseState, requestState]);

    useEffect(() => {
        fetchAllData();

        if (isSupabaseConfigured() && supabase) {
            const tables = ['clients', 'projects', 'invoices', 'expenses', 'service_requests', 'services'];
            const channels = tables.map(table => {
                return supabase
                    .channel(`public:${table}`)
                    .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
                        fetchAllData();
                    })
                    .subscribe();
            });

            return () => {
                channels.forEach(channel => supabase.removeChannel(channel));
            };
        }
    }, []);

    const refreshBusiness = async () => {
        await fetchAllData();
    };

    // Service Management (Keeping here for now as it's small)
    const addService = async (service: Partial<Service>) => {
        const id = 's-' + Date.now();
        const newService = { ...service, id } as Service;
        setServices(prev => [...prev, newService]);
        if (isSupabaseConfigured() && supabase) await supabase.from('services').insert([{ id, data: newService }]);
    };

    const updateService = async (id: string, updates: Partial<Service>) => {
        setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
        if (isSupabaseConfigured() && supabase) {
            const current = services.find(s => s.id === id);
            await supabase.from('services').update({ data: { ...current, ...updates } }).eq('id', id);
        }
    };

    const deleteService = async (id: string) => {
        setServices(prev => prev.filter(s => s.id !== id));
        if (isSupabaseConfigured() && supabase) await supabase.from('services').delete().eq('id', id);
    };

    const updateBudget = async (id: string, updates: any) => {
        setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    return (
        <BusinessContext.Provider value={{
            clients: clientState.clients,
            projects: projectState.projects,
            invoices: invoiceState.invoices,
            expenses: expenseState.expenses,
            serviceRequests: requestState.requests,
            services,
            budgets,
            isLoading: isLoading || clientState.isLoading || projectState.isLoading || invoiceState.isLoading,

            addClient: clientState.addClient,
            updateClient: clientState.updateClient,
            deleteClient: clientState.deleteClient,

            addProject: projectState.addProject,
            updateProject: projectState.updateProject,
            deleteProject: projectState.deleteProject,

            addInvoice: invoiceState.addInvoice,
            updateInvoice: invoiceState.updateInvoice,
            deleteInvoice: invoiceState.deleteInvoice,

            addExpense: expenseState.addExpense,
            updateExpense: expenseState.updateExpense,
            deleteExpense: expenseState.deleteExpense,

            addRequest: requestState.addRequest,
            updateRequest: requestState.updateRequest,
            deleteRequest: requestState.deleteRequest,

            addService,
            updateService,
            deleteService,

            updateBudget,
            refreshBusiness
        }}>
            {children}
        </BusinessContext.Provider>
    );
};

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    if (!context) throw new Error('useBusiness must be used within a BusinessProvider');
    return context;
};
