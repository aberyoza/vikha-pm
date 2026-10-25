"use client";

import { useState } from "react";
import { CHECKPOINTS, DOWNLOADS_ACTUAL, DOWNLOADS_PLAN, NPV_AFTER_YEAR, RATING_TARGET, type Status } from "@/content/examples/game-benefits";
import { fmt } from "@/content/examples/game-finance";
import { Figure } from "./figure";

const W = 360;
const H = 200;
const PAD = { left: 30, right: 10, top: 12, bottom: 26 };
const MAX = 130;
const x = (m: number) => PAD.left + (m / 12) * (W - PAD.left - PAD.right);
const y = (v: number) => PAD.top + (1 - v / MAX) * (H - PAD.top - PAD.bottom);
const line = (data: number[]) => data.map((v, m) => `${x(m)},${y(v)}`).join(" ");

const MARK: Record<Status, string> = { ok: "✓", miss: "✗", early: "…" };
const months = (n: number) => (n === 3 ? "3 місяці" : n === 6 ? "6 місяців" : "12 місяців");

// Downloads after release against the plan, with three benefit checkpoints.
export function BenefitsTracker() {
  const [i, setI] = useState(0);
  const c = CHECKPOINTS[i];
  const actual = DOWNLOADS_ACTUAL[c.month];
  const plan = DOWNLOADS_PLAN[c.month];

  const rows: { name: string; value: string; status: Status }[] = [
    { name: "Завантаження", value: `${actual} тис. з ${plan} тис. за планом`, status: actual >= plan ? "ok" : "miss" },
    { name: "Рейтинг", value: `${fmt(c.rating, 1)} при цілі ${fmt(RATING_TARGET, 1)}`, status: c.rating >= RATING_TARGET ? "ok" : "miss" },
    { name: "Дохід", value: `${c.income.actual} тис. грн з ${c.income.plan} тис. за планом`, status: c.income.actual >= c.income.plan ? "ok" : "miss" },
    {
      name: "NPV",
      value: c.npv === "early" ? "судити рано, рахуємо після першого року" : `${fmt(NPV_AFTER_YEAR)} тис. грн, більше нуля`,
      status: c.npv,
    },
  ];

  return (
    <Figure
      title="Вигоди після релізу"
      lead="Скільки разів завантажили гру за перший рік, у тисячах."
      caption="Пунктир — план, суцільна лінія — факт. Ціль зі статуту — 50 тисяч за три місяці, план на 6 і 12 місяців засновники додали самі. Натисніть на перевірку."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Завантаження гри за 12 місяців: план і факт">
        {[0, 40, 80, 120].map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="stroke-grid" />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" className="fill-muted text-[10px] tabular-nums">
              {t}
            </text>
          </g>
        ))}
        {[0, 3, 6, 9, 12].map((m) => (
          <text key={m} x={x(m)} y={H - 8} textAnchor={m === 0 ? "start" : m === 12 ? "end" : "middle"} className="fill-muted text-[10px] tabular-nums">
            {m === 0 ? "реліз" : `${m} міс.`}
          </text>
        ))}
        <polyline points={line(DOWNLOADS_PLAN)} className="fill-none stroke-foreground/60" strokeWidth={2} strokeDasharray="5 4" />
        <polyline points={line(DOWNLOADS_ACTUAL)} className="fill-none stroke-accent" strokeWidth={2.5} />
        {CHECKPOINTS.map((cp, k) => (
          <g key={cp.month} role="button" tabIndex={0} aria-pressed={k === i} aria-label={`Перевірка через ${months(cp.month)}`} onClick={() => setI(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setI(k)} className="cursor-pointer outline-none">
            <line x1={x(cp.month)} x2={x(cp.month)} y1={PAD.top} y2={H - PAD.bottom} className={k === i ? "stroke-foreground" : "stroke-foreground/25"} strokeWidth={k === i ? 1.5 : 1} />
            <circle cx={x(cp.month)} cy={y(DOWNLOADS_ACTUAL[cp.month])} r={12} className="fill-transparent" />
            <circle cx={x(cp.month)} cy={y(DOWNLOADS_ACTUAL[cp.month])} r={k === i ? 6 : 4.5} strokeWidth={2} className="fill-accent stroke-surface" />
          </g>
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Перевірка вигод">
        {CHECKPOINTS.map((cp, k) => (
          <button
            key={cp.month}
            type="button"
            aria-pressed={k === i}
            onClick={() => setI(k)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
              k === i ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
            }`}
          >
            {months(cp.month)}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        <ul className="mt-4 divide-y divide-border text-sm">
          {rows.map((r) => (
            <li key={r.name} className="grid grid-cols-[1.25rem_6rem_minmax(0,1fr)] gap-2 py-1.5">
              <span className={r.status === "miss" ? "font-semibold text-accent" : "text-muted"}>{MARK[r.status]}</span>
              <span className="font-medium">{r.name}</span>
              <span>{r.value}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed">
          <strong>Рішення:</strong> {c.decision}
        </p>
      </div>
    </Figure>
  );
}
