"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { findIdea } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

const BLOCKS = { min: 3, max: 6 };
const OUT = { min: 1, max: 3 };

const field =
  "rounded-[4px] bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

const blockWord = (n: number) => (n < 5 ? "блоки" : "блоків");

// The scope as two lists, for the bonus and the passport.
export function ScopeList({ scope }: { scope: NonNullable<MyProject["scope"]> }) {
  return (
    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
      <div>
        <dt className="text-[13px] text-muted">Блоки роботи</dt>
        <dd className="mt-0.5">
          <ul className="list-disc space-y-0.5 pl-5 leading-snug marker:text-accent">
            {scope.blocks.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </dd>
      </div>
      <div>
        <dt className="text-[13px] text-muted">Поки не робимо</dt>
        <dd className="mt-0.5">
          <ul className="list-disc space-y-0.5 pl-5 leading-snug marker:text-accent">
            {scope.out.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}

// Suggestions and own lines of one list, up to a limit.
function Picker({
  label,
  placeholder,
  hints,
  max,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  hints: string[];
  max: number;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const id = useId();
  const [extra, setExtra] = useState("");
  const full = value.length >= max;
  const own = value.filter((v) => !hints.includes(v));

  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : full ? value : [...value, v]);
  const add = () => {
    const v = extra.trim();
    if (!v || value.includes(v) || full) return;
    onChange([...value, v]);
    setExtra("");
  };

  return (
    <div>
      <p className="font-medium">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {[...hints, ...own].map((h) => (
          <button
            key={h}
            type="button"
            aria-pressed={value.includes(h)}
            onClick={() => toggle(h)}
            disabled={!value.includes(h) && full}
            className={`${chip(value.includes(h))} disabled:opacity-40`}
          >
            {h}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <label htmlFor={id} className="sr-only">
          {placeholder}
        </label>
        <input
          id={id}
          value={extra}
          maxLength={60}
          placeholder={placeholder}
          onChange={(e) => setExtra(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className={`${field} min-w-0 flex-1`}
        />
        <button type="button" onClick={add} disabled={!extra.trim() || full} className={`${chip(false)} disabled:opacity-40`}>
          Додати
        </button>
      </div>
    </div>
  );
}

// Milestone 6 of the reader's project: the blocks of work and what stays out.
export function ScopeEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const idea = findIdea(project.what, project.who)?.scope;
  const [blocks, setBlocks] = useState<string[]>(project.scope?.blocks ?? idea?.blocks.slice(0, 4) ?? []);
  const [out, setOut] = useState<string[]>(project.scope?.out ?? idea?.out.slice(0, 2) ?? []);
  const ready = blocks.length >= BLOCKS.min && out.length >= OUT.min;

  const save = () => {
    if (!ready) return;
    saveProject({ ...project, scope: { blocks, out }, updatedAt: new Date().toISOString() });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        З яких великих блоків роботи складається «{project.name}» і що ти свідомо лишаєш за межами? Обери від {BLOCKS.min}{" "}
        до {BLOCKS.max} блоків і від {OUT.min} до {OUT.max} пунктів, яких не робиш.
        {idea && !project.scope && " Для твоєї ідеї частину вже вибрано. Зміни, якщо в тебе інакше."}
      </p>

      <div className="mt-5 space-y-5">
        <Picker
          label="Блоки роботи"
          placeholder="Додати свій блок"
          hints={idea?.blocks ?? []}
          max={BLOCKS.max}
          value={blocks}
          onChange={setBlocks}
        />
        <Picker
          label="Поки не робимо"
          placeholder="Додати, чого не робиш"
          hints={idea?.out ?? []}
          max={OUT.max}
          value={out}
          onChange={setOut}
        />
      </div>

      {ready && (
        <p className="mt-6 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
          <strong>Межі проєкту.</strong> «{project.name}» — це {blocks.length} {blockWord(blocks.length)} роботи. Поки не
          робимо: {out.join(", ")}.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!ready} className={primary}>
          Поставити віху
        </button>
        {!ready && (
          <span className="text-sm text-muted">
            {blocks.length < BLOCKS.min ? `Потрібно щонайменше ${BLOCKS.min} блоки.` : "Назви хоча б один пункт, якого не робиш."}
          </span>
        )}
      </div>
    </div>
  );
}

// End of the module 7 game: the sixth milestone of the own project.
export function ScopeBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: шоста віха твого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут окреслюють межі твого власного проєкту. Але спершу його треба зібрати: це хвилина наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.scope ? (
        <>
          <p className="text-[13px] text-muted">Шоста віха твого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Блоки роботи і що не робимо</h3>
          <ScopeEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">Блоки роботи і що не робимо</p>
          <ScopeList scope={project.scope} />
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
            Шоста віха поставлена. Наступну додаси в завданні модуля 8: віхи і дата завершення.
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
