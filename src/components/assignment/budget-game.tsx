"use client";

import { useId, useState } from "react";
import { Legend } from "@/components/lesson/s-curve";
import { BudgetBonus } from "@/components/my-project/project-budget";
import * as G from "@/content/assignments/module-09";
import { BUDGET, fmt, PV_CURVE, WEEKS } from "@/content/examples/game-finance";
import { AssignmentGame, chip, Feedback, HowTo, primary, shuffled } from "./game-kit";

type Orders = {
  methods: number[];
  cards: number[];
  ask: number[];
  reports: number[];
  actions: number[][];
  events: number[][];
};

const optionClass = (on: boolean, off: boolean) =>
  `rounded-md px-3 py-2 text-left text-sm font-medium leading-snug press ${
    on ? "bg-accent text-accent-foreground" : `bg-foreground/[0.07] enabled:hover:bg-foreground/[0.12] ${off ? "opacity-60" : ""}`
  }`;

const money = (v: number) => fmt(v, Number.isInteger(v) ? 0 : 1);

const pct = (v: number) => `${((v - G.SCALE.min) / (G.SCALE.max - G.SCALE.min)) * 100}%`;
const span = (a: number, b: number) => `${((b - a) / (G.SCALE.max - G.SCALE.min)) * 100}%`;

// The range on a scale of hryvnias: the earlier guide, the player's range and,
// after the answer, the guide for this meeting.
function RangeScale({ low, high, earlier, guide }: { low: number; high: number; earlier?: [number, number]; guide?: [number, number] }) {
  return (
    <div aria-hidden>
      <div className="relative h-14">
        <span className="absolute inset-x-0 top-5 h-4 rounded-full bg-foreground/[0.07]" />
        {earlier && <span className="absolute top-5 h-4 bg-foreground/15" style={{ left: pct(earlier[0]), width: span(earlier[0], earlier[1]) }} />}
        <span className="absolute top-5 h-4 rounded-[3px] bg-accent" style={{ left: pct(low), width: `max(4px, ${span(low, high)})` }} />
        {guide && <span className="absolute top-3.5 h-7 rounded-[3px] border-2 border-foreground" style={{ left: pct(guide[0]), width: span(guide[0], guide[1]) }} />}
        <span className="absolute top-2 h-9 w-px bg-foreground/60" style={{ left: pct(G.POINT) }} />
        <span className="absolute top-0 -translate-x-1/2 text-[12px] leading-none text-muted tabular-nums" style={{ left: pct(G.POINT) }}>
          {G.POINT}
        </span>
      </div>
      <div className="flex justify-between text-[12px] text-muted tabular-nums">
        <span>{G.SCALE.min} тис.</span>
        <span>{G.SCALE.max} тис.</span>
      </div>
    </div>
  );
}

// Level 1: pick the estimating method, and on two meetings name a range.
function RangeLevel({ methods, onDone }: { methods: number[]; onDone: (score: number) => void }) {
  const id = useId();
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<G.Method | null>(null);
  const [low, setLow] = useState(G.POINT);
  const [high, setHigh] = useState(G.POINT);
  const [said, setSaid] = useState(false);
  const [score, setScore] = useState(0);
  const m = G.MEETINGS[i];
  const last = i === G.MEETINGS.length - 1;
  const earlier = G.MEETINGS.slice(0, i).findLast((x) => x.range)?.range?.guide;
  const verdict = m.range ? G.judgeRange(m.range, low, high) : null;
  const finished = pick !== null && (!m.range || said);

  const choose = (k: G.Method) => {
    setPick(k);
    if (k === m.method) setScore((v) => v + 1);
  };
  const say = () => {
    setSaid(true);
    if (verdict === "ok") setScore((v) => v + 1);
  };
  const next = () => {
    if (last) return onDone(score);
    setI(i + 1);
    setPick(null);
    setSaid(false);
    setLow(G.POINT);
    setHigh(G.POINT);
  };

  return (
    <div>
      <HowTo
        goal="на кожній зустрічі оцінити вартість тим способом, який дозволяють дані, а засновникам назвати чесну вилку."
        steps={[
          "Прочитай, що студія вже знає. Вибери спосіб оцінки: на картці сказано, що він означає.",
          "На зустрічах «Ідея» і «WBS готова» засновники ще й питають суму. Вертикальна риска на шкалі — поточна оцінка, 300 тис. грн.",
          "Двома повзунками відсунь нижню і верхню межу вилки, потім натисни «Сказати засновникам».",
          "Рамка на шкалі покаже орієнтир PMBOK. Сіра смуга — вилка з попередньої зустрічі.",
        ]}
        tip="Підказка: на етапі ідеї реальна сума буває на чверть меншою або на три чверті більшою за оцінку. Перед стартом робіт, коли є WBS, — на 5% меншою або на 10% більшою."
      />

      <p className="mt-5 text-sm text-muted tabular-nums">
        Зустріч {i + 1} з {G.MEETINGS.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold">{m.stage}</h3>
        <p className="mt-1 leading-relaxed">{m.facts}</p>
      </div>

      <p className="mt-4 font-medium">Як рахуватимеш?</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2" role="group" aria-label="Спосіб оцінки">
        {methods.map((k) => G.METHODS[k]).map((c) => {
          const right = pick !== null && c.key === m.method;
          const wrong = pick === c.key && c.key !== m.method;
          return (
            <button
              key={c.key}
              type="button"
              disabled={pick !== null}
              aria-pressed={pick === c.key}
              onClick={() => choose(c.key)}
              className={`flex flex-col gap-1 rounded-[6px] p-3 text-left leading-snug press ${
                right ? "bg-accent text-accent-foreground" : wrong ? "bg-foreground/[0.12]" : "bg-background enabled:hover:bg-foreground/[0.08] disabled:opacity-60"
              }`}
            >
              <span className={`font-medium ${wrong ? "line-through decoration-2" : ""}`}>{c.name}</span>
              <span className={`text-[13px] ${right ? "" : "text-muted"}`}>{c.note}</span>
            </button>
          );
        })}
      </div>

      {pick && (
        <div className="mt-4">
          <Feedback ok={pick === m.method}>
            {pick === m.method ? "" : `Тут підходить спосіб «${G.METHODS.find((c) => c.key === m.method)!.name}». `}
            {m.why}
          </Feedback>
        </div>
      )}

      {pick && m.range && (
        <div className="mt-4 rounded-[6px] bg-background p-4">
          <p className="font-medium">Яку вилку назвеш засновникам?</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums" aria-live="polite">
            {low === high ? `Рівно ${low} тис. грн` : `${low}–${high} тис. грн`}
          </p>
          <div className="mt-2">
            <RangeScale low={low} high={high} earlier={earlier} guide={said ? m.range.guide : undefined} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-low`} className="text-sm text-muted">
                Нижня межа
              </label>
              <input
                id={`${id}-low`}
                type="range"
                min={G.SCALE.min}
                max={G.POINT}
                step={G.SCALE.step}
                value={low}
                disabled={said}
                onChange={(e) => setLow(Number(e.target.value))}
                className="mt-1 w-full accent-[var(--accent)]"
              />
            </div>
            <div>
              <label htmlFor={`${id}-high`} className="text-sm text-muted">
                Верхня межа
              </label>
              <input
                id={`${id}-high`}
                type="range"
                min={G.POINT}
                max={G.SCALE.max}
                step={G.SCALE.step}
                value={high}
                disabled={said}
                onChange={(e) => setHigh(Number(e.target.value))}
                className="mt-1 w-full accent-[var(--accent)]"
              />
            </div>
          </div>
          {!said && (
            <button type="button" onClick={say} className={`${primary} mt-4`}>
              Сказати засновникам
            </button>
          )}
        </div>
      )}

      {said && m.range && (
        <div className="mt-4">
          <Feedback ok={verdict === "ok"} title={verdict === "ok" ? undefined : verdict === "narrow" ? "Надто вузько." : "Надто широко."}>
            {verdict === "narrow" && "Така точність поки вигадана, і обіцянка зламається. "}
            {verdict === "wide" && "Із такою вилкою засновникам нема з чого вирішувати. "}
            {m.range.ok}
          </Feedback>
        </div>
      )}

      {finished && (
        <button type="button" onClick={next} className={`${primary} mt-4`}>
          {last ? "До наступного рівня" : "Наступна зустріч"}
        </button>
      )}
    </div>
  );
}

const CHART = { W: 460, H: 250, L: 40, R: 12, T: 14, B: 30, MAX: 330 };
const cx = (w: number) => CHART.L + (w / WEEKS) * (CHART.W - CHART.L - CHART.R);
const cy = (v: number) => CHART.T + (1 - v / CHART.MAX) * (CHART.H - CHART.T - CHART.B);

// Planned spending against the money on the account, one cell per week. Weeks
// with a cash gap are shaded.
function CashChart({ own, loanWeek }: { own: number; loanWeek: number }) {
  const { W, H, L, R, T, B } = CHART;
  const gaps = G.gapWeeks(own, loanWeek);
  const weeks = Array.from({ length: WEEKS }, (_, k) => k + 1);
  const cash = [
    [cx(0), cy(own)],
    [cx(loanWeek - 1), cy(own)],
    [cx(loanWeek - 1), cy(own + G.LOAN)],
    [cx(WEEKS), cy(own + G.LOAN)],
  ];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Витрати за планом і гроші на рахунку за ${WEEKS} тижнів. Кредит приходить на початку ${loanWeek}-го тижня.`}
    >
      {gaps.map((w) => (
        <rect key={w} x={cx(w - 1)} y={T} width={cx(w) - cx(w - 1)} height={H - T - B} style={{ fill: "var(--accent)", opacity: 0.3 }} />
      ))}
      {[0, 100, 200, 300].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={cy(v)} y2={cy(v)} strokeWidth={1} style={{ stroke: "var(--grid)" }} />
          <text x={L - 8} y={cy(v)} textAnchor="end" dominantBaseline="central" fontSize={12} style={{ fill: "var(--muted)" }}>
            {v}
          </text>
        </g>
      ))}
      {weeks.map((k) => (
        <g key={k}>
          <line x1={cx(k)} x2={cx(k)} y1={T} y2={H - B} strokeWidth={1} style={{ stroke: "var(--grid)" }} />
          <text x={cx(k - 0.5)} y={H - B + 16} textAnchor="middle" fontSize={12} style={{ fill: "var(--muted)" }}>
            {k}
          </text>
        </g>
      ))}
      <polyline
        points={PV_CURVE.map((v, w) => `${cx(w)},${cy(v)}`).join(" ")}
        fill="none"
        strokeWidth={2}
        strokeDasharray="6 4"
        style={{ stroke: "var(--muted)" }}
      />
      <polyline points={cash.map((p) => p.join(",")).join(" ")} fill="none" strokeWidth={2.5} strokeLinejoin="round" style={{ stroke: "var(--second)" }} />
    </svg>
  );
}

// Level 2: put the budget together, then pick when the loan has to arrive.
function CashLevel({ cards, onDone }: { cards: number[]; onDone: (score: number) => void }) {
  const id = useId();
  const [places, setPlaces] = useState<(boolean | null)[]>(G.BUDGET_CARDS.map(() => null));
  const [checked, setChecked] = useState(false);
  const [round, setRound] = useState<number | null>(null);
  const [loanWeek, setLoanWeek] = useState(1);
  const [taken, setTaken] = useState(false);
  const [score, setScore] = useState(0);

  const inBudget = G.BUDGET_CARDS.reduce((s, c, k) => s + (places[k] ? c.sum : 0), 0);
  const wrong = G.BUDGET_CARDS.filter((c, k) => places[k] !== c.inside);
  const check = () => {
    setChecked(true);
    setScore((v) => v + G.BUDGET_CARDS.length - wrong.length);
  };

  const r = round === null ? null : G.CASH_ROUNDS[round];
  const safe = r ? G.latestSafeWeek(r.own) : 0;
  const gaps = r ? G.gapWeeks(r.own, loanWeek) : [];
  const take = () => {
    setTaken(true);
    setScore((v) => v + (gaps.length > 0 ? 0 : loanWeek === safe ? 2 : 1));
  };
  const nextRound = () => {
    if (round === G.CASH_ROUNDS.length - 1) return onDone(score);
    setRound((round ?? 0) + 1);
    setLoanWeek(1);
    setTaken(false);
  };

  return (
    <div>
      <HowTo
        goal="скласти бюджет гри, а потім вибрати тиждень кредиту так, щоб рахунок не пішов у мінус і зайвих відсотків не було."
        steps={[
          "Спершу реши про кожну картку: вона входить у бюджет проєкту чи лежить поза ним. Лічильник рахує суму. Натисни «Перевірити».",
          "Потім на графіку побачиш дві лінії: пунктир — скільки студія витратить до кожного тижня, суцільна — скільки грошей надійшло на рахунок.",
          "Рухай повзунок: кредит приходить на початку вибраного тижня. Тижні, коли витрати вище за гроші, зафарбовуються. Це касовий розрив.",
          "Вибери тиждень і натисни «Отримати кредит». Два раунди: 2 віхи за останній безпечний тиждень, 1 за безпечний, але зарано.",
        ]}
        tip={`Підказка: кредит не безкоштовний. Кожен зайвий тиждень — приблизно ${G.INTEREST_PER_WEEK * 1000} грн відсотків, тож брати його на старті теж не найкраще.`}
      />

      {round === null ? (
        <div className="mt-5">
          <p className="font-medium" aria-live="polite">
            У бюджеті: <span className="tabular-nums">{inBudget}</span> тис. грн
          </p>
          <ul className="mt-3 space-y-2">
            {cards.map((k) => [G.BUDGET_CARDS[k], k] as const).map(([c, k]) => (
              <li key={c.name} className="rounded-[6px] bg-background p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-sm tabular-nums">{c.sum} тис. грн</span>
                </div>
                <p className="mt-0.5 text-[13px] leading-snug text-muted">{c.note}</p>
                <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={c.name}>
                  {[
                    { v: true, t: "У бюджеті" },
                    { v: false, t: "Поза бюджетом" },
                  ].map((o) => (
                    <button
                      key={o.t}
                      type="button"
                      disabled={checked}
                      aria-pressed={places[k] === o.v}
                      onClick={() => setPlaces((p) => p.map((v, j) => (j === k ? o.v : v)))}
                      className={`${chip(places[k] === o.v)} disabled:cursor-default`}
                    >
                      {checked && places[k] === o.v && (o.v === c.inside ? "✓ " : "✗ ")}
                      {o.t}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-4">
            {!checked ? (
              <button type="button" onClick={check} disabled={places.includes(null)} className={primary}>
                Перевірити
              </button>
            ) : (
              <>
                <Feedback ok={wrong.length === 0} title={wrong.length === 0 ? "Бюджет зібрано!" : `Не на місці: ${wrong.length}.`}>
                  {wrong.length > 0 && `${wrong.map((c) => `«${c.name}»: ${c.why}`).join(" ")} `}
                  Кошториси і резерв на відомі ризики разом дають бюджет {BUDGET} тис. грн. Розподілений у часі, він стає базовим планом
                  вартості: це і є пунктир на наступному графіку.
                </Feedback>
                <button type="button" onClick={() => setRound(0)} className={primary}>
                  До графіка
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-sm text-muted tabular-nums">
            Раунд {round + 1} з {G.CASH_ROUNDS.length}
          </p>
          <p className="mt-1 leading-relaxed">{r!.lead}</p>
          <div className="mt-3 rounded-[6px] bg-background p-3 sm:p-4">
            <CashChart own={r!.own} loanWeek={loanWeek} />
            <p className="-mt-1 text-center text-[12px] text-muted">Тиждень</p>
            <Legend
              items={[
                { tone: "plan", label: "витрати за планом, тис. грн" },
                { tone: "ev", label: "гроші, що надійшли на рахунок" },
              ]}
            />
            <div className="mt-4">
              <label htmlFor={`${id}-loan`} className="flex items-baseline justify-between text-sm">
                <span>Кредит приходить на початку тижня</span>
                <span className="font-display text-lg font-semibold tabular-nums">{loanWeek}-го</span>
              </label>
              <input
                id={`${id}-loan`}
                type="range"
                min={1}
                max={G.LOAN_WEEKS}
                step={1}
                value={loanWeek}
                disabled={taken}
                onChange={(e) => setLoanWeek(Number(e.target.value))}
                className="mt-1 w-full accent-[var(--accent)]"
              />
            </div>
            <p className="mt-2 text-sm" aria-live="polite">
              {gaps.length > 0
                ? `Касовий розрив: ${gaps.length === 1 ? `на ${gaps[0]}-му тижні бракує` : `з ${gaps[0]}-го по ${gaps[gaps.length - 1]}-й тиждень, найбільше бракує`} ${money(Math.ceil(Math.max(...gaps.map((w) => -G.balance(r!.own, loanWeek, w)))))} тис. грн.`
                : "Рахунок не йде в мінус."}
            </p>
          </div>
          <div className="mt-4 space-y-4">
            {!taken ? (
              <button type="button" onClick={take} className={primary}>
                Отримати кредит
              </button>
            ) : (
              <>
                <Feedback
                  ok={gaps.length === 0 && loanWeek === safe}
                  title={gaps.length > 0 ? "Рахунок у мінусі." : loanWeek === safe ? "Точно вчасно!" : "Розриву немає, але зарано."}
                >
                  {gaps.length > 0 && `На ${gaps[0]}-му тижні нічим платити зарплату, хоч гра вигідна. `}
                  {gaps.length === 0 &&
                    loanWeek < safe &&
                    `Кредит прийшов на ${safe - loanWeek} тиж. раніше потрібного: це близько ${fmt((safe - loanWeek) * G.INTEREST_PER_WEEK * 1000)} грн зайвих відсотків. `}
                  Останній безпечний тиждень: {safe}-й. {r!.after}
                </Feedback>
                <button type="button" onClick={nextRound} className={primary}>
                  {round === G.CASH_ROUNDS.length - 1 ? "До наступного рівня" : "Наступний раунд"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Level 3: credit each work by the agreed rule, not by the team's words.
function ProgressLevel({ onDone }: { onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const finished = i >= G.PROGRESS.length;
  const p = finished ? null : G.PROGRESS[i];
  const doneSum = G.ALREADY_DONE.reduce((s, t) => s + t.sum, 0);
  const credited = doneSum + G.PROGRESS.slice(0, pick === null ? i : i + 1).reduce((s, x) => s + x.right, 0);

  const choose = (v: number) => {
    setPick(v);
    if (v === p!.right) setScore((s) => s + 1);
  };
  const next = () => {
    setI(i + 1);
    setPick(null);
  };

  return (
    <div>
      <HowTo
        goal="порахувати, скільки роботи зроблено до 8-го тижня, за правилами, про які домовилися до старту."
        steps={[
          "На картці роботи є кошторис, слова команди, правило зарахування і факти.",
          "Постав собі питання: що дає правило для цих фактів? Слова команди в рахунок не йдуть.",
          "Натисни на суму, яку зараховуєш. Лічильник збирає освоєний обсяг (EV): зроблену роботу в планових цінах.",
          "Наприкінці порівняєш два підсумки: за словами і за правилами.",
        ]}
        tip={`Підказка: роботи, які вже прийняті, зараховано одразу: ${G.ALREADY_DONE.map((t) => `${t.name.toLowerCase()} ${t.sum}`).join(", ")} тис. грн. За планом до цього тижня мало бути ${G.PLANNED} тис.`}
      />

      {p ? (
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm text-muted tabular-nums">
              Робота {i + 1} з {G.PROGRESS.length}
            </p>
            <p className="text-sm" aria-live="polite">
              Зараховано: <span className="font-semibold tabular-nums">{money(credited)}</span> тис.
            </p>
          </div>
          <div className="mt-2 rounded-[6px] bg-surface-raised p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <span className="text-sm text-muted tabular-nums">кошторис {p.cost} тис. грн</span>
            </div>
            <p className="mt-2 italic leading-relaxed">{p.claim}</p>
            <dl className="mt-3 space-y-2">
              <div>
                <dt className="text-[13px] text-muted">Правило</dt>
                <dd className="leading-snug">{p.rule}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-muted">Факти</dt>
                <dd className="leading-snug">{p.fact}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-4 font-medium">Скільки зараховуєш?</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={`Скільки зарахувати: ${p.name}`}>
            {p.options.map((v) => (
              <button
                key={v}
                type="button"
                disabled={pick !== null}
                aria-pressed={pick === v}
                onClick={() => choose(v)}
                className={`${optionClass(pick !== null ? v === p.right : false, pick !== null)} tabular-nums`}
              >
                {money(v)} тис.
              </button>
            ))}
          </div>
          {pick !== null && (
            <div className="mt-4 space-y-4">
              <Feedback ok={pick === p.right}>{p.why}</Feedback>
              <button type="button" onClick={next} className={primary}>
                {i === G.PROGRESS.length - 1 ? "Підбити підсумок" : "Наступна робота"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-[6px] bg-background p-4">
            <Bars
              rows={[
                { label: "План на 8-й тиждень", value: G.PLANNED, tone: "plan" },
                { label: "За словами команди", value: G.WORDS_EV, tone: "ac" },
                { label: "За правилами", value: G.HONEST_EV, tone: "ev" },
              ]}
            />
          </div>
          <Feedback ok title="Одна студія, два висновки.">
            За словами команди зроблено на {money(G.WORDS_EV)} тис., і студія ніби випереджає план. За правилами — на {money(G.HONEST_EV)} тис.,
            і вона відстає на {money(G.PLANNED - G.HONEST_EV)} тис. Тому правило зарахування домовляються до старту, а не тоді, коли треба звітувати.
          </Feedback>
          <button type="button" onClick={() => onDone(score)} className={primary}>
            До наступного рівня
          </button>
        </div>
      )}
    </div>
  );
}

const TONE = { plan: "bg-foreground/35", ev: "bg-second", ac: "bg-accent" } as const;

// Amounts as bars on one scale.
function Bars({ rows }: { rows: { label: string; value?: number; tone: keyof typeof TONE }[] }) {
  const max = Math.max(...rows.map((r) => r.value ?? 0), 1);
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span>{r.label}</span>
            <span className="font-semibold tabular-nums">{r.value === undefined ? "?" : `${money(r.value)} тис.`}</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-foreground/[0.07]">
            {r.value !== undefined && <div className={`h-full rounded-full ${TONE[r.tone]}`} style={{ width: `${(r.value / max) * 100}%` }} />}
          </div>
        </li>
      ))}
    </ul>
  );
}

// Level 4: read a report, pin it on the map of schedule and money, then act.
function ReportLevel({ ask, reports, actions, onDone }: { ask: number[]; reports: number[]; actions: number[][]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [asked, setAsked] = useState<number | null>(null);
  const [pin, setPin] = useState<G.Corner | null>(null);
  const [act, setAct] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const k = reports[i];
  const r = G.REPORTS[k];
  const right = G.cornerOf(r);
  const opening = i === 0 && asked === null;
  const asking = i === 0;
  const ready = pin !== null && (!r.action || act !== null);

  const answerAsk = (o: number) => {
    setAsked(o);
    if (G.BONUS_ASK.options[o].right) setScore((v) => v + 1);
  };
  const place = (c: G.Corner) => {
    setPin(c);
    if (c === right) setScore((v) => v + 1);
  };
  const choose = (o: number) => {
    setAct(o);
    if (r.action!.options[o].right) setScore((v) => v + 1);
  };
  const next = () => {
    if (i === reports.length - 1) return onDone(score);
    setI(i + 1);
    setPin(null);
    setAct(null);
  };

  return (
    <div>
      <HowTo
        goal="за трьома числами зрозуміти, що насправді відбувається зі строками і грошима, і вирішити, що робити."
        steps={[
          "У кожному звіті три смуги. План (PV) — скільки мали витратити на заплановане. Зроблено (EV) — скільки за планом коштує готова робота. Витрачено (AC) — скільки заплатили насправді.",
          "Порівняй «Зроблено» з «Планом»: менше — студія відстає, більше — випереджає.",
          "Порівняй «Зроблено» з «Витрачено»: менше — студія перевитрачає, більше — економить.",
          "Натисни на клітинку карти, куди лягає цей звіт, а потім вибери, що робиш. Кожен звіт — окрема ситуація.",
        ]}
        tip="Підказка: «витрачено менше за план» ще не означає економію. Порівнюй витрати зі зробленим, а не з планом."
      />

      <p className="mt-5 text-sm text-muted tabular-nums">
        Звіт {i + 1} з {reports.length} · {r.week}-й тиждень
      </p>

      {asking && (
        <div className="mt-2 rounded-[6px] bg-surface-raised p-4 sm:p-5">
          <p className="text-[13px] text-muted">Засновники</p>
          <p className="mt-0.5 leading-relaxed">{G.BONUS_ASK.text}</p>
          <div className="mt-3 grid gap-1.5" role="group" aria-label="Що відповісти засновникам">
            {ask.map((o) => (
              <button
                key={o}
                type="button"
                disabled={asked !== null}
                aria-pressed={asked === o}
                onClick={() => answerAsk(o)}
                className={optionClass(asked !== null ? !!G.BONUS_ASK.options[o].right : false, asked !== null)}
              >
                {G.BONUS_ASK.options[o].text}
              </button>
            ))}
          </div>
          {asked !== null && (
            <div className="mt-3">
              <Feedback ok={G.BONUS_ASK.options[asked].right}>{G.BONUS_ASK.why}</Feedback>
            </div>
          )}
        </div>
      )}

      {!asking && <p className="mt-2 leading-relaxed">{r.story}</p>}
      {asking && asked !== null && <p className="mt-4 leading-relaxed">{r.story}</p>}

      <div className="mt-3 rounded-[6px] bg-background p-4">
        <Bars
          rows={[
            { label: "План (PV)", value: r.pv, tone: "plan" },
            { label: "Зроблено (EV)", value: opening ? undefined : r.ev, tone: "ev" },
            { label: "Витрачено (AC)", value: r.ac, tone: "ac" },
          ]}
        />
      </div>

      {!opening && (
        <div className="mt-4">
          <p className="font-medium">Куди лягає цей звіт?</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center text-[13px] text-muted">
            <span>Строки: відстає</span>
            <span>Строки: випереджає</span>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-2" role="group" aria-label="Карта строків і грошей">
            {G.CORNERS.map((c) => {
              const isRight = pin !== null && c.key === right;
              const isWrong = pin === c.key && c.key !== right;
              return (
                <button
                  key={c.key}
                  type="button"
                  disabled={pin !== null}
                  aria-pressed={pin === c.key}
                  onClick={() => place(c.key)}
                  className={`flex min-h-20 items-center justify-center gap-2 rounded-[6px] p-3 text-center text-sm font-medium leading-snug press ${
                    isRight
                      ? "bg-accent text-accent-foreground"
                      : isWrong
                        ? "bg-foreground/[0.12]"
                        : "bg-foreground/[0.05] enabled:hover:bg-foreground/[0.1] disabled:opacity-60"
                  }`}
                >
                  {pin === c.key && <span aria-hidden className="block size-2.5 shrink-0 rotate-45 rounded-[1px] bg-current" />}
                  <span className={isWrong ? "line-through decoration-2" : ""}>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {pin && (
        <div className="mt-4">
          <Feedback ok={pin === right}>{r.read}</Feedback>
        </div>
      )}

      {pin && r.action && (
        <div className="mt-4">
          <p className="font-medium">{r.action.ask}</p>
          <div className="mt-2 grid gap-1.5" role="group" aria-label={r.action.ask}>
            {actions[k].map((o) => (
              <button
                key={o}
                type="button"
                disabled={act !== null}
                aria-pressed={act === o}
                onClick={() => choose(o)}
                className={optionClass(act !== null ? !!r.action!.options[o].right : false, act !== null)}
              >
                {r.action!.options[o].text}
              </button>
            ))}
          </div>
          {act !== null && (
            <div className="mt-3">
              <Feedback ok={!!r.action.options[act].right}>{r.action.options[act].why}</Feedback>
            </div>
          )}
        </div>
      )}

      {ready && (
        <button type="button" onClick={next} className={`${primary} mt-4`}>
          {i === reports.length - 1 ? "До наступного рівня" : "Наступний звіт"}
        </button>
      )}
    </div>
  );
}

const meterAt = (v: number) => `${((Math.min(G.METER.max, Math.max(G.METER.min, v)) - G.METER.min) / (G.METER.max - G.METER.min)) * 100}%`;

// The forecast needle against the limit of the budget.
function ForecastMeter({ value, limit }: { value: number; limit: number }) {
  const over = value > limit;
  return (
    <div>
      <p className="font-medium" aria-live="polite">
        Прогноз: <span className="tabular-nums">{value}</span> тис. грн
        <span className="font-normal text-muted"> · межа бюджету <span className="tabular-nums">{limit}</span> тис.{over ? " · перевищено" : ""}</span>
      </p>
      <div aria-hidden className="relative mt-5 h-3 rounded-full bg-foreground/[0.07]">
        <span className="absolute inset-y-0 left-0 rounded-l-full bg-second/40" style={{ width: meterAt(limit) }} />
        <span className="absolute -top-1.5 h-6 w-0.5 bg-foreground" style={{ left: meterAt(limit) }} />
        <span
          className="absolute -top-1 block size-5 -translate-x-1/2 rotate-45 rounded-[3px] bg-accent ring-2 ring-background transition-[left] duration-500 ease-[var(--ease-out)]"
          style={{ left: meterAt(value) }}
        />
      </div>
      <div aria-hidden className="mt-2 flex justify-between text-[12px] text-muted tabular-nums">
        <span>{G.METER.min} тис.</span>
        <span>{G.METER.max} тис.</span>
      </div>
    </div>
  );
}

// Level 5: forecast the end at week 8, then steer through three events.
function MeetingLevel({ events, onDone }: { events: number[][]; onDone: (score: number) => void }) {
  const id = useId();
  const [cost, setCost] = useState(G.FORECAST.min);
  const [date, setDate] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const [i, setI] = useState<number | null>(null);
  const [pick, setPick] = useState<number | null>(null);
  const [value, setValue] = useState(BUDGET);
  const [limit, setLimit] = useState(BUDGET);
  const [dirty, setDirty] = useState(false);
  const [score, setScore] = useState(0);

  const costOk = Math.abs(cost - G.FORECAST.right) <= G.FORECAST.tolerance;
  const dateOk = date === G.DATE_FORECAST.right;
  const show = () => {
    setShown(true);
    setScore((v) => v + (costOk ? 1 : 0) + (dateOk ? 1 : 0));
  };

  const finished = i !== null && i >= G.MEETING_EVENTS.length;
  const e = i !== null && !finished ? G.MEETING_EVENTS[i] : null;
  const honest = value <= limit && !dirty;

  const choose = (k: number) => {
    const o = e!.options[k];
    setPick(k);
    setValue((v) => v + o.delta);
    setLimit((v) => v + (o.limit ?? 0));
    if (o.dirty) setDirty(true);
    if (o.right) setScore((v) => v + 1);
  };
  const next = () => {
    setI((i ?? 0) + 1);
    setPick(null);
  };

  return (
    <div>
      <HowTo
        goal="спрогнозувати, скільки коштуватиме гра в кінці, а потім провести проєкт через три події й лишитися в межах бюджету чесним шляхом."
        steps={[
          "Спершу прогноз. Повзунком покажи, у скільки обійдеться вся робота, якщо тенденція збережеться, і вибери тиждень релізу. Натисни «Показати прогноз».",
          "Далі три події. Прочитай кожну й вибери, що робиш. Ромб на шкалі покаже, куди зрушив прогноз, а риска — межу бюджету.",
          "Межа зростає лише тоді, коли гроші дали засновники за запитом на зміну.",
          "Окрема віха — за фініш у межах бюджету без тихих рішень і вирізаних перевірок.",
        ]}
        tip={`Підказка: на 8-му тижні кожна гривня дає 90 копійок роботи, а зроблено 93% запланованого. Уся робота за планом коштує ${G.FORECAST.min} тис. грн і займає ${WEEKS} тижнів.`}
      />

      {i === null ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-[6px] bg-background p-4">
            <label htmlFor={`${id}-cost`} className="flex items-baseline justify-between gap-3">
              <span className="font-medium">Скільки коштуватиме вся робота в кінці?</span>
              <span className="font-display text-xl font-semibold tabular-nums">{cost} тис.</span>
            </label>
            <input
              id={`${id}-cost`}
              type="range"
              min={G.FORECAST.min}
              max={G.FORECAST.max}
              step={G.FORECAST.step}
              value={cost}
              disabled={shown}
              onChange={(ev) => setCost(Number(ev.target.value))}
              className="mt-2 w-full accent-[var(--accent)]"
            />
            <p className="mt-4 font-medium">На якому тижні реліз?</p>
            <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Тиждень релізу">
              {G.DATE_FORECAST.options.map((w) => (
                <button key={w} type="button" disabled={shown} aria-pressed={date === w} onClick={() => setDate(w)} className={`${chip(date === w)} tabular-nums disabled:cursor-default`}>
                  {w}-й
                </button>
              ))}
            </div>
          </div>
          {!shown ? (
            <button type="button" onClick={show} disabled={date === null} className={primary}>
              Показати прогноз
            </button>
          ) : (
            <>
              <Feedback ok={costOk && dateOk} title={costOk && dateOk ? "Прогноз точний!" : costOk || dateOk ? "Наполовину." : "Не зовсім."}>
                {G.FORECAST.why} {G.DATE_FORECAST.why} Це сигнал для звіту про стан, поки ще є час щось змінити.
              </Feedback>
              <button type="button" onClick={() => setI(0)} className={primary}>
                На нараду
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="mt-5">
          <div className="rounded-[6px] bg-background p-4">
            <ForecastMeter value={value} limit={limit} />
          </div>

          {e && i !== null && (
            <div className="mt-4">
              <p className="text-sm text-muted tabular-nums">
                Подія {i + 1} з {G.MEETING_EVENTS.length}
              </p>
              <div className="mt-2 rounded-[6px] bg-surface-raised p-4 sm:p-5">
                <h3 className="font-display text-xl font-semibold">{e.title}</h3>
                <p className="mt-1 leading-relaxed">{e.text}</p>
              </div>
              <div className="mt-3 grid gap-1.5" role="group" aria-label={e.title}>
                {events[i].map((k) => (
                  <button
                    key={k}
                    type="button"
                    disabled={pick !== null}
                    aria-pressed={pick === k}
                    onClick={() => choose(k)}
                    className={optionClass(pick !== null ? !!e.options[k].right : false, pick !== null)}
                  >
                    {e.options[k].text}
                  </button>
                ))}
              </div>
              {pick !== null && (
                <div className="mt-4 space-y-4">
                  <Feedback ok={!!e.options[pick].right}>
                    {e.options[pick].why} Причина перевищення: {e.cause}.
                  </Feedback>
                  <button type="button" onClick={next} className={primary}>
                    {i === G.MEETING_EVENTS.length - 1 ? "Підбити підсумок" : "Наступна подія"}
                  </button>
                </div>
              )}
            </div>
          )}

          {finished && (
            <div className="mt-4 space-y-4">
              <Feedback ok={honest} title={honest ? "У межах бюджету, і чесно!" : value > limit ? "Бюджет перевищено." : "Цифра гарна, але нечесна."}>
                {honest
                  ? "Рішення про гроші лишилися за засновниками, а зміст скорочено свідомо."
                  : value > limit
                    ? "Прогноз вийшов за межу, а погоджених грошей на це немає. Щоб так не сталося, шукай причину рано й виноси великі суми на рішення спонсора."
                    : "Прогноз у межах, але якісь рішення ухвалено тихо або ціною якості. Такі витрати повертаються пізніше і дорожче."}
              </Feedback>
              <button type="button" onClick={() => onDone(score + (honest ? 1 : 0))} className={primary}>
                Завершити гру
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function BudgetGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-09"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        methods: shuffled(G.METHODS.length),
        cards: shuffled(G.BUDGET_CARDS.length),
        ask: shuffled(G.BONUS_ASK.options.length),
        reports: [0, ...shuffled(G.REPORTS.length - 1).map((k) => k + 1)],
        actions: G.REPORTS.map((r) => shuffled(r.action?.options.length ?? 0)),
        events: G.MEETING_EVENTS.map((e) => shuffled(e.options.length)),
      })}
      levels={[
        { name: "Вилка", play: (o, done) => <RangeLevel methods={o.methods} onDone={done} /> },
        { name: "Каса", play: (o, done) => <CashLevel cards={o.cards} onDone={done} /> },
        { name: "На 90% готово", play: (_, done) => <ProgressLevel onDone={done} /> },
        { name: "Економія?", play: (o, done) => <ReportLevel ask={o.ask} reports={o.reports} actions={o.actions} onDone={done} /> },
        { name: "Нарада", play: (o, done) => <MeetingLevel events={o.events} onDone={done} /> },
      ]}
      startLabel="Почати"
      period="За гру"
      finalTitle="Дев'ята віха!"
      finalText="Модуль 9 пройдено. Далі — люди: кого покликати в команду і як розподілити роботу."
      nextHref={nextHref}
      nextLabel="До модуля 10"
    >
      <BudgetBonus />
    </AssignmentGame>
  );
}
