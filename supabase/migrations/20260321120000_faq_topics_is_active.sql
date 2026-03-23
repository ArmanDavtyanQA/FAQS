-- Active flag: inactive topics stay in DB but are hidden from public FAQ and anon reads.

alter table public.faq_topics
  add column if not exists is_active boolean not null default true;

comment on column public.faq_topics.is_active is 'When false, topic is hidden from published help center; owner still manages it in dashboard.';

-- Public visibility: only active topics linked to published FAQs are visible to anon.
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
    join public.faq_topics t on t.id = l.topic_id
    where l.topic_id = p_topic_id
      and f.status = 'published'
      and t.is_active = true
  );
$$;
