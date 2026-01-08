import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileText, Send, UserCheck } from 'lucide-react';

interface RequestStatusProps {
    status: 'pending' | 'review' | 'approved' | 'rejected' | 'in_progress' | 'completed';
    timeline: {
        date: string;
        title: string;
        description?: string;
        status: 'completed' | 'current' | 'upcoming';
    }[];
}

const statusConfig = {
    pending: { label: 'قيد الانتظار', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
    review: { label: 'قيد المراجعة', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: UserCheck },
    approved: { label: 'تمت الموافقة', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle },
    rejected: { label: 'مرفوض', color: 'text-red-500', bg: 'bg-red-500/10', icon: X },
    in_progress: { label: 'قيد التنفيذ', color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: Zap },
    completed: { label: 'مكتمل', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
};

import { X, Zap } from 'lucide-react';

export const RequestStatus: React.FC<RequestStatusProps> = ({ status, timeline }) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <div className="bg-slate-900 border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">حالة الطلب</h3>
                    <p className="text-slate-400 text-sm">تتبع تقدم طلبك بشكل لحظي</p>
                </div>
                <div className={`px-4 py-2 rounded-full border border-white/5 ${config.bg} ${config.color} flex items-center gap-2 font-bold`}>
                    <Icon size={18} />
                    {config.label}
                </div>
            </div>

            <div className="relative border-r-2 border-slate-800 mr-2 space-y-8">
                {timeline.map((item, index) => (
                    <div key={index} className="relative mr-[-11px]">
                        <div className={`absolute top-0 right-0 w-5 h-5 rounded-full border-4 border-slate-900 ${item.status === 'completed' ? 'bg-emerald-500' : item.status === 'current' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}></div>
                        <div className="pr-8 pt-1">
                            <h4 className={`font-bold ${item.status === 'upcoming' ? 'text-slate-500' : 'text-white'}`}>{item.title}</h4>
                            <span className="text-xs text-slate-500 block mb-1">{item.date}</span>
                            {item.description && (
                                <p className="text-sm text-slate-400 mt-1 bg-white/5 p-3 rounded-lg border border-white/5">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
