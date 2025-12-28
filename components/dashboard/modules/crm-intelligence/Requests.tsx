import React, { useState } from 'react';
import { useData } from '../../../../context/DataContext';
import { MessageSquare, Plus, Search, Filter, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { ServiceRequest } from '../../../../types';

const Requests: React.FC = () => {
    const { siteData, updateRequest, deleteRequest } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const requests = siteData.serviceRequests || [];

    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            (req.clientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (req.serviceTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || req.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'new': return <AlertCircle size={16} className="text-amber-400" />;
            case 'completed': return <CheckCircle size={16} className="text-emerald-400" />;
            default: return <Clock size={16} className="text-blue-400" />;
        }
    };

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div dir="rtl">
                    <h2 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter">
                        <div className="p-3 bg-[rgba(var(--accent-indigo-rgb),0.2)] rounded-[var(--border-radius-elite)] border border-[rgba(var(--accent-indigo-rgb),0.3)]">
                            <MessageSquare className="text-[var(--accent-indigo)]" size={32} />
                        </div>
                        مركز طلبات الخدمة
                    </h2>
                    <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-widest">Executive Help Desk & Support</p>
                </div>

                <div className="flex gap-4">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-[var(--accent-indigo)]"
                        dir="rtl"
                    >
                        <option value="all">كل الحالات</option>
                        <option value="new">جديد</option>
                        <option value="review">قيد المراجعة</option>
                        <option value="completed">مكتمل</option>
                    </select>
                </div>
            </div>

            {/* Search */}
            <div className="relative group">
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                    <Search className="text-slate-600 group-focus-within:text-[var(--accent-indigo)] transition-colors" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="ابحث باسم العميل أو نوع الخدمة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    dir="rtl"
                    className="w-full bg-slate-900/50 border border-white/5 p-5 pr-14 rounded-[var(--border-radius-elite)] text-white outline-none focus:border-[rgba(var(--accent-indigo-rgb),0.5)] transition-all font-bold placeholder:text-slate-700 shadow-inner"
                />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {filteredRequests.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                        <MessageSquare size={48} className="mx-auto text-slate-800 mb-6" />
                        <h4 className="text-white font-bold text-xl">لا توجد طلبات مسجلة حالياً</h4>
                        <p className="text-slate-600 text-sm mt-2">عندما يرسل العملاء طلبات عبر الموقع، ستظهر هنا فوراً.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredRequests.map(req => (
                            <div
                                key={req.id}
                                className="group bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-[rgba(var(--accent-indigo-rgb),0.3)] transition-all relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border ${req.status === 'new' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            req.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                        {getStatusIcon(req.status)}
                                        {req.status}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase">
                                        {new Date(req.date).toLocaleDateString('ar-EG')}
                                    </span>
                                </div>

                                <div className="text-right" dir="rtl">
                                    <h4 className="text-xl font-black text-white mb-1 group-hover:text-[var(--accent-indigo)] transition-colors">
                                        {req.serviceTitle}
                                    </h4>
                                    <p className="text-slate-400 font-bold mb-6">{req.clientName}</p>

                                    <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed">
                                        {req.projectDetails}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex gap-2">
                                            <button className="text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                                                Update Status
                                            </button>
                                        </div>
                                        <button className="flex items-center gap-2 text-[var(--accent-indigo)] font-black text-xs hover:gap-4 transition-all pr-4">
                                            عرض التفاصيل
                                            <ArrowRight size={16} className="rotate-180" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requests;
