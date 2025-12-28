import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface NotificationProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex items-center gap-3 bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CheckCircle2 size={20} className="text-indigo-200" />
            <span className="font-bold text-sm">{message}</span>
            <button
                onClick={onClose}
                className="ml-4 hover:rotate-90 transition-transform p-1 rounded-full hover:bg-white/10"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Notification;
