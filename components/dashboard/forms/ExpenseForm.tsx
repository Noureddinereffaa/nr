import React, { useState } from 'react';
import { Expense } from '../../../types';
import Modal from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { useBusiness } from '../../../context/BusinessContext';

interface ExpenseFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ isOpen, onClose }) => {
    const { addExpense, updateExpense } = useBusiness();
    const [formData, setFormData] = useState<Partial<Expense>>({
        category: 'tools',
        currency: 'DZD',
        amount: 0,
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addExpense(formData as Omit<Expense, 'id'>);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="تسجيل مصروفات استراتيجية"
        >
            <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                <Input
                    label="وصف المصروف"
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: اشتراك ChatGPT Plus, سيرفرات Cloud..."
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">التصنيف</label>
                        <select
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-right"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                        >
                            <option value="api">API & AI Costs</option>
                            <option value="hosting">استضافة (Hosting)</option>
                            <option value="ads">إعلانات (Ads)</option>
                            <option value="contractor">مقاولين (Contractors)</option>
                            <option value="tools">أدوات وبرامج (Tools)</option>
                            <option value="other">أخرى</option>
                        </select>
                    </div>
                    <Input
                        label="التاريخ"
                        type="date"
                        value={formData.date || ''}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="المبلغ"
                        type="number"
                        value={formData.amount || ''}
                        onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                        required
                    />
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">العملة</label>
                        <select
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-right"
                            value={formData.currency}
                            onChange={e => setFormData({ ...formData, currency: e.target.value as any })}
                        >
                            <option value="DZD">DZD</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-[2rem] transition-all mt-4 shadow-2xl shadow-red-600/20 transform active:scale-95"
                >
                    اعتماد المصروف
                </button>
            </form>
        </Modal>
    );
};

export default ExpenseForm;
