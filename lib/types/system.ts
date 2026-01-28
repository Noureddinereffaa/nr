import { Client, Project, Service, ServiceRequest } from './business';
import { Invoice, Expense } from './finance';
import { Article, SocialPost, ContentPlanItem, DecisionPage } from './content';
import { NavigationItem, SiteSection, Stat, Testimonial, FAQItem, ProcessStep } from './ui';

export interface AnalyticsStats {
    visits: { total: number; growth: number };
    revenue: {
        total: number;
        growth: number;
        history: { name: string; value: number }[];
    };
    expenses: { total: number; growth: number };
    conversions: { total: number; growth: number };
    projects: {
        active: number;
        completed: number;
        statusDistribution: { name: string; value: number; color: string }[];
    };
}

export interface SystemActivity {
    id: string;
    date: string;
    label: string;
    type: 'ai_forge' | 'sync' | 'crm' | 'finance' | 'system' | 'project' | 'content' | 'security';
    status: 'success' | 'info' | 'error' | 'warning';
    metadata?: Record<string, any>;
}

export interface AIConfig {
    field: string;
    mission: string;
    tone: string;
    painPoints: string;
    sellingPoints: string;
    ctaAction: string;
    apiKey?: string;
    openaiKey?: string;
    huggingFaceKey?: string;
    anthropicKey?: string;
    unsplashKey?: string;
    preferredProvider?: 'gemini' | 'openai' | 'anthropic' | 'huggingface';
    huggingFaceModel?: string;
    enabledAgents?: string[];
}

export interface BrandIdentity {
    siteName: string;
    logo: string;
    primaryColor: string;
    secondaryColor?: string;
    darkMode: boolean;
    slogan: string;
    fontFamily: string;
    borderRadius: string;
    glassOpacity: string;
    templateId?: 'premium-glass' | 'minimalist-pro' | 'cyber-command';
    testimonials?: Testimonial[];
}

export interface ContactInfo {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    socials: {
        linkedin?: string;
        facebook?: string;
        instagram?: string;
        twitter?: string;
        tiktok?: string;
        youtube?: string;
    };
}

export interface SiteTexts {
    nav: {
        home: string;
        services: string;
        portfolio: string;
        process: string;
        blog: string;
        contact: string;
        aiAssistant: string;
        dashboard: string;
    };
    hero: {
        badge: string;
        primaryButton: string;
        secondaryButton: string;
        stat1Label: string;
        stat2Label: string;
        stat3Label: string;
    };
    services: {
        badge: string;
        title: string;
        titleHighlight: string;
        subtitle: string;
        requestButton: string;
        featuresLabel: string;
    };
    portfolio: {
        badge: string;
        title: string;
        titleHighlight: string;
        subtitle: string;
        exploreButton: string;
    };
    process: {
        badge: string;
        title: string;
        titleHighlight: string;
        subtitle: string;
    };
    testimonials: {
        badge: string;
        title: string;
        titleHighlight: string;
    };
    contact: {
        badge: string;
        title: string;
        titleHighlight: string;
        subtitle: string;
        formTitle: string;
        whatsappLabel: string;
        emailLabel: string;
        phoneLabel: string;
        addressLabel: string;
        submitButton: string;
        whatsappCta: string;
    };
    blog: {
        badge: string;
        title: string;
        titleHighlight: string;
        subtitle: string;
        searchPlaceholder: string;
        categoryLabel: string;
        allCategories: string;
        readMore: string;
        trendingTitle: string;
        newsletterTitle: string;
        subscribeButton: string;
    };
    footer: {
        copyright: string;
        privacyPolicy: string;
        termsOfService: string;
        madeWith: string;
    };
}

export const DEFAULT_SITE_TEXTS: SiteTexts = {
    nav: {
        home: "الرئيسية",
        services: "الخدمات",
        portfolio: "النتائج",
        process: "المنهجية",
        blog: "المقالات",
        contact: "التواصل",
        aiAssistant: "المساعد الذكي",
        dashboard: "لوحة التحكم"
    },
    hero: {
        badge: "نظام التشغيل الاستراتيجي لنمو أعمالك",
        primaryButton: "احجز جلستك الآن",
        secondaryButton: "شاهد النتائج",
        stat1Label: "عائد مادي مضمون",
        stat2Label: "أتمتة شاملة",
        stat3Label: "دعم ذكي 24/7"
    },
    services: {
        badge: "حلولنا الذكية",
        title: "نحو الرقمنة الشاملة",
        titleHighlight: "بلمسة إبداعية",
        subtitle: "نحول رؤيتك إلى واقع رقمي ملموس من خلال أحدث تقنيات الأتمتة والذكاء الاصطناعي.",
        requestButton: "طلب الخدمة الآن",
        featuresLabel: "ما يميزنا"
    },
    portfolio: {
        badge: "قصص النجاح",
        title: "إنجازات تدفعك",
        titleHighlight: "إلى الأمام",
        subtitle: "نحن لا نبني مشاريع فقط، نحن نبني إمبراطوريات رقمية تدوم وتتطور.",
        exploreButton: "استكشف كل المشاريع"
    },
    process: {
        badge: "كيف نعمل",
        title: "منهجية العمل",
        titleHighlight: "الاحترافية",
        subtitle: "خطوات مدروسة تبدأ من الفهم العميق لاحتياجاتك وتنتهي بنجاح باهر."
    },
    testimonials: {
        badge: "قالوا عنا",
        title: "ثقة عملائنا هي",
        titleHighlight: "رصيدنا الأكبر"
    },
    contact: {
        badge: "دعنا نتحدث",
        title: "حول فكرتك إلى",
        titleHighlight: "نمو حقيقي",
        subtitle: "فريقنا مستعد دائماً للإجابة على استفساراتك ومساعدتك في رحلة النجاح.",
        formTitle: "أرسل لنا رسالة",
        whatsappLabel: "تواصل عبر واتساب",
        emailLabel: "البريد الإلكتروني",
        phoneLabel: "رقم الهاتف",
        addressLabel: "المقر الرسمي",
        submitButton: "إرسال البيانات",
        whatsappCta: "ابدأ محادثة الآن"
    },
    blog: {
        badge: "الرؤية الاستراتيجية",
        title: "مقالات وأفكار",
        titleHighlight: "ملهمة",
        subtitle: "نشاركك خبراتنا في عالم الأعمال والتقنية والذكاء الاصطناعي.",
        searchPlaceholder: "ابحث في مقالاتنا...",
        categoryLabel: "التصنيفات",
        allCategories: "جميع المقالات",
        readMore: "اقرأ المزيد",
        trendingTitle: "الأكثر قراءة",
        newsletterTitle: "اشترك في النشرة",
        subscribeButton: "انضم الآن"
    },
    footer: {
        copyright: "جميع الحقوق محفوظة © REFF AA STRATEGY",
        privacyPolicy: "سياسة الخصوصية",
        termsOfService: "شروط الخدمة",
        madeWith: "صنع بشغف في الجزائر"
    }
};

export interface SiteData {
    brand: BrandIdentity;
    contactInfo: ContactInfo;
    navigation: NavigationItem[];
    sections: SiteSection[];
    services: Service[];
    projects: Project[];
    testimonials: any[];
    clients: Client[];
    invoices: Invoice[];
    articles: Article[];
    aiConfig: AIConfig;
    features: {
        contentManager: boolean;
        aiBrain: boolean;
        crm?: boolean;
        financials?: boolean;
        marketing?: boolean;
    };
    serviceRequests?: ServiceRequest[];
    expenses?: Expense[];
    socialPosts?: SocialPost[];
    integrations?: SocialIntegration[];
    contentPlan?: ContentPlanItem[];
    decisionPages?: DecisionPage[];
    siteTexts?: SiteTexts;
    autopilot?: any;
    activityLog?: SystemActivity[];
    legal?: LegalInfo;
    financials?: FinancialConfig;
    profile: {
        name: string;
        nameEn?: string;
        primaryTitle: string;
        photoUrl: string;
        bio: string;
        address?: string;
        phone?: string;
        email?: string;
        socials?: {
            facebook?: string;
            linkedin?: string;
            twitter?: string;
            instagram?: string;
            youtube?: string;
            tiktok?: string;
            email?: string;
        };
    };
    faqs?: FAQItem[];
    process?: ProcessStep[];
    stats?: Stat[];
    analytics?: AnalyticsStats;
}

export interface SocialIntegration {
    id: string;
    provider: 'google_business' | 'linkedin' | 'twitter' | 'facebook' | 'instagram';
    name: string;
    icon: string;
    status: 'connected' | 'disconnected' | 'error';
    credentials?: any;
}

export interface LegalInfo {
    nif: string;
    nis: string;
    art: string;
    rc: string;
    address: string;
}

export interface FinancialConfig {
    rip: string;
    ccp: string;
    bankName?: string;
}
