import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, ChevronDown, CheckCircle, Sparkles } from 'lucide-react';
import { ChatMessage, ChatSession, INITIAL_SESSION, generateId, simulateTyping } from '../lib/chat-service';
import { useData } from '../context/DataContext';
import { useUI } from '../context/UIContext';

const SmartChatbot: React.FC = () => {
    const { addServiceRequest } = useData();
    const { isChatOpen, toggleChat, openChat } = useUI();

    // Load session from localStorage for persistence across pages
    const [session, setSession] = useState<ChatSession>(() => {
        const saved = localStorage.getItem('nr_chat_session');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Restore timestamps as Date objects
                parsed.messages = parsed.messages.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
                // Force sync with UIContext if needed, but for now we trust session unless overridden
                return parsed;
            } catch (e) {
                return INITIAL_SESSION;
            }
        }
        return INITIAL_SESSION;
    });

    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasSyncedRef = useRef(false);

    // Sync session.isOpen with global isChatOpen
    useEffect(() => {
        if (!hasSyncedRef.current) {
            // On mount, if session says open, open global UI
            if (session.isOpen) openChat();
            hasSyncedRef.current = true;
        } else {
            // On updates, sync session state
            setSession(prev => ({ ...prev, isOpen: isChatOpen }));
        }
    }, [isChatOpen]);

    // Save session to localStorage on every change
    useEffect(() => {
        localStorage.setItem('nr_chat_session', JSON.stringify(session));
    }, [session]);

    // ... (rest of useEffects)

    // Auto-Greeting (only if not already greeted in this browser)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!session.hasGreeted && !isChatOpen) { // Check global isChatOpen
                setSession(prev => ({ ...prev, hasGreeted: true }));
                openChat(); // Open via UIContext
                handleBotResponse('GREETING');
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [session.hasGreeted]);

    const addMessage = (text: string, sender: 'bot' | 'user', type: 'text' | 'options' | 'input' = 'text', options?: any[]) => {
        setSession(prev => ({
            ...prev,
            messages: [...prev.messages, {
                id: generateId(),
                text,
                sender,
                timestamp: new Date(),
                type,
                options
            }]
        }));
    };

    const handleBotResponse = async (state: string, userResponse?: string) => {
        setIsTyping(true);
        await simulateTyping(1000); // Fake AI thinking time

        let newMessages: Partial<ChatMessage>[] = [];
        let nextState = session.currentState;

        switch (state) {
            case 'GREETING':
                newMessages = [
                    { text: "مرحباً بك في موقع نورالدين رفعة 👋", sender: 'bot' },
                ];
                await simulateTyping(1500); // Second bubble delay
                // We don't use 'addMessage' directly inside async flow to avoid closure staleness, 
                // effectively we batch or chain them. For simplicity in react state:
                setIsTyping(false);
                setSession(prev => ({
                    ...prev,
                    currentState: 'COLLECTING_NAME',
                    messages: [
                        ...prev.messages,
                        { id: generateId(), text: "مرحباً بك في موقع نورالدين رفعة 👋", sender: 'bot', timestamp: new Date() },
                        { id: generateId(), text: "أنا المساعد الذكي هنا. ما هو اسمك الكريم؟ 😊", sender: 'bot', timestamp: new Date() }
                    ]
                }));
                return;

            case 'HANDLE_NAME':
                if (userResponse) {
                    setIsTyping(false);
                    setSession(prev => {
                        const updated: ChatSession = { ...prev, userData: { ...prev.userData, name: userResponse }, currentState: 'MENU_SELECTION' as const };
                        // Trigger menu immediately
                        setTimeout(() => handleBotTrigger(updated, 'SHOW_MENU'), 100);
                        return updated;
                    });
                }
                return;

            case 'SHOW_MENU':
                setIsTyping(false);
                setSession(prev => ({
                    ...prev,
                    messages: [
                        ...prev.messages,
                        {
                            id: generateId(),
                            text: `تشرفت بك أستاذ ${prev.userData.name}. كيف يمكنني مساعدتك اليوم؟`,
                            sender: 'bot',
                            timestamp: new Date(),
                            type: 'options',
                            options: [
                                { label: '🚀 تطوير مشروع رقمي', value: 'project' },
                                { label: '💼 استشارة إدارية', value: 'consultation' },
                                { label: '💰 استفسار عن الأسعار', value: 'pricing' },
                                { label: '📞 تواصل مع نورالدين', value: 'contact' }
                            ]
                        }
                    ]
                }));
                return;

            case 'HANDLE_MENU':
                const intentMap: Record<string, string> = {
                    'project': 'تطوير مشروع رقمي',
                    'consultation': 'استشارة إدارية',
                    'pricing': 'استفسار أسعار',
                    'contact': 'طلب تواصل عام'
                };
                const userIntent = intentMap[userResponse || ''] || 'عام';

                setIsTyping(false);
                setSession(prev => ({
                    ...prev,
                    currentState: 'COLLECTING_PHONE',
                    userData: { ...prev.userData, intent: userIntent },
                    messages: [
                        ...prev.messages,
                        { id: generateId(), text: "خيار ممتاز! 👌", sender: 'bot', timestamp: new Date() },
                        { id: generateId(), text: "من فضلك، اكتب رقم هاتفك (أو واتساب) للتواصل معك بخصوص التفاصيل.", sender: 'bot', timestamp: new Date() }
                    ]
                }));
                return;

            case 'HANDLE_PHONE':
                // Save to CRM
                const finalUserData = { ...session.userData, phone: userResponse };

                // Add to Context (CRM)
                addServiceRequest({
                    serviceTitle: finalUserData.intent || 'طلب من الشات بوت',
                    clientName: finalUserData.name || 'زائر من الشات',
                    clientPhone: userResponse || '',
                    clientEmail: '',
                    projectDetails: `طلب تم إنشاؤه تلقائياً عبر الشات بوت الذكي`,
                    priority: 'medium'
                });

                setIsTyping(false);
                setSession(prev => ({
                    ...prev,
                    currentState: 'ENDED',
                    messages: [
                        ...prev.messages,
                        { id: generateId(), text: "تم استلام طلبك بنجاح! ✅", sender: 'bot', timestamp: new Date() },
                        { id: generateId(), text: "سيقوم فريقنا بالتواصل معك في أقرب وقت ممكن. يومك سعيد!", sender: 'bot', timestamp: new Date() }
                    ]
                }));
                return;
        }

        setIsTyping(false);
    };

    // Helper wrapper to trigger bot with latest state
    const handleBotTrigger = (currentSession: ChatSession, action: string) => {
        // This is a simplified logic handler, in real app utilize proper state machine
        handleBotResponse(action);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userText = inputValue.trim();
        setInputValue('');
        addMessage(userText, 'user');

        // Logic Router
        if (session.currentState === 'COLLECTING_NAME') {
            handleBotResponse('HANDLE_NAME', userText);
        } else if (session.currentState === 'COLLECTING_PHONE') {
            handleBotResponse('HANDLE_PHONE', userText);
        } else {
            // Fallback default
            handleBotResponse('DEFAULT_REPLY');
        }
    };

    const handleOptionClick = (value: string, label: string) => {
        addMessage(label, 'user');
        if (session.currentState === 'MENU_SELECTION') {
            handleBotResponse('HANDLE_MENU', value);
        }
    };

    // const toggleChat = () => { ... } // Replaced by UIContext toggleChat

    // Reset conversation to start fresh
    const resetChat = () => {
        localStorage.removeItem('nr_chat_session');
        setSession({ ...INITIAL_SESSION, isOpen: true, hasGreeted: true });
        handleBotResponse('GREETING');
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] font-sans" style={{ direction: 'rtl' }}>
            {/* Main Chat Window */}
            {session.isOpen && (
                <div className="mb-4 w-[calc(100vw-32px)] sm:w-[350px] md:w-[380px] h-[450px] sm:h-[500px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-3 sm:p-4 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <Sparkles size={16} className="text-amber-400" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-xs sm:text-sm">المساعد الذكي</h3>
                                <p className="text-[9px] sm:text-[10px] text-indigo-200 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                                    متصل الآن
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {session.currentState === 'ENDED' && (
                                <button onClick={resetChat} className="text-indigo-300 hover:text-white text-[10px] font-bold bg-white/5 px-2 py-1 rounded-lg transition-colors">
                                    محادثة جديدة
                                </button>
                            )}
                            <button onClick={toggleChat} className="text-white/50 hover:text-white transition-colors p-1">
                                <ChevronDown size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/30">
                        {session.messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-bl-none shadow-lg'
                                    }`}>
                                    {msg.text}
                                    {msg.timestamp && (
                                        <p className={`text-[9px] mt-1 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Options Buttons */}
                        {session.messages[session.messages.length - 1]?.type === 'options' && session.messages[session.messages.length - 1].sender === 'bot' && (
                            <div className="grid grid-cols-1 gap-2 mt-2">
                                {session.messages[session.messages.length - 1].options?.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionClick(opt.value, opt.label)}
                                        className="relative group overflow-hidden bg-gradient-to-r from-[var(--accent-indigo)] to-purple-600 hover:opacity-90 text-white text-xs font-bold py-3.5 px-6 rounded-[var(--border-radius-elite)] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[rgba(var(--accent-indigo-rgb),0.25)] text-right flex items-center justify-between"
                                    >
                                        <span className="relative z-10">{opt.label}</span>
                                        <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                        <ChevronDown className="rotate-90 text-white/70 group-hover:text-white transition-colors" size={16} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/80 rounded-2xl p-3 rounded-bl-none flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900/90 border-t border-white/5 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={session.currentState === 'COLLECTING_PHONE' ? '05XXXXXXXX' : 'اكتب رسالتك هنا...'}
                            className="flex-1 bg-slate-950 border border-white/10 rounded-[var(--border-radius-elite)] px-4 py-3 text-sm text-white focus:outline-none focus:border-[rgba(var(--accent-indigo-rgb),0.5)] transition-colors"
                            disabled={session.currentState === 'ENDED' || session.currentState === 'MENU_SELECTION'}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="bg-[var(--accent-indigo)] hover:opacity-90 disabled:opacity-50 text-white p-3 rounded-[var(--border-radius-elite)] transition-colors shadow-lg shadow-[rgba(var(--accent-indigo-rgb),0.2)]"
                        >
                            <Send size={18} className={inputValue.trim() ? '' : 'opacity-50'} />
                        </button>
                    </div>
                </div>
            )}

            {/* FAB Toggle Button */}
            {!session.isOpen && (
                <button
                    onClick={toggleChat}
                    className="w-14 h-14 bg-[var(--accent-indigo)] hover:opacity-90 text-white rounded-full flex items-center justify-center shadow-2xl shadow-[rgba(var(--accent-indigo-rgb),0.4)] transition-all hover:scale-110 group relative"
                >
                    <MessageCircle size={24} />
                    {session.hasGreeted && !session.isOpen && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center border border-slate-900">1</span>
                    )}
                </button>
            )}
        </div>
    );
};

export default SmartChatbot;
