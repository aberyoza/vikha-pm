"use client";

import { useState } from "react";
import { Figure } from "./figure";

const steps = [
  {
    letter: "P",
    name: "План",
    en: "Plan",
    what: "зібрати дані, знайти ймовірну причину, поставити ціль",
    game: "80% вильотів у збірці 9 припадають на Android 9 і старіші. Гіпотеза: винна нова рекламна бібліотека. Ціль: повернутися до 99,5% сесій без вильотів.",
  },
  {
    letter: "D",
    name: "Зробити",
    en: "Do",
    what: "спробувати рішення в малому масштабі",
    game: "Для 10% гравців повернули стару версію рекламної бібліотеки.",
  },
  {
    letter: "C",
    name: "Перевірити",
    en: "Check",
    what: "порівняти результат із ціллю",
    game: "У цій групі 99,6% сесій без вильотів. Ціль досягнута, інші показники не погіршились.",
  },
  {
    letter: "A",
    name: "Діяти",
    en: "Act",
    what: "якщо спрацювало, зробити рішення стандартом; якщо ні, почати новий цикл",
    game: "Стару версію повернули всім. У чек-лист релізу додали правило: нові бібліотеки спершу тестують на трьох старих телефонах. Далі цей стандарт утримує цикл SDCA.",
  },
];

const C = 110;
const R = 78;
const polar = (deg: number, r = R) => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const arc = (from: number, to: number) => {
  const [x1, y1] = polar(from);
  const [x2, y2] = polar(to);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};
// Full circle for the travelling dot, clockwise from the top.
const RING = `M${C} ${C - R} A${R} ${R} 0 1 1 ${C - 0.01} ${C - R}`;

// The PDCA cycle on the build 9 incident.
export function PdcaCycle() {
  const [i, setI] = useState(0);
  const s = steps[i];

  return (
    <Figure
      title="Цикл PDCA (план, зробити, перевірити, діяти)"
      lead="Як студія розібралася з вильотами у збірці 9."
      caption="Plan, Do, Check, Act — план, зробити, перевірити, діяти. Коли рішення стає стандартом, його утримує цикл SDCA (Standard, Do, Check, Act — стандарт, зробити, перевірити, діяти). Натисніть на крок."
    >
      <div className="grid items-center gap-6 @xl:grid-cols-[13rem_minmax(0,1fr)]">
        <svg viewBox="0 0 220 220" className="mx-auto w-full max-w-[13rem]" role="group" aria-label="Кроки циклу PDCA">
          {steps.map((st, k) => {
            const from = -90 + k * 90 + 4;
            const [lx, ly] = polar(from + 41);
            return (
              <g key={st.letter} role="button" tabIndex={0} aria-pressed={k === i} aria-label={`${st.en}: ${st.name}`} onClick={() => setI(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setI(k)} className="cursor-pointer outline-none">
                <path d={arc(from, from + 82)} strokeWidth={34} className={`fill-none transition-colors duration-200 ${k === i ? "stroke-accent" : "stroke-foreground/15 hover:stroke-foreground/30"}`} />
                <text x={lx} y={ly + 6} textAnchor="middle" className={`pointer-events-none font-display text-[18px] font-semibold ${k === i ? "fill-accent-foreground" : "fill-foreground"}`}>
                  {st.letter}
                </text>
              </g>
            );
          })}
          <circle r={4} className="fill-accent motion-reduce:hidden">
            <animateMotion path={RING} dur="6s" repeatCount="indefinite" rotate="auto" />
          </circle>
          <text x={C} y={C - 2} textAnchor="middle" className="fill-foreground font-display text-[16px] font-semibold">
            PDCA
          </text>
          <text x={C} y={C + 16} textAnchor="middle" className="fill-muted text-[11px]">
            цикл Демінга
          </text>
        </svg>

        <div aria-live="polite">
          <p className="font-display text-lg font-semibold">
            {s.en}: {s.name.toLowerCase()}
          </p>
          <p className="mt-1 text-sm text-muted">{s.what}</p>
          <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed">
            <strong>У студії:</strong> {s.game}
          </p>
        </div>
      </div>
    </Figure>
  );
}
