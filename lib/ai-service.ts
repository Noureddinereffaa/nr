import { Article, AIConfig, Client, CompetitorData, SocialPost, ArticleNiche, ContentPlanItem } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * --- NeuroCore: The Central AI Engine ---
 * Orchestrates calls between Gemini (Speed), HuggingFace (Sovereign), and OpenAI (Power).
 */
class NeuroCore {
    private static async getGeminiResponse(prompt: string, config: AIConfig, isJSON: boolean = false): Promise<string> {
        const key = config.apiKey || import.meta.env.VITE_GEMINI_API_KEY;
        if (!key) throw new Error("مفتاح Gemini API مفقود.");

        try {
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({
                model: isJSON ? "gemini-1.5-flash" : "gemini-1.5-pro",
                generationConfig: { responseMimeType: isJSON ? "application/json" : "text/plain" }
            });
            const result = await model.generateContent(prompt || "Connection Test. Reply with 'OK'.");
            return result.response.text();
        } catch (error) {
            console.warn("Gemini Error, falling back to basic text:", error);
            throw error;
        }
    }

    private static async getAnthropicResponse(prompt: string, config: AIConfig): Promise<string> {
        const key = config.anthropicKey || import.meta.env.VITE_ANTHROPIC_API_KEY;
        if (!key) throw new Error("Anthropic Key missing.");
        // Simplified fetch for browser usage
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
                "dangerously-allow-browser": "true"
            } as any,
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                messages: [{ role: "user", content: prompt }]
            })
        });
        const data = await response.json();
        return data.content?.[0]?.text || "";
    }

    private static async getHuggingFaceResponse(prompt: string, config: AIConfig, model: string = "mistralai/Mistral-7B-Instruct-v0.3"): Promise<string> {
        const token = config.huggingFaceKey || import.meta.env.VITE_HUGGING_FACE_TOKEN;
        if (!token) throw new Error("مفتاح Hugging Face مفقود.");

        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "x-use-cache": "false"
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: { max_new_tokens: 2000, temperature: 0.7, return_full_text: false }
            })
        });

        if (!response.ok) throw new Error(`HF Error: ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data[0].generated_text.trim() : (data.generated_text || "");
    }

    /**
     * Diagnostic: Test connection to a specific provider
     */
    static async testConnection(provider: string, config: AIConfig): Promise<boolean> {
        try {
            const testPrompt = "Ping";
            switch (provider) {
                case 'gemini': await this.getGeminiResponse(testPrompt, config); break;
                case 'huggingface': await this.getHuggingFaceResponse(testPrompt, config); break;
                case 'anthropic': await this.getAnthropicResponse(testPrompt, config); break;
                default: throw new Error("Unknown provider");
            }
            return true;
        } catch (e) {
            console.error(`Connection test failed for ${provider}:`, e);
            return false;
        }
    }

    /**
     * The Universal Generator - Routes based on request type and config
     */
    static async generate({ prompt, context, config, type = 'text', jsonMode = false }: {
        prompt: string,
        context?: string,
        config: AIConfig,
        type?: 'text' | 'creative' | 'analytical',
        jsonMode?: boolean
    }): Promise<string> {
        const fullPrompt = context ? `CONTEXT: ${context}\n\nTASK: ${prompt}` : prompt;

        // Strategy: Use Gemini for JSON/Analytical (Better structure), HF for Creative (Uncensored/Raw)
        try {
            const provider = config.preferredProvider || 'gemini';

            if (provider === 'huggingface' || type === 'creative') {
                return await this.getHuggingFaceResponse(fullPrompt, config);
            } else if (provider === 'anthropic') {
                return await this.getAnthropicResponse(fullPrompt, config);
            } else {
                return await this.getGeminiResponse(fullPrompt, config, jsonMode);
            }
        } catch (e) {
            // Fallback Hierarchy
            console.log("Primary AI failed, trying fallback...", e);
            try {
                return await this.getGeminiResponse(fullPrompt, config, jsonMode);
            } catch (e2) {
                return "AI Unavailable. Please check API Keys.";
            }
        }
    }
}

/**
 * --- Digital Council: Specialized Agents ---
 */
const Agents = {
    Analyst: {
        scoreLead: (client: Client): number => {
            let score = 0;
            if (client.email) score += 20;
            if (client.phone) score += 30;
            if (client.company) score += 20;
            if (client.status === 'negotiation') score += 15;
            if (client.status === 'active') score += 15;
            // Bonus for interactions
            if (client.notes && client.notes.length > 50) score += 10;
            return Math.min(score, 100);
        },

        analyzeCompetitors: async (config: AIConfig): Promise<CompetitorData[]> => {
            const prompt = `Analyze 3 top fictional competitors for a business in niche: "${config.field}".
            Return valid JSON array: [{ "id": "1", "name": "Comp Name", "website": "www...", "domainAuthority": 50, "weakness": "...", "strength": "...", "topKeywords": ["kw1", "kw2"] }]`;

            try {
                const res = await NeuroCore.generate({ prompt, config, type: 'analytical', jsonMode: true });
                return JSON.parse(res);
            } catch (e) {
                console.error("Agent Analyst Failed", e);
                return [];
            }
        }
    },

    Strategist: {
        generateSocialSchedule: async (config: AIConfig): Promise<SocialPost[]> => {
            const prompt = `Create 5 social media post ideas for a "${config.field}" brand. Mission: "${config.mission}".
            Return valid JSON array of objects with keys: content, platform (linkedin/twitter), scheduledDate (ISO string from tomorrow).`;

            try {
                const res = await NeuroCore.generate({ prompt, config, type: 'analytical', jsonMode: true });
                const raw = JSON.parse(res);
                return raw.map((p: any, i: number) => ({
                    ...p,
                    id: `gen-${Date.now()}-${i}`,
                    status: 'scheduled'
                }));
            } catch (e) {
                return [];
            }
        },

        generateMonthlyPlan: async (config: AIConfig): Promise<ContentPlanItem[]> => {
            const prompt = `Generate a 4-week content plan for "${config.field}". 
            Return JSON array: [{ "topic": "...", "type": "article|video", "scheduledDate": "2024-..." }]`;
            try {
                const res = await NeuroCore.generate({ prompt, config, type: 'analytical', jsonMode: true });
                const raw = JSON.parse(res);
                return raw.map((p: any, i: number) => ({
                    ...p,
                    id: `plan-${Date.now()}-${i}`,
                    status: 'planned'
                }));
            } catch (e) {
                return [];
            }
        }
    },

    Creator: {
        writeArticle: async (topic: string, config: AIConfig, isDeep: boolean): Promise<Article> => {
            const prompt = `Write a full blog article about "${topic}". target audience: ${config.field}.
            Return JSON: { "title": "...", "content": "HTML content...", "excerpt": "...", "seoScore": 85, "keywords": ["..."] }`;

            try {
                const res = await NeuroCore.generate({ prompt, config, type: 'creative', jsonMode: true }); // Gemini supports JSON schema best
                const data = JSON.parse(res);

                return {
                    id: crypto.randomUUID(),
                    slug: topic.toLowerCase().replace(/ /g, '-'),
                    title: data.title || topic,
                    content: data.content || "<p>Generation failed.</p>",
                    excerpt: data.excerpt || "AI Generated Content",
                    image: `https://source.unsplash.com/1200x600/?${encodeURIComponent(topic)}`,
                    category: "Tech",
                    tags: data.keywords || [],
                    keywords: data.keywords || [],
                    author: "AI Writer",
                    date: new Date().toISOString(),
                    status: "draft",
                    readTime: "5 min",
                    seo: {
                        title: data.title,
                        description: data.excerpt,
                        focusKeyword: data.keywords?.[0] || topic
                    },
                    seoScore: data.seoScore || 80
                } as Article;
            } catch (e) {
                throw new Error("Failed to generate article");
            }
        },

        generatePlatformPosts: async (topic: string, config: AIConfig, platforms: string[]): Promise<SocialPost[]> => {
            const prompt = `Write adaptation social posts for topic "${topic}" for platforms: ${platforms.join(', ')}.
           Return JSON array [{ "platform": "...", "content": "..." }]`;
            try {
                const res = await NeuroCore.generate({ prompt, config, type: 'creative', jsonMode: true });
                const data = JSON.parse(res);
                return data.map((d: any, i: number) => ({
                    id: `auto-${Date.now()}-${i}`,
                    platform: d.platform,
                    content: d.content,
                    scheduledDate: new Date().toISOString(),
                    status: 'scheduled'
                }));
            } catch (e) { return []; }
        }
    },

    // Legacy agents for backward compatibility
    ChiefEditor: {
        draftSection: async (sectionTitle: string, context: string, tone: string, config: AIConfig) => {
            const prompt = `Tone: ${tone}. Write Section: "${sectionTitle}". Context: "${context.slice(0, 300)}". Output HTML only.`;
            return NeuroCore.generate({ prompt, config, type: 'creative' });
        }
    },

    VisualDirector: {
        generateHeaderImage: async (topic: string, config: AIConfig) => {
            // Return Unsplash URL as fallback (original used HuggingFace)
            return `https://source.unsplash.com/1200x600/?${encodeURIComponent(topic)}`;
        }
    },

    SEOAnalyst: {
        analyze: async (content: string, focusKeyword: string, config: AIConfig) => {
            const prompt = `Analyze for "${focusKeyword}". Output JSON {score, missingKeywords, suggestedMetaDescription}.`;
            try {
                const res = await NeuroCore.generate({ prompt, config, jsonMode: true });
                return JSON.parse(res);
            } catch (e) { return { score: 70, missingKeywords: [], suggestedMetaDescription: "Manual review." }; }
        }
    },

    SchemaEngineer: {
        generateFAQSchema: async (content: string, config: AIConfig) => {
            const prompt = `Create FAQPage JSON-LD from this content: "${content.slice(0, 500)}".`;
            try { return await NeuroCore.generate({ prompt, config, jsonMode: true }); } catch (e) { return "{}"; }
        }
    }
};

/**
 * --- Legacy/Public API Wrapper ---
 * Maintains backward compatibility while using NeuroCore.
 */
export const AIService = {
    // --- New Methods (Fixed Gaps) ---
    scoreLead: Agents.Analyst.scoreLead,
    analyzeCompetitors: Agents.Analyst.analyzeCompetitors,
    generateSocialSchedule: Agents.Strategist.generateSocialSchedule,
    generateMonthlyPlan: Agents.Strategist.generateMonthlyPlan,
    generateArticle: Agents.Creator.writeArticle,
    generatePlatformPosts: Agents.Creator.generatePlatformPosts,

    // --- Legacy / Helper Wrappers ---
    suggestOutline: async (topic: string, config: AIConfig) => {
        const prompt = `Create outline for "${topic}". Return JSON: [{ "id": 1, "title": "...", "description": "..." }]`;
        try {
            const res = await NeuroCore.generate({ prompt, config, jsonMode: true });
            return JSON.parse(res);
        } catch { return []; }
    },

    refineTone: async (text: string, tone: string, config: AIConfig) => {
        return NeuroCore.generate({
            prompt: `Rewrite to be ${tone}: "${text}"`,
            config,
            type: 'creative'
        });
    },

    draftSection: async (sectionTitle: string, context: string, config: AIConfig) => {
        return NeuroCore.generate({
            prompt: `Write 3 paragraphs for section "${sectionTitle}". Return HTML only.`,
            context,
            config,
            type: 'creative'
        });
    },

    testConnection: (provider: string, config: AIConfig) => NeuroCore.testConnection(provider, config),

    suggestArticleImage: async (keyword: string) => {
        return `https://source.unsplash.com/1200x600/?${encodeURIComponent(keyword)}`;
    },

    suggestSEOEnhancements: async (content: string, keyword: string, config: AIConfig) => {
        const prompt = `Analyze content for keyword "${keyword}". Return JSON array of 3 string tips.`;
        try {
            const res = await NeuroCore.generate({ prompt, config, jsonMode: true });
            return JSON.parse(res);
        } catch { return ["Add more keywords", "Use H2 tags", "Add internal links"]; }
    },

    // Proxies for direct access if needed
    generateWithGemini: (p: string, c: AIConfig) => NeuroCore.generate({ prompt: p, config: c }),
    generateWithHuggingFace: (p: string, c: AIConfig) => NeuroCore.generate({ prompt: p, config: c, type: 'creative' }),
    generateImageWithHuggingFace: async (p: string, c: AIConfig) => `https://source.unsplash.com/1200x600/?${encodeURIComponent(p)}`
};

// Re-export specific agents if needed elsewhere
export const DigitalCouncil = Agents;
