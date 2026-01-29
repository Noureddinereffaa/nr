import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import StrategicBlog from '../components/StrategicBlog';
import Contact from '../components/Contact';
import Process from '../components/Process';
import AutoEntrepreneurCard from '../components/AutoEntrepreneurCard';
import Testimonials from '../components/Testimonials';
import { ShieldCheck, Users, Briefcase, Zap, ArrowLeft } from 'lucide-react';
import SEO from '../components/seo/SEO';
import { JsonLd } from '../components/seo/JsonLd';

const HomePage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NR-OS",
    "url": "https://nr-os.com",
    "logo": "https://nr-os.com/logo.png",
    "sameAs": [
      "https://github.com/noureddinereffaa",
      "https://linkedin.com/in/noureddinereffaa"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+213-555-000-000",
      "contactType": "customer service"
    }
  };

  return (
    <Layout>
      <SEO
        title="تطوير البرمجيات والأنظمة السيادية"
        description="نحول الأفكار المعقدة إلى أنظمة رقمية سيادية. NR-OS هي وكالة تطوير برمجيات رائدة في الجزائر تتخصص في الأنظمة المتقدمة وحلول المؤسسات."
      />
      <JsonLd data={structuredData} />
      <div className="relative">
        <Hero />

        <div className="relative z-30 -mt-8 sm:-mt-16 px-4 mb-16 md:mb-24">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto dashboard-border glass-effect rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 shadow-3xl">
              {[
                { icon: ShieldCheck, label: "اعتماد رسمي", val: "100%", color: "text-indigo-400" },
                { icon: Users, label: "عملاء راضون", val: "50+", color: "text-blue-400" },
                { icon: Briefcase, label: "مشروع منجز", val: "120+", color: "text-purple-400" },
                { icon: Zap, label: "دعم فني", val: "24/7", color: "text-amber-400" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 sm:gap-4 group">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} mb-1 border border-white/5 group-hover:scale-110 transition-transform shadow-xl shadow-black/20`}>
                    <stat.icon size={22} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{stat.val}</div>
                    <div className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Promotion Banner */}
        <div className="container mx-auto px-4 mb-24">
          <Link to="/platform" className="block group">
            <div className="relative overflow-hidden glass-effect border border-indigo-500/20 rounded-[2.5rem] p-1">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 opacity-50"></div>
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-indigo-500/10">
                    <Zap size={32} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-3xl font-black text-white mb-2 tracking-tight">
                      اكتشف <span className="text-indigo-400">منصة هاني</span> الرقمية الجديدة
                    </h3>
                    <p className="text-slate-400 text-sm md:text-lg font-medium">
                      الحل المتكامل للتسويق والنمو السريع لعملك في السوق الجزائري
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4 border-l border-white/10">متاح الآن</span>
                  <div className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs group-hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl shadow-white/5">
                    اكتشف المزايا
                    <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="space-y-0">
          {/* Main Content Flow */}
          <Services />
          <Portfolio />
          <Process />
          <StrategicBlog />

          <div className="py-8 relative overflow-hidden bg-slate-900/40">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none"></div>
            <Testimonials />
          </div>

          <AutoEntrepreneurCard />

          <Contact />

          <div className="relative pb-8">
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-indigo-600/10 to-transparent blur-[80px] opacity-20 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
