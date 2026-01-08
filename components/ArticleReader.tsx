import React, { useEffect, useState, useMemo } from 'react';
import { Article, DEFAULT_SITE_TEXTS, SiteTexts } from '../types';
import { X, Clock, User, Calendar, Share2, Bookmark, ArrowRight, Sparkles, Tag, Target, Globe, Shield, Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { useSystem } from '../context/SystemContext';

interface ArticleReaderProps {
    article: Article;
    onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ article: propArticle, onClose }) => {
    const { articles } = useContent();
    const { siteData } = useSystem();

    const article = useMemo(() =>
        articles?.find(a => a.id === propArticle.id) || propArticle
        , [articles, propArticle]);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [toc, setToc] = useState<{ id: string, text: string, level: number }[]>([]);
    const [activeSection, setActiveSection] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiSummary, setAiSummary] = useState<string | null>(null);

    const siteTexts: SiteTexts = {
        ...DEFAULT_SITE_TEXTS,
        ...(siteData as any).siteTexts
    };

    const generateAiSummary = async () => {
        if (aiSummary || isAiLoading) return;
        setIsAiLoading(true);
        try {
            const resp = await fetch('/api/ai/forge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stage: 'summarize',
                    apiKey: siteData.aiConfig.apiKey,
                    payload: {
                        title: article.title,
                        content: article.content
                    }
                })
            });
            const data = await resp.json();
            if (resp.ok) setAiSummary(data.result);
        } catch (error) {
            console.error("AI Summary Error:", error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleShare = async () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const shareUrl = article.slug ? `${baseUrl}/blog/${article.slug}` : `${baseUrl}/?article=${article.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: shareUrl,
                });
            } catch (error) {
                navigator.clipboard.writeText(shareUrl);
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const container = document.getElementById('reader-content');
            if (container) {
                const totalHeight = container.scrollHeight - container.clientHeight;
                const progress = (container.scrollTop / totalHeight) * 100;
                setScrollProgress(progress);

                const headings = container.querySelectorAll('h2, h3');
                let current = '';
                headings.forEach((heading: any) => {
                    const top = heading.offsetTop - 150;
                    if (container.scrollTop >= top) {
                        current = heading.id;
                    }
                });
                setActiveSection(current);
            }
        };

        const container = document.getElementById('reader-content');
        container?.addEventListener('scroll', handleScroll);

        // Generate TOC
        const headings = container?.querySelectorAll('h2, h3') || [];
        const tocItems: { id: string, text: string, level: number }[] = [];
        headings.forEach((h: any, i) => {
            if (!h.id) h.id = `section-${i}`;
            tocItems.push({
                id: h.id,
                text: h.innerText,
                level: h.tagName === 'H2' ? 2 : 3
            });
        });
        setToc(tocItems);
        document.body.style.overflow = 'hidden';

        return () => {
            container?.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'unset';
        };
    }, [article.content]);

    return (
        <div className="fixed inset-0 z-[20000] flex flex-col bg-slate-950">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] bg-indigo-900/10 blur-[180px] rounded-full"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[100%] h-[100%] bg-purple-950/10 blur-[200px] rounded-full"></div>
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex-1 flex flex-col overflow-hidden z-10"
            >
                {/* Progress Bar */}
                <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-[210]">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                        style={{ width: `${scrollProgress}%` }}
                    />
                </div>

                {/* Navigation Header */}
                <header className="sticky top-0 w-full px-3 py-3 md:px-12 md:py-6 border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl z-[200] flex items-center justify-between gap-2 md:gap-8">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={onClose}
                            className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="إغلاق"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 hover:bg-indigo-600/10 text-slate-400 hover:text-indigo-400 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="مشاركة"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col items-end text-right">
                        <h4 className="text-white font-black text-xs sm:text-sm md:text-xl truncate w-full" dir="rtl">{article.title}</h4>
                        <div className="hidden sm:flex items-center gap-3 text-indigo-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                            <span className="flex items-center gap-1.5"><Clock size={12} /> {article.readTime}</span>
                            <span className="w-1 h-1 rounded-full bg-indigo-900/40"></span>
                            <span className="flex items-center gap-1.5">{article.category} <Target size={12} /></span>
                        </div>
                    </div>
                </header>

                <div id="reader-content" className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-12 md:py-24">
                        <div className="grid lg:grid-cols-12 gap-8 md:gap-16 lg:gap-24">

                            {/* Sticky Sidebar / Table of Contents */}
                            <aside className="lg:col-span-4 order-2 lg:order-1 hidden lg:block">
                                <div className="sticky top-32 space-y-12 text-right" dir="rtl">
                                    {/* AI Summary Box */}
                                    <div className="p-8 rounded-[2rem] bg-indigo-600/5 border border-indigo-600/20 relative overflow-hidden group">
                                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-600/10 blur-3xl group-hover:bg-indigo-600/20 transition-all"></div>
                                        <div className="flex items-center justify-between mb-6">
                                            <Sparkles size={20} className="text-indigo-400 animate-pulse" />
                                            <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Sovereign AI Summary</h5>
                                        </div>

                                        {!aiSummary && !isAiLoading && (
                                            <button
                                                onClick={generateAiSummary}
                                                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95"
                                            >
                                                لخص المقال رقمياً <Zap size={14} />
                                            </button>
                                        )}

                                        {isAiLoading && (
                                            <div className="space-y-3 animate-pulse">
                                                <div className="h-2 bg-indigo-600/20 rounded-full w-full"></div>
                                                <div className="h-2 bg-indigo-600/20 rounded-full w-3/4 mr-auto"></div>
                                                <div className="h-2 bg-indigo-600/20 rounded-full w-5/6"></div>
                                            </div>
                                        )}

                                        {aiSummary && (
                                            <motion.ul
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="space-y-4 text-slate-300 text-sm font-medium leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: aiSummary }}
                                            />
                                        )}
                                    </div>

                                    {/* TOC Section */}
                                    <div className="space-y-6">
                                        <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mr-4 border-r-2 border-indigo-600 pr-4">فهرس الاستراتيجية</h5>
                                        <nav className="flex flex-col gap-4">
                                            {toc.map((item) => (
                                                <a
                                                    key={item.id}
                                                    href={`#${item.id}`}
                                                    className={`text-sm font-bold transition-all hover:text-white ${activeSection === item.id
                                                        ? 'text-indigo-400 translate-x-[-8px]'
                                                        : 'text-slate-500 hover:translate-x-[-4px]'
                                                        } ${item.level === 3 ? 'text-xs opacity-80 pr-6' : ''}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                >
                                                    {item.text}
                                                </a>
                                            ))}
                                        </nav>
                                    </div>

                                    {/* Quick CTA */}
                                    <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5">
                                        <p className="text-xs text-slate-400 font-bold mb-6 leading-relaxed">هل لديك مشروع يتطلب هذا النوع من العمق الاستراتيجي؟</p>
                                        <button className="w-full py-5 rounded-2xl bg-white text-slate-950 font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3">
                                            استشارة فورية <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </aside>

                            {/* Main Narrative Column */}
                            <main className="lg:col-span-8 order-1 lg:order-2">
                                <div className="space-y-8 sm:space-y-12 md:space-y-16">
                                    {/* Cover Image & Intro Row */}
                                    <div className="space-y-6 sm:space-y-8 md:space-y-12">
                                        <div className="relative aspect-video rounded-2xl sm:rounded-3xl md:rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
                                            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                                        </div>

                                        <div className="text-right" dir="rtl">
                                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter mb-4 sm:mb-6 md:mb-8">
                                                {article.title}
                                            </h1>
                                            <p className="text-base sm:text-lg md:text-2xl text-slate-400 font-medium leading-relaxed italic border-r-2 sm:border-r-4 border-indigo-600 pr-4 sm:pr-6 md:pr-8">
                                                {article.excerpt}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Dynamic Content Stream */}
                                    <motion.article
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="prose prose-invert prose-indigo max-w-none text-right"
                                        dir="rtl"
                                    >
                                        <div className="article-body-professional" dangerouslySetInnerHTML={{ __html: article.content }} />
                                    </motion.article>

                                    {/* Author Signature & Tags */}
                                    <footer className="pt-12 sm:pt-16 md:pt-20 border-t border-white/5 space-y-8 sm:space-y-10 md:space-y-12" dir="rtl">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 bg-slate-900/50 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[3rem] border border-white/5">
                                            <div className="flex items-center gap-4 sm:gap-6">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl">
                                                    <User size={24} className="sm:hidden" />
                                                    <User size={32} className="hidden sm:block" />
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">بقلم العضو المنتدب</p>
                                                    <p className="text-base sm:text-lg md:text-xl font-black text-white">{article.author || 'Noureddine Reffaa'}</p>
                                                </div>
                                            </div>
                                            <button className="w-full md:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl sm:rounded-2xl text-white font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 sm:gap-3 min-h-[44px]">
                                                متابعة الرؤى الاستراتيجية <TrendingUp size={16} className="sm:w-[18px] sm:h-[18px] text-indigo-400" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-end">
                                            {article.tags?.map((tag, idx) => (
                                                <span key={idx} className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl bg-slate-900 border border-white/5 text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:border-indigo-500/50 transition-colors cursor-default">
                                                    # {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </footer>
                                </div>
                            </main>

                        </div>
                    </div>

                    {/* Footer Progress & Close */}
                    <div className="mt-12 sm:mt-16 md:mt-20 border-t border-white/5 bg-slate-900/30 py-12 sm:py-16 md:py-20 text-center px-4">
                        <button onClick={onClose} className="group flex items-center justify-center gap-3 sm:gap-4 mx-auto p-4 sm:p-5 md:p-6 rounded-full bg-indigo-600 text-white shadow-3xl hover:px-8 sm:hover:px-10 md:hover:px-12 transition-all active:scale-95 min-h-[56px]">
                            <ArrowRight size={20} className="sm:w-[24px] sm:h-[24px] group-hover:translate-x-2 transition-transform" />
                            <span className="font-black text-sm sm:text-base md:text-lg uppercase tracking-widest">إنهاء القراءة والعودة</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .article-body-professional h2 {
                    font-size: clamp(1.5rem, 4vw, 2.25rem);
                    font-weight: 900;
                    margin-top: clamp(2rem, 5vw, 4rem);
                    margin-bottom: clamp(1rem, 3vw, 2rem);
                    color: white;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                }
                .article-body-professional h3 {
                    font-size: clamp(1.125rem, 3vw, 1.5rem);
                    font-weight: 900;
                    margin-top: clamp(1.5rem, 4vw, 3rem);
                    margin-bottom: clamp(0.75rem, 2vw, 1.5rem);
                    color: #818cf8;
                }
                .article-body-professional p {
                    font-size: clamp(0.9375rem, 2vw, 1.125rem);
                    line-height: 1.8;
                    margin-bottom: clamp(1.25rem, 3vw, 2.5rem);
                    color: #94a3b8;
                    font-weight: 500;
                }
                .article-body-professional ul {
                    margin-bottom: clamp(1.5rem, 3vw, 3rem);
                    padding-right: clamp(0.75rem, 2vw, 1.5rem);
                    list-style: none;
                }
                .article-body-professional li {
                    position: relative;
                    padding-right: clamp(1rem, 2.5vw, 2rem);
                    margin-bottom: clamp(0.5rem, 1.5vw, 1rem);
                    font-size: clamp(0.9375rem, 2vw, 1.125rem);
                    color: #cbd5e1;
                }
                .article-body-professional li::before {
                    content: "";
                    position: absolute;
                    right: 0;
                    top: 10px;
                    width: 8px;
                    height: 8px;
                    background: #4f46e5;
                    border-radius: 2px;
                    transform: rotate(45deg);
                }
                .article-body-professional blockquote {
                    border-right: 4px solid #4f46e5;
                    padding: clamp(1rem, 3vw, 2rem) clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1rem);
                    margin: clamp(2rem, 5vw, 4rem) 0;
                    background: rgba(79, 70, 229, 0.05);
                    border-radius: 0 1rem 1rem 0;
                    font-size: clamp(1rem, 3vw, 1.5rem);
                    font-style: italic;
                    color: white;
                    font-weight: 700;
                }
                @media (max-width: 640px) {
                    .article-body-professional {
                        font-size: 16px; /* Prevent zoom on iOS */
                    }
                }
            `}</style>
        </div>
    );
};

export default ArticleReader;
