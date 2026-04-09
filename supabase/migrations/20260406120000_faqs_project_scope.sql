-- Scope FAQs to a Studio project for isolated public pages.
alter table public.faqs
  add column if not exists project_id text;

create index if not exists faqs_user_project_idx
  on public.faqs (user_id, project_id);

create index if not exists faqs_user_project_status_idx
  on public.faqs (user_id, project_id, status);

comment on column public.faqs.project_id is 'Studio project id that owns this FAQ row';

