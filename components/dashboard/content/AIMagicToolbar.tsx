import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Type, AlignLeft, Zap } from 'lucide-react';

interface AIMagicToolbarProps {
    x: number;
    y: number;
    isVisible: boolean;
    onAction: (action: string) => void;
}

const AIMagicToolbar: React.FC<AIMagicToolbarProps> = ({ x, y, isVisible, onAction }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    style={{ position: 'fixed', top: y, left: x, zIndex: 2000 }}
                    className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-3xl border border-white/20 p-1 rounded-2xl shadow-2xl"
                >
                    <button
                        onClick={() => onAction('rewrite')}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-xl text-xs font-black text-white transition-all transition-all"
                        title="إعادة صياغة ذكية"
                    >
                        <RefreshCw size={14} className="text-indigo-400" />
                        <span>إعادة صياغة</span>
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button
                        onClick={() => onAction('expand')}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-xl text-xs font-black text-white transition-all transition-all"
                        title="توسيع الفقرة"
                    >
                        <AlignLeft size={14} className="text-purple-400" />
                        <span>توسيع</span>
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button
                        onClick={() => onAction('summarize')}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-xl text-xs font-black text-white transition-all"
                        title="تلخيص النقاط"
                    >
                        <Type size={14} className="text-blue-400" />
                        <span>تلخيص</span>
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button
                        onClick={() => onAction('magic')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black text-white shadow-lg transition-all"
                    >
                        <Sparkles size={14} className="animate-pulse" />
                        <span>سحر الذكاء</span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AIMagicToolbar;
