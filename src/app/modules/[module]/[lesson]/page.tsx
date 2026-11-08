import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonPager, type PagerTarget } from "@/components/lesson-pager";
import { ModuleLayout } from "@/components/module-nav";
import { PaidGate } from "@/components/paid-gate";
import { Paywall } from "@/components/paywall";
import { findLesson, publishedModules } from "@/content/course";
import { OPEN_GRAPH } from "@/content/site";
import { jsonLd, lessonJsonLd } from "@/content/structured-data";
import { ASSIGNMENTS, assignmentHref } from "@/content/assignments";
import { isLockedModule } from "@/lib/paywall";

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
    description: found.lesson.description,
    alternates: { canonical: path },
    ...(isLockedModule(found.module.number) && { robots: { index: false, follow: true } }),
    openGraph: { ...OPEN_GRAPH, type: "article", title: found.lesson.title, description: found.lesson.description, url: path },
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
  const total = courseModule.lessons.length;
  const lessonHref = (slug: string) => `/modules/${courseModule.slug}/${slug}`;
  const assignment = ASSIGNMENTS[courseModule.slug];
  const previousModule = publishedModules.find((m) => m.number === courseModule.number - 1);

  const back: PagerTarget | undefined = prev
    ? { href: lessonHref(prev.slug), label: "Назад", title: prev.title }
    : previousModule && ASSIGNMENTS[previousModule.slug]
      ? { href: assignmentHref(previousModule.slug), label: "Назад", title: `Завдання модуля ${previousModule.number}` }
      : undefined;
  const forward: PagerTarget = next
    ? { href: lessonHref(next.slug), label: `Далі: урок ${index + 2} з ${total}`, title: next.title }
    : assignment
      ? { href: assignmentHref(courseModule.slug), label: `Далі: завдання модуля, ${assignment.minutes} хв`, title: assignment.title }
      : { href: "/#program", label: "Уроки модуля пройдено", title: "Повернутися до програми" };

  const body = (
    <>
      <div className="lesson-body prose max-w-none">
        <Content />
      </div>
      <LessonPager prev={back} next={forward} />
    </>
  );

  return (
    <ModuleLayout module={courseModule} current={lesson.slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(lessonJsonLd(courseModule, lesson)) }} />
      {isLockedModule(courseModule.number) ? (
        <Suspense
          fallback={
            <div className="lesson-body prose max-w-none">
              <h1>{lesson.title}</h1>
              <p className="text-muted">Завантажуємо урок…</p>
            </div>
          }
        >
          <PaidGate
            paywall={
              <div className="lesson-body prose max-w-none">
                <h1>{lesson.title}</h1>
                <p>{lesson.description}</p>
                <Paywall />
              </div>
            }
          >
            {body}
          </PaidGate>
        </Suspense>
      ) : (
        body
      )}
    </ModuleLayout>
  );
}
