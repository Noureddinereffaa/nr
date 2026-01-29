import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Check, CheckCheck, Clock, User, Shield } from 'lucide-react';
import { RequestMessage } from '../../lib/types';

interface PortalMessagingProps {
    requestId: string;
    messages: RequestMessage[];
    currentRole: 'client' | 'admin';
    onSendMessage: (content: string) => Promise<void>;
}

const PortalMessaging: React.FC<PortalMessagingProps> = ({
    requestId,
    messages,
    currentRole,
    onSendMessage
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            await onSendMessage(newMessage.trim());
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 border border-white/10 rounded-2xl overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" dir="rtl">
                <AnimatePresence initial={false}>
                    {messages && messages.length > 0 ? (
                        messages.map((msg, index) => {
                            const isOwnMessage = msg.role === currentRole;
                            const isAdmin = msg.role === 'admin';

                            return (
                                <motion.div
                                    key={msg.id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex ${isOwnMessage ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`flex gap-3 max-w-[80%] ${isOwnMessage ? 'flex-row' : 'flex-row-reverse'}`}>
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'
                                            }`}>
                                            {isAdmin ? <Shield size={18} className="text-white" /> : <User size={18} className="text-white" />}
                                        </div>

                                        {/* Message Bubble */}
                                        <div>
                                            <div className={`px-4 py-3 rounded-2xl ${isOwnMessage
                                                ? 'bg-slate-900 border border-white/10'
                                                : 'bg-indigo-600'
                                                }`}>
                                                <p className={`text-sm leading-relaxed ${isOwnMessage ? 'text-white' : 'text-white'
                                                    }`}>
                                                    {msg.content}
                                                </p>
                                            </div>

                                            {/* Timestamp */}
                                            <div className={`flex items-center gap-2 mt-1 px-2 ${isOwnMessage ? 'justify-start' : 'justify-end'
                                                }`}>
                                                <span className="text-[10px] text-slate-500 font-bold">
                                                    {new Date(msg.date).toLocaleTimeString('ar-DZ', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                {isOwnMessage && (
                                                    <CheckCheck size={12} className="text-slate-600" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                                <Send size={32} className="text-slate-700" />
                            </div>
                            <p className="text-slate-500 font-bold text-sm">لا توجد رسائل بعد</p>
                            <p className="text-slate-600 text-xs mt-2">ابدأ المحادثة بإرسال رسالة</p>
                        </div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 p-4 bg-slate-900/50">
                <div className="flex gap-3 items-end" dir="rtl">
                    <div className="flex-1 relative">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="اكتب رسالتك هنا..."
                            rows={1}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            style={{ minHeight: '44px', maxHeight: '120px' }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:cursor-not-allowed"
                    >
                        {isSending ? (
                            <Clock size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                        <span className="hidden sm:inline">إرسال</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortalMessaging;
