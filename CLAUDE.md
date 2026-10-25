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

Fixed decisions from the author: **dark theme by default** with an opt-in
light theme (visitors asked for it), near-black ink with one honey accent
(neutral paper with mustard in light), sage only for progress, Fixel
typeface, Gantt/milestone motif, and **nothing that looks like a generic AI
template**. A designer once recognised v2 as "made by Claude", so v3 removed
the cream-and-rust palette, eyebrow labels, outlined boxes and graph paper;
MASTER.md §2–§4 list what not to bring back. Emil Kowalski's design skills,
tasteskill.dev, componentry.dev, the vendored `ui-ux-pro-max` skill and
Anthropic's `frontend-design` skill are research inputs: take ideas, adapt
them to Віха — MASTER.md wins.

## Content

- Course program: `src/content/course.ts`; lessons:
  `src/content/modules/<module>/<lesson>.mdx`.
- The author sends text (often a Google Doc); keep their wording, fix only
  typos/obvious facts and report every change. Spelling «проєкт», «ялинки».
- Text the author didn't write (examples, figure captions) must be called
  out to the author for review.
- Audience: non-specialists who want to *understand* PM, not to calculate.
  The author asked for plain language and examples from the IT world: start
  from a situation (e.g. a store deciding on a mobile app), then name the
  term; keep one running example per module; hide formulas in
  `<FormulaNote>`. Module 3 is the reference for this tone.
- Program structure (`src/content/course.ts`) follows PMBOK 8: 1 project &
  value, 2 principles, 3 development approaches, 4 business case, then one
  module per domain (5 stakeholders, 6 governance, 7 scope, 8 schedule,
  9 finance, 10 resources, 11 risk), 12 quality, 13 agile, 14 measurement &
  closing. The author's Google Docs are raw material mapped onto this
  structure, not the structure itself. Moved lessons get a redirect in
  `next.config.ts` (`movedLessons`).
- The course follows **PMBOK 7 and 8**, not only the university textbook
  the author's texts come from. Main text follows PMBOK 8; where editions
  differ, add a `<Callout title="У PMBOK 7 і 8">`. Material outside PMBOK
  (project analysis, NPV/IRR) stays but is labelled as such.
- Terms: a plain word first, the official term of the Ukrainian PMBOK 7
  translation in brackets at first mention, with no note about its source:
  «зацікавлені сторони (стейкхолдери)», «результати (доробки)»,
  «адаптувати (припасовувати)». Risk responses: уникнення, пом'якшення,
  передача, прийняття, ескалація; for opportunities (нагоди): використання,
  посилення, розподіл, прийняття, ескалація. Never quote or copy the
  standard itself (PMI copyright); never use pirated copies.

## Workflow

- `npm run build` and `npm run lint` before committing; check the page in
  the browser in **both themes** at 1440px and at phone width (375px) with no
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
- Geo-block: `src/proxy.ts` returns 403 for RU, BY, CN, IR, KP using Vercel's
  `x-vercel-ip-country` header. Keep the list in sync with the matching
  Firewall rule in the Vercel dashboard (which blocks before the app runs).
