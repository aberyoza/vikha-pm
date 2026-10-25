"use client";

import { useState } from "react";
import { Figure } from "./figure";

const items = [
  { name: "Прийняти результат", skipped: "Через місяць засновники згадують, що «так не домовлялися», і суперечка про оплату триває." },
  { name: "Передати в підтримку", skipped: "Гравці пишуть про баг, а відповісти нікому: ніхто не знає доступів до панелі магазину." },
  { name: "Закрити контракти", skipped: "Студія звуку виставляє рахунок за правки, про які забули домовитися." },
  { name: "Звільнити ресурси", skipped: "Тестові сервери працюють ще пів року, і студія платить за них 4 тис. грн на місяць." },
  { name: "Підбити підсумки", skipped: "Ніхто не знає, наскільки точними були оцінки, і наступний проєкт планують так само навмання." },
  { name: "Зберегти документи", skipped: "Через рік ніхто не може знайти договір з магазином і рішення про ціну." },
  { name: "Подякувати команді", skipped: "Люди йдуть на наступний проєкт утомленими і з відчуттям, що їхню роботу ніхто не помітив." },
];

// Closing checklist: what happens to the studio when a step is skipped.
export function ClosingChecklist() {
  const [done, setDone] = useState<boolean[]>(items.map((_, k) => k < 3));
  const [sel, setSel] = useState(3);
  const left = done.filter((d) => !d).length;

  return (
    <Figure
      title="Чек-лист закриття"
      lead="Сім справ, після яких проєкт справді закінчено."
      caption="Позначайте пункти. Натисніть на назву, щоб побачити, що станеться, якщо її пропустити."
    >
      <ul className="divide-y divide-border">
        {items.map((x, k) => (
          <li key={x.name} className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={done[k]}
              onChange={(e) => setDone((prev) => prev.map((v, j) => (j === k ? e.target.checked : v)))}
              aria-label={x.name}
              className="size-4 shrink-0 accent-[var(--accent)]"
            />
            <button
              type="button"
              aria-pressed={sel === k}
              onClick={() => setSel(k)}
              className={`text-left text-sm transition-colors duration-200 hover:text-accent ${sel === k ? "font-semibold" : ""} ${done[k] ? "text-muted line-through" : ""}`}
            >
              {x.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <p>
          <strong>Якщо пропустити «{items[sel].name.toLowerCase()}»:</strong> {items[sel].skipped}
        </p>
        <p className="mt-2 text-sm">
          {left === 0
            ? "Усі пункти виконано. Проєкт закрито, і зомбі-проєктом він не стане."
            : `Лишилося пунктів: ${left}. Поки вони не виконані, проєкт формально ще триває.`}
        </p>
      </div>
    </Figure>
  );
}
