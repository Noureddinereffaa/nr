import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    Globe,
    Lock,
    Calendar,
    BarChart3
} from 'lucide-react';
import { useContent } from '../../../../context/ContentContext';
import { useSystem } from '../../../../context/SystemContext';
import { useUI } from '../../../../context/UIContext';
import { DecisionPage } from '../../../../types';
import { formatDate } from '../../../../lib/utils';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import DecisionPageForm from '../../forms/DecisionPageForm';

const DecisionPages: React.FC = () => {
    const { decisionPages, deleteDecisionPage, addDecisionPage, updateDecisionPage } = useContent();
    const { aiConfig } = useSystem();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<DecisionPage | undefined>(undefined);

    const filteredPages = (decisionPages || []).filter(page => {
        const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || page.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (page: DecisionPage) => {
        setEditingPage(page);
        setIsEditorOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('بعد الحذف، لا يمكن استعادة الصفحة. هل أنت متأكد؟')) {
            await deleteDecisionPage(id);
        }
    };

    const handleClose = () => {
        setIsEditorOpen(false);
        setEditingPage(undefined);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" dir="rtl">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-widest uppercase italic">Decision Pages</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">صفحات الهبوط الإستراتيجية وأدوات التحويل</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsEditorOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl shadow-white/5 active:scale-95"
                    >
                        <Plus size={18} />
                        صفحة جديدة
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" dir="rtl">
                <div className="md:col-span-3 relative">
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="ابحث في صفحات الهبوط..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 rounded-2xl pr-14 pl-6 py-4 text-white placeholder:text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-inner"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'left 1.5rem center', backgroundSize: '1rem' }}
                >
                    <option value="all">كل التصنيفات</option>
                    <option value="landing">صفحات هبوط</option>
                    <option value="lead-gen">جمع بيانات</option>
                    <option value="sales">مبيعات</option>
                    <option value="thank-you">شكر</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
                {filteredPages.map((page) => (
                    <motion.div
                        key={page.id}
                        layout
                        className="group bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 transition-all backdrop-blur-sm"
                    >
                        <div className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-2xl ${page.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
                                    {page.status === 'published' ? <Globe size={20} /> : <Lock size={20} />}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(page)} className="p-2 text-slate-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(page.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{page.title}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">{page.description}</p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2 text-[8px] text-slate-600 font-black uppercase tracking-widest">
                                    <Calendar size={10} />
                                    {formatDate(page.date)}
                                </div>
                                <div className="flex items-center gap-2 text-[8px] text-indigo-400 font-black uppercase tracking-widest">
                                    <BarChart3 size={10} />
                                    {Math.floor(Math.random() * 1000)} زيارة
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {decisionPages.length === 0 && (
                <div className="text-center py-20 bg-slate-900/20 border border-dashed border-white/5 rounded-[3rem]">
                    <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                        <BarChart3 size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">لا توجد صفحات هبوط حالياً</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">ابدأ بإنشاء أول صفحة هبوط إحترافية لتحسين معدل التحويل لعملك</p>
                </div>
            )}

            <DecisionPageForm
                isOpen={isEditorOpen}
                onClose={handleClose}
                initialData={editingPage}
                onSave={async (data) => {
                    if (editingPage) {
                        await updateDecisionPage(editingPage.id, data as any);
                    } else {
                        await addDecisionPage(data as any);
                    }
                    handleClose();
                }}
            />
        </div>
    );
};

export default DecisionPages;
