import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, History, Settings, Send, LayoutGrid } from 'lucide-react';
import EmailComposer from './EmailComposer';
import EmailHistory from './EmailHistory';
import NotificationSettings from './NotificationSettings';

const CommunicationsHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'settings'>('compose');

    const tabs: { id: 'compose' | 'history' | 'settings'; label: string; icon: any; disabled?: boolean }[] = [
        { id: 'compose', label: 'إرسال رسالة', icon: Send },
        { id: 'history', label: 'السجل', icon: History },
        { id: 'settings', label: 'الإعدادات', icon: Settings },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">مركز الاتصال</h1>
                    <p className="text-slate-400">إدارة المراسلات والإشعارات المركزية</p>
                </div>
            </div>

            <div className="flex gap-4 p-1 bg-slate-900/50 rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                        disabled={tab.disabled}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                            } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {tab.disabled && <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded ml-2">قريباً</span>}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'compose' && <EmailComposer />}
                        {activeTab === 'history' && <EmailHistory />}
                        {activeTab === 'settings' && <NotificationSettings />}
                    </motion.div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <LayoutGrid size={18} className="text-indigo-400" />
                            إحصائيات سريعة
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-sm">تم الإرسال اليوم</span>
                                <span className="text-white font-mono font-bold">0</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-sm">تشغيل الخدمة</span>
                                <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">نشط (Resend)</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-white mb-2">تلميح ذكي 💡</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            استخدم هذا المركز لإرسال تحديثات يدوية للعملاء. إشعارات "الترحيب" و "الفواتير" مفعلة تلقائياً في الخلفية.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationsHub;
