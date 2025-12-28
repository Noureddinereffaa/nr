-- 8. Integrations Table (Phase 27)
create table if not exists public.integrations (
  id text primary key,
  provider text not null, -- 'google_business', 'linkedin', 'twitter', 'facebook', 'instagram'
  name text,
  icon text,
  status text default 'disconnected', -- 'connected', 'disconnected', 'error'
  credentials jsonb default '{}', -- Encrypted storage for API keys/Tokens
  metrics jsonb default '{}', -- { followers, engagementRate, lastSync }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.integrations enable row level security;

-- Policy (Dev)
create policy "Enable all access for all users" on public.integrations for all using (true) with check (true);
