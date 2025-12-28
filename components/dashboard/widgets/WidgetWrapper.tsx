import React from 'react';
import { Maximize2, MoreHorizontal, GripVertical } from 'lucide-react';

interface WidgetWrapperProps {
    children: React.ReactNode;
    title: string;
    size?: 'small' | 'medium' | 'large' | 'full';
    onAction?: () => void;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ children, title, size = 'medium', onAction }) => {
    const sizeClasses = {
        small: 'col-span-1 h-48',
        medium: 'col-span-1 md:col-span-2 h-64',
        large: 'col-span-1 md:col-span-2 lg:col-span-3 h-80',
        full: 'col-span-1 md:col-span-4 h-auto min-h-[400px]'
    };

    return (
        <div className={`${sizeClasses[size]} bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-3xl relative group overflow-hidden transition-all hover:border-[rgba(var(--accent-indigo-rgb),0.3)] shadow-2xl`}>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between relative z-10 bg-slate-900/20">
                <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-slate-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors">
                        <Maximize2 size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors">
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 h-[calc(100%-72px)] overflow-hidden">
                {children}
            </div>

            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(var(--accent-indigo-rgb),0.02)] blur-3xl -mr-16 -mt-16 group-hover:bg-[rgba(var(--accent-indigo-rgb),0.05)] transition-all"></div>
        </div>
    );
};

export default WidgetWrapper;
