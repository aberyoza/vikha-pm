"use client";

import { useState, type PointerEvent } from "react";
import { ProjectBonus } from "@/components/my-project/project-bonus";
import * as G from "@/content/assignments/module-01";
import { AssignmentGame, BasketLevel, chip, Feedback, primary, shuffled } from "./game-kit";

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

const CHAIN = G.CHAIN.map((c) => ({ ...c, bin: c.step }));

type Orders = { sort: number[]; chain: number[]; speakers: number[]; roles: number[] };

// Module 1 game: four levels, then the start of the reader's own project.
export function FirstDayGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-01"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        sort: shuffled(G.SORT.length),
        chain: shuffled(G.CHAIN.length),
        speakers: shuffled(G.SPEAKERS.length),
        roles: shuffled(G.ROLES.length),
      })}
      levels={[
        { name: "Проєкт чи ні?", play: (o, done) => <SortLevel order={o.sort} onDone={done} /> },
        {
          name: "Ланцюжок цінності",
          play: (o, done) => (
            <BasketLevel
              items={CHAIN}
              bins={G.STEPS}
              order={o.chain}
              allRight="Результат — що створили, наслідок — що змінилося, вигода — яка з цього користь."
              onDone={done}
            />
          ),
        },
        { name: "Хто є хто", play: (o, done) => <RolesLevel speakers={o.speakers} roles={o.roles} onDone={done} /> },
        { name: "Два начальники", play: (_, done) => <BossLevel onDone={done} /> },
      ]}
      startLabel="Почати день"
      period="За день"
      finalTitle="Перша віха!"
      finalText="Модуль 1 пройдено. Далі — принципи, на яких тримається управління проєктами."
      nextHref={nextHref}
      nextLabel="До модуля 2"
    >
      <ProjectBonus />
    </AssignmentGame>
  );
}
