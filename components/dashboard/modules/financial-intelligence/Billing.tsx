import React, { useState, useRef } from 'react';
import { useData } from '../../../../context/DataContext';
import { Plus, Trash2, Edit2, Printer, FileText, CheckCircle, Search } from 'lucide-react';
import InvoiceForm from '../../forms/InvoiceForm';
import InvoicePrint from '../../billing/InvoicePrint';
import { Invoice } from '../../../../types';
import { useReactToPrint } from 'react-to-print';

const Billing: React.FC = () => {
    const { siteData, deleteInvoice, updateInvoice } = useData();
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

    const invoices = (siteData?.invoices || []).filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
    const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
    const totalPotential = invoices.filter(inv => inv.status !== 'cancelled').reduce((sum, inv) => sum + inv.total, 0);
    const collectionRate = totalPotential > 0 ? Math.round((totalRevenue / totalPotential) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-end">
                <div dir="rtl">
                    <h2 className="text-4xl font-black text-white tracking-tighter">الحالة المالية والفواتير</h2>
                    <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-widest">Financial OS & Billing Control</p>
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
                <div className="p-8 bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-[2rem]">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 text-right">إجمالي المداخيل المحصلة</div>
                    <div className="text-3xl font-black text-white tracking-tighter text-right">{totalRevenue.toLocaleString()} د.ج</div>
                </div>
                <div className="p-8 bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-[2rem]">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 text-right">فواتير قيد الانتظار</div>
                    <div className="text-3xl font-black text-amber-400 tracking-tighter text-right">{pendingAmount.toLocaleString()} د.ج</div>
                </div>
                <div className="p-8 bg-[rgba(var(--accent-indigo-rgb),0.1)] border border-[rgba(var(--accent-indigo-rgb),0.2)] backdrop-blur-md rounded-[2rem]">
                    <div className="text-[10px] text-[var(--accent-indigo)] font-black uppercase tracking-[0.2em] mb-4 text-right">معدل التحصيل النقدي</div>
                    <div className="text-3xl font-black text-[var(--accent-indigo)] tracking-tighter text-right">{collectionRate}%</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2 mb-2" dir="rtl">
                    <h3 className="text-lg font-black text-white tracking-tighter uppercase">سجل العمليات</h3>
                    <div className="text-[8px] font-black text-slate-600 tracking-[0.3em] uppercase">Transaction Ledger</div>
                </div>

                <div className="grid gap-4" dir="rtl">
                    {(siteData?.invoices || []).map((inv: Invoice) => (
                        <div key={inv.id} className="p-6 bg-slate-950/50 border border-white/5 rounded-[1.8rem] group hover:border-[rgba(var(--accent-indigo-rgb),0.3)] transition-all backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 group-hover:border-[rgba(var(--accent-indigo-rgb),0.2)] transition-all">
                                        <FileText className="text-slate-500 group-hover:text-[var(--accent-indigo)] transition-colors" size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-xl font-black text-white tracking-tighter">{inv.invoiceNumber}</h4>
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase border ${inv.status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                                {inv.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 font-bold text-xs mt-1">
                                            {siteData.clients.find(c => c.id === inv.clientId)?.name || inv.clientName || 'عميل غير معروف'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="text-right">
                                        <div className="text-white font-black text-2xl tracking-tighter">{inv.total.toLocaleString()} د.ج</div>
                                        <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-1">
                                            {inv.payments?.length > 0 ? `Paid: ${(inv.payments.reduce((s, p) => s + p.amount, 0)).toLocaleString()}` : 'Unpaid Balance'}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => togglePaymentStatus(inv)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${inv.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'hover:bg-green-500/10 text-slate-500 hover:text-green-400'}`}
                                            title={inv.status === 'paid' ? 'Mark as Pending' : 'Mark as Paid'}
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button
                                            onClick={() => handlePrint(inv)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
                                            title="طباعة"
                                        >
                                            <Printer size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(inv)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-blue-500/10 rounded-xl text-blue-400 transition-all"
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
                    {(!siteData?.invoices || siteData.invoices.length === 0) && (
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
