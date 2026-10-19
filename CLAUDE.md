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

The `ui-ux-pro-max` skill is vendored in `.claude/skills/` for design
research. Its suggestions are inputs, not rules — MASTER.md wins, and its
"Deviations" section explains what we deliberately rejected.

## Content

- Course program: `src/content/course.ts`; lessons:
  `src/content/modules/<module>/<lesson>.mdx`.
- The author sends text (often a Google Doc); keep their wording, fix only
  typos/obvious facts and report every change. Spelling «проєкт», «ялинки».
- Text the author didn't write (examples, figure captions) must be called
  out to the author for review.

## Workflow

- `npm run build` and `npm run lint` before committing; check the page in
  the browser in light and dark mode and at phone width.
- Commit locally with conventional messages. **Do not push** — the author
  pushes; finish by giving the `git push` command.
- After editing `src/app/globals.css`, run `rm -rf .next` and restart the dev
  server (Turbopack may serve stale CSS).
