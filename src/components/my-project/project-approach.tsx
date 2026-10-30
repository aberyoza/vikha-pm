"use client";

import Link from "next/link";
import { useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { APPROACH_KINDS, APPROACH_QUESTIONS, findIdea, recommendApproach } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

// Milestone 2 of the reader's project: four questions, a recommended approach
// and delivery cadence, and the approach the reader picks.
export function ApproachEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const idea = findIdea(project.what, project.who);
  const [answers, setAnswers] = useState<(number | null)[]>(
    project.approach?.answers ?? idea?.approach ?? APPROACH_QUESTIONS.map(() => null),
  );
  const complete = answers.every((a) => a !== null);
  const rec = complete ? recommendApproach(answers as number[]) : null;
  const [kind, setKind] = useState<string | null>(project.approach?.kind ?? null);
  const chosen = kind ?? rec?.kind.name ?? null;

  const answer = (q: number, a: number) => {
    setAnswers((prev) => prev.map((v, k) => (k === q ? a : v)));
    setKind(null);
  };
  const save = () => {
    if (!rec || !chosen) return;
    saveProject({
      ...project,
      approach: { answers: answers as number[], kind: chosen, cadence: rec.cadence.name },
      updatedAt: new Date().toISOString(),
    });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Дай відповідь на чотири питання про «{project.name}», і ми підкажемо підхід до розробки та як часто віддавати
        результат.
        {idea && !project.approach && " Для твоєї ідеї відповіді вже вибрані. Зміни їх, якщо твій проєкт інакший."}
      </p>

      <div className="mt-5 space-y-5">
        {APPROACH_QUESTIONS.map((q, qi) => (
          <div key={q.ask}>
            <p className="font-medium">{q.ask}</p>
            <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={q.ask}>
              {q.options.map((o, oi) => (
                <button
                  key={o.text}
                  type="button"
                  aria-pressed={answers[qi] === oi}
                  onClick={() => answer(qi, oi)}
                  className={chip(answers[qi] === oi)}
                >
                  {o.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {rec && (
        <div className="mt-6 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
          <p className="font-display text-lg font-semibold">Рекомендація: {rec.kind.name.toLowerCase()} підхід</p>
          <p className="mt-1">{rec.kind.why}</p>
          <p className="mt-2">
            <strong>Каденція: {rec.cadence.name.toLowerCase()}.</strong> {rec.cadence.why}
          </p>
        </div>
      )}

      {rec && (
        <div className="mt-5">
          <p className="font-medium">Який підхід береш?</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Підхід">
            {APPROACH_KINDS.map((k) => (
              <button
                key={k.name}
                type="button"
                aria-pressed={chosen === k.name}
                onClick={() => setKind(k.name)}
                className={chip(chosen === k.name)}
              >
                {k.name}
                {k.name === rec.kind.name && " (рекомендовано)"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!rec} className={primary}>
          Поставити віху
        </button>
        {!rec && <span className="text-sm text-muted">Дай відповідь на всі чотири питання.</span>}
      </div>
    </div>
  );
}

// End of the module 3 game: the second milestone of the own project.
export function ApproachBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: друга віха твого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут обирають підхід до розробки для твого власного проєкту. Але спершу його треба зібрати: це хвилина
            наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.approach ? (
        <>
          <p className="text-[13px] text-muted">Друга віха твого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Підхід до розробки</h3>
          <ApproachEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">
            {project.approach.kind} підхід, каденція {project.approach.cadence.toLowerCase()}
          </p>
          <p className="mt-2 max-w-[60ch] leading-relaxed text-muted">
            Друга віха поставлена. Наступну додаси в завданні модуля 4: чи варто вкладатися в проєкт.
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
