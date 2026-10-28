"use client";

import { useState } from "react";
import { ApproachBonus } from "@/components/my-project/project-approach";
import * as G from "@/content/assignments/module-03";
import { AssignmentGame, BasketLevel, CardLevel, chip, Feedback, primary, shuffled } from "./game-kit";

type Orders = { scenes: number[]; hand: number[]; actions: number[] };

// Level 2: the player is the sponsor at three phase gates.
function GateLevel({ onDone }: { onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<G.GateMove | null>(null);
  const [score, setScore] = useState(0);
  const g = G.GATES[i];
  const last = i === G.GATES.length - 1;
  const right = G.GATE_MOVES.find((m) => m.key === g.answer)!.name;

  const choose = (m: G.GateMove) => {
    if (pick) return;
    setPick(m);
    if (m === g.answer) setScore((v) => v + 1);
  };

  return (
    <div>
      <p className="text-muted">
        Ти спонсор. Гра проходить фази, а після кожної фази ти вирішуєш: іти далі, змінити курс чи зупинити. Дивись
        на факти з фази.
      </p>

      <p className="mt-5 text-sm text-muted tabular-nums">
        Контрольна точка {i + 1} з {G.GATES.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-5">
        <p className="text-[13px] text-muted">{g.phase}</p>
        <p className="mt-1 font-display text-xl font-semibold leading-snug sm:text-2xl">{g.facts}</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2" role="group" aria-label="Рішення спонсора">
        {G.GATE_MOVES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => choose(m.key)}
            disabled={!!pick}
            aria-pressed={pick === m.key}
            className={`${chip(pick !== null && m.key === g.answer)} py-3 ${
              pick === m.key && m.key !== g.answer ? "line-through" : ""
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {pick && (
        <div className="mt-5 space-y-4">
          <Feedback ok={pick === g.answer}>
            {pick === g.answer ? "" : `Тут краще: «${right}». `}
            {g.why}
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
            {last ? "До наступного рівня" : "До наступної точки"}
          </button>
        </div>
      )}
    </div>
  );
}

// Level 4: set each dial light or formal for two very different clients.
function TailorLevel({ onDone }: { onDone: (score: number) => void }) {
  const [c, setC] = useState(0);
  const [dials, setDials] = useState<(boolean | null)[]>(G.DIALS.map(() => null));
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const client = G.CLIENTS[c];
  const last = c === G.CLIENTS.length - 1;
  const right = dials.filter((d) => d === client.formal).length;

  const check = () => {
    setChecked(true);
    setScore((v) => v + right);
  };

  return (
    <div>
      <p className="text-muted">
        Прийшли два замовники. Піджени управління під кожного: для кожного налаштування обери легкий або формальний
        варіант.
      </p>

      <p className="mt-5 text-sm text-muted tabular-nums">
        Замовник {c + 1} з {G.CLIENTS.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-5">
        <p className="font-display text-xl font-semibold">{client.who}</p>
        <p className="mt-1 leading-relaxed">{client.brief}</p>
      </div>

      <div className="mt-5 space-y-4">
        {G.DIALS.map((d, k) => (
          <div key={d.name}>
            <p className="font-medium">{d.name}</p>
            <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label={d.name}>
              {[false, true].map((formal) => {
                const on = dials[k] === formal;
                const wrong = checked && on && formal !== client.formal;
                return (
                  <button
                    key={String(formal)}
                    type="button"
                    disabled={checked}
                    aria-pressed={on}
                    onClick={() => setDials((prev) => prev.map((v, j) => (j === k ? formal : v)))}
                    className={`${chip(checked ? formal === client.formal : on)} text-left ${wrong ? "line-through" : ""}`}
                  >
                    <span className="block text-[12px] opacity-70">{formal ? "Формально" : "Легко"}</span>
                    {formal ? d.formal : d.light}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {!checked ? (
          <button type="button" onClick={check} disabled={dials.some((d) => d === null)} className={primary}>
            Перевірити
          </button>
        ) : (
          <>
            <Feedback ok={right === G.DIALS.length} title={`Влучно: ${right} з ${G.DIALS.length}.`}>
              {client.why}
            </Feedback>
            {last && <p className="leading-relaxed text-muted">{G.BOSS_LESSON}</p>}
            <button
              type="button"
              onClick={() => {
                if (last) return onDone(score);
                setC(c + 1);
                setDials(G.DIALS.map(() => null));
                setChecked(false);
              }}
              className={primary}
            >
              {last ? "Завершити" : "Наступний замовник"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Module 3 game: how to run a project, then the approach for the own project.
export function ApproachesGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-03"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        scenes: shuffled(G.SCENES.length),
        hand: shuffled(G.APPROACHES.length),
        actions: shuffled(G.ACTIONS.length),
      })}
      levels={[
        {
          name: "Хто як працює",
          play: (o, done) => (
            <CardLevel
              intro="Прочитай, як команда веде роботу, і обери підхід, який вона використовує. Під назвою кожного підходу коротко сказано, що це. Ітерація — короткий відрізок роботи, а інкремент — готова частина продукту після нього."
              itemLabel="Ситуація"
              cardsLabel="Підходи до розробки"
              items={G.SCENES}
              cards={G.APPROACHES}
              order={o.scenes}
              hand={o.hand}
              onDone={done}
            />
          ),
        },
        { name: "Контрольні точки", play: (_, done) => <GateLevel onDone={done} /> },
        {
          name: "П'ять скриньок",
          play: (o, done) => (
            <BasketLevel
              intro="Розклади дії студії по п'яти фокусних областях. Обери картку, потім скриньку, куди вона лягає. Картку зі скриньки можна забрати назад."
              items={G.ACTIONS}
              bins={G.AREAS}
              order={o.actions}
              allRight="В адаптивному підході всі п'ять скриньок повторюються в кожному спринті: планування, робота, контроль на щоденних зустрічах, демо і ретроспектива."
              onDone={done}
            />
          ),
        },
        { name: "Костюм на замовлення", play: (_, done) => <TailorLevel onDone={done} /> },
      ]}
      startLabel="Почати"
      period="Разом"
      finalTitle="Третя віха!"
      finalText="Модуль 3 пройдено. Далі — як порахувати, чи вигідно братися за проєкт."
      nextHref={nextHref}
      nextLabel="До модуля 4"
    >
      <ApproachBonus />
    </AssignmentGame>
  );
}
