import React, { useState, useRef } from 'react';
import { useSystem } from '../../../../context/SystemContext';
import { useBusiness } from '../../../../context/BusinessContext';
import { Plus, Trash2, Edit2, Printer, FileText, CheckCircle, Search } from 'lucide-react';
import InvoiceForm from '../../forms/InvoiceForm';
import InvoicePrint from './InvoicePrint';
import { Invoice } from '../../../../lib/types';
import { useReactToPrint } from 'react-to-print';

import { useUI } from '../../../../context/UIContext';

const Billing: React.FC = () => {
    const { siteData } = useSystem();
    const { invoices, deleteInvoice, updateInvoice, clients } = useBusiness();
    const { mask } = useUI();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [printingInvoice, setPrintingInvoice] = useState<Invoice | null>(null);
    const printRef = useRef(null);

    const handlePrintRequest = useReactToPrint({
        contentRef: printRef,
        onAfterPrint: () => setPrintingInvoice(null)
    });

    const handlePrint = (invoice: Invoice) => {
        setPrintingInvoice(invoice);
        setTimeout(() => {
            handlePrintRequest();
        }, 100);
    };

    const handleEdit = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
            deleteInvoice(id);
        }
    };

    const handleAddNew = () => {
        setEditingInvoice(undefined);
        setIsFormOpen(true);
    };

    const togglePaymentStatus = async (invoice: Invoice) => {
        const nextStatus = invoice.status === 'paid' ? 'pending' : 'paid';
        await updateInvoice(invoice.id, { ...invoice, status: nextStatus });
    };

    const filteredInvoices = (invoices || []).filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalRevenue = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
    const pendingAmount = filteredInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
    const totalPotential = filteredInvoices.filter(inv => inv.status !== 'cancelled').reduce((sum, inv) => sum + inv.total, 0);
    const collectionRate = totalPotential > 0 ? Math.round((totalRevenue / totalPotential) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-end">
                <div dir="rtl">
                    <h2 className="text-4xl font-black text-white tracking-tighter">الحالة المالية والفواتير</h2>
                    <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-widest">Financial OS & Billing Control</p>
                </div>
                <div className="text-right">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">إحصاءات النظام</p>
                    <p className="text-white text-xs font-bold">إجمالي الفواتير: {invoices.length}</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-3 bg-white text-slate-950 px-8 py-3 rounded-2xl font-black transition-all hover:bg-slate-200 hover:scale-[1.02] active:scale-95 shadow-2xl"
                >
                    <Plus size={20} />
                    <span className="text-xs uppercase tracking-widest">Create Invoice</span>
                </button>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 glass-card rounded-[2rem]">
                    <div className="text-[10px] text-[var(--text-tertiary)] font-black uppercase tracking-[0.2em] mb-4 text-right">إجمالي المداخيل المحصلة</div>
                    <div className="text-3xl font-black text-[var(--text-primary)] tracking-tighter text-right">{mask(totalRevenue.toLocaleString(), 'currency')} د.ج</div>
                </div>
                <div className="p-8 glass-card rounded-[2rem]">
                    <div className="text-[10px] text-[var(--text-tertiary)] font-black uppercase tracking-[0.2em] mb-4 text-right">فواتير قيد الانتظار</div>
                    <div className="text-3xl font-black text-[var(--accent-gold)] tracking-tighter text-right">{mask(pendingAmount.toLocaleString(), 'currency')} د.ج</div>
                </div>
                <div className="p-8 glass-card rounded-[2rem] border-[var(--accent-primary)]/20">
                    <div className="text-[10px] text-[var(--accent-primary)] font-black uppercase tracking-[0.2em] mb-4 text-right">معدل التحصيل النقدي</div>
                    <div className="text-3xl font-black text-[var(--accent-primary)] tracking-tighter text-right">{collectionRate}%</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2 mb-2" dir="rtl">
                    <h3 className="text-lg font-black text-white tracking-tighter uppercase">سجل العمليات</h3>
                    <div className="text-[8px] font-black text-slate-600 tracking-[0.3em] uppercase">Transaction Ledger</div>
                </div>

                <div className="grid gap-4" dir="rtl">
                    {(filteredInvoices || []).map((inv) => (
                        <div key={inv.id} className="p-6 glass-panel rounded-[1.8rem] group border-transparent hover:border-[var(--accent-primary)]/30 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center border-white/5 group-hover:border-[var(--accent-primary)]/20 transition-all">
                                        <FileText className="text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors" size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[var(--text-primary)] font-black text-sm">{inv.clientName}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${inv.status === 'paid' ? 'bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] border border-[var(--accent-emerald)]/20' : 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20'}`}>
                                                {inv.status}
                                            </span>
                                            <span className="text-[10px] text-[var(--text-tertiary)] font-bold">{new Date(inv.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="text-right">
                                        <div className="text-[var(--text-primary)] font-black text-2xl tracking-tighter">{mask(inv.total.toLocaleString(), 'currency')} د.ج</div>
                                        <div className="text-[8px] text-[var(--text-tertiary)] font-black uppercase tracking-widest mt-1">
                                            {inv.payments?.length > 0 ? `Paid: ${mask((inv.payments.reduce((s, p) => s + p.amount, 0)).toLocaleString(), 'currency')}` : 'Unpaid Balance'}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => togglePaymentStatus(inv)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${inv.status === 'paid' ? 'bg-[var(--accent-emerald)]/20 text-[var(--accent-emerald)]' : 'hover:bg-[var(--accent-emerald)]/10 text-[var(--text-tertiary)] hover:text-[var(--accent-emerald)]'}`}
                                            title={inv.status === 'paid' ? 'Mark as Pending' : 'Mark as Paid'}
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button
                                            onClick={() => handlePrint(inv)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl text-[var(--text-tertiary)] hover:text-white transition-all"
                                            title="طباعة"
                                        >
                                            <Printer size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(inv)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-[var(--accent-primary)]/10 rounded-xl text-[var(--accent-primary)] transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(inv.id)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-red-500/10 rounded-xl text-red-400 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!invoices || invoices.length === 0) && (
                        <div className="text-slate-600 text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-slate-950/20">
                            <div className="text-sm font-black uppercase tracking-[0.3em] mb-2">No Transactions Found</div>
                            <div className="text-[10px] font-bold">بدء النشاط لإنشاء أول فاتورة نظام</div>
                        </div>
                    )}
                </div>
            </div>

            <InvoiceForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editingInvoice}
            />

            {/* Hidden Print Area */}
            <div style={{ display: 'none' }}>
                <div ref={printRef}>
                    {printingInvoice && <InvoicePrint invoice={printingInvoice} siteData={siteData} />}
                </div>
            </div>
        </div>
    );
};

export default Billing;
