import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findLesson, publishedModules } from "@/content/course";

type Props = PageProps<"/modules/[module]/[lesson]">;

export function generateStaticParams() {
  return publishedModules.flatMap((m) =>
    m.lessons.map((l) => ({ module: m.slug, lesson: l.slug })),
  );
}

// Every lesson is prerendered from generateStaticParams, so blocking on
// params only waits for static HTML.
export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const found = findLesson(moduleSlug, lessonSlug);
  return found ? { title: found.lesson.title } : {};
}

export default async function LessonPage({ params }: Props) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const found = findLesson(moduleSlug, lessonSlug);
  if (!found) notFound();

  const { module: courseModule, lesson, prev, next } = found;
  const { default: Content } = await import(
    `@/content/modules/${courseModule.slug}/${lesson.slug}.mdx`
  );

  const index = courseModule.lessons.findIndex((l) => l.slug === lesson.slug);
  const lessonHref = (slug: string) => `/modules/${courseModule.slug}/${slug}`;

  return (
    <div className="grid md:grid-cols-[280px_1fr]">
      <aside className="border-b border-border bg-surface px-4 py-6 sm:px-6 md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0 md:py-10">
        <Link
          href="/#program"
          className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          ← Програма курсу
        </Link>
        <p className="mt-8 text-xs font-medium uppercase tracking-wider text-muted">
          Модуль {courseModule.number}
        </p>
        <p className="mt-1 font-serif text-xl font-semibold leading-snug">
          {courseModule.title}
        </p>
        <nav className="mt-6" aria-label="Уроки модуля">
          <ol className="relative space-y-1 before:absolute before:top-4 before:bottom-4 before:left-[19px] before:w-px before:bg-border">
            {courseModule.lessons.map((l, i) => {
              const current = l.slug === lesson.slug;
              return (
                <li key={l.slug} className="relative">
                  <Link
                    href={lessonHref(l.slug)}
                    aria-current={current ? "page" : undefined}
                    className="group flex items-start gap-3 rounded-lg px-2 py-2 text-sm transition-colors duration-200 hover:bg-background aria-[current=page]:bg-accent-soft"
                  >
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs tabular-nums ${
                        current
                          ? "border-accent bg-accent font-semibold text-accent-foreground"
                          : "border-border bg-surface text-muted"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`pt-0.5 ${current ? "font-medium text-accent" : "text-muted group-hover:text-foreground"}`}
                    >
                      {l.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      <article className="min-w-0 px-4 py-10 sm:px-8 xl:px-12">
        <p className="mb-4 text-sm text-muted">
          Модуль {courseModule.number} · Урок {index + 1} з{" "}
          {courseModule.lessons.length}
        </p>
        <div className="lesson-body prose max-w-6xl">
          <Content />
        </div>

        <nav
          aria-label="Навігація уроками"
          className="mt-16 grid max-w-6xl gap-4 border-t border-border pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={lessonHref(prev.slug)}
              className="group rounded-xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-accent"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                ← Попередній урок
              </span>
              <span className="mt-1 block font-medium group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={lessonHref(next.slug)}
              className="group rounded-xl border border-border bg-surface p-5 text-right transition-colors duration-200 hover:border-accent"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                Наступний урок →
              </span>
              <span className="mt-1 block font-medium group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/#program"
              className="group rounded-xl border border-accent bg-accent-soft p-5 text-right transition-colors duration-200"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                Модуль пройдено
              </span>
              <span className="mt-1 block font-medium">
                Повернутися до програми →
              </span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
