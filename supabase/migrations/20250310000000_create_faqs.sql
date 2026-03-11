-- FAQ table: one row per FAQ item (question + multiple answers)
-- Run in Supabase SQL Editor or via supabase db push

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  answers jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at in sync (optional but useful)
create or replace function public.set_faqs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists faqs_updated_at on public.faqs;
create trigger faqs_updated_at
  before update on public.faqs
  for each row execute function public.set_faqs_updated_at();

-- Indexes
create index if not exists faqs_user_id_idx on public.faqs (user_id);
create index if not exists faqs_user_id_status_idx on public.faqs (user_id, status);
create index if not exists faqs_status_idx on public.faqs (status) where status = 'published';

-- RLS
alter table public.faqs enable row level security;

-- Authenticated users can insert only their own rows
create policy "faqs_insert_own"
  on public.faqs for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update/delete only their own rows
create policy "faqs_update_own"
  on public.faqs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "faqs_delete_own"
  on public.faqs for delete
  to authenticated
  using (auth.uid() = user_id);

-- Read: owner can read all their rows (draft + published)
create policy "faqs_select_own"
  on public.faqs for select
  to authenticated
  using (auth.uid() = user_id);

-- Read: anyone (including anon) can read published FAQs (public FAQ page)
create policy "faqs_select_published"
  on public.faqs for select
  using (status = 'published');

comment on table public.faqs is 'FAQ items per user; answers stored as JSON array of strings';
