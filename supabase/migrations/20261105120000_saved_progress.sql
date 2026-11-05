-- The project passport and game results of signed-in students. Both hang off
-- profiles, so nothing is stored before the privacy consent and everything goes
-- when the account is deleted.

-- ------------------------------------------------------------- project_passports

create table public.project_passports (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  -- A whole document: its shape still changes as modules add milestones.
  data jsonb not null check (pg_column_size(data) <= 200000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger project_passports_set_updated_at
  before update on public.project_passports
  for each row execute function public.set_updated_at();

alter table public.project_passports enable row level security;

revoke all on public.project_passports from anon, authenticated;
grant select on public.project_passports to authenticated;
grant insert (user_id, data), update (data) on public.project_passports to authenticated;

create policy "project_passports: read own or admin"
  on public.project_passports for select to authenticated
  using (user_id = (select auth.uid()) or private.is_admin());

create policy "project_passports: create own"
  on public.project_passports for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "project_passports: update own"
  on public.project_passports for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ------------------------------------------------------------------ game_results

create table public.game_results (
  user_id uuid not null references public.profiles (id) on delete cascade,
  module text not null check (module ~ '^module-[0-9]{2}$'),
  best integer not null check (best between 0 and 1000),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, module)
);

-- A worse replay from any device never replaces a better result.
create or replace function private.game_results_keep_best()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.best := greatest(old.best, new.best);
  new.completed_at := least(old.completed_at, new.completed_at);
  new.updated_at := now();
  return new;
end;
$$;

revoke execute on function private.game_results_keep_best() from public, anon, authenticated;

create trigger game_results_keep_best
  before update on public.game_results
  for each row execute function private.game_results_keep_best();

alter table public.game_results enable row level security;

revoke all on public.game_results from anon, authenticated;
grant select on public.game_results to authenticated;
-- Upsert sets every column it sends, so all of them need the update grant. The
-- policy still keeps the row with its owner, and the trigger keeps the best result.
grant insert (user_id, module, best, completed_at), update (user_id, module, best, completed_at) on public.game_results to authenticated;

create policy "game_results: read own or admin"
  on public.game_results for select to authenticated
  using (user_id = (select auth.uid()) or private.is_admin());

create policy "game_results: create own"
  on public.game_results for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "game_results: update own"
  on public.game_results for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
