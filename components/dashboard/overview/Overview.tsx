import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '../../../context/SystemContext';
import { useContent } from '../../../context/ContentContext';
import { useBusiness } from '../../../context/BusinessContext';
import { useUI } from '../../../context/UIContext';
import {
    Zap,
    PlusCircle,
    UserPlus,
    FileText,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    Briefcase,
    Eye
} from 'lucide-react';
import Skeleton from '../../ui/Skeleton';
import WidgetWrapper from '../widgets/WidgetWrapper';
import { WIDGET_REGISTRY } from '../widgets/WidgetRegistry';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { transitions, variants } from '../../../lib/motion-config';

const Overview: React.FC = () => {
    const { activityLog, aiConfig, isLoading, analytics } = useSystem();
    const { articles } = useContent();
    const { clients, projects, invoices } = useBusiness();

    const dashboardLayout = [
        { id: 'revenue_stats', visible: true, order: 0, size: 'medium' },
        { id: 'ai_insights', visible: true, order: 1, size: 'medium' },
        { id: 'quick_actions', visible: true, order: 2, size: 'full' },
        { id: 'active_projects', visible: true, order: 3, size: 'large' }
    ];

    const activeWidgets = dashboardLayout
        .filter(w => w.visible)
        .sort((a, b) => a.order - b.order);

    if (isLoading) {
        return (
            <div className="space-y-12 h-screen overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                    <div className="space-y-2">
                        <Skeleton className="w-48 h-10" />
                        <Skeleton className="w-32 h-3" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <Skeleton className="col-span-1 md:col-span-2 h-72" />
                    <Skeleton className="col-span-1 md:col-span-2 h-72" />
                    <Skeleton className="col-span-4 h-40" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="space-y-12"
            variants={variants.staggerContainer}
            initial="initial"
            animate="animate"
        >
            <motion.div
                className="flex items-center justify-between mb-8"
                dir="rtl"
                variants={variants.fadeInUp}
            >
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">قائد العمليات الرقمية</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">NR-OS Modular Ops v5.1</p>
                </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
                <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {activeWidgets.map((widget) => {
                        const definition = WIDGET_REGISTRY[widget.id];
                        if (!definition) return null;

                        const WidgetComponent = definition.component;

                        return (
                            <motion.div
                                key={widget.id}
                                variants={variants.fadeInUp}
                                transition={transitions.smooth}
                                className={widget.size === 'full' ? 'col-span-full' : ''}
                            >
                                <WidgetWrapper
                                    title={definition.defaultProps.title || 'Widget'}
                                    size={widget.size as any}
                                >
                                    <Suspense fallback={<div className="h-full flex items-center justify-center"><LoadingSpinner /></div>}>
                                        <WidgetComponent />
                                    </Suspense>
                                </WidgetWrapper>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            <motion.div
                className="pt-12 border-t border-white/5"
                dir="rtl"
                variants={variants.fadeInUp}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'إجمالي الزيارات', val: (analytics.visits.total || 0).toLocaleString(), icon: Eye },
                        { label: 'المشاريع', val: (projects || []).length, icon: Briefcase },
                        { label: 'الفواتير المعلقة', val: (invoices || []).filter(i => i.status === 'pending').length, icon: FileText },
                        { label: 'معدل التحويل', val: `${analytics.conversions.growth}% `, icon: ShieldCheck }
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-[8px] text-slate-500 font-black uppercase tracking-widest">
                                <s.icon size={10} className="text-[var(--accent-indigo)]" />
                                {s.label}
                            </div>
                            <div className="text-xl font-black text-white">{s.val}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Overview;
