"use client";

import { useState } from "react";
import { PLAN } from "@/content/examples/game-plan";
import { Figure } from "./figure";

// The programmer's work in the module 5 plan: mechanics, server and release.
const PROGRAMMER = [3, 4, 8];
const SERVER = 4;
const MECHANICS = 3;

const task = (id: number) => PLAN.tasks.find((t) => t.id === id)!;

function load(smoothed: boolean) {
  const weeks = Array.from({ length: PLAN.total }, () => [] as string[]);
  for (const id of PROGRAMMER) {
    const t = task(id);
    const start = smoothed && id === SERVER ? task(MECHANICS).ef : t.es;
    for (let w = start; w < start + t.weeks; w++) weeks[w].push(t.name);
  }
  return weeks;
}

// Resource histogram of the programmer, as planned and after smoothing.
export function ResourceLeveling() {
  const [smoothed, setSmoothed] = useState(false);
  const weeks = load(smoothed);
  const overloaded = weeks.filter((w) => w.length > 1).length;

  return (
    <Figure
      title="Навантаження програміста"
      lead="Скільки робіт одночасно припадає на одну людину щотижня."
      caption="Сервер має резерв 5 тижнів, тож його можна посунути без зсуву релізу. Тестування все одно стартує на 10-му тижні."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Варіант плану">
        {[
          { v: false, l: "Як у плані" },
          { v: true, l: "Після згладжування" },
        ].map((o) => (
          <button
            key={o.l}
            type="button"
            aria-pressed={smoothed === o.v}
            onClick={() => setSmoothed(o.v)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              smoothed === o.v ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent hover:text-accent"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>

      <div className="relative mt-5" aria-hidden>
        <div className="flex h-36 items-end gap-1 border-b border-border">
          {weeks.map((w, i) => (
            <div key={i} className="flex flex-1 flex-col-reverse gap-0.5">
              {w.map((name) => (
                <span
                  key={name}
                  title={`Тиждень ${i + 1}: ${name}`}
                  className={`h-14 rounded-[2px] ${name === task(SERVER).name ? "bg-foreground/45" : w.length > 1 ? "bg-accent" : "bg-accent/70"}`}
                />
              ))}
            </div>
          ))}
        </div>
        <span className="absolute right-0 left-0 border-t-2 border-dashed border-foreground/60" style={{ bottom: "3.5rem" }} />
        <span className="absolute right-0 text-[11px] text-muted" style={{ bottom: "3.75rem" }}>
          1 людина
        </span>
        <div className="mt-1 flex gap-1 text-center text-[11px] text-muted tabular-nums">
          {weeks.map((_, i) => (
            <span key={i} className="flex-1">
              {i + 1}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
        <span className="flex items-center gap-2"><span aria-hidden className="size-3 rounded-[2px] bg-accent" /> механіка і реліз</span>
        <span className="flex items-center gap-2"><span aria-hidden className="size-3 rounded-[2px] bg-foreground/45" /> сервер</span>
      </div>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {overloaded
          ? `${overloaded} тижні програміст мав би робити дві роботи одночасно. План нереальний.`
          : "Програміст працює над однією задачею за раз, а дата релізу та сама."}
      </p>
    </Figure>
  );
}
