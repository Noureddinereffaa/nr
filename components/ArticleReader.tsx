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
        <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-950">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[180px] rounded-full"></div>
            </div>

            {/* Reader Container - Full Page Architecture */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex-1 flex flex-col overflow-hidden z-10"
            >
                {/* Progress System */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 z-[100]">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden"
                        style={{ width: `${scrollProgress}%` }}
                    >
                        <div className="absolute inset-0 bg-shimmer opacity-30"></div>
                    </motion.div>
                </div>

                {/* Dynamic Header - Sovereign Control */}
                <div className="sticky top-0 left-0 right-0 p-6 md:px-16 md:py-10 border-b border-white/10 bg-slate-900/40 backdrop-blur-2xl z-[90] flex items-center justify-between">
                    <div className="flex items-center gap-6 md:gap-10">
                        <button
                            onClick={onClose}
                            className="group w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all active:scale-95"
                        >
                            <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                        <div className="hidden sm:block text-right" dir="rtl">
                            <h4 className="text-white font-black text-sm md:text-lg truncate max-w-[300px] md:max-w-xl group-hover:text-indigo-400 transition-colors">{article.title}</h4>
                            <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                                <Target size={12} /> {article.category}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6 mr-2" dir="rtl">
                            <span className="text-white font-black text-xs uppercase tracking-widest">Noureddine Reffaa</span>
                            <span className="text-slate-500 text-[10px] font-black tracking-widest mt-1">Sovereign Expert</span>
                        </div>
                        <button className="hidden sm:flex p-4 rounded-xl bg-white/5 hover:bg-indigo-600 text-white transition-all shadow-xl">
                            <Share2 size={24} />
                        </button>
                    </div>
                </div>

                {/* Cinematic Scroll Content */}
                <div
                    id="reader-content"
                    className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar bg-slate-900"
                >
                    {/* Immersive Cover Image */}
                    <div className="relative w-full h-[50vh] md:h-[75vh]">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover grayscale-[20%]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-10 max-w-5xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.4em] mb-10 shadow-3xl"
                            >
                                <Shield size={16} />
                                Strategic Insight Lab
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-5xl md:text-8xl font-black text-white leading-[1] mb-12 tracking-tighter drop-shadow-3xl"
                            >
                                {article.title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap items-center justify-center gap-10 text-white font-black text-sm border-t border-white/10 pt-10"
                            >
                                <div className="flex items-center gap-3 text-indigo-400">
                                    <Calendar size={20} />
                                    {new Date(article.date).toLocaleDateString('ar-EG')}
                                </div>
                                <div className="flex items-center gap-3 text-indigo-400">
                                    <Clock size={20} />
                                    {article.readTime}
                                </div>
                                <div className="flex items-center gap-3 text-indigo-400">
                                    <Zap size={20} />
                                    بواسطة الذكاء الاصطناعي
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
                            className="mt-40 p-12 md:p-24 rounded-[4rem] bg-indigo-600 text-white text-center relative group overflow-hidden shadow-3xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute top-0 right-0 w-full h-3 bg-white/20"></div>

                            <h3 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-none relative z-10">نحول الرؤية إلى سلطة رقمية</h3>
                            <p className="text-indigo-100 text-xl md:text-2xl mb-16 max-w-4xl mx-auto leading-relaxed font-medium relative z-10">
                                لا نكتفي بالتنظير، بل نمنحك الأنظمة التي تدير أعمالك وتضاعف نموك بأتمتة ذكية ومسارات استراتيجية لا تُقهر.
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
                                <a
                                    href={article.ctaWhatsApp || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full md:w-auto bg-white text-slate-950 px-16 py-6 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-4xl flex items-center justify-center gap-4 group/btn"
                                >
                                    حجز استشارة هاتفية فورية
                                    <Sparkles size={24} className="text-indigo-600 group-hover/btn:animate-pulse" />
                                </a>

                                {article.ctaDownloadUrl && (
                                    <a
                                        href={article.ctaDownloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full md:w-auto bg-indigo-500/30 backdrop-blur-md text-white border border-white/20 px-12 py-6 rounded-3xl font-black text-lg hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-4 group/dl"
                                    >
                                        تحميل دليل التنفيذ
                                        <ArrowRight size={24} className="rotate-180 group-hover/dl:translate-x-[-8px] transition-transform" />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
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
        
        :global(.prose h1) { font-size: 5rem; font-weight: 900; margin-bottom: 3rem; color: #fff; line-height: 1; tracking-tighter; }
        :global(.prose h2) { font-size: 3.5rem; font-weight: 900; margin-top: 6rem; margin-bottom: 2rem; color: #fff; tracking-tight; line-height: 1.1; }
        :global(.prose h3) { font-size: 2.25rem; font-weight: 900; margin-top: 4rem; margin-bottom: 1.5rem; color: #fff; }
        :global(.prose p) { font-size: 1.5rem; line-height: 2.2; margin-bottom: 3rem; color: #cbd5e1; font-weight: 500; }
        :global(.prose ul) { margin-bottom: 3rem; list-style-type: none; padding-right: 2rem; }
        :global(.prose li) { font-size: 1.4rem; color: #94a3b8; margin-bottom: 1.5rem; position: relative; font-weight: 600; line-height: 1.8; }
        :global(.prose li::before) { content: ""; position: absolute; right: -2rem; top: 1rem; width: 10px; height: 10px; background: #6366f1; border-radius: 4px; rotate: 45deg; box-shadow: 0 0 15px #6366f1; }
        :global(.prose blockquote) { margin: 6rem 0; padding: 4rem; background: rgba(79, 70, 229, 0.05); border-right: 8px solid #6366f1; border-radius: 3rem; font-style: normal; font-size: 2rem; color: #fff; line-height: 1.8; font-weight: 900; }
        :global(.prose strong) { color: #818cf8; font-weight: 900; }
        
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
