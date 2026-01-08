import React, { createContext, useContext, useState, useEffect } from 'react';
import { NOUREDDINE_DATA, SERVICES, PROJECTS, TESTIMONIALS, FAQS, WORK_PROCESS, DEFAULT_STATS, ARTICLES } from '../constants';
import { SiteData, Client, Project, Invoice, Service, Article, ServiceRequest, Expense, SocialPost, SocialIntegration, ContentPlanItem, SystemActivity, DecisionPage } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Logger from '../lib/logger';

interface DataContextType {
  siteData: SiteData;
  isLoading: boolean;
  updateSiteData: (newData: Partial<SiteData>) => void;
  updateProfile: (newData: any) => void;
  updateAIConfig: (newAI: any) => void;

  // Client CRUD
  addClient: (client: Partial<Client>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => Promise<void>;

  // Project CRUD
  addProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Invoice CRUD
  addInvoice: (invoice: Partial<Invoice>) => Promise<void>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  // Service CRUD
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, data: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Article CRUD
  addArticle: (article: Omit<Article, 'id' | 'date' | 'slug'>) => Promise<string>;
  updateArticle: (id: string, data: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;

  // Request CRUD
  addRequest: (request: Omit<ServiceRequest, 'id' | 'date' | 'messages'>) => Promise<void>;
  updateRequest: (id: string, data: Partial<ServiceRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;

  // Expense CRUD
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => Promise<void>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Social CRUD
  addSocialPost: (post: Omit<SocialPost, 'id' | 'status'>) => Promise<void>;
  deleteSocialPost: (id: string) => Promise<void>;
  updateIntegration: (id: string, data: Partial<SocialIntegration>) => Promise<void>;

  // Decision Pages CRUD
  addDecisionPage: (page: Omit<DecisionPage, 'id' | 'date'>) => Promise<void>;
  updateDecisionPage: (id: string, data: Partial<DecisionPage>) => Promise<void>;
  deleteDecisionPage: (id: string) => Promise<void>;

  syncStatus: { total: number; current: number; errorCount: number; isSyncing: boolean };
  logActivity: (label: string, type: SystemActivity['type'], status?: SystemActivity['status'], metadata?: any) => void;
  syncArticlesToCloud: () => Promise<void>;
  resetToDefault: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    const defaultData: SiteData = {
      navigation: [],
      sections: [],
      profile: NOUREDDINE_DATA,
      brand: {
        siteName: 'Noureddine Reffaa',
        logo: '/logo.png',
        primaryColor: '#4f46e5',
        darkMode: true,
        slogan: 'Building Digital Empires',
        fontFamily: 'Inter',
        borderRadius: '1.5rem',
        glassOpacity: '0.1',
        templateId: 'premium-glass'
      },
      contactInfo: {
        phone: '+213 555 000 000',
        whatsapp: 'https://wa.me/213555000000',
        email: 'contact@reffaa.com',
        address: 'باتنة، الجزائر',
        socials: {
          linkedin: 'https://linkedin.com/in/noureddine-reffaa',
          facebook: 'https://facebook.com/noureddine.reffaa',
          instagram: '',
          twitter: '',
          tiktok: '',
          youtube: ''
        }
      },
      services: SERVICES,
      projects: PROJECTS,
      testimonials: TESTIMONIALS,
      faqs: FAQS,
      process: WORK_PROCESS,
      stats: DEFAULT_STATS,
      clients: [],
      invoices: [],
      articles: ARTICLES,
      aiConfig: {
        field: "إدارة المشاريع الرقمية والأتمتة",
        mission: "تحويل الشركات التقليدية إلى كيانات رقمية ذكية تدر أرباحاً آلياً.",
        tone: "professional",
        painPoints: "تشتت البيانات، نقص المبيعات، العمل اليدوي المرهق.",
        sellingPoints: "مقاول معتمد، خبرة 5 سنوات، دعم فني 24/7.",
        ctaAction: "حجز جلسة تشخيص مجانية عبر الواتساب.",
        apiKey: "",
        openaiKey: "",
        anthropicKey: "",
        preferredProvider: "gemini"
      },
      features: {
        contentManager: true,
        aiBrain: true,
        crm: true,
        financials: true,
        marketing: true
      },
      serviceRequests: [],
      expenses: [],
      socialPosts: [],
      integrations: [
        { id: 'google_business', name: 'Google Business', icon: 'Search', provider: 'google_business', status: 'disconnected' },
        { id: 'linkedin', name: 'LinkedIn Professional', icon: 'Linkedin', provider: 'linkedin', status: 'disconnected' },
        { id: 'twitter', name: 'Twitter / X', icon: 'Twitter', provider: 'twitter', status: 'disconnected' },
        { id: 'facebook', name: 'Facebook Page', icon: 'Facebook', provider: 'facebook', status: 'disconnected' },
        { id: 'instagram', name: 'Instagram Business', icon: 'Instagram', provider: 'instagram', status: 'disconnected' }
      ],
      autopilot: {
        enabled: false,
        frequency: 'weekly',
        platforms: ['linkedin', 'twitter'],
        strategyFocus: 'growth'
      },
      contentPlan: [],
      decisionPages: [
        {
          id: 'demo-ghl',
          slug: 'gohighlevel-review-2024',
          title: 'GoHighLevel Review 2026: Is It Worth It for Agencies?',
          subtitle: 'Stop overpaying for a fragmented tech stack. We migrated 50+ clients to GoHighLevel and cut operating costs by 70%. In this review, we reveal how its all-in-one "Agency Engine" replaces ClickFunnels, ActiveCampaign, and Calendly to double your ROI.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
          category: 'crm',
          rating: 4.8,
          date: '2025-01-05',
          dates: {
            published: '2024-03-15',
            updated: '2026-01-05'
          },
          author: {
            name: 'Noureddine Reffaa',
            role: 'Agency Founder',
            image: '/logo.png'
          },
          description: `## The Verdict: Why It Is The Ultimate "Agency OS"
If you are serious about scaling your agency in 2026, GoHighLevel is not optional—it is essential. We tested it against every major competitor (HubSpot, Salesforce, ClickFunnels), and the results were conclusive. GHL is the only platform that unifies your entire acquisition funnel—from landing pages and 2-way SMS to automated booking and reputation management—under one roof.

Before switching, our stack was a mess of disconnected tools (ActiveCampaign, ClickFunnels, Calendly) costing us **$700+/month** just on infrastructure. Post-migration, we saved **15+ hours/week** and increased lead conversion by **40%**. Here is exactly how it transforms chaotic agencies into streamlined profit machines.

## The "Operating System" Shift
GoHighLevel isn't just a CRM; it's an operating system. It combines all the above into one dashboard.

### Core Features We Actually Use
1.  **Unified Inbox**: Every SMS, Email, DM, and WhatsApp message in one stream. No more "check your DM" anxiety.
2.  **Snapshot Automation**: We built a "Perfect Restoration System" for our clients. New client? One click, and their entire account, websites, and automations are live.
3.  **SaaS Mode**: We white-labeled GHL as "GrowthEngine" and sell it to local businesses for $297/mo. It covers our own cost 10x over.

> **Pro Tip**: Don't try to use everything at once. Start with the "Missed Call Text Back" feature. It saves 2-3 leads per week instantly.

## The Real ROI Data
We tracked our efficiency before and after the switch:
-   **Onboarding Time**: Reduced from 5 days to 4 hours.
-   **Client Retention**: Increased by 40% (sticky software = sticky clients).
-   **Monthly Savings**: Saved $1,200/month in software fees.

## Who Is It NOT For?
If you run a pure e-commerce store (Shopify), stick to Klaviyo. GHL is built for *service businesses* and *lead generation*.`,
          verdict: 'GoHighLevel is the closest thing to a "Business in a Box" we have ever found. It is not just software; it is a profit multiplier for any agency.',
          pros: ['Replaces $1,000+ of other software', 'White-label capabilities (Sell it as your own SaaS)', 'Unbeatable automation builder', 'Native 2-way SMS & Calling'],
          cons: ['Steep learning curve (allow 2 weeks)', 'Mobile app is good but not great', 'Email designer is function-over-form'],
          affiliateUrl: 'https://www.gohighlevel.com/?fp_ref=demo',
          pricing: '$97/mo',
          bestFor: 'Agencies & Coaches',
          status: 'published',
          badge: 'Editor\'s Choice',
          seo: {
            title: 'GoHighLevel Review 2026 - Honest Agency Owner Perspective',
            description: 'Is GoHighLevel worth the hype? We break down the pros, cons, and ROI after 6 months of heavy usage.',
            keywords: ['GoHighLevel', 'CRM', 'Marketing Automation', 'Agency Tools']
          },
          media: {
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
            gallery: [
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1553877607-498c84d4ae80?auto=format&fit=crop&q=80'
            ],
            pdfUrl: 'https://example.com/ghl-cheat-sheet.pdf'
          },
          metrics: {
            timeSaved: '20h/week',
            tasksAutomated: '1,500+',
            roiMultiplier: '10x'
          },
          faq: [
            { question: 'Does it replace ClickFunnels?', answer: 'Yes, completely. The funnel builder is 95% similar but faster.' },
            { question: 'Can I use my own domain?', answer: 'Yes, unlimited domains and subdomains.' },
            { question: 'Is the support good?', answer: 'They have 24/7 Zoom support, which is unheard of in this industry.' }
          ],
          testimonials: [
            { text: "We cancelled ActiveCampaign and Calendly the same day we signed up. It just works.", author: "Sarah Jenkins", role: "Agency CEO" },
            { text: "I resell the software to my dental clients for $497/mo. It pays for my car.", author: "Mike Ross", role: "Local Consultant" },
            { text: "The automation workflows are the most powerful I have seen since Infusionsoft.", author: "Ahmed K.", role: "Tech Lead" }
          ]
        }
      ],
      activityLog: [],
      hiddenIds: []
    };

    const saved = localStorage.getItem('nr_full_platform_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultData,
          ...parsed,
          brand: { ...defaultData.brand, ...(parsed.brand || {}) },
          aiConfig: { ...defaultData.aiConfig, ...(parsed.aiConfig || {}) },
          projects: (parsed.projects && parsed.projects.length > 0) ? parsed.projects : defaultData.projects,
          services: (parsed.services && parsed.services.length > 0) ? parsed.services : defaultData.services,
          testimonials: (parsed.testimonials && parsed.testimonials.length > 0) ? parsed.testimonials : defaultData.testimonials,
          decisionPages: (parsed.decisionPages && parsed.decisionPages.length > 0) ? parsed.decisionPages : defaultData.decisionPages,
          features: { ...defaultData.features, ...(parsed.features || {}) },
          activityLog: parsed.activityLog || []
        };
      } catch (e) {
        console.error("Failed to parse saved data", e);
        return defaultData;
      }
    }

    return defaultData;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState({ total: 0, current: 0, errorCount: 0, isSyncing: false });

  useEffect(() => {
    localStorage.setItem('nr_full_platform_data', JSON.stringify(siteData));
  }, [siteData]);

  useEffect(() => {
    const fetchSupabaseData = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        console.warn("Supabase not configured. Running in local mode.");
        setIsLoading(false);
        return;
      }

      try {
        const extractJsonbData = <T,>(rows: any[] | null): T[] => {
          if (!rows || rows.length === 0) return [];
          return rows.map(row => {
            const { data, ...rest } = row;
            return {
              ...rest,
              ...(data && typeof data === 'object' ? data : {}),
              id: row.id // Ensure ID from database always takes priority
            };
          }) as T[];
        };

        const [
          settingsRes,
          clientsRes,
          projectsRes,
          servicesRes,
          articlesRes,
          invoicesRes,
          requestsRes,
          expensesRes,
          socialPostsRes,
          integrationsRes,
          contentPlanRes,
          decisionPagesRes,
          activityLogRes
        ] = await Promise.all([
          supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle(),
          supabase.from('clients').select('*'),
          supabase.from('projects').select('*'),
          supabase.from('services').select('*'),
          supabase.from('articles').select('*'),
          supabase.from('invoices').select('*'),
          supabase.from('service_requests').select('*'),
          supabase.from('expenses').select('*'),
          supabase.from('social_posts').select('*'),
          supabase.from('integrations').select('*'),
          supabase.from('content_plan').select('*'),
          supabase.from('decision_pages').select('*'),
          supabase.from('activity_log').select('*').order('date', { ascending: false }).limit(50)
        ]);

        if (clientsRes.error && clientsRes.error.code === '42P01') {
          console.error("Supabase Error: Tables not initialized.");
          setIsLoading(false);
          return;
        }

        // Initialize new data with previous state as baseline
        const updates: Partial<SiteData> = {};

        // 1. Process standard tables
        const tableMap: Record<string, keyof SiteData> = {
          clients: 'clients',
          projects: 'projects',
          services: 'services',
          invoices: 'invoices',
          service_requests: 'serviceRequests',
          expenses: 'expenses',
          social_posts: 'socialPosts',
          integrations: 'integrations',
          content_plan: 'contentPlan',
          decision_pages: 'decisionPages',
          activity_log: 'activityLog'
        };

        const responses: Record<string, any> = {
          clients: clientsRes,
          projects: projectsRes,
          services: servicesRes,
          invoices: invoicesRes,
          service_requests: requestsRes,
          expenses: expensesRes,
          social_posts: socialPostsRes,
          integrations: integrationsRes,
          content_plan: contentPlanRes,
          decision_pages: decisionPagesRes,
          activity_log: activityLogRes
        };

        Object.entries(tableMap).forEach(([tableName, stateKey]) => {
          const res = responses[tableName];
          if (res?.data && res.data.length > 0) {
            updates[stateKey as any] = extractJsonbData<any>(res.data);
          }
        });

        // 2. Handle Articles with complex merge logic
        const hiddenIds = settingsRes.data?.hidden_ids || siteData.hiddenIds || [];
        const cloudArticles = extractJsonbData<Article>(articlesRes.data);
        const localMasterIds = ARTICLES.map(a => a.id);
        const visibleLocalArticles = ARTICLES.filter(a => !hiddenIds.includes(a.id));
        const filteredCloudArticles = cloudArticles.filter(a => !localMasterIds.includes(a.id) && !hiddenIds.includes(a.id));
        updates.articles = [...visibleLocalArticles, ...filteredCloudArticles];
        updates.hiddenIds = hiddenIds;

        // 3. Handle Site Settings (JSONB fields)
        if (settingsRes.data) {
          const settings = settingsRes.data;
          const jsonFields: (keyof SiteData)[] = [
            'brand', 'contactInfo', 'aiConfig', 'features', 'faqs',
            'testimonials', 'process', 'stats', 'profile', 'autopilot'
          ];

          jsonFields.forEach(field => {
            if (settings[field]) {
              // Deep merge for objects, direct assignment for chips/arrays
              if (typeof settings[field] === 'object' && !Array.isArray(settings[field])) {
                updates[field as any] = { ...siteData[field as keyof SiteData], ...settings[field] };
              } else {
                updates[field as any] = settings[field];
              }
            }
          });
        }

        // Apply all updates at once
        setSiteData(prevData => ({
          ...prevData,
          ...updates
        }));

      } catch (error) {
        console.error("Supabase Sync Error", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupabaseData();
  }, []);

  const syncSettings = async (data: Partial<SiteData>) => {
    if (!isSupabaseConfigured() || !supabase) return;
    const settingsKeys = ['brand', 'contactInfo', 'aiConfig', 'features', 'faqs', 'testimonials', 'process', 'stats', 'profile', 'autopilot', 'contentPlan', 'hiddenIds'];
    const updatePayload: any = {};
    Object.keys(data).forEach(key => {
      if (settingsKeys.includes(key)) {
        if (key === 'hiddenIds') {
          updatePayload.hidden_ids = data[key];
        } else {
          updatePayload[key] = data[key as keyof SiteData];
        }
      }
    });

    if (Object.keys(updatePayload).length > 0) {
      try {
        await supabase.from('site_settings').upsert({ id: 'main', ...updatePayload });
      } catch (e) {
        Logger.error('Sync Settings Error', e);
      }
    }
  };

  const logActivity = async (label: string, type: SystemActivity['type'], status: SystemActivity['status'] = 'info', metadata?: any) => {
    const newActivity: SystemActivity = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      label,
      type,
      status,
      metadata
    };

    setSiteData(prev => {
      const currentLog = prev.activityLog || [];
      return {
        ...prev,
        activityLog: [newActivity, ...currentLog].slice(0, 50)
      };
    });

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('activity_log').insert([{ id: newActivity.id, data: newActivity }]);
      } catch (e) {
        Logger.error('Supabase Log Activity Failed', e);
      }
    }
  };

  const updateSiteData = async (newData: Partial<SiteData>) => {
    setSiteData((prev) => {
      const updated = { ...prev, ...newData };
      syncSettings(newData);
      return updated;
    });
  };

  const updateProfile = async (newData: any) => {
    setSiteData((prev) => {
      const updatedProfile = { ...prev.profile, ...newData };
      syncSettings({ profile: updatedProfile } as any);
      return { ...prev, profile: updatedProfile };
    });
  };

  const updateAIConfig = async (newAI: any) => {
    setSiteData((prev) => {
      const updatedAI = { ...prev.aiConfig, ...newAI };
      syncSettings({ aiConfig: updatedAI });
      return { ...prev, aiConfig: updatedAI };
    });
  };

  const addClient = async (client: Partial<Client>) => {
    const newClient = { ...client, id: 'c-' + Date.now() } as Client;
    setSiteData(prev => ({ ...prev, clients: [...(prev.clients || []), newClient] }));
    logActivity(`عميل جديد: ${newClient.name}`, 'crm', 'success');
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('clients').insert([{ id: newClient.id, data: newClient }]);
      if (error) Logger.error('Supabase Add Client Failed', error);
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    setSiteData(prev => ({ ...prev, clients: prev.clients.map(c => c.id === id ? { ...c, ...updates } : c) }));
    logActivity(`تم تحديث العميل ${updates.name || id}`, 'crm', 'info');
    if (isSupabaseConfigured() && supabase) {
      const currentClient = siteData.clients.find(c => c.id === id);
      const { error } = await supabase.from('clients').upsert({ id, data: { ...currentClient, ...updates } });
      if (error) Logger.error('Supabase Update Client Failed', error);
    }
  };

  const deleteClient = async (id: string): Promise<void> => {
    setSiteData(prev => ({ ...prev, clients: prev.clients.filter(c => c.id !== id) }));
    logActivity(`تم حذف العميل ${id}`, 'crm', 'warning');
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('clients').delete().eq('id', id);
    }
  };

  const addProject = async (project: Partial<Project>) => {
    const newProject = { ...project, id: 'p-' + Date.now() } as Project;
    setSiteData(prev => ({ ...prev, projects: [...(prev.projects || []), newProject] }));
    const projectName = (project as any).title || (project as any).name || newProject.id;
    logActivity(`مشروع جديد: ${projectName}`, 'project', 'success');
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('projects').insert([{ id: newProject.id, data: newProject }]);
      if (error) Logger.error('Supabase Add Project Failed', error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setSiteData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p) }));
    const projectName = (updates as any).title || (updates as any).name || id;
    logActivity(`تم تحديث المشروع ${projectName}`, 'project', 'info');
    if (isSupabaseConfigured() && supabase) {
      const oldProject = siteData.projects.find(p => p.id === id);
      const { error } = await supabase.from('projects').upsert({ id, data: { ...oldProject, ...updates } });
      if (error) Logger.error('Supabase Update Project Failed', error);
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    setSiteData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
    logActivity(`تم حذف المشروع ${id}`, 'project', 'warning');
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('projects').delete().eq('id', id);
    }
  };

  const addInvoice = async (invoice: Partial<Invoice>) => {
    const newInvoice: Invoice = { ...invoice, id: 'inv-' + Date.now() } as Invoice;
    setSiteData(prev => ({ ...prev, invoices: [...(prev.invoices || []), newInvoice] }));
    logActivity(`فاتورة جديدة: ${newInvoice.id}`, 'finance', 'success');
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('invoices').insert([{ id: newInvoice.id, data: newInvoice }]);
      if (error) Logger.error('Supabase Add Invoice Failed', error);
    }
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    setSiteData(prev => ({
      ...prev,
      invoices: (prev.invoices || []).map(i => i.id === id ? { ...i, ...updates } : i)
    }));
    logActivity(`تم تحديث الفاتورة ${id}`, 'finance', 'info');
    if (isSupabaseConfigured() && supabase) {
      const currentInvoice = siteData.invoices.find(i => i.id === id);
      const { error } = await supabase.from('invoices').upsert({ id, data: { ...currentInvoice, ...updates } });
      if (error) Logger.error('Supabase Update Invoice Failed', error);
    }
  };

  const deleteInvoice = async (id: string): Promise<void> => {
    setSiteData(prev => ({ ...prev, invoices: prev.invoices.filter(i => i.id !== id) }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('invoices').delete().eq('id', id);
    }
  };

  const addService = async (service: Omit<Service, 'id'>): Promise<void> => {
    const newService: Service = { ...service, id: 'srv-' + Date.now() } as Service;
    setSiteData(prev => ({ ...prev, services: [...(prev.services || []), newService] }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('services').insert([{ id: newService.id, data: newService }]);
    }
  };

  const updateService = async (id: string, data: Partial<Service>): Promise<void> => {
    setSiteData(prev => ({ ...prev, services: (prev.services || []).map(s => s.id === id ? { ...s, ...data } : s) }));
    if (isSupabaseConfigured() && supabase) {
      const currentService = siteData.services.find(s => s.id === id);
      await supabase.from('services').upsert({ id, data: { ...currentService, ...data } });
    }
  };

  const deleteService = async (id: string): Promise<void> => {
    setSiteData(prev => ({ ...prev, services: (prev.services || []).filter(s => s.id !== id) }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('services').delete().eq('id', id);
    }
  };

  const addArticle = async (article: Omit<Article, 'id' | 'date' | 'slug'>): Promise<string> => {
    const articleData = article as any;
    const newId = crypto.randomUUID();
    const newArticle: Article = {
      ...article,
      id: newId,
      date: new Date().toISOString(),
      slug: articleData.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      status: article.status || 'draft',
      // Ensure defaults
      views: 0,
      seoScore: article.seoScore || 0,
      image: article.image || 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80'
    } as Article;

    // Optimistic Update
    setSiteData(prev => ({ ...prev, articles: [newArticle, ...(prev.articles || [])] }));

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('articles').insert([{
        id: newArticle.id,
        title: newArticle.title,
        slug: newArticle.slug,
        content: newArticle.content,
        excerpt: newArticle.excerpt,
        image: newArticle.image,
        category: newArticle.category,
        date: newArticle.date,
        views: newArticle.views,
        seo_score: newArticle.seoScore,
        status: newArticle.status,
        keywords: newArticle.keywords || []
      }]);

      if (error) {
        Logger.error('Supabase Add Article Failed', error);
        // Optional: Revert optimistic update or show toast
      }
    }

    return newId;
  };

  const updateArticle = async (id: string, data: Partial<Article>): Promise<void> => {
    setSiteData(prev => ({ ...prev, articles: (prev.articles || []).map(a => a.id === id ? { ...a, ...data } : a) }));

    if (isSupabaseConfigured() && supabase) {
      // Map frontend camelCase to backend snake_case if needed, or send specific fields
      const payload: any = { ...data };
      if (data.seoScore !== undefined) { payload.seo_score = data.seoScore; delete payload.seoScore; }

      await supabase.from('articles').update(payload).eq('id', id);
    }
  };

  const deleteArticle = async (id: string): Promise<void> => {
    const isHardcoded = ARTICLES.some(a => a.id === id);

    setSiteData(prev => {
      const newHiddenIds = isHardcoded
        ? [...(prev.hiddenIds || []), id].filter((v, i, a) => a.indexOf(v) === i)
        : prev.hiddenIds;

      const newData = {
        ...prev,
        articles: prev.articles.filter(a => a.id !== id),
        hiddenIds: newHiddenIds
      };

      if (isHardcoded) {
        syncSettings({ hiddenIds: newHiddenIds });
      }

      return newData;
    });

    if (isSupabaseConfigured() && supabase && !isHardcoded) {
      await supabase.from('articles').delete().eq('id', id);
    }
  };

  const addRequest = async (request: Omit<ServiceRequest, 'id' | 'date' | 'messages'>): Promise<void> => {
    const newRequest: ServiceRequest = {
      ...request,
      id: 'req-' + Date.now(),
      date: new Date().toISOString(),
      messages: []
    };
    setSiteData(prev => ({ ...prev, serviceRequests: [newRequest, ...(prev.serviceRequests || [])] }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('service_requests').insert([{ id: newRequest.id, data: newRequest }]);
    }
  };

  const updateRequest = async (id: string, data: Partial<ServiceRequest>): Promise<void> => {
    setSiteData(prev => ({ ...prev, serviceRequests: (prev.serviceRequests || []).map(r => r.id === id ? { ...r, ...data } : r) }));
    if (isSupabaseConfigured() && supabase) {
      const current = siteData.serviceRequests?.find(r => r.id === id);
      await supabase.from('service_requests').upsert({ id, data: { ...current, ...data } });
    }
  };

  const deleteRequest = async (id: string): Promise<void> => {
    setSiteData(prev => ({ ...prev, serviceRequests: (prev.serviceRequests || []).filter(r => r.id !== id) }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('service_requests').delete().eq('id', id);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'date'>): Promise<void> => {
    const newExpense: Expense = {
      ...expense,
      id: 'exp-' + Date.now(),
      date: new Date().toISOString()
    };
    setSiteData(prev => ({ ...prev, expenses: [newExpense, ...(prev.expenses || [])] }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('expenses').insert([{ id: newExpense.id, data: newExpense }]);
    }
  };

  const updateExpense = async (id: string, data: Partial<Expense>): Promise<void> => {
    setSiteData(prev => ({ ...prev, expenses: (prev.expenses || []).map(e => e.id === id ? { ...e, ...data } : e) }));
    if (isSupabaseConfigured() && supabase) {
      const current = siteData.expenses?.find(e => e.id === id);
      await supabase.from('expenses').upsert({ id, data: { ...current, ...data } });
    }
  };

  const deleteExpense = async (id: string): Promise<void> => {
    setSiteData(prev => ({ ...prev, expenses: (prev.expenses || []).filter(e => e.id !== id) }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('expenses').delete().eq('id', id);
    }
  };

  const addSocialPost = async (post: Omit<SocialPost, 'id' | 'status'>): Promise<void> => {
    const newPost: SocialPost = {
      ...post,
      id: 'post-' + Date.now(),
      status: 'scheduled'
    };
    setSiteData(prev => ({ ...prev, socialPosts: [newPost, ...(prev.socialPosts || [])] }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('social_posts').insert([{ id: newPost.id, data: newPost }]);
    }
  };

  const deleteSocialPost = async (id: string): Promise<void> => {
    setSiteData(prev => ({ ...prev, socialPosts: (prev.socialPosts || []).filter(p => p.id !== id) }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('social_posts').delete().eq('id', id);
    }
  };

  const updateIntegration = async (id: string, data: Partial<SocialIntegration>): Promise<void> => {
    setSiteData(prev => ({ ...prev, integrations: (prev.integrations || []).map(i => i.id === id ? { ...i, ...data } : i) }));
    if (isSupabaseConfigured() && supabase) {
      const current = siteData.integrations?.find(i => i.id === id);
      await supabase.from('integrations').upsert({ id, data: { ...current, ...data } });
    }
  };

  const addDecisionPage = async (page: Omit<DecisionPage, 'id' | 'date'>): Promise<void> => {
    const newPage: DecisionPage = {
      ...page,
      id: 'dp-' + Date.now(),
      date: new Date().toISOString()
    } as DecisionPage;
    setSiteData(prev => ({ ...prev, decisionPages: [newPage, ...(prev.decisionPages || [])] }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('decision_pages').insert([{ id: newPage.id, data: newPage }]);
    }
  };

  const updateDecisionPage = async (id: string, data: Partial<DecisionPage>): Promise<void> => {
    setSiteData(prev => ({ ...prev, decisionPages: (prev.decisionPages || []).map(p => p.id === id ? { ...p, ...data } : p) }));
    if (isSupabaseConfigured() && supabase) {
      const current = siteData.decisionPages?.find(p => p.id === id);
      await supabase.from('decision_pages').upsert({ id, data: { ...current, ...data } });
    }
  };

  const deleteDecisionPage = async (id: string): Promise<void> => {
    setSiteData(prev => ({ ...prev, decisionPages: (prev.decisionPages || []).filter(p => p.id !== id) }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('decision_pages').delete().eq('id', id);
    }
  };

  const syncArticlesToCloud = async () => {
    if (!isSupabaseConfigured() || !supabase) return;

    setSyncStatus({ total: ARTICLES.length, current: 0, errorCount: 0, isSyncing: true });
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < ARTICLES.length; i++) {
        const a = ARTICLES[i];
        try {
          const { error } = await supabase.from('articles').upsert({
            id: a.id,
            slug: a.slug,
            title: a.title,
            content: a.content,
            excerpt: a.excerpt,
            image: a.image,
            category: a.category,
            date: a.date,
            status: a.status,
            author: a.author || 'Noureddine Reffaa',
            views: a.views || 0,
            seo_score: a.seoScore || 85,
            keywords: a.keywords || []
          }, { onConflict: 'id' });

          if (error) throw error;
          successCount++;
        } catch (err) {
          errorCount++;
          Logger.error(`Sync failed for article: ${a.title}`, err);
        }

        setSyncStatus(prev => ({ ...prev, current: i + 1, errorCount }));
        // Brief delay to prevent hitting rate limits or causing spikes
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (errorCount === 0) {
        logActivity('تمت مزامنة كافة المقالات بنجاح', 'content', 'success');
      } else {
        logActivity(`اكتملت المزامنة مع وجود ${errorCount} أخطاء`, 'content', 'warning');
      }
    } catch (err: any) {
      logActivity('فشلت المزامنة الكلية', 'content', 'error');
    } finally {
      setTimeout(() => {
        setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      }, 2000); // Keep status visible for 2 seconds
    }
  };

  const resetToDefault = () => {
    if (window.confirm('سيتم حذف كافة البيانات والعودة للقالب الأصلي. هل أنت متأكد؟')) {
      localStorage.removeItem('nr_full_platform_data');
      window.location.reload();
    }
  };

  return (
    <DataContext.Provider value={{
      siteData, isLoading, updateSiteData, updateProfile, updateAIConfig,
      addClient, updateClient, deleteClient,
      addProject, updateProject, deleteProject,
      addInvoice, updateInvoice, deleteInvoice,
      addService, updateService, deleteService,
      addArticle, updateArticle, deleteArticle,
      addRequest, updateRequest, deleteRequest,
      addExpense, updateExpense, deleteExpense,
      addSocialPost, deleteSocialPost, updateIntegration,
      addDecisionPage, updateDecisionPage, deleteDecisionPage,
      logActivity,
      syncArticlesToCloud,
      syncStatus,
      resetToDefault
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
