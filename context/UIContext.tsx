import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSystem } from './SystemContext';
import { useModals } from '../lib/hooks/useModals';
import { notificationService } from '../lib/services/notificationService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface SystemNotification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
}

interface UIContextType {
    // Modal state from useModals
    isClientModalOpen: boolean;
    openClientModal: () => void;
    closeClientModal: () => void;
    isInvoiceModalOpen: boolean;
    openInvoiceModal: () => void;
    closeInvoiceModal: () => void;
    isProjectModalOpen: boolean;
    openProjectModal: () => void;
    closeProjectModal: () => void;
    isRequestModalOpen: boolean;
    openRequestModal: () => void;
    closeRequestModal: () => void;
    isArticleModalOpen: boolean;
    openArticleModal: () => void;
    closeArticleModal: () => void;
    isExpenseModalOpen: boolean;
    openExpenseModal: () => void;
    closeExpenseModal: () => void;
    isServiceModalOpen: boolean;
    openServiceModal: () => void;
    closeServiceModal: () => void;

    // Local UI states
    isChatOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;

    isCommandPaletteOpen: boolean;
    openCommandPalette: () => void;
    closeCommandPalette: () => void;
    toggleCommandPalette: () => void;

    isShieldMode: boolean;
    toggleShieldMode: () => void;
    mask: (text: string, type?: 'email' | 'phone' | 'currency' | 'text') => string;

    // Toast System
    toasts: Toast[];
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    removeToast: (id: string) => void;

    // Theme System
    isHighContrast: boolean;
    toggleHighContrast: () => void;
    themeConfig: {
        accentColor: string;
        borderRadius: string;
        glassOpacity: number;
        fontFamily: string;
    };
    updateTheme: (config: Partial<UIContextType['themeConfig']>) => void;

    // Notification System
    notifications: SystemNotification[];
    addNotification: (notif: Omit<SystemNotification, 'id' | 'time' | 'read'>) => void;
    markNotificationAsRead: (id: string) => void;
    clearNotifications: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const modals = useModals();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isShieldMode, setIsShieldMode] = useState(() => localStorage.getItem('nr_shield_mode') === 'true');

    // Toast State
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Notification State
    const [notifications, setNotifications] = useState<SystemNotification[]>([]);

    useEffect(() => {
        const fetchInitialNotifications = async () => {
            try {
                const data = await notificationService.getAll();
                setNotifications(data);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };

        if (isSupabaseConfigured()) {
            fetchInitialNotifications();

            // Setup Real-time listener for new notifications
            const channel = supabase
                ?.channel('system-notifications-realtime')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'notifications' },
                    async (payload: any) => {
                        console.log('Notification channel update:', payload);
                        const freshData = await notificationService.getAll();
                        setNotifications(freshData);
                    }
                )
                .subscribe();

            return () => {
                if (channel) supabase?.removeChannel(channel);
            };
        }
    }, []);

    const addNotification = async (notif: Omit<SystemNotification, 'id' | 'time' | 'read'>) => {
        try {
            await notificationService.create(notif);
            // State will update via real-time listener or manual refetch if channel is slow
        } catch (err) {
            console.error('Failed to create notification:', err);
            // Fallback to local state if DB fails
            const newNotif: SystemNotification = {
                ...notif,
                id: Math.random().toString(36).substr(2, 9),
                time: new Date().toISOString(),
                read: false
            };
            setNotifications(prev => [newNotif, ...prev].slice(0, 50));
        }
    };

    const markNotificationAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const clearNotifications = async () => {
        if (!window.confirm('هل أنت متأكد من مسح جميع الإشعارات؟')) return;
        try {
            await notificationService.clearAll();
            setNotifications([]);
        } catch (err) {
            console.error('Failed to clear notifications:', err);
        }
    };

    // Helper for RGB conversion (for transparency support)
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '99, 102, 241';
    };

    // Theme Management
    const [isHighContrast, setIsHighContrast] = useState(() => localStorage.getItem('nr_high_contrast') === 'true');
    const [themeConfig, setThemeConfig] = useState(() => {
        const saved = localStorage.getItem('nr_theme_config');
        return saved ? JSON.parse(saved) : {
            accentColor: '#6366f1',
            borderRadius: '1.5rem',
            glassOpacity: 0.4,
            fontFamily: 'Inter'
        };
    });

    const { siteData } = useSystem() as any;

    // Sync themeConfig with siteData.brand whenever it changes
    useEffect(() => {
        if (siteData.brand) {
            const brand = siteData.brand as any;
            const newConfig: any = {};
            if (brand.primaryColor && brand.primaryColor !== themeConfig.accentColor) {
                newConfig.accentColor = brand.primaryColor;
            }
            if (brand.borderRadius && brand.borderRadius !== themeConfig.borderRadius) {
                newConfig.borderRadius = brand.borderRadius;
            }
            if (brand.glassOpacity && brand.glassOpacity !== themeConfig.glassOpacity) {
                newConfig.glassOpacity = brand.glassOpacity;
            }
            if (brand.fontFamily && brand.fontFamily !== themeConfig.fontFamily) {
                newConfig.fontFamily = brand.fontFamily;
            }

            if (Object.keys(newConfig).length > 0) {
                setThemeConfig(prev => ({ ...prev, ...newConfig }));
            }
        }
    }, [siteData.brand]);

    // Listen for global system activities to trigger notifications
    useEffect(() => {
        const handleActivity = (e: any) => {
            const activity = e.detail;
            if (activity) {
                addNotification({
                    title: activity.label,
                    message: activity.metadata?.message || 'تم تحديث حالة النظام بنجاح',
                    type: activity.status === 'success' ? 'success' :
                        activity.status === 'error' ? 'error' :
                            activity.status === 'warning' ? 'warning' : 'info'
                });

                if (activity.status === 'success' || activity.status === 'error') {
                    addToast(activity.label, activity.status);
                }
            }
        };

        window.addEventListener('system-activity', handleActivity);
        return () => window.removeEventListener('system-activity', handleActivity);
    }, []);

    // Apply theme on mount and when config changes
    useEffect(() => {
        if (themeConfig.accentColor) {
            document.documentElement.style.setProperty('--accent-indigo', themeConfig.accentColor);
            document.documentElement.style.setProperty('--accent-indigo-rgb', hexToRgb(themeConfig.accentColor));
        }
        if (themeConfig.borderRadius) document.documentElement.style.setProperty('--border-radius-elite', themeConfig.borderRadius);
        if (themeConfig.glassOpacity !== undefined) document.documentElement.style.setProperty('--glass-opacity', themeConfig.glassOpacity.toString());
        if (themeConfig.fontFamily) document.documentElement.style.setProperty('--font-main', themeConfig.fontFamily);

        localStorage.setItem('nr_theme_config', JSON.stringify(themeConfig));
    }, [themeConfig]);

    const updateTheme = (newConfig: Partial<typeof themeConfig>) => {
        setThemeConfig(prev => ({ ...prev, ...newConfig }));
    };

    const toggleShieldMode = () => {
        setIsShieldMode(prev => {
            const next = !prev;
            localStorage.setItem('nr_shield_mode', String(next));
            return next;
        });
    };

    const mask = (text: string, type: 'email' | 'phone' | 'currency' | 'text' = 'text'): string => {
        if (!isShieldMode || !text) return text;

        switch (type) {
            case 'email':
                const [user, domain] = text.split('@');
                if (!domain) return '***@***.***';
                return `${user.substring(0, 2)}***@${domain}`;
            case 'phone':
                return text.replace(/(\d{3})\d+(\d{2})/, '$1-XXXX-$2');
            case 'currency':
                return '***.**';
            default:
                if (text.length <= 4) return '****';
                return text.substring(0, 4) + '...';
        }
    };

    const toggleHighContrast = () => {
        setIsHighContrast(prev => {
            const next = !prev;
            if (next) {
                document.documentElement.setAttribute('data-theme', 'high-contrast');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            localStorage.setItem('nr_high_contrast', String(next));
            return next;
        });
    };

    useEffect(() => {
        if (isHighContrast) {
            document.documentElement.setAttribute('data-theme', 'high-contrast');
        }
    }, [isHighContrast]);

    return (
        <UIContext.Provider value={{
            ...modals,
            isChatOpen,
            openChat: () => setIsChatOpen(true),
            closeChat: () => setIsChatOpen(false),
            toggleChat: () => setIsChatOpen(prev => !prev),

            isCommandPaletteOpen,
            openCommandPalette: () => setIsCommandPaletteOpen(true),
            closeCommandPalette: () => setIsCommandPaletteOpen(false),
            toggleCommandPalette: () => setIsCommandPaletteOpen(prev => !prev),

            isShieldMode,
            toggleShieldMode,
            mask,

            toasts,
            addToast,
            removeToast,
            isHighContrast,
            toggleHighContrast,
            themeConfig,
            updateTheme,
            notifications,
            addNotification,
            markNotificationAsRead,
            clearNotifications
        }}>
            {children}
            <div className="fixed bottom-4 left-4 z-[100] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-bold flex items-center gap-3 min-w-[300px] animate-in slide-in-from-left
                            ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-slate-800'}
                        `}
                        role="alert"
                    >
                        <span>{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="mr-auto opacity-50 hover:opacity-100">✕</button>
                    </div>
                ))}
            </div>
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
