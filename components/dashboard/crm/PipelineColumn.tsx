import React from 'react';
import { Client } from '../../../types';
import ClientCard from './ClientCard';

interface PipelineColumnProps {
    title: string;
    clients: Client[];
    status: Client['status'];
    color: string;
    onEdit: (client: Client) => void;
    onMove: (client: Client, newStatus: Client['status']) => void;
}

const PipelineColumn: React.FC<PipelineColumnProps> = ({ title, clients, status, color, onEdit, onMove }) => {
    const totalValue = clients.reduce((sum, c) => sum + (c.value || 0), 0);

    return (
        <div className="min-w-[280px] w-full md:w-1/3 lg:w-1/5 flex flex-col h-full max-h-[calc(100vh-200px)]">
            {/* Header */}
            <div className={`p-3 rounded-t-xl border-b-2 ${color} bg-slate-900/50 backdrop-blur-sm flex justify-between items-center`}>
                <div>
                    <h4 className="font-bold text-white text-sm">{title}</h4>
                    <span className="text-xs text-slate-500">{clients.length} عملاء</span>
                </div>
                {totalValue > 0 && (
                    <div className="text-xs font-mono font-bold text-slate-400">
                        {totalValue.toLocaleString()}د.ج
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="bg-slate-950/30 flex-1 p-2 space-y-3 overflow-y-auto rounded-b-xl border border-white/5 border-t-0 custom-scrollbar">
                {clients.map(client => (
                    <ClientCard
                        key={client.id}
                        client={client}
                        onEdit={onEdit}
                        onMove={onMove}
                    />
                ))}

                {clients.length === 0 && (
                    <div className="text-center py-8 opacity-30 text-sm">
                        لا يوجد هنا
                    </div>
                )}
            </div>
        </div>
    );
};

export default PipelineColumn;
