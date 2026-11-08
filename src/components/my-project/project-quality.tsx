"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { findIdea, type ProjectMetric } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

const COUNT = 3;

const field =
  "w-full rounded-[4px] bg-foreground/[0.07] px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

const blank = (): ProjectMetric => ({ name: "", target: "", check: "", who: "" });

// A sentence of its own would break the table and the list.
const part = (s: string) => s.trim().replace(/[.!?…]+$/, "");

// The metrics, who may stop the launch and what is left out on purpose.
export function QualityList({ project, quality }: { project: MyProject; quality: NonNullable<MyProject["quality"]> }) {
  return (
    <div className="mt-3">
      <ul className="space-y-3">
        {quality.metrics.map((m, k) => (
          <li key={k} className="leading-snug">
            <p className="font-medium">{m.name}</p>
            <p className="mt-0.5">{m.target}.</p>
            <p className="mt-0.5 text-sm text-muted">
              Як перевіряємо: {m.check}. Перевіряє: {m.who}.
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm">
        <span className="text-muted">Може зупинити запуск, якщо бачить проблему:</span> {quality.stop}.
      </p>
      {project.scope && project.scope.out.length > 0 && (
        <p className="mt-1 text-sm text-muted">Свідомо не робимо, і це питання сорту, а не якості: {project.scope.out.join(", ")}.</p>
      )}
    </div>
  );
}

function RoleChips({ label, roles, value, onPick }: { label: string; roles: string[]; value: string; onPick: (role: string) => void }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label={label}>
      {roles.map((r) => (
        <button key={r} type="button" aria-pressed={value === r} onClick={() => onPick(r)} className={chip(value === r)}>
          {r}
        </button>
      ))}
    </div>
  );
}

// Milestone 11 of the reader's project: three measurable requirements and who may stop the launch.
export function QualityEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const id = useId();
  const idea = findIdea(project.what, project.who);
  const saved = project.quality;
  const start = saved ?? idea?.quality;
  const [rows, setRows] = useState<ProjectMetric[]>(start?.metrics ?? Array.from({ length: COUNT }, blank));
  const [stop, setStop] = useState(start?.stop ?? "");
  const [extra, setExtra] = useState("");
  const [roles, setRoles] = useState<string[]>([
    ...new Set([...(project.team?.roles ?? idea?.team.roles ?? ["Я"]), ...rows.map((r) => r.who).filter(Boolean), ...(stop ? [stop] : [])]),
  ]);

  const ready = rows.every((r) => part(r.name) && part(r.target) && part(r.check) && r.who) && !!stop;
  const noNumber = rows.some((r) => part(r.target) && !/\d|жодн/i.test(r.target));

  const set = (k: number, patch: Partial<ProjectMetric>) => setRows((rs) => rs.map((r, j) => (j === k ? { ...r, ...patch } : r)));
  const add = () => {
    const name = extra.trim();
    if (!name || roles.includes(name)) return;
    setRoles((r) => [...r, name]);
    setExtra("");
  };
  const save = () => {
    if (!ready) return;
    saveProject({
      ...project,
      quality: { metrics: rows.map((r) => ({ name: part(r.name), target: part(r.target), check: part(r.check), who: r.who })), stop },
      updatedAt: new Date().toISOString(),
    });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Як зрозуміти, що «{project.name}» готовий? Запишіть три вимоги до якості: що міряєте, який результат вважаєте прийнятним і як це
        перевіряєте. Потім позначте людину, яка може зупинити запуск, якщо побачить проблему.
        {idea && !saved && " Для вашої ідеї все вже заповнено. Змініть, якщо у вас інакше."}
      </p>

      {project.scope && project.scope.out.length > 0 && (
        <p className="mt-3 rounded-[4px] bg-background p-3 text-sm leading-relaxed">
          У віхі про блоки роботи записано, що в цьому проєкті ви свідомо не робите таке: {project.scope.out.join(", ")}. Це питання сорту, тому його не треба записувати сюди як вимогу до якості.
        </p>
      )}

      <ol className="mt-5 space-y-4">
        {rows.map((r, k) => (
          <li key={k} className="rounded-[6px] bg-background p-3 sm:p-4">
            <p className="font-display text-lg font-semibold">Вимога {k + 1}</p>
            <div className="mt-2 space-y-2">
              <label className="block text-sm">
                <span className="text-muted">Що міряємо?</span>
                <input value={r.name} maxLength={60} placeholder="Швидкість запису" onChange={(e) => set(k, { name: e.target.value })} className={`${field} mt-1`} />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Який результат вважаємо прийнятним?</span>
                <input value={r.target} maxLength={140} placeholder="Клієнт записується за 1 хвилину або швидше" onChange={(e) => set(k, { target: e.target.value })} className={`${field} mt-1`} />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Як це перевіряємо?</span>
                <input value={r.check} maxLength={140} placeholder="П'ять знайомих записуються під секундомір" onChange={(e) => set(k, { check: e.target.value })} className={`${field} mt-1`} />
              </label>
            </div>
            <p className="mt-3 text-[13px] text-muted">Хто перевіряє?</p>
            <RoleChips label={`Хто перевіряє вимогу ${k + 1}`} roles={roles} value={r.who} onPick={(who) => set(k, { who })} />
          </li>
        ))}
      </ol>

      <div className="mt-4">
        <p className="font-medium">Хто може зупинити запуск, якщо бачить проблему?</p>
        <RoleChips label="Хто може зупинити запуск" roles={roles} value={stop} onPick={setStop} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <label htmlFor={`${id}-role`} className="sr-only">
          Додати людину
        </label>
        <input
          id={`${id}-role`}
          value={extra}
          maxLength={40}
          placeholder="Додати людину"
          onChange={(e) => setExtra(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="min-w-0 flex-1 rounded-[4px] bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent"
        />
        <button type="button" onClick={add} disabled={!extra.trim()} className={`${chip(false)} disabled:opacity-40`}>
          Додати
        </button>
      </div>

      {noNumber && (
        <p className="mt-3 rounded-[4px] bg-accent-soft p-3 text-sm leading-relaxed" aria-live="polite">
          В одній із вимог немає числа. Додайте його, щоб результат можна було перевірити однозначно.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!ready} className={primary}>
          Поставити віху
        </button>
        {!ready && <span className="text-sm text-muted">Заповніть всі поля трьох вимог і виберіть, хто може зупинити запуск.</span>}
      </div>
    </div>
  );
}

// End of the module 12 game: the eleventh milestone of the own project.
export function QualityBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: одинадцята віха вашого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут вирішують, коли результат вашого власного проєкту готовий. Але спершу його треба зібрати: це хвилина наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.quality ? (
        <>
          <p className="text-[13px] text-muted">Одинадцята віха вашого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Коли результат готовий</h3>
          <QualityEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">Коли результат готовий</p>
          <QualityList project={project} quality={project.quality} />
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
            Одинадцята віха поставлена. Наступну додасте в завданні модуля 13: перші задачі на дошці.
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
