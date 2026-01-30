import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Briefcase, FileText, CheckCircle2, AlertTriangle, Loader2, Calendar, DollarSign, Tag, Sparkles } from 'lucide-react';
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
                clientName: project.client || project.clientId || project.client_id || 'Client',
                clientEmail: project.clientEmail || 'client@portal.com',
                clientPhone: '',
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
        <div className="glass-card border-white/5 rounded-[3rem] p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden group shadow-3xl">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full group-hover:bg-indigo-600/15 transition-all duration-1000"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full group-hover:bg-purple-600/15 transition-all duration-1000"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12 justify-end">
                    <div className="text-right">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">طلب خدمة جديدة</h2>
                        <p className="text-slate-500 font-bold text-lg">حول فكرتك إلى حقيقة.. أخبرنا بما تحتاج إليه</p>
                    </div>
                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/10 flex items-center justify-center text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <Zap size={36} className="fill-indigo-600/20" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10" dir="rtl">
                    {/* Category Selection */}
                    <div className="space-y-4 text-right">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 justify-end">
                            فئة الطلب <Tag size={14} className="text-indigo-400" />
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {REQUEST_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.id })}
                                    className={`p-6 rounded-[1.5rem] transition-all duration-300 border flex flex-col items-center justify-center gap-3 ${formData.category === cat.id
                                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-600/10 scale-105'
                                        : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className="text-3xl filter drop-shadow-lg">{cat.icon}</div>
                                    <span className="text-[11px] font-black tracking-tighter">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Service Title */}
                    <div className="space-y-4 text-right">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 justify-end">
                            عنوان الطلب المختصر <Briefcase size={14} className="text-indigo-400" />
                        </label>
                        <div className="relative group/input">
                            <input
                                type="text"
                                required
                                value={formData.serviceTitle}
                                onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-indigo-500/50 transition-all text-lg font-bold placeholder:text-slate-700 placeholder:font-normal"
                                placeholder="مثال: تطوير ميزة جديدة، تصميم واجهة تطبيق..."
                            />
                            <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Budget Range */}
                    <div className="space-y-4 text-right">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 justify-end">
                            نطاق الميزانية التقديري <DollarSign size={14} className="text-emerald-400" />
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {BUDGET_RANGES.map((range) => (
                                <button
                                    key={range.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, budget: range.value })}
                                    className={`p-4 rounded-xl text-[10px] font-black tracking-tighter transition-all border text-center ${formData.budget === range.value
                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                        : 'bg-slate-900/40 border-white/5 text-slate-600 hover:bg-white/5 hover:text-slate-400'
                                        }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Timeline */}
                        <div className="space-y-4 text-right">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 justify-end">
                                الموعد المفضل للإنجاز <Calendar size={14} className="text-indigo-400" />
                            </label>
                            <input
                                type="date"
                                value={formData.timeline}
                                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Priority */}
                        <div className="space-y-4 text-right">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 justify-end">
                                مستوى الأهمية <AlertTriangle size={14} className="text-amber-400" />
                            </label>
                            <div className="flex gap-4">
                                {['low', 'medium', 'high'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p as any })}
                                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all border ${formData.priority === p
                                            ? p === 'high'
                                                ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-lg shadow-red-500/10'
                                                : p === 'medium'
                                                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-lg shadow-amber-500/10'
                                                    : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500 shadow-lg shadow-emerald-500/10'
                                            : 'bg-slate-900/40 border-white/5 text-slate-600 hover:bg-white/5 hover:text-slate-400'
                                            }`}
                                    >
                                        {p === 'high' ? 'مستعجل' : p === 'medium' ? 'عادي' : 'منخفض'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-4 text-right">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 justify-end">
                            تفاصيل المتطلبات <FileText size={14} className="text-indigo-400" />
                        </label>
                        <textarea
                            required
                            rows={8}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-[2rem] px-8 py-6 text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none text-lg leading-relaxed placeholder:text-slate-800 placeholder:font-normal"
                            placeholder="اشرح متطلباتك بالتفصيل... ما الذي تحتاجه؟ ما هي أهدافك من هذا الطلب؟"
                        />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-4 text-right">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 justify-end">
                            المرفقات والمستندات <Sparkles size={14} className="text-purple-400" />
                        </label>
                        <div className="p-10 bg-slate-950/30 border border-dashed border-white/10 rounded-[3rem] group/upload hover:border-indigo-500/30 transition-all">
                            <FileUploader
                                onFilesUploaded={handleFilesUploaded}
                                maxFiles={5}
                                maxSizeMB={10}
                                multiple={true}
                            />
                        </div>

                        {/* Uploaded Attachments */}
                        <AnimatePresence>
                            {uploadedAttachments.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[1.5rem]"
                                >
                                    <p className="text-emerald-400 text-xs font-black mb-4 flex items-center gap-2 justify-end">
                                        تم رفع {uploadedAttachments.length} ملف بنجاح <CheckCircle2 size={14} />
                                    </p>
                                    <div className="space-y-2">
                                        {uploadedAttachments.map(att => (
                                            <div key={att.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-white/5 group/file">
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(att.id)}
                                                    className="text-red-400/50 hover:text-red-400 transition-colors px-3 py-1 rounded-lg hover:bg-red-400/10 text-[10px] font-black uppercase tracking-widest"
                                                >
                                                    حذف
                                                </button>
                                                <span className="flex items-center gap-3 text-xs text-slate-400 font-bold overflow-hidden justify-end flex-1">
                                                    <span className="truncate">{att.fileName}</span>
                                                    <span className="shrink-0">{fileUploadService.getFileIcon(att.fileType)}</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl relative overflow-hidden group/btn ${status === 'success'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            {isLoading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : status === 'success' ? (
                                <>
                                    تم الإرسال بنجاح ✓
                                    <CheckCircle2 size={24} className="animate-bounce" />
                                </>
                            ) : (
                                <>
                                    تأكيد وإرسال الطلب
                                    <Send size={24} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-500" />
                                </>
                            )}
                        </button>

                        <AnimatePresence>
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-6 p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-between gap-3 text-sm font-bold"
                                >
                                    <span>حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.</span>
                                    <AlertTriangle size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <p className="text-center text-slate-600 text-[10px] font-black uppercase tracking-widest mt-6">
                            سيتم مراجعة طلبك والرد عليه في أقرب وقت ممكن
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PortalRequestForm;
