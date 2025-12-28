import React, { useState, useEffect } from 'react';
import { Project } from '../../../types';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';
import { useData } from '../../../context/DataContext';

interface ProjectFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Project;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ isOpen, onClose, initialData }) => {
    const { addProject, updateProject } = useData();
    const [activeTab, setActiveTab] = useState<'info' | 'study' | 'media' | 'operations'>('info');
    const [formData, setFormData] = useState<Partial<Project>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                title: '',
                category: '',
                status: 'completed',
                tags: [],
                date: new Date().getFullYear().toString(),
                caseStudy: { problem: '', solution: '', result: '' },
                links: { demo: '', github: '' }
            });
            setActiveTab('info');
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData?.id) {
            updateProject(initialData.id, formData);
        } else {
            addProject(formData as Project);
        }
        onClose();
    };

    const handleTagsChange = (val: string) => {
        setFormData({ ...formData, tags: val.split(',').map(t => t.trim()).filter(Boolean) });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        >
            <div className="flex border-b border-white/10 mb-6">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    البيانات الأساسية
                </button>
                <button
                    onClick={() => setActiveTab('study')}
                    className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'study' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    دراسة الحالة
                </button>
                <button
                    onClick={() => setActiveTab('media')}
                    className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'media' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    ميديا وروابط
                </button>
                <button
                    onClick={() => setActiveTab('operations')}
                    className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'operations' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    العمليات والمهام
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                {activeTab === 'info' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <Input
                            label="عنوان المشروع"
                            value={formData.title || ''}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="التصنيف"
                                value={formData.category || ''}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                placeholder="UI/UX, Web App..."
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">الحالة</label>
                                <select
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-right"
                                    value={formData.status || 'completed'}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="planning">تخطيط (Planning)</option>
                                    <option value="in-progress">قيد العمل (In Progress)</option>
                                    <option value="completed">مكتمل (Completed)</option>
                                    <option value="archived">مؤرشف (Archived)</option>
                                </select>
                            </div>
                        </div>
                        <Input
                            label="التقنيات (افصل بفاصلة)"
                            value={formData.tags?.join(', ') || ''}
                            onChange={e => handleTagsChange(e.target.value)}
                            placeholder="React, Tailwind, Node.js..."
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="الميزانية (DZD)"
                                type="number"
                                value={formData.budget || ''}
                                onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">الأولوية</label>
                                <select
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-right"
                                    value={formData.priority || 'medium'}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                                >
                                    <option value="low">منخفضة (Low)</option>
                                    <option value="medium">متوسطة (Medium)</option>
                                    <option value="high">عالية (High)</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">وصف مختصر</label>
                            <textarea
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none h-24 text-right resize-none"
                                value={formData.fullDescription || ''}
                                onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'study' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">المشكلة (The Problem)</label>
                            <textarea
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none h-20 text-right resize-none"
                                value={formData.caseStudy?.problem || ''}
                                onChange={e => setFormData({ ...formData, caseStudy: { ...formData.caseStudy!, problem: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">الحل (The Solution)</label>
                            <textarea
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none h-20 text-right resize-none"
                                value={formData.caseStudy?.solution || ''}
                                onChange={e => setFormData({ ...formData, caseStudy: { ...formData.caseStudy!, solution: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">النتيجة (The Result)</label>
                            <textarea
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none h-20 text-right resize-none"
                                value={formData.caseStudy?.result || ''}
                                onChange={e => setFormData({ ...formData, caseStudy: { ...formData.caseStudy!, result: e.target.value } })}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <Input
                            label="رابط الصورة الرئيسية (URL)"
                            value={formData.image || ''}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                            dir="ltr"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="رابط المعاينة (Demo URL)"
                                value={formData.links?.demo || ''}
                                onChange={e => setFormData({ ...formData, links: { ...formData.links, demo: e.target.value } })}
                                dir="ltr"
                            />
                            <Input
                                label="رابط الكود (Github URL)"
                                value={formData.links?.github || ''}
                                onChange={e => setFormData({ ...formData, links: { ...formData.links, github: e.target.value } })}
                                dir="ltr"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'operations' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <h4 className="text-sm font-black text-indigo-400">قائمة المهام</h4>
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        tasks: [...(formData.tasks || []), { id: Date.now().toString(), title: '', status: 'todo' }]
                                    })}
                                    className="text-[10px] font-black bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-md hover:bg-indigo-600 hover:text-white transition-all outline-none"
                                >
                                    + إضافة مهمة
                                </button>
                            </div>
                            <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar p-1">
                                {(formData.tasks || []).map((task, idx) => (
                                    <div key={task.id} className="flex gap-2">
                                        <select
                                            className="bg-slate-950 border border-white/10 rounded-lg px-2 text-[10px] text-white outline-none"
                                            value={task.status}
                                            onChange={(e) => {
                                                const newTasks = [...formData.tasks!];
                                                newTasks[idx].status = e.target.value as any;
                                                setFormData({ ...formData, tasks: newTasks });
                                            }}
                                        >
                                            <option value="todo">Pending</option>
                                            <option value="doing">Doing</option>
                                            <option value="done">Done</option>
                                        </select>
                                        <input
                                            className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                                            value={task.title}
                                            placeholder="اسم المهمة..."
                                            onChange={(e) => {
                                                const newTasks = [...formData.tasks!];
                                                newTasks[idx].title = e.target.value;
                                                setFormData({ ...formData, tasks: newTasks });
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newTasks = formData.tasks!.filter((_, i) => i !== idx);
                                                setFormData({ ...formData, tasks: newTasks });
                                            }}
                                            className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {(formData.tasks || []).length === 0 && (
                                    <p className="text-[10px] text-slate-600 italic text-center py-4">لا توجد مهام محددة لهذا المشروع.</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <h4 className="text-sm font-black text-emerald-400">المحطات الرئيسية (Milestones)</h4>
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        milestones: [...(formData.milestones || []), { id: Date.now().toString(), title: '', dueDate: '', completed: false }]
                                    })}
                                    className="text-[10px] font-black bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-md hover:bg-emerald-600 hover:text-white transition-all outline-none"
                                >
                                    + إضافة محطة
                                </button>
                            </div>
                            <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar p-1">
                                {(formData.milestones || []).map((m, idx) => (
                                    <div key={m.id} className="flex gap-2">
                                        <input
                                            type="checkbox"
                                            checked={m.completed}
                                            className="accent-emerald-500 w-5 h-5 mt-2 cursor-pointer"
                                            onChange={() => {
                                                const curr = [...formData.milestones!];
                                                curr[idx].completed = !curr[idx].completed;
                                                setFormData({ ...formData, milestones: curr });
                                            }}
                                        />
                                        <input
                                            className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                                            value={m.title}
                                            placeholder="المحطة الرئيسية..."
                                            onChange={(e) => {
                                                const curr = [...formData.milestones!];
                                                curr[idx].title = e.target.value;
                                                setFormData({ ...formData, milestones: curr });
                                            }}
                                        />
                                        <input
                                            type="date"
                                            className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none"
                                            value={m.dueDate}
                                            onChange={(e) => {
                                                const curr = [...formData.milestones!];
                                                curr[idx].dueDate = e.target.value;
                                                setFormData({ ...formData, milestones: curr });
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const curr = formData.milestones!.filter((_, i) => i !== idx);
                                                setFormData({ ...formData, milestones: curr });
                                            }}
                                            className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {(formData.milestones || []).length === 0 && (
                                    <p className="text-[10px] text-slate-600 italic text-center py-4">لا توجد محطات رئيسية محددة.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}


                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-[2rem] transition-all mt-8 shadow-2xl shadow-indigo-600/40 transform active:scale-95"
                >
                    {initialData ? 'حفظ التغييرات السيادية' : 'اعتماد المشروع الجديد'}
                </button>
            </form>
        </Modal>
    );
};

export default ProjectForm;
