import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, Building2, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { Invoice } from '../../../lib/types';

interface InvoicePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
}

const InvoicePaymentModal: React.FC<InvoicePaymentModalProps> = ({ isOpen, onClose, invoice }) => {
    if (!invoice) return null;

    const handlePayment = () => {
        // In a real integration, this would redirect to Stripe Checkout
        const paymentLink = `https://buy.stripe.com/test_${invoice.id}`; // Simulation
        window.open(paymentLink, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    >
                        <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                        <Receipt size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">تفاصيل الفاتورة</h3>
                                        <p className="text-xs text-slate-400 font-mono">#{invoice.invoiceNumber}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                                    <span className="text-slate-400 text-sm">المبلغ الإجمالي</span>
                                    <span className="text-2xl font-black text-white font-mono">
                                        {(invoice.amount || invoice.total)?.toLocaleString()} <span className="text-sm text-indigo-400">DZD</span>
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <Building2 size={16} className="text-slate-500" />
                                        <span>مشروع: {invoice.projectId}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <Calendar size={16} className="text-slate-500" />
                                        <span>تاريخ الاستحقاق: {invoice.dueDate || 'Upon Receipt'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${invoice.status === 'paid' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                            <div className={`w-2 h-2 rounded-full ${invoice.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        </div>
                                        <span className="capitalize">{invoice.status}</span>
                                    </div>
                                </div>

                                {/* Items List (Mock if empty) */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">البنود</h4>
                                    {(invoice.items || [{ description: 'خدمات تطوير برمجيات', total: invoice.amount || invoice.total }]).map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                                            <span className="text-slate-300">{item.description}</span>
                                            <span className="text-white font-mono">{(item.total || 0).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer / Payment Action */}
                            <div className="p-6 border-t border-white/5 bg-slate-900/50">
                                {invoice.status !== 'paid' ? (
                                    <button
                                        onClick={handlePayment}
                                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 group"
                                    >
                                        <CreditCard size={18} className="group-hover:translate-x-1 transition-transform" />
                                        الدفع الآمن عبر Stripe
                                        <span className="text-emerald-200 text-xs font-normal">(قريباً)</span>
                                    </button>
                                ) : (
                                    <div className="w-full py-4 bg-slate-800 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default">
                                        <ShieldCheck size={18} className="text-emerald-500" />
                                        تم دفع هذه الفاتورة
                                    </div>
                                )}
                                <p className="text-center text-[10px] text-slate-600 mt-4">
                                    يتم معالجة المدفوعات بشكل آمن ومشفر. لا نقوم بتخزين بيانات بطاقتك.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default InvoicePaymentModal;
