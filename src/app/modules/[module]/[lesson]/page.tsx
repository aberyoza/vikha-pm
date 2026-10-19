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

  return (
    <div className="grid md:grid-cols-[260px_1fr]">
      <aside className="border-b border-border px-4 py-6 sm:px-6 md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0 md:py-10">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← Програма курсу
        </Link>
        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
          Модуль {courseModule.number}
        </p>
        <p className="mt-1 font-medium">{courseModule.title}</p>
        <nav className="mt-4">
          <ol className="space-y-1 text-sm">
            {courseModule.lessons.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/modules/${courseModule.slug}/${l.slug}`}
                  aria-current={l.slug === lesson.slug ? "page" : undefined}
                  className="block rounded px-2 py-1.5 text-muted hover:text-foreground aria-[current=page]:bg-accent-soft aria-[current=page]:font-medium aria-[current=page]:text-accent"
                >
                  {l.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <article className="min-w-0 px-4 py-10 sm:px-8 xl:px-12">
        <div className="lesson-body prose max-w-6xl">
          <Content />
        </div>

        <nav className="mt-12 flex max-w-6xl justify-between gap-4 border-t border-border pt-6">
          {prev ? (
            <Link
              href={`/modules/${courseModule.slug}/${prev.slug}`}
              className="text-sm text-muted hover:text-foreground"
            >
              ← Попередній урок
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/modules/${courseModule.slug}/${next.slug}`}
              className="text-sm font-medium text-accent hover:opacity-80"
            >
              Наступний урок →
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
