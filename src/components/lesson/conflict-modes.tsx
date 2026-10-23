"use client";

import { useState } from "react";
import { Figure } from "./figure";

const modes = [
  {
    name: "Уникнення",
    what: "Керівник відкладає питання до наступного тижня.",
    result: "Напруга росте, а рівні тим часом ніхто не планує. Підходить, лише якщо питання неважливе або людям треба охолонути.",
  },
  {
    name: "Згладжування",
    what: "Керівник наголошує, що обидва хочуть кращої гри, і просить дизайнера поступитися.",
    result: "Конфлікт стихає, але дизайнер відчуває, що його ідею відкинули. Причина нікуди не ділася.",
  },
  {
    name: "Компроміс",
    what: "Додають 2 рівні замість 5.",
    result: "Кожен щось отримав і щось втратив. Швидко, але 2 рівні можуть не дати того, заради чого дизайнер пропонував 5.",
  },
  {
    name: "Примус",
    what: "Керівник вирішує сам: нових рівнів не буде.",
    result: "Рішення є одразу, але дизайнер може втратити мотивацію. Доречно, коли часу на обговорення немає.",
  },
  {
    name: "Співпраця",
    what: "Утрьох з'ясовують, навіщо дизайнеру нові рівні і чого боїться програміст.",
    result: "Виявляється, гравці з бета-тесту проходять гру надто швидко. Рішення: 5 рівнів додають першим оновленням після релізу. Довше, але влаштовує всіх.",
  },
];

// One conflict in the studio, five ways to resolve it.
export function ConflictModes() {
  const [i, setI] = useState(4);
  const m = modes[i];
  return (
    <Figure
      title="Конфлікт у студії"
      lead="Дизайнер хоче додати 5 рівнів, програміст проти: до релізу місяць."
      caption="Немає одного правильного способу. Обирають залежно від важливості питання, часу і стосунків у команді."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Спосіб розв'язання">
        {modes.map((x, k) => (
          <button
            key={x.name}
            type="button"
            aria-pressed={k === i}
            onClick={() => setI(k)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              k === i ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent hover:text-accent"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2 text-sm" aria-live="polite">
        <p>
          <span className="font-medium">Що робить керівник:</span> {m.what}
        </p>
        <p className="rounded-[4px] bg-accent-soft p-4 leading-relaxed">
          <span className="font-medium">Що виходить:</span> {m.result}
        </p>
      </div>
    </Figure>
  );
}
