import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { X, Send, CheckCircle2, Zap, Target, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RequestWizard } from './services/wizard/RequestWizard';
import { useBusiness } from '../context/BusinessContext';
import { useSystem } from '../context/SystemContext';

const Services: React.FC = () => {
  const { services } = useBusiness();
  const { brand } = useSystem();
  const [selectedService, setSelectedService] = useState<any>(null);

  const templateId = brand?.templateId || 'premium-glass';
  const isCyber = templateId === 'cyber-command';
  const isMinimalist = templateId === 'minimalist-pro';

  return (
    <section id="services" className="py-8 sm:py-12 md:py-16 relative overflow-hidden px-4 sm:px-6">
      {/* Immersive Section Background */}
      {!isMinimalist && (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none"></div>
        </>
      )}

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border text-[11px] font-black uppercase tracking-[0.4em] mb-8 ${isCyber ? 'bg-green-500/10 border-green-500/20 text-green-500' : isMinimalist ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-indigo-400'
              }`}
          >
            <Shield size={16} className={isCyber ? 'text-green-500' : 'text-indigo-500'} />
            {isCyber ? 'STRATEGIC NODE NETWORK' : 'Strategic Command Center'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 tracking-tighter leading-[0.95] ${isMinimalist ? 'text-slate-950' : 'text-white'}`}
          >
            حلول <span className={isMinimalist ? 'text-indigo-600' : 'gradient-text'}>استراتيجية</span> <br /> لا تقبل المنافسة
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto font-medium ${isMinimalist ? 'text-slate-600' : 'text-slate-400'}`}
          >
            نحن لا نبيع مجرد خدمات، نحن نصمم أنظمة ذكية تضمن لك السيطرة الكاملة على السوق الرقمي.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service: any, i: number) => {
            const IconComponent = (LucideIcons as any)[service.icon] || Zap;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative glass-card p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl overflow-hidden"
              >
                {/* ID Watermark */}
                <div className="absolute top-10 left-10 text-[100px] font-black text-white/5 select-none pointer-events-none group-hover:text-indigo-500/10 transition-colors duration-700">
                  {service.code?.split('-').pop() || i + 1}
                </div>

                <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10 relative z-10">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-indigo-600/10 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 border border-indigo-500/10 shrink-0 shadow-2xl">
                    <IconComponent size={28} className="sm:w-[32px] sm:h-[32px] md:w-[36px] md:h-[36px]" />
                  </div>

                  <div className="flex-1 text-right" dir="rtl">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4 sm:mb-6 group-hover:text-indigo-400 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 md:mb-10 line-clamp-3 group-hover:text-slate-300 transition-colors">
                      {service.description}
                    </p>

                    <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 md:mb-12">
                      <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                        <Sparkles size={14} /> المميزات الاستراتيجية
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {service.features && service.features.map((feat: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-slate-300 font-bold group/feat hover:text-white transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 group-hover/feat:scale-150 transition-transform shadow-[0_0_8px_rgba(79,70,229,0.8)]"></div>
                            {feat}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 sm:pt-8 md:pt-10 border-t border-white/5">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Service Node</span>
                        <span className="text-sm font-black text-indigo-600/50">{service.code || service.id}</span>
                      </div>
                      <button
                        onClick={() => setSelectedService(service)}
                        className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center gap-4 hover:bg-indigo-600 hover:text-white group/btn active:scale-95 shadow-xl"
                      >
                        طلب الخدمة
                        <ArrowLeft size={20} className="sm:w-[22px] sm:h-[22px] group-hover/btn:translate-x-[-4px] transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <RequestWizard
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        initialData={{
          serviceTitle: selectedService?.title,
          serviceId: selectedService?.id
        }}
      />
    </section>
  );
};

export default Services;
