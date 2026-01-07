import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Star,
    CheckCircle2,
    XCircle,
    ArrowRight,
    ExternalLink,
    Shield,
    Calendar,
    Eye,
    Tag,
    Share2,
    Award,
    AlertCircle,
    ChevronLeft,
    User,
    Quote,
    Menu,
    ArrowUpRight,
    FileText,
    HelpCircle,
    Play,
    Maximize2,
    Zap,
    DollarSign,
    Clock,
    Image as ImageIcon,
    X,
    Mail
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { DecisionPage } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ReviewDetailsPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { siteData, isLoading } = useData();
    const [page, setPage] = useState<DecisionPage | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
    const [email, setEmail] = useState('');

    const [searchParams] = useSearchParams();
    const isPreview = searchParams.get('preview') === 'true';

    useEffect(() => {
        if (!isLoading && siteData.decisionPages) {
            const foundPage = siteData.decisionPages.find(p => p.slug === slug);
            if (foundPage) {
                setPage(foundPage);
                // SEO update
                document.title = (foundPage.seo?.title || `${foundPage.title} Review`) + (isPreview ? ' [Preview]' : '');

                // Add noindex for previews
                if (isPreview) { // Assuming 'status' is not available on DecisionPage, only check isPreview
                    let metaRobots = document.querySelector('meta[name="robots"]');
                    if (!metaRobots) {
                        metaRobots = document.createElement('meta');
                        metaRobots.setAttribute('name', 'robots');
                        document.head.appendChild(metaRobots);
                    }
                    metaRobots.setAttribute('content', 'noindex, nofollow');
                } else {
                    // Restore/Set default for published (if it was previously set to noindex)
                    let metaRobots = document.querySelector('meta[name="robots"]');
                    if (metaRobots && metaRobots.getAttribute('content') === 'noindex, nofollow') {
                        metaRobots.setAttribute('content', 'index, follow');
                    }
                }

                // Inject JSON-LD
                const scriptId = 'json-ld-review';
                let script = document.getElementById(scriptId);
                if (!script) {
                    script = document.createElement('script');
                    script.id = scriptId;
                    script.setAttribute('type', 'application/ld+json');
                    document.head.appendChild(script);
                }

                const schema: any = {
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "SoftwareApplication",
                            "name": foundPage.title,
                            "applicationCategory": foundPage.category,
                            "operatingSystem": "Web",
                            "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" },
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": foundPage.rating,
                                "bestRating": "5",
                                "ratingCount": "120"
                            }
                        },
                        {
                            "@type": "Review",
                            "itemReviewed": {
                                "@type": "SoftwareApplication",
                                "name": foundPage.title
                            },
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": foundPage.rating,
                                "bestRating": "5"
                            },
                            "author": {
                                "@type": "Person",
                                "name": foundPage.author?.name || "Editor"
                            },
                            "reviewBody": foundPage.verdict
                        }
                    ]
                };

                if (foundPage.faq && foundPage.faq.length > 0) {
                    schema["@graph"].push({
                        "@type": "FAQPage",
                        "mainEntity": foundPage.faq.map(f => ({
                            "@type": "Question",
                            "name": f.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": f.answer
                            }
                        }))
                    });
                }

                script.textContent = JSON.stringify(schema);
            }
        }
    }, [slug, siteData.decisionPages, isLoading]);

    // Scroll to section helper
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-950"><LoadingSpinner /></div>;

    if (!page) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle size={48} className="text-slate-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Review Not Found</h1>
                <p className="text-slate-400 mb-6">The review you are looking for does not exist or has been moved.</p>
                <button
                    onClick={() => navigate('/en/reviews')}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                    <ChevronLeft size={18} /> Back to Reviews
                </button>
            </div>
        );
    }

    return (
        <div dir="ltr" className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 overflow-x-hidden relative font-sans">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent"></div>
            </div>

            <div className="relative z-10 pt-24 pb-20">
                <div className="container mx-auto px-6 max-w-6xl">

                    {/* Navigation */}
                    <button
                        onClick={() => navigate('/en/reviews')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-wider">All Reviews</span>
                    </button>

                    {/* Hero Header */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link to="/en/reviews" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group w-fit">
                                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Reviews
                            </Link>

                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className={`px - 3 py - 1 rounded - full text - xs font - bold uppercase tracking - wider bg - slate - 800 text - slate - 300 border border - white / 5`}>
                                    {page.category}
                                </span>
                                {page.category === 'crm' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-2 shadow-lg">
                                        <Award size={12} /> Top Agency Tool 2026
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-slate-500 text-xs font-medium pl-2 border-l border-white/10">
                                    <Calendar size={12} /> Updated {new Date(page.dates?.updated || page.date).toLocaleDateString()}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                                {page.title}
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed mb-8 border-l-4 border-indigo-500 pl-6">
                                {page.subtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <a
                                    href={page.affiliateUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:scale-[1.02]"
                                >
                                    Start Free Trial <ArrowRight size={20} />
                                </a>
                                {page.media?.pdfUrl && (
                                    <button
                                        onClick={() => setIsLeadMagnetOpen(true)}
                                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <FileText size={20} className="text-indigo-400" /> Download Cheat Sheet
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={20} fill={i < Math.floor(page.rating) ? "currentColor" : "none"} className={i < page.rating ? "text-yellow-400" : "text-slate-700"} />
                                        ))}
                                    </div>
                                    <span className="text-2xl font-bold text-white">{page.rating}<span className="text-slate-500 text-base font-normal">/5</span></span>
                                </div>
                                {page.author && (
                                    <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                                        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 overflow-hidden">
                                            <img src={page.author.image} alt={page.author.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">{page.author.name}</div>
                                            <div className="text-slate-500 text-xs">{page.author.role}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative cursor-pointer"
                            onClick={() => setSelectedImage(page.image)}
                        >
                            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                                <img
                                    src={page.image}
                                    alt={page.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                                <a
                                    href={page.affiliateUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="absolute bottom-6 right-6 px-6 py-3 bg-white text-slate-950 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-white/10"
                                >
                                    Visit Website <ExternalLink size={18} />
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-8">



                        {/* Left Column: Content */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Verdict Box */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                id="verdict"
                                className="bg-slate-900/50 border border-indigo-500/30 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Award size={100} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <Award className="text-indigo-400" /> Our Verdict
                                </h2>
                                <p className="text-lg text-slate-300 leading-relaxed italic">
                                    "{page.verdict}"
                                </p>
                            </motion.div>

                            {/* Metrics Section (New) */}
                            {page.metrics && (page.metrics.timeSaved || page.metrics.roiMultiplier) && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-center group hover:border-indigo-500/30 transition-colors">
                                        <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center mb-3">
                                            <Clock size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="text-white font-black text-2xl mb-1">{page.metrics.timeSaved}</div>
                                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Time Saved</div>
                                    </div>
                                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-center group hover:border-green-500/30 transition-colors">
                                        <div className="w-10 h-10 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                                            <Zap size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="text-white font-black text-2xl mb-1">{page.metrics.tasksAutomated}</div>
                                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Automated</div>
                                    </div>
                                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-center group hover:border-purple-500/30 transition-colors">
                                        <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
                                            <DollarSign size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="text-white font-black text-2xl mb-1">{page.metrics.roiMultiplier}</div>
                                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">ROI Boost</div>
                                    </div>
                                </div>
                            )}

                            {/* Video Section (New) */}
                            {page.media?.videoUrl && (
                                <div id="video-review" className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video relative group">
                                    <iframe
                                        src={page.media.videoUrl}
                                        title="Video Review"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            {/* Downloads (New) */}
                            {page.media?.pdfUrl && (
                                <button onClick={() => setIsLeadMagnetOpen(true)} className="w-full flex items-center gap-4 p-4 bg-indigo-600/10 border border-indigo-600/20 rounded-xl hover:bg-indigo-600/20 transition-all group text-left">
                                    <div className="bg-indigo-600 p-3 rounded-lg text-white group-hover:scale-110 transition-transform"><FileText size={20} /></div>
                                    <div>
                                        <div className="text-white font-bold">Download Analysis PDF</div>
                                        <div className="text-indigo-400 text-xs">Get this review as a PDF cheat sheet</div>
                                    </div>
                                    <ArrowRight size={18} className="ml-auto text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}

                            {/* Pros & Cons */}
                            <div id="pros-cons" className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
                                        <CheckCircle2 /> The Good
                                    </h3>
                                    <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6 space-y-3">
                                        {page.pros.map((pro, i) => (
                                            <div key={i} className="flex items-start gap-3 text-slate-300">
                                                <div className="min-w-[6px] h-[6px] rounded-full bg-green-500 mt-2.5"></div>
                                                <span>{pro}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-rose-400 flex items-center gap-2">
                                        <XCircle /> The Bad
                                    </h3>
                                    <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6 space-y-3">
                                        {page.cons.map((con, i) => (
                                            <div key={i} className="flex items-start gap-3 text-slate-300">
                                                <div className="min-w-[6px] h-[6px] rounded-full bg-rose-500 mt-2.5"></div>
                                                <span>{con}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Description */}
                            <div id="details" className="prose prose-invert prose-lg max-w-none">
                                <h3 className="text-2xl font-bold text-white mb-6">In-Depth Review</h3>
                                {page.description ? (
                                    <div className="space-y-6">
                                        {page.description.split('\n').map((line, i) => {
                                            // Headers
                                            if (line.trim().startsWith('## ')) return <h2 key={i} className="text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-3"><span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>{line.replace('## ', '')}</h2>;
                                            if (line.trim().startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-indigo-400 mt-8 mb-4">{line.replace('### ', '')}</h3>;

                                            // Blockquotes (Pro Tips)
                                            if (line.trim().startsWith('> ')) return (
                                                <div key={i} className="my-8 bg-indigo-900/20 border-l-4 border-indigo-500 p-6 rounded-r-xl">
                                                    <p className="text-indigo-200 m-0 font-medium italic">{line.replace('> ', '').replace(/\*\*(.*?)\*\*/g, (_, p1) => p1)}</p>
                                                </div>
                                            );

                                            // Lists
                                            if (line.trim().startsWith('- ')) return (
                                                <div key={i} className="flex items-start gap-3 mb-2 ml-4">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0"></div>
                                                    <p className="text-slate-300 leading-relaxed m-0">
                                                        {line.replace('- ', '').split(/(\*\*.*?\*\*)|(_.*?_)/g).map((part, j) => {
                                                            if (!part) return null;
                                                            if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                                                            if (part.startsWith('_') && part.endsWith('_')) return <em key={j} className="text-slate-200 italic">{part.slice(1, -1)}</em>;
                                                            return <span key={j}>{part}</span>;
                                                        })}
                                                    </p>
                                                </div>
                                            );

                                            // Empty lines
                                            if (!line.trim()) return <div key={i} className="h-4"></div>;

                                            // Paragraphs
                                            return (
                                                <p key={i} className="text-lg text-slate-300 leading-8 mb-4">
                                                    {line.split(/(\*\*.*?\*\*)|(_.*?_)/g).map((part, j) => {
                                                        if (!part) return null;
                                                        if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                                                        if (part.startsWith('_') && part.endsWith('_')) return <em key={j} className="text-slate-200 italic">{part.slice(1, -1)}</em>;
                                                        return <span key={j}>{part}</span>;
                                                    })}
                                                </p>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic">No detailed review available.</p>
                                )}
                            </div>

                            {/* Testimonials Section (New V3) */}
                            {page.testimonials && page.testimonials.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Quote className="text-indigo-400" /> User Stories
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {page.testimonials.map((t, i) => (
                                            <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-2xl relative">
                                                <Quote size={40} className="absolute top-4 right-4 text-white/5" />
                                                <p className="text-slate-300 italic mb-4">"{t.text}"</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase text-sm">
                                                        {t.author.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold text-sm">{t.author}</div>
                                                        <div className="text-slate-500 text-xs">{t.role}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Comparison Section (New V3) */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-white">How It Compares</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="p-4 border-b border-white/10 text-slate-400 font-medium w-1/3">Feature</th>
                                                <th className="p-4 border-b border-indigo-500/50 text-indigo-400 font-bold bg-indigo-500/10 rounded-t-xl w-1/3 relative">
                                                    {page.title}
                                                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg">Winner</div>
                                                </th>
                                                <th className="p-4 border-b border-white/10 text-slate-400 font-medium w-1/3">Competitors</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-300">
                                            <tr>
                                                <td className="p-4 border-b border-white/5 font-medium">Pricing Model</td>
                                                <td className="p-4 border-b border-indigo-500/20 bg-indigo-500/5 font-bold text-white">{page.pricing} Flat Rate</td>
                                                <td className="p-4 border-b border-white/5 text-slate-500">Per User / Feature Locked</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border-b border-white/5 font-medium">Rating</td>
                                                <td className="p-4 border-b border-indigo-500/20 bg-indigo-500/5 font-bold flex items-center gap-1 text-white">
                                                    {page.rating} <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                                </td>
                                                <td className="p-4 border-b border-white/5 text-slate-500">4.0 - 4.5</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border-b border-white/5 font-medium">Automation</td>
                                                <td className="p-4 border-b border-indigo-500/20 bg-indigo-500/5 font-bold text-green-400 flex items-center gap-2">
                                                    <CheckCircle2 size={14} /> Unlimited
                                                </td>
                                                <td className="p-4 border-b border-white/5 text-slate-500">Limited / Paid Add-on</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border-b border-white/5 font-medium">Support</td>
                                                <td className="p-4 border-b border-indigo-500/20 bg-indigo-500/5 font-bold text-white">24/7 Live Chat</td>
                                                <td className="p-4 border-b border-white/5 text-slate-500">Ticket Based</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 pt-6"></td>
                                                <td className="p-4 pt-6 bg-indigo-500/5 rounded-b-xl border-x border-b border-indigo-500/20">
                                                    <a href={page.affiliateUrl} target="_blank" rel="noreferrer" className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-600/20">
                                                        Start Free Trial
                                                    </a>
                                                </td>
                                                <td className="p-4 pt-6 text-center">
                                                    <span className="text-slate-500 text-sm">Compare Plans</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Gallery Section - Enhanced */}
                            {page.media?.gallery && page.media.gallery.length > 0 && (
                                <div id="media" className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <ImageIcon size={24} className="text-indigo-400" /> Interface Tour
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {page.media.gallery.map((img, i) => (
                                            <div
                                                key={i}
                                                className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-pointer bg-slate-900"
                                                onClick={() => setSelectedImage(img)}
                                            >
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 text-center p-4">
                                                    <div>
                                                        <Maximize2 className="text-white drop-shadow-lg mx-auto mb-2" size={32} />
                                                        <span className="text-white font-bold text-sm">View Fullscreen</span>
                                                    </div>
                                                </div>
                                                <img src={img} alt={`Interface ${i + 1} `} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                                        <HelpCircle size={14} /> Click images to enlarge
                                    </p>
                                </div>
                            )}

                            {/* FAQ Section */}
                            {page.faq && page.faq.length > 0 && (
                                <div id="faq" className="space-y-6 border-t border-white/5 pt-12">
                                    <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
                                    <div className="space-y-4">
                                        {page.faq.map((item, i) => (
                                            <div key={i} className="bg-slate-900/50 border border-white/5 rounded-xl p-6 hover:border-indigo-500/30 transition-colors">
                                                <h4 className="text-lg font-bold text-white mb-2">{item.question}</h4>
                                                <p className="text-slate-400">{item.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* FAQ CTA */}
                                    <div className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-indigo-500/30 text-center">
                                        <h4 className="text-xl font-bold text-white mb-2">Still have questions?</h4>
                                        <p className="text-slate-400 mb-6">See for yourself why 10,000+ agencies made the switch.</p>
                                        <a href={page.affiliateUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg hover:scale-105">
                                            Start Your 14-Day Free Trial <ArrowRight size={18} />
                                        </a>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Right Column: Sidebar */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Sticky Card */}
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
                                    <div className="text-center mb-6">
                                        <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Editor's Rating</div>
                                        <div className="text-5xl font-black text-white mb-2">{page.rating}</div>
                                        <div className="flex justify-center text-yellow-400 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={18} fill={i < Math.floor(page.rating) ? "currentColor" : "none"} className={i < page.rating ? "text-yellow-400" : "text-slate-700"} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                                            <span className="text-slate-400 text-sm">Best For</span>
                                            <span className="text-white font-bold text-sm text-right">{page.bestFor}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                                            <span className="text-slate-400 text-sm">Pricing</span>
                                            <span className="text-white font-bold text-sm text-right">{page.pricing}</span>
                                        </div>
                                    </div>

                                    <a
                                        href={page.affiliateUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full block bg-indigo-600 hover:bg-indigo-500 text-white text-center font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/25 mb-3"
                                    >
                                        Get Deal
                                    </a>
                                    <p className="text-xs text-center text-slate-600">
                                        We may earn a commission if you click this link.
                                    </p>
                                </div>

                                {/* Table of Contents (New) */}
                                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <Menu size={16} className="text-indigo-400" /> On This Page
                                    </h3>
                                    <div className="space-y-1">
                                        {[
                                            { id: 'verdict', label: 'Verdict' },
                                            { id: 'pros-cons', label: 'Pros & Cons' },
                                            { id: 'details', label: 'In-Depth Review' },
                                            { id: 'video-review', label: 'Video Review' },
                                            { id: 'media', label: 'Gallery' },
                                            { id: 'faq', label: 'FAQ' }
                                        ].map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollToSection(item.id)}
                                                className="block w-full text-left py-2 px-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Floating Mobile CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-between gap-4">
                <div>
                    <div className="text-white font-bold text-sm">{page.title}</div>
                    <div className="text-indigo-400 text-xs font-bold">{page.pricing}</div>
                </div>
                <a href={page.affiliateUrl} target="_blank" rel="noreferrer" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2">
                    Get Deal <ArrowRight size={16} />
                </a>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                        <X size={32} />
                    </button>
                    <img src={selectedImage} alt="Fullscreen" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
                </div>
            )}

            {/* Lead Magnet Modal */}
            {isLeadMagnetOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                        <button onClick={() => setIsLeadMagnetOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={32} className="text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Unlock the Cheat Sheet</h3>
                            <p className="text-slate-400">Enter your email to get the free GoHighLevel implementation guide and ROI calculator.</p>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // Simulate capture
                            setTimeout(() => {
                                window.open(page.media?.pdfUrl, '_blank');
                                setIsLeadMagnetOpen(false);
                            }, 500);
                        }} className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@agency.com"
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2">
                                Send Me the Guide <ArrowRight size={18} />
                            </button>
                            <p className="text-xs text-center text-slate-600">We respect your inbox. Unsubscribe anytime.</p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewDetailsPage;
