import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, AlertCircle, CheckCircle2, Loader2, LifeBuoy } from 'lucide-react';
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
            // Treat support messages as "General Inquiry" requests for now
            await requestService.create({
                clientName: project.client_id || 'Client',
                clientEmail: 'client@portal.com',
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <LifeBuoy size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">الدعم الفني</h2>
                        <p className="text-slate-500 text-sm">هل تواجه مشكلة؟ نحن هنا للمساعدة.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={14} /> رسالتك
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            placeholder="صف المشكلة التي تواجهها..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${status === 'success'
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : status === 'success' ? (
                            <>
                                <CheckCircle2 size={20} />
                                تم الإرسال
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
                                <AlertCircle size={18} />
                                حدث خطأ. حاول مرة أخرى.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">قنوات تواصل أخرى</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-4 text-slate-400">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white">
                                📧
                            </div>
                            <span>support@nr-os.com</span>
                        </li>
                        <li className="flex items-center gap-4 text-slate-400">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white">
                                📞
                            </div>
                            <span>+213 555 000 000</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-white mb-2">ساعات العمل</h3>
                    <p className="text-slate-400 text-sm">
                        فريق الدعم متواجد من الأحد إلى الخميس<br />
                        09:00 صباحاً - 05:00 مساءً
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PortalSupport;
