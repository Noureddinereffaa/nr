import React from 'react';
import { useData } from '../../../context/DataContext';
import { Brain, Briefcase } from 'lucide-react';

const AISettings: React.FC = () => {
    const { siteData, updateSiteData } = useData();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Brain className="text-indigo-400" size={24} />
                    إعدادات السيادة (Sovereign AI)
                </h3>
                <div className="bg-slate-900 border border-indigo-500/20 p-6 rounded-xl space-y-4 shadow-[0_0_30px_-10px_rgba(99,102,241,0.1)]">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <Briefcase size={24} />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h4 className="font-bold text-white text-lg">Hugging Face Token</h4>
                                <p className="text-xs text-slate-400 mt-1">
                                    مفتاح الوصول لنماذج الذكاء الاصطناعي المفتوحة (Llama 3, Mistral, FLUX).
                                    <a href="https://huggingface.co/settings/tokens" target="_blank" className="text-indigo-400 hover:underline mx-1">احصل عليه من هنا</a>
                                    (تأكد من صلاحيات Write).
                                </p>
                            </div>
                            <input
                                type="password"
                                value={(siteData as any).aiConfig?.huggingFaceKey || ''}
                                onChange={(e) => updateSiteData({
                                    aiConfig: { ...(siteData as any).aiConfig, huggingFaceKey: e.target.value }
                                })}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-indigo-500/50 transition-colors"
                                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-white/5 p-6 rounded-xl space-y-4">
                    <h4 className="font-bold text-slate-300">حالة النظام</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-slate-950 border border-white/5 flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-slate-500 font-bold mb-1">Text Engine</span>
                            <span className="text-emerald-400 font-mono text-sm">Llama 3 (70B)</span>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-950 border border-white/5 flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-slate-500 font-bold mb-1">Visual Engine</span>
                            <span className="text-purple-400 font-mono text-sm">FLUX / SDXL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AISettings;
