import Link from "next/link";
import type { ReactNode } from "react";
import { AssignmentMark } from "@/components/assignment-mark";
import { ASSIGNMENTS, assignmentHref } from "@/content/assignments";
import { modules, type CourseModule } from "@/content/course";

// A lesson slug, or the module's assignment.
type Current = string | { assignment: true };

const isAssignment = (c: Current) => typeof c !== "string";

function Track({ module: m, current }: { module: CourseModule; current: Current }) {
  const assignment = ASSIGNMENTS[m.slug];
  const index = typeof current === "string" ? m.lessons.findIndex((l) => l.slug === current) : m.lessons.length;

  return (
    <>
      <Link href="/#program" className="text-[15px] text-muted transition-colors duration-200 hover:text-foreground">
        Програма курсу
      </Link>
      <p className="mt-7 font-display text-[22px] leading-tight font-semibold tracking-tight">{m.title}</p>
      <p className="mt-1 flex justify-between gap-3 text-sm text-muted">
        <span>
          Модуль {m.number} з {modules.length}
        </span>
        {!isAssignment(current) && (
          <span>
            Урок {index + 1} з {m.lessons.length}
          </span>
        )}
      </p>

      <nav className="mt-7" aria-label="Уроки модуля">
        <ol className="relative before:absolute before:top-3 before:bottom-3 before:left-[6px] before:w-0.5 before:bg-border">
          {m.lessons.map((l, i) => {
            const state = i < index ? "done" : i === index ? "now" : "next";
            return (
              <li key={l.slug}>
                <Link
                  href={`/modules/${m.slug}/${l.slug}`}
                  aria-current={state === "now" ? "page" : undefined}
                  className={`group relative block py-2 pl-8 text-[15px] transition-colors duration-200 ${
                    state === "now" ? "font-semibold text-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute top-[15px] left-px size-3 rounded-full border-2 ${
                      state === "done"
                        ? "border-second bg-second"
                        : state === "now"
                          ? "border-accent bg-surface ring-4 ring-accent-soft"
                          : "border-border-strong bg-surface"
                    }`}
                  />
                  {l.title}
                </Link>
              </li>
            );
          })}
          <li className="relative mt-2 text-[15px]">
            {assignment ? (
              <Link
                href={assignmentHref(m.slug)}
                aria-current={isAssignment(current) ? "page" : undefined}
                className={`block py-2 pl-8 transition-colors duration-200 ${
                  isAssignment(current) ? "font-semibold text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                <AssignmentMark slug={m.slug} current={isAssignment(current)} />
                Завдання модуля
                <span className="block text-sm font-normal text-muted">Гра на {assignment.minutes} хвилин</span>
              </Link>
            ) : (
              <span className="block py-2 pl-8 text-muted">
                Завдання модуля
                <span className="block text-sm">Скоро</span>
              </span>
            )}
          </li>
        </ol>
      </nav>
    </>
  );
}

// Page frame of a module: the module's track and one column of content. From
// 1024px the track is a sticky side panel, below that a collapsed line above
// the content, so that the title stays on the first screen of a phone.
export function ModuleLayout({
  module: m,
  current,
  wide,
  children,
}: {
  module: CourseModule;
  current: Current;
  // Games are controls rather than text, so they may take more than a reading line.
  wide?: boolean;
  children: ReactNode;
}) {
  const index = typeof current === "string" ? m.lessons.findIndex((l) => l.slug === current) : -1;
  return (
    <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* The key closes the list after moving to another lesson. */}
      <details key={typeof current === "string" ? current : "assignment"} className="group/track bg-surface lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-medium focus-visible:-outline-offset-2 sm:px-8 [&::-webkit-details-marker]:hidden">
          <span>
            Модуль {m.number}, {isAssignment(current) ? "завдання" : `урок ${index + 1} з ${m.lessons.length}`}
          </span>
          <svg
            viewBox="0 0 24 24"
            className="size-5 shrink-0 text-muted transition-transform duration-200 group-open/track:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <div className="px-4 pt-2 pb-6 sm:px-8">
          <Track module={m} current={current} />
        </div>
      </details>

      <aside
        aria-label="Навігація модуля"
        className="hidden bg-surface px-7 py-9 lg:sticky lg:top-0 lg:block lg:h-dvh lg:overflow-y-auto"
      >
        <Track module={m} current={current} />
      </aside>

      <main className="min-w-0 px-4 pt-10 pb-24 sm:px-12 sm:pt-12">
        <article className={`mx-auto ${wide ? "max-w-[880px]" : "max-w-[720px]"}`}>{children}</article>
      </main>
    </div>
  );
}
