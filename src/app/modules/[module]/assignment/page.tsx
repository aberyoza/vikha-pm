import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApproachesGame } from "@/components/assignment/approaches-game";
import { FirstDayGame } from "@/components/assignment/first-day-game";
import { PrinciplesWeekGame } from "@/components/assignment/principles-week-game";
import { ASSIGNMENTS, assignmentHref } from "@/content/assignments";
import { modules, publishedModules } from "@/content/course";
import { OPEN_GRAPH } from "@/content/site";

type Props = PageProps<"/modules/[module]/assignment">;

export function generateStaticParams() {
  return Object.keys(ASSIGNMENTS).map((module) => ({ module }));
}

export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: slug } = await params;
  const a = ASSIGNMENTS[slug];
  const m = modules.find((x) => x.slug === slug);
  if (!a || !m) return {};
  const description = `Завдання модуля ${m.number} у формі короткої гри: ${a.title.toLowerCase()}, близько 10 хвилин.`;
  return {
    title: `${a.title}: завдання модуля ${m.number}`,
    description,
    alternates: { canonical: assignmentHref(slug) },
    openGraph: { ...OPEN_GRAPH, type: "article", title: a.title, description, url: assignmentHref(slug) },
  };
}

export default async function AssignmentPage({ params }: Props) {
  const { module: slug } = await params;
  const m = publishedModules.find((x) => x.slug === slug);
  if (!m || !ASSIGNMENTS[slug]) notFound();

  const next = publishedModules.find((x) => x.number === m.number + 1);
  const nextHref = next ? `/modules/${next.slug}/${next.lessons[0].slug}` : "/#program";
  const lastLesson = m.lessons[m.lessons.length - 1];

  return (
    <main className="mx-auto max-w-[880px] px-4 py-10 sm:px-8 md:py-14">
      <Link
        href={`/modules/${m.slug}/${lastLesson.slug}`}
        className="text-[15px] text-muted transition-colors duration-200 hover:text-foreground"
      >
        Модуль {m.number}. {m.title}
      </Link>
      <h1 className="mt-3 mb-8 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Завдання модуля</h1>
      {slug === "module-01" && <FirstDayGame nextHref={nextHref} />}
      {slug === "module-02" && <PrinciplesWeekGame nextHref={nextHref} />}
      {slug === "module-03" && <ApproachesGame nextHref={nextHref} />}
    </main>
  );
}
