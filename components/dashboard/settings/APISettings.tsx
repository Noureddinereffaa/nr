import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, Terminal, Shield, Globe, Zap, Key, Save, Cpu, Image as ImageIcon } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const APISettings: React.FC = () => {
    const { siteData, updateAIConfig } = useData();

    // NR-OS Access Key State
    const [showSovereignKey, setShowSovereignKey] = useState(false);
    const [copied, setCopied] = useState(false);

    // AI Services State (Synced with siteData)
    const [aiKeys, setAiKeys] = useState({
        apiKey: siteData.aiConfig.apiKey || '',
        openaiKey: siteData.aiConfig.openaiKey || '',
        unsplashKey: siteData.aiConfig.unsplashKey || ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const displaySovereignKey = "sk_sovereign_" + "x8d9f2m4k5n7j2p1q3r (Use env var SOVEREIGN_API_KEY)";

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveAIKeys = async () => {
        setIsSaving(true);
        try {
            await updateAIConfig(aiKeys);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save AI keys", error);
        } finally {
            setIsSaving(false);
        }
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
                    <p className="text-slate-400 mt-2 text-sm">إدارة الاتصالات الخارجية وأتمتة محرك السيادة.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">System Operational</span>
                </div>
            </div>

            {/* 1. AI FORGE SERVICES (INTERNAL KEYS) */}
            <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Cpu className="text-amber-500" />
                        إعدادات خدمات الذكاء الاصطناعي (Internal Services)
                    </h3>
                    <button
                        onClick={handleSaveAIKeys}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${saveSuccess ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/20'}`}
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : saveSuccess ? (
                            <Check size={14} />
                        ) : (
                            <Save size={14} />
                        )}
                        {saveSuccess ? 'تم الحفظ' : 'حفظ الإعدادات'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gemini Key */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Zap size={12} className="text-amber-500" /> Google Gemini API Key
                        </label>
                        <input
                            type="password"
                            value={aiKeys.apiKey}
                            onChange={(e) => setAiKeys({ ...aiKeys, apiKey: e.target.value })}
                            placeholder="AI_FORGE_GEMINI_KEY..."
                            className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-slate-300 font-mono text-sm outline-none focus:border-amber-500/30 transition-all"
                        />
                    </div>

                    {/* Unsplash Key */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                            <ImageIcon size={12} className="text-blue-500" /> Unsplash Access Key
                        </label>
                        <input
                            type="password"
                            value={aiKeys.unsplashKey}
                            onChange={(e) => setAiKeys({ ...aiKeys, unsplashKey: e.target.value })}
                            placeholder="UNSPLASH_ACCESS_KEY..."
                            className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-slate-300 font-mono text-sm outline-none focus:border-blue-500/30 transition-all"
                        />
                    </div>

                    {/* OpenAI Key (Optional) */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Globe size={12} className="text-emerald-500" /> OpenAI Manager Key
                        </label>
                        <input
                            type="password"
                            value={aiKeys.openaiKey}
                            onChange={(e) => setAiKeys({ ...aiKeys, openaiKey: e.target.value })}
                            placeholder="OPENAI_API_KEY..."
                            className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-slate-300 font-mono text-sm outline-none focus:border-emerald-500/30 transition-all"
                        />
                    </div>
                </div>

                <p className="mt-6 text-[10px] text-slate-500 italic leading-relaxed">
                    * يتم استخدام هذه المفاتيح داخلياً لتشغيل محرك Forge وتوليد الصور والمحتوى الاستراتيجي. يتم تشفيرها وحفظها في قاعدة بياناتك الخاصة.
                </p>
            </div>

            {/* 2. API ACCESS (EXTERNAL ACCESS) */}
            <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

                <div className="flex items-start gap-6">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
                        <Key size={32} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">مفتاح الوصول الخارجي (Sovereign Outbound Key)</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-2xl leading-relaxed">
                            هذا المفتاح يمنح تطبيقات الطرف الثالث صلاحية الوصول إلى بيانات NR-OS. لا تشاركه مع أي شخص غير موثوق.
                        </p>

                        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5 w-full max-w-3xl">
                            <div className="flex-1 font-mono text-sm text-slate-300 px-4 dir-ltr text-left tracking-wider">
                                {showSovereignKey ? displaySovereignKey : 'sk_sovereign_••••••••••••••••••••••••••••••'}
                            </div>
                            <button
                                onClick={() => setShowSovereignKey(!showSovereignKey)}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                            >
                                {showSovereignKey ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button
                                onClick={() => handleCopy(displaySovereignKey)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-all ml-2"
                            >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                {copied ? 'تم النسخ' : 'نسخ'}
                            </button>
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
