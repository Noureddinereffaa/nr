import React, { useState } from 'react';
import { useUI } from '../../../context/UIContext';
import { useData } from '../../../context/DataContext';
import { AIService } from '../../../lib/ai-service';
import { X, FileText, Plus } from 'lucide-react';

const ArticleModal: React.FC = () => {
    const { isArticleModalOpen, closeArticleModal } = useUI();
    const { siteData, addArticle } = useData();

    const [topic, setTopic] = useState('');

    if (!isArticleModalOpen) return null;

    const handleCreateManual = () => {
        const emptyArticle = {
            title: topic || 'مقال جديد بدون عنوان',
            content: `<h1>${topic || 'مقدمة المقال'}</h1><p>ابدأ الكتابة هنا...</p>`,
            excerpt: 'وصف مختصر للمقال اليدوي...',
            image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200',
            category: 'استراتيجية',
            tags: [],
            keywords: [],
            author: siteData.profile?.name || 'نورالدين رفعة',
            status: 'draft' as const,
            readTime: '5 min read',
            seo: {
                title: topic,
                description: 'وصف مختصر للمقال...',
                focusKeyword: ''
            }
        };
        addArticle(emptyArticle);
        closeArticleModal();
        setTopic('');
    };

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/50" dir="rtl">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            <FileText className="text-indigo-400" />
                            إنشاء محتوى استراتيجي
                        </h3>
                        <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">NR-OS Content Forge v5.0</p>
                    </div>
                    <button
                        onClick={() => {
                            closeArticleModal();
                            setTopic('');
                        }}
                        className="p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-10" dir="rtl">
                    <div className="max-w-md mx-auto space-y-8">
                        <div className="text-center space-y-2">
                            <h4 className="text-xl font-black text-white">بدء مسودة جديدة</h4>
                            <p className="text-slate-500 text-xs font-bold leading-relaxed">أدخل عنواناً أولياً للبدء في صياغة مقالك الاستراتيجي.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest pr-2">عنوان المقال الاستراتيجي</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="مثلاً: دليل السيادة الرقمية 2025..."
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-indigo-500/50 transition-all text-right"
                                />
                            </div>

                            <button
                                onClick={handleCreateManual}
                                disabled={!topic}
                                className="w-full bg-white text-slate-950 py-5 rounded-3xl font-black text-lg shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Plus size={24} />
                                إنشاء المسودة والبدء في الكتابة
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Deco */}
                <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"></div>
            </div>
        </div>
    );
};

export default ArticleModal;
