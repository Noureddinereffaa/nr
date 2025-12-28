import React from 'react';
import { Project } from '../../../types';
import { MoreHorizontal, Plus, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface KanbanBoardProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onStatusChange: (id: string, newStatus: Project['status']) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projects, onEdit, onStatusChange }) => {
    const columns: { id: Project['status']; title: string; color: string }[] = [
        { id: 'planning', title: 'التخطيط', color: 'slate' },
        { id: 'in-progress', title: 'قيد التنفيذ', color: 'indigo' },
        { id: 'completed', title: 'مكتمل', color: 'green' },
        { id: 'archived', title: 'مؤرشف', color: 'slate' }
    ];

    const getColumnProjects = (status: Project['status']) =>
        projects.filter(p => p.status === status);

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high': return 'text-red-400 bg-red-400/10';
            case 'medium': return 'text-amber-400 bg-amber-400/10';
            case 'low': return 'text-emerald-400 bg-emerald-400/10';
            default: return 'text-slate-400 bg-slate-400/10';
        }
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar min-h-[600px] items-start" dir="rtl">
            {columns.map(column => (
                <div key={column.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
                    {/* Column Header */}
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full bg-${column.color}-500 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]`}></div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">{column.title}</h4>
                            <span className="bg-white/5 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                                {getColumnProjects(column.id).length}
                            </span>
                        </div>
                        <button className="text-slate-600 hover:text-white transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* Column Content */}
                    <div className="flex flex-col gap-4 p-2 rounded-3xl bg-slate-900/30 border border-white/5 min-h-[500px]">
                        {getColumnProjects(column.id).map(project => (
                            <div
                                key={project.id}
                                onClick={() => onEdit(project)}
                                className="group bg-slate-950 border border-white/5 rounded-2xl p-5 hover:border-indigo-500/50 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/10 active:scale-[0.98]"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ${getPriorityColor(project.priority)}`}>
                                        {project.priority || 'Normal'}
                                    </span>
                                    <button className="text-slate-700 group-hover:text-slate-400">
                                        <MoreHorizontal size={14} />
                                    </button>
                                </div>

                                <h5 className="text-sm font-black text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                    {project.title}
                                </h5>

                                <p className="text-[10px] text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                                    {project.fullDescription || project.category}
                                </p>

                                {/* Progress Simulation */}
                                {project.tasks && project.tasks.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-[8px] font-black text-slate-600 mb-1.5 uppercase">
                                            <span>التقدم</span>
                                            <span>
                                                {Math.round((project.tasks.filter(t => t.status === 'done').length / project.tasks.length) * 100)}%
                                            </span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500"
                                                style={{ width: `${(project.tasks.filter(t => t.status === 'done').length / project.tasks.length) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[9px] font-bold text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={12} className="text-indigo-500 opacity-50" />
                                        <span>{project.date}</span>
                                    </div>
                                    <div className="flex -space-x-2 rtl:space-x-reverse">
                                        <div className="w-5 h-5 rounded-full bg-indigo-600 border border-slate-950 flex items-center justify-center text-[8px] text-white font-black">
                                            N
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {getColumnProjects(column.id).length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-700 opacity-30 border-2 border-dashed border-white/5 rounded-2xl m-2">
                                <Clock size={24} className="mb-2" />
                                <span className="text-[10px] font-black uppercase">فارغ</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
