// AI Service Removed as per Sovereign Directive
// This file serves as a temporary stub to prevent build errors during cleanup.

import { Article, AIConfig, Client, CompetitorData, SocialPost, ContentPlanItem } from '../types';

export const AIService = {
    scoreLead: async (...args: any[]) => 0,
    analyzeCompetitors: async (...args: any[]) => [],
    generateSocialSchedule: async (...args: any[]) => [],
    generateMonthlyPlan: async (...args: any[]) => [],
    generateArticle: async (...args: any[]) => { throw new Error("AI Module Removed"); },
    generatePlatformPosts: async (...args: any[]) => [],
    suggestOutline: async (...args: any[]) => [],
    refineTone: async (...args: any[]) => "",
    draftSection: async (...args: any[]) => "",
    testConnection: async (...args: any[]) => ({ ok: false, error: "AI Removed" }),
    suggestArticleImage: async (...args: any[]) => "",
    suggestSEOEnhancements: async (...args: any[]) => [],
    generateWithGemini: async (...args: any[]) => "",
    generateWithHuggingFace: async (...args: any[]) => "",
    generateImageWithHuggingFace: async (...args: any[]) => ""
};

export const DigitalCouncil = {
    Analyst: {
        scoreLead: () => 0,
        analyzeCompetitors: async () => []
    },
    Strategist: {
        generateSocialSchedule: async () => [],
        generateMonthlyPlan: async () => []
    },
    Creator: {
        writeArticle: async () => { throw new Error("AI Removed"); },
        generatePlatformPosts: async () => []
    },
    ChiefEditor: {
        draftSection: async (...args: any[]) => ""
    },
    VisualDirector: {
        generateHeaderImage: async () => ""
    },
    SEOAnalyst: {
        analyze: async () => ({ score: 0, missingKeywords: [], suggestedMetaDescription: "" })
    },
    SchemaEngineer: {
        generateFAQSchema: async () => "{}"
    }
};
