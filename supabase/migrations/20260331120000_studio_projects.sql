-- Studio projects: workspaces shown in Project Studio (/studio, /project/[id]/…)
-- Maps to client type { id, name, domain, description?, updatedAt }

create table if not exists public.studio_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  domain text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_studio_projects_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists studio_projects_updated_at on public.studio_projects;
create trigger studio_projects_updated_at
  before update on public.studio_projects
  for each row execute function public.set_studio_projects_updated_at();

create index if not exists studio_projects_user_id_idx
  on public.studio_projects (user_id);

create index if not exists studio_projects_user_updated_idx
  on public.studio_projects (user_id, updated_at desc);

alter table public.studio_projects enable row level security;

create policy "studio_projects_insert_own"
  on public.studio_projects for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "studio_projects_select_own"
  on public.studio_projects for select
  to authenticated
  using (auth.uid() = user_id);

create policy "studio_projects_update_own"
  on public.studio_projects for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "studio_projects_delete_own"
  on public.studio_projects for delete
  to authenticated
  using (auth.uid() = user_id);

comment on table public.studio_projects is 'Per-user project workspaces for Quantum Studio';
