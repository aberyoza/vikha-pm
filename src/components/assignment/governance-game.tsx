"use client";

import { useState } from "react";
import { RulesBonus } from "@/components/my-project/project-rules";
import * as G from "@/content/assignments/module-06";
import { AssignmentGame, chip, Feedback, HowTo, primary, shuffled } from "./game-kit";

type Orders = { requests: number[]; path: number[]; asks: number[] };

const stampName = (k: G.Stamp) => G.STAMPS.find((s) => s.key === k)!.name;

function Thresholds() {
  return (
    <p className="mt-4 rounded-[4px] border border-dashed border-foreground/25 px-3 py-2 text-sm leading-relaxed">
      <strong>Пороги студії.</strong> {G.THRESHOLD}
    </p>
  );
}

// The stamp itself: a rotated frame that lands on the document.
function StampMark({ name, ok }: { name: string; ok: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute right-3 bottom-3 -rotate-6 animate-stamp rounded-[4px] border-[3px] px-2.5 py-1 font-display text-sm font-bold uppercase tracking-wide ${
        ok ? "border-accent text-accent" : "border-foreground/50 text-muted line-through"
      }`}
    >
      {name}
    </span>
  );
}

// Level 1: stamp each request with who approves it.
function StampLevel({ order, onDone }: { order: number[]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<G.Stamp | null>(null);
  const [score, setScore] = useState(0);
  const r = G.REQUESTS[order[i]];
  const last = i === G.REQUESTS.length - 1;

  const stamp = (k: G.Stamp) => {
    if (pick) return;
    setPick(k);
    if (k === r.stamp) setScore((v) => v + 1);
  };

  return (
    <div>
      <HowTo
        goal="на кожен запит поставити печатку того, хто має право його погодити."
        steps={[
          "На стіл приходить запит. Прочитайте, хто і що просить.",
          "Під запитом — чотири печатки. Під назвою кожної сказано, що вирішує ця роль.",
          "Натисніть на печатку, і вона ляже на запит. Одразу з'явиться пояснення, чи правильно.",
          "Натисніть «Наступний запит».",
        ]}
        tip="Підказка: коли йдеться про дні чи гроші, звірте їх із порогами нижче. Що понад пороги, йде нагору."
      />
      <Thresholds />

      <p className="mt-5 text-sm text-muted tabular-nums">
        Запит {i + 1} з {G.REQUESTS.length}
      </p>
      <div key={i} className="relative mt-2 min-h-36 animate-drum rounded-[6px] bg-surface-raised p-5 pb-14 shadow-sm">
        <p className="text-[13px] text-muted">Запит · {r.from}</p>
        <p className="mt-1 font-display text-xl font-semibold leading-snug">{r.text}</p>
        {pick && <StampMark name={stampName(pick)} ok={pick === r.stamp} />}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Печатки">
        {G.STAMPS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => stamp(s.key)}
            disabled={!!pick}
            aria-pressed={pick === s.key}
            className={`flex flex-col gap-1 rounded-[6px] border-2 border-dashed p-3 text-left leading-snug press ${
              pick !== null && s.key === r.stamp
                ? "border-accent bg-accent-soft"
                : "border-foreground/20 bg-background hover:border-accent/60 disabled:opacity-60"
            }`}
          >
            <span className="font-medium">{s.name}</span>
            <span className="text-[13px] text-muted">{s.note}</span>
          </button>
        ))}
      </div>

      {pick && (
        <div className="mt-5 space-y-4">
          <Feedback ok={pick === r.stamp}>
            {pick === r.stamp ? "" : `Тут печатка «${stampName(r.stamp)}». `}
            {r.why}
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
            {last ? "До наступного рівня" : "Наступний запит"}
          </button>
        </div>
      )}
    </div>
  );
}

// Level 2: build the path of one change from shuffled cards.
function PathLevel({ order, onDone }: { order: number[]; onDone: (score: number) => void }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [miss, setMiss] = useState<number | null>(null);
  const [decider, setDecider] = useState<G.Stamp | null>(null);
  const steps = G.PATH.filter((p) => p.order !== undefined).length;
  const nextOrder = placed.length;
  // After «Ухвалити рішення» lands, the player says who decides.
  const asking = placed.some((k) => G.PATH[k].order === 2) && decider === null;
  const done = placed.length === steps;
  const score = Math.max(0, 5 - mistakes);

  const pick = (k: number) => {
    if (asking || done || placed.includes(k)) return;
    if (G.PATH[k].order === nextOrder) {
      setPlaced((p) => [...p, k]);
      setMiss(null);
    } else {
      setMiss(k);
      setMistakes((m) => m + 1);
    }
  };
  const decide = (s: G.Stamp) => {
    setDecider(s);
    if (s !== G.DECIDER) setMistakes((m) => m + 1);
  };

  return (
    <div>
      <HowTo
        goal="провести зміну через правильний шлях: від запиту до виконання, без жодного кроку повз."
        steps={[
          "Угорі — запит дизайнера. Нижче — сім перемішаних карток-кроків.",
          "Натискайте картки в тому порядку, у якому зміна має пройти шлях. Правильна картка стає в ланцюжок.",
          "Дві картки — пастки, яких у шляху бути не повинно. Неправильна картка підсвітиться, і з'явиться пояснення.",
          "Коли дійдете до рішення, оберіть, хто його ухвалює.",
        ]}
        tip="Підказка: нічого не роблять і не змінюють у планах, поки зміну не оцінили й не погодили. Кожна помилка мінус одна віха."
      />

      <div className="mt-5 rounded-[6px] bg-surface-raised px-4 py-3 font-display text-lg font-semibold leading-snug">
        {G.CHANGE}
      </div>

      <p className="mt-5 font-medium">Шлях зміни</p>
      <ol className="mt-2 space-y-1.5">
        {Array.from({ length: steps }, (_, n) => {
          const k = placed[n];
          const p = k === undefined ? null : G.PATH[k];
          return (
            <li
              key={n}
              className={`flex gap-3 rounded-[4px] px-3 py-2 ${p ? "animate-drum bg-accent-soft" : "border border-dashed border-foreground/20"}`}
            >
              <span className="font-display font-semibold text-accent tabular-nums">{n + 1}</span>
              {p ? (
                <span className="leading-snug">
                  <span className="font-medium">{p.text}.</span> <span className="text-muted">{p.why}</span>
                  {p.order === 1 && (
                    <span className="mt-2 grid gap-1 sm:grid-cols-2">
                      {G.IMPACT.map((x) => (
                        <span key={x} className="rounded-[3px] bg-background px-2 py-1 text-sm">
                          {x}
                        </span>
                      ))}
                    </span>
                  )}
                  {p.order === 2 && decider && (
                    <span className="mt-1 block text-sm">
                      {decider === G.DECIDER ? "✓ " : `✗ Не ${stampName(decider).toLowerCase()}. `}
                      {G.DECIDER_WHY}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-muted">…</span>
              )}
            </li>
          );
        })}
      </ol>

      {asking && (
        <div className="mt-5">
          <p className="font-medium">Хто ухвалює це рішення?</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Хто вирішує">
            {G.STAMPS.map((s) => (
              <button key={s.key} type="button" onClick={() => decide(s.key)} className={chip(false)}>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {!done && !asking && (
        <>
          <p className="mt-5 font-medium">Наступний крок</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {order
              .filter((k) => !placed.includes(k))
              .map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => pick(k)}
                  className={`rounded-[6px] px-4 py-3 text-left leading-snug press ${
                    miss === k ? "bg-foreground/[0.14] line-through decoration-2" : "bg-background hover:bg-foreground/[0.08]"
                  }`}
                >
                  {G.PATH[k].text}
                </button>
              ))}
          </div>
          {miss !== null && (
            <p className="mt-3 rounded-[4px] bg-accent-soft p-3 leading-relaxed" aria-live="polite">
              {G.PATH[miss].order === undefined
                ? `«${G.PATH[miss].text}» — пастка. ${G.PATH[miss].why}`
                : `«${G.PATH[miss].text}» — правильний крок, але не зараз. Спершу те, що має бути раніше.`}
            </p>
          )}
          <p className="mt-2 text-sm text-muted">Помилок: {mistakes}</p>
        </>
      )}

      {done && (
        <div className="mt-5 space-y-4">
          <Feedback ok={mistakes === 0} title={mistakes === 0 ? "Шлях пройдено без помилок!" : `Шлях пройдено, помилок: ${mistakes}.`}>
            Кожну зміну, навіть відхилену, записують у журнал змін. Через місяць не доведеться згадувати, чому вирішили
            саме так.
          </Feedback>
          <button type="button" onClick={() => onDone(score)} className={primary}>
            До наступного рівня
          </button>
        </div>
      )}
    </div>
  );
}

const lightClass: Record<G.Light, string> = {
  green: "bg-[#2e7d4d] text-white",
  yellow: "bg-[#e3b341] text-[#2a2208]",
  red: "bg-[#bf4a37] text-white",
};
const lightName = (l: G.Light) => G.LIGHTS.find((x) => x.key === l)!.name;
const CYCLE: G.Light[] = ["green", "yellow", "red"];

// Level 3: colour the one-page status report by the rules, then say what the
// sponsor has to decide.
function ReportLevel({ asks, onDone }: { asks: number[]; onDone: (score: number) => void }) {
  const [lights, setLights] = useState<(G.Light | null)[]>(G.ROWS.map(() => null));
  const [ask, setAsk] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const right = G.ROWS.filter((r, k) => lights[k] === r.light).length;
  const askOk = ask !== null && !!G.ASKS[ask].right;
  const ready = lights.every((l) => l !== null) && ask !== null;

  const cycle = (k: number) =>
    !checked &&
    setLights((l) => l.map((v, j) => (j === k ? CYCLE[(v === null ? -1 : CYCLE.indexOf(v)) + 1] ?? CYCLE[0] : v)));

  return (
    <div>
      <HowTo
        goal="заповнити звіт про стан за правилами кольорів, щоб спонсор за хвилину зрозумів, де потрібне його рішення."
        steps={[
          "У звіті п'ять рядків, у кожному — один факт про проєкт.",
          "Натискайте на кольорову кнопку в рядку, щоб перемикати колір: зелений → жовтий → червоний.",
          "Нижче оберіть, яке рішення потрібне від спонсора.",
          "Натисніть «Надіслати звіт».",
        ]}
        tip="Підказка: колір ставлять не за відчуттям, а за правилом. Звірте кожен факт із порогами."
      />
      <Thresholds />

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {G.LIGHTS.map((l) => (
          <li key={l.key} className="flex items-center gap-1.5">
            <span aria-hidden className={`block size-3 rounded-full ${lightClass[l.key]}`} />
            <strong>{l.name}:</strong> {l.rule}
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-[6px] bg-background p-4">
        <p className="font-display text-lg font-semibold">Звіт про стан · гра про котів</p>
        <ul className="mt-3 divide-y divide-foreground/10">
          {G.ROWS.map((r, k) => {
            const l = lights[k];
            return (
              <li key={r.area} className="flex items-start gap-3 py-2.5">
                <button
                  type="button"
                  onClick={() => cycle(k)}
                  disabled={checked}
                  aria-label={`${r.area}: ${l ? lightName(l) : "колір не обрано"}. Натисніть, щоб змінити`}
                  className={`mt-0.5 grid h-8 w-20 shrink-0 place-items-center rounded-full text-[12px] font-semibold press ${
                    l ? lightClass[l] : "border border-dashed border-foreground/30 text-muted"
                  }`}
                >
                  {l ? lightName(l) : "колір?"}
                </button>
                <span className="leading-snug">
                  <strong>{r.area}.</strong> {r.fact}
                  {checked && (
                    <span className={`mt-1 block text-sm ${l === r.light ? "text-muted" : ""}`}>
                      {l === r.light ? "✓" : `✗ Має бути ${lightName(r.light).toLowerCase()}.`} {r.why}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 font-medium">Яке рішення потрібне від спонсора?</p>
        <div className="mt-2 grid gap-1.5" role="group" aria-label="Рішення спонсора">
          {asks.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => !checked && setAsk(k)}
              disabled={checked}
              aria-pressed={ask === k}
              className={`rounded-[4px] border px-3 py-2 text-left text-sm leading-snug press ${
                ask === k ? "border-accent bg-accent-soft" : "border-transparent bg-foreground/[0.05] hover:bg-foreground/[0.09]"
              }`}
            >
              {G.ASKS[k].text}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {!checked ? (
          <button type="button" onClick={() => setChecked(true)} disabled={!ready} className={primary}>
            Надіслати звіт
          </button>
        ) : (
          <>
            <Feedback ok={right === G.ROWS.length && askOk} title={`Кольори: ${right} з ${G.ROWS.length}. Рішення: ${askOk ? "так" : "ні"}.`}>
              {ask !== null && G.ASKS[ask].why}
            </Feedback>
            <div className="rounded-[6px] bg-foreground/[0.05] p-4">
              <p className="font-medium">А це звіт колеги, який ставить кольори на око</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {G.ROWS.map((r) => (
                  <li key={r.area} className={`rounded-full px-3 py-1 text-[13px] font-semibold ${lightClass[r.rainbow]}`}>
                    {r.area}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Бюджет у нього зелений, а затримка на 3 дні — червона. Спонсор бачить веселку, біжить рятувати строки і
                пропускає єдине рішення, яке справді чекає на нього.
              </p>
            </div>
            <button type="button" onClick={() => onDone(right + (askOk ? 1 : 0))} className={primary}>
              До наступного рівня
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Level 4: put the knob on the scale from fast to deep for each situation.
function ScaleLevel({ onDone }: { onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [pos, setPos] = useState(1);
  const [chosen, setChosen] = useState<G.Strategy | null>(null);
  const [score, setScore] = useState(0);
  const s = G.SITUATIONS[i];
  const st = G.STRATEGIES[pos];
  const last = i === G.SITUATIONS.length - 1;
  const n = G.STRATEGIES.length;
  const rightName = G.STRATEGIES.find((x) => x.key === s.right)!.name;

  const choose = () => {
    setChosen(st.key);
    if (st.key === s.right) setScore((v) => v + 1);
  };

  return (
    <div>
      <HowTo
        goal="для кожної ситуації обрати стратегію, з якою зміна приживеться серед людей."
        steps={[
          "Прочитайте ситуацію: скільки є часу і наскільки важливо, щоб люди погодилися щиро.",
          "Пересуньте повзунок на шкалі: зліва швидкі стратегії, справа глибокі. Під шкалою видно, скільки часу займе зміна і наскільки опиратимуться люди.",
          "Натисніть «Обрати стратегію». З'явиться пояснення, і можна йти до наступної ситуації.",
        ]}
        tip="Підказка: кожна з чотирьох стратегій підходить рівно до однієї ситуації."
      />

      <p className="mt-5 text-sm text-muted tabular-nums">
        Ситуація {i + 1} з {G.SITUATIONS.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-5 font-display text-xl font-semibold leading-snug">{s.text}</div>

      <div className="mt-6">
        <div className="flex justify-between text-[13px] text-muted">
          <span>Швидко, але з опором</span>
          <span>Довго, зате надійно</span>
        </div>
        <div className="relative mt-3 h-12">
          <div className="absolute top-1/2 right-[12.5%] left-[12.5%] h-1.5 -translate-y-1/2 rounded-full bg-foreground/15" />
          <span
            aria-hidden
            className="absolute top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[4px] bg-accent shadow transition-[left] duration-300 ease-[var(--ease-out)]"
            style={{ left: `${((pos + 0.5) / n) * 100}%` }}
          />
          <div className="absolute inset-0 grid grid-cols-4" role="radiogroup" aria-label="Стратегія">
            {G.STRATEGIES.map((x, k) => (
              <button
                key={x.key}
                type="button"
                role="radio"
                aria-checked={pos === k}
                aria-label={x.name}
                onClick={() => !chosen && setPos(k)}
                disabled={!!chosen}
                className="h-full"
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 text-center text-[13px] leading-tight">
          {G.STRATEGIES.map((x, k) => (
            <span key={x.key} className={pos === k ? "font-semibold" : "text-muted"}>
              {x.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-[6px] bg-background p-4">
        <p className="font-display text-lg font-semibold">{st.name}</p>
        <p className="mt-0.5 text-sm text-muted">{st.note}</p>
        <div className="mt-3 grid grid-cols-2 gap-4 text-[13px]">
          <div>
            <div className="flex justify-between">
              <span className="text-muted">Час</span>
              <span>{st.time}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-foreground/15">
              <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${100 - st.speed}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span className="text-muted">Опір людей</span>
              <span>{st.resistance}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-foreground/15">
              <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${100 - st.calm}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {!chosen ? (
          <button type="button" onClick={choose} className={primary}>
            Обрати стратегію
          </button>
        ) : (
          <>
            <Feedback ok={chosen === s.right}>
              {chosen === s.right ? "" : `Тут краще «${rightName}». `}
              {s.why}
            </Feedback>
            <button
              type="button"
              onClick={() => {
                if (last) return onDone(score);
                setI(i + 1);
                setPos(1);
                setChosen(null);
              }}
              className={primary}
            >
              {last ? "Завершити" : "Наступна ситуація"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Module 6 game: governance of the cat puzzle a month before release.
export function GovernanceGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-06"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        requests: shuffled(G.REQUESTS.length),
        path: shuffled(G.PATH.length),
        asks: shuffled(G.ASKS.length),
      })}
      levels={[
        { name: "Печатки", play: (o, done) => <StampLevel order={o.requests} onDone={done} /> },
        { name: "Шлях зміни", play: (o, done) => <PathLevel order={o.path} onDone={done} /> },
        { name: "Світлофор", play: (o, done) => <ReportLevel asks={o.asks} onDone={done} /> },
        { name: "Як провести зміну", play: (_, done) => <ScaleLevel onDone={done} /> },
      ]}
      startLabel="Почати"
      period="За гру"
      finalTitle="Шоста віха!"
      finalText="Модуль 6 пройдено. Далі — зміст проєкту: що саме робимо і чого не робимо."
      nextHref={nextHref}
      nextLabel="До модуля 7"
    >
      <RulesBonus />
    </AssignmentGame>
  );
}
