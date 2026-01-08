import React from 'react';
import { useSystem } from '../../../context/SystemContext';

const ContentExtra: React.FC = () => {
    const { siteData, updateSiteData } = useSystem();
    const resources = (siteData as any).resources || [];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">إحصائيات إضافية</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <p className="text-slate-400 text-xs">إجمالي المصادر</p>
                    <p className="text-xl font-bold text-white">{resources.length}</p>
                </div>
                {/* Additional stats can be added here */}
            </div>
        </div>
    );
};

export default ContentExtra;
