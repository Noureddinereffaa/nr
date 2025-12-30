import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import { useData } from '../context/DataContext';
import { Calendar, Clock, ArrowRight, Search, Sparkles, TrendingUp, Filter, Share2, Newspaper, Zap, Bookmark } from 'lucide-react';
import ArticleReader from '../components/ArticleReader';
import { Article } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const BlogPage: React.FC = () => {
    const { siteData } = useData();
    const articles = useMemo(() => siteData.articles || [], [siteData.articles]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [filter, setFilter] = useState('');
    const [activeCategory, setActiveCategory] = useState('الكل');

    // Deep Linking: Check URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('article');
        if (articleId && articles.length > 0) {
            const targetArticle = articles.find(a => a.id === articleId);
            if (targetArticle) setSelectedArticle(targetArticle);
        }
    }, [articles]);

    const handleOpenArticle = (article: Article) => {
        setSelectedArticle(article);
        window.history.pushState({}, '', `?article=${article.id}`);
    };

    const handleCloseArticle = () => {
        setSelectedArticle(null);
        window.history.pushState({}, '', window.location.pathname);
    };


    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(articles.map(a => a.category).filter(Boolean));
        return ['الكل', ...Array.from(cats)];
    }, [articles]);

    const filteredArticles = useMemo(() => articles.filter(a => {
        const title = a.title || '';
        const content = a.content || '';
        const matchesFilter = title.includes(filter) || content.includes(filter);
        const matchesCategory = activeCategory === 'الكل' || a.category === activeCategory;
        return matchesFilter && matchesCategory;
    }), [articles, filter, activeCategory]);

    const featuredArticle = useMemo(() => articles.find(a => a.featured) || articles[0], [articles]);
    const trendingArticles = useMemo(() => articles.filter(a => a.popular).slice(0, 5), [articles]);
    const latestArticles = useMemo(() => filteredArticles.filter(a => a.id !== featuredArticle?.id), [filteredArticles, featuredArticle]);

    return (
        <Layout>
            <div className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-slate-950 animated-bg">

                {/* Cinematic Background Architecture - Enhanced Depth */}
                <div className="absolute inset-0 z-0 mesh-gradient opacity-40"></div>
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] bg-indigo-600/20 blur-[180px] rounded-full animate-pulse-slow"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[100%] h-[100%] bg-purple-900/20 blur-[200px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">

                    {/* Magazine Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20" dir="rtl">
                        <div className="max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[11px] font-black uppercase tracking-[0.4em] mb-8"
                            >
                                <Newspaper size={16} className="text-indigo-500" />
                                Sovereign Intelligence Hub 2025
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-[12rem] font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase"
                            >
                                مركز <span className="gradient-text drop-shadow-[0_10px_40px_rgba(79,70,229,0.4)]">المعرفة</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl md:text-4xl text-slate-300 font-medium leading-relaxed max-w-4xl border-r-8 border-indigo-600 pr-8"
                            >
                                تحليلات استراتيجية ورؤى هندسية لصناعة الفارق في الاقتصاد الرقمي الحديث.
                            </motion.p>
                        </div>

                        <div className="flex flex-col gap-6 w-full md:w-auto">
                            <div className="relative group">
                                <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={24} />
                                <input
                                    type="text"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    placeholder="ابحث في الأرشيف الذكي..."
                                    className="w-full md:w-96 bg-slate-900 border border-white/10 rounded-2xl px-10 py-5 pr-14 text-white focus:border-indigo-600 outline-none transition-all shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Featured Hero Article */}
                    {!filter && activeCategory === 'الكل' && featuredArticle && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative aspect-[21/9] rounded-[4rem] overflow-hidden mb-24 group cursor-pointer border border-white/10 shadow-3xl"
                            onClick={() => handleOpenArticle(featuredArticle)}
                        >
                            <img
                                src={featuredArticle.image}
                                alt={featuredArticle.title}
                                className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                            <div className="absolute bottom-0 inset-x-0 p-10 md:p-20 flex flex-col items-end text-right" dir="rtl">
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl mb-8"
                                >
                                    الافتتاحية الاستراتيجية
                                </motion.span>
                                <h2 className="text-4xl md:text-7xl font-black text-white mb-8 max-w-5xl leading-[1.05] group-hover:text-indigo-400 transition-colors tracking-tighter">
                                    {featuredArticle.title}
                                </h2>
                                <p className="text-slate-300 text-xl md:text-2xl max-w-3xl mb-10 opacity-80 line-clamp-2 font-medium">
                                    {featuredArticle.excerpt}
                                </p>
                                <div className="flex items-center gap-10 text-slate-400 font-black text-sm mb-10">
                                    <span className="flex items-center gap-3"><Calendar size={20} className="text-indigo-500" /> {new Date(featuredArticle.date).toLocaleDateString('ar-EG')}</span>
                                    <span className="flex items-center gap-3"><Clock size={20} className="text-indigo-500" /> {featuredArticle.readTime}</span>
                                </div>
                                <button className="group px-12 py-5 bg-white text-slate-950 rounded-2xl font-black text-xl flex items-center gap-5 hover:bg-indigo-600 hover:text-white transition-all shadow-3xl active:scale-95">
                                    تحليل المقال الكامل
                                    <ArrowRight size={24} className="rotate-180 group-hover:translate-x-[-8px] transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Main Grid Architecture */}
                    <div className="flex flex-col lg:flex-row-reverse gap-16">

                        {/* Elite Sidebar - Insights & Trending */}
                        <aside className="lg:w-[30%] space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="glass-card p-10 rounded-[3.5rem] sticky top-32 border border-white/5 bg-slate-900/40 backdrop-blur-2xl"
                            >
                                <h3 className="text-2xl font-black text-white mb-10 flex items-center justify-end gap-4" dir="rtl">
                                    الأكثر تأثيراً
                                    <TrendingUp className="text-indigo-500" size={28} />
                                </h3>
                                <div className="space-y-10">
                                    {trendingArticles.map((article, idx) => (
                                        <div
                                            key={article.id}
                                            className="group cursor-pointer flex flex-col items-end text-right border-b border-white/5 pb-8 last:border-0 last:pb-0" dir="rtl"
                                            onClick={() => handleOpenArticle(article)}
                                        >
                                            <span className="text-indigo-600 font-black text-sm mb-3">#0{idx + 1}</span>
                                            <h4 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
                                                {article.title}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                <span className="flex items-center gap-2"><Clock size={12} /> {article.readTime}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600/30"></div>
                                                <span className="text-indigo-400">{article.category}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-16 p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <Sparkles size={32} className="mb-6 opacity-40" />
                                    <h4 className="text-2xl font-black mb-4 leading-tight">انضم إلى مجتمع النخبة الرقمية</h4>
                                    <p className="text-indigo-100 text-sm mb-8 font-medium">احصل على تحليلات استراتيجية أسبوعية لا تتوفر للعموم.</p>
                                    <button className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl">
                                        الاشتراك في النشرة
                                    </button>
                                </div>
                            </motion.div>
                        </aside>

                        {/* Primary Grid - Article Reservoir */}
                        <div className="lg:w-[70%]">

                            {/* Category Command Bar */}
                            <div className="flex items-center justify-end gap-4 mb-16 flex-wrap" dir="rtl">
                                <div className="flex items-center gap-3 ml-6 text-slate-500">
                                    <Filter size={20} className="text-indigo-500" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">تصنيف الرؤى:</span>
                                </div>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-8 py-3 rounded-2xl text-xs font-black transition-all border ${activeCategory === cat
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-3xl'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <AnimatePresence mode="popLayout">
                                    {latestArticles.map((article, i) => (
                                        <motion.div
                                            key={article.id}
                                            layout
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => handleOpenArticle(article)}
                                            className="group flex flex-col glass-morph rounded-[3.5rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-700 cursor-pointer shadow-2xl premium-border"
                                        >
                                            <div className="aspect-[16/10] overflow-hidden relative">
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                                                />
                                                <div className="absolute top-8 right-8">
                                                    <div className="bg-indigo-600/90 backdrop-blur-xl px-4 py-1.5 rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 shadow-2xl">
                                                        {article.category}
                                                    </div>
                                                </div>
                                                {article.featured && (
                                                    <div className="absolute top-8 left-8">
                                                        <Zap size={20} className="text-yellow-400 drop-shadow-glow" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-10 text-right flex-1 flex flex-col bg-slate-900/60" dir="rtl">
                                                <div className="flex items-center gap-6 text-indigo-400/80 text-[10px] md:text-xs font-black uppercase tracking-widest mb-6">
                                                    <span className="flex items-center gap-2"><Calendar size={14} className="text-indigo-500" /> {new Date(article.date).toLocaleDateString('ar-EG')}</span>
                                                    <span className="flex items-center gap-2"><Clock size={14} className="text-indigo-500" /> {article.readTime}</span>
                                                </div>

                                                <h3 className="text-3xl font-black text-white mb-6 leading-[1.15] group-hover:text-indigo-400 transition-colors tracking-tight">
                                                    {article.title}
                                                </h3>

                                                <p className="text-slate-300 text-lg line-clamp-3 mb-10 flex-1 leading-relaxed font-medium opacity-80">
                                                    {article.excerpt}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                                                    <div className="flex gap-4">
                                                        <Share2 size={20} className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer" />
                                                        <Bookmark size={20} className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer" />
                                                    </div>
                                                    <span className="flex items-center gap-4 text-indigo-500 font-black text-sm group-hover:text-white transition-all">
                                                        استكشاف التحليل
                                                        <ArrowRight size={20} className="rotate-180 group-hover:translate-x-[-6px] transition-transform" />
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {selectedArticle && <ArticleReader article={selectedArticle} onClose={handleCloseArticle} />}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default BlogPage;
