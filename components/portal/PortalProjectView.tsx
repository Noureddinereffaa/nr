import React from 'react';
import { Project, Invoice } from '../../lib/types';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, CreditCard, ChevronRight, FileText, Zap } from 'lucide-react';
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

    const milestones = project.milestones || [];
    const completedMilestones = milestones.filter(m => m.completed).length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10" dir="rtl">
            {/* Milestones */}
            <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-white flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
                            <Clock className="text-indigo-400" size={24} />
                        </div>
                        خارطة الطريق
                    </h3>
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {completedMilestones} / {milestones.length} مكتمل
                    </div>
                </div>

                <div className="grid gap-6">
                    {milestones.length > 0 ? (
                        milestones.map((m, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className={`p-8 glass-card border-white/5 rounded-[2rem] transition-all duration-500 group relative overflow-hidden ${m.completed ? 'bg-indigo-600/5 border-indigo-500/20' : ''}`}
                            >
                                {m.completed && (
                                    <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${m.completed ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-slate-700'}`}>
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <span className={`text-xl font-black block tracking-tight ${m.completed ? 'text-white' : 'text-slate-400 group-hover:text-slate-300 transition-colors'}`}>{m.title}</span>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">التاريخ المتوقع:</span>
                                                <span className="text-[11px] font-mono text-indigo-400/80">{m.dueDate ? new Date(m.dueDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }) : 'تاريخ غير محدد'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {m.completed ? (
                                        <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                            مكتمل
                                        </div>
                                    ) : (
                                        <ChevronRight size={20} className="text-slate-800 rotate-180 group-hover:text-slate-600 transition-colors" />
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-24 glass-card border-dashed border-white/10 rounded-[3rem]">
                            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-6">
                                <Clock size={32} className="text-slate-700" />
                            </div>
                            <p className="text-slate-500 font-black text-lg">لا توجد مراحل محددة لهذا المشروع بعد</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Billing Summary */}
            <div className="space-y-8">
                <h3 className="text-2xl font-black text-white flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center">
                        <CreditCard className="text-emerald-400" size={24} />
                    </div>
                    الشؤون المالية
                </h3>

                <div className="glass-card border-white/5 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-600/5 blur-3xl rounded-full pointer-events-none"></div>

                    <div className="space-y-6 relative z-10">
                        {invoices.length > 0 ? (
                            invoices.map((inv, i) => (
                                <button
                                    key={i}
                                    onClick={() => openInvoice(inv)}
                                    className="w-full flex items-center justify-between group/inv cursor-pointer hover:bg-white/5 p-4 rounded-[1.5rem] border border-transparent hover:border-white/5 transition-all duration-300"
                                >
                                    <div className="text-right">
                                        <p className="text-xl font-black text-white group-hover/inv:text-emerald-400 transition-colors tracking-tighter">{inv.amount?.toLocaleString()} DZD</p>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">فاتورة #{inv.invoiceNumber}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            inv.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-lg shadow-amber-500/10' :
                                                'bg-slate-800/10 text-slate-500 border-white/5'
                                        }`}>
                                        {inv.status === 'paid' ? 'مكتمل' : inv.status === 'pending' ? 'قيد السداد' : inv.status}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <FileText size={40} className="mx-auto mb-4 text-slate-800" />
                                <p className="text-slate-500 font-bold">لا توجد فواتير ظاهرة</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-8 border-t border-white/5 relative z-10">
                        <button className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95">
                            <Zap size={16} />
                            تحميل التقرير المالي
                        </button>
                    </div>
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
