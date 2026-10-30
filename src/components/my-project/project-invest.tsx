"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { findIdea, INVEST_QUESTIONS, investVerdict } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

const field =
  "w-full rounded-[4px] bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

function Choice({ q, value, onPick }: { q: number; value: number | null; onPick: (a: number) => void }) {
  const { ask, options } = INVEST_QUESTIONS[q];
  return (
    <div>
      <p className="font-medium">{ask}</p>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={ask}>
        {options.map((o, k) => (
          <button key={o} type="button" aria-pressed={value === k} onClick={() => onPick(k)} className={chip(value === k)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Text({
  id,
  label,
  ask,
  hints,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  ask: string;
  hints: string[];
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label} <span className="font-normal text-muted">{ask}</span>
      </label>
      {hints.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {hints.map((h) => (
            <button key={h} type="button" aria-pressed={value === h} onClick={() => onChange(h)} className={`${chip(value === h)} text-left`}>
              {h}
            </button>
          ))}
        </div>
      )}
      <textarea
        id={id}
        rows={2}
        maxLength={200}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${field} mt-2`}
      />
    </div>
  );
}

// Milestone 3 of the reader's project: what goes in, what happens without the
// project, when the first benefit comes and whether the money lasts till then,
// and a SMART goal. Ends with a verdict.
export function InvestEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const id = useId();
  const idea = findIdea(project.what, project.who)?.invest;
  const [answers, setAnswers] = useState<(number | null)[]>(
    project.invest?.answers ?? idea?.answers ?? INVEST_QUESTIONS.map(() => null),
  );
  const [alternative, setAlternative] = useState(project.invest?.alternative ?? "");
  const [goal, setGoal] = useState(project.invest?.goal ?? "");
  const complete = answers.every((a) => a !== null);
  const verdict = complete ? investVerdict(answers as number[]) : null;
  const ready = verdict && alternative.trim() && goal.trim();

  const pick = (q: number) => (a: number) => setAnswers((prev) => prev.map((v, k) => (k === q ? a : v)));
  const save = () => {
    if (!ready) return;
    saveProject({
      ...project,
      invest: { answers: answers as number[], alternative: alternative.trim(), goal: goal.trim(), verdict: verdict.name },
      updatedAt: new Date().toISOString(),
    });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Короткий бізнес-кейс для «{project.name}»: що вкладаєш, що буде без проєкту, коли прийде вигода і чи вистачить
        до неї грошей. Наприкінці — мета, за якою потім перевіриш успіх.
        {idea && !project.invest && " Для твоєї ідеї відповіді вже вибрані. Зміни їх, якщо твій проєкт інакший."}
      </p>

      <div className="mt-5 space-y-5">
        <Choice q={0} value={answers[0]} onPick={pick(0)} />
        <Text
          id={`${id}-alternative`}
          label="Альтернатива:"
          ask="що буде, якщо нічого не робити?"
          hints={idea?.alternative ?? []}
          placeholder="Наприклад: клієнти й далі записуються дзвінками, і частину з них ми втрачаємо"
          value={alternative}
          onChange={setAlternative}
        />
        <Choice q={1} value={answers[1]} onPick={pick(1)} />
        <Choice q={2} value={answers[2]} onPick={pick(2)} />
        <Text
          id={`${id}-goal`}
          label="Мета за SMART:"
          ask="«До [коли] [що зробити] так, щоб [число]»."
          hints={idea?.goal ?? []}
          placeholder="До [коли] [що зробити] так, щоб [число]"
          value={goal}
          onChange={setGoal}
        />
      </div>

      {verdict && (
        <div className="mt-6 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
          <p className="font-display text-lg font-semibold">Вердикт: {verdict.name.toLowerCase()}</p>
          <p className="mt-1">{verdict.why}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!ready} className={primary}>
          Поставити віху
        </button>
        {!ready && <span className="text-sm text-muted">Дай відповідь на всі питання і напиши альтернативу та мету.</span>}
      </div>
    </div>
  );
}

// End of the module 4 game: the third milestone of the own project.
export function InvestBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: третя віха твого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут вирішують, чи варто вкладатися у твій власний проєкт. Але спершу його треба зібрати: це хвилина
            наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.invest ? (
        <>
          <p className="text-[13px] text-muted">Третя віха твого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Чи варто вкладатися</h3>
          <InvestEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">{project.invest.verdict}</p>
          <p className="mt-1 leading-relaxed">{project.invest.goal}</p>
          <p className="mt-2 max-w-[60ch] leading-relaxed text-muted">
            Третя віха поставлена. Наступну додаси в завданні модуля 5: люди навколо проєкту.
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
