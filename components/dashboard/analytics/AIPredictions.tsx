import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

const predictionData = [
    { month: 'Jul', actual: 35000, predicted: 34000 },
    { month: 'Aug', actual: 38000, predicted: 37500 },
    { month: 'Sep', actual: 42000, predicted: 41000 },
    { month: 'Oct', actual: null, predicted: 45000, isFuture: true },
    { month: 'Nov', actual: null, predicted: 49000, isFuture: true },
    { month: 'Dec', actual: null, predicted: 55000, isFuture: true },
];

const insights = [
    {
        id: 1,
        type: 'opportunity',
        text: 'ناءً على نمط النمو الحالي، من المتوقع أن تتجاوز الإيرادات حاجز 50 ألف دولار بحلول ديسمبر.',
        icon: TrendingUp,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10'
    },
    {
        id: 2,
        type: 'warning',
        text: 'معدل الاحتفاظ بالعملاء انخفض بنسبة 2% هذا الشهر. يُنصح بإطلاق حملة استبقاء.',
        icon: AlertTriangle,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10'
    },
    {
        id: 3,
        type: 'prediction',
        text: 'الطلب على خدمات "تطوير المواقع" يظهر اتجاهاً تصاعدياً قوياً للموسم القادم.',
        icon: Sparkles,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10'
    }
];

export const AIPredictions: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Sparkles className="text-indigo-400" size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white">توقعات الذكاء الاصطناعي</h3>
                    <p className="text-slate-400 text-sm">تحليل تنبؤي للأشهر الثلاثة القادمة</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Prediction Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50"></div>
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-white">توقعات الإيرادات</h4>
                        <span className="text-xs font-bold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                            Gemini AI Model
                        </span>
                    </div>

                    <div className="h-[300px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={predictionData}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                />
                                <ReferenceLine x="Sep" stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Now', position: 'top', fill: '#94a3b8' }} />
                                <Area
                                    type="monotone"
                                    dataKey="actual"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fill="url(#colorActual)"
                                    name="Actual Revenue"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="predicted"
                                    stroke="#6366f1"
                                    strokeDasharray="5 5"
                                    strokeWidth={3}
                                    fill="url(#colorPredicted)"
                                    name="AI Forecast"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Insights List */}
                <div className="space-y-4">
                    {insights.map((insight) => (
                        <div key={insight.id} className="bg-slate-900 border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl shrink-0 ${insight.bg} ${insight.color} group-hover:scale-110 transition-transform`}>
                                    <insight.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                        {insight.text}
                                    </p>
                                    <button className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
                                        عرض التفاصيل <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-center relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        <div className="relative z-10">
                            <Sparkles className="mx-auto text-white mb-3" size={28} />
                            <h4 className="font-black text-white text-lg mb-1">طلب تقرير معمق</h4>
                            <p className="text-white/80 text-sm">استخدم Gemini لتحليل بيانات منافسيك</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
