-- Run in Supabase SQL Editor. Keep the service-role key out of the app.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.portfolio_content (
  section text primary key check (section in ('site','about','skills','experience','education','achievements','gallery','contact','resume','projects')),
  payload jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
alter table public.portfolio_content enable row level security;
create policy "admin can read own allowlist" on public.admin_users for select to authenticated using (user_id = auth.uid());
create policy "public reads published portfolio sections" on public.portfolio_content for select to anon, authenticated using (published = true);
create policy "admins read all sections" on public.portfolio_content for select to authenticated using (exists(select 1 from public.admin_users where user_id=auth.uid()));
create policy "admins insert sections" on public.portfolio_content for insert to authenticated with check (exists(select 1 from public.admin_users where user_id=auth.uid()));
create policy "admins update sections" on public.portfolio_content for update to authenticated using (exists(select 1 from public.admin_users where user_id=auth.uid())) with check (exists(select 1 from public.admin_users where user_id=auth.uid()));
create policy "admins delete sections" on public.portfolio_content for delete to authenticated using (exists(select 1 from public.admin_users where user_id=auth.uid()));
grant select on public.portfolio_content to anon, authenticated;
grant insert, update, delete on public.portfolio_content to authenticated;
grant select on public.admin_users to authenticated;
-- After creating your admin auth account, add only your own auth user UUID:
-- insert into public.admin_users(user_id) values ('YOUR-USER-UUID') on conflict do nothing;
