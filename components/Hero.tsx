import React from 'react';
import { useSystem } from '../context/SystemContext';
import { useUI } from '../context/UIContext';
import { ArrowLeft, Sparkles, Shield, Layout as LayoutIcon, Zap, Globe, MousePointer2, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const { brand, contactInfo, aiConfig } = useSystem();
  const { openChat } = useUI();

  // Create a profile object for compatibility if needed, or use brand/aiConfig directly
  const profile = {
    name: brand.siteName,
    primaryTitle: aiConfig.field || "Strategic Digital Architecture",
    bio: aiConfig.mission,
    photoUrl: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80"
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  const templateId = brand?.templateId || 'premium-glass';
  const isCyber = templateId === 'cyber-command';
  const isMinimalist = templateId === 'minimalist-pro';

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center pt-20 pb-12 md:py-0 overflow-hidden">

      {/* Cinematic Background Architecture */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!isMinimalist && (
          <>
            <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse opacity-40"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[180px] rounded-full opacity-40"></div>
          </>
        )}
        <div className={`absolute inset-0 bg-grid-pattern ${isCyber ? 'opacity-20' : 'opacity-[0.1]'}`}></div>
        {!isMinimalist && <div className="absolute inset-0 mesh-gradient opacity-30"></div>}
        {isCyber && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Strategic Narrative Side */}
          <div className="lg:col-span-7 text-center lg:text-right order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border text-[11px] font-black mb-12 mx-auto lg:mr-0 lg:ml-auto backdrop-blur-xl ${isCyber
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : isMinimalist
                  ? 'bg-slate-100 border-slate-200 text-slate-900 shadow-sm'
                  : 'bg-white/5 border-white/10 text-indigo-400'
                }`}
            >
              <Sparkles size={16} className={`${isCyber ? 'text-green-500' : isMinimalist ? 'text-slate-900' : 'text-indigo-500'} animate-pulse`} />
              <span className="tracking-[0.4em] uppercase">{isCyber ? 'CYBER COMMAND OS v5.0' : 'The Sovereign Digital Era 2025'}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 20 }}
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[0.95] tracking-tighter ${isMinimalist ? 'text-slate-950' : 'text-white'}`}
            >
              {profile.primaryTitle.split(' ').slice(0, -1).join(' ')} <br />
              <span className={isMinimalist ? 'text-indigo-600' : 'gradient-text'}>{profile.primaryTitle.split(' ').pop()}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-base md:text-lg mb-8 max-w-xl mx-auto lg:mr-0 lg:ml-auto leading-relaxed font-medium ${isMinimalist ? 'text-slate-600' : 'text-slate-400'}`}
            >
              أنا <span className={`font-black border-b-4 pb-1 ${isMinimalist ? 'text-slate-950 border-indigo-600' : 'text-white border-indigo-600/40'}`}>{profile.name}</span>. {profile.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end mb-12"
            >
              <button
                onClick={(e) => scrollToSection(e, '#services')}
                className={`group relative px-10 py-5 rounded-2xl font-black text-xl overflow-hidden active:scale-95 transition-all shadow-2xl ${isCyber
                  ? 'bg-green-600 text-black border-2 border-green-400'
                  : isMinimalist
                    ? 'bg-slate-950 text-white'
                    : 'bg-white text-slate-950 hover:shadow-indigo-500/20'
                  }`}
              >
                <div className={`absolute inset-0 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ${isCyber ? 'bg-green-400' : 'bg-indigo-600'}`}></div>
                <span className={`relative z-10 group-hover:text-white flex items-center justify-center gap-4 transition-colors ${isCyber ? 'group-hover:text-black' : ''}`}>
                  اكتشف خدماتنا النخبوية
                  <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                </span>
              </button>

              <button
                onClick={(e) => { e.preventDefault(); openChat(); }}
                className={`px-10 py-5 rounded-2xl font-black text-xl active:scale-95 transition-all flex items-center justify-center gap-4 ${isCyber
                  ? 'bg-black text-green-500 border border-green-500/30'
                  : isMinimalist
                    ? 'bg-white text-slate-950 border border-slate-200'
                    : 'glass-card text-white hover:bg-white/5'
                  }`}
              >
                <Bot size={24} className={isCyber ? 'text-green-500' : 'text-indigo-500'} />
                حلول ذكاء اصطناعي
              </button>
            </motion.div>

            {/* Industrial Stats Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className={`grid grid-cols-3 gap-6 border-t pt-8 max-w-lg mx-auto lg:mr-0 lg:ml-auto ${isMinimalist ? 'border-slate-100' : 'border-white/5'}`}
            >
              {[
                { label: "دقة الأتمتة", val: "100%", icon: Zap },
                { label: "حلول منجزة", val: "140+", icon: LayoutIcon },
                { label: "خبرة دولية", val: "05+", icon: Globe }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center lg:items-end gap-2 group cursor-default">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl ${isCyber
                    ? 'bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-black'
                    : isMinimalist
                      ? 'bg-slate-100 text-slate-900 group-hover:bg-slate-950 group-hover:text-white'
                      : 'bg-white/5 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'
                    }`}>
                    <item.icon size={20} />
                  </div>
                  <span className={`text-2xl sm:text-4xl font-black tracking-tighter transition-colors ${isCyber ? 'text-green-400 group-hover:text-green-500' : isMinimalist ? 'text-slate-950' : 'text-white group-hover:text-indigo-400'
                    }`}>{item.val}</span>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isMinimalist ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual Excellence / Identity Side */}
          <div className="lg:col-span-5 order-1 lg:order-2 w-full max-w-md lg:max-w-none animate-in fade-in zoom-in duration-1000">
            <div className="relative group perspective-1000">
              {/* Dynamic Aura Glow */}
              {!isMinimalist && (
                <div className={`absolute -inset-10 blur-[100px] rounded-full opacity-60 group-hover:opacity-100 transition-all duration-1000 animate-pulse ${isCyber ? 'bg-green-500/20' : 'bg-gradient-to-br from-indigo-600/30 to-purple-600/30'
                  }`}></div>
              )}

              <motion.div
                whileHover={{ rotateY: -8, rotateX: 8, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className={`relative aspect-[1/1.3] overflow-hidden transition-all ${isCyber
                  ? 'rounded-none border-2 border-green-500/40'
                  : isMinimalist
                    ? 'rounded-3xl border border-slate-100 shadow-xl grayscale-0'
                    : 'rounded-[4rem] sm:rounded-[6rem] border border-white/20 shadow-3xl grayscale-[15%] group-hover:grayscale-0'
                  } bg-slate-900`}
              >
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
                />

                {/* Advanced Overlay */}
                {!isMinimalist && <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isCyber ? 'from-green-950/80' : 'from-slate-950'}`}></div>}

                {/* Vertical Text Shimmer Decor */}
                <div className="absolute top-1/2 -left-12 -rotate-90 pointer-events-none">
                  <span className={`text-4xl font-black uppercase tracking-[1em] whitespace-nowrap ${isCyber ? 'text-green-500/10' : isMinimalist ? 'text-slate-950/5' : 'text-white/5'}`}>
                    {isCyber ? 'CYBER NET' : 'NR STRATEGY'}
                  </span>
                </div>

                {/* Elite Floating Identity Card */}
                <div className={`absolute bottom-10 inset-x-10 p-6 border transition-all duration-500 group-hover:bottom-12 ${isCyber
                  ? 'bg-black/90 border-green-500/50 rounded-none'
                  : isMinimalist
                    ? 'bg-white border-slate-100 rounded-2xl shadow-2xl'
                    : 'glass-panel border-white/20 backdrop-blur-3xl shadow-2xl rounded-3xl group-hover:border-indigo-500/50'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${isCyber ? 'bg-green-600' : 'bg-indigo-600'}`}>
                        <Shield size={22} className="animate-pulse" />
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] font-black tracking-[0.3em] uppercase mb-1 ${isCyber ? 'text-green-400' : isMinimalist ? 'text-indigo-600' : 'text-indigo-400'}`}>Strategic Architect</p>
                        <p className={`text-lg font-black leading-none ${isMinimalist ? 'text-slate-950' : 'text-white'}`}>{profile.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${isCyber ? 'bg-green-400' : 'bg-green-500'}`}></div>
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
        <span className={`text-[9px] font-black uppercase tracking-[0.5em] ${isMinimalist ? 'text-slate-900' : 'text-white'}`}>Scroll</span>
        <div className={`w-px h-12 ${isMinimalist ? 'bg-slate-200' : 'bg-gradient-to-b from-white to-transparent'}`}></div>
      </div>
    </section>
  );
};

export default Hero;
