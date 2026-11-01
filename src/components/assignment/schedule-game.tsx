"use client";

import { useState } from "react";
import { edgeKey, NetworkDiagram } from "@/components/lesson/network-diagram";
import { ScheduleBonus } from "@/components/my-project/project-schedule";
import * as G from "@/content/assignments/module-08";
import { PLAN, type Scheduled } from "@/content/examples/game-plan";
import { AssignmentGame, chip, Feedback, HowTo, primary, shuffled } from "./game-kit";

type Orders = {
  paths: number[];
  events: number[];
  donors: number[];
  notes: number[];
  questions: number[][];
  charts: number[];
};

const optionClass = (on: boolean, off: boolean) =>
  `rounded-md px-3 py-2 text-left text-sm font-medium leading-snug press ${
    on ? "bg-accent text-accent-foreground" : `bg-foreground/[0.07] enabled:hover:bg-foreground/[0.12] ${off ? "opacity-60" : ""}`
  }`;

const pathText = (ids: number[]) => ids.map(G.taskName).join(" → ");

// Level 1: draw the arrows from the clues, then find the longest path.
function ArrowsLevel({ paths, onDone }: { paths: number[]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [path, setPath] = useState<number | null>(null);
  const link = G.LINKS[i];
  const drawing = i < G.LINKS.length;
  const right = drawing ? G.after(link.id) : [];
  const ok = sel.length === right.length && right.every((id) => sel.includes(id));

  const drawn = G.LINKS.slice(0, checked ? i + 1 : i).flatMap((l) => G.after(l.id).map((from) => edgeKey(from, l.id)));
  const visible = new Set([...G.GIVEN_EDGES.map(([a, b]) => edgeKey(a, b)), ...drawn]);
  const fresh = checked && drawing ? new Set(right.map((from) => edgeKey(from, link.id))) : new Set<string>();

  const longest = G.PATHS.find((p) => p.weeks === G.LONGEST)!;
  const pickedPath = path === null ? null : G.PATHS[path];
  const onPath = new Set(longest.ids.slice(1).map((id, k) => edgeKey(longest.ids[k], id)));

  const check = () => {
    setChecked(true);
    if (ok) setScore((v) => v + 1);
  };
  const next = () => {
    setI(i + 1);
    setSel([]);
    setChecked(false);
  };

  return (
    <div>
      <HowTo
        goal="домалювати стрілки мережевого графіка і знайти шлях, який визначає дату релізу."
        steps={[
          "Унизу мережевий графік гри. Кожен блок — робота, стрілка показує, яка робота після якої. Частина стрілок уже є.",
          "Прочитай підказку і натисни на роботи, які мають завершитися перед цією. Їх може бути кілька.",
          "Натисни «Поставити стрілки»: вони з'являться на графіку. На телефоні графік можна гортати вбік.",
          "Коли всі стрілки на місці, порахуй тижні на кожному шляху і вибери найдовший.",
        ]}
        tip="Підказка: вибирай лише те, від чого робота залежить напряму, а не все, що було раніше."
      />

      <div className="mt-5 rounded-[6px] bg-background p-3">
        <NetworkDiagram
          label="Мережевий графік гри: вісім робіт і стрілки між ними"
          visibleEdges={visible}
          highlightEdges={pickedPath ? onPath : fresh}
          highlightNodes={pickedPath ? new Set(longest.ids) : undefined}
        />
      </div>

      {drawing ? (
        <div className="mt-4">
          <p className="text-sm text-muted tabular-nums">
            Робота {i + 1} з {G.LINKS.length}
          </p>
          <div className="mt-2 rounded-[6px] bg-surface-raised p-4 sm:p-5">
            <h3 className="font-display text-xl font-semibold">{G.taskName(link.id)}</h3>
            <p className="mt-1 leading-relaxed">{link.clue}</p>
            <p className="mt-3 text-[13px] text-muted">Починаємо після</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label={`Після чого: ${G.taskName(link.id)}`}>
              {link.options.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={sel.includes(id)}
                  disabled={checked}
                  onClick={() => setSel((s) => (s.includes(id) ? s.filter((v) => v !== id) : [...s, id]))}
                  className={`${chip(sel.includes(id))} disabled:cursor-default`}
                >
                  {G.taskName(id)}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {!checked ? (
              <button type="button" onClick={check} disabled={sel.length === 0} className={primary}>
                Поставити стрілки
              </button>
            ) : (
              <>
                <Feedback ok={ok}>{link.why}</Feedback>
                <button type="button" onClick={next} className={primary}>
                  {i === G.LINKS.length - 1 ? "До шляхів" : "Наступна робота"}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="rounded-[6px] bg-surface-raised p-4 sm:p-5">
            <p className="font-display text-lg font-semibold">Який шлях визначає дату релізу?</p>
            <div className="mt-3 grid gap-1.5" role="group" aria-label="Який шлях визначає дату релізу">
              {paths.map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={path === k}
                  disabled={path !== null}
                  onClick={() => setPath(k)}
                  className={optionClass(path === k, path !== null)}
                >
                  {pathText(G.PATHS[k].ids)}
                  {path !== null && <span className="tabular-nums">: {G.PATHS[k].weeks} тиж.</span>}
                </button>
              ))}
            </div>
          </div>
          {pickedPath && (
            <div className="mt-4 space-y-4">
              <Feedback ok={pickedPath === longest}>
                {pickedPath === longest ? "" : `Цей шлях триває ${pickedPath.weeks} тиж., а найдовший — ${G.LONGEST}. `}
                Найдовший ланцюжок і є критичним шляхом. Парадокс: саме він визначає найкоротший строк проєкту, бо швидше
                за {G.LONGEST} тижнів ці роботи не завершити.
              </Feedback>
              <button type="button" onClick={() => onDone(score + (pickedPath === longest ? 1 : 0))} className={primary}>
                До наступного рівня
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// The plan as a Gantt chart: a bar for the work, a lighter tail for its reserve.
function Gantt({ tasks, scale, mark }: { tasks: Scheduled[]; scale: number; mark?: number }) {
  const pct = (w: number) => `${(w / scale) * 100}%`;
  return (
    <div className="space-y-1.5" aria-hidden>
      {tasks.map((t) => (
        <div key={t.id} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 text-[13px]">
          <span className={`flex items-center gap-1.5 truncate ${t.id === mark ? "font-semibold" : ""}`}>
            {t.critical && <span className="size-2 shrink-0 rotate-45 rounded-[1px] bg-accent" />}
            {t.name}
          </span>
          <div className="relative h-5 rounded-[2px] bg-foreground/[0.05]">
            {t.slack > 0 && <span className="absolute inset-y-1 rounded-[2px] bg-foreground/25 transition-[left,width] duration-500" style={{ left: pct(t.ef), width: pct(t.slack) }} />}
            <span
              className={`absolute inset-y-0 rounded-[3px] transition-[left,width] duration-500 ease-[var(--ease-out)] ${t.critical ? "bg-accent" : "bg-muted/70"} ${
                t.id === mark ? "ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""
              }`}
              style={{ left: pct(t.es), width: pct(t.weeks) }}
            />
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 text-[12px] text-muted">
        <span>тижні</span>
        <div className="relative h-4">
          {[0, 5, 10, 15].map((w) => (
            <span key={w} className="absolute -translate-x-1/2 tabular-nums first:translate-x-0" style={{ left: pct(w) }}>
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function GanttKey() {
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
      <span className="flex items-center gap-2">
        <span aria-hidden className="size-2 rotate-45 rounded-[1px] bg-accent" /> критичний шлях
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="h-2 w-5 rounded-[2px] bg-foreground/25" /> резерв
      </span>
    </div>
  );
}

// Level 2: predict the shift of the release, then watch the bars move.
function DelayLevel({ events, donors, onDone }: { events: number[]; donors: number[]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [donor, setDonor] = useState<number | null>(null);
  const predicting = i < G.EVENTS.length;
  const e = predicting ? G.EVENTS[events[i]] : null;
  const late = e ? G.delayed(e.task, e.plus) : PLAN;
  const shift = late.total - PLAN.total;
  const shown = pick !== null ? late : PLAN;
  const picked = donor === null ? null : G.DONORS[donor];
  const scale = PLAN.total + 6;

  const predict = (s: number) => {
    if (pick !== null) return;
    setPick(s);
    if (s === shift) setScore((v) => v + 1);
  };

  return (
    <div>
      <HowTo
        goal="передбачити, чи зсунеться реліз, і зрозуміти, де в плані є запас."
        steps={[
          "Перед тобою діаграма Ганта. Смуга — робота, світліше продовження — її резерв: на стільки роботу можна затримати без шкоди для релізу. Ромб позначає критичний шлях.",
          "Приходить подія: якась робота затримується. Подивись на її резерв.",
          "Натисни, на скільки тижнів, на твою думку, зсунеться реліз. Смуги поїдуть і покажуть відповідь.",
          "Кожна нова подія стартує зі звичайного плану, затримки не накопичуються.",
          "Наприкінці вибери, звідки забрати людину на допомогу механіці.",
        ]}
        tip="Підказка: зсув релізу — це затримка мінус резерв. Якщо резерв більший за затримку, реліз на місці."
      />

      <div className="mt-5 rounded-[6px] bg-background p-3 sm:p-4">
        <p className="mb-3 font-medium" aria-live="polite">
          Реліз через <span className="tabular-nums">{predicting ? shown.total : PLAN.total}</span> тиж.
        </p>
        <Gantt tasks={predicting ? shown.tasks : PLAN.tasks} scale={scale} mark={e?.task} />
        <GanttKey />
      </div>

      {e ? (
        <div className="mt-4">
          <p className="text-sm text-muted tabular-nums">
            Подія {i + 1} з {G.EVENTS.length}
          </p>
          <div className="mt-2 rounded-[6px] bg-surface-raised p-4 sm:p-5">
            <p className="font-display text-xl font-semibold leading-snug">{e.story}</p>
            <p className="mt-3 text-[13px] text-muted">На скільки тижнів зсунеться реліз?</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label="На скільки тижнів зсунеться реліз">
              {G.SHIFTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={pick === s}
                  disabled={pick !== null}
                  onClick={() => predict(s)}
                  className={`${chip(pick === s)} min-w-12 tabular-nums disabled:cursor-default`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {pick !== null && (
            <div className="mt-4 space-y-4">
              <Feedback ok={pick === shift} title={pick === shift ? undefined : `Зсув — ${shift} тиж.`}>
                {e.why}
              </Feedback>
              <button
                type="button"
                onClick={() => {
                  setI(i + 1);
                  setPick(null);
                }}
                className={primary}
              >
                {i === G.EVENTS.length - 1 ? "До рішення" : "Наступна подія"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <div className="rounded-[6px] bg-surface-raised p-4 sm:p-5">
            <p className="font-display text-lg font-semibold">Механіка відстає. Звідки забрати людину їй на допомогу?</p>
            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Звідки забрати людину">
              {donors.map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={donor === k}
                  disabled={donor !== null}
                  onClick={() => setDonor(k)}
                  className={`${chip(donor === k)} disabled:cursor-default`}
                >
                  {G.taskName(G.DONORS[k].task)}
                </button>
              ))}
            </div>
          </div>
          {picked && (
            <div className="mt-4 space-y-4">
              <Feedback ok={!!picked.right}>
                {picked.why}
                {!picked.right && " Найбільший запас у сервера."}
              </Feedback>
              <button type="button" onClick={() => onDone(score + (picked.right ? 1 : 0))} className={primary}>
                До наступного рівня
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 100 possible releases as diamonds. The order only spreads the lit ones around.
function Releases({ lit }: { lit: number }) {
  return (
    <div className="grid w-fit grid-cols-10 gap-1.5" aria-hidden>
      {Array.from({ length: 100 }, (_, k) => (
        <span
          key={k}
          className={`block size-3 rotate-45 rounded-[2px] transition-colors duration-300 sm:size-3.5 ${(k * 37) % 100 < lit ? "bg-accent" : "bg-foreground/15"}`}
        />
      ))}
    </div>
  );
}

// Level 3: name how each estimate was made, then choose the date to promise.
function PromiseLevel({ notes, onDone }: { notes: number[]; onDone: (score: number) => void }) {
  const [methods, setMethods] = useState<(string | null)[]>(G.NOTES.map(() => null));
  const [week, setWeek] = useState<number>(G.PROMISE.min);
  const [promised, setPromised] = useState(false);
  const noteScore = G.NOTES.filter((n, k) => methods[k] === n.method).length;
  const named = methods.every((m) => m !== null);
  const ok = week === G.PROMISE.right;
  const lit = G.onTime(week);

  return (
    <div>
      <HowTo
        goal="розпізнати, як отримано кожну оцінку, і вибрати дату релізу, на яку можна покластися."
        steps={[
          "На стіл лягли чотири оцінки від команди. Прочитай кожну і натисни спосіб, яким її отримано. Під назвою сказано, у чому він полягає.",
          "Потім з'явиться повзунок дати. Пересувай його: 100 ромбиків — це 100 можливих випусків гри, світяться ті, що встигають.",
          `Знайди найранішу дату, на яку встигає хоча б ${G.PROMISE.need} випусків зі 100, і натисни «Пообіцяти».`,
        ]}
        tip="Підказка: оцінки бувають і оптимістичні, і песимістичні, тож реліз у кожному випадку виходить у різний час. Цифри порахував метод PERT з уроку."
      />

      <ul className="mt-5 space-y-2">
        {notes.map((k) => {
          const n = G.NOTES[k];
          const m = methods[k];
          return (
            <li key={n.method} className="rounded-[6px] bg-background p-3 sm:p-4">
              <p className="font-medium leading-snug">«{n.text}»</p>
              <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4" role="group" aria-label="Спосіб оцінки">
                {G.METHODS.map((x) => (
                  <button
                    key={x.name}
                    type="button"
                    aria-pressed={m === x.name}
                    disabled={m !== null}
                    onClick={() => setMethods((v) => v.map((old, j) => (j === k ? x.name : old)))}
                    className={`rounded-md px-2 py-2 text-left leading-tight press ${
                      m === x.name ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] enabled:hover:bg-foreground/[0.12] disabled:opacity-60"
                    }`}
                  >
                    <span className="block text-sm font-medium">{x.name}</span>
                    <span className={`mt-0.5 block text-xs ${m === x.name ? "" : "text-muted"}`}>{x.note}</span>
                  </button>
                ))}
              </div>
              {m && (
                <p className="mt-2 text-sm leading-snug" aria-live="polite">
                  {m === n.method ? "✓ " : `✗ Це «${n.method}». `}
                  {n.why}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {named && (
        <div className="mt-5 rounded-[6px] bg-surface-raised p-4 sm:p-5">
          <p className="font-display text-lg font-semibold">Яку дату обіцяти засновникам?</p>
          <div className="mt-3 flex items-baseline justify-between gap-3">
            <label htmlFor="promise-week">Реліз через</label>
            <span className="font-display text-xl font-semibold tabular-nums">{week} тиж.</span>
          </div>
          <input
            id="promise-week"
            type="range"
            min={G.PROMISE.min}
            max={G.PROMISE.max}
            step={1}
            value={week}
            disabled={promised}
            onChange={(e) => setWeek(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
          <div className="mt-4 flex flex-wrap items-center gap-6 pl-1">
            <Releases lit={lit} />
            <p className="max-w-[24ch] leading-snug" aria-live="polite">
              Встигає <strong className="font-display text-2xl font-semibold tabular-nums">{lit}</strong> випусків зі 100
            </p>
          </div>
          {!promised && (
            <button type="button" onClick={() => setPromised(true)} className={`${primary} mt-5`}>
              Пообіцяти
            </button>
          )}
        </div>
      )}

      {promised && (
        <div className="mt-4 space-y-4">
          <Feedback ok={ok} title={ok ? undefined : `Найраніша надійна дата — ${G.PROMISE.right} тиж.`}>
            {week < G.PROMISE.right
              ? `На ${week} тиж. встигає лише ${lit} випусків зі 100, цього замало. `
              : week > G.PROMISE.right
                ? `На ${week} тиж. теж надійно, але можна раніше: уже на ${G.PROMISE.right} тиж. встигає ${G.onTime(G.PROMISE.right)} зі 100. `
                : `На ${week} тиж. встигає ${lit} випусків зі 100. `}
            Наші «{G.PROMISE.min} тижнів» спрацюють лише приблизно в кожному сьомому випадку. Чесна оцінка — це завжди діапазон,
            а не одна цифра.
          </Feedback>
          <button type="button" onClick={() => onDone(noteScore + (ok ? 1 : 0))} className={primary}>
            До наступного рівня
          </button>
        </div>
      )}
    </div>
  );
}

// Level 4: buy weeks until the release is two weeks closer.
function CompressLevel({ onDone }: { onDone: (score: number) => void }) {
  const [keys, setKeys] = useState<string[]>([]);
  const [shown, setShown] = useState(false);
  const plan = G.compressed(keys);
  const saved = PLAN.total - plan.total;
  const money = G.spent(keys);
  const back = saved * G.INDIRECT;
  const net = money - back;
  const score = G.compressScore(keys);
  const useless = G.wasted(keys);

  // A second purchase for the same work replaces the first.
  const withBuy = (b: G.Buy) => [...keys.filter((k) => G.BUYS.find((x) => x.key === k)!.task !== b.task), b.key];
  const blocked = (b: G.Buy) => {
    const next = withBuy(b);
    if (G.spent(next) > G.BUDGET) return "Не вистачає бюджету";
    if (G.risks(next) > G.RISK_LIMIT) return "Ризикове рішення вже є";
    return null;
  };
  const toggle = (b: G.Buy) => {
    if (shown) return;
    setKeys(keys.includes(b.key) ? keys.filter((k) => k !== b.key) : withBuy(b));
  };

  return (
    <div>
      <HowTo
        goal={`вийти за ${G.TARGET} тижнів замість ${PLAN.total}, щоб потрапити в добірку магазину «Нове», і заплатити якнайменше.`}
        steps={[
          "Унизу список покупок: кожна забирає один тиждень в однієї роботи. «Додати людину» коштує грошей, а «Виконувати паралельно» — ризику переробок.",
          "Натисни на покупку, і діаграма Ганта перерахується. Якщо реліз не зрушив, купи щось інше. Покупку можна скасувати новим натисканням.",
          `Обмеження: бюджет ${G.BUDGET} тис. грн і не більше ${G.RISK_LIMIT} ризикового рішення.`,
          `Кожен скорочений тиждень повертає ${G.INDIRECT} тис. грн: стільки студія щотижня платить за офіс і сервери. Це непрямі витрати.`,
          "Коли визначишся, натисни «Показати засновникам».",
        ]}
        tip="Підказка: стежи за ромбами. Прискорювати варто лише критичний шлях, а він може змінитися після покупки."
      />

      <div className="mt-5 rounded-[6px] bg-background p-3 sm:p-4">
        <p className="mb-3 font-medium" aria-live="polite">
          Реліз через <span className="tabular-nums">{plan.total}</span> тиж.
          <span className="font-normal text-muted"> Мета: {G.TARGET}.</span>
        </p>
        <Gantt tasks={plan.tasks} scale={PLAN.total + 2} />
        <GanttKey />
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-[13px] text-muted">Витрачено</dt>
            <dd className="tabular-nums">
              {money} з {G.BUDGET} тис.
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted">Повернули непрямі</dt>
            <dd className="tabular-nums">{back} тис.</dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted">Разом</dt>
            <dd className="tabular-nums">{net > 0 ? `дорожче на ${net} тис.` : net < 0 ? `економія ${-net} тис.` : "без змін"}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted">Ризик</dt>
            <dd className="tabular-nums">
              {G.risks(keys)} з {G.RISK_LIMIT}
            </dd>
          </div>
        </dl>
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {G.BUYS.map((b) => {
          const on = keys.includes(b.key);
          const why = on ? null : blocked(b);
          return (
            <li key={b.key}>
              <button
                type="button"
                aria-pressed={on}
                disabled={shown || !!why}
                onClick={() => toggle(b)}
                className={`flex h-full w-full flex-col gap-1 rounded-[6px] p-3 text-left leading-snug press ${
                  on ? "bg-accent-soft ring-2 ring-accent" : "bg-background enabled:hover:bg-foreground/[0.08]"
                } ${why ? "opacity-60" : ""}`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-medium">
                    {G.taskName(b.task)} −1 тиж.
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-muted">{b.risky ? "ризик" : `${b.price} тис.`}</span>
                </span>
                <span className="text-[13px] text-muted">
                  {b.how}. {b.note}
                </span>
                {why && <span className="text-[13px] text-muted">{why}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 space-y-4">
        {!shown ? (
          <button type="button" onClick={() => setShown(true)} disabled={keys.length === 0} className={primary}>
            Показати засновникам
          </button>
        ) : (
          <>
            <Feedback ok={score === G.COMPRESS_MAX} title={score === G.COMPRESS_MAX ? "Найдешевший шлях!" : `${score} з ${G.COMPRESS_MAX}.`}>
              {plan.total > G.TARGET && `Реліз лише через ${plan.total} тиж., а треба ${G.TARGET}. `}
              {useless.length > 0 && `Гроші на вітер: ${useless.map((b) => G.taskName(b.task)).join(", ")}. Реліз би не змінився і без цього. `}
              {score < G.COMPRESS_MAX &&
                `Найдешевший варіант: другий програміст на механіку за ${G.BEST_PRICE} тис. і одна паралельна робота. `}
              Після першого тижня критичним стає ще й шлях через дизайн, тому другий тиждень купують на спільній для обох
              шляхів роботі. Безкоштовного прискорення не буває: платимо грошима або ризиком, а чи варте воно місця в
              добірці, вирішує спонсор.
            </Feedback>
            <button type="button" onClick={() => onDone(score)} className={primary}>
              До наступного рівня
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const CHART = { w: 300, h: 150, l: 26, r: 8, t: 8, b: 22, peak: 30 };

// A small sprint burndown: the fact against the dashed ideal line.
function MiniBurndown({ remaining, label }: { remaining: number[]; label: string }) {
  const days = remaining.length - 1;
  const x = (d: number) => CHART.l + (d / days) * (CHART.w - CHART.l - CHART.r);
  const y = (v: number) => CHART.t + (1 - v / CHART.peak) * (CHART.h - CHART.t - CHART.b);
  return (
    <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} className="h-auto w-full" role="img" aria-label={label}>
      {[0, 15, 30].map((v) => (
        <g key={v}>
          <line x1={CHART.l} x2={CHART.w - CHART.r} y1={y(v)} y2={y(v)} strokeWidth={1} style={{ stroke: "var(--grid)" }} />
          <text x={CHART.l - 6} y={y(v)} textAnchor="end" dominantBaseline="central" fontSize={11} style={{ fill: "var(--muted)" }}>
            {v}
          </text>
        </g>
      ))}
      {[0, 5, 10].map((d) => (
        <text key={d} x={x(d)} y={CHART.h - 6} textAnchor="middle" fontSize={11} style={{ fill: "var(--muted)" }}>
          {d}
        </text>
      ))}
      <line x1={x(0)} y1={y(CHART.peak)} x2={x(days)} y2={y(0)} strokeWidth={1.5} strokeDasharray="5 4" style={{ stroke: "var(--muted)" }} />
      <polyline
        points={remaining.map((v, d) => `${x(d)},${y(v)}`).join(" ")}
        fill="none"
        strokeWidth={2}
        strokeLinejoin="round"
        style={{ stroke: "var(--accent)" }}
      />
      {remaining.map((v, d) => (
        <circle key={d} cx={x(d)} cy={y(v)} r={3} strokeWidth={1.5} style={{ fill: "var(--accent)", stroke: "var(--background)" }}>
          <title>{`День ${d}: лишилося ${v} поінтів`}</title>
        </circle>
      ))}
    </svg>
  );
}

// Level 5: plan by velocity, then read three burndown charts.
function SprintLevel({ questions, charts, onDone }: { questions: number[][]; charts: number[]; onDone: (score: number) => void }) {
  const [q, setQ] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [reads, setReads] = useState<(G.Reading | null)[]>(G.CHARTS.map(() => null));
  const asking = q < G.SPRINT_QUESTIONS.length;
  const ask = asking ? G.SPRINT_QUESTIONS[q] : null;
  const picked = ask && pick !== null ? ask.options[pick] : null;
  const readScore = G.CHARTS.filter((c, k) => reads[k] === c.key).length;
  const allRead = reads.every((r) => r !== null);

  const choose = (k: number) => {
    if (pick !== null) return;
    setPick(k);
    if (ask!.options[k].right) setScore((v) => v + 1);
  };

  return (
    <div>
      <HowTo
        goal="спланувати реліз за швидкістю команди і прочитати діаграми згоряння."
        steps={[
          "Команда рівнів працює двотижневими спринтами. Швидкість — це скільки сторі-поінтів вона реально закриває за спринт.",
          "Дай відповідь на три питання про швидкість, реліз і новий запит. Після кожного буде пояснення.",
          "Потім прочитай три діаграми згоряння: пунктир — ідеальний темп, суцільна лінія — скільки роботи лишилося насправді. Під кожною вибери, що ти бачиш.",
        ]}
        tip="Підказка: лінія вище пунктиру означає відставання, а лінія, що раптом пішла вгору, — додану роботу."
      />

      {ask ? (
        <div className="mt-5">
          <p className="text-sm text-muted tabular-nums">
            Питання {q + 1} з {G.SPRINT_QUESTIONS.length}
          </p>
          <div className="mt-2 rounded-[6px] bg-surface-raised p-4 sm:p-5">
            <p className="font-display text-xl font-semibold leading-snug">{ask.ask}</p>
            <div className="mt-3 grid gap-1.5" role="group" aria-label={ask.ask}>
              {questions[q].map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={pick === k}
                  disabled={pick !== null}
                  onClick={() => choose(k)}
                  className={optionClass(pick === k, pick !== null)}
                >
                  {ask.options[k].text}
                </button>
              ))}
            </div>
          </div>
          {picked && (
            <div className="mt-4 space-y-4">
              <Feedback ok={!!picked.right}>{picked.why}</Feedback>
              <button
                type="button"
                onClick={() => {
                  setQ(q + 1);
                  setPick(null);
                }}
                className={primary}
              >
                {q === G.SPRINT_QUESTIONS.length - 1 ? "До діаграм" : "Наступне питання"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5">
          <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
            <span className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-5 bg-accent" /> лишилося роботи (поінти)
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden className="w-5 border-t-2 border-dashed border-muted" /> ідеальний темп
            </span>
            <span>Унизу — день спринту</span>
          </div>
          <ul className="space-y-2">
            {charts.map((k, n) => {
              const c = G.CHARTS[k];
              const r = reads[k];
              return (
                <li key={c.key} className="rounded-[6px] bg-background p-3 sm:p-4">
                  <p className="mb-2 font-medium">Спринт {n + 1}</p>
                  <div className="max-w-md">
                    <MiniBurndown
                      remaining={c.remaining}
                      label={`Діаграма згоряння: на старті 30 поінтів, наприкінці лишилося ${c.remaining[c.remaining.length - 1]}. По днях: ${c.remaining.join(", ")}`}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={`Що видно: спринт ${n + 1}`}>
                    {G.READINGS.map((x) => (
                      <button
                        key={x.key}
                        type="button"
                        aria-pressed={r === x.key}
                        disabled={r !== null}
                        onClick={() => setReads((v) => v.map((old, j) => (j === k ? x.key : old)))}
                        className={`${chip(r === x.key)} disabled:cursor-default`}
                      >
                        {x.name}
                      </button>
                    ))}
                  </div>
                  {r && (
                    <p className="mt-2 text-sm leading-snug" aria-live="polite">
                      {r === c.key ? "✓ " : `✗ Тут «${G.READINGS.find((x) => x.key === c.key)!.name}». `}
                      {c.why}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          {allRead && (
            <button type="button" onClick={() => onDone(score + readScore)} className={`${primary} mt-5`}>
              Завершити гру
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function ScheduleGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-08"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        paths: shuffled(G.PATHS.length),
        events: shuffled(G.EVENTS.length),
        donors: shuffled(G.DONORS.length),
        notes: shuffled(G.NOTES.length),
        questions: G.SPRINT_QUESTIONS.map((q) => shuffled(q.options.length)),
        charts: shuffled(G.CHARTS.length),
      })}
      levels={[
        { name: "Хто за ким", play: (o, done) => <ArrowsLevel paths={o.paths} onDone={done} /> },
        { name: "Хто зсуне реліз", play: (o, done) => <DelayLevel events={o.events} donors={o.donors} onDone={done} /> },
        { name: "Яку дату обіцяти", play: (o, done) => <PromiseLevel notes={o.notes} onDone={done} /> },
        { name: "Добірка «Нове»", play: (_, done) => <CompressLevel onDone={done} /> },
        { name: "Спринти", play: (o, done) => <SprintLevel questions={o.questions} charts={o.charts} onDone={done} /> },
      ]}
      startLabel="Почати"
      period="За гру"
      finalTitle="Восьма віха!"
      finalText="Модуль 8 пройдено. Далі — гроші: скільки коштуватиме проєкт і як бачити, чи вкладаємося."
      nextHref={nextHref}
      nextLabel="До модуля 9"
    >
      <ScheduleBonus />
    </AssignmentGame>
  );
}
