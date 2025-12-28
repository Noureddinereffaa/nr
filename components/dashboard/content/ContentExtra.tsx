import React from 'react';
import { useData } from '../../context/DataContext';

const ContentExtra: React.FC = () => {
    const { siteData } = useData();

    return (
        <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-white/5 rounded-lg">
                <h4 className="text-white font-black">الأسئلة الشائعة</h4>
                {(siteData?.faqs || []).map((f: any, i: number) => (
                    <div key={i} className="mt-3">
                        <div className="text-slate-200 font-bold">{f.q}</div>
                        <div className="text-slate-400 text-sm mt-1">{f.a}</div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-slate-900 border border-white/5 rounded-lg">
                <h4 className="text-white font-black">آراء العملاء</h4>
                {(siteData?.testimonials || []).map((t: any, i: number) => (
                    <div key={i} className="mt-3">
                        <div className="text-slate-200 font-bold">
                            {t.name} — {t.role}
                        </div>
                        <div className="text-slate-400 text-sm mt-1">{t.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentExtra;
