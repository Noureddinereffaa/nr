import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Target, TrendingUp, MessageCircle, Award, BarChart3,
    Rocket, Shield, Users, Globe, Star, Check, Phone, Mail,
    ChevronDown, Sparkles, LineChart, DollarSign
} from 'lucide-react';
import Layout from '../components/Layout';

const MarketingLandingPage: React.FC = () => {
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
    const [counters, setCounters] = useState({ users: 0, ads: 0, shops: 0 });

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const targets = { users: 25000, ads: 45000, shops: 850 };
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounters({
                users: Math.floor(targets.users * progress),
                ads: Math.floor(targets.ads * progress),
                shops: Math.floor(targets.shops * progress)
            });
            if (step >= steps) clearInterval(timer);
        }, duration / steps);

        return () => clearInterval(timer);
    }, []);

    const haniBenefits = [
        {
            title: "إشهار إلكتروني مجاني",
            description: "توفير الإشهار لمحلك عبر المنصة الرقمية التفاعلية لبرنامج هاني ليصل جمهورك أينما كان."
        },
        {
            title: "توجيه الزبائن وطنياً",
            description: "توجيه المستهلكين من كافة الولايات نحو محلك عبر آليات إشهار معتمدة وطنياً."
        },
        {
            title: "مسابقة أحسن محل",
            description: "المشاركة في مسابقة تقييم أحسن محل التي تنظمها المنظمة وفق شروط احترافية."
        },
        {
            title: "معرض إلكتروني متكامل",
            description: "عرض كافة السلع والخدمات مع بيانات الاتصال والصور عبر منصة برنامج هاني الرسمية."
        },
        {
            title: "دراسات سلوك المستهلك",
            description: "الحصول على مؤشرات وتحليلات دقيقة تساعدك في توجيه استثماراتك وتحسين نشاطك."
        },
        {
            title: "مرافقة تقنية وإعلامية",
            description: "دعم فني متخصص في كيفية استغلال المنصة الرقمية لزيادة مبيعاتك بفعالية."
        }
    ];

    const premiumServices = [
        {
            icon: <Globe className="text-indigo-400" size={40} />,
            title: "رقمنة شاملة للمنشأة",
            description: "إنشاء موقع إلكتروني احترافي كامل مخصص لنشاطك، متوافق مع جميع الأجهزة ويعكس هويتك التجارية.",
            features: ["دومين مخصص", "تصميم عصري", "سرعة أداء عالية"]
        },
        {
            icon: <Zap className="text-amber-400" size={40} />,
            title: "أنظمة الذكاء الاصطناعي",
            description: "تحويل عملك إلى مؤسسة ذكية باستخدام أدوات تحليل البيانات والذكاء الاصطناعي لتحسين تجربة العملاء.",
            features: ["تحليلات ذكية", "أتمتة العمليات", "تنبؤ بالطلبات"]
        },
        {
            icon: <BarChart3 className="text-emerald-400" size={40} />,
            title: "إدارة وتسويق متكامل",
            description: "لوحة تحكم إدارية متطورة مع خطة تسويقية شاملة تستهدف جمهورك بدقة لضمان أعلى عوائد.",
            features: ["لوحة تحكم كاملة", "خطة تسويق", "دعم الدفع الإلكتروني"]
        }
    ];

    const targetEntities = [
        "مطاعم وفنادق", "عيادات ومراكز طبية", "مدارس ومراكز تكوين",
        "شركات ومصانع", "حرفيين ومقاولين ذاتيين", "وكالات سياحية وعقارية"
    ];

    const faqs = [
        {
            question: "ما هي تكلفة الانضمام لبرنامج هاني؟",
            answer: "الانضمام والخدمات القاعدية في برنامج هاني مجانية تماماً للمتعاملين الاقتصاديين بموجب اتفاقية الشراكة مع المنظمة."
        },
        {
            question: "من هي الجھة المشرفة على البرنامج؟",
            answer: "البرنامج تحت إشراف المنظمة الوطنية لإرشاد المستهلك وحمايته في التجارة الإلكترونية (ANPCECOM)."
        },
        {
            question: "ما الفرق بين البرنامج المجاني والخدمات المتقدمة؟",
            answer: "البرنامج يوفر الإشهار والوجود الرقمي الأساسي مجاناً، بينما نوفر خدمات مدفوعة للرقمنة الشاملة (مواقع خاصة، أنظمة ذكاء اصطناعي، خطط تسويق احترافية) لمن يرغب في احترافية أكبر."
        },
        {
            question: "كيف يتم توقيع الاتفاقية؟",
            answer: "يتم التواصل مع المدير الولائي للبرنامج لضبط موعد، تقديم الوثائق المطلوبة (سجل تجاري/اعتماد)، وتوقيع الاتفاقية رسمياً."
        }
    ];

    const whatsappNumber = "213123456789";
    const whatsappMessage = "أرغب في الانضمام لبرنامج هاني والتعرف على خدمات الرقمنة الشاملة لتجارتي";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <Layout>
            <div className="bg-slate-950 text-white min-h-screen" dir="rtl">
                {/* Hero section with Official Branding */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.15)_0%,transparent_50%)]"></div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-6 py-2 mb-8"
                        >
                            <Shield className="text-indigo-400" size={18} />
                            <span className="text-indigo-300 font-bold text-sm">بالشراكة مع المنظمة الوطنية ANPCECOM</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-7xl font-black mb-6 leading-tight"
                        >
                            برنامج <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">هاني</span> لرقمنة
                            <br />
                            <span className="text-white">التجارة والاقتصاد الوطني</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed"
                        >
                            رقمنة شاملة لنشاطك التجاري تحت إشراف منظمة حماية المستهلك.
                            <span className="text-indigo-400 font-bold block mt-2">انضم الآن مجاناً وابدأ رحلة التحول الرقمي الحقيقي.</span>
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xl flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-indigo-500/20"
                            >
                                <Phone size={24} />
                                تواصل مع المدير الولائي
                            </a>
                            <div className="flex items-center gap-4 text-slate-400 font-bold px-6">
                                <Check className="text-green-400" />
                                التسجيل القاعدي مجاني
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Agreement Stats */}
                <section className="py-12 border-y border-white/5 bg-slate-900/40">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-black text-indigo-400 mb-1">{counters.shops}+</div>
                                <div className="text-slate-500 font-bold">محل متعاقد</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-black text-purple-400 mb-1">{counters.users}+</div>
                                <div className="text-slate-500 font-bold">مستهلك موجه</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl md:text-5xl font-black text-pink-400 mb-1">{counters.ads}+</div>
                                <div className="text-slate-500 font-bold">إقرار إشهاري</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hani Benefits (Official Agreement) */}
                <section className="py-24 px-4 bg-slate-950">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-right mb-16">
                            <h2 className="text-3xl md:text-5xl font-black mb-4">ماذا تقدم لك <span className="text-indigo-400">اتفاقية هاني</span>؟</h2>
                            <p className="text-xl text-slate-400">بموجب المادة 2 من اتفاقية الشراكة، تلتزم إدارة البرنامج بمرافقتك في:</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {haniBenefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="p-8 bg-slate-900/50 border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all"
                                >
                                    <h3 className="text-xl font-black mb-3 text-indigo-300">{benefit.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Your Premium Services (Digitalization) */}
                <section className="py-24 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <div className="inline-block px-4 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-sm font-black mb-4">خدمات الرقمنة الاحترافية</div>
                            <h2 className="text-3xl md:text-5xl font-black mb-4">حلولنا للرقمنة <span className="text-indigo-400">الشاملة</span></h2>
                            <p className="text-xl text-slate-400 max-w-3xl mx-auto">نأخذ تجارتك إلى مستوى الاحتراف العالمي من خلال خدماتنا المتقدمة لنظام عمل ذكي ومتكامل.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {premiumServices.map((service, i) => (
                                <div key={i} className="bg-slate-800/50 border border-white/5 rounded-3xl p-10 hover:border-indigo-400/50 transition-all flex flex-col h-full">
                                    <div className="mb-6">{service.icon}</div>
                                    <h3 className="text-2xl font-black mb-4">{service.title}</h3>
                                    <p className="text-slate-400 mb-8 leading-relaxed h-24">{service.description}</p>
                                    <div className="mt-auto space-y-3">
                                        {service.features.map((f, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                                <Check size={14} className="text-indigo-400" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Target Audience */}
                <section className="py-20 px-4">
                    <div className="container mx-auto text-center">
                        <h2 className="text-2xl font-bold text-slate-500 mb-12 uppercase tracking-widest">من يستهدف البرنامج؟</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {targetEntities.map((item, i) => (
                                <span key={i} className="px-8 py-4 bg-slate-900 border border-white/5 rounded-2xl text-lg font-bold hover:text-indigo-400 transition-colors cursor-default">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA with Urgency */}
                <section className="py-32 px-4 relative">
                    <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none"></div>
                    <div className="container mx-auto max-w-4xl text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            كن شريكاً في <span className="text-indigo-400">التحول الرقمي</span> الجزائري
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-400 mb-12">
                            بصفتي مديراً ولائياً للبرنامج، سأرافقك خطوة بخطوة لتحويل مشروعك من مجرد محل تقليدي إلى مؤسسة رقمية عصرية وناجحة.
                        </p>
                        <div className="flex flex-col items-center gap-8">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group px-12 py-6 bg-green-600 hover:bg-green-500 rounded-[2rem] font-black text-2xl flex items-center gap-4 transition-all hover:scale-105"
                            >
                                <MessageCircle size={32} />
                                إرسال طلب انضمام رسمي
                            </a>
                            <div className="text-slate-500 flex items-center gap-2 font-bold p-4 border border-white/5 rounded-2xl bg-slate-900/50">
                                <Award className="text-amber-500" />
                                معتمد من المنظمة الوطنية لحماية المستهلك ANPCECOM
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-24 px-4 bg-slate-900/20">
                    <div className="container mx-auto max-w-3xl">
                        <h2 className="text-3xl font-black mb-12 text-center">الأسئلة الشائعة</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => setActiveQuestion(activeQuestion === i ? null : i)}
                                        className="w-full flex items-center justify-between p-6 text-right font-bold text-lg hover:bg-white/5 transition-all"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown className={`transition-transform duration-300 ${activeQuestion === i ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeQuestion === i && (
                                        <div className="px-6 pb-6 text-slate-400 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer simple */}
                <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
                    <p>© 2026 برنامج هاني - إدارة المدير الولائي للبرنامج - المقاول الذاتي. جميع الحقوق محفوظة.</p>
                </footer>
            </div>
        </Layout>
    );
};

export default MarketingLandingPage;
