import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useUI } from '../../../context/UIContext';
import { Palette, Check, Sparkles, Eye, Layout } from 'lucide-react';

const PRESET_THEMES = [
    { name: 'Indigo', primary: '#6366f1', secondary: '#818cf8', label: 'أزرق نيلي' },
    { name: 'Emerald', primary: '#10b981', secondary: '#34d399', label: 'أخضر زمردي' },
    { name: 'Royal Blue', primary: '#2563eb', secondary: '#60a5fa', label: 'أزرق ملكي' },
    { name: 'Rose', primary: '#e11d48', secondary: '#fb7185', label: 'وردي' },
    { name: 'Amber', primary: '#d97706', secondary: '#fbbf24', label: 'ذهبي' },
    { name: 'Violet', primary: '#7c3aed', secondary: '#a78bfa', label: 'بنفسجي' },
];

const BORDER_RADII = [
    { name: 'Sharp', value: '0.25rem' },
    { name: 'Organic', value: '1rem' },
    { name: 'Elite (Full)', value: '1.5rem' },
    { name: 'Super Circular', value: '3rem' },
];

const FONT_FAMILIES = [
    { name: 'Inter (Modern)', value: 'Inter, sans-serif', label: 'عصري (Inter)' },
    { name: 'Cairo (Arabic)', value: 'Cairo, sans-serif', label: 'كـايرو (عربي)' },
    { name: 'Outfit (Fashion)', value: 'Outfit, sans-serif', label: 'أنيق (Outfit)' },
    { name: 'Roboto (Tech)', value: 'Roboto, sans-serif', label: 'تقني (Roboto)' },
];

const BrandSettings: React.FC = () => {
    const { siteData, updateSiteData } = useData();
    const { themeConfig, updateTheme } = useUI();
    const brand = (siteData.brand || {}) as any;
    const [showPreview, setShowPreview] = useState(true);

    const handleChange = (field: string, value: any) => {
        const updatedBrand = { ...brand, [field]: value };
        updateSiteData({ brand: updatedBrand });

        // Sync with Theme Engine if it's a primary color change
        if (field === 'primaryColor') {
            updateTheme({ accentColor: value });
        }
    };

    const applyPreset = (preset: typeof PRESET_THEMES[0]) => {
        updateSiteData({
            brand: {
                ...brand,
                primaryColor: preset.primary,
                secondaryColor: preset.secondary
            }
        });
        updateTheme({ accentColor: preset.primary });
    };

    const currentPrimary = brand.primaryColor || themeConfig.accentColor || '#6366f1';
    const currentSecondary = brand.secondaryColor || '#818cf8';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Palette className="text-indigo-400" size={20} />
                    هوية العلامة التجارية
                </h3>
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showPreview ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                >
                    <Eye size={14} />
                    معاينة حية
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column - Controls */}
                <div className="space-y-6">
                    {/* Site Identity */}
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            معلومات الموقع
                        </h4>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">اسم الموقع / الشركة</label>
                            <input
                                type="text"
                                value={brand.siteName || ''}
                                onChange={(e) => handleChange('siteName', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-indigo-500/50 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">الشعار النصي (Slogan)</label>
                            <input
                                type="text"
                                value={brand.slogan || ''}
                                onChange={(e) => handleChange('slogan', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-indigo-500/50 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">الشعار (صورة URL)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={brand.logo || ''}
                                    onChange={(e) => handleChange('logo', e.target.value)}
                                    className="flex-1 bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white text-left focus:border-indigo-500/50 outline-none transition-colors"
                                    dir="ltr"
                                    placeholder="https://..."
                                />
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                    {brand.logo ? (
                                        <img src={brand.logo} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Sparkles size={16} className="text-slate-600" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preset Themes */}
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            ثيمات جاهزة
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                            {PRESET_THEMES.map((preset) => {
                                const isActive = currentPrimary === preset.primary;
                                return (
                                    <button
                                        key={preset.name}
                                        onClick={() => applyPreset(preset)}
                                        className={`relative p-2 rounded-xl border transition-all ${isActive
                                            ? 'border-white/30 bg-white/5 scale-105'
                                            : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                                            }`}
                                        title={preset.label}
                                    >
                                        <div className="flex gap-1 justify-center mb-1">
                                            <div
                                                className="w-5 h-5 rounded-full shadow-lg"
                                                style={{ backgroundColor: preset.primary }}
                                            />
                                            <div
                                                className="w-5 h-5 rounded-full shadow-lg"
                                                style={{ backgroundColor: preset.secondary }}
                                            />
                                        </div>
                                        <p className="text-[9px] text-slate-400 text-center truncate">{preset.label}</p>
                                        {isActive && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                                <Check size={10} className="text-slate-900" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            ألوان العلامة السيادية
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">اللون الأساسي</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        value={currentPrimary}
                                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                                        className="w-10 h-10 bg-transparent border-none cursor-pointer rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        value={currentPrimary}
                                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                                        className="flex-1 bg-slate-950 border border-white/10 rounded-lg p-2 text-white font-mono text-xs text-left"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">اللون الثانوي</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        value={currentSecondary}
                                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                        className="w-10 h-10 bg-transparent border-none cursor-pointer rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        value={currentSecondary}
                                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                        className="flex-1 bg-slate-950 border border-white/10 rounded-lg p-2 text-white font-mono text-xs text-left"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* UI Engine Controls (Merged from ThemeEditor) */}
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-6">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Layout className="text-indigo-400" size={16} />
                            هندسة الواجهة (UI Engine)
                        </h4>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 block">انحناء الزوايا (Radius)</label>
                            <div className="grid grid-cols-2 gap-2">
                                {BORDER_RADII.map(r => (
                                    <button
                                        key={r.value}
                                        onClick={() => {
                                            updateTheme({ borderRadius: r.value });
                                            handleChange('borderRadius', r.value);
                                        }}
                                        className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${themeConfig.borderRadius === r.value ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
                                    >
                                        {r.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-400 block">كثافة الزجاج (Glass Opacity)</label>
                                <span className="text-[10px] font-mono text-indigo-400">{themeConfig.glassOpacity}</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="0.8"
                                step="0.1"
                                value={themeConfig.glassOpacity}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    updateTheme({ glassOpacity: val });
                                    handleChange('glassOpacity', val);
                                }}
                                className="w-full accent-indigo-500 bg-slate-950 rounded-lg h-1.5 appearance-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 block">نوع الخط (Typography)</label>
                            <div className="grid grid-cols-2 gap-2">
                                {FONT_FAMILIES.map(f => (
                                    <button
                                        key={f.value}
                                        onClick={() => {
                                            updateTheme({ fontFamily: f.value });
                                            handleChange('fontFamily', f.value);
                                        }}
                                        className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${themeConfig.fontFamily === f.value ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
                                        style={{ fontFamily: f.value }}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Live Preview */}
                {showPreview && (
                    <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 space-y-6">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Eye size={14} className="text-indigo-400" />
                            معاينة حية
                        </h4>

                        {/* Simulated Hero */}
                        <div
                            className="p-6 rounded-xl relative overflow-hidden"
                            style={{
                                background: `linear-gradient(135deg, ${currentPrimary}20 0%, ${currentSecondary}10 100%)`,
                                borderColor: `${currentPrimary}30`
                            }}
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ backgroundColor: currentPrimary }}></div>
                            <h3 className="text-xl font-black text-white mb-2 relative z-10">{brand.siteName || 'اسم المشروع'}</h3>
                            <p className="text-xs text-slate-400 mb-4 relative z-10">{brand.slogan || 'شعار المشروع هنا'}</p>
                            <div className="flex gap-2 relative z-10">
                                <button
                                    className="px-4 py-2 rounded-lg text-white text-xs font-bold shadow-lg transition-transform hover:scale-105"
                                    style={{
                                        backgroundColor: currentPrimary,
                                        boxShadow: `0 10px 30px ${currentPrimary}40`,
                                        borderRadius: themeConfig.borderRadius
                                    }}
                                >
                                    زر رئيسي
                                </button>
                                <button
                                    className="px-4 py-2 rounded-lg text-xs font-bold border transition-colors"
                                    style={{
                                        borderColor: currentSecondary,
                                        color: currentSecondary,
                                        borderRadius: themeConfig.borderRadius
                                    }}
                                >
                                    زر ثانوي
                                </button>
                            </div>
                        </div>

                        {/* Sample Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                                    style={{ backgroundColor: `${currentPrimary}20` }}
                                >
                                    <Sparkles size={14} style={{ color: currentPrimary }} />
                                </div>
                                <p className="text-xs font-bold text-white">عنصر خدمة</p>
                                <p className="text-[10px] text-slate-500">وصف مختصر للخدمة</p>
                            </div>
                            <div
                                className="p-4 rounded-xl"
                                style={{ backgroundColor: currentPrimary }}
                            >
                                <p className="text-xs font-bold text-white mb-1">بطاقة مميزة</p>
                                <p className="text-[10px] text-white/70">+200%</p>
                            </div>
                        </div>

                        {/* Badge/Chip Samples */}
                        <div className="flex flex-wrap gap-2">
                            <span
                                className="px-2 py-1 rounded-md text-[10px] font-bold"
                                style={{ backgroundColor: `${currentPrimary}20`, color: currentPrimary }}
                            >
                                وسم رئيسي
                            </span>
                            <span
                                className="px-2 py-1 rounded-md text-[10px] font-bold"
                                style={{ backgroundColor: `${currentSecondary}20`, color: currentSecondary }}
                            >
                                وسم ثانوي
                            </span>
                            <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-white/5 text-slate-400">
                                وسم عادي
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandSettings;
