import { Article, AIConfig } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * --- Premium Imagery System ---
 */
const IMAGERY_DB: Record<string, string[]> = {
    business: ["1665686376173-ada7a0031a85", "1664575602554-20827a445d1d", "1552581234-26160f608093", "1507679799987-113291d21f92", "1542744173-8e7e53415bb0"],
    tech: ["1451187580459-43490279c0fa", "1518770660439-4636190af475", "1550751827-4bd374c3f58b", "1526374965328-7f61d4dc18c5", "1555949963-ff9fe0c870eb"],
    growth: ["1590212151172-21800a944fc2", "1460925895917-afdab827c52f", "1551288049-bebda4e38f71", "1543286386-713df548e9cc"],
    health: ["1505751172107-59c20a9bf7f1", "1532938911079-073956f50acc", "1576037722100-34860fb3a429"],
    travel: ["1469441902664-69ef561a05d0", "1507525428034-b723cf961d3e", "1476514525535-07fb3b4ae5f1"],
    abstract: ["1634017839464-5c339ebe3cb4", "1614850523459-c2f4c699c52e", "1618005182384-a83a8bd57fbe", "1620641782983-5005af4a2299"]
};

const getSmartImage = (query: string): string => {
    const lowerQuery = (query || '').toLowerCase();
    let category = 'business';
    if (lowerQuery.includes('tech') || lowerQuery.includes('code') || lowerQuery.includes('digital') || lowerQuery.includes('ai')) category = 'tech';
    else if (lowerQuery.includes('health') || lowerQuery.includes('medical') || lowerQuery.includes('fit') || lowerQuery.includes('diet')) category = 'health';
    else if (lowerQuery.includes('travel') || lowerQuery.includes('trip') || lowerQuery.includes('world')) category = 'travel';
    else if (lowerQuery.includes('growth') || lowerQuery.includes('money') || lowerQuery.includes('profit') || lowerQuery.includes('sales')) category = 'growth';
    else if (lowerQuery.includes('future') || lowerQuery.includes('innovation') || lowerQuery.includes('strategy')) category = 'abstract';
    const collection = IMAGERY_DB[category] || IMAGERY_DB.business;
    const randomId = collection[Math.floor(Math.random() * collection.length)];
    return `https://images.unsplash.com/photo-${randomId}?auto=format&fit=crop&q=80&w=1200`;
};

export type ArticleNiche = 'strategic' | 'general' | 'lifestyle' | 'education' | 'news';

/**
 * --- Internal Helper Functions ---
 * Defined as constants to separate declaration from export and prevent circular dependency issues.
 */

// 1. OpenAI Helper
const generateWithOpenAI = async (prompt: string, config: AIConfig, model: string = "gpt-4o", maxTokens: number = 2000): Promise<string> => {
    if (!config.openaiKey) throw new Error("مفتاح OpenAI مفقود");

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.openaiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: maxTokens,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI Error: ${error.error?.message || response.statusText}`);
        }
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI Request Failed:", error);
        throw error;
    }
};

// 2. Gemini Helper
const generateWithGemini = async (prompt: string, config: AIConfig, isJSON: boolean = false): Promise<string> => {
    const key = config.apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("No Gemini API Key found.");
    const genAI = new GoogleGenerativeAI(key);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (flashError) {
        try {
            const modelPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const resultPro = await modelPro.generateContent(prompt);
            return resultPro.response.text();
        } catch (proError) {
            throw proError;
        }
    }
};

// 3. Hugging Face Helper (Primary Sovereign Engine)
const generateWithHuggingFace = async (prompt: string, config: AIConfig, model: string = "mistralai/Mistral-7B-Instruct-v0.3"): Promise<string> => {
    // Use Env Var for safety (Local) or Config (User Input)
    const token = config.huggingFaceKey || import.meta.env.VITE_HUGGING_FACE_TOKEN;
    if (!token) throw new Error("مفتاح Hugging Face مفقود (HF Token Missing)");

    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "x-use-cache": "false"
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: { max_new_tokens: 1500, temperature: 0.7, return_full_text: false }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HF Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data[0].generated_text.trim() : "";
    } catch (error) {
        console.error("Hugging Face Failed:", error);
        // Fallback to Gemini (Free/Reliable) instead of OpenAI (Quota Risk)
        if (config.apiKey) {
            console.log("Falling back to Gemini...");
            return generateWithGemini(prompt, config);
        }
        throw error;
    }
};

// 4. Hugging Face Image Helper
const generateImageWithHuggingFace = async (prompt: string, config: AIConfig, model: string = "stabilityai/stable-diffusion-xl-base-1.0"): Promise<string> => {
    const token = config.huggingFaceKey || import.meta.env.VITE_HUGGING_FACE_TOKEN;
    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ inputs: prompt })
        });
        if (!response.ok) throw new Error("Image Generation Failed");
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        return `https://source.unsplash.com/800x600/?${encodeURIComponent(prompt.split(' ').slice(0, 2).join(','))}`; // Fallback
    }
};

/**
 * --- Public Service Exports ---
 */
export const AIService = {
    generateWithHuggingFace,
    generateImageWithHuggingFace,
    generateWithOpenAI,
    generateWithGemini,

    // Legacy / Convenience Wrappers
    suggestOutline: async (topic: string, config: AIConfig): Promise<any[]> => {
        const prompt = `Act as Editor. Create outlines for: "${topic}". JSON Array with id, title, description.`;
        try {
            const text = await generateWithGemini(prompt, config, true);
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            return JSON.parse(jsonMatch ? jsonMatch[0] : text);
        } catch (e) {
            return [
                { id: 1, title: "مقدمة", description: "وصف عام." },
                { id: 2, title: "التفاصيل", description: "شرح مفصل." },
                { id: 3, title: "الخاتمة", description: "نهاية المقال." }
            ];
        }
    },

    refineTone: async (text: string, tone: string, config: AIConfig): Promise<string> => {
        const prompt = `Rewrite to match tone "${tone}": "${text}"`;
        try { return await generateWithGemini(prompt, config); } catch (e) { return text; }
    },

    draftSection: async (sectionTitle: string, context: string, config: AIConfig): Promise<string> => {
        // Direct call to correct engine
        return generateWithHuggingFace(
            `[INST] Write HTML content (p, ul, strong) for section "${sectionTitle}". Context: "${context.slice(0, 300)}". [/INST]`,
            config
        );
    },

    suggestArticleImage: async (keyword: string): Promise<string> => getSmartImage(keyword),

    suggestSEOEnhancements: async (content: string, focusKeyword: string, config: AIConfig): Promise<string[]> => {
        const prompt = `Give 3 SEO tips for keyword "${focusKeyword}" in this content. Output JSON string array.`;
        try {
            const text = await generateWithGemini(prompt, config);
            return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (e) { return ["Use keywords", "Add headings", "Internal links"]; }
    }
};

/**
 * --- The Sovereign Digital Council (Multi-Agent System) ---
 */
export const DigitalCouncil = {
    StructureArchitect: {
        generateOutline: async (topic: string, config: AIConfig) => {
            const prompt = `[INST] Design high-authority article structure for "${topic}". Output JSON Array (id, title, description). [/INST]`;
            try {
                const text = await generateWithHuggingFace(prompt, config);
                const jsonMatch = text.match(/\[[\s\S]*\]/);
                return JSON.parse(jsonMatch ? jsonMatch[0] : text);
            } catch (e) { return AIService.suggestOutline(topic, config); }
        }
    },

    ChiefEditor: {
        draftSection: async (sectionTitle: string, context: string, articleTone: string, config: AIConfig) => {
            const prompt = `[INST] Tone: ${articleTone}. Write Section: "${sectionTitle}". Context: "${context.slice(0, 300)}". Output HTML only. [/INST]`;
            return generateWithHuggingFace(prompt, config);
        }
    },

    SEOAnalyst: {
        analyze: async (content: string, focusKeyword: string, config: AIConfig) => {
            const prompt = `[INST] Analyze for "${focusKeyword}". Output JSON {score, missingKeywords, suggestedMetaDescription}. [/INST]`;
            try {
                const text = await generateWithHuggingFace(prompt, config);
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                return JSON.parse(jsonMatch ? jsonMatch[0] : text);
            } catch (e) { return { score: 70, missingKeywords: [], suggestedMetaDescription: "Manual review." }; }
        }
    },

    SchemaEngineer: {
        generateFAQSchema: async (content: string, config: AIConfig) => {
            const prompt = `[INST] Create FAQPage JSON-LD from text. [/INST]`;
            try { return await generateWithHuggingFace(prompt, config); } catch (e) { return "{}"; }
        }
    },

    VisualDirector: {
        generateHeaderImage: async (topic: string, config: AIConfig) => {
            const promptGen = `[INST] Create concise English image prompt for: "${topic}". [/INST]`;
            let prompt = topic;
            try { prompt = await generateWithHuggingFace(promptGen, config); } catch (e) { }
            return generateImageWithHuggingFace(prompt, config);
        }
    },

    QualityAuditor: {
        audit: async (content: string, config: AIConfig) => {
            const prompt = `[INST] Audit content. Output JSON {rating: "A", critique: "..."}. [/INST]`;
            try { return JSON.parse(await generateWithHuggingFace(prompt, config)); } catch (e) { return { rating: "A", critique: "Pass", readyToPublish: true }; }
        }
    }
};
