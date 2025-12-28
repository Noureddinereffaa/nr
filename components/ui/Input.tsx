import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">
                {label}
            </label>
            <input
                {...props}
                className={`w-full bg-slate-950 border border-white/10 rounded-[var(--border-radius-elite)] px-4 py-3 text-white placeholder:text-slate-600 focus:border-[var(--accent-indigo)] focus:ring-1 focus:ring-[var(--accent-indigo)] outline-none transition-all text-right ${props.className}`}
            />
        </div>
    );
};

export default Input;
