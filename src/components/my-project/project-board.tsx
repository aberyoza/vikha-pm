"use client";

import Link from "next/link";
import { useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { BOARD_COLUMNS, BOARD_RHYTHMS, findIdea, METHODS, type BoardColumn } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

type Card = NonNullable<MyProject["board"]>["cards"][number];

const LIMITS = [1, 2, 3, 4, 5];

const QUESTIONS = [
  { ask: "Яка у проєкті робота?", options: ["Новий продукт або велика функція", "Потік дрібних заявок"] },
  { ask: "Чи потрібен регулярний показ результату?", options: ["Так, раз на кілька тижнів", "Ні, результат одразу йде до людей"] },
];

// Answers given, the method they point to: same answers go to Scrum or Kanban, mixed to Scrumban.
const suggest = (answers: (number | null)[]) => {
  if (answers.some((a) => a === null)) return null;
  return answers[0] === answers[1] ? (answers[0] === 0 ? "Scrum" : "Kanban") : "Scrumban";
};

// The method, the limit and the board, for the bonus and the passport.
export function BoardList({ board }: { board: NonNullable<MyProject["board"]> }) {
  return (
    <div className="mt-3">
      <dl className="grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-[13px] text-muted">Метод</dt>
          <dd className="mt-0.5 font-medium leading-snug">{board.method}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Обмеження «В роботі»</dt>
          <dd className="mt-0.5 leading-snug tabular-nums">{board.limit}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Дивимося на дошку</dt>
          <dd className="mt-0.5 leading-snug">{board.rhythm}</dd>
        </div>
      </dl>
      <div className="mt-3 grid gap-1.5 sm:grid-cols-3">
        {BOARD_COLUMNS.map((c) => (
          <div key={c.key} className="rounded-[4px] bg-background p-2">
            <p className="text-[13px] text-muted">{c.name}</p>
            <ul className="mt-1 space-y-1 text-sm leading-snug">
              {board.cards
                .filter((card) => card.column === c.key)
                .map((card) => (
                  <li key={card.name}>{card.name}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// Milestone 12 of the reader's project: a method, a limit and the first cards on a board.
export function BoardEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const idea = findIdea(project.what, project.who);
  const saved = project.board;
  const blocks = project.scope?.blocks ?? idea?.scope.blocks ?? [];
  const [cards, setCards] = useState<Card[]>(
    blocks.map((name) => {
      const old = saved?.cards.find((c) => c.name === name);
      if (old) return old;
      const k = idea?.scope.blocks.indexOf(name) ?? -1;
      return { name, column: k >= 0 && idea!.board.doing.includes(k) ? "doing" : "queue" };
    }),
  );
  const [method, setMethod] = useState(saved?.method ?? idea?.board.method ?? "");
  const [limit, setLimit] = useState(saved?.limit ?? idea?.board.limit ?? 2);
  const [rhythm, setRhythm] = useState(saved?.rhythm ?? idea?.board.rhythm ?? "");
  const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null));

  const doing = cards.filter((c) => c.column === "doing").length;
  const over = doing > limit;
  const hint = suggest(answers);
  const ready = cards.length > 0 && !!method && !!rhythm && !over;

  const setColumn = (name: string, column: BoardColumn) => setCards((cs) => cs.map((c) => (c.name === name ? { ...c, column } : c)));
  const save = () => {
    if (!ready) return;
    saveProject({ ...project, board: { method, limit, rhythm, cards }, updatedAt: new Date().toISOString() });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Як працюватиме «{project.name}»? Виберіть метод, поставте обмеження незавершеної роботи і розкладіть блоки роботи на дошці.
        {idea && !saved && " Для вашої ідеї все вже заповнено. Змініть, якщо у вас інакше."}
      </p>

      {blocks.length === 0 ? (
        <div className="mt-5">
          <p className="leading-relaxed">Спершу потрібні блоки роботи: їх складають у завданні модуля 7.</p>
          <Link href={assignmentHref("module-07")} className={`${primary} mt-3 inline-block`}>
            До завдання модуля 7
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-5 space-y-5">
            <div>
              <p className="font-medium">Який метод підходить проєкту?</p>
              <div className="mt-2 space-y-2 rounded-[6px] bg-background p-3">
                {QUESTIONS.map((q, k) => (
                  <div key={q.ask}>
                    <p className="text-sm">{q.ask}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label={q.ask}>
                      {q.options.map((o, j) => (
                        <button
                          key={o}
                          type="button"
                          aria-pressed={answers[k] === j}
                          onClick={() => setAnswers((a) => a.map((v, i) => (i === k ? j : v)))}
                          className={chip(answers[k] === j)}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {hint && (
                  <p className="text-sm text-muted" aria-live="polite">
                    За цими відповідями підходить {hint}.
                  </p>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Метод">
                {METHODS.map((m) => (
                  <button key={m} type="button" aria-pressed={method === m} onClick={() => setMethod(m)} className={chip(method === m)}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium">Скільки задач одночасно може бути в роботі?</p>
              <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Обмеження незавершеної роботи">
                {LIMITS.map((l) => (
                  <button key={l} type="button" aria-pressed={limit === l} onClick={() => setLimit(l)} className={`${chip(limit === l)} tabular-nums`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium">Де зараз кожен блок роботи?</p>
              <ul className="mt-2 space-y-2">
                {cards.map((c) => (
                  <li key={c.name} className="rounded-[6px] bg-background p-3">
                    <p className="font-medium leading-snug">{c.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={`Колонка: ${c.name}`}>
                      {BOARD_COLUMNS.map((col) => (
                        <button key={col.key} type="button" aria-pressed={c.column === col.key} onClick={() => setColumn(c.name, col.key)} className={chip(c.column === col.key)}>
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              {over && (
                <p className="mt-3 rounded-[4px] bg-accent-soft p-3 text-sm leading-relaxed" aria-live="polite">
                  У роботі {doing} задачі за обмеження {limit}. Спершу закінчіть почате або збільште обмеження.
                </p>
              )}
            </div>

            <div>
              <p className="font-medium">Як часто команда дивиться на дошку?</p>
              <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Ритм">
                {BOARD_RHYTHMS.map((r) => (
                  <button key={r} type="button" aria-pressed={rhythm === r} onClick={() => setRhythm(r)} className={chip(rhythm === r)}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={save} disabled={!ready} className={primary}>
              Поставити віху
            </button>
            {!ready && <span className="text-sm text-muted">Виберіть метод і ритм, а в роботі лиште не більше задач, ніж дозволяє обмеження.</span>}
          </div>
        </>
      )}
    </div>
  );
}

// End of the module 13 game: the twelfth milestone of the own project.
export function BoardBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: дванадцята віха вашого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут запускають дошку вашого власного проєкту. Але спершу його треба зібрати: це хвилина наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.board ? (
        <>
          <p className="text-[13px] text-muted">Дванадцята віха вашого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Перші задачі на дошці</h3>
          <BoardEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">Перші задачі на дошці</p>
          <BoardList board={project.board} />
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
            Дванадцята віха поставлена. Наступну додасте в завданні модуля 14: як зрозуміти, що вигода настала.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/my-project" className={chip(false)}>
              Паспорт проєкту
            </Link>
            <button type="button" onClick={() => setEditing(true)} className={chip(false)}>
              Змінити
            </button>
          </div>
        </>
      )}
    </div>
  );
}
