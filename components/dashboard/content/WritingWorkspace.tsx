import React, { useState, useEffect, useRef } from 'react';
import {
    X, Save, Eye, Layout, Type, Target,
    Zap, CheckCircle, ArrowRight, Image as ImageIcon,
    Code2, Activity, Users, Globe, Smartphone, Download, Hash,
    Settings, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article, AIConfig } from '../../../types';
import { SOVEREIGN_TEMPLATES, ArticleTemplate } from '../../../lib/article-templates';
import ImageUploader from '../../ui/ImageUploader';

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

    // Developer Mode (Next.js) State
    const [editorMode, setEditorMode] = useState<'classic' | 'nextjs'>('classic');
    const [activeFile, setActiveFile] = useState<'page.tsx' | 'layout.tsx' | 'metadata.ts'>('page.tsx');
    const [projectFiles, setProjectFiles] = useState({
        'page.tsx': '',
        'layout.tsx': '',
        'metadata.ts': ''
    });

    const editorRef = useRef<HTMLTextAreaElement>(null);

    // Initial check for mode
    useEffect(() => {
        if (article.content.startsWith('{"nextjs":true')) {
            try {
                const parsed = JSON.parse(article.content);
                setEditorMode('nextjs');
                setProjectFiles(parsed.files);
            } catch (e) {
                console.error("Failed to parse Next.js article content", e);
            }
        }
    }, []);

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
        const contentForAnalysis = editorMode === 'nextjs' ? projectFiles['page.tsx'] : article.content;
        const words = contentForAnalysis.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const readingTime = Math.ceil(wordCount / 200);

        const keyword = article.keywords?.[0] || '';
        const keywordCount = keyword ? (contentForAnalysis.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length : 0;
        const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

        const sentences = contentForAnalysis.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
        const readabilityScore = Math.max(0, 100 - (avgWordsPerSentence * 2));

        const metaLength = article.excerpt?.length || 0;
        const hasH1 = /<h1/i.test(contentForAnalysis);
        const h2Count = (contentForAnalysis.match(/<h2/gi) || []).length;

        setSeoMetrics({
            wordCount,
            readingTime,
            keywordDensity: Math.round(keywordDensity * 10) / 10,
            readabilityScore: Math.round(readabilityScore),
            metaLength,
            hasH1,
            h2Count
        });
    }, [article.content, article.excerpt, article.keywords, editorMode, projectFiles]);

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

        if (editorMode === 'nextjs') {
            setProjectFiles(prev => ({
                ...prev,
                [activeFile]: newContent
            }));
            updateArticleFromProject({ ...projectFiles, [activeFile]: newContent });
        } else {
            setArticle(prev => ({ ...prev, content: newContent }));
        }
    };

    const updateArticleFromProject = (files: any) => {
        const content = JSON.stringify({
            nextjs: true,
            files: files,
            activeFile: activeFile
        });
        setArticle(prev => ({ ...prev, content }));
    };

    const handleModeSwitch = (mode: 'classic' | 'nextjs') => {
        if (article.content.trim().length > 50 && !article.content.startsWith('{"nextjs":true')) {
            if (!confirm('سيتم تحويل المحتوى الحالي إلى تنسيق مختلف. هل أنت متأكد؟')) return;
        }
        setEditorMode(mode);
        if (mode === 'nextjs' && !article.content.startsWith('{"nextjs":true')) {
            const boilerplate = {
                'page.tsx': `export default function Page() {\n  return (\n    <div className="space-y-6">\n      <h1 className="text-4xl font-black">${article.title}</h1>\n      <p className="text-slate-300 text-lg">محتوى المقال يبدأ هنا...</p>\n    </div>\n  );\n}`,
                'layout.tsx': `export default function Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <section className="max-w-4xl mx-auto py-12 px-6">\n      {children}\n    </section>\n  );\n}`,
                'metadata.ts': `export const metadata = {\n  title: "${article.title}",\n  description: "${article.excerpt}",\n};`
            };
            setProjectFiles(boilerplate);
            updateArticleFromProject(boilerplate);
        }
    };

    const insertTag = (openTag: string, closeTag: string) => {
        const textarea = document.getElementById('main-editor') as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);
        const newContent = text.substring(0, start) + openTag + selection + closeTag + text.substring(end);

        if (editorMode === 'nextjs') {
            const updated = { ...projectFiles, [activeFile]: newContent };
            setProjectFiles(updated);
            updateArticleFromProject(updated);
        } else {
            setArticle(prev => ({ ...prev, content: newContent }));
        }

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + openTag.length, start + openTag.length + selection.length);
        }, 0);
    };

    const isNew = !initialArticle.id;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[1600] bg-slate-950 flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden"
        >
            {/* 1. STUDIO HEADER (PERSISTENT BREADCRUMBS) */}
            <div className="h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-[1700] shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all group">
                        <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <nav className="flex items-center gap-3 text-xs font-bold tracking-tight">
                        <span className="text-slate-500 uppercase tracking-widest text-[9px]">Archive</span>
                        <span className="text-slate-800">/</span>
                        <span className="text-indigo-400 uppercase tracking-widest text-[9px]">{isNew ? 'Drafting' : 'Studio'}</span>
                        <span className="text-slate-800">/</span>
                        <span className="text-white max-w-[300px] truncate">{article.title || 'Untitled Article'}</span>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {/* Real-time Sync Indicator */}
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-white/5 mr-4">
                        <div className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                            {saveStatus === 'saved' ? 'Sovereign Cloud: Synced' : 'Syncing Core...'}
                        </span>
                    </div>

                    <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
                        <button onClick={() => setView('editor')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'editor' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                            <Activity size={12} /> Canvas
                        </button>
                        <button onClick={() => setView('preview')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'preview' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                            <Eye size={12} /> Rendering
                        </button>
                    </div>

                    <button
                        onClick={() => { setSaveStatus('saving'); onSave(article); setTimeout(() => setSaveStatus('saved'), 1000); }}
                        className="bg-white text-slate-950 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] flex items-center gap-2 hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
                    >
                        <Save size={14} /> Deploy Studio
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* 2. MAIN CANVAS (LEFT) */}
                <div className="flex-1 overflow-y-auto bg-slate-950 scrollbar-hide py-12">
                    <div className="max-w-4xl mx-auto px-8 md:px-16 flex flex-col min-h-full">
                        {/* Title Refined */}
                        <textarea
                            value={article.title}
                            onChange={(e) => setArticle({ ...article, title: e.target.value })}
                            className="bg-transparent border-none text-5xl md:text-7xl font-black text-white placeholder:text-slate-900 outline-none resize-none overflow-hidden leading-[1.05] mb-12 text-right tracking-tighter"
                            placeholder="Primary Vision Title..."
                            rows={1}
                            style={{ height: 'auto' }}
                            onInput={(e) => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; }}
                            dir="rtl"
                        />

                        {view === 'editor' ? (
                            <div className="relative group">
                                {/* Floating Commands Panel */}
                                <div className="sticky top-4 z-40 mb-8 flex justify-end">
                                    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-2xl p-2 flex items-center gap-1 shadow-2xl">
                                        {[
                                            { label: 'H2', tag: '<h2></h2>' },
                                            { label: 'H3', tag: '<h3></h3>' },
                                            { label: 'BOLD', tag: '<strong></strong>' },
                                            { label: 'ITALIC', tag: '<em></em>' },
                                            { label: 'LIST', tag: '<ul>\n<li></li>\n</ul>' },
                                            { label: 'QUOTE', tag: '<blockquote></blockquote>' },
                                        ].map((tool) => (
                                            <button
                                                key={tool.label}
                                                onClick={() => insertTag(tool.tag.split('><')[0] + '>', '<' + tool.tag.split('><')[1])}
                                                className="px-4 py-2 rounded-xl text-[9px] font-black tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                {tool.label}
                                            </button>
                                        ))}
                                        <div className="w-[1px] h-4 bg-white/10 mx-2"></div>
                                        <button onClick={() => setShowLinkModal(true)} className="px-4 py-2 rounded-xl text-[9px] font-black text-blue-400 hover:bg-blue-500/10 tracking-widest uppercase">Link</button>
                                        <button onClick={() => setShowImageModal(true)} className="px-4 py-2 rounded-xl text-[9px] font-black text-purple-400 hover:bg-purple-500/10 tracking-widest uppercase">Image</button>
                                        <button onClick={() => setShowTemplateModal(true)} className="px-5 py-2 rounded-xl text-[9px] font-black text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 tracking-widest uppercase border border-amber-500/20">Templates</button>
                                    </div>
                                </div>

                                <textarea
                                    id="main-editor"
                                    value={editorMode === 'nextjs' ? projectFiles[activeFile] : article.content}
                                    onChange={(e) => {
                                        const newVal = e.target.value;
                                        if (editorMode === 'nextjs') {
                                            const updated = { ...projectFiles, [activeFile]: newVal };
                                            setProjectFiles(updated);
                                            updateArticleFromProject(updated);
                                        } else {
                                            setArticle({ ...article, content: newVal });
                                        }
                                    }}
                                    className="w-full bg-transparent border-none text-xl text-slate-300 placeholder:text-slate-900 outline-none resize-none leading-relaxed font-mono text-left min-h-[70vh]"
                                    placeholder={editorMode === 'nextjs' ? `// Architect your ${activeFile} code structure...` : "ابدأ صياغة رؤيتك هنا..."}
                                    dir={editorMode === 'nextjs' ? 'ltr' : 'rtl'}
                                />
                            </div>
                        ) : (
                            <div className="prose prose-invert prose-indigo max-w-none text-right" dir="rtl">
                                {editorMode === 'nextjs' ? (
                                    <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-12 overflow-hidden relative shadow-2xl">
                                        <div className="absolute top-6 left-8 flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/40" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/40" />
                                        </div>
                                        <div className="mt-12">
                                            <div className="text-slate-500 italic text-[10px] mb-8 pb-4 border-b border-white/5 font-black uppercase tracking-widest">// Next.js Runtime: v14.2.0 - Optimized Rendering</div>
                                            <div dangerouslySetInnerHTML={{ __html: projectFiles['page.tsx'] }} />
                                            <div className="mt-20 pt-10 border-t border-white/5 text-[9px] text-slate-600 flex justify-between uppercase tracking-[0.3em] font-black">
                                                <span>Edge Computing</span>
                                                <span className="text-indigo-500">Sovereign OS v4.5</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. PROPERTIES PANEL (RIGHT SIDEBAR) */}
                <div className="w-[380px] border-l border-white/5 bg-slate-950 overflow-y-auto overflow-x-hidden p-8 space-y-10 shrink-0">
                    {/* Header for Sidebar */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Properties Studio</h3>
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        </div>
                    </div>

                    {/* Mode Selector within Sidebar */}
                    <div className="p-1.5 bg-slate-900 rounded-2xl border border-white/5 flex gap-1">
                        <button onClick={() => handleModeSwitch('classic')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${editorMode === 'classic' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>Classic</button>
                        <button onClick={() => handleModeSwitch('nextjs')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${editorMode === 'nextjs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>Next.js</button>
                    </div>

                    {/* Next.js File Navigator if mode active */}
                    {editorMode === 'nextjs' && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest px-2">
                                <Layout size={12} /> App Router Architecture
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {(Object.keys(projectFiles) as (keyof typeof projectFiles)[]).map(file => (
                                    <button
                                        key={file}
                                        onClick={() => setActiveFile(file)}
                                        className={`w-full text-left p-4 rounded-2xl text-[11px] font-black flex items-center justify-between transition-all group ${activeFile === file ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-slate-500 border border-transparent hover:bg-white/5 hover:text-slate-300'}`}
                                    >
                                        <span className="flex items-center gap-3">
                                            {file.endsWith('.tsx') ? <Code2 size={14} className="text-blue-500" /> : <Hash size={14} className="text-amber-500" />}
                                            {file}
                                        </span>
                                        {activeFile === file && <motion.div layoutId="file-indicator" className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Assets & Meta Section */}
                    <div className="space-y-6 pt-4 border-t border-white/5">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Visual Assets</label>
                            <ImageUploader
                                currentImage={article.image}
                                onUpload={(url) => setArticle({ ...article, image: url })}
                                folder="articles"
                                label="Featured Hero Image"
                                aspectRatio="16/9"
                            />
                        </div>

                        <div className="space-y-4 pt-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Strategic Meta</label>
                            <textarea
                                value={article.excerpt}
                                onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                                className="w-full bg-slate-900/50 border border-white/10 text-white text-xs p-4 rounded-2xl outline-none focus:border-indigo-500/50 transition-all min-h-[100px] leading-relaxed"
                                placeholder="Strategic excerpt for indexing..."
                            />
                        </div>

                        <div className="space-y-4 pt-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Knowledge Tags</label>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                className="w-full bg-slate-900/50 border border-white/10 text-white text-xs p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all mb-4"
                                placeholder="Add Tag + Enter"
                            />
                            <div className="flex flex-wrap gap-2">
                                {article.tags?.map(tag => (
                                    <span key={tag} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 text-[10px] font-black rounded-lg border border-indigo-500/20 flex items-center gap-2 group-hover:bg-indigo-500/20">
                                        {tag} <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors"><X size={10} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Authority Analytics Section */}
                    <div className="space-y-6 pt-8 border-t border-white/5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Authority Score</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 text-center">
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Words</p>
                                <p className="text-xl font-black text-white">{seoMetrics.wordCount}</p>
                            </div>
                            <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 text-center">
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Read Time</p>
                                <p className="text-xl font-black text-indigo-400">{seoMetrics.readingTime}m</p>
                            </div>
                            <div className="col-span-2 p-5 bg-gradient-to-br from-indigo-600/10 to-transparent rounded-3xl border border-indigo-500/20">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">SEO Intelligence</span>
                                    <span className="text-xl font-black text-indigo-400">{seoMetrics.readabilityScore}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${seoMetrics.readabilityScore}%` }}
                                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions (CTA Links) */}
                    <div className="space-y-4 pt-8 border-t border-white/5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                            <Settings size={12} /> Strategic Links
                        </label>
                        <div className="space-y-3">
                            <div className="relative group">
                                <Smartphone size={10} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={article.ctaWhatsApp || ''}
                                    onChange={(e) => setArticle({ ...article, ctaWhatsApp: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-white/10 text-white text-[10px] pl-10 pr-4 py-3 rounded-xl outline-none focus:border-green-500/50 transition-all font-mono"
                                    placeholder="wa.me/link..."
                                />
                            </div>
                            <div className="relative group">
                                <Download size={10} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={article.ctaDownloadUrl || ''}
                                    onChange={(e) => setArticle({ ...article, ctaDownloadUrl: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-white/10 text-white text-[10px] pl-10 pr-4 py-3 rounded-xl outline-none focus:border-blue-500/50 transition-all font-mono"
                                    placeholder="download/url..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {/* Link Modal */}
                {showLinkModal && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-6">إدراج رابط سيادي</h3>
                            <div className="space-y-4">
                                <input type="text" placeholder="النص المعروض..." value={linkText} onChange={e => setLinkText(e.target.value)} className="w-full bg-slate-950 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-indigo-500" />
                                <input type="text" placeholder="الرابط (URL)..." value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="w-full bg-slate-950 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-indigo-500" />
                                <div className="flex gap-4 pt-4">
                                    <button onClick={handleInsertLink} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl">إدراج الآن</button>
                                    <button onClick={() => setShowLinkModal(false)} className="px-8 py-4 bg-white/5 text-slate-500 font-black rounded-2xl">إلغاء</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Image Modal */}
                {showImageModal && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-6">إدراج صورة استراتيجية</h3>
                            <div className="space-y-4">
                                <input type="text" placeholder="رابط الصورة المباشر..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-slate-950 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-indigo-500" />
                                <div className="flex gap-4 pt-4">
                                    <button onClick={handleInsertImage} className="flex-1 py-4 bg-purple-600 text-white font-black rounded-2xl">إدراج بالرابط</button>
                                    <button onClick={() => setShowImageModal(false)} className="px-8 py-4 bg-white/5 text-slate-500 font-black rounded-2xl">إلغاء</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Template Modal */}
                {showTemplateModal && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md" dir="rtl">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl scrollbar-hide">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-3xl font-black text-white">مكتبة القوالب السيادية</h3>
                                <button onClick={() => setShowTemplateModal(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"><X size={24} /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {SOVEREIGN_TEMPLATES.map((tmpl) => (
                                    <button
                                        key={tmpl.id}
                                        onClick={() => handleApplyTemplate(tmpl)}
                                        className="text-right p-6 bg-slate-950/50 border border-white/5 rounded-3xl hover:border-indigo-500/50 hover:bg-indigo-600/5 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                            <Layout size={24} />
                                        </div>
                                        <h4 className="text-xl font-black text-white mb-2">{tmpl.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">{tmpl.description}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default WritingWorkspace;
