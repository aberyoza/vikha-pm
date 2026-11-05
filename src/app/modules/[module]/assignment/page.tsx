import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AfterReleaseGame } from "@/components/assignment/after-release-game";
import { AgileGame } from "@/components/assignment/agile-game";
import { ApproachesGame } from "@/components/assignment/approaches-game";
import { BudgetGame } from "@/components/assignment/budget-game";
import { FirstDayGame } from "@/components/assignment/first-day-game";
import { AssignmentNeighbours } from "@/components/assignment/game-kit";
import { GovernanceGame } from "@/components/assignment/governance-game";
import { InvestmentCommitteeGame } from "@/components/assignment/investment-committee-game";
import { PrinciplesWeekGame } from "@/components/assignment/principles-week-game";
import { QualityGame } from "@/components/assignment/quality-game";
import { RiskGame } from "@/components/assignment/risk-game";
import { ScheduleGame } from "@/components/assignment/schedule-game";
import { ScopeGame } from "@/components/assignment/scope-game";
import { StakeholdersGame } from "@/components/assignment/stakeholders-game";
import { TeamGame } from "@/components/assignment/team-game";
import { PaidGate } from "@/components/paid-gate";
import { Paywall } from "@/components/paywall";
import { ASSIGNMENTS, assignmentHref } from "@/content/assignments";
import { modules, publishedModules } from "@/content/course";
import { OPEN_GRAPH } from "@/content/site";
import { isLockedModule } from "@/lib/paywall";

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
  const description = `Завдання модуля ${m.number} у формі короткої гри: ${a.title.toLowerCase()}, близько ${a.minutes} хвилин.`;
  return {
    title: `${a.title}: завдання модуля ${m.number}`,
    description,
    alternates: { canonical: assignmentHref(slug) },
    ...(isLockedModule(m.number) && { robots: { index: false, follow: true } }),
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
  const withGame = publishedModules.filter((x) => ASSIGNMENTS[x.slug]);
  const at = withGame.findIndex((x) => x.slug === slug);
  const prevAssignment = withGame[at - 1];
  const nextAssignment = withGame[at + 1];

  const game = (
    <AssignmentNeighbours
      prevHref={prevAssignment && assignmentHref(prevAssignment.slug)}
      nextHref={nextAssignment && assignmentHref(nextAssignment.slug)}
    >
      {slug === "module-01" && <FirstDayGame nextHref={nextHref} />}
      {slug === "module-02" && <PrinciplesWeekGame nextHref={nextHref} />}
      {slug === "module-03" && <ApproachesGame nextHref={nextHref} />}
      {slug === "module-04" && <InvestmentCommitteeGame nextHref={nextHref} />}
      {slug === "module-05" && <StakeholdersGame nextHref={nextHref} />}
      {slug === "module-06" && <GovernanceGame nextHref={nextHref} />}
      {slug === "module-07" && <ScopeGame nextHref={nextHref} />}
      {slug === "module-08" && <ScheduleGame nextHref={nextHref} />}
      {slug === "module-09" && <BudgetGame nextHref={nextHref} />}
      {slug === "module-10" && <TeamGame nextHref={nextHref} />}
      {slug === "module-11" && <RiskGame nextHref={nextHref} />}
      {slug === "module-12" && <QualityGame nextHref={nextHref} />}
      {slug === "module-13" && <AgileGame nextHref={nextHref} />}
      {slug === "module-14" && <AfterReleaseGame />}
    </AssignmentNeighbours>
  );

  return (
    <main className="mx-auto max-w-[880px] px-4 py-10 sm:px-8 md:py-14">
      <Link
        href={`/modules/${m.slug}/${lastLesson.slug}`}
        className="text-[15px] text-muted transition-colors duration-200 hover:text-foreground"
      >
        Модуль {m.number}. {m.title}
      </Link>
      <h1 className="mt-3 mb-8 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Завдання модуля</h1>
      {isLockedModule(m.number) ? (
        <Suspense fallback={<p className="text-muted">Завантажуємо завдання…</p>}>
          <PaidGate paywall={<Paywall />}>{game}</PaidGate>
        </Suspense>
      ) : (
        game
      )}
    </main>
  );
}
