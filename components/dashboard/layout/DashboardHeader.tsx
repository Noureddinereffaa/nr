import React, { useState, useRef, useEffect } from 'react';
import { Shield, X, Search, Bell, Circle, CloudUpload, CheckCircle2, AlertCircle, Loader2, Menu, LogOut, Contrast } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../../../context/AuthContext';
import { useUI } from '../../../context/UIContext';
import { useData } from '../../../context/DataContext';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

interface DashboardHeaderProps {
    onMenuToggle: () => void;
    isMenuOpen: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
    const { user, signOut } = useAuth();
    const { isHighContrast, toggleHighContrast } = useUI();
    const { siteData } = useData();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Cloud Sync State
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
    const [syncError, setSyncError] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cloud Sync Function
    const handleSyncToCloud = async () => {
        if (!isSupabaseConfigured() || !supabase) {
            setSyncStatus('error');
            setSyncError('Supabase غير مكوّن. تأكد من إضافة المتغيرات البيئية.');
            setTimeout(() => setSyncStatus('idle'), 4000);
            return;
        }

        setSyncStatus('syncing');
        setSyncError(null);

        try {
            // Sync main site data tables using JSONB 'data' column
            const syncTasks = [
                supabase.from('site_settings').upsert({
                    id: 'main',
                    brand: siteData.brand,
                    contactInfo: siteData.contactInfo,
                    aiConfig: siteData.aiConfig,
                    features: siteData.features
                }),
                supabase.from('services').upsert(siteData.services.map(s => ({ id: s.id, data: s }))),
                supabase.from('projects').upsert(siteData.projects.map(p => ({ id: p.id, data: p }))),
                supabase.from('articles').upsert(siteData.articles.map(a => ({ id: a.id, data: a }))),
                supabase.from('clients').upsert(siteData.clients.map(c => ({ id: c.id, data: c }))),
                supabase.from('invoices').upsert(siteData.invoices.map(i => ({ id: i.id, data: i })))
            ];

            const results = await Promise.all(syncTasks);

            // Check for errors
            const errors = results.filter(r => r.error);
            if (errors.length > 0) {
                console.error('Sync Errors:', errors);
                setSyncStatus('error');
                setSyncError(`فشل المزامنة: ${errors[0].error?.message || 'خطأ غير معروف'}`);
                setTimeout(() => setSyncStatus('idle'), 5000);
                return;
            }

            setSyncStatus('success');
            setTimeout(() => setSyncStatus('idle'), 3000);

        } catch (err: any) {
            console.error('Sync Failed:', err);
            setSyncStatus('error');
            setSyncError(err.message || 'فشل الاتصال بالخادم');
            setTimeout(() => setSyncStatus('idle'), 5000);
        }
    };

    return (
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50 sticky top-0 z-[100] backdrop-blur-md">
            <div className="flex items-center gap-4 md:gap-8">
                {/* Mobile Menu Trigger */}
                <button
                    onClick={onMenuToggle}
                    className="md:hidden p-2 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all"
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="flex items-center gap-4 text-right" dir="rtl">
                    <div className="hidden lg:flex w-10 h-10 bg-[var(--accent-indigo)] rounded-[var(--border-radius-elite)] items-center justify-center text-white shadow-lg">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h2 className="text-base md:text-xl font-black text-white uppercase tracking-tighter">
                            نظام <span className="text-[var(--accent-indigo)]">NR OS</span>
                        </h2>
                    </div>
                </div>

                {/* Global Command Bar */}
                <div className="hidden lg:flex items-center gap-3 bg-slate-950/50 border border-white/10 rounded-[var(--border-radius-elite)] px-4 py-2 w-96 focus-within:border-[var(--accent-indigo)] transition-all group">
                    <Search size={16} className="text-slate-500 group-focus-within:text-[var(--accent-indigo)]" />
                    <input
                        type="text"
                        placeholder="ابحث عن أمر أو عميل (Ctrl + K)..."
                        className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-600 w-full text-right"
                        dir="rtl"
                    />
                    <div className="flex items-center gap-1 text-[8px] font-black text-slate-600 border border-white/5 px-1.5 py-0.5 rounded-md">
                        <span>K</span>
                        <span>+</span>
                        <span>Ctrl</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* CLOUD SYNC BUTTON */}
                <div className="relative">
                    <button
                        onClick={handleSyncToCloud}
                        disabled={syncStatus === 'syncing'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all border ${syncStatus === 'syncing' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 cursor-wait' :
                            syncStatus === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                                syncStatus === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                                    'bg-white/5 border-white/10 text-white hover:bg-[var(--accent-indigo)] hover:border-[var(--accent-indigo)]'
                            }`}
                        title={syncError || 'نشر التعديلات للسحابة'}
                    >
                        {syncStatus === 'syncing' && <Loader2 size={16} className="animate-spin" />}
                        {syncStatus === 'success' && <CheckCircle2 size={16} />}
                        {syncStatus === 'error' && <AlertCircle size={16} />}
                        {syncStatus === 'idle' && <CloudUpload size={16} />}
                        <span className="hidden sm:inline">
                            {syncStatus === 'syncing' ? 'جاري النشر...' :
                                syncStatus === 'success' ? 'تم النشر ✓' :
                                    syncStatus === 'error' ? 'خطأ!' :
                                        'نشر للسحابة'}
                        </span>
                    </button>

                    {/* TOASTS (simplified for code space) */}
                    {syncStatus === 'error' && (
                        <div className="absolute top-full mt-2 right-0 w-80 bg-red-950/95 border border-red-500/30 rounded-xl p-4 shadow-2xl z-50 backdrop-blur-xl">
                            <p className="text-xs text-red-300/80 leading-relaxed" dir="ltr">{syncError}</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/5 relative" ref={notifRef}>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                        <Circle size={8} className="fill-green-500 text-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">AI Online</span>
                    </div>

                    {user && (
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                            <div className="w-6 h-6 rounded-full bg-[var(--accent-indigo)] flex items-center justify-center text-[10px] font-black text-white uppercase">
                                {user.email?.charAt(0)}
                            </div>
                            <span className="text-[10px] font-black text-slate-300 hidden md:block">{user.email}</span>
                        </div>
                    )}

                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`text-slate-500 hover:text-white transition-colors relative ${showNotifications ? 'text-white' : ''}`}
                    >
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--accent-indigo)] rounded-full border-2 border-slate-900"></span>
                    </button>
                    {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}

                    <button
                        onClick={toggleHighContrast}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isHighContrast ? 'bg-[var(--accent-indigo)] text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                        title="تبديل وضع التباين العالي"
                    >
                        <Contrast size={16} />
                    </button>
                </div>

                <button
                    onClick={() => signOut()}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white border border-white/10 transition-all group"
                    title="Logout"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[var(--accent-indigo)] hover:text-white border border-white/10 transition-all"
                    title="Home"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
