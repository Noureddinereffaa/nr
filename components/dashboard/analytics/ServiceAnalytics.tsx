import React from 'react';
import { BarChart, Activity, Users, Clock, TrendingUp, Calendar } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar
} from 'recharts';

const data = [
    { name: 'يناير', requests: 4, conversion: 2 },
    { name: 'فبراير', requests: 7, conversion: 3 },
    { name: 'مارس', requests: 5, conversion: 2 },
    { name: 'أبريل', requests: 12, conversion: 6 },
    { name: 'مايو', requests: 15, conversion: 8 },
    { name: 'يونيو', requests: 20, conversion: 12 },
];

export const ServiceAnalytics: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="الطلبات الكلية"
                    value="63"
                    change="+12%"
                    icon={Activity}
                    color="text-indigo-400"
                    bg="bg-indigo-500/10"
                />
                <StatCard
                    title="معدل التحويل"
                    value="48%"
                    change="+5%"
                    icon={TrendingUp}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                />
                <StatCard
                    title="العملاء النشطون"
                    value="24"
                    change="+2"
                    icon={Users}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    title="متوسط الاستجابة"
                    value="2.4h"
                    change="-15m"
                    icon={Clock}
                    color="text-amber-400"
                    bg="bg-amber-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart size={20} className="text-indigo-400" />
                        نمو الطلبات
                    </h3>
                    <div className="h-[300px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="requests" stroke="#6366f1" fillOpacity={1} fill="url(#colorRequests)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Calendar size={20} className="text-emerald-400" />
                        أداء الخدمات
                    </h3>
                    <div className="space-y-4">
                        <ServicePerformanceRow name="تطوير المواقع" value={45} color="bg-indigo-500" />
                        <ServicePerformanceRow name="التسويق الرقمي" value={30} color="bg-purple-500" />
                        <ServicePerformanceRow name="تصميم الهوية" value={15} color="bg-pink-500" />
                        <ServicePerformanceRow name="استشارات" value={10} color="bg-amber-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, change, icon: Icon, color, bg }: any) => (
    <div className="bg-slate-900 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${bg} ${color}`}>
                <Icon size={20} />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                {change}
            </span>
        </div>
        <h4 className="text-slate-400 text-sm font-medium mb-1">{title}</h4>
        <span className="text-2xl font-black text-white">{value}</span>
    </div>
);

const ServicePerformanceRow = ({ name, value, color }: any) => (
    <div>
        <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">{name}</span>
            <span className="text-white font-bold">{value}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);
