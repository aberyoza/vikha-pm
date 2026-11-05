-- Lets a signed-in student delete their own account without a service key on
-- the server. Stays in `public` on purpose, like mark_review_read: students
-- call it via RPC, and it only ever touches the caller's own row. Profiles and
-- submissions go with it through their foreign keys.

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'not signed in';
  end if;
  delete from auth.users where id = (select auth.uid());
end;
$$;

revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
