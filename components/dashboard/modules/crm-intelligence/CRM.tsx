import React, { useState } from 'react';
import { useData } from '../../../../context/DataContext';
import ClientForm from '../../forms/ClientForm';
import PipelineView from '../../crm/PipelineView';
import ClientDetail from '../../crm/ClientDetail';
import { Users, Plus, Search, Filter, Columns, List, Zap } from 'lucide-react';
import { Client } from '../../../../types';
import { AIService } from '../../../../lib/ai-service';

const CRM: React.FC = () => {
    const { siteData, addClient } = useData();
    const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const clients = siteData.clients || [];

    const filteredClients = clients.filter(c =>
        (c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.phone || '').includes(searchTerm)
    );

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div dir="rtl">
                    <h2 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter">
                        <div className="p-3 bg-[rgba(var(--accent-indigo-rgb),0.2)] rounded-[var(--border-radius-elite)] border border-[rgba(var(--accent-indigo-rgb),0.3)]">
                            <Users className="text-[var(--accent-indigo)]" size={32} />
                        </div>
                        إدارة العملاء الذكية
                    </h2>
                    <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-widest">CRM & Relationships Engine</p>
                </div>

                <div className="flex gap-4 bg-slate-900/40 p-1.5 rounded-[var(--border-radius-elite)] border border-white/5 backdrop-blur-md">
                    <button
                        onClick={() => setViewMode('pipeline')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-[var(--border-radius-elite)] font-black transition-all ${viewMode === 'pipeline' ? 'bg-[var(--accent-indigo)] text-white shadow-lg shadow-[rgba(var(--accent-indigo-rgb),0.2)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <Columns size={18} />
                        <span className="text-[10px] uppercase tracking-widest font-black">Pipeline</span>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-[var(--border-radius-elite)] font-black transition-all ${viewMode === 'list' ? 'bg-[var(--accent-indigo)] text-white shadow-lg shadow-[rgba(var(--accent-indigo-rgb),0.2)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <List size={18} />
                        <span className="text-[10px] uppercase tracking-widest font-black">List View</span>
                    </button>
                    <div className="w-[1px] h-10 bg-white/5 mx-2 self-center"></div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-white text-slate-950 px-6 py-2.5 rounded-[var(--border-radius-elite)] font-black transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-95 shadow-xl"
                    >
                        <Plus size={18} />
                        <span className="text-[10px] uppercase tracking-widest">Add Client</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                    <Search className="text-slate-500 group-focus-within:text-[var(--accent-indigo)] transition-colors" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="ابحث عن عميل بالاسم، الشركة أو الهاتف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    dir="rtl"
                    className="w-full bg-slate-900/50 border border-white/5 p-5 pr-14 rounded-[var(--border-radius-elite)] text-white outline-none focus:border-[rgba(var(--accent-indigo-rgb),0.5)] focus:bg-slate-900 transition-all font-bold placeholder:text-slate-600 shadow-inner"
                />
            </div>

            {/* Content View */}
            <div className="flex-1 overflow-hidden">
                {viewMode === 'pipeline' ? (
                    <PipelineView onEdit={setSelectedClient} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar h-full pb-10 pr-2">
                        {filteredClients.map(client => (
                            <div
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className="bg-slate-900/30 border border-white/5 backdrop-blur-md p-6 rounded-[var(--border-radius-elite)] hover:border-[rgba(var(--accent-indigo-rgb),0.3)] cursor-pointer transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[rgba(var(--accent-indigo-rgb),0.05)] blur-[40px] -mr-12 -mt-12 group-hover:bg-[rgba(var(--accent-indigo-rgb),0.1)] transition-colors"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-[var(--border-radius-elite)] bg-slate-800/50 flex items-center justify-center text-2xl font-black text-[var(--accent-indigo)] border border-white/10 group-hover:border-[rgba(var(--accent-indigo-rgb),0.3)] transition-all">
                                            {client.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black tracking-widest uppercase border ${client.status === 'lead' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                client.status === 'active' ? 'bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] border-[var(--accent-indigo)]/20' :
                                                    client.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                }`}>
                                                {client.status}
                                            </span>
                                            <div className="flex items-center gap-1 bg-[var(--accent-indigo)]/5 text-[var(--accent-indigo)]/70 text-[7px] font-black px-2 py-0.5 rounded border border-[var(--accent-indigo)]/10">
                                                <Zap size={8} />
                                                AI SCORE: {AIService.scoreLead(client)}%
                                            </div>
                                        </div>
                                    </div>

                                    <div dir="rtl">
                                        <h3 className="text-2xl font-black text-white mb-1 group-hover:text-[var(--accent-indigo)] transition-colors tracking-tighter">
                                            {client.name}
                                        </h3>
                                        <p className="text-slate-500 font-bold text-xs mb-6 uppercase tracking-widest">
                                            {client.company || 'مستقل'}
                                        </p>

                                        <div className="space-y-3 pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                                                {client.phone || 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-widest">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                                                Last Contact: {client.lastContact ? new Date(client.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <ClientForm
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                onSave={(data) => {
                    addClient(data);
                    setShowAddForm(false);
                }}
            />
            {selectedClient && <ClientDetail client={selectedClient} onClose={() => setSelectedClient(null)} />}
        </div>
    );
};

export default CRM;
