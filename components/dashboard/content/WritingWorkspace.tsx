
import React, { useState, useEffect } from 'react';
import {
    X, Save, Eye, Sparkles, Layout, Type, Target,
    ChevronRight, Zap, RefreshCw, CheckCircle,
    ArrowRight, MessageSquare, Tag, Image as ImageIcon,
    Search, Code2, ShieldCheck, Activity, FileJson, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article, AIConfig } from '../../../types';
import { AIService, DigitalCouncil } from '../../../lib/ai-service';

interface WritingWorkspaceProps {
    article: Article;
    aiConfig: AIConfig;
    onSave: (article: Article) => void;
    onClose: () => void;
}

const WritingWorkspace: React.FC<WritingWorkspaceProps> = ({ article: initialArticle, aiConfig, onSave, onClose }) => {
    const [article, setArticle] = useState<Article>(initialArticle);
    const [view, setView] = useState<'split' | 'editor' | 'preview'>('split');
    const [aiStatus, setAiStatus] = useState<'idle' | 'working'>('idle');
    const [aiTools, setAiTools] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');
    const [selectedTone, setSelectedTone] = useState<'Sovereign' | 'Analytical' | 'Storyteller'>('Sovereign');
    const [generatedOutline, setGeneratedOutline] = useState<any[]>([]);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [hasChanges, setHasChanges] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [focusMode, setFocusMode] = useState(false);

    // SEO Analysis State
    const [seoMetrics, setSeoMetrics] = useState({
        wordCount: 0,
        readingTime: 0,
        keywordDensity: 0,
        readabilityScore: 0,
        metaLength: 0,
        hasH1: false,
        h2Count: 0
    });

    // Calculate SEO Metrics in Real-Time
    useEffect(() => {
        const words = article.content.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const readingTime = Math.ceil(wordCount / 200);

        // Simple keyword density (if first keyword exists)
        const keyword = article.keywords?.[0] || '';
        const keywordCount = keyword ? (article.content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length : 0;
        const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

        // Simple readability (based on avg sentence length)
        const sentences = article.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
        const readabilityScore = Math.max(0, 100 - (avgWordsPerSentence * 2)); // Simple heuristic

        // Meta description length
        const metaLength = article.excerpt?.length || 0;

        // Check for H1 and H2
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

    // Auto-Save System
    useEffect(() => {
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
    }, [article.content, article.title, article.excerpt, article.slug, hasChanges, onSave]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyboard = (e: KeyboardEvent) => {
            // Ctrl+S: Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                setSaveStatus('saving');
                onSave(article);
                setTimeout(() => setSaveStatus('saved'), 500);
                return;
            }

            // Ctrl+B: Bold
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                insertTag('<strong>', '</strong>');
                return;
            }

            // Ctrl+I: Italic
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                insertTag('<em>', '</em>');
                return;
            }

            // Ctrl+Shift+P: Toggle Preview
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                setView(v => v === 'split' ? 'editor' : 'split');
                return;
            }

            // ESC: Exit Focus Mode
            if (e.key === 'Escape' && focusMode) {
                e.preventDefault();
                setFocusMode(false);
                return;
            }
        };

        window.addEventListener('keydown', handleKeyboard);
        return () => window.removeEventListener('keydown', handleKeyboard);
    }, [article, focusMode]);

    // Insert Link
    const handleInsertLink = () => {
        if (!linkUrl || !linkText) {
            alert('الرجاء إدخال الرابط والنص');
            return;
        }
        const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener">${linkText}</a>`;
        const textarea = document.getElementById('main-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const text = textarea.value;
        const newContent = text.substring(0, start) + linkHtml + text.substring(start);
        setArticle(prev => ({ ...prev, content: newContent }));

        setShowLinkModal(false);
        setLinkUrl('');
        setLinkText('');
    };

    // Insert Image
    const handleInsertImage = () => {
        if (!imageUrl) {
            alert('الرجاء إدخال رابط الصورة');
            return;
        }
        const imgHtml = `<img src="${imageUrl}" alt="Article Image" class="w-full rounded-2xl my-6" />`;
        const textarea = document.getElementById('main-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const text = textarea.value;
        const newContent = text.substring(0, start) + imgHtml + text.substring(start);
        setArticle(prev => ({ ...prev, content: newContent }));

        setShowImageModal(false);
        setImageUrl('');
    };

    // Helper: Insert HTML Tag
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

    // AI Actions
    const handleRefineTone = async () => {
        if (!article.content || article.content.length < 50) {
            alert('المحتوى قصير جداً للتحسين. اكتب المزيد أولاً.');
            return;
        }
        setAiStatus('working');
        try {
            const refined = await AIService.refineTone(article.content, selectedTone, aiConfig);
            setArticle(prev => ({ ...prev, content: refined }));
        } catch (error) {
            console.error("Tone refinement failed", error);
        } finally {
            setAiStatus('idle');
        }
    };
    const handleSuggestOutline = async () => {
        setAiStatus('working');
        try {
            const sections = await AIService.suggestOutline(article.title, aiConfig);
            setGeneratedOutline(sections);
        } catch (error) {
            console.error("Outline suggestion failed", error);
        } finally {
            setAiStatus('idle');
        }
    };

    const handleDraftSection = async (sectionTitle?: string) => {
        const targetSection = sectionTitle || activeSection;
        if (!targetSection) {
            alert('الرجاء كتابة اسم القسم الذي تريد توليده أولاً');
            return;
        }

        /* Verification of AI Config */
        if (!aiConfig.apiKey && !import.meta.env.VITE_GEMINI_API_KEY) {
            alert('مفتاح الذكاء الاصطناعي مفقود. يرجى التحقق من الإعدادات.');
            return;
        }

        setAiStatus('working');
        try {
            console.log(`Starting draft for: ${targetSection}`);
            // Use DIGITAL COUNCIL - Chief Editor
            const draft = await DigitalCouncil.ChiefEditor.draftSection(targetSection, article.content, selectedTone, aiConfig);

            if (!draft) throw new Error("Empty response from AI");

            setArticle(prev => ({
                ...prev,
                content: prev.content + "\n" + draft
            }));
            setActiveSection('');
        } catch (error: any) {
            console.error("Drafting failed", error);
            alert(`فشل توليد القسم: ${error.message || "خطأ غير معروف"}`);
        } finally {
            setAiStatus('idle');
        }
    };

    const handleSuggestImage = async () => {
        setAiStatus('working');
        try {
            // New: Generate REAL AI Image via Hugging Face (FLUX/SDXL)
            const imageUrl = await DigitalCouncil.VisualDirector.generateHeaderImage(article.title, aiConfig);
            setArticle(prev => ({ ...prev, image: imageUrl }));
        } catch (e) {
            console.error("Image Gen Failed", e);
            alert("فشل توليد الصورة (تأكد من مفتاح Hugging Face)");
        } finally {
            setAiStatus('idle');
        }
    };

    // --- New Council Handlers ---

    const handleSEOAnalyze = async () => {
        setAiStatus('working');
        try {
            const analysis = await DigitalCouncil.SEOAnalyst.analyze(article.content, article.keywords[0] || '', aiConfig);
            alert(`SEO Score: ${analysis.score}/100\nMissing: ${analysis.missingKeywords.join(', ')}`);
            // In a real app we would save this to state, but alert is fine for V1 verification
        } catch (e) { alert("SEO Analysis failed"); }
        finally { setAiStatus('idle'); }
    };

    const handleGenerateSchema = async () => {
        setAiStatus('working');
        try {
            const schema = await DigitalCouncil.SchemaEngineer.generateFAQSchema(article.content, aiConfig);
            console.log("Generated Schema:", schema);
            alert("FAQ Schema generated successfully (Logged to Console for V1)");
            // Future: Inject into article meta
        } catch (e) { alert("Schema generation failed"); }
        finally { setAiStatus('idle'); }
    };

    return (
        <div className="fixed inset-0 z-[1500] bg-slate-950 flex flex-col overflow-hidden animate-in fade-in duration-500">
            {/* Elite Header */}
            <div className="h-24 border-b border-white/5 bg-slate-900/50 backdrop-blur-3xl px-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-500 transition-all flex items-center justify-center border border-white/5"
                    >
                        <X size={20} />
                    </button>
                    <div className="h-10 w-[1px] bg-white/5" />
                    <div>
                        <h3 className="text-white font-black text-xl flex items-center gap-3">
                            {article.title}
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-widest font-black">Sovereign Studio</span>
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Manual Authority Writing Mode</p>
                    </div>
                </div>



                <div className="flex items-center gap-4">
                    {/* Save Status Indicator */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-950/50 border border-white/5 rounded-xl">
                        {saveStatus === 'saving' && (
                            <>
                                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                <span className="text-xs text-yellow-400 font-black">Saving...</span>
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <>
                                <CheckCircle size={14} className="text-green-500" />
                                <span className="text-xs text-green-400 font-black">Saved</span>
                            </>
                        )}
                        {saveStatus === 'unsaved' && (
                            <>
                                <div className="w-2 h-2 rounded-full bg-slate-500" />
                                <span className="text-xs text-slate-500 font-black">Unsaved</span>
                            </>
                        )}
                    </div>

                    <div className="flex bg-slate-950/50 p-1 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setView('editor')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${view === 'editor' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Type size={14} /> الكاتب
                        </button>
                        <button
                            onClick={() => setView('preview')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${view === 'preview' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Eye size={14} /> المعاينة
                        </button>
                    </div>

                    {/* Focus Mode Button */}
                    <button
                        onClick={() => setFocusMode(true)}
                        className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 border border-purple-500/20 transition-all"
                        title="Focus Mode (Esc to exit)"
                    >
                        <Target size={16} /> Focus
                    </button>

                    <button
                        onClick={() => {
                            setSaveStatus('saving');
                            onSave(article);
                            setTimeout(() => setSaveStatus('saved'), 500);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all"
                    >
                        <Save size={16} /> حفظ التغييرات
                    </button>
                </div>
            </div>


            {/* Main Workspace */}
            {focusMode ? (
                /* Focus Mode: Fullscreen Editor */
                <div className="flex-1 flex items-center justify-center p-12 overflow-y-auto">
                    <div className="max-w-4xl w-full space-y-8">
                        {/* Exit Focus Button */}
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => setFocusMode(false)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                            >
                                <X size={14} /> Exit Focus (ESC)
                            </button>
                            <div className="flex items-center gap-3 text-xs text-slate-600">
                                <span>{seoMetrics.wordCount} words</span>
                                <span>{seoMetrics.readingTime} min read</span>
                            </div>
                        </div>

                        {/* Minimal Title */}
                        <input
                            type="text"
                            value={article.title}
                            onChange={(e) => setArticle({ ...article, title: e.target.value })}
                            className="w-full bg-transparent border-none text-6xl font-black text-white outline-none placeholder:text-slate-900 text-right leading-tight"
                            placeholder="العنوان..."
                            dir="rtl"
                        />

                        {/* Fullscreen Editor */}
                        <textarea
                            id="main-editor"
                            value={article.content}
                            onChange={(e) => setArticle({ ...article, content: e.target.value })}
                            className="w-full bg-transparent border-none text-2xl text-slate-300 outline-none placeholder:text-slate-900 text-right leading-relaxed resize-none min-h-screen font-serif"
                            placeholder="ابدأ الكتابة..."
                            dir="rtl"
                            autoFocus
                        />
                    </div>
                </div>
            ) : (
                /* Normal Mode: Editor + Sidebar */
                <div className="flex-1 flex overflow-hidden">
                    {/* Editor Area */}
                    <div className="flex-1 overflow-y-auto bg-slate-950 p-12 scrollbar-none relative">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {view === 'editor' ? (
                                <>
                                    {/* Meta Controls */}
                                    <div className="grid grid-cols-2 gap-6 p-6 bg-slate-900/30 rounded-3xl border border-white/5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">الرابط الدائم (Slug)</label>
                                            <div className="flex items-center gap-2 text-slate-500 text-xs dir-ltr bg-slate-950/50 p-3 rounded-xl border border-white/5">
                                                <span>/blog/</span>
                                                <input
                                                    type="text"
                                                    value={article.slug}
                                                    onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                                                    className="bg-transparent border-none outline-none text-white w-full"
                                                    placeholder="my-article-slug"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">وصف الميتا (Meta Description)</label>
                                            <input
                                                type="text"
                                                value={article.excerpt}
                                                onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                                                className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500/50 transition-all text-right"
                                                placeholder="وصف مختصر يظهر في محركات البحث..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={article.title}
                                            onChange={(e) => setArticle({ ...article, title: e.target.value })}
                                            className="w-full bg-transparent border-none text-5xl font-black text-white outline-none placeholder:text-slate-800 text-right leading-tight"
                                            placeholder="أدخل عنوان السلطة هنا..."
                                            dir="rtl"
                                        />
                                    </div>

                                    {/* Editor Toolbar */}
                                    <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-2 justify-end shadow-2xl">
                                        {[
                                            { label: 'H2', tag: '<h2></h2>' },
                                            { label: 'H3', tag: '<h3></h3>' },
                                            { label: 'B', tag: '<strong></strong>' },
                                            { label: 'I', tag: '<em></em>' },
                                            { label: 'List', tag: '<ul>\n<li></li>\n</ul>' },
                                            { label: 'Quote', tag: '<blockquote></blockquote>' },
                                            { label: 'Alert', tag: '<div class="alert">\n</div>' },
                                        ].map((tool) => (
                                            <button
                                                key={tool.label}
                                                onClick={() => {
                                                    const textarea = document.getElementById('main-editor') as HTMLTextAreaElement;
                                                    if (!textarea) return;
                                                    const start = textarea.selectionStart;
                                                    const end = textarea.selectionEnd;
                                                    const text = textarea.value;
                                                    const before = text.substring(0, start);
                                                    const after = text.substring(end, text.length);
                                                    const selection = text.substring(start, end);

                                                    const openTag = tool.tag.split('><')[0] + '>';
                                                    const closeTag = '<' + tool.tag.split('><')[1];

                                                    let insertion = tool.tag;
                                                    if (selection) {
                                                        insertion = selection ? tool.tag.replace('><', `>${selection}<`) : tool.tag;
                                                    }

                                                    const newText = before + insertion + after;
                                                    setArticle({ ...article, content: newText });

                                                    setTimeout(() => {
                                                        textarea.focus();
                                                        textarea.setSelectionRange(start + openTag.length, start + openTag.length + (selection ? selection.length : 0));
                                                    }, 0);
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition-all border border-white/5"
                                            >
                                                {tool.label}
                                            </button>
                                        ))}
                                        <div className="h-4 w-[1px] bg-white/10 mx-2" />
                                        {/* Link Button */}
                                        <button
                                            onClick={() => setShowLinkModal(true)}
                                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 text-xs font-bold transition-all border border-blue-500/20"
                                            title="Insert Link (Ctrl+K)"
                                        >
                                            🔗 Link
                                        </button>
                                        {/* Image Button */}
                                        <button
                                            onClick={() => setShowImageModal(true)}
                                            className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 text-xs font-bold transition-all border border-purple-500/20"
                                            title="Insert Image"
                                        >
                                            🖼️ Image
                                        </button>
                                        <div className="h-4 w-[1px] bg-white/10 mx-2" />
                                        <span className="text-[10px] text-slate-600 font-mono">HTML MODE</span>
                                    </div>

                                    <div className="space-y-4 min-h-[60vh] relative">
                                        <textarea
                                            id="main-editor"
                                            value={article.content}
                                            onChange={(e) => setArticle({ ...article, content: e.target.value })}
                                            className="w-full bg-transparent border-none text-xl text-slate-300 outline-none placeholder:text-slate-800 text-right leading-relaxed resize-none min-h-[800px] font-serif"
                                            placeholder="ابدأ الكتابة..."
                                            dir="rtl"
                                        />
                                        {/* Metrics Footer */}
                                        <div className="absolute bottom-[-40px] left-0 text-[10px] text-slate-600 font-mono flex gap-4">
                                            <span>{article.content.split(/\s+/).length} Words</span>
                                            <span>{Math.ceil(article.content.split(/\s+/).length / 200)} Min Read</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="prose prose-invert prose-indigo max-w-none pb-20" dir="rtl">
                                    <h1 className="text-6xl font-black text-white mb-12 leading-tight">{article.title}</h1>
                                    <div dangerouslySetInnerHTML={{ __html: article.content }} className="text-xl text-slate-300 leading-relaxed" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Toolkit Sidebar */}
                    <div className="w-96 border-l border-white/5 bg-slate-900/30 flex flex-col">
                        <div className="p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
                            <h4 className="text-white font-black text-sm flex items-center gap-2">
                                <Users size={16} className="text-indigo-500" />
                                أدوات الكاتب المحترف
                            </h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Sovereign Toolkit</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
                            {/* 1. Visuals */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ImageIcon size={14} className="text-blue-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تجهيز الصورة</span>
                                </div>
                                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative group">
                                    <img src={article.image} alt="Article" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                                    <button
                                        onClick={handleSuggestImage}
                                        className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-indigo-600 backdrop-blur-xl p-2 rounded-xl border border-white/10 text-white transition-all">
                                        <RefreshCw size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* 2. SEO Tools */}
                            <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                                        <Search size={14} />
                                    </div>
                                    <span className="text-xs font-black text-green-300">SEO Check</span>
                                </div>
                                <button
                                    onClick={handleSEOAnalyze}
                                    className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                                >
                                    فحص التوافق (SEO)
                                </button>
                            </div>

                            {/* 3. Schema Tools */}
                            <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                                        <Code2 size={14} />
                                    </div>
                                    <span className="text-xs font-black text-orange-300">Technical Schema</span>
                                </div>
                                <button
                                    onClick={handleGenerateSchema}
                                    className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                                >
                                    توليد بيانات مهيكلة (Schema)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Real-Time SEO Analyzer */}
                    <div className="bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-white font-black text-sm">محلل SEO المباشر</h5>
                            <Activity size={16} className="text-indigo-500" />
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Word Count */}
                            <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Words</p>
                                <p className="text-lg font-black text-white">{seoMetrics.wordCount}</p>
                                <p className="text-[8px] text-slate-600">{seoMetrics.readingTime} min read</p>
                            </div>

                            {/* Readability Score */}
                            <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Readability</p>
                                <p className={`text-lg font-black ${seoMetrics.readabilityScore > 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {seoMetrics.readabilityScore}%
                                </p>
                                <p className="text-[8px] text-slate-600">
                                    {seoMetrics.readabilityScore > 80 ? 'Excellent' : seoMetrics.readabilityScore > 60 ? 'Good' : 'Complex'}
                                </p>
                            </div>

                            {/* Keyword Density */}
                            <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Keyword Density</p>
                                <p className={`text-lg font-black ${seoMetrics.keywordDensity > 1 && seoMetrics.keywordDensity < 3 ? 'text-green-400' : 'text-orange-400'}`}>
                                    {seoMetrics.keywordDensity}%
                                </p>
                                <p className="text-[8px] text-slate-600">
                                    {seoMetrics.keywordDensity < 1 ? 'Low' : seoMetrics.keywordDensity > 3 ? 'High' : 'Optimal'}
                                </p>
                            </div>

                            {/* Meta Length */}
                            <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Meta Desc</p>
                                <p className={`text-lg font-black ${seoMetrics.metaLength >= 50 && seoMetrics.metaLength <= 160 ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {seoMetrics.metaLength}
                                </p>
                                <p className="text-[8px] text-slate-600">
                                    {seoMetrics.metaLength < 50 ? 'Too short' : seoMetrics.metaLength > 160 ? 'Too long' : 'Perfect'}
                                </p>
                            </div>
                        </div>

                        {/* Structure Check */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-bold">H1 Tag:</span>
                                <span className={seoMetrics.hasH1 ? 'text-green-400' : 'text-red-400'}>
                                    {seoMetrics.hasH1 ? '✓ Found' : '✗ Missing'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-bold">H2 Tags:</span>
                                <span className={seoMetrics.h2Count > 0 ? 'text-green-400' : 'text-yellow-400'}>
                                    {seoMetrics.h2Count} found
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-8 border-t border-white/5 text-center">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em] mb-4">Masterpiece in Progress</p>
                <div className="flex gap-2 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-20" />
                </div>
            </div>

            {/* Link Insertion Modal */}
            {
                showLinkModal && (
                    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setShowLinkModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-white font-black text-xl mb-6 text-right">إدراج رابط</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-slate-400 text-sm font-bold block mb-2 text-right">نص الرابط</label>
                                    <input
                                        type="text"
                                        value={linkText}
                                        onChange={(e) => setLinkText(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all text-right"
                                        placeholder="اضغط هنا"
                                        dir="rtl"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm font-bold block mb-2 text-right">عنوان URL</label>
                                    <input
                                        type="url"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowLinkModal(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 font-bold transition-all"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={handleInsertLink}
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 font-bold transition-all"
                                    >
                                        إدراج
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )
            }

            {/* Image Insertion Modal */}
            {
                showImageModal && (
                    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setShowImageModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-white font-black text-xl mb-6 text-right">إدراج صورة</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-slate-400 text-sm font-bold block mb-2 text-right">رابط الصورة (URL)</label>
                                    <input
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500 transition-all"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                {imageUrl && (
                                    <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+URL'} />
                                    </div>
                                )}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowImageModal(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 font-bold transition-all"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={handleInsertImage}
                                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-3 font-bold transition-all"
                                    >
                                        إدراج
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
};

export default WritingWorkspace;
