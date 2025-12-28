import React from 'react';

export interface WidgetProps {
    id: string;
    title: string;
    description?: string;
    config?: any;
}

export interface WidgetDefinition {
    id: string;
    type: string;
    component: React.LazyExoticComponent<React.FC<any>>;
    defaultProps: Partial<WidgetProps>;
    size: 'small' | 'medium' | 'large' | 'full';
}

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
    'revenue_stats': {
        id: 'revenue_stats',
        type: 'financial',
        component: React.lazy(() => import('./RevenueWidget.tsx')),
        defaultProps: { title: 'مؤشرات العائد' },
        size: 'medium'
    },
    'active_projects': {
        id: 'active_projects',
        type: 'operations',
        component: React.lazy(() => import('./ProjectsWidget.tsx')),
        defaultProps: { title: 'المشاريع النشطة' },
        size: 'large'
    },
    'ai_insights': {
        id: 'ai_insights',
        type: 'intelligence',
        component: React.lazy(() => import('./AIInsightsWidget.tsx')),
        defaultProps: { title: 'تحليلات الذكاء الاصطناعي' },
        size: 'medium'
    },
    'quick_actions': {
        id: 'quick_actions',
        type: 'system',
        component: React.lazy(() => import('./QuickActionsWidget.tsx')),
        defaultProps: { title: 'أوامر سريعة' },
        size: 'small'
    }
};
