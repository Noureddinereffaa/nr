import React, { useState } from 'react';
import { useBusiness } from '../../../../context/BusinessContext';
import { Plus, Filter, Grid, LayoutList, Clock, Activity } from 'lucide-react';
import ProjectForm from '../../forms/ProjectForm';
import StudioCard from '../../studio/StudioCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../../../types';

const Projects: React.FC = () => {
    const { projects: businessProjects, deleteProject, updateProject } = useBusiness();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const projects = (businessProjects || []).map(p => ({
        ...p,
        status: p.status || 'completed',
        featured: p.featured || false,
    }));

    const filteredProjects = projects.filter(p => {
        if (filter === 'all') return true;
        return p.status === filter;
    });

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setEditingProject(undefined);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" dir="rtl">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-widest uppercase italic">Project Studio</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">معمل الابتكار وإدارة المشاريع الرقمية</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/5 rounded-2xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <LayoutList size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl shadow-white/5 active:scale-95"
                    >
                        <Plus size={18} />
                        مشروع جديد
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
                {[
                    { label: 'نشط', val: projects.filter(p => p.status === 'in-progress').length, icon: Activity, color: 'text-emerald-400' },
                    { label: 'مكتمل', val: projects.filter(p => p.status === 'completed').length, icon: Clock, color: 'text-indigo-400' },
                    { label: 'إجمالي القيمة', val: `$${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}`, icon: Grid, color: 'text-white' },
                    { label: 'قيد المراجعة', val: '2', icon: Filter, color: 'text-amber-400' }
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-slate-900/50 border border-white/5 rounded-[2rem] flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[8px] text-slate-500 font-black uppercase tracking-widest">
                            <stat.icon size={10} className={stat.color} />
                            {stat.label}
                        </div>
                        <div className="text-xl font-black text-white">{stat.val}</div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-6 border-b border-white/5 pb-2 overflow-x-auto scrollbar-hide" dir="rtl">
                {['all', 'active', 'completed', 'on-hold'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] pb-4 px-2 transition-all relative ${filter === cat ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        {cat === 'all' ? 'الكل' : cat === 'active' ? 'نشط' : cat === 'completed' ? 'مكتمل' : 'معلق'}
                        {filter === cat && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Projects Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewMode + filter}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}
                    dir="rtl"
                >
                    {filteredProjects.map((project, idx) => (
                        <StudioCard
                            key={project.id || idx}
                            project={project}
                            onEdit={() => handleEdit(project)}
                            onDelete={() => deleteProject(project.id)}
                        // Removed viewMode and onToggleFeatured as they are not in StudioCardProps
                        />
                    ))}
                </motion.div>
            </AnimatePresence>

            <ProjectForm
                isOpen={isFormOpen}
                onClose={handleClose}
                initialData={editingProject}
            />
        </div>
    );
};

export default Projects;
