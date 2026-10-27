"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type PointerEvent, type ReactNode } from "react";
import { MilestoneMark } from "@/components/logo";
import * as G from "@/content/assignments/module-01";

// Progress lives in the browser until accounts exist.
const STORE = "vikha-assignment-module-01";
type Saved = { best: number; completedAt?: string; project?: string };

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const readRaw = () => {
  try {
    return localStorage.getItem(STORE);
  } catch {
    return null;
  }
};
const parse = (raw: string | null): Saved | null => {
  try {
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
};
const write = (s: Saved) => {
  try {
    localStorage.setItem(STORE, JSON.stringify(s));
  } catch {
    // Private mode or storage disabled: the game still works, it just forgets.
  }
};

const LEVELS = ["Проєкт чи ні?", "Ланцюжок цінності", "Хто є хто", "Два начальники"];

// Card order is shuffled on every play, so the answers can't be guessed from
// the position of a card.
const shuffled = (n: number) => {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
type Orders = { sort: number[]; chain: number[]; speakers: number[]; roles: number[] };
const newOrders = (): Orders => ({
  sort: shuffled(G.SORT.length),
  chain: shuffled(G.CHAIN.length),
  speakers: shuffled(G.SPEAKERS.length),
  roles: shuffled(G.ROLES.length),
});

const chip = (on: boolean) =>
  `rounded-md px-3 py-2 text-sm font-medium press ${
    on ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
  }`;
const primary = "rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground press hover:brightness-110";

function Feedback({ ok, title, children }: { ok: boolean; title?: string; children: ReactNode }) {
  return (
    <div className="rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
      <p className="font-display text-lg font-semibold">
        {title ?? (ok ? "Так!" : "Майже.")}
        {ok && <MilestoneMark className="ml-2 size-2.5 align-middle" />}
      </p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

// Level 1: swipe or tap each card to the project or the operations side.
function SortLevel({ order, onDone }: { order: number[]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<G.Kind | null>(null);
  const [score, setScore] = useState(0);
  const [drag, setDrag] = useState<{ start: number; dx: number } | null>(null);
  const card = G.SORT[order[i]];
  const last = i === G.SORT.length - 1;

  const choose = (k: G.Kind) => {
    if (answer) return;
    setAnswer(k);
    if (k === card.kind) setScore((s) => s + 1);
  };
  const next = () => {
    if (last) return onDone(score);
    setI(i + 1);
    setAnswer(null);
  };

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (answer) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ start: e.clientX, dx: 0 });
  };
  const move = (e: PointerEvent<HTMLDivElement>) => drag && setDrag({ ...drag, dx: e.clientX - drag.start });
  const up = () => {
    if (drag && Math.abs(drag.dx) > 90) choose(drag.dx > 0 ? "project" : "operations");
    setDrag(null);
  };
  const dx = drag?.dx ?? (answer ? (answer === "project" ? 40 : -40) : 0);

  return (
    <div>
      <p className="text-muted">
        Гортай картку вліво, якщо це операційна робота, і вправо, якщо проєкт. Або тисни кнопки.{" "}
        <span className="tabular-nums">
          {i + 1} з {G.SORT.length}
        </span>
      </p>

      <div className="relative mt-6 flex justify-center">
        <div
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={() => setDrag(null)}
          className={`flex min-h-40 w-full max-w-sm cursor-grab touch-pan-y select-none items-center justify-center rounded-[6px] bg-surface-raised p-6 text-center font-display text-2xl font-semibold leading-snug active:cursor-grabbing ${
            drag ? "" : "transition-transform duration-300 ease-[var(--ease-out)]"
          }`}
          style={{ transform: `translateX(${dx}px) rotate(${dx / 18}deg)` }}
        >
          {card.text}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => choose("operations")} disabled={!!answer} className={chip(answer === "operations")}>
          ← Операційна робота
        </button>
        <button type="button" onClick={() => choose("project")} disabled={!!answer} className={chip(answer === "project")}>
          Проєкт →
        </button>
      </div>

      {answer && (
        <div className="mt-5 space-y-4">
          <Feedback ok={answer === card.kind}>
            {card.kind === "project" ? "Це проєкт. " : "Це операційна робота. "}
            {card.why}
          </Feedback>
          <button type="button" onClick={next} className={primary}>
            {last ? "До наступного рівня" : "Далі"}
          </button>
        </div>
      )}
    </div>
  );
}

// Level 2: put each card into the result, outcome or benefit basket.
function ChainLevel({ order, onDone }: { order: number[]; onDone: (score: number) => void }) {
  const [place, setPlace] = useState<(G.Step | null)[]>(G.CHAIN.map(() => null));
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const pool = order.map((k) => ({ ...G.CHAIN[k], k })).filter((c) => place[c.k] === null);
  const wrong = G.CHAIN.filter((c, k) => place[k] !== c.step).length;

  const drop = (step: G.Step) => {
    if (sel === null || checked) return;
    setPlace((p) => p.map((v, k) => (k === sel ? step : v)));
    setSel(null);
  };
  const lift = (k: number) => {
    if (checked) return;
    setPlace((p) => p.map((v, j) => (j === k ? null : v)));
    setSel(k);
  };
  const check = () => {
    setChecked(true);
    if (score === null) setScore(G.CHAIN.length - wrong);
  };
  const retry = () => {
    setPlace((p) => p.map((v, k) => (v === G.CHAIN[k].step ? v : null)));
    setChecked(false);
  };

  return (
    <div>
      <p className="text-muted">Обери картку, потім кошик, у який вона лягає. Картку з кошика можна забрати назад.</p>

      <div className="mt-5 flex min-h-12 flex-wrap gap-2">
        {pool.map((c) => (
          <button key={c.k} type="button" aria-pressed={sel === c.k} onClick={() => setSel(sel === c.k ? null : c.k)} className={chip(sel === c.k)}>
            {c.text}
          </button>
        ))}
        {pool.length === 0 && !checked && <span className="py-2 text-sm text-muted">Усі картки розкладено.</span>}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {G.STEPS.map((s) => (
          <div key={s.key} className="rounded-[4px] bg-background p-2">
            <button
              type="button"
              onClick={() => drop(s.key)}
              disabled={sel === null || checked}
              className={`w-full rounded-[2px] px-2 py-2 text-left press ${sel !== null && !checked ? "bg-accent-soft hover:bg-accent/25" : ""}`}
            >
              <span className="block font-medium">{s.name}</span>
              <span className="block text-[13px] text-muted">{s.hint}</span>
            </button>
            <ul className="mt-1 space-y-1">
              {order.map((k) => [G.CHAIN[k], k] as const).map(([c, k]) =>
                place[k] === s.key ? (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => lift(k)}
                      className={`w-full rounded-[2px] px-2 py-1.5 text-left text-sm leading-snug ${
                        checked ? (c.step === s.key ? "bg-surface-raised" : "bg-accent text-accent-foreground") : "bg-surface-raised hover:bg-foreground/[0.12]"
                      }`}
                    >
                      {checked && (c.step === s.key ? "✓ " : "✗ ")}
                      {c.text}
                    </button>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {!checked && (
          <button type="button" onClick={check} disabled={pool.length > 0} className={`${primary} disabled:opacity-40`}>
            Перевірити
          </button>
        )}
        {checked && (
          <>
            <Feedback ok={wrong === 0} title={wrong === 0 ? "Усе на своїх місцях!" : `Не на місці: ${wrong}.`}>
              {wrong === 0
                ? "Результат — що створили, наслідок — що змінилося, вигода — яка з цього користь."
                : G.CHAIN.filter((c, k) => place[k] !== c.step).map((c) => `«${c.text}»: ${c.why}`).join(" ")}
            </Feedback>
            <div className="flex flex-wrap gap-2">
              {wrong > 0 && (
                <button type="button" onClick={retry} className={chip(false)}>
                  Переставити неправильні
                </button>
              )}
              <button type="button" onClick={() => onDone(score ?? 0)} className={primary}>
                До наступного рівня
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Level 3: guess each speaker's role from one line.
function RolesLevel({
  speakers,
  roles,
  onDone,
}: {
  speakers: number[];
  roles: number[];
  onDone: (score: number) => void;
}) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<G.Role | null>(null);
  const [score, setScore] = useState(0);
  const s = G.SPEAKERS[speakers[i]];
  const last = i === G.SPEAKERS.length - 1;

  const choose = (r: G.Role) => {
    if (pick) return;
    setPick(r);
    if (r === s.role) setScore((v) => v + 1);
  };

  return (
    <div>
      <p className="text-muted">
        Нарада в студії. Хто це говорить?{" "}
        <span className="tabular-nums">
          {i + 1} з {G.SPEAKERS.length}
        </span>
      </p>

      <div className="mt-6 flex items-start gap-3">
        <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-raised font-display text-xl font-semibold">
          {s.who[0]}
        </span>
        <div className="rounded-[6px] bg-surface-raised px-4 py-3">
          <p className="text-[13px] text-muted">{s.who}</p>
          <p className="mt-1 font-display text-xl font-semibold leading-snug">«{s.line}»</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Роль">
        {roles.map((k) => G.ROLES[k]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => choose(r)}
            disabled={!!pick}
            aria-pressed={pick === r}
            className={chip(pick !== null && r === s.role)}
          >
            {r}
          </button>
        ))}
      </div>

      {pick && (
        <div className="mt-5 space-y-4">
          <Feedback ok={pick === s.role}>
            {pick === s.role ? "" : `Це ${s.role.toLowerCase()}. `}
            {s.why}
          </Feedback>
          <button
            type="button"
            onClick={() => {
              if (last) return onDone(score);
              setI(i + 1);
              setPick(null);
            }}
            className={primary}
          >
            {last ? "До останнього рівня" : "Далі"}
          </button>
        </div>
      )}
    </div>
  );
}

// Level 4: one conflict, three moves, each with its price.
function BossLevel({ onDone }: { onDone: (score: number) => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const m = pick === null ? null : G.BOSS.moves[pick];

  return (
    <div>
      <p className="leading-relaxed">{G.BOSS.setup}</p>

      <div className="mt-5 grid gap-2">
        {G.BOSS.moves.map((x, k) => (
          <button
            key={x.move}
            type="button"
            onClick={() => {
              setPick(k);
              setSeen((s) => (s.includes(k) ? s : [...s, k]));
            }}
            aria-pressed={pick === k}
            className={`rounded-[4px] border px-4 py-3 text-left press ${
              pick === k ? "border-accent bg-accent-soft" : "border-transparent bg-foreground/[0.05] hover:bg-foreground/[0.09]"
            }`}
          >
            {x.move}
            {seen.includes(k) && pick !== k && <span className="ml-2 text-[13px] text-muted">(уже спробувано)</span>}
          </button>
        ))}
      </div>

      {m && (
        <div className="mt-5 space-y-4">
          <Feedback ok title={m.structure}>
            {m.outcome}
          </Feedback>
          <p className="leading-relaxed text-muted">{G.BOSS.lesson}</p>
          <div className="flex flex-wrap gap-2">
            {seen.length < G.BOSS.moves.length && (
              <button type="button" onClick={() => setPick(null)} className={chip(false)}>
                Спробувати інший хід
              </button>
            )}
            <button type="button" onClick={() => onDone(1)} className={primary}>
              Завершити день
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// The whole game: intro, four levels and the finish with diamonds.
export function FirstDayGame({ nextHref }: { nextHref: string }) {
  const saved = parse(useSyncExternalStore(subscribe, readRaw, () => null));
  const [phase, setPhase] = useState<"intro" | number | "final">("intro");
  const [scores, setScores] = useState<number[]>([]);
  const [orders, setOrders] = useState<Orders | null>(null);
  const total = scores.reduce((a, b) => a + b, 0);

  const finishLevel = (level: number) => (score: number) => {
    const next = [...scores.slice(0, level), score];
    setScores(next);
    if (level < LEVELS.length - 1) return setPhase(level + 1);
    const sum = next.reduce((a, b) => a + b, 0);
    write({ ...saved, best: Math.max(sum, saved?.best ?? 0), completedAt: new Date().toISOString() });
    setPhase("final");
  };

  const start = () => {
    setOrders(newOrders());
    setScores([]);
    setPhase(0);
  };

  return (
    <div className="rounded-[6px] bg-surface p-5 sm:p-8">
      {typeof phase === "number" && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <ol className="flex gap-1.5" aria-label="Рівні">
            {LEVELS.map((name, k) => (
              <li key={name} aria-current={k === phase ? "step" : undefined} title={name}>
                <span
                  className={`block size-3 rotate-45 rounded-[2px] ${
                    k < phase ? "bg-accent" : k === phase ? "bg-accent/40 ring-2 ring-accent" : "bg-foreground/15"
                  }`}
                />
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted">
            Рівень {phase + 1}: <span className="text-foreground">{LEVELS[phase]}</span>
          </p>
        </div>
      )}

      {phase === "intro" && (
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">{G.TITLE}</h2>
          <p className="mt-3 max-w-[60ch] text-lg leading-relaxed">{G.INTRO}</p>
          <ol className="mt-5 grid gap-2 sm:grid-cols-2">
            {LEVELS.map((name, k) => (
              <li key={name} className="flex items-center gap-3 rounded-[4px] bg-foreground/[0.05] px-3 py-2">
                <span className="font-display font-semibold text-accent tabular-nums">{k + 1}</span>
                {name}
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="button" onClick={start} className={primary}>
              {saved ? "Зіграти ще раз" : "Почати день"}
            </button>
            {saved && (
              <span className="text-sm text-muted">
                Твій рекорд: {saved.best} з {G.MAX_DIAMONDS} віх.
              </span>
            )}
          </div>
        </div>
      )}

      {phase === 0 && orders && <SortLevel order={orders.sort} onDone={finishLevel(0)} />}
      {phase === 1 && orders && <ChainLevel order={orders.chain} onDone={finishLevel(1)} />}
      {phase === 2 && orders && <RolesLevel speakers={orders.speakers} roles={orders.roles} onDone={finishLevel(2)} />}
      {phase === 3 && <BossLevel onDone={finishLevel(3)} />}

      {phase === "final" && (
        <div>
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center">
              <MilestoneMark className="size-11" />
            </span>
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">Перша віха!</h2>
              <p className="mt-1 text-lg">
                За день зібрано{" "}
                <strong className="tabular-nums">
                  {total} з {G.MAX_DIAMONDS}
                </strong>{" "}
                віх.
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">
            Модуль 1 пройдено. Далі — принципи, на яких тримається управління проєктами.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={nextHref} className={primary}>
              До модуля 2
            </Link>
            <button type="button" onClick={start} className={chip(false)}>
              Зіграти ще раз
            </button>
          </div>

          <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4">
            <label htmlFor="own-project" className="font-medium">
              Бонус, якщо є сили: опиши свій проєкт у кількох реченнях
            </label>
            <p className="mt-1 text-sm text-muted">
              Що створюєш і для кого. Текст лишиться в цьому браузері, а коли з&apos;явиться кабінет, автор
              зможе його прокоментувати.
            </p>
            <textarea
              id="own-project"
              rows={4}
              maxLength={1000}
              defaultValue={saved?.project ?? ""}
              onChange={(e) => write({ ...(parse(readRaw()) ?? { best: total }), project: e.target.value })}
              className="mt-3 w-full rounded-[4px] bg-background p-3 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
