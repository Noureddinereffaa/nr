import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Briefcase, FileText, CheckCircle2, AlertTriangle, Loader2, Calendar, DollarSign, Tag } from 'lucide-react';
import { requestService } from '../../lib/services/requestService';
import { fileUploadService } from '../../lib/services/fileUploadService';
import { Project, RequestAttachment } from '../../lib/types';
import FileUploader from '../shared/FileUploader';
import { UploadResult } from '../../lib/services/fileUploadService';

interface PortalRequestFormProps {
    project: Project;
    onSuccess?: () => void;
}

const REQUEST_CATEGORIES = [
    { id: 'development', label: 'تطوير', icon: '💻' },
    { id: 'design', label: 'تصميم', icon: '🎨' },
    { id: 'consulting', label: 'استشارة', icon: '💡' },
    { id: 'support', label: 'دعم فني', icon: '🛠️' },
    { id: 'other', label: 'أخرى', icon: '📋' }
];

const BUDGET_RANGES = [
    { id: 'small', label: 'صغير (< 50,000 DZD)', value: '< 50,000' },
    { id: 'medium', label: 'متوسط (50,000 - 200,000 DZD)', value: '50,000 - 200,000' },
    { id: 'large', label: 'كبير (200,000 - 500,000 DZD)', value: '200,000 - 500,000' },
    { id: 'enterprise', label: 'مؤسسي (> 500,000 DZD)', value: '> 500,000' },
    { id: 'flexible', label: 'مرن', value: 'مرن' }
];

const PortalRequestForm: React.FC<PortalRequestFormProps> = ({ project, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [uploadedAttachments, setUploadedAttachments] = useState<RequestAttachment[]>([]);
    const [formData, setFormData] = useState({
        serviceTitle: '',
        message: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
        category: '',
        budget: '',
        timeline: ''
    });

    const handleFilesUploaded = (results: UploadResult[]) => {
        const newAttachments: RequestAttachment[] = results.map(result => ({
            id: 'att-' + Date.now() + Math.random(),
            fileName: result.fileName || 'unknown',
            fileUrl: result.fileUrl || '',
            fileType: result.fileType || '',
            fileSize: result.fileSize || 0,
            uploadedBy: 'client',
            uploadedAt: new Date().toISOString()
        }));

        setUploadedAttachments(prev => [...prev, ...newAttachments]);
    };

    const removeAttachment = (id: string) => {
        setUploadedAttachments(prev => prev.filter(att => att.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');

        try {
            await requestService.create({
                clientName: project.client_id || project.client || 'Client',
                clientEmail: 'client@portal.com', // In real app, fetch from auth
                clientPhone: '+213 XXX XXX XXX', // In real app, fetch from auth
                serviceTitle: formData.serviceTitle,
                message: formData.message,
                priority: formData.priority,
                category: formData.category,
                budget: formData.budget,
                timeline: formData.timeline,
                status: 'new',
                source: 'portal',
                projectId: project.id,
                attachments: uploadedAttachments
            } as any);

            setStatus('success');
            setFormData({
                serviceTitle: '',
                message: '',
                priority: 'medium',
                category: '',
                budget: '',
                timeline: ''
            });
            setUploadedAttachments([]);

            if (onSuccess) {
                setTimeout(() => onSuccess(), 1500);
            } else {
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Request submission failed:', error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-10 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Zap size={28} />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white">طلب خدمة جديدة</h2>
                    <p className="text-slate-500 text-sm">أرسل طلبك مباشرة إلى فريق العمل مع جميع التفاصيل</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                {/* Category Selection */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Tag size={14} /> فئة الطلب
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {REQUEST_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, category: cat.id })}
                                className={`p-3 rounded-xl text-xs font-bold transition-all border ${formData.category === cat.id
                                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                                        : 'bg-slate-950 border-white/10 text-slate-500 hover:bg-white/5'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{cat.icon}</div>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Service Title */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase size={14} /> عنوان الطلب
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.serviceTitle}
                        onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="مثال: تطوير ميزة جديدة، تصميم إضافي، استشارة تقنية..."
                    />
                </div>

                {/* Budget Range */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign size={14} /> نطاق الميزانية (اختياري)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {BUDGET_RANGES.map((range) => (
                            <button
                                key={range.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, budget: range.value })}
                                className={`p-3 rounded-xl text-xs font-bold transition-all border text-right ${formData.budget === range.value
                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                        : 'bg-slate-950 border-white/10 text-slate-500 hover:bg-white/5'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={14} /> الموعد المفضل للإنجاز (اختياري)
                    </label>
                    <input
                        type="date"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {/* Priority */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle size={14} /> الأولوية
                    </label>
                    <div className="flex gap-3">
                        {['low', 'medium', 'high'].map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setFormData({ ...formData, priority: p as any })}
                                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all border ${formData.priority === p
                                        ? p === 'high'
                                            ? 'bg-red-500/20 border-red-500 text-red-500'
                                            : p === 'medium'
                                                ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                                                : 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                                        : 'bg-slate-950 border-white/10 text-slate-500 hover:bg-white/5'
                                    }`}
                            >
                                {p === 'high' ? 'مستعجل' : p === 'medium' ? 'عادي' : 'منخفض'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14} /> تفاصيل الطلب
                    </label>
                    <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        placeholder="اشرح متطلباتك بالتفصيل... ما الذي تحتاجه؟ ما هي أهدافك؟"
                    />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        مرفقات (صور، مستندات، تصاميم)
                    </label>
                    <FileUploader
                        onFilesUploaded={handleFilesUploaded}
                        maxFiles={5}
                        maxSizeMB={10}
                        multiple={true}
                    />

                    {/* Uploaded Attachments */}
                    {uploadedAttachments.length > 0 && (
                        <div className="mt-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                            <p className="text-emerald-400 text-xs font-bold mb-2">
                                ✓ تم رفع {uploadedAttachments.length} ملف بنجاح
                            </p>
                            <div className="space-y-1">
                                {uploadedAttachments.map(att => (
                                    <div key={att.id} className="flex items-center justify-between text-xs text-slate-400">
                                        <span className="flex items-center gap-2">
                                            {fileUploadService.getFileIcon(att.fileType)}
                                            {att.fileName}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(att.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${status === 'success'
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                : 'bg-indigo-600 text-white hover:bg-indigo-500'
                            } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : status === 'success' ? (
                            <>
                                <CheckCircle2 size={20} />
                                تم الإرسال بنجاح ✓
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                إرسال الطلب
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3 text-sm"
                            >
                                <AlertTriangle size={18} />
                                حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </div>
    );
};

export default PortalRequestForm;

