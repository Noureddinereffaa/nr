import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useSystem } from '../context/SystemContext';
import { BookOpen, ArrowLeft, Clock, User, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from '../types';
import ArticleReader from './ArticleReader';

const StrategicBlog: React.FC = () => {
    const { articles } = useContent();
    const { brand } = useSystem();
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // Priority: Featured first, then by date. Only show published.
    // Priority Selection: Show published if available, otherwise show any to avoid empty section.
    const allArticles = articles || [];
    let displayArticles = [...allArticles]
        .filter(a => a.status === 'published')
        .sort((a, b) => {
            const aFeat = a.featured ? 1 : 0;
            const bFeat = b.featured ? 1 : 0;
            if (aFeat !== bFeat) return bFeat - aFeat;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

    if (displayArticles.length === 0 && allArticles.length > 0) {
        displayArticles = [...allArticles]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
    } else {
        displayArticles = displayArticles.slice(0, 3);
    }

    const templateId = brand?.templateId || 'premium-glass';
    const isCyber = templateId === 'cyber-command';
    const isMinimalist = templateId === 'minimalist-pro';

    if (displayArticles.length === 0) return null;

    return (
        <section id="blog" className={`py-16 md:py-24 relative overflow-hidden ${isMinimalist ? 'bg-white' : 'bg-slate-950/40'}`}>
            {/* Ambient Background Elements */}
            {!isMinimalist && (
                <>
                    <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[rgba(var(--accent-indigo-rgb),0.05)] blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                </>
            )}

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
                    <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-[0.4em] mb-8 ${isCyber ? 'bg-green-500/10 border-green-500/20 text-green-500' : isMinimalist ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-[rgba(var(--accent-indigo-rgb),0.1)] border-[rgba(var(--accent-indigo-rgb),0.2)] text-[var(--accent-indigo)]'
                        }`}>
                        <Sparkles size={14} className="animate-pulse" />
                        Intelligence Insights
                    </div>
                    <h2 className={`text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1] ${isMinimalist ? 'text-slate-950' : 'text-white'}`}>
                        المدونة <span className={isMinimalist ? 'text-indigo-600' : 'gradient-text'}>الاستراتيجية</span> <br /> لعصر الذكاء الاصطناعي
                    </h2>
                    <p className={`text-lg md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium opacity-80 ${isMinimalist ? 'text-slate-600' : 'text-slate-400'}`}>
                        حلول، رؤى، وتحليلات عميقة لتمكين مشروعك الرقمي من السيادة الكاملة في السوق.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayArticles.map((article, i) => (
                        <article
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className="group relative bg-slate-900/40 border border-white/5 rounded-[2rem] md:rounded-[var(--border-radius-elite)] overflow-hidden hover:border-indigo-500/50 transition-all duration-700 hover:-translate-y-2 flex flex-col h-full cursor-pointer glass-morph"
                        >
                            {article.featured && (
                                <div className="absolute top-0 right-0 z-20">
                                    <div className="bg-indigo-600 text-white px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-bl-xl shadow-xl">
                                        Featured
                                    </div>
                                </div>
                            )}
                            {/* Card Image */}
                            <div className="aspect-[16/10] relative overflow-hidden">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                                <div className="absolute top-6 right-6">
                                    <span className="px-4 py-1.5 bg-[var(--accent-indigo)] backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        {article.category}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 md:p-10 flex-1 flex flex-col text-right" dir="rtl">
                                <div className="flex items-center gap-4 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-6">
                                    <div className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(article.date).toLocaleDateString('ar-EG')}</div>
                                    <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                                    <div className="flex items-center gap-1.5"><Clock size={12} /> {article.readTime}</div>
                                </div>

                                <h3 className="text-xl md:text-2xl font-black text-white mb-4 leading-tight group-hover:text-[var(--accent-indigo)] transition-colors">
                                    {article.title}
                                </h3>

                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-8 line-clamp-3">
                                    {article.excerpt}
                                </p>

                                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedArticle(article);
                                        }}
                                        className="flex items-center gap-3 text-white font-black text-sm group/btn hover:text-[var(--accent-indigo)] transition-colors"
                                    >
                                        <ArrowLeft size={18} className="transition-transform group-hover/btn:-translate-x-2" />
                                        اقرأ المقال الكامل
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-[var(--accent-indigo)] uppercase tracking-widest">Noureddine</span>
                                        <div className="w-6 h-6 rounded-full bg-[rgba(var(--accent-indigo-rgb),0.2)] flex items-center justify-center border border-[rgba(var(--accent-indigo-rgb),0.2)]">
                                            <User size={12} className="text-[var(--accent-indigo)]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <button
                        onClick={() => window.location.href = '/blog'}
                        className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-lg border border-white/10 transition-all active:scale-95 glass-effect flex items-center justify-center gap-3 mx-auto"
                    >
                        <BookOpen size={20} className="text-indigo-400" />
                        تصفح جميع المقالات الاستراتيجية
                    </button>
                </div>
            </div>

            {/* Premium Article Reader Overlay */}
            <AnimatePresence mode="wait">
                {selectedArticle && (
                    <ArticleReader
                        article={selectedArticle}
                        onClose={() => setSelectedArticle(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default StrategicBlog;
