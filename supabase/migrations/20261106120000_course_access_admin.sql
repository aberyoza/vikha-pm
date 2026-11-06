-- What the access pages need on top of 20261105230000_course_access.sql.

-- Says whether the call changed anything, so the site writes to the author
-- once per payment and not on every click.
drop function public.claim_course_payment();

create function public.claim_course_payment()
returns text
language sql
security definer
set search_path = ''
as $$
  update public.course_access
  set payment_claimed_at = now()
  where user_id = (select auth.uid())
    and status = 'pending'
    and payment_claimed_at is null
  returning payment_code;
$$;

revoke execute on function public.claim_course_payment() from public, anon;
grant execute on function public.claim_course_payment() to authenticated;

-- Every registered student with their latest access record. The admin needs all
-- of them, not only those who asked: free access is often given unasked.
-- Emails live in auth.users, out of reach of the Data API.
create or replace function public.admin_course_access_list()
returns table (
  user_id uuid,
  name text,
  email text,
  registered_at timestamptz,
  status text,
  basis text,
  payment_code text,
  payment_claimed_at timestamptz,
  requested_at timestamptz,
  decided_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'not allowed';
  end if;
  return query
    select p.id, p.name, u.email::text, p.created_at,
           a.status, a.basis, a.payment_code, a.payment_claimed_at, a.requested_at, a.decided_at
    from public.profiles p
    join auth.users u on u.id = p.id
    left join lateral (
      select c.status, c.basis, c.payment_code, c.payment_claimed_at, c.requested_at, c.decided_at
      from public.course_access c
      where c.user_id = p.id
      order by c.requested_at desc
      limit 1
    ) a on true
    order by p.created_at desc;
end;
$$;

revoke execute on function public.admin_course_access_list() from public, anon;
grant execute on function public.admin_course_access_list() to authenticated;

-- Where to send the letter that access is open.
create or replace function public.course_access_contact(target_user uuid)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'not allowed';
  end if;
  return (select u.email::text from auth.users u where u.id = target_user);
end;
$$;

revoke execute on function public.course_access_contact(uuid) from public, anon;
grant execute on function public.course_access_contact(uuid) to authenticated;
