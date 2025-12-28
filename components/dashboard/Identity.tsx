import React from 'react';
import { useData } from '../../context/DataContext';

const Identity: React.FC = () => {
    const { siteData, resetToDefault } = useData();

    return (
        <div className="space-y-3">
            <div className="p-4 bg-slate-900 border border-white/5 rounded-lg flex items-center gap-4">
                <img
                    src={siteData?.profile?.photoUrl}
                    alt="avatar"
                    className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                    <h4 className="text-white font-black">{siteData?.profile?.name}</h4>
                    <p className="text-slate-400">{siteData?.profile?.primaryTitle}</p>
                    <p className="text-slate-500 text-sm mt-2">
                        {siteData?.profile?.address}
                    </p>
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={() => resetToDefault()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                    إعادة ضبط الإعدادات
                </button>
            </div>
        </div>
    );
};

export default Identity;
