import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Zap,
    Clock,
    Target,
    CheckCircle2,
    Star,
    ArrowRight,
    Bot,
    BarChart3,
    DollarSign,
    Users,
    Rocket,
    Shield,
    Lightbulb,
    Facebook,
    Linkedin,
    MessageCircle,
    TrendingUp,
    Award,
    Layers,
    Play,
    ChevronRight,
    MousePointer2,
    Cpu,
    Globe,
    Heart,
    BadgeCheck,
    Workflow,
    CircleDollarSign,
    Timer,
    Brain,
    Gauge,
    ArrowUpRight,
    Quote
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useSystem } from '../context/SystemContext';

const ReviewsPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const { serviceRequests } = useBusiness();
    const { siteData } = useSystem();
    const reviews = siteData.decisionPages || [];

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1
            }
        }
    };

    const scaleIn = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 }
    };

    // Enhanced categories
    const categories = [
        { id: 'all', label: 'All Tools', icon: Layers },
        { id: 'crm', label: 'CRM & Sales', icon: Users },
        { id: 'marketing', label: 'Marketing', icon: TrendingUp },
        { id: 'automation', label: 'Automation', icon: Workflow },
        { id: 'ai', label: 'AI Assistants', icon: Brain }
    ];

    // Enhanced features with more details
    const features = [
        {
            icon: CheckCircle2,
            title: "Hands-on Testing",
            text: "Every tool tested personally for 30+ days before review"
        },
        {
            icon: BarChart3,
            title: "Data-Driven Analysis",
            text: "Real metrics, benchmarks, and performance comparisons"
        },
        {
            icon: Users,
            title: "Real Use Cases",
            text: "Practical examples from coaches and store owners like you"
        },
        {
            icon: Target,
            title: "Honest Comparisons",
            text: "Side-by-side analysis with competitor alternatives"
        },
        {
            icon: DollarSign,
            title: "True Cost Analysis",
            text: "Hidden fees, pricing tiers, and ROI calculations"
        },
        {
            icon: Award,
            title: "Expert Verdict",
            text: "Clear recommendations based on your business type"
        }
    ];

    // Enhanced benefits with statistics
    const benefits = [
        {
            icon: Clock,
            title: "Save 20+ Hours Weekly",
            desc: "Stop researching. Get straight to proven solutions that work.",
            stat: "20+",
            statLabel: "Hours Saved"
        },
        {
            icon: Zap,
            title: "10x Your Efficiency",
            desc: "Automate repetitive tasks and focus on revenue growth.",
            stat: "10x",
            statLabel: "Efficiency"
        },
        {
            icon: Shield,
            title: "Risk-Free Decisions",
            desc: "Invest confidently with our battle-tested insights.",
            stat: "100%",
            statLabel: "Confidence"
        },
        {
            icon: Rocket,
            title: "Scale 3x Faster",
            desc: "Use proven AI tools that successful businesses rely on.",
            stat: "3x",
            statLabel: "Growth Rate"
        }
    ];

    // Testimonials
    const testimonials = [
        {
            quote: "These reviews saved me from wasting $500/month on the wrong tools. I found the perfect stack for my coaching business.",
            author: "Sarah Mitchell",
            role: "Business Coach",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
        },
        {
            quote: "Finally, honest reviews without affiliate bias. The comparison charts made my decision so much easier.",
            author: "James Rodriguez",
            role: "E-commerce Owner",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
        },
        {
            quote: "The ROI calculations alone are worth the read. I 10x'd my investment in just 3 months.",
            author: "Emma Chen",
            role: "Course Creator",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
        }
    ];

    // Stats
    const stats = [
        { value: `${Math.max(50, reviews.length)}+`, label: "Tools Reviewed", icon: Layers },
        { value: "10,000+", label: "Hours of Testing", icon: Timer },
        { value: "98%", label: "Accuracy Rate", icon: Target },
        { value: "$2M+", label: "Saved for Readers", icon: CircleDollarSign }
    ];

    const requests = (serviceRequests || []).filter(req => req.status === 'completed');
    const filteredReviews = activeCategory === 'all'
        ? reviews.filter(r => r.status === 'published')
        : reviews.filter(r => r.category === activeCategory && r.status === 'published');

    return (
        <div dir="ltr" className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 overflow-x-hidden relative font-sans">
            {/* Advanced Background System */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 mesh-gradient opacity-50"></div>
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[200px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full"></div>
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section - Enhanced */}
                <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center max-w-5xl mx-auto"
                        >
                            {/* Animated Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-xl mb-8"
                            >
                                <div className="relative">
                                    <Sparkles size={18} className="text-indigo-400" />
                                    <div className="absolute inset-0 animate-ping">
                                        <Sparkles size={18} className="text-indigo-400 opacity-50" />
                                    </div>
                                </div>
                                <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-widest">
                                    Trusted AI Reviews 2026
                                </span>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            </motion.div>

                            {/* Hero Title with Gradient Animation */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8"
                            >
                                Find the{' '}
                                <span className="relative inline-block">
                                    <span className="gradient-text">Perfect AI Tools</span>
                                    <motion.span
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full origin-left"
                                    />
                                </span>
                                <br />
                                <span className="text-slate-400">For Your Business</span>
                            </motion.h1>

                            {/* Subtitle with Typing Effect Look */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-6"
                            >
                                Expert reviews of AI automation tools for{' '}
                                <span className="text-white font-semibold">coaches</span>,{' '}
                                <span className="text-white font-semibold">course creators</span>, and{' '}
                                <span className="text-white font-semibold">e-commerce owners</span>.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12"
                            >
                                Every tool personally tested. No fluff. No fake reviews.
                                Just honest, data-driven insights to help you scale smarter.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                            >
                                <motion.a
                                    href="#reviews"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg shadow-2xl shadow-white/10 overflow-hidden flex items-center gap-3"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                    <span className="relative z-10 group-hover:text-white transition-colors">Explore Reviews</span>
                                    <ArrowRight size={20} className="relative z-10 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </motion.a>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group px-8 py-4 rounded-2xl font-bold text-lg border border-white/10 text-white hover:bg-white/5 transition-all flex items-center gap-3"
                                >
                                    <Play size={20} className="text-indigo-400" />
                                    <span>Watch How It Works</span>
                                </motion.button>
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex flex-wrap justify-center items-center gap-8 text-slate-500"
                            >
                                <div className="flex items-center gap-2">
                                    <BadgeCheck size={20} className="text-green-500" />
                                    <span className="text-sm font-medium">100% Independent</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield size={20} className="text-blue-500" />
                                    <span className="text-sm font-medium">Unbiased Reviews</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award size={20} className="text-amber-500" />
                                    <span className="text-sm font-medium">Expert Analysis</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 relative">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative glass-card rounded-3xl p-6 md:p-8 text-center hover:border-indigo-500/30 transition-all">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/10 mb-4">
                                            <stat.icon size={24} className="text-indigo-400" />
                                        </div>
                                        <div className="text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</div>
                                        <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Why AI Automation Section - Enhanced */}
                <section className="py-20 md:py-28 relative">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="text-center mb-16"
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                                <Bot size={16} className="text-indigo-400" />
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">The Automation Advantage</span>
                            </motion.div>

                            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                                Why Smart Businesses{' '}
                                <span className="gradient-text">Automate in 2026</span>
                            </motion.h2>

                            <motion.p variants={fadeInUp} className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                                The most successful coaches and e-commerce owners aren't working harder—they're working smarter.
                                AI automation is the great equalizer, letting small teams compete with enterprises.
                            </motion.p>
                        </motion.div>

                        {/* Benefits Grid - Enhanced with Stats */}
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <div className="relative h-full glass-card rounded-3xl p-8 hover:border-indigo-500/40 transition-all duration-500 overflow-hidden">
                                        {/* Background Number */}
                                        <div className="absolute -top-4 -right-4 text-[120px] font-black text-white/[0.02] leading-none pointer-events-none">
                                            {benefit.stat}
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                                                    <benefit.icon size={24} className="text-white" />
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-indigo-400">{benefit.stat}</div>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{benefit.statLabel}</div>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* What We Offer Section - Enhanced */}
                <section className="py-20 md:py-28 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950"></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left - Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                                    <Lightbulb size={16} className="text-purple-400" />
                                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Our Review Process</span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
                                    Reviews You Can{' '}
                                    <span className="text-purple-400">Actually Trust</span>
                                </h2>

                                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                    We don't just read feature lists. Each tool is personally tested for
                                    <span className="text-white font-semibold"> 30+ days</span> in real business scenarios.
                                    Our reviews answer the question that matters:{' '}
                                    <span className="text-purple-400 font-bold italic">"Will this tool actually help MY business?"</span>
                                </p>

                                {/* Features Grid */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.08 }}
                                            className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-all duration-300">
                                                <feature.icon size={18} className="text-purple-400 group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-1">{feature.title}</h4>
                                                <p className="text-slate-500 text-sm leading-relaxed">{feature.text}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Right - Interactive Visual */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="relative"
                            >
                                <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-purple-600/20 blur-3xl rounded-full opacity-60"></div>

                                <div className="relative">
                                    {/* Main Card */}
                                    <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl">
                                                    <Gauge size={32} className="text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-black text-white">Review Score</div>
                                                    <div className="text-sm text-slate-400">Based on 12 criteria</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-4xl font-black text-indigo-400">9.2</div>
                                                <div className="text-xs text-slate-500 font-bold uppercase">Excellent</div>
                                            </div>
                                        </div>

                                        {/* Animated Progress Bars */}
                                        <div className="space-y-5">
                                            {[
                                                { label: "Ease of Use", value: 95, color: "from-green-500 to-emerald-500" },
                                                { label: "Features", value: 92, color: "from-indigo-500 to-purple-500" },
                                                { label: "Value for Money", value: 88, color: "from-amber-500 to-orange-500" },
                                                { label: "Customer Support", value: 90, color: "from-cyan-500 to-blue-500" }
                                            ].map((item, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-slate-400 font-medium">{item.label}</span>
                                                        <span className="text-white font-bold">{item.value}%</span>
                                                    </div>
                                                    <div className="h-3 bg-slate-800/80 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${item.value}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                                                            className={`h-full bg-gradient-to-r ${item.color} rounded-full relative`}
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Bottom Stats */}
                                        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                                            {[
                                                { icon: Clock, label: "30 Days", desc: "Tested" },
                                                { icon: Users, label: "500+", desc: "Data Points" },
                                                { icon: CheckCircle2, label: "Verified", desc: "Results" }
                                            ].map((stat, i) => (
                                                <div key={i} className="text-center">
                                                    <stat.icon size={18} className="mx-auto mb-2 text-indigo-400" />
                                                    <div className="text-white font-bold text-sm">{stat.label}</div>
                                                    <div className="text-slate-500 text-xs">{stat.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Floating Elements */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-6 -right-6 glass-panel rounded-2xl px-4 py-3 border border-green-500/20 shadow-xl"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={18} className="text-green-500" />
                                            <span className="text-sm font-bold text-white">Verified Review</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -bottom-4 -left-6 glass-panel rounded-2xl px-4 py-3 border border-indigo-500/20 shadow-xl"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Heart size={18} className="text-red-500 fill-red-500" />
                                            <span className="text-sm font-bold text-white">1,234 found helpful</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Featured Reviews Section - Enhanced */}
                <section id="reviews" className="py-20 md:py-28 relative scroll-mt-20">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="text-center mb-12"
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                                <Star size={16} className="text-green-400 fill-green-400" />
                                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Expert Picks</span>
                            </motion.div>

                            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                                Featured <span className="text-green-400">AI Tool Reviews</span>
                            </motion.h2>

                            <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                                Hand-picked reviews of the most impactful tools for growing your business.
                            </motion.p>
                        </motion.div>

                        {/* Category Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-wrap justify-center gap-3 mb-12"
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${activeCategory === cat.id
                                        ? 'bg-white text-slate-950 shadow-lg'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                                        }`}
                                >
                                    <cat.icon size={16} />
                                    {cat.label}
                                </button>
                            ))}
                        </motion.div>

                        {/* Reviews Grid */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filteredReviews.map((review, index) => (
                                    <motion.a
                                        key={review.id}
                                        href={`/en/reviews/${review.slug}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -8 }}
                                        className="group relative block"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                        <div className="relative h-full glass-card rounded-3xl overflow-hidden hover:border-indigo-500/40 transition-all duration-500">
                                            {/* Image Header */}
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={review.image}
                                                    alt={review.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

                                                {/* Badge */}
                                                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r ${review.badgeColor} text-white text-xs font-bold shadow-lg`}>
                                                    {review.badge}
                                                </div>

                                                {/* Rating */}
                                                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                    <span className="text-white font-bold text-sm">{review.rating}</span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <h3 className="text-2xl font-black text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                                    {review.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 mb-4">{review.subtitle}</p>
                                                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                                                    {review.description}
                                                </p>

                                                {/* Quick Stats */}
                                                <div className="flex items-center justify-between text-sm mb-6 pb-6 border-b border-white/5">
                                                    <div>
                                                        <span className="text-slate-500">Starting at</span>
                                                        <span className="text-white font-bold ml-2">{review.pricing}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-slate-500">Best for</span>
                                                        <span className="text-indigo-400 font-bold ml-2">{review.bestFor}</span>
                                                    </div>
                                                </div>

                                                {/* CTA */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400 text-sm italic">"{review.verdict}"</span>
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                                        <ArrowUpRight size={18} className="text-indigo-400 group-hover:text-white transition-colors" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.a>
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {/* Coming Soon Notice */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-12 text-center"
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                                <Sparkles size={18} className="text-indigo-400 animate-pulse" />
                                <span className="text-slate-400 font-medium">New reviews added weekly. Stay tuned for more!</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 md:py-28 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/10 to-slate-950"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="text-center mb-16"
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                                <Quote size={16} className="text-amber-400" />
                                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Success Stories</span>
                            </motion.div>

                            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
                                What Our Readers Say
                            </motion.h2>
                        </motion.div>

                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative glass-card rounded-3xl p-8 hover:border-amber-500/30 transition-all h-full">
                                        <Quote size={32} className="text-amber-500/20 mb-4" />
                                        <p className="text-slate-300 text-lg leading-relaxed mb-6 italic">
                                            "{testimonial.quote}"
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.author}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30"
                                            />
                                            <div>
                                                <div className="text-white font-bold">{testimonial.author}</div>
                                                <div className="text-slate-500 text-sm">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 md:py-28 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950"></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

                    {/* Animated Orbs */}
                    <motion.div
                        animate={{
                            x: [0, 50, 0],
                            y: [0, -30, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[150px] rounded-full"
                    ></motion.div>
                    <motion.div
                        animate={{
                            x: [0, -50, 0],
                            y: [0, 30, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-600/20 blur-[120px] rounded-full"
                    ></motion.div>

                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="glass-panel rounded-[3rem] p-10 md:p-16 border border-white/10 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5"></div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                                        <Rocket size={16} className="text-indigo-400" />
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Start Your Journey</span>
                                    </div>

                                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                                        Ready to <span className="gradient-text">Transform Your Business?</span>
                                    </h2>

                                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
                                        Stop guessing. Start growing. Our expert reviews will help you choose
                                        the right AI tools to automate your business and 10x your results.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                        <motion.a
                                            href="#reviews"
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-600/30 overflow-hidden flex items-center gap-3"
                                        >
                                            <span>Explore All Reviews</span>
                                            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                                        </motion.a>
                                    </div>

                                    {/* Trust Signals */}
                                    <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-slate-500 text-sm">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-green-500" />
                                            <span>100% Free to Read</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Shield size={16} className="text-blue-500" />
                                            <span>No Email Required</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-amber-500" />
                                            <span>Updated Weekly</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-950 border-t border-white/5 py-16 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
                    <div className="container mx-auto px-6 text-center">
                        <div className="flex flex-col items-center gap-6 mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                                <span className="text-2xl font-black text-white tracking-widest uppercase">
                                    REFF<span className="text-indigo-500">AA</span>
                                </span>
                            </div>
                            <p className="max-w-md text-slate-500 font-medium leading-relaxed">
                                We design the digital future through intelligent automation and unbeatable strategies.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 mb-10">
                            {[
                                { icon: Facebook, href: '#' },
                                { icon: Linkedin, href: '#' },
                                { icon: MessageCircle, href: '#' }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white transition-all"
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em] flex flex-wrap justify-center items-center gap-2">
                                <span>© {new Date().getFullYear()} REFFAA STRATEGY</span>
                                <span className="text-slate-800">•</span>
                                <span className="elite-text-shimmer">Engineered for Victory</span>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ReviewsPage;
