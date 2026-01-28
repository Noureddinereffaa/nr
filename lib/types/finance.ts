export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Payment {
    id: string;
    date: string;
    amount: number;
    method: 'cash' | 'cib' | 'baridimob' | 'cheque' | 'transfer';
    reference?: string;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    clientId: string;
    client_id?: string;     // DB Standard
    projectId?: string;
    project_id?: string;    // DB Standard
    clientName: string;
    clientAddress?: string;
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    total: number;
    amount?: number; // Alias for total often used in UI
    status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
    payments: Payment[];
    currency: 'DZD' | 'EUR' | 'USD';
    recurring?: {
        interval: 'monthly' | 'quarterly' | 'yearly';
        nextDate: string;
    };
}

export interface Expense {
    id: string;
    title: string;
    category: 'api' | 'hosting' | 'ads' | 'contractor' | 'tools' | 'other';
    amount: number;
    currency: 'DZD' | 'EUR' | 'USD';
    date: string;
    description?: string;
    attachment?: string;
}
