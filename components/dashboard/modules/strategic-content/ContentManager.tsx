import React, { useState } from 'react';
import FAQManager from '../../content/FAQManager';
import TestimonialManager from '../../content/TestimonialManager';
import StatsManager from '../../content/StatsManager';
import ProcessManager from '../../content/ProcessManager';
import BlogManager from '../../content/BlogManager';
import { HelpCircle, MessageSquare, BarChart2, GitMerge, Sparkles } from 'lucide-react';

const ContentManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'faqs' | 'testimonials' | 'stats' | 'process' | 'articles'>('articles');

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide no-scrollbar" dir="rtl">
                {[
                    { id: 'articles', icon: Sparkles, label: 'مقالات الذكاء الاصطناعي', color: 'indigo' },
                    { id: 'faqs', icon: HelpCircle, label: 'الأسئلة الشائعة', color: 'slate' },
                    { id: 'testimonials', icon: MessageSquare, label: 'آراء العملاء', color: 'slate' },
                    { id: 'stats', icon: BarChart2, label: 'الإحصائيات', color: 'slate' },
                    { id: 'process', icon: GitMerge, label: 'مراحل العمل', color: 'slate' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-[var(--border-radius-elite)] text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id
                            ? 'bg-[var(--accent-indigo)] text-white shadow-xl shadow-[rgba(var(--accent-indigo-rgb),0.3)]'
                            : 'bg-slate-900/50 text-slate-500 border border-white/5 hover:bg-slate-900 hover:text-white'
                            }`}
                    >
                        <tab.icon size={18} className={activeTab === tab.id && tab.id === 'articles' ? 'animate-pulse' : ''} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-slate-950/40 border border-white/5 rounded-[var(--border-radius-elite)] p-8 overflow-y-auto no-scrollbar relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-indigo)] to-transparent opacity-20"></div>
                {activeTab === 'articles' && <BlogManager />}
                {activeTab === 'faqs' && <FAQManager />}
                {activeTab === 'testimonials' && <TestimonialManager />}
                {activeTab === 'stats' && <StatsManager />}
                {activeTab === 'process' && <ProcessManager />}
            </div>
        </div>
    );
};

export default ContentManager;
