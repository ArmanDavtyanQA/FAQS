-- Contact requests table (support/contact form submissions)
-- One row per message; linked to the authenticated user.

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_requests_user_id_idx on public.contact_requests (user_id);
create index if not exists contact_requests_created_at_idx on public.contact_requests (created_at desc);

alter table public.contact_requests enable row level security;

-- Authenticated users can insert only their own rows
create policy "contact_requests_insert_own"
  on public.contact_requests for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Authenticated users can read only their own rows
create policy "contact_requests_select_own"
  on public.contact_requests for select
  to authenticated
  using (auth.uid() = user_id);

comment on table public.contact_requests is 'Contact form submissions from authenticated users';
