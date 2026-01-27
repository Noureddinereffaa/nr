import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CreditCard, Clock, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import Layout from '../components/Layout';

const ClientPortalPage: React.FC = () => {
    const [projectId, setProjectId] = useState('');
    const [isFound, setIsFound] = useState(false);

    // Mock data for demonstration - in production, this would fetch from projectService
    const mockProject = {
        id: 'p-1',
        name: 'تطوير الموقع المؤسسي',
        status: 'In Progress',
        progress: 65,
        milestones: [
            { name: 'التصميم المبدئي', completed: true },
            { name: 'برمجة الواجهات', completed: true },
            { name: 'ربط البيانات', completed: false },
            { name: 'الاختبار النهائي', completed: false },
        ],
        invoices: [
            { id: 'inv-1', status: 'Paid', amount: '50,000 DZD' },
            { id: 'inv-2', status: 'Pending', amount: '25,000 DZD' },
        ]
    };

    const handleSearch = () => {
        if (projectId === 'NR-2026') {
            setIsFound(true);
        }
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
                                        placeholder="كود المشروع (مثال: NR-2026)"
                                        value={projectId}
                                        onChange={(e) => setProjectId(e.target.value)}
                                        className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none font-mono"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all flex items-center gap-2"
                                    >
                                        <Search size={18} />
                                        دخول
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12"
                            dir="rtl"
                        >
                            {/* Portal Header */}
                            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-12">
                                <div>
                                    <div className="flex items-center gap-3 text-indigo-400 mb-4">
                                        <Briefcase size={20} />
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">بوابة المشاريع السيادية</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black text-white">{mockProject.name}</h1>
                                    <p className="text-slate-500 mt-2 font-mono">CODE: {projectId}</p>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">نسبة الإنجاز</div>
                                        <div className="text-3xl font-black text-white">{mockProject.progress}%</div>
                                    </div>
                                    <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 flex items-center justify-center relative">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle
                                                cx="48" cy="48" r="40"
                                                stroke="currentColor" strokeWidth="4" fill="transparent"
                                                className="text-indigo-500"
                                                strokeDasharray={2 * Math.PI * 40}
                                                strokeDashoffset={2 * Math.PI * 40 * (1 - mockProject.progress / 100)}
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Portal Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Milestones */}
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <Clock className="text-indigo-400" />
                                        خارطة الطريق
                                    </h3>
                                    <div className="grid gap-4">
                                        {mockProject.milestones.map((m, i) => (
                                            <div key={i} className={`p-6 rounded-2xl border transition-all ${m.completed ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-slate-900 border-white/5'}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.completed ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                                                            <CheckCircle2 size={20} />
                                                        </div>
                                                        <span className={`font-bold ${m.completed ? 'text-white' : 'text-slate-500'}`}>{m.name}</span>
                                                    </div>
                                                    {m.completed && <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">مكتمل</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Billing Summary */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <CreditCard className="text-emerald-400" />
                                        الشؤون المالية
                                    </h3>
                                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 space-y-6">
                                        {mockProject.invoices.map((inv, i) => (
                                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                                <div>
                                                    <p className="text-white font-bold">{inv.amount}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{inv.id}</p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {inv.status}
                                                </div>
                                            </div>
                                        ))}
                                        <button className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all mt-4">
                                            تحميل كافة الفواتير
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ClientPortalPage;
