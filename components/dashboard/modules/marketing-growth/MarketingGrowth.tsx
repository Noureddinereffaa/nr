import React, { useState, useEffect } from 'react';
import { useSystem } from '../../../../context/SystemContext';
import { AIService } from '../../../../lib/ai-service';
import {
    Globe,
    Share2,
    Zap,
    ChevronRight,
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    Search,
    Brain,
    Rocket,
    Calendar,
    Target,
    CheckCircle2,
    Eye,
    Settings,
    Activity,
    LineChart,
    ArrowDownRight,
    Play,
    Pause,
    BarChart3,
    FileText
} from 'lucide-react';
import { CompetitorData, SocialPost } from '../../../../types';

const MarketingGrowth: React.FC = () => {
    const { socialPosts, integrations, updateIntegration, addSocialPost, aiConfig } = useSystem();
    const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isPlanning, setIsPlanning] = useState(false);
    const [viewMode, setViewMode] = useState<'intel' | 'calendar' | 'autopilot' | 'connections'>('intel');
    const [isSyncing, setIsSyncing] = useState(false);

    const autopilot = siteData.autopilot || {
        enabled: false,
        frequency: 'daily',
        platforms: ['linkedin', 'twitter', 'google'],
        strategyFocus: 'growth'
    };

    // Initial Analysis Mock or Real
    useEffect(() => {
        const loadIntel = async () => {
            setIsAnalyzing(true);
            const data = await AIService.analyzeCompetitors(siteData.aiConfig);
            setCompetitors(data);
            setIsAnalyzing(false);
        };
        loadIntel();
    }, [siteData.aiConfig]);

    const handleGenerateSocial = async () => {
        setIsPlanning(true);
        const newPosts = await AIService.generateSocialSchedule(siteData.aiConfig);
        for (const post of newPosts) {
            await addSocialPost(post);
        }
        setIsPlanning(false);
    };

    const handleManualSync = async () => {
        setIsSyncing(true);
        try {
            // Import dynamically to avoid circular dependencies if any, 
            // but here we just use it directly since it's a lib
            const { AutomationEngine } = await import('../../../../lib/automation-engine');
            await AutomationEngine.run(siteData, updateSiteData, addArticle, addSocialPost);
        } catch (error) {
            console.error("Manual Sync Failed", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const getDailyProgress = () => {
        const today = new Date().toISOString().split('T')[0];
        const publishedToday = siteData.articles.filter(a => a.date?.startsWith(today)).length;
        const max = autopilot.maxDailyPosts || 3;
        return { count: publishedToday, max, percent: Math.min((publishedToday / max) * 100, 100) };
    };

    const progress = getDailyProgress();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="relative p-10 bg-slate-900/50 backdrop-blur-3xl border border-white/5 rounded-[var(--border-radius-elite)] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-indigo)]/10 via-transparent to-purple-500/10 opacity-50"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="max-w-2xl text-center md:text-right">
                        <div className="inline-flex items-center gap-2 bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-[var(--accent-indigo)]/20">
                            <Brain size={12} />
                            محرك النمو الذكي (v1.0)
                        </div>
                        <h3 className="text-4xl font-black text-white mb-4 leading-tight">سيطر على السوق بذكاء <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--accent-indigo)] to-purple-400">اصطناعي سيادي</span></h3>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">حلل المنافسين، خطط للمحتوى، واستحوذ على الكلمات المفتاحية الأكثر ربحية تلقائياً.</p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => setViewMode('autopilot')}
                                className="bg-white text-slate-900 px-8 py-4 rounded-[var(--border-radius-elite)] font-black text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-2xl"
                            >
                                <Zap size={18} className="text-[var(--accent-indigo)]" />
                                إعداد الطيار الآلي (Autopilot)
                            </button>
                            <button
                                onClick={handleGenerateSocial}
                                disabled={isPlanning}
                                className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-sm border border-white/5 hover:bg-slate-700 transition-all flex items-center gap-2"
                            >
                                <Rocket size={16} />
                                {isPlanning ? 'جاري التوليد...' : 'توليد خطة فورية'}
                            </button>
                        </div>
                    </div>
                    <div className="w-64 h-64 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] animate-pulse"></div>
                        <Search className="text-indigo-500 relative z-10 animate-bounce" size={80} strokeWidth={1} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Competitor Intelligence */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[var(--border-radius-elite)] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h4 className="text-xl font-black text-white flex items-center gap-3">
                                <Globe className="text-[var(--accent-indigo)]" size={20} />
                                استخبارات المنافسين
                            </h4>
                            <p className="text-slate-500 text-xs mt-1">تتبع أداء أقوى المنافسين في قطاع {siteData.aiConfig.field}</p>
                        </div>
                        <button className="p-2 bg-slate-800 rounded-xl hover:bg-[var(--accent-indigo)] transition-all text-white"><ChevronRight size={18} /></button>
                    </div>

                    <div className="space-y-4">
                        {isAnalyzing ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 border-4 border-[var(--accent-indigo)]/20 border-t-[var(--accent-indigo)] rounded-full animate-spin"></div>
                                <p className="text-slate-500 text-xs animate-pulse">جاري تحليل البيانات العميقة من الويب...</p>
                            </div>
                        ) : (
                            competitors.map(comp => (
                                <div key={comp.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-[var(--border-radius-elite)] hover:border-[var(--accent-indigo)]/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h5 className="font-black text-white text-lg">{comp.name}</h5>
                                            <p className="text-slate-500 text-xs font-mono">{comp.website}</p>
                                        </div>
                                        <div className="bg-[var(--accent-indigo)]/10 px-3 py-1 rounded-full text-[var(--accent-indigo)] text-[10px] font-black border border-[var(--accent-indigo)]/10">
                                            DA: {comp.domainAuthority}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                                            <p className="text-red-400/60 font-black mb-1">نقطة ضعف</p>
                                            <p className="text-slate-400 leading-relaxed">{comp.weakness}</p>
                                        </div>
                                        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                            <p className="text-emerald-400/60 font-black mb-1">نقطة قوة</p>
                                            <p className="text-slate-400 leading-relaxed">{comp.strength}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {comp.topKeywords.slice(0, 3).map(kw => (
                                            <span key={kw} className="text-[10px] text-slate-500 font-bold">#{kw}</span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Social Media Pulse & Connections Hub */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[var(--border-radius-elite)] p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h4 className="text-xl font-black text-white flex items-center gap-3">
                                <Share2 className="text-purple-400" size={20} />
                                نبض السوشيال ميديا
                            </h4>
                            <p className="text-slate-500 text-xs mt-1">
                                {viewMode === 'connections' ? 'إدارة ربط الحسابات وتصاريح النشر' : 'المحتوى المجدول للسيطرة على المنصات الرقمية'}
                            </p>
                        </div>
                        <div className="flex bg-slate-800 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode('intel')}
                                className={`px-3 py-1 text-[9px] font-black rounded-lg transition-all ${viewMode === 'intel' ? 'bg-[var(--accent-indigo)] text-white' : 'text-slate-500 hover:text-white'}`}
                            >
                                الذكاء اللحظي
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`px-3 py-1 text-[9px] font-black rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-[var(--accent-indigo)] text-white' : 'text-slate-500 hover:text-white'}`}
                            >
                                الأجندة
                            </button>
                            <button
                                onClick={() => setViewMode('autopilot')}
                                className={`px-3 py-1 text-[9px] font-black rounded-lg transition-all ${viewMode === 'autopilot' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                الطيار الآلي
                            </button>
                            <button
                                onClick={() => setViewMode('connections')}
                                className={`px-3 py-1 text-[9px] font-black rounded-lg transition-all ${viewMode === 'connections' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                الربط (Connections)
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] no-scrollbar pr-2">
                        {viewMode === 'connections' ? (
                            <div className="grid grid-cols-1 gap-4">
                                {(siteData.integrations || []).map((integration) => {
                                    const Icon = integration.id === 'google_business' ? Search : integration.id === 'linkedin' ? Linkedin : integration.id === 'twitter' ? Twitter : integration.id === 'facebook' ? Facebook : Instagram;
                                    const isConnected = integration.status === 'connected';

                                    return (
                                        <div key={integration.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${isConnected ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/30 border-white/5'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${isConnected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-400'}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-bold text-white mb-1">{integration.name}</h5>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                                                        <span className="text-[10px] text-slate-500 font-mono uppercase">{isConnected ? 'Connected' : 'Disconnected'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {isConnected ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-[10px] text-slate-500">Last Sync</p>
                                                        <p className="text-[10px] font-mono text-emerald-400">Just now</p>
                                                    </div>
                                                    <button
                                                        onClick={() => updateIntegration(integration.id, { status: 'disconnected' })}
                                                        className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-xs font-bold transition-all"
                                                    >
                                                        Disconect
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        // Simulate connection flow
                                                        const apiKey = prompt(`Enter API Key/Token for ${integration.name}:`);
                                                        if (apiKey) {
                                                            updateIntegration(integration.id, { status: 'connected', credentials: { apiKey } });
                                                            // In real app, we would call updateIntegration(integration.id, { ... }) to sync with DB
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-white text-slate-900 hover:scale-105 rounded-lg text-xs font-black transition-all shadow-lg flex items-center gap-2"
                                                >
                                                    <Zap size={14} className="text-emerald-600" />
                                                    Connect Now
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : viewMode === 'autopilot' ? (
                            <div className="space-y-6">
                                {/* Autopilot Meta Card */}
                                <div className={`p-6 rounded-[var(--border-radius-elite)] border transition-all ${autopilot.enabled ? 'bg-[var(--accent-indigo)]/10 border-[var(--accent-indigo)]/30' : 'bg-slate-950 border-white/5 opacity-80'}`}>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-[var(--border-radius-elite)] ${autopilot.enabled ? 'bg-[var(--accent-indigo)] text-white shadow-xl shadow-[var(--accent-indigo)]/20' : 'bg-slate-800 text-slate-500'}`}>
                                                {autopilot.enabled ? <Activity className="animate-pulse" size={24} /> : <Pause size={24} />}
                                            </div>
                                            <div>
                                                <h5 className="font-black text-white text-lg">نظام النمو الآلي</h5>
                                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{autopilot.enabled ? 'Active Strategy Running' : 'System Standby'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateSiteData({ autopilot: { ...autopilot, enabled: !autopilot.enabled } })}
                                            className={`px-6 py-2 rounded-xl font-black text-xs transition-all ${autopilot.enabled ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'}`}
                                        >
                                            {autopilot.enabled ? 'إيقاف مؤقت' : 'تفعيل الآن'}
                                        </button>
                                    </div>

                                    {/* Config Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">تكرار المحتوى</label>
                                            <select
                                                value={autopilot.frequency}
                                                onChange={(e) => updateSiteData({ autopilot: { ...autopilot, frequency: e.target.value as any } })}
                                                className="bg-transparent text-white font-bold text-sm outline-none w-full"
                                            >
                                                <option value="daily" className="bg-slate-900">يومياً (مكثف)</option>
                                                <option value="weekly" className="bg-slate-900">أسبوعياً (متوازن)</option>
                                            </select>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">حد المقالات اليومي</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={autopilot.maxDailyPosts || 3}
                                                onChange={(e) => updateSiteData({ autopilot: { ...autopilot, maxDailyPosts: parseInt(e.target.value) } })}
                                                className="bg-transparent text-white font-bold text-sm outline-none w-full"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleManualSync}
                                        disabled={isSyncing || !autopilot.enabled}
                                        className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {isSyncing ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin"></div>
                                                جاري التشغيل...
                                            </>
                                        ) : (
                                            <>
                                                <Play size={14} fill="currentColor" />
                                                تشغيل الدورة اليدوية الآن
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Daily Goal Progress */}
                                <div className="p-6 bg-slate-900 rounded-[var(--border-radius-elite)] border border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h6 className="text-xs font-black text-white flex items-center gap-2">
                                            <Target size={14} className="text-emerald-500" />
                                            هدف اليوم: 3 مقالات استراتيجية
                                        </h6>
                                        <span className="text-[10px] font-mono text-slate-500">{progress.count} / {progress.max}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                                            style={{ width: `${progress.percent}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[9px] text-slate-500 text-center italic">يتم النشر تلقائياً وتوزيع المحتوى على المنصات المربوطة</p>
                                </div>

                                {/* Platform Selection */}
                                <div className="p-6 bg-slate-900 rounded-[var(--border-radius-elite)] border border-white/5">
                                    <h6 className="text-xs font-black text-white mb-4 flex items-center gap-2">
                                        <Settings size={14} className="text-[var(--accent-indigo)]" />
                                        قنوات التوزيع المفعلة
                                    </h6>
                                    <div className="flex flex-wrap gap-2">
                                        {['linkedin', 'twitter', 'google', 'facebook', 'instagram'].map(p => {
                                            const isActive = autopilot.platforms.includes(p as any);
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => {
                                                        const newP = isActive
                                                            ? autopilot.platforms.filter(x => x !== p)
                                                            : [...autopilot.platforms, p as any];
                                                        updateSiteData({ autopilot: { ...autopilot, platforms: newP } });
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${isActive ? 'bg-[var(--accent-indigo)] text-white border-[var(--accent-indigo)]' : 'bg-slate-950 text-slate-600 border-white/5'}`}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Growth Projection Tooltip */}
                                <div className="p-6 bg-gradient-to-br from-[var(--accent-indigo)]/10 to-transparent rounded-[var(--border-radius-elite)] border border-[var(--accent-indigo)]/20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <LineChart className="text-[var(--accent-indigo)]" size={20} />
                                        <span className="text-sm font-black text-white">النتائج المتوقعة (30 يوم)</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-500 font-bold">زيادة الزيارات</span>
                                            <span className="text-emerald-400 font-black">+240%</span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-3/4"></div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-500 font-bold">بناء السلطة (Domain Authority)</span>
                                            <span className="text-[var(--accent-indigo)] font-black">+12 PTS</span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-[var(--accent-indigo)] w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : viewMode === 'intel' ? (
                            (siteData.socialPosts || []).length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                                    <Zap className="text-slate-700 mb-4" size={40} />
                                    <p className="text-slate-500 text-sm max-w-xs">لا يوجد محتوى مجدول حالياً. اضغط على "توليد خطة" للبدء.</p>
                                </div>
                            ) : (
                                (siteData.socialPosts || []).slice(0, 8).map(post => {
                                    const Icon = post.platform === 'linkedin' ? Linkedin : post.platform === 'twitter' ? Twitter : post.platform === 'facebook' ? Facebook : Instagram;
                                    return (
                                        <div key={post.id} className="p-4 bg-slate-800/20 border border-white/5 rounded-2xl flex gap-4 hover:bg-white/[0.02] transition-all group">
                                            <div className={`p-3 rounded-xl h-fit border border-white/5 ${post.platform === 'linkedin' ? 'bg-[#0077b5]/10 text-[#0077b5]' :
                                                post.platform === 'twitter' ? 'bg-[#1da1f2]/10 text-[#1da1f2]' :
                                                    post.platform === 'facebook' ? 'bg-[#4267b2]/10 text-[#4267b2]' :
                                                        'bg-gradient-to-tr from-orange-500/10 to-purple-500/10 text-pink-500'
                                                }`}>
                                                <Icon size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[10px] font-black text-slate-500">{new Date(post.scheduledDate).toLocaleDateString('ar-DZ')}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] text-[8px] font-black px-2 py-0.5 rounded uppercase border border-[var(--accent-indigo)]/20">Active</span>
                                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                                    </div>
                                                </div>
                                                <p className="text-slate-300 text-xs leading-relaxed line-clamp-2 mb-3">{post.content}</p>
                                                {post.image && (
                                                    <div className="relative h-24 rounded-xl overflow-hidden border border-white/5">
                                                        <img src={post.image} alt="AI Content" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                                                        <span className="absolute bottom-2 right-2 text-[8px] font-black text-white/50 uppercase tracking-widest flex items-center gap-1">
                                                            <Eye size={10} /> Preview
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {(siteData.socialPosts || []).slice(0, 30).map((post, idx) => (
                                    <div key={post.id} className="p-3 bg-slate-900 border border-white/5 rounded-xl flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <div className="w-2 h-2 rounded-full bg-[var(--accent-indigo)]"></div>
                                            <span className="text-[8px] text-slate-600 font-black">Day {idx + 1}</span>
                                        </div>
                                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div style={{ width: '100%' }} className="h-full bg-[var(--accent-indigo)]/50"></div>
                                        </div>
                                        <span className="text-[8px] text-slate-400 font-bold truncate">{post.platform} - {post.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Market Trend Analyzer (Phase 14 Bottom) */}
            <div className="bg-gradient-to-l from-indigo-900/40 to-slate-900 border border-[var(--accent-indigo)]/20 p-8 rounded-[var(--border-radius-elite)] flex flex-col md:flex-row items-center gap-8">
                <div className="p-6 bg-[var(--accent-indigo)]/10 rounded-[var(--border-radius-elite)] text-[var(--accent-indigo)] border border-[var(--accent-indigo)]/10">
                    <BarChart3 size={40} />
                </div>
                <div className="flex-1 text-center md:text-right">
                    <h4 className="text-xl font-black text-white mb-2 underline decoration-[var(--accent-indigo)] underline-offset-8">تحليل اتجاهات النيش العميق</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        بناءً على الكلمات المفتاحية <strong>{siteData.aiConfig.field}</strong> و <strong>{siteData.aiConfig.field.split(' ')[0]}</strong>، هناك ارتفاع في الطلب على تقنيات الأتمتة بنسبة 24% هذا الشهر. نوصي بتركيز المحتوى حول "الكفاءة التشغيلية" في الأسبوع القادم.
                    </p>
                </div>
                <button
                    onClick={async () => {
                        const topic = `الدليل الشامل للسيادة الرقمية في قطاع ${siteData.aiConfig.field} لعام 2025`;
                        setIsPlanning(true);
                        const article = await AIService.generateArticle(topic, siteData.aiConfig, true);
                        await addArticle(article);
                        setIsPlanning(false);
                    }}
                    disabled={isPlanning}
                    className="bg-[var(--accent-indigo)] hover:bg-[rgba(var(--accent-indigo-rgb),0.9)] text-white px-8 py-3 rounded-[var(--border-radius-elite)] font-black text-xs transition-all shrink-0 flex items-center gap-2"
                >
                    <FileText size={14} />
                    {isPlanning ? 'جاري التوليد...' : 'توليد مقال Pillar'}
                </button>
            </div>
        </div>
    );
};

export default MarketingGrowth;
