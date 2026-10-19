# Віха — Design System (MASTER)

Global source of truth for how the site looks. Every new page, module,
lesson or component follows this file. Page-specific deviations go to
`design-system/vikha/pages/<page>.md` and override this file only for that page.

Generated with the `ui-ux-pro-max` skill (query: *online course e-learning
long-form reading calm professional*, dials variance 3 / motion 3 /
density 3), then adjusted by hand — see "Deviations from the skill".

## 1. Direction

- **Style:** Minimalism & Swiss, editorial. Content first, generous white
  space, hairline borders instead of shadows, clear type hierarchy.
- **Product:** free Ukrainian-language PM course for adults (beginner →
  advanced). Tone: calm, trustworthy, practical. Not playful, not "kids
  education", no gamification visuals.
- **Brand motif:** the milestone diamond ◆ (a milestone on a Gantt chart;
  «віха» = milestone). Used in the logo and the course path on the home page.

## 2. Color tokens

Defined in `src/app/globals.css` (`:root` + dark override) and exposed to
Tailwind via `@theme inline`. **Components use tokens only — never raw hex.**

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#fbfaf7` | `#141412` | page (warm paper) |
| `surface` | `#ffffff` | `#1c1c19` | cards, figures, sidebar, alternating sections |
| `foreground` | `#1c1b19` | `#ecebe6` | text |
| `muted` | `#6b675f` | `#a19d93` | secondary text, labels (≥4.5:1 on background) |
| `border` | `#e5e1d8` | `#2e2d29` | hairlines, card borders |
| `accent` | `#0f766e` | `#2dd4bf` | brand teal: primary buttons, links, active states, key marks |
| `accent-foreground` | `#ffffff` | `#0b1f1d` | text on `accent` |
| `accent-soft` | `#e6f2ef` | `#15302c` | active nav item, chips, light highlight |
| `warm` | `#c2410c` | `#fb923c` | **sparingly**: progress, "you are here", achievement |
| `warm-soft` | `#fdf0e7` | `#3a2418` | background for the `warm` highlight |
| `risk-1..3` | warm ramp | warm ramp | ordinal scale (risk matrix) only |

Rules:
- One accent per view does the talking. `warm` never competes with `accent`
  for CTAs — it marks position/progress only.
- Dark mode is designed, not inverted: its own tones per token. Test both.
- Status/ordinal colors always come with a text label (never color alone).

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Headings, hero, section titles, figure leads, numbers in lists | **Source Serif 4** (`font-serif`) | 600 weight, `tracking-tight` |
| Body text and all UI | **Inter** (`font-sans`, default) | |

Both loaded via `next/font/google` with `latin` + `cyrillic` subsets in
`src/app/layout.tsx`. Any new font **must** support Cyrillic.

Scale:
- Hero h1: `text-4xl` → `sm:text-6xl`, leading 1.1
- Section heading (`<SectionHeading>`): `text-3xl` → `sm:text-4xl`
- Lesson h1: 2rem → 2.5rem (≥640px); lesson h2: 1.75rem (set in `.lesson-body`)
- Lesson body: 17px (1.0625rem), line-height 1.7, max line length **70ch**
- Eyebrow labels (`<Eyebrow>`): `text-xs uppercase tracking-wider text-muted`
  — **never put numbers next to Cyrillic «з» in uppercase** (reads as "3");
  counters like "Урок 2 з 4" stay in normal case.

## 4. Layout & spacing

- Spacious density. Sections: `py-16 sm:py-20/24`. Content width
  `max-w-6xl`, side padding `px-4 sm:px-6`.
- Header/footer are full-width; home sections are centered `max-w-6xl`.
  Sections alternate `background` / `surface` with a top hairline.
- Lesson page: sticky left sidebar (280px, `surface`) + content. Text-only
  blocks are capped at 70ch; `<Split>` rows use the full width (text left,
  figure right from `xl` = 1280px; stacked below that).
- Radius: `rounded-lg` controls (8px), `rounded-xl` cards/figures (12px),
  `rounded-2xl` hero cards/CTA band, `rounded-full` chips and step numbers.
- No drop shadows (except `shadow-sm` on chips over colored cells).

## 5. Components (reuse, don't re-invent)

| Component | File | Use |
|---|---|---|
| `Logo`, `MilestoneMark` | `src/components/logo.tsx` | header/footer brand |
| `ButtonLink` (primary / secondary) | `src/components/ui.tsx` | all CTAs; h-11, rounded-lg |
| `Eyebrow`, `SectionHeading` | `src/components/ui.tsx` | every home-style section starts with these |
| `lessonsLabel(n)` | `src/components/ui.tsx` | Ukrainian plural «урок/уроки/уроків» |
| `MilestonePath` | `src/components/milestone-path.tsx` | course progress visual |
| `Figure` | `src/components/lesson/figure.tsx` | frame for every lesson illustration: eyebrow title, serif lead, visual, caption |
| `Split` | `src/components/lesson/split.tsx` | lesson text + illustration side by side (last child = illustration) |
| `Columns` | same | long lists in two columns on wide screens |
| `Callout` | same | outcomes, key takeaways (accent border, `accent-soft` tint) |

Lesson illustrations are server components in `src/components/lesson/`,
registered in `src/mdx-components.tsx`. Inside a `Figure`, responsive
classes use **container queries** (`@md:`, `@xl:`, `@2xl:`) — the figure may
sit in a half-width column — not viewport breakpoints.

SVG illustrations: colors via `style={{ fill/stroke: "var(--token)" }}`,
labels ≥15px in viewBox units, `role="img"` + Ukrainian `aria-label`.

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

- Every illustration sits **next to the text it explains** (inside `<Split>`).
- Module opener lesson: `<Split>` with intro text + `<Callout title="Після
  завершення цього модуля ви зможете">`.
- Module closer: `<Split>` with summary + `<Callout title="Ключові висновки">`.
- Long numbered/bulleted lists without a figure → `<Columns>`.
- Use Ukrainian «ялинки» quotes, «проєкт» spelling, lowercase after colon in list items.

## 7. Interaction & motion

- Hover: color/border transitions `duration-200`; arrows nudge
  `group-hover:translate-x-1`. No scale/jump effects.
- Focus: global 2px `accent` outline, offset 3px (in `globals.css`) — never remove.
- Motion is subtle and meaningful only (e.g. flow dots in `ProjectAnatomy`).
  `prefers-reduced-motion` disables all animation globally.
- Icons: inline SVG, 24px grid, stroke 1.8, `currentColor`. **No emoji as icons.**

## 8. Deviations from the skill's output (and why)

| Skill suggested | We use | Why |
|---|---|---|
| Baloo 2 + Comic Neue (kids/playful) | Source Serif 4 + Inter | adult professional audience; both support Cyrillic |
| Primary `#0D9488` | `#0f766e` | `#0D9488` with white text fails AA (3.7:1) |
| Teal-tinted background `#F0FDFA`, teal borders | warm paper neutrals | calmer for long reading; borders stay recessive |
| Orange CTA accent `#EA580C` | `warm` for progress only | one CTA color (teal) keeps hierarchy clear |
| Testimonials carousel | none | no real testimonials yet — never fabricate them |
| GSAP scroll reveal | none | not needed for reading; keep JS minimal |

## 9. Pre-delivery checklist

- [ ] Only tokens, no raw hex in components
- [ ] Headings serif, body Inter; new fonts support Cyrillic
- [ ] Light **and** dark mode checked
- [ ] 375px, 768px, 1280px, 1440px — no horizontal scroll
- [ ] Focus visible on every interactive element; hover transitions 150–300ms
- [ ] Text contrast ≥ 4.5:1; meaning never by color alone
- [ ] Illustrations placed in `<Split>` beside their text; figure internals use container queries
- [ ] After editing `globals.css` locally: `rm -rf .next` and restart dev (Turbopack may serve stale CSS)
