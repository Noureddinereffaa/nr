import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, AlertCircle, CheckCircle2, Loader2, LifeBuoy, Mail, Phone, Calendar } from 'lucide-react';
import { requestService } from '../../lib/services/requestService';
import { Project } from '../../lib/types';

interface PortalSupportProps {
    project: Project;
}

const PortalSupport: React.FC<PortalSupportProps> = ({ project }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');

        try {
            await requestService.create({
                clientName: project.client || project.clientId || 'Client',
                clientEmail: project.clientEmail || 'client@portal.com',
                serviceTitle: `دعم: ${project.title}`,
                message: message,
                priority: 'medium',
                status: 'new',
                source: 'portal_support',
                projectId: project.id
            } as any);

            setStatus('success');
            setMessage('');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error('Support message failed:', error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start" dir="rtl">
            {/* Contact Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-3xl"
            >
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-indigo-600/15 transition-all duration-1000"></div>

                <div className="relative z-10 flex flex-col gap-10">
                    <div className="flex items-center gap-6 justify-end">
                        <div className="text-right">
                            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">مركز الدعم والمساعدة</h2>
                            <p className="text-slate-500 font-bold mt-1">نحن هنا للمساعدة في حل أي مشكلة تواجهك</p>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <LifeBuoy size={32} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4 text-right">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 justify-end">
                                كيف يمكننا مساعدتك اليوم؟ <MessageSquare size={14} className="text-indigo-400" />
                            </label>
                            <textarea
                                required
                                rows={8}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-[2rem] px-8 py-6 text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none text-lg leading-relaxed placeholder:text-slate-800 placeholder:font-normal"
                                placeholder="صف المشكلة أو الاستفسار الذي يدور في ذهنك بالتفصيل..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-6 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl relative overflow-hidden group/btn ${status === 'success'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-white hover:bg-slate-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            {isLoading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : status === 'success' ? (
                                <>
                                    تم إرسال رسالتك بنجاح
                                    <CheckCircle2 size={24} className="animate-bounce" />
                                </>
                            ) : (
                                <>
                                    إرسال الطلب الآن
                                    <Send size={24} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-500" />
                                </>
                            )}
                        </button>

                        <AnimatePresence>
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-between gap-3 text-sm font-bold"
                                >
                                    <span>حدث خطأ. يرجى المحاولة مرة أخرى لاحقاً.</span>
                                    <AlertCircle size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </motion.div>

            {/* Info Cards */}
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card border-white/5 rounded-[2.5rem] p-10 bg-gradient-to-br from-indigo-900/10 to-purple-900/10 hover:from-indigo-900/20 hover:to-purple-900/20 transition-all duration-700 shadow-2xl group"
                >
                    <h3 className="text-2xl font-black text-white mb-8 text-right">قنوات التواصل المباشرة</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 justify-end group/item">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">البريد الإلكتروني</p>
                                <p className="text-lg font-black text-white group-hover/item:text-indigo-400 transition-colors">support@nr-os.com</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-300">
                                <Mail size={22} />
                            </div>
                        </div>
                        <div className="flex items-center gap-6 justify-end group/item">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">رقم الهاتف / واتساب</p>
                                <p className="text-lg font-black text-white group-hover/item:text-indigo-400 transition-colors" dir="ltr">+213 555 000 000</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-300">
                                <Phone size={22} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card border-white/5 rounded-[2.5rem] p-10 shadow-2xl"
                >
                    <div className="flex items-start gap-6 justify-end">
                        <div className="text-right">
                            <h3 className="text-xl font-black text-white mb-3 tracking-tight">ساعات العمل الرسمية</h3>
                            <p className="text-slate-400 font-bold leading-relaxed">
                                فريق الدعم الفني متواجد لمساعدتك<br />
                                <span className="text-white">من الأحد إلى الخميس</span><br />
                                <span className="text-indigo-400">09:00 صباحاً - 05:00 مساءً</span>
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600">
                            <Calendar size={22} />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 border border-white/5 bg-slate-950/20 rounded-[2rem] text-center"
                >
                    <p className="text-slate-500 text-xs font-bold leading-relaxed">
                        نحن نسعى دائماً لتقديم أفضل تجربة دعم ممكنة. سيتم التعامل مع طلبات الدعم حسب الأولوية وتاريخ الاستلام.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PortalSupport;
