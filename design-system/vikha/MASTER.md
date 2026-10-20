# Віха — Design System (MASTER)

Global source of truth for how the site looks. Every new page, module,
lesson or component follows this file. Page-specific deviations go to
`design-system/vikha/pages/<page>.md` and override this file only for that page.

History: v1 came from the `ui-ux-pro-max` skill (Swiss minimalism, light).
v2 (current) was designed with Anthropic's `frontend-design` skill after the
author asked for a look that isn't "the standard Claude kit", **warm**, and
**dark only** (light pages are too bright for them). v2 was approved from a
throwaway HTML prototype (not kept); the site itself is the reference now.

## 1. Concept: "Віха як діаграма Ганта"

The visual language comes from project management itself: Gantt bars,
milestone diamonds ◆, a "today" line, planning-paper grid. **One bold element
per page** (on the home page: the course program drawn as a Gantt chart);
everything around it stays quiet.

- Audience: Ukrainian adults learning PM, beginner → advanced. Calm, practical.
- **Dark by default, light on request.** The author works in dark; visitors
  asked for light, so a header toggle (`ThemeToggle`) switches to a warm light
  theme. The choice lives in `localStorage` (`vikha-theme`) and an inline
  script in `<head>` applies `data-theme="light"` before first paint (no
  flash, pages stay static). There is no `prefers-color-scheme` branch.
- Warm, not strict: warm graphite and ivory, honey accent, sage for progress.

## 2. Color tokens

Defined once in `src/app/globals.css` — `:root` (dark) and
`:root[data-theme="light"]` — and exposed to Tailwind via `@theme inline`.
**Components use tokens only — never raw hex**, so both themes work
automatically. A `light:` Tailwind variant exists for the rare
theme-specific tweak (e.g. which toggle icon shows).

| Token | Hex | Use |
|---|---|---|
| `background` | `#17140f` | page: warm graphite |
| `surface` | `#201c16` | sheets: cards, figures, sidebar, chart |
| `surface-raised` | `#2a251d` | hover / raised areas |
| `foreground` | `#f1e9dc` | text: ivory |
| `muted` | `#a99e8d` | secondary text (≈6.9:1 on background) |
| `border` | `#3a3329` | borders, dividers |
| `grid` | `#221e18` | faint grid lines (planning paper, chart columns) |
| `accent` | `#e8a33d` | **honey** — the brand: primary button, open modules, milestone diamonds, logo |
| `accent-foreground` | `#1e1609` | text on honey |
| `accent-soft` | `#33270f` | honey tint: hover rows, callout background |
| `sage` | `#8cc2a8` | progress: "Ви тут" line, completed lessons |
| `sage-soft` | `#1f3029` | sage tint |
| `risk-1..3` | warm clay ramp | ordinal scale (risk matrix) only |

Light theme values (all text pairs ≥ 4.5:1): background `#f7f2e9`, surface
`#fffcf6`, foreground `#241d14`, muted `#6b5f4f`, border `#e2d7c5`, accent
`#94540a` (darker honey so it works as text), accent-foreground `#fffcf6`,
accent-soft `#f6e6c6`, sage `#3b735b`.

Rules:
- Honey is the only CTA color. Sage marks position/progress — never a button.
- Ordinal/status colors always come with a text label or legend.
- Graph-paper background: utility class `.bg-graph` (24px grid in `grid`) —
  hero and course chart only, never behind body text.

## 3. Typography

**Fixel** by MacPaw (Ukrainian typeface, SIL OFL — `src/fonts/fixel/OFL.txt`),
self-hosted via `next/font/local` in `src/fonts/index.ts`.

| Role | Cut | Utility |
|---|---|---|
| Headings, hero, section titles, figure leads, module names, numbers | Fixel Display 600 (500 available) | `font-display` |
| Body and UI | Fixel Text 400 / 500 / 600 | `font-sans` (default) |

Scale:
- Hero h1: 40px → `sm:text-6xl` → `lg:76px`, leading 1.02, tracking −0.03em, max 13ch
- Section heading (`<SectionHeading>`): 30 → 34px
- Lesson h1: 34px → 48px (≥640px); lesson h2: 28px — set in `.lesson-body`
- Lesson body: 17px, line-height 1.7, max line length **70ch**
- Small labels: 13–15px, **sentence case**, `text-muted`

Typographic don'ts (they read as generated/templated):
- no ALL-CAPS tracked "eyebrow" labels above headings;
- no meta strings joined with middle dots («A · B · C»);
- no "→" appended to buttons/links (arrows only where they *mean* direction,
  e.g. cause → fix, axis labels, and the prev/next lesson cards —
  `LessonNavCard` puts an arrow icon on the side the reader is going, at the
  author's request, so the card reads as navigation at a glance);
- no single accented word inside a headline.

## 4. Layout & shape

- Content width `max-w-[1200px]`, side padding `px-4 sm:px-8`. Header/footer full width.
- Home: hero (headline left, intro + actions right) → Gantt program → two
  "label column + content" sections (`lg:grid-cols-[4fr_7fr]`).
- Lesson page: sticky left sidebar 300px (`surface`) with the module track,
  content with `<Split>` rows (text left, figure right from `xl` = 1280px).
- Corners: **4px** for sheets/cards/figures/callouts (`rounded-[4px]`), 6px
  buttons (`rounded-md`), 2–3px bars and diamonds. No pill-shaped cards.
- Borders, not shadows. No gradient washes.

## 5. Components (reuse, don't re-invent)

| Component | File | Use |
|---|---|---|
| `Logo`, `MilestoneMark` | `src/components/logo.tsx` | brand; the honey diamond is reused as the milestone symbol everywhere |
| `ButtonLink` (`primary` / `text`) | `src/components/ui.tsx` | primary = honey button; text = underlined link-button |
| `SectionHeading` | `src/components/ui.tsx` | section titles |
| `ThemeToggle` | `src/components/theme-toggle.tsx` (+ `theme.ts`) | header sun/moon switch; no React state, CSS shows the icon |
| `LessonNavCard` | `src/components/lesson-nav-card.tsx` | prev/next lesson links with a direction arrow |
| `lessonsLabel(n)` | `src/components/ui.tsx` | Ukrainian plural «урок/уроки/уроків» |
| `CourseGantt` | `src/components/course-gantt.tsx` | program as Gantt chart (≥1024px) / list (narrower), driven by `src/content/course.ts` |
| `Figure` | `src/components/lesson/figure.tsx` | frame for lesson illustrations: small title, display lead, visual, caption |
| `Split`, `Columns`, `Callout` | `src/components/lesson/split.tsx` | lesson layout helpers |

Lesson illustrations are server components in `src/components/lesson/`,
registered in `src/mdx-components.tsx`. Inside a `Figure`, responsive classes
use **container queries** (`@md:`, `@xl:`, `@2xl:`). SVG colors via
`style={{ fill/stroke: "var(--token)" }}`; labels ≥15px in viewBox units;
`role="img"` + Ukrainian `aria-label`. Long words in narrow cells:
`minmax(0,1fr)` columns + `hyphens-auto [overflow-wrap:anywhere]`.

## 6. Lesson authoring pattern (MDX)

```mdx
# Lesson title

Intro paragraph (full width, 70ch).

<Split>

## Section heading

Text the illustration explains…

<SomeFigure />

</Split>
```

- Every illustration sits next to the text it explains (inside `<Split>`).
- Module opener: `<Split>` with intro + `<Callout title="Після завершення цього модуля ви зможете">`.
- Module closer: `<Split>` with summary + `<Callout title="Ключові висновки">`.
- Long lists without a figure → `<Columns>`.
- «ялинки» quotes, «проєкт» spelling, lowercase after colon in list items.
- Formulas: KaTeX via `remark-math` — inline `$r$`, block `$$ … $$`. Keep each
  block formula short enough for a phone (split long chains into separate
  blocks); `.katex-display` scrolls horizontally as a safety net.
- Lessons are for understanding, not drilling: start from a question or
  example, put formulas in `<FormulaNote>` (collapsed by default) unless the
  author wants them visible.
- A module's running example with numbers lives in `src/content/examples/`
  (e.g. `game-studio.ts` for module 4): figures import the data and compute
  values from it, so text, charts and calculators never disagree. Check the
  numbers you quote in MDX against it.
- Interactive figures (e.g. `PresentValueCalculator`) are client components
  (`"use client"`) inside a `Figure`: sliders/inputs with visible labels,
  validated input with an inline message, results with `aria-live`, numbers
  formatted with `Intl.NumberFormat("uk-UA")`. Answer one question and say
  the result in a sentence, not as a list of raw numbers.

## 7. Motion

- One orchestrated moment: Gantt bars draw in on page load (`animate-draw`,
  staggered `animationDelay`). Plus the flow dots in `ProjectAnatomy`.
- No fade-in-on-scroll per section, no hover lifts. Hover = color/border
  change, `duration-200`.
- `prefers-reduced-motion` disables animation globally (`globals.css`).
- Focus: global 2px honey outline, offset 3px — never remove.

## 8. Copy

Plain verbs, sentence case, no filler. Never show a bare abbreviation:
expand it at first mention in the text *and* on any figure that can be read
on its own (Ukrainian name first, then e.g. «PI (Profitability Index)»). Buttons say what happens
(«Почати з модуля 1», «Відкрити програму»). Don't promise features that aren't
built without marking them («Завдання модуля — скоро»). Never invent
testimonials or numbers.

## 9. Pre-delivery checklist

- [ ] Tokens only; checked in **both** themes; honey = action, sage = progress
- [ ] Headings `font-display`, body Fixel Text; no all-caps labels, no `·` meta, no `→` on buttons
- [ ] 375px, 768px, 1280px, 1440px — `document.documentElement.scrollWidth` equals viewport width
- [ ] Focus visible; hover transitions ≤ 300ms; reduced motion respected
- [ ] Text contrast ≥ 4.5:1; meaning never by color alone
- [ ] After editing `globals.css` locally: stop dev, `rm -rf .next`, restart (Turbopack may serve stale CSS)
