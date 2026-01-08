import React from 'react';
import { Settings, Image, Sparkles, Search } from 'lucide-react';
import { Article, AIConfig } from '../../../../types';

interface SidePanelProps {
    article: Article;
    aiConfig: AIConfig;
    activePanel: 'seo' | 'ai' | 'images' | 'settings';
    setActivePanel: (panel: 'seo' | 'ai' | 'images' | 'settings') => void;
    updateField: (field: keyof Article, value: any) => void;
    aiStatus: 'idle' | 'working';
    onAIAction: (action: 'improve' | 'expand' | 'summarize' | 'outline') => void;
    wordCount: number;
    readTime: number;
}

const SidePanel: React.FC<SidePanelProps> = ({
    activePanel, setActivePanel, aiConfig, onAIAction, aiStatus
}) => {

    const tabs = [
        { id: 'ai', icon: Sparkles, label: 'AI Helper' },
        { id: 'seo', icon: Search, label: 'SEO' },
        { id: 'images', icon: Image, label: 'Media' },
        { id: 'settings', icon: Settings, label: 'Config' },
    ];

    return (
        <div className="w-80 bg-slate-900 border-r border-white/5 flex flex-col shrink-0">
            {/* Tabs */}
            <div className="flex border-b border-white/5">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActivePanel(tab.id as any)}
                        className={`flex-1 py-3 flex items-center justify-center transition-colors ${activePanel === tab.id
                                ? 'bg-slate-800 text-white border-b-2 border-indigo-500'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        title={tab.label}
                    >
                        <tab.icon size={18} />
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activePanel === 'ai' && (
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4">AI Assistant</h3>

                        <div className="space-y-2">
                            <button
                                onClick={() => onAIAction('outline')}
                                disabled={aiStatus === 'working'}
                                className="w-full text-right px-4 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-sm text-slate-300 disabled:opacity-50"
                            >
                                <span className="block font-bold text-white mb-1">اقتراح هيكل للمقال</span>
                                <span className="text-xs text-slate-500">إنشاء عناوين فرعية ونقاط رئيسية</span>
                            </button>

                            <button
                                onClick={() => onAIAction('summarize')}
                                disabled={aiStatus === 'working'}
                                className="w-full text-right px-4 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-sm text-slate-300 disabled:opacity-50"
                            >
                                <span className="block font-bold text-white mb-1">تلخيص المحتوى</span>
                                <span className="text-xs text-slate-500">إنشاء ملخص احترافي للمقدمة</span>
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <h4 className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
                                <Sparkles size={14} />
                                Active Agent
                            </h4>
                            <p className="text-xs text-indigo-300 leading-relaxed">
                                Currently using <strong>{aiConfig.preferredProvider || 'Gemini'}</strong> model for content generation.
                            </p>
                        </div>
                    </div>
                )}

                {/* Placeholders for other tabs */}
                {activePanel !== 'ai' && (
                    <div className="text-center py-12 text-slate-500 text-sm">
                        Work in progress...
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidePanel;
