"use client";

import { useState } from "react";
import { Figure } from "./figure";

const artifacts = [
  {
    name: "Беклог продукту",
    commitment: "Ціль продукту",
    goal: "гра з 20 рівнями, яку до кінця проходять 30% гравців",
    owner: "власник продукту",
    inside: "Рівні 6–20, онлайн-турніри, сторінка в магазині, виправлення з бета-тесту. Усе впорядковано за важливістю.",
  },
  {
    name: "Беклог спринту",
    commitment: "Ціль спринту",
    goal: "рівні 6–8 можна пройти на всіх тестових телефонах",
    owner: "розробники",
    inside: "Рівні 6, 7 і 8 і задачі до них: зібрати, перевірити на трьох телефонах, виправити знайдене.",
  },
  {
    name: "Інкремент",
    commitment: "Визначення «готово»",
    goal: "код переглянуто, тести пройдено, рівень перевірено на трьох телефонах",
    owner: "розробники",
    inside: "Три нові рівні, які можна випустити оновленням.",
  },
];

// Product backlog, sprint backlog and increment, each with its commitment.
export function ScrumArtifacts() {
  const [i, setI] = useState(0);
  const a = artifacts[i];

  return (
    <Figure
      title="Від беклогу до інкременту"
      lead="Кожен артефакт Scrum має зобов'язання, яке робить його зрозумілим."
      caption="Зобов'язання стоїть під кожним артефактом. Натисніть на артефакт, щоб побачити, що в ньому лежить у студії."
    >
      <ol className="grid gap-2 @xl:grid-cols-[1fr_auto_1fr_auto_1fr] @xl:items-stretch">
        {artifacts.map((x, k) => (
          <li key={x.name} className="contents">
            {k > 0 && (
              <span aria-hidden className="flex items-center justify-center text-muted">
                <span className="@xl:hidden">↓</span>
                <span className="hidden @xl:inline">→</span>
              </span>
            )}
            <button
              type="button"
              aria-pressed={k === i}
              onClick={() => setI(k)}
              className={`rounded-[4px] border p-3 text-left transition-colors duration-200 ${
                k === i ? "border-accent bg-accent-soft" : "border-border hover:border-accent"
              }`}
            >
              <span className="block font-medium">{x.name}</span>
              <span className="mt-2 block border-t border-border pt-2 text-[13px] text-muted">{x.commitment}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <p>
          <strong>{a.commitment}:</strong> «{a.goal}».
        </p>
        <p className="mt-2 text-sm">
          <span className="text-muted">Що всередині:</span> {a.inside}
        </p>
        <p className="mt-1 text-sm">
          <span className="text-muted">Хто опікується:</span> {a.owner}
        </p>
      </div>
    </Figure>
  );
}
