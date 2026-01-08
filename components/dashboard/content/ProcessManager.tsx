import React, { useState } from 'react';
import { useSystem } from '../../../context/SystemContext';
import { ProcessStep } from '../../../types';
import { Edit2, Save, X, Plus, Trash2, ArrowUp, ArrowDown, GitMerge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProcessManager: React.FC = () => {
    const { siteData, updateSiteData } = useSystem();
    const siteProcess = (siteData as any).process || [];

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<ProcessStep>({ step: '', title: '', desc: '' });

    const startEdit = (index: number, item: ProcessStep) => {
        setEditingIndex(index);
        setEditForm(item);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditForm({ step: '', title: '', desc: '' });
    };

    const saveEdit = () => {
        if (editingIndex !== null) {
            const newItems = [...siteProcess];
            newItems[editingIndex] = editForm;
            updateSiteData({ process: newItems } as any);
            cancelEdit();
        }
    };

    const addItem = () => {
        const nextStepNum = siteProcess.length + 1;
        const nextStep = nextStepNum.toString().padStart(2, '0');
        const newItem: ProcessStep = {
            step: nextStep,
            title: 'مرحلة جديدة',
            desc: 'صف خطوات هذه المرحلة بوضوح للعملاء...'
        };
        updateSiteData({ process: [...siteProcess, newItem] } as any);
    };

    const deleteItem = (index: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه المرحلة؟')) {
            const newItems = siteProcess.filter((_: any, i: number) => i !== index);
            updateSiteData({ process: newItems } as any);
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === siteProcess.length - 1) return;

        const newItems = [...siteProcess];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
        updateSiteData({ process: newItems } as any);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-3xl border border-white/5">
                <div className="text-right">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3 justify-end">
                        <GitMerge className="text-[var(--accent-indigo)]" />
                        منهجية مراحل العمل
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">قم بصياغة الخطوات الاستراتيجية التي تظهر لعملائك في الموقع.</p>
                </div>
                <button
                    onClick={addItem}
                    className="group relative flex items-center gap-2 bg-[var(--accent-indigo)] hover:bg-[rgba(var(--accent-indigo-rgb),0.9)] text-white px-6 py-3 rounded-2xl font-black transition-all shadow-xl shadow-[rgba(var(--accent-indigo-rgb),0.2)] active:scale-95 whitespace-nowrap"
                >
                    <Plus size={20} />
                    إضافة مرحلة استراتيجية
                    <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-2xl pointer-events-none"></div>
                </button>
            </div>

            <div className="relative space-y-6">
                {/* Visual Connector Line */}
                <div className="absolute top-0 bottom-0 left-[2.25rem] w-0.5 bg-gradient-to-b from-[var(--accent-indigo)]/50 via-[var(--accent-indigo)]/20 to-transparent -z-10 hidden md:block"></div>

                <AnimatePresence mode="popLayout">
                    {siteProcess.map((item: any, index: number) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-slate-900/40 backdrop-blur-sm border border-white/5 p-6 rounded-3xl group hover:border-[var(--accent-indigo)]/30 transition-all flex flex-col md:flex-row-reverse gap-6 shadow-2xl"
                        >
                            <div className="shrink-0 flex flex-row md:flex-col items-center justify-between md:justify-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-indigo)] to-indigo-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-[rgba(var(--accent-indigo-rgb),0.3)]">
                                    {item.step}
                                </div>
                                <div className="flex flex-row md:flex-col gap-2">
                                    <button
                                        disabled={index === 0}
                                        onClick={() => moveItem(index, 'up')}
                                        className={`p-2 transition-colors rounded-xl ${index === 0 ? 'text-slate-800' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        disabled={index === siteProcess.length - 1}
                                        onClick={() => moveItem(index, 'down')}
                                        className={`p-2 transition-colors rounded-xl ${index === siteProcess.length - 1 ? 'text-slate-800' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 text-right">
                                {editingIndex === index ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div className="md:col-span-3">
                                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">العنوان الاستراتيجي</label>
                                                <input
                                                    type="text"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                    className="w-full bg-slate-950 border border-[var(--accent-indigo)]/30 rounded-xl p-3 text-white font-bold focus:border-[var(--accent-indigo)] outline-none text-right"
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">رقم المرحلة</label>
                                                <input
                                                    type="text"
                                                    value={editForm.step}
                                                    onChange={(e) => setEditForm({ ...editForm, step: e.target.value })}
                                                    className="w-full bg-slate-950 border border-[var(--accent-indigo)]/30 rounded-xl p-3 text-white text-center font-black focus:border-[var(--accent-indigo)] outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">وصف المنهجية</label>
                                            <textarea
                                                value={editForm.desc}
                                                onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                                                className="w-full bg-slate-950 border border-[var(--accent-indigo)]/30 rounded-xl p-4 text-slate-300 h-24 focus:border-[var(--accent-indigo)] outline-none resize-none text-right"
                                            />
                                        </div>
                                        <div className="flex justify-start gap-3 pt-2">
                                            <button onClick={saveEdit} className="px-5 py-2 text-white bg-green-600 hover:bg-green-700 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 transition-all">
                                                <Save size={18} />
                                                حفظ التغييرات
                                            </button>
                                            <button onClick={cancelEdit} className="px-5 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl font-bold transition-all">
                                                إلغاء
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="relative h-full flex flex-col justify-center">
                                        <h4 className="text-xl font-black text-white mb-2 tracking-tight">{item.title}</h4>
                                        <p className="text-slate-400 leading-relaxed text-sm md:text-base">{item.desc}</p>

                                        <div className="absolute top-0 right-0 md:-top-2 md:-right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-0 translate-y-2">
                                            <button
                                                onClick={() => startEdit(index, item)}
                                                className="p-3 text-indigo-400 hover:bg-[var(--accent-indigo)]/10 bg-slate-800/50 backdrop-blur rounded-2xl shadow-xl transition-all"
                                                title="تعديل المرحلة"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteItem(index)}
                                                className="p-3 text-red-400 hover:bg-red-500/10 bg-slate-800/50 backdrop-blur rounded-2xl shadow-xl transition-all"
                                                title="حذف المرحلة"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {siteProcess.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center border-4 border-dashed border-white/5 rounded-[3rem] bg-slate-900/20"
                    >
                        <GitMerge className="mx-auto text-slate-700 mb-4" size={48} />
                        <p className="text-slate-500 font-bold">لم تضف أي مراحل عمل بعد.</p>
                        <p className="text-slate-600 text-sm mt-1 mb-6">ابدأ في بناء منهجيتك الاحترافية لتظهر للعملاء.</p>
                        <button
                            onClick={addItem}
                            className="bg-slate-800 hover:bg-slate-700 text-indigo-400 px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2 mx-auto"
                        >
                            <Plus size={20} />
                            إضافة المرحلة الأولى
                        </button>
                    </motion.div>
                )}
            </div>

            <div className="bg-gradient-to-l from-[var(--accent-indigo)]/10 to-transparent p-6 rounded-3xl border border-[var(--accent-indigo)]/10 text-right">
                <p className="text-xs text-slate-500 leading-relaxed">
                    <strong className="text-slate-400 block mb-1 uppercase tracking-widest text-[9px]">ملاحظة استراتيجية</strong>
                    تعد مراحل العمل (Methodology) هي العمود الفقري لثقة العميل. اجعل الخطوات واضحة، مرتبة، وتعكس احترافية فريقك.
                    أي تغيير تقوم به هنا سيظهر فوراً على الموقع الرسمي لجميع الزوار.
                </p>
            </div>
        </div>
    );
};

export default ProcessManager;
