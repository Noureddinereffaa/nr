import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, Server, Smartphone, Check } from 'lucide-react';
import { useSync } from '../../../context/SyncContext';

interface SyncConflictModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SyncConflictModal: React.FC<SyncConflictModalProps> = ({ isOpen, onClose }) => {
    const { resolveConflict, serverData } = useSync();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-red-500/5">
                        <div className="p-3 bg-red-500/10 rounded-full text-red-400">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">تعارض في المزامنة</h3>
                            <p className="text-sm text-slate-400">توجد نسخة أحدث من البيانات على الخادم. يرجى اختيار النسخة التي تريد اعتمادها.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Server Version */}
                        <div className="bg-slate-950 border border-white/10 rounded-xl p-4 space-y-4 hover:border-indigo-500/50 transition-colors cursor-pointer group" onClick={() => resolveConflict('server')}>
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-indigo-400 flex items-center gap-2">
                                    <Server size={18} /> نسخة الخادم
                                </h4>
                                <span className="text-xs text-slate-500">منذ 5 دقائق</span>
                            </div>
                            <div className="text-sm text-slate-300 bg-white/5 p-3 rounded-lg font-mono text-xs overflow-hidden h-32 opacity-70 group-hover:opacity-100 transition-opacity">
                                {JSON.stringify(serverData || {}, null, 2)}
                            </div>
                            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Check size={16} /> اعتماد نسخة الخادم
                            </button>
                        </div>

                        {/* Local Version */}
                        <div className="bg-slate-950 border border-white/10 rounded-xl p-4 space-y-4 hover:border-emerald-500/50 transition-colors cursor-pointer group" onClick={() => resolveConflict('local')}>
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                                    <Smartphone size={18} /> النسخة المحلية
                                </h4>
                                <span className="text-xs text-slate-500">التعديلات الحالية</span>
                            </div>
                            <div className="text-sm text-slate-300 bg-white/5 p-3 rounded-lg font-mono text-xs overflow-hidden h-32 opacity-70 group-hover:opacity-100 transition-opacity">
                                {"(يحتفظ بالتغييرات الحالية ويتجاهل الخادم)"}
                            </div>
                            <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Check size={16} /> الإبقاء على النسخة المحلية
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
