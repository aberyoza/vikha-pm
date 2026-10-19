import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { modules, publishedModules, type CourseModule } from "@/content/course";
import { MilestoneMark } from "./logo";
import { lessonsLabel } from "./ui";

const LABEL_W = "300px";
const END_W = "56px";
const COLS = modules.length;

const rowGrid: CSSProperties = {
  gridTemplateColumns: `${LABEL_W} repeat(${COLS}, minmax(0, 1fr)) ${END_W}`,
};

const isOpen = (m: CourseModule) => m.published && m.lessons.length > 0;
const href = (m: CourseModule) => `/modules/${m.slug}/${m.lessons[0].slug}`;

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
  const current = publishedModules[0];
  const currentIndex = current ? modules.indexOf(current) : -1;

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
                    open
                      ? "bg-accent pl-2.5 text-[13px] font-semibold whitespace-nowrap text-accent-foreground"
                      : "border-[1.5px] border-dashed border-muted/45"
                  }`}
                >
                  {open && lessonsLabel(m.lessons.length)}
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

          {currentIndex >= 0 && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-sage"
              style={{
                left: `calc(${LABEL_W} + (100% - ${LABEL_W} - ${END_W}) * ${(currentIndex + 0.5) / COLS})`,
              }}
            >
              <span className="absolute top-[12px] left-[78px] bg-surface px-1 text-[13px] font-semibold whitespace-nowrap text-sage">
                Ви тут
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-7 border-t border-border px-5 py-3.5 text-[13px] text-muted">
          <span className="flex items-center gap-2">
            <i className="h-2.5 w-5 rounded-[2px] bg-accent" />
            Відкрито
          </span>
          <span className="flex items-center gap-2">
            <i className="h-2.5 w-5 rounded-[2px] border-[1.5px] border-dashed border-muted/45" />
            Готується
          </span>
          <span className="flex items-center gap-2">
            <i className="h-3 w-0.5 bg-sage" />
            Ви тут
          </span>
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
          const body = (
            <>
              <b className="w-6 shrink-0 font-display font-semibold tabular-nums">
                {m.number}
              </b>
              <span className={`min-w-0 flex-1 ${open ? "font-medium" : "text-muted"}`}>
                {m.title}
              </span>
              {open ? (
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
