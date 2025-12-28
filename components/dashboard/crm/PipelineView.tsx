import React, { useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { Client } from '../../../types';
import { MoreHorizontal, Phone, Mail, Calendar, DollarSign, User } from 'lucide-react';

const COLUMNS = [
    { id: 'lead', title: 'عملاء محتملين', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'negotiation', title: 'مفاوضات', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'active', title: 'جاري العمل', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { id: 'completed', title: 'مكتملة', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'lost', title: 'ملغاة / خاسرة', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
];

const PipelineView: React.FC<{ onEdit: (client: Client) => void }> = ({ onEdit }) => {
    const { siteData, updateClient } = useData();
    const clients = siteData.clients || [];

    // Group clients by status
    const groupedClients = useMemo(() => {
        const groups: Record<string, Client[]> = {
            lead: [], negotiation: [], active: [], completed: [], lost: []
        };
        clients.forEach(client => {
            if (groups[client.status]) {
                groups[client.status].push(client);
            } else {
                // Fallback for unknown status
                groups['lead'].push(client);
            }
        });
        return groups;
    }, [clients]);

    const handleDragStart = (e: React.DragEvent, clientId: string) => {
        e.dataTransfer.setData('clientId', clientId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const clientId = e.dataTransfer.getData('clientId');
        if (clientId) {
            updateClient(clientId, { status: newStatus as any });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(amount);
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-280px)] min-h-[500px]">
            {COLUMNS.map(col => (
                <div
                    key={col.id}
                    className="w-80 shrink-0 flex flex-col bg-slate-900/50 border border-white/5 rounded-xl"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                >
                    {/* Header */}
                    <div className={`p-3 border-b flex justify-between items-center rounded-t-xl ${col.color.replace('bg-', 'border-')}`}>
                        <div className={`px-2 py-1 rounded text-xs font-bold ${col.color} border`}>
                            {col.title}
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                            {groupedClients[col.id]?.length || 0}
                        </span>
                    </div>

                    {/* Cards */}
                    <div className="p-3 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                        {groupedClients[col.id]?.map(client => (
                            <div
                                key={client.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, client.id)}
                                onClick={() => onEdit(client)}
                                className="bg-slate-800 border border-white/5 p-3 rounded-lg shadow-sm hover:border-indigo-500/50 hover:shadow-md cursor-grab active:cursor-grabbing transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white text-sm line-clamp-1">{client.name}</h4>
                                    {client.value > 0 && (
                                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-1 py-0.5 rounded">
                                            {formatCurrency(client.value)}
                                        </span>
                                    )}
                                </div>

                                {client.company && (
                                    <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                                        <User size={12} />
                                        {client.company}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Phone size={10} />
                                        <span className="truncate">{client.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={10} />
                                        <span>{new Date(client.lastContact).toLocaleDateString('fr')}</span>
                                    </div>
                                </div>

                                {client.tags && client.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {client.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="text-[9px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded-full border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PipelineView;
