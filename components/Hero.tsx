import React from 'react';
import { useData } from '../context/DataContext';
import { useUI } from '../context/UIContext';
import { ArrowLeft, Sparkles, Shield, Layout as LayoutIcon, Zap, Globe, MousePointer2, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const { siteData } = useData();
  const { profile } = siteData;
  const { openChat } = useUI();

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 md:py-0 overflow-hidden">

      {/* Cinematic Background Architecture */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[180px] rounded-full"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.2]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Strategic Narrative Side */}
          <div className="lg:col-span-7 text-center lg:text-right order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[11px] font-black mb-10 mx-auto lg:mr-0 lg:ml-auto backdrop-blur-xl"
            >
              <Sparkles size={16} className="text-indigo-500 animate-pulse" />
              <span className="tracking-[0.3em] uppercase">The Sovereign Digital Era 2025</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 20 }}
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-10 leading-[0.95] text-white tracking-tighter"
            >
              {profile.primaryTitle.split(' ').slice(0, -1).join(' ')} <br />
              <span className="gradient-text">{profile.primaryTitle.split(' ').pop()}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto lg:mr-0 lg:ml-auto leading-relaxed font-medium"
            >
              أنا <span className="text-white font-black border-b-4 border-indigo-600/40 pb-1">{profile.name}</span>. {profile.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-end mb-20"
            >
              <button
                onClick={(e) => scrollToSection(e, '#services')}
                className="group relative px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xl overflow-hidden active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-indigo-500/20"
              >
                <div className="absolute inset-0 bg-indigo-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10 group-hover:text-white flex items-center justify-center gap-4 transition-colors">
                  اكتشف خدماتنا النخبوية
                  <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                </span>
              </button>

              <button
                onClick={(e) => { e.preventDefault(); openChat(); }}
                className="glass-card px-10 py-5 rounded-2xl font-black text-xl text-white hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                <Bot size={24} className="text-indigo-500" />
                حلول ذكاء اصطناعي
              </button>
            </motion.div>

            {/* Industrial Stats Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-3 gap-10 border-t border-white/5 pt-12 max-w-xl mx-auto lg:mr-0 lg:ml-auto"
            >
              {[
                { label: "دقة الأتمتة", val: "100%", icon: Zap },
                { label: "حلول منجزة", val: "140+", icon: LayoutIcon },
                { label: "خبرة دولية", val: "05+", icon: Globe }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center lg:items-end gap-2 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-xl">
                    <item.icon size={20} />
                  </div>
                  <span className="text-2xl sm:text-4xl font-black text-white tracking-tighter group-hover:text-indigo-400 transition-colors">{item.val}</span>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual Excellence / Identity Side */}
          <div className="lg:col-span-5 order-1 lg:order-2 w-full max-w-md lg:max-w-none animate-in fade-in zoom-in duration-1000">
            <div className="relative group perspective-1000">
              {/* Dynamic Aura Glow */}
              <div className="absolute -inset-10 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 blur-[100px] rounded-full opacity-60 group-hover:opacity-100 transition-all duration-1000 animate-pulse"></div>

              <motion.div
                whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02 }}
                className="relative aspect-[1/1.3] rounded-[4rem] sm:rounded-[5rem] overflow-hidden border border-white/20 shadow-3xl overflow-hidden bg-slate-900 transition-all"
              >
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />

                {/* Advanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>

                {/* Vertical Text Shimmer Decor */}
                <div className="absolute top-1/2 -left-12 -rotate-90 pointer-events-none">
                  <span className="text-4xl font-black text-white/5 uppercase tracking-[1em] whitespace-nowrap">NR STRATEGY</span>
                </div>

                {/* Elite Floating Identity Card */}
                <div className="absolute bottom-10 inset-x-10 glass-panel p-6 rounded-3xl border border-white/20 backdrop-blur-3xl shadow-2xl transition-all duration-500 group-hover:bottom-12 group-hover:border-indigo-500/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                        <Shield size={22} className="animate-pulse" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase mb-1">Strategic Architect</p>
                        <p className="text-lg font-black text-white leading-none">نورالدين رفعة</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
                      <span className="text-[8px] font-black text-slate-500 mt-2">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Hero Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-pointer">
        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
