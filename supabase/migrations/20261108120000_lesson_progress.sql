-- Which lessons a student has read to the end, so that progress follows them
-- between devices. A row is only ever added; it goes away with the account.

create table public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  module text not null check (module ~ '^module-[0-9]{2}$'),
  lesson text not null check (lesson ~ '^[a-z0-9-]{1,80}$'),
  read_at timestamptz not null default now(),
  primary key (user_id, module, lesson)
);

-- The course has far fewer lessons, so this only stops a script filling the base.
create or replace function private.lesson_progress_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.lesson_progress where user_id = new.user_id) >= 300 then
    raise exception 'too many lessons' using errcode = 'VK429';
  end if;
  return new;
end;
$$;

revoke execute on function private.lesson_progress_limit() from public, anon, authenticated;

create trigger lesson_progress_limit
  before insert on public.lesson_progress
  for each row execute function private.lesson_progress_limit();

alter table public.lesson_progress enable row level security;

revoke all on public.lesson_progress from anon, authenticated;
grant select on public.lesson_progress to authenticated;
grant insert (user_id, module, lesson, read_at) on public.lesson_progress to authenticated;

create policy "lesson_progress: read own"
  on public.lesson_progress for select to authenticated
  using (user_id = (select auth.uid()));

create policy "lesson_progress: create own"
  on public.lesson_progress for insert to authenticated
  with check (user_id = (select auth.uid()));
