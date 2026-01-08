import React, { createContext, useContext, useState, useEffect } from 'react';
import { SERVICES } from '../constants';
import { Client, Project, Invoice, Expense, Service, ServiceRequest } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Logger from '../lib/logger';

interface BusinessContextType {
    clients: Client[];
    projects: Project[];
    invoices: Invoice[];
    expenses: Expense[];
    services: Service[];
    isLoading: boolean;
    addClient: (client: Partial<Client>) => Promise<void>;
    updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
    addProject: (project: Partial<Project>) => Promise<void>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    addInvoice: (invoice: Partial<Invoice>) => Promise<void>;
    updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;
    addExpense: (expense: Omit<Expense, 'id' | 'date'>) => Promise<void>;
    updateExpense: (id: string, data: Partial<Expense>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    addService: (service: Partial<Service>) => Promise<void>;
    updateService: (id: string, updates: Partial<Service>) => Promise<void>;
    deleteService: (id: string) => Promise<void>;
    serviceRequests: ServiceRequest[];
    updateRequest: (id: string, updates: Partial<ServiceRequest>) => Promise<void>;
    deleteRequest: (id: string) => Promise<void>;
    budgets: any[];
    updateBudget: (id: string, updates: any) => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [services, setServices] = useState<Service[]>(SERVICES);
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
    const [budgets, setBudgets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBusinessData = async () => {
            if (!isSupabaseConfigured() || !supabase) {
                // Mock data or development fallback
                setBudgets([
                    { id: '1', category: 'Marketing', spent: 12000, limit: 50000, currency: 'DZD' },
                    { id: '2', category: 'Operations', spent: 45000, limit: 100000, currency: 'DZD' }
                ]);
                setIsLoading(false);
                return;
            }

            try {
                const [clientsRes, projectsRes, invoicesRes, expensesRes, servicesRes] = await Promise.all([
                    supabase.from('clients').select('*'),
                    supabase.from('projects').select('*'),
                    supabase.from('invoices').select('*'),
                    supabase.from('expenses').select('*'),
                    supabase.from('services').select('*')
                ]);

                if (clientsRes.data) setClients(clientsRes.data.map((r: any) => ({ ...r, ...(r.data || {}) })));
                if (projectsRes.data) setProjects(projectsRes.data.map((r: any) => ({ ...r, ...(r.data || {}) })));
                if (invoicesRes.data) setInvoices(invoicesRes.data.map((r: any) => ({ ...r, ...(r.data || {}) })));
                if (expensesRes.data) setExpenses(expensesRes.data.map((r: any) => ({ ...r, ...(r.data || {}) })));
                if (servicesRes.data && servicesRes.data.length > 0) setServices(servicesRes.data.map((r: any) => ({ ...r, ...(r.data || {}) })));

                const requestsRes = await supabase.from('service_requests').select('*');
                if (requestsRes.data) setServiceRequests(requestsRes.data.map((r: any) => ({ ...r, ...(r.data || {}) })));
            } catch (error) {
                Logger.error("Business Sync Error", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusinessData();
    }, []);

    const addClient = async (client: Partial<Client>) => {
        const newClient = { ...client, id: 'c-' + Date.now() } as Client;
        setClients(prev => [...prev, newClient]);
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('clients').insert([{ id: newClient.id, data: newClient }]);
        }
    };

    const updateClient = async (id: string, updates: Partial<Client>) => {
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
        if (isSupabaseConfigured() && supabase) {
            const current = clients.find(c => c.id === id);
            await supabase.from('clients').update({ data: { ...current, ...updates } }).eq('id', id);
        }
    };

    const deleteClient = async (id: string) => {
        setClients(prev => prev.filter(c => c.id !== id));
        if (isSupabaseConfigured() && supabase) await supabase.from('clients').delete().eq('id', id);
    };

    // ... Project, Invoice, Expense implementations following same pattern ...
    const addProject = async (project: Partial<Project>) => {
        const newProject = { ...project, id: 'p-' + Date.now() } as Project;
        setProjects(prev => [...prev, newProject]);
        if (isSupabaseConfigured() && supabase) await supabase.from('projects').insert([{ id: newProject.id, data: newProject }]);
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        if (isSupabaseConfigured() && supabase) {
            const current = projects.find(p => p.id === id);
            await supabase.from('projects').update({ data: { ...current, ...updates } }).eq('id', id);
        }
    };

    const deleteProject = async (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        if (isSupabaseConfigured() && supabase) await supabase.from('projects').delete().eq('id', id);
    };

    const addInvoice = async (invoice: Partial<Invoice>) => {
        const newInvoice = { ...invoice, id: 'inv-' + Date.now() } as Invoice;
        setInvoices(prev => [...prev, newInvoice]);
        if (isSupabaseConfigured() && supabase) await supabase.from('invoices').insert([{ id: newInvoice.id, data: newInvoice }]);
    };

    const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
        setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
        if (isSupabaseConfigured() && supabase) {
            const current = invoices.find(i => i.id === id);
            await supabase.from('invoices').update({ data: { ...current, ...updates } }).eq('id', id);
        }
    };

    const deleteInvoice = async (id: string) => {
        setInvoices(prev => prev.filter(i => i.id !== id));
        if (isSupabaseConfigured() && supabase) await supabase.from('invoices').delete().eq('id', id);
    };

    const addExpense = async (expense: Omit<Expense, 'id' | 'date'>) => {
        const newExpense = { ...expense, id: 'exp-' + Date.now(), date: new Date().toISOString() } as Expense;
        setExpenses(prev => [newExpense, ...prev]);
        if (isSupabaseConfigured() && supabase) await supabase.from('expenses').insert([{ id: newExpense.id, data: newExpense }]);
    };

    const updateExpense = async (id: string, data: Partial<Expense>) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
        if (isSupabaseConfigured() && supabase) {
            const current = expenses.find(e => e.id === id);
            await supabase.from('expenses').update({ data: { ...current, ...data } }).eq('id', id);
        }
    };

    const deleteExpense = async (id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
        if (isSupabaseConfigured() && supabase) await supabase.from('expenses').delete().eq('id', id);
    };

    const addService = async (service: Partial<Service>) => {
        const newService = { ...service, id: 's-' + Date.now() } as Service;
        setServices(prev => [...prev, newService]);
        if (isSupabaseConfigured() && supabase) await supabase.from('services').insert([{ id: newService.id, data: newService }]);
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

    const updateRequest = async (id: string, updates: Partial<ServiceRequest>) => {
        setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
        if (isSupabaseConfigured() && supabase) {
            const current = serviceRequests.find(r => r.id === id);
            await supabase.from('service_requests').update({ data: { ...current, ...updates } }).eq('id', id);
        }
    };

    const deleteRequest = async (id: string) => {
        setServiceRequests(prev => prev.filter(r => r.id !== id));
        if (isSupabaseConfigured() && supabase) await supabase.from('service_requests').delete().eq('id', id);
    };

    const updateBudget = async (id: string, updates: any) => {
        setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    return (
        <BusinessContext.Provider value={{
            clients,
            projects,
            invoices,
            expenses,
            services,
            isLoading,
            addClient,
            updateClient,
            deleteClient,
            addProject,
            updateProject,
            deleteProject,
            addInvoice,
            updateInvoice,
            deleteInvoice,
            addExpense,
            updateExpense,
            deleteExpense,
            addService,
            updateService,
            deleteService,
            serviceRequests,
            updateRequest,
            deleteRequest,
            budgets,
            updateBudget
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
