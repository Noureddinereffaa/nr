import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, Mail, Linkedin, Facebook, ChevronLeft, Bot, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { siteData } = useData();
  const { profile, brand, contactInfo } = siteData;

  // Build social URLs
  const whatsappUrl = contactInfo?.whatsapp?.startsWith('http')
    ? contactInfo.whatsapp
    : `https://wa.me/${(contactInfo?.whatsapp || '').replace(/\D/g, '')}`;
  const facebookUrl = contactInfo?.socials?.facebook || profile?.socials?.facebook || '#';
  const linkedinUrl = contactInfo?.socials?.linkedin || profile?.socials?.linkedin || '#';
  const emailUrl = contactInfo?.email ? `mailto:${contactInfo.email}` : (profile?.socials?.email || '#');

  useEffect(() => {
    const root = document.documentElement;
    const primaryColor = brand?.primaryColor || '#4f46e5';
    const secondaryColor = brand?.secondaryColor || '#818cf8';

    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--secondary', secondaryColor);
    root.style.setProperty('--primary-rgb', hexToRgb(primaryColor));
    root.style.setProperty('--secondary-rgb', hexToRgb(secondaryColor));
  }, [brand?.primaryColor, brand?.secondaryColor]);

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '79, 70, 229';
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (e: React.MouseEvent | null, id: string) => {
    if (e) e.preventDefault();
    setIsMenuOpen(false);

    if (id === '#blog') {
      navigate('/blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (location.pathname !== '/' && id.startsWith('#')) {
      navigate('/' + id);
      return;
    }

    if (id === '#' || id === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'الرئيسية', href: '#hero' },
    { name: 'الخدمات', href: '#services' },
    { name: 'النتائج', href: '#portfolio' },
    { name: 'المنهجية', href: '#process' },
    { name: 'المقالات', href: '#blog' },
    { name: 'تواصل معنا', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 overflow-x-hidden animated-bg relative">
      {/* Mesh Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none mesh-gradient opacity-60 z-0"></div>

      {/* Dynamic Background Noise/Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

      {/* Floating AI Side Tab */}
      <motion.button
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        onClick={() => scrollToSection(null, '#assistant')}
        className="fixed top-1/2 -left-2 z-[300] -rotate-90 origin-left flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(79,70,229,0.3)] border-x border-t border-white/20 hover:px-10 transition-all group"
      >
        <Sparkles size={16} className="animate-pulse text-indigo-200" />
        <span className="text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap">استشارة ذكية مجانية</span>
      </motion.button>

      <nav className={`fixed top-0 left-0 right-0 z-[400] transition-all duration-700 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="container mx-auto px-6">
          <div className={`flex justify-between items-center p-3 rounded-[2rem] transition-all duration-700 ${scrolled ? 'glass-panel border-white/10 shadow-3xl px-6' : 'bg-transparent'}`}>
            <div onClick={(e) => scrollToSection(e, '#hero')} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/40 group-hover:rotate-[15deg] transition-all duration-500">
                <Zap className="text-white fill-current" size={22} />
              </div>
              <div className="flex flex-col items-start leading-none text-right">
                <span className="text-lg font-black text-white tracking-tighter uppercase leading-none">REFF<span className="text-indigo-500">AA</span></span>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.25em] mt-0.5">{profile?.nameEn?.split(' ')[0] || 'NR'} STRATEGY</span>
              </div>
            </div>

            <div className="hidden lg:flex gap-10 items-center">
              {navLinks.map((link, i) => (
                <button
                  key={i}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-[11px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-[0.15em] relative group/link"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover/link:w-full"></span>
                </button>
              ))}
              <button
                onClick={(e) => scrollToSection(e, '#assistant')}
                className="glow-accent bg-white text-slate-950 px-8 py-3.5 rounded-2xl text-[11px] font-black transition-all shadow-2xl flex items-center gap-3 active:scale-95"
              >
                <Bot size={16} className="text-indigo-600 animate-bounce" />
                المساعد الذكي
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-3.5 rounded-2xl border transition-all duration-500 ${isMenuOpen ? 'bg-indigo-600 border-indigo-600 text-white rotate-90' : 'bg-white/5 border-white/10 text-white'}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Immersive Full-Screen Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[350] lg:hidden bg-slate-950 flex flex-col pt-32 pb-12 px-8 overflow-y-auto"
            >
              {/* Animated Shapes in Background */}
              <div className="absolute top-20 right-[-10%] w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-20 left-[-10%] w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full"></div>

              <div className="flex flex-col gap-4 text-right" dir="rtl">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="group flex items-center justify-between py-6 border-b border-white/5"
                  >
                    <span className="text-4xl sm:text-5xl font-black text-white group-hover:text-indigo-500 transition-all uppercase tracking-tighter">
                      {link.name}
                    </span>
                    <ArrowRight className="text-slate-800 group-hover:text-indigo-500 group-hover:translate-x-[-10px] transition-all rotate-180" size={32} />
                  </motion.button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-auto pt-12"
              >
                <button
                  onClick={(e) => scrollToSection(e, '#assistant')}
                  className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center gap-4 active:scale-95 transition-all mb-12"
                >
                  <Bot size={28} />
                  استشر المساعد الذكي
                </button>

                <div className="flex justify-center gap-10">
                  <a href={facebookUrl} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Facebook size={24} /></a>
                  <a href={linkedinUrl} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Linkedin size={24} /></a>
                  <a href={emailUrl} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Mail size={24} /></a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative z-10">{children}</main>

      <footer className="bg-slate-950 border-t border-white/5 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-8 mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Zap size={20} fill="currentColor" /></div>
              <span className="text-2xl font-black text-white tracking-widest uppercase">REFF<span className="text-indigo-500">AA</span></span>
            </div>
            <p className="max-w-md text-slate-500 font-bold leading-relaxed" dir="rtl">
              نحن نصمم المستقبل الرقمي من خلال الأتمتة الذكية والاستراتيجيات التي لا تقبل المنافسة.
            </p>
          </div>

          <div className="flex justify-center gap-12 mb-12">
            {[
              { icon: Facebook, href: facebookUrl },
              { icon: Linkedin, href: linkedinUrl },
              { icon: MessageCircle, href: whatsappUrl }
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-indigo-400 hover:scale-125 transition-all p-2"
              >
                <social.icon size={22} />
              </a>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] flex flex-col sm:flex-row items-center justify-center gap-2">
              <span>© {new Date().getFullYear()} REFFAA STRATEGY</span>
              <span className="hidden sm:inline text-slate-800">|</span>
              <span className="elite-text-shimmer">Engineered for Victory</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
