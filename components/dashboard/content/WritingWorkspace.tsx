import React, { useState, useEffect, useRef } from 'react';
import {
    X, Save, Eye, Layout, Type, Target,
    Zap, CheckCircle, ArrowRight, Image as ImageIcon,
    Code2, Activity, Users, Globe, Smartphone, Download, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article, AIConfig } from '../../../types';
import { SOVEREIGN_TEMPLATES, ArticleTemplate } from '../../../lib/article-templates';

interface WritingWorkspaceProps {
    article: Article;
    aiConfig: AIConfig;
    onSave: (article: Article) => void;
    onClose: () => void;
}

const WritingWorkspace: React.FC<WritingWorkspaceProps> = ({ article: initialArticle, onSave, onClose }) => {
    // Core State
    const [article, setArticle] = useState<Article>(initialArticle);
    const [view, setView] = useState<'editor' | 'preview'>('editor');

    // Editor UI State
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [hasChanges, setHasChanges] = useState(false);
    const [focusMode, setFocusMode] = useState(false);

    // Modals & Inputs
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);

    // Temporary Input Buffers
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tagInput, setTagInput] = useState('');

    const editorRef = useRef<HTMLTextAreaElement>(null);

    // SEO Analysis (Real-time)
    const [seoMetrics, setSeoMetrics] = useState({
        wordCount: 0,
        readingTime: 0,
        keywordDensity: 0,
        readabilityScore: 0,
        metaLength: 0,
        hasH1: false,
        h2Count: 0
    });

    useEffect(() => {
        const words = article.content.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const readingTime = Math.ceil(wordCount / 200);

        const keyword = article.keywords?.[0] || '';
        const keywordCount = keyword ? (article.content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length : 0;
        const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

        const sentences = article.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
        const readabilityScore = Math.max(0, 100 - (avgWordsPerSentence * 2));

        const metaLength = article.excerpt?.length || 0;
        const hasH1 = /<h1/i.test(article.content);
        const h2Count = (article.content.match(/<h2/gi) || []).length;

        setSeoMetrics({
            wordCount,
            readingTime,
            keywordDensity: Math.round(keywordDensity * 10) / 10,
            readabilityScore: Math.round(readabilityScore),
            metaLength,
            hasH1,
            h2Count
        });
    }, [article.content, article.excerpt, article.keywords]);

    // Autosave Logic
    const isMounted = React.useRef(false);
    useEffect(() => {
        if (!isMounted.current) { isMounted.current = true; return; }
        setHasChanges(true);
        setSaveStatus('unsaved');
        const timer = setTimeout(() => {
            if (hasChanges) {
                setSaveStatus('saving');
                onSave(article);
                setTimeout(() => setSaveStatus('saved'), 500);
                setHasChanges(false);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [article, onSave]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyboard = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                setSaveStatus('saving');
                onSave(article);
                setTimeout(() => setSaveStatus('saved'), 500);
            }
            if (e.ctrlKey && e.key === 'b') { e.preventDefault(); insertTag('<strong>', '</strong>'); }
            if (e.ctrlKey && e.key === 'i') { e.preventDefault(); insertTag('<em>', '</em>'); }
            if (e.key === 'Escape' && focusMode) { setFocusMode(false); }
        };
        window.addEventListener('keydown', handleKeyboard);
        return () => window.removeEventListener('keydown', handleKeyboard);
    }, [article, focusMode, onSave]);

    // Tag Management
    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTags = [...(article.tags || []), tagInput.trim()];
            setArticle({ ...article, tags: newTags });
            setTagInput('');
        }
    };
    const removeTag = (tagToRemove: string) => {
        setArticle({ ...article, tags: (article.tags || []).filter(t => t !== tagToRemove) });
    };

    // Insert Link Logic
    const handleInsertLink = () => {
        if (!linkUrl || !linkText) return;
        const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener">${linkText}</a>`;
        insertAtCursor(linkHtml);
        setShowLinkModal(false);
        setLinkUrl('');
        setLinkText('');
    };

    // Insert Image Logic
    const handleInsertImage = () => {
        if (!imageUrl) return;
        const imgHtml = `<img src="${imageUrl}" alt="Article Image" class="w-full rounded-2xl my-6" />`;
        insertAtCursor(imgHtml);
        setShowImageModal(false);
        setImageUrl('');
    };

    // Template Logic
    const handleApplyTemplate = (template: ArticleTemplate) => {
        if (article.content.trim().length > 50) {
            if (!confirm('سيؤدي تطبيق القالب إلى حذف المحتوى الحالي. هل أنت متأكد؟')) return;
        }
        setArticle(prev => ({ ...prev, content: template.structure.trim() }));
        setShowTemplateModal(false);
    };

    // Helper: Insert at Cursor
    const insertAtCursor = (insertion: string) => {
        const textarea = document.getElementById('main-editor') as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const text = textarea.value;
        const newContent = text.substring(0, start) + insertion + text.substring(start);
        setArticle(prev => ({ ...prev, content: newContent }));
    };

    // Helper: Wrap Selection
    const insertTag = (openTag: string, closeTag: string) => {
        const textarea = document.getElementById('main-editor') as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);
        const newContent = text.substring(0, start) + openTag + selection + closeTag + text.substring(end);
        setArticle(prev => ({ ...prev, content: newContent }));
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + openTag.length, start + openTag.length + selection.length);
        }, 0);
    };

    return (
        <div className="fixed inset-0 z-[1500] bg-slate-950 flex flex-col overflow-hidden animate-in fade-in duration-500 font-sans">
            {/* 1. Top Navigation Bar */}
            <div className="h-16 border-b border-white/5 bg-slate-950 flex items-center justify-between px-6 shrink-0 relative z-50">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-slate-400 flex items-center justify-center transition-all">
                        <X size={18} />
                    </button>
                    <div className="h-6 w-[1px] bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-white font-black text-sm tracking-wide">Sovereign Studio</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">{saveStatus === 'saving' ? 'Saving...' : 'Ready'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFocusMode(!focusMode)}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${focusMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                    >
                        <Target size={14} /> {focusMode ? 'Exit Focus' : 'Focus'}
                    </button>
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-white/5 mx-2">
                        <button onClick={() => setView('editor')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${view === 'editor' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                            <Type size={14} /> Editor
                        </button>
                        <button onClick={() => setView('preview')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${view === 'preview' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                            <Eye size={14} /> Preview
                        </button>
                    </div>
                    <button
                        onClick={() => { setSaveStatus('saving'); onSave(article); setTimeout(() => setSaveStatus('saved'), 500); }}
                        className="bg-white text-slate-950 px-6 py-2 rounded-lg font-black text-xs flex items-center gap-2 hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95"
                    >
                        <Save size={14} /> Save
                    </button>
                </div>
            </div>

            {/* 2. Main Workspace Layout */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT: Asset Sidebar (300px) */}
                {!focusMode && (
                    <div className="w-80 border-r border-white/5 bg-slate-900/20 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="text-white font-black text-sm mb-1 flex items-center gap-2">
                                <Zap size={14} className="text-amber-400" /> Article Assets
                            </h3>
                            <p className="text-[10px] text-slate-500">Essential components for high-authority content.</p>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Hero Image Field */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wide">
                                    <ImageIcon size={12} /> Hero Image
                                </label>
                                <div className="aspect-video rounded-xl bg-slate-950 border border-white/10 overflow-hidden relative group">
                                    {article.image ? (
                                        <img src={article.image} alt="Hero" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-600 bg-grid-pattern opacity-20">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                        <input
                                            type="text"
                                            value={article.image}
                                            onChange={(e) => setArticle({ ...article, image: e.target.value })}
                                            className="w-full bg-slate-900 border border-white/20 text-white text-xs p-2 rounded outline-none"
                                            placeholder="Paste Image URL..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tags Field */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wide">
                                    <Hash size={12} /> Smart Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {article.tags?.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] rounded border border-indigo-500/30 flex items-center gap-1">
                                            {tag} <button onClick={() => removeTag(tag)}><X size={10} /></button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    className="w-full bg-slate-950 border border-white/10 text-white text-xs p-3 rounded-lg outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                    placeholder="Add tag and press Enter..."
                                />
                            </div>

                            {/* CTA Fields */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <label className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wide">
                                    <Activity size={12} /> Call to Actions
                                </label>

                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><Smartphone size={10} /> WhatsApp Link</span>
                                    <input
                                        type="text"
                                        value={article.ctaWhatsApp || ''}
                                        onChange={(e) => setArticle({ ...article, ctaWhatsApp: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 text-white text-xs p-2.5 rounded-lg outline-none focus:border-green-500/50 transition-all"
                                        placeholder="https://wa.me/..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><Download size={10} /> Download Resource Link</span>
                                    <input
                                        type="text"
                                        value={article.ctaDownloadUrl || ''}
                                        onChange={(e) => setArticle({ ...article, ctaDownloadUrl: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 text-white text-xs p-2.5 rounded-lg outline-none focus:border-blue-500/50 transition-all"
                                        placeholder="https://drive.google.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CENTER: Main Editor */}
                <div className="flex-1 overflow-y-auto bg-slate-950 relative scrollbar-thin scrollbar-thumb-slate-800">
                    <div className={`max-w-4xl mx-auto ${focusMode ? 'py-20' : 'py-12'} px-8 md:px-12 min-h-full flex flex-col`}>

                        {/* Title Input */}
                        <textarea
                            value={article.title}
                            onChange={(e) => setArticle({ ...article, title: e.target.value })}
                            className="bg-transparent border-none text-4xl md:text-5xl font-black text-white placeholder:text-slate-800 outline-none resize-none overflow-hidden leading-tight mb-8 text-right"
                            placeholder="العنوان الرئيسي للمقال..."
                            rows={1}
                            style={{ height: 'auto' }}
                            onInput={(e) => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; }}
                            dir="rtl"
                        />

                        {/* Editor View */}
                        {view === 'editor' && (
                            <>
                                {/* Floating Toolbar */}
                                <div className="sticky top-0 z-40 mb-6 flex justify-end">
                                    <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-1.5 flex items-center gap-1 shadow-2xl">
                                        {[
                                            { label: 'H2', tag: '<h2></h2>' },
                                            { label: 'H3', tag: '<h3></h3>' },
                                            { label: 'B', tag: '<strong></strong>' },
                                            { label: 'I', tag: '<em></em>' },
                                            { label: '• List', tag: '<ul>\n<li></li>\n</ul>' },
                                            { label: '""', tag: '<blockquote></blockquote>' },
                                        ].map((tool) => (
                                            <button
                                                key={tool.label}
                                                onClick={() => insertTag(tool.tag.split('><')[0] + '>', '<' + tool.tag.split('><')[1])}
                                                className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                {tool.label}
                                            </button>
                                        ))}
                                        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                                        <button onClick={() => setShowLinkModal(true)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-blue-400 hover:bg-blue-500/10"> Link</button>
                                        <button onClick={() => setShowImageModal(true)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-purple-400 hover:bg-purple-500/10"> Image</button>
                                        <button onClick={() => setShowTemplateModal(true)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-amber-400 hover:bg-amber-500/10"> Templates</button>
                                    </div>
                                </div>

                                <textarea
                                    id="main-editor"
                                    value={article.content}
                                    onChange={(e) => setArticle({ ...article, content: e.target.value })}
                                    className="flex-1 w-full bg-transparent border-none text-xl text-slate-300 placeholder:text-slate-800 outline-none resize-none leading-relaxed font-serif text-right min-h-[60vh]"
                                    placeholder="ابدأ الكتابة هنا..."
                                    dir="rtl"
                                />
                            </>
                        )}

                        {/* Preview View */}
                        {view === 'preview' && (
                            <div className="prose prose-invert prose-indigo max-w-none text-right" dir="rtl">
                                <div dangerouslySetInnerHTML={{ __html: article.content }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: SEO & Stats (Collapsible or Small) - Only if not focus mode */}
                {!focusMode && (
                    <div className="w-16 hover:w-64 border-l border-white/5 bg-slate-900/20 transition-all duration-300 group flex flex-col items-center overflow-hidden">
                        <div className="py-6 flex flex-col items-center gap-6 w-full">
                            <Activity size={20} className="text-slate-600 group-hover:text-indigo-400 mb-4" />

                            {/* Stats */}
                            <div className="flex flex-col gap-4 w-full px-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                <div className="text-center group-hover:text-right transition-all">
                                    <p className="text-[10px] text-slate-500 uppercase">Words</p>
                                    <p className="text-lg font-black text-white">{seoMetrics.wordCount}</p>
                                </div>
                                <div className="text-center group-hover:text-right transition-all">
                                    <p className="text-[10px] text-slate-500 uppercase">Read Time</p>
                                    <p className="text-lg font-black text-white">{seoMetrics.readingTime}<span className="text-[10px] ml-1">min</span></p>
                                </div>
                                <div className="w-full h-[1px] bg-white/10 my-2"></div>
                                <div className="text-center group-hover:text-right transition-all">
                                    <p className="text-[10px] text-slate-500 uppercase">Readability</p>
                                    <p className={`text-lg font-black ${seoMetrics.readabilityScore > 70 ? 'text-green-400' : 'text-yellow-400'}`}>{seoMetrics.readabilityScore}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {/* Link Modal */}
                {showLinkModal && (
                    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setShowLinkModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                            <h3 className="text-white font-bold mb-4 text-right">إدراج رابط</h3>
                            <input value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="النص" className="w-full bg-slate-950 border border-white/10 p-3 rounded mb-3 text-white text-right" />
                            <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="URL" className="w-full bg-slate-950 border border-white/10 p-3 rounded mb-6 text-white" />
                            <button onClick={handleInsertLink} className="w-full bg-indigo-600 text-white py-3 rounded font-bold">إدراج</button>
                        </motion.div>
                    </div>
                )}

                {/* Image Modal */}
                {showImageModal && (
                    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setShowImageModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                            <h3 className="text-white font-bold mb-4 text-right">إدراج صورة داخل المقال</h3>
                            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" className="w-full bg-slate-950 border border-white/10 p-3 rounded mb-6 text-white" />
                            <button onClick={handleInsertImage} className="w-full bg-purple-600 text-white py-3 rounded font-bold">إدراج الصورة</button>
                        </motion.div>
                    </div>
                )}

                {/* Templates Modal */}
                {showTemplateModal && (
                    <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8" onClick={() => setShowTemplateModal(false)}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6" onClick={e => e.stopPropagation()}>
                            {SOVEREIGN_TEMPLATES.map(t => (
                                <div key={t.id} onClick={() => handleApplyTemplate(t)} className="bg-slate-900 border border-white/10 p-8 rounded-3xl hover:border-indigo-500 cursor-pointer group transition-all">
                                    <div className="mb-4 text-indigo-500">
                                        {t.id === 'case-study' && <Target size={32} />}
                                        {t.id === 'technical-breakdown' && <Code2 size={32} />}
                                        {t.id === 'strategic-insight' && <Activity size={32} />}
                                    </div>
                                    <h4 className="text-white font-bold text-xl mb-2 group-hover:text-indigo-400">{t.title}</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed mb-6">{t.description}</p>
                                    <div className="px-4 py-2 bg-white/5 rounded text-[10px] text-center uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">Apply Template</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WritingWorkspace;
