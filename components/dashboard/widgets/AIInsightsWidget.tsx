import React from 'react';
import { BrainCircuit, Sparkles, Activity } from 'lucide-react';

const AIInsightsWidget: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-slate-900/20 rounded-3xl p-1 relative overflow-hidden">
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl animate-in slide-in-from-right duration-500">
                    <Sparkles size={16} className="text-indigo-400" />
                    <div>
                        <div className="text-[10px] font-black text-white">زيادة في التفاعل بنسبة 45%</div>
                        <div className="text-[8px] text-indigo-300 font-bold italic">استراتيجية المحتوى الحالية ناجحة جداً</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in slide-in-from-right duration-700 delay-100">
                    <BrainCircuit size={16} className="text-emerald-400" />
                    <div>
                        <div className="text-[10px] font-black text-white">تحسين معدل الارتداد</div>
                        <div className="text-[8px] text-emerald-300 font-bold italic">تعديلات واجهة المستخدم الأخيرة أثمرت</div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/5 rounded-2xl opacity-60">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">تحليل السوق</span>
                        <Activity size={12} className="text-slate-600" />
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-[var(--accent-indigo)] h-full w-[70%]" />
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4 flex items-center justify-center">
                <div className="px-4 py-2 bg-[var(--accent-indigo)] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-[rgba(var(--accent-indigo-rgb),0.3)] animate-pulse">
                    جارِ التحليل المباشر...
                </div>
            </div>
        </div>
    );
};

export default AIInsightsWidget;
