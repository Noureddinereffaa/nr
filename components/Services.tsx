import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import * as LucideIcons from 'lucide-react';
import { X, Send, CheckCircle2, Zap, Target, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RequestModal: React.FC<{ service: any; onClose: () => void }> = ({ service, onClose }) => {
  const { addRequest } = useData();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      serviceId: service.id,
      serviceTitle: service.title,
      clientName: formData.name,
      clientPhone: formData.phone,
      clientEmail: formData.email,
      projectDetails: formData.details,
      priority: 'medium',
      status: 'pending'
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        onClick={onClose}
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

        {submitted ? (
          <div className="p-16 text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
            >
              <CheckCircle2 size={48} className="text-green-500" />
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white">تم استلام طلبك!</h3>
              <p className="text-slate-400 text-sm leading-relaxed" dir="rtl">سنقوم بمعالجة طلبك الاستراتيجي ومهاتفتك من قبل فريق النخبة خلال الـ 24 ساعة القادمة.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-10 border-b border-white/10 flex items-center justify-between" dir="rtl">
              <div className="text-right">
                <h3 className="text-2xl font-black text-white">طلب استشارة: {service.title}</h3>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mt-2">نقلة نوعية لمشروعك تبدأ هنا</p>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6 text-right" dir="rtl">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">الاسم واللقب</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-600 outline-none transition-all"
                  placeholder="نورالدين رفعة..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">رقم الهاتف</label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-600 outline-none"
                    placeholder="0..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-600 outline-none"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">وصف مشروعك</label>
                <textarea
                  required
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-600 outline-none resize-none"
                  placeholder="ما الذي تريد تحقيقه بدقة؟"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-base flex items-center justify-center gap-4 shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all active:scale-95 group"
              >
                إرسال طلب الاستشارة الفورية
                <Send size={20} className="group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] transition-transform" />
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

const Services: React.FC = () => {
  const { siteData } = useData();
  const { services } = siteData;
  const [selectedService, setSelectedService] = useState<any>(null);

  return (
    <section id="services" className="py-24 md:py-32 relative overflow-hidden">
      {/* Immersive Section Background */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[11px] font-black uppercase tracking-[0.4em] mb-8"
          >
            <Shield size={16} className="text-indigo-500" />
            Strategic Command Center
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black mb-10 text-white tracking-tighter leading-[0.95]"
          >
            حلول <span className="gradient-text">استراتيجية</span> <br /> لا تقبل المنافسة
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            نحن لا نبيع مجرد خدمات، نحن نصمم أنظمة ذكية تضمن لك السيطرة الكاملة على السوق الرقمي.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service: any, i: number) => {
            const IconComponent = (LucideIcons as any)[service.icon] || Zap;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative glass-card p-10 md:p-14 rounded-[3.5rem] overflow-hidden"
              >
                {/* ID Watermark */}
                <div className="absolute top-10 left-10 text-[100px] font-black text-white/5 select-none pointer-events-none group-hover:text-indigo-500/10 transition-colors duration-700">
                  {service.code?.split('-').pop() || i + 1}
                </div>

                <div className="flex flex-col md:flex-row gap-10 relative z-10">
                  <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 border border-indigo-500/10 shrink-0 shadow-2xl">
                    <IconComponent size={36} />
                  </div>

                  <div className="flex-1 text-right" dir="rtl">
                    <h3 className="text-3xl font-black text-white mb-6 group-hover:text-indigo-400 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-slate-400 text-lg leading-relaxed mb-10 line-clamp-3 group-hover:text-slate-300 transition-colors">
                      {service.description}
                    </p>

                    <div className="space-y-4 mb-12">
                      <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                        <Sparkles size={14} /> المميزات الاستراتيجية
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {service.features && service.features.map((feat: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-slate-300 font-bold group/feat hover:text-white transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 group-hover/feat:scale-150 transition-transform shadow-[0_0_8px_rgba(79,70,229,0.8)]"></div>
                            {feat}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-10 border-t border-white/5">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Service Node</span>
                        <span className="text-sm font-black text-indigo-600/50">{service.code || service.id}</span>
                      </div>
                      <button
                        onClick={() => setSelectedService(service)}
                        className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center gap-4 hover:bg-indigo-600 hover:text-white group/btn active:scale-95 shadow-xl"
                      >
                        طلب الخدمة
                        <ArrowLeft size={22} className="group-hover/btn:translate-x-[-4px] transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && <RequestModal service={selectedService} onClose={() => setSelectedService(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Services;
