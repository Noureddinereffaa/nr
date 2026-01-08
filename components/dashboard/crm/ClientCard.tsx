import React from 'react';
import { Client } from '../../../types';
import { Phone, Mail, DollarSign, Calendar, Clock, Zap } from 'lucide-react';
import { useUI } from '../../../context/UIContext';
import { BusinessIntelligence } from '../../../lib/business-intelligence';

interface ClientCardProps {
    client: Client;
    onEdit: (client: Client) => void;
    onMove: (client: Client, newStatus: Client['status']) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onMove }) => {
    const { mask } = useUI();
    const { score, level } = BusinessIntelligence.calculateLeadScore(client);

    const levelColors = {
        boiling: 'text-red-500 bg-red-500/10 border-red-500/20',
        hot: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        warm: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        cold: 'text-slate-500 bg-slate-500/10 border-slate-500/20'
    };

    return (
        <div
            onClick={() => onEdit(client)}
            className="p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h5 className="font-bold text-white text-sm">
                            {mask(client.name, 'text')}
                        </h5>
                        <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1 border ${levelColors[level]}`}>
                            <Zap size={8} className="fill-current" />
                            {level}
                        </div>
                    </div>
                    <span className="text-xs text-slate-500">
                        {mask(client.company || '', 'text')}
                    </span>
                </div>
                {client.value > 0 && (
                    <div className={`px-2 py-1 rounded text-xs font-bold border flex items-center gap-1 bg-green-900/20 text-green-400 border-green-500/10`}>
                        <DollarSign size={10} />
                        {mask(client.value.toLocaleString(), 'currency')}
                    </div>
                )}
            </div>

            <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail size={12} />
                    <span className="truncate max-w-[150px]">{mask(client.email, 'email')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Phone size={12} />
                    <span>{mask(client.phone, 'phone')}</span>
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
