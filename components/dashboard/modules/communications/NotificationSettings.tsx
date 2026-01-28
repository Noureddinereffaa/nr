import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Zap, Mail, Shield } from 'lucide-react';

const NotificationSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        welcomeEmail: true,
        invoiceAlert: true,
        weeklyDigest: false,
        securityAlerts: true
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">إعدادات الأتمتة</h3>
                    <p className="text-slate-400 text-sm">تحكم في الرسائل التي يرسلها النظام تلقائياً.</p>
                </div>

                <div className="space-y-4">
                    <ToggleCard
                        icon={Mail}
                        title="رسالة الترحيب"
                        desc="إرسال بريد إلكتروني تلقائي عند إنشاء مشروع جديد للعميل."
                        isActive={settings.welcomeEmail}
                        onClick={() => toggle('welcomeEmail')}
                    />
                    <ToggleCard
                        icon={Zap}
                        title="تنبيه الفواتير"
                        desc="تذكير العميل عند استحقاق فاتورة جديدة."
                        isActive={settings.invoiceAlert}
                        onClick={() => toggle('invoiceAlert')}
                    />
                    <ToggleCard
                        icon={Shield}
                        title="تنبيهات الأمان"
                        desc="إشعار عند محاولة دخول مشبوهة لبوابة العميل."
                        isActive={settings.securityAlerts}
                        onClick={() => toggle('securityAlerts')}
                    />
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-900/20 border border-indigo-500/20 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 text-indigo-400">
                    <Bell size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">النظام يعمل بكفاءة</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    خدمة البريد الإلكتروني (Resend) متصلة وتعمل بنسبة جاهزية 100%. التنبيهات تصل في الوقت الفعلي.
                </p>
            </div>
        </div>
    );
};

const ToggleCard = ({ icon: Icon, title, desc, isActive, onClick }: any) => (
    <div
        onClick={onClick}
        className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${isActive
                ? 'bg-indigo-600/10 border-indigo-500/50'
                : 'bg-slate-900 border-white/5 hover:border-white/10'
            }`}
    >
        <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
            <Icon size={20} />
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
                <h4 className={`font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${isActive ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isActive ? 'left-4.5' : 'left-0.5'}`} />
                </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{desc}</p>
        </div>
    </div>
);

export default NotificationSettings;
