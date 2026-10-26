"use client";

import { useId, useState } from "react";
import { fmt } from "@/content/examples/game-finance";
import { Figure } from "./figure";

const MEAN = 2.2;
const LIMIT = 3;
const X_MAX = 5;

// Standard normal CDF via the Abramowitz–Stegun approximation of erf.
function phi(z: number) {
  const t = 1 / (1 + (0.3275911 * Math.abs(z)) / Math.SQRT2);
  const erf =
    1 -
    t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) *
      Math.exp(-(z * z) / 2);
  return z >= 0 ? (1 + erf) / 2 : (1 - erf) / 2;
}

const W = 360;
const H = 170;
const PAD = { left: 10, right: 10, top: 10, bottom: 24 };
// Coordinates are rounded so server and browser render the same numbers.
const r1 = (v: number) => Math.round(v * 10) / 10;
const x = (s: number) => r1(PAD.left + (s / X_MAX) * (W - PAD.left - PAD.right));

// Spread of level load times against the 3-second limit, as Six Sigma sees it.
export function SigmaLevels() {
  const id = useId();
  const [sd, setSd] = useState(0.95);
  const z = (LIMIT - MEAN) / sd;
  const share = 1 - phi(z);
  const dpmo = share * 1e6;
  // Six Sigma convention: short-term sigma = z + 1.5 (long-term drift).
  const sigma = z + 1.5;

  const pdf = (s: number) => Math.exp(-(((s - MEAN) / sd) ** 2) / 2);
  const y = (v: number) => r1(PAD.top + (1 - v) * (H - PAD.top - PAD.bottom));
  const pts = Array.from({ length: 121 }, (_, i) => (i / 120) * X_MAX);
  const curve = pts.map((s) => `${x(s)},${y(pdf(s))}`).join(" ");
  const tail = `M${x(LIMIT)},${y(0)} ${pts
    .filter((s) => s >= LIMIT)
    .map((s) => `L${x(s)},${y(pdf(s))}`)
    .join(" ")} L${x(X_MAX)},${y(0)} Z`;

  return (
    <Figure
      title="Рівні сигми"
      lead="Що менший розкид, то рідше рівень вантажиться довше 3 секунд."
      caption="Середній час завантаження — 2,2 секунди. Рівень сигми рахуємо так, як прийнято в Six Sigma: з поправкою на 1,5σ, бо з часом процес зміщується."
    >
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={`${id}-sd`}>Розкид часу завантаження</label>
        <span className="font-display font-semibold tabular-nums">±{fmt(sd, 2)} с</span>
      </div>
      <input
        id={`${id}-sd`}
        type="range"
        min={0.15}
        max={1}
        step={0.01}
        value={sd}
        onChange={(e) => setSd(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--accent)]"
      />

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Розподіл часу завантаження рівня">
        <path d={tail} className="fill-accent" />
        <polyline points={curve} className="fill-none stroke-foreground/70" strokeWidth={2} />
        <line x1={x(LIMIT)} x2={x(LIMIT)} y1={PAD.top} y2={y(0)} className="stroke-foreground" strokeDasharray="4 4" />
        <text x={x(LIMIT) + 4} y={PAD.top + 10} className="fill-muted text-[10px]">
          межа 3 с
        </text>
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} className="stroke-grid" />
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <text key={s} x={x(s)} y={H - 8} textAnchor="middle" className="fill-muted text-[10px] tabular-nums">
            {s} с
          </text>
        ))}
      </svg>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        Довше 3 секунд вантажиться <strong>{fmt(share * 100, share < 0.01 ? 2 : 0)}%</strong> рівнів, тобто{" "}
        {fmt(dpmo < 10 ? Math.round(dpmo * 10) / 10 : Math.round(dpmo), dpmo < 10 ? 1 : 0)} на мільйон. Це приблизно{" "}
        <strong>{fmt(sigma, 1)}σ</strong>.
        {sigma >= 6 ? " Шість сигм: дефект трапляється 3,4 раза на мільйон." : ""}
      </p>
    </Figure>
  );
}
