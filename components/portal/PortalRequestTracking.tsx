import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle, Loader2, Download, Eye } from 'lucide-react';
import { ServiceRequest } from '../../lib/types';
import Timeline from '../shared/Timeline';
import { fileUploadService } from '../../lib/services/fileUploadService';

interface PortalRequestTrackingProps {
    request: ServiceRequest;
    className?: string;
}

const PortalRequestTracking: React.FC<PortalRequestTrackingProps> = ({ request, className = '' }) => {
    const statusMap = {
        new: { label: 'جديد', color: 'bg-blue-500', icon: AlertTriangle },
        review: { label: 'قيد المراجعة', color: 'bg-amber-500', icon: Clock },
        proposal: { label: 'عرض سعر', color: 'bg-purple-500', icon: Eye },
        negotiation: { label: 'تفاوض', color: 'bg-indigo-500', icon: Clock },
        accepted: { label: 'مقبول', color: 'bg-emerald-500', icon: CheckCircle },
        rejected: { label: 'مرفوض', color: 'bg-red-500', icon: AlertTriangle },
        completed: { label: 'مكتمل', color: 'bg-green-500', icon: CheckCircle }
    };


    const currentStatus = statusMap[request.status];
    const StatusIcon = currentStatus.icon;

    // Calculate progress percentage
    const progressSteps = ['new', 'review', 'proposal', 'accepted', 'completed'];
    const currentStepIndex = progressSteps.indexOf(request.status);
    const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / progressSteps.length) * 100 : 0;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'غير محدد';
        return new Date(dateString).toLocaleDateString('ar-DZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isEstimatedDatePassed = () => {
        if (!request.estimatedCompletion) return false;
        return new Date(request.estimatedCompletion) < new Date();
    };

    return (
        <div className={`space-y-8 ${className}`} dir="rtl">
            {/* Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-8"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-2xl ${currentStatus.color}/10 flex items-center justify-center`}>
                                <StatusIcon className={`text-${currentStatus.color.replace('bg-', '')}`} size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white">{request.serviceTitle}</h3>
                                <p className="text-slate-400 text-sm font-mono">#{request.id}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">حالة الطلب:</span>
                                <span className={`font-bold px-3 py-1 rounded-full ${currentStatus.color}/20 text-${currentStatus.color.replace('bg-', '')}`}>
                                    {currentStatus.label}
                                </span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className={`h-full ${currentStatus.color} rounded-full`}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>بدأ: {formatDate(request.date)}</span>
                                <span>{progress.toFixed(0)}٪ مكتمل</span>
                            </div>
                        </div>
                    </div>

                    {/* Estimated Completion */}
                    {request.estimatedCompletion && (
                        <div className={`p-6 rounded-2xl border-2 ${isEstimatedDatePassed()
                            ? 'bg-red-500/5 border-red-500/20'
                            : 'bg-emerald-500/5 border-emerald-500/20'
                            }`}>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                تاريخ الإنجاز المتوقع
                            </p>
                            <p className={`text-2xl font-black ${isEstimatedDatePassed() ? 'text-red-400' : 'text-emerald-400'
                                }`}>
                                {formatDate(request.estimatedCompletion)}
                            </p>
                            {isEstimatedDatePassed() && (
                                <p className="text-xs text-red-400 mt-1">متأخر</p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">الفئة</p>
                    <p className="text-white font-bold">{request.category || 'غير محدد'}</p>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">الأولوية</p>
                    <p className={`font-bold uppercase ${request.priority === 'high' ? 'text-red-400' :
                        request.priority === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                        {request.priority === 'high' ? 'مستعجل' :
                            request.priority === 'medium' ? 'عادي' : 'منخفض'}
                    </p>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">الميزانية</p>
                    <p className="text-emerald-400 font-bold">{request.budget || 'غير محدد'}</p>
                </div>
            </div>

            {/* Attachments */}
            {request.attachments && request.attachments.length > 0 && (
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                    <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                        <Download className="text-indigo-400" size={24} />
                        المرفقات ({request.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {request.attachments.map((attachment, index) => (
                            <div
                                key={attachment.id || index}
                                className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="text-2xl">
                                        {fileUploadService.getFileIcon(attachment.fileType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate text-sm">
                                            {attachment.fileName}
                                        </p>
                                        <p className="text-slate-500 text-xs">
                                            {fileUploadService.formatFileSize(attachment.fileSize)}
                                            {' • '}
                                            {attachment.uploadedBy === 'client' ? 'أنت' : 'الإدارة'}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={attachment.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-all"
                                >
                                    <Download size={16} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                    <Clock className="text-indigo-400" size={24} />
                    الخط الزمني للطلب
                </h4>
                {request.timelineEvents && request.timelineEvents.length > 0 ? (
                    <Timeline events={request.timelineEvents} />
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        <Loader2 size={32} className="mx-auto mb-2 animate-spin opacity-50" />
                        <p className="text-sm">لا توجد تحديثات بعد</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortalRequestTracking;
