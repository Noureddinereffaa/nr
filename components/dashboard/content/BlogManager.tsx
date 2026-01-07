import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useUI } from '../../../context/UIContext';
import {
    FileText, Plus, Trash2, Edit3, CheckCircle,
    ArrowRight, BarChart, Wand2, Search, Filter,
    Eye, Clock, Calendar, Layout, ChevronRight,
    Sparkles, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WritingWorkspace from './WritingWorkspace';

const BlogManager: React.FC = () => {
    const { siteData, updateArticle, deleteArticle, addArticle, syncArticlesToCloud } = useData();
    const { openArticleModal } = useUI();
    const { articles, aiConfig } = siteData;

    const [editingArticle, setEditingArticle] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState<'newest' | 'views' | 'seo'>('newest');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isMultiSelect, setIsMultiSelect] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate Loading for UX
    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const SkeletonCard = () => (
        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-[600px] animate-pulse">
            <div className="aspect-[16/9] bg-slate-800" />
            <div className="p-8 space-y-6">
                <div className="flex justify-between">
                    <div className="w-20 h-3 bg-slate-800 rounded-full" />
                    <div className="w-32 h-3 bg-slate-800 rounded-full" />
                </div>
                <div className="w-full h-8 bg-slate-800 rounded-xl" />
                <div className="w-2/3 h-8 bg-slate-800 rounded-xl" />
                <div className="space-y-2 pt-4">
                    <div className="w-full h-3 bg-slate-800 rounded-full" />
                    <div className="w-full h-3 bg-slate-800 rounded-full" />
                </div>
                <div className="mt-auto pt-8">
                    <div className="w-full h-24 bg-slate-800/50 rounded-2xl" />
                </div>
            </div>
        </div>
    );

    const categories = ['All', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))];

    const sortedArticles = [...articles].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
        if (sortBy === 'seo') return (b.seoScore || 0) - (a.seoScore || 0);
        return 0;
    });

    const filteredArticles = sortedArticles.filter(art => {
        const title = art.title || '';
        const excerpt = art.excerpt || '';
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Executive Insights
    const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const avgSeo = articles.length > 0 ? Math.round(articles.reduce((acc, curr) => acc + (curr.seoScore || 85), 0) / articles.length) : 0;

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} articles?`)) return;
        for (const id of selectedIds) {
            await deleteArticle(id);
        }
        setSelectedIds([]);
        setIsMultiSelect(false);
    };

    return (
        <div className="space-y-12 pb-24">
            {/* 0. EXECUTIVE INSIGHTS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
                {[
                    { label: 'إجمالي السلطة المعرفية', value: articles.length, icon: FileText, color: 'text-indigo-400', sub: 'مقال منشأ' },
                    { label: 'الانتشار العالمي', value: totalViews.toLocaleString(), icon: Eye, color: 'text-emerald-400', sub: 'مشاهدة تراكمية' },
                    { label: 'متوسط الأداء (SEO)', value: `${avgSeo}%`, icon: Sparkles, color: 'text-amber-400', sub: 'جاهزية الأرشفة' },
                    { label: 'وحدات Next.js النشطة', value: articles.filter(a => a.content?.startsWith('{"nextjs":true')).length, icon: Layout, color: 'text-blue-400', sub: 'نظام تشغيل المقال' },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden group"
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl bg-slate-950 border border-white/10 ${stat.color}`}>
                                    <stat.icon size={18} />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-black text-white">{stat.value}</p>
                                <p className="text-[9px] text-slate-600 font-bold mb-1.5 uppercase tracking-tighter">{stat.sub}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 1. STUDIO COMMAND HEADER */}
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-white/5 p-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -mr-40 -mt-40 shrink-0" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="text-right w-full lg:w-2/3">
                        <div className="flex items-center gap-3 justify-end mb-6">
                            <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-xl border border-indigo-500/20">
                                Digital Empire Hub v4.8
                            </span>
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                            إدارة المحتوى السيادي
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl ml-auto leading-relaxed">
                            أدوات تحرير متقدمة، تحليلات أداء لحظية، وقدرات تخصيص لا محدودة. قُد إمبراطوريتك المعرفية من هنا.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={async () => {
                                    if (confirm('هل تريد مزامنة المقالات المحلية مع السحابة؟ سيتم رفع القوالب المحلية غير الموجودة في قاعدة البيانات.')) {
                                        setIsLoading(true);
                                        await syncArticlesToCloud();
                                        setIsLoading(false);
                                    }
                                }}
                                className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-6 py-5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-3 hover:bg-indigo-600 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
                                title="مزامنة القوالب المحلية مع السحابة"
                            >
                                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                                مزامنة القوالب
                            </button>

                            <button
                                onClick={async () => {
                                    const newArticle = {
                                        title: 'رؤية استراتيجية جديدة',
                                        content: '',
                                        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
                                        category: 'General',
                                        tags: ['Strategy'],
                                        seoScore: 0,
                                        excerpt: '',
                                        status: 'draft' as 'draft',
                                        keywords: [],
                                        author: 'Noureddine Reffaa',
                                        readTime: '5 min',
                                        date: new Date().toISOString(),
                                        seo: { title: 'مقال جديد', description: '', keywords: [], focusKeyword: '' }
                                    };
                                    const newId = await addArticle(newArticle);
                                    setEditingArticle({ ...newArticle, id: newId, views: 0 });
                                }}
                                className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-3 hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5"
                            >
                                <Plus size={24} /> مقال سيادي جديد
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. POWER TOOLS BAR (SEARCH, CATEGORY, SORT, BULK) */}
            <div className="space-y-4" dir="rtl">
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="ابحث في أعماق الأرشيف (العنوان أو المقتطف)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 pr-14 pl-8 py-5 rounded-[2rem] text-white text-base outline-none focus:border-indigo-500 transition-all shadow-inner"
                        />
                    </div>

                    <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-[2rem] border border-white/5">
                        <div className="flex items-center gap-1">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    {cat === 'All' ? 'الكل' : cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">ترتيب حسب:</span>
                            <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
                                {[
                                    { id: 'newest', label: 'الأحدث', icon: Calendar },
                                    { id: 'views', label: 'الأكثر مشاهدة', icon: BarChart },
                                    { id: 'seo', label: 'الأفضل SEO', icon: Sparkles },
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSortBy(item.id as any)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${sortBy === item.id ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-300'}`}
                                    >
                                        <item.icon size={14} /> {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => { setIsMultiSelect(!isMultiSelect); setSelectedIds([]); }}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isMultiSelect ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-900 text-slate-500 border border-white/5 hover:text-white'}`}
                        >
                            {isMultiSelect ? 'إلغاء التحديد المتعدد' : 'تحديد متعدد'}
                        </button>

                        {isMultiSelect && selectedIds.length > 0 && (
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 px-6 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-500/10"
                            >
                                <Trash2 size={14} /> حذف ({selectedIds.length})
                            </motion.button>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-slate-600">
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {filteredArticles.length} مخرجات ذكاء
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. ARCHIVE GRID */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            [...Array(6)].map((_, i) => (
                                <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <SkeletonCard />
                                </motion.div>
                            ))
                        ) : filteredArticles.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-slate-900/20"
                            >
                                <Wand2 size={48} className="mx-auto text-slate-800 mb-6" />
                                <h4 className="text-white font-bold text-xl mb-2">لا يوجد محتوى يطابق هذا البحث</h4>
                                <p className="text-slate-500">جرب كلمات دلالية مختلفة أو ابدأ مقالاً جديداً.</p>
                            </motion.div>
                        ) : (
                            filteredArticles.map((art) => (
                                <motion.div
                                    layout
                                    key={art.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={() => isMultiSelect && toggleSelect(art.id)}
                                    className={`group relative bg-slate-900 border rounded-[2.5rem] overflow-hidden transition-all duration-500 flex flex-col ${isMultiSelect && selectedIds.includes(art.id) ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/5 hover:border-indigo-500/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'} ${isMultiSelect ? 'cursor-pointer' : ''}`}
                                >
                                    {/* Multi-select indicator */}
                                    {isMultiSelect && (
                                        <div className="absolute top-6 right-6 z-20">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedIds.includes(art.id) ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-950/50 border-white/20'}`}>
                                                {selectedIds.includes(art.id) && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                        </div>
                                    )}

                                    {/* Image Section */}
                                    <div className="aspect-[16/9] relative overflow-hidden">
                                        <img
                                            src={art.image}
                                            alt=""
                                            className={`w-full h-full object-cover transition-all duration-700 ${isMultiSelect && selectedIds.includes(art.id) ? 'grayscale-0 opacity-100 scale-105' : 'grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                                        {/* Badges Overlay */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            {art.status === 'draft' && (
                                                <span className="px-3 py-1 bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-tighter rounded-full">Draft</span>
                                            )}
                                            {art.content?.startsWith('{"nextjs":true') && (
                                                <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-tighter rounded-full flex items-center gap-1">
                                                    <Layout size={10} /> Next.js
                                                </span>
                                            )}
                                        </div>

                                        {!isMultiSelect && (
                                            <div className="absolute bottom-6 right-6">
                                                <span className="px-4 py-2 bg-slate-950/90 backdrop-blur-md rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-widest border border-white/5 shadow-xl">
                                                    {art.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-8 flex-1 flex flex-col text-right" dir="rtl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase">
                                                    <Eye size={12} /> {art.views || 0}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                                    <Clock size={12} /> {art.readTime || '5m'}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                {new Date(art.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <h4 className={`text-2xl font-black mb-4 transition-all line-clamp-2 leading-[1.3] text-right ${isMultiSelect && selectedIds.includes(art.id) ? 'text-indigo-400' : 'text-white group-hover:text-indigo-400'}`}>
                                            {art.title}
                                        </h4>

                                        <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                                            {art.excerpt || 'لا يوجد وصف مختصر لهذا المقال الاستراتيجي بعد. ابدأ بصياغة مقتطف قوي لزيادة التحويل...'}
                                        </p>

                                        {/* SEO Performance Footer */}
                                        <div className="mt-auto">
                                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-white/5 mb-8 group-hover:bg-slate-950/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-sm border border-indigo-500/20">
                                                        {art.seoScore || 85}
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">Authority Rank</p>
                                                        <p className="text-[10px] text-emerald-400 font-black uppercase">Elite Status</p>
                                                    </div>
                                                </div>
                                                <Sparkles size={16} className="text-amber-500 opacity-50" />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={isMultiSelect}
                                                        onClick={(e) => { e.stopPropagation(); setEditingArticle(art); }}
                                                        className={`p-3 rounded-xl transition-all border border-transparent ${isMultiSelect ? 'opacity-20 ' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/5'}`}
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        disabled={isMultiSelect}
                                                        onClick={(e) => { e.stopPropagation(); if (confirm('متأكد؟')) deleteArticle(art.id); }}
                                                        className={`p-3 rounded-xl transition-all border border-transparent ${isMultiSelect ? 'opacity-20 ' : 'bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/10'}`}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <button
                                                    disabled={isMultiSelect}
                                                    onClick={(e) => { e.stopPropagation(); setEditingArticle(art); }}
                                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group/btn ${isMultiSelect ? 'opacity-20 bg-slate-900 text-slate-800' : 'bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white'}`}
                                                >
                                                    دخول الاستوديو
                                                    <ArrowRight size={14} className="rotate-180 group-hover/btn:-translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Writing Workspace Overlay */}
            {editingArticle && (
                <WritingWorkspace
                    article={editingArticle}
                    aiConfig={aiConfig}
                    onSave={(updatedArticle) => {
                        updateArticle(editingArticle.id!, updatedArticle);
                        // Also update UI buffer to keep modals sync'd if needed
                        setEditingArticle(prev => prev ? { ...prev, ...updatedArticle } : null);
                    }}
                    onClose={() => setEditingArticle(null)}
                />
            )}
        </div>
    );
};

export default BlogManager;
