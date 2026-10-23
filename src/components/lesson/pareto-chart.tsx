"use client";

import { useState } from "react";
import { COMPLAINTS } from "@/content/examples/game-quality";
import { Figure } from "./figure";

const TOTAL = COMPLAINTS.reduce((a, c) => a + c.count, 0);
const CUMULATIVE = COMPLAINTS.reduce<number[]>((acc, c) => [...acc, (acc.at(-1) ?? 0) + (c.count / TOTAL) * 100], []);

const W = 360;
const H = 190;
const PAD = { left: 34, right: 10, top: 12, bottom: 24 };
const band = (W - PAD.left - PAD.right) / COMPLAINTS.length;
const x = (i: number) => PAD.left + i * band;
const y = (pct: number) => PAD.top + ((100 - pct) / 100) * (H - PAD.top - PAD.bottom);

const causes = (n: number) => (n === 1 ? "причину" : n < 5 ? "причини" : "причин");

// Pareto chart of beta-test complaints: bars by count, line by running share.
export function ParetoChart() {
  const [n, setN] = useState(2);

  return (
    <Figure
      title="Діаграма Парето"
      lead={`${TOTAL} скарг з бета-тесту, від найчастішої причини до найрідшої.`}
      caption="Стовпчики — скільки скарг кожного типу, лінія — накопичений відсоток. Скарг рівно 100, тому обидві величини читаються за однією шкалою. Натисніть на стовпчик або рядок, щоб вибрати, скільки причин виправляти."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Діаграма Парето скарг з бета-тесту">
        {[0, 20, 40, 60, 80, 100].map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className={t === 80 ? "stroke-foreground/50" : "stroke-grid"} strokeDasharray={t === 80 ? "4 4" : undefined} />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" className="fill-muted text-[10px] tabular-nums">
              {t}%
            </text>
          </g>
        ))}

        {COMPLAINTS.map((c, i) => (
          <g key={c.name} onClick={() => setN(i + 1)} className="cursor-pointer">
            <rect x={x(i)} y={PAD.top} width={band} height={H - PAD.top - PAD.bottom} className="fill-transparent" />
            <rect
              x={x(i) + 3}
              y={y((c.count / TOTAL) * 100)}
              width={band - 6}
              height={H - PAD.bottom - y((c.count / TOTAL) * 100)}
              rx={2}
              className={`transition-colors duration-200 ${i < n ? "fill-accent" : "fill-foreground/25"}`}
            />
            <text x={x(i) + band / 2} y={H - 8} textAnchor="middle" className={`text-[11px] tabular-nums ${i < n ? "fill-foreground font-semibold" : "fill-muted"}`}>
              {i + 1}
            </text>
          </g>
        ))}

        <polyline
          points={CUMULATIVE.map((p, i) => `${x(i) + band / 2},${y(p)}`).join(" ")}
          className="pointer-events-none fill-none stroke-foreground"
          strokeWidth={2}
        />
        {CUMULATIVE.map((p, i) => (
          <circle key={i} cx={x(i) + band / 2} cy={y(p)} r={3.5} strokeWidth={2} className="pointer-events-none fill-foreground stroke-surface" />
        ))}
      </svg>

      <ol className="mt-3 divide-y divide-border text-sm">
        {COMPLAINTS.map((c, i) => (
          <li key={c.name}>
            <button
              type="button"
              aria-pressed={i < n}
              onClick={() => setN(i + 1)}
              className={`grid w-full grid-cols-[1.5rem_minmax(0,1fr)_auto_auto] items-center gap-3 py-1.5 text-left transition-colors duration-200 hover:text-accent ${i < n ? "" : "text-muted"}`}
            >
              <span className="tabular-nums">{i + 1}</span>
              <span>{c.name}</span>
              <span className="tabular-nums">{c.count}</span>
              <span className="w-12 text-right tabular-nums text-muted">{Math.round(CUMULATIVE[i])}%</span>
            </button>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        Виправимо {n === COMPLAINTS.length ? "всі" : `перші ${n}`} {causes(n)} з {COMPLAINTS.length}, і скарг стане на{" "}
        <strong>{Math.round(CUMULATIVE[n - 1])}%</strong> менше.
        {n === 2 && " Дві причини дають дві третини проблем, з них і починають."}
      </p>
    </Figure>
  );
}
