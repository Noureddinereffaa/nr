import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Target, Shield, Phone, MessageCircle, Check, Award,
    ChevronDown, Rocket, Search, Code2, Globe, Star, ArrowLeft,
    Quote, ShieldCheck, BarChart3, AppWindow, Cpu, LayoutDashboard,
    MousePointer2, Megaphone, Users2, FileText, Scale, LucideIcon
} from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/seo/SEO';

const MarketingLandingPage: React.FC = () => {
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
    const [counters, setCounters] = useState({ users: 0, ads: 0, shops: 0 });

    useEffect(() => {
        const targets = { users: 28450, ads: 62100, shops: 1240 };
        const duration = 2000;
        const steps = 60;
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

    const haniDetailedServices = [
        {
            title: "الإشهار والترويج الرقمي",
            desc: "نشر إعلانات محلك عبر منصة هاني الرسمية وشبكات التواصل الاجتماعي التابعة لها ليصل صوتك لآلاف المستهلكين مجاناً.",
            icon: Megaphone,
            color: "text-indigo-400"
        },
        {
            title: "نظام توجيه الزبائن الذكي",
            desc: "توجيه المستهلكين وطنياً بناءً على موقعهم الجغرافي واحتياجاتهم مباشرة نحو محلك التجاري المتعاقد.",
            icon: MousePointer2,
            color: "text-purple-400"
        },
        {
            title: "المشاركة في المسابقات الوطنية",
            desc: "الحق في التنافس على لقب 'أحسن محل' والحصول على أوسمة الجودة والاحترافية المعتمدة من المنظمة.",
            icon: Star,
            color: "text-amber-400"
        },
        {
            title: "المعرض الرقمي الدائم",
            desc: "مساحة مخصصة لعرض منتجاتك وخدماتك بأسلوب احترافي مع صور ومعلومات اتصال دقيقة ومحدثة.",
            icon: LayoutDashboard,
            color: "text-blue-400"
        },
        {
            title: "تقارير سلوك المستهلك",
            desc: "الحصول على بيانات وتحليلات مبدئية حول تفاعل المستهلكين مع عروضك وكيفية تحسينها.",
            icon: BarChart3,
            color: "text-emerald-400"
        },
        {
            title: "المرافق التقنية والقانونية",
            desc: "دعم إعلامي وتقني من المدير الولائي لضمان التزام محلك بمعايير حماية المستهلك والقوانين الرقمية.",
            icon: Shield,
            color: "text-indigo-400"
        }
    ];

    const noureddineServices = [
        {
            title: "تصميم المواقع والتطبيقات السيادية",
            desc: "إنشاء مواقع إلكترونية (Landing Pages, E-commerce, Portals) احترافية بمعايير عالمية وسرعة خارقة، مخصصة لثقافة السوق الجزائري.",
            features: ["دعم RTL بالكامل", "توافق مع الهواتف", "استضافة آمنة"],
            icon: Globe,
            price: "بأسعار تنافسية"
        },
        {
            title: "لوحات التحكم وأنظمة الإدارة (ERP/CRM)",
            desc: "بناء أنظمة داخلية ذكية لإدارة المخازن، الزبائن، والموظفين، مع إمكانية الوصول من أي مكان وفي أي وقت.",
            features: ["تحليلات مباشرة", "إدارة صلاحيات", "تقارير دورية"],
            icon: Cpu,
            price: "خطط مرنة"
        },
        {
            title: "أتمتة العمليات بالذكاء الاصطناعي",
            desc: "استخدام أدوات الذكاء الاصطناعي لأتمتة المهام المتكررة، مثل الرد التلقائي، تحليل البيانات، وقرارات التسعير الذكية.",
            features: ["توفير 80% من الوقت", "دقة متناهية", "روبوتات دردشة"],
            icon: Zap,
            price: "أعلى جودة"
        },
        {
            title: "الخطط التسويقية والاستشارية",
            desc: "بناء استراتيجية تسويق كاملة لنشاطك، تشمل تحديد الجمهور المستهدف، الميزانية، وقنوات النشر لضمان أعلى عائد.",
            features: ["دراسة سوق", "حملات مستهدفة", "تطوير الهوية"],
            icon: Target,
            price: "أهداف مضمونة"
        }
    ];

    const whatsappNumber = "213123456789";
    const whatsappLink = (msg: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;

    return (
        <Layout>
            <SEO
                title="منصة هاني | الرقمنة الشاملة بإشراف نورالدين رفعة"
                description="ابدأ رحلة التحول الرقمي لمنشأتك الاقتصادية في الجزائر. انضم مجاناً لبرنامج هاني أو اطلب خدمات الرقمنة الاحترافية والأنظمة الذكية من نورالدين رفعة."
            />
            <div className="bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans" dir="rtl">

                {/* Branding Stripe */}
                <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 py-3">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-xs">H</div>
                            <span className="font-black text-sm tracking-tighter">HANI PLATFORM</span>
                        </div>
                        <div className="text-[10px] md:text-sm font-bold text-slate-400">
                            مدير المشاريع: <span className="text-white">نورالدين رفعة</span>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="relative pt-20 pb-20 md:pt-32 md:pb-32">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.15)_0%,transparent_50%)]"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-5xl mx-auto text-center md:text-right">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-5 py-2 mb-8"
                            >
                                <Scale className="text-indigo-400" size={16} />
                                <span className="text-indigo-300 font-bold text-xs md:text-sm uppercase tracking-widest">تحت إشراف منظمة ANPCECOM</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter"
                            >
                                رقمن نشاطك <br />
                                <span className="text-indigo-500">بمعايير عالمية</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-xl md:text-3xl text-slate-400 mb-12 max-w-4xl leading-relaxed font-medium"
                            >
                                طريقك المختصر نحو السيادة الرقمية والنمو الاقتصادي الحقيقي في السوق الجزائري.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col md:flex-row gap-6 justify-center md:justify-start"
                            >
                                <a
                                    href={whatsappLink("مرحباً أستاذ نورالدين، أرغب في الانضمام لبرنامج هاني ورقمنة نشاطي")}
                                    aria-label="تواصل عبر واتساب للانضمام للبرنامج"
                                    className="group px-10 py-6 bg-white text-slate-950 font-black text-xl rounded-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-indigo-500/10"
                                >
                                    باشر العمل الآن
                                    <ArrowLeft size={24} className="rotate-180 group-hover:translate-x-[-10px] transition-transform" />
                                </a>
                                <button
                                    aria-label="استعراض الخدمات"
                                    className="px-10 py-6 border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl font-black text-xl hover:bg-white/10 transition-all"
                                >
                                    استعراض الخدمات
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Hani Program Services Detailed */}
                <section className="py-32 px-4 bg-slate-900/50">
                    <div className="container mx-auto max-w-7xl">
                        <div className="flex flex-col lg:flex-row gap-20 items-start">
                            <div className="lg:w-1/3 sticky top-40">
                                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                                    مميزات برنامج <br />
                                    <span className="text-indigo-500 italic">هاني الرسمي</span>
                                </h2>
                                <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                                    بصفتي مديراً ولائياً للبرنامج، أضمن لك الحصول على كافة الحقوق والامتيازات التي تنص عليها اتفاقية الشراكة مع منظمة حماية المستهلك.
                                </p>
                                <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl">
                                    <div className="flex items-center gap-3 text-indigo-400 font-black text-lg mb-2">
                                        <Check size={24} />
                                        <span>مجاني تماماً</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed">
                                        جميع الخدمات المذكورة في هذا القسم مقدمة مجاناً للمتعاملين الاقتصاديين المنخرطين في البرنامج الوطني.
                                    </p>
                                </div>
                            </div>
                            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {haniDetailedServices.map((service, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-8 bg-slate-950 border border-white/5 rounded-[2rem] hover:border-indigo-500/30 transition-all group"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/5 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                            <service.icon size={28} className={service.color} />
                                        </div>
                                        <h3 className="text-2xl font-black mb-4">{service.title}</h3>
                                        <p className="text-slate-400 leading-relaxed font-medium text-sm md:text-base">
                                            {service.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Noureddine's Premium Services */}
                <section className="py-32 px-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
                    <div className="container mx-auto max-w-7xl relative z-10">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-7xl font-black mb-6">خدماتي <span className="text-indigo-500">للاحتراف المطلق</span></h2>
                            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
                                لمن يرغب في التفوق وبناء كيان رقمي مستقل وقوي. أضع خبرتي في تطوير الأنظمة لإعطائك الأفضلية التنافسية.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {noureddineServices.map((service, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="group relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem] hover:from-indigo-500/50 transition-all duration-700"
                                >
                                    <div className="bg-slate-950 rounded-[2.9rem] p-10 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                                                <service.icon size={36} className="text-white" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">السعر</div>
                                                <div className="text-2xl font-black text-white">{service.price}</div>
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black mb-6 group-hover:text-indigo-400 transition-colors">{service.title}</h3>
                                        <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                                            {service.desc}
                                        </p>
                                        <div className="mt-auto pt-8 border-t border-white/5 grid grid-cols-1 xs:grid-cols-3 gap-4">
                                            {service.features.map((f, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                    {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-20 text-center">
                            <a
                                href={whatsappLink("أرغب في استشارة حول خدمات الرقمنة الشاملة (مواقع، أنظمة، خطة تسويقية)")}
                                className="inline-flex items-center gap-4 px-12 py-7 bg-indigo-600 text-white font-black text-2xl rounded-3xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
                            >
                                <MessageCircle size={32} />
                                طلب استشارة رقمية شاملة
                            </a>
                        </div>
                    </div>
                </section>

                {/* Direct CTA Section */}
                <section className="py-40 px-4 bg-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
                    <div className="container mx-auto flex flex-col items-center text-center relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-32 h-32 rounded-[3rem] bg-white text-indigo-600 flex items-center justify-center text-5xl font-black mb-12 shadow-2xl"
                        >
                            NR
                        </motion.div>
                        <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight max-w-5xl">
                            لا تترك نجاحك للصدفة. <br />
                            <span className="text-indigo-200">الرقمنة هي لغة العصر.</span>
                        </h2>
                        <p className="text-xl md:text-3xl text-indigo-100 mb-16 max-w-3xl font-medium opacity-90">
                            سواء كنت تريد الانضمام للبرنامج المجاني أو بناء نظامك الخاص، أنا هنا لأقودك نحو النجاح.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center">
                            <a
                                href={whatsappLink("أرغب في الانضمام لبرنامج هاني مجاناً")}
                                className="flex-1 px-8 py-6 bg-slate-950 text-white font-black text-xl rounded-2xl border-2 border-white/10 hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
                            >
                                التسجيل في برنامج هاني
                            </a>
                            <a
                                href={whatsappLink("أرغب في طلب خدمات الرقمنة الاحترافية والأنظمة الذكية")}
                                className="flex-1 px-8 py-6 bg-white text-indigo-600 font-black text-xl rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/20"
                            >
                                طلب خدماتي الاحترافية
                            </a>
                        </div>
                    </div>
                </section>

                <footer className="py-20 border-t border-white/5 bg-slate-950">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-10 text-right">
                            <div>
                                <div className="text-2xl font-black text-indigo-400 mb-2">منصة هاني | الجزائر</div>
                                <p className="text-slate-500 max-w-xs text-sm font-bold">
                                    مبادرة وطنية للرقمنة تحت إشراف المنظمة الوطنية لإرشاد المستهلك وحمايته في التجارة الإلكترونية.
                                </p>
                            </div>
                            <div className="flex flex-row-reverse flex-wrap justify-center gap-8 text-slate-400 font-bold text-sm">
                                <a href="#" className="hover:text-white transition-colors">عن البرنامج</a>
                                <a href="#" className="hover:text-white transition-colors">الخدمات</a>
                                <a href="#" className="hover:text-white transition-colors">القواعد القانونية</a>
                                <a href="#" className="hover:text-white transition-colors">تواصل مباشر</a>
                            </div>
                        </div>
                        <div className="mt-20 pt-10 border-t border-white/5 text-center text-slate-600 text-xs font-bold space-y-2">
                            <p>© 2026 جميع الحقوق محفوظة لبرنامج هاني | إدارة: نورالدين رفعة.</p>
                            <p className="opacity-50">توقيع الاتفاقية الرسمية وسجل تجاري/اعتماد مطلوب للانضمام للبرنامج.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </Layout>
    );
};

export default MarketingLandingPage;
