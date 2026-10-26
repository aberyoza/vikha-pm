"use client";

import { useState } from "react";
import { fmt } from "@/content/examples/game-finance";
import { Figure } from "./figure";

// The path of one bug fix, in hours: waiting before each step, then the work.
const STEPS = [
  { name: "Розбір скарги", wait: 48, work: 0.25, fix: "triage" },
  { name: "Виправлення", wait: 0, work: 2 },
  { name: "Перегляд коду", wait: 24, work: 0.5, fix: "review" },
  { name: "Тестування", wait: 0, work: 1 },
  { name: "Реліз", wait: 68, work: 0.25, fix: "release" },
] as const;

const FIXES = [
  { key: "triage", name: "Розбирати скарги щодня", wait: 4 },
  { key: "review", name: "Переглядати код того ж дня", wait: 2 },
  { key: "release", name: "Випускати будь-якого дня", wait: 4 },
] as const;
type Fix = (typeof FIXES)[number]["key"];

const total = (on: Set<Fix>) =>
  STEPS.reduce((s, st) => {
    const fix = "fix" in st ? FIXES.find((f) => f.key === st.fix) : undefined;
    const wait = fix && on.has(fix.key) ? fix.wait : st.wait;
    return { wait: s.wait + wait, work: s.work + st.work };
  }, { wait: 0, work: 0 });

const BASE = total(new Set());
const BASE_HOURS = BASE.wait + BASE.work;
const duration = (h: number) => (h >= 24 ? `${fmt(h / 24, 1)} дня` : `${fmt(h, 0)} год`);

// Value stream of a bug fix: work is a sliver, waiting is most of the path.
export function ValueStreamMap() {
  const [on, setOn] = useState<Set<Fix>>(new Set());
  const t = total(on);
  const hours = t.wait + t.work;
  const efficiency = (t.work / hours) * 100;

  const toggle = (k: Fix) =>
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  return (
    <Figure
      title="Карта потоку цінності"
      lead="Шлях одного бага від скарги гравця до релізу."
      caption="Медовим — робота, сірим — очікування. Довжина смуги пропорційна часу. Увімкніть зміни, щоб побачити, звідки береться виграш."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Зміни в процесі">
        {FIXES.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={on.has(f.key)}
            onClick={() => toggle(f.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
              on.has(f.key) ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="mt-5" aria-hidden>
        <div className="flex h-8 gap-0.5 transition-all duration-300" style={{ width: `${(hours / BASE_HOURS) * 100}%` }}>
          {STEPS.flatMap((st) => {
            const fix = "fix" in st ? FIXES.find((f) => f.key === st.fix) : undefined;
            const wait = fix && on.has(fix.key) ? fix.wait : st.wait;
            return [
              wait > 0 && <span key={`${st.name}-w`} className="rounded-[2px] bg-foreground/20" style={{ flex: wait }} title={`Очікування: ${duration(wait)}`} />,
              <span key={`${st.name}-r`} className="min-w-[3px] rounded-[2px] bg-accent" style={{ flex: st.work }} title={`${st.name}: ${duration(st.work)}`} />,
            ];
          })}
        </div>
      </div>

      <ol className="mt-4 grid gap-1 text-[13px] @md:grid-cols-5">
        {STEPS.map((st, i) => (
          <li key={st.name} className="flex gap-1.5 @md:flex-col @md:gap-0">
            <span className="tabular-nums text-muted">{i + 1}.</span>
            <span>
              {st.name} <span className="text-muted">({duration(st.work)})</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        Робота — <strong>{fmt(t.work, 0)} години</strong>, а гравець чекає на виправлення{" "}
        <strong>{duration(hours)}</strong>. Ефективність потоку — {fmt(efficiency, 0)}%.
        {on.size > 0 && ` Час роботи не змінився: виграш дало лише прибране очікування.`}
      </p>
    </Figure>
  );
}
