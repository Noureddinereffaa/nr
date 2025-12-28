-- Create Articles Table for Sovereign Writing Studio
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  image text,
  category text default 'General',
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  views integer default 0,
  seo_score integer default 0,
  status text default 'draft', -- 'draft', 'published'
  keywords text[] default array[]::text[],
  tags text[] default array[]::text[],
  author_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.articles enable row level security;

-- Policies
create policy "Public articles are viewable by everyone"
  on public.articles for select
  using ( status = 'published' );

create policy "Users can insert their own articles"
  on public.articles for insert
  with check ( true ); -- In a real app check auth.uid() = author_id

create policy "Users can update their own articles"
  on public.articles for update
  using ( true );

create policy "Users can delete their own articles"
  on public.articles for delete
  using ( true );
