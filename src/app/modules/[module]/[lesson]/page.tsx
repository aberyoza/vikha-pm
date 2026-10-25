import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonNavCard } from "@/components/lesson-nav-card";
import { findLesson, modules, publishedModules } from "@/content/course";
import { OPEN_GRAPH } from "@/content/site";

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
  if (!found) return {};
  const path = `/modules/${moduleSlug}/${lessonSlug}`;
  return {
    title: found.lesson.title,
    description: found.module.description,
    alternates: { canonical: path },
    openGraph: { ...OPEN_GRAPH, type: "article", title: found.lesson.title, description: found.module.description, url: path },
  };
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
    <div className="grid md:grid-cols-[300px_1fr]">
      <aside className="border-b border-border bg-surface px-4 py-7 sm:px-7 md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0 md:py-9">
        <Link
          href="/#program"
          className="text-[15px] text-muted transition-colors duration-200 hover:text-foreground"
        >
          Програма курсу
        </Link>
        <p className="mt-7 font-display text-[22px] leading-tight font-semibold tracking-tight">
          {courseModule.title}
        </p>
        <p className="mt-1 text-sm text-muted">
          Модуль {courseModule.number} з {modules.length}
        </p>

        <nav className="mt-7" aria-label="Уроки модуля">
          <ol className="relative before:absolute before:top-3 before:bottom-3 before:left-[6px] before:w-0.5 before:bg-border">
            {courseModule.lessons.map((l, i) => {
              const state = i < index ? "done" : i === index ? "now" : "next";
              return (
                <li key={l.slug}>
                  <Link
                    href={lessonHref(l.slug)}
                    aria-current={state === "now" ? "page" : undefined}
                    className={`group relative block py-2 pl-8 text-[15px] transition-colors duration-200 ${
                      state === "now"
                        ? "font-semibold text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute top-[15px] left-px size-3 rounded-full border-2 ${
                        state === "done"
                          ? "border-sage bg-sage"
                          : state === "now"
                            ? "border-accent bg-surface ring-4 ring-accent-soft"
                            : "border-border bg-surface"
                      }`}
                    />
                    {l.title}
                  </Link>
                </li>
              );
            })}
            <li className="relative mt-2 py-2 pl-8 text-[15px] text-foreground">
              <span
                aria-hidden
                className="absolute top-[15px] left-px size-3 rotate-45 rounded-[2px] bg-accent"
              />
              Завдання модуля
              <span className="block text-sm text-muted">Скоро</span>
            </li>
          </ol>
        </nav>
      </aside>

      <article className="min-w-0 px-4 py-10 sm:px-10 md:py-12 xl:px-14">
        <div className="lesson-body prose max-w-6xl">
          <Content />
        </div>

        <nav
          aria-label="Навігація уроками"
          className="mt-16 grid max-w-6xl gap-4 border-t border-border pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <LessonNavCard
              href={lessonHref(prev.slug)}
              label="Попередній урок"
              title={prev.title}
              direction="prev"
            />
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <LessonNavCard
              href={lessonHref(next.slug)}
              label="Наступний урок"
              title={next.title}
              direction="next"
            />
          ) : (
            <LessonNavCard
              href="/#program"
              label="Уроки модуля пройдено"
              title="Повернутися до програми"
              direction="next"
              highlight
            />
          )}
        </nav>
      </article>
    </div>
  );
}
