import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, Terminal, Shield, Globe, Zap, Key } from 'lucide-react';

const APISettings: React.FC = () => {
    // In a real app, this would come from env or database
    const [apiKey, setApiKey] = useState('sk_live_51M...');
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState(false);

    // Mock accessing the key from env for display if available securely, or just a placeholder
    // Since this is a client-side component, we shouldn't expose the real server key directly 
    // unless fetched via an authenticated endpoint.
    // For this UI demo/sovereign feel, we'll show the concept.
    const displayKey = "sk_sovereign_" + "x8d9f2m4k5n7j2p1q3r (Use env var SOVEREIGN_API_KEY)";

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const endpoints = [
        { method: 'GET', url: 'https://nr-os.vercel.app/api/v1/articles', desc: 'List all articles' },
        { method: 'POST', url: 'https://nr-os.vercel.app/api/v1/marketing/social', desc: 'Dispatch social post' },
        { method: 'GET', url: 'https://nr-os.vercel.app/api/v1/marketing/analytics', desc: 'Fetch empire stats' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" dir="rtl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Terminal className="text-indigo-500" />
                        مركز التحكم البرمجي (API Console)
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm">إدارة الاتصالات الخارجية والأتمتة.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">System Operational</span>
                </div>
            </div>

            {/* API Key Section */}
            <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

                <div className="flex items-start gap-6">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
                        <Key size={32} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">مفتاح السيادة (Sovereign Key)</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-2xl leading-relaxed">
                            هذا المفتاح يمنح صلاحيات كاملة للتحكم في نظام التشغيل الخاص بك. استخدمه بحذر مع n8n أو Zapier. لا تشاركه علناً.
                        </p>

                        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5 w-full max-w-3xl">
                            <div className="flex-1 font-mono text-sm text-slate-300 px-4 dir-ltr text-left tracking-wider">
                                {showKey ? displayKey : 'sk_sovereign_••••••••••••••••••••••••••••••'}
                            </div>
                            <button
                                onClick={() => setShowKey(!showKey)}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                            >
                                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button
                                onClick={() => handleCopy(displayKey)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-all ml-2"
                            >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                {copied ? 'تم النسخ' : 'نسخ'}
                            </button>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-[10px] text-amber-500/80 bg-amber-500/5 py-2 px-3 rounded-lg inline-flex border border-amber-500/10">
                            <Shield size={12} />
                            تنبيه: يجب ضبط المتغير SOVEREIGN_API_KEY في إعدادات Vercel ليعمل هذا المفتاح.
                        </div>
                    </div>
                </div>
            </div>

            {/* Endpoints */}
            <div className="grid grid-cols-1 gap-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe size={20} className="text-slate-500" />
                    نقاط الاتصال النشطة (Endpoints)
                </h3>

                {endpoints.map((ep, idx) => (
                    <div key={idx} className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest min-w-[60px] text-center border ${ep.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                {ep.method}
                            </span>
                            <div className="font-mono text-sm text-slate-300 dir-ltr text-left">
                                {ep.url}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end text-slate-500 text-xs font-medium">
                            <span>{ep.desc}</span>
                            <button onClick={() => handleCopy(ep.url)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <Copy size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Integration Tips */}
            <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-500 rounded-lg text-white">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-1">جاهز للأتمتة؟</h4>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                            يمكنك الآن ربط هذا النظام مباشرة مع n8n أو Make. فقط استخدم الـ Header التالي في طلباتك:
                        </p>
                        <div className="mt-3 bg-black/30 p-3 rounded-lg font-mono text-xs text-indigo-300 dir-ltr text-left inline-block border border-indigo-500/10">
                            x-api-key: [YOUR_KEY]
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APISettings;
