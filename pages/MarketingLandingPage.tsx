import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Target, Shield, Phone, MessageCircle, Check, Award,
    ChevronDown, Rocket, Search, Code2, Globe, Star, ArrowLeft,
    Quote, ShieldCheck, BarChart3
} from 'lucide-react';
import Layout from '../components/Layout';

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

    const stepsItems = [
        {
            title: "توقيع الاتفاقية",
            desc: "توقيع اتفاقية الشراكة الرسمية مع برنامج هاني والمنظمة الوطنية ANPCECOM.",
            icon: <Award className="text-amber-400" size={24} />
        },
        {
            title: "التشخيص الرقمي",
            desc: "دراسة نشاطك التجاري وتحديد الفجوات الرقمية والفرص المتاحة للنمو.",
            icon: <Search className="text-indigo-400" size={24} />
        },
        {
            title: "التنفيذ والرقمنة",
            desc: "بناء الموقع، لوحة التحكم، وأتمتة العمليات بأحدث تقنيات الذكاء الاصطناعي.",
            icon: <Code2 className="text-purple-400" size={24} />
        },
        {
            title: "الانطلاق والتوسع",
            desc: "إطلاق الخطة التسويقية المستهدفة ومتابعة النتائج لحظة بلحظة.",
            icon: <Rocket className="text-emerald-400" size={24} />
        }
    ];

    const pricing = [
        {
            name: "الباقة الأساسية (هاني)",
            price: "مجاني",
            desc: "الوجود الرقمي الأساسي تحت إشراف المنظمة والبرنامج الوطني.",
            features: [
                "إشهار مجاني عبر منصة هاني",
                "توجيه الزبائن وطنياً",
                "المشاركة في المسابقات الوطنية",
                "معرض إلكتروني للسلع والخدمات",
                "مرافقة تقنية من المدير الولائي"
            ],
            cta: "انضم للبرنامج مجاناً",
            highlight: false
        },
        {
            name: "باقة الرقمنة الشاملة",
            price: "عرض خاص",
            desc: "تحويل نشاطك إلى مؤسسة رقمية ذكية بأقل التكاليف وأقوى الخطط.",
            features: [
                "موقع إلكتروني احترافي خاص",
                "لوحة تحكم إدارية متكاملة",
                "أنظمة أتمتة بالذكاء الاصطناعي",
                "خطة تسويقية سنوية مدروسة",
                "دعم فني استرايتجي 24/7"
            ],
            cta: "رقمن نشاطك الآن",
            highlight: true
        }
    ];

    const whatsappNumber = "213123456789";
    const whatsappMessage = "مرحباً أستاذ نورالدين، أرغب في الانضمام لبرنامج هاني والتعرف على عروض الرقمنة الشاملة";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <Layout>
            <div className="bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden" dir="rtl">
                {/* Branding Stripe */}
                <div className="bg-gradient-to-r from-indigo-950 via-slate-950 to-indigo-950 py-3 border-b border-indigo-500/10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
                    <p className="text-xs md:text-sm font-bold tracking-widest text-indigo-300 relative z-10">
                        إدارة: <span className="text-white">نورالدين رفعة</span> - مدير مشاريع رقمية • معتمد من المنظمة الوطنية ANPCECOM
                    </p>
                </div>

                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center pt-10 pb-20">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-5xl mx-auto text-center md:text-right">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 mb-10 shadow-2xl"
                            >
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-950 flex items-center justify-center text-xs font-black">N</div>
                                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-950 flex items-center justify-center text-xs font-black">R</div>
                                </div>
                                <span className="text-indigo-400 font-black text-sm md:text-base border-r border-white/10 pr-4 ml-4">رؤية رقمية جزائرية</span>
                                <span className="text-slate-400 text-sm hidden md:block">خبير في تحصين وتطوير المنشآت الاقتصادية</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl md:text-8xl font-black mb-10 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-500"
                            >
                                ابنِ مستقبل <br className="hidden md:block" />
                                <span className="text-indigo-500">منشأتك بذكاء</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl md:text-3xl text-slate-400 mb-12 max-w-4xl leading-relaxed"
                            >
                                بصفتي <span className="text-white font-bold">نورالدين رفعة</span>، المدير الولائي لبرنامج هاني، أقدم لكم المفتاح الحقيقي للرقمنة.
                                انضم للبرنامج الوطني <span className="text-indigo-400 underline underline-offset-8">مجاناً</span>،
                                أو اختر خدمات الرقمنة الشاملة لتنقل نشاطك لمستوى الاحتراف العالمي.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col md:flex-row gap-6 justify-center md:justify-start"
                            >
                                <a
                                    href={whatsappLink}
                                    className="group relative px-12 py-7 bg-white text-slate-950 font-black text-xl rounded-3xl flex items-center gap-4 hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/10"
                                >
                                    باشر رحلة الرقمنة الآن
                                    <ArrowLeft size={24} className="group-hover:translate-x-[-10px] transition-transform rotate-180" />
                                </a>
                                <button className="px-12 py-7 border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl font-black text-xl hover:bg-white/10 transition-all flex items-center gap-4">
                                    <Globe size={24} />
                                    اكتشف خدمات البرنامج
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Strategy Section (Why Noureddine Reffaa) */}
                <section className="py-32 px-4 relative">
                    <div className="absolute top-1/2 left-0 w-1/3 h-1 bg-gradient-to-r from-transparent to-indigo-500/20 blur-sm pointer-events-none"></div>
                    <div className="container mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center text-right">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                                    لماذا العمل مع <br />
                                    <span className="text-indigo-500">نورالدين رفعة؟</span>
                                </h2>
                                <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                                    لا أقدم مجرد "موقع إلكتروني"، بل أبني لك <span className="text-white">نظاماً اقتصادياً رقمياً كاملاً</span>.
                                    بناءً على خبرتي في إدارة المشاريع الرقمية وشراكتي الرسمية مع منظمة حماية المستهلك، أضمن لك:
                                </p>
                                <div className="space-y-6 text-right">
                                    {[
                                        { t: "التأصيل القانوني", d: "كل حلولنا تتوافق مع القوانين الجزائرية وتحت مظلة منظمة ANPCECOM." },
                                        { t: "أقوى الخطط بأقل الأسعار", d: "نكسر حاجز التكلفة لنقدم رقمنة حقيقية في متناول كل تاجر ومؤسسة." },
                                        { t: "الذكاء الاصطناعي التطبيقي", d: "ليس مجرد كلام، بل أدوات أتمتة فعلية توفر عليك الوقت والجهد." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-row-reverse gap-5 p-6 bg-white/5 border border-white/10 rounded-3xl group hover:border-indigo-500/30 transition-all">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform flex-shrink-0">
                                                <Target size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black mb-1">{item.t}</h4>
                                                <p className="text-slate-400 text-sm">{item.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative order-first lg:order-last">
                                <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[4rem] rotate-3 overflow-hidden shadow-2xl relative transform hover:rotate-0 transition-transform duration-700">
                                    <div className="absolute inset-0 flex items-center justify-center text-[10rem] opacity-20 select-none">📊</div>
                                    <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-slate-950 to-transparent">
                                        <div className="text-3xl font-black">رقمنة بلا حدود</div>
                                        <div className="text-indigo-300">نحو ريادة الأعمال الرقمية</div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-slate-900 border border-white/10 p-6 rounded-[2.5rem] shadow-2xl animate-bounce">
                                    <div className="text-indigo-400 font-black text-4xl mb-2">2026</div>
                                    <div className="text-xs text-slate-500 font-bold leading-tight">رؤية مستقبلية صلبة للسوق الجزائري</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service Tiers (The Differentiation) */}
                <section className="py-32 px-4 bg-slate-900/40 relative">
                    <div className="container mx-auto max-w-7xl relative z-10 text-center">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black mb-6">اختر طريقك نحو <span className="text-indigo-500">النمو</span></h2>
                            <p className="text-xl text-slate-500">نقدم خيارين أساسيين لتلبية احتياجاتك، سواء كنت تبدأ الآن أو تريد الريادة.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto text-right">
                            {pricing.map((plan, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className={`relative p-10 rounded-[3rem] border-2 flex flex-col h-full overflow-hidden ${plan.highlight
                                            ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_50px_rgba(79,70,229,0.3)]'
                                            : 'bg-slate-900 border-white/5'
                                        }`}
                                >
                                    {plan.highlight && (
                                        <div className="absolute top-8 left-[-40px] bg-amber-400 text-slate-950 font-black text-[10px] px-12 py-1 rotate-[-45deg] uppercase tracking-widest">الموصى به</div>
                                    )}
                                    <h3 className="text-3xl font-black mb-2">{plan.name}</h3>
                                    <div className="text-4xl font-black mb-6 flex items-baseline gap-2 justify-end">
                                        <span className="text-sm font-medium opacity-70 order-last">{plan.highlight ? '/ دفع لمرة واحدة' : ''}</span>
                                        {plan.price}
                                    </div>
                                    <p className={`mb-8 font-medium ${plan.highlight ? 'text-indigo-100' : 'text-slate-500'}`}>
                                        {plan.desc}
                                    </p>
                                    <div className="flex-1 space-y-4 mb-10">
                                        {plan.features.map((f, idx) => (
                                            <div key={idx} className="flex flex-row-reverse items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-white/20' : 'bg-indigo-500/10'}`}>
                                                    <Check size={14} className={plan.highlight ? 'text-white' : 'text-indigo-400'} />
                                                </div>
                                                <span className={`font-bold ${plan.highlight ? 'text-white' : 'text-slate-300'}`}>{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <a
                                        href={whatsappLink}
                                        className={`w-full py-5 rounded-2xl font-black text-center transition-all ${plan.highlight
                                                ? 'bg-white text-indigo-600 hover:bg-slate-100'
                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'
                                            }`}
                                    >
                                        {plan.cta}
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Workflow (From Traditional to Digital) */}
                <section className="py-32 px-4 overflow-hidden">
                    <div className="container mx-auto max-w-7xl text-center">
                        <div className="text-right mb-20 lg:text-center">
                            <h2 className="text-4xl md:text-6xl font-black mb-6">رحلة الرقمنة <span className="text-indigo-500">في 4 خطوات</span></h2>
                            <p className="text-xl text-slate-500">كيف ننقل محلك من العالم التقليدي إلى القمة الرقمية.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative text-right">
                            <div className="hidden lg:block absolute top-[60px] left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent pointer-events-none"></div>

                            {stepsItems.map((step, i) => (
                                <div key={i} className="relative z-10 p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] group hover:bg-indigo-600 transition-all duration-500">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-indigo-600 transition-colors shadow-xl">
                                        {step.icon}
                                    </div>
                                    <div className="text-slate-600 font-black text-4xl mb-4 group-hover:text-white/20">0{i + 1}</div>
                                    <h4 className="text-xl font-black mb-3 group-hover:text-white">{step.title}</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-indigo-100">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Personal Mission Statement */}
                <section className="py-32 px-4 bg-indigo-600 text-white relative">
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px] pointer-events-none"></div>
                    <div className="container mx-auto max-w-4xl text-center relative z-10">
                        <Quote className="mx-auto mb-10 w-20 h-20 opacity-20" />
                        <h2 className="text-3xl md:text-5xl font-black mb-10 leading-snug">
                            "رسالتي ليست فقط الرقمنة، بل تمكين كل تاجر جزائري من أدوات الذكاء الاصطناعي لينافس بقوة في السوق العالمي والمحلي."
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-indigo-600 text-2xl font-black mb-4 shadow-2xl">NR</div>
                            <div className="font-black text-2xl mb-1 text-white">نورالدين رفعة</div>
                            <div className="text-indigo-200 font-bold uppercase tracking-widest text-sm">مدير مشاريع رقمية | مدير ولاي لبرنامج هاني</div>
                        </div>
                    </div>
                </section>

                {/* Final Call to Action */}
                <section className="py-40 px-4 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
                    <div className="container mx-auto max-w-6xl text-center relative z-10">
                        <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tight">
                            هل أنت مستعد <br className="hidden md:block" />
                            لإحداث <span className="text-indigo-500 italic">الفرق؟</span>
                        </h2>
                        <div className="flex flex-col items-center gap-10">
                            <a
                                href={whatsappLink}
                                className="group px-16 py-8 bg-white text-slate-950 rounded-[3rem] font-black text-3xl flex items-center gap-6 hover:scale-110 active:scale-100 transition-all shadow-2xl shadow-white/10"
                            >
                                <MessageCircle size={40} className="text-green-600" />
                                تواصل معي مباشرة
                            </a>
                            <div className="flex flex-wrap justify-center gap-10 text-slate-500 font-bold uppercase tracking-widest text-xs">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-indigo-500" />
                                    ضمان الجودة والشرعية
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={16} className="text-indigo-500" />
                                    تنفيذ سريع واحترافي
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star size={16} className="text-indigo-500" />
                                    دعم فني مستمر
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="py-20 border-t border-white/5 bg-slate-950">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-10 text-right">
                            <div>
                                <div className="text-2xl font-black text-indigo-400 mb-2">منصة هاني | الجزائر</div>
                                <p className="text-slate-500 max-w-xs text-sm">
                                    مبادرة وطنية للرقمنة تحت إشراف المنظمة الوطنية لإرشاد المستهلك وحمايته في التجارة الإلكترونية.
                                </p>
                            </div>
                            <div className="flex flex-row-reverse gap-8 text-slate-400 font-bold text-sm">
                                <a href="#" className="hover:text-white transition-colors">عن البرنامج</a>
                                <a href="#" className="hover:text-white transition-colors">الخدمات</a>
                                <a href="#" className="hover:text-white transition-colors">القواعد القانونية</a>
                                <a href="#" className="hover:text-white transition-colors">اتصل بنا</a>
                            </div>
                        </div>
                        <div className="mt-16 pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
                            <p>© 2026 جميع الحقوق محفوظة لبرنامج هاني - إدارة نورالدين رفعة (المقاول الذاتي).</p>
                        </div>
                    </div>
                </footer>
            </div>
        </Layout>
    );
};

export default MarketingLandingPage;
