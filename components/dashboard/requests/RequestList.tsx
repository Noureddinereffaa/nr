import React from 'react';
import { ServiceRequest } from '../../../types';
import { Mail, Clock, CheckCircle, AlertCircle, Archive } from 'lucide-react';

interface RequestListProps {
    requests: ServiceRequest[];
    selectedId: string | null;
    onSelect: (req: ServiceRequest) => void;
    filter: string;
}

const RequestList: React.FC<RequestListProps> = ({ requests, selectedId, onSelect, filter }) => {

    const getIcon = (status: string) => {
        if (status === 'new') return <AlertCircle size={14} className="text-blue-400" />;
        if (status === 'completed') return <CheckCircle size={14} className="text-green-400" />;
        return <Clock size={14} className="text-amber-400" />;
    };

    const getPriorityColor = (p: string) => {
        if (p === 'high') return 'bg-red-500/20 text-red-300';
        if (p === 'medium') return 'bg-amber-500/20 text-amber-300';
        return 'bg-blue-500/20 text-blue-300';
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-slate-900 border-l border-white/5 w-80 shrink-0">
            {/* Search/Filter Header would go here */}

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {requests.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">لا توجد طلبات</div>
                )}

                {requests.map(req => (
                    <div
                        key={req.id}
                        onClick={() => onSelect(req)}
                        className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedId === req.id
                                ? 'bg-indigo-600/10 border-indigo-500/50'
                                : 'bg-transparent border-transparent hover:bg-white/5'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${getPriorityColor(req.priority || 'low')}`}>
                                {req.priority || 'Low'}
                            </span>
                            <span className="text-[10px] text-slate-500">{new Date(req.date).toLocaleDateString()}</span>
                        </div>

                        <h4 className={`font-bold text-sm mb-0.5 ${selectedId === req.id ? 'text-indigo-200' : 'text-slate-200'}`}>
                            {req.clientName}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{req.serviceTitle}</p>

                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-[10px] bg-slate-950 px-2 py-1 rounded w-fit">
                                {getIcon(req.status)}
                                <span className="opacity-70 uppercase tracking-wider">{req.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RequestList;
