import React from 'react';
import { Briefcase, Clock, CheckCircle2 } from 'lucide-react';
import { useBusiness } from '../../../context/BusinessContext';

const ProjectsWidget: React.FC = () => {
    const { projects } = useBusiness();
    const activeProjects = (projects || []).filter(p => p.status === 'in-progress');

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        <Clock size={12} className="text-amber-500" /> قيد التنفيذ
                    </div>
                    <div className="text-2xl font-black text-white">{activeProjects.length}</div>
                    <span className="text-xs text-slate-500">{projects.length} Total Operating Visionary Projects</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        <CheckCircle2 size={12} className="text-emerald-500" /> مكتملة
                    </div>
                    <div className="text-2xl font-black text-white">
                        {(projects || []).filter(p => p.status === 'completed').length}
                    </div>
                </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar" dir="rtl">
                {activeProjects.slice(0, 3).map(p => (
                    <div key={p.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between group/item hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--accent-indigo)]/20 flex items-center justify-center text-[var(--accent-indigo)] font-black text-xs">
                                {p.title.charAt(0)}
                            </div>
                            <div>
                                <div className="text-xs font-black text-white group-hover/item:text-[var(--accent-indigo)] transition-colors">{p.title}</div>
                                <div className="text-[8px] text-slate-500 font-bold">{p.client}</div>
                            </div>
                        </div>
                        <div className="text-[8px] font-black text-slate-600 bg-white/5 px-2 py-1 rounded-full">
                            {p.status === 'completed' ? '100' : (p.tasks?.length ? Math.round((p.tasks.filter(t => t.status === 'done').length / p.tasks.length) * 100) : '0')}%
                        </div>
                    </div>
                ))}
                {activeProjects.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 grayscale py-8">
                        <Briefcase size={32} className="mb-2" />
                        <p className="text-xs font-bold text-slate-500">لا توجد مشاريع نشطة</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsWidget;
