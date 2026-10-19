import Link from "next/link";
import { modules, publishedModules } from "@/content/course";

const audience = [
  {
    title: "Новачкам",
    text: "Хочете зрозуміти, як працюють проєкти, і зробити перші кроки в професії.",
  },
  {
    title: "Тим, хто вже керує",
    text: "Ведете проєкти інтуїтивно й хочете системи, термінів і перевірених практик.",
  },
  {
    title: "Досвідченим",
    text: "Хочете впорядкувати знання за сучасними редакціями PMBOK 7 і 8.",
  },
];

function lessonHref(moduleSlug: string, lessonSlug: string) {
  return `/modules/${moduleSlug}/${lessonSlug}`;
}

export default function Home() {
  const first = publishedModules[0];

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-16 sm:py-24">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Курс з управління проєктами
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Безкоштовно, українською, на основі PMBOK 7 і 8. Від перших кроків до
          впевненого управління проєктами: 14 модулів із практичними завданнями.
        </p>
        {first && (
          <Link
            href={lessonHref(first.slug, first.lessons[0].slug)}
            className="mt-8 inline-flex h-11 items-center rounded-md bg-accent px-6 font-medium text-accent-foreground hover:opacity-90"
          >
            Почати навчання
          </Link>
        )}
      </section>

      <section className="border-t border-border py-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Для кого цей курс
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {audience.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-12">
        <h2 className="text-2xl font-semibold tracking-tight">Програма</h2>
        <ol className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
          {modules.map((m) => {
            const isOpen = m.published && m.lessons.length > 0;
            return (
              <li key={m.slug} className="flex items-start gap-4 p-5">
                <span className="w-8 shrink-0 pt-0.5 text-sm tabular-nums text-muted">
                  {String(m.number).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  {isOpen ? (
                    <Link
                      href={lessonHref(m.slug, m.lessons[0].slug)}
                      className="font-medium hover:text-accent"
                    >
                      {m.title}
                    </Link>
                  ) : (
                    <span className="font-medium text-muted">{m.title}</span>
                  )}
                  <p className="mt-1 text-sm text-muted">{m.description}</p>
                </div>
                {!isOpen && (
                  <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                    Скоро
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
