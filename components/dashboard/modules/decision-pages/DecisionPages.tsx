import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    FileText,
    ExternalLink,
    Edit,
    Trash2,
    Eye,
    BrainCircuit,
    CheckCircle2,
    Calendar,
    BarChart3
} from 'lucide-react';
import { useData } from '../../../../context/DataContext';
import { DecisionPage } from '../../../../types';
import { formatDate } from '../../../../lib/utils';
import LoadingSpinner from '../../../ui/LoadingSpinner';

import DecisionPageForm from '../../forms/DecisionPageForm';

const DecisionPages: React.FC = () => {
    const { siteData, deleteDecisionPage, addDecisionPage, updateDecisionPage } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState<DecisionPage | null>(null);

    const pages = siteData.decisionPages || [];

    const filteredPages = pages.filter(page => {
        const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            page.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || page.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this decision page?')) {
            await deleteDecisionPage(id);
        }
    };

    const handleEdit = (page: DecisionPage) => {
        setSelectedPage(page);
        setIsEditorOpen(true);
    };

    const handleCreate = () => {
        setSelectedPage(null);
        setIsEditorOpen(true);
    };

    const handleSave = async (data: Omit<DecisionPage, 'id' | 'date'>) => {
        if (selectedPage) {
            await updateDecisionPage(selectedPage.id, data);
        } else {
            await addDecisionPage(data);
        }
        setIsEditorOpen(false);
    };

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'crm': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'marketing': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'automation': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'ai': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <BrainCircuit className="text-indigo-500" />
                        Decision Pages
                    </h2>
                    <p className="text-slate-400 text-sm">Manage your professional review and comparison pages</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                >
                    <Plus size={18} />
                    <span>New Decision Page</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search pages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['all', 'crm', 'marketing', 'automation', 'ai'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${categoryFilter === cat
                                ? 'bg-white text-slate-950 shadow-lg'
                                : 'bg-slate-900/50 text-slate-400 border border-white/5 hover:bg-slate-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredPages.map((page, index) => (
                        <motion.div
                            key={page.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300"
                        >
                            {/* Image Header */}
                            <div className="h-40 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                                <img
                                    src={page.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'}
                                    alt={page.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md z-20 ${getCategoryColor(page.category)}`}>
                                    {page.category}
                                </div>
                                <div className="absolute top-3 right-3 z-20">
                                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
                                        <Eye size={12} className="text-indigo-400" />
                                        <span className="text-xs font-bold text-white">{page.views || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 relative z-20">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                        {page.title}
                                    </h3>
                                </div>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
                                    {page.subtitle}
                                </p>

                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Rating</div>
                                        <div className="text-lg font-black text-white">{page.rating}/5</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</div>
                                        <div className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${page.status === 'published' ? 'text-green-400 bg-green-500/10' : 'text-slate-400 bg-slate-500/10'
                                            }`}>
                                            {page.status}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                    <a
                                        href={`/en/reviews/${page.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                        title="View Page"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                    <div className="flex-1"></div>
                                    <button
                                        onClick={() => handleEdit(page)}
                                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(page.id)}
                                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Empty State */}
                {filteredPages.length === 0 && (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <BrainCircuit className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No decision pages found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6">
                            Create your first review or decision page to start helping your audience make better choices.
                        </p>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all"
                        >
                            Create Page
                        </button>
                    </div>
                )}
            </div>

            <DecisionPageForm
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSave={handleSave}
                initialData={selectedPage}
            />
        </div>
    );
};

export default DecisionPages;
