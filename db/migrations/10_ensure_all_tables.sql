-- Comprehensive Schema Check & Creation
-- Run this in Supabase SQL Editor to ensure all tables exist for the full dashboard.

-- 1. Decision Pages (Review Pages)
CREATE TABLE IF NOT EXISTS public.decision_pages (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activity Log
CREATE TABLE IF NOT EXISTS public.activity_log (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Site Settings (Singleton table for global config)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    brand JSONB DEFAULT '{}',
    "contactInfo" JSONB DEFAULT '{}',
    "aiConfig" JSONB DEFAULT '{}',
    features JSONB DEFAULT '{}',
    faqs JSONB DEFAULT '[]',
    testimonials JSONB DEFAULT '[]',
    process JSONB DEFAULT '[]',
    stats JSONB DEFAULT '[]',
    profile JSONB DEFAULT '{}',
    autopilot JSONB DEFAULT '{}',
    "contentPlan" JSONB DEFAULT '[]',
    "dashboardLayout" JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS on new tables
ALTER TABLE public.decision_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Development: Allow All)
-- Decision Pages
DROP POLICY IF EXISTS "Allow all for decision_pages" ON public.decision_pages;
CREATE POLICY "Allow all for decision_pages" ON public.decision_pages FOR ALL USING (true) WITH CHECK (true);

-- Activity Log
DROP POLICY IF EXISTS "Allow all for activity_log" ON public.activity_log;
CREATE POLICY "Allow all for activity_log" ON public.activity_log FOR ALL USING (true) WITH CHECK (true);

-- Site Settings
DROP POLICY IF EXISTS "Allow all for site_settings" ON public.site_settings;
CREATE POLICY "Allow all for site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- 6. Refresh Schema Cache
NOTIFY pgrst, 'reload schema';
