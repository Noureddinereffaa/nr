import React, { useState, useEffect } from 'react';
import { Invoice, Client, InvoiceItem } from '../../../types';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';
import { useBusiness } from '../../../context/BusinessContext';
import { useSystem } from '../../../context/SystemContext';
import { Plus, Trash2, Calculator } from 'lucide-react';

interface InvoiceFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Invoice;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ isOpen, onClose, initialData }) => {
    const { addInvoice, updateInvoice, clients } = useBusiness();
    const { siteData } = useSystem();
    const [formData, setFormData] = useState<Partial<Invoice>>({
        invoiceNumber: '',
        clientId: '',
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        status: 'draft',
        payments: []
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
                    clientId: '',
                    date: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    items: [],
                    subtotal: 0,
                    discount: 0,
                    total: 0,
                    status: 'draft',
                    payments: []
                });
            }
        }
    }, [initialData, isOpen]);

    // Recalculate totals whenever items or discount change
    useEffect(() => {
        const sub = (formData.items || []).reduce((acc, item) => acc + item.total, 0);
        const tot = Math.max(0, sub - (formData.discount || 0));
        setFormData(prev => ({ ...prev, subtotal: sub, total: tot }));
    }, [formData.items, formData.discount]);

    const handleAddItem = () => {
        const newItem: InvoiceItem = {
            id: 'item-' + Date.now(),
            description: '',
            quantity: 1,
            unitPrice: 0,
            total: 0
        };
        setFormData(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items?.map(item => {
                if (item.id === id) {
                    const updated = { ...item, [field]: value };
                    if (field === 'quantity' || field === 'unitPrice') {
                        updated.total = Number(updated.quantity) * Number(updated.unitPrice);
                    }
                    return updated;
                }
                return item;
            })
        }));
    };

    const removeItem = (id: string) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items?.filter(item => item.id !== id)
        }));
    };

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            // Find client name if needed for snapshot
            const client = clients.find(c => (c as any).id === formData.clientId);
            const finalData = {
                ...formData,
                clientName: client ? client.name : (formData.clientName || 'Unknown'),
                clientAddress: client ? (client as any).address : (formData.clientAddress || ''),
                currency: formData.currency || 'DZD'
            };

            if (initialData?.id) {
                await updateInvoice(initialData.id, finalData as any);
            } else {
                await addInvoice(finalData as any);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء حفظ الفاتورة');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'تعديل الفاتورة' : 'إنشاء فاتورة جديدة'}
        >
            <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="رقم الفاتورة"
                        value={formData.invoiceNumber}
                        onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                        required
                    />
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">الحالة الأولية</label>
                        <select
                            className={`w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 outline-none text-right font-black transition-all ${formData.status === 'paid' ? 'text-green-400 border-green-500/30' : 'text-amber-400 border-amber-500/30'}`}
                            value={formData.status || 'pending'}
                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                        >
                            <option value="pending">قيد الانتظار (Pending)</option>
                            <option value="paid">مدفوعة (Paid)</option>
                            <option value="draft">مسودة (Draft)</option>
                            <option value="cancelled">ملغاة (Cancelled)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="تاريخ الفاتورة"
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">العملة</label>
                        <select
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-right font-black"
                            value={formData.currency || 'DZD'}
                            onChange={e => setFormData({ ...formData, currency: e.target.value as any })}
                        >
                            <option value="DZD">DZD - دينار</option>
                            <option value="EUR">EUR - يورو</option>
                            <option value="USD">USD - دولار</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">العميل</label>
                    <select
                        value={formData.clientId}
                        onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-right"
                        required
                    >
                        <option value="">اختر عميل...</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="تاريخ الفاتورة"
                        type="date"
                        value={formData.date || ''}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                    <Input
                        label="تاريخ الاستحقاق"
                        type="date"
                        value={formData.dueDate || ''}
                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                </div>

                {/* Line Items Builder */}
                <div className="space-y-3 border-t border-b border-white/5 py-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-white text-sm">الخدمات / المنتجات</h4>
                        <button type="button" onClick={handleAddItem} className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded hover:bg-indigo-500/20">
                            + إضافة بند
                        </button>
                    </div>

                    {(formData.items || []).map((item, idx) => (
                        <div key={item.id} className="flex gap-2 items-start bg-slate-800/50 p-2 rounded-lg">
                            <div className="flex-1">
                                <input
                                    className="w-full bg-transparent border-b border-white/10 p-1 text-sm text-white placeholder:text-slate-600 outline-none"
                                    placeholder="وصف الخدمة"
                                    value={item.description}
                                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                                />
                            </div>
                            <div className="w-16">
                                <input
                                    type="number"
                                    className="w-full bg-transparent border-b border-white/10 p-1 text-sm text-center text-white outline-none"
                                    placeholder="الكمية"
                                    value={item.quantity}
                                    onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                                />
                            </div>
                            <div className="w-24">
                                <input
                                    type="number"
                                    className="w-full bg-transparent border-b border-white/10 p-1 text-sm text-center text-white outline-none"
                                    placeholder="السعر"
                                    value={item.unitPrice}
                                    onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                                />
                            </div>
                            <div className="w-24 pt-1 text-center font-mono text-sm text-indigo-300">
                                {item.total.toLocaleString()}
                            </div>
                            <button type="button" onClick={() => removeItem(item.id)} className="text-red-400 p-1 hover:bg-red-500/10 rounded">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}

                    {(formData.items || []).length === 0 && (
                        <div className="text-center text-slate-600 text-xs py-2">أضف خدمات لهذه الفاتورة</div>
                    )}
                </div>

                {/* Totals */}
                <div className="bg-slate-900 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                        <span>المجموع الفرعي</span>
                        <span>{formData.subtotal?.toLocaleString()} {formData.currency || 'د.ج'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">تخفيض</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="bg-slate-950 border border-white/10 rounded px-2 py-1 text-right w-24 text-sm text-white"
                                value={formData.discount}
                                onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })}
                            />
                            <span className="text-[10px] text-slate-500">{formData.currency}</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-white/5">
                        <span>الإجمالي النهائي</span>
                        <span>{formData.total?.toLocaleString()} {formData.currency || 'د.ج'}</span>
                    </div>
                </div>

                {/* Recurring Options */}
                <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-white">فوترة متكررة (Recurring)</label>
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-indigo-500"
                            checked={!!formData.recurring}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setFormData({ ...formData, recurring: { interval: 'monthly', nextDate: '' } });
                                } else {
                                    const { recurring, ...rest } = formData;
                                    setFormData(rest);
                                }
                            }}
                        />
                    </div>
                    {formData.recurring && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                            <select
                                className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                                value={formData.recurring.interval}
                                onChange={e => setFormData({
                                    ...formData,
                                    recurring: { ...formData.recurring!, interval: e.target.value as any }
                                })}
                            >
                                <option value="monthly">شهرياً</option>
                                <option value="quarterly">ربع سنوي</option>
                                <option value="yearly">سنوياً</option>
                            </select>
                            <input
                                type="date"
                                className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                                value={formData.recurring.nextDate}
                                onChange={e => setFormData({
                                    ...formData,
                                    recurring: { ...formData.recurring!, nextDate: e.target.value }
                                })}
                            />
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    {error && (
                        <p className="text-red-400 text-xs mb-3 text-right">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {isSaving ? 'جاري الحفظ...' : (initialData ? 'حفظ التغييرات' : 'إصدار الفاتورة')}
                    </button>
                </div>
            </form>
        </Modal >
    );
};

export default InvoiceForm;
