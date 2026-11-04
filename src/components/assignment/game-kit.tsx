"use client";

import Link from "next/link";
import { createContext, useContext, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { MilestoneMark } from "@/components/logo";
import type { Card, Choice, Question } from "@/content/assignments/types";

// Shared pieces of the module games: buttons, feedback, the basket level and
// the frame with intro, level progress and the finish.

export const chip = (on: boolean) =>
  `rounded-md px-3 py-2 text-sm font-medium press ${
    on ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
  }`;
export const primary =
  "rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground press hover:brightness-110 disabled:opacity-40";

// Card order is shuffled on every play, so the answers can't be guessed from
// the position of a card.
export const shuffled = (n: number) => {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function Feedback({ ok, title, children }: { ok: boolean; title?: string; children: ReactNode }) {
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

// «Як грати»: the goal of a level, numbered steps and an optional tip, for
// levels whose mechanics aren't obvious at first sight.
export function HowTo({ goal, steps, tip }: { goal: string; steps: ReactNode[]; tip?: string }) {
  return (
    <div className="rounded-[6px] bg-foreground/[0.05] p-4 leading-relaxed">
      <p>
        <strong>Мета:</strong> {goal}
      </p>
      <p className="mt-3 font-medium">Як грати</p>
      <ol className="mt-1 list-decimal space-y-1.5 pl-5 marker:text-accent marker:font-semibold">
        {steps.map((s, k) => (
          <li key={k}>{s}</li>
        ))}
      </ol>
      {tip && <p className="mt-3 text-muted">{tip}</p>}
    </div>
  );
}

// The steps of every basket level; only the basket names differ.
export const basketSteps = (bins: string[]) => [
  "Угорі — картки. Натисни на картку, щоб її взяти: вона підсвітиться.",
  `Потім натисни на кошик, у який вона лягає: ${bins.map((b) => `«${b}»`).join(", ")}. Під назвою кошика підказка, що в нього кладуть.`,
  "Картку з кошика можна забрати назад: натисни на неї, і вона знову в руці.",
  "Коли всі картки розкладено, натисни «Перевірити». Неправильні можна переставити кнопкою «Переставити неправильні».",
];

// A labelled bar from 0 to 100%.
export function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[13px]">
        <span className="text-muted">{label}</span>
        <span className="tabular-nums">{value}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-foreground/15">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-[var(--ease-out)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// Progress lives in the browser until accounts exist.
type Saved = { best: number; completedAt?: string };

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const readRaw = (key: string) => {
  try {
    return localStorage.getItem(key);
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
const write = (key: string, s: Saved) => {
  try {
    localStorage.setItem(key, JSON.stringify(s));
  } catch {
    // Private mode or storage disabled: the game still works, it just forgets.
  }
};

// Read the situation, play the card that fits. Each card carries a short note,
// so the player doesn't have to go back to the lesson.
export function CardLevel({
  intro,
  itemLabel,
  cardsLabel,
  items,
  cards,
  order,
  hand,
  onDone,
}: {
  intro: ReactNode;
  itemLabel: string;
  cardsLabel: string;
  items: { text: string; card: string; why: string }[];
  cards: { name: string; note: string }[];
  order: number[];
  hand: number[];
  onDone: (score: number) => void;
}) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const s = items[order[i]];
  const last = i === items.length - 1;

  const play = (p: string) => {
    if (pick) return;
    setPick(p);
    if (p === s.card) setScore((v) => v + 1);
  };

  return (
    <div>
      {intro}

      <p className="mt-5 text-sm text-muted tabular-nums">
        {itemLabel} {i + 1} з {items.length}
      </p>
      <div className="mt-2 flex min-h-32 items-center justify-center rounded-[6px] bg-surface-raised p-6 text-center font-display text-xl font-semibold leading-snug sm:text-2xl">
        {s.text}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label={cardsLabel}>
        {hand.map((k) => cards[k]).map((c) => {
          const right = pick !== null && c.name === s.card;
          const wrong = pick === c.name && c.name !== s.card;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => play(c.name)}
              disabled={!!pick}
              aria-pressed={pick === c.name}
              className={`flex flex-col gap-1.5 rounded-[6px] p-3 text-left leading-snug press ${
                right
                  ? "bg-accent text-accent-foreground"
                  : wrong
                    ? "bg-foreground/[0.12]"
                    : "bg-background hover:bg-foreground/[0.08] disabled:opacity-60"
              }`}
            >
              <span className={`flex items-center gap-2 font-medium ${wrong ? "line-through decoration-2" : ""}`}>
                <span aria-hidden className="block size-2 shrink-0 rotate-45 rounded-[1px] bg-current opacity-50" />
                {c.name}
              </span>
              <span className={`text-[13px] ${right ? "" : "text-muted"}`}>{c.note}</span>
            </button>
          );
        })}
      </div>

      {pick && (
        <div className="mt-5 space-y-4">
          <Feedback ok={pick === s.card}>
            {pick === s.card ? "" : `Тут краще зіграти «${s.card}». `}
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
            {last ? "До наступного рівня" : "Далі"}
          </button>
        </div>
      )}
    </div>
  );
}

type Bin<K extends string> = { key: K; name: string; hint: string };

// Pick a card, then the basket it belongs to. Checked all at once; wrong cards
// can be moved again.
export function BasketLevel<K extends string>({
  intro,
  items,
  bins,
  columns = "sm:grid-cols-3",
  order,
  allRight,
  onDone,
}: {
  intro: ReactNode;
  items: { text: string; bin: K; why: string }[];
  bins: Bin<K>[];
  columns?: string;
  order: number[];
  allRight: string;
  onDone: (score: number) => void;
}) {
  const [place, setPlace] = useState<(K | null)[]>(items.map(() => null));
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const pool = order.map((k) => ({ ...items[k], k })).filter((c) => place[c.k] === null);
  const wrong = items.filter((c, k) => place[k] !== c.bin).length;

  const drop = (bin: K) => {
    if (sel === null || checked) return;
    setPlace((p) => p.map((v, k) => (k === sel ? bin : v)));
    setSel(null);
  };
  const lift = (k: number) => {
    if (checked) return;
    setPlace((p) => p.map((v, j) => (j === k ? null : v)));
    setSel(k);
  };
  const check = () => {
    setChecked(true);
    if (score === null) setScore(items.length - wrong);
  };
  const retry = () => {
    setPlace((p) => p.map((v, k) => (v === items[k].bin ? v : null)));
    setChecked(false);
  };

  return (
    <div>
      {intro}

      <div className="mt-5 flex min-h-12 flex-wrap gap-2">
        {pool.map((c) => (
          <button key={c.k} type="button" aria-pressed={sel === c.k} onClick={() => setSel(sel === c.k ? null : c.k)} className={chip(sel === c.k)}>
            {c.text}
          </button>
        ))}
        {pool.length === 0 && !checked && <span className="py-2 text-sm text-muted">Усі картки розкладено.</span>}
      </div>

      <div className={`mt-5 grid gap-2 ${columns}`}>
        {bins.map((s) => (
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
              {order.map((k) => [items[k], k] as const).map(([c, k]) =>
                place[k] === s.key ? (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => lift(k)}
                      className={`w-full rounded-[2px] px-2 py-1.5 text-left text-sm leading-snug ${
                        checked ? (c.bin === s.key ? "bg-surface-raised" : "bg-accent text-accent-foreground") : "bg-surface-raised hover:bg-foreground/[0.12]"
                      }`}
                    >
                      {checked && (c.bin === s.key ? "✓ " : "✗ ")}
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
          <button type="button" onClick={check} disabled={pool.length > 0} className={primary}>
            Перевірити
          </button>
        )}
        {checked && (
          <>
            <Feedback ok={wrong === 0} title={wrong === 0 ? "Усе на своїх місцях!" : `Не на місці: ${wrong}.`}>
              {wrong === 0
                ? allRight
                : items.filter((c, k) => place[k] !== c.bin).map((c) => `«${c.text}»: ${c.why}`).join(" ")}
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

export const optionClass = (on: boolean, off: boolean) =>
  `rounded-md px-3 py-2 text-left text-sm font-medium leading-snug press ${
    on ? "bg-accent text-accent-foreground" : `bg-foreground/[0.07] enabled:hover:bg-foreground/[0.12] ${off ? "opacity-60" : ""}`
  }`;

export const cardClass = (right: boolean, wrong: boolean) =>
  `flex flex-col gap-1 rounded-[6px] p-3 text-left leading-snug press ${
    right ? "bg-accent text-accent-foreground" : wrong ? "bg-foreground/[0.12]" : "bg-background enabled:hover:bg-foreground/[0.08] disabled:opacity-60"
  }`;

// A pile of cards, each answered with one of a few fixed choices. `above` draws
// whatever grows as cards get answered: a wheel, a skeleton.
export function Deck<K extends string>({
  label,
  question,
  items,
  order,
  choices,
  columns = "sm:grid-cols-2",
  doneLabel,
  above,
  onDone,
}: {
  label: string;
  question: string;
  items: Card<K>[];
  order: number[];
  choices: Choice<K>[];
  columns?: string;
  doneLabel: string;
  above?: (answered: Card<K>[]) => ReactNode;
  onDone: (score: number) => void;
}) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<K | null>(null);
  const [score, setScore] = useState(0);
  const item = items[order[i]];
  const last = i === items.length - 1;
  const answered = order.slice(0, pick === null ? i : i + 1).map((k) => items[k]);

  const choose = (k: K) => {
    setPick(k);
    if (k === item.answer) setScore((v) => v + 1);
  };

  return (
    <div className="mt-5">
      {above?.(answered)}
      <p className={`text-sm text-muted tabular-nums ${above ? "mt-4" : ""}`}>
        {label} {i + 1} з {items.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-4 leading-relaxed sm:p-5">{item.text}</div>
      <p className="mt-4 font-medium">{question}</p>
      <div className={`mt-2 grid gap-2 ${columns}`} role="group" aria-label={question}>
        {choices.map((c) => {
          const right = pick !== null && c.key === item.answer;
          const wrong = pick === c.key && c.key !== item.answer;
          return (
            <button key={c.key} type="button" disabled={pick !== null} aria-pressed={pick === c.key} onClick={() => choose(c.key)} className={cardClass(right, wrong)}>
              <span className={`font-medium ${wrong ? "line-through decoration-2" : ""}`}>{c.name}</span>
              {c.note && <span className={`text-[13px] ${right ? "" : "text-muted"}`}>{c.note}</span>}
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <div className="mt-4 space-y-4">
          <Feedback ok={pick === item.answer}>
            {pick === item.answer ? "" : `Правильна відповідь: «${choices.find((c) => c.key === item.answer)!.name}». `}
            {item.why}
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
            {last ? doneLabel : "Далі"}
          </button>
        </div>
      )}
    </div>
  );
}

// A row of questions, each with its own answers. `above` draws what the question is about.
export function Questions({
  label,
  items,
  orders,
  doneLabel,
  above,
  onDone,
}: {
  label?: string;
  items: Question[];
  orders: number[][];
  doneLabel: string;
  above?: (i: number, answered: boolean) => ReactNode;
  onDone: (score: number) => void;
}) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const q = items[i];
  const last = i === items.length - 1;

  return (
    <div className="mt-5">
      {above?.(i, pick !== null)}
      {label && (
        <p className={`text-sm text-muted tabular-nums ${above ? "mt-4" : ""}`}>
          {label} {i + 1} з {items.length}
        </p>
      )}
      <p className="mt-2 font-medium leading-snug">{q.text}</p>
      <div className="mt-2 grid gap-1.5" role="group" aria-label="Варіанти відповіді">
        {orders[i].map((k) => (
          <button
            key={k}
            type="button"
            disabled={pick !== null}
            aria-pressed={pick === k}
            onClick={() => {
              setPick(k);
              if (q.options[k].right) setScore((v) => v + 1);
            }}
            className={`${optionClass(pick !== null && !!q.options[k].right, pick !== null)} ${pick === k && !q.options[k].right ? "line-through decoration-2" : ""}`}
          >
            {q.options[k].text}
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className="mt-4 space-y-4">
          <Feedback ok={!!q.options[pick].right}>{q.options[pick].why}</Feedback>
          <button
            type="button"
            onClick={() => {
              if (last) return onDone(score);
              setI(i + 1);
              setPick(null);
            }}
            className={primary}
          >
            {last ? doneLabel : "Далі"}
          </button>
        </div>
      )}
    </div>
  );
}

// Neighbouring assignments, set once by the page so that every game gets them.
const NeighbourContext = createContext<{ prevHref?: string; nextHref?: string }>({});

export function AssignmentNeighbours({ prevHref, nextHref, children }: { prevHref?: string; nextHref?: string; children: ReactNode }) {
  return <NeighbourContext.Provider value={{ prevHref, nextHref }}>{children}</NeighbourContext.Provider>;
}

const navDisabled = "cursor-not-allowed rounded-md bg-foreground/[0.04] px-3 py-2 text-sm font-medium text-muted";

// A step through the game, or a link once the game has nothing left that way.
function NavStep({ label, onClick, href }: { label: string; onClick?: () => void; href?: string }) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={chip(false)}>
        {label}
      </button>
    );
  }
  if (href) {
    return (
      <Link href={href} className={chip(false)}>
        {label}
      </Link>
    );
  }
  return (
    <button type="button" disabled className={navDisabled}>
      {label}
    </button>
  );
}

type GameProps<O> = {
  storeKey: string;
  title: string;
  intro: string;
  levels: { name: string; play: (orders: O, onDone: (score: number) => void) => ReactNode }[];
  max: number;
  newOrders: () => O;
  startLabel: string;
  // «За день», «За тиждень»: how the finish counts the diamonds.
  period: string;
  finalTitle: string;
  finalText: string;
  nextHref: string;
  nextLabel: string;
  // Extra block under the finish, such as the own project bonus.
  children?: ReactNode;
};

// The frame of every module game: intro, levels and the finish with diamonds.
export function AssignmentGame<O>(p: GameProps<O>) {
  const saved = parse(useSyncExternalStore(subscribe, () => readRaw(p.storeKey), () => null));
  const neighbours = useContext(NeighbourContext);
  const frame = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"intro" | number | "final">("intro");
  const [scores, setScores] = useState<number[]>([]);
  // Shuffled in the start handler, not in render, so render stays pure.
  const [orders, setOrders] = useState<O | null>(null);
  // Restarting on the same level has to remount it too.
  const [run, setRun] = useState(0);
  const total = scores.reduce((a, b) => a + b, 0);
  const last = p.levels.length - 1;

  const finishLevel = (level: number) => (score: number) => {
    const next = [...scores];
    next[level] = score;
    setScores(next);
    if (level < last) return setPhase(level + 1);
    const sum = next.reduce((a, b) => a + b, 0);
    write(p.storeKey, { best: Math.max(sum, saved?.best ?? 0), completedAt: new Date().toISOString() });
    setPhase("final");
  };

  const start = () => {
    setOrders(p.newOrders());
    setScores([]);
    setRun((r) => r + 1);
    setPhase(0);
    frame.current?.scrollIntoView({ block: "start" });
  };
  const goTo = (next: number) => {
    setPhase(next);
    frame.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div ref={frame} className="scroll-mt-4 rounded-[6px] bg-surface p-5 sm:p-8">
      {typeof phase === "number" && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <ol className="flex gap-1.5" aria-label="Рівні">
            {p.levels.map((l, k) => (
              <li key={l.name} aria-current={k === phase ? "step" : undefined} title={l.name}>
                <span
                  className={`block size-3 rotate-45 rounded-[2px] ${
                    k < phase ? "bg-accent" : k === phase ? "bg-accent/40 ring-2 ring-accent" : "bg-foreground/15"
                  }`}
                />
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted">
            Рівень {phase + 1}: <span className="text-foreground">{p.levels[phase].name}</span>
          </p>
        </div>
      )}

      {phase === "intro" && (
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">{p.title}</h2>
          <p className="mt-3 max-w-[60ch] text-lg leading-relaxed">{p.intro}</p>
          <ol className="mt-5 grid gap-2 sm:grid-cols-2">
            {p.levels.map((l, k) => (
              <li key={l.name} className="flex items-center gap-3 rounded-[4px] bg-foreground/[0.05] px-3 py-2">
                <span className="font-display font-semibold text-accent tabular-nums">{k + 1}</span>
                {l.name}
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="button" onClick={start} className={primary}>
              {saved ? "Зіграти ще раз" : p.startLabel}
            </button>
            {saved && (
              <span className="text-sm text-muted">
                Твій рекорд: {Math.min(saved.best, p.max)} з {p.max} віх.
              </span>
            )}
          </div>
        </div>
      )}

      {typeof phase === "number" && orders && <div key={`${run}-${phase}`}>{p.levels[phase].play(orders, finishLevel(phase))}</div>}

      {phase === "final" && (
        <div>
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center">
              <MilestoneMark className="size-11" />
            </span>
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">{p.finalTitle}</h2>
              <p className="mt-1 text-lg">
                {p.period} зібрано{" "}
                <strong className="tabular-nums">
                  {total} з {p.max}
                </strong>{" "}
                віх.
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">{p.finalText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={p.nextHref} className={primary}>
              {p.nextLabel}
            </Link>
          </div>
          {p.children}
        </div>
      )}

      <nav className="mt-8 flex flex-wrap gap-2 border-t border-border pt-4 print:hidden" aria-label="Перехід між завданнями">
        <NavStep
          label="Попереднє завдання"
          onClick={phase === "final" ? () => goTo(last) : typeof phase === "number" && phase > 0 ? () => goTo(phase - 1) : undefined}
          href={neighbours.prevHref}
        />
        <NavStep
          label="Наступне завдання"
          onClick={phase === "intro" ? start : typeof phase === "number" && phase < last ? () => goTo(phase + 1) : undefined}
          href={neighbours.nextHref}
        />
        {phase !== "intro" && (
          <button type="button" onClick={start} className={chip(false)}>
            Почати заново
          </button>
        )}
      </nav>
    </div>
  );
}
