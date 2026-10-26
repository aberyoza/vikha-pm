"use client";

import { useId, useState } from "react";
import { fmt } from "@/content/examples/game-finance";
import { Figure } from "./figure";

// Days from start to done for 60 tasks closed over eight weeks after
// release, in the order they were closed. A few long ones pull the average up.
const DAYS = [
  2, 1, 3, 4, 2, 1, 5, 2, 3, 2, 1, 14, 2, 3, 1, 2, 4, 3, 2, 1,
  3, 2, 6, 1, 2, 3, 2, 4, 1, 2, 9, 3, 2, 1, 2, 3, 4, 2, 1, 3,
  2, 1, 2, 18, 3, 2, 4, 1, 2, 3, 2, 7, 1, 3, 2, 4, 2, 1, 3, 2,
];
const SORTED = [...DAYS].sort((a, b) => a - b);
const AVERAGE = DAYS.reduce((a, b) => a + b, 0) / DAYS.length;
const percentile = (p: number) => SORTED[Math.ceil((p / 100) * SORTED.length) - 1];

const W = 360;
const H = 200;
const PAD = { left: 28, right: 10, top: 10, bottom: 24 };
const MAX = 20;
const x = (i: number) => PAD.left + ((i + 0.5) / DAYS.length) * (W - PAD.left - PAD.right);
const y = (d: number) => PAD.top + (1 - d / MAX) * (H - PAD.top - PAD.bottom);
const days = (n: number) => (n === 1 ? "день" : n < 5 ? "дні" : "днів");

// Cycle time scatter plot with a percentile line instead of the average.
export function CycleTimeScatter() {
  const id = useId();
  const [p, setP] = useState(85);
  const line = percentile(p);

  return (
    <Figure
      title="Час циклу"
      lead="Скільки днів пішло на кожну закриту задачу."
      caption="Кожна точка — задача, закрита за вісім тижнів після релізу. Медова лінія — межа, у яку вклалася обрана частка задач."
    >
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={`${id}-p`}>Яку частку задач обіцяємо</label>
        <span className="font-display font-semibold tabular-nums">{p}%</span>
      </div>
      <input
        id={`${id}-p`}
        type="range"
        min={50}
        max={95}
        step={5}
        value={p}
        onChange={(e) => setP(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--accent)]"
      />

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Час циклу 60 задач">
        {[0, 5, 10, 15, 20].map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="stroke-grid" />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" className="fill-muted text-[10px] tabular-nums">
              {t}
            </text>
          </g>
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(AVERAGE)} y2={y(AVERAGE)} className="stroke-foreground/50" strokeDasharray="4 4" />
        <line x1={PAD.left} x2={W - PAD.right} y1={y(line)} y2={y(line)} className="stroke-accent transition-all duration-300" strokeWidth={2} />
        {DAYS.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r={3} className={d <= line ? "fill-foreground/70" : "fill-accent"} />
        ))}
        <text x={PAD.left} y={H - 8} className="fill-muted text-[10px]">
          тиждень 1
        </text>
        <text x={W - PAD.right} y={H - 8} textAnchor="end" className="fill-muted text-[10px]">
          тиждень 8
        </text>
      </svg>
      <p className="mt-1 text-[13px] text-muted">
        Пунктир — середнє, {fmt(AVERAGE, 1)} дня. Медові точки — задачі, що не вклалися в межу.
      </p>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <strong>
          {p}% задач закрито за {line} {days(line)} або швидше.
        </strong>{" "}
        Таку обіцянку можна дати гравцям і засновникам. Середнє ({fmt(AVERAGE, 1)} дня) нічого не обіцяє: його тягнуть угору кілька довгих задач.
      </p>
    </Figure>
  );
}
