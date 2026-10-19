# Віха

Free Ukrainian-language project management course based on PMBOK 7/8.
Product brief and user stories: [docs/brief.md](docs/brief.md).

Stack: Next.js 16 (App Router, Cache Components) · MDX lessons · Supabase
(Postgres, auth, RLS) · Vercel.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in Supabase URL and publishable key
npm run dev
```

## Course content

- Program (modules, lessons, published flag): `src/content/course.ts`
- Lesson text: `src/content/modules/<module-slug>/<lesson-slug>.mdx`
  (Markdown with GitHub tables via `remark-gfm`)
- Lesson images: `public/lessons/`

A module appears on the site once it is `published: true` and has at least
one lesson. Unpublished modules show as «Скоро» and their URLs return 404.

## Database

Schema lives in `supabase/migrations/` as plain SQL. Apply new migrations in
order via Supabase Dashboard → SQL Editor (or `supabase db push` with the
Supabase CLI).

To make yourself the course author after your first sign-in:

```sql
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'you@example.com');
```
