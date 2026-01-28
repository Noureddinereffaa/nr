import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, User, Type, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { sendEmailNotification } from '../../../../lib/email-notifications';

const EmailComposer: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        to: '',
        clientName: '', // For the Title "Hello [Name]"
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');

        try {
            const success = await sendEmailNotification({
                to: formData.to,
                subject: formData.subject,
                title: `مرحباً ${formData.clientName}`,
                message: formData.message,
                actionText: 'زيارة المنصة',
                actionUrl: window.location.origin
            });

            if (success) {
                setStatus('success');
                setFormData({ to: '', clientName: '', subject: '', message: '' });
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Email send failed:', error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Mail size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white">رسالة جديدة</h2>
                    <p className="text-slate-500 text-sm">ارسل إشعارات مخصصة للعملاء مباشرة من هنا</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Mail size={14} /> البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.to}
                            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="client@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} /> اسم العميل
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="محمد أحمد"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} /> الموضوع
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="تحديث هام بخصوص مشروعك..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14} /> نص الرسالة
                    </label>
                    <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        placeholder="اكتب رسالتك هنا..."
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
                                إرسال الرسالة
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
                                فشل الإرسال. يرجى التحقق من إعدادات API.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </div>
    );
};

export default EmailComposer;
