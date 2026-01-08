import React, { useState } from 'react';
import { useSystem } from '../../../context/SystemContext';
import { FAQItem } from '../../../types';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const FAQManager: React.FC = () => {
    const { siteData, updateSiteData } = useSystem();
    const faqs = (siteData as any).faqs || [];

    // Edit State
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<FAQItem>({ q: '', a: '' });

    // Add State
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState<FAQItem>({ q: '', a: '' });

    const handleDelete = (index: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
            const newFaqs = faqs.filter((_, i) => i !== index);
            updateSiteData({ faqs: newFaqs } as any);
        }
    };

    const startEdit = (index: number, item: FAQItem) => {
        setEditingIndex(index);
        setEditForm(item);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditForm({ q: '', a: '' });
    };

    const saveEdit = () => {
        if (editingIndex !== null) {
            const newFaqs = [...faqs];
            newFaqs[editingIndex] = editForm;
            updateSiteData({ faqs: newFaqs } as any);
            cancelEdit();
        }
    };

    const addNew = () => {
        if (newItem.q && newItem.a) {
            updateSiteData({ faqs: [...faqs, newItem] } as any);
            setNewItem({ q: '', a: '' });
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">الأسئلة الشائعة ({faqs.length})</h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    <span>إضافة سؤال</span>
                </button>
            </div>

            {isAdding && (
                <div className="bg-slate-800/50 border border-indigo-500/30 p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                    <input
                        type="text"
                        placeholder="السؤال"
                        value={newItem.q}
                        onChange={(e) => setNewItem({ ...newItem, q: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white"
                    />
                    <textarea
                        placeholder="الإجابة"
                        value={newItem.a}
                        onChange={(e) => setNewItem({ ...newItem, a: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white h-24"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="text-slate-400 hover:text-white px-3 py-1"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={addNew}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg"
                        >
                            حفظ
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {faqs.map((item, index) => (
                    <div key={index} className="bg-slate-900 border border-white/5 p-4 rounded-xl group hover:border-white/10 transition-colors">
                        {editingIndex === index ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={editForm.q}
                                    onChange={(e) => setEditForm({ ...editForm, q: e.target.value })}
                                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg p-2 text-white font-bold"
                                />
                                <textarea
                                    value={editForm.a}
                                    onChange={(e) => setEditForm({ ...editForm, a: e.target.value })}
                                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg p-2 text-slate-300 h-24"
                                />
                                <div className="flex justify-end gap-2">
                                    <button onClick={cancelEdit} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                                        <X size={18} />
                                    </button>
                                    <button onClick={saveEdit} className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg">
                                        <Save size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h4 className="font-bold text-white mb-1">{item.q}</h4>
                                    <p className="text-sm text-slate-400">{item.a}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startEdit(index, item)}
                                        className="p-2 text-indigo-400 hover:bg-slate-800 rounded-lg"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="p-2 text-red-400 hover:bg-slate-800 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {faqs.length === 0 && !isAdding && (
                    <div className="text-center py-10 text-slate-500">
                        لا توجد أسئلة شائعة مضافة
                    </div>
                )}
            </div>
        </div>
    );
};

export default FAQManager;
