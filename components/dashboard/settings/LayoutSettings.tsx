import { useSystem } from '../../../context/SystemContext';
import { useUI } from '../../../context/UIContext';
import {
    Layout,
    GripVertical,
    Eye,
    EyeOff,
    Maximize2,
    Square
} from 'lucide-react';

const WIDGET_LABELS = {
    revenue_stats: { label: 'إحصائيات الإيرادات', icon: '💰' },
    ai_insights: { label: 'تحليلات الذكاء الاصطناعي', icon: '🧠' },
    quick_actions: { label: 'الإجراءات السريعة', icon: '⚡' },
    active_projects: { label: 'المشاريع النشطة', icon: '🏗️' }
};

const LayoutSettings: React.FC = () => {
    const { siteData, updateSiteData } = useSystem();
    const { themeConfig, updateTheme } = useUI();
    const layout = siteData.dashboardLayout || [
        { id: 'revenue_stats', visible: true, order: 0, size: 'medium' },
        { id: 'ai_insights', visible: true, order: 1, size: 'medium' },
        { id: 'quick_actions', visible: true, order: 2, size: 'full' },
        { id: 'active_projects', visible: true, order: 3, size: 'large' }
    ];

    const toggleVisibility = (id: string) => {
        updateSiteData({
            dashboardLayout: layout.map(w => w.id === id ? { ...w, visible: !w.visible } : w)
        });
    };

    const changeSize = (id: string, size: any) => {
        updateSiteData({
            dashboardLayout: layout.map(w => w.id === id ? { ...w, size } : w)
        });
    };

    const moveWidget = (id: string, direction: 'up' | 'down') => {
        const index = layout.findIndex(w => w.id === id);
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === layout.length - 1) return;

        const newLayout = [...layout];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newLayout[index], newLayout[swapIndex]] = [newLayout[swapIndex], newLayout[index]];

        // Update orders
        const finalLayout = newLayout.map((w, i) => ({ ...w, order: i }));
        updateSiteData({ dashboardLayout: finalLayout });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Layout className="text-indigo-400" size={20} />
                <h3 className="text-lg font-bold text-white">تنظيم لوحة التحكم</h3>
            </div>

            <p className="text-sm text-slate-400">
                قم بترتيب وتخصيص ظهور الودجات (Widgets) في واجهة نظرة عامة لإنشاء سير عمل مثالي لك.
            </p>

            <div className="space-y-3">
                {layout.sort((a, b) => a.order - b.order).map((w, index) => {
                    const info = WIDGET_LABELS[w.id as keyof typeof WIDGET_LABELS] || { label: w.id, icon: '📦' };

                    return (
                        <div
                            key={w.id}
                            className={`
                                group flex items-center gap-4 p-4 rounded-xl border transition-all
                                ${w.visible ? 'bg-slate-900 border-white/5' : 'bg-slate-950 border-white/5 opacity-50'}
                            `}
                        >
                            <div className="cursor-grab active:cursor-grabbing text-slate-600 group-hover:text-slate-400">
                                <GripVertical size={20} />
                            </div>

                            <div className="flex-1 flex items-center gap-3">
                                <span className="text-xl">{info.icon}</span>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{info.label}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{w.size}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Size Controls */}
                                <div className="flex bg-slate-950 border border-white/5 p-1 rounded-lg">
                                    {['medium', 'large', 'full'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => changeSize(w.id, s)}
                                            className={`p-1.5 rounded-md transition-all ${w.size === s ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                                            title={`Size: ${s}`}
                                        >
                                            {s === 'medium' && <Square size={12} />}
                                            {s === 'large' && <Maximize2 size={12} />}
                                            {s === 'full' && <Layout size={12} />}
                                        </button>
                                    ))}
                                </div>

                                {/* Visibility Toggle */}
                                <button
                                    onClick={() => toggleVisibility(w.id)}
                                    className={`
                                        p-2 rounded-lg border transition-all
                                        ${w.visible ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-red-500/30 text-red-400 bg-red-500/5'}
                                    `}
                                >
                                    {w.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>

                                {/* Order Controls (Simple buttons for now instead of Drag-n-Drop for robustness) */}
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => moveWidget(w.id, 'up')}
                                        disabled={index === 0}
                                        className="text-[10px] bg-slate-800 hover:bg-slate-700 disabled:opacity-20 px-1 rounded"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        onClick={() => moveWidget(w.id, 'down')}
                                        disabled={index === layout.length - 1}
                                        className="text-[10px] bg-slate-800 hover:bg-slate-700 disabled:opacity-20 px-1 rounded"
                                    >
                                        ▼
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LayoutSettings;
