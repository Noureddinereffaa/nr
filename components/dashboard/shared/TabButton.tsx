import React from 'react';

interface TabButtonProps {
  id: string;
  label: string;
  icon: any;
  isActive: boolean;
  onClick: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`relative group flex items-center justify-between w-full px-5 py-4 rounded-[var(--border-radius-elite)] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isActive
      ? 'bg-[var(--accent-indigo)] text-white shadow-[0_8px_20px_-6px_rgba(var(--accent-indigo-rgb),0.4)] translate-x-1'
      : 'text-slate-500 hover:bg-white/5 hover:text-[var(--accent-indigo)] hover:translate-x-1'
      }`}
  >
    {isActive && (
      <div className="absolute inset-0 rounded-[var(--border-radius-elite)] bg-gradient-to-r from-[rgba(var(--accent-indigo-rgb),0.2)] to-purple-500/20 blur-md pointer-events-none" />
    )}
    <div className="relative flex items-center gap-3 z-10">
      <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span>{label}</span>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />}
    </div>
  </button>
);

export default TabButton;
