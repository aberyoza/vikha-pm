-- The admin section «Уроки» on /admin/lessons (story 15 in
-- docs/backlog-2026-11.md). The counts come from here; the comments of one
-- lesson the page reads from lesson_clarity itself, which only the admin can.

-- «Так» and «Не зовсім» per lesson. The site matches the rows against the
-- current program in src/content/course.ts, so a renamed lesson starts at zero.
create or replace function public.admin_lesson_clarity()
returns table (module text, lesson text, yes bigint, unclear bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not private.is_admin() then
    raise exception 'not allowed';
  end if;
  return query
    select
      c.module,
      c.lesson,
      count(*) filter (where c.answer = 'yes'),
      count(*) filter (where c.answer = 'unclear')
    from public.lesson_clarity c
    group by c.module, c.lesson;
end;
$$;

revoke execute on function public.admin_lesson_clarity() from public, anon;
grant execute on function public.admin_lesson_clarity() to authenticated;

-- Hides a comment from «Що було незрозуміло?» or shows it again. The answer
-- «Не зовсім» stays and still counts. updated_at is left alone: it is the date
-- of the comment, not of the author's decision.
create or replace function public.admin_hide_lesson_comment(comment_id bigint, hide boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'not allowed';
  end if;
  update public.lesson_clarity set hidden = hide where id = comment_id;
end;
$$;

revoke execute on function public.admin_hide_lesson_comment(bigint, boolean) from public, anon;
grant execute on function public.admin_hide_lesson_comment(bigint, boolean) to authenticated;
