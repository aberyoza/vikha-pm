"use client";

import { useState } from "react";
import { Figure } from "./figure";

const questions = [
  {
    q: "Яка робота?",
    scrum: "Новий продукт або велика функція",
    kanban: "Потік заявок: баги, дрібні покращення",
  },
  {
    q: "Як часто приходять термінові задачі?",
    scrum: "Рідко, можна дочекатися наступного спринту",
    kanban: "Щодня, чекати не можна",
  },
  {
    q: "Чи треба регулярно показувати результат зацікавленим сторонам?",
    scrum: "Так, раз на два тижні показуємо засновникам",
    kanban: "Ні, результат одразу йде до гравців",
  },
  {
    q: "Хто вирішує, що робити першим?",
    scrum: "Власник продукту, раз на спринт",
    kanban: "Терміновість самих заявок",
  },
];

const results = {
  scrum: {
    name: "Scrum",
    why: "Робота велика й нова, її можна планувати порціями на спринт, а регулярний огляд дає відгуки зацікавлених сторін. Так студія робила рівні до релізу.",
  },
  kanban: {
    name: "Kanban",
    why: "Заявки приходять постійно й різного розміру, тож чекати планування спринту немає сенсу. Дошка з обмеженням незавершеної роботи тримає потік.",
  },
  scrumban: {
    name: "Scrumban",
    why: "Відповіді розділилися. Візьміть ритм спринтів з оглядом і ретроспективою, а задачі ведіть на дошці з обмеженням незавершеної роботи, лишаючи місце для термінових заявок. Так студія працює після релізу.",
  },
};

type Answer = "scrum" | "kanban";

// Four questions that point to Scrum, Kanban or a mix of both.
export function ScrumOrKanban() {
  const [answers, setAnswers] = useState<Answer[]>(["scrum", "scrum", "scrum", "scrum"]);
  const scrum = answers.filter((a) => a === "scrum").length;
  const r = results[scrum >= 3 ? "scrum" : scrum <= 1 ? "kanban" : "scrumban"];

  return (
    <Figure
      title="Scrum чи Kanban"
      lead="Чотири питання про вашу роботу."
      caption="За замовчуванням стоять відповіді студії до релізу. Спробуйте відповісти, як після релізу."
    >
      <ol className="space-y-4">
        {questions.map((x, k) => (
          <li key={x.q}>
            <p className="text-sm font-medium">
              {k + 1}. {x.q}
            </p>
            <div className="mt-2 grid gap-2 @md:grid-cols-2" role="group" aria-label={x.q}>
              {(["scrum", "kanban"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={answers[k] === a}
                  onClick={() => setAnswers((prev) => prev.map((v, j) => (j === k ? a : v)))}
                  className={`rounded-[4px] border px-3 py-2 text-left text-sm transition-colors duration-200 ${
                    answers[k] === a ? "border-accent bg-accent-soft" : "border-transparent bg-foreground/[0.04] hover:bg-foreground/[0.08]"
                  }`}
                >
                  {x[a]}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <strong>Підійде {r.name}.</strong> {r.why}
      </p>
    </Figure>
  );
}
