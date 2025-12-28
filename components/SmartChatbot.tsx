import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, ChevronDown, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, ChatSession, INITIAL_SESSION, generateId, simulateTyping } from '../lib/chat-service';
import { useData } from '../context/DataContext';
import { useUI } from '../context/UIContext';
import { useAI } from '../context/AIContext';

const SmartChatbot: React.FC = () => {
    const { addRequest, siteData } = useData();
    const { isChatOpen, toggleChat, openChat } = useUI();
    const { generateText } = useAI();

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

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [session.messages, isTyping]);

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
        // await simulateTyping(1000); // Removed fixed delay, let API time determine it naturally or keep small delay

        let nextState = session.currentState;

        // RAG Context Builder
        const buildContext = () => {
            const services = (siteData.services || []).map(s => `- ${s.title}: ${s.description}`).join('\n');
            const projects = (siteData.projects || []).slice(0, 5).map(p => `- ${p.title} (${p.category}): ${p.fullDescription || ''}`).join('\n');
            return `
            أنت "Nova"، المساعد الذكي الفائق لنورالدين رفعة (Arquitecto Digital).
            شخصيتك: استراتيجي، طموح، محترف جداً، وموجه نحو النتائج.
            
            نبذة عن نورالدين: ${siteData.profile?.bio || 'خبير في بناء الأنظمة الرقمية والأتمتة'}.
            الخدمات المتاحة:
            ${services}
            أبرز المشاريع:
            ${projects}
            
            المهمة الحالية: ${siteData.aiConfig.mission}
            نبرة الصوت: ${siteData.aiConfig.tone} (احترافية عالية، ثقة، سلطة معرفية).
            
            القواعد الذهبية:
            1. تحدث بالعربية الفصحى المعاصرة الممزوجة بلمسة "ميزان" (احترافية هادئة).
            2. اجعل الإجابات قصيرة ومركزة ومبنية على القيمة (القيمة فوق الكلام).
            3. إذا سأل المستخدم عن السعر، اطلب رقم الهاتف أو الواتساب لتقديم عرض مخصص ومدروس.
            4. لا تقل أبداً "أنا مجرد نموذج لغوي"، تصرف كعضو في فريق نورالدين.
            `;
        };

        switch (state) {
            case 'GREETING':
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
                                { label: '📞 تواصل مع نورالدين', value: 'contact' },
                                { label: '🧠 سؤال عام (AI)', value: 'ai_chat' }
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
                    'contact': 'طلب تواصل عام',
                    'ai_chat': 'سؤال عام'
                };

                const userIntent = intentMap[userResponse || ''] || 'عام';

                if (userResponse === 'ai_chat') {
                    setIsTyping(false);
                    setSession(prev => ({
                        ...prev,
                        currentState: 'AI_CHAT_MODE',
                        messages: [...prev.messages, { id: generateId(), text: "أنا جاهز للإجابة على أي استفسار يخص خدماتنا أو التقنية عموماً! تفضل بالسؤال.", sender: 'bot', timestamp: new Date() }]
                    }));
                    return;
                }

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
                addRequest({
                    serviceTitle: finalUserData.intent || 'طلب من الشات بوت',
                    clientName: finalUserData.name || 'زائر من الشات',
                    clientPhone: userResponse || '',
                    clientEmail: '',
                    projectDetails: `طلب تم إنشاؤه تلقائياً عبر الشات بوت الذكي - ${finalUserData.intent}`,
                    priority: 'medium',
                    status: 'new'
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

            case 'AI_CHAT_REPLY':
                // This is the new Dynamic RAG Logic
                try {
                    const context = buildContext();
                    const refinedPrompt = `CONTEXT: ${context}\n\nUSER QUESTION: ${userResponse}`;

                    // We use standard generateText from context which handles provider switching
                    const reply = await generateText(refinedPrompt);

                    setIsTyping(false);
                    setSession(prev => ({
                        ...prev,
                        messages: [...prev.messages, { id: generateId(), text: reply, sender: 'bot', timestamp: new Date() }]
                    }));
                } catch (e) {
                    setIsTyping(false);
                    setSession(prev => ({
                        ...prev,
                        messages: [...prev.messages, { id: generateId(), text: "عذراً، حدث خطأ تقني. يرجى المحاولة لاحقاً.", sender: 'bot', timestamp: new Date() }]
                    }));
                }
                return;

            default:
                // Fallback for AI Chat Mode
                if (session.currentState === 'AI_CHAT_MODE') {
                    handleBotResponse('AI_CHAT_REPLY', userResponse);
                    return;
                }

                handleBotResponse('DEFAULT_REPLY'); // Or just ignore
                return;
        }
    };

    // Helper wrapper to trigger bot with latest state
    const handleBotTrigger = (currentSession: ChatSession, action: string) => {
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
        } else if (session.currentState === 'AI_CHAT_MODE') {
            handleBotResponse('AI_CHAT_REPLY', userText);
        } else {
            // Default
            handleBotResponse('DEFAULT_REPLY', userText);
        }
    };

    const handleOptionClick = (value: string, label: string) => {
        addMessage(label, 'user');
        if (session.currentState === 'MENU_SELECTION') {
            handleBotResponse('HANDLE_MENU', value);
        }
    };

    const resetChat = () => {
        localStorage.removeItem('nr_chat_session');
        setSession({ ...INITIAL_SESSION, isOpen: true, hasGreeted: true });
        handleBotResponse('GREETING');
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] font-sans" style={{ direction: 'rtl' }}>
            {/* Main Chat Window */}
            {session.isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="mb-4 w-[calc(100vw-32px)] sm:w-[380px] md:w-[420px] h-[550px] sm:h-[600px] glass-morph rounded-[2.5rem] shadow-3xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-5 flex items-center justify-between border-b border-white/10 backdrop-blur-3xl">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 border border-white/20">
                                    <Sparkles size={20} className="text-white animate-pulse" />
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-black text-white text-sm tracking-tight">المساعد الاستراتيجي (Nova)</h3>
                                <p className="text-[10px] text-indigo-300 font-bold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    AI ACTIVE
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={resetChat} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all" title="محادثة جديدة">
                                <RefreshCw size={16} />
                            </button>
                            <button onClick={toggleChat} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
                                <X size={20} />
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
                </motion.div>
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
