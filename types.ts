
export type ArticleNiche = 'strategic' | 'general' | 'lifestyle' | 'education' | 'news';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export interface SiteSection {
  id: string;
  type: 'hero' | 'services' | 'projects' | 'testimonials' | 'contact' | 'about';
  title: string;
  subtitle?: string;
  content?: any;
  visible: boolean;
}

export interface Service {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  priceLabel?: string;
  features: string[];
  deliverables?: string[];
  duration?: string;
  popular?: boolean;
}

export interface CompetitorData {
  id: string;
  name: string;
  website: string;
  domainAuthority: number;
  weakness: string;
  strength: string;
  topKeywords: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  status: 'lead' | 'negotiation' | 'active' | 'completed' | 'lost';
  value: number;
  tags: string[];
  lastContact: string;
  notes: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'cash' | 'cib' | 'baridimob' | 'cheque' | 'transfer';
  reference?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientId: string;
  clientName: string;
  clientAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  payments: Payment[];
  currency: 'DZD' | 'EUR' | 'USD';
  recurring?: {
    interval: 'monthly' | 'quarterly' | 'yearly';
    nextDate: string;
  };
}

export interface Expense {
  id: string;
  title: string;
  category: 'api' | 'hosting' | 'ads' | 'contractor' | 'tools' | 'other';
  amount: number;
  currency: 'DZD' | 'EUR' | 'USD';
  date: string;
  description?: string;
  attachment?: string;
}

export interface RequestMessage {
  id: string;
  role: 'client' | 'admin' | 'system';
  content: string;
  date: string;
}

export interface ServiceRequest {
  id: string;
  serviceId?: string;
  serviceTitle: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  company?: string;
  projectDetails: string;
  priority: 'low' | 'medium' | 'high';
  budget?: string;
  timeline?: string;
  status: 'new' | 'review' | 'proposal' | 'negotiation' | 'accepted' | 'rejected' | 'completed';
  date: string;
  messages: RequestMessage[];
}

export interface ProjectTask {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface ProjectActivity {
  id: string;
  date: string;
  text: string;
  type: 'status_change' | 'comment' | 'task_update' | 'milestone_reach';
  user?: string;
}

export interface Stat {
  icon: string;
  label: string;
  val: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface SystemActivity {
  id: string;
  date: string;
  label: string;
  type: 'ai_forge' | 'sync' | 'crm' | 'finance' | 'system' | 'project' | 'content';
  status: 'success' | 'info' | 'error' | 'warning';
  metadata?: any;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  status: 'planning' | 'in-progress' | 'completed' | 'archived';
  featured: boolean;
  gallery: string[];
  tags: string[];
  links?: {
    demo?: string;
    github?: string;
    design?: string;
  };
  caseStudy?: {
    problem: string;
    solution: string;
    result: string;
  };
  fullDescription: string;
  client: string;
  date: string;
  technologies: string[];
  tasks?: ProjectTask[];
  milestones?: ProjectMilestone[];
  activity?: ProjectActivity[];
  budget?: number;
  stats?: string;
}

export interface AIConfig {
  field: string;
  mission: string;
  tone: string;
  painPoints: string;
  sellingPoints: string;
  ctaAction: string;
  apiKey?: string; // Gemini/General Key
  openaiKey?: string;
  huggingFaceKey?: string;
  anthropicKey?: string;
  unsplashKey?: string; // NEW: For Unsplash API logic
  preferredProvider?: 'gemini' | 'openai' | 'anthropic' | 'huggingface';
  huggingFaceModel?: string;
  enabledAgents?: string[]; // IDs of active Council members
}

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
  };
  seoScore?: number;
  seoAnalysis?: {
    keywordDensity: string;
    readabilityScore: string;
    metaTags: boolean;
    internalLinks: boolean;
    imageAltTags: boolean;
    structuredData: boolean;
    lsicoverage: boolean;
    hTagsHierarchy: boolean;
  };
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

export interface SocialIntegration {
  id: string;
  provider: 'google_business' | 'linkedin' | 'twitter' | 'facebook' | 'instagram';
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  credentials?: {
    apiKey?: string;
    accessToken?: string;
    pageId?: string;
    expiresAt?: string;
  };
}

export interface ContentPlanItem {
  id: string;
  topic: string;
  type: 'article' | 'video' | 'post' | 'email';
  scheduledDate: string;
  status: 'planned' | 'published' | 'cancelled';
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

  // Advanced Info / Metadata
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  dates?: {
    published: string; // ISO String
    updated: string;   // ISO String
  };
  author?: {
    name: string;
    role: string;
    image: string;
  };

  // Metrics & Ratings
  metrics?: {
    timeSaved: string;      // e.g. "20h/week"
    tasksAutomated: string; // e.g. "50+"
    roiMultiplier: string;  // e.g. "3x"
  };

  // Rich Content
  faq?: {
    question: string;
    answer: string;
  }[];

  // Assets
  media?: {
    videoUrl?: string; // YouTube/Vimeo embed URL
    gallery: string[]; // Array of image URLs
    pdfUrl?: string;   // Downloadable summary/cheatsheet
  };

  // Comparison
  comparison?: {
    feature: string;
    us: string;
    other: string;
  }[];

  // Social Proof
  testimonials?: {
    text: string;
    author: string;
    role: string;
    avatar?: string;
  }[];
}

export interface AutopilotConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly';
  platforms: string[];
  strategyFocus: 'growth' | 'authority' | 'sales';
  lastRun?: string;
  maxDailyPosts?: number;
}

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
  autopilot?: AutopilotConfig;
  activityLog?: SystemActivity[];
  // UI/Legacy compatibility
  profile?: any;
  faqs?: any;
  process?: any;
  stats?: any;
  dashboardLayout?: any[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Comprehensive Site Text Customization Interface
export interface SiteTexts {
  // Navigation
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

  // Hero Section
  hero: {
    badge: string;
    primaryButton: string;
    secondaryButton: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
  };

  // Services Section
  services: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    featuresLabel: string;
    requestButton: string;
  };

  // Portfolio Section
  portfolio: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    exploreButton: string;
  };

  // Process Section
  process: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
  };

  // Testimonials Section
  testimonials: {
    badge: string;
    title: string;
    titleHighlight: string;
  };

  // Contact Section
  contact: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    whatsappLabel: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    formTitle: string;
    formSubtitle: string;
    nameLabel: string;
    emailFieldLabel: string;
    projectLabel: string;
    detailsLabel: string;
    submitButton: string;
    whatsappCta: string;
    whatsappCtaSubtitle: string;
  };

  // Blog Section
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
    newsletterSubtitle: string;
    subscribeButton: string;
  };

  // Footer
  footer: {
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
    madeWith: string;
  };

  // Common Buttons & Labels
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    viewAll: string;
    backToTop: string;
  };
}

// Default Arabic texts
export const DEFAULT_SITE_TEXTS: SiteTexts = {
  nav: {
    home: 'الرئيسية',
    services: 'الخدمات',
    portfolio: 'النتائج',
    process: 'المنهجية',
    blog: 'المقالات',
    contact: 'تواصل معنا',
    aiAssistant: 'المساعد الذكي',
    dashboard: 'لوحة التحكم'
  },
  hero: {
    badge: 'The Sovereign Digital Era 2025',
    primaryButton: 'اكتشف خدماتنا النخبوية',
    secondaryButton: 'حلول ذكاء اصطناعي',
    stat1Label: 'دقة الأتمتة',
    stat2Label: 'حلول منجزة',
    stat3Label: 'خبرة دولية'
  },
  services: {
    badge: 'Strategic Command Center',
    title: 'حلول',
    titleHighlight: 'استراتيجية',
    subtitle: 'نحن لا نبيع مجرد خدمات، نحن نصمم أنظمة ذكية تضمن لك السيطرة الكاملة على السوق الرقمي.',
    featuresLabel: 'المميزات الاستراتيجية',
    requestButton: 'طلب الخدمة'
  },
  portfolio: {
    badge: 'Elite Case Studies',
    title: 'معرض',
    titleHighlight: 'الإنجازات',
    subtitle: 'شاهد كيف تحولت الرؤى الطموحة إلى واقع رقمي ملموس من خلال حلولنا الهندسية المبتكرة.',
    exploreButton: 'استكشف تفاصيل المشروع'
  },
  process: {
    badge: 'Strategic Architecture',
    title: 'كيف نصنع',
    titleHighlight: 'الفارق؟',
    subtitle: 'نتبع منهجية هندسية صارمة تضمن تحويل الرؤى المعقدة إلى أنظمة رقمية تتسم بالسيادة والنمو المستدام.'
  },
  testimonials: {
    badge: 'Clients Trust',
    title: 'ماذا يقول',
    titleHighlight: 'شركاؤنا؟'
  },
  contact: {
    badge: 'Get in Touch',
    title: 'لنحول رؤيتك إلى',
    titleHighlight: 'واقع رقمي',
    subtitle: 'تواصل معي اليوم لمناقشة مشروعك القادم. سواء كان فكرة ناشئة أو تطوير لنظام قائم، أنا هنا لتقديم الخبرة المطلوبة.',
    whatsappLabel: 'واتساب مباشر',
    emailLabel: 'البريد للتواصل الرسمي',
    phoneLabel: 'رقم الهاتف والاتصال',
    addressLabel: 'المقر الرئيسي',
    formTitle: 'محرك الطلبات الرقمي',
    formSubtitle: 'Project Submission Engine v1.0',
    nameLabel: 'الاسم الكامل',
    emailFieldLabel: 'البريد الإلكتروني',
    projectLabel: 'مجال المشروع',
    detailsLabel: 'تفاصيل الرؤية والأهداف',
    submitButton: 'إرسال رسالتك الآن',
    whatsappCta: 'استشارة فورية عبر الواتساب؟',
    whatsappCtaSubtitle: 'متاح الآن للرد على استفساراتكم'
  },
  blog: {
    badge: 'Sovereign Intelligence Hub 2025',
    title: 'مركز',
    titleHighlight: 'المعرفة',
    subtitle: 'تحليلات استراتيجية ورؤى هندسية لصناعة الفارق في الاقتصاد الرقمي الحديث.',
    searchPlaceholder: 'ابحث في الأرشيف الذكي...',
    categoryLabel: 'تصنيف الرؤى:',
    allCategories: 'الكل',
    readMore: 'استكشاف التحليل',
    trendingTitle: 'الأكثر تأثيراً',
    newsletterTitle: 'انضم إلى مجتمع النخبة الرقمية',
    newsletterSubtitle: 'احصل على تحليلات استراتيجية أسبوعية لا تتوفر للعموم.',
    subscribeButton: 'الاشتراك في النشرة'
  },
  footer: {
    copyright: '© 2025 جميع الحقوق محفوظة',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    madeWith: 'صنع بـ ❤️ في الجزائر'
  },
  common: {
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'تم بنجاح',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    close: 'إغلاق',
    viewAll: 'عرض الكل',
    backToTop: 'العودة للأعلى'
  }
};
