-- Cancelling used to delete the row, so sending and cancelling in a loop could
-- flood the author's mailbox with no trace. A cancelled request now stays as an
-- empty row that counts towards the daily limit, and holds none of the passport.

alter table public.feedback_requests drop constraint feedback_requests_status_check;
alter table public.feedback_requests add constraint feedback_requests_status_check
  check (status in ('pending', 'answered', 'cancelled'));

drop policy "feedback_requests: cancel own pending" on public.feedback_requests;
revoke delete on public.feedback_requests from authenticated;

create or replace function public.cancel_feedback_request(request_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.feedback_requests
  set status = 'cancelled', snapshot = '{}'::jsonb, note = null
  where id = cancel_feedback_request.request_id
    and user_id = (select auth.uid())
    and status = 'pending';
$$;

revoke execute on function public.cancel_feedback_request(uuid) from public, anon;
grant execute on function public.cancel_feedback_request(uuid) to authenticated;

create or replace function private.feedback_requests_daily_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    select count(*) from public.feedback_requests
    where user_id = new.user_id and created_at > now() - interval '24 hours'
  ) >= 3 then
    raise exception 'too many feedback requests' using errcode = 'VK429';
  end if;
  return new;
end;
$$;

revoke execute on function private.feedback_requests_daily_limit() from public, anon, authenticated;

create trigger feedback_requests_daily_limit
  before insert on public.feedback_requests
  for each row execute function private.feedback_requests_daily_limit();

-- Only a request that is still waiting can get a reply.
drop policy "feedback_replies: admin answers" on public.feedback_replies;
create policy "feedback_replies: admin answers"
  on public.feedback_replies for insert to authenticated
  with check (
    private.is_admin()
    and author_id = (select auth.uid())
    and exists (
      select 1 from public.feedback_requests r
      where r.id = request_id and r.status = 'pending'
    )
  );
