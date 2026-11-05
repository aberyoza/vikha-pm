-- Access to the paid modules is opened by hand: a student asks and pays, the
-- author checks the bank and approves. The author can also open access with no
-- payment at all, and the basis records why.
--
-- All changes go through the functions below, so a student can never approve
-- themselves. This lives apart from profiles, which students can update.

create table public.course_access (
  id uuid primary key default gen_random_uuid(),
  -- Null once the account is deleted: a record of a payment stays for the books.
  user_id uuid references public.profiles (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'revoked')),
  basis text check (basis in ('paid', 'free', 'military')),
  -- The student puts this in the payment purpose so the transfer can be matched.
  payment_code text unique,
  offer_version text check (char_length(offer_version) <= 32),
  payment_claimed_at timestamptz,
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.profiles (id) on delete set null,
  constraint course_access_approved_has_basis check (status <> 'approved' or basis is not null)
);

create unique index course_access_one_live_idx
  on public.course_access (user_id) where status in ('pending', 'approved');
create index course_access_status_requested_at_idx
  on public.course_access (status, requested_at);

alter table public.course_access enable row level security;

revoke all on public.course_access from anon, authenticated;
grant select on public.course_access to authenticated;

create policy "course_access: read own or admin"
  on public.course_access for select to authenticated
  using (user_id = (select auth.uid()) or private.is_admin());

-- ------------------------------------------------------------------- checks

create or replace function public.has_course_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin() or exists (
    select 1 from public.course_access
    where user_id = (select auth.uid()) and status = 'approved'
  );
$$;

revoke execute on function public.has_course_access() from public, anon;
grant execute on function public.has_course_access() to authenticated;

-- ------------------------------------------------------------------ student

-- Returns the student's live row if there is one, so asking twice is harmless.
create or replace function public.request_course_access(offer_version text)
returns public.course_access
language plpgsql
security definer
set search_path = ''
as $$
declare
  access_row public.course_access;
begin
  if (select auth.uid()) is null then
    raise exception 'not signed in';
  end if;

  select * into access_row from public.course_access
  where user_id = (select auth.uid()) and status in ('pending', 'approved');
  if found then
    return access_row;
  end if;

  insert into public.course_access (user_id, payment_code, offer_version)
  values (
    (select auth.uid()),
    'VH-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
    request_course_access.offer_version
  )
  returning * into access_row;
  return access_row;
end;
$$;

revoke execute on function public.request_course_access(text) from public, anon;
grant execute on function public.request_course_access(text) to authenticated;

create or replace function public.claim_course_payment()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.course_access
  set payment_claimed_at = now()
  where user_id = (select auth.uid())
    and status = 'pending'
    and payment_claimed_at is null;
$$;

revoke execute on function public.claim_course_payment() from public, anon;
grant execute on function public.claim_course_payment() to authenticated;

-- -------------------------------------------------------------------- admin

-- Approves a waiting request, or opens access for someone who never asked.
-- Calling it again on an approved student changes the basis.
create or replace function public.approve_course_access(target_user uuid, access_basis text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'not allowed';
  end if;
  if access_basis is null then
    raise exception 'a basis is required';
  end if;

  update public.course_access
  set status = 'approved', basis = access_basis, decided_at = now(), decided_by = (select auth.uid())
  where user_id = target_user and status in ('pending', 'approved');

  if not found then
    insert into public.course_access (user_id, status, basis, decided_at, decided_by)
    values (target_user, 'approved', access_basis, now(), (select auth.uid()));
  end if;
end;
$$;

revoke execute on function public.approve_course_access(uuid, text) from public, anon;
grant execute on function public.approve_course_access(uuid, text) to authenticated;

-- Closes access, for example after a refund, and turns down a waiting request.
create or replace function public.revoke_course_access(target_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'not allowed';
  end if;

  update public.course_access
  set status = 'revoked', decided_at = now(), decided_by = (select auth.uid())
  where user_id = target_user and status in ('pending', 'approved');
end;
$$;

revoke execute on function public.revoke_course_access(uuid) from public, anon;
grant execute on function public.revoke_course_access(uuid) to authenticated;

-- ---------------------------------------------------------- deleted accounts

-- Only a payment needs keeping. Anything else, including the fact that someone
-- is a serviceman, goes with the account.
create or replace function private.course_access_forget_account()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.course_access
  where user_id = old.id and basis is distinct from 'paid';
  return old;
end;
$$;

revoke execute on function private.course_access_forget_account() from public, anon, authenticated;

create trigger course_access_forget_account
  before delete on public.profiles
  for each row execute function private.course_access_forget_account();
