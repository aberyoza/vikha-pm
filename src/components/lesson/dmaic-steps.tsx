"use client";

import { useState } from "react";
import { Figure } from "./figure";

const STEPS = [
  {
    letter: "D",
    en: "Define",
    name: "визначити",
    what: "яка проблема і яка ціль",
    game: "Рівні завантажуються довше 3 секунд у 20% випадків. Ціль: не більше 5%.",
  },
  {
    letter: "M",
    en: "Measure",
    name: "виміряти",
    what: "зібрати дані про те, як є зараз",
    game: "Час 1 000 завантажень на різних телефонах, з моделлю телефону і номером рівня.",
  },
  {
    letter: "A",
    en: "Analyze",
    name: "проаналізувати",
    what: "знайти причину даними, а не здогадками",
    game: "Діаграма розсіювання показує зв'язок із пам'яттю телефону, Парето — що половину часу забирають текстури.",
  },
  {
    letter: "I",
    en: "Improve",
    name: "покращити",
    what: "змінити процес і перевірити результат",
    game: "Стиснули текстури, повторили вимірювання: довше 3 секунд — 4% завантажень.",
  },
  {
    letter: "C",
    en: "Control",
    name: "утримувати",
    what: "не дати проблемі повернутися",
    game: "Контрольна карта часу завантаження для кожної збірки, як у модулі 12, і перевірка розміру текстур у чек-листі релізу.",
  },
];

// The five DMAIC steps on the level loading problem.
export function DmaicSteps() {
  const [i, setI] = useState(0);
  const s = STEPS[i];

  return (
    <Figure
      title="DMAIC (визначити, виміряти, проаналізувати, покращити, утримувати)"
      lead="Як студія розібралася з довгим завантаженням рівнів."
      caption="DMAIC — проєкт покращення на тижні чи місяці. Для швидких проблем вистачає циклу PDCA (план, зробити, перевірити, діяти) з модуля 12. Натисніть на крок."
    >
      <ol className="grid grid-cols-5 gap-1" role="group" aria-label="Кроки DMAIC">
        {STEPS.map((x, k) => (
          <li key={x.letter}>
            <button
              type="button"
              aria-pressed={k === i}
              aria-label={`${x.en}: ${x.name}`}
              onClick={() => setI(k)}
              className={`flex h-14 w-full flex-col items-center justify-center rounded-[4px] press ${
                k === i ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
              }`}
            >
              <span className="font-display text-xl font-semibold">{x.letter}</span>
              <span className="hidden text-[11px] @md:block">{x.en}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-4" aria-live="polite">
        <p className="font-display text-lg font-semibold">
          {s.en}: {s.name}
        </p>
        <p className="mt-1 text-sm text-muted">{s.what}</p>
        <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed">
          <strong>У студії:</strong> {s.game}
        </p>
      </div>
    </Figure>
  );
}
