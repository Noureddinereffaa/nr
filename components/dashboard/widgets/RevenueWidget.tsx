import React from 'react';
import { TrendingUp, ArrowUpRight, DollarSign } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const RevenueWidget: React.FC = () => {
    const { siteData } = useData();
    const totalPaid = (siteData.invoices || []).reduce((acc, inv) => inv.status === 'paid' ? acc + inv.total : acc, 0);

    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <DollarSign size={20} />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-black text-emerald-500">
                        <TrendingUp size={14} />
                        <span>+12.4%</span>
                    </div>
                </div>
                <div className="text-4xl font-black text-white tracking-tighter mb-1">
                    {totalPaid.toLocaleString()} <span className="text-xs text-slate-500">د.ج</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">إجمالي المدفوعات المسجلة</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-400">
                            U{i}
                        </div>
                    ))}
                </div>
                <button className="text-[10px] font-black text-[var(--accent-indigo)] hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
                    التفاصيل <ArrowUpRight size={12} />
                </button>
            </div>
        </div>
    );
};

export default RevenueWidget;
