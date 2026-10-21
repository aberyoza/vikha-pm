"use client";

import { useState } from "react";
import { Figure } from "./figure";

const questions = [
  { key: "req", text: "Вимоги зрозумілі й навряд чи зміняться" },
  { key: "tech", text: "Технологія команді добре знайома" },
  { key: "fixed", text: "Ціну й строк треба зафіксувати в договорі заздалегідь" },
  { key: "rules", text: "Є суворі правила: сертифікація, безпека, регулятори" },
  { key: "client", text: "Замовник може регулярно дивитися результат і давати відгук" },
  { key: "parts", text: "Результат можна віддавати частинами" },
] as const;

type Key = (typeof questions)[number]["key"];

// A rough guide: which development approach fits the answers.
export function ApproachSelector() {
  const [on, setOn] = useState<Record<Key, boolean>>({
    req: false,
    tech: true,
    fixed: true,
    rules: false,
    client: true,
    parts: true,
  });

  const predictive = Number(on.req) + Number(on.tech) + Number(on.fixed) + Number(on.rules);
  const adaptive = Number(!on.req) + Number(!on.tech) + Number(on.client) + Number(on.parts);
  const verdict =
    predictive - adaptive >= 2
      ? { name: "предиктивний", why: "вимоги й умови стабільні, а зміни дорогі — вигідно все спланувати наперед" }
      : adaptive - predictive >= 2
        ? { name: "адаптивний", why: "багато невизначеності, а результат можна показувати частинами й коригувати курс" }
        : { name: "гібридний", why: "частина роботи передбачувана, а частина — ні: першу плануємо наперед, другу робимо ітераціями" };

  return (
    <Figure
      title="Який підхід обрати"
      lead="Позначте, що правда для вашого проєкту."
      caption="Це підказка, а не правило. Підхід обирають разом із командою і замовником, а за потреби змінюють посеред проєкту. Початкові відповіді — для нашої гри."
    >
      <ul className="space-y-1.5">
        {questions.map((q) => (
          <li key={q.key}>
            <label className="flex cursor-pointer items-center gap-3 rounded-[4px] border border-border px-3 py-2 text-sm transition-colors duration-200 hover:border-accent">
              <input
                type="checkbox"
                checked={on[q.key]}
                onChange={(e) => setOn((s) => ({ ...s, [q.key]: e.target.checked }))}
                className="size-4 accent-[var(--accent)]"
              />
              {q.text}
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        Схоже, вам підходить{" "}
        <span className="font-display font-semibold text-accent">{verdict.name}</span> підхід: {verdict.why}.
      </p>
    </Figure>
  );
}
