import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSystem } from './SystemContext';


interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface UIContextType {
    // ... existing
    isClientModalOpen: boolean;
    openClientModal: () => void;
    closeClientModal: () => void;

    isInvoiceModalOpen: boolean;
    openInvoiceModal: () => void;
    closeInvoiceModal: () => void;

    isProjectModalOpen: boolean;
    openProjectModal: () => void;
    closeProjectModal: () => void;

    isChatOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;

    isRequestModalOpen: boolean;
    openRequestModal: () => void;
    closeRequestModal: () => void;

    isArticleModalOpen: boolean;
    openArticleModal: () => void;
    closeArticleModal: () => void;

    isCommandPaletteOpen: boolean;
    openCommandPalette: () => void;
    closeCommandPalette: () => void;
    toggleCommandPalette: () => void;

    isShieldMode: boolean;
    toggleShieldMode: () => void;

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
}

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // ... existing states
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
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

    // Apply theme on mount and when config changes
    React.useEffect(() => {
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

    // Apply high contrast on mount
    React.useEffect(() => {
        if (isHighContrast) {
            document.documentElement.setAttribute('data-theme', 'high-contrast');
        }
    }, []);

    return (
        <UIContext.Provider value={{
            isClientModalOpen,
            openClientModal: () => setIsClientModalOpen(true),
            closeClientModal: () => setIsClientModalOpen(false),

            isInvoiceModalOpen,
            openInvoiceModal: () => setIsInvoiceModalOpen(true),
            closeInvoiceModal: () => setIsInvoiceModalOpen(false),

            isProjectModalOpen,
            openProjectModal: () => setIsProjectModalOpen(true),
            closeProjectModal: () => setIsProjectModalOpen(false),

            isRequestModalOpen,
            openRequestModal: () => setIsRequestModalOpen(true),
            closeRequestModal: () => setIsRequestModalOpen(false),

            isArticleModalOpen,
            openArticleModal: () => setIsArticleModalOpen(true),
            closeArticleModal: () => setIsArticleModalOpen(false),

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

            toasts,
            addToast,
            removeToast,
            isHighContrast,
            toggleHighContrast,
            themeConfig,
            updateTheme
        }}>
            {children}
            {/* Toast Container */}
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
