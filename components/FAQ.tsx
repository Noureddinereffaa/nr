
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const { siteData } = useData();
  const { faqs } = siteData;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-12 md:py-20 relative bg-slate-950/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-10 md:mb-16">
          <HelpCircle className="text-[var(--accent-indigo)] mx-auto mb-3" size={32} />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">أسئلة <span className="text-[var(--accent-indigo)]">شائعة</span></h2>
          <p className="text-slate-400 text-sm">إجابات سريعة على تساؤلاتك حول خدماتنا وطريقة عملنا.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq: any, i: number) => (
            <div key={i} className={`dashboard-border rounded-[var(--border-radius-elite)] overflow-hidden transition-all ${openIndex === i ? 'bg-[rgba(var(--accent-indigo-rgb),0.05)] border-[rgba(var(--accent-indigo-rgb),0.3)]' : 'bg-slate-900/40 border-white/5'}`}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-5 md:p-6 text-right flex items-center justify-between"
              >
                <span className="text-sm md:text-base font-bold text-white pr-4">{faq.q}</span>
                {openIndex === i ? <ChevronUp className="text-[var(--accent-indigo)] shrink-0" /> : <ChevronDown className="text-slate-500 shrink-0" />}
              </button>
              {openIndex === i && (
                <div className="px-5 md:px-6 pb-5 md:pb-6 animate-in slide-in-from-top-2 duration-300 text-right">
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
