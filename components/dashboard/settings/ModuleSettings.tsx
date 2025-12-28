import React from 'react';
import { useData } from '../../../context/DataContext';
import {
    Layout,
    Users,
    CreditCard,
    TrendingUp,
    FileText,
    Cpu,
    Eye,
    EyeOff
} from 'lucide-react';

const ModuleSettings: React.FC = () => {
    const { siteData, updateSiteData } = useData();
    const features = siteData.features || {
        crm: true,
        financials: true,
        marketing: true,
        contentManager: true,
        aiBrain: true
    };

    const toggleFeature = (key: keyof typeof features) => {
        updateSiteData({
            features: {
                ...features,
                [key]: !features[key]
            }
        });
    };

    const modules = [
        {
            key: 'crm',
            name: 'CRM Intelligence',
            desc: 'إدارة العملاء، الصفقات، والمتابعة الذكية.',
            icon: Users,
            color: 'text-blue-400'
        },
        {
            key: 'financials',
            name: 'Financial Hub',
            desc: 'الفواتير، المصاريف، التقارير المالية والربحية.',
            icon: CreditCard,
            color: 'text-emerald-400'
        },
        {
            key: 'marketing',
            name: 'Marketing Growth',
            desc: 'تتبع الحملات، تحليلات النمو، وأداء التسويق.',
            icon: TrendingUp,
            color: 'text-purple-400'
        },
        {
            key: 'contentManager',
            name: 'AI Content Engine',
            desc: 'توليد المقالات، خطة المحتوى، وتحسين SEO.',
            icon: FileText,
            color: 'text-amber-400'
        },
        {
            key: 'aiBrain',
            name: 'AI Global Brain',
            desc: 'إعدادات الذكاء الاصطناعي، الشخصية، والمهمة العامة.',
            icon: Cpu,
            color: 'text-indigo-400'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Layout className="text-indigo-400" size={20} />
                <h3 className="text-lg font-bold text-white">إدارة الوحدات والوظائف</h3>
            </div>

            <p className="text-sm text-slate-400">
                يمكنك تخصيص المنصة عبر تفعيل أو تعطيل الوحدات البرمجية حسب حاجتك. الوحدات المعطلة لن تظهر في القائمة الجانبية أو أي مكان آخر.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
                {modules.map((m) => {
                    const isActive = features[m.key as keyof typeof features];
                    const Icon = m.icon;

                    return (
                        <div
                            key={m.key}
                            className={`
                                relative p-5 rounded-2xl border transition-all cursor-pointer group
                                ${isActive
                                    ? 'bg-slate-900/50 border-indigo-500/30'
                                    : 'bg-slate-950 border-white/5 opacity-60 grayscale'
                                }
                            `}
                            onClick={() => toggleFeature(m.key as keyof typeof features)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${isActive ? 'bg-indigo-500/10' : 'bg-white/5'}`}>
                                    <Icon className={isActive ? m.color : 'text-slate-500'} size={24} />
                                </div>
                                <div className={`
                                    flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border
                                    ${isActive
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }
                                `}>
                                    {isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                    {isActive ? 'نشط' : 'معطل'}
                                </div>
                            </div>

                            <h4 className="text-sm font-bold text-white mb-1">{m.name}</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{m.desc}</p>

                            {/* Toggle Switch */}
                            <div className="absolute top-5 left-5">
                                <div className={`
                                    w-10 h-5 rounded-full relative transition-colors duration-300
                                    ${isActive ? 'bg-indigo-600' : 'bg-slate-800'}
                                `}>
                                    <div className={`
                                        absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300
                                        ${isActive ? 'right-6' : 'right-1'}
                                    `} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ModuleSettings;
