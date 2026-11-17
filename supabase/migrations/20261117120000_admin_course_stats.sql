-- The course funnel on /admin/stats (stories 12 and 13 in docs/backlog-2026-11.md).
--
-- One row per student, with no name, email or id: the page only counts. The site
-- matches the lessons against the current program in src/content/course.ts, so a
-- renamed or moved lesson doesn't count as read. Experience and the access basis
-- are for the filters of story 13.
create or replace function public.admin_course_stats()
returns table (
  registered_at timestamptz,
  experience text,
  access_basis text,
  -- 'module-01/what-is-project' for every lesson read.
  lessons text[],
  -- 'module-01' for every finished game.
  games text[],
  feedback_sent boolean,
  -- The latest lesson read, game result saved or passport change.
  last_active_at timestamptz
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
    select
      p.created_at,
      p.experience::text,
      (
        select c.basis
        from public.course_access c
        where c.user_id = p.id and c.status = 'approved'
        order by c.decided_at desc nulls last
        limit 1
      ),
      coalesce(
        (select array_agg(l.module || '/' || l.lesson) from public.lesson_progress l where l.user_id = p.id),
        '{}'
      ),
      coalesce(
        (select array_agg(g.module) from public.game_results g where g.user_id = p.id and g.completed_at is not null),
        '{}'
      ),
      exists (
        select 1 from public.feedback_requests f
        where f.user_id = p.id and f.status in ('pending', 'answered')
      ),
      greatest(
        (select max(l.read_at) from public.lesson_progress l where l.user_id = p.id),
        (select max(g.updated_at) from public.game_results g where g.user_id = p.id),
        (select pp.updated_at from public.project_passports pp where pp.user_id = p.id)
      )
    from public.profiles p
    where not p.is_admin
    order by p.created_at;
end;
$$;

revoke execute on function public.admin_course_stats() from public, anon;
grant execute on function public.admin_course_stats() to authenticated;
