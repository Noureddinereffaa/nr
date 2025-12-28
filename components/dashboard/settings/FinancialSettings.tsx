import React from 'react';
import { useData } from '../../../context/DataContext';
import { CreditCard, Landmark } from 'lucide-react';

const FinancialSettings: React.FC = () => {
    const { siteData, updateSiteData } = useData();
    const financials = (siteData.financials || {}) as any;

    const handleChange = (field: string, value: any) => {
        updateSiteData({
            financials: { ...financials, [field]: value }
        });
    };

    const togglePaymentMethod = (method: string) => {
        const methods = financials.paymentMethods || [];
        const newMethods = methods.includes(method)
            ? methods.filter(m => m !== method)
            : [...methods, method];
        handleChange('paymentMethods', newMethods);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Landmark className="text-green-400" size={20} />
                الإعدادات المالية
            </h3>

            <div className="grid gap-6">
                {/* Bank Info */}
                <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                    <h4 className="font-bold text-slate-300 mb-2">الحساب البنكي</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">اسم البنك</label>
                            <input
                                type="text"
                                value={financials.bankName || ''}
                                onChange={(e) => handleChange('bankName', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">SWIFT / BIC</label>
                            <input
                                type="text"
                                value={financials.swift || ''}
                                onChange={(e) => handleChange('swift', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white font-mono"
                                dir="ltr"
                            />
                        </div>
                        <div className="col-span-full">
                            <label className="text-xs font-bold text-slate-400 block mb-1">رقم الحساب (RIP)</label>
                            <input
                                type="text"
                                value={financials.rip || ''}
                                onChange={(e) => handleChange('rip', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white font-mono"
                                dir="ltr"
                            />
                        </div>
                        <div className="col-span-full">
                            <label className="text-xs font-bold text-slate-400 block mb-1">رقم الحساب البريدي (CCP)</label>
                            <input
                                type="text"
                                value={financials.ccp || ''}
                                onChange={(e) => handleChange('ccp', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white font-mono"
                                dir="ltr"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                    <h4 className="font-bold text-slate-300 mb-2">طرق الدفع المقبولة</h4>
                    <div className="flex flex-wrap gap-3">
                        {['Cash', 'CIB', 'BaridiMob', 'Cheque', 'Bank Transfer'].map(method => (
                            <button
                                key={method}
                                onClick={() => togglePaymentMethod(method)}
                                className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${financials.paymentMethods?.includes(method)
                                    ? 'bg-green-600/20 border-green-500 text-green-400'
                                    : 'bg-slate-950 border-white/5 text-slate-500 hover:bg-slate-800'
                                    }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialSettings;
