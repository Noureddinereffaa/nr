import React, { useState, useEffect } from 'react';
import {
  Settings, X, Briefcase,
  MessageSquare, BarChart, Zap, Shield,
  TrendingUp, Activity, BrainCircuit,
  Terminal, LayoutDashboard, Receipt, Users,
  Fingerprint, Settings2, HardDrive, Menu, MessageCircle
} from 'lucide-react';

import { useLocation } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setIsOpen(true);
    }
  }, [location.pathname]);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 left-6 z-[300] w-14 h-14 md:w-16 md:h-16 bg-[var(--accent-indigo)] text-white rounded-[var(--border-radius-elite)] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-white/20 group">
        <Settings size={24} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>
    );
  }

  const TabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button
      onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
      className={`flex items-center justify-between w-full px-5 py-4 rounded-[var(--border-radius-elite)] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === id ? 'bg-[var(--accent-indigo)] text-white shadow-xl' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
    >
      <div className="flex items-center gap-3"><Icon size={18} /><span>{label}</span></div>
    </button>
  );

  const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem]">
      <h3 className="text-2xl font-black text-white">{title}</h3>
      <p className="text-slate-500 mt-2">Content for this section will be built here.</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" onClick={() => setIsOpen(false)}></div>

      <div className="relative w-full h-full md:h-[90vh] md:max-w-7xl bg-slate-950 md:border md:border-white/10 md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">

        <div className="p-4 md:p-6 lg:p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/50 sticky top-0 z-[100] backdrop-blur-md">
          <div className="flex items-center gap-4 text-right" dir="rtl">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10"><Menu size={20} /></button>
            <div className="hidden sm:flex w-10 h-10 bg-[var(--accent-indigo)] rounded-lg items-center justify-center text-white shadow-lg"><Shield size={20} /></div>
            <div>
              <h2 className="text-base md:text-xl font-black text-white uppercase tracking-tighter">نظام <span className="text-[var(--accent-indigo)]">NR OS</span></h2>
              <p className="hidden md:block text-[8px] text-slate-500 font-bold uppercase tracking-widest">Command Center v4.5</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white border border-white/10 transition-all"><X size={20} /></button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          <div className={`absolute md:relative z-[90] w-72 h-full bg-slate-900 border-l border-white/5 p-4 transition-transform duration-500 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
            <div className="space-y-1">
              <TabButton id="overview" label="نظرة عامة" icon={LayoutDashboard} />
              <TabButton id="crm" label="إدارة العملاء (CRM)" icon={Users} />
              <TabButton id="billing" label="المالية والفواتير" icon={Receipt} />
              <TabButton id="projects" label="ستوديو المشاريع" icon={Briefcase} />
              <TabButton id="requests" label="الطلبات" icon={MessageCircle} />
              <TabButton id="services" label="إدارة الخدمات" icon={Terminal} />
              <TabButton id="identity" label="الهوية الشخصية" icon={Fingerprint} />
              <TabButton id="aibrain" label="العقل الرقمي" icon={BrainCircuit} />
              <TabButton id="content-extra" label="المحتوى والبيانات" icon={Settings2} />
              <div className="pt-8 mt-8 border-t border-white/5 opacity-60">
                <TabButton id="system" label="إعدادات النظام" icon={HardDrive} />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 space-y-12 bg-slate-950/50 no-scrollbar scroll-smooth pb-32" dir="rtl">
            {activeTab === 'overview' && <PlaceholderContent title="نظرة عامة" />}
            {activeTab === 'crm' && <PlaceholderContent title="إدارة العملاء (CRM)" />}
            {activeTab === 'billing' && <PlaceholderContent title="المالية والفواتير" />}
            {activeTab === 'projects' && <PlaceholderContent title="ستوديو المشاريع" />}
            {activeTab === 'requests' && <PlaceholderContent title="الطلبات الواردة" />}
            {activeTab === 'services' && <PlaceholderContent title="إدارة الخدمات" />}
            {activeTab === 'identity' && <PlaceholderContent title="الهوية الشخصية" />}
            {activeTab === 'aibrain' && <PlaceholderContent title="العقل الرقمي" />}
            {activeTab === 'content-extra' && <PlaceholderContent title="المحتوى والبيانات" />}
            {activeTab === 'system' && <PlaceholderContent title="إعدادات النظام" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;