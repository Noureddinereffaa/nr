import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { X, Clock, User, Calendar, Share2, Bookmark, ArrowRight, Sparkles, Tag, Target, Globe, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArticleReaderProps {
    article: Article;
    onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onClose }) => {
    const [scrollProgress, setScrollProgress] = useState(0);

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
                <div className="sticky top-0 left-0 right-0 p-4 md:px-16 md:py-8 border-b border-white/5 bg-slate-950/80 backdrop-blur-3xl z-[100] flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-10 overflow-hidden">
                        <button
                            onClick={onClose}
                            className="shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all active:scale-95"
                        >
                            <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                        <div className="text-right overflow-hidden" dir="rtl">
                            <h4 className="text-white font-black text-sm md:text-lg truncate max-w-[180px] sm:max-w-xs md:max-w-xl">{article.title}</h4>
                            <p className="text-indigo-500 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5 flex items-center gap-2 justify-end">
                                <Target size={10} /> {article.category}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex flex-col items-end border-r border-white/10 pr-6 mr-2" dir="rtl">
                            <span className="text-white font-black text-xs uppercase tracking-widest">Noureddine Reffaa</span>
                            <span className="text-slate-500 text-[10px] font-black tracking-widest mt-1">Sovereign Expert</span>
                        </div>
                        <button className="p-3 md:p-4 rounded-xl bg-white/5 hover:bg-indigo-600 text-white transition-all shadow-xl">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Cinematic Scroll Content */}
                <div
                    id="reader-content"
                    className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar bg-slate-950"
                >
                    {/* Immersive Cover Image */}
                    <div className="relative w-full h-[60vh] md:h-[85vh]">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover grayscale-[30%] scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 to-transparent"></div>

                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-32 px-6 md:px-10 max-w-6xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-indigo-600 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-8 md:mb-12 shadow-[0_0_40px_rgba(79,70,229,0.5)] border border-white/20"
                            >
                                <Shield size={16} />
                                Intelligence Sovereign Access
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl sm:text-5xl md:text-8xl lg:text-[10rem] font-black text-white leading-[0.9] mb-10 md:mb-16 tracking-tighter drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                            >
                                {article.title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-slate-300 font-black text-xs md:text-sm border-t border-white/10 pt-10 md:pt-14 w-full"
                            >
                                <div className="flex items-center gap-3 text-indigo-400">
                                    <Calendar size={18} />
                                    {new Date(article.date).toLocaleDateString('ar-EG')}
                                </div>
                                <div className="flex items-center gap-3 text-indigo-400">
                                    <Clock size={18} />
                                    {article.readTime}
                                </div>
                                <div className="flex items-center gap-3 text-emerald-400">
                                    <Zap size={18} />
                                    محتوى سيادي معزز
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Elite Content Body - Readability Focus */}
                    <div className="max-w-4xl mx-auto px-6 py-24 md:py-40">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="prose prose-invert prose-indigo max-w-none text-right"
                            dir="rtl"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Tags Architecture */}
                        <div className="mt-32 pt-16 border-t border-white/10" dir="rtl">
                            <h4 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
                                <Sparkles className="text-indigo-500" size={28} />
                                المصفوفة التقنية والمفاتيح
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
                            className="mt-24 md:mt-40 p-8 md:p-24 rounded-[2.5rem] md:rounded-[4rem] bg-indigo-600 text-white text-center relative group overflow-hidden shadow-3xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute top-0 right-0 w-full h-2 md:h-3 bg-white/20"></div>

                            <h3 className="text-3xl md:text-7xl font-black mb-6 md:mb-8 tracking-tighter leading-tight relative z-10">نحول الرؤية إلى سلطة رقمية</h3>
                            <p className="text-indigo-100 text-lg md:text-2xl mb-10 md:mb-16 max-w-4xl mx-auto leading-relaxed font-medium relative z-10">
                                لا نكتفي بالتنظير، بل نمنحك الأنظمة التي تدير أعمالك وتضاعف نموك بأتمتة ذكية ومسارات استراتيجية لا تُقهر.
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 relative z-10">
                                <a
                                    href={article.ctaWhatsApp || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full md:w-auto bg-white text-slate-950 px-8 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:scale-105 active:scale-95 transition-all shadow-4xl flex items-center justify-center gap-4 group/btn"
                                >
                                    حجز استشارة هاتفية
                                    <Sparkles size={20} className="text-indigo-600 group-hover/btn:animate-pulse" />
                                </a>

                                {article.ctaDownloadUrl && (
                                    <a
                                        href={article.ctaDownloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full md:w-auto bg-indigo-500/30 backdrop-blur-md text-white border border-white/20 px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-base md:text-lg hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-4 group/dl"
                                    >
                                        تحميل دليل التنفيذ
                                        <ArrowRight size={20} className="rotate-180 group-hover/dl:translate-x-[-8px] transition-transform" />
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Navigation Footer */}
                        <div className="mt-24 md:mt-32 border-t border-white/5 pt-12 text-center">
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-white font-black text-sm uppercase tracking-widest flex items-center gap-3 mx-auto transition-colors"
                            >
                                <ArrowRight size={18} />
                                العودة إلى مركز المعرفة
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
        
        :global(.prose h1) { font-size: clamp(3rem, 10vw, 7rem); font-weight: 950; margin-bottom: 4rem; color: #fff; line-height: 0.95; tracking-tighter; letter-spacing: -0.05em; text-transform: uppercase; border-right: 12px solid #6366f1; padding-right: 2rem; }
        :global(.prose h2) { font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 900; margin-top: 8rem; margin-bottom: 2.5rem; color: #fff; tracking-tight; line-height: 1.05; letter-spacing: -0.03em; border-right: 8px solid rgba(99, 102, 241, 0.3); padding-right: 1.5rem; }
        :global(.prose h3) { font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; margin-top: 5rem; margin-bottom: 2rem; color: #fff; letter-spacing: -0.02em; }
        :global(.prose p) { font-size: clamp(1.25rem, 3vw, 1.75rem); line-height: 2.3; margin-bottom: 3.5rem; color: #cbd5e1; font-weight: 500; text-align: justify; text-justify: inter-word; }
        :global(.prose ul) { margin-bottom: 4rem; list-style-type: none; padding-right: 0; }
        :global(.prose li) { font-size: clamp(1.15rem, 2.5vw, 1.6rem); color: #e2e8f0; margin-bottom: 2rem; position: relative; font-weight: 600; line-height: 2; padding-right: 3rem; }
        :global(.prose li::before) { content: "›"; position: absolute; right: 0; top: 0; font-size: 2.5rem; color: #6366f1; font-weight: 900; filter: drop-shadow(0 0 8px #6366f1); }
        :global(.prose blockquote) { margin: 8rem 0; padding: 5rem; background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(168, 85, 247, 0.05)); border-right: 12px solid #6366f1; border-radius: 4rem; font-style: italic; font-size: clamp(1.5rem, 4vw, 2.5rem); color: #fff; line-height: 1.7; font-weight: 950; position: relative; overflow: hidden; }
        :global(.prose blockquote::after) { content: '"'; position: absolute; top: -2rem; left: 2rem; font-size: 15rem; color: rgba(255,255,255,0.03); font-family: serif; }
        :global(.prose strong) { color: #818cf8; font-weight: 950; text-shadow: 0 0 20px rgba(129, 140, 248, 0.3); }
        :global(.prose a) { color: #6366f1; text-decoration: none; border-bottom: 2px solid rgba(99, 102, 241, 0.3); transition: all 0.3s; font-weight: 800; }
        :global(.prose a:hover) { border-bottom-color: #6366f1; background: rgba(99, 102, 241, 0.05); }
        :global(.prose img) { border-radius: 3rem; margin: 6rem 0; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 30px 100px rgba(0,0,0,0.5); }
        
        @media (max-width: 768px) {
          :global(.prose h1) { font-size: 2.75rem; }
          :global(.prose h2) { font-size: 2.25rem; }
          :global(.prose p) { font-size: 1.2rem; line-height: 2; }
          :global(.prose blockquote) { font-size: 1.4rem; padding: 2rem; }
        }
      `}</style>
        </div>
    );
};

export default ArticleReader;
