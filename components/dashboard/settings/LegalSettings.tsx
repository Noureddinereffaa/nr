import React from 'react';
import { useData } from '../../../context/DataContext';
import { Scale, FileText } from 'lucide-react';

const LegalSettings: React.FC = () => {
    const { siteData, updateSiteData } = useData();
    const legal = (siteData.legal || {}) as any;

    const handleChange = (field: string, value: any) => {
        updateSiteData({
            legal: { ...legal, [field]: value }
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Scale className="text-amber-400" size={20} />
                الإعدادات القانونية
            </h3>

            <div className="grid gap-6">
                {/* Company Legal Info */}
                <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                    <h4 className="font-bold text-slate-300 mb-2">بيانات الشركة / الفوترة</h4>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">الاسم القانوني</label>
                            <input
                                type="text"
                                value={legal.companyName || ''}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">العنوان</label>
                            <input
                                type="text"
                                value={legal.address || ''}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Tax Numbers */}
                <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                    <h4 className="font-bold text-slate-300 mb-2">الأرقام الجبائية</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">الرقم الجبائي (NIF)</label>
                            <input
                                type="text"
                                value={legal.nif || ''}
                                onChange={(e) => handleChange('nif', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white font-mono"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">رقم السجل التجاري (RC)</label>
                            <input
                                type="text"
                                value={legal.rc || ''}
                                onChange={(e) => handleChange('rc', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white font-mono"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">رقم المادة (ART)</label>
                            <input
                                type="text"
                                value={legal.art || ''}
                                onChange={(e) => handleChange('art', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white font-mono"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">الرقم الإحصائي (NIS)</label>
                            <input
                                type="text"
                                value={legal.nis || ''}
                                onChange={(e) => handleChange('nis', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-white font-mono"
                                dir="ltr"
                            />
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1">الشروط والأحكام (تظهر في الفاتورة)</label>
                        <textarea
                            value={legal.terms || ''}
                            onChange={(e) => handleChange('terms', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white h-24 text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalSettings;
