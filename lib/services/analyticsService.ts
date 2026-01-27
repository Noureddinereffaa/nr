import { supabase, isSupabaseConfigured } from '../supabase';

export interface AnalyticsStats {
    visits: {
        total: number;
        growth: number;
    };
    revenue: {
        total: number;
        growth: number;
    };
    expenses: {
        total: number;
        growth: number;
    };
    conversions: {
        total: number;
        growth: number;
    };
}

export const analyticsService = {
    async trackVisit(page: string): Promise<void> {
        if (!isSupabaseConfigured() || !supabase) return;

        // Basic anonymous tracking
        const visitData = {
            page,
            referrer: document.referrer || 'direct',
            device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            browser: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        try {
            await supabase.from('site_visits').insert([{
                page,
                referrer: visitData.referrer,
                device: visitData.device,
                browser: visitData.browser,
                data: visitData
            }]);
        } catch (error) {
            console.error('Failed to track visit:', error);
        }
    },

    async getDashboardStats(): Promise<AnalyticsStats> {
        if (!isSupabaseConfigured() || !supabase) {
            return this.getMockStats();
        }

        try {
            const now = new Date();
            const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

            // 1. Fetch Invoices for Revenue stats
            const { data: invoices } = await supabase
                .from('invoices')
                .select('total, created_at, status');

            // 2. Fetch Expenses
            const { data: expenses } = await supabase
                .from('expenses')
                .select('*');

            // 3. Fetch Visits
            const { data: visits } = await supabase
                .from('site_visits')
                .select('created_at');

            // Aggregation logic
            const currentMonthRevenue = (invoices || [])
                .filter(i => i.status === 'paid' && i.created_at >= firstDayCurrentMonth)
                .reduce((sum, i) => sum + (i.total || 0), 0);

            const lastMonthRevenue = (invoices || [])
                .filter(i => i.status === 'paid' && i.created_at >= firstDayLastMonth && i.created_at < firstDayCurrentMonth)
                .reduce((sum, i) => sum + (i.total || 0), 0);

            const currentMonthVisits = (visits || [])
                .filter(v => v.created_at >= firstDayCurrentMonth).length;

            const lastMonthVisits = (visits || [])
                .filter(v => v.created_at >= firstDayLastMonth && v.created_at < firstDayCurrentMonth).length;

            return {
                visits: {
                    total: (visits || []).length,
                    growth: this.calculateGrowth(currentMonthVisits, lastMonthVisits)
                },
                revenue: {
                    total: (invoices || []).filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0),
                    growth: this.calculateGrowth(currentMonthRevenue, lastMonthRevenue)
                },
                expenses: {
                    total: (expenses || []).reduce((sum, e) => sum + (e.data?.amount || 0), 0),
                    growth: 0 // Simplification for now
                },
                conversions: {
                    total: Math.floor((visits || []).length * 0.05), // Mock conversion rate for now
                    growth: 12.5
                }
            };
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            return this.getMockStats();
        }
    },

    calculateGrowth(current: number, previous: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Number(((current - previous) / previous * 100).toFixed(1));
    },

    getMockStats(): AnalyticsStats {
        return {
            visits: { total: 0, growth: 0 },
            revenue: { total: 0, growth: 0 },
            expenses: { total: 0, growth: 0 },
            conversions: { total: 0, growth: 0 }
        };
    }
};
