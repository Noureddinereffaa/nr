import React, { useState } from 'react';
import { useBusiness } from '../../../../context/BusinessContext';
import { useSystem } from '../../../../context/SystemContext';
import { useUI } from '../../../../context/UIContext';
import PipelineView from '../../crm/PipelineView';
import ClientDetail from '../../crm/ClientDetail';
import { Users, Plus, Search, Filter, Columns, List, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from '../../../../types';

const CRM: React.FC = () => {
    const { clients, deleteClient } = useBusiness();
    const { aiConfig } = useSystem();
    const { openClientModal } = useUI();
    const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients.filter(c =>
        (c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" dir="rtl">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-widest uppercase">CRM Intelligence</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">نظام إدارة العلاقات المدعوم بالذكاء الاصطناعي</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/5 rounded-2xl">
                        <button
                            onClick={() => setViewMode('pipeline')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'pipeline' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <Columns size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <button
                        onClick={openClientModal}
                        className="flex items-center gap-3 px-6 py-3.5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 active:scale-95 translate-y-0 hover:-translate-y-1"
                    >
                        <Plus size={18} />
                        إضافة عميل
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" dir="rtl">
                <div className="md:col-span-3 relative">
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="ابحث في قاعدة بيانات العملاء..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 rounded-2xl pr-14 pl-6 py-4 text-white placeholder:text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-inner"
                    />
                </div>
                <button className="flex items-center justify-center gap-3 p-4 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                    <Filter size={18} />
                    <span>تصفية متقدمة</span>
                </button>
            </div>

            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                {viewMode === 'pipeline' ? (
                    <motion.div
                        key="pipeline"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <PipelineView
                            clients={filteredClients}
                            onEdit={setSelectedClient}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl"
                    >
                        <div className="space-y-4">
                            {filteredClients.map(client => (
                                <div
                                    key={client.id}
                                    onClick={() => setSelectedClient(client)}
                                    className="group flex flex-col md:flex-row items-center justify-between p-6 bg-slate-950/50 border border-white/5 rounded-2xl hover:border-indigo-500/50 transition-all cursor-pointer"
                                    dir="rtl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
                                            {client.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{client.name}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{client.company}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                                        <div className="text-left">
                                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest text-right">قيمة الصفقة</p>
                                            <p className="text-white font-mono">${client.value?.toLocaleString() || '0'}</p>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${client.status === 'lead' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                            {client.status}
                                        </div>
                                        <Zap size={14} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Client Detail Modal/Sidebar */}
            {selectedClient && (
                <ClientDetail
                    client={selectedClient}
                    onClose={() => setSelectedClient(null)}
                // Removed onDelete as it's not in ClientDetailProps
                />
            )}
        </div>
    );
};

export default CRM;
