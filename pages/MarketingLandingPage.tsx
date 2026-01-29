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
    const [counters, setCounters] = useState({ users: 0, ads: 0, clients: 0 });

    // Animated counters
    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        const targets = { users: 50000, ads: 100000, clients: 1200 };
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounters({
                users: Math.floor(targets.users * progress),
                ads: Math.floor(targets.ads * progress),
                clients: Math.floor(targets.clients * progress)
            });

            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const features = [
        {
            icon: <Zap className="text-yellow-400" size={32} />,
            title: "سرعة خارقة",
            description: "إرسال حملاتك التسويقية بلمسة واحدة والوصول لآلاف العملاء في ثوانٍ"
        },
        {
            icon: <Target className="text-red-400" size={32} />,
            title: "استهداف ذكي",
            description: "تحديد جمهورك المثالي بدقة عالية لضمان أفضل عائد على الاستثمار"
        },
        {
            icon: <TrendingUp className="text-green-400" size={32} />,
            title: "نمو مضمون",
            description: "تحليلات متقدمة وإحصائيات فورية لتحسين أداء حملاتك باستمرار"
        },
        {
            icon: <Shield className="text-blue-400" size={32} />,
            title: "أمان وموثوقية",
            description: "حماية بياناتك وخصوصية عملائك بأعلى معايير الأمان الرقمي"
        },
        {
            icon: <Rocket className="text-purple-400" size={32} />,
            title: "انطلاقة سريعة",
            description: "ابدأ حملتك الأولى في أقل من 5 دقائق بدون تعقيدات"
        },
        {
            icon: <LineChart className="text-indigo-400" size={32} />,
            title: "تقارير تفصيلية",
            description: "متابعة دقيقة لكل حملة مع رسوم بيانية وإحصائيات شاملة"
        }
    ];

    const services = [
        {
            icon: <Globe className="text-cyan-400" size={40} />,
            title: "إنشاء موقع احترافي",
            description: "موقع ويب متكامل مصمم خصيصاً لعملك مع تصميم عصري وسريع، متوافق مع جميع الأجهزة",
            benefits: ["تصميم حصري", "استضافة مجانية", "دومين مخصص", "لوحة تحكم سهلة"]
        },
        {
            icon: <BarChart3 className="text-emerald-400" size={40} />,
            title: "لوحة تحكم متقدمة",
            description: "تحكم كامل في حملاتك التسويقية مع إحصائيات لحظية وتقارير تفصيلية عن أداء إعلاناتك",
            benefits: ["تحليلات فورية", "إدارة الحملات", "جدولة تلقائية", "تصدير التقارير"]
        },
        {
            icon: <MessageCircle className="text-pink-400" size={40} />,
            title: "دعم تسويقي احترافي",
            description: "فريق متخصص يساعدك في بناء استراتيجية تسويقية ناجحة وتحسين حملاتك بشكل مستمر",
            benefits: ["استشارات مجانية", "دعم 24/7", "تدريب شامل", "خطط مخصصة"]
        }
    ];

    const testimonials = [
        {
            name: "أحمد المالكي",
            role: "صاحب متجر إلكتروني",
            image: "👨‍💼",
            comment: "بفضل منصة هاني زادت مبيعاتي 300% في أول شهر! الواجهة سهلة والنتائج مذهلة"
        },
        {
            name: "فاطمة السعيد",
            role: "مديرة تسويق",
            image: "👩‍💼",
            comment: "أفضل منصة تسويق رقمي جربتها. الدعم الفني ممتاز والأدوات احترافية جداً"
        },
        {
            name: "خالد العتيبي",
            role: "رائد أعمال",
            image: "🧑‍💼",
            comment: "وفرت علي الكثير من الوقت والمال. الآن أدير جميع حملاتي من مكان واحد بكل سهولة"
        }
    ];

    const faqs = [
        {
            question: "ما هي منصة هاني؟",
            answer: "منصة هاني هي منصة تسويق رقمي متكاملة تساعدك على إنشاء وإدارة حملاتك الإعلانية والوصول لآلاف العملاء المحتملين بسهولة وفعالية."
        },
        {
            question: "كيف أبدأ استخدام المنصة؟",
            answer: "فقط تواصل معنا عبر WhatsApp، وسيقوم فريقنا بإنشاء حسابك وتدريبك على استخدام جميع الميزات في أقل من 30 دقيقة."
        },
        {
            question: "هل يوجد دعم فني؟",
            answer: "نعم، نوفر دعم فني متواصل 24/7 عبر WhatsApp والبريد الإلكتروني لمساعدتك في أي وقت."
        },
        {
            question: "ما هي تكلفة الخدمة؟",
            answer: "نقدم باقات مرنة تبدأ من 500 DZD شهرياً، مع إمكانية التخصيص حسب احتياجاتك. تواصل معنا للحصول على عرض خاص."
        },
        {
            question: "هل يمكنني تجربة المنصة قبل الاشتراك؟",
            answer: "بالتأكيد! نوفر تجربة مجانية لمدة 7 أيام لتجربة جميع الميزات والتأكد من أن المنصة تناسب احتياجاتك."
        }
    ];

    const whatsappNumber = "213123456789"; // غير هذا الرقم
    const whatsappMessage = "مرحباً! أريد معرفة المزيد عن منصة هاني";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <Layout>
            <div className="bg-slate-950 text-white" dir="rtl">
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-5xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-6 py-2 mb-8">
                                <Sparkles size={20} className="text-indigo-400" />
                                <span className="text-indigo-300 font-bold">منصة التسويق الرقمي الأولى في الجزائر</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                                <span className="text-white">اطلق </span>
                                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">نجاحك الرقمي</span>
                                <br />
                                <span className="text-white">مع منصة </span>
                                <span className="text-indigo-400">هاني</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                                وصل لآلاف العملاء في ثوانٍ • أنشئ موقعك الاحترافي • حلل نتائجك بدقة
                                <br />
                                <span className="text-indigo-400 font-bold">كل ما تحتاجه لنجاح تسويقي مضمون في منصة واحدة</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-wider transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50 flex items-center gap-3"
                                >
                                    <span className="relative z-10">ابدأ الآن مجاناً</span>
                                    <Zap size={24} className="relative z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </a>
                                <button className="px-10 py-5 border-2 border-white/20 rounded-2xl font-bold text-lg hover:bg-white/5 hover:border-indigo-400 transition-all flex items-center gap-3">
                                    <span>شاهد العرض التوضيحي</span>
                                    <Globe size={24} />
                                </button>
                            </div>

                            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Check size={18} className="text-green-400" />
                                    <span>بدون عقود طويلة</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={18} className="text-green-400" />
                                    <span>دعم فني 24/7</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={18} className="text-green-400" />
                                    <span>ضمان استرجاع المال</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                        >
                            <ChevronDown size={32} className="text-slate-500 animate-bounce" />
                        </motion.div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="py-20 bg-slate-900/50 border-y border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="text-center">
                                <div className="text-5xl md:text-6xl font-black text-indigo-400 mb-2">
                                    {counters.users.toLocaleString()}+
                                </div>
                                <div className="text-slate-400 text-lg">مستخدم نشط</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl md:text-6xl font-black text-purple-400 mb-2">
                                    {counters.ads.toLocaleString()}+
                                </div>
                                <div className="text-slate-400 text-lg">إعلان تم إرساله</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl md:text-6xl font-black text-pink-400 mb-2">
                                    {counters.clients.toLocaleString()}+
                                </div>
                                <div className="text-slate-400 text-lg">عميل راضٍ</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 px-4">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black mb-4">
                                لماذا <span className="text-indigo-400">منصة هاني</span>؟
                            </h2>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                مميزات قوية تجعلنا الخيار الأول لآلاف الشركات الناجحة
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group bg-slate-900 border border-white/5 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all cursor-pointer"
                                >
                                    <div className="mb-4 transform group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-black mb-3 text-white group-hover:text-indigo-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-24 px-4 bg-slate-900/30">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black mb-4">
                                خدماتنا <span className="text-purple-400">الشاملة</span>
                            </h2>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                كل ما تحتاجه لبناء وتنمية عملك الرقمي في مكان واحد
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all"
                                >
                                    <div className="mb-6">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 text-white">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-300 mb-6 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {service.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-slate-400">
                                                <Check size={18} className="text-green-400 flex-shrink-0" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-24 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-12">
                            <h2 className="text-4xl md:text-5xl font-black mb-8 text-center">
                                فوائد <span className="text-indigo-400">لا تُحصى</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    "وصول مستهدف للمستهلكين في منطقتك",
                                    "عرض العروض والتخفيضات بشكل جذاب",
                                    "مساحة إعلانية رقمية ذكية",
                                    "معرض إلكتروني لمنتجاتك وخدماتك",
                                    "جوائز وتكريم لأفضل المتاجر",
                                    "إحصائيات دقيقة لنمو أعمالك",
                                    "دعم الفئات الضعيفة والمحتاجين",
                                    "مسابقات وفعاليات تفاعلية"
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        viewport={{ once: true }}
                                        className="flex items-start gap-4 bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all"
                                    >
                                        <Star size={24} className="text-yellow-400 flex-shrink-0 mt-1" />
                                        <span className="text-lg text-slate-200">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24 px-4 bg-slate-900/30">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black mb-4">
                                ماذا يقول <span className="text-pink-400">عملاؤنا</span>؟
                            </h2>
                            <p className="text-xl text-slate-400">
                                قصص نجاح حقيقية من أصحاب أعمال مثلك
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-slate-800 border border-white/10 rounded-3xl p-8 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-300 mb-6 leading-relaxed text-lg">
                                        "{testimonial.comment}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">{testimonial.image}</div>
                                        <div>
                                            <div className="font-bold text-white">{testimonial.name}</div>
                                            <div className="text-sm text-slate-500">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black mb-4">
                                أسئلة <span className="text-indigo-400">شائعة</span>
                            </h2>
                            <p className="text-xl text-slate-400">
                                إجابات سريعة على أكثر الأسئلة تكراراً
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                                        className="w-full flex items-center justify-between p-6 text-right hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="text-xl font-bold text-white">{faq.question}</span>
                                        <ChevronDown
                                            size={24}
                                            className={`text-indigo-400 transition-transform ${activeQuestion === index ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {activeQuestion === index && (
                                        <div className="px-6 pb-6 text-slate-300 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-32 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto max-w-4xl text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                                <span className="text-white">ابدأ رحلتك نحو </span>
                                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                                    النجاح الرقمي
                                </span>
                            </h2>
                            <p className="text-2xl text-slate-300 mb-12 leading-relaxed">
                                انضم لآلاف الشركات الناجحة واحصل على تجربة مجانية لمدة 7 أيام
                                <br />
                                <span className="text-indigo-400 font-bold">بدون بطاقة ائتمان • بدون التزام</span>
                            </p>

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-500 px-12 py-6 rounded-2xl font-black text-2xl uppercase tracking-wider hover:scale-105 transition-all shadow-2xl shadow-green-500/50 hover:shadow-green-500/70"
                            >
                                <MessageCircle size={32} />
                                <span>تواصل معنا الآن</span>
                            </a>

                            <div className="mt-8 text-slate-400">
                                أو اتصل بنا: <span className="text-white font-bold">+213 123 456 789</span>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default MarketingLandingPage;
