import React from 'react';
import { Bell, Check, X, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { useUI } from '../../../context/UIContext';

const NotificationDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { notifications, markNotificationAsRead, clearNotifications } = useUI();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-green-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
            case 'error': return <AlertCircle size={16} className="text-red-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now.getTime() - date.getTime();
            const minutes = Math.floor(diff / 60000);
            if (minutes < 1) return 'الآن';
            if (minutes < 60) return `منذ ${minutes} د`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `منذ ${hours} سا`;
            return date.toLocaleDateString('ar-DZ');
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="absolute top-full left-4 mt-2 w-80 md:w-96 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
                <h3 className="font-black text-white text-sm">الإشعارات</h3>
                <button
                    onClick={clearNotifications}
                    className="text-[10px] text-indigo-400 hover:text-white transition-colors font-bold uppercase tracking-widest"
                >
                    مسح الكل
                </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs font-bold">
                        لا توجد إشعارات جديدة
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {notifications.map(notif => (
                            <div
                                key={notif.id}
                                className={`p-4 hover:bg-white/5 transition-colors relative group ${notif.read ? 'opacity-60' : 'bg-indigo-500/5'}`}
                                dir="rtl"
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="mt-1.5 shrink-0">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 text-right">
                                        <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-400' : 'text-white'}`}>{notif.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                                        <span className="text-[10px] text-slate-600 mt-2 block font-mono">
                                            {formatTime(notif.time)}
                                        </span>
                                    </div>
                                    <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-slate-900/80 rounded-lg p-1">
                                        {!notif.read && (
                                            <button
                                                onClick={() => markNotificationAsRead(notif.id)}
                                                className="p-1 hover:text-green-400 text-slate-400"
                                                title="تحديد كمقروء"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-2 bg-slate-950/50 border-t border-white/5 text-center">
                <button
                    onClick={onClose}
                    className="text-[10px] text-slate-500 hover:text-white transition-colors py-1 w-full"
                >
                    إغلاق
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;
