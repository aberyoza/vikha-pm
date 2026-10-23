"use client";

import { useState } from "react";
import { BASELINE, BUILDS, OUTLIER_NOTE, TOLERANCE } from "@/content/examples/game-quality";
import { fmt } from "@/content/examples/game-finance";
import { Figure } from "./figure";

// Centre line and control limits from the stable builds, three standard
// deviations either side.
const mean = BASELINE.reduce((a, b) => a + b, 0) / BASELINE.length;
const sd = Math.sqrt(BASELINE.reduce((a, b) => a + (b - mean) ** 2, 0) / (BASELINE.length - 1));
const UCL = Math.min(100, mean + 3 * sd);
const LCL = mean - 3 * sd;

const W = 360;
const H = 200;
const PAD = { left: 40, right: 78, top: 12, bottom: 28 };
const Y_MIN = 98.5;
const Y_MAX = 100;
const x = (i: number) => PAD.left + ((i + 0.5) / BUILDS.length) * (W - PAD.left - PAD.right);
const y = (v: number) => PAD.top + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom);
const out = (v: number) => v < LCL || v > UCL;
const pct = (v: number) => `${fmt(v, 1)}%`;

// Crash-free sessions per build with control limits; one build falls out.
export function ControlChart() {
  const [sel, setSel] = useState(BUILDS.findIndex(out));
  const [showTolerance, setShowTolerance] = useState(false);
  const v = BUILDS[sel];

  return (
    <Figure
      title="Контрольна карта"
      lead="Стабільність кожної збірки після релізу: частка сесій без вильотів."
      caption={`Межі контролю пораховані за збірками 1–8: середнє (${pct(mean)}) плюс-мінус три стандартні відхилення, тобто від ${pct(LCL)} до ${pct(UCL)}. Наведіть або натисніть на точку.`}
    >
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showTolerance}
          onChange={(e) => setShowTolerance(e.target.checked)}
          className="size-4 accent-[var(--accent)]"
        />
        Показати допуск {pct(TOLERANCE)}
      </label>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Частка сесій без вильотів по збірках 1–12">
        {[98.5, 99, 99.5, 100].map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="stroke-grid" />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" className="fill-muted text-[10px] tabular-nums">
              {fmt(t, 1)}
            </text>
          </g>
        ))}

        <line x1={PAD.left} x2={W - PAD.right} y1={y(mean)} y2={y(mean)} className="stroke-muted" strokeWidth={1.5} />
        {[UCL, LCL].map((l) => (
          <line key={l} x1={PAD.left} x2={W - PAD.right} y1={y(l)} y2={y(l)} className="stroke-foreground/70" strokeWidth={1.5} strokeDasharray="5 4" />
        ))}
        {[
          ["верхня межа", UCL],
          ["середнє", mean],
          ["нижня межа", LCL],
        ].map(([label, v]) => (
          <text key={label} x={W - PAD.right + 6} y={y(v as number) + 3} className="fill-muted text-[10px]">
            {label}
          </text>
        ))}
        {showTolerance && (
          <g>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(TOLERANCE)} y2={y(TOLERANCE)} className="stroke-accent" strokeWidth={2} />
            <text x={W - PAD.right + 6} y={y(TOLERANCE) + 3} className="fill-accent text-[10px] font-medium">
              допуск
            </text>
          </g>
        )}

        <polyline
          points={BUILDS.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
          className="fill-none stroke-foreground/40"
          strokeWidth={1.5}
        />
        {BUILDS.map((v, i) => (
          <g key={i} onMouseEnter={() => setSel(i)} onClick={() => setSel(i)} className="cursor-pointer">
            <circle cx={x(i)} cy={y(v)} r={12} className="fill-transparent" />
            <circle
              cx={x(i)}
              cy={y(v)}
              r={sel === i ? 6 : 4.5}
              strokeWidth={2}
              className={`${out(v) ? "fill-accent" : "fill-foreground"} ${sel === i ? "stroke-surface" : "stroke-transparent"}`}
            />
            <text x={x(i)} y={H - 10} textAnchor="middle" className={`text-[10px] tabular-nums ${sel === i ? "fill-foreground font-semibold" : "fill-muted"}`}>
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-center text-[12px] text-muted">збірки</p>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <strong>
          Збірка {sel + 1}: {pct(v)}.
        </strong>{" "}
        {out(v)
          ? `Точка нижче межі контролю: сталося щось незвичне. ${OUTLIER_NOTE}`
          : `У межах контролю, це звичайне коливання, шукати причину не треба.${
              showTolerance && v < TOLERANCE ? " Але в допуск збірка не вкладається: стабільний процес теж може не відповідати вимогам." : ""
            }`}
      </p>
    </Figure>
  );
}
