import React from 'react';
import { UserPlus, FileText, PlusCircle, Zap } from 'lucide-react';
import { useUI } from '../../../context/UIContext';

const QuickActionsWidget: React.FC = () => {
    const { openClientModal, openInvoiceModal, openProjectModal, openRequestModal, openArticleModal } = useUI();

    const actions = [
        { icon: UserPlus, label: 'عميل', color: 'text-blue-400', click: openClientModal },
        { icon: FileText, label: 'مقال', color: 'text-emerald-400', click: openArticleModal },
        { icon: Zap, label: 'فاتورة', color: 'text-[var(--accent-indigo)]', click: openInvoiceModal },
        { icon: PlusCircle, label: 'مشروع', color: 'text-purple-400', click: openProjectModal }
    ];

    return (
        <div className="grid grid-cols-2 gap-3 h-full">
            {actions.map((action, i) => (
                <button
                    key={i}
                    onClick={action.click}
                    className="flex flex-col items-center justify-center gap-2 bg-white/5 border border-white/5 rounded-2xl hover:bg-[var(--accent-indigo)] hover:text-white group transition-all"
                >
                    <action.icon size={18} className={`${action.color} group-hover:text-white transition-colors`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                </button>
            ))}
        </div>
    );
};

export default QuickActionsWidget;
