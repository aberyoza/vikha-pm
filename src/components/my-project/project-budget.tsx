"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { budgetRange, budgetTotal, findIdea, RESERVES } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

type Item = NonNullable<MyProject["budget"]>["items"][number];

const MAX_ITEMS = 8;
const MAX_COST = 100_000_000;

const field =
  "rounded-[4px] bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

const uah = (v: number) => `${v.toLocaleString("uk-UA")} грн`;

// The budget with its reserve and range, for the bonus and the passport.
export function BudgetList({ budget }: { budget: NonNullable<MyProject["budget"]> }) {
  const works = budget.items.reduce((s, i) => s + i.cost, 0);
  const total = budgetTotal(budget);
  const [low, high] = budgetRange(budget);
  return (
    <div className="mt-3">
      <dl className="grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-[13px] text-muted">Бюджет</dt>
          <dd className="mt-0.5 font-medium leading-snug">{uah(total)}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Із них резерв</dt>
          <dd className="mt-0.5 leading-snug">
            {uah(total - works)} ({budget.reserve}%)
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Вилка для спонсора</dt>
          <dd className="mt-0.5 leading-snug">
            {low.toLocaleString("uk-UA")}–{uah(high)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[13px] text-muted">Кошториси</p>
      <ul className="mt-1 space-y-1">
        {budget.items.map((i) => (
          <li key={i.name} className="grid gap-x-3 leading-snug sm:grid-cols-[1fr_auto]">
            <span>{i.name}</span>
            <span className="text-sm text-muted tabular-nums">{uah(i.cost)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Milestone 8 of the reader's project: a cost for each block of work, a reserve
// and a range to name to the sponsor.
export function BudgetEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const id = useId();
  const idea = findIdea(project.what, project.who);
  const saved = project.budget;
  const costOf = (name: string) => {
    const k = idea?.scope.blocks.indexOf(name) ?? -1;
    return k >= 0 ? idea!.budget.costs[k] : 0;
  };
  const [rows, setRows] = useState<Item[]>(
    saved?.items ?? (project.scope?.blocks ?? idea?.scope.blocks ?? []).map((name) => ({ name, cost: costOf(name) })),
  );
  const [extra, setExtra] = useState("");
  const [reserve, setReserve] = useState(saved?.reserve ?? idea?.budget.reserve ?? RESERVES[1]);
  const [rough, setRough] = useState(saved?.rough ?? true);

  const draft = { items: rows, reserve, rough };
  const total = budgetTotal(draft);
  const [low, high] = budgetRange(draft);
  const ready = total > 0;
  const sponsor = project.rules?.sponsor;

  const setCost = (k: number, cost: number) => setRows((r) => r.map((v, j) => (j === k ? { ...v, cost } : v)));
  const add = () => {
    const name = extra.trim();
    if (!name || rows.some((r) => r.name === name) || rows.length >= MAX_ITEMS) return;
    setRows((r) => [...r, { name, cost: 0 }]);
    setExtra("");
  };
  const save = () => {
    if (!ready) return;
    saveProject({ ...project, budget: draft, updatedAt: new Date().toISOString() });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Скільки коштуватиме «{project.name}»? Дайте кошторис кожному блоку роботи, додайте резерв і подивіться, яку вилку чесно назвати
        спонсору. Якщо робите усе власноруч, порахуйте свій час: години помножте на те, скільки година вам варта.
        {idea && !saved && " Для вашої ідеї суми вже підказані. Змініть їх, якщо у вас інакше."}
      </p>

      <div className="mt-5 space-y-5">
        <div>
          <p className="font-medium">Кошторис: скільки коштує кожен блок?</p>
          {rows.length > 0 && (
            <ul className="mt-2 space-y-2">
              {rows.map((r, k) => (
                <li key={r.name} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-[6px] bg-background p-3">
                  <span className="min-w-0 flex-1 basis-40 font-medium leading-snug">{r.name}</span>
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <span className="sr-only">Кошторис: {r.name}</span>
                    <input
                      type="number"
                      min={0}
                      max={MAX_COST}
                      step={100}
                      value={r.cost || ""}
                      onChange={(e) => setCost(k, Math.min(MAX_COST, Math.max(0, Math.floor(Number(e.target.value)) || 0)))}
                      className="w-28 rounded-[4px] bg-foreground/[0.07] px-2 py-1 text-base text-foreground tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-accent"
                    />
                    грн
                  </label>
                  <button
                    type="button"
                    onClick={() => setRows((rs) => rs.filter((_, j) => j !== k))}
                    aria-label={`Прибрати: ${r.name}`}
                    className="text-sm text-muted hover:text-foreground"
                  >
                    Прибрати
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <label htmlFor={`${id}-extra`} className="sr-only">
              Додати свою статтю витрат
            </label>
            <input
              id={`${id}-extra`}
              value={extra}
              maxLength={60}
              placeholder="Додати свою статтю витрат"
              onChange={(e) => setExtra(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              className={`${field} min-w-0 flex-1`}
            />
            <button type="button" onClick={add} disabled={!extra.trim() || rows.length >= MAX_ITEMS} className={`${chip(false)} disabled:opacity-40`}>
              Додати
            </button>
          </div>
        </div>

        <div>
          <p className="font-medium">
            Резерв: <span className="font-normal text-muted">гроші на ризики, про які вже знаєте</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Резерв">
            {RESERVES.map((v) => (
              <button key={v} type="button" aria-pressed={reserve === v} onClick={() => setReserve(v)} className={chip(reserve === v)}>
                {v}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium">Наскільки точна оцінка?</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Точність оцінки">
            <button type="button" aria-pressed={rough} onClick={() => setRough(true)} className={chip(rough)}>
              Груба: блоки ще не розписані
            </button>
            <button type="button" aria-pressed={!rough} onClick={() => setRough(false)} className={chip(!rough)}>
              Точна: кожен блок оцінено окремо
            </button>
          </div>
        </div>
      </div>

      {ready && (
        <p className="mt-6 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
          <strong>Бюджет {uah(total)}.</strong> Скажіть {sponsor ? `спонсору (${sponsor})` : "спонсору"}: від {low.toLocaleString("uk-UA")} до {uah(high)}.
          {rough ? " Вилка звузиться, коли розпишете блоки." : " Це вже точна оцінка, тож вилка вузька."}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!ready} className={primary}>
          Поставити віху
        </button>
        {!ready && <span className="text-sm text-muted">Поставте суму хоча б одному блоку.</span>}
      </div>
    </div>
  );
}

// End of the module 9 game: the eighth milestone of the own project.
export function BudgetBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: восьма віха вашого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут рахують бюджет вашого власного проєкту. Але спершу його треба зібрати: це хвилина наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.budget ? (
        <>
          <p className="text-[13px] text-muted">Восьма віха вашого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Грубий бюджет</h3>
          <BudgetEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">Грубий бюджет</p>
          <BudgetList budget={project.budget} />
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
            Восьма віха поставлена. Наступну додасте в завданні модуля 10: хто потрібен у команді.
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
