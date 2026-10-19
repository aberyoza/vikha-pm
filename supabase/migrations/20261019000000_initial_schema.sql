-- Initial schema: profiles, assignment submissions, reviews.
-- Access is enforced by RLS plus column-level grants, so students can only
-- touch their own rows and only the columns they are meant to change.

-- ---------------------------------------------------------------- helpers

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------- profiles

create type public.experience_level as enum ('none', 'lt_1', '1_3', '3_plus');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 50),
  experience public.experience_level,
  goal text check (char_length(goal) <= 300),
  emails_enabled boolean not null default true,
  is_admin boolean not null default false,
  -- A profile is only created after the privacy policy checkbox is ticked.
  privacy_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Defined after profiles because it reads the table.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select is_admin from public.profiles where id = (select auth.uid())),
    false
  );
$$;

alter table public.profiles enable row level security;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (id, name, experience, goal) on public.profiles to authenticated;
grant update (name, experience, goal, emails_enabled) on public.profiles to authenticated;

create policy "profiles: read own or admin"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

create policy "profiles: create own"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));

create policy "profiles: update own"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------- submissions

create type public.submission_status as enum ('pending_review', 'reviewed');

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  module_slug text not null,
  version integer not null default 1,
  answer_text text check (char_length(answer_text) <= 10000),
  answer_url text check (
    answer_url ~* '^https?://' and char_length(answer_url) <= 2000
  ),
  status public.submission_status not null default 'pending_review',
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submissions_answer_present check (
    nullif(btrim(answer_text), '') is not null or answer_url is not null
  ),
  unique (user_id, module_slug, version)
);

create index submissions_status_submitted_at_idx
  on public.submissions (status, submitted_at);

-- Numbers each new version and refuses a new one while the latest is still
-- waiting for review (the student should edit it instead).
create or replace function public.submissions_before_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  latest public.submissions;
begin
  select * into latest
  from public.submissions
  where user_id = new.user_id and module_slug = new.module_slug
  order by version desc
  limit 1;

  if latest.id is not null and latest.status = 'pending_review' then
    raise exception 'previous version is still pending review'
      using errcode = 'P0001', hint = 'edit_pending_submission';
  end if;

  new.version = coalesce(latest.version, 0) + 1;
  new.status = 'pending_review';
  new.submitted_at = now();
  return new;
end;
$$;

create trigger submissions_before_insert
  before insert on public.submissions
  for each row execute function public.submissions_before_insert();

-- Editing an answer refreshes its submission date.
create or replace function public.submissions_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.answer_text is distinct from old.answer_text
     or new.answer_url is distinct from old.answer_url then
    new.submitted_at = now();
  end if;
  new.updated_at = now();
  return new;
end;
$$;

create trigger submissions_before_update
  before update on public.submissions
  for each row execute function public.submissions_before_update();

alter table public.submissions enable row level security;

revoke all on public.submissions from anon, authenticated;
grant select on public.submissions to authenticated;
grant insert (user_id, module_slug, answer_text, answer_url)
  on public.submissions to authenticated;
grant update (answer_text, answer_url) on public.submissions to authenticated;

create policy "submissions: read own or admin"
  on public.submissions for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

create policy "submissions: create own"
  on public.submissions for insert to authenticated
  with check (user_id = (select auth.uid()));

-- Only answers still waiting for review can be edited. If the author has
-- already reviewed it, the update matches no rows.
create policy "submissions: edit own pending"
  on public.submissions for update to authenticated
  using (user_id = (select auth.uid()) and status = 'pending_review')
  with check (user_id = (select auth.uid()) and status = 'pending_review');

-- ---------------------------------------------------------------- reviews

-- One row per reviewer per submission. Today only the author reviews;
-- reviewer_id leaves room for peer-to-peer review later.
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id),
  comment text not null check (char_length(btrim(comment)) between 1 and 5000),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (submission_id, reviewer_id)
);

create index reviews_submission_id_idx on public.reviews (submission_id);

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- A new review closes the submission it belongs to.
create or replace function public.reviews_after_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.submissions
  set status = 'reviewed'
  where id = new.submission_id;
  return new;
end;
$$;

create trigger reviews_after_insert
  after insert on public.reviews
  for each row execute function public.reviews_after_insert();

alter table public.reviews enable row level security;

revoke all on public.reviews from anon, authenticated;
grant select on public.reviews to authenticated;
grant insert (submission_id, reviewer_id, comment) on public.reviews to authenticated;
grant update (comment) on public.reviews to authenticated;

create policy "reviews: read own submissions or admin"
  on public.reviews for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.submissions s
      where s.id = submission_id and s.user_id = (select auth.uid())
    )
  );

create policy "reviews: admin creates"
  on public.reviews for insert to authenticated
  with check (public.is_admin() and reviewer_id = (select auth.uid()));

create policy "reviews: reviewer edits own"
  on public.reviews for update to authenticated
  using (reviewer_id = (select auth.uid()))
  with check (reviewer_id = (select auth.uid()));

-- Students can't update reviews directly; they mark feedback as read here.
create or replace function public.mark_review_read(review_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.reviews r
  set read_at = now()
  from public.submissions s
  where r.id = review_id
    and s.id = r.submission_id
    and s.user_id = (select auth.uid())
    and r.read_at is null;
$$;

revoke execute on function public.mark_review_read(uuid) from public, anon;
grant execute on function public.mark_review_read(uuid) to authenticated;
