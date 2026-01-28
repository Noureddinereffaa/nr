import React from 'react';
import { Project, Invoice } from '../../lib/types';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, CreditCard } from 'lucide-react';
import InvoicePaymentModal from '../dashboard/modals/InvoicePaymentModal';

interface PortalProjectViewProps {
    project: Project;
    invoices: Invoice[];
    calculateProgress: (p: Project) => number;
}

const PortalProjectView: React.FC<PortalProjectViewProps> = ({ project, invoices, calculateProgress }) => {
    const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);

    const openInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Milestones */}
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Clock className="text-indigo-400" />
                    خارطة الطريق
                </h3>
                <div className="grid gap-4">
                    {(project.milestones || []).length > 0 ? (
                        project.milestones?.map((m, i) => (
                            <div key={i} className={`p-6 rounded-2xl border transition-all ${m.completed ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-slate-900 border-white/5'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.completed ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <span className={`font-bold block ${m.completed ? 'text-white' : 'text-slate-500'}`}>{m.title}</span>
                                            <span className="text-[10px] text-slate-600">{m.dueDate ? new Date(m.dueDate).toLocaleDateString('ar-EG') : 'تاريخ غير محدد'}</span>
                                        </div>
                                    </div>
                                    {m.completed && <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">مكتمل</span>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-500">لا توجد مراحل محددة لهذا المشروع بعد.</div>
                    )}
                </div>
            </div>

            {/* Billing Summary */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <CreditCard className="text-emerald-400" />
                    الشؤون المالية
                </h3>
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 space-y-6">
                    {invoices.length > 0 ? (
                        invoices.map((inv, i) => (
                            <div
                                key={i}
                                onClick={() => openInvoice(inv)}
                                className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all"
                            >
                                <div>
                                    <p className="text-white font-bold">{inv.amount?.toLocaleString()} DZD</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">#{inv.invoiceNumber}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' :
                                    inv.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    {inv.status}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-slate-500 text-sm">لا توجد فواتير ظاهرة</div>
                    )}

                    <button className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all mt-4">
                        تحميل تقرير مالي كامل
                    </button>
                </div>
            </div>

            {/* Payment Modal */}
            <InvoicePaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                invoice={selectedInvoice}
            />
        </div>
    );
};

export default PortalProjectView;
