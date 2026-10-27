"use client";

import { useState } from "react";
import * as G from "@/content/assignments/module-02";
import { AssignmentGame, BasketLevel, Feedback, primary, shuffled } from "./game-kit";

type Orders = { situations: number[]; hand: number[]; tiles: number[][]; sustain: number[]; boss: number[][] };

// Level 1: play the principle card that helps in the situation.
function CardLevel({ order, hand, onDone }: { order: number[]; hand: number[]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<G.Principle | null>(null);
  const [score, setScore] = useState(0);
  const s = G.SITUATIONS[order[i]];
  const last = i === G.SITUATIONS.length - 1;

  const play = (p: G.Principle) => {
    if (pick) return;
    setPick(p);
    if (p === s.card) setScore((v) => v + 1);
  };

  return (
    <div>
      <p className="text-muted">
        Прочитай ситуацію і зіграй карту-принцип, який підкаже, як тут вчинити. Під назвою кожної карти коротко
        сказано, про що вона.
      </p>

      <p className="mt-5 text-sm text-muted tabular-nums">
        Ситуація {i + 1} з {G.SITUATIONS.length}
      </p>
      <div className="mt-2 flex min-h-32 items-center justify-center rounded-[6px] bg-surface-raised p-6 text-center font-display text-xl font-semibold leading-snug sm:text-2xl">
        {s.text}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Карти-принципи">
        {hand.map((k) => G.PRINCIPLES[k]).map((p) => {
          const right = pick !== null && p === s.card;
          const wrong = pick === p && p !== s.card;
          return (
            <button
              key={p}
              type="button"
              onClick={() => play(p)}
              disabled={!!pick}
              aria-pressed={pick === p}
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
                {p}
              </span>
              <span className={`text-[13px] ${right ? "" : "text-muted"}`}>{G.PRINCIPLE_NOTES[p]}</span>
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
        Позначай кісточки, які впадуть від рішення, і штовхай першу.{" "}
        <span className="tabular-nums">
          {d + 1} з {G.DOMINOES.length}
        </span>
      </p>

      <div className="mt-5 rounded-[6px] bg-accent px-5 py-4 font-display text-xl font-semibold text-accent-foreground sm:text-2xl">
        {dec.decision}
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
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

function Meter({ label, value }: { label: string; value: number }) {
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
        { name: "Зіграй карту", play: (o, done) => <CardLevel order={o.situations} hand={o.hand} onDone={done} /> },
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
