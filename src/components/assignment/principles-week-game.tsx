"use client";

import { useState } from "react";
import * as G from "@/content/assignments/module-02";
import { AssignmentGame, BasketLevel, CardLevel, Feedback, Meter, primary, shuffled } from "./game-kit";

const CARDS = G.PRINCIPLES.map((name) => ({ name, note: G.PRINCIPLE_NOTES[name] }));

type Orders = { situations: number[]; hand: number[]; tiles: number[][]; sustain: number[]; boss: number[][] };

// Level 2: mark what a decision knocks over, then push the first domino.
function DominoLevel({ tiles, onDone }: { tiles: number[][]; onDone: (score: number) => void }) {
  const [d, setD] = useState(0);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [pushed, setPushed] = useState(false);
  const [score, setScore] = useState(0);
  const dec = G.DOMINOES[d];
  const order = tiles[d];
  const last = d === G.DOMINOES.length - 1;

  const right = dec.tiles.filter((t, k) => t.falls && picked.has(k)).length;
  const extra = dec.tiles.filter((t, k) => !t.falls && picked.has(k)).length;
  const total = dec.tiles.filter((t) => t.falls).length;

  const toggle = (k: number) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  const push = () => {
    setPushed(true);
    setScore((v) => v + Math.max(0, right - extra));
  };
  const next = () => {
    if (last) return onDone(score);
    setD(d + 1);
    setPicked(new Set());
    setPushed(false);
  };

  // Falling tiles tip over one after another, in the order shown.
  let n = 0;

  return (
    <div>
      <p className="text-muted">
        Студія ухвалює рішення. Як перша кісточка доміно, воно зачіпає інші частини проєкту. Познач усе, що
        зміниться через це рішення, і натисни «Штовхнути». Те, чого рішення не зачіпає, не позначай: за зайві
        кісточки віхи знімаються.
      </p>

      <p className="mt-5 text-sm text-muted tabular-nums">
        Рішення {d + 1} з {G.DOMINOES.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-accent px-5 py-4 font-display text-xl font-semibold text-accent-foreground sm:text-2xl">
        {dec.decision}
      </div>

      <p className="mt-4 font-medium">Що зміниться через це рішення?</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {order.map((k) => {
          const t = dec.tiles[k];
          const on = picked.has(k);
          const falls = pushed && t.falls && on;
          const delay = falls ? n++ * 110 : 0;
          return (
            <li key={k}>
              <button
                type="button"
                onClick={() => toggle(k)}
                disabled={pushed}
                aria-pressed={on}
                style={{ transitionDelay: `${delay}ms` }}
                className={`flex w-full items-start gap-2 rounded-[4px] px-3 py-2.5 text-left text-[15px] leading-snug transition-[translate,rotate,background-color,color] duration-300 ease-[var(--ease-out)] ${
                  falls
                    ? "translate-y-1 -rotate-2 bg-accent text-accent-foreground"
                    : pushed && t.falls
                      ? "bg-background outline-2 outline-dashed outline-accent"
                      : pushed && on
                        ? "bg-foreground/[0.12] line-through"
                        : on
                          ? "bg-accent-soft"
                          : "bg-background hover:bg-foreground/[0.08]"
                }`}
              >
                <span aria-hidden className="mt-0.5 w-4 shrink-0 text-center font-semibold">
                  {pushed ? (t.falls ? (on ? "✓" : "!") : on ? "✗" : "") : on ? "●" : "○"}
                </span>
                {t.text}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 space-y-4">
        {!pushed ? (
          <button type="button" onClick={push} disabled={picked.size === 0} className={primary}>
            Штовхнути
          </button>
        ) : (
          <>
            <Feedback ok={right === total && extra === 0} title={`Впало ${right} з ${total}.`}>
              {dec.why}
              {right < total && " Пунктиром — кісточки, які впали б, але їх не позначено."}
              {extra > 0 && " Перекреслені не впали б: їх рішення не зачіпає."}
            </Feedback>
            <button type="button" onClick={next} className={primary}>
              {last ? "До наступного рівня" : "Наступне рішення"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const clamp = (v: number) => Math.min(100, Math.max(0, v));

// Level 4: a bad news evening. Two scenes, two trust meters.
function BossLevel({ order, onDone }: { order: number[][]; onDone: (score: number) => void }) {
  const [scene, setScene] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [trust, setTrust] = useState({ team: 50, sponsor: 50 });
  const [score, setScore] = useState(0);
  const s = G.BOSS[scene];
  const last = scene === G.BOSS.length - 1;
  const m = pick === null ? null : s.moves[pick];

  const choose = (k: number) => {
    if (pick !== null) return;
    const mv = s.moves[k];
    setPick(k);
    setTrust((t) => ({ team: clamp(t.team + mv.team), sponsor: clamp(t.sponsor + mv.sponsor) }));
    if (mv.best) setScore((v) => v + 1);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Meter label="Довіра команди" value={trust.team} />
        <Meter label="Довіра спонсора" value={trust.sponsor} />
      </div>

      <div className="mt-6 flex items-start gap-3">
        <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-raised font-display text-xl font-semibold">
          {s.who[0]}
        </span>
        <div className="rounded-[6px] bg-surface-raised px-4 py-3">
          <p className="text-[13px] text-muted">{s.who}</p>
          <p className="mt-1 font-display text-xl font-semibold leading-snug">{s.line}</p>
        </div>
      </div>

      <p className="mt-6 text-muted">Що відповіси?</p>
      <div className="mt-2 grid gap-2">
        {order[scene].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => choose(k)}
            disabled={pick !== null}
            aria-pressed={pick === k}
            className={`rounded-[4px] border px-4 py-3 text-left press ${
              pick === k ? "border-accent bg-accent-soft" : "border-transparent bg-foreground/[0.05] hover:bg-foreground/[0.09] disabled:opacity-60"
            }`}
          >
            {s.moves[k].move}
          </button>
        ))}
      </div>

      {m && (
        <div className="mt-5 space-y-4">
          <Feedback ok={!!m.best} title={m.best ? "Сильний хід" : "Хм."}>
            {m.outcome}
          </Feedback>
          {last && <p className="leading-relaxed text-muted">{G.BOSS_LESSON}</p>}
          <button
            type="button"
            onClick={() => {
              if (last) return onDone(score);
              setScene(scene + 1);
              setPick(null);
            }}
            className={primary}
          >
            {last ? "Завершити тиждень" : "Далі"}
          </button>
        </div>
      )}
    </div>
  );
}

// Module 2 game: the six principles of PMBOK 8 in one bad week.
export function PrinciplesWeekGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-02"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        situations: shuffled(G.SITUATIONS.length),
        hand: shuffled(G.PRINCIPLES.length),
        tiles: G.DOMINOES.map((d) => shuffled(d.tiles.length)),
        sustain: shuffled(G.SUSTAIN.length),
        boss: G.BOSS.map((b) => shuffled(b.moves.length)),
      })}
      levels={[
        {
          name: "Зіграй карту",
          play: (o, done) => (
            <CardLevel
              intro="Прочитай ситуацію і зіграй карту-принцип, який підкаже, як тут вчинити. Під назвою кожної карти коротко сказано, про що вона."
              itemLabel="Ситуація"
              cardsLabel="Карти-принципи"
              items={G.SITUATIONS}
              cards={CARDS}
              order={o.situations}
              hand={o.hand}
              onDone={done}
            />
          ),
        },
        { name: "Ефект доміно", play: (o, done) => <DominoLevel tiles={o.tiles} onDone={done} /> },
        {
          name: "Три стовпи",
          play: (o, done) => (
            <BasketLevel
              items={G.SUSTAIN}
              bins={G.PILLARS}
              order={o.sustain}
              allRight="Сталий розвиток тримається на трьох стовпах: люди, довкілля й економіка, і не лише сьогодні, а й у довгу."
              onDone={done}
            />
          ),
        },
        { name: "Погана новина", play: (o, done) => <BossLevel order={o.boss} onDone={done} /> },
      ]}
      startLabel="Почати тиждень"
      period="За тиждень"
      finalTitle="Друга віха!"
      finalText="Модуль 2 пройдено. Далі — підходи до розробки і життєвий цикл проєкту."
      nextHref={nextHref}
      nextLabel="До модуля 3"
    />
  );
}
