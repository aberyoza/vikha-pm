"use client";

import { useState } from "react";
import { Figure } from "./figure";

const metrics = [
  {
    name: "Закриті тікети",
    gamed: "Частину тікетів можуть закривати з позначкою «не відтворюється», хоча баги нікуди не зникнуть.",
    pair: "Частка тікетів, відкритих повторно",
    why: "Якщо тікет закрили, а баг лишився, його відкриють знову, і друге число це покаже.",
  },
  {
    name: "Час відповіді підтримки",
    gamed: "Оператори можуть відповідати шаблоном, не розібравшись у проблемі гравця.",
    pair: "Оцінка, яку гравець ставить після звернення",
    why: "Швидка, але порожня відповідь отримає низьку оцінку.",
  },
  {
    name: "Завантаження",
    gamed: "Можна купити дешеву рекламу, після якої люди завантажують гру і видаляють її за хвилину.",
    pair: "Гравці, які грають через 7 днів",
    why: "Випадкові завантаження не дадуть гравців через тиждень.",
  },
  {
    name: "Швидкість команди",
    gamed: "Команда може оцінювати ті самі задачі в більше поінтів, і швидкість росте на папері.",
    pair: "Чи досягнуто ціль спринту",
    why: "Роздуті оцінки не допоможуть, якщо обіцяного результату наприкінці спринту немає.",
  },
];

// One metric invites gaming; a counter-metric closes the loophole.
export function PairedMetrics() {
  const [i, setI] = useState(0);
  const [paired, setPaired] = useState(false);
  const m = metrics[i];

  return (
    <Figure
      title="Парні показники"
      lead="Одне число легко підігнати, два, що врівноважують одне одного, — значно складніше."
      caption="Оберіть показник студії, подивіться, як його можна підігнати, і додайте до нього пару."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Показник">
        {metrics.map((x, k) => (
          <button
            key={x.name}
            type="button"
            aria-pressed={k === i}
            onClick={() => {
              setI(k);
              setPaired(false);
            }}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              k === i ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent hover:text-accent"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-2 @md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] @md:items-stretch" aria-live="polite">
        <div className="rounded-[4px] border border-border p-3 text-sm">
          <p className="font-medium">{m.name}</p>
          <p className="mt-2 text-muted">{m.gamed}</p>
        </div>
        <span aria-hidden className="flex items-center justify-center font-display text-lg text-muted">
          +
        </span>
        {paired ? (
          <div className="rounded-[4px] border border-accent bg-accent-soft p-3 text-sm">
            <p className="font-medium">{m.pair}</p>
            <p className="mt-2">{m.why}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPaired(true)}
            className="rounded-[4px] border border-dashed border-accent p-3 text-sm font-medium text-accent transition-colors duration-200 hover:bg-accent-soft"
          >
            Додати пару
          </button>
        )}
      </div>
    </Figure>
  );
}
