import React from 'react';
import { Client } from '../../../../lib/types';
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
            <div className={`p-4 rounded-t-2xl border-b-2 ${color} glass-card flex justify-between items-center`}>
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-sm">{title}</h4>
                    <span className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest">{clients.length} عملاء</span>
                </div>
                {totalValue > 0 && (
                    <div className="text-[10px] font-mono font-black text-[var(--text-secondary)] bg-white/5 px-2 py-1 rounded-lg">
                        {totalValue.toLocaleString()}د.ج
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="glass-panel flex-1 p-2 space-y-3 overflow-y-auto rounded-b-2xl border-t-0 custom-scrollbar">
                {clients.map(client => (
                    <ClientCard
                        key={client.id}
                        client={client}
                        onEdit={onEdit}
                        onMove={onMove}
                    />
                ))}

                {clients.length === 0 && (
                    <div className="text-center py-8 opacity-20 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                        Empty Stage
                    </div>
                )}
            </div>
        </div>
    );
};

export default PipelineColumn;
