import React, { useState, useRef, useEffect } from 'react';
import { Shield, X, Search, Bell, Circle, CloudUpload, CheckCircle2, AlertCircle, Loader2, Menu, LogOut, Contrast } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../../../context/AuthContext';
import { useUI } from '../../../context/UIContext';
import { useSystem } from '../../../context/SystemContext';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

interface DashboardHeaderProps {
    onOpenSidebar: () => void;
    isMenuOpen: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenSidebar, isMenuOpen }) => {
    const { user, signOut } = useAuth();
    const { isHighContrast, toggleHighContrast, isShieldMode, toggleShieldMode, openCommandPalette } = useUI();
    const { siteData } = useSystem() as any;
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
            const syncTasks = [
                supabase.from('site_settings').upsert({
                    id: 'main',
                    brand: siteData.brand,
                    contactInfo: siteData.contactInfo,
                    aiConfig: siteData.aiConfig,
                    features: siteData.features
                }),
                supabase.from('services').upsert(siteData.services.map((s: any) => ({ id: s.id, data: s }))),
                supabase.from('projects').upsert(siteData.projects.map((p: any) => ({ id: p.id, data: p }))),
                supabase.from('articles').upsert(siteData.articles.map((a: any) => ({ id: a.id, data: a }))),
                supabase.from('clients').upsert(siteData.clients.map((c: any) => ({ id: c.id, data: c }))),
                supabase.from('invoices').upsert(siteData.invoices.map((i: any) => ({ id: i.id, data: i })))
            ];

            const results = await Promise.all(syncTasks);
            const errors = results.filter(r => r.error);
            if (errors.length > 0) {
                setSyncStatus('error');
                setSyncError(`فشل المزامنة: ${errors[0].error?.message || 'خطأ غير معروف'}`);
                setTimeout(() => setSyncStatus('idle'), 5000);
                return;
            }

            setSyncStatus('success');
            setTimeout(() => setSyncStatus('idle'), 3000);

        } catch (err: any) {
            setSyncStatus('error');
            setSyncError(err.message || 'فشل الاتصال بالخادم');
            setTimeout(() => setSyncStatus('idle'), 5000);
        }
    };

    return (
        <div className="p-6 border-b border-white/10 flex items-center justify-between glass-morph sticky top-0 z-[var(--z-nav)] backdrop-blur-3xl shadow-xl">
            <div className="flex items-center gap-4 md:gap-8">
                <button
                    onClick={onOpenSidebar}
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
                            NR OS <span className="hidden sm:inline text-[var(--accent-indigo)]">Sovereign</span>
                        </h2>
                    </div>
                </div>

                <button
                    onClick={openCommandPalette}
                    className="hidden lg:flex items-center gap-3 bg-slate-950/50 border border-white/10 rounded-[var(--border-radius-elite)] px-4 py-2 w-96 hover:border-[var(--accent-indigo)] transition-all group text-right"
                    dir="rtl"
                >
                    <Search size={16} className="text-slate-500 group-hover:text-[var(--accent-indigo)]" />
                    <span className="text-xs text-slate-500 flex-1">ابحث عن أمر أو عميل (Ctrl + K)...</span>
                    <div className="flex items-center gap-1 text-[8px] font-black text-slate-600 border border-white/5 px-1.5 py-0.5 rounded-md">
                        <span>K</span>
                        <span>+</span>
                        <span>Ctrl</span>
                    </div>
                </button>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
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
                </div>

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/5 relative" ref={notifRef}>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                        <Circle size={8} className="fill-green-500 text-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">AI Online</span>
                    </div>

                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`text-slate-500 hover:text-white transition-colors relative ${showNotifications ? 'text-white' : ''}`}
                    >
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--accent-indigo)] rounded-full border-2 border-slate-900"></span>
                    </button>
                    {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}

                    <button
                        onClick={toggleShieldMode}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isShieldMode ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                        title={isShieldMode ? "تعطيل درع الحماية" : "تفعيل درع الحماية"}
                    >
                        <Shield size={16} />
                    </button>

                    <button
                        onClick={toggleHighContrast}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isHighContrast ? 'bg-[var(--accent-indigo)] text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                        title="التباين العالي"
                    >
                        <Contrast size={16} />
                    </button>
                </div>

                <button
                    onClick={() => signOut()}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white border border-white/10 transition-all"
                >
                    <LogOut size={20} />
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[var(--accent-indigo)] hover:text-white border border-white/10 transition-all"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
