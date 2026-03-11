# Supabase setup

## FAQs table

1. Open **Supabase Dashboard → SQL Editor**.
2. Paste and run the contents of:

   `supabase/migrations/20250310000000_create_faqs.sql`

   This creates:

   - `public.faqs` — `id`, `user_id`, `title`, `answers` (jsonb array), `status`, `created_at`, `updated_at`
   - **RLS policies**:
     - Authenticated users can **insert/update/delete** only rows where `user_id = auth.uid()`
     - **Select**: owners see all their rows; **anyone** can **select** rows with `status = 'published'` (public FAQ page)

3. Ensure **Google Auth** (or your provider) is enabled so `auth.users` exists and `user_id` references are valid.

## Env

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

FAQ create/update runs in the **browser** with the logged-in user’s session so RLS applies automatically.
