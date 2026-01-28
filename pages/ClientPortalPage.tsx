import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Link as LinkIcon, Search, AlertTriangle, LayoutDashboard, Zap, LifeBuoy } from 'lucide-react';
import Layout from '../components/Layout';
import { projectService } from '../lib/services/projectService';
import { invoiceService } from '../lib/services/invoiceService';
import { Project, Invoice } from '../lib/types';
import PortalProjectView from '../components/portal/PortalProjectView';
import PortalRequestForm from '../components/portal/PortalRequestForm';
import PortalSupport from '../components/portal/PortalSupport';

const ClientPortalPage: React.FC = () => {
    const [projectCode, setProjectCode] = useState('');
    const [project, setProject] = useState<Project | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFound, setIsFound] = useState(false);

    // Tab State
    const [activeTab, setActiveTab] = useState<'overview' | 'request' | 'support'>('overview');

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
                                <p className="text-slate-400 text-lg">أدخل كود المشروع الخاص بك لمتابعة التقدم والتحميلات</p>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-3xl p-2 gap-2">
                                    <input
                                        type="text"
                                        placeholder="كود المشروع (مثال: p-123456)"
                                        value={projectCode}
                                        onChange={(e) => setProjectCode(e.target.value)}
                                        className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none font-mono"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        disabled={isLoading}
                                        className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Search size={18} />
                                                دخول
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

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
                            {/* Portal Header */}
                            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                                <div>
                                    <div className="flex items-center gap-3 text-indigo-400 mb-4">
                                        <Briefcase size={20} />
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">بوابة المشاريع السيادية</span>
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
                                    id="support"
                                    label="الدعم الفني"
                                    icon={LifeBuoy}
                                    active={activeTab === 'support'}
                                    onClick={() => setActiveTab('support')}
                                />
                            </div>

                            {/* Main Content Area */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTab === 'overview' && (
                                        <PortalProjectView
                                            project={project}
                                            invoices={invoices}
                                            calculateProgress={calculateProgress}
                                        />
                                    )}
                                    {activeTab === 'request' && (
                                        <PortalRequestForm
                                            project={project}
                                            onSuccess={() => setActiveTab('overview')}
                                        />
                                    )}
                                    {activeTab === 'support' && (
                                        <PortalSupport project={project} />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

const PortalTab = ({ id, label, icon: Icon, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

export default ClientPortalPage;
