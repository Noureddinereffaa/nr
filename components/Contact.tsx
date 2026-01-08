import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Mail, MessageSquare, MapPin, Send, Phone, MessageCircle, ExternalLink } from 'lucide-react';

const Contact: React.FC = () => {
  const { contactInfo } = useSystem();

  // Build WhatsApp URL from phone number if not a full URL
  const whatsappUrl = contactInfo?.whatsapp?.startsWith('http')
    ? contactInfo.whatsapp
    : `https://wa.me/${(contactInfo?.whatsapp || '').replace(/\D/g, '')}`;

  const contactMethods = [
    {
      icon: MessageCircle,
      label: "واتساب مباشر",
      val: contactInfo?.whatsapp || 'غير محدد',
      href: whatsappUrl,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      icon: Mail,
      label: "البريد للتواصل الرسمي",
      val: contactInfo?.email || 'غير محدد',
      href: `mailto:${contactInfo?.email || ''}`,
      color: "text-[var(--accent-indigo)]",
      bg: "bg-[rgba(var(--accent-indigo-rgb),0.1)]"
    },
    {
      icon: Phone,
      label: "رقم الهاتف والاتصال",
      val: contactInfo?.phone || 'غير محدد',
      href: `tel:${(contactInfo?.phone || '').replace(/\s/g, '')}`,
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      icon: MapPin,
      label: "المقر الرئيسي",
      val: contactInfo?.address || 'غير محدد',
      href: "#",
      color: "text-amber-400",
      bg: "bg-amber-500/10"
    }
  ];

  return (
    <section id="contact" className="py-8 sm:py-12 md:py-20 lg:py-24 relative overflow-hidden px-4 sm:px-6">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-24 items-start">

            {/* Left Side: Information Hub */}
            <div className="lg:col-span-5 text-center lg:text-right" dir="rtl">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[rgba(var(--accent-indigo-rgb),0.1)] border border-[rgba(var(--accent-indigo-rgb),0.2)] text-[var(--accent-indigo)] text-[11px] font-black uppercase tracking-[0.4em] mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-indigo)] animate-pulse"></span>
                Get in Touch
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 md:mb-8 text-white tracking-tighter leading-[1.1]">
                لنحول رؤيتك إلى <br /> <span className="gradient-text">واقع رقمي</span>
              </h2>

              <p className="text-base md:text-lg lg:text-xl leading-relaxed mb-10 md:mb-12 opacity-80 font-medium text-slate-400">
                تواصل معي اليوم لمناقشة مشروعك القادم. سواء كان فكرة ناشئة أو تطوير لنظام قائم، أنا هنا لتقديم الخبرة المطلوبة.
              </p>

              <div className="space-y-3 sm:space-y-4 text-right">
                {contactMethods.map((method, i) => (
                  <a
                    key={i}
                    href={method.href}
                    target={method.href.startsWith('http') ? "_blank" : undefined}
                    className="flex items-center gap-3 sm:gap-4 md:gap-6 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-[2rem] bg-slate-900/30 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all group backdrop-blur-sm"
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${method.bg} rounded-xl sm:rounded-2xl flex items-center justify-center ${method.color} group-hover:scale-110 transition-transform shadow-lg shadow-black/20 shrink-0`}>
                      <method.icon size={20} className="sm:w-[22px] sm:h-[22px] md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{method.label}</p>
                      <p className="text-sm md:text-lg font-black text-white group-hover:text-[var(--accent-indigo)] transition-colors uppercase tracking-tight truncate">{method.val}</p>
                    </div>
                    <ExternalLink size={14} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 hidden sm:block" />
                  </a>
                ))}
              </div>

              {/* Direct WhatsApp CTA Card */}
              <div className="mt-8 sm:mt-10 md:mt-12 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-right">
                    <h4 className="text-lg md:text-xl font-black text-white mb-1 md:mb-2">استشارة فورية عبر الواتساب؟</h4>
                    <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">متاح الآن للرد على استفساراتكم</p>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap min-h-[48px]"
                  >
                    تحدث معي الآن
                    <MessageCircle size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Engine Form */}
            <div className="lg:col-span-7 w-full">
              <div className="p-6 sm:p-8 md:p-12 lg:p-16 rounded-3xl sm:rounded-[2.5rem] md:rounded-[4rem] bg-slate-900/50 border border-white/5 backdrop-blur-3xl relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-indigo)] to-transparent opacity-30"></div>

                <div className="relative z-10">
                  <div className="mb-10 md:mb-12 text-center lg:text-right">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-4 tracking-tighter">محرك الطلبات الرقمي</h3>
                    <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Project Submission Engine v1.0</p>
                  </div>

                  <form className="space-y-6 sm:space-y-8 text-right" dir="rtl">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">الاسم الكامل</label>
                      <input
                        type="text"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-[var(--border-radius-elite)] px-5 sm:px-6 py-4 sm:py-5 text-base text-white focus:border-[var(--accent-indigo)] focus:bg-slate-950 outline-none transition-all shadow-inner"
                        placeholder="الاسم واللقب..."
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-[var(--border-radius-elite)] px-5 sm:px-6 py-4 sm:py-5 text-base text-white focus:border-[var(--accent-indigo)] focus:bg-slate-950 outline-none transition-all shadow-inner"
                        placeholder="example@mail.com"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">مجال المشروع</label>
                      <div className="relative">
                        <select className="w-full bg-slate-950/80 border border-white/10 rounded-[var(--border-radius-elite)] px-5 sm:px-6 py-4 sm:py-5 text-base text-white focus:border-[var(--accent-indigo)] focus:bg-slate-950 outline-none appearance-none transition-all cursor-pointer">
                          <option>تطوير أعمال وإدارة أتمتة</option>
                          <option>تجارة إلكترونية ودفع إلكتروني</option>
                          <option>بناء هوية بصرية وعلامة تجارية</option>
                          <option>تسويق رقمي وإدارة حملات</option>
                          <option>آخر</option>
                        </select>
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          <ExternalLink size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">تفاصيل الرؤية والأهداف</label>
                      <textarea
                        rows={6}
                        className="w-full bg-slate-950/80 border border-white/10 rounded-[var(--border-radius-elite)] px-5 sm:px-6 py-4 sm:py-5 text-base text-white focus:border-[var(--accent-indigo)] focus:bg-slate-950 outline-none transition-all shadow-inner resize-none"
                        placeholder="اشرح لنا فكرتك، المشاكل التي تواجهها، والأهداف التي تريد تحقيقها..."
                      ></textarea>
                    </div>

                    <button type="submit" className="w-full group bg-white hover:bg-[var(--accent-indigo)] text-slate-950 hover:text-white py-4 sm:py-6 rounded-[var(--border-radius-elite)] font-black text-base flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98] min-h-[56px]">
                      إرسال رسالتك الآن
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
