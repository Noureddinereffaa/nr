-- Create decision_pages table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.decision_pages (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.decision_pages ENABLE ROW LEVEL SECURITY;

-- Create Policy to allow all operations (for development)
-- In production, you should restrict this to authenticated users or admins
DROP POLICY IF EXISTS "Allow all for decision_pages" ON public.decision_pages;
CREATE POLICY "Allow all for decision_pages" ON public.decision_pages FOR ALL USING (true) WITH CHECK (true);

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
