import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Search,
    Command,
    Plus,
    User,
    FileText,
    Briefcase,
    Settings,
    Zap,
    X,
    ChevronRight,
    ArrowRight,
    Calendar,
    Newspaper,
    Shield
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useUI } from '../../../context/UIContext';
import { motion, AnimatePresence } from 'framer-motion';

const UnifiedCommand: React.FC = () => {
    const { siteData } = useData();
    const { isCommandPaletteOpen, closeCommandPalette, isShieldMode } = useUI();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isCommandPaletteOpen) {
            inputRef.current?.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isCommandPaletteOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCommandPalette();
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % totalResults);
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + totalResults) % totalResults);
            }
            if (e.key === 'Enter') {
                const selected = allResults[selectedIndex];
                if (selected) {
                    handleSelect(selected);
                }
            }
        };
        if (isCommandPaletteOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCommandPaletteOpen, selectedIndex]);

    const results = useMemo(() => {
        const q = query.toLowerCase();

        const articles = (siteData.articles || [])
            .filter(a => a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q))
            .map(a => ({ id: a.id, label: a.title, type: 'Article', tab: 'content-manager', icon: Newspaper, subtitle: a.category }));

        const clients = (siteData.clients || [])
            .filter(c => c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q))
            .map(c => ({
                id: c.id,
                label: isShieldMode ? 'PROTECTED CUSTOMER' : c.name,
                type: 'Client',
                tab: 'clients',
                icon: User,
                subtitle: isShieldMode ? '****@****.***' : c.email
            }));

        const projects = (siteData.projects || [])
            .filter(p => p.title.toLowerCase().includes(q))
            .map(p => ({ id: p.id, label: p.title, type: 'Project', tab: 'projects', icon: Briefcase, subtitle: p.category }));

        const invoices = (siteData.invoices || [])
            .filter(i => (`Inv-${i.invoiceNumber}`).toLowerCase().includes(q))
            .map(i => ({
                id: i.id,
                label: `Invoice #${i.invoiceNumber}`,
                type: 'Invoice',
                tab: 'billing',
                icon: FileText,
                subtitle: isShieldMode ? '***.*** DZD' : `${i.total} DZD`
            }));

        return { articles, clients, projects, invoices };
    }, [query, siteData, isShieldMode]);

    const allResults = [...results.articles, ...results.clients, ...results.projects, ...results.invoices].slice(0, 10);
    const totalResults = allResults.length;

    const handleSelect = (item: any) => {
        // Here you would trigger navigation or open specific modal
        // For now, let's assume we navigate to the tab
        // We might need an onNavigate prop passed down or use a global navigation state
        console.log("Selected:", item);
        closeCommandPalette();
    };

    if (!isCommandPaletteOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] flex items-start justify-center pt-[12vh] p-4 bg-slate-950/40 backdrop-blur-xl"
                onClick={closeCommandPalette}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="relative w-full max-w-3xl bg-slate-900/80 border border-white/10 rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden glass-panel flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header: Search Input */}
                    <div className="flex items-center px-8 py-2 border-b border-white/5 bg-white/5">
                        <Search className="text-indigo-500" size={24} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Unified Command: Search Articles, Clients, Projects..."
                            className="flex-1 bg-transparent border-none outline-none p-6 text-xl font-black text-white placeholder:text-slate-700 tracking-tight"
                            value={query}
                            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                            dir="ltr"
                        />
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-400 border border-white/5">
                                <Command size={12} />
                                <span className="tracking-widest">K</span>
                            </div>
                            {isShieldMode && (
                                <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl border border-amber-500/20 animate-pulse">
                                    <Shield size={16} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Body */}
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-4" dir="ltr">
                        {totalResults > 0 ? (
                            <div className="space-y-1">
                                {allResults.map((item, idx) => (
                                    <button
                                        key={`${item.type}-${item.id}`}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${selectedIndex === idx ? 'bg-[var(--accent-indigo)] text-white shadow-lg scale-[1.01]' : 'hover:bg-white/5 text-slate-400'}`}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        onClick={() => handleSelect(item)}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedIndex === idx ? 'bg-white/20' : 'bg-slate-800'}`}>
                                                <item.icon size={20} />
                                            </div>
                                            <div className="text-left">
                                                <div className={`font-black tracking-tight ${selectedIndex === idx ? 'text-white' : 'text-slate-200'}`}>
                                                    {item.label}
                                                </div>
                                                <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedIndex === idx ? 'text-white/60' : 'text-slate-500'}`}>
                                                    {item.subtitle || item.type}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${selectedIndex === idx ? 'bg-white/10 border-white/20' : 'bg-slate-950/50 border-white/5'}`}>
                                                {item.type}
                                            </span>
                                            <ChevronRight size={16} className={`transition-transform ${selectedIndex === idx ? 'translate-x-1' : 'opacity-0'}`} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="py-20 text-center flex flex-col items-center">
                                <Zap className="text-slate-800 mb-6 animate-pulse" size={48} />
                                <p className="text-slate-600 font-black tracking-widest uppercase text-xs">Zero Intelligence Matches</p>
                                <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-tight">Try searching for other keywords or entities</p>
                            </div>
                        ) : (
                            <div className="py-8 space-y-6">
                                <div>
                                    <h4 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Tactical Shortcuts</h4>
                                    <div className="grid grid-cols-2 gap-3 px-2">
                                        {[
                                            { label: 'Draft New Article', icon: Newspaper, action: 'content-manager' },
                                            { label: 'Open Sovereign CRM', icon: User, action: 'clients' },
                                            { label: 'Financial Pulse', icon: FileText, action: 'billing' },
                                            { label: 'System Hardening', icon: Settings, action: 'system' }
                                        ].map((s, i) => (
                                            <button key={i} className="flex items-center gap-3 p-4 bg-slate-800/50 border border-white/5 rounded-2xl hover:bg-white/5 transition-all text-slate-400 hover:text-white">
                                                <s.icon size={16} className="text-indigo-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Instructions */}
                    <div className="bg-slate-950/80 px-8 py-4 flex justify-between items-center border-t border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
                        <div className="flex gap-6">
                            <span className="flex items-center gap-2"><ArrowRight size={12} className="rotate-90" /> Navigate</span>
                            <span className="flex items-center gap-2"><Zap size={12} /> Select</span>
                            <span className="flex items-center gap-2">Esc Close</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--accent-indigo)]">
                            <Zap size={10} />
                            NR-OS Sovereign Intelligence
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UnifiedCommand;
