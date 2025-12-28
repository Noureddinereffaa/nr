import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Testimonial } from '../../../types';
import { Plus, Trash2, Edit2, Save, X, User } from 'lucide-react';

const TestimonialManager: React.FC = () => {
    const { siteData, updateSiteData } = useData();
    const testimonials = siteData.testimonials || [];
    
    // Edit State
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Testimonial>({ name: '', role: '', text: '', avatar: '' });

    // Add State
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState<Testimonial>({ name: '', role: '', text: '', avatar: '' });

    const handleDelete = (index: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
            const newItems = testimonials.filter((_, i) => i !== index);
            updateSiteData({ testimonials: newItems });
        }
    };

    const startEdit = (index: number, item: Testimonial) => {
        setEditingIndex(index);
        setEditForm(item);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditForm({ name: '', role: '', text: '', avatar: '' });
    };

    const saveEdit = () => {
        if (editingIndex !== null) {
            const newItems = [...testimonials];
            newItems[editingIndex] = editForm;
            updateSiteData({ testimonials: newItems });
            cancelEdit();
        }
    };

    const addNew = () => {
        if (newItem.name && newItem.text) {
            updateSiteData({ testimonials: [...testimonials, newItem] });
            setNewItem({ name: '', role: '', text: '', avatar: '' });
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">آراء العملاء ({testimonials.length})</h3>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    <span>إضافة تقييم</span>
                </button>
            </div>

            {isAdding && (
                <div className="bg-slate-800/50 border border-indigo-500/30 p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="اسم العميل"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white"
                        />
                         <input
                            type="text"
                            placeholder="الصفة / المنصب"
                            value={newItem.role}
                            onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white"
                        />
                    </div>
                    <textarea
                        placeholder="نص التقييم"
                        value={newItem.text}
                        onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white h-20"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((item, index) => (
                    <div key={index} className="bg-slate-900 border border-white/5 p-4 rounded-xl group hover:border-white/10 transition-colors">
                        {editingIndex === index ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg p-2 text-white font-bold"
                                    placeholder="الاسم"
                                />
                                <input
                                    type="text"
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg p-2 text-slate-300 text-sm"
                                    placeholder="المنصب"
                                />
                                <textarea
                                    value={editForm.text}
                                    onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
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
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                                        <User size={20} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                                        <p className="text-xs text-indigo-400">{item.role}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed mb-4">"{item.text}"</p>
                                
                                <div className="absolute top-0 left-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 p-1 rounded-bl-lg">
                                    <button 
                                        onClick={() => startEdit(index, item)}
                                        className="p-1.5 text-indigo-400 hover:bg-slate-800 rounded-lg"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(index)}
                                        className="p-1.5 text-red-400 hover:bg-slate-800 rounded-lg"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

             {testimonials.length === 0 && !isAdding && (
                <div className="text-center py-10 text-slate-500">
                    لا توجد تقييمات مضافة
                </div>
            )}
        </div>
    );
};

export default TestimonialManager;
