import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Command,
    Plus,
    User,
    FileText,
    Briefcase,
    Settings,
    Zap,
    X
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { useContent } from '../../context/ContentContext';
import { useBusiness } from '../../context/BusinessContext';

interface CommandBarProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (tab: string) => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose, onNavigate }) => {
    const { aiConfig, siteData } = useSystem();
    const { articles, decisionPages } = useContent();
    const { clients, projects, invoices } = useBusiness();
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (isOpen) onClose();
                else // logic to open would be in parent
                    return;
            }
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const actions = [
        { id: 'new-invoice', label: 'إنشاء فاتورة جديدة', icon: FileText, tab: 'billing' },
        { id: 'new-project', label: 'أضف مشروعاً للاستوديو', icon: Briefcase, tab: 'projects' },
        { id: 'new-client', label: 'تسجيل عميل جديد', icon: User, tab: 'crm' },
        { id: 'go-settings', label: 'إعدادات النظام', icon: Settings, tab: 'system' }
    ];

    const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

    // Simple search results from data
    const results = [
        ...siteData.clients.map(c => ({ id: c.id, label: c.name, type: 'Client', tab: 'crm' })),
        ...siteData.projects.map(p => ({ id: p.id, label: p.title, type: 'Project', tab: 'projects' })),
        ...siteData.invoices.map(i => ({ id: i.id, label: `Invoice ${i.invoiceNumber}`, type: 'Invoice', tab: 'billing' }))
    ].filter(r => r.label.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden glass-panel">
                <div className="flex items-center px-6 border-b border-white/5">
                    <Search className="text-slate-500" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="ابحث عن أي شيء في النظام... (Ctrl+K)"
                        className="flex-1 bg-transparent border-none outline-none p-6 text-white font-bold placeholder:text-slate-600"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        dir="rtl"
                    />
                    <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-[10px] font-black text-slate-500 border border-white/5">
                        <Command size={10} />
                        K
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 custom-scrollbar" dir="rtl">
                    {/* Quick Actions */}
                    <div>
                        <h4 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">إجراءات سريعة</h4>
                        <div className="space-y-1">
                            {filteredActions.map(action => (
                                <button
                                    key={action.id}
                                    onClick={() => { onNavigate(action.tab); onClose(); }}
                                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group"
                                >
                                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-[var(--accent-indigo)] transition-colors">
                                        <action.icon size={16} />
                                    </div>
                                    <span className="font-bold text-sm">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Results */}
                    {results.length > 0 && (
                        <div>
                            <h4 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">نتائج البحث</h4>
                            <div className="space-y-1">
                                {results.map(res => (
                                    <button
                                        key={res.id}
                                        onClick={() => { onNavigate(res.tab); onClose(); }}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black group-hover:bg-[var(--accent-indigo)] transition-colors">
                                                {res.type === 'Client' ? <User size={14} /> : res.type === 'Project' ? <Briefcase size={14} /> : <FileText size={14} />}
                                            </div>
                                            <span className="font-bold text-sm">{res.label}</span>
                                        </div>
                                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 font-bold uppercase">{res.type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {query && filteredActions.length === 0 && results.length === 0 && (
                        <div className="py-12 text-center">
                            <Zap className="mx-auto text-slate-700 mb-4" size={32} />
                            <p className="text-slate-500 text-sm font-bold">لم يتم العثور على نتائج لـ "{query}"</p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-950/50 px-6 py-4 flex justify-between items-center border-t border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Zap size={10} className="text-yellow-500" />
                        OS Intelligence Enabled
                    </p>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommandBar;
