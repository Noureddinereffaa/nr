import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useUI } from '../../../context/UIContext';
import {
    FileText, Plus, Trash2, Edit3, CheckCircle,
    ArrowRight, BarChart, Wand2, Search, Filter,
    Eye, Clock, Calendar, Layout, ChevronRight,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WritingWorkspace from './WritingWorkspace';

const BlogManager: React.FC = () => {
    const { siteData, updateArticle, deleteArticle, addArticle } = useData();
    const { openArticleModal } = useUI();
    const { articles, aiConfig } = siteData;

    const [editingArticle, setEditingArticle] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))];

    const filteredArticles = articles.filter(art => {
        const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-12 pb-24">
            {/* 1. STUDIO COMMAND HEADER */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 p-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -mr-20 -mt-20 shrink-0" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="text-right w-full lg:w-2/3">
                        <div className="flex items-center gap-3 justify-end mb-4">
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg border border-indigo-500/20">
                                Digital Empire Hub
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
                            أرشيف السيادة المعرفية
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl ml-auto leading-relaxed">
                            قم بإدارة محتواك الاستراتيجي، راقب تقارير الأداء، وانطلق نحو الريادة في مجالك باستخدام أدوات الاستوديو المتكاملة.
                        </p>
                    </div>
                    <div className="shrink-0">
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
                            className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-3 hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5"
                        >
                            <Plus size={20} /> بدء صياغة مقال سيادي
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. FILTER & SEARCH BAR */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl" dir="rtl">
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="البحث في الأرشيف..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 pr-12 pl-6 py-4 rounded-2xl text-white text-sm outline-none focus:border-indigo-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-2 py-1 max-w-full">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {cat === 'All' ? 'الكل' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. ARCHIVE GRID */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredArticles.length === 0 ? (
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
                                    className="group relative bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
                                >
                                    {/* Image Section */}
                                    <div className="aspect-[16/9] relative overflow-hidden">
                                        <img
                                            src={art.image}
                                            alt=""
                                            className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
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

                                        <div className="absolute bottom-6 right-6">
                                            <span className="px-4 py-2 bg-slate-950/90 backdrop-blur-md rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-widest border border-white/5 shadow-xl">
                                                {art.category}
                                            </span>
                                        </div>
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

                                        <h4 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-400 transition-all line-clamp-2 leading-[1.3] text-right">
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
                                                        onClick={() => setEditingArticle(art)}
                                                        className="p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/5"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('متأكد؟')) deleteArticle(art.id) }}
                                                        className="p-3 bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/10"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => setEditingArticle(art)}
                                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group/btn"
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
