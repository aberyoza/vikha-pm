"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { findIdea, promiseWeeks } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

const MIN = 3;
const MAX = 5;
const MAX_WEEK = 104;

type Milestone = NonNullable<MyProject["schedule"]>["milestones"][number];

const field =
  "rounded-[4px] bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

// The date is stored as YYYY-MM-DD and read as a local day, so it can't move
// across midnight with the time zone.
const dateAfter = (start: string, weeks: number) => {
  const [y, m, d] = start.split("-").map(Number);
  return new Date(y, m - 1, d + weeks * 7).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
};

// The plan as dated milestones and the promised end, for the bonus and the passport.
export function ScheduleList({ schedule }: { schedule: NonNullable<MyProject["schedule"]> }) {
  const { start, milestones, m, a, b } = schedule;
  return (
    <div className="mt-3">
      <dl className="grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-[13px] text-muted">Старт</dt>
          <dd className="mt-0.5 leading-snug">{dateAfter(start, 0)}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Найімовірніше</dt>
          <dd className="mt-0.5 leading-snug">{dateAfter(start, m)}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Обіцяю не пізніше</dt>
          <dd className="mt-0.5 font-medium leading-snug">{dateAfter(start, promiseWeeks(a, m, b))}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[13px] text-muted">Віхи</p>
      <ul className="mt-1 space-y-1">
        {[...milestones]
          .sort((x, y) => x.week - y.week)
          .map((v) => (
            <li key={v.name} className="grid gap-x-3 leading-snug sm:grid-cols-[1fr_auto]">
              <span>{v.name}</span>
              <span className="text-sm text-muted tabular-nums">{dateAfter(start, v.week)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

function WeeksInput({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label htmlFor={id} className="text-[13px] text-muted">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={1}
        max={MAX_WEEK}
        value={value || ""}
        onChange={(e) => onChange(Math.min(MAX_WEEK, Math.max(0, Math.floor(Number(e.target.value)) || 0)))}
        className={`${field} mt-1 w-full tabular-nums`}
      />
    </div>
  );
}

// Milestone 7 of the reader's project: the start, the milestones and three
// estimates of the end, which give a date that can be promised.
export function ScheduleEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const id = useId();
  const idea = findIdea(project.what, project.who)?.schedule;
  const saved = project.schedule;
  const [start, setStart] = useState(saved?.start ?? "");
  const [rows, setRows] = useState<Milestone[]>(saved?.milestones ?? idea?.milestones ?? []);
  const [extra, setExtra] = useState("");
  const [a, setA] = useState(saved?.a ?? idea?.a ?? 0);
  const [m, setM] = useState(saved?.m ?? idea?.m ?? 0);
  const [b, setB] = useState(saved?.b ?? idea?.b ?? 0);

  const hints = [...new Set([...(idea?.milestones.map((v) => v.name) ?? []), ...(project.scope?.blocks.map((v) => `Готово: ${v}`) ?? [])])];
  const names = rows.map((r) => r.name);
  const full = rows.length >= MAX;
  const orderOk = a > 0 && a <= m && m <= b;
  const weeksOk = rows.every((r) => r.week >= 1 && r.week <= b);
  const ready = !!start && rows.length >= MIN && orderOk && weeksOk;
  const problem = !start
    ? "Виберіть дату старту."
    : rows.length < MIN
      ? `Потрібно щонайменше ${MIN} віхи.`
      : !orderOk
        ? "Оцінки мають іти за зростанням: оптимістична, найімовірніша, песимістична."
        : !weeksOk
          ? "Поставте кожній віхі тиждень, не пізніше песимістичної оцінки."
          : null;

  const toggle = (name: string) =>
    setRows((r) => (r.some((v) => v.name === name) ? r.filter((v) => v.name !== name) : r.length >= MAX ? r : [...r, { name, week: 0 }]));
  const add = () => {
    const name = extra.trim();
    if (!name || names.includes(name) || full) return;
    setRows((r) => [...r, { name, week: 0 }]);
    setExtra("");
  };
  const setWeek = (k: number, week: number) => setRows((r) => r.map((v, j) => (j === k ? { ...v, week } : v)));
  const save = () => {
    if (!ready) return;
    saveProject({ ...project, schedule: { start, milestones: rows, a, m, b }, updatedAt: new Date().toISOString() });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Коли «{project.name}» буде готовий? Виберіть старт, позначте від {MIN} до {MAX} віх і чесно оцініть весь проєкт трьома
        цифрами. Дату, яку можна обіцяти, порахуємо самі.
        {idea && !saved && " Для вашої ідеї віхи й оцінки вже заповнено. Змініть їх, якщо у вас інакше."}
      </p>

      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor={`${id}-start`} className="font-medium">
            Старт
          </label>
          <input id={`${id}-start`} type="date" value={start} onChange={(e) => setStart(e.target.value)} className={`${field} mt-2 block`} />
        </div>

        <div>
          <p className="font-medium">
            Віхи: <span className="font-normal text-muted">подія без тривалості, яку видно збоку</span>
          </p>
          {hints.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Підказки для віх">
              {hints.map((h) => (
                <button
                  key={h}
                  type="button"
                  aria-pressed={names.includes(h)}
                  onClick={() => toggle(h)}
                  disabled={!names.includes(h) && full}
                  className={`${chip(names.includes(h))} disabled:opacity-40`}
                >
                  {h}
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <label htmlFor={`${id}-extra`} className="sr-only">
              Додати свою віху
            </label>
            <input
              id={`${id}-extra`}
              value={extra}
              maxLength={60}
              placeholder="Додати свою віху"
              onChange={(e) => setExtra(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              className={`${field} min-w-0 flex-1`}
            />
            <button type="button" onClick={add} disabled={!extra.trim() || full} className={`${chip(false)} disabled:opacity-40`}>
              Додати
            </button>
          </div>
          {rows.length > 0 && (
            <ul className="mt-3 space-y-2">
              {rows.map((r, k) => (
                <li key={r.name} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-[6px] bg-background p-3">
                  <span className="min-w-0 flex-1 basis-40 font-medium leading-snug">{r.name}</span>
                  <label className="flex items-center gap-2 text-sm text-muted">
                    Тиждень
                    <input
                      type="number"
                      min={1}
                      max={MAX_WEEK}
                      value={r.week || ""}
                      onChange={(e) => setWeek(k, Math.min(MAX_WEEK, Math.max(0, Math.floor(Number(e.target.value)) || 0)))}
                      className="w-16 rounded-[4px] bg-foreground/[0.07] px-2 py-1 text-base text-foreground tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-accent"
                    />
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
        </div>

        <div>
          <p className="font-medium">Скільки тижнів займе весь проєкт?</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <WeeksInput id={`${id}-a`} label="Якщо все ідеально" value={a} onChange={setA} />
            <WeeksInput id={`${id}-m`} label="Найімовірніше" value={m} onChange={setM} />
            <WeeksInput id={`${id}-b`} label="Якщо щось піде не так" value={b} onChange={setB} />
          </div>
        </div>
      </div>

      {ready && (
        <p className="mt-6 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
          <strong>Дата завершення.</strong> Найімовірніше {dateAfter(start, m)}, а обіцяйте не пізніше {dateAfter(start, promiseWeeks(a, m, b))}: так
          устигаєте приблизно у 8 випадках із 10.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!ready} className={primary}>
          Поставити віху
        </button>
        {problem && <span className="text-sm text-muted">{problem}</span>}
      </div>
    </div>
  );
}

// End of the module 8 game: the seventh milestone of the own project.
export function ScheduleBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: сьома віха вашого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут ставлять віхи і дату завершення вашого власного проєкту. Але спершу його треба зібрати: це хвилина наприкінці
            гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.schedule ? (
        <>
          <p className="text-[13px] text-muted">Сьома віха вашого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Віхи і дата завершення</h3>
          <ScheduleEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">Віхи і дата завершення</p>
          <ScheduleList schedule={project.schedule} />
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
            Сьома віха поставлена. Наступну додасте в завданні модуля 9: грубий бюджет.
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
