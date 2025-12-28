import React, { useState, useEffect } from 'react';
import { Service } from '../../../types';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';
import { useData } from '../../../context/DataContext';
import { Plus, X } from 'lucide-react';

interface ServiceFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Service;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ isOpen, onClose, initialData }) => {
    const { addService, updateService } = useData();
    const [formData, setFormData] = useState<Partial<Service>>({});
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                title: '',
                description: '',
                price: 0,
                priceLabel: 'يبدأ من',
                icon: 'Box',
                features: [],
                deliverables: [],
                popular: false
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData?.id) {
            updateService(initialData.id, formData);
        } else {
            addService(formData as Service);
        }
        onClose();
    };

    const addFeature = () => {
        if (!newFeature.trim()) return;
        setFormData(prev => ({ ...prev, features: [...(prev.features || []), newFeature] }));
        setNewFeature('');
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== index)
        }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
        >
            <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="عنوان الخدمة"
                        value={formData.title || ''}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <Input
                        label="أيقونة (Lucide Name)"
                        value={formData.icon || ''}
                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="e.g. Activity, Box, Code"
                        dir="ltr"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">الوصف</label>
                    <textarea
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none h-20 text-right resize-none"
                        value={formData.description || ''}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        label="السعر (د.ج)"
                        type="number"
                        value={formData.price || 0}
                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                    <Input
                        label="تسمية السعر"
                        value={formData.priceLabel || ''}
                        onChange={e => setFormData({ ...formData, priceLabel: e.target.value })}
                        placeholder="يبدأ من"
                    />
                    <Input
                        label="المدة المتوقعة"
                        value={formData.duration || ''}
                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="3 أسابيع"
                    />
                </div>

                {/* Feature Builder */}
                <div className="bg-slate-900 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">المميزات (Included)</label>
                        <span className="text-[10px] text-slate-500">{formData.features?.length || 0} Items</span>
                    </div>

                    <div className="flex gap-2">
                        <input
                            value={newFeature}
                            onChange={e => setNewFeature(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            placeholder="أضف ميزة جديدة..."
                            className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
                        />
                        <button
                            type="button"
                            onClick={addFeature}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {(formData.features || []).map((feat, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-950/50 p-2 rounded-md border border-white/5">
                                <span className="text-sm text-slate-300">{feat}</span>
                                <button type="button" onClick={() => removeFeature(idx)} className="text-slate-500 hover:text-red-400">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
                    <input
                        type="checkbox"
                        checked={formData.popular || false}
                        onChange={e => setFormData({ ...formData, popular: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                    />
                    <label className="text-sm font-bold text-white">تمييز هذه الخدمة (الأكثر طلباً)</label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all mt-2"
                >
                    {initialData ? 'حفظ التغييرات' : 'إضافة الخدمة'}
                </button>
            </form>
        </Modal>
    );
};

export default ServiceForm;
