"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { budgetTotal, findIdea, OPPORTUNITY_RESPONSES, riskLevel, THREAT_RESPONSES, type ProjectRisk } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

const MAX_COST = 100_000_000;
const COUNT = 3;
const SCALE = [1, 2, 3, 4, 5];

const field =
  "w-full rounded-[4px] bg-foreground/[0.07] px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

const uah = (v: number) => `${v.toLocaleString("uk-UA")} грн`;

// The parts go into one sentence, so a full stop of their own would break it.
const part = (s: string) => s.trim().replace(/[.!?…]+$/, "");

const blank = (): ProjectRisk => ({ kind: "threat", cause: "", event: "", effect: "", p: 0, i: 0, response: "", cost: 0, owner: "", trigger: "" });

const responsesOf = (kind: ProjectRisk["kind"]) => (kind === "threat" ? THREAT_RESPONSES : OPPORTUNITY_RESPONSES);

const priorityOf = (r: ProjectRisk) => r.p * r.i;

// What the budget milestone keeps for known risks.
const reserveOf = (project: MyProject) =>
  project.budget ? budgetTotal(project.budget) - project.budget.items.reduce((s, i) => s + i.cost, 0) : null;

function ReserveNote({ project, risks }: { project: MyProject; risks: ProjectRisk[] }) {
  const reserve = reserveOf(project);
  const total = risks.reduce((s, r) => s + r.cost, 0);
  if (reserve === null) return <p className="mt-3 text-sm text-muted">Захист коштує {uah(total)}.</p>;
  return (
    <p className="mt-3 text-sm text-muted" aria-live="polite">
      Захист коштує {uah(total)}, а резерв у бюджеті {uah(reserve)}.
      {total > reserve ? " Не вміщається: збільш резерв, знайди дешевшу реакцію або свідомо прийми частину ризиків." : " Вміщається."}
    </p>
  );
}

// The risks by priority, for the bonus and the passport.
export function RisksList({ project, risks }: { project: MyProject; risks: ProjectRisk[] }) {
  const sorted = [...risks].sort((a, b) => priorityOf(b) - priorityOf(a));
  return (
    <div className="mt-3">
      <ol className="space-y-3">
        {sorted.map((r, k) => (
          <li key={k} className="leading-snug">
            <p className="text-[13px] text-muted tabular-nums">
              {r.kind === "threat" ? "Загроза" : "Нагода"} · пріоритет {priorityOf(r)}, {riskLevel(priorityOf(r))}
            </p>
            <p className="mt-0.5">
              Через те що {r.cause}, може статися таке: <strong className="font-medium">{r.event}</strong>, і тоді {r.effect}.
            </p>
            <p className="mt-1 text-sm text-muted">
              {r.response}, {uah(r.cost)}. Власник: {r.owner}. Тригер: {r.trigger}.
            </p>
          </li>
        ))}
      </ol>
      <ReserveNote project={project} risks={risks} />
    </div>
  );
}

function ScaleChips({ label, value, onPick }: { label: string; value: number; onPick: (v: number) => void }) {
  return (
    <div>
      <p className="text-[13px] text-muted">{label}</p>
      <div className="mt-1 flex gap-1" role="group" aria-label={label}>
        {SCALE.map((v) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onPick(v)} className={`${chip(value === v)} tabular-nums`}>
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

// Milestone 10 of the reader's project: three risks with a response, an owner and a trigger.
export function RisksEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const id = useId();
  const idea = findIdea(project.what, project.who);
  const saved = project.risks;
  const [rows, setRows] = useState<ProjectRisk[]>(saved ?? idea?.risks ?? Array.from({ length: COUNT }, blank));
  const roles = project.team?.roles ?? idea?.team.roles ?? [];
  const [extra, setExtra] = useState("");
  const [owners, setOwners] = useState<string[]>([...new Set([...roles, ...rows.map((r) => r.owner).filter(Boolean)])]);

  const ready = rows.every((r) => part(r.cause) && part(r.event) && part(r.effect) && r.p && r.i && r.response && r.owner && part(r.trigger));

  const set = (k: number, patch: Partial<ProjectRisk>) => setRows((rs) => rs.map((r, j) => (j === k ? { ...r, ...patch } : r)));
  const setKind = (k: number, kind: ProjectRisk["kind"]) =>
    set(k, { kind, response: responsesOf(kind).some((o) => o.name === rows[k].response) ? rows[k].response : "" });
  const add = () => {
    const name = extra.trim();
    if (!name || owners.includes(name)) return;
    setOwners((o) => [...o, name]);
    setExtra("");
  };
  const save = () => {
    if (!ready) return;
    saveProject({
      ...project,
      risks: rows.map((r) => ({ ...r, cause: part(r.cause), event: part(r.event), effect: part(r.effect), trigger: part(r.trigger), owner: r.owner.trim() })),
      updatedAt: new Date().toISOString(),
    });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Що може піти не так у проєкті «{project.name}»? Опиши три головні ризики: причину, подію і наслідок. Оціни їх, вибери реакцію і
        людину, яка стежитиме за ознаками. Замість загрози можна записати нагоду, тобто подію, яка допоможе проєкту.
        {idea && !saved && " Для твоєї ідеї все вже заповнено. Зміни, якщо в тебе інакше."}
      </p>

      <ol className="mt-5 space-y-4">
        {rows.map((r, k) => {
          const response = responsesOf(r.kind).find((o) => o.name === r.response);
          return (
            <li key={k} className="rounded-[6px] bg-background p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-lg font-semibold">Ризик {k + 1}</p>
                <div className="flex gap-1.5" role="group" aria-label={`Вид ризику ${k + 1}`}>
                  <button type="button" aria-pressed={r.kind === "threat"} onClick={() => setKind(k, "threat")} className={chip(r.kind === "threat")}>
                    Загроза
                  </button>
                  <button type="button" aria-pressed={r.kind === "opportunity"} onClick={() => setKind(k, "opportunity")} className={chip(r.kind === "opportunity")}>
                    Нагода
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <label className="block text-sm">
                  <span className="text-muted">Через те що…</span>
                  <input value={r.cause} maxLength={140} placeholder="лише одна людина знає, як усе працює" onChange={(e) => set(k, { cause: e.target.value })} className={`${field} mt-1`} />
                </label>
                <label className="block text-sm">
                  <span className="text-muted">…може статися таке:</span>
                  <input value={r.event} maxLength={140} placeholder="ця людина піде з проєкту" onChange={(e) => set(k, { event: e.target.value })} className={`${field} mt-1`} />
                </label>
                <label className="block text-sm">
                  <span className="text-muted">…і тоді:</span>
                  <input value={r.effect} maxLength={140} placeholder="два тижні на заміну, і запуск зсунеться" onChange={(e) => set(k, { effect: e.target.value })} className={`${field} mt-1`} />
                </label>
              </div>

              <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-2">
                <ScaleChips label="Імовірність" value={r.p} onPick={(p) => set(k, { p })} />
                <ScaleChips label="Вплив" value={r.i} onPick={(i) => set(k, { i })} />
                {r.p > 0 && r.i > 0 && (
                  <p className="pb-2 text-sm tabular-nums">
                    Пріоритет <strong className="font-semibold">{priorityOf(r)}</strong>, {riskLevel(priorityOf(r))}
                  </p>
                )}
              </div>

              <p className="mt-3 text-[13px] text-muted">Реакція</p>
              <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label={`Реакція на ризик ${k + 1}`}>
                {responsesOf(r.kind).map((o) => (
                  <button key={o.name} type="button" aria-pressed={r.response === o.name} onClick={() => set(k, { response: o.name })} className={chip(r.response === o.name)}>
                    {o.name}
                  </button>
                ))}
              </div>
              {response && <p className="mt-1 text-[13px] text-muted">{response.note}</p>}

              <label className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
                Скільки коштує реакція
                <input
                  type="number"
                  min={0}
                  max={MAX_COST}
                  step={100}
                  value={r.cost || ""}
                  onChange={(e) => set(k, { cost: Math.min(MAX_COST, Math.max(0, Math.floor(Number(e.target.value)) || 0)) })}
                  className="w-28 rounded-[4px] bg-foreground/[0.07] px-2 py-1 text-base text-foreground tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-accent"
                />
                грн
              </label>

              <p className="mt-3 text-[13px] text-muted">Власник — це одна конкретна людина, яка стежить за ризиком.</p>
              <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label={`Власник ризику ${k + 1}`}>
                {owners.map((o) => (
                  <button key={o} type="button" aria-pressed={r.owner === o} onClick={() => set(k, { owner: o })} className={chip(r.owner === o)}>
                    {o}
                  </button>
                ))}
              </div>

              <label className="mt-3 block text-sm">
                <span className="text-muted">Тригер — це ознака, яку можна помітити заздалегідь.</span>
                <input value={r.trigger} maxLength={140} placeholder="за тиждень до запуску немає половини матеріалів" onChange={(e) => set(k, { trigger: e.target.value })} className={`${field} mt-1`} />
              </label>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex flex-wrap gap-2">
        <label htmlFor={`${id}-owner`} className="sr-only">
          Додати власника
        </label>
        <input
          id={`${id}-owner`}
          value={extra}
          maxLength={40}
          placeholder="Додати власника"
          onChange={(e) => setExtra(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="min-w-0 flex-1 rounded-[4px] bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent"
        />
        <button type="button" onClick={add} disabled={!extra.trim()} className={`${chip(false)} disabled:opacity-40`}>
          Додати
        </button>
      </div>

      <ReserveNote project={project} risks={rows} />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!ready} className={primary}>
          Поставити віху
        </button>
        {!ready && <span className="text-sm text-muted">Заповни всі поля для кожного з трьох ризиків. Ціна реакції може бути нульовою.</span>}
      </div>
    </div>
  );
}

// End of the module 11 game: the tenth milestone of the own project.
export function RisksBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: десята віха твого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут описують три головні ризики твого власного проєкту. Але спершу його треба зібрати: це хвилина наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.risks ? (
        <>
          <p className="text-[13px] text-muted">Десята віха твого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Три головні ризики</h3>
          <RisksEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">Три головні ризики</p>
          <RisksList project={project} risks={project.risks} />
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
            Десята віха поставлена. Наступну додаси в завданні модуля 12: коли результат готовий.
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
