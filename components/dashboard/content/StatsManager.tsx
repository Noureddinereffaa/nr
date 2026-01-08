import React, { useState } from 'react';
import { useSystem } from '../../../context/SystemContext';
import { Stat } from '../../../types';
import { Edit2, Save, X, ShieldCheck, Users, Briefcase, Zap, Activity } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const StatsManager: React.FC = () => {
    const { siteData, updateSiteData } = useSystem();
    const stats = (siteData as any).stats || [];

    // Edit State
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Stat>({ icon: 'Activity', label: '', val: '' });

    const startEdit = (index: number, item: Stat) => {
        setEditingIndex(index);
        setEditForm(item);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditForm({ icon: 'Activity', label: '', val: '' });
    };

    const saveEdit = () => {
        if (editingIndex !== null) {
            const newItems = [...stats];
            newItems[editingIndex] = editForm;
            updateSiteData({ stats: newItems } as any);
            cancelEdit();
        }
    };

    // Helper to render dynamic icon
    const renderIcon = (iconName: string) => {
        const Icon = (LucideIcons as any)[iconName] || Activity;
        return <Icon size={24} className="text-indigo-400" />;
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">إحصائيات الموقع (4 عناصر)</h3>
            <p className="text-sm text-slate-400">هذه الإحصائيات تظهر في الواجهة الرئيسية. يمكنك تعديل القيم والعناوين.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((item, index) => (
                    <div key={index} className="bg-slate-900 border border-white/5 p-4 rounded-xl group hover:border-white/10 transition-colors relative">
                        {editingIndex === index ? (
                            <div className="space-y-3">
                                <div className="text-xs text-slate-500 mb-1">رمز الأيقونة (Lucide Icon Name)</div>
                                <input
                                    type="text"
                                    value={editForm.icon}
                                    onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg p-2 text-white font-mono text-sm"
                                    dir="ltr"
                                />
                                <input
                                    type="text"
                                    value={editForm.val}
                                    onChange={(e) => setEditForm({ ...editForm, val: e.target.value })}
                                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg p-2 text-white font-black text-lg text-center"
                                    placeholder="القيمة (مثال: +100)"
                                    dir="ltr"
                                />
                                <input
                                    type="text"
                                    value={editForm.label}
                                    onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg p-2 text-slate-300 text-center"
                                    placeholder="العنوان"
                                />
                                <div className="flex justify-center gap-2 pt-2">
                                    <button onClick={cancelEdit} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                                        <X size={18} />
                                    </button>
                                    <button onClick={saveEdit} className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg">
                                        <Save size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-12 h-12 mx-auto bg-slate-800 rounded-xl flex items-center justify-center mb-3 border border-white/5">
                                    {renderIcon(item.icon)}
                                </div>
                                <div className="text-2xl font-black text-white mb-1" dir="ltr">{item.val}</div>
                                <div className="text-sm text-slate-400 font-bold">{item.label}</div>

                                <button
                                    onClick={() => startEdit(index, item)}
                                    className="absolute top-2 left-2 p-1.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-800 rounded-lg"
                                >
                                    <Edit2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsManager;
