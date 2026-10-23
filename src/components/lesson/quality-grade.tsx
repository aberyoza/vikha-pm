"use client";

import { useState } from "react";
import { Figure } from "./figure";

// Rows: quality (high on top); columns: grade (low on the left).
const cells = [
  {
    quality: "висока",
    grade: "низький",
    example: "20 рівнів без онлайн-режиму, зате без вильотів.",
    verdict: "Нормальне рішення, якщо студія так і заявила.",
    ok: true,
  },
  {
    quality: "висока",
    grade: "високий",
    example: "Онлайн-турніри, які стабільно працюють.",
    verdict: "Мрія, але дорого: більше функцій, які треба зробити добре.",
    ok: true,
  },
  {
    quality: "низька",
    grade: "низький",
    example: "Проста гра, яка ще й вилітає.",
    verdict: "Найгірший варіант: мало можливостей, і ті не працюють.",
    ok: false,
  },
  {
    quality: "низька",
    grade: "високий",
    example: "Онлайн-турніри, що падають під навантаженням.",
    verdict: "Проблема: гравці заплатили за функцію, яка не працює.",
    ok: false,
  },
];

// Quality and grade as two separate axes, on the game example.
export function QualityGrade() {
  const [i, setI] = useState(0);
  const c = cells[i];

  return (
    <Figure
      title="Якість і сорт"
      lead="Сорт можна обрати, низьку якість — ні."
      caption="Сорт (клас) — скільки можливостей має гра. Якість — чи працюють вони, як обіцяли. Натисніть на клітинку."
    >
      <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 text-sm">
        <span />
        <span className="text-center text-[13px] text-muted">низький сорт</span>
        <span className="text-center text-[13px] text-muted">високий сорт</span>

        {[0, 2].map((row) => (
          <div key={row} className="contents">
            <span className="flex items-center justify-center text-[13px] text-muted [writing-mode:vertical-rl] rotate-180">
              {cells[row].quality} якість
            </span>
            {[row, row + 1].map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={i === k}
                onClick={() => setI(k)}
                className={`min-h-24 rounded-[4px] border p-3 text-left transition-colors duration-200 ${
                  i === k ? "border-accent bg-accent-soft" : "border-border hover:border-accent"
                }`}
              >
                <span className={`text-[13px] font-medium ${cells[k].ok ? "" : "text-accent"}`}>
                  {cells[k].ok ? "✓ працює" : "✗ проблема"}
                </span>
                <span className="mt-1 block leading-snug">{cells[k].example}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <strong>
          {c.quality[0].toUpperCase() + c.quality.slice(1)} якість, {c.grade} сорт.
        </strong>{" "}
        {c.verdict}
      </p>
    </Figure>
  );
}
