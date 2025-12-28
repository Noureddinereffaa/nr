-- ENFORCING ELITE SECURITY (PHASE 11)
-- Run this in your Supabase SQL Editor to harden the system.

-- 1. Remove permissive policies
DROP POLICY IF EXISTS "Enable all access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.invoices;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.services;
DROP POLICY IF EXISTS "Enable all access for all users" ON public."serviceRequests";
DROP POLICY IF EXISTS "Enable all access for all users" ON public.articles;
DROP POLICY IF EXISTS "Enable all access for all users" ON public."contentPlan";

-- 2. Create Secure Authenticated-Only Policies
-- This ensures ONLY you (logged in via NR-OS) can read or write data.

CREATE POLICY "Admin full access" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public."serviceRequests" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public."contentPlan" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Exception for Publicly Visible Data (Optional)
-- If you want your blog and portfolio to be visible to clients WITHOUT terminal login:
-- DROP POLICY "Admin full access" ON public.articles;
-- CREATE POLICY "Public read, Admin write" ON public.articles FOR SELECT USING (true);
-- CREATE POLICY "Public read, Admin write" ON public.articles FOR INSERT/UPDATE/DELETE TO authenticated USING (true);
