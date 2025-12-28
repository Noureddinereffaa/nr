import React, { useState } from 'react';
import { useData } from '../../../../context/DataContext';
import { Save, Sparkles, BrainCircuit } from 'lucide-react';
import Input from '../../../ui/Input';
import Notification from '../../../ui/Notification';

const AIArchitect: React.FC = () => {
    const { siteData, updateAIConfig, updateProfile } = useData();
    const [config, setConfig] = useState(siteData.aiConfig || {} as any);
    const [profile, setProfile] = useState(siteData.profile || {} as any);
    const [isSaved, setIsSaved] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const handleSave = () => {
        updateAIConfig(config);
        updateProfile(profile);
        setIsSaved(true);
        setShowNotification(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        <BrainCircuit className="text-[var(--accent-indigo)]" />
                        مهندس النظام (AI Architect)
                    </h3>
                    <p className="text-slate-400 mt-1">قم بضبط إعدادات "العقل الرقمي" ليقوم بأتمتة أي مجال تريده.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[var(--accent-indigo)] hover:bg-[rgba(var(--accent-indigo-rgb),0.9)] text-white px-6 py-3 rounded-[var(--border-radius-elite)] font-black transition-all shadow-lg active:scale-95"
                >
                    <Save size={18} />
                    {isSaved ? 'تم الحفظ!' : 'حفظ الإعدادات'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Identity Section */}
                <div className="p-6 bg-slate-900 border border-white/5 rounded-[var(--border-radius-elite)] space-y-6">
                    <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">1</span>
                        الهوية والنطاق
                    </h4>

                    <Input
                        label="اسم النظام / الشخصية"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="مثال: د. أحمد العمراني"
                    />
                    <Input
                        label="اسم النظام بالإنجليزية (للرابط)"
                        value={profile.nameEn}
                        onChange={(e) => setProfile({ ...profile, nameEn: e.target.value })}
                        placeholder="Ex: Dr. Ahmed Omrani"
                    />
                    <Input
                        label="المسمى الوظيفي الرئيسي"
                        value={profile.primaryTitle}
                        onChange={(e) => setProfile({ ...profile, primaryTitle: e.target.value })}
                        placeholder="مثال: استشاري طب أسنان تجميلي"
                    />
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">نبذة مختصرة (Bio)</label>
                        <textarea
                            className="w-full bg-slate-950 border border-white/10 rounded-[var(--border-radius-elite)] px-4 py-3 text-white placeholder:text-slate-600 focus:border-[var(--accent-indigo)] outline-none transition-all text-right h-24 resize-none"
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            placeholder="وصف مختصر يظهر في الواجهة..."
                        />
                    </div>
                </div>

                {/* Brain Configuration */}
                <div className="p-6 bg-slate-900 border border-white/5 rounded-[var(--border-radius-elite)] space-y-6">
                    <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">2</span>
                        برمجة العقل الاستراتيجي
                    </h4>

                    <Input
                        label="المجال المستهدف (Niche)"
                        value={config.field}
                        onChange={(e) => setConfig({ ...config, field: e.target.value })}
                        placeholder="مثال: عيادة طبية، متجر ملابس، مطعم..."
                    />
                    <Input
                        label="المهمة الأساسية (Mission)"
                        value={config.mission}
                        onChange={(e) => setConfig({ ...config, mission: e.target.value })}
                        placeholder="مثال: زيادة عدد المواعيد، بيع المنتجات..."
                    />

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">نقاط الألم (Pain Points)</label>
                        <textarea
                            className="w-full bg-slate-950 border border-white/10 rounded-[var(--border-radius-elite)] px-4 py-3 text-white placeholder:text-slate-600 focus:border-[var(--accent-indigo)] outline-none transition-all text-right h-20 resize-none"
                            value={config.painPoints}
                            onChange={(e) => setConfig({ ...config, painPoints: e.target.value })}
                            placeholder="ما هي المشاكل التي يعاني منها عملاؤك؟"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">نقاط القوة (Selling Points)</label>
                        <textarea
                            className="w-full bg-slate-950 border border-white/10 rounded-[var(--border-radius-elite)] px-4 py-3 text-white placeholder:text-slate-600 focus:border-[var(--accent-indigo)] outline-none transition-all text-right h-20 resize-none"
                            value={config.sellingPoints}
                            onChange={(e) => setConfig({ ...config, sellingPoints: e.target.value })}
                            placeholder="لماذا يختارك العملاء؟"
                        />
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right mb-4">المزود المفضل (Primary Provider)</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['gemini', 'openai', 'anthropic'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setConfig({ ...config, preferredProvider: p })}
                                        className={`py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${config.preferredProvider === p
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                                            : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Google Gemini (Pro/Flash)"
                                value={config.apiKey || ''}
                                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                placeholder="sk-ant-..."
                                type="password"
                            />
                            <Input
                                label="OpenAI (GPT-4o/o1)"
                                value={config.openaiKey || ''}
                                onChange={(e) => setConfig({ ...config, openaiKey: e.target.value })}
                                placeholder="sk-..."
                                type="password"
                            />
                            <Input
                                label="Anthropic (Claude 3.5)"
                                value={config.anthropicKey || ''}
                                onChange={(e) => setConfig({ ...config, anthropicKey: e.target.value })}
                                placeholder="sk-ant-..."
                                type="password"
                            />
                        </div>

                        <p className="text-[9px] text-slate-500 mt-2 text-right leading-relaxed">
                            يستخدم النظام استراتيجية "الفشل الآمن" (Fail-Safe)؛ إذا فشل المزود الرئيسي، سيتم تجربة المزاودات الأخرى تلقائياً لضمان استمرارية العمل.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-[var(--accent-indigo)]/20 to-purple-900/20 border border-[var(--accent-indigo)]/20 rounded-[var(--border-radius-elite)] flex items-center gap-4">
                <Sparkles className="text-[var(--accent-indigo)] shrink-0" size={32} />
                <div>
                    <h5 className="font-bold text-[var(--accent-indigo)] mb-1">تحديث فوري</h5>
                    <p className="text-sm text-slate-400">أي تغيير تقوم به هنا سيتم تدريب المساعد الذكي عليه فوراً، وستتغير واجهة الموقع لتعكس هويتك الجديدة.</p>
                </div>
            </div>

            <Notification
                message="تم حفظ التغييرات وتحديث العقل الرقمي بنجاح!"
                isVisible={showNotification}
                onClose={() => setShowNotification(false)}
            />
        </div>
    );
};

export default AIArchitect;
