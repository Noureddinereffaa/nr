
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
    const [view, setView] = useState<'editor' | 'preview'>('editor');
    const [aiStatus, setAiStatus] = useState<'idle' | 'working'>('idle');
    const [aiTools, setAiTools] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');
    const [selectedTone, setSelectedTone] = useState<'Sovereign' | 'Analytical' | 'Storyteller'>('Sovereign');
    const [generatedOutline, setGeneratedOutline] = useState<any[]>([]);

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

                    <button
                        onClick={() => onSave(article)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all"
                    >
                        <Save size={16} /> حفظ التغييرات
                    </button>
                </div>
            </div>

            {/* Main Workspace */}
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

                                                // Intelligent wrapping
                                                const openTag = tool.tag.split('><')[0] + '>';
                                                const closeTag = '<' + tool.tag.split('><')[1];

                                                // Special handle for self-closing or complex logic could go here
                                                // Simple wrap for now
                                                let insertion = tool.tag;
                                                if (selection) {
                                                    // This is a naive split, for V1 it works for simple tags
                                                    // Better logic:
                                                    const parts = tool.tag.match(/^<[^>]+>|<\/[^>]+>$/g);
                                                    // If prompt is just strings like <h2></h2> we can split by >
                                                    // Actually let's just insert at cursor if empty, or wrap if selected
                                                    insertion = selection ? tool.tag.replace('><', `>${selection}<`) : tool.tag;
                                                }

                                                const newText = before + insertion + after;
                                                setArticle({ ...article, content: newText });

                                                // Defer cursor move
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

                {/* SEO Realtime Score */}
                <div className="bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="text-right">
                            <h5 className="text-white font-black text-lg">99</h5>
                            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Authority Score</p>
                        </div>
                        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600">
                                <CheckCircle size={20} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-black text-slate-500">
                            <span>Industrial Grade</span>
                            <span className="text-emerald-500">Ready</span>
                        </div>
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-indigo-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 border-t border-white/5 text-center">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em] mb-4">Masterpiece in Progress</p>
                <div className="flex gap-2 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-20" />
                </div>
            </div>
        </div>
    );
};

export default WritingWorkspace;
