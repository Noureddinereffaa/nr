import React, { createContext, useContext, useState, useEffect } from 'react';
import { NOUREDDINE_DATA } from '../constants';
import { SiteData, SystemActivity, AIConfig, BrandIdentity, ContactInfo } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Logger from '../lib/logger';

interface SystemContextType {
    brand: BrandIdentity;
    contactInfo: ContactInfo;
    aiConfig: AIConfig;
    activityLog: SystemActivity[];
    isLoading: boolean;
    updateBrand: (brand: Partial<BrandIdentity>) => Promise<void>;
    updateContact: (contact: Partial<ContactInfo>) => Promise<void>;
    updateAIConfig: (config: Partial<AIConfig>) => Promise<void>;
    faqs: any[];
    process: any[];
    siteTexts: any;
    updateSiteData: (data: Partial<SiteData>) => Promise<void>;
    logActivity: (label: string, type: string, status?: string, metadata?: any) => Promise<void>;
}

const SystemContext = createContext<SystemContextType | null>(null);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [brand, setBrand] = useState<BrandIdentity>({
        siteName: 'Noureddine Reffaa',
        logo: '/logo.png',
        primaryColor: '#4f46e5',
        darkMode: true,
        slogan: 'Building Digital Empires',
        fontFamily: 'Inter',
        borderRadius: '1.5rem',
        glassOpacity: '0.1',
        templateId: 'premium-glass'
    });
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        phone: '+213 555 000 000',
        whatsapp: 'https://wa.me/213555000000',
        email: 'contact@reffaa.com',
        address: 'باتنة، الجزائر',
        socials: { linkedin: '', facebook: '' }
    });
    const [aiConfig, setAiConfig] = useState<AIConfig>({
        field: "إدارة المشاريع الرقمية والأتمتة",
        mission: "تحويل الشركات التقليدية إلى كيانات رقمية ذكية تدر أرباحاً آلياً.",
        tone: "professional",
        painPoints: "",
        sellingPoints: "",
        ctaAction: "",
        preferredProvider: "gemini"
    });
    const [siteData, setSiteData] = useState<SiteData>({
        navigation: [],
        sections: [],
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
            socials: { linkedin: '', facebook: '' }
        },
        services: [],
        projects: [],
        testimonials: [],
        clients: [],
        invoices: [],
        articles: [],
        aiConfig: {
            field: "إدارة المشاريع الرقمية والأتمتة",
            mission: "تحويل الشركات التقليدية إلى كيانات رقمية ذكية تدر أرباحاً آلياً.",
            tone: "professional",
            painPoints: "",
            sellingPoints: "",
            ctaAction: "",
            preferredProvider: "gemini"
        },
        features: {
            contentManager: true,
            aiBrain: true
        },
        faqs: [],
        process: [],
        siteTexts: {}
    });
    const [activityLog, setActivityLog] = useState<SystemActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSystemData = async () => {
            if (!isSupabaseConfigured() || !supabase) {
                setIsLoading(false);
                return;
            }

            try {
                const [settingsRes, activityRes] = await Promise.all([
                    supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle(),
                    supabase.from('activity_log').select('*').order('date', { ascending: false }).limit(50)
                ]);

                if (settingsRes.data) {
                    const s = settingsRes.data;
                    if (s.brand) setBrand(prev => ({ ...prev, ...s.brand }));
                    if (s.contactInfo) setContactInfo(prev => ({ ...prev, ...s.contactInfo }));
                    if (s.aiConfig) setAiConfig(prev => ({ ...prev, ...s.aiConfig }));
                    setSiteData(prev => ({
                        ...prev,
                        faqs: s.faqs || prev.faqs,
                        process: s.process || prev.process,
                        siteTexts: s.siteTexts || prev.siteTexts
                    }));
                }

                if (activityRes.data) {
                    setActivityLog(activityRes.data.map((r: any) => ({ ...r, ...(r.data || {}) })));
                }
            } catch (error) {
                Logger.error("System Sync Error", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSystemData();
    }, []);

    const updateBrand = async (updates: Partial<BrandIdentity>) => {
        setBrand(prev => ({ ...prev, ...updates }));
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('site_settings').upsert({ id: 'main', brand: { ...brand, ...updates } });
        }
    };

    const updateContact = async (updates: Partial<ContactInfo>) => {
        setContactInfo(prev => ({ ...prev, ...updates }));
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('site_settings').upsert({ id: 'main', contactInfo: { ...contactInfo, ...updates } });
        }
    };

    const updateAIConfig = async (updates: Partial<AIConfig>) => {
        setAiConfig(prev => ({ ...prev, ...updates }));
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('site_settings').upsert({ id: 'main', aiConfig: { ...aiConfig, ...updates } });
        }
    };

    const updateSiteData = async (updates: Partial<SiteData>) => {
        setSiteData(prev => ({ ...prev, ...updates }));
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('site_settings').upsert({ id: 'main', ...siteData, ...updates });
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
        setActivityLog(prev => [newActivity, ...prev].slice(0, 50));
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('activity_log').insert([{ id: newActivity.id, data: newActivity }]);
        }
    };

    return (
        <SystemContext.Provider value={{
            brand, contactInfo, aiConfig, activityLog, isLoading,
            updateBrand, updateContact, updateAIConfig,
            faqs: siteData.faqs || [],
            process: siteData.process || [],
            siteTexts: (siteData as any).siteTexts || {},
            updateSiteData,
            logActivity
        }}>
            {children}
        </SystemContext.Provider>
    );
};

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (!context) throw new Error('useSystem must be used within a SystemProvider');
    return context;
};
