-- ============================================================
-- Snippet Manager  Supabase Schema
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- TABLE: snippets
-- ------------------------------------------------------------
create table if not exists public.snippets (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null,
  description text        not null default '',
  code        text        not null,
  language    text        not null,
  tags        text[]      not null default '{}',
  category    text        not null default '',
  visibility  text        not null default 'private' check (visibility in ('public', 'private')),
  versions    jsonb       not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists snippets_user_id_created_at_idx
  on public.snippets (user_id, created_at desc);


-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.snippets enable row level security;

create policy "Users can select own snippets"
  on public.snippets for select
  using (auth.uid() = user_id);

create policy "Users can insert own snippets"
  on public.snippets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own snippets"
  on public.snippets for update
  using (auth.uid() = user_id);

create policy "Users can delete own snippets"
  on public.snippets for delete
  using (auth.uid() = user_id);


-- ------------------------------------------------------------
-- AUTO-UPDATE updated_at
-- ------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger snippets_updated_at
  before update on public.snippets
  for each row execute function public.handle_updated_at();


-- ------------------------------------------------------------
-- SEED DATA (optional  uncomment after signing in once)
-- ------------------------------------------------------------
-- insert into public.snippets (user_id, title, description, code, language, tags, category, visibility)
-- values
--   (
--     auth.uid(),
--     'Debounce Hook',
--     'React hook that debounces a value by a given delay.',
--     E'import { useState, useEffect } from "react"\n\nexport function useDebounce<T>(value: T, delay = 300): T {\n  const [debounced, setDebounced] = useState(value)\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay)\n    return () => clearTimeout(timer)\n  }, [value, delay])\n  return debounced\n}',
--     'typescript',
--     ARRAY['react', 'hooks', 'performance'],
--     'Utilities',
--     'public'
--   ),
--   (
--     auth.uid(),
--     'Fetch with Retry',
--     'Fetch wrapper that retries on failure up to N times.',
--     E'async function fetchWithRetry(url: string, retries = 3): Promise<Response> {\n  for (let i = 0; i < retries; i++) {\n    try {\n      const res = await fetch(url)\n      if (!res.ok) throw new Error(`HTTP ${res.status}`)\n      return res\n    } catch (err) {\n      if (i === retries - 1) throw err\n      await new Promise(r => setTimeout(r, 500 * (i + 1)))\n    }\n  }\n  throw new Error("unreachable")\n}',
--     'typescript',
--     ARRAY['fetch', 'async', 'error-handling'],
--     'Networking',
--     'public'
--   ),
--   (
--     auth.uid(),
--     'SQL Pagination',
--     'Standard LIMIT/OFFSET pagination query.',
--     E'-- Get page N (0-indexed) with page_size rows\nSELECT *\nFROM   your_table\nORDER  BY created_at DESC\nLIMIT  :page_size\nOFFSET :page * :page_size;',
--     'sql',
--     ARRAY['pagination', 'query'],
--     'Database',
--     'private'
--   );


-- ------------------------------------------------------------
-- ROLLBACK (optional  uncomment to fully tear down)
-- WARNING: permanently deletes all snippet data
-- ------------------------------------------------------------
-- drop trigger  if exists snippets_updated_at       on public.snippets;
-- drop function if exists public.handle_updated_at  cascade;
-- drop table    if exists public.snippets            cascade;
