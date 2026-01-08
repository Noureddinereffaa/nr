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

    // Find the latest version of the article from content context
    const article = useMemo(() =>
        articles?.find(a => a.id === propArticle.id) || propArticle
        , [articles, propArticle]);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [toc, setToc] = useState<{ id: string, text: string, level: number }[]>([]);
    const [activeSection, setActiveSection] = useState<string>('');

    // Get site texts with fallback to defaults
    const siteTexts: SiteTexts = {
        ...DEFAULT_SITE_TEXTS,
        ...(siteData as any).siteTexts
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: shareUrl,
                });
            } catch (error) {
                setShowShareModal(true);
            }
        } else {
            setShowShareModal(true);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = article.slug ? `${baseUrl}/blog/${article.slug}` : `${baseUrl}/?article=${article.id}`;
    const shareText = encodeURIComponent(article.title || '');

    // Dynamic Meta Tags (Client-Fallback)
    useEffect(() => {
        const originalTitle = document.title;
        document.title = `${article.title} | NR-OS Center`;
        return () => {
            document.title = originalTitle;
        };
    }, [article]);

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
                    const top = heading.offsetTop - 100;
                    if (container.scrollTop >= top) {
                        current = heading.id;
                    }
                });
                setActiveSection(current);
            }
        };

        const container = document.getElementById('reader-content');
        container?.addEventListener('scroll', handleScroll);

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
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] bg-indigo-900/20 blur-[180px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[100%] h-[100%] bg-purple-950/20 blur-[200px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex-1 flex flex-col overflow-hidden z-10"
            >
                <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-[110]">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden"
                        style={{ width: `${scrollProgress}%` }}
                    />
                </div>

                <div className="sticky top-0 left-0 right-0 p-3 md:px-16 md:py-6 border-b border-white/5 bg-slate-950/90 backdrop-blur-xl z-[100] flex flex-row-reverse items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 flex flex-col items-end text-right">
                        <h4 className="text-white font-black text-xs md:text-lg leading-tight truncate w-full pl-4" dir="rtl">
                            {article.title}
                        </h4>
                        <p className="text-indigo-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest mt-0.5 md:mt-1 flex items-center gap-2">
                            {article.category} <Target size={10} />
                        </p>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <button onClick={handleShare} className="p-2.5 md:p-3 rounded-xl bg-white/5 hover:bg-indigo-600 text-white transition-all shadow-xl">
                            <Share2 size={16} />
                        </button>
                        <button onClick={onClose} className="p-2.5 md:p-3 rounded-xl bg-white/5 hover:bg-red-500 text-white transition-all shadow-xl">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div id="reader-content" className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar bg-slate-950 relative">
                    <div className="max-w-4xl mx-auto fluid-px py-12 md:py-20">
                        <div className="relative w-full mb-12 rounded-[2rem] overflow-hidden">
                            <img src={article.image} alt={article.title} className="w-full aspect-video object-cover" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="prose prose-invert prose-indigo max-w-none text-right"
                            dir="rtl"
                        >
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        </motion.div>

                        <div className="mt-16 pt-8 border-t border-white/10" dir="rtl">
                            <div className="flex flex-wrap gap-4">
                                {article.tags?.map((tag, idx) => (
                                    <span key={idx} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-300 text-sm font-black">
                                        # {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-20 border-t border-white/5 pt-8 text-center pb-20">
                            <button onClick={onClose} className="text-slate-500 hover:text-white font-black text-sm uppercase tracking-widest flex items-center gap-3 mx-auto transition-colors">
                                <ArrowRight size={18} />
                                عودة للمدونة
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ArticleReader;
