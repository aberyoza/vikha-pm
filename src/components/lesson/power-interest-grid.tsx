"use client";

import { useState } from "react";
import { QUADRANTS, STAKEHOLDERS, type Level, quadrantOf } from "@/content/examples/game-stakeholders";
import { Figure } from "./figure";

const cells: { power: Level; interest: Level }[] = [
  { power: "high", interest: "low" },
  { power: "high", interest: "high" },
  { power: "low", interest: "low" },
  { power: "low", interest: "high" },
];

// Power/interest grid of the game's stakeholders; pick one to see the strategy.
export function PowerInterestGrid() {
  const [key, setKey] = useState("founders");
  const picked = STAKEHOLDERS.find((s) => s.key === key)!;
  const q = quadrantOf(picked);

  return (
    <Figure
      title="Влада — інтерес"
      lead="Де кожна зацікавлена сторона гри і як із нею працювати."
      caption="Натисніть на будь-яку сторону. Найбільше уваги — правому верхньому кутку: висока влада і високий інтерес."
    >
      <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2">
        <span className="self-center text-[12px] text-muted [writing-mode:vertical-rl] rotate-180">влада</span>
        <div>
          <div className="grid grid-cols-2 gap-1.5">
            {cells.map((c) => {
              const quad = QUADRANTS[`${c.power}-${c.interest}`];
              const main = c.power === "high" && c.interest === "high";
              return (
                <div
                  key={`${c.power}-${c.interest}`}
                  className={`min-h-28 rounded-[4px] border p-2.5 ${main ? "border-accent bg-accent-soft/60" : "border-border bg-background/40"}`}
                >
                  <p className="text-[12px] font-medium text-muted">{quad.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {STAKEHOLDERS.filter((s) => s.power === c.power && s.interest === c.interest).map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        aria-pressed={s.key === key}
                        onClick={() => setKey(s.key)}
                        className={`rounded-[3px] border px-1.5 py-0.5 text-left text-[12px] leading-tight transition-colors duration-200 ${
                          s.key === key ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface hover:border-accent"
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-1 grid grid-cols-2 text-center text-[12px] text-muted">
            <span>низький інтерес</span>
            <span>високий інтерес</span>
          </div>
        </div>
      </div>
      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <span className="font-medium">{picked.name}.</span> Очікує: {picked.expects}.{" "}
        <span className="font-medium">{q.name}:</span> {q.how}.
      </p>
    </Figure>
  );
}
