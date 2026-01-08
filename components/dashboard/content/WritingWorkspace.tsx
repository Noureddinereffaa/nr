import React, { useState, useEffect, useRef } from 'react';
import {
    X, Save, Eye, Layout, Type, Target,
    Zap, CheckCircle, ArrowRight, Image as ImageIcon,
    Code2, Activity, Users, Globe, Smartphone, Download, Hash,
    Settings, ChevronRight, Sparkles, Link as LinkIcon, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article, AIConfig } from '../../../types';
import { SOVEREIGN_TEMPLATES, ArticleTemplate } from '../../../lib/article-templates';
import { useData } from '../../../context/DataContext';
import ImageUploader from '../../ui/ImageUploader';

interface WritingWorkspaceProps {
    article: Article;
    aiConfig: AIConfig;
    onSave: (article: Article) => void;
    onClose: () => void;
}

const WritingWorkspace: React.FC<WritingWorkspaceProps> = ({ article: initialArticle, aiConfig, onSave, onClose }) => {
    const { siteData } = useData();
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
    const [showIndexing, setShowIndexing] = useState(false);

    // Developer Mode (Next.js) State
    const [editorMode, setEditorMode] = useState<'classic' | 'nextjs'>('classic');
    const [activeFile, setActiveFile] = useState<'page.tsx' | 'layout.tsx' | 'metadata.ts'>('page.tsx');
    const [projectFiles, setProjectFiles] = useState({
        'page.tsx': '',
        'layout.tsx': '',
        'metadata.ts': ''
    });

    // AI Forge State
    const [isForging, setIsForging] = useState(false);
    const [forgeStep, setForgeStep] = useState<'idle' | 'architect' | 'forge' | 'completed'>('idle');
    const [forgeProgress, setForgeProgress] = useState(0);
    const [forgeStatus, setForgeStatus] = useState('');
    const [aiTopic, setAiTopic] = useState('');
    const [aiOutline, setAiOutline] = useState<any>(null);

    const editorRef = useRef<HTMLTextAreaElement>(null);

    // Initial check for mode
    useEffect(() => {
        if (article?.content?.startsWith('{"nextjs":true')) {
            try {
                const parsed = JSON.parse(article.content);
                setEditorMode('nextjs');
                setProjectFiles(parsed.files);
            } catch (e) {
                console.error("Failed to parse Next.js article content", e);
            }
        }
    }, []);

    // Revisions (Session-based)
    const [revisions, setRevisions] = useState<{ timestamp: string; article: Article }[]>([]);
    const [lastRevisionTime, setLastRevisionTime] = useState(Date.now());

    // SEO Analysis (Master Engine)
    const [seoMetrics, setSeoMetrics] = useState({
        wordCount: 0,
        readingTime: 0,
        keywordDensity: 0,
        readabilityScore: 0,
        metaLength: 0,
        hasH1: false,
        h2Count: 0,
        semanticReach: 0,
        aiOptimized: false,
        audit: [] as string[]
    });

    useEffect(() => {
        const contentForAnalysis = editorMode === 'nextjs' ? projectFiles['page.tsx'] : (article.content || '');
        const words = contentForAnalysis.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const readingTime = Math.ceil(wordCount / 200);

        const primaryKeyword = article.seo?.focusKeyword || '';
        const longTailKeywords = article.seo?.targetLongTail || [];

        const countOccurrences = (term: string) => term ? (contentForAnalysis.toLowerCase().match(new RegExp(term.toLowerCase(), 'g')) || []).length : 0;

        const keywordCount = countOccurrences(primaryKeyword);
        const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

        // Long-tail Coverage
        const coveredLongTail = longTailKeywords.filter(lt => contentForAnalysis.toLowerCase().includes(lt.toLowerCase())).length;
        const semanticReach = longTailKeywords.length > 0 ? (coveredLongTail / longTailKeywords.length) * 100 : 100;

        const sentences = contentForAnalysis.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
        const readabilityScore = Math.max(0, 100 - (avgWordsPerSentence * 2));

        const metaLength = article.seo?.description?.length || article.excerpt?.length || 0;
        const hasH1 = /<h1/i.test(contentForAnalysis);
        const h2Count = (contentForAnalysis.match(/<h2/gi) || []).length;

        // AI Search (SGE) Logic: Detect Direct Answer Structure
        const hasDirectAnswer = /^(ما هو|كيف يتم|كيفية|أفضل|مميزات)/i.test(contentForAnalysis.trim()) ||
            (contentForAnalysis.match(/(<h3>|<h4>)(ما هو|كيف|لماذا)/gi) || []).length > 0;

        const auditNodes: string[] = [];
        if (wordCount < 1500) auditNodes.push("المحتوى مثالي للسيو التقليدي ولكن الذكاء الاصطناعي يفضل 2000+ كلمة.");
        if (!primaryKeyword) auditNodes.push("نقص الكلمة المفتاحية الاستراتيجية الأساسية.");
        if (longTailKeywords.length < 3) auditNodes.push("استهدف المزيد من الكلمات طويلة الذيل (Long-tail) للهيمنة على Niche.");
        if (!hasDirectAnswer) auditNodes.push("المقال يفتقر لهيكلية 'الإجابة المباشرة' المفضلة لبوتات AI Search.");
        if (metaLength < 120 || metaLength > 160) auditNodes.push("طول الوصف (Meta Description) يجب أن يكون بين 120-160 حرفاً.");

        setSeoMetrics({
            wordCount,
            readingTime,
            keywordDensity: Math.round(keywordDensity * 10) / 10,
            readabilityScore: Math.round(readabilityScore),
            metaLength,
            hasH1,
            h2Count,
            semanticReach: Math.round(semanticReach),
            aiOptimized: hasDirectAnswer,
            audit: auditNodes
        });

        // Capture Revision
        if (Date.now() - lastRevisionTime > 600000 && hasChanges) {
            setRevisions(prev => [{ timestamp: new Date().toLocaleTimeString(), article: { ...article } }, ...prev.slice(0, 9)]);
            setLastRevisionTime(Date.now());
        }
    }, [article.content, article.seo, article.excerpt, editorMode, projectFiles, hasChanges]);

    // AI Forge Engine
    const startForge = async () => {
        if (!aiTopic) return alert("الرجاء إدخال موضوع المقال أولاً.");

        setIsForging(true);
        setForgeStep('architect');
        setForgeStatus('جاري هندسة هيكلية المقال الاستراتيجية...');
        setForgeProgress(10);

        try {
            // Stage 1: Architecting
            const archResp = await fetch('/api/ai/forge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stage: 'architect',
                    apiKey: siteData.aiConfig.apiKey,
                    payload: {
                        topic: aiTopic,
                        templateTitle: SOVEREIGN_TEMPLATES.find(t => t.id === article.category)?.title || 'General',
                        primaryKeyword: article.seo?.focusKeyword || '',
                        longTail: article.seo?.targetLongTail || []
                    }
                })
            });

            const archData = await archResp.json();
            if (!archResp.ok) throw new Error(archData.error);

            const outline = archData.result;
            setAiOutline(outline);
            setArticle(prev => ({
                ...prev,
                title: outline.title,
                excerpt: outline.excerpt,
                keywords: outline.keywords
            }));

            // Stage 2: Section-by-Section Forging
            setForgeStep('forge');
            setForgeProgress(20);

            let fullContent = "";
            let currentContext = outline.excerpt;

            for (let i = 0; i < outline.sections.length; i++) {
                const section = outline.sections[i];
                setForgeStatus(`جاري كتابة الجزء ${i + 1} من ${outline.sections.length}: ${section.title}...`);

                const forgeResp = await fetch('/api/ai/forge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        stage: 'forge',
                        apiKey: siteData.aiConfig.apiKey,
                        payload: {
                            topic: aiTopic,
                            section: section,
                            context: currentContext,
                            primaryKeyword: article.seo?.focusKeyword || '',
                            longTail: article.seo?.targetLongTail || []
                        }
                    })
                });

                const forgeData = await forgeResp.json();
                if (!forgeResp.ok) throw new Error(forgeData.error);

                let sectionContent = forgeData.result;

                // NEW: Visual Assets Real-Time Fetching (Phase 46)
                const imageRegex = /\[IMAGE_PROMPT:\s*([^\]]+)\]/gi;
                const matches = Array.from(sectionContent.matchAll(imageRegex));

                for (const match of matches) {
                    const fullMatch = match[0];
                    const prompt = match[1].trim();

                    try {
                        const imgResp = await fetch('/api/ai/images', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                query: prompt,
                                apiKey: siteData.aiConfig.unsplashKey
                            })
                        });
                        const imgData = await imgResp.json();

                        if (imgResp.ok && imgData.imageUrl) {
                            const replacement = `
                            <div class="my-12 relative group overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                                <img 
                                    src="${imgData.imageUrl}" 
                                    alt="${prompt}" 
                                    class="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                                <div class="absolute bottom-6 left-8 right-8">
                                    <p class="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Sovereign Visual Engine</p>
                                    <p class="text-xs text-white/70 font-bold italic">${prompt}</p>
                                </div>
                            </div>`;
                            sectionContent = sectionContent.replace(fullMatch, replacement);
                        }
                    } catch (imgError) {
                        console.error("Failed to fetch Unsplash image:", imgError);
                    }
                }

                fullContent += `\n<!-- SECTION: ${section.id} -->\n<section class="mb-16">\n<h2 class="text-3xl font-black text-white mb-8">${section.title}</h2>\n${sectionContent}\n</section>\n`;

                // Update workspace in real-time
                setArticle(prev => ({ ...prev, content: fullContent }));

                // Update progress
                const progressIncrement = 80 / outline.sections.length;
                setForgeProgress(prev => Math.min(95, prev + progressIncrement));

                // Update context for next section
                currentContext = sectionContent.substring(0, 300); // Send snippet of last section as context
            }

            setForgeProgress(100);
            setForgeStatus('اكتمل صب المقال بنجاح!');
            setForgeStep('completed');
            setTimeout(() => {
                setIsForging(false);
                setForgeStep('idle');
            }, 3000);

        } catch (error: any) {
            console.error("Forge Failure:", error);
            setForgeStatus(`خطأ في الصب: ${error.message}`);
            setTimeout(() => setIsForging(false), 5000);
        }
    };

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

    const handleTogglePublish = async () => {
        const newStatus = article.status === 'published' ? 'draft' : 'published';
        const updatedArticle = { ...article, status: newStatus as any };
        setArticle(updatedArticle);
        setSaveStatus('saving');
        await onSave(updatedArticle);
        setSaveStatus('saved');
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
                    {/* Real-time Status Badge */}
                    <div className={`hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border ${article.status === 'published' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'} mr-2`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                            {article.status === 'published' ? 'Live on Site' : 'Draft Mode'}
                        </span>
                    </div>

                    {/* Real-time Sync Indicator */}
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-white/5 mr-4">
                        <div className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saved' ? 'bg-indigo-500' : 'bg-amber-500 animate-pulse'}`} />
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
                        onClick={handleTogglePublish}
                        className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl ${article.status === 'published' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'}`}
                    >
                        {article.status === 'published' ? <X size={14} /> : <CheckCircle size={14} />}
                        {article.status === 'published' ? 'Set to Draft' : 'Publish Now'}
                    </button>

                    <button
                        onClick={() => { setSaveStatus('saving'); onSave(article); setTimeout(() => setSaveStatus('saved'), 1000); }}
                        className="bg-white text-slate-950 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] flex items-center gap-2 hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5 border border-white/10"
                    >
                        <Save size={14} /> Deploy Changes
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

                    {/* Global Asset Manager */}
                    <div className="space-y-6 pt-4 border-t border-white/5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Hero Intelligence</label>
                        <ImageUploader
                            currentImage={article.image}
                            onUpload={(url) => setArticle({ ...article, image: url })}
                            folder="articles"
                            label="Professional Thumbnail"
                            aspectRatio="16/9"
                        />
                    </div>

                    {/* SEO STRATEGIC COMMAND */}
                    <div className="space-y-8 pt-10 border-t border-white/5">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">SEO Command Center</h3>
                            <Target size={14} className="text-indigo-400" />
                        </div>

                        {/* Keyword Strategy Panel */}
                        <div className="p-6 bg-slate-900/50 rounded-[2.5rem] border border-white/5 space-y-6">
                            {/* Permalink Control */}
                            <div className="space-y-3 pb-4 border-b border-white/5">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                    <LinkIcon size={10} /> Permalink / Slug
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={article.slug}
                                        onChange={(e) => {
                                            const val = e.target.value
                                                .toLowerCase()
                                                .replace(/[^a-z0-9-\u0600-\u06FF]/g, '-') // Support Arabic characters + standard slug chars
                                                .replace(/-+/g, '-');
                                            setArticle({ ...article, slug: val });
                                        }}
                                        className="flex-1 bg-slate-950 border border-white/10 text-white text-[10px] p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-mono"
                                        placeholder="article-slug..."
                                    />
                                    <button
                                        onClick={() => {
                                            const generated = article.title
                                                .toLowerCase()
                                                .trim()
                                                .replace(/[^a-z0-9-\u0600-\u06FF]/g, '-')
                                                .replace(/-+/g, '-')
                                                .replace(/^-+|-+$/g, '');
                                            setArticle({ ...article, slug: generated });
                                        }}
                                        className="px-4 bg-white/5 hover:bg-white/10 text-[9px] font-black text-slate-400 rounded-2xl transition-all uppercase"
                                        title="Auto-generate from title"
                                    >
                                        Auto
                                    </button>
                                </div>
                                <p className="text-[8px] text-slate-500 font-bold italic px-2">Preview: /blog/{article.slug}</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                    <Globe size={10} /> Primary Focus Keyword
                                </label>
                                <input
                                    type="text"
                                    value={article.seo?.focusKeyword || ''}
                                    onChange={(e) => setArticle({ ...article, seo: { ...article.seo, focusKeyword: e.target.value } })}
                                    className="w-full bg-slate-950 border border-white/10 text-white text-xs p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                                    placeholder="e.g. أتمتة الشركات"
                                    dir="rtl"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                    <Type size={10} /> SEO Strategic Title
                                </label>
                                <input
                                    type="text"
                                    value={article.seo?.title || ''}
                                    onChange={(e) => setArticle({ ...article, seo: { ...article.seo, title: e.target.value } })}
                                    className="w-full bg-slate-950 border border-white/10 text-white text-xs p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                                    placeholder="SEO Title (Google format)..."
                                    dir="rtl"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={10} /> Strategic Meta Description
                                </label>
                                <textarea
                                    value={article.seo?.description || ''}
                                    onChange={(e) => setArticle({ ...article, seo: { ...article.seo, description: e.target.value } })}
                                    className="w-full bg-slate-950 border border-white/10 text-white text-[10px] p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold resize-none h-24"
                                    placeholder="Meta description for search engines..."
                                    dir="rtl"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                    <Hash size={10} /> Long-tail Targets
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add Target..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value.trim();
                                                if (val) {
                                                    const current = article.seo?.targetLongTail || [];
                                                    setArticle({ ...article, seo: { ...article.seo, targetLongTail: [...current, val] } });
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                        className="flex-1 bg-slate-950 border border-white/10 text-[10px] p-3 rounded-xl outline-none focus:border-indigo-500/50"
                                        dir="rtl"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {article.seo?.targetLongTail?.map(lt => (
                                        <span key={lt} className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold flex items-center gap-2 transition-all ${article.content?.toLowerCase().includes(lt.toLowerCase()) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-white/10 text-slate-500'}`}>
                                            {lt}
                                            <button onClick={() => setArticle({ ...article, seo: { ...article.seo, targetLongTail: article.seo.targetLongTail?.filter(x => x !== lt) } })} className="hover:text-white"><X size={10} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Search Intelligence Gauges */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-900 rounded-3xl border border-white/5 space-y-4">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter text-center">Google Visibility</p>
                                <div className="relative group">
                                    <svg className="w-16 h-16 mx-auto transform -rotate-90">
                                        <circle cx="32" cy="32" r="28" className="stroke-slate-800" strokeWidth="4" fill="transparent" />
                                        <motion.circle
                                            cx="32" cy="32" r="28"
                                            className="stroke-indigo-500"
                                            strokeWidth="4"
                                            fill="transparent"
                                            strokeDasharray={176}
                                            initial={{ strokeDashoffset: 176 }}
                                            animate={{ strokeDashoffset: 176 - (176 * (seoMetrics.readabilityScore / 100)) }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white">
                                        {seoMetrics.readabilityScore}%
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 bg-slate-900 rounded-3xl border border-white/5 space-y-4">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter text-center">AI Answers (SGE)</p>
                                <div className="relative group">
                                    <svg className="w-16 h-16 mx-auto transform -rotate-90">
                                        <circle cx="32" cy="32" r="28" className="stroke-slate-800" strokeWidth="4" fill="transparent" />
                                        <motion.circle
                                            cx="32" cy="32" r="28"
                                            className="stroke-purple-500"
                                            strokeWidth="4"
                                            fill="transparent"
                                            strokeDasharray={176}
                                            initial={{ strokeDashoffset: 176 }}
                                            animate={{ strokeDashoffset: 176 - (176 * (seoMetrics.semanticReach / 100)) }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white">
                                        {seoMetrics.semanticReach}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audit Log Refined */}
                        <div className="p-6 bg-slate-900/40 rounded-[2rem] border border-white/5 flex flex-col gap-4">
                            <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={12} /> Optimization Engine
                            </h4>
                            <div className="space-y-3">
                                {seoMetrics.audit.length === 0 ? (
                                    <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-2"><CheckCircle size={14} /> المقال يتصدر معايير الهيمنة.</p>
                                ) : (
                                    seoMetrics.audit.map((node, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                            <p className="text-slate-400 text-[10px] font-bold leading-relaxed" dir="rtl">{node}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI Sovereign Forge (Moved inside sidebar) */}
                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <div className="flex items-center justify-between px-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Sovereign Forge</label>
                            <Sparkles size={14} className="text-amber-500" />
                        </div>
                        <div className="p-6 bg-slate-900/50 rounded-[2rem] border border-white/5 space-y-4">
                            {!isForging ? (
                                <>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold italic">صب محتوى استراتيجي متكامل (2500+ كلمة) مبني على سياق ذكي وهيكلية سيادية.</p>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={aiTopic}
                                            onChange={(e) => setAiTopic(e.target.value)}
                                            placeholder="موضوع المقال..."
                                            className="w-full bg-slate-950 border border-white/10 text-white text-xs p-4 rounded-2xl outline-none focus:border-indigo-500 font-bold text-right"
                                            dir="rtl"
                                        />
                                        <button onClick={startForge} disabled={!aiTopic} className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-indigo-600/20"><Zap size={14} /> Forge Sovereignty</button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6 py-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-indigo-400 animate-pulse">{forgeStep === 'architect' ? 'Architecting' : 'Forging'}</span>
                                        <span className="text-white">{Math.round(forgeProgress)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${forgeProgress}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 text-center font-bold italic leading-relaxed">{forgeStatus}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Next.js File Navigator if mode active */}
                    {editorMode === 'nextjs' && (
                        <div className="space-y-4 pt-8 border-t border-white/5">
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

                    {/* Indexing & CRM Collapsible */}
                    <div className="pt-8 border-t border-white/5">
                        <button
                            onClick={() => setShowIndexing(!showIndexing)}
                            className="w-full flex items-center justify-between px-2 mb-4 group"
                        >
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer group-hover:text-indigo-400 transition-colors">Indexing & CRM Studio</label>
                            <motion.div
                                animate={{ rotate: showIndexing ? 90 : 0 }}
                                className="text-slate-600 group-hover:text-indigo-400 transition-colors"
                            >
                                <ChevronRight size={14} />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {showIndexing && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden space-y-8"
                                >
                                    {/* Strategic Meta (Excerpt) */}
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                            <Type size={10} /> Strategic Meta Excerpt
                                        </label>
                                        <textarea
                                            value={article.excerpt || ''}
                                            onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                                            className="w-full bg-slate-900/50 border border-white/10 text-white text-[10px] p-4 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold resize-none h-20"
                                            placeholder="Brief strategic summary for previews..."
                                            dir="rtl"
                                        />
                                    </div>

                                    {/* Strategic CTA */}
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2 flex items-center gap-2">
                                            <Settings size={12} /> Strategic CTA Links
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

                                    {/* Session History */}
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2 flex items-center justify-between w-full">
                                            History Snapshot
                                            <span className="text-indigo-400 tracking-tighter">{revisions.length} Snapshots</span>
                                        </label>
                                        <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide pr-1">
                                            {revisions.map((rev, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        if (confirm(`Restore version from ${rev.timestamp}?`)) {
                                                            setArticle(rev.article);
                                                            if (rev.article.content.startsWith('{"nextjs"')) {
                                                                const parsed = JSON.parse(rev.article.content);
                                                                setProjectFiles(parsed.files);
                                                                setEditorMode('nextjs');
                                                            } else {
                                                                setEditorMode('classic');
                                                            }
                                                        }
                                                    }}
                                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 transition-all group"
                                                >
                                                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-indigo-400">{rev.timestamp}</span>
                                                    <span className="text-[8px] font-black text-slate-700 group-hover:text-white uppercase">Restore</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
