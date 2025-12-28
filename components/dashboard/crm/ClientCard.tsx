import React from 'react';
import { Client } from '../../../types';
import { Phone, Mail, DollarSign, Calendar, Clock } from 'lucide-react';

interface ClientCardProps {
    client: Client;
    onEdit: (client: Client) => void;
    onMove: (client: Client, newStatus: Client['status']) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onMove }) => {
    const statusColors = {
        lead: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        negotiation: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        active: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
        completed: 'bg-green-500/10 border-green-500/20 text-green-400',
        lost: 'bg-slate-500/10 border-slate-500/20 text-slate-400'
    };

    return (
        <div
            onClick={() => onEdit(client)}
            className="p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h5 className="font-bold text-white text-sm">{client.name}</h5>
                    <span className="text-xs text-slate-500">{client.company}</span>
                </div>
                {client.value > 0 && (
                    <div className="px-2 py-1 rounded bg-green-900/20 text-green-400 text-xs font-bold border border-green-500/10 flex items-center gap-1">
                        <DollarSign size={10} />
                        {client.value.toLocaleString()}
                    </div>
                )}
            </div>

            <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail size={12} />
                    <span className="truncate max-w-[150px]">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Phone size={12} />
                    <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 pt-2 border-t border-white/5">
                    <Clock size={12} />
                    <span>آخر تواصل: {new Date(client.lastContact).toLocaleDateString('ar-EG')}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
                {(client.tags || []).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-slate-300 border border-white/10">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Quick Actions (Move) */}
            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
                {client.status !== 'completed' && (
                    <button
                        onClick={() => onMove(client, 'completed')}
                        className="p-1.5 rounded hover:bg-green-500/20 text-slate-500 hover:text-green-400"
                        title="نقل إلى مكتمل"
                    >
                        ✓
                    </button>
                )}
                {client.status !== 'active' && (
                    <button
                        onClick={() => onMove(client, 'active')}
                        className="p-1.5 rounded hover:bg-indigo-500/20 text-slate-500 hover:text-indigo-400"
                        title="نقل إلى نشط"
                    >
                        🚀
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClientCard;
