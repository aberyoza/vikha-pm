-- The author's own label for a second kind of free access. What it means is
-- deliberately not written down in this public repository.

alter table public.course_access drop constraint course_access_basis_check;

update public.course_access set basis = 'free_plus' where basis = 'military';

alter table public.course_access add constraint course_access_basis_check
  check (basis in ('paid', 'free', 'free_plus'));
