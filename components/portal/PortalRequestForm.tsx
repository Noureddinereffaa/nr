import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Briefcase, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { requestService } from '../../lib/services/requestService';
import { Project } from '../../lib/types';

interface PortalRequestFormProps {
    project: Project;
    onSuccess?: () => void;
}

const PortalRequestForm: React.FC<PortalRequestFormProps> = ({ project, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        serviceTitle: '',
        message: '',
        priority: 'medium' as 'low' | 'medium' | 'high'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');

        try {
            await requestService.create({
                clientName: project.client_id || 'Client', // In a real app, fetch client name
                clientEmail: 'client@portal.com', // In a real app, fetch client email
                serviceTitle: formData.serviceTitle,
                message: formData.message,
                priority: formData.priority,
                status: 'new',
                source: 'portal',
                projectId: project.id
            } as any);

            setStatus('success');
            setFormData({ serviceTitle: '', message: '', priority: 'medium' });
            if (onSuccess) onSuccess();
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error('Request submission failed:', error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Zap size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white">طلب خدمة جديدة</h2>
                    <p className="text-slate-500 text-sm">أرسل طلبك مباشرة إلى فريق العمل</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase size={14} /> نوع الخدمة / العنوان
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.serviceTitle}
                        onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="مثال: تطوير ميزة جديدة، تصميم إضافي..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle size={14} /> الأولوية (اختياري)
                    </label>
                    <div className="flex gap-4">
                        {['low', 'medium', 'high'].map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setFormData({ ...formData, priority: p as any })}
                                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all border ${formData.priority === p
                                        ? p === 'high' ? 'bg-red-500/20 border-red-500 text-red-500'
                                            : p === 'medium' ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                                                : 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                                        : 'bg-slate-950 border-white/10 text-slate-500 hover:bg-white/5'
                                    }`}
                            >
                                {p === 'high' ? 'مستعجل' : p === 'medium' ? 'عادي' : 'منخفض'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14} /> تفاصيل الطلب
                    </label>
                    <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        placeholder="اشرح متطلباتك بالتفصيل..."
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${status === 'success'
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : status === 'success' ? (
                            <>
                                <CheckCircle2 size={20} />
                                تم الإرسال بنجاح
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                إرسال الطلب
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3 text-sm"
                            >
                                <AlertTriangle size={18} />
                                حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </div>
    );
};

export default PortalRequestForm;
