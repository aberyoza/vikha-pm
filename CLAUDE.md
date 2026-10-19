@AGENTS.md

# Віха — project notes

Free Ukrainian-language PM course (PMBOK 7/8). Next.js 16 (App Router, Cache
Components) · MDX lessons · Supabase · Vercel. Product brief and user stories:
`docs/brief.md`.

## Design — always follow the style line

**Before any UI change, new page, module or lesson, read
`design-system/vikha/MASTER.md`** (and `design-system/vikha/pages/<page>.md`
if it exists — it overrides MASTER for that page). It defines the tokens,
fonts, layout, components and the lesson MDX pattern. Reuse the listed
components; extend MASTER.md when you introduce a new reusable pattern.

Fixed decisions from the author: **dark theme only** (no light mode), warm
palette (honey + sage on warm graphite), Fixel typeface, Gantt/milestone
motif, and nothing that looks like a generic AI template. The
`ui-ux-pro-max` skill (vendored in `.claude/skills/`) and Anthropic's
`frontend-design` skill are research inputs — MASTER.md wins.

## Content

- Course program: `src/content/course.ts`; lessons:
  `src/content/modules/<module>/<lesson>.mdx`.
- The author sends text (often a Google Doc); keep their wording, fix only
  typos/obvious facts and report every change. Spelling «проєкт», «ялинки».
- Text the author didn't write (examples, figure captions) must be called
  out to the author for review.

## Workflow

- `npm run build` and `npm run lint` before committing; check the page in
  the browser (dark) at 1440px and at phone width (375px) with no
  horizontal overflow.
- Commit locally with conventional messages. **Do not push** — the author
  pushes; finish by giving the `git push` command.
- After editing `src/app/globals.css`, run `rm -rf .next` and restart the dev
  server (Turbopack may serve stale CSS).

## Security

- Security headers (CSP, HSTS, etc.) live in `next.config.ts`. Adding an
  external service (analytics, fonts, embeds, APIs) means updating the CSP
  there, or the browser will block it.
- `vercel.json` holds a WAF rule that denies common exploit paths
  (`/wp-admin`, `/.env`, `*.php`…). Don't add real routes that match it;
  test the regex before changing it.
- Bot protection, AI-bot rules and rate limits are configured by the author
  in the Vercel dashboard (Firewall), not in code.
- Never commit secrets: only the public Supabase URL and publishable key are
  allowed (in Vercel env vars / `.env.local`).
