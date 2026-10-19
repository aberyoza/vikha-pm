import Link from "next/link";
import type { ReactNode } from "react";
import { MilestonePath } from "@/components/milestone-path";
import { ButtonLink, Eyebrow, SectionHeading, lessonsLabel } from "@/components/ui";
import { modules, publishedModules } from "@/content/course";

const icon = (path: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    className="size-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {path}
  </svg>
);

const steps = [
  {
    title: "Читаєте урок",
    text: "Короткі тексти зі схемами: кожне поняття пояснено на прикладі.",
  },
  {
    title: "Виконуєте завдання",
    text: "Наприкінці модуля — практика на вашому власному проєкті.",
  },
  {
    title: "Отримуєте фідбек",
    text: "Автор курсу перевіряє відповідь і коментує, що покращити.",
  },
];

const audience = [
  {
    title: "Новачкам",
    text: "Хочете зрозуміти, як працюють проєкти, і зробити перші кроки в професії.",
    icon: icon(
      <>
        <path d="M12 21v-9" />
        <path d="M12 12c0-4 3-7 8-7 0 5-3 7-8 7Z" />
        <path d="M12 14c0-3-2.5-5-7-5 0 4 2.5 5 7 5Z" />
      </>,
    ),
  },
  {
    title: "Тим, хто вже керує",
    text: "Ведете проєкти інтуїтивно й хочете системи, термінів і перевірених практик.",
    icon: icon(
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
      </>,
    ),
  },
  {
    title: "Досвідченим",
    text: "Хочете впорядкувати знання за сучасними редакціями PMBOK 7 і 8.",
    icon: icon(
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 13 9 5 9-5" />
      </>,
    ),
  },
];

function lessonHref(moduleSlug: string, lessonSlug: string) {
  return `/modules/${moduleSlug}/${lessonSlug}`;
}

export default function Home() {
  const first = publishedModules[0];
  const startHref = first ? lessonHref(first.slug, first.lessons[0].slug) : "/#program";

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow>Безкоштовний курс · українською</Eyebrow>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            Управління проєктами: від першої віхи до результату
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Курс на основі PMBOK 7 і 8 — від перших кроків до впевненого
            управління проєктами. Тексти, схеми й практичні завдання з
            фідбеком.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={startHref}>Почати навчання</ButtonLink>
            <ButtonLink href="/#program" variant="secondary">
              Переглянути програму
            </ButtonLink>
          </div>
        </div>
        <MilestonePath />
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Eyebrow>Як проходить навчання</Eyebrow>
          <SectionHeading>Три кроки в кожному модулі</SectionHeading>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title}>
                <span className="font-serif text-4xl font-semibold text-accent">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Eyebrow>Для кого</Eyebrow>
        <SectionHeading>Курс для різного рівня досвіду</SectionHeading>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {audience.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <span className="text-accent">{item.icon}</span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="program"
        className="scroll-mt-4 border-t border-border bg-surface"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Eyebrow>Програма</Eyebrow>
          <SectionHeading>{modules.length} модулів курсу</SectionHeading>
          <ol className="mt-10 divide-y divide-border border-y border-border">
            {modules.map((m) => {
              const isOpen = m.published && m.lessons.length > 0;
              const body = (
                <>
                  <span
                    className={`w-12 shrink-0 font-serif text-2xl font-semibold tabular-nums ${isOpen ? "text-accent" : "text-muted/60"}`}
                  >
                    {String(m.number).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-lg font-semibold ${isOpen ? "" : "text-muted"}`}
                    >
                      {m.title}
                    </span>
                    <span className="mt-1 block leading-relaxed text-muted">
                      {m.description}
                    </span>
                  </span>
                  {isOpen ? (
                    <span className="shrink-0 pt-1 text-sm text-accent">
                      {lessonsLabel(m.lessons.length)}{" "}
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted">
                      Скоро
                    </span>
                  )}
                </>
              );
              return (
                <li key={m.slug}>
                  {isOpen ? (
                    <Link
                      href={lessonHref(m.slug, m.lessons[0].slug)}
                      className="group flex items-start gap-4 py-6 transition-colors duration-200 hover:bg-accent-soft/40"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-4 py-6">{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-accent p-8 text-accent-foreground sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight">
              Почніть з першої віхи
            </h2>
            <p className="mt-2 opacity-90">
              Модуль 1 вже відкритий — без реєстрації.
            </p>
          </div>
          <Link
            href={startHref}
            className="inline-flex h-11 shrink-0 items-center rounded-lg bg-accent-foreground px-5 font-medium text-accent transition-opacity duration-200 hover:opacity-90"
          >
            Почати навчання
          </Link>
        </div>
      </section>
    </main>
  );
}
