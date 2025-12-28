-- Enable UUID extension (optional, if we want to switch to UUIDs later)
create extension if not exists "uuid-ossp";

-- 1. Clients Table
create table public.clients (
  id text primary key,
  name text not null,
  email text,
  phone text,
  company text,
  address text,
  status text not null default 'lead', -- 'lead', 'negotiation', 'active', 'completed', 'lost'
  value numeric default 0,
  tags text[] default '{}',
  "lastContact" text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Projects Table
create table public.projects (
  id text primary key,
  title text not null,
  category text,
  image text,
  status text default 'completed', -- 'planning', 'in-progress', 'completed', 'archived'
  featured boolean default false,
  gallery text[] default '{}',
  tags text[] default '{}',
  links jsonb default '{}', -- { demo, github, design }
  "caseStudy" jsonb default '{}', -- { problem, solution, result }
  stats text,
  "fullDescription" text,
  client text,
  date text,
  technologies text[] default '{}',
  challenges text,
  solutions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Invoices Table
create table public.invoices (
  id text primary key,
  "invoiceNumber" text not null,
  date text not null,
  "dueDate" text not null,
  "clientId" text,
  "clientName" text,
  "clientAddress" text,
  items jsonb default '[]', -- Array of { description, quantity, unitPrice, total }
  subtotal numeric default 0,
  discount numeric default 0,
  total numeric default 0,
  status text default 'draft', -- 'draft', 'pending', 'paid', 'overdue', 'cancelled'
  "payments" jsonb default '[]', -- Array of Payment objects
  "legalInfo" jsonb default '{}',
  "currency" text default 'DZD', -- 'DZD', 'EUR', 'USD'
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Services Table
create table public.services (
  id text primary key,
  code text,
  title text not null,
  description text,
  icon text,
  price numeric default 0,
  "priceLabel" text,
  features text[] default '{}',
  deliverables text[] default '{}',
  duration text,
  popular boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Service Requests (Leads) Table
create table public."serviceRequests" (
  id text primary key,
  "serviceId" text,
  "serviceTitle" text,
  "clientName" text not null,
  "clientPhone" text,
  "clientEmail" text,
  company text,
  "projectDetails" text,
  priority text default 'medium',
  budget text,
  timeline text,
  status text default 'new', -- 'new', 'review', 'proposal', 'negotiation', 'accepted', 'rejected', 'completed'
  date text,
  messages jsonb default '[]', -- Array of message history
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Articles (Blog) Table
create table public.articles (
  id text primary key,
  slug text unique,
  title text not null,
  content text,
  excerpt text,
  image text,
  category text,
  tags text[] default '{}',
  keywords text[] default '{}',
  author text,
  date text,
  status text default 'draft',
  "publishDate" text,
  "readTime" text,
  seo jsonb default '{}',
  "seoScore" numeric,
  "seoAnalysis" jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Content Plan Table
create table public."contentPlan" (
  id text primary key,
  topic text not null,
  status text default 'planned',
  "scheduledDate" text,
  "suggestedKeywords" text[] default '{}',
  "articleId" text,
  phase text, -- 'awareness', 'consideration', 'decision', 'action'
  week integer,
  intent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security) on all tables (Standard security practice)
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.invoices enable row level security;
alter table public.services enable row level security;
alter table public."serviceRequests" enable row level security;
alter table public.articles enable row level security;
alter table public."contentPlan" enable row level security;

-- Create simple policy to allow public read/write (FOR DEVELOPMENT ONLY)
-- Warning: In production, you must restrict this!
create policy "Enable all access for all users" on public.clients for all using (true) with check (true);
create policy "Enable all access for all users" on public.projects for all using (true) with check (true);
create policy "Enable all access for all users" on public.invoices for all using (true) with check (true);
create policy "Enable all access for all users" on public.services for all using (true) with check (true);
create policy "Enable all access for all users" on public."serviceRequests" for all using (true) with check (true);
create policy "Enable all access for all users" on public.articles for all using (true) with check (true);
create policy "Enable all access for all users" on public."contentPlan" for all using (true) with check (true);
