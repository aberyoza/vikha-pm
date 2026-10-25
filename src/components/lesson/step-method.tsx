"use client";

import { useState } from "react";
import { Figure } from "./figure";

const LEVELS = 20;
const BUILD = 20; // days to build all levels
const TEST = 10; // days to test all levels
const PARTS = [1, 2, 4, 5, 10];

const days = (n: number) => {
  const v = Math.round(n * 10) / 10;
  const s = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 }).format(v);
  if (!Number.isInteger(v)) return `${s} дня`;
  const m10 = v % 10;
  const m100 = v % 100;
  if (m10 === 1 && m100 !== 11) return `${s} день`;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return `${s} дні`;
  return `${s} днів`;
};

// Staged method: building and testing levels in batches overlaps the two
// jobs, like digging a trench and laying pipe behind the diggers.
export function StepMethod() {
  const [parts, setParts] = useState(4);
  const build = BUILD / parts;
  const test = TEST / parts;
  const total = BUILD + test;
  const scale = BUILD + TEST;
  const pct = (v: number) => `${(v / scale) * 100}%`;

  return (
    <Figure
      title="Ступінчастий метод"
      lead={`${LEVELS} рівнів: зібрати, потім протестувати. Чи обов'язково чекати, поки зберуть усі?`}
      caption="Тестувальник береться за першу партію рівнів, поки дизайнер збирає наступну. Сумарна робота та сама, а проєкт коротший."
    >
      <p className="text-sm">На скільки партій розбити рівні</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Кількість партій">
        {PARTS.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={p === parts}
            onClick={() => setParts(p)}
            className={`min-w-11 rounded-md px-3 py-1.5 text-sm font-medium tabular-nums press ${
              p === parts ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
            }`}
          >
            {p === 1 ? "1 (без ступенів)" : p}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2 text-[13px]" aria-hidden>
        {[
          { label: "Збирання", start: (i: number) => i * build, len: build, tone: "bg-accent" },
          { label: "Тестування", start: (i: number) => (i + 1) * build, len: test, tone: "bg-foreground/55" },
        ].map((row) => (
          <div key={row.label} className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-3">
            <span>{row.label}</span>
            <div className="relative h-6 rounded-[2px] bg-background">
              {Array.from({ length: parts }, (_, i) => (
                <span
                  key={i}
                  className={`absolute inset-y-0 rounded-[2px] border-r-2 border-surface transition-[left,width] duration-200 ${row.tone}`}
                  style={{ left: pct(row.start(i)), width: pct(row.len) }}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 text-[12px] text-muted">
          <span>дні</span>
          <div className="relative h-4">
            {[0, 10, 20, 30].map((d) => (
              <span key={d} className={`absolute tabular-nums ${d ? "-translate-x-1/2" : ""}`} style={{ left: pct(d) }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {parts === 1 ? (
          <>
            Без ступенів тестування чекає, поки зберуть усі рівні: разом{" "}
            <span className="font-display font-semibold text-accent">{days(total)}</span>.
          </>
        ) : (
          <>
            {parts} {parts < 5 ? "партії" : "партій"} по {LEVELS / parts} {[2, 3, 4].includes(LEVELS / parts) ? "рівні" : "рівнів"}: разом{" "}
            <span className="font-display font-semibold text-accent">{days(total)}</span> замість{" "}
            {days(BUILD + TEST)}.
          </>
        )}
      </p>
    </Figure>
  );
}
