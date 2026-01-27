import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    User,
    Mail,
    Phone,
    Briefcase,
    Calendar,
    Star,
    MessageSquare,
    CheckCircle,
    ArrowLeft,
    UserPlus,
    Trash2,
    DollarSign,
    Target
} from 'lucide-react';
import { ServiceRequest } from '../../../../types';
import { useBusiness } from '../../../../context/BusinessContext';
import { useUI } from '../../../../context/UIContext';

interface RequestDetailProps {
    request: ServiceRequest;
    onClose: () => void;
}

const RequestDetail: React.FC<RequestDetailProps> = ({ request, onClose }) => {
    const { updateRequest, deleteRequest, addClient } = useBusiness();
    const { addToast, addNotification } = useUI();
    const [isConverting, setIsConverting] = useState(false);

    const handleStatusChange = async (newStatus: ServiceRequest['status']) => {
        try {
            await updateRequest(request.id, { status: newStatus });
            addToast(`تم تحديث الحالة إلى: ${newStatus}`, 'success');
        } catch (error) {
            addToast('فشل في تحديث الحالة', 'error');
        }
    };

    const handlePriorityChange = async (newPriority: ServiceRequest['priority']) => {
        try {
            await updateRequest(request.id, { priority: newPriority });
            addToast(`تم تحديث الأولوية إلى: ${newPriority}`, 'success');
        } catch (error) {
            addToast('فشل في تحديث الأولوية', 'error');
        }
    };

    const handleConvertToClient = async () => {
        if (window.confirm('هل تريد فعلاً تحويل هذا الطلب إلى عميل دائم؟')) {
            setIsConverting(true);
            try {
                // 1. Create client
                await addClient({
                    name: request.clientName,
                    email: request.clientEmail,
                    phone: request.clientPhone,
                    company: request.company,
                    status: 'active',
                    value: request.value || 0,
                    notes: `تم التحويل من طلب خدمة: ${request.serviceTitle}\n${request.projectDetails || ''}`,
                    tags: ['محول من طلب', request.serviceTitle]
                });

                // 2. Update request status
                await updateRequest(request.id, { status: 'accepted' });

                addNotification({
                    title: 'تم تحويل الطلب بنجاح',
                    message: `العميل ${request.clientName} أصبح الآن جزءاً من قاعدة بيانات الـ CRM.`,
                    type: 'success'
                });

                addToast('تم التحويل للـ CRM بنجاح', 'success');
                onClose();
            } catch (error) {
                addToast('حدث خطأ أثناء التحويل', 'error');
            } finally {
                setIsConverting(false);
            }
        }
    };

    const priorityColors = {
        low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        high: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const statusMap = {
        new: 'جديد',
        review: 'مراجعة',
        proposal: 'عرض سعر',
        negotiation: 'تفاوض',
        accepted: 'تم القبول',
        rejected: 'مرفوض',
        completed: 'مكتمل'
    };

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[80vh]"
            >
                {/* Visual Sidebar */}
                <div className="md:w-80 bg-indigo-600 p-8 flex flex-col justify-between text-white relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
                        <div className="absolute bottom-20 left--10 w-60 h-60 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter mb-2 leading-none uppercase">Service<br />Request</h3>
                        <p className="text-indigo-100 font-bold text-xs uppercase tracking-widest opacity-80">Ref: {request.id}</p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Status</p>
                            <p className="text-xl font-black">{statusMap[request.status]}</p>
                        </div>
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Priority</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${request.priority === 'high' ? 'bg-red-400' : request.priority === 'medium' ? 'bg-amber-400' : 'bg-slate-400'}`}></div>
                                <p className="text-xl font-black uppercase">{request.priority || 'medium'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 flex flex-col bg-[var(--bg-secondary)]" dir="rtl">
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-2xl">
                                <User className="text-indigo-400" size={24} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-white">{request.clientName}</h4>
                                <p className="text-slate-500 font-bold text-sm tracking-wide">{request.serviceTitle}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex items-center gap-4">
                                <Mail className="text-slate-600" size={20} />
                                <div className="text-left font-mono text-sm text-slate-300">{request.clientEmail}</div>
                            </div>
                            <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex items-center gap-4">
                                <Phone className="text-slate-600" size={20} />
                                <div className="text-left font-mono text-sm text-slate-300">{request.clientPhone}</div>
                            </div>
                            <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex items-center gap-4">
                                <Calendar className="text-slate-600" size={20} />
                                <div className="text-slate-300 font-bold block">{new Date(request.date).toLocaleString('ar-EG')}</div>
                            </div>
                            <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex items-center gap-4">
                                <DollarSign className="text-emerald-500" size={20} />
                                <div className="text-emerald-400 font-black">{request.value?.toLocaleString() || 0} DZD</div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Target size={14} className="text-indigo-500" />
                                تفاصيل ومواصفات المشروع
                            </h5>
                            <div className="p-6 bg-slate-950 border border-white/5 rounded-[2rem] text-slate-400 leading-loose font-medium">
                                {request.projectDetails || request.message || "لا توجد تفاصيل إضافية مسجلة لهذا الطلب."}
                            </div>
                        </div>

                        {/* Management Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">تحديث حالة المعالجة</h5>
                                <div className="flex flex-wrap gap-2">
                                    {(['new', 'review', 'proposal', 'accepted', 'rejected'] as ServiceRequest['status'][]).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => handleStatusChange(s)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${request.status === s
                                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                                : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                                        >
                                            {statusMap[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">درجة الأولوية</h5>
                                <div className="flex gap-2">
                                    {(['low', 'medium', 'high'] as ServiceRequest['priority'][]).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => handlePriorityChange(p)}
                                            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all border ${request.priority === p
                                                ? priorityColors[p]
                                                : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-white/5 bg-slate-950/30 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <button
                            onClick={() => {
                                if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                                    deleteRequest(request.id);
                                    onClose();
                                }
                            }}
                            className="flex items-center gap-2 text-red-500/50 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                            <Trash2 size={16} />
                            حذف الطلب نهائياً
                        </button>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={handleConvertToClient}
                                disabled={isConverting || request.status === 'accepted'}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-sm shadow-2xl transition-all active:scale-95
                                    ${request.status === 'accepted'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed'
                                        : 'bg-white text-slate-950 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]'}`}
                            >
                                {request.status === 'accepted' ? (
                                    <>
                                        <CheckCircle size={20} />
                                        تم التحويل للـ CRM
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={20} />
                                        تحويل إلى عميل (CRM)
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RequestDetail;
