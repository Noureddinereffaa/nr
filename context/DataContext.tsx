import React, { createContext, useContext, useState, useEffect } from 'react';
import { NOUREDDINE_DATA, SERVICES, PROJECTS, TESTIMONIALS, FAQS, WORK_PROCESS, DEFAULT_STATS, ARTICLES } from '../constants';
import { SiteData, Client, Project, Invoice, Service, Article, ServiceRequest, Expense, SocialPost, SocialIntegration, ContentPlanItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Logger from '../lib/logger';

interface DataContextType {
  siteData: SiteData;
  isLoading: boolean;
  updateSiteData: (newData: Partial<SiteData>) => void;
  updateProfile: (newData: any) => void;
  updateAIConfig: (newAI: any) => void;

  // Client CRUD
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  // Project CRUD
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Invoice CRUD
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<void>;
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
      contentPlan: []
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
          features: { ...defaultData.features, ...(parsed.features || {}) }
        };
      } catch (e) {
        console.error("Failed to parse saved data", e);
        return defaultData;
      }
    }

    return defaultData;
  });

  const [isLoading, setIsLoading] = useState(true);

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
          contentPlanRes
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
          supabase.from('content_plan').select('*')
        ]);

        if (clientsRes.error && clientsRes.error.code === '42P01') {
          console.error("Supabase Error: Tables not initialized.");
          setIsLoading(false);
          return;
        }

        setSiteData(prev => {
          const cloudClients = extractJsonbData<Client>(clientsRes.data);
          const cloudProjects = extractJsonbData<Project>(projectsRes.data);
          const cloudServices = extractJsonbData<Service>(servicesRes.data);
          const cloudArticles = extractJsonbData<Article>(articlesRes.data);
          const cloudInvoices = extractJsonbData<Invoice>(invoicesRes.data);
          const cloudRequests = extractJsonbData<ServiceRequest>(requestsRes.data);
          const cloudExpenses = extractJsonbData<Expense>(expensesRes.data);
          const cloudSocialPosts = extractJsonbData<SocialPost>(socialPostsRes.data);
          const cloudIntegrations = extractJsonbData<SocialIntegration>(integrationsRes.data);
          const cloudContentPlan = extractJsonbData<ContentPlanItem>(contentPlanRes.data);

          const newClients = cloudClients.length > 0 ? cloudClients : prev.clients;
          const newProjects = cloudProjects.length > 0 ? cloudProjects : prev.projects;
          const newServices = cloudServices.length > 0 ? cloudServices : prev.services;
          const newArticles = cloudArticles.length > 0 ? cloudArticles : prev.articles;
          const newInvoices = cloudInvoices.length > 0 ? cloudInvoices : prev.invoices;
          const newRequests = cloudRequests.length > 0 ? cloudRequests : prev.serviceRequests || [];
          const newExpenses = cloudExpenses.length > 0 ? cloudExpenses : prev.expenses || [];
          const newSocialPosts = cloudSocialPosts.length > 0 ? cloudSocialPosts : prev.socialPosts || [];
          const newIntegrations = cloudIntegrations.length > 0 ? cloudIntegrations : prev.integrations || [];
          const newContentPlan = cloudContentPlan.length > 0 ? cloudContentPlan : prev.contentPlan || [];

          let newBrand = prev.brand;
          let newContactInfo = prev.contactInfo;
          let newAiConfig = prev.aiConfig;
          let newFeatures = prev.features;
          let newFaqs = prev.faqs;
          let newTestimonials = prev.testimonials;
          let newProcess = prev.process;
          let newStats = prev.stats;
          let newProfile = prev.profile;
          let newAutopilot = prev.autopilot;

          if (settingsRes.data) {
            newBrand = { ...prev.brand, ...(settingsRes.data.brand || {}) };
            newContactInfo = { ...prev.contactInfo, ...(settingsRes.data.contactInfo || {}) };
            newAiConfig = { ...prev.aiConfig, ...(settingsRes.data.aiConfig || {}) };
            newFeatures = { ...prev.features, ...(settingsRes.data.features || {}) };
            newFaqs = settingsRes.data.faqs || prev.faqs;
            newTestimonials = settingsRes.data.testimonials || prev.testimonials;
            newProcess = settingsRes.data.process || prev.process;
            newStats = settingsRes.data.stats || prev.stats;
            newProfile = { ...prev.profile, ...(settingsRes.data.profile || {}) };
            newAutopilot = { ...prev.autopilot, ...(settingsRes.data.autopilot || {}) };
          }

          return {
            ...prev,
            brand: newBrand,
            contactInfo: newContactInfo,
            aiConfig: newAiConfig,
            features: newFeatures,
            faqs: newFaqs,
            testimonials: newTestimonials,
            process: newProcess,
            stats: newStats,
            profile: newProfile,
            autopilot: newAutopilot,
            clients: newClients as Client[],
            projects: newProjects as Project[],
            services: newServices as Service[],
            articles: newArticles as Article[],
            invoices: newInvoices as Invoice[],
            serviceRequests: newRequests as ServiceRequest[],
            expenses: newExpenses as Expense[],
            socialPosts: newSocialPosts as SocialPost[],
            integrations: newIntegrations as SocialIntegration[],
            contentPlan: newContentPlan as ContentPlanItem[]
          };
        });

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
    const settingsKeys = ['brand', 'contactInfo', 'aiConfig', 'features', 'faqs', 'testimonials', 'process', 'stats', 'profile', 'autopilot', 'contentPlan'];
    const updatePayload: any = {};
    Object.keys(data).forEach(key => {
      if (settingsKeys.includes(key)) {
        updatePayload[key] = data[key as keyof SiteData];
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

  const addClient = async (client: Omit<Client, 'id'>): Promise<void> => {
    const newClient: Client = { ...client, id: 'c-' + Date.now() };
    setSiteData(prev => ({ ...prev, clients: [...(prev.clients || []), newClient] }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('clients').insert([{ id: newClient.id, data: newClient }]);
    }
  };

  const updateClient = async (id: string, data: Partial<Client>): Promise<void> => {
    setSiteData(prev => ({ ...prev, clients: prev.clients.map(c => c.id === id ? { ...c, ...data } : c) }));
    if (isSupabaseConfigured() && supabase) {
      const currentClient = siteData.clients.find(c => c.id === id);
      await supabase.from('clients').upsert({ id, data: { ...currentClient, ...data } });
    }
  };

  const deleteClient = async (id: string): Promise<void> => {
    setSiteData(prev => ({ ...prev, clients: prev.clients.filter(c => c.id !== id) }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('clients').delete().eq('id', id);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>): Promise<void> => {
    const newProject: Project = { ...project, id: 'p-' + Date.now() };
    setSiteData(prev => ({ ...prev, projects: [...(prev.projects || []), newProject] }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('projects').insert([{ id: newProject.id, data: newProject }]);
    }
  };

  const updateProject = async (id: string, data: Partial<Project>): Promise<void> => {
    setSiteData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, ...data } : p) }));
    if (isSupabaseConfigured() && supabase) {
      const oldProject = siteData.projects.find(p => p.id === id);
      await supabase.from('projects').upsert({ id, data: { ...oldProject, ...data } });
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    setSiteData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('projects').delete().eq('id', id);
    }
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<void> => {
    const newInvoice: Invoice = { ...invoice, id: 'inv-' + Date.now() };
    setSiteData(prev => ({ ...prev, invoices: [...(prev.invoices || []), newInvoice] }));
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('invoices').insert([{ id: newInvoice.id, data: newInvoice }]);
    }
  };

  const updateInvoice = async (id: string, data: Partial<Invoice>): Promise<void> => {
    setSiteData(prev => ({ ...prev, invoices: prev.invoices.map(i => i.id === id ? { ...i, ...data } : i) }));
    if (isSupabaseConfigured() && supabase) {
      const currentInvoice = siteData.invoices.find(i => i.id === id);
      await supabase.from('invoices').upsert({ id, data: { ...currentInvoice, ...data } });
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
    setSiteData(prev => ({ ...prev, articles: (prev.articles || []).filter(a => a.id !== id) }));
    if (isSupabaseConfigured() && supabase) {
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
