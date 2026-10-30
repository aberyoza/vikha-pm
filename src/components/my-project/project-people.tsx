"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { ENGAGEMENT, findIdea, nextAction, stakeholderGroup, type Person } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

const MIN = 3;
const MAX = 5;

const field =
  "rounded-[4px] bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

// A row while it is being filled: a person added by hand starts blank.
type Draft = { name: string; power: boolean | null; interest: boolean | null; now: number | null; want: number | null };

const complete = (d: Draft): d is Person =>
  d.power !== null && d.interest !== null && d.now !== null && d.want !== null;

function nextStepText(now: number, want: number) {
  const a = nextAction(now, want);
  return a ? `${a.name}. ${a.note}` : "Уже там, де потрібно. Підтримуй як є.";
}

function Pair({
  label,
  value,
  yes,
  no,
  onPick,
}: {
  label: string;
  value: boolean | null;
  yes: string;
  no: string;
  onPick: (v: boolean) => void;
}) {
  return (
    <div>
      <p className="text-[13px] text-muted">{label}</p>
      <div className="mt-1 flex gap-1.5" role="group" aria-label={label}>
        <button type="button" aria-pressed={value === true} onClick={() => onPick(true)} className={chip(value === true)}>
          {yes}
        </button>
        <button type="button" aria-pressed={value === false} onClick={() => onPick(false)} className={chip(value === false)}>
          {no}
        </button>
      </div>
    </div>
  );
}

function Level({ id, label, value, onPick }: { id: string; label: string; value: number | null; onPick: (v: number) => void }) {
  return (
    <div>
      <label htmlFor={id} className="text-[13px] text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onPick(Number(e.target.value))}
        className={`${field} mt-1 block w-full py-1.5 text-sm`}
      >
        <option value="" disabled>
          Обери рівень
        </option>
        {ENGAGEMENT.map((e, k) => (
          <option key={e} value={k}>
            {e}
          </option>
        ))}
      </select>
    </div>
  );
}

// Milestone 4 of the reader's project: a small stakeholder register with power,
// interest and engagement now and wanted.
export function PeopleEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const id = useId();
  const suggestions = findIdea(project.what, project.who)?.people ?? [];
  const [rows, setRows] = useState<Draft[]>(project.people ?? suggestions.slice(0, 4));
  const [extra, setExtra] = useState("");
  const names = rows.map((r) => r.name);
  const ready = rows.length >= MIN && rows.every(complete);

  const update = (k: number, patch: Partial<Draft>) => setRows((r) => r.map((v, j) => (j === k ? { ...v, ...patch } : v)));
  const toggle = (p: Person) =>
    setRows((r) => (r.some((v) => v.name === p.name) ? r.filter((v) => v.name !== p.name) : r.length >= MAX ? r : [...r, p]));
  const add = () => {
    const name = extra.trim();
    if (!name || names.includes(name) || rows.length >= MAX) return;
    setRows((r) => [...r, { name, power: null, interest: null, now: null, want: null }]);
    setExtra("");
  };
  const save = () => {
    if (!ready) return;
    saveProject({ ...project, people: rows.filter(complete), updatedAt: new Date().toISOString() });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Хто впливає на «{project.name}» і на кого впливає він? Обери від {MIN} до {MAX} людей, познач для кожного владу,
        інтерес і рівень залучення. Наступний крок підкажемо самі.
        {suggestions.length > 0 && !project.people && " Для твоєї ідеї вже вибрано чотирьох. Зміни, якщо в тебе інакше."}
      </p>

      {suggestions.length > 0 && (
        <div className="mt-5">
          <p className="font-medium">Підказки</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestions.map((p) => (
              <button
                key={p.name}
                type="button"
                aria-pressed={names.includes(p.name)}
                onClick={() => toggle(p)}
                disabled={!names.includes(p.name) && rows.length >= MAX}
                className={`${chip(names.includes(p.name))} disabled:opacity-40`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <label htmlFor={`${id}-extra`} className="sr-only">
          Додати свою людину
        </label>
        <input
          id={`${id}-extra`}
          value={extra}
          maxLength={60}
          placeholder="Додати свою людину чи організацію"
          onChange={(e) => setExtra(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className={`${field} min-w-0 flex-1`}
        />
        <button type="button" onClick={add} disabled={!extra.trim() || rows.length >= MAX} className={`${chip(false)} disabled:opacity-40`}>
          Додати
        </button>
      </div>

      <ul className="mt-5 space-y-2">
        {rows.map((r, k) => (
          <li key={r.name} className="rounded-[6px] bg-background p-3 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-lg font-semibold leading-snug">{r.name}</p>
              <button
                type="button"
                onClick={() => setRows((rs) => rs.filter((_, j) => j !== k))}
                aria-label={`Прибрати: ${r.name}`}
                className="text-sm text-muted hover:text-foreground"
              >
                Прибрати
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Pair label="Влада" value={r.power} yes="Висока" no="Низька" onPick={(v) => update(k, { power: v })} />
              <Pair label="Інтерес" value={r.interest} yes="Високий" no="Низький" onPick={(v) => update(k, { interest: v })} />
              <Level id={`${id}-${k}-now`} label="Зараз" value={r.now} onPick={(v) => update(k, { now: v })} />
              <Level id={`${id}-${k}-want`} label="Бажано" value={r.want} onPick={(v) => update(k, { want: v })} />
            </div>
            {complete(r) && (
              <p className="mt-3 rounded-[4px] bg-accent-soft p-3 text-sm leading-relaxed">
                <strong>{stakeholderGroup(r.power, r.interest).name}.</strong> {stakeholderGroup(r.power, r.interest).note}{" "}
                <strong>Наступний крок:</strong> {nextStepText(r.now, r.want)}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!ready} className={primary}>
          Поставити віху
        </button>
        {!ready && (
          <span className="text-sm text-muted">
            {rows.length < MIN ? `Потрібно щонайменше ${MIN} людей.` : "Заповни владу, інтерес і рівні для кожного."}
          </span>
        )}
      </div>
    </div>
  );
}

// The register as a read-only list, for the bonus and the passport.
export function PeopleList({ people }: { people: Person[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {people.map((p) => (
        <li key={p.name} className="grid gap-1 rounded-[4px] bg-foreground/[0.04] p-3 sm:grid-cols-[1fr_1fr_1.4fr] sm:gap-3">
          <span className="font-medium">{p.name}</span>
          <span className="text-sm">
            {stakeholderGroup(p.power, p.interest).name}
            <span className="block text-muted">
              {ENGAGEMENT[p.now]} → {ENGAGEMENT[p.want].toLowerCase()}
            </span>
          </span>
          <span className="text-sm text-muted">Наступний крок: {nextAction(p.now, p.want)?.name.toLowerCase() ?? "підтримувати як є"}</span>
        </li>
      ))}
    </ul>
  );
}

// End of the module 5 game: the fourth milestone of the own project.
export function PeopleBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: четверта віха твого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут складають реєстр людей навколо твого власного проєкту. Але спершу його треба зібрати: це хвилина
            наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.people ? (
        <>
          <p className="text-[13px] text-muted">Четверта віха твого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Люди навколо проєкту</h3>
          <PeopleEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">Люди навколо проєкту</p>
          <PeopleList people={project.people} />
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
            Четверта віха поставлена. Наступну додаси в завданні модуля 6: хто може сказати «стоп».
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
