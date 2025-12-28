
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
}

export interface AIConfig {
  field: string;
  mission: string;
  tone: string;
  painPoints: string;
  sellingPoints: string;
  ctaAction: string;
  apiKey?: string; // Legacy/Gemini Key
  openaiKey?: string; // Legacy/OpenAI
  huggingFaceKey?: string; // Primary Sovereign Key
  anthropicKey?: string;
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
  autopilot?: AutopilotConfig;
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
