import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../../../context/BusinessContext';
import { useUI } from '../../../../context/UIContext';
import { Client } from '../../../../types';
import { X, Save, Trash2, Phone, Mail, Globe, MapPin, Tag, Calendar, User, DollarSign, FileText, Briefcase, MessageCircle, Upload, File, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { storageService } from '../../../../lib/services/storageService';

interface ClientDetailProps {
    client: Client;
    onClose: () => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ client, onClose }) => {
    const { updateClient, deleteClient, invoices, projects, serviceRequests } = useBusiness();
    const { isShieldMode, addToast } = useUI();
    const clientInvoices = invoices.filter(i => i.clientId === client.id);
    const clientProjects = projects.filter(p => p.client_id === client.id || p.clientId === client.id || p.clientEmail === client.email);
    const clientRequests = serviceRequests.filter(r => r.clientId === client.id || r.clientEmail === client.email);

    const [activeTab, setActiveTab] = useState<'info' | 'projects' | 'requests' | 'files'>('info');
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

    const [isUploading, setIsUploading] = useState(false);

    const openWhatsApp = () => {
        const phone = formData.phone.replace(/\+/g, '').replace(/\s/g, '');
        const text = encodeURIComponent(`مرحباً ${formData.name}، معك فريق NR-OS بخصوص استفسارك...`);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileName = `${client.id}/${Date.now()}_${file.name}`;
            const publicUrl = await storageService.uploadFile('attachments', fileName, file);

            if (publicUrl) {
                const newAttachment = {
                    id: Math.random().toString(36).substr(2, 9),
                    fileName: file.name,
                    fileUrl: publicUrl,
                    fileType: file.type,
                    fileSize: file.size,
                    uploadedBy: 'admin' as const,
                    uploadedAt: new Date().toISOString()
                };

                // In a real app, we would update the client's data in the DB to include this attachment
                // For now, we update local state to show the link
                setFormData(prev => ({
                    ...prev,
                    notes: (prev.notes || '') + `\n[File Uploaded: ${file.name}]`
                }));
            }
        } catch (error) {
            console.error('File upload failed:', error);
        } finally {
            setIsUploading(false);
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

                {/* Tabs Navigation */}
                <div className="flex px-6 border-b border-white/5 bg-slate-950/20" dir="rtl">
                    {[
                        { id: 'info', label: 'المعلومات الأساسية', icon: User },
                        { id: 'projects', label: 'المشاريع', icon: Briefcase, count: clientProjects.length },
                        { id: 'requests', label: 'الطلبات', icon: MessageCircle, count: clientRequests.length },
                        { id: 'files', label: 'المستندات', icon: FileText }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[8px] ${activeTab === tab.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                                    {tab.count}
                                </span>
                            )}
                            {activeTab === tab.id && (
                                <motion.div layoutId="clientTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar" dir="rtl">
                    {activeTab === 'info' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
                                            type={isShieldMode ? "password" : "tel"}
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
                                            type={isShieldMode ? "password" : "email"}
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className="bg-transparent border-none outline-none text-white w-full font-mono"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={openWhatsApp}
                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 py-4 rounded-xl font-bold hover:bg-emerald-600/20 transition-all"
                                >
                                    <MessageCircle size={20} />
                                    تواصل واتساب
                                </button>
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
                                            type={isShieldMode ? "password" : "number"}
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
                                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white h-24 outline-none resize-none"
                                    placeholder="اكتب أي ملاحظات هنا..."
                                />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'projects' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Briefcase size={16} className="text-indigo-400" />
                                سجل المشاريع المتصلة
                            </h3>
                            {clientProjects.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {clientProjects.map(proj => (
                                        <div key={proj.id} className="p-4 bg-slate-950/50 border border-white/5 rounded-xl flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                                            <div>
                                                <p className="text-sm font-bold text-white mb-1">{proj.title}</p>
                                                <p className="text-[10px] text-slate-500 font-mono">{proj.status} • {proj.category}</p>
                                            </div>
                                            <button
                                                onClick={() => addToast('سيتم نقلك لمتابعة المشروع في التحديث القادم', 'info')}
                                                className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                إدارة المشروع
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl">
                                    <p className="text-xs text-slate-600 italic">لا توجد مشاريع مسجلة لهذا العميل بعد.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'requests' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <MessageCircle size={16} className="text-emerald-400" />
                                استفسارات وطلبات الخدمة
                            </h3>
                            {clientRequests.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {clientRequests.map(req => (
                                        <div key={req.id} className="p-4 bg-slate-950/50 border border-white/5 rounded-xl flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                                            <div>
                                                <p className="text-sm font-bold text-white mb-1">{req.serviceTitle}</p>
                                                <p className="text-[10px] text-slate-500 font-mono">
                                                    {new Date(req.date).toLocaleDateString('ar-EG')} • {req.status}
                                                </p>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-[8px] font-black uppercase ${req.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                                                req.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    'bg-slate-800 text-slate-500'
                                                }`}>
                                                {req.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl">
                                    <p className="text-xs text-slate-600 italic">لا توجد طلبات خدمة مسجلة لهذا العميل.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'files' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={16} className="text-indigo-400" />
                                    المستندات والتعاقدات
                                </h3>
                                <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-bold text-white transition-all flex items-center gap-2">
                                    {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                    {isUploading ? 'جاري الرفع...' : 'رفع ملف جديد'}
                                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                                </label>
                            </div>

                            <div className="p-4 bg-slate-950/50 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                                <File size={24} className="text-slate-700 mb-2" />
                                <p className="text-[10px] text-slate-500 font-medium max-w-[200px] mx-auto">
                                    اسحب الملفات هنا أو اضغط لرفع العقود، الهوية، أو متطلبات المناقصة.
                                </p>
                            </div>
                        </motion.div>
                    )}
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
