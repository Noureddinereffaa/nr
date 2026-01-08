import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
    content: string;
    children?: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export const Tooltip = ({
    content,
    children,
    position = 'top',
    className = ''
}: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-b border-r',
        bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-t border-l',
        left: 'right-[-4px] top-1/2 -translate-y-1/2 border-r border-t',
        right: 'left-[-4px] top-1/2 -translate-y-1/2 border-l border-b'
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                className="cursor-help inline-flex items-center"
                tabIndex={0}
            >
                {children || <HelpCircle size={16} className="text-slate-400 hover:text-slate-300 transition-colors" />}
            </div>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-[9999] ${positionClasses[position]} pointer-events-none`}
                    >
                        <div className="bg-slate-900 dark:bg-slate-800 light:bg-slate-100 light:text-slate-900 text-white text-sm px-3 py-2 rounded-lg shadow-xl border border-slate-700 dark:border-slate-600 light:border-slate-300 max-w-xs whitespace-normal">
                            {content}
                            {/* Arrow */}
                            <div className={`absolute w-2 h-2 bg-slate-900 dark:bg-slate-800 light:bg-slate-100 border-slate-700 dark:border-slate-600 light:border-slate-300 rotate-45 ${arrowClasses[position]}`} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
