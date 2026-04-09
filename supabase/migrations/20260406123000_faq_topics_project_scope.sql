-- Scope FAQ topics to Studio projects.
alter table public.faq_topics
  add column if not exists project_id text;

create index if not exists faq_topics_user_project_idx
  on public.faq_topics (user_id, project_id);

comment on column public.faq_topics.project_id
  is 'Studio project id that owns this topic row';

