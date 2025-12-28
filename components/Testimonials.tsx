
import React from 'react';
import { useData } from '../context/DataContext';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const { siteData } = useData();
  const { testimonials } = siteData;

  return (
    <section id="testimonials" className="py-12 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[rgba(var(--accent-indigo-rgb),0.1)] border border-[rgba(var(--accent-indigo-rgb),0.2)] text-[var(--accent-indigo)] text-[10px] font-black uppercase tracking-widest mb-4">Clients Trust</div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">ماذا يقول <span className="text-[var(--accent-indigo)]">شركاؤنا؟</span></h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t: any, i: number) => (
            <div key={i} className="dashboard-border glass-effect p-8 rounded-[2.5rem] relative group hover:bg-slate-900/60 transition-all">
              <Quote className="absolute top-6 left-6 text-[rgba(var(--accent-indigo-rgb),0.1)] group-hover:text-[rgba(var(--accent-indigo-rgb),0.3)] transition-colors" size={40} />
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 italic relative z-10 font-medium">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'} alt={t.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                <div className="text-right">
                  <h4 className="text-white font-black text-sm">{t.name}</h4>
                  <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
