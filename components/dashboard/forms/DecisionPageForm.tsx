import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Save, Plus, Trash2, Image as ImageIcon, Link as LinkIcon,
    Layout, FileText, BarChart3, Search, Settings, Video, File, User, MessageSquare,
    Bold, Italic, List, Heading2, Quote
} from 'lucide-react';
import { DecisionPage } from '../../../types';

interface DecisionPageFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<DecisionPage, 'id' | 'date'>) => Promise<void>;
    initialData?: DecisionPage | null;
}

type TabType = 'essentials' | 'content' | 'analysis' | 'media' | 'seo' | 'testimonials';

const DecisionPageForm: React.FC<DecisionPageFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [activeTab, setActiveTab] = useState<TabType>('essentials');
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
                media: { gallery: [], videoUrl: '', pdfUrl: '' }
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

    // Gallery Handler
    const handleGalleryChange = (value: string) => {
        // Simple comma-separated string to array for MVP
        const urls = value.split(',').map(s => s.trim()).filter(s => s);
        setFormData(prev => ({
            ...prev,
            media: { ...(prev.media || { gallery: [], videoUrl: '', pdfUrl: '' }), gallery: urls }
        }));
    };



    // Testimonial Handlers
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
                cursorOffset = selection ? 4 : 2; // Move inside or after
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

        // Restore focus (timeout needed for React re-render)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + (selection ? 0 : format === 'list' ? 9 : format.length + 5));
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ensure proper structure before saving
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
        { id: 'essentials', label: 'Essentials', icon: Layout },
        { id: 'analysis', label: 'Analysis', icon: BarChart3 },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'seo', label: 'SEO & Meta', icon: Search },
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
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl z-10">
                        <h2 className="text-xl font-bold text-white">
                            {initialData ? 'Edit Decision Page' : 'New Decision Page'}
                        </h2>
                        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <tab.icon size={14} /> {tab.label}
                                </button>
                            ))}
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <form id="decision-form" onSubmit={handleSubmit} className="space-y-8">

                            {activeTab === 'essentials' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Title</label>
                                            <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full input-primary" placeholder="Page Title" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Slug</label>
                                            <input type="text" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} className="w-full input-primary" placeholder="url-slug" required />
                                        </div>
                                        <div className="col-span-full space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Subtitle</label>
                                            <input type="text" value={formData.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} className="w-full input-primary" placeholder="Catchy subtitle" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Category</label>
                                            <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full input-primary appearance-none">
                                                <option value="crm">CRM & Sales</option>
                                                <option value="marketing">Marketing</option>
                                                <option value="automation">Automation</option>
                                                <option value="ai">AI Assistants</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Status</label>
                                            <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full input-primary appearance-none">
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Affiliate URL</label>
                                            <input type="text" value={formData.affiliateUrl} onChange={(e) => handleChange('affiliateUrl', e.target.value)} className="w-full input-primary" placeholder="https://..." />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Badge Label</label>
                                            <input type="text" value={formData.badge} onChange={(e) => handleChange('badge', e.target.value)} className="w-full input-primary" placeholder="e.g. Editor's Choice" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Badge Gradient</label>
                                            <input type="text" value={formData.badgeColor} onChange={(e) => handleChange('badgeColor', e.target.value)} className="w-full input-primary" placeholder="from-x to-y" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'analysis' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Rating (0-5)</label>
                                            <input type="number" step="0.1" max="5" value={formData.rating} onChange={(e) => handleChange('rating', parseFloat(e.target.value))} className="w-full input-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Pricing Label</label>
                                            <input type="text" value={formData.pricing} onChange={(e) => handleChange('pricing', e.target.value)} className="w-full input-primary" placeholder="e.g. From $97/mo" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400">Best For</label>
                                            <input type="text" value={formData.bestFor} onChange={(e) => handleChange('bestFor', e.target.value)} className="w-full input-primary" placeholder="e.g. Agencies" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400">Our Verdict</label>
                                        <textarea rows={3} value={formData.verdict} onChange={(e) => handleChange('verdict', e.target.value)} className="w-full input-primary py-3" placeholder="Summary of our opinion..." />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-green-400">Pros</label>
                                            {formData.pros?.map((item, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input type="text" value={item} onChange={(e) => handleListChange('pros', index, e.target.value)} className="flex-1 input-primary" />
                                                    <button type="button" onClick={() => removeListItem('pros', index)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addListItem('pros')} className="text-xs text-indigo-400 font-bold flex items-center gap-1"><Plus size={14} /> Add Pro</button>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-rose-400">Cons</label>
                                            {formData.cons?.map((item, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input type="text" value={item} onChange={(e) => handleListChange('cons', index, e.target.value)} className="flex-1 input-primary" />
                                                    <button type="button" onClick={() => removeListItem('cons', index)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addListItem('cons')} className="text-xs text-indigo-400 font-bold flex items-center gap-1"><Plus size={14} /> Add Con</button>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/5 pt-6">
                                        <h3 className="text-sm font-bold text-indigo-400 uppercase mb-4">Performance Metrics</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400">Time Saved</label>
                                                <input type="text" value={formData.metrics?.timeSaved || ''} onChange={(e) => handleNestedChange('metrics', 'timeSaved', e.target.value)} className="w-full input-primary" placeholder="e.g. 10hrs/week" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400">Tasks Automated</label>
                                                <input type="text" value={formData.metrics?.tasksAutomated || ''} onChange={(e) => handleNestedChange('metrics', 'tasksAutomated', e.target.value)} className="w-full input-primary" placeholder="e.g. 50+" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400">ROI Multiplier</label>
                                                <input type="text" value={formData.metrics?.roiMultiplier || ''} onChange={(e) => handleNestedChange('metrics', 'roiMultiplier', e.target.value)} className="w-full input-primary" placeholder="e.g. 5x" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'content' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                                                <button type="button" onClick={() => insertFormat('bold')} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Bold"><Bold size={16} /></button>
                                                <button type="button" onClick={() => insertFormat('italic')} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Italic"><Italic size={16} /></button>
                                                <div className="w-px h-4 bg-white/10 mx-1"></div>
                                                <button type="button" onClick={() => insertFormat('h2')} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Heading 2"><Heading2 size={16} /></button>
                                                <button type="button" onClick={() => insertFormat('quote')} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Quote"><Quote size={16} /></button>
                                                <div className="w-px h-4 bg-white/10 mx-1"></div>
                                                <button type="button" onClick={() => insertFormat('list')} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Bullet List"><List size={16} /></button>
                                            </div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Markdown Editor</label>
                                            <button type="button" onClick={insertTemplate} className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-600/30 transition-colors font-bold flex items-center gap-2">
                                                <Layout size={14} /> Insert Template
                                            </button>
                                        </div>
                                        <textarea
                                            id="description-editor"
                                            rows={15}
                                            value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                            className="w-full input-primary py-4 px-4 font-mono text-sm leading-relaxed"
                                            placeholder="# Detailed Review..."
                                        />
                                        <p className="text-xs text-slate-500">* Supports full Markdown formatting</p>
                                    </div>

                                    <div className="border-t border-white/5 pt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-bold text-indigo-400 uppercase">Frequently Asked Questions</h3>
                                            <button type="button" onClick={addFaq} className="text-xs bg-indigo-600 px-3 py-1 rounded-full text-white font-bold">Add FAQ</button>
                                        </div>
                                        <div className="space-y-4">
                                            {formData.faq?.map((item, index) => (
                                                <div key={index} className="bg-white/5 p-4 rounded-xl space-y-3 relative group">
                                                    <button type="button" onClick={() => removeFaq(index)} className="absolute top-2 right-2 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                                                    <input type="text" value={item.question} onChange={(e) => updateFaq(index, 'question', e.target.value)} className="w-full input-primary bg-black/20" placeholder="Question?" />
                                                    <textarea rows={2} value={item.answer} onChange={(e) => updateFaq(index, 'answer', e.target.value)} className="w-full input-primary bg-black/20" placeholder="Answer..." />
                                                </div>
                                            ))}
                                            {(!formData.faq || formData.faq.length === 0) && (
                                                <div className="text-center text-slate-500 py-4 italic">No FAQs added yet</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'media' && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400">Main Image URL</label>
                                        <div className="flex gap-2">
                                            <div className="bg-white/5 p-3 rounded-lg"><ImageIcon size={20} className="text-slate-400" /></div>
                                            <input type="text" value={formData.image} onChange={(e) => handleChange('image', e.target.value)} className="w-full input-primary" placeholder="https://..." />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400">Video Embed URL (YouTube/Vimeo)</label>
                                        <div className="flex gap-2">
                                            <div className="bg-white/5 p-3 rounded-lg"><Video size={20} className="text-slate-400" /></div>
                                            <input type="text" value={formData.media?.videoUrl || ''} onChange={(e) => handleNestedChange('media', 'videoUrl', e.target.value)} className="w-full input-primary" placeholder="https://www.youtube.com/embed/..." />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400">PDF Resource URL</label>
                                        <div className="flex gap-2">
                                            <div className="bg-white/5 p-3 rounded-lg"><File size={20} className="text-slate-400" /></div>
                                            <input type="text" value={formData.media?.pdfUrl || ''} onChange={(e) => handleNestedChange('media', 'pdfUrl', e.target.value)} className="w-full input-primary" placeholder="https://..." />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400">Gallery Images (Comma separated URLs)</label>
                                        <textarea rows={3} value={formData.media?.gallery?.join(', ') || ''} onChange={(e) => handleGalleryChange(e.target.value)} className="w-full input-primary py-3" placeholder="https://img1.jpg, https://img2.jpg" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'seo' && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400">SEO Title</label>
                                        <input type="text" value={formData.seo?.title || ''} onChange={(e) => handleNestedChange('seo', 'title', e.target.value)} className="w-full input-primary" placeholder="Best CRM Tool 2026 - Review" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400">SEO Description</label>
                                        <textarea rows={2} value={formData.seo?.description || ''} onChange={(e) => handleNestedChange('seo', 'description', e.target.value)} className="w-full input-primary py-3" placeholder="Meta description..." />
                                    </div>

                                    <div className="border-t border-white/5 pt-6">
                                        <h3 className="text-sm font-bold text-indigo-400 uppercase mb-4">Author info</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400">Author Name</label>
                                                <input type="text" value={formData.author?.name || ''} onChange={(e) => handleNestedChange('author', 'name', e.target.value)} className="w-full input-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400">Author Role</label>
                                                <input type="text" value={formData.author?.role || ''} onChange={(e) => handleNestedChange('author', 'role', e.target.value)} className="w-full input-primary" placeholder="e.g. Senior Editor" />
                                            </div>
                                            <div className="col-span-full space-y-2">
                                                <label className="text-xs font-bold text-slate-400">Author Avatar URL</label>
                                                <input type="text" value={formData.author?.image || ''} onChange={(e) => handleNestedChange('author', 'image', e.target.value)} className="w-full input-primary" placeholder="https://..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl flex justify-end gap-4 z-10">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl text-slate-400 font-bold hover:bg-white/5 transition-colors">Cancel</button>
                        <button type="submit" form="decision-form" className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                            <Save size={18} /> Save Page
                        </button>
                    </div>
                </motion.div>

                {/* Global Styles for Inputs */}
                <style>{`
                    .input-primary {
                        @apply px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors;
                    }
                `}</style>
            </div>
        </AnimatePresence>
    );
};

export default DecisionPageForm;
