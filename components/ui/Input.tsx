import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from './Button'; // Reusing the utility from Button

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon: Icon, rightElement, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-sm font-bold text-slate-400 block mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {Icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                            <Icon size={18} />
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={cn(
                            "w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all",
                            Icon && "pl-10",
                            rightElement && "pr-12",
                            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
                            className
                        )}
                        {...props}
                    />

                    {rightElement && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-red-500 font-medium animate-pulse">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
