"use client";

import { useState } from "react";
import { Figure } from "./figure";

type Lead = "ai" | "human";

const tasks: { task: string; lead: Lead; why: string }[] = [
  { task: "Написати чернетку звіту про стан", lead: "ai", why: "ШІ швидко складе текст із даних, але цифри в ньому керівник перевіряє сам: відповідає той, хто надсилає звіт." },
  { task: "Підсумувати 300 відгуків гравців", lead: "ai", why: "ШІ згрупує скарги за темами за хвилини. Кілька відгуків варто прочитати самому, щоб перевірити, чи нічого не загубилося." },
  { task: "Скласти протокол зустрічі", lead: "ai", why: "Підсумок і список домовленостей ШІ зробить із запису. Учасники підтверджують, що домовленості записано правильно." },
  { task: "Запропонувати ризики для оновлення", lead: "ai", why: "ШІ підкаже ризики, про які команда не подумала. Оцінює їх і обирає реакції команда (модуль 11)." },
  { task: "Перекласти опис гри англійською", lead: "ai", why: "Чернетку перекладу зробить ШІ, а вичитує людина, яка добре знає мову і гравців." },
  { task: "Оцінити тривалість задач", lead: "ai", why: "ШІ підкаже оцінку за історією попередніх спринтів. Остаточну оцінку дає той, хто робитиме роботу (модуль 8)." },
  { task: "Вирішити, чи переносити реліз", lead: "human", why: "Рішення зачіпає гроші, обіцянки гравцям і партнерам. Ухвалює його спонсор разом із керівником проєкту." },
  { task: "Поговорити з дизайнером, який хоче піти", lead: "human", why: "Тут потрібні довіра і розуміння людини. Таку розмову не можна делегувати." },
  { task: "Домовитися зі студією звуку про нові умови", lead: "human", why: "Переговори тримаються на стосунках і відповідальності за підпис. ШІ може допомогти підготуватися, але домовляється людина." },
  { task: "Вставити договір із замовником у чат-бот", lead: "human", why: "Без дозволу замовника не можна: дані потраплять до третьої сторони. Спершу треба знати правила компанії щодо ШІ." },
];

// Which project manager tasks an AI assistant can take and which stay human.
export function AiOrHuman() {
  const [i, setI] = useState(0);
  const t = tasks[i];

  return (
    <Figure
      title="ШІ чи людина"
      lead="Де ШІ-асистент допомагає керівнику проєкту, а де рішення лишається за людиною."
      caption="Натисніть на задачу. Медова позначка — ШІ допомагає, сіра — головна людина."
    >
      <ul className="grid gap-2 @md:grid-cols-2">
        {tasks.map((x, k) => (
          <li key={x.task}>
            <button
              type="button"
              aria-pressed={k === i}
              onClick={() => setI(k)}
              className={`flex w-full items-center gap-2.5 rounded-[4px] border px-3 py-2 text-left text-sm transition-colors duration-200 ${
                k === i ? "border-accent bg-accent-soft" : "border-transparent bg-foreground/[0.04] hover:bg-foreground/[0.08]"
              }`}
            >
              <span
                className={`shrink-0 rounded-[2px] px-1.5 py-0.5 text-[11px] font-semibold ${
                  x.lead === "ai" ? "bg-accent text-accent-foreground" : "bg-foreground/20"
                }`}
              >
                {x.lead === "ai" ? "ШІ" : "людина"}
              </span>
              {x.task}
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <strong>{t.lead === "ai" ? "ШІ допомагає." : "Рішення за людиною."}</strong> {t.why}
      </p>
    </Figure>
  );
}
