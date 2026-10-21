"use client";

import { useState } from "react";
import { Figure } from "./figure";

const WEEKS = 14;

type Bar = { label: string; start: number; end: number; ship?: boolean };

const approaches: { key: string; name: string; when: string; text: string; bars: Bar[] }[] = [
  {
    key: "predictive",
    name: "Предиктивний",
    when: "вимоги відомі й стабільні, зміни дорогі",
    text: "Усе планують наперед, роблять етапами й показують гравцям лише готову гру — один реліз наприкінці.",
    bars: [
      { label: "Концепція і план", start: 0, end: 2 },
      { label: "Розробка", start: 2, end: 10 },
      { label: "Тестування", start: 10, end: 12 },
      { label: "Реліз", start: 12, end: 13, ship: true },
    ],
  },
  {
    key: "adaptive",
    name: "Адаптивний",
    when: "багато невизначеності, важливий швидкий відгук",
    text: "Гру роблять двотижневими спринтами. Після кожного тестувальники грають у нову версію, і план наступного спринту змінюється за їхніми відгуками.",
    bars: [
      { label: "Спринт 1", start: 0, end: 2, ship: true },
      { label: "Спринт 2", start: 2, end: 4, ship: true },
      { label: "Спринт 3", start: 4, end: 6, ship: true },
      { label: "Спринт 4", start: 6, end: 8, ship: true },
      { label: "Спринт 5", start: 8, end: 10, ship: true },
      { label: "Спринт 6", start: 10, end: 12, ship: true },
    ],
  },
  {
    key: "hybrid",
    name: "Гібридний",
    when: "частина роботи передбачувана, частина — ні",
    text: "Концепцію, сервер і реліз у магазинах планують наперед, а рівні роблять спринтами й показують гравцям кожні два тижні.",
    bars: [
      { label: "Концепція і план", start: 0, end: 2 },
      { label: "Сервер", start: 2, end: 5 },
      { label: "Рівні: спринт 1", start: 2, end: 4, ship: true },
      { label: "Рівні: спринт 2", start: 4, end: 6, ship: true },
      { label: "Рівні: спринт 3", start: 6, end: 8, ship: true },
      { label: "Реліз", start: 10, end: 11, ship: true },
    ],
  },
];

const pct = (w: number) => `${(w / WEEKS) * 100}%`;

// The same game delivered three ways: predictive, adaptive and hybrid.
export function DevelopmentApproaches() {
  const [key, setKey] = useState("hybrid");
  const a = approaches.find((x) => x.key === key)!;

  return (
    <Figure
      title="Підходи до розробки"
      lead="Ту саму гру можна зробити трьома способами."
      caption="Ромб — момент, коли гравці отримують версію гри, яку можна спробувати. Що частіше ромби, то раніше команда дізнається, чи рухається в правильний бік."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Підхід до розробки">
        {approaches.map((x) => (
          <button
            key={x.key}
            type="button"
            aria-pressed={x.key === key}
            onClick={() => setKey(x.key)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              x.key === key ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent hover:text-accent"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-1.5" aria-hidden>
        {a.bars.map((b) => (
          <div key={b.label} className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 text-[13px]">
            <span className="truncate">{b.label}</span>
            <div className="relative h-5 rounded-[2px] bg-background">
              <span
                className="absolute inset-y-0 rounded-[2px] bg-foreground/45"
                style={{ left: pct(b.start), width: pct(b.end - b.start) }}
              />
              {b.ship && (
                <span
                  className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px] bg-accent"
                  style={{ left: pct(b.end) }}
                />
              )}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 text-[12px] text-muted">
          <span>тижні</span>
          <div className="relative h-4">
            {[0, 4, 8, 12].map((w) => (
              <span key={w} className={`absolute tabular-nums ${w ? "-translate-x-1/2" : ""}`} style={{ left: pct(w) }}>
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <span className="font-medium">{a.name}.</span> {a.text}{" "}
        <span className="text-muted">Коли доречний: {a.when}.</span>
      </p>
    </Figure>
  );
}
