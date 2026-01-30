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

    const handleSearch = async () => {
        if (!projectCode.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const foundProject = await projectService.getByCode(projectCode.trim());

            if (foundProject) {
                setProject(foundProject);
                // Fetch related invoices
                const foundInvoices = await invoiceService.getByProjectId(foundProject.id);
                setInvoices(foundInvoices);
                setIsFound(true);
                setViewMode('project-detail');
            } else {
                setError('لم يتم العثور على مشروع بهذا الكود. يرجى التأكد من البيانات.');
            }
        } catch (err) {
            console.error(err);
            setError('حدث خطأ أثناء الاتصال بالنظام. يرجى المحاولة لاحقاً.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailLookup = async () => {
        if (!email.trim() || !email.includes('@')) {
            setError('يرجى إدخال بريد إلكتروني صحيح.');
            return;
        }

        setIsLoading(true);
        setError('');
        setFoundProjects([]);

        try {
            const projects = await projectService.getByEmail(email.trim().toLowerCase());
            const userRequests = await requestService.getRequestsByClient(email.trim().toLowerCase());

            if (projects.length === 0 && userRequests.length === 0) {
                setError('لم نجد أي طلبات أو مشاريع مرتبطة بهذا البريد الإلكتروني.');
            } else {
                setFoundProjects(projects);
                setRequests(userRequests);
                setIsFound(true);
                setViewMode('account');

                // If only one project, we might still want to show account view first 
                // but let's default to account view for better UX consistency
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
            <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-950">
                <div className="container mx-auto max-w-6xl">
                    {!isFound ? (
                        <div className="max-w-2xl mx-auto text-center space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">بوابة العميل</h1>
                            </div>

                            <div className="flex justify-center gap-4 mb-8">
                                <button
                                    onClick={() => { setLoginMethod('code'); setError(''); }}
                                    className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'code' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-slate-500'}`}
                                >
                                    كود المشروع
                                </button>
                                <button
                                    onClick={() => { setLoginMethod('email'); setError(''); }}
                                    className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'email' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-slate-500'}`}
                                >
                                    البريد الإلكتروني
                                </button>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-3xl p-2 gap-2">
                                    {loginMethod === 'code' ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="كود المشروع (مثال: p-123456)"
                                                value={projectCode}
                                                onChange={(e) => setProjectCode(e.target.value)}
                                                className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none font-mono text-right"
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                                aria-label="كود المشروع"
                                            />
                                            <button
                                                onClick={handleSearch}
                                                disabled={isLoading}
                                                className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={18} />}
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
                                                className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none text-right font-medium"
                                                onKeyDown={(e) => e.key === 'Enter' && handleEmailLookup()}
                                                aria-label="البريد الإلكتروني"
                                            />
                                            <button
                                                onClick={handleEmailLookup}
                                                disabled={isLoading}
                                                className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={18} />}
                                                بحث
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {foundProjects.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 text-right space-y-4"
                                >
                                    <h3 className="text-white font-black text-lg">اختر المشروع المرجو متابعته:</h3>
                                    <div className="grid gap-3">
                                        {foundProjects.map(proj => (
                                            <button
                                                key={proj.id}
                                                onClick={() => selectProject(proj)}
                                                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                        <Briefcase size={18} />
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white font-bold">{proj.title}</p>
                                                        <p className="text-[10px] text-slate-500 font-mono uppercase">CODE: {proj.id}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${proj.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-indigo-500/10 text-indigo-400'
                                                    }`}>
                                                    {proj.status}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {error && (
                                <div className="bg-amber-500/10 text-amber-500 px-4 py-3 rounded-xl border border-amber-500/20 flex items-center justify-center gap-2">
                                    <AlertTriangle size={16} />
                                    {error}
                                </div>
                            )}
                        </div>
                    ) : project && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12"
                            dir="rtl"
                        >
                            <ErrorBoundary>
                                {/* Account Dashboard View */}
                                {viewMode === 'account' && (
                                    <div className="space-y-12">
                                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 text-right">
                                            <div>
                                                <div className="flex items-center gap-3 text-indigo-400 mb-4 justify-start">
                                                    <LayoutDashboard size={20} />
                                                    <span className="text-xs font-black uppercase tracking-[0.3em]">لوحة التحكم الموحدة للعميل</span>
                                                </div>
                                                <h1 className="text-4xl md:text-5xl font-black text-white">مرحباً بك مجدداً</h1>
                                                <p className="text-slate-500 mt-2">{email || project?.clientEmail}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl text-center min-w-[120px]">
                                                    <div className="text-3xl font-black text-white">{foundProjects.length}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">المشاريع</div>
                                                </div>
                                                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl text-center min-w-[120px]">
                                                    <div className="text-3xl font-black text-emerald-400">{requests.length}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">الطلبات</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Projects Overview */}
                                            <div className="space-y-6">
                                                <h2 className="text-xl font-black text-white flex items-center gap-3">
                                                    <Briefcase size={20} className="text-indigo-400" />
                                                    مشاريعك الحالية
                                                </h2>
                                                <div className="grid gap-4">
                                                    {foundProjects.map(proj => (
                                                        <button
                                                            key={proj.id}
                                                            onClick={() => selectProject(proj)}
                                                            className="w-full text-right p-6 bg-slate-900 border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all group"
                                                        >
                                                            <div className="flex justify-between items-center mb-4">
                                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${proj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                                                    proj.status === 'planning' ? 'bg-indigo-500/10 text-indigo-400' :
                                                                        'bg-blue-500/10 text-blue-400'
                                                                    }`}>
                                                                    {proj.status}
                                                                </span>
                                                                <span className="text-slate-500 font-mono text-[10px]">{proj.id}</span>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">{proj.title}</h3>

                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-[10px] font-bold">
                                                                    <span className="text-slate-500">الإنجاز</span>
                                                                    <span className="text-white">{calculateProgress(proj)}%</span>
                                                                </div>
                                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${calculateProgress(proj)}%` }}
                                                                        className="h-full bg-indigo-500"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                    {foundProjects.length === 0 && (
                                                        <p className="text-slate-600 italic py-8 text-center bg-slate-950 rounded-2xl border border-dashed border-white/5">لا توجد مشاريع مفعلة حالياً.</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Requests Overview */}
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                                                        <MessageCircle size={20} className="text-emerald-400" />
                                                        آخر الطلبات
                                                    </h2>
                                                    <button
                                                        onClick={() => setActiveTab('request')}
                                                        className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest"
                                                    >
                                                        طلب جديد +
                                                    </button>
                                                </div>
                                                <div className="grid gap-3">
                                                    {requests.slice(0, 5).map(req => (
                                                        <div key={req.id} className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex justify-between items-center">
                                                            <div>
                                                                <p className="text-sm font-bold text-white">{req.serviceTitle}</p>
                                                                <p className="text-[10px] text-slate-500 mt-1">{new Date(req.date).toLocaleDateString('ar-EG')}</p>
                                                            </div>
                                                            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${req.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                                                                req.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                    'bg-slate-800 text-slate-500'
                                                                }`}>
                                                                {req.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {requests.length === 0 && (
                                                        <p className="text-slate-600 italic py-8 text-center bg-slate-950 rounded-2xl border border-dashed border-white/5">لا توجد طلبات سابقة.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Project Detail View */}
                                {viewMode === 'project-detail' && project && (
                                    <div className="space-y-12">
                                        <button
                                            onClick={() => setViewMode('account')}
                                            className="flex items-center gap-2 text-slate-500 hover:text-white transition-all text-xs font-bold"
                                        >
                                            <ArrowLeft size={16} className="rotate-180" />
                                            العودة للوحة التحكم
                                        </button>

                                        {/* Portal Header */}
                                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 text-right">
                                            <div>
                                                <div className="flex items-center gap-3 text-indigo-400 mb-4 justify-start">
                                                    <Briefcase size={20} />
                                                    <span className="text-xs font-black uppercase tracking-[0.3em]">بوابة المشروع</span>
                                                </div>
                                                <h1 className="text-4xl md:text-5xl font-black text-white">{project.title}</h1>
                                                <p className="text-slate-500 mt-2 font-mono">CODE: {project.id}</p>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">نسبة الإنجاز</div>
                                                    <div className="text-3xl font-black text-white">{calculateProgress(project)}%</div>
                                                </div>
                                                <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 flex items-center justify-center relative">
                                                    <svg className="w-full h-full -rotate-90">
                                                        <circle
                                                            cx="48" cy="48" r="40"
                                                            stroke="currentColor" strokeWidth="4" fill="transparent"
                                                            className="text-indigo-500"
                                                            strokeDasharray={2 * Math.PI * 40}
                                                            strokeDashoffset={2 * Math.PI * 40 * (1 - calculateProgress(project) / 100)}
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tab Navigation */}
                                        <div className="flex gap-4 p-1 bg-slate-900/50 rounded-2xl w-fit mx-auto md:mx-0">
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
                                        <AnimatePresence mode="wait">
                                            {activeTab === 'overview' && (
                                                <motion.div
                                                    key="overview"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                >
                                                    <PortalProjectView project={project} invoices={invoices} calculateProgress={calculateProgress} />
                                                </motion.div>
                                            )}

                                            {activeTab === 'request' && (
                                                <motion.div
                                                    key="request"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                >
                                                    <PortalRequestForm
                                                        project={project}
                                                        onSuccess={() => {
                                                            // Refresh requests after submission
                                                            requestService.getAll().then(all => {
                                                                const projectRequests = all.filter(r => r.projectId === project.id);
                                                                setRequests(projectRequests);
                                                            });
                                                            setActiveTab('my-requests'); // Changed from 'overview' to 'my-requests'
                                                        }}
                                                    />
                                                </motion.div>
                                            )}

                                            {activeTab === 'my-requests' && (
                                                <motion.div
                                                    key="my-requests"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="space-y-6"
                                                    dir="rtl"
                                                >
                                                    {selectedRequest ? (
                                                        <div>
                                                            <button
                                                                onClick={() => setSelectedRequest(null)}
                                                                className="mb-6 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                                                            >
                                                                <ArrowLeft size={16} className="rotate-180" />
                                                                العودة للقائمة
                                                            </button>
                                                            <PortalRequestTracking request={selectedRequest} />
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-6">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="text-2xl font-black text-white">طلباتي</h3>
                                                                <span className="text-slate-500 text-sm">
                                                                    {requests.length} طلب
                                                                </span>
                                                            </div>

                                                            {requests.length === 0 ? (
                                                                <div className="text-center py-16 bg-slate-900 border border-white/5 rounded-3xl">
                                                                    <FileText size={48} className="mx-auto mb-4 text-slate-600" />
                                                                    <p className="text-slate-400 text-lg font-bold">لم تقم بإرسال أي طلبات بعد</p>
                                                                    <p className="text-slate-600 text-sm mt-2">استخدم تبويب "طلب جديد" لإرسال طلب خدمة</p>
                                                                </div>
                                                            ) : (
                                                                <div className="grid gap-4">
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
                                                                                className="w-full text-right bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group"
                                                                            >
                                                                                <div className="flex items-start justify-between gap-4 mb-4">
                                                                                    <div className="flex-1">
                                                                                        <h4 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors">
                                                                                            {request.serviceTitle}
                                                                                        </h4>
                                                                                        <p className="text-slate-500 text-sm mt-1">
                                                                                            {request.category && <span className="mr-2">📁 {request.category}</span>}
                                                                                            {request.date && (
                                                                                                <span className="flex items-center gap-1 mt-1">
                                                                                                    <Clock size={12} />
                                                                                                    {new Date(request.date).toLocaleDateString('ar-DZ')}
                                                                                                </span>
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                    <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border ${statusColors[request.status]}`}>
                                                                                        {statusLabels[request.status]}
                                                                                    </span>
                                                                                </div>
                                                                                {request.message && (
                                                                                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                                                                                        {request.message}
                                                                                    </p>
                                                                                )}
                                                                                {request.attachments && request.attachments.length > 0 && (
                                                                                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                                                                        <Paperclip size={14} />
                                                                                        {request.attachments.length} مرفق
                                                                                    </div>
                                                                                )}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {activeTab === 'support' && (
                                            <motion.div
                                                key="support"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                            >
                                                <PortalSupport project={project} />
                                            </motion.div>
                                        )}
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
