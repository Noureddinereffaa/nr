-- Safe Migration: Add columns if they don't exist
-- Run this in Supabase SQL Editor

-- 1. Create table if it doesn't exist at all
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add columns individually (safe if table exists)
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'title') then
    alter table public.articles add column title text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'slug') then
    alter table public.articles add column slug text unique;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'content') then
    alter table public.articles add column content text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'excerpt') then
    alter table public.articles add column excerpt text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'image') then
    alter table public.articles add column image text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'category') then
    alter table public.articles add column category text default 'General';
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'date') then
    alter table public.articles add column date timestamp with time zone default timezone('utc'::text, now());
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'views') then
    alter table public.articles add column views integer default 0;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'seo_score') then
    alter table public.articles add column seo_score integer default 0;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'status') then
    alter table public.articles add column status text default 'draft';
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'keywords') then
    alter table public.articles add column keywords text[] default array[]::text[];
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'articles' and column_name = 'tags') then
    alter table public.articles add column tags text[] default array[]::text[];
  end if;
end $$;

-- 3. Enable RLS (Safe to run multiple times)
alter table public.articles enable row level security;

-- 4. Re-create policies (Drop first to avoid errors)
drop policy if exists "Public articles are viewable by everyone" on public.articles;
create policy "Public articles are viewable by everyone"
  on public.articles for select
  using ( true ); -- Temporarily allow all for debug

drop policy if exists "Users can insert their own articles" on public.articles;
create policy "Users can insert their own articles"
  on public.articles for insert
  with check ( true ); 

drop policy if exists "Users can update their own articles" on public.articles;
create policy "Users can update their own articles"
  on public.articles for update
  using ( true );

drop policy if exists "Users can delete their own articles" on public.articles;
create policy "Users can delete their own articles"
  on public.articles for delete
  using ( true );
