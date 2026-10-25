"use client";

import { useState, type CSSProperties } from "react";
import { PLAN, TASKS, weeks as weeksLabel, type Scheduled } from "@/content/examples/game-plan";
import { Figure } from "./figure";

// The programmer's work in the module 8 plan: mechanics, server and release.
const MECHANICS = 3;
const SERVER = 4;
const RELEASE = 8;
const PROGRAMMER = [MECHANICS, SERVER, RELEASE];

const COLOR: Record<number, string> = {
  [MECHANICS]: "bg-accent",
  [SERVER]: "bg-sage",
  [RELEASE]: "bg-accent/55",
};

// Forward pass of the plan where some tasks may not start before a given week.
function reschedule(notBefore: Record<number, number> = {}) {
  const ef = new Map<number, number>();
  const tasks: Scheduled[] = TASKS.map((t) => {
    const planned = PLAN.tasks.find((p) => p.id === t.id)!;
    const es = Math.max(notBefore[t.id] ?? 0, ...t.after.map((p) => ef.get(p)!));
    ef.set(t.id, es + t.weeks);
    return { ...planned, es, ef: es + t.weeks };
  });
  return { tasks, total: Math.max(...ef.values()) };
}

// Programmer's tasks in each week.
function load(tasks: Scheduled[], span: number) {
  const weeks = Array.from({ length: span }, () => [] as Scheduled[]);
  for (const t of tasks.filter((t) => PROGRAMMER.includes(t.id))) {
    for (let w = t.es; w < t.ef; w++) weeks[w].push(t);
  }
  return weeks;
}

const grid = (span: number, label = "4.5rem"): CSSProperties => ({
  gridTemplateColumns: `${label} repeat(${span}, minmax(0, 1fr))`,
});

const range = (t: Scheduled) => (t.weeks > 1 ? `${t.es + 1}–${t.ef}-й тиждень` : `${t.ef}-й тиждень`);

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
      {PROGRAMMER.map((id) => (
        <span key={id} className="flex items-center gap-2">
          <span aria-hidden className={`size-3 rounded-[2px] ${COLOR[id]}`} />
          {TASKS.find((t) => t.id === id)!.name.toLowerCase()}
        </span>
      ))}
    </div>
  );
}

// Programmer's histogram: one column per week, one block per task, the
// dashed line is the one person the studio has.
function Histogram({
  weeks,
  label,
  selected,
  onSelect,
}: {
  weeks: Scheduled[][];
  label?: string;
  selected?: number;
  onSelect?: (w: number) => void;
}) {
  return (
    <div className="grid gap-0.5" style={grid(weeks.length, label)}>
      <div style={{ gridRow: 1, gridColumn: 1 }} className="relative h-[4.25rem] pr-2 text-right text-[11px] leading-none text-muted tabular-nums" aria-hidden>
        <span className="absolute right-2 bottom-0">0</span>
        <span className="absolute right-2 bottom-[calc(2rem-5px)]">1</span>
        <span className="absolute right-2 top-0">2</span>
      </div>
      {weeks.map((w, i) => {
        const over = w.length > 1;
        const body = (
          <>
            <span
              aria-hidden
              className={`absolute inset-x-0 bottom-0 h-[4.25rem] rounded-[2px] ${
                over ? "bg-risk-2" : selected === i ? "bg-surface-raised" : ""
              }`}
            />
            <span aria-hidden className="relative flex h-[4.25rem] flex-col-reverse gap-0.5">
              {w.map((t) => (
                <span key={t.id} className={`h-8 shrink-0 rounded-[2px] ${COLOR[t.id]}`} />
              ))}
            </span>
          </>
        );
        const cls = `relative border-b border-border ${
          selected === i ? "outline-2 outline-offset-1 outline-foreground" : ""
        }`;
        return onSelect ? (
          <button
            key={i}
            type="button"
            style={{ gridRow: 1, gridColumn: i + 2 }}
            aria-label={`Тиждень ${i + 1}`}
            aria-pressed={selected === i}
            onClick={() => onSelect(i)}
            className={`${cls} cursor-pointer rounded-[2px]`}
          >
            {body}
          </button>
        ) : (
          <div key={i} style={{ gridRow: 1, gridColumn: i + 2 }} className={cls}>
            {body}
          </div>
        );
      })}
      <span aria-hidden className="pointer-events-none relative col-start-2 -col-end-1 row-start-1 self-end">
        <span className="absolute inset-x-0 bottom-[calc(2rem+1px)] border-t-2 border-dashed border-foreground/60" />
      </span>
      <span style={{ gridRow: 2, gridColumn: 1 }} className="text-[11px] text-muted">тижні</span>
      {weeks.map((_, i) => (
        <span key={i} aria-hidden style={{ gridRow: 2, gridColumn: i + 2 }} className={`text-center text-[11px] tabular-nums ${selected === i ? "font-semibold text-foreground" : "text-muted"}`}>
          {i % 2 === 0 || selected === i ? i + 1 : ""}
        </span>
      ))}
    </div>
  );
}

// How a resource histogram is built from the plan: count the programmer's
// tasks in each week.
export function ResourceHistogram() {
  const weeks = load(PLAN.tasks, PLAN.total);
  const [week, setWeek] = useState(3);
  const w = weeks[week];
  const programmer = PLAN.tasks.filter((t) => PROGRAMMER.includes(t.id));

  return (
    <Figure
      title="Як будують гістограму"
      lead="Щотижня рахують, скільки робіт припадає на одну людину."
      caption="Зверху роботи програміста з розкладу модуля 8, знизу його гістограма. Пунктир — скільки програмістів є в студії. Натисніть на стовпчик, щоб побачити, з чого він складається."
    >
      <div className="space-y-1" aria-hidden>
        {programmer.map((t) => (
          <div key={t.id} className="grid gap-0.5 text-[13px]" style={grid(PLAN.total)}>
            <span className="row-start-1 truncate pr-2">{t.name}</span>
            {weeks.map((_, i) => (
              <span
                key={i}
                className={`row-start-1 h-6 rounded-[2px] ${i === week ? "bg-surface-raised" : "bg-background"}`}
                style={{ gridColumn: i + 2 }}
              />
            ))}
            <span
              className={`row-start-1 my-1 rounded-[2px] ${COLOR[t.id]}`}
              style={{ gridColumn: `${t.es + 2} / span ${t.weeks}` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <Histogram weeks={weeks} selected={week} onSelect={setWeek} />
      </div>
      <Legend />

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <strong>Тиждень {week + 1}.</strong>{" "}
        {w.length === 0
          ? "За планом у програміста немає робіт, стовпчик порожній."
          : w.length === 1
            ? `${w[0].name}: одна робота на одного програміста. Стовпчик доходить до пунктиру, навантаження нормальне.`
            : `${w.map((t, i) => (i ? t.name.toLowerCase() : t.name)).join(" і ")}: дві роботи на одного програміста. Стовпчик вищий за пунктир, це перевантаження.`}
      </p>
    </Figure>
  );
}

const MODES = {
  plan: { label: "Як у плані", ...PLAN },
  level: { label: "Вирівнювання", ...reschedule({ [MECHANICS]: PLAN.tasks.find((t) => t.id === SERVER)!.ef }) },
  smooth: { label: "Згладжування", ...reschedule({ [SERVER]: PLAN.tasks.find((t) => t.id === MECHANICS)!.ef }) },
};
type Mode = keyof typeof MODES;

const SPAN = Math.max(...Object.values(MODES).map((m) => m.total));
// Room for the longest task names in the full plan.
const WIDE = "5.5rem";

// The plan as is, after leveling (server first, mechanics waits) and after
// smoothing (server moves within its slack).
export function ResourceLeveling() {
  const [mode, setMode] = useState<Mode>("plan");
  const { tasks, total } = MODES[mode];
  const weeks = load(tasks, SPAN);
  const overloaded = weeks.filter((w) => w.length > 1).length;
  const at = (id: number) => tasks.find((t) => t.id === id)!;

  return (
    <Figure
      title="Вирівнювання і згладжування"
      lead="Як посунути роботи, щоб програміст не робив дві справи одночасно."
      caption={`Сірим — роботи інших людей. Пунктирна рамка показує, де робота стояла за планом. Затемнені тижні — після запланованого релізу (${PLAN.total}-й тиждень).`}
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Варіант плану">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
              mode === m ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
            }`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-1" aria-hidden>
        {tasks.map((t) => {
          const planned = PLAN.tasks.find((p) => p.id === t.id)!;
          const mine = PROGRAMMER.includes(t.id);
          return (
            <div key={t.id} className="grid gap-0.5 text-[13px]" style={grid(SPAN, WIDE)}>
              <span className={`row-start-1 truncate pr-2 ${mine ? "" : "text-muted"}`}>{t.name}</span>
              {weeks.map((_, i) => (
                <span
                  key={i}
                  className={`row-start-1 h-6 rounded-[2px] ${i >= PLAN.total ? "bg-risk-1" : "bg-background"}`}
                  style={{ gridColumn: i + 2 }}
                />
              ))}
              {planned.es !== t.es && (
                <span
                  className="row-start-1 my-1 rounded-[2px] border border-dashed border-muted"
                  style={{ gridColumn: `${planned.es + 2} / span ${t.weeks}` }}
                />
              )}
              <span
                className={`row-start-1 my-1 rounded-[2px] ${mine ? COLOR[t.id] : "bg-muted/35"}`}
                style={{ gridColumn: `${t.es + 2} / span ${t.weeks}` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <p className="mb-2 text-[13px] text-muted">Гістограма програміста</p>
        <Histogram weeks={weeks} label={WIDE} />
      </div>
      <Legend />

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {mode === "plan" &&
          `${weeksLabel(overloaded)} програміст мав би робити механіку і сервер одночасно. Реліз стоїть на ${total}-му тижні, але план нереальний.`}
        {mode === "level" &&
          `Програміст спершу робить сервер, механіку — після нього (${range(at(MECHANICS))}). Перевантаження зникло, але механіка лежить на критичному шляху, тож рівні, тестування і реліз посунулися: гра вийде на ${total}-му тижні замість ${PLAN.total}-го.`}
        {mode === "smooth" &&
          `Сервер переїхав на ${range(at(SERVER))}, у межах свого резерву. Перевантаження зникло, реліз так само на ${total}-му тижні.`}
      </p>
    </Figure>
  );
}
