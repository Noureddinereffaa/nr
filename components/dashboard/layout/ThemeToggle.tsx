import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 bg-slate-700 dark:bg-slate-700 light:bg-slate-300 rounded-full p-1 transition-colors hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-slate-400"
            aria-label={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
        >
            <motion.div
                className="absolute top-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                animate={{ x: theme === 'dark' ? 2 : 30 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                {theme === 'dark' ? (
                    <Moon size={12} className="text-slate-900" />
                ) : (
                    <Sun size={12} className="text-amber-500" />
                )}
            </motion.div>
        </button>
    );
};
