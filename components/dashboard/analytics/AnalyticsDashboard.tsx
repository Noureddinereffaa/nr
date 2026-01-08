import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Users, Briefcase, Calendar, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { AIPredictions } from './AIPredictions';

interface AnalyticsData {
    totalRevenue: number;
    revenueGrowth: number;
    totalClients: number;
    clientGrowth: number;
    activeProjects: number;
    completedProjects: number;
    revenueData: any[];
    projectStatusData: any[];
}

const AnalyticsDashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            // Mock data for initial visualization if DB is empty
            // In production, replace with real aggregations
            const mockData = {
                totalRevenue: 125000,
                revenueGrowth: 15,
                totalClients: 48,
                clientGrowth: 8,
                activeProjects: 12,
                completedProjects: 86,
                revenueData: [
                    { name: 'Jan', value: 12000 },
                    { name: 'Feb', value: 19000 },
                    { name: 'Mar', value: 15000 },
                    { name: 'Apr', value: 25000 },
                    { name: 'May', value: 32000 },
                    { name: 'Jun', value: 28000 },
                ],
                projectStatusData: [
                    { name: 'Completed', value: 86, color: '#10b981' },
                    { name: 'Active', value: 12, color: '#6366f1' },
                    { name: 'Pending', value: 5, color: '#f59e0b' },
                ]
            };

            // Simulator: Simulate fetch delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAnalytics(mockData);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    const handleExport = () => {
        if (!analytics) return;

        const csvContent = "data:text/csv;charset=utf-8,"
            + "Category,Value\n"
            + `Total Revenue,${analytics.totalRevenue}\n`
            + `Total Clients,${analytics.totalClients}\n`
            + `Active Projects,${analytics.activeProjects}\n`
            + `Completed Projects,${analytics.completedProjects}\n`
            + "\nMonth,Revenue\n"
            + analytics.revenueData.map(r => `${r.name},${r.value}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "business_analytics_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-fade-in p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-white">لوحة المعلومات المتقدمة</h2>
                    <p className="text-slate-400">نظرة شاملة على أداء الأعمال</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <Download size={18} />
                    <span>تصدير التقرير (CSV)</span>
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="إجمالي الإيرادات"
                    value={`$${analytics?.totalRevenue.toLocaleString()}`}
                    change={`+${analytics?.revenueGrowth}%`}
                    icon={DollarSign}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                />
                <KPICard
                    title="العملاء"
                    value={analytics?.totalClients}
                    change={`+${analytics?.clientGrowth}%`}
                    icon={Users}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                />
                <KPICard
                    title="المشاريع النشطة"
                    value={analytics?.activeProjects}
                    change="Active"
                    icon={Briefcase}
                    color="text-indigo-400"
                    bg="bg-indigo-500/10"
                />
                <KPICard
                    title="المشاريع المكتملة"
                    value={analytics?.completedProjects}
                    change="All time"
                    icon={TrendingUp}
                    color="text-amber-400"
                    bg="bg-amber-500/10"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">تحليل الإيرادات</h3>
                    <div className="h-[300px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Project Distribution */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">توزيع المشاريع</h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics?.projectStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analytics?.projectStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="text-3xl font-black text-white">{analytics?.completedProjects}</span>
                                <span className="block text-xs text-slate-500">مكتمل</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 mt-4">
                        {analytics?.projectStatusData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-slate-300">{item.name}</span>
                                </div>
                                <span className="font-bold text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Predictions Section */}
            <AIPredictions />
        </div>
    );
};

const KPICard = ({ title, value, change, icon: Icon, color, bg }: any) => (
    <div className="bg-slate-900 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            {change && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-500/10'}`}>
                    {change}
                </span>
            )}
        </div>
        <div>
            <span className="text-slate-400 text-sm font-medium block mb-1">{title}</span>
            <span className="text-3xl font-black text-white">{value}</span>
        </div>
    </div>
);

export default AnalyticsDashboard;
