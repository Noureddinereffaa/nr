import React, { useState } from 'react';
import { useData } from '../../../../context/DataContext';
import { Plus, Filter, Grid, LayoutList, Clock, Activity } from 'lucide-react';
import ProjectForm from '../../forms/ProjectForm';
import StudioCard from '../../studio/StudioCard';
import KanbanBoard from '../../projects/KanbanBoard';
import { Project } from '../../../../types';

const Projects: React.FC = () => {
    const { siteData, deleteProject, updateProject } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'kanban' | 'timeline'>('kanban');

    const projects = (siteData?.projects || []).map(p => ({
        ...p,
        status: p.status || 'completed',
        featured: p.featured || false,
        tags: p.tags || p.technologies || []
    })) as Project[];

    const categories = ['all', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.category === filter);

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
            deleteProject(id);
        }
    };

    const handleAddNew = () => {
        setEditingProject(undefined);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div dir="rtl">
                    <h3 className="text-2xl font-black text-white tracking-tighter">استوديو المشاريع العملاق</h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60">Project Studio & Operations Hub</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-950 p-1 rounded-[var(--border-radius-elite)] border border-white/5 overflow-x-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat
                                    ? 'bg-[var(--accent-indigo)] text-white shadow-lg'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cat === 'all' ? 'الكل' : cat}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 bg-white text-slate-950 px-6 py-2.5 rounded-[var(--border-radius-elite)] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-95 shadow-xl shrink-0"
                    >
                        <Plus size={16} />
                        إضافة مشروع
                    </button>

                    <div className="flex bg-slate-950 p-1 rounded-[var(--border-radius-elite)] border border-white/5 mx-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-[var(--border-radius-elite)] transition-all ${viewMode === 'grid' ? 'bg-[var(--accent-indigo)] text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`p-2 rounded-[var(--border-radius-elite)] transition-all ${viewMode === 'kanban' ? 'bg-[var(--accent-indigo)] text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
                        >
                            <LayoutList size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`p-2 rounded-[var(--border-radius-elite)] transition-all ${viewMode === 'timeline' ? 'bg-[var(--accent-indigo)] text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Clock size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* View Mapping */}
            {viewMode === 'kanban' ? (
                <KanbanBoard
                    projects={filteredProjects}
                    onEdit={handleEdit}
                    onStatusChange={(id, status) => updateProject(id, { status })}
                />
            ) : viewMode === 'timeline' ? (
                <div className="space-y-4" dir="rtl">
                    {filteredProjects.map(p => (
                        <div key={p.id} className="p-6 bg-slate-900/40 border border-white/5 rounded-[var(--border-radius-elite)] flex items-center gap-6 group hover:border-[rgba(var(--accent-indigo-rgb),0.3)] transition-all">
                            <div className="w-12 h-12 rounded-[var(--border-radius-elite)] bg-slate-950 flex items-center justify-center text-[var(--accent-indigo)] font-black border border-white/5">
                                {p.title.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-black text-white">{p.title}</h4>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.category}</span>
                                </div>
                                <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: p.status === 'completed' ? '100%' : p.status === 'in-progress' ? '65%' : '20%' }}
                                        className={`h-full transition-all duration-1000 ${p.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-[var(--accent-indigo)] shadow-[0_0_10px_rgba(var(--accent-indigo-rgb),0.5)]'}`}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-3">
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Activity size={10} className="text-[var(--accent-indigo)]" />
                                            <span className="text-[10px] text-slate-400 font-bold">Progress: {p.status === 'completed' ? '100%' : p.status === 'in-progress' ? '65%' : '20%'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold">
                                        <Clock size={10} />
                                        <span>Deadline: {p.date || 'TBD'}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleEdit(p)}
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-[var(--border-radius-elite)] text-[10px] font-black text-white uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100"
                            >
                                تعديل المخطط
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((p) => (
                        <StudioCard
                            key={p.id}
                            project={p}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {filteredProjects.length === 0 && (
                <div className="text-slate-500 text-center py-24 border-2 border-dashed border-white/5 rounded-[var(--border-radius-elite)] bg-slate-950/20">
                    <div className="flex justify-center mb-6">
                        <Grid size={64} className="opacity-10" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest">لا توجد مشاريع مسجلة حالياً</p>
                </div>
            )}

            <ProjectForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editingProject}
            />
        </div>
    );
};

export default Projects;
