export type ArticleNiche = 'strategic' | 'general' | 'lifestyle' | 'education' | 'news';

export interface Article {
    id: string;
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    image: string;
    category: string;
    tags: string[];
    keywords: string[];
    author: string;
    date: string;
    status: 'draft' | 'published' | 'scheduled';
    readTime: string;
    featured?: boolean;
    popular?: boolean;
    views?: number;
    isDeepContent?: boolean;
    ctaWhatsApp?: string;
    ctaDownloadUrl?: string;
    seo: {
        title: string;
        description: string;
        focusKeyword: string;
        targetLongTail?: string[];
    };
    seoScore?: number;
    aiSgeScore?: number;
    seoAnalysis?: {
        keywordDensity: number;
        readabilityScore: number;
        wordCount: number;
        metaTags: boolean;
        internalLinks: boolean;
        imageAltTags: boolean;
        structuredData: boolean;
        semanticBreadth?: number;
        intentMatch?: number;
        lsicoverage?: boolean;
        hTagsHierarchy?: boolean;
    };
}

export interface ContentPlanItem {
    id: string;
    topic: string;
    type: 'article' | 'video' | 'post' | 'email';
    scheduledDate: string;
    status: 'planned' | 'published' | 'cancelled';
}

export interface SocialPost {
    id: string;
    platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram';
    content: string;
    scheduledDate: string;
    status: 'scheduled' | 'published' | 'error';
    image?: string;
    articleId?: string;
    integrationId?: string;
}

export interface DecisionPage {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    category: 'crm' | 'marketing' | 'automation' | 'ai' | 'other';
    image: string;
    rating: number;
    badge?: string;
    badgeColor?: string;
    description: string;
    pros: string[];
    cons: string[];
    pricing: string;
    bestFor: string;
    verdict: string;
    affiliateUrl: string;
    status: 'draft' | 'published' | 'archived';
    date: string;
    views?: number;
    clicks?: number;
    seo?: {
        title: string;
        description: string;
        keywords: string[];
    };
    metrics?: {
        timeSaved: string;
        tasksAutomated: string;
        roiMultiplier: string;
    };
}
