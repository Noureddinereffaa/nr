import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ExternalLink, BarChart3, X, Calendar, User, Zap, ChevronLeft, ArrowRight, ImageIcon, Sparkles, Target, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetail: React.FC<{ project: any; onClose: () => void }> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative w-full max-w-6xl bg-slate-900 border border-white/10 rounded-[3rem] md:rounded-[4rem] shadow-[0_50px_150px_rgba(0,0,0,0.8)] flex flex-col h-[90vh] overflow-hidden overflow-y-auto no-scrollbar"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"></div>

        {/* Header Photo & Identity */}
        <div className="relative h-[40vh] md:h-[550px] shrink-0">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-8 left-8 md:top-12 md:left-12 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all z-20 group"
          >
            <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>

          <div className="absolute bottom-10 right-10 left-10 md:bottom-20 md:right-20 md:left-20 text-right" dir="rtl">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-600 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-6 shadow-xl"
            >
              <Target size={14} />
              {project.category}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter"
            >
              {project.title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-end gap-8 text-slate-300 border-r-4 border-indigo-600 pr-6"
            >
              <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest"><Calendar size={18} className="text-indigo-400" /> {project.date || '2024'}</div>
              <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest"><User size={18} className="text-indigo-400" /> {project.client || 'N/A'}</div>
            </motion.div>
          </div>
        </div>

        {/* Content Strategic Layout */}
        <div className="p-8 md:p-24 grid lg:grid-cols-12 gap-16 md:gap-24 text-right" dir="rtl">
          {/* Narrative Core */}
          <div className="lg:col-span-8 space-y-20">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-8 flex items-center gap-4">
                <ChevronLeft className="text-indigo-500" size={32} /> استراتيجية المشروع
              </h3>
              <p className="text-slate-400 text-lg md:text-2xl leading-relaxed font-medium">
                {project.fullDescription}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="p-10 rounded-[3rem] bg-slate-950/50 border border-white/5 relative overflow-hidden group">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-600/5 blur-3xl group-hover:bg-red-600/10 transition-colors"></div>
                <h4 className="text-red-400 font-black text-xl mb-6 flex items-center gap-3">تحديات التنفيذ <Zap size={20} /></h4>
                <p className="text-slate-400 text-lg leading-relaxed">{project.challenges || project.caseStudy?.problem || 'تم تجاوز التحديات التقنية بنجاح.'}</p>
              </div>
              <div className="p-10 rounded-[3rem] bg-indigo-600/5 border border-indigo-600/20 relative overflow-hidden group">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-600/5 blur-3xl group-hover:bg-indigo-600/10 transition-colors"></div>
                <h4 className="text-indigo-400 font-black text-xl mb-6 flex items-center gap-3">الحلول الهندسية <ArrowRight size={20} /></h4>
                <p className="text-slate-400 text-lg leading-relaxed">{project.solutions || project.caseStudy?.solution || 'تطوير بنية تحتية رقمية قوية ومستدامة.'}</p>
              </div>
            </div>

            {/* Immersive Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="pt-16 border-t border-white/10">
                <h3 className="text-3xl font-black text-white mb-12 flex items-center gap-4">
                  <ImageIcon className="text-indigo-500" size={32} /> توثيق الإنجاز
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.gallery.map((img: string, idx: number) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="rounded-[2.5rem] overflow-hidden border border-white/10 group h-80 bg-slate-800 shadow-2xl"
                    >
                      <img
                        src={img}
                        alt={`${project.title} - ${idx + 1}`}
                        className="w-full h-full object-cover transition-all duration-1000 grayscale-[30%] group-hover:grayscale-0"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metrics & Identity Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 rounded-[3.5rem] bg-indigo-600 text-white text-center shadow-3xl shadow-indigo-600/30 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <BarChart3 size={48} className="mx-auto mb-6 text-indigo-200" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-indigo-100">Performance Peak</p>
              <h4 className="text-3xl md:text-4xl font-black tracking-tighter">{project.stats}</h4>
            </motion.div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 pr-4 border-r-2 border-indigo-600">الترسانة التقنية</h4>
              <div className="flex flex-wrap gap-3 justify-end">
                {(project.technologies || project.tags || []).map((tech: string, idx: number) => (
                  <span key={idx} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-black hover:bg-white/10 hover:border-indigo-500 transition-all cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <button className="group relative w-full py-6 rounded-3xl bg-white text-slate-950 font-black text-lg overflow-hidden transition-all shadow-2xl active:scale-95">
              <div className="absolute inset-0 bg-indigo-600 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500"></div>
              <span className="relative z-10 group-hover:text-white flex items-center justify-center gap-4 transition-colors">
                زيارة المشروع
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Portfolio: React.FC = () => {
  const { siteData } = useData();
  const { projects } = siteData;
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { brand } = siteData;
  const templateId = brand?.templateId || 'premium-glass';
  const isCyber = templateId === 'cyber-command';
  const isMinimalist = templateId === 'minimalist-pro';

  return (
    <section id="portfolio" className={`py-24 md:py-32 relative overflow-hidden ${isMinimalist ? 'bg-slate-50' : ''}`}>
      {!isMinimalist && (
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none"></div>
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border text-[11px] font-black uppercase tracking-[0.4em] mb-8 ${isCyber ? 'bg-green-500/10 border-green-500/20 text-green-500' : isMinimalist ? 'bg-white border-slate-200 text-slate-950 shadow-sm' : 'bg-white/5 border-white/10 text-indigo-400'
              }`}
          >
            <Sparkles size={16} className={isCyber ? 'text-green-500' : 'text-indigo-500'} />
            Elite Case Studies
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.95] ${isMinimalist ? 'text-slate-950' : 'text-white'}`}
          >
            معرض <span className={isMinimalist ? 'text-indigo-600' : 'gradient-text'}>الإنجازات</span> <br /> الاستراتيجي
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium ${isMinimalist ? 'text-slate-600' : 'text-slate-400'}`}
          >
            شاهد كيف تحولت الرؤى الطموحة إلى واقع رقمي ملموس من خلال حلولنا الهندسية المبتكرة.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.map((project: any, i: number) => (
            <motion.div
              key={project.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative glass-card rounded-[3.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-3"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>

                {/* Visual Accent */}
                <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                  <Globe size={12} className="animate-spin-slow" />
                  {project.category}
                </div>
              </div>

              <div className="p-10 text-right" dir="rtl">
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{project.title}</h3>
                <div className="flex items-center gap-3 text-indigo-400 mb-8 font-black">
                  <BarChart3 size={20} className="text-indigo-500" />
                  <span className="text-sm uppercase tracking-widest">{project.stats}</span>
                </div>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:border-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl group/btn"
                >
                  استكشف تفاصيل المشروع
                  <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
