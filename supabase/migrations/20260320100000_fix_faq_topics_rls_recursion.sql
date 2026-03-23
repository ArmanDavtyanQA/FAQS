-- Fix: RLS recursion on faq_topic_links + idempotent policy refresh.
-- Safe to run if you already have partial policies (drops all named policies first).

drop policy if exists "faq_topics_insert_own" on public.faq_topics;
drop policy if exists "faq_topics_update_own" on public.faq_topics;
drop policy if exists "faq_topics_delete_own" on public.faq_topics;
drop policy if exists "faq_topics_select_own" on public.faq_topics;
drop policy if exists "faq_topics_select_public_via_published_faq" on public.faq_topics;

drop policy if exists "faq_topic_links_select_own_faq" on public.faq_topic_links;
drop policy if exists "faq_topic_links_select_published" on public.faq_topic_links;
drop policy if exists "faq_topic_links_insert_own" on public.faq_topic_links;
drop policy if exists "faq_topic_links_delete_own" on public.faq_topic_links;

create or replace function public.faq_row_is_owned_by(p_faq_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.faqs f
    where f.id = p_faq_id and f.user_id = p_user_id
  );
$$;

create or replace function public.faq_row_is_published(p_faq_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.faqs f
    where f.id = p_faq_id and f.status = 'published'
  );
$$;

create or replace function public.faq_topic_row_is_owned_by(p_topic_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.faq_topics t
    where t.id = p_topic_id and t.user_id = p_user_id
  );
$$;

create or replace function public.topic_used_in_published_faq(p_topic_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.faq_topic_links l
    join public.faqs f on f.id = l.faq_id
    where l.topic_id = p_topic_id and f.status = 'published'
  );
$$;

revoke all on function public.faq_row_is_owned_by(uuid, uuid) from public;
revoke all on function public.faq_row_is_published(uuid) from public;
revoke all on function public.faq_topic_row_is_owned_by(uuid, uuid) from public;
revoke all on function public.topic_used_in_published_faq(uuid) from public;

grant execute on function public.faq_row_is_owned_by(uuid, uuid) to anon, authenticated;
grant execute on function public.faq_row_is_published(uuid) to anon, authenticated;
grant execute on function public.faq_topic_row_is_owned_by(uuid, uuid) to anon, authenticated;
grant execute on function public.topic_used_in_published_faq(uuid) to anon, authenticated;

alter table public.faq_topics enable row level security;

create policy "faq_topics_insert_own"
  on public.faq_topics for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "faq_topics_update_own"
  on public.faq_topics for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "faq_topics_delete_own"
  on public.faq_topics for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "faq_topics_select_own"
  on public.faq_topics for select
  to authenticated
  using (auth.uid() = user_id);

create policy "faq_topics_select_public_via_published_faq"
  on public.faq_topics for select
  using (public.topic_used_in_published_faq(id));

alter table public.faq_topic_links enable row level security;

create policy "faq_topic_links_select_own_faq"
  on public.faq_topic_links for select
  to authenticated
  using (public.faq_row_is_owned_by(faq_id, auth.uid()));

create policy "faq_topic_links_select_published"
  on public.faq_topic_links for select
  using (public.faq_row_is_published(faq_id));

create policy "faq_topic_links_insert_own"
  on public.faq_topic_links for insert
  to authenticated
  with check (
    public.faq_row_is_owned_by(faq_id, auth.uid())
    and public.faq_topic_row_is_owned_by(topic_id, auth.uid())
  );

create policy "faq_topic_links_delete_own"
  on public.faq_topic_links for delete
  to authenticated
  using (public.faq_row_is_owned_by(faq_id, auth.uid()));
