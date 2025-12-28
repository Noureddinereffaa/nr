import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, Sparkles } from 'lucide-react';

const Process: React.FC = () => {
  const { siteData } = useData();
  const { process } = siteData;

  const icons = [Target, Zap, Shield, Sparkles];

  return (
    <section id="process" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[11px] font-black uppercase tracking-[0.4em] mb-8"
          >
            Strategic Architecture
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black mb-10 text-white tracking-tighter leading-none"
          >
            كيف نصنع <span className="gradient-text">الفارق؟</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            نتبع منهجية هندسية صارمة تضمن تحويل الرؤى المعقدة إلى أنظمة رقمية تتسم بالسيادة والنمو المستدام.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {process.map((item: any, idx: number) => {
            const Icon = icons[idx % icons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative glass-card p-10 rounded-[3.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-3"
              >
                {/* Step ID Silk Shimmer */}
                <div className="absolute -top-6 -right-6 text-[120px] font-black text-white/5 select-none pointer-events-none group-hover:text-indigo-500/10 transition-colors duration-700">
                  {idx + 1}
                </div>

                <div className="relative z-10 text-right" dir="rtl">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-8 border border-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-2xl">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-lg leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                    {item.desc}
                  </p>
                </div>

                {/* Connecting Line (Desktop) */}
                {idx < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -left-5 w-10 h-px bg-gradient-to-r from-indigo-500/30 to-transparent"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
