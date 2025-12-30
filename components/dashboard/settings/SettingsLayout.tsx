import React, { useState } from 'react';
import { User, Palette, Landmark, Scale, Code, Layout } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import BrandSettings from './BrandSettings';
import FinancialSettings from './FinancialSettings';
import LegalSettings from './LayoutSettings'; // Corrected import path based on context or LegalSettings file? Assume LegalSettings exists.
import LegalSettingsComponent from './LegalSettings'; // Wait, let me check file system for LegalSettings.
import LayoutSettings from './LayoutSettings';
import ModuleSettings from './ModuleSettings';

// Re-importing clearly to avoid confusion
// Assuming LegalSettings.tsx exists in the same folder

const SettingsLayout: React.FC<{ initialTab?: 'profile' | 'brand' | 'financial' | 'legal' | 'layout' | 'modules' }> = ({ initialTab = 'profile' }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'brand' | 'financial' | 'legal' | 'layout' | 'modules'>(initialTab);

    return (
        <div className="flex flex-col md:flex-row h-full gap-6">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 shrink-0 space-y-2">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <User size={18} />
                    الهوية الشخصية
                </button>
                <button
                    onClick={() => setActiveTab('brand')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'brand' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <Palette size={18} />
                    الهوية البصرية
                </button>
                <button
                    onClick={() => setActiveTab('financial')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'financial' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <Landmark size={18} />
                    الإعدادات المالية
                </button>
                <button
                    onClick={() => setActiveTab('legal')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'legal' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <Scale size={18} />
                    البيانات القانونية
                </button>

                <div className="pt-4 border-t border-white/5 space-y-2">
                    <button
                        onClick={() => setActiveTab('layout')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'layout' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <Layout size={18} />
                        تنظيم الواجهة
                    </button>
                    <button
                        onClick={() => setActiveTab('modules')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'modules' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <Code size={18} />
                        إدارة الوحدات
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto pb-10">
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'brand' && <BrandSettings />}
                    {activeTab === 'financial' && <FinancialSettings />}
                    {activeTab === 'legal' && <LegalSettingsComponent />}
                    {activeTab === 'layout' && <LayoutSettings />}
                    {activeTab === 'modules' && <ModuleSettings />}
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
