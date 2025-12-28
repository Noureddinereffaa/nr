import React, { useState, useEffect } from 'react';
import { useData } from '../../../../context/DataContext';
import { useAI } from '../../../../context/AIContext';
import {
    Save, Sparkles, BrainCircuit, Activity, ShieldCheck,
    Zap, Cpu, Globe, AlertCircle, CheckCircle2,
    Layers, Users, Settings2, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DigitalCouncil } from '../../../../lib/ai-service';

const AIArchitect: React.FC = () => {
    const { siteData, updateAIConfig, updateProfile } = useData();
    const { service } = useAI();
    const [config, setConfig] = useState(siteData.aiConfig || {} as any);
    const [profile, setProfile] = useState(siteData.profile || {} as any);
    const [isSaving, setIsSaving] = useState(false);
    const [health, setHealth] = useState<Record<string, 'idle' | 'testing' | 'ok' | 'fail'>>({
        gemini: 'idle',
        huggingface: 'idle',
        anthropic: 'idle',
        openai: 'idle'
    });

    const [activeSection, setActiveSection] = useState<'brains' | 'council' | 'orchestration'>('brains');

    const handleSave = async () => {
        setIsSaving(true);
        updateAIConfig(config);
        updateProfile(profile);
        setTimeout(() => setIsSaving(false), 1500);
    };

    const testHealth = async (provider: string) => {
        setHealth(prev => ({ ...prev, [provider]: 'testing' }));
        try {
            const isOk = await service.testConnection(provider, config);
            setHealth(prev => ({ ...prev, [provider]: isOk ? 'ok' : 'fail' }));
        } catch (e) {
            setHealth(prev => ({ ...prev, [provider]: 'fail' }));
        }
    };

    const agents = [
        { id: 'Analyst', label: 'المحلل الاستراتيجي', desc: 'يقوم بتقييم العملاء المحتملين وتحليل المنافسين.', color: 'blue' },
        { id: 'Strategist', label: 'خبير التخطيط', desc: 'يولد خطط المحتوى وجداول التواصل الاجتماعي.', color: 'purple' },
        { id: 'Creator', label: 'صانع المحتوى', desc: 'يكتب المقالات السيادية والمنشورات التسويقية.', color: 'emerald' },
        { id: 'SEOAnalyst', label: 'خبير الـ SEO', desc: 'يحلل المقالات للتأكد من تصدر نتائج البحث.', color: 'orange' },
        { id: 'SchemaEngineer', label: 'مهندس البيانات', desc: 'يولد وسوم Schema و JSON-LD التقنية.', color: 'cyan' },
    ];

    const toggleAgent = (id: string) => {
        const current = config.enabledAgents || agents.map(a => a.id);
        const next = current.includes(id)
            ? current.filter((a: string) => a !== id)
            : [...current, id];
        setConfig({ ...config, enabledAgents: next });
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Sovereign Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                            <BrainCircuit size={32} />
                        </div>
                        مركز القيادة العصبية
                    </h2>
                    <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Neural Orchestration Layer Active
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-3 bg-white text-slate-950 px-10 py-4 rounded-2xl font-black transition-all shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? <Activity className="animate-spin" /> : <Save size={20} />}
                    {isSaving ? 'يتم المزامنة...' : 'حفظ التغييرات السيادية'}
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-900/50 p-2 rounded-[2rem] border border-white/5 w-fit">
                {[
                    { id: 'brains', label: 'المحركات العصبية', icon: Cpu },
                    { id: 'council', label: 'المجلس الرقمي', icon: Users },
                    { id: 'orchestration', label: 'قواعد العمل', icon: Terminal },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id as any)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-xs transition-all ${activeSection === tab.id
                                ? 'bg-indigo-600 text-white shadow-xl'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeSection === 'brains' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {/* Provider Keys */}
                        <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 space-y-8">
                            <h4 className="text-xl font-black text-white flex items-center gap-3">
                                <Zap className="text-yellow-400" />
                                ربط المحركات (API Matrix)
                            </h4>

                            {[
                                { id: 'apiKey', label: 'Google Gemini (Standard)', key: 'gemini', provider: 'gemini' },
                                { id: 'huggingFaceKey', label: 'Hugging Face (Sovereign)', key: 'huggingface', provider: 'huggingface' },
                                { id: 'anthropicKey', label: 'Anthropic Claude (High IQ)', key: 'anthropic', provider: 'anthropic' },
                                { id: 'openaiKey', label: 'OpenAI (Power)', key: 'openai', provider: 'openai' },
                            ].map((p) => (
                                <div key={p.id} className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{p.label}</label>
                                        <div className="flex items-center gap-2">
                                            {health[p.key] === 'testing' && <Activity size={14} className="text-indigo-400 animate-spin" />}
                                            {health[p.key] === 'ok' && <CheckCircle2 size={14} className="text-emerald-400" />}
                                            {health[p.key] === 'fail' && <AlertCircle size={14} className="text-red-400" />}
                                            <button
                                                onClick={() => testHealth(p.provider)}
                                                className="text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-tighter"
                                            >
                                                Test Connectivity
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        type="password"
                                        value={config[p.id] || ''}
                                        onChange={(e) => setConfig({ ...config, [p.id]: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-mono text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800"
                                        placeholder="••••••••••••••••••••••••••••"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Intelligence Orchestration */}
                        <div className="space-y-8">
                            <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 space-y-6">
                                <h4 className="text-xl font-black text-white flex items-center gap-3">
                                    <Settings2 className="text-indigo-400" />
                                    تفضيلات المحرك
                                </h4>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block pr-2">المزود الافتراضي (Current Brain)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['gemini', 'huggingface', 'anthropic', 'openai'].map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setConfig({ ...config, preferredProvider: p })}
                                                className={`py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${config.preferredProvider === p
                                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl scale-[1.02]'
                                                        : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl flex items-start gap-4">
                                    <ShieldCheck className="text-indigo-400 mt-1 shrink-0" />
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        يستخدم "نورالدين رفعة OS" استراتيجية <span className="text-indigo-400 font-bold">Fail-Safe</span> المتطورة. في حال فشل المزود الرئيسي، سيقوم النظام تلقائياً بالتصعيد للمزود البديل لضمان استمرارية الخدمات الذكية للعملاء.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeSection === 'council' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-slate-900 border border-white/5 rounded-[3rem] p-10"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div className="text-right">
                                <h4 className="text-2xl font-black text-white mb-2">المجلس الرقمي (Digital Council)</h4>
                                <p className="text-slate-400 text-sm">حدد الوكلاء الأذكياء الذين ترغب في تفعيلهم لقيادة منظومتك الرقمية.</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                                <Users size={32} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agents.map((agent) => {
                                const isEnabled = (config.enabledAgents || agents.map(a => a.id)).includes(agent.id);
                                return (
                                    <div
                                        key={agent.id}
                                        onClick={() => toggleAgent(agent.id)}
                                        className={`group cursor-pointer p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-end text-right ${isEnabled
                                                ? 'bg-indigo-600/10 border-indigo-500/50 shadow-2xl'
                                                : 'bg-slate-950/50 border-white/5 opacity-50 gray-scale hover:opacity-100 hover:border-white/20'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${isEnabled ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-slate-900 text-slate-500'
                                            }`}>
                                            {agent.id === 'Analyst' && <Activity size={24} />}
                                            {agent.id === 'Strategist' && <Layers size={24} />}
                                            {agent.id === 'Creator' && <Zap size={24} />}
                                            {agent.id === 'SEOAnalyst' && <Globe size={24} />}
                                            {agent.id === 'SchemaEngineer' && <Terminal size={24} />}
                                        </div>
                                        <h5 className="font-black text-white text-lg mb-2">{agent.label}</h5>
                                        <p className="text-slate-400 text-xs leading-relaxed mb-8 flex-1">{agent.desc}</p>

                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isEnabled ? 'text-indigo-400' : 'text-slate-600'}`}>
                                                {isEnabled ? 'Active Agent' : 'Disabled'}
                                            </span>
                                            <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-indigo-500 animate-pulse' : 'bg-slate-800'}`}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {activeSection === 'orchestration' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 space-y-8">
                            <h4 className="text-xl font-black text-white flex items-center gap-3">
                                <Globe className="text-blue-400" />
                                سياق النطاق (Strategic Context)
                            </h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pr-2">المجال المستهدف (The Niche)</label>
                                    <input
                                        value={config.field}
                                        onChange={(e) => setConfig({ ...config, field: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white text-right outline-none focus:border-blue-500 transition-all font-bold"
                                        placeholder="مثال: هندسة البرمجيات الاستراتيجية"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pr-2">المهمة الكبرى (The Mission)</label>
                                    <textarea
                                        value={config.mission}
                                        onChange={(e) => setConfig({ ...config, mission: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white text-right outline-none focus:border-blue-500 transition-all font-medium h-32 resize-none"
                                        placeholder="وصف المهمة التي يسعى النظام لتحقيقها..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 space-y-8">
                            <h4 className="text-xl font-black text-white flex items-center gap-3">
                                <Terminal className="text-emerald-400" />
                                لغة الشخصية (Persona Engineering)
                            </h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pr-2">نبرة الصوت (Tone of Voice)</label>
                                    <input
                                        value={config.tone}
                                        onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white text-right outline-none focus:border-emerald-500 transition-all font-bold"
                                        placeholder="مثال: رصينة، استراتيجية، هيبة معرفية"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pr-2">رسالة الـ CTA المستهدفة</label>
                                    <input
                                        value={config.ctaAction}
                                        onChange={(e) => setConfig({ ...config, ctaAction: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white text-right outline-none focus:border-emerald-500 transition-all font-bold"
                                        placeholder="مثال: حجز استشارة تقنية فورية"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status Bar */}
            <div className="fixed bottom-10 right-10 left-32 md:left-80 z-50 pointer-events-none px-10">
                <div className="max-w-7xl mx-auto flex justify-end">
                    <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-6 shadow-2xl">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global Brain Sync: OK</span>
                        </div>
                        <div className="w-px h-4 bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <Activity size={14} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{config.preferredProvider} Primary</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIArchitect;
