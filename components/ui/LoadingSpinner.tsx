import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-12 h-full w-full">
            <Loader2 className="w-10 h-10 text-[var(--accent-indigo)] animate-spin" />
            <p className="mt-4 text-slate-400 text-sm font-bold animate-pulse">جاري التحميل...</p>
        </div>
    );
};

export default LoadingSpinner;
