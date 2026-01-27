import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBusiness } from '../../../../context/BusinessContext';
import {
    MessageSquare,
    Search,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Filter,
    Star,
    TrendingUp,
    Zap,
    Briefcase
} from 'lucide-react';
import RequestDetail from './RequestDetail';

const Requests: React.FC = () => {
    const { serviceRequests, isLoading } = useBusiness();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    const filteredRequests = (serviceRequests || []).filter(req => {
        const matchesSearch =
            (req.clientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (req.serviceTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (req.clientEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || req.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusTheme = (status: string) => {
        switch (status) {
            case 'new': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    const statusMap: Record<string, string> = {
        new: 'جديد',
        review: 'مراجعة',
        proposal: 'عرض سعر',
        negotiation: 'تفاوض',
        accepted: 'مقبول',
        rejected: 'مرفوض',
        completed: 'مكتمل'
    };

    return (
        <div className="h-full flex flex-col space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Ultra-Modern Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 bg-slate-900/20 p-8 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-600/10 transition-all duration-1000"></div>

                <div dir="rtl" className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-600/20">
                            <Zap className="text-white" size={32} />
                        </div>
                        <div>
                            <h2 className="text-5xl font-black text-white tracking-tighter">وارد المساعدة</h2>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                <TrendingUp size={14} className="text-indigo-500" />
                                Operational Intelligence Hub
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 relative z-10 w-full lg:w-auto">
                    <div className="flex-1 lg:flex-none">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 pr-2">حالة الطلب</p>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full lg:w-48 bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-black uppercase text-white outline-none focus:border-indigo-500 shadow-xl transition-all"
                            dir="rtl"
                        >
                            <option value="all">كل الحالات</option>
                            {Object.entries(statusMap).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 lg:flex-none">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 pr-2">الأولوية</p>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="w-full lg:w-48 bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-black uppercase text-white outline-none focus:border-indigo-500 shadow-xl transition-all"
                            dir="rtl"
                        >
                            <option value="all">كل الأولويات</option>
                            <option value="high">مرتفعة</option>
                            <option value="medium">متوسطة</option>
                            <option value="low">منخفضة</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Premium Search */}
            <div className="relative group">
                <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                    <Search className="text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={24} />
                </div>
                <input
                    type="text"
                    placeholder="ابحث في وارد الاستفسارات، اسم العميل، البريد الإلكتروني أو نوع الخدمة المطلوبة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    dir="rtl"
                    className="w-full bg-slate-900/30 border-2 border-white/5 p-7 pr-16 rounded-[2.5rem] text-white outline-none focus:border-indigo-500/30 focus:bg-slate-900/50 transition-all font-bold placeholder:text-slate-700 shadow-2xl text-lg backdrop-blur-sm"
                />
            </div>

            {/* Performance Grid */}
            <div className="flex-1 pr-1 custom-scrollbar scroll-smooth">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-64 bg-slate-900/50 rounded-[3rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="py-32 text-center bg-slate-950/20 border-2 border-dashed border-white/5 rounded-[4rem] group hover:border-indigo-500/20 transition-all">
                        <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500">
                            <MessageSquare size={48} className="text-slate-800 group-hover:text-indigo-500/50 transition-colors" />
                        </div>
                        <h4 className="text-3xl font-black text-white tracking-tighter">صندوق الوارد فارغ حالياً</h4>
                        <p className="text-slate-600 font-bold text-sm mt-3 uppercase tracking-widest">No Incoming Service Requests at this moment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
                        {filteredRequests.map(req => (
                            <motion.div
                                layoutId={req.id}
                                key={req.id}
                                onClick={() => setSelectedRequest(req)}
                                className="group bg-slate-900/40 border border-white/5 p-8 rounded-[3.5rem] hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-[340px]"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all"></div>

                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${getStatusTheme(req.status)}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                            {statusMap[req.status] || req.status}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                {new Date(req.date).toLocaleDateString('ar-EG')}
                                            </span>
                                            <div className={`text-[9px] font-black uppercase mt-1 ${req.priority === 'high' ? 'text-red-500' : req.priority === 'medium' ? 'text-amber-500' : 'text-slate-500'}`}>
                                                {req.priority || 'medium'} Priority
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right" dir="rtl">
                                        <h4 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2">
                                            {req.serviceTitle}
                                        </h4>
                                        <p className="text-slate-400 font-black text-sm mb-4 flex items-center gap-2 justify-end">
                                            {req.clientName}
                                            <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center">
                                                <Star size={10} className="text-amber-500" />
                                            </div>
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right space-y-6" dir="rtl">
                                    <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed h-10">
                                        {req.projectDetails || req.message || "لا توجد تفاصيل إضافية لهذا الطلب."}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2 text-indigo-400 font-black text-xs">
                                                <TrendingUp size={14} />
                                                {req.value?.toLocaleString() || 0}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                                            عرض المعالجة
                                            <ArrowRight size={16} className="rotate-180 text-indigo-500" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Side Detail Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <RequestDetail
                        request={selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Requests;
