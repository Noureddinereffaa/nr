-- ============================================
-- NR-OS COMPLETE CLOUD SYNC MIGRATION V2
-- Run this in Supabase SQL Editor
-- ============================================
-- NOTE: This uses FLEXIBLE JSONB storage for complex data

-- Drop existing tables to ensure clean schema
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS integrations CASCADE;

-- 1. SITE SETTINGS (All config as JSONB)
CREATE TABLE site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    brand JSONB DEFAULT '{}',
    "contactInfo" JSONB DEFAULT '{}',
    "aiConfig" JSONB DEFAULT '{}',
    features JSONB DEFAULT '{}',
    autopilot JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SERVICES TABLE (Flexible JSONB)
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PROJECTS TABLE (Flexible JSONB)
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ARTICLES TABLE (Flexible JSONB)
CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CLIENTS TABLE (Flexible JSONB)
CREATE TABLE clients (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INVOICES TABLE (Flexible JSONB)
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. INTEGRATIONS TABLE (Flexible JSONB)
CREATE TABLE integrations (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Development Mode
-- ============================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Allow all operations for development
CREATE POLICY "Allow all for site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for articles" ON articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for integrations" ON integrations FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- IMPORTANT: Refresh PostgREST Schema Cache
-- ============================================
-- This command tells Supabase to reload the schema
NOTIFY pgrst, 'reload schema';

-- ============================================
-- SUCCESS! All tables created with JSONB.
-- Run the NOTIFY command if sync still fails.
-- ============================================

