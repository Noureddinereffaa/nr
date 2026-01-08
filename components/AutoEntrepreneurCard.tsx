
import React from 'react';
import { useSystem } from '../context/SystemContext';
import { useUI } from '../context/UIContext';
import { MapPin, ShieldCheck, Verified } from 'lucide-react';

const AutoEntrepreneurCard: React.FC = () => {
  const { siteData } = useSystem();
  const { isShieldMode } = useUI();
  const profile = siteData?.profile || {};

  return (
    <section id="about" className="py-12 relative overflow-hidden bg-slate-950/20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto glass-effect rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-4 p-6 bg-indigo-600/5 flex flex-col items-center justify-center gap-4 border-l border-white/5">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/20 p-1">
                <img src={profile.photoUrl} alt="Identity" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[8px] font-bold border border-green-500/20">
                <Verified size={10} />
                VERIFIED
              </div>
            </div>

            <div className="lg:col-span-8 p-8 text-right">
              <div className="mb-6">
                <h3 className="text-xl font-black text-white mb-0.5">{profile.name}</h3>
                <p className="text-indigo-400 text-[10px] font-bold">{profile.secondaryTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">رقم الاعتماد</p>
                  <p className="text-base font-mono font-black text-white leading-none">{profile.cardId}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">تاريخ الصلاحية</p>
                  <p className="text-base font-black text-white leading-none">{profile.expiry}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="flex gap-2 items-center text-slate-400">
                  <MapPin size={14} className="text-indigo-500" />
                  <p className="text-[10px] font-medium leading-tight">{profile.address}</p>
                </div>
                <ShieldCheck size={16} className="text-indigo-500 opacity-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoEntrepreneurCard;
