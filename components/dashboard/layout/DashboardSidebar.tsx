import React from 'react';
import TabButton from '../shared/TabButton';
import { useSystem } from '../../../context/SystemContext';
import { useContent } from '../../../context/ContentContext';
import { useBusiness } from '../../../context/BusinessContext';
import { motion } from 'framer-motion';
import { haptic } from '../../../lib/motion-config';
import {
    LayoutDashboard,
    PieChart,
    Settings2,
    HardDrive,
    Palette,
    Briefcase,
    Terminal,
    BrainCircuit,
    MessageSquare,
    Users,
    CreditCard,
    FileText,
    Shield
} from 'lucide-react';

interface DashboardSidebarProps {
    activeTab: string;
    mobileMenuOpen: boolean;
    onTabChange: (id: string) => void;
    showDebug: boolean;
    onToggleDebug: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    activeTab,
    mobileMenuOpen,
    onTabChange,
    showDebug,
    onToggleDebug,
}) => {
    const { siteData } = useSystem() as any;
    const features = siteData.features || {
        contentManager: true,
        aiBrain: true,
        crm: true,
        financials: true
    };

    return (
        <div
            className={`
                fixed md:relative top-0 bottom-0 right-0
                z-[var(--z-modal)] md:z-[var(--z-nav)] w-80 h-full 
                bg-slate-950/80 backdrop-blur-xl border-l border-white/5 shadow-2xl
                transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)
                ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                overflow-y-auto px-8 py-10 flex flex-col gap-10
            `}
        >
            <div className="flex items-center gap-3 mb-4 md:hidden" dir="rtl">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <Shield size={16} />
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">NR OS Dashboard</h2>
            </div>

            <div className="space-y-8">
                {/* Section: Command */}
                <div>
                    <h3 className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500/80 text-right font-mono">Running Processes</h3>
                    <div className="space-y-0.5">
                        <TabButton
                            id="overview"
                            label="لوحة القيادة"
                            icon={LayoutDashboard}
                            isActive={activeTab === 'overview'}
                            onClick={onTabChange}
                        />
                        <TabButton
                            id="system"
                            label="النظام الأساسي"
                            icon={HardDrive}
                            isActive={activeTab === 'system'}
                            onClick={onTabChange}
                        />
                    </div>
                </div>

                {/* Section: Operations */}
                <div>
                    <h3 className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500/80 text-right font-mono">Operations</h3>
                    <div className="space-y-0.5">
                        <TabButton
                            id="projects"
                            label="ستوديو المشاريع"
                            icon={Briefcase}
                            isActive={activeTab === 'projects'}
                            onClick={onTabChange}
                        />
                        <TabButton
                            id="services"
                            label="تطوير الخدمات"
                            icon={Terminal}
                            isActive={activeTab === 'services'}
                            onClick={onTabChange}
                        />
                        {features.crm && (
                            <TabButton
                                id="clients"
                                label="قاعدة العملاء"
                                icon={Users}
                                isActive={activeTab === 'clients'}
                                onClick={onTabChange}
                            />
                        )}
                    </div>
                </div>

                {/* Section: Intelligence */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <h3 className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500/80 text-right font-mono">Intelligence</h3>
                    <div className="space-y-0.5">
                        {features.aiBrain && (
                            <TabButton
                                id="aibrain"
                                label="العقل الرقمي"
                                icon={BrainCircuit}
                                isActive={activeTab === 'aibrain'}
                                onClick={onTabChange}
                            />
                        )}
                        {features.contentManager && (
                            <TabButton
                                id="content-manager"
                                label="محرك المحتوى"
                                icon={Settings2}
                                isActive={activeTab === 'content-manager'}
                                onClick={onTabChange}
                            />
                        )}
                        <TabButton
                            id="requests"
                            label="وارد المساعدة"
                            icon={MessageSquare}
                            isActive={activeTab === 'requests'}
                            onClick={onTabChange}
                        />
                        <TabButton
                            id="decision-pages"
                            label="صفحات القرار"
                            icon={BrainCircuit}
                            isActive={activeTab === 'decision-pages'}
                            onClick={onTabChange}
                        />
                    </div>
                </motion.div>

                {/* Section: Finance */}
                {features.financials && (
                    <div>
                        <h3 className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/80 text-right font-mono">Finance</h3>
                        <div className="space-y-0.5">
                            <TabButton
                                id="financial-hub"
                                label="المركز المالي"
                                icon={CreditCard}
                                isActive={activeTab === 'financial-hub'}
                                onClick={onTabChange}
                            />
                            <TabButton
                                id="billing"
                                label="الفواتير الذكية"
                                icon={FileText}
                                isActive={activeTab === 'billing'}
                                onClick={onTabChange}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 opacity-40">
                <button
                    onClick={onToggleDebug}
                    className="w-full py-2 text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors"
                >
                    {showDebug ? 'Disable Debug' : 'Developer Console'}
                </button>
            </div>
        </div>
    );
};

export default DashboardSidebar;
