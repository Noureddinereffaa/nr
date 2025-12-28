// Chat Service Types and Utilities

export type ChatState = 'HIDDEN' | 'IDLE' | 'GREETING' | 'COLLECTING_NAME' | 'COLLECTING_PHONE' | 'MENU_SELECTION' | 'LIVE_SUPPORT_QUEUE' | 'ENDED' | 'AI_CHAT_MODE' | 'AI_CHAT_REPLY';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
    type?: 'text' | 'options' | 'input';
    options?: { label: string; value: string }[];
    inputType?: 'text' | 'phone' | 'email';
}

export interface ChatSession {
    isOpen: boolean;
    hasGreeted: boolean;
    currentState: ChatState;
    messages: ChatMessage[];
    userData: {
        name?: string;
        phone?: string;
        intent?: string;
    };
}

export const INITIAL_SESSION: ChatSession = {
    isOpen: false,
    hasGreeted: false,
    currentState: 'IDLE',
    messages: [],
    userData: {}
};

/**
 * Simulates AI typing delay
 */
export const simulateTyping = (ms: number = 1500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a unique ID
 */
export const generateId = () => Math.random().toString(36).substr(2, 9);
