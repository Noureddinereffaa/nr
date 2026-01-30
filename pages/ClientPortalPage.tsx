import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Link as LinkIcon, Search, AlertTriangle, LayoutDashboard, Zap, LifeBuoy, FileText, Clock, ArrowLeft, Paperclip, Bell, Loader2, MessageCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useUI } from '../context/UIContext';
import { projectService } from '../lib/services/projectService';
import { invoiceService } from '../lib/services/invoiceService';
import { requestService } from '../lib/services/requestService';
import { Project, Invoice, ServiceRequest } from '../lib/types';
import PortalProjectView from '../components/portal/PortalProjectView';
import PortalRequestForm from '../components/portal/PortalRequestForm';
import PortalSupport from '../components/portal/PortalSupport';
import PortalRequestTracking from '../components/portal/PortalRequestTracking';
import ErrorBoundary from '../components/shared/ErrorBoundary';

const ClientPortalPage: React.FC = () => {
    const [projectCode, setProjectCode] = useState('');
    const [project, setProject] = useState<Project | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFound, setIsFound] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'code' | 'email'>('code');
    const [email, setEmail] = useState('');
    const [foundProjects, setFoundProjects] = useState<Project[]>([]);
    const [viewMode, setViewMode] = useState<'account' | 'project-detail'>('account');

    const { addToast } = useUI();

    // Tab State
    const [activeTab, setActiveTab] = useState<'overview' | 'request' | 'my-requests' | 'support'>('overview');

    // Handle session persistence on mount
    useEffect(() => {
        const savedCode = localStorage.getItem('nr_portal_code');
        const savedEmail = localStorage.getItem('nr_portal_email');

        if (savedCode) {
            setProjectCode(savedCode);
            handleSearch(savedCode);
        } else if (savedEmail) {
            setEmail(savedEmail);
            setLoginMethod('email');
            handleEmailLookup(savedEmail);
        }
    }, []);

    const handleSearch = async (codeToUse?: string) => {
        const code = codeToUse || projectCode;
        if (!code.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const foundProject = await projectService.getByCode(code.trim());

            if (foundProject) {
                setProject(foundProject);
                // Store for persistence
                localStorage.setItem('nr_portal_code', code.trim());
                localStorage.removeItem('nr_portal_email'); // Only one persistence mode at a time

                // Fetch related invoices
                const foundInvoices = await invoiceService.getByProjectId(foundProject.id);
                setInvoices(foundInvoices);
                setIsFound(true);
                setViewMode('project-detail');
            } else {
                setError('لم يتم العثور على مشروع بهذا الكود. يرجى التأكد من البيانات.');
                if (codeToUse) {
                    // If auto-login failed, clear it
                    localStorage.removeItem('nr_portal_code');
                }
            }
        } catch (err) {
            console.error(err);
            setError('حدث خطأ أثناء الاتصال بالنظام. يرجى المحاولة لاحقاً.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailLookup = async (emailToUse?: string) => {
        const emailValue = emailToUse || email;
        if (!emailValue.trim() || !emailValue.includes('@')) {
            setError('يرجى إدخال بريد إلكتروني صحيح.');
            return;
        }

        setIsLoading(true);
        setError('');
        setFoundProjects([]);

        try {
            const projects = await projectService.getByEmail(emailValue.trim().toLowerCase());
            const userRequests = await requestService.getRequestsByClient(emailValue.trim().toLowerCase());

            if (projects.length === 0 && userRequests.length === 0) {
                setError('لم نجد أي طلبات أو مشاريع مرتبطة بهذا البريد الإلكتروني.');
                if (emailToUse) {
                    localStorage.removeItem('nr_portal_email');
                }
            } else {
                setFoundProjects(projects);
                setRequests(userRequests);
                setIsFound(true);
                setViewMode('account');

                // Store for persistence
                localStorage.setItem('nr_portal_email', emailValue.trim().toLowerCase());
                localStorage.removeItem('nr_portal_code');
            }
        } catch (err) {
            console.error(err);
            setError('حدث خطأ أثناء البحث. يرجى المحاولة لاحقاً.');
        } finally {
            setIsLoading(false);
        }
    };

    const selectProject = async (proj: Project) => {
        setIsLoading(true);
        try {
            setProject(proj);
            const foundInvoices = await invoiceService.getByProjectId(proj.id);
            setInvoices(foundInvoices);
            setViewMode('project-detail');
            setActiveTab('overview');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('nr_portal_code');
        localStorage.removeItem('nr_portal_email');
        setProject(null);
        setInvoices([]);
        setRequests([]);
        setFoundProjects([]);
        setIsFound(false);
        setProjectCode('');
        setEmail('');
        setError('');
    };

    // Fetch service requests when project is found
    const fetchRequests = async () => {
        if (!project) return;
        try {
            const allRequests = await requestService.getAll();
            const projectRequests = allRequests.filter(r => r.projectId === project.id);
            setRequests(projectRequests);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        }
    };

    useEffect(() => {
        if (project) {
            fetchRequests();
        }
    }, [project]);

    // Setup Real-time subscription
    useEffect(() => {
        if (!project || !isSupabaseConfigured() || !supabase) return;

        const channel = supabase
            .channel(`requests-realtime-${project.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'service_requests',
                    filter: `project_id=eq.${project.id}`
                },
                async (payload: any) => {
                    console.log('Real-time update received:', payload);

                    // Specific toast for status change
                    if (payload.event === 'UPDATE') {
                        const oldStatus = payload.old?.status;
                        const newStatus = payload.new?.status;

                        if (newStatus && oldStatus !== newStatus) {
                            addToast(`تم تحديث حالة طلبك إلى: ${newStatus}`, 'info');
                        }
                    } else if (payload.event === 'INSERT') {
                        addToast('تم استلام طلب جديد بنجاح', 'success');
                    }

                    // Refresh logic
                    fetchRequests();
                }
            )
            .subscribe((status) => {
                console.log(`Supabase real-time status: ${status}`);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [project, supabase]);

    const calculateProgress = (project: Project) => {
        if (!project.milestones || project.milestones.length === 0) return 0;
        const completed = project.milestones.filter(m => m.completed).length;
        return Math.round((completed / project.milestones.length) * 100);
    };

    return (
        <Layout>
            <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-950 relative overflow-hidden">
                {/* Premium Background Elements */}
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

                <div className="container mx-auto max-w-7xl relative z-10 transition-all duration-500">
                    {!isFound ? (
                        <div className="max-w-2xl mx-auto text-center space-y-12 py-20">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[11px] font-black uppercase tracking-[0.4em] mb-4">
                                    Secure Access
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                                    بوابة <span className="gradient-text">العملاء</span>
                                </h1>
                                <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                                    مرحباً بك في مركز القيادة الرقمي الخاص بك. يرجى تسجيل الدخول للوصول إلى مشاريعك وطلباتك.
                                </p>
                            </motion.div>

                            <div className="flex justify-center gap-4 mb-8 p-1 bg-white/5 border border-white/10 rounded-full w-fit mx-auto backdrop-blur-md">
                                <button
                                    onClick={() => { setLoginMethod('code'); setError(''); }}
                                    className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 ${loginMethod === 'code' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    كود المشروع
                                </button>
                                <button
                                    onClick={() => { setLoginMethod('email'); setError(''); }}
                                    className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 ${loginMethod === 'email' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    البريد الإلكتروني
                                </button>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative group max-w-xl mx-auto"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                <div className="relative flex items-center bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 gap-3 shadow-3xl">
                                    {loginMethod === 'code' ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="كود المشروع (مثال: p-123456)"
                                                value={projectCode}
                                                onChange={(e) => setProjectCode(e.target.value)}
                                                className="flex-1 bg-transparent border-none text-white px-8 py-5 outline-none font-mono text-right text-lg"
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                                aria-label="كود المشروع"
                                            />
                                            <button
                                                onClick={() => handleSearch()}
                                                disabled={isLoading}
                                                className="bg-indigo-600 text-white px-10 py-5 rounded-[1.8rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                                            >
                                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                                                دخول
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                type="email"
                                                placeholder="example@mail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="flex-1 bg-transparent border-none text-white px-8 py-5 outline-none text-right font-medium text-lg"
                                                onKeyDown={(e) => e.key === 'Enter' && handleEmailLookup()}
                                                aria-label="البريد الإلكتروني"
                                            />
                                            <button
                                                onClick={() => handleEmailLookup()}
                                                disabled={isLoading}
                                                className="bg-indigo-600 text-white px-10 py-5 rounded-[1.8rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                                            >
                                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                                                بحث
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>

                            {foundProjects.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="max-w-xl mx-auto glass-card p-10 text-right space-y-8 rounded-[3rem]"
                                >
                                    <h3 className="text-2xl font-black text-white flex items-center gap-4 justify-end">
                                        اختر المشروع المرجو متابعته <Briefcase className="text-indigo-400" />
                                    </h3>
                                    <div className="grid gap-4">
                                        {foundProjects.map(proj => (
                                            <button
                                                key={proj.id}
                                                onClick={() => selectProject(proj)}
                                                className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-500 group relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="flex items-center gap-5 relative z-10">
                                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                                                        <Briefcase size={24} />
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{proj.title}</p>
                                                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">ID: {proj.id.substring(0, 8)}...</p>
                                                    </div>
                                                </div>
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border relative z-10 ${proj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                    }`}>
                                                    {proj.status}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="max-w-xl mx-auto bg-red-500/10 text-red-400 px-6 py-4 rounded-2xl border border-red-500/20 flex items-center justify-center gap-3 font-bold"
                                >
                                    <AlertTriangle size={20} />
                                    {error}
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-16"
                            dir="rtl"
                        >
                            <ErrorBoundary>
                                {/* Account Dashboard View */}
                                {viewMode === 'account' && (
                                    <div className="space-y-16">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-12 text-right">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-indigo-400 justify-start">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                                                        <LayoutDashboard size={20} />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">مركز القيادة الموحد</span>
                                                </div>
                                                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">مرحباً بك <br /> في <span className="gradient-text">المنصة</span></h1>
                                                <p className="text-slate-500 font-medium text-lg leading-relaxed">{email || project?.clientEmail}</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full md:w-auto">
                                                <div className="flex gap-4 order-2 sm:order-1">
                                                    <div className="glass-card p-8 rounded-3xl text-center min-w-[140px] border-indigo-500/10 group hover:border-indigo-500/30 transition-all">
                                                        <div className="text-4xl font-black text-white group-hover:scale-110 transition-transform">{foundProjects.length}</div>
                                                        <div className="text-[10px] text-slate-500 font-black uppercase mt-2 tracking-widest">المشاريع</div>
                                                    </div>
                                                    <div className="glass-card p-8 rounded-3xl text-center min-w-[140px] border-emerald-500/10 group hover:border-emerald-500/30 transition-all">
                                                        <div className="text-4xl font-black text-emerald-400 group-hover:scale-110 transition-transform">{requests.length}</div>
                                                        <div className="text-[10px] text-slate-500 font-black uppercase mt-2 tracking-widest">الطلبات</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="order-1 sm:order-2 px-8 py-4 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    تسجيل الخروج
                                                    <ArrowLeft size={16} className="rotate-180" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                            {/* Projects Overview */}
                                            <div className="space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-2xl font-black text-white flex items-center gap-4">
                                                        <Briefcase size={24} className="text-indigo-400" />
                                                        مشاريعك الحالية
                                                    </h2>
                                                </div>
                                                <div className="grid gap-6">
                                                    {foundProjects.map(proj => (
                                                        <button
                                                            key={proj.id}
                                                            onClick={() => selectProject(proj)}
                                                            className="w-full text-right p-8 glass-card border-white/5 rounded-[2.5rem] hover:border-indigo-500/40 hover:bg-white/5 transition-all duration-500 group relative overflow-hidden"
                                                        >
                                                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                            <div className="flex justify-between items-start mb-6">
                                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${proj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                                    proj.status === 'planning' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                    }`}>
                                                                    {proj.status}
                                                                </span>
                                                                <span className="text-slate-500 font-mono text-[10px] tracking-widest">#{proj.id.substring(0, 8)}</span>
                                                            </div>
                                                            <h3 className="text-2xl font-black text-white mb-6 group-hover:text-indigo-400 transition-colors">{proj.title}</h3>

                                                            <div className="space-y-3">
                                                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                                                    <span className="text-slate-500">نسبة الإنجاز</span>
                                                                    <span className="text-white">{calculateProgress(proj)}%</span>
                                                                </div>
                                                                <div className="h-2 bg-slate-950 rounded-full overflow-hidden shadow-inner">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${calculateProgress(proj)}%` }}
                                                                        transition={{ duration: 1, delay: 0.5 }}
                                                                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                                عرض تفاصيل المشروع
                                                                <ArrowLeft size={14} className="rotate-180" />
                                                            </div>
                                                        </button>
                                                    ))}
                                                    {foundProjects.length === 0 && (
                                                        <div className="text-center py-20 glass-card rounded-[2.5rem] border-dashed border-white/10">
                                                            <Briefcase size={40} className="mx-auto mb-4 text-slate-700" />
                                                            <p className="text-slate-500 font-bold text-lg">لا توجد مشاريع مفعّلة حالياً</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Requests Overview */}
                                            <div className="space-y-8">
                                                <div className="flex justify-between items-center">
                                                    <h2 className="text-2xl font-black text-white flex items-center gap-4">
                                                        <MessageCircle size={24} className="text-emerald-400" />
                                                        آخر الطلبات
                                                    </h2>
                                                    <button
                                                        onClick={() => setActiveTab('request')}
                                                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-[0.2em] shadow-lg"
                                                    >
                                                        طلب جديد +
                                                    </button>
                                                </div>
                                                <div className="grid gap-4">
                                                    {requests.slice(0, 5).map(req => (
                                                        <div key={req.id} className="p-6 glass-card border-white/5 rounded-3xl flex justify-between items-center hover:bg-white/5 transition-colors group">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${req.status === 'new' ? 'bg-blue-600/10 text-blue-400' :
                                                                    req.status === 'accepted' ? 'bg-emerald-600/10 text-emerald-400' :
                                                                        'bg-slate-800 text-slate-500'
                                                                    }`}>
                                                                    <Zap size={20} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">{req.serviceTitle}</p>
                                                                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{new Date(req.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</p>
                                                                </div>
                                                            </div>
                                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${req.status === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                                    'bg-slate-800/10 text-slate-500 border-white/5'
                                                                }`}>
                                                                {req.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {requests.length === 0 && (
                                                        <div className="text-center py-20 glass-card rounded-[2.5rem] border-dashed border-white/10">
                                                            <MessageCircle size={40} className="mx-auto mb-4 text-slate-700" />
                                                            <p className="text-slate-500 font-bold text-lg">لا توجد طلبات سابقة</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Project Detail View */}
                                {viewMode === 'project-detail' && project && (
                                    <div className="space-y-16">
                                        <button
                                            onClick={() => setViewMode('account')}
                                            className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-xl border border-white/5 hover:border-indigo-500/30 w-fit"
                                        >
                                            <ArrowLeft size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                            العودة للوحة التحكم
                                        </button>

                                        {/* Portal Header */}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-12 text-right">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-indigo-400 justify-start">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                                                        <Briefcase size={20} />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">بوابة المشروع</span>
                                                </div>
                                                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">{project.title}</h1>
                                                <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">CODE: {project.id}</p>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-10 w-full md:w-auto">
                                                <div className="flex items-center gap-8 order-2 sm:order-1">
                                                    <div className="text-right">
                                                        <div className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-2">نسبة الإنجاز</div>
                                                        <div className="text-4xl font-black text-white">{calculateProgress(project)}%</div>
                                                    </div>
                                                    <div className="w-24 h-24 rounded-full border-8 border-white/5 flex items-center justify-center relative shadow-2xl">
                                                        <svg className="w-full h-full -rotate-90 absolute inset-0">
                                                            <circle
                                                                cx="48" cy="48" r="40"
                                                                stroke="currentColor" strokeWidth="8" fill="transparent"
                                                                className="text-indigo-600 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                                                                strokeDasharray={2 * Math.PI * 40}
                                                                strokeDashoffset={2 * Math.PI * 40 * (1 - calculateProgress(project) / 100)}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                        <Zap size={24} className="text-indigo-400 relative z-10 animate-pulse" />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="order-1 sm:order-2 px-8 py-4 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    تسجيل الخروج
                                                    <ArrowLeft size={16} className="rotate-180" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tab Navigation */}
                                        <div className="flex flex-wrap gap-4 p-2 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] w-fit">
                                            <PortalTab
                                                id="overview"
                                                label="نظرة عامة"
                                                icon={LayoutDashboard}
                                                active={activeTab === 'overview'}
                                                onClick={() => setActiveTab('overview')}
                                            />
                                            <PortalTab
                                                id="request"
                                                label="طلب جديد"
                                                icon={Zap}
                                                active={activeTab === 'request'}
                                                onClick={() => setActiveTab('request')}
                                            />
                                            <PortalTab
                                                id="my-requests"
                                                label="طلباتي"
                                                icon={FileText}
                                                active={activeTab === 'my-requests'}
                                                onClick={() => setActiveTab('my-requests')}
                                                badge={requests.length > 0 ? requests.length : undefined}
                                            />
                                            <PortalTab
                                                id="support"
                                                label="الدعم الفني"
                                                icon={LifeBuoy}
                                                active={activeTab === 'support'}
                                                onClick={() => setActiveTab('support')}
                                            />
                                        </div>

                                        {/* Main Content Area */}
                                        <div className="relative min-h-[400px]">
                                            <AnimatePresence mode="wait">
                                                {activeTab === 'overview' && (
                                                    <motion.div
                                                        key="overview"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        <PortalProjectView project={project} invoices={invoices} calculateProgress={calculateProgress} />
                                                    </motion.div>
                                                )}

                                                {activeTab === 'request' && (
                                                    <motion.div
                                                        key="request"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        <PortalRequestForm
                                                            project={project}
                                                            onSuccess={() => {
                                                                requestService.getAll().then(all => {
                                                                    const projectRequests = all.filter(r => r.projectId === project.id);
                                                                    setRequests(projectRequests);
                                                                });
                                                                setActiveTab('my-requests');
                                                            }}
                                                        />
                                                    </motion.div>
                                                )}

                                                {activeTab === 'my-requests' && (
                                                    <motion.div
                                                        key="my-requests"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.5 }}
                                                        className="space-y-10"
                                                        dir="rtl"
                                                    >
                                                        {selectedRequest ? (
                                                            <div className="space-y-8">
                                                                <button
                                                                    onClick={() => setSelectedRequest(null)}
                                                                    className="flex items-center gap-3 text-slate-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-xl border border-white/5 hover:border-indigo-500/30"
                                                                >
                                                                    <ArrowLeft size={16} className="rotate-180" />
                                                                    العودة للقائمة
                                                                </button>
                                                                <PortalRequestTracking request={selectedRequest} />
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-10">
                                                                <div className="flex items-center justify-between">
                                                                    <h3 className="text-3xl font-black text-white tracking-tight">طلبات الخدمة</h3>
                                                                    <div className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-[11px] font-black text-indigo-400 uppercase tracking-widest">
                                                                        {requests.length} طلب نشط
                                                                    </div>
                                                                </div>

                                                                {requests.length === 0 ? (
                                                                    <div className="text-center py-32 glass-card border-dashed border-white/10 rounded-[3rem]">
                                                                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-6">
                                                                            <FileText size={32} className="text-slate-700" />
                                                                        </div>
                                                                        <p className="text-slate-400 text-xl font-black">لم تقم بإرسال أي طلبات بعد</p>
                                                                        <p className="text-slate-600 text-sm mt-2 max-w-sm mx-auto">استخدم تبويب "طلب جديد" لإرسال طلب خدمة جديد وسنبدأ العمل عليه فوراً.</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                        {requests.map((request) => {
                                                                            const statusColors = {
                                                                                new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                                                                                review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                                                                                proposal: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                                                                                negotiation: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                                                                                accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                                                                                rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
                                                                                completed: 'bg-green-500/10 text-green-400 border-green-500/20'
                                                                            };

                                                                            const statusLabels = {
                                                                                new: 'جديد',
                                                                                review: 'قيد المراجعة',
                                                                                proposal: 'عرض سعر',
                                                                                negotiation: 'تفاوض',
                                                                                accepted: 'مقبول',
                                                                                rejected: 'مرفوض',
                                                                                completed: 'مكتمل'
                                                                            };

                                                                            return (
                                                                                <button
                                                                                    key={request.id}
                                                                                    onClick={() => setSelectedRequest(request)}
                                                                                    className="w-full text-right glass-card border-white/5 rounded-[2rem] p-8 hover:border-indigo-500/40 hover:bg-white/5 transition-all duration-500 group relative overflow-hidden"
                                                                                >
                                                                                    <div className="flex items-start justify-between gap-6 mb-6">
                                                                                        <div className="flex-1 space-y-2">
                                                                                            <div className="flex items-center gap-3">
                                                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusColors[request.status].split(' ')[0]}`}>
                                                                                                    <Zap size={18} />
                                                                                                </div>
                                                                                                <h4 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">
                                                                                                    {request.serviceTitle}
                                                                                                </h4>
                                                                                            </div>
                                                                                            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest pt-2">
                                                                                                {request.category && <span className="flex items-center gap-1.5"><Briefcase size={12} /> {request.category}</span>}
                                                                                                {request.date && (
                                                                                                    <span className="flex items-center gap-1.5">
                                                                                                        <Clock size={12} />
                                                                                                        {new Date(request.date).toLocaleDateString('ar-DZ')}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border whitespace-nowrap shadow-sm ${statusColors[request.status]}`}>
                                                                                            {statusLabels[request.status]}
                                                                                        </span>
                                                                                    </div>
                                                                                    {request.message && (
                                                                                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                                                                                            {request.message}
                                                                                        </p>
                                                                                    )}
                                                                                    <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5">
                                                                                        <div className="flex items-center gap-4">
                                                                                            {request.attachments && request.attachments.length > 0 && (
                                                                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                                                                    <Paperclip size={14} className="text-indigo-400" />
                                                                                                    {request.attachments.length} ملفات
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 group-hover:translate-x-1 transition-transform">
                                                                                            متابعة الطلب
                                                                                            <ArrowLeft size={14} className="rotate-180" />
                                                                                        </div>
                                                                                    </div>
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}

                                                {activeTab === 'support' && (
                                                    <motion.div
                                                        key="support"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        <PortalSupport project={project} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                            </ErrorBoundary>
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

const PortalTab = ({ id, label, icon: Icon, active, onClick, badge }: any) => (
    <button
        onClick={onClick}
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${active
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
            : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon size={18} />
        {label}
        {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                {badge}
            </span>
        )}
    </button>
);

export default ClientPortalPage;
