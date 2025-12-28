import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Mail, Lock, LogIn, Loader2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useUI } from '../../../context/UIContext';

const LoginModal: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useUI();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            addToast('Supabase not configured', 'error');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            addToast('Welcome back, Noureddine', 'success');
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 backdrop-blur-2xl bg-slate-950/80">
            <div className="bg-slate-900 border border-white/10 rounded-[3.5rem] w-full max-w-xl p-12 relative animate-in zoom-in duration-500 shadow-[0_50px_100px_rgba(var(--accent-indigo-rgb),0.2)] overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(var(--accent-indigo-rgb),0.1)] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[rgba(var(--accent-indigo-rgb),0.2)] transition-all"></div>

                <div className="relative z-10 text-center mb-12" dir="rtl">
                    <div className="w-16 h-16 bg-[var(--accent-indigo)] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-[rgba(var(--accent-indigo-rgb),0.4)] mx-auto mb-6 transform hover:rotate-12 transition-transform">
                        <Zap className="fill-current" size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">الوصول <span className="text-[var(--accent-indigo)]">للنظام السيادي</span></h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">NR-OS Security Gateway</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10" dir="rtl">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-4 flex items-center gap-2">
                            <Mail size={12} className="text-[var(--accent-indigo)]" />
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-950 border border-white/5 rounded-[var(--border-radius-elite)] p-5 text-white font-bold focus:border-[rgba(var(--accent-indigo-rgb),0.5)] outline-none transition-all placeholder:text-slate-800"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-4 flex items-center gap-2">
                            <Lock size={12} className="text-[var(--accent-indigo)]" />
                            كلمة المرور
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-950 border border-white/5 rounded-[var(--border-radius-elite)] p-5 text-white font-bold focus:border-[rgba(var(--accent-indigo-rgb),0.5)] outline-none transition-all placeholder:text-slate-800"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-[var(--accent-indigo)] hover:opacity-90 text-white py-6 rounded-[var(--border-radius-elite)] font-black text-xl shadow-2xl shadow-[rgba(var(--accent-indigo-rgb),0.4)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <span>دخول آمن</span>
                                <ShieldCheck size={24} className="group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 font-black uppercase mt-8">
                        <Sparkles size={12} className="text-[var(--accent-indigo)]" />
                        <span>نظام إدارة رقمي مشفر</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
