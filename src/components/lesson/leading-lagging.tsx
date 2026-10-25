"use client";

import { useState } from "react";
import { Figure } from "./figure";

type Kind = "leading" | "lagging";

const stages = [
  {
    when: "Бета-тест",
    metrics: [
      {
        name: "Повернулися в гру наступного дня",
        kind: "leading" as Kind,
        value: "42% бета-тестерів",
        decision: "Якщо повертається мало, перші рівні не чіпляють. Їх ще можна переробити до релізу.",
      },
    ],
  },
  {
    when: "За 2 тижні до релізу",
    metrics: [
      {
        name: "Додали гру в список бажань",
        kind: "leading" as Kind,
        value: "2 тисячі людей",
        decision: "Для 50 тисяч завантажень за три місяці це мало. Маркетинг треба посилювати вже зараз.",
      },
    ],
  },
  {
    when: "Перший місяць",
    metrics: [
      {
        name: "Грають через тиждень після завантаження",
        kind: "leading" as Kind,
        value: "18% гравців",
        decision: "Підказує майбутній дохід: хто кинув гру за тиждень, той у ній нічого не купить. Ще є час на оновлення.",
      },
      {
        name: "Оцінки в перші дні",
        kind: "leading" as Kind,
        value: "4,2 з 5",
        decision: "Підказує майбутній рейтинг. Читаємо відгуки і виправляємо головні скарги, поки оцінок мало.",
      },
    ],
  },
  {
    when: "Три місяці",
    metrics: [
      {
        name: "Завантаження",
        kind: "lagging" as Kind,
        value: "38 тисяч",
        decision: "Каже, що ціль не досягнута. Вплинути на ці три місяці вже не можна, тільки на наступні.",
      },
      {
        name: "Дохід за квартал",
        kind: "lagging" as Kind,
        value: "26 тис. грн",
        decision: "Підсумок кварталу. Його рахують у звіті, але змінити вже пізно.",
      },
      {
        name: "Рейтинг у магазині",
        kind: "lagging" as Kind,
        value: "4,4 з 5",
        decision: "Ціль 4,3 досягнута. Рейтинг змінюється повільно, тому на нього дивляться разом із свіжими відгуками.",
      },
    ],
  },
];

const all = stages.flatMap((s) => s.metrics.map((m) => ({ ...m, when: s.when })));

// The game's metrics on a timeline: which ones still leave time to act.
export function LeadingLagging() {
  const [sel, setSel] = useState(all[1].name);
  const m = all.find((x) => x.name === sel)!;

  return (
    <Figure
      title="Випереджальні і запізнілі показники"
      lead="Одні показники підказують, що буде, інші кажуть, що вже сталося."
      caption="Медовим — випереджальні показники, сірим — запізнілі. Натисніть на показник, щоб побачити, яке рішення він підказує."
    >
      <ol className="grid gap-3 @xl:grid-cols-4">
        {stages.map((s) => (
          <li key={s.when} className="border-t-2 border-border pt-2 @xl:border-t-0 @xl:border-l-2 @xl:pl-3 @xl:pt-0">
            <p className="text-[13px] text-muted">{s.when}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 @xl:flex-col">
              {s.metrics.map((x) => (
                <button
                  key={x.name}
                  type="button"
                  aria-pressed={sel === x.name}
                  onClick={() => setSel(x.name)}
                  className={`rounded-[4px] px-2.5 py-1.5 text-left text-[13px] leading-snug transition-colors duration-200 ${
                    x.kind === "leading" ? "bg-accent text-accent-foreground" : "bg-foreground/15"
                  } ${sel === x.name ? "outline-2 outline-offset-2 outline-foreground" : "hover:opacity-80"}`}
                >
                  {x.name}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <p>
          <strong>{m.name}:</strong> {m.value}.{" "}
          <span className="text-muted">{m.kind === "leading" ? "Випереджальний показник." : "Запізнілий показник."}</span>
        </p>
        <p className="mt-1">{m.decision}</p>
      </div>
    </Figure>
  );
}
