import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, CreditCard, Menu } from 'lucide-react';

interface MobileNavProps {
    activeTab: string;
    onTabChange: (id: string) => void;
    onOpenMenu: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange, onOpenMenu }) => {
    const navItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'رئيسي' },
        { id: 'projects', icon: Briefcase, label: 'مشاريع' },
        { id: 'clients', icon: Users, label: 'عملاء' },
        { id: 'financial-hub', icon: CreditCard, label: 'مالية' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[var(--z-nav)] px-4 pb-6 pt-2 pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
                <nav className="glass-panel rounded-3xl p-2 flex items-center justify-between shadow-2xl border-white/10">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className="relative flex flex-col items-center justify-center py-2 px-1 flex-1 transition-all active:scale-90"
                            >
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobile-pill"
                                            className="absolute inset-0 bg-indigo-500/10 rounded-2xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </AnimatePresence>
                                <Icon
                                    size={20}
                                    className={`relative z-10 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}
                                />
                                <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 relative z-10 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                    <div className="w-[1px] h-8 bg-white/5 mx-1" />

                    <button
                        onClick={onOpenMenu}
                        className="flex flex-col items-center justify-center py-2 px-1 flex-1 transition-all active:scale-90"
                    >
                        <Menu size={20} className="text-slate-500" />
                        <span className="text-[9px] font-black uppercase tracking-tighter mt-1 text-slate-500">
                            المزيد
                        </span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

// Need AnimatePresence which isn't imported from framer-motion in the snippet above correctly, 
// I will fix it in the final write.
import { AnimatePresence } from 'framer-motion';

export default MobileNav;
