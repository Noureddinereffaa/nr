import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../../context/BusinessContext';
import { Client } from '../../../types';
import { X, Save, Trash2, Phone, Mail, Globe, MapPin, Tag, Calendar, User, DollarSign, FileText } from 'lucide-react';

interface ClientDetailProps {
    client: Client;
    onClose: () => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ client, onClose }) => {
    const { updateClient, deleteClient, invoices } = useBusiness();
    const clientInvoices = invoices.filter(i => i.clientId === client.id);
    const [formData, setFormData] = useState<Client>(client);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        setFormData(client);
    }, [client]);

    const handleChange = (field: keyof Client, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        updateClient(client.id, formData);
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
            deleteClient(client.id);
            onClose();
        }
    };

    const addTag = () => {
        if (tagInput.trim()) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">تفاصيل العميل</h2>
                        <div className="text-sm text-slate-400 font-mono">{client.id}</div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 block">اسم العميل</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-3">
                                <User size={18} className="text-slate-500" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="bg-transparent border-none outline-none text-white w-full"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 block">الشركة</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-3">
                                <Globe size={18} className="text-slate-500" />
                                <input
                                    type="text"
                                    value={formData.company || ''}
                                    onChange={(e) => handleChange('company', e.target.value)}
                                    className="bg-transparent border-none outline-none text-white w-full"
                                    placeholder="اختياري"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 block">رقم الهاتف</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-3">
                                <Phone size={18} className="text-slate-500" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="bg-transparent border-none outline-none text-white w-full font-mono"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 block">البريد الإلكتروني</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-3">
                                <Mail size={18} className="text-slate-500" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="bg-transparent border-none outline-none text-white w-full font-mono"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status & Value */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 block">حالة العميل</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white outline-none"
                            >
                                <option value="lead">عميل محتمل (Lead)</option>
                                <option value="negotiation">مفاوضات (Negotiation)</option>
                                <option value="active">جاري العمل (Active)</option>
                                <option value="completed">مكتمل (Completed)</option>
                                <option value="lost">ملغى/خاسر (Lost)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 block">قيمة المشروع المتوقعة (DZD)</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-3">
                                <DollarSign size={18} className="text-emerald-500" />
                                <input
                                    type="number"
                                    value={formData.value}
                                    onChange={(e) => handleChange('value', Number(e.target.value))}
                                    className="bg-transparent border-none outline-none text-white w-full font-mono font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">الوسوم (Tags)</label>
                        <div className="bg-slate-950 border border-white/10 rounded-lg p-3 flex flex-wrap gap-2 items-center">
                            {(formData.tags || []).map((tag, i) => (
                                <span key={i} className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-sm border border-indigo-500/30 flex items-center gap-1">
                                    {tag}
                                    <button onClick={() => removeTag(i)} className="hover:text-white"><X size={12} /></button>
                                </span>
                            ))}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                    className="bg-transparent outline-none text-white min-w-[100px] text-sm"
                                    placeholder="+ إضافة وسم"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">ملاحظات إضافية</label>
                        <textarea
                            value={formData.notes || ''}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white h-32 outline-none resize-none"
                            placeholder="اكتب أي ملاحظات هنا..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex justify-between bg-slate-900/50">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={20} />
                        <span>حذف العميل</span>
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-slate-400 hover:text-white font-bold transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Save size={20} />
                            <span>حفظ التغييرات</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDetail;
