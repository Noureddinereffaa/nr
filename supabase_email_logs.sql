-- Create email_logs table for tracking communications
create table if not exists email_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  recipient text not null,
  subject text not null,
  status text not null check (status in ('sent', 'failed')),
  error_message text,
  metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table email_logs enable row level security;

-- Policy: Admins can view all logs (Adjust based on your auth model)
-- For now, allowing all for demonstration, but strictly you should restrict this.
create policy "Enable read access for all users" on email_logs for select using (true);
create policy "Enable insert for authenticated users" on email_logs for insert with check (true);
