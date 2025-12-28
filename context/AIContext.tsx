import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AIService, DigitalCouncil } from '../lib/ai-service';
import { useData } from './DataContext';
import { AIConfig } from '../types';

interface AIContextType {
    isGenerating: boolean;
    lastError: string | null;
    generateText: (prompt: string, type?: 'text' | 'creative') => Promise<string>;
    agents: typeof DigitalCouncil;
    service: typeof AIService;
}

const AIContext = createContext<AIContextType | null>(null);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { siteData } = useData();
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);

    const generateText = async (prompt: string, type: 'text' | 'creative' = 'text'): Promise<string> => {
        setIsGenerating(true);
        setLastError(null);
        try {
            // Use the NeuroCore via AIService wrapper
            const config = siteData.aiConfig;
            if (type === 'creative') {
                return await AIService.generateWithHuggingFace(prompt, config);
            } else {
                return await AIService.generateWithGemini(prompt, config);
            }
        } catch (e: any) {
            console.error("AI Generation Error", e);
            setLastError(e.message || "Unknown AI Error");
            return "Failed to generate content.";
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AIContext.Provider value={{
            isGenerating,
            lastError,
            generateText,
            agents: DigitalCouncil,
            service: AIService
        }}>
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) throw new Error("useAI must be used within AIProvider");
    return context;
};
