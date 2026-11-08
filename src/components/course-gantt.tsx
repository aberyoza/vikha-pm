import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ASSIGNMENTS } from "@/content/assignments";
import { modules, type CourseModule } from "@/content/course";
import { isLockedModule, paywallEnabled } from "@/lib/paywall";
import { GanttHereLegend, GanttHereLine, ListHere } from "./course-here";
import { MilestoneMark } from "./logo";
import { lessonsLabel } from "./ui";

const LABEL_W = "340px";
const END_W = "56px";
const COLS = modules.length;

const rowGrid: CSSProperties = {
  gridTemplateColumns: `${LABEL_W} repeat(${COLS}, minmax(0, 1fr)) ${END_W}`,
};

const isOpen = (m: CourseModule) => m.published && m.lessons.length > 0;
const href = (m: CourseModule) => `/modules/${m.slug}/${m.lessons[0].slug}`;

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.75} className={`size-3 shrink-0 ${className}`}>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
    </svg>
  );
}

function Row({ m, children }: { m: CourseModule; children: ReactNode }) {
  const className =
    "grid min-h-11 border-b border-grid last:border-b-0 transition-colors duration-200";
  return isOpen(m) ? (
    <Link href={href(m)} style={rowGrid} className={`${className} hover:bg-accent-soft`}>
      {children}
    </Link>
  ) : (
    <div style={rowGrid} className={className}>
      {children}
    </div>
  );
}

// The course program drawn as a Gantt chart: each module is a bar, staggered
// like a project plan; open modules are filled, the rest are dashed outlines.
export function CourseGantt() {
  const outline = modules.map((m) => ({
    slug: m.slug,
    lessons: isOpen(m) ? m.lessons.map((l) => l.slug) : [],
    game: isOpen(m) && !!ASSIGNMENTS[m.slug],
  }));

  return (
    <>
      {/* From 1024px: the chart */}
      <div className="hidden rounded-[4px] border border-border bg-surface lg:block">
        <div
          style={rowGrid}
          className="grid border-b border-border text-[13px] text-muted"
        >
          <span className="py-3 pl-5">Модуль</span>
          {modules.map((m) => (
            <span key={m.slug} className="border-l border-grid py-3 text-center tabular-nums">
              {m.number}
            </span>
          ))}
          <span />
        </div>

        <div className="relative">
          {modules.map((m, i) => {
            const open = isOpen(m);
            const locked = open && isLockedModule(m.number);
            return (
              <Row key={m.slug} m={m}>
                <span
                  style={{ gridRow: 1, gridColumn: 1 }}
                  className={`flex items-baseline gap-3 py-2.5 pl-5 pr-4 text-[15px] ${open ? "font-medium text-foreground" : "text-muted"}`}
                >
                  <b className="min-w-5 font-display font-semibold text-foreground tabular-nums">
                    {m.number}
                  </b>
                  <span className="truncate">{m.title}</span>
                </span>
                {modules.map((_, c) => (
                  <span
                    key={c}
                    style={{ gridRow: 1, gridColumn: c + 2 }}
                    className="border-l border-grid"
                  />
                ))}
                <span
                  style={{
                    gridRow: 1,
                    gridColumn: `${i + 2} / span ${i === COLS - 1 ? 1 : 2}`,
                    animationDelay: `${150 + i * 60}ms`,
                  }}
                  className={`z-10 mx-[3px] flex h-6 origin-left animate-draw items-center self-center rounded-[3px] ${
                    locked
                      ? "gap-1 bg-accent-soft pl-1.5 text-[13px] font-semibold whitespace-nowrap text-accent"
                      : open
                        ? "bg-accent pl-2.5 text-[13px] font-semibold whitespace-nowrap text-accent-foreground"
                        : "border-[1.5px] border-dashed border-muted/45"
                  }`}
                >
                  {locked && <LockIcon />}
                  {/* The last bar is one column wide: the lock alone fits next to the milestone. */}
                  {open && !(locked && i === COLS - 1) && lessonsLabel(m.lessons.length)}
                </span>
                {i === COLS - 1 && (
                  <span
                    style={{ gridRow: 1, gridColumn: COLS + 2 }}
                    className="grid place-items-center"
                    title="Курс завершено"
                  >
                    <MilestoneMark className="size-3.5" />
                  </span>
                )}
              </Row>
            );
          })}

          <GanttHereLine outline={outline} labelWidth={LABEL_W} endWidth={END_W} />
        </div>

        <div className="flex gap-7 border-t border-border px-5 py-3.5 text-[13px] text-muted">
          <span className="flex items-center gap-2">
            <i className="h-2.5 w-5 rounded-[2px] bg-accent" />
            Відкрито
          </span>
          {paywallEnabled && (
            <span className="flex items-center gap-2">
              <i className="h-2.5 w-5 rounded-[2px] bg-accent-soft" />
              Після оплати
            </span>
          )}
          <span className="flex items-center gap-2">
            <i className="h-2.5 w-5 rounded-[2px] border-[1.5px] border-dashed border-muted/45" />
            Готується
          </span>
          <GanttHereLegend outline={outline} />
          <span className="flex items-center gap-2">
            <MilestoneMark className="size-2.5" />
            Курс завершено
          </span>
        </div>
      </div>

      {/* Narrower screens: the same plan as a list */}
      <ol className="rounded-[4px] border border-border bg-surface lg:hidden">
        {modules.map((m) => {
          const open = isOpen(m);
          const locked = open && isLockedModule(m.number);
          const body = (
            <>
              <b className="w-6 shrink-0 font-display font-semibold tabular-nums">
                {m.number}
              </b>
              <span className={`min-w-0 flex-1 ${open ? "font-medium" : "text-muted"}`}>
                {m.title}
                <ListHere outline={outline} index={modules.indexOf(m)} />
              </span>
              {locked ? (
                <span className="flex shrink-0 items-center gap-1 rounded-[3px] bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                  <LockIcon />
                  Після оплати
                </span>
              ) : open ? (
                <span className="shrink-0 rounded-[3px] bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                  {lessonsLabel(m.lessons.length)}
                </span>
              ) : (
                <span className="shrink-0 text-xs text-muted">Готується</span>
              )}
            </>
          );
          return (
            <li key={m.slug} className="border-b border-grid last:border-b-0">
              {open ? (
                <Link href={href(m)} className="flex items-center gap-3 px-4 py-3">
                  {body}
                </Link>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
