-- One feedback per project passport replaces reviews of separate module answers.
-- The old tables were never used; the guard stops the migration if that changed.
do $$
begin
  if exists (select 1 from public.submissions) or exists (select 1 from public.reviews) then
    raise exception 'submissions or reviews are not empty';
  end if;
end;
$$;

drop table public.reviews;
drop table public.submissions;
drop type public.submission_status;
drop function public.mark_review_read(uuid);
drop function public.submissions_before_insert();
drop function public.submissions_before_update();
drop function private.reviews_after_insert();

-- ------------------------------------------------------------- feedback_requests

create table public.feedback_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- A copy: later edits of the passport must not change what the author reads.
  snapshot jsonb not null check (pg_column_size(snapshot) <= 200000),
  milestones integer not null check (milestones >= 1),
  note text check (char_length(note) <= 500),
  status text not null default 'pending' check (status in ('pending', 'answered')),
  created_at timestamptz not null default now(),
  answered_at timestamptz
);

create unique index feedback_requests_one_pending_idx
  on public.feedback_requests (user_id) where status = 'pending';
create index feedback_requests_status_created_at_idx
  on public.feedback_requests (status, created_at);

alter table public.feedback_requests enable row level security;

revoke all on public.feedback_requests from anon, authenticated;
grant select, delete on public.feedback_requests to authenticated;
grant insert (user_id, snapshot, milestones, note) on public.feedback_requests to authenticated;

create policy "feedback_requests: read own or admin"
  on public.feedback_requests for select to authenticated
  using (user_id = (select auth.uid()) or private.is_admin());

create policy "feedback_requests: create own"
  on public.feedback_requests for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "feedback_requests: cancel own pending"
  on public.feedback_requests for delete to authenticated
  using (user_id = (select auth.uid()) and status = 'pending');

-- -------------------------------------------------------------- feedback_replies

create table public.feedback_replies (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.feedback_requests (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  body text not null check (char_length(btrim(body)) between 1 and 5000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- A reply closes its request, which the student can't change directly.
create or replace function private.feedback_replies_close_request()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.feedback_requests
  set status = 'answered', answered_at = now()
  where id = new.request_id;
  return new;
end;
$$;

revoke execute on function private.feedback_replies_close_request() from public, anon, authenticated;

create trigger feedback_replies_close_request
  after insert on public.feedback_replies
  for each row execute function private.feedback_replies_close_request();

alter table public.feedback_replies enable row level security;

revoke all on public.feedback_replies from anon, authenticated;
grant select on public.feedback_replies to authenticated;
grant insert (request_id, author_id, body), update (read_at) on public.feedback_replies to authenticated;

create policy "feedback_replies: read own or admin"
  on public.feedback_replies for select to authenticated
  using (
    private.is_admin()
    or exists (
      select 1 from public.feedback_requests r
      where r.id = request_id and r.user_id = (select auth.uid())
    )
  );

create policy "feedback_replies: admin answers"
  on public.feedback_replies for insert to authenticated
  with check (private.is_admin() and author_id = (select auth.uid()));

create policy "feedback_replies: student marks read"
  on public.feedback_replies for update to authenticated
  using (
    exists (
      select 1 from public.feedback_requests r
      where r.id = request_id and r.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.feedback_requests r
      where r.id = request_id and r.user_id = (select auth.uid())
    )
  );

-- Where to send the letter about a reply. Emails live in auth.users, out of reach
-- of the Data API, so this gives the admin one address and nothing else.
create or replace function public.feedback_student_contact(request_id uuid)
returns table (email text, emails_enabled boolean)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'not allowed';
  end if;
  return query
    select u.email::text, p.emails_enabled
    from public.feedback_requests r
    join public.profiles p on p.id = r.user_id
    join auth.users u on u.id = r.user_id
    where r.id = feedback_student_contact.request_id;
end;
$$;

revoke execute on function public.feedback_student_contact(uuid) from public, anon;
grant execute on function public.feedback_student_contact(uuid) to authenticated;
