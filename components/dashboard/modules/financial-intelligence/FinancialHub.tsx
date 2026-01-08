import React, { useState, useMemo } from 'react';
import { useSystem } from '../../../../context/SystemContext';
import { useBusiness } from '../../../../context/BusinessContext';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Wallet,
    PieChart,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter,
    Download
} from 'lucide-react';
import { useUI } from '../../../../context/UIContext';
import ExpenseForm from '../../forms/ExpenseForm';

const FinancialHub: React.FC = () => {
    const { siteData } = useSystem();
    const { invoices, expenses, addExpense, deleteExpense } = useBusiness();
    const { isShieldMode, mask } = useUI();
    const [isAddingExpense, setIsAddingExpense] = useState(false);
    const [expenseFilter, setExpenseFilter] = useState('all');

    // Calculation Logic
    const stats = useMemo(() => {
        const totalIncome = invoices
            .filter(i => i.status === 'paid')
            .reduce((sum, i) => sum + i.total, 0);

        const totalExpenses = (expenses || []).reduce((sum, e) => sum + e.amount, 0);
        const profit = totalIncome - totalExpenses;
        const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

        return { totalIncome, totalExpenses, profit, profitMargin };
    }, [invoices, expenses]);

    const incomeByCurrency = useMemo(() => {
        const currencies = { DZD: 0, EUR: 0, USD: 0 };
        invoices
            .filter(i => i.status === 'paid')
            .forEach(i => {
                if (i.currency in currencies) {
                    currencies[i.currency as keyof typeof currencies] += i.total;
                }
            });
        return currencies;
    }, [siteData.invoices]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div dir="rtl">
                    <h3 className="text-2xl font-black text-white tracking-tight">المركز المالي الاستراتيجي</h3>
                    <p className="text-slate-400 text-sm italic">Financial Intelligence & Profit Control</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-slate-900 border border-white/5 text-slate-300 px-4 py-2 rounded-[var(--border-radius-elite)] text-xs font-bold hover:bg-slate-800 transition-all">
                        <Download size={14} />
                        تصدير التقارير
                    </button>
                    <button
                        onClick={() => setIsAddingExpense(true)}
                        className="flex items-center gap-2 bg-[var(--accent-indigo)] hover:bg-[rgba(var(--accent-indigo-rgb),0.9)] text-white px-4 py-2 rounded-[var(--border-radius-elite)] text-xs font-bold transition-all shadow-lg shadow-[rgba(var(--accent-indigo-rgb),0.2)]"
                    >
                        <Plus size={14} />
                        تسجيل مصاريف
                    </button>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-[var(--border-radius-elite)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-4" dir="rtl">
                        <div className="p-3 bg-emerald-500/10 rounded-[var(--border-radius-elite)] text-emerald-400">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">إجمالي الدخل</p>
                        <h4 className="text-2xl font-black text-white">{mask(stats.totalIncome.toLocaleString(), 'currency')} <span className="text-xs text-slate-500 italic">DZD</span></h4>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-[var(--border-radius-elite)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-red-500/20 transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-4" dir="rtl">
                        <div className="p-3 bg-red-500/10 rounded-[var(--border-radius-elite)] text-red-400">
                            <TrendingDown size={24} />
                        </div>
                        <span className="text-[10px] font-black bg-red-500/10 text-red-400 px-2 py-1 rounded-full">-5%</span>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">إجمالي المصاريف</p>
                        <h4 className="text-2xl font-black text-white">{mask(stats.totalExpenses.toLocaleString(), 'currency')} <span className="text-xs text-slate-500 italic">DZD</span></h4>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-[var(--border-radius-elite)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[rgba(var(--accent-indigo-rgb),0.1)] blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-[rgba(var(--accent-indigo-rgb),0.2)] transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-4" dir="rtl">
                        <div className="p-3 bg-[rgba(var(--accent-indigo-rgb),0.1)] rounded-[var(--border-radius-elite)] text-[var(--accent-indigo)]">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-[10px] font-black bg-[rgba(var(--accent-indigo-rgb),0.1)] text-[var(--accent-indigo)] px-2 py-1 rounded-full">صافي</span>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">الأرباح الصافية</p>
                        <h4 className="text-2xl font-black text-white">{mask(stats.profit.toLocaleString(), 'currency')} <span className="text-xs text-slate-500 italic">DZD</span></h4>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-[var(--border-radius-elite)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-amber-500/20 transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-4" dir="rtl">
                        <div className="p-3 bg-amber-500/10 rounded-[var(--border-radius-elite)] text-amber-400">
                            <PieChart size={24} />
                        </div>
                        <span className="text-[10px] font-black bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">{stats.profitMargin.toFixed(1)}%</span>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">هامش الربح</p>
                        <h4 className="text-2xl font-black text-white">ممتاز</h4>
                    </div>
                </div>
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cash Flow Chart Holder */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[var(--border-radius-elite)] p-6 relative">
                    <div className="flex justify-between items-center mb-8" dir="rtl">
                        <h4 className="text-lg font-black text-white">التدفقات النقدية (6 أشهر)</h4>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] text-slate-400 font-bold">دخل</span>
                            </div>
                            <div className="flex items-center gap-1.5 ml-3">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-[10px] text-slate-400 font-bold">مصاريف</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 w-full flex items-end justify-between gap-4 px-2 relative">
                        <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-10">
                            {[1, 2, 3, 4].map(i => <div key={i} className="border-t border-white/20 w-full"></div>)}
                        </div>

                        {[
                            { m: 'Jun', i: 40, e: 20 }, { m: 'Jul', i: 60, e: 30 }, { m: 'Aug', i: 55, e: 45 },
                            { m: 'Sep', i: 85, e: 35 }, { m: 'Oct', i: 70, e: 40 }, { m: 'Nov', i: 95, e: 50 }
                        ].map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                <div className="w-full flex justify-center gap-1 items-end h-full">
                                    <div
                                        style={{ height: `${d.i}%` }}
                                        className="w-1.5 md:w-3 bg-emerald-500/80 rounded-t-full group-hover:bg-emerald-400 transition-all duration-500 cursor-pointer"
                                    ></div>
                                    <div
                                        style={{ height: `${d.e}%` }}
                                        className="w-1.5 md:w-3 bg-red-500/80 rounded-t-full group-hover:bg-red-400 transition-all duration-500 cursor-pointer"
                                    ></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500">{d.m}</span>
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                    +{d.i}k / -{d.e}k
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[var(--border-radius-elite)] p-6">
                    <h4 className="text-lg font-black text-white mb-6 text-right">توزيع العملات</h4>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs" dir="rtl">
                                <span className="font-black text-white">DZD - الدينار الجزائري</span>
                                <span className="text-slate-400 font-bold">{mask(incomeByCurrency.DZD.toLocaleString(), 'currency')}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div style={{ width: '85%' }} className="h-full bg-[var(--accent-indigo)] shadow-[0_0_10px_rgba(var(--accent-indigo-rgb),0.5)]"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs" dir="rtl">
                                <span className="font-black text-white">EUR - اليورو</span>
                                <span className="text-slate-400 font-bold">{mask(incomeByCurrency.EUR.toLocaleString(), 'currency')}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div style={{ width: '10%' }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs" dir="rtl">
                                <span className="font-black text-white">USD - الدولار الأمريكي</span>
                                <span className="text-slate-400 font-bold">{mask(incomeByCurrency.USD.toLocaleString(), 'currency')}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div style={{ width: '5%' }} className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-[rgba(var(--accent-indigo-rgb),0.05)] border border-[rgba(var(--accent-indigo-rgb),0.1)] rounded-[var(--border-radius-elite)]">
                            <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 text-center">التوقعات المالية</h5>
                            <p className="text-[10px] text-slate-400 text-center leading-relaxed">بناءً على العقود القائمة والتدفقات الحالية، من المتوقع نمو السيولة باليورو بنسبة 15% خلال الربع القادم.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expenses Analytics */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[var(--border-radius-elite)] overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/30" dir="rtl">
                    <div className="flex items-center gap-3">
                        <Wallet className="text-red-400" size={20} />
                        <h4 className="text-lg font-black text-white">سجل المصاريف الاستراتيجية</h4>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"><Filter size={16} /></button>
                    </div>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-right" dir="rtl">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-500 border-b border-white/5 uppercase tracking-widest">
                                <th className="px-6 py-4">التاريخ</th>
                                <th className="px-6 py-4">البند</th>
                                <th className="px-6 py-4">التصنيف</th>
                                <th className="px-6 py-4">المبلغ</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {(expenses || []).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-600 italic">لا توجد مصاريف مسجلة حالياً. سجل أول عملية شراء لأدواتك.</td>
                                </tr>
                            ) : (
                                (expenses || []).map((e) => (
                                    <tr key={e.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                                        <td className="px-6 py-4 text-slate-400 font-bold">{new Date(e.date).toLocaleDateString('ar-DZ')}</td>
                                        <td className="px-6 py-4 font-black text-white">{e.title}</td>
                                        <td className="px-6 py-4 text-indigo-400">
                                            <span className="bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/10">{e.category}</span>
                                        </td>
                                        <td className="px-6 py-4 font-black text-white">{mask(e.amount.toLocaleString(), 'currency')} {e.currency}</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-emerald-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#10b981]"></div>
                                                مدفوع
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => deleteExpense(e.id)}
                                                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ExpenseForm
                isOpen={isAddingExpense}
                onClose={() => setIsAddingExpense(false)}
            />
        </div>
    );
};

export default FinancialHub;
