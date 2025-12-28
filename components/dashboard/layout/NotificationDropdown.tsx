import React, { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
}

const NotificationDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', title: 'تم استلام طلب جديد', message: 'طلب خدمة "تطوير موقع" من شركة TechCorp', time: 'منذ دقيقتين', type: 'success', read: false },
        { id: '2', title: 'تنبيه النظام', message: 'يرجى مراجعة إعدادات الدفع الخاصة بك.', time: 'منذ ساعة', type: 'warning', read: false },
        { id: '3', title: 'تحديث المحتوى', message: 'تم نشر مقالك الجديد بنجاح.', time: 'منذ ساعتين', type: 'info', read: true },
    ]);

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="absolute top-full left-4 mt-2 w-80 md:w-96 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
                <h3 className="font-black text-white text-sm">الإشعارات</h3>
                <button
                    onClick={markAllRead}
                    className="text-[10px] text-indigo-400 hover:text-white transition-colors font-bold uppercase tracking-widest"
                >
                    تحديد الكل كمقروء
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
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'success' ? 'bg-green-500' :
                                            notif.type === 'warning' ? 'bg-amber-500' :
                                                notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                        }`} />
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-400' : 'text-white'}`}>{notif.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                                        <span className="text-[10px] text-slate-600 mt-2 block font-mono">{notif.time}</span>
                                    </div>
                                    <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-slate-900/80 rounded-lg p-1">
                                        {!notif.read && (
                                            <button onClick={() => markAsRead(notif.id)} className="p-1 hover:text-green-400 text-slate-400" title="مقروء">
                                                <Check size={14} />
                                            </button>
                                        )}
                                        <button onClick={() => deleteNotification(notif.id)} className="p-1 hover:text-red-400 text-slate-400" title="حذف">
                                            <X size={14} />
                                        </button>
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
