import React, { useEffect, useState, useMemo } from 'react';
import { Article, DEFAULT_SITE_TEXTS, SiteTexts } from '../types';
import { X, Clock, User, Calendar, Share2, Bookmark, ArrowRight, Sparkles, Tag, Target, Globe, Shield, Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';

interface ArticleReaderProps {
    article: Article;
    onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onClose }) => {
    const { siteData } = useData();
    const articles = useMemo(() => siteData.articles || [], [siteData.articles]);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Get site texts with fallback to defaults
    const siteTexts: SiteTexts = {
        ...DEFAULT_SITE_TEXTS,
        ...(siteData as any).siteTexts
    };

    const handleShare = async () => {
        const shareData = {
            title: article.title,
            text: article.excerpt,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            setShowShareModal(true);
        }
    };

    const copyToClipboard = () => {
        // Copy the Proxy URL to ensure social previews work when pasted
        navigator.clipboard.writeText(cleanUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    // Safe access to window/props in render
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    // Construct Proxy Share URL (Server-Side Generator)
    // This passes metadata to the /api/social-share endpoint which renders the correct meta tags then redirects
    const getProxyShareUrl = () => {
        if (typeof window === 'undefined') return '';
        const baseUrl = window.location.origin;
        // Ensure Image is Absolute URL
        const absoluteImage = article.image.startsWith('http')
            ? article.image
            : `${baseUrl}${article.image.startsWith('/') ? '' : '/'}${article.image}`;

        const params = new URLSearchParams({
            title: article.title,
            image: absoluteImage,
            desc: article.excerpt,
            url: currentUrl // The destination deep link
        });
        return `${baseUrl}/api/social-share?${params.toString()}`;
    };

    const shareUrl = getProxyShareUrl(); // Use proxy for social sharing
    // CRITICAL FIX: Use the Proxy URL for clipboard actions too, so users pasting into Facebook get the preview.
    // The proxy will handle the redirect to the actual article.
    const cleanUrl = shareUrl;
    const shareText = encodeURIComponent(article.title || '');

    // Dynamic Meta Tags (Client-Fallback)
    useEffect(() => {
        // Store original values
        const originalTitle = document.title;
        const metaTags = {
            'og:title': getMetaContent('og:title'),
            'og:description': getMetaContent('og:description'),
            'og:image': getMetaContent('og:image'),
            'twitter:title': getMetaContent('twitter:title'),
            'twitter:description': getMetaContent('twitter:description'),
            'twitter:image': getMetaContent('twitter:image'),
        };

        // Update values
        document.title = `${article.title} | NR-OS Center`;
        setMetaTag('og:title', article.title);
        setMetaTag('og:description', article.excerpt);
        setMetaTag('og:image', article.image); // Ensure this is an absolute URL if possible
        setMetaTag('twitter:title', article.title);
        setMetaTag('twitter:description', article.excerpt);
        setMetaTag('twitter:image', article.image);

        return () => {
            // Restore original values
            document.title = originalTitle;
            Object.entries(metaTags).forEach(([key, value]) => {
                if (value) setMetaTag(key, value);
            });
        };
    }, [article]);

    // Helper to get meta content
    function getMetaContent(property: string) {
        return document.querySelector(`meta[property="${property}"]`)?.getAttribute('content') ||
            document.querySelector(`meta[name="${property}"]`)?.getAttribute('content');
    }

    // Helper to set meta content
    function setMetaTag(property: string, content: string) {
        let tag = document.querySelector(`meta[property="${property}"]`) ||
            document.querySelector(`meta[name="${property}"]`);

        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(property.startsWith('twitter') ? 'name' : 'property', property);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }

    useEffect(() => {
        const handleScroll = () => {
            const container = document.getElementById('reader-content');
            if (container) {
                const totalHeight = container.scrollHeight - container.clientHeight;
                const progress = (container.scrollTop / totalHeight) * 100;
                setScrollProgress(progress);
            }
        };

        const container = document.getElementById('reader-content');
        container?.addEventListener('scroll', handleScroll);

        // Prevent background scroll
        document.body.style.overflow = 'hidden';

        return () => {
            container?.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[20000] flex flex-col bg-slate-950">
            {/* Ambient Background - Deep Intelligence Layering */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] bg-indigo-900/20 blur-[180px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[100%] h-[100%] bg-purple-950/20 blur-[200px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xl"></div>
            </div>

            {/* Reader Container - Full Page Architecture */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex-1 flex flex-col overflow-hidden z-10"
            >
                {/* Progress System - Fixed to Top */}
                <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-[110]">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden"
                        style={{ width: `${scrollProgress}%` }}
                    >
                        <div className="absolute inset-0 bg-shimmer opacity-30"></div>
                    </motion.div>
                </div>

                {/* Dynamic Header - Sovereign Control */}
                <div className="sticky top-0 left-0 right-0 p-4 md:px-16 md:py-6 border-b border-white/5 bg-slate-950/90 backdrop-blur-xl z-[100] flex flex-row-reverse items-center justify-between gap-4">

                    {/* Right: Title & Category (RTL) */}
                    <div className="flex-1 min-w-0 flex flex-col items-end text-right">
                        <h4 className="text-white font-black text-sm md:text-lg leading-tight truncate w-full pl-4" dir="rtl">
                            {article.title}
                        </h4>
                        <p className="text-indigo-500 text-[9px] font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                            {article.category} <Target size={10} />
                        </p>
                    </div>

                    {/* Left: Actions (LTR visual order: Share then Close) */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden lg:flex flex-col items-start border-l border-white/10 pl-6 ml-2 text-left">
                            <span className="text-white font-black text-xs uppercase tracking-widest">Noureddine</span>
                            <span className="text-slate-500 text-[10px] font-black tracking-widest mt-1">Sovereign Expert</span>
                        </div>

                        <button
                            onClick={handleShare}
                            className="p-3 rounded-xl bg-white/5 hover:bg-indigo-600 text-white transition-all shadow-xl relative group"
                        >
                            <Share2 size={18} />
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {siteTexts.common.viewAll}
                            </span>
                        </button>

                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                            title={siteTexts.common.close}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Cinematic Scroll Content */}
                <div
                    id="reader-content"
                    className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar bg-slate-950"
                >
                    {/* Immersive Cover Image & Hero Section */}
                    <div className="relative w-full flex flex-col md:block">
                        {/* Image Container - Stacked on Mobile, Absolute Cover on Desktop */}
                        <div className="relative w-full h-[40vh] md:h-[85vh] md:absolute md:inset-0 z-0">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                                loading="eager"
                                fetchPriority="high"
                            />
                            {/* Desktop Overlay Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent hidden md:block"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 to-transparent hidden md:block"></div>

                            {/* Mobile Bottom Fade */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent md:hidden"></div>
                        </div>

                        {/* Content Container - Relative Content on Mobile, Absolute Overlay on Desktop */}
                        <div className="relative z-10 md:h-[85vh] flex flex-col items-center justify-end px-6 pb-6 md:pb-20 md:px-10 max-w-5xl mx-auto text-center -mt-8 md:mt-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-4 px-5 py-2 md:px-6 md:py-2.5 rounded-full bg-indigo-600 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-12 shadow-[0_0_40px_rgba(79,70,229,0.5)] border border-white/20"
                            >
                                <Shield size={14} className="md:w-4 md:h-4" />
                                {siteTexts.blog.badge}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight md:leading-[0.95] mb-6 md:mb-10 tracking-tighter drop-shadow-xl"
                            >
                                {article.title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap items-center justify-center gap-6 md:gap-14 text-slate-300 font-bold text-[10px] md:text-sm border-t border-white/10 pt-8 md:pt-14 w-full"
                            >
                                <div className="flex items-center gap-2 md:gap-3 text-indigo-400">
                                    <Calendar size={14} className="md:w-[18px]" />
                                    {new Date(article.date).toLocaleDateString('ar-EG')}
                                </div>
                                <div className="flex items-center gap-2 md:gap-3 text-indigo-400">
                                    <Clock size={14} className="md:w-[18px]" />
                                    {article.readTime}
                                </div>
                                <div className="flex items-center gap-2 md:gap-3 text-emerald-400">
                                    <Zap size={14} className="md:w-[18px]" />
                                    {siteTexts.blog.titleHighlight}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Elite Content Body - Readability Focus */}
                    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="prose prose-invert prose-indigo max-w-none text-right"
                            dir="rtl"
                        >
                            {article.content.startsWith('{"nextjs":true') ? (
                                (() => {
                                    try {
                                        const project = JSON.parse(article.content);
                                        return <div dangerouslySetInnerHTML={{ __html: project.files['page.tsx'] }} />;
                                    } catch (e) {
                                        return <div dangerouslySetInnerHTML={{ __html: article.content }} />;
                                    }
                                })()
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: article.content }} />
                            )}
                        </motion.div>

                        {/* Tags Architecture */}
                        <div className="mt-16 pt-8 border-t border-white/10" dir="rtl">
                            <h4 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
                                <Sparkles className="text-indigo-500" size={28} />
                                {siteTexts.blog.categoryLabel}
                            </h4>
                            <div className="flex flex-wrap gap-4">
                                {article.tags.map((tag, idx) => (
                                    <span key={idx} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-300 text-base font-black hover:border-indigo-600 hover:text-indigo-400 transition-all cursor-default shadow-xl">
                                        # {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Strategic Conversion Engine - High Profile CTA */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 md:mt-24 p-6 md:p-16 rounded-[3rem] bg-indigo-600 text-white text-center relative group overflow-hidden shadow-[0_40px_100px_rgba(79,70,229,0.4)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute top-0 right-0 w-full h-3 bg-white/20"></div>

                            <h3 className="text-3xl md:text-6xl font-black mb-6 md:mb-10 tracking-tighter leading-tight relative z-10" dir="rtl">
                                {siteTexts.contact.title}
                            </h3>
                            <p className="text-indigo-100 text-lg md:text-2xl mb-10 md:mb-16 max-w-4xl mx-auto leading-relaxed font-medium relative z-10" dir="rtl">
                                {siteTexts.contact.subtitle}
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 relative z-10" dir="rtl">
                                <a
                                    href={article.ctaWhatsApp || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full md:w-auto bg-white text-slate-950 px-8 md:px-16 py-5 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:scale-105 active:scale-95 transition-all shadow-4xl flex items-center justify-center gap-4 group/btn"
                                >
                                    {siteTexts.contact.whatsappCta}
                                    <Sparkles size={20} className="text-indigo-600 group-hover/btn:animate-pulse" />
                                </a>

                                {article.ctaDownloadUrl && (
                                    <a
                                        href={article.ctaDownloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full md:w-auto bg-indigo-500/30 backdrop-blur-md text-white border border-white/20 px-8 md:px-12 py-5 md:py-6 rounded-2xl md:rounded-3xl font-black text-base md:text-lg hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-4 group/dl"
                                    >
                                        تحميل الملف العملي
                                        <ArrowRight size={20} className="rotate-180 group-hover/dl:translate-x-[-8px] transition-transform" />
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Related Articles Matrix */}
                        <div className="mt-24 border-t border-white/5 pt-16" dir="rtl">
                            <h4 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                                <TrendingUp className="text-indigo-500" size={32} />
                                {siteTexts.blog.trendingTitle}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {articles
                                    .filter(a => a.id !== article.id)
                                    .slice(0, 2)
                                    .map((related) => (
                                        <div
                                            key={related.id}
                                            onClick={() => {
                                                onClose();
                                                setTimeout(() => {
                                                    const params = new URLSearchParams(window.location.search);
                                                    params.set('article', related.id);
                                                    window.history.pushState({}, '', `?${params.toString()}`);
                                                    window.dispatchEvent(new Event('popstate'));
                                                }, 300);
                                            }}
                                            className="group cursor-pointer bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all shadow-xl"
                                        >
                                            <div className="aspect-[21/9] relative">
                                                <img src={related.image} alt={related.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                                            </div>
                                            <div className="p-8">
                                                <h5 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight mb-4">{related.title}</h5>
                                                <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                    <span className="flex items-center gap-2"><Clock size={12} /> {related.readTime}</span>
                                                    <span className="text-indigo-500">{related.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Navigation Footer */}
                        <div className="mt-20 border-t border-white/5 pt-8 text-center">
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-white font-black text-sm uppercase tracking-widest flex items-center gap-3 mx-auto transition-colors group"
                            >
                                <ArrowRight size={18} />
                                {siteTexts.nav.blog}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Fixed Action: Scroll to Top */}
                <AnimatePresence>
                    {scrollProgress > 20 && (
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            onClick={() => document.getElementById('reader-content')?.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="fixed bottom-10 right-10 z-[120] w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-4xl hover:scale-110 active:scale-95 transition-all"
                        >
                            <ArrowRight size={24} className="-rotate-90" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Custom Share Modal (Fallback) */}
                <AnimatePresence>
                    {showShareModal && (
                        <div onClick={() => setShowShareModal(false)} className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[80px] rounded-full"></div>

                                <h3 className="text-white font-black text-xl mb-6 text-center relative z-10">مشاركة الرؤية</h3>

                                <div className="space-y-3 relative z-10">
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-[-4px] transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white border border-white/10 group-hover:border-indigo-500 transition-colors">
                                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                                        </div>
                                        <span className="text-slate-300 font-bold">نشر على X</span>
                                    </a>

                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-[-4px] transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white group-hover:shadow-[0_0_20px_rgba(24,119,242,0.5)] transition-all">
                                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                                        </div>
                                        <span className="text-slate-300 font-bold">مشاركة على Facebook</span>
                                    </a>

                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-[-4px] transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white group-hover:shadow-[0_0_20px_rgba(10,102,194,0.5)] transition-all">
                                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
                                        </div>
                                        <span className="text-slate-300 font-bold">نشر عبر LinkedIn</span>
                                    </a>

                                    <button
                                        onClick={copyToClipboard}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-[-4px] transition-all group mt-4 border-t border-white/10"
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${copySuccess ? 'bg-green-500' : 'bg-slate-700'}`}>
                                            {copySuccess ? <CheckCircle size={20} /> : <div className="font-mono text-xs">URL</div>}
                                        </div>
                                        <span className={`font-bold transition-colors ${copySuccess ? 'text-green-400' : 'text-slate-300'}`}>
                                            {copySuccess ? 'تم نسخ الرابط المباشر' : 'نسخ رابط المقال'}
                                        </span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="absolute top-4 right-4 text-slate-500 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>


            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.8);
        }
        
        :global(.prose h1) { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 900; margin-bottom: 2rem; color: #fff; line-height: 1.1; letter-spacing: -0.03em; border-right: 6px solid #6366f1; padding-right: 1.5rem; text-transform: uppercase; }
        :global(.prose h2) { font-size: clamp(1.5rem, 3.5vw, 2.25rem); font-weight: 800; margin-top: 3.5rem; margin-bottom: 1.5rem; color: #fff; line-height: 1.2; letter-spacing: -0.02em; border-right: 4px solid rgba(99, 102, 241, 0.5); padding-right: 1.25rem; }
        :global(.prose h3) { font-size: clamp(1.25rem, 2.5vw, 1.75rem); font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; color: #fff; line-height: 1.3; }
        :global(.prose p) { font-size: clamp(1rem, 1.3vw, 1.15rem); line-height: 1.9; margin-bottom: 1.75rem; color: #cbd5e1; font-weight: 400; text-align: right; }
        :global(.prose ul) { margin-bottom: 2rem; list-style-type: none; padding-right: 0; }
        :global(.prose li) { font-size: clamp(1rem, 1.3vw, 1.1rem); color: #e2e8f0; margin-bottom: 1rem; position: relative; font-weight: 500; line-height: 1.8; padding-right: 2rem; }
        :global(.prose li::before) { content: "›"; position: absolute; right: 0; top: 0; font-size: 1.5rem; color: #6366f1; font-weight: 800; }
        :global(.prose blockquote) { margin: 3rem 0; padding: 2.5rem; background: linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(168, 85, 247, 0.08)); border-right: 6px solid #6366f1; border-radius: 1.5rem; font-style: italic; font-size: clamp(1.1rem, 1.8vw, 1.4rem); color: #fff; line-height: 1.7; font-weight: 500; position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
        :global(.prose blockquote::after) { content: '"'; position: absolute; top: -1rem; left: 1rem; font-size: 8rem; color: rgba(255,255,255,0.05); font-family: serif; }
        :global(.prose strong) { color: #818cf8; font-weight: 700; }
        :global(.prose a) { color: #6366f1; text-decoration: none; border-bottom: 2px solid rgba(99, 102, 241, 0.3); transition: all 0.3s; font-weight: 600; }
        :global(.prose a:hover) { border-bottom-color: #6366f1; background: rgba(99, 102, 241, 0.1); color: #fff; }
        :global(.prose img) { border-radius: 2rem; margin: 3.5rem 0; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 30px 60px rgba(0,0,0,0.4); width: 100%; transition: transform 0.5s ease; }
        :global(.prose img:hover) { transform: scale(1.02); }
        
        @media (max-width: 768px) {
          :global(.prose h1) { font-size: 2rem; border-right-width: 4px; padding-right: 1rem; }
          :global(.prose h2) { font-size: 1.5rem; border-right-width: 3px; padding-right: 0.75rem; }
          :global(.prose p) { font-size: 1.05rem; line-height: 1.8; }
          :global(.prose blockquote) { font-size: 1.15rem; padding: 1.5rem; }
        }
      `}</style>
        </div>
    );
};

export default ArticleReader;
