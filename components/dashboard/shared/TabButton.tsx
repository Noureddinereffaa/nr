import React from 'react';
import { motion } from 'framer-motion';

interface TabButtonProps {
  id: string;
  label: string;
  icon: any;
  isActive: boolean;
  onClick: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon, isActive, onClick }) => (
  <motion.button
    whileHover={{ x: 4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(id)}
    className={`relative group flex items-center justify-between w-full px-5 py-4 rounded-[var(--border-radius-elite)] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isActive
      ? 'bg-[var(--accent-indigo)] text-white shadow-[0_8px_20px_-6px_rgba(var(--accent-indigo-rgb),0.5)] translate-x-1'
      : 'text-slate-500 hover:bg-white/5 hover:text-white'
      }`}
  >
    {isActive && (
      <motion.div
        layoutId="activeTabGlow"
        className="absolute inset-0 rounded-[var(--border-radius-elite)] bg-gradient-to-r from-[rgba(var(--accent-indigo-rgb),0.3)] to-purple-500/30 blur-md pointer-events-none"
      />
    )}
    <div className="relative flex items-center gap-3 z-10">
      <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-[var(--accent-indigo)]'}`} />
      <span>{label}</span>
      {isActive && <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />}
    </div>
  </motion.button>
);

export default TabButton;
