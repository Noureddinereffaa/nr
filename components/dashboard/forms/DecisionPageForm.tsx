import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Save, Plus, Trash2, Image as ImageIcon, Link as LinkIcon,
    Layout, FileText, BarChart3, Search, Settings, Video, File, User, MessageSquare,
    Bold, Italic, List, Heading2, Quote, ArrowRight, Eye, Layers, Scale, Check, Menu
} from 'lucide-react';
import { DecisionPage } from '../../../types';

interface DecisionPageFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<DecisionPage, 'id' | 'date'>) => Promise<void>;
    initialData?: DecisionPage | null;
}

type TabType = 'essentials' | 'content' | 'analysis' | 'comparison' | 'media' | 'seo' | 'testimonials';

const DecisionPageForm: React.FC<DecisionPageFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [activeTab, setActiveTab] = useState<TabType>('essentials');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<DecisionPage>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                title: '',
                subtitle: '',
                slug: '',
                category: 'crm',
                rating: 4.5,
                badge: '',
                badgeColor: 'from-indigo-500 to-purple-500',
                description: '',
                pros: [''],
                cons: [''],
                pricing: '',
                bestFor: '',
                verdict: '',
                affiliateUrl: '',
                image: '',
                status: 'draft',
                seo: { title: '', description: '', keywords: [] },
                metrics: { timeSaved: '', tasksAutomated: '', roiMultiplier: '' },
                author: { name: '', role: '', image: '' },
                faq: [],
                media: { gallery: [], videoUrl: '', pdfUrl: '' },
                comparison: [],
                testimonials: []
            });
            setActiveTab('essentials');
        }
    }, [initialData, isOpen]);

    const handleChange = (field: keyof DecisionPage, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent: keyof DecisionPage, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as any),
                [field]: value
            }
        }));
    };

    const handleListChange = (field: 'pros' | 'cons', index: number, value: string) => {
        const newList = [...(formData[field] || [])];
        newList[index] = value;
        setFormData(prev => ({ ...prev, [field]: newList }));
    };

    const addListItem = (field: 'pros' | 'cons') => {
        setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
    };

    const removeListItem = (field: 'pros' | 'cons', index: number) => {
        const newList = [...(formData[field] || [])];
        newList.splice(index, 1);
        setFormData(prev => ({ ...prev, [field]: newList }));
    };

    // FAQ Handlers
    const addFaq = () => {
        setFormData(prev => ({
            ...prev,
            faq: [...(prev.faq || []), { question: '', answer: '' }]
        }));
    };

    const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
        const newFaq = [...(formData.faq || [])];
        newFaq[index] = { ...newFaq[index], [field]: value };
        setFormData(prev => ({ ...prev, faq: newFaq }));
    };

    const removeFaq = (index: number) => {
        const newFaq = [...(formData.faq || [])];
        newFaq.splice(index, 1);
        setFormData(prev => ({ ...prev, faq: newFaq }));
    };

    // Comparison Builder
    const addComparisonRow = () => {
        setFormData(prev => ({
            ...prev,
            comparison: [...(prev.comparison || []), { feature: '', us: '', other: '' }]
        }));
    };

    const updateComparisonRow = (index: number, field: 'feature' | 'us' | 'other', value: string) => {
        const newRows = [...(formData.comparison || [])];
        newRows[index] = { ...newRows[index], [field]: value };
        setFormData(prev => ({ ...prev, comparison: newRows }));
    };

    const removeComparisonRow = (index: number) => {
        const newRows = [...(formData.comparison || [])];
        newRows.splice(index, 1);
        setFormData(prev => ({ ...prev, comparison: newRows }));
    };

    // Gallery & Testimonials
    const handleGalleryListChange = (index: number, value: string) => {
        const newGallery = [...(formData.media?.gallery || [])];
        newGallery[index] = value;
        setFormData(prev => ({ ...prev, media: { ...prev.media, gallery: newGallery } }));
    };

    const addGalleryImage = () => {
        setFormData(prev => ({ ...prev, media: { ...prev.media, gallery: [...(prev.media?.gallery || []), ''] } }));
    };

    const removeGalleryImage = (index: number) => {
        const newGallery = [...(formData.media?.gallery || [])];
        newGallery.splice(index, 1);
        setFormData(prev => ({ ...prev, media: { ...prev.media, gallery: newGallery } }));
    };

    // Testimonials
    const addTestimonial = () => {
        setFormData(prev => ({
            ...prev,
            testimonials: [...(prev.testimonials || []), { text: '', author: '', role: '' }]
        }));
    };

    const updateTestimonial = (index: number, field: string, value: string) => {
        const newTestimonials = [...(formData.testimonials || [])];
        (newTestimonials[index] as any)[field] = value;
        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
    };

    const removeTestimonial = (index: number) => {
        const newTestimonials = [...(formData.testimonials || [])];
        newTestimonials.splice(index, 1);
        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
    };

    // Editor Helpers
    const insertTemplate = () => {
        const template = `## The Problem: Agency Chaos
[Describe the pain point here...]

## How It Solves It
[Explain the solution...]

> **Pro Tip:** Use this section to highlight a specific feature or hidden gem.

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Who Is It For?
- **Perfect for:** [Audience A]
- **Not for:** [Audience B]

## Pricing Breakdown
[Explain pricing...]
`;
        setFormData(prev => ({ ...prev, description: (prev.description || '') + template }));
    };

    const insertFormat = (format: string) => {
        const textarea = document.getElementById('description-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.description || '';
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        let newText = '';
        let cursorOffset = 0;

        switch (format) {
            case 'bold':
                newText = `${before}**${selection || 'bold text'}**${after}`;
                cursorOffset = selection ? 4 : 2;
                break;
            case 'italic':
                newText = `${before}_${selection || 'italic text'}_${after}`;
                cursorOffset = selection ? 2 : 1;
                break;
            case 'h2':
                newText = `${before}\n## ${selection || 'Heading 2'}\n${after}`;
                cursorOffset = selection ? 5 : 4;
                break;
            case 'list':
                newText = `${before}\n- ${selection || 'List item'}${after}`;
                cursorOffset = selection ? 3 : 2;
                break;
            case 'quote':
                newText = `${before}\n> ${selection || 'Blockquote'}\n${after}`;
                cursorOffset = selection ? 3 : 2;
                break;
        }

        setFormData(prev => ({ ...prev, description: newText }));
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + (selection ? 0 : format === 'list' ? 9 : format.length + 5));
        }, 0);
    };

    // Governance Checks
    const isSeoComplete = !!(formData.seo?.title && formData.seo?.description);
    const hasCta = !!formData.affiliateUrl;
    const hasComparison = (formData.comparison?.length || 0) > 0;
    const isGovernanceComplete = isSeoComplete && hasCta && hasComparison;
    const isPublishBlocked = formData.status === 'published' && !isGovernanceComplete;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isPublishBlocked) {
            alert("Governance Check Failed: You cannot publish until all required items are completed.");
            return;
        }

        try {
            const finalData = {
                ...formData,
                seo: formData.seo || { title: formData.title, description: formData.subtitle, keywords: [] },
                dates: formData.dates || { published: new Date().toISOString(), updated: new Date().toISOString() }
            };
            await onSave(finalData as Omit<DecisionPage, 'id' | 'date'>);
            onClose();
        } catch (error) {
            console.error("Failed to save page", error);
            alert("Failed to save. Check console.");
        }
    };

    if (!isOpen) return null;

    const tabs: { id: TabType, label: string, icon: any }[] = [
        { id: 'essentials', label: 'Overview', icon: Layout },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'analysis', label: 'Analysis', icon: BarChart3 },
        { id: 'comparison', label: 'Comparison', icon: Scale },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'seo', label: 'SEO', icon: Search },
        { id: 'testimonials', label: 'Social Proof', icon: MessageSquare },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-[90rem] h-full sm:h-[90vh] bg-slate-900 border border-white/10 sm:rounded-2xl shadow-2xl flex overflow-hidden flex-col lg:flex-row"
                >
                    {/* Mobile Header */}
                    <div className="lg:hidden h-16 border-b border-white/5 flex items-center justify-between px-4 bg-slate-950 shrink-0">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
                                <Menu size={24} />
                            </button>
                            <span className="font-bold text-white">Page Editor</span>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white"><X size={24} /></button>
                    </div>

                    {/* Sidebar Tabs */}
                    <div className={`
                        fixed inset-0 z-20 bg-slate-950 lg:relative lg:w-64 lg:bg-slate-950 lg:border-r lg:border-white/5 lg:flex lg:flex-col lg:transform-none transition-transform duration-300
                        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}>
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Settings className="text-indigo-500" />
                                    Page Editor
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">{initialData ? 'Editing: ' + initialData.title : 'Creating New Page'}</p>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>

                        {/* Content Governance Checklist */}
                        <div className="p-4 border-t border-white/5 space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Governance</h3>
                            <div className="space-y-2">
                                <GovernanceItem label="SEO Completed" isComplete={isSeoComplete} />
                                <GovernanceItem label="CTA Exists" isComplete={hasCta} />
                                <GovernanceItem label="Comparison Filled" isComplete={hasComparison} />
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/5 space-y-3">
                            {/* Preview Button */}
                            {formData.slug && (
                                <button
                                    onClick={() => window.open(`/reviews/${formData.slug}?preview=true`, '_blank')}
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mb-2"
                                >
                                    <Eye size={18} /> Preview Page
                                </button>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={isPublishBlocked}
                                title={isPublishBlocked ? "Complete Governance items to Publish" : "Save Changes"}
                                className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${isPublishBlocked
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                                    }`}
                            >
                                <Save size={18} /> {isPublishBlocked ? 'Blocked' : 'Save Changes'}
                            </button>
                            {isPublishBlocked && <div className="text-[10px] text-rose-400 text-center mt-2 font-medium">Action Disabled: Governance incomplete</div>}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col bg-slate-900 h-full overflow-hidden">
                        {/* Desktop Header Toolbar */}
                        <div className="hidden lg:flex h-16 border-b border-white/5 items-center justify-between px-8 bg-slate-900/50 backdrop-blur z-10 w-full">
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${formData.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></div> {formData.status === 'published' ? 'Live' : 'Draft'}</span>
                                <span className="w-px h-4 bg-white/10"></span>
                                <span>slug: /{formData.slug}</span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Form Area */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-5xl mx-auto">
                                <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)?.icon, { size: 28, className: "text-indigo-400" })}
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h1>

                                {activeTab === 'essentials' && (
                                    <div className="grid grid-cols-12 gap-6">
                                        <div className="col-span-8 space-y-6">
                                            <div className="space-y-2">
                                                <label className="label-text">Page Verified Title</label>
                                                <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="input-primary text-lg font-bold" placeholder="e.g. GoHighLevel Review 2026" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="label-text">Compelling Subtitle</label>
                                                <textarea rows={2} value={formData.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} className="input-primary text-base" placeholder="Hook the reader immediately..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="label-text">Affiliate / Target URL</label>
                                                    <div className="relative">
                                                        <LinkIcon size={16} className="absolute left-3 top-3 text-slate-500" />
                                                        <input type="text" value={formData.affiliateUrl} onChange={(e) => handleChange('affiliateUrl', e.target.value)} className="input-primary pl-10" placeholder="https://..." />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="label-text">Page Slug</label>
                                                    <input type="text" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} className="input-primary font-mono text-sm" placeholder="url-slug" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-4 space-y-6">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                                                <label className="label-text text-indigo-400">Publishing Status</label>
                                                <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className="input-primary appearance-none">
                                                    <option value="draft">Draft</option>
                                                    <option value="published">Published</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                                <div className="h-px bg-white/10"></div>
                                                <div className="space-y-2">
                                                    <label className="label-text">Category</label>
                                                    <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} className="input-primary appearance-none">
                                                        <option value="crm">CRM & Sales</option>
                                                        <option value="marketing">Marketing</option>
                                                        <option value="automation">Automation</option>
                                                        <option value="ai">AI Assistants</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                                                <label className="label-text text-indigo-400">Badge Config</label>
                                                <input type="text" value={formData.badge} onChange={(e) => handleChange('badge', e.target.value)} className="input-primary" placeholder="Badge Text (Optional)" />
                                                <input type="text" value={formData.badgeColor} onChange={(e) => handleChange('badgeColor', e.target.value)} className="input-primary text-xs" placeholder="Gradient Classes" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'analysis' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-4">
                                                <h3 className="text-white font-bold flex items-center gap-2"><StarIcon /> Rating</h3>
                                                <input type="number" step="0.1" max="5" value={formData.rating} onChange={(e) => handleChange('rating', parseFloat(e.target.value))} className="input-primary text-3xl font-bold text-center" />
                                                <p className="text-center text-xs text-slate-500">Out of 5.0</p>
                                            </div>
                                            <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-4">
                                                <h3 className="text-white font-bold flex items-center gap-2"><DollarIcon /> Pricing Label</h3>
                                                <input type="text" value={formData.pricing} onChange={(e) => handleChange('pricing', e.target.value)} className="input-primary text-xl font-bold text-center" placeholder="$97/mo" />
                                                <p className="text-center text-xs text-slate-500">Display Price</p>
                                            </div>
                                            <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-4">
                                                <h3 className="text-white font-bold flex items-center gap-2"><TargetIcon /> Best For</h3>
                                                <input type="text" value={formData.bestFor} onChange={(e) => handleChange('bestFor', e.target.value)} className="input-primary text-xl font-bold text-center" placeholder="Agencies" />
                                                <p className="text-center text-xs text-slate-500">Target Audience</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="label-text text-lg">Detailed Verdict</label>
                                            <textarea rows={4} value={formData.verdict} onChange={(e) => handleChange('verdict', e.target.value)} className="input-primary text-base leading-relaxed" placeholder="Write your professional conclusion..." />
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <h3 className="text-green-400 font-bold uppercase text-sm tracking-wider flex items-center gap-2"><Check size={16} /> Pros List</h3>
                                                <div className="space-y-2">
                                                    {formData.pros?.map((item, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <input type="text" value={item} onChange={(e) => handleListChange('pros', index, e.target.value)} className="flex-1 input-primary" />
                                                            <button type="button" onClick={() => removeListItem('pros', index)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => addListItem('pros')} className="w-full py-2 border border-dashed border-white/10 rounded-lg text-slate-400 hover:text-green-400 hover:border-green-400/30 transition-all text-sm font-medium">+ Add Pro</button>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-rose-400 font-bold uppercase text-sm tracking-wider flex items-center gap-2"><X size={16} /> Cons List</h3>
                                                <div className="space-y-2">
                                                    {formData.cons?.map((item, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <input type="text" value={item} onChange={(e) => handleListChange('cons', index, e.target.value)} className="flex-1 input-primary" />
                                                            <button type="button" onClick={() => removeListItem('cons', index)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => addListItem('cons')} className="w-full py-2 border border-dashed border-white/10 rounded-lg text-slate-400 hover:text-rose-400 hover:border-rose-400/30 transition-all text-sm font-medium">+ Add Con</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-white/5 pt-8">
                                            <h3 className="text-lg font-bold text-white mb-4">Performance Data Icons</h3>
                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="label-text">Time Saved</label>
                                                    <input type="text" value={formData.metrics?.timeSaved || ''} onChange={(e) => handleNestedChange('metrics', 'timeSaved', e.target.value)} className="input-primary" placeholder="e.g. 10hrs/week" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="label-text">Tasks Automated</label>
                                                    <input type="text" value={formData.metrics?.tasksAutomated || ''} onChange={(e) => handleNestedChange('metrics', 'tasksAutomated', e.target.value)} className="input-primary" placeholder="e.g. 50+" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="label-text">ROI Multiplier</label>
                                                    <input type="text" value={formData.metrics?.roiMultiplier || ''} onChange={(e) => handleNestedChange('metrics', 'roiMultiplier', e.target.value)} className="input-primary" placeholder="e.g. 5x" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'comparison' && (
                                    <div className="space-y-6">
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex items-start gap-3">
                                            <div className="p-2 bg-indigo-500/20 rounded-lg"><Scale size={20} className="text-indigo-400" /></div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm">Comparison Builder</h4>
                                                <p className="text-slate-400 text-xs mt-1">Add features to compare {formData.title || 'this tool'} against competitors. The first column is the feature name, 'Us' is this tool's value, and 'Others' represents the industry standard or main competitor.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="grid grid-cols-12 gap-4 px-2">
                                                <div className="col-span-4 text-xs font-bold text-slate-500 uppercase">Feature Name</div>
                                                <div className="col-span-3 text-xs font-bold text-green-500 uppercase">Us (Winner)</div>
                                                <div className="col-span-4 text-xs font-bold text-slate-500 uppercase">Others / Competitors</div>
                                                <div className="col-span-1"></div>
                                            </div>

                                            {formData.comparison?.map((row, index) => (
                                                <div key={index} className="grid grid-cols-12 gap-4 items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                                    <div className="col-span-4">
                                                        <input type="text" value={row.feature} onChange={(e) => updateComparisonRow(index, 'feature', e.target.value)} className="input-ghost w-full font-medium text-white" placeholder="e.g. Email Automation" />
                                                    </div>
                                                    <div className="col-span-3">
                                                        <input type="text" value={row.us} onChange={(e) => updateComparisonRow(index, 'us', e.target.value)} className="input-ghost w-full text-green-400 font-bold" placeholder="Unlimited" />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <input type="text" value={row.other} onChange={(e) => updateComparisonRow(index, 'other', e.target.value)} className="input-ghost w-full text-slate-400" placeholder="Limited / Paid" />
                                                    </div>
                                                    <div className="col-span-1 text-right">
                                                        <button type="button" onClick={() => removeComparisonRow(index)} className="p-2 text-slate-600 hover:text-rose-400 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button type="button" onClick={addComparisonRow} className="w-full py-3 border border-dashed border-white/10 rounded-xl text-slate-400 hover:text-indigo-400 hover:border-indigo-400/30 hover:bg-white/5 transition-all font-medium flex items-center justify-center gap-2">
                                            <Plus size={18} /> Add Comparison Row
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'content' && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col h-[600px] border border-white/10 rounded-xl overflow-hidden bg-black/20">
                                            <div className="flex items-center gap-1 bg-slate-900 p-2 border-b border-white/10 overflow-x-auto">
                                                <EditorButton onClick={() => insertFormat('bold')} icon={Bold} title="Bold" />
                                                <EditorButton onClick={() => insertFormat('italic')} icon={Italic} title="Italic" />
                                                <div className="w-px h-5 bg-white/10 mx-1"></div>
                                                <EditorButton onClick={() => insertFormat('h2')} icon={Heading2} title="Heading 2" />
                                                <EditorButton onClick={() => insertFormat('quote')} icon={Quote} title="Quote" />
                                                <EditorButton onClick={() => insertFormat('list')} icon={List} title="List" />
                                                <div className="flex-1"></div>
                                                <button type="button" onClick={insertTemplate} className="text-xs bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-600/20 transition-colors font-bold whitespace-nowrap">
                                                    Insert Template
                                                </button>
                                            </div>
                                            <textarea
                                                id="description-editor"
                                                value={formData.description}
                                                onChange={(e) => handleChange('description', e.target.value)}
                                                className="flex-1 bg-transparent p-6 text-slate-300 font-mono text-sm leading-relaxed resize-none focus:outline-none"
                                                placeholder="# Start writing your in-depth review..."
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-bold text-white">Frequently Asked Questions</h3>
                                                <button type="button" onClick={addFaq} className="text-xs bg-indigo-600 px-4 py-2 rounded-lg text-white font-bold hover:bg-indigo-500 transition-colors">Add FAQ Item</button>
                                            </div>
                                            <div className="space-y-4">
                                                {formData.faq?.map((item, index) => (
                                                    <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3 relative group">
                                                        <button type="button" onClick={() => removeFaq(index)} className="absolute top-4 right-4 text-slate-600 hover:text-rose-400 transition-colors"><X size={16} /></button>
                                                        <input type="text" value={item.question} onChange={(e) => updateFaq(index, 'question', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-white font-bold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Question?" />
                                                        <textarea rows={2} value={item.answer} onChange={(e) => updateFaq(index, 'answer', e.target.value)} className="w-full bg-transparent text-slate-400 focus:outline-none text-sm resize-none" placeholder="Answer..." />
                                                    </div>
                                                ))}
                                                {(!formData.faq || formData.faq.length === 0) && (
                                                    <div className="text-center text-slate-500 py-6 border border-dashed border-white/10 rounded-xl">No FAQs added yet</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'media' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="label-text">Main Feature Image</label>
                                                <div className="flex gap-2">
                                                    <div className="bg-white/5 p-3 rounded-lg border border-white/10"><ImageIcon size={20} className="text-slate-400" /></div>
                                                    <input type="text" value={formData.image} onChange={(e) => handleChange('image', e.target.value)} className="w-full input-primary" placeholder="https://..." />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="label-text">PDF Lead Magnet URL</label>
                                                <div className="flex gap-2">
                                                    <div className="bg-white/5 p-3 rounded-lg border border-white/10"><File size={20} className="text-slate-400" /></div>
                                                    <input type="text" value={formData.media?.pdfUrl || ''} onChange={(e) => handleNestedChange('media', 'pdfUrl', e.target.value)} className="w-full input-primary" placeholder="https://..." />
                                                </div>
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <label className="label-text">YouTube Embed URL</label>
                                                <div className="flex gap-2">
                                                    <div className="bg-white/5 p-3 rounded-lg border border-white/10"><Video size={20} className="text-slate-400" /></div>
                                                    <input type="text" value={formData.media?.videoUrl || ''} onChange={(e) => handleNestedChange('media', 'videoUrl', e.target.value)} className="w-full input-primary" placeholder="https://www.youtube.com/embed/..." />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="label-text text-lg">Screenshot Gallery</label>
                                                <button type="button" onClick={addGalleryImage} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white font-medium transition-colors">+ Add Image</button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {formData.media?.gallery?.map((url, index) => (
                                                    <div key={index} className="flex gap-3 items-center">
                                                        <div className="w-16 h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                                            {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon size={16} /></div>}
                                                        </div>
                                                        <input type="text" value={url} onChange={(e) => handleGalleryListChange(index, e.target.value)} className="flex-1 input-primary" placeholder="https://image-url.com/..." />
                                                        <button type="button" onClick={() => removeGalleryImage(index)} className="p-2 text-slate-500 hover:text-rose-400"><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                                {(!formData.media?.gallery || formData.media.gallery.length === 0) && (
                                                    <div className="text-center text-slate-500 py-4 border border-dashed border-white/10 rounded-xl">No gallery images added</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'seo' && (
                                    <div className="space-y-6">
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                                            <h3 className="text-white font-bold border-b border-white/10 pb-4 mb-4">Search Engine Optimization</h3>
                                            <div className="space-y-2">
                                                <label className="label-text">SEO Title Tag</label>
                                                <input type="text" value={formData.seo?.title || ''} onChange={(e) => handleNestedChange('seo', 'title', e.target.value)} className="input-primary" placeholder="Primary Keyword | Brand Name" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="label-text">Meta Description</label>
                                                <textarea rows={3} value={formData.seo?.description || ''} onChange={(e) => handleNestedChange('seo', 'description', e.target.value)} className="input-primary" placeholder="Click-worthy summary..." />
                                            </div>
                                            <div className="p-4 bg-black/30 rounded-xl border border-white/5 mt-4">
                                                <div className="text-xs text-slate-400 mb-2">Search Preview</div>
                                                <div className="text-indigo-400 text-lg font-medium hover:underline cursor-pointer truncate">{formData.seo?.title || formData.title || 'Page Title'}</div>
                                                <div className="text-green-500 text-xs mb-1">https://noureddine.reffaa.com/reviews/{formData.slug}</div>
                                                <div className="text-slate-400 text-sm line-clamp-2">{formData.seo?.description || formData.subtitle || 'Page description will appear here...'}</div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                                            <h3 className="text-white font-bold border-b border-white/10 pb-4 mb-4">Author Attribution</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="label-text">Author Name</label>
                                                    <input type="text" value={formData.author?.name || ''} onChange={(e) => handleNestedChange('author', 'name', e.target.value)} className="input-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="label-text">Role</label>
                                                    <input type="text" value={formData.author?.role || ''} onChange={(e) => handleNestedChange('author', 'role', e.target.value)} className="input-primary" />
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <label className="label-text">Avatar URL</label>
                                                    <input type="text" value={formData.author?.image || ''} onChange={(e) => handleNestedChange('author', 'image', e.target.value)} className="input-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'testimonials' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">Social Proof</h3>
                                                <p className="text-sm text-slate-400">Add testimonials to increase credibility.</p>
                                            </div>
                                            <button type="button" onClick={addTestimonial} className="btn-secondary">+ Add Review</button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {formData.testimonials?.map((t, index) => (
                                                <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/5 space-y-4 relative group">
                                                    <button type="button" onClick={() => removeTestimonial(index)} className="absolute top-4 right-4 text-slate-600 hover:text-rose-400"><Trash2 size={16} /></button>
                                                    <textarea rows={2} value={t.text} onChange={(e) => updateTestimonial(index, 'text', e.target.value)} className="w-full bg-transparent text-white font-medium text-lg italic focus:outline-none resize-none placeholder:text-slate-600" placeholder='"This product changed my life..."' />
                                                    <div className="flex gap-4">
                                                        <div className="flex-1 space-y-1">
                                                            <label className="text-xs text-slate-500 uppercase font-bold">Name</label>
                                                            <input type="text" value={t.author} onChange={(e) => updateTestimonial(index, 'author', e.target.value)} className="w-full bg-black/20 px-3 py-2 rounded-lg border border-white/10 text-sm text-white focus:border-indigo-500 outline-none" placeholder="John Doe" />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <label className="text-xs text-slate-500 uppercase font-bold">Role / Company</label>
                                                            <input type="text" value={t.role} onChange={(e) => updateTestimonial(index, 'role', e.target.value)} className="w-full bg-black/20 px-3 py-2 rounded-lg border border-white/10 text-sm text-white focus:border-indigo-500 outline-none" placeholder="CEO, TechCorp" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!formData.testimonials || formData.testimonials.length === 0) && (
                                                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-slate-500">
                                                    No testimonials added yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Helper Components & Styles */}
                <style>{`
                    .input-primary {
                        @apply w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:border-indigo-500 focus:bg-black/40 transition-all placeholder:text-slate-600;
                    }
                    .input-ghost {
                        @apply bg-transparent border-none focus:outline-none focus:ring-0 px-0;
                    }
                    .label-text {
                        @apply block text-sm font-bold text-slate-400 mb-1;
                    }
                    .btn-secondary {
                        @apply px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors text-sm;
                    }
                    /* Custom Scrollbar for specific containers */
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.1);
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 3px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                `}</style>
            </div>
        </AnimatePresence>
    );
};

const EditorButton = ({ onClick, icon: Icon, title }: { onClick: () => void, icon: any, title: string }) => (
    <button type="button" onClick={onClick} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title={title}>
        <Icon size={16} />
    </button>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);

const DollarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);

const GovernanceItem = ({ label, isComplete }: { label: string, isComplete: boolean }) => (
    <div className={`flex items-center gap-2 text-sm ${isComplete ? 'text-green-400' : 'text-slate-500'}`}>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${isComplete ? 'border-green-400 bg-green-400/10' : 'border-slate-600'}`}>
            <Check size={10} className={isComplete ? 'opacity-100' : 'opacity-0'} />
        </div>
        {label}
    </div>
);

export default DecisionPageForm;
