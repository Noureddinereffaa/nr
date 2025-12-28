import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Save, Eye, Type, Image as ImageIcon, Link2, Code2, Quote, List,
    ListOrdered, Heading1, Heading2, Heading3, Bold, Italic, Underline,
    Strikethrough, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2,
    Sparkles, Search, Settings, FileText, Zap, CheckCircle, Clock,
    ChevronRight, ChevronLeft, Maximize2, Minimize2, BarChart3, Brain,
    RefreshCw, Plus, Trash2, GripVertical, Target
} from 'lucide-react';
import { Article, AIConfig } from '../../../../types';
import { AIService, DigitalCouncil } from '../../../../lib/ai-service';

// Sub-components
import EditorToolbar from './EditorToolbar';
import SidePanel from './SidePanel';
import StatusBar from './StatusBar';

interface ArticleStudioProps {
    article: Article;
    aiConfig: AIConfig;
    onSave: (article: Article) => void;
    onClose: () => void;
}

const ArticleStudio: React.FC<ArticleStudioProps> = ({
    article: initialArticle,
    aiConfig,
    onSave,
    onClose
}) => {
    // Core State
    const [article, setArticle] = useState<Article>(initialArticle);
    const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
    const [sidePanelOpen, setSidePanelOpen] = useState(true);
    const [activePanel, setActivePanel] = useState<'seo' | 'ai' | 'images' | 'settings'>('ai');
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Editor State
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [aiStatus, setAiStatus] = useState<'idle' | 'working'>('idle');
    const [wordCount, setWordCount] = useState(0);
    const [readTime, setReadTime] = useState(0);

    // Refs
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const isMounted = useRef(false);

    // Calculate metrics
    useEffect(() => {
        const words = article.content.split(/\s+/).filter(w => w.length > 0);
        setWordCount(words.length);
        setReadTime(Math.ceil(words.length / 200));
    }, [article.content]);

    // Auto-save with mount protection
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        setSaveStatus('unsaved');
        const timer = setTimeout(() => {
            setSaveStatus('saving');
            onSave(article);
            setTimeout(() => setSaveStatus('saved'), 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [article.content, article.title, article.excerpt, article.slug]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyboard = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                setSaveStatus('saving');
                onSave(article);
                setTimeout(() => setSaveStatus('saved'), 500);
            }
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        window.addEventListener('keydown', handleKeyboard);
        return () => window.removeEventListener('keydown', handleKeyboard);
    }, [article, isFullscreen, onSave]);

    // Insert text at cursor
    const insertAtCursor = useCallback((before: string, after: string = '') => {
        const textarea = editorRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        const newContent = text.substring(0, start) + before + selection + after + text.substring(end);
        setArticle(prev => ({ ...prev, content: newContent }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selection.length);
        }, 0);
    }, []);

    // Update article field
    const updateField = useCallback((field: keyof Article, value: any) => {
        setArticle(prev => ({ ...prev, [field]: value }));
    }, []);

    // AI Actions
    const handleAIAction = async (action: 'improve' | 'expand' | 'summarize' | 'outline') => {
        setAiStatus('working');
        try {
            let result = '';
            switch (action) {
                case 'improve':
                    result = await AIService.refineTone(article.content, 'Sovereign', aiConfig);
                    updateField('content', result);
                    break;
                case 'expand':
                    const expanded = await DigitalCouncil.ChiefEditor.draftSection(
                        'توسيع المحتوى',
                        article.content,
                        'Sovereign',
                        aiConfig
                    );
                    updateField('content', article.content + '\n\n' + expanded);
                    break;
                case 'outline':
                    const outline = await AIService.suggestOutline(article.title, aiConfig);
                    const outlineHtml = outline.map((s: any) => `<h2>${s.title}</h2>\n<p>${s.description}</p>`).join('\n');
                    updateField('content', article.content + '\n\n' + outlineHtml);
                    break;
            }
        } catch (e) {
            console.error('AI Action failed:', e);
        } finally {
            setAiStatus('idle');
        }
    };

    // Manual save
    const handleSave = () => {
        setSaveStatus('saving');
        onSave(article);
        setTimeout(() => setSaveStatus('saved'), 500);
    };

    return (
        <div className={`fixed inset-0 z-[1500] bg-slate-950 flex flex-col ${isFullscreen ? '' : ''}`}>
            {/* ═══════════════ HEADER ═══════════════ */}
            <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between shrink-0">
                {/* Left: Close & Title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all"
                    >
                        <X size={18} />
                    </button>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                        <input
                            type="text"
                            value={article.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            className="bg-transparent text-white font-bold text-lg outline-none w-[300px] placeholder:text-slate-600"
                            placeholder="عنوان المقال..."
                            dir="rtl"
                        />
                        <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">
                            Professional Writing Studio v2.0
                        </p>
                    </div>
                </div>

                {/* Center: View Toggle */}
                <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-white/5">
                    {[
                        { id: 'edit', icon: Type, label: 'تحرير' },
                        { id: 'split', icon: Maximize2, label: 'مقسم' },
                        { id: 'preview', icon: Eye, label: 'معاينة' }
                    ].map(v => (
                        <button
                            key={v.id}
                            onClick={() => setViewMode(v.id as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${viewMode === v.id
                                    ? 'bg-white text-slate-900 shadow-lg'
                                    : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            <v.icon size={14} />
                            {v.label}
                        </button>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Save Status */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/50 rounded-lg border border-white/5">
                        {saveStatus === 'saving' && (
                            <>
                                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                <span className="text-xs text-yellow-400 font-bold">جاري الحفظ...</span>
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <>
                                <CheckCircle size={12} className="text-green-500" />
                                <span className="text-xs text-green-400 font-bold">تم الحفظ</span>
                            </>
                        )}
                        {saveStatus === 'unsaved' && (
                            <>
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                <span className="text-xs text-orange-400 font-bold">غير محفوظ</span>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setSidePanelOpen(!sidePanelOpen)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${sidePanelOpen ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                    >
                        <Settings size={18} />
                    </button>

                    <button
                        onClick={handleSave}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                    >
                        <Save size={16} />
                        حفظ
                    </button>
                </div>
            </header>

            {/* ═══════════════ TOOLBAR ═══════════════ */}
            <EditorToolbar insertAtCursor={insertAtCursor} aiStatus={aiStatus} onAIAction={handleAIAction} />

            {/* ═══════════════ MAIN CONTENT ═══════════════ */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Area */}
                <div className={`flex-1 flex ${viewMode === 'split' ? 'divide-x divide-white/5' : ''}`}>
                    {/* Editor */}
                    {(viewMode === 'edit' || viewMode === 'split') && (
                        <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full overflow-y-auto p-8 bg-slate-950/50`}>
                            <div className="max-w-3xl mx-auto">
                                <textarea
                                    ref={editorRef}
                                    value={article.content}
                                    onChange={(e) => updateField('content', e.target.value)}
                                    className="w-full min-h-[calc(100vh-300px)] bg-transparent text-slate-200 text-lg leading-relaxed outline-none resize-none placeholder:text-slate-700 font-serif"
                                    placeholder="ابدأ الكتابة هنا... يمكنك استخدام HTML للتنسيق"
                                    dir="rtl"
                                />
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    {(viewMode === 'preview' || viewMode === 'split') && (
                        <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full overflow-y-auto p-8 bg-slate-900/30`}>
                            <div className="max-w-3xl mx-auto prose prose-invert prose-indigo" dir="rtl">
                                <h1 className="text-4xl font-black text-white mb-8">{article.title}</h1>
                                <div
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                    className="text-lg text-slate-300 leading-relaxed"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Side Panel */}
                <AnimatePresence>
                    {sidePanelOpen && (
                        <SidePanel
                            article={article}
                            aiConfig={aiConfig}
                            activePanel={activePanel}
                            setActivePanel={setActivePanel}
                            updateField={updateField}
                            aiStatus={aiStatus}
                            onAIAction={handleAIAction}
                            wordCount={wordCount}
                            readTime={readTime}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* ═══════════════ STATUS BAR ═══════════════ */}
            <StatusBar
                wordCount={wordCount}
                readTime={readTime}
                saveStatus={saveStatus}
                aiStatus={aiStatus}
            />
        </div>
    );
};

export default ArticleStudio;
