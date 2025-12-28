-- Add missing columns to site_settings for comprehensive sync
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS process JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS "dashboardLayout" JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS profile JSONB DEFAULT '{}';

-- Refresh PostgREST cache
NOTIFY pgrst, 'reload schema';
