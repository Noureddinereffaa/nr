import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle, Loader2, Download, Eye, MessageCircle, Zap, Briefcase, DollarSign, Paperclip } from 'lucide-react';
import { ServiceRequest } from '../../lib/types';
import Timeline from '../shared/Timeline';
import { fileUploadService } from '../../lib/services/fileUploadService';
import { requestService } from '../../lib/services/requestService';
import PortalMessaging from './PortalMessaging';

interface PortalRequestTrackingProps {
    request: ServiceRequest;
    className?: string;
}

const PortalRequestTracking: React.FC<PortalRequestTrackingProps> = ({ request, className = '' }) => {
    const statusMap = {
        new: { label: 'جديد', color: 'bg-blue-600', textColor: 'text-blue-400', icon: AlertTriangle },
        review: { label: 'قيد المراجعة', color: 'bg-amber-600', textColor: 'text-amber-400', icon: Clock },
        proposal: { label: 'عرض سعر', color: 'bg-purple-600', textColor: 'text-purple-400', icon: Eye },
        negotiation: { label: 'تفاوض', color: 'bg-indigo-600', textColor: 'text-indigo-400', icon: Clock },
        accepted: { label: 'مقبول', color: 'bg-emerald-600', textColor: 'text-emerald-400', icon: CheckCircle },
        rejected: { label: 'مرفوض', color: 'bg-red-600', textColor: 'text-red-400', icon: AlertTriangle },
        completed: { label: 'مكتمل', color: 'bg-green-600', textColor: 'text-green-400', icon: CheckCircle }
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
        <div className={`space-y-10 ${className}`} dir="rtl">
            {/* Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-3xl"
            >
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="flex-1 space-y-8 text-right">
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-[1.5rem] ${currentStatus.color}/10 flex items-center justify-center shadow-inner`}>
                                <StatusIcon className={currentStatus.textColor} size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-white tracking-tight">{request.serviceTitle}</h3>
                                <div className="flex items-center gap-2 justify-end">
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${currentStatus.textColor}`}>
                                        {currentStatus.label}
                                    </span>
                                    <span className="px-2 py-0.5 bg-white/5 rounded-md text-[10px] font-mono text-slate-500 border border-white/5 uppercase">ID: {request.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="space-y-4 bg-slate-950/40 p-6 rounded-2xl border border-white/5">
                            <div className="flex items-center justify-between">
                                <span className={`text-[11px] font-black ${currentStatus.textColor}`}>{progress.toFixed(0)}%</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">تقدم الطلب</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-3.5 p-1 overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: 'circOut' }}
                                    className={`h-full ${currentStatus.color} rounded-full relative`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-shimmer-slow"></div>
                                    <div className={`absolute top-0 right-0 w-2 h-2 rounded-full blur-[4px] ${currentStatus.textColor.replace('text-', 'bg-')}`}></div>
                                </motion.div>
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                <span>{request.status === 'completed' ? 'تم الإنجاز' : 'قيد العمل'}</span>
                                <span>البداية: {formatDate(request.date)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Estimated Completion Card */}
                    {request.estimatedCompletion && (
                        <div className={`p-8 rounded-[2rem] border-2 flex flex-col items-center justify-center min-w-[200px] text-center transition-all ${isEstimatedDatePassed()
                            ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                            : 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            }`}>
                            <Zap className={`mb-4 ${isEstimatedDatePassed() ? 'text-red-400' : 'text-emerald-400'}`} size={32} />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                                التاريخ المتوقع لتحقيق الهدف
                            </p>
                            <p className={`text-2xl font-black tracking-tighter ${isEstimatedDatePassed() ? 'text-red-400' : 'text-emerald-400'
                                }`}>
                                {formatDate(request.estimatedCompletion)}
                            </p>
                            {isEstimatedDatePassed() && (
                                <div className="mt-3 px-3 py-1 bg-red-500/10 rounded-lg text-[9px] font-black text-red-400 uppercase tracking-[0.2em] border border-red-500/20 animate-pulse">
                                    تجاوز الموعد
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card border-white/5 rounded-[2rem] p-8 hover:bg-white/5 transition-all text-right">
                    <Briefcase className="text-slate-700 mb-4 mr-auto" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">الفئة الرئيسية</p>
                    <p className="text-xl font-black text-white tracking-tight">{request.category || 'غير محدد'}</p>
                </div>
                <div className="glass-card border-white/5 rounded-[2rem] p-8 hover:bg-white/5 transition-all text-right">
                    <Zap className="text-slate-700 mb-4 mr-auto" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">مستوى الأولوية</p>
                    <p className={`text-xl font-black tracking-tight ${request.priority === 'high' ? 'text-red-400' :
                        request.priority === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                        {request.priority === 'high' ? 'مستعجل جداً' :
                            request.priority === 'medium' ? 'عادي' : 'منخفض الأولوية'}
                    </p>
                </div>
                <div className="glass-card border-white/5 rounded-[2rem] p-8 hover:bg-white/5 transition-all text-right">
                    <DollarSign className="text-slate-700 mb-4 mr-auto" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">نطاق الميزانية</p>
                    <p className="text-xl font-black text-emerald-400 tracking-tight">{request.budget || 'غير محدد'}</p>
                </div>
            </div>

            {/* Content Row: Timeline & (Attachments + Messaging) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Timeline Section */}
                <div className="glass-card border-white/5 rounded-[2.5rem] p-10 flex flex-col h-full bg-slate-900/10">
                    <h4 className="text-2xl font-black text-white mb-10 flex items-center gap-4 justify-end">
                        تتبع التنفيذ الحقيقي
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
                            <Clock className="text-indigo-400" size={24} />
                        </div>
                    </h4>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {request.timelineEvents && request.timelineEvents.length > 0 ? (
                            <Timeline events={request.timelineEvents} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                                <Loader2 size={40} className="mb-4 animate-spin opacity-20" />
                                <p className="font-bold">جارِ معالجة الطلب...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Attachments & Messaging */}
                <div className="space-y-10">
                    {/* Attachments */}
                    {request.attachments && request.attachments.length > 0 && (
                        <div className="glass-card border-white/5 rounded-[2.5rem] p-10">
                            <h4 className="text-2xl font-black text-white mb-8 flex items-center gap-4 justify-end">
                                المستندات المرفقة
                                <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center">
                                    <Paperclip className="text-purple-400" size={24} />
                                </div>
                            </h4>
                            <div className="grid gap-3">
                                {request.attachments.map((attachment, index) => (
                                    <div
                                        key={attachment.id || index}
                                        className="flex items-center justify-between p-4 glass-card border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all group/file"
                                    >
                                        <a
                                            href={attachment.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
                                        >
                                            <Download size={18} />
                                        </a>
                                        <div className="flex items-center gap-4 flex-1 min-w-0 justify-end">
                                            <div className="flex-1 min-w-0 text-right">
                                                <p className="text-white font-bold truncate text-sm">
                                                    {attachment.fileName}
                                                </p>
                                                <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mt-1">
                                                    {fileUploadService.formatFileSize(attachment.fileSize)}
                                                    {' • '}
                                                    {attachment.uploadedBy === 'client' ? 'أنت' : 'الإدارة'}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-xl shrink-0">
                                                {fileUploadService.getFileIcon(attachment.fileType)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messaging Section */}
                    <div className="glass-card border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col h-full bg-indigo-600/5">
                        <h4 className="text-2xl font-black text-white mb-8 flex items-center gap-4 justify-end">
                            مساحة النقاش
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
                                <MessageCircle className="text-indigo-400" size={24} />
                            </div>
                        </h4>
                        <div className="flex-1 min-h-[400px]">
                            <PortalMessaging
                                requestId={request.id}
                                currentRole="client"
                                messages={request.timelineEvents
                                    ?.filter(e => e.type === 'message' || e.type === 'crm')
                                    .map(e => ({
                                        id: e.id,
                                        content: e.description,
                                        role: e.actor === 'client' ? 'client' : 'admin',
                                        date: e.timestamp
                                    })) || []}
                                onSendMessage={async (text) => {
                                    try {
                                        await requestService.addClientMessage(request.id, text, request);
                                    } catch (err) {
                                        console.error('Failed to send message:', err);
                                        throw err;
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortalRequestTracking;
