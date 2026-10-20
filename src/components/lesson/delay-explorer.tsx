"use client";

import { useId, useState } from "react";
import { PLAN, TASKS, schedule, weeks } from "@/content/examples/game-plan";
import { Figure } from "./figure";

const MAX_DELAY = 6;
const SCALE = PLAN.total + MAX_DELAY;

// Gantt chart of the game plan: pick a task, delay it and see whether the
// release moves. Shows why slack matters and the critical path doesn't wait.
export function DelayExplorer() {
  const id = useId();
  const [taskId, setTaskId] = useState(2);
  const [delay, setDelay] = useState(3);

  const planned = PLAN.tasks.find((t) => t.id === taskId)!;
  const late = schedule(TASKS.map((t) => (t.id === taskId ? { ...t, weeks: t.weeks + delay } : t)));
  const shift = late.total - PLAN.total;
  const pct = (w: number) => `${(w / SCALE) * 100}%`;

  return (
    <Figure
      title="Що, як робота затримається?"
      lead="Оберіть роботу і зсуньте її строк."
      caption="Смужка показує, коли йде робота; світліше продовження — її резерв часу. Роботи критичного шляху виділено і позначено ромбом."
    >
      <div className="grid gap-4 @xl:grid-cols-2">
        <div>
          <label htmlFor={`${id}-task`} className="text-sm">
            Робота
          </label>
          <select
            id={`${id}-task`}
            value={taskId}
            onChange={(e) => setTaskId(Number(e.target.value))}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            {TASKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id}. {t.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <label htmlFor={`${id}-delay`}>Затримка</label>
            <span className="font-display font-semibold tabular-nums">{weeks(delay)}</span>
          </div>
          <input
            id={`${id}-delay`}
            type="range"
            min={0}
            max={MAX_DELAY}
            step={1}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--accent)]"
          />
        </div>
      </div>

      <div className="mt-6 space-y-1.5" aria-hidden>
        {late.tasks.map((t) => {
          const chosen = t.id === taskId;
          return (
            <div key={t.id} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 text-[13px]">
              <span className={`flex items-center gap-1.5 truncate ${chosen ? "font-semibold" : ""}`}>
                {t.critical && (
                  <span className="size-2 shrink-0 rotate-45 rounded-[1px] bg-accent" />
                )}
                {t.name}
              </span>
              <div className="relative h-5 rounded-[2px] bg-background">
                {t.slack > 0 && (
                  <span
                    className="absolute inset-y-1 rounded-[2px] bg-border"
                    style={{ left: pct(t.ef), width: pct(t.slack) }}
                  />
                )}
                <span
                  className={`absolute inset-y-0 rounded-[3px] transition-[left,width] duration-200 ${
                    t.critical ? "bg-accent" : "bg-muted/70"
                  } ${chosen ? "ring-2 ring-foreground ring-offset-1 ring-offset-surface" : ""}`}
                  style={{ left: pct(t.es), width: pct(t.weeks) }}
                />
              </div>
            </div>
          );
        })}
        <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 text-[12px] text-muted">
          <span>тижні</span>
          <div className="relative h-4">
            {[0, 5, 10, 15].map((w) => (
              <span key={w} className="absolute -translate-x-1/2 tabular-nums first:translate-x-0" style={{ left: pct(w) }}>
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {delay === 0 ? (
          <>
            Без затримок гра вийде через{" "}
            <span className="font-display font-semibold text-accent">{weeks(PLAN.total)}</span>.
          </>
        ) : shift === 0 ? (
          <>
            «{planned.title}» має резерв {weeks(planned.slack)}, тож затримка на {weeks(delay)}{" "}
            <strong>не зсуває реліз</strong>: гра так само вийде через {weeks(PLAN.total)}.
          </>
        ) : (
          <>
            {planned.slack > 0
              ? `Резерв роботи «${planned.title}» — лише ${weeks(planned.slack)}, тож`
              : `«${planned.title}» лежить на критичному шляху, тож`}{" "}
            реліз зсунеться на{" "}
            <span className="font-display font-semibold text-accent">{weeks(shift)}</span>: гра
            вийде через {weeks(late.total)} замість {PLAN.total}.
          </>
        )}
      </p>
    </Figure>
  );
}
