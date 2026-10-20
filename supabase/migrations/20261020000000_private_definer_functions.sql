-- Security Advisor: SECURITY DEFINER functions in `public` are exposed as
-- RPC endpoints. Move the internal ones to a `private` schema that the Data
-- API doesn't serve. Policies and triggers reference functions by id, so
-- they keep working after the move.
--
-- mark_review_read stays in `public` on purpose: students call it via RPC,
-- and it only touches reviews of their own submissions.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

-- Used by RLS policies, which run as the signed-in user.
alter function public.is_admin() set schema private;
revoke execute on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

-- Trigger function: fired by the database, never called directly.
alter function public.reviews_after_insert() set schema private;
revoke execute on function private.reviews_after_insert() from public, anon, authenticated;
