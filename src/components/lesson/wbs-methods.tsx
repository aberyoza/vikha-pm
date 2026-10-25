"use client";

import { type CSSProperties, useState } from "react";
import { Figure } from "./figure";

type Branch = { name: string; items: string[] };

const methods: { key: string; label: string; idea: string; branches: Branch[] }[] = [
  {
    key: "product",
    label: "Предметний",
    idea: "Ділимо за тим, що отримаємо в кінці: за продуктами чи їхніми частинами.",
    branches: [
      { name: "Застосунок гри", items: ["Механіка", "20 рівнів", "Персонажі"] },
      { name: "Сервер", items: ["Акаунти гравців", "Таблиця рекордів"] },
      { name: "Сторінка в магазині", items: ["Опис", "Скриншоти", "Трейлер"] },
    ],
  },
  {
    key: "phases",
    label: "За етапами",
    idea: "Ділимо за фазами життєвого циклу: що робимо спочатку, що потім.",
    branches: [
      { name: "Ініціація", items: ["Концепція", "Бюджет"] },
      { name: "Розробка", items: ["Дизайн", "Механіка", "Рівні"] },
      { name: "Реалізація", items: ["Тестування", "Реліз"] },
      { name: "Завершення", items: ["Звіт", "Висновки на майбутнє"] },
    ],
  },
  {
    key: "org",
    label: "Організаційний",
    idea: "Ділимо між підрозділами чи людьми, які виконуватимуть роботу.",
    branches: [
      { name: "Програміст", items: ["Механіка", "Сервер"] },
      { name: "Дизайнер", items: ["Персонажі", "Рівні"] },
      { name: "Маркетолог", items: ["Сторінка в магазині", "Реклама"] },
    ],
  },
  {
    key: "geo",
    label: "Територіальний",
    idea: "Ділимо за містами чи місцями, де виконуватимуть роботу.",
    branches: [
      { name: "Київ", items: ["Механіка", "Сервер"] },
      { name: "Львів", items: ["Дизайн", "Рівні"] },
      { name: "Одеса", items: ["Тестування на телефонах"] },
    ],
  },
  {
    key: "function",
    label: "Функціональний",
    idea: "Ділимо між проєктною командою і звичайною, щоденною роботою компанії.",
    branches: [
      { name: "Проєктна команда", items: ["Гра", "Сервер", "Реліз"] },
      { name: "Щоденна робота студії", items: ["Бухгалтерія: оплата ліцензій", "Юрист: договори з магазинами", "Підтримка: відповіді гравцям"] },
    ],
  },
];

// The same game broken down five ways.
export function WbsMethods() {
  const [key, setKey] = useState(methods[0].key);
  const method = methods.find((m) => m.key === key)!;

  return (
    <Figure
      title="П'ять способів розбити проєкт"
      lead="Один проєкт, п'ять різних структур робіт."
      caption="Спосіб обирають під задачу. Часто їх поєднують: перший рівень, наприклад, за етапами, а другий — за результатами."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Спосіб розбиття">
        {methods.map((m) => {
          const on = m.key === key;
          return (
            <button
              key={m.key}
              type="button"
              aria-pressed={on}
              onClick={() => setKey(m.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
                on
                  ? "bg-accent text-accent-foreground"
                  : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted" aria-live="polite">
        {method.idea}
      </p>

      <div className="mt-5">
        <div className="mx-auto w-fit rounded-[4px] bg-accent px-4 py-2 font-display font-semibold text-accent-foreground">
          Мобільна гра
        </div>
        <span aria-hidden className="mx-auto block h-4 w-0.5 bg-border" />
        <ul
          className="grid gap-3 border-t-2 border-border pt-4 @md:grid-cols-2 @2xl:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
          style={{ "--cols": method.branches.length } as CSSProperties}
        >
          {method.branches.map((b) => (
            <li key={b.name} className="rounded-[4px] border border-border bg-surface p-3">
              <p className="font-medium">{b.name}</p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {b.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rotate-45 rounded-[1px] bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}
