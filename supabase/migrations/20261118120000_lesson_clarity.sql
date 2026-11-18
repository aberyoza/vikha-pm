-- «Чи зрозумілий урок?» at the end of every lesson (story 14 in
-- docs/backlog-2026-11.md); the admin section «Уроки» (story 15) reads it.
--
-- The answer is anonymous: no user id, name or email. A random id the browser
-- keeps in localStorage holds one answer per lesson, and changing the answer
-- updates that row. Guests and students write only through
-- answer_lesson_clarity(); only the admin reads the table.

create table public.lesson_clarity (
  id bigint generated always as identity primary key,
  browser_id uuid not null,
  module text not null check (module ~ '^module-(0[1-9]|1[0-4])$'),
  lesson text not null check (lesson ~ '^[a-z0-9-]{1,80}$'),
  answer text not null check (answer in ('yes', 'unclear')),
  comment text check (char_length(comment) between 1 and 500),
  -- Story 15: the author hides a comment; the answer still counts.
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (browser_id, module, lesson),
  check (answer = 'unclear' or comment is null)
);

create index lesson_clarity_lesson on public.lesson_clarity (module, lesson);
create index lesson_clarity_created on public.lesson_clarity (created_at);

alter table public.lesson_clarity enable row level security;

revoke all on public.lesson_clarity from anon, authenticated;
grant select on public.lesson_clarity to authenticated;

create policy "lesson_clarity: admin reads"
  on public.lesson_clarity for select to authenticated
  using (private.is_admin());

-- Saves or changes this browser's answer to a lesson.
--
-- Anyone can call it with a made-up browser id, so the limits count new rows,
-- not people: 30 lessons an hour and 200 in all per browser id (the course has
-- about 50 lessons), and 600 new answers an hour for the whole site, which stops
-- a script that changes the id on every call. Changing an existing answer is
-- not limited: it overwrites one row and adds nothing.
create or replace function public.answer_lesson_clarity(
  browser uuid,
  module_slug text,
  lesson_slug text,
  answer_value text,
  comment_text text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_comment text := case when answer_value = 'unclear' then nullif(btrim(comment_text), '') end;
begin
  if browser is null then
    raise exception 'browser id is required' using errcode = '22004';
  end if;

  if not exists (
    select 1 from public.lesson_clarity c
    where c.browser_id = browser and c.module = module_slug and c.lesson = lesson_slug
  ) then
    if (
      select count(*) from public.lesson_clarity c
      where c.browser_id = browser and c.created_at > now() - interval '1 hour'
    ) >= 30
    or (select count(*) from public.lesson_clarity c where c.browser_id = browser) >= 200
    or (
      select count(*) from public.lesson_clarity c
      where c.created_at > now() - interval '1 hour'
    ) >= 600 then
      raise exception 'too many answers' using errcode = 'VK429';
    end if;
  end if;

  insert into public.lesson_clarity as c (browser_id, module, lesson, answer, comment)
  values (browser, module_slug, lesson_slug, answer_value, clean_comment)
  on conflict (browser_id, module, lesson) do update
    set answer = excluded.answer,
        comment = excluded.comment,
        -- A new comment needs a new look from the author.
        hidden = c.hidden and c.comment is not distinct from excluded.comment,
        updated_at = now();
end;
$$;

revoke execute on function public.answer_lesson_clarity(uuid, text, text, text, text) from public;
grant execute on function public.answer_lesson_clarity(uuid, text, text, text, text) to anon, authenticated;
