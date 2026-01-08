import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import { useContent } from '../context/ContentContext';
import { useSystem } from '../context/SystemContext';
import { Calendar, Clock, ArrowRight, Search, Sparkles, TrendingUp, Filter, Share2, Newspaper, Zap, Bookmark } from 'lucide-react';
import ArticleReader from '../components/ArticleReader';
import { Article, DEFAULT_SITE_TEXTS, SiteTexts } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const BlogPage: React.FC = () => {
    const { articles } = useContent();
    const { brand } = useSystem();
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [filter, setFilter] = useState('');
    const [activeCategory, setActiveCategory] = useState('الكل');

    // Get site texts with fallback to defaults
    const siteTexts: SiteTexts = DEFAULT_SITE_TEXTS;

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

    const filteredArticles = useMemo(() => {
        return articles
            .filter(a => {
                const title = (a.title || '').toLowerCase();
                const content = (a.content || '').toLowerCase();
                const searchTerm = filter.toLowerCase();
                const matchesFilter = title.includes(searchTerm) || content.includes(searchTerm);
                const matchesCategory = activeCategory === 'الكل' || a.category === activeCategory;
                const isPublished = a.status === 'published';
                return matchesFilter && matchesCategory && isPublished;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [articles, filter, activeCategory]);

    // Priority for Featured: Explicitly featured or the latest published article
    const featuredArticle = useMemo(() => {
        const published = articles.filter(a => a.status === 'published');
        return published.find(a => a.featured) || published.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    }, [articles]);

    const trendingArticles = useMemo(() => {
        return articles
            .filter(a => a.status === 'published' && a.popular)
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
    }, [articles]);

    const latestArticles = useMemo(() => {
        return filteredArticles.filter(a => a.id !== featuredArticle?.id);
    }, [filteredArticles, featuredArticle]);


    return (
        <Layout>
            <div className="pt-20 pb-12 min-h-screen relative overflow-hidden bg-slate-950 animated-bg">

                {/* Cinematic Background Architecture - Enhanced Depth */}
                <div className="absolute inset-0 z-0 mesh-gradient opacity-40"></div>
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] bg-indigo-600/20 blur-[180px] rounded-full animate-pulse-slow"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[100%] h-[100%] bg-purple-900/20 blur-[200px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950"></div>
                </div>

                <div className="container mx-auto relative z-10 px-4 sm:px-6">

                    {/* Magazine Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 sm:mb-12" dir="rtl">
                        <div className="max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[11px] font-black uppercase tracking-[0.4em] mb-8"
                            >
                                <Newspaper size={16} className="text-indigo-500" />
                                {siteTexts.blog.badge}
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-[0.9] uppercase"
                            >
                                {siteTexts.blog.title} <span className="gradient-text drop-shadow-[0_10px_40px_rgba(79,70,229,0.4)]">{siteTexts.blog.titleHighlight}</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-base sm:text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl border-r-4 border-indigo-600 pr-4"
                            >
                                {siteTexts.blog.subtitle}
                            </motion.p>
                        </div>

                        <div className="flex flex-col gap-6 w-full md:w-auto">
                            <div className="relative group">
                                <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={24} />
                                <input
                                    type="text"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    placeholder={siteTexts.blog.searchPlaceholder}
                                    className="w-full md:w-96 bg-slate-900 border border-white/10 rounded-2xl px-6 sm:px-10 py-4 sm:py-5 pr-12 sm:pr-14 text-white focus:border-indigo-600 outline-none transition-all shadow-2xl placeholder:opacity-50 text-base min-h-[56px]"
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
                            className="relative aspect-video md:aspect-[2.4/1] rounded-2xl sm:rounded-3xl md:rounded-[3.5rem] overflow-hidden mb-8 sm:mb-12 group cursor-pointer border border-white/10 shadow-2xl premium-border"
                            onClick={() => handleOpenArticle(featuredArticle)}
                        >
                            <img
                                src={featuredArticle.image}
                                alt={featuredArticle.title}
                                className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-10 md:p-20 flex flex-col items-end text-right" dir="rtl">
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-2xl mb-8"
                                >
                                    {siteTexts.blog.trendingTitle}
                                </motion.span>
                                <h2 className="text-2xl sm:text-3xl md:text-7xl font-black text-white mb-4 sm:mb-8 max-w-5xl leading-[1.05] group-hover:text-indigo-400 transition-colors tracking-tighter">
                                    {featuredArticle.title}
                                </h2>
                                <p className="text-slate-300 text-sm sm:text-lg md:text-2xl max-w-3xl mb-6 sm:mb-10 opacity-80 line-clamp-2 md:line-clamp-3 font-medium">
                                    {featuredArticle.excerpt}
                                </p>
                                <div className="flex items-center gap-6 md:gap-10 text-slate-400 font-black text-[10px] md:text-sm mb-10">
                                    <span className="flex items-center gap-2 md:gap-3"><Calendar size={18} className="text-indigo-500" /> {new Date(featuredArticle.date).toLocaleDateString('ar-EG')}</span>
                                    <span className="flex items-center gap-2 md:gap-3"><Clock size={18} className="text-indigo-500" /> {featuredArticle.readTime}</span>
                                </div>
                                <button className="group px-6 md:px-12 py-3.5 md:py-5 bg-white text-slate-950 rounded-xl md:rounded-2xl font-black text-sm sm:text-base md:text-xl flex items-center gap-4 hover:bg-indigo-600 hover:text-white transition-all shadow-3xl active:scale-95 min-h-[48px]">
                                    {siteTexts.blog.readMore}
                                    <ArrowRight size={24} className="rotate-180 group-hover:translate-x-[-8px] transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Main Grid Architecture */}
                    <div className="flex flex-col lg:flex-row-reverse gap-8">

                        {/* Elite Sidebar - Insights & Trending */}
                        <aside className="lg:w-[30%] space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="glass-card p-6 rounded-2xl sticky top-24 border border-white/5 bg-slate-900/40 backdrop-blur-2xl"
                            >
                                <h3 className="text-2xl font-black text-white mb-10 flex items-center justify-end gap-4" dir="rtl">
                                    {siteTexts.blog.trendingTitle}
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
                                    <h4 className="text-2xl font-black mb-4 leading-tight">{siteTexts.blog.newsletterTitle}</h4>
                                    <p className="text-indigo-100 text-sm mb-8 font-medium">{siteTexts.blog.newsletterSubtitle}</p>
                                    <button className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl min-h-[56px]">
                                        {siteTexts.blog.subscribeButton}
                                    </button>
                                </div>
                            </motion.div>
                        </aside>

                        {/* Primary Grid - Article Reservoir */}
                        <div className="lg:w-[70%]">

                            {/* Category Command Bar */}
                            <div className="flex items-center justify-end gap-3 mb-12 flex-wrap" dir="rtl">
                                <div className="flex items-center gap-3 ml-6 text-slate-500">
                                    <Filter size={20} className="text-indigo-500" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">{siteTexts.blog.categoryLabel}</span>
                                </div>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-4 sm:px-6 py-2.5 rounded-2xl text-[10px] md:text-xs font-black transition-all border min-h-[44px] ${activeCategory === cat
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-3xl'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {cat === 'الكل' ? siteTexts.blog.allCategories : cat}
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
                                            className="group flex flex-col glass-morph rounded-[2rem] md:rounded-[3.5rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-700 cursor-pointer shadow-2xl premium-border"
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

                                            <div className="p-5 sm:p-8 md:p-10 text-right flex-1 flex flex-col bg-slate-900/60" dir="rtl">
                                                <div className="flex items-center gap-4 md:gap-6 text-indigo-400/80 text-[9px] md:text-xs font-black uppercase tracking-widest mb-4 md:mb-6">
                                                    <span className="flex items-center gap-2"><Calendar size={12} className="text-indigo-500 md:w-3.5" /> {new Date(article.date).toLocaleDateString('ar-EG')}</span>
                                                    <span className="flex items-center gap-2"><Clock size={12} className="text-indigo-500 md:w-3.5" /> {article.readTime}</span>
                                                </div>

                                                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6 leading-[1.15] group-hover:text-indigo-400 transition-colors tracking-tight">
                                                    {article.title}
                                                </h3>

                                                <p className="text-slate-300 text-sm md:text-lg line-clamp-3 mb-8 md:mb-10 flex-1 leading-relaxed font-medium opacity-80">
                                                    {article.excerpt}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto pt-6 md:pt-8 border-t border-white/5">
                                                    <div className="flex gap-4">
                                                        <Share2 size={18} className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer" />
                                                        <Bookmark size={18} className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer" />
                                                    </div>
                                                    <span className="flex items-center gap-3 md:gap-4 text-indigo-500 font-black text-xs md:sm group-hover:text-white transition-all">
                                                        {siteTexts.blog.readMore}
                                                        <ArrowRight size={18} className="rotate-180 group-hover:translate-x-[-6px] transition-transform md:w-5" />
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
