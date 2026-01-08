import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { Client } from '../../../types';
import { useUI } from '../../../context/UIContext'; // Import useUI

interface ClientFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Client;
    onSave: (data: Client) => Promise<void> | void;
}

const ClientForm: React.FC<ClientFormProps> = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState<Partial<Client>>({});
    const { addToast } = useUI(); // Destructure addToast

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                status: 'lead',
                value: 0,
                tags: [],
                lastContact: new Date().toISOString(),
                notes: ''
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSave(formData as Client);
            addToast(initialData ? 'تم تحديث البيانات بنجاح' : 'تم إضافة العميل بنجاح', 'success');
            onClose();
        } catch (error) {
            console.error("Failed to save client", error);
            addToast('حدث خطأ أثناء حفظ البيانات', 'error');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'تعديل عميل' : 'إضافة عميل جديد'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="اسم العميل"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="الشركة"
                        value={formData.company || ''}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="البريد الإلكتروني"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                        label="رقم الهاتف"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">الحالة</label>
                        <select
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-right"
                            value={formData.status || 'lead'}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        >
                            <option value="lead">فرصة جديدة (Lead)</option>
                            <option value="negotiation">مفاوضات</option>
                            <option value="active">مشروع نشط</option>
                            <option value="completed">مكتمل</option>
                            <option value="lost">خسارة</option>
                        </select>
                    </div>
                    <Input
                        label="القيمة المتوقعة (د.ج)"
                        type="number"
                        value={formData.value || 0}
                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    />
                </div>

                <Input
                    label="العنوان"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">ملاحظات / وصف</label>
                    <textarea
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none h-24 text-right resize-none"
                        value={formData.notes || ''}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        حفظ العميل
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        إلغاء
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ClientForm;
