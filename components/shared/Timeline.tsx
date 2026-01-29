import React from 'react';
import { Clock, CheckCircle, MessageSquare, Paperclip, AlertCircle, DollarSign, FileText } from 'lucide-react';
import { RequestTimelineEvent } from '../../lib/types';

export interface TimelineProps {
    events: RequestTimelineEvent[];
    className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ events, className = '' }) => {
    const getEventIcon = (type: RequestTimelineEvent['type']) => {
        switch (type) {
            case 'status_change':
                return <CheckCircle size={16} />;
            case 'message':
                return <MessageSquare size={16} />;
            case 'attachment':
                return <Paperclip size={16} />;
            case 'note':
                return <FileText size={16} />;
            case 'payment':
                return <DollarSign size={16} />;
            case 'created':
                return <Clock size={16} />;
            default:
                return <AlertCircle size={16} />;
        }
    };

    const getEventColor = (type: RequestTimelineEvent['type']) => {
        switch (type) {
            case 'status_change':
                return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            case 'message':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'attachment':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'note':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'payment':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'created':
                return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default:
                return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getActorLabel = (actor: RequestTimelineEvent['actor']) => {
        switch (actor) {
            case 'client':
                return 'العميل';
            case 'admin':
                return 'الإدارة';
            case 'system':
                return 'النظام';
            default:
                return '';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'الآن';
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        if (hours < 24) return `منذ ${hours} ساعة`;
        if (days < 7) return `منذ ${days} يوم`;

        return date.toLocaleDateString('ar-DZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!events || events.length === 0) {
        return (
            <div className={`text-center py-8 text-slate-500 ${className}`}>
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">لا توجد أحداث مسجلة بعد</p>
            </div>
        );
    }

    // Sort events by timestamp (newest first)
    const sortedEvents = [...events].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
        <div className={`space-y-4 ${className}`} dir="rtl">
            {sortedEvents.map((event, index) => (
                <div key={event.id || index} className="flex gap-4 group">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${getEventColor(event.type)}`}>
                            {getEventIcon(event.type)}
                        </div>
                        {index < sortedEvents.length - 1 && (
                            <div className="w-0.5 flex-1 bg-white/5 mt-2"></div>
                        )}
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 pb-6">
                        <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 group-hover:border-white/10 transition-all">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1">
                                    <p className="text-white font-medium leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${getEventColor(event.type)}`}>
                                    {getActorLabel(event.actor)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <Clock size={12} />
                                {formatTimestamp(event.timestamp)}
                            </div>

                            {/* Metadata */}
                            {event.metadata && (
                                <div className="mt-3 pt-3 border-t border-white/5">
                                    <pre className="text-xs text-slate-600 overflow-auto max-h-32">
                                        {JSON.stringify(event.metadata, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
