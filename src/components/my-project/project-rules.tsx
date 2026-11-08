"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { findIdea, RULE_QUESTIONS } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

const field =
  "w-full rounded-[4px] bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

// The rules as label and value pairs, for the bonus and the passport.
export function RulesList({ rules }: { rules: NonNullable<MyProject["rules"]> }) {
  return (
    <dl className="mt-3 grid gap-3 sm:grid-cols-3">
      <div>
        <dt className="text-[13px] text-muted">Спонсор</dt>
        <dd className="mt-0.5 leading-snug">{rules.sponsor}</dd>
      </div>
      {RULE_QUESTIONS.map((q, k) => (
        <div key={q.label}>
          <dt className="text-[13px] text-muted">{q.label}</dt>
          <dd className="mt-0.5 leading-snug">{q.options[rules.answers[k]]}</dd>
        </div>
      ))}
    </dl>
  );
}

// Milestone 5 of the reader's project: the sponsor, what the reader decides
// alone, the checkpoint and the report.
export function RulesEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const id = useId();
  const idea = findIdea(project.what, project.who)?.rules;
  const people = (project.people ?? []).map((p) => p.name);
  const hints = [...new Set([...(idea ? [idea.sponsor] : []), ...people])];
  const [sponsor, setSponsor] = useState(project.rules?.sponsor ?? idea?.sponsor ?? "");
  const [answers, setAnswers] = useState<(number | null)[]>(
    project.rules?.answers ?? idea?.answers ?? RULE_QUESTIONS.map(() => null),
  );
  const ready = sponsor.trim() && answers.every((a) => a !== null);

  const save = () => {
    if (!ready) return;
    saveProject({ ...project, rules: { sponsor: sponsor.trim(), answers: answers as number[] }, updatedAt: new Date().toISOString() });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Домовтеся про правила рішень для «{project.name}», поки немає суперечок: хто може сказати «стоп», що ви
        вирішуєте самі і коли все перевіряєте разом.
        {idea && !project.rules && " Для вашої ідеї відповіді вже вибрані. Змініть їх, якщо у вас інакше."}
      </p>

      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor={`${id}-sponsor`} className="font-medium">
            Спонсор: <span className="font-normal text-muted">хто дає гроші чи час і може зупинити проєкт?</span>
          </label>
          {hints.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {hints.map((h) => (
                <button key={h} type="button" aria-pressed={sponsor === h} onClick={() => setSponsor(h)} className={chip(sponsor === h)}>
                  {h}
                </button>
              ))}
            </div>
          )}
          <input
            id={`${id}-sponsor`}
            value={sponsor}
            maxLength={60}
            placeholder="Наприклад: власник барбершопу"
            onChange={(e) => setSponsor(e.target.value)}
            className={`${field} mt-2`}
          />
        </div>

        {RULE_QUESTIONS.map((q, qi) => (
          <div key={q.ask}>
            <p className="font-medium">{q.ask}</p>
            <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={q.ask}>
              {q.options.map((o, oi) => (
                <button
                  key={o}
                  type="button"
                  aria-pressed={answers[qi] === oi}
                  onClick={() => setAnswers((prev) => prev.map((v, k) => (k === qi ? oi : v)))}
                  className={chip(answers[qi] === oi)}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {ready && (
        <p className="mt-6 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
          <strong>Правила рішень.</strong> Спонсор — {sponsor.trim()}. Сам вирішую: зсув{" "}
          {RULE_QUESTIONS[0].options[answers[0]!]}, витрати — {RULE_QUESTIONS[1].options[answers[1]!]}. Більше — до
          спонсора. Контрольна точка {RULE_QUESTIONS[2].options[answers[2]!]}, звіт {RULE_QUESTIONS[3].options[answers[3]!]}.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!ready} className={primary}>
          Поставити віху
        </button>
        {!ready && <span className="text-sm text-muted">Назвіть спонсора і дайте відповідь на всі питання.</span>}
      </div>
    </div>
  );
}

// End of the module 6 game: the fifth milestone of the own project.
export function RulesBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: п&apos;ята віха вашого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут домовляються, хто у вашому власному проєкті може сказати «стоп». Але спершу його треба зібрати: це
            хвилина наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.rules ? (
        <>
          <p className="text-[13px] text-muted">П&apos;ята віха вашого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Хто може сказати «стоп»</h3>
          <RulesEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">Правила рішень</p>
          <RulesList rules={project.rules} />
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
            П&apos;ята віха поставлена. Наступну додасте в завданні модуля 7: блоки роботи і що не робимо.
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
