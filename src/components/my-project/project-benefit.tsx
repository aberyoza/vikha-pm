"use client";

import Link from "next/link";
import { useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { BENEFIT_CHECKS, findIdea } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

const field =
  "w-full rounded-[4px] bg-foreground/[0.07] px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

const MIN_CHECKS = 2;

const checksText = (checks: number[]) =>
  `${[...checks].sort((a, b) => a - b).map((m) => BENEFIT_CHECKS.find((c) => c.months === m)?.name ?? `${m} міс.`).join(", ")} після запуску`;

// The benefit, how it is measured and who checks it, for the bonus and the passport.
export function BenefitList({ benefit }: { benefit: NonNullable<MyProject["benefit"]> }) {
  const rows = [
    { name: "Вигода", value: benefit.value },
    { name: "Показник і ціль", value: benefit.metric },
    { name: "Рання ознака", value: benefit.early },
    { name: "Перевірки", value: checksText(benefit.checks) },
    { name: "Власник вигоди", value: benefit.owner },
    { name: "Якщо відстаємо", value: benefit.behind },
  ];
  return (
    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.name}>
          <dt className="text-[13px] text-muted">{r.name}</dt>
          <dd className="mt-0.5 leading-snug">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Milestone 13 of the reader's project: how to tell that the benefit has arrived.
export function BenefitEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const idea = findIdea(project.what, project.who);
  const saved = project.benefit;
  const [value, setValue] = useState(saved?.value ?? project.value.benefit);
  const [metric, setMetric] = useState(saved?.metric ?? idea?.benefit.metric ?? "");
  const [early, setEarly] = useState(saved?.early ?? idea?.benefit.early ?? "");
  const [checks, setChecks] = useState<number[]>(saved?.checks ?? idea?.benefit.checks ?? []);
  const [owner, setOwner] = useState(saved?.owner ?? project.rules?.sponsor ?? idea?.rules.sponsor ?? "");
  const [behind, setBehind] = useState(saved?.behind ?? idea?.benefit.behind ?? "");

  const texts = { value: value.trim(), metric: metric.trim(), early: early.trim(), owner: owner.trim(), behind: behind.trim() };
  const ready = Object.values(texts).every(Boolean) && checks.length >= MIN_CHECKS;

  const toggle = (m: number) => setChecks((v) => (v.includes(m) ? v.filter((x) => x !== m) : [...v, m]));
  const save = () => {
    if (!ready) return;
    saveProject({ ...project, benefit: { ...texts, checks: [...checks].sort((a, b) => a - b) }, updatedAt: new Date().toISOString() });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Проєкт «{project.name}» закінчиться, а вигода з&apos;явиться пізніше. Запишіть, як ви зрозумієте, що вона настала.
        {idea && !saved && " Для вашої ідеї все вже заповнено. Змініть, якщо у вас інакше."}
      </p>

      <div className="mt-5 space-y-4">
        <label className="block text-sm">
          <span className="font-medium">Яку вигоду ви чекаєте?</span>
          <input value={value} maxLength={140} onChange={(e) => setValue(e.target.value)} className={`${field} mt-1`} />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Яким числом ви її виміряєте і яка ціль?</span>
          <input value={metric} maxLength={140} placeholder="85% віконець заповнено через три місяці" onChange={(e) => setMetric(e.target.value)} className={`${field} mt-1`} />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Що заздалегідь підкаже, чи ви рухаєтеся до цілі?</span>
          <input value={early} maxLength={140} placeholder="Скільки клієнтів записалися через бота за перший місяць" onChange={(e) => setEarly(e.target.value)} className={`${field} mt-1`} />
        </label>
        <div>
          <p className="text-sm font-medium">Коли ви перевіряєте вигоду? Виберіть хоча б дві дати.</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Коли перевіряємо вигоду">
            {BENEFIT_CHECKS.map((c) => (
              <button key={c.months} type="button" aria-pressed={checks.includes(c.months)} onClick={() => toggle(c.months)} className={chip(checks.includes(c.months))}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <label className="block text-sm">
          <span className="font-medium">Хто відповідає за вигоду після закриття проєкту?</span>
          <input value={owner} maxLength={60} placeholder="Власник барбершопу" onChange={(e) => setOwner(e.target.value)} className={`${field} mt-1`} />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Що ви зробите, якщо вигода відстає від плану?</span>
          <input value={behind} maxLength={160} placeholder="Попросити майстрів давати посилання на бота кожному клієнту" onChange={(e) => setBehind(e.target.value)} className={`${field} mt-1`} />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!ready} className={primary}>
          Поставити віху
        </button>
        {!ready && <span className="text-sm text-muted">Заповніть всі поля і виберіть хоча б дві дати перевірки.</span>}
      </div>
    </div>
  );
}

// End of the module 14 game: the last milestone of the own project.
export function BenefitBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-6 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: остання віха вашого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут записують, як зрозуміти, що вигода настала. Але спершу проєкт треба зібрати: це хвилина наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.benefit ? (
        <>
          <p className="text-[13px] text-muted">Тринадцята, остання віха вашого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Як зрозуміти, що вигода настала</h3>
          <BenefitEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">Як зрозуміти, що вигода настала</p>
          <BenefitList benefit={project.benefit} />
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
            Тринадцята, остання віха поставлена. У паспорті тепер видно весь проєкт: від ідеї до перевірки вигод.
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
