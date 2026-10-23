"use client";

import { useState } from "react";
import { Figure } from "./figure";

const activities = [
  {
    name: "Планування",
    question: "Які стандарти застосовуємо і як їх перевірятимемо?",
    when: "на старті проєкту і коли змінюються вимоги",
    who: "керівник проєкту разом із командою і замовником",
    output: "план управління якістю, показники якості з допусками",
    example: "99,5% сесій без вильотів, рівень завантажується за 3 секунди, перевірка на трьох телефонах.",
  },
  {
    name: "Забезпечення",
    question: "Чи правильно ми працюємо?",
    when: "весь час, поки йде робота",
    who: "уся команда",
    output: "покращений процес, оновлені чек-листи і правила",
    example: "Кожен рівень проходять двоє тестувальників на трьох телефонах, код переглядає другий розробник.",
  },
  {
    name: "Контроль",
    question: "Чи правильний результат вийшов?",
    when: "після кожної завершеної частини роботи",
    who: "тестувальники і той, хто приймає роботу",
    output: "результати перевірок, список дефектів",
    example: "Рівень 12 завантажується за 4 секунди замість 3. Це дефект, рівень повертають на доопрацювання.",
  },
];

// Planning, assurance and control of quality side by side.
export function QualityActivities() {
  const [i, setI] = useState(1);
  const a = activities[i];

  return (
    <Figure
      title="Три частини роботи з якістю"
      lead="Планування задає планку, забезпечення стежить за процесом, контроль перевіряє результат."
      caption="Забезпечення і контроль часто плутають. Підказка: забезпечення стосується того, як працює команда, а контроль — того, що вийшло."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Частина роботи з якістю">
        {activities.map((x, k) => (
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

      <div aria-live="polite">
        <p className="mt-5 font-display text-lg font-semibold leading-snug">{a.question}</p>
        <dl className="mt-3 grid gap-x-4 gap-y-2 text-sm @md:grid-cols-[7rem_minmax(0,1fr)]">
          <dt className="text-muted">Коли</dt>
          <dd>{a.when}</dd>
          <dt className="text-muted">Хто</dt>
          <dd>{a.who}</dd>
          <dt className="text-muted">Що виходить</dt>
          <dd>{a.output}</dd>
        </dl>
        <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed">
          <strong>У студії:</strong> {a.example}
        </p>
      </div>
    </Figure>
  );
}
