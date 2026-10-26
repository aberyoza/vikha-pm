"use client";

import { useState } from "react";
import { Figure } from "./figure";

const STORY = "Як гравець, я хочу одразу повторити рівень після програшу, щоб не повертатися в меню.";

const rounds = [
  {
    name: "Перше голосування",
    votes: [
      { who: "Програміст", value: 3 },
      { who: "Дизайнер", value: 5 },
      { who: "Тестувальник", value: 13 },
      { who: "Другий програміст", value: 5 },
    ],
    note: "Оцінки розійшлися від 3 до 13. Програміст думав лише про кнопку «Ще раз». Тестувальник знає, що повтор треба перевірити на всіх 20 рівнях і трьох телефонах.",
  },
  {
    name: "Після обговорення",
    votes: [
      { who: "Програміст", value: 5 },
      { who: "Дизайнер", value: 5 },
      { who: "Тестувальник", value: 5 },
      { who: "Другий програміст", value: 5 },
    ],
    note: "Команда домовилася перевіряти повтор на трьох типових рівнях, а не на всіх двадцяти. Оцінки зійшлися: історія коштує 5 поінтів.",
  },
];

// One story estimated twice: the discussion between rounds matters more than the number.
export function PlanningPoker() {
  const [r, setR] = useState(0);
  const round = rounds[r];
  const values = round.votes.map((v) => v.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <Figure
      title="Покер планування"
      lead="Чотири розробники оцінюють одну історію."
      caption="Картки відкривають одночасно, щоб ніхто не підлаштовувався під інших. Ті, хто дав найменшу і найбільшу оцінку, пояснюють чому."
    >
      <p className="rounded-[4px] bg-surface-raised p-3 text-sm leading-relaxed">{STORY}</p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Раунд">
        {rounds.map((x, k) => (
          <button
            key={x.name}
            type="button"
            aria-pressed={k === r}
            onClick={() => setR(k)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
              k === r ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 @md:grid-cols-4" aria-live="polite">
        {round.votes.map((v) => {
          const outlier = min !== max && (v.value === min || v.value === max);
          return (
            <li key={v.who} className="flex flex-col items-center gap-2 text-center">
              <span
                className={`flex aspect-[3/4] w-16 items-center justify-center rounded-[4px] font-display text-3xl font-semibold transition-colors duration-300 ${
                  outlier ? "bg-accent text-accent-foreground" : "bg-surface-raised"
                }`}
              >
                {v.value}
              </span>
              <span className="text-[13px] text-muted">{v.who}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed">{round.note}</p>
    </Figure>
  );
}
