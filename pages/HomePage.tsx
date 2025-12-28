import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import StrategicBlog from '../components/StrategicBlog';
import Contact from '../components/Contact';
import Process from '../components/Process';
import AutoEntrepreneurCard from '../components/AutoEntrepreneurCard';
import Testimonials from '../components/Testimonials';
import { ShieldCheck, Users, Briefcase, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <Layout>
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

        <div className="space-y-0">
          {/* Main Content Flow */}
          <Services />
          <Portfolio />
          <Process />
          <StrategicBlog />

          <div className="py-16 relative overflow-hidden bg-slate-900/40">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none"></div>
            <Testimonials />
          </div>

          <AutoEntrepreneurCard />

          <Contact />

          <div className="relative pb-16">
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-indigo-600/10 to-transparent blur-[120px] opacity-20 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
