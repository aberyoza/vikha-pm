"use client";

import { useState } from "react";
import { BONES as bones } from "@/content/examples/game-quality";
import { Figure } from "./figure";

const SPINE = 120;
const HEAD_X = 296;
// Three bones above the spine, three below, joining it at these x positions.
const JOINS = [96, 176, 256];

// Cause-and-effect (Ishikawa) diagram for players quitting at level 3.
export function Fishbone() {
  const [i, setI] = useState(1);
  const b = bones[i];

  return (
    <Figure
      title="Діаграма Ісікави («риб'ячий скелет»)"
      lead="Чому 40% гравців кидають гру на 3-му рівні."
      caption="Кожна «кістка» — група причин. Діаграма дає версії, а не відповідь: кожну перевіряють даними. Натисніть на кістку."
    >
      <svg viewBox="0 0 400 240" className="w-full" role="group" aria-label="Групи причин">
        <line x1={16} x2={HEAD_X} y1={SPINE} y2={SPINE} className="stroke-foreground/60" strokeWidth={3} />
        <rect x={HEAD_X} y={SPINE - 42} width={100} height={84} rx={4} className="fill-accent-soft stroke-accent" strokeWidth={1.5} />
        {["40% гравців", "кидають гру", "на 3-му рівні"].map((t, k) => (
          <text key={t} x={HEAD_X + 50} y={SPINE - 14 + k * 17} textAnchor="middle" className="fill-foreground text-[13px] font-medium">
            {t}
          </text>
        ))}

        {bones.map((bone, k) => {
          const top = k < 3;
          const jx = JOINS[k % 3];
          const ex = jx - 56;
          const ey = top ? 40 : 200;
          const sel = k === i;
          return (
            <g key={bone.name} role="button" tabIndex={0} aria-pressed={sel} aria-label={bone.name} onClick={() => setI(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setI(k)} className="cursor-pointer outline-none">
              <line x1={ex} y1={ey} x2={jx} y2={SPINE} strokeWidth={16} className="stroke-transparent" />
              <line x1={ex} y1={ey} x2={jx} y2={SPINE} strokeWidth={sel ? 3 : 2} className={`transition-colors duration-200 ${sel ? "stroke-accent" : "stroke-foreground/50"}`} />
              <text x={ex} y={top ? ey - 10 : ey + 20} textAnchor="middle" className={`text-[14px] ${sel ? "fill-accent font-semibold" : "fill-foreground"}`}>
                {bone.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <p>
          <strong>{b.name}:</strong> {b.cause}
        </p>
        <p className="mt-1 text-sm text-muted">Як перевірити: {b.check}</p>
        {b.whys && (
          <ol className="mt-3 space-y-2 text-sm">
            {b.whys.map(([q, a], k) => (
              <li key={q} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2">
                <span className="font-display font-semibold text-accent tabular-nums">{k + 1}</span>
                <span>
                  <span className="font-medium">{q}</span> {a}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Figure>
  );
}
