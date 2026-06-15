-- Who Paid? — backend schema for real cross-device sync.
-- Paste this into your Supabase project → SQL Editor → Run.
--
-- Model: each "table" is one row. `data` holds the full table JSON, and
-- `members` lists the device ids allowed to see/edit it. Sharing an invite
-- link adds the opener's device id to `members`.

create table if not exists public.tables (
  id          text primary key,
  data        jsonb not null,
  members     text[] not null default '{}',
  updated_at  timestamptz not null default now()
);

create index if not exists tables_members_idx on public.tables using gin (members);

-- Realtime: broadcast row changes to subscribed clients.
alter publication supabase_realtime add table public.tables;

-- Row Level Security.
-- NOTE: this MVP policy is permissive (anon key, no accounts) so you can test
-- quickly. Before App Store launch, replace with Sign in with Apple + a
-- policy that checks auth.uid() against a real membership table.
alter table public.tables enable row level security;

drop policy if exists "tables open access (mvp)" on public.tables;
create policy "tables open access (mvp)"
  on public.tables for all
  to anon, authenticated
  using (true)
  with check (true);
