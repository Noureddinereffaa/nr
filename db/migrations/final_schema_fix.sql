-- ============================================
-- FINAL SCHEMA REPAIR SCRIPT
-- Run this in Supabase SQL Editor to fix 404s
-- ============================================

-- 1. Create missing 'snake_case' tables that the App v2 expects
-- They use the Flexible JSONB pattern (id, data, created_at)

CREATE TABLE IF NOT EXISTS public.expenses (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_posts (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.service_requests (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_plan (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS (Security)

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_plan ENABLE ROW LEVEL SECURITY;

-- 3. Create Permissive Policies (Dev Mode)
-- Re-runnable: Drop first to avoid errors

DROP POLICY IF EXISTS "Allow all for expenses" ON public.expenses;
CREATE POLICY "Allow all for expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for social_posts" ON public.social_posts;
CREATE POLICY "Allow all for social_posts" ON public.social_posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for service_requests" ON public.service_requests;
CREATE POLICY "Allow all for service_requests" ON public.service_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for content_plan" ON public.content_plan;
CREATE POLICY "Allow all for content_plan" ON public.content_plan FOR ALL USING (true) WITH CHECK (true);

-- 4. Refresh Schema Cache
NOTIFY pgrst, 'reload schema';
