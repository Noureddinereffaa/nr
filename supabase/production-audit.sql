-- =====================================================
-- NR-OS PRODUCTION READINESS AUDIT SCRIPT
-- =====================================================
-- This script verifies the existence of all modern tables 
-- and suggests performance optimizations for the production system.

-- 1. Table Existence Check
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'clients', 
    'projects', 
    'invoices', 
    'service_requests', 
    'articles', 
    'content_plan',
    'expenses',
    'social_posts',
    'site_settings',
    'email_logs',
    'notifications'
);

-- 2. Index Integrity Check (Recommended for Performance)
-- These ensure fast lookups on secondary keys and JSON blobs.

-- For projects (if using JSONB data blob)
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
-- CREATE INDEX IF NOT EXISTS idx_projects_data_email ON public.projects ((data->>'clientEmail')); -- High performance email lookup

-- For service_requests (Adding GIN indexes if not already there)
CREATE INDEX IF NOT EXISTS idx_service_requests_client_email ON public.service_requests(client_email);
CREATE INDEX IF NOT EXISTS idx_service_requests_project_id ON public.service_requests(project_id);

-- 3. RLS Status Check (Ensure all sensitive tables have RLS enabled)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('clients', 'projects', 'invoices', 'service_requests', 'email_logs');

-- 4. Integration Verification
-- Check if the mandatory 'main' setting exists in site_settings
SELECT count(*) as site_config_exists FROM public.site_settings WHERE id = 'main';

-- =====================================================
-- END OF AUDIT SCRIPT
-- =====================================================
