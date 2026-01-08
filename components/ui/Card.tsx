import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    gradient?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, gradient, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-slate-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden",
                    gradient && "bg-gradient-to-br from-slate-900 to-slate-900/50",
                    className
                )}
                {...props}
            >
                {gradient && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20" />
                )}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        );
    }
);

Card.displayName = 'Card';
