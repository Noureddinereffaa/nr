import React from 'react';
import { Project } from '../../../types';
import { ExternalLink, Github, Eye, Layers } from 'lucide-react';

interface StudioCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ project, onEdit, onDelete }) => {
    return (
        <div className="group relative bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
            {/* Image & Overlay */}
            <div className="aspect-video relative overflow-hidden">
                <img
                    src={project.image || 'https://via.placeholder.com/400x300/1e293b/475569?text=Project'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Top Status Badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {project.featured && (
                        <span className="px-2 py-1 bg-amber-500 text-black text-[10px] font-black uppercase rounded-lg shadow-lg shadow-amber-500/20">
                            Featured
                        </span>
                    )}
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-lg backdrop-blur-md ${project.status === 'in-progress' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                            project.status === 'planning' ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' :
                                'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                        {project.status === 'in-progress' ? 'قيد العمل' : project.status === 'planning' ? 'تخطيط' : 'مكتمل'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                        <p className="text-xs text-slate-400 font-mono">{project.category} • {project.date}</p>
                    </div>
                </div>

                {/* Tech Stack Bubbles */}
                <div className="flex flex-wrap gap-1.5 my-4">
                    {(project.tags || []).slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] text-slate-300">
                            {tag}
                        </span>
                    ))}
                    {(project.tags?.length || 0) > 4 && (
                        <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-slate-500">+{project.tags.length - 4}</span>
                    )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <div className="flex gap-3">
                        {project.links?.demo && (
                            <a href={project.links.demo} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Live Demo">
                                <ExternalLink size={16} />
                            </a>
                        )}
                        {project.links?.github && (
                            <a href={project.links.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Source Code">
                                <Github size={16} />
                            </a>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(project)}
                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
                        >
                            تعديل
                        </button>
                        <button
                            onClick={() => onDelete(project.id)}
                            className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                            حذف
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudioCard;
