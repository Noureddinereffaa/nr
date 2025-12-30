import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Type, Save, RotateCcw, ChevronDown, ChevronUp, Navigation, Home, Briefcase, FolderOpen, Cog, MessageSquare, Mail, FileText, BookOpen } from 'lucide-react';
import { DEFAULT_SITE_TEXTS, SiteTexts } from '../../../types';

interface SectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<SectionProps> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400">
                        {icon}
                    </div>
                    <span className="text-white font-bold text-sm">{title}</span>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
            </button>
            {isOpen && (
                <div className="p-4 border-t border-white/5 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
};

interface TextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({ label, value, onChange, placeholder, multiline }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        {multiline ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-indigo-500/50 outline-none transition-colors resize-none"
                rows={3}
                placeholder={placeholder}
                dir="rtl"
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500/50 outline-none transition-colors"
                placeholder={placeholder}
                dir="rtl"
            />
        )}
    </div>
);

const TextSettings: React.FC = () => {
    const { siteData, updateSiteData } = useData();

    // Initialize with existing texts or defaults
    const currentTexts: SiteTexts = {
        ...DEFAULT_SITE_TEXTS,
        ...(siteData as any).siteTexts
    };

    const [texts, setTexts] = useState<SiteTexts>(currentTexts);
    const [hasChanges, setHasChanges] = useState(false);

    const updateText = (section: keyof SiteTexts, field: string, value: string) => {
        setTexts(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        updateSiteData({ siteTexts: texts } as any);
        setHasChanges(false);
    };

    const handleReset = () => {
        setTexts(DEFAULT_SITE_TEXTS);
        setHasChanges(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Type className="text-indigo-400" size={24} />
                    <div>
                        <h3 className="text-lg font-bold text-white">تخصيص نصوص الموقع</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Site Text Customization Engine</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        <RotateCcw size={14} />
                        استعادة الافتراضي
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${hasChanges
                                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        <Save size={14} />
                        حفظ التغييرات
                    </button>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
                {/* Navigation */}
                <CollapsibleSection title="القائمة الرئيسية (Navigation)" icon={<Navigation size={16} />} defaultOpen={true}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <TextField label="الرئيسية" value={texts.nav.home} onChange={(v) => updateText('nav', 'home', v)} />
                        <TextField label="الخدمات" value={texts.nav.services} onChange={(v) => updateText('nav', 'services', v)} />
                        <TextField label="النتائج" value={texts.nav.portfolio} onChange={(v) => updateText('nav', 'portfolio', v)} />
                        <TextField label="المنهجية" value={texts.nav.process} onChange={(v) => updateText('nav', 'process', v)} />
                        <TextField label="المقالات" value={texts.nav.blog} onChange={(v) => updateText('nav', 'blog', v)} />
                        <TextField label="التواصل" value={texts.nav.contact} onChange={(v) => updateText('nav', 'contact', v)} />
                        <TextField label="المساعد الذكي" value={texts.nav.aiAssistant} onChange={(v) => updateText('nav', 'aiAssistant', v)} />
                        <TextField label="لوحة التحكم" value={texts.nav.dashboard} onChange={(v) => updateText('nav', 'dashboard', v)} />
                    </div>
                </CollapsibleSection>

                {/* Hero Section */}
                <CollapsibleSection title="قسم الهيرو (Hero)" icon={<Home size={16} />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField label="الشارة (Badge)" value={texts.hero.badge} onChange={(v) => updateText('hero', 'badge', v)} />
                        <TextField label="الزر الرئيسي" value={texts.hero.primaryButton} onChange={(v) => updateText('hero', 'primaryButton', v)} />
                        <TextField label="الزر الثانوي" value={texts.hero.secondaryButton} onChange={(v) => updateText('hero', 'secondaryButton', v)} />
                        <TextField label="إحصائية 1" value={texts.hero.stat1Label} onChange={(v) => updateText('hero', 'stat1Label', v)} />
                        <TextField label="إحصائية 2" value={texts.hero.stat2Label} onChange={(v) => updateText('hero', 'stat2Label', v)} />
                        <TextField label="إحصائية 3" value={texts.hero.stat3Label} onChange={(v) => updateText('hero', 'stat3Label', v)} />
                    </div>
                </CollapsibleSection>

                {/* Services Section */}
                <CollapsibleSection title="قسم الخدمات (Services)" icon={<Briefcase size={16} />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField label="الشارة (Badge)" value={texts.services.badge} onChange={(v) => updateText('services', 'badge', v)} />
                        <TextField label="العنوان" value={texts.services.title} onChange={(v) => updateText('services', 'title', v)} />
                        <TextField label="العنوان المميز" value={texts.services.titleHighlight} onChange={(v) => updateText('services', 'titleHighlight', v)} />
                        <TextField label="زر الطلب" value={texts.services.requestButton} onChange={(v) => updateText('services', 'requestButton', v)} />
                        <TextField label="تسمية المميزات" value={texts.services.featuresLabel} onChange={(v) => updateText('services', 'featuresLabel', v)} />
                    </div>
                    <TextField label="الوصف الفرعي" value={texts.services.subtitle} onChange={(v) => updateText('services', 'subtitle', v)} multiline />
                </CollapsibleSection>

                {/* Portfolio Section */}
                <CollapsibleSection title="قسم الإنجازات (Portfolio)" icon={<FolderOpen size={16} />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField label="الشارة (Badge)" value={texts.portfolio.badge} onChange={(v) => updateText('portfolio', 'badge', v)} />
                        <TextField label="العنوان" value={texts.portfolio.title} onChange={(v) => updateText('portfolio', 'title', v)} />
                        <TextField label="العنوان المميز" value={texts.portfolio.titleHighlight} onChange={(v) => updateText('portfolio', 'titleHighlight', v)} />
                        <TextField label="زر الاستكشاف" value={texts.portfolio.exploreButton} onChange={(v) => updateText('portfolio', 'exploreButton', v)} />
                    </div>
                    <TextField label="الوصف الفرعي" value={texts.portfolio.subtitle} onChange={(v) => updateText('portfolio', 'subtitle', v)} multiline />
                </CollapsibleSection>

                {/* Process Section */}
                <CollapsibleSection title="قسم المنهجية (Process)" icon={<Cog size={16} />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField label="الشارة (Badge)" value={texts.process.badge} onChange={(v) => updateText('process', 'badge', v)} />
                        <TextField label="العنوان" value={texts.process.title} onChange={(v) => updateText('process', 'title', v)} />
                        <TextField label="العنوان المميز" value={texts.process.titleHighlight} onChange={(v) => updateText('process', 'titleHighlight', v)} />
                    </div>
                    <TextField label="الوصف الفرعي" value={texts.process.subtitle} onChange={(v) => updateText('process', 'subtitle', v)} multiline />
                </CollapsibleSection>

                {/* Testimonials Section */}
                <CollapsibleSection title="قسم الشهادات (Testimonials)" icon={<MessageSquare size={16} />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextField label="الشارة (Badge)" value={texts.testimonials.badge} onChange={(v) => updateText('testimonials', 'badge', v)} />
                        <TextField label="العنوان" value={texts.testimonials.title} onChange={(v) => updateText('testimonials', 'title', v)} />
                        <TextField label="العنوان المميز" value={texts.testimonials.titleHighlight} onChange={(v) => updateText('testimonials', 'titleHighlight', v)} />
                    </div>
                </CollapsibleSection>

                {/* Contact Section */}
                <CollapsibleSection title="قسم التواصل (Contact)" icon={<Mail size={16} />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField label="الشارة (Badge)" value={texts.contact.badge} onChange={(v) => updateText('contact', 'badge', v)} />
                        <TextField label="العنوان" value={texts.contact.title} onChange={(v) => updateText('contact', 'title', v)} />
                        <TextField label="العنوان المميز" value={texts.contact.titleHighlight} onChange={(v) => updateText('contact', 'titleHighlight', v)} />
                        <TextField label="عنوان النموذج" value={texts.contact.formTitle} onChange={(v) => updateText('contact', 'formTitle', v)} />
                        <TextField label="تسمية الواتساب" value={texts.contact.whatsappLabel} onChange={(v) => updateText('contact', 'whatsappLabel', v)} />
                        <TextField label="تسمية البريد" value={texts.contact.emailLabel} onChange={(v) => updateText('contact', 'emailLabel', v)} />
                        <TextField label="تسمية الهاتف" value={texts.contact.phoneLabel} onChange={(v) => updateText('contact', 'phoneLabel', v)} />
                        <TextField label="تسمية العنوان" value={texts.contact.addressLabel} onChange={(v) => updateText('contact', 'addressLabel', v)} />
                        <TextField label="زر الإرسال" value={texts.contact.submitButton} onChange={(v) => updateText('contact', 'submitButton', v)} />
                        <TextField label="CTA الواتساب" value={texts.contact.whatsappCta} onChange={(v) => updateText('contact', 'whatsappCta', v)} />
                    </div>
                    <TextField label="الوصف الفرعي" value={texts.contact.subtitle} onChange={(v) => updateText('contact', 'subtitle', v)} multiline />
                </CollapsibleSection>

                {/* Blog Section */}
                <CollapsibleSection title="قسم المدونة (Blog)" icon={<BookOpen size={16} />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField label="الشارة (Badge)" value={texts.blog.badge} onChange={(v) => updateText('blog', 'badge', v)} />
                        <TextField label="العنوان" value={texts.blog.title} onChange={(v) => updateText('blog', 'title', v)} />
                        <TextField label="العنوان المميز" value={texts.blog.titleHighlight} onChange={(v) => updateText('blog', 'titleHighlight', v)} />
                        <TextField label="بحث" value={texts.blog.searchPlaceholder} onChange={(v) => updateText('blog', 'searchPlaceholder', v)} />
                        <TextField label="تسمية التصنيفات" value={texts.blog.categoryLabel} onChange={(v) => updateText('blog', 'categoryLabel', v)} />
                        <TextField label="جميع التصنيفات" value={texts.blog.allCategories} onChange={(v) => updateText('blog', 'allCategories', v)} />
                        <TextField label="زر القراءة" value={texts.blog.readMore} onChange={(v) => updateText('blog', 'readMore', v)} />
                        <TextField label="الأكثر رواجاً" value={texts.blog.trendingTitle} onChange={(v) => updateText('blog', 'trendingTitle', v)} />
                        <TextField label="عنوان النشرة" value={texts.blog.newsletterTitle} onChange={(v) => updateText('blog', 'newsletterTitle', v)} />
                        <TextField label="زر الاشتراك" value={texts.blog.subscribeButton} onChange={(v) => updateText('blog', 'subscribeButton', v)} />
                    </div>
                    <TextField label="الوصف الفرعي" value={texts.blog.subtitle} onChange={(v) => updateText('blog', 'subtitle', v)} multiline />
                </CollapsibleSection>

                {/* Footer */}
                <CollapsibleSection title="التذييل (Footer)" icon={<FileText size={16} />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField label="حقوق النشر" value={texts.footer.copyright} onChange={(v) => updateText('footer', 'copyright', v)} />
                        <TextField label="سياسة الخصوصية" value={texts.footer.privacyPolicy} onChange={(v) => updateText('footer', 'privacyPolicy', v)} />
                        <TextField label="شروط الخدمة" value={texts.footer.termsOfService} onChange={(v) => updateText('footer', 'termsOfService', v)} />
                        <TextField label="صُنع بـ" value={texts.footer.madeWith} onChange={(v) => updateText('footer', 'madeWith', v)} />
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
};

export default TextSettings;
