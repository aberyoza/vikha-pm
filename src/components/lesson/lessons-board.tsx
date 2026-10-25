"use client";

import { useState } from "react";
import { Figure } from "./figure";

const columns = [
  {
    name: "Що вийшло добре",
    cards: [
      { text: "Двотижневі спринти з демо для засновників", from: "Модуль 8: засновники бачили результат кожні два тижні і рано помічали, що йде не так." },
      { text: "Тестування кожного рівня одразу", from: "Модуль 13: це покращення команда обрала на ретроспективі, і дефектів наприкінці стало менше." },
      { text: "Резерв 30 тис. грн", from: "Модулі 9 і 11: резерв покрив перевитрату, і бюджет 300 тис. грн не довелося збільшувати." },
    ],
  },
  {
    name: "Що покращити",
    cards: [
      { text: "Механіка і сервер в одного програміста", from: "Модуль 10: перевантаження помітили лише тоді, коли побудували гістограму ресурсів." },
      { text: "Бібліотеку оновили без тесту на старих телефонах", from: "Модуль 12: збірка 9 вийшла за межу контрольної карти." },
      { text: "Маркетинг за два тижні до релізу", from: "Урок 1 цього модуля: до релізу гру додали в список бажань лише 2 тисячі людей." },
    ],
  },
  {
    name: "Де нам пощастило",
    cards: [
      { text: "Програміст не захворів перед релізом", from: "Модуль 11: у реєстрі був ризик «іде ключовий програміст», а код сервера все одно знав лише він. Хвороба перед релізом мала б такий самий наслідок." },
    ],
  },
  {
    name: "Що робимо інакше",
    cards: [
      { text: "Перевіряти навантаження людей на плануванні", from: "Урок з модуля 10." },
      { text: "Тест на старих телефонах у чек-листі релізу", from: "Урок з модуля 12." },
      { text: "Починати маркетинг з першого тижня", from: "Урок з першого уроку цього модуля." },
      { text: "Другий розробник вивчає код сервера", from: "Урок з того, де пощастило: наступного разу удачі може не бути." },
    ],
  },
];

const cards = columns.flatMap((c) => c.cards);

// The studio's lessons learned, sorted the way the retrospective template does.
export function LessonsBoard() {
  const [sel, setSel] = useState(cards[6].text);
  const card = cards.find((c) => c.text === sel)!;

  return (
    <Figure
      title="Уроки проєкту"
      lead="Що студія забирає з гри в наступний проєкт."
      caption="Натисніть на картку, щоб побачити, з якого місця курсу цей урок."
    >
      <div className="grid gap-3 @xl:grid-cols-2">
        {columns.map((col) => (
          <div key={col.name} className="rounded-[4px] bg-background p-2.5">
            <p className="mb-2 text-[13px] text-muted">{col.name}</p>
            <ul className="space-y-1.5">
              {col.cards.map((c) => (
                <li key={c.text}>
                  <button
                    type="button"
                    aria-pressed={sel === c.text}
                    onClick={() => setSel(c.text)}
                    className={`w-full rounded-[2px] border px-2.5 py-1.5 text-left text-[13px] leading-snug transition-colors duration-200 ${
                      sel === c.text ? "border-accent bg-accent-soft" : "border-border bg-surface hover:border-accent"
                    }`}
                  >
                    {c.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <strong>{card.text}.</strong> {card.from}
      </p>
    </Figure>
  );
}
