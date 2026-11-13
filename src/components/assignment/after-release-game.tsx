"use client";

import { useState, type ReactNode } from "react";
import { BenefitBonus } from "@/components/my-project/project-benefit";
import { assignmentHref } from "@/content/assignments";
import * as G from "@/content/assignments/module-14";
import type { Question } from "@/content/assignments/types";
import { AssignmentGame, BasketLevel, basketSteps, chip, Deck, Feedback, HowTo, optionClass, primary, Questions, shuffled } from "./game-kit";

type Orders = {
  metrics: number[];
  cases: number[];
  caseOptions: { hack: number[]; pair: number[] }[];
  letters: number[];
  stop: number[][];
  lessons: number[];
  checks: number[][];
  last: number[][];
};

const fmt = (n: number) => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 }).format(n);

// «3,6 тисячі», «9 тисяч», «21 тисяча».
const thousands = (n: number) => {
  if (!Number.isInteger(n)) return `${fmt(n)} тисячі`;
  const last = n % 10;
  const teen = n % 100 >= 11 && n % 100 <= 14;
  return `${n} ${!teen && last === 1 ? "тисяча" : !teen && last >= 2 && last <= 4 ? "тисячі" : "тисяч"}`;
};

// One question with shuffled answers, then its feedback and a way on.
function Ask({ q, order, next, result, onAnswer, onNext }: { q: Question; order: number[]; next: string; result?: ReactNode; onAnswer: (right: boolean) => void; onNext: () => void }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="mt-4">
      <p className="font-medium leading-snug">{q.text}</p>
      <div className="mt-2 grid gap-1.5" role="group" aria-label="Варіанти відповіді">
        {order.map((k) => (
          <button
            key={k}
            type="button"
            disabled={pick !== null}
            aria-pressed={pick === k}
            onClick={() => {
              setPick(k);
              onAnswer(!!q.options[k].right);
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
          {result}
          <button type="button" onClick={onNext} className={primary}>
            {next}
          </button>
        </div>
      )}
    </div>
  );
}

// Level 1, step 2: four tiles on the owner's dashboard.
function PanelBuilder({ onDone }: { onDone: (score: number) => void }) {
  const [picks, setPicks] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const chosen = G.PANEL_TILES.filter((t) => picks.includes(t.name));
  const kinds = chosen.map((t) => t.kind);
  const passed = G.PANEL_RULES.filter((r) => r.passed(kinds)).length;
  const allPassed = passed === G.PANEL_RULES.length;
  const full = picks.length === G.PANEL_SLOTS;

  const toggle = (name: string) => setPicks((v) => (v.includes(name) ? v.filter((x) => x !== name) : [...v, name]));
  const check = () => {
    setChecked(true);
    if (score === null) setScore(passed);
  };

  return (
    <div>
      <HowTo
        goal="зібрати для власника мережі панель, на яку варто дивитися щоранку."
        steps={[
          `Натискайте на плитки, які хочете поставити на панель. Місць усього ${G.PANEL_SLOTS}.`,
          "Панель приймуть, якщо на ній є випереджальний показник, є запізнілий і немає марнославних.",
          "Натисніть «Показати панель власнику». Якщо панель не прийняли, змініть її і покажіть ще раз. Віхи дає лише перша спроба.",
        ]}
        tip="Підказка: про кожну плитку запитайте себе, яке рішення ви ухвалите, якщо це число погіршиться."
      />
      <p className="mt-5 text-sm text-muted tabular-nums" aria-live="polite">
        Вибрано {picks.length} з {G.PANEL_SLOTS}
      </p>
      <div className="mt-2 grid gap-1.5 sm:grid-cols-2" role="group" aria-label="Плитки панелі">
        {G.PANEL_TILES.map((t) => {
          const on = picks.includes(t.name);
          return (
            <button key={t.name} type="button" disabled={checked || (full && !on)} aria-pressed={on} onClick={() => toggle(t.name)} className={optionClass(on, checked || (full && !on))}>
              {t.name}
            </button>
          );
        })}
      </div>

      {!checked ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={check} disabled={!full} className={primary}>
            Показати панель власнику
          </button>
          {!full && <span className="text-sm text-muted">Кнопка запрацює, коли виберете {G.PANEL_SLOTS} плитки.</span>}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <Feedback ok={allPassed} title={allPassed ? "Панель прийнято!" : "Панель поки не приймають."}>
            {allPassed ? "Кожне число на панелі веде до дії, тому власник знатиме, що робити, коли воно зміниться." : "Подивіться, яку умову не виконано, і змініть плитки."}
          </Feedback>
          <ul className="space-y-1 text-sm leading-relaxed">
            {G.PANEL_RULES.map((r) => (
              <li key={r.name}>
                {r.passed(kinds) ? "✓" : "✗"} {r.name}
              </li>
            ))}
          </ul>
          <dl className="space-y-2 rounded-[6px] bg-surface-raised p-4 text-sm leading-relaxed">
            {chosen.map((t) => (
              <div key={t.name}>
                <dt className="font-medium">
                  {t.name} ({G.METRIC_BINS.find((b) => b.key === t.kind)!.name.toLowerCase()})
                </dt>
                <dd className="text-muted">{t.decision}</dd>
              </div>
            ))}
          </dl>
          {allPassed ? (
            <button type="button" onClick={() => onDone(score ?? 0)} className={primary}>
              До наступного рівня
            </button>
          ) : (
            <button type="button" onClick={() => setChecked(false)} className={chip(false)}>
              Змінити панель
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Level 1: sort the numbers, then build the dashboard.
function PanelLevel({ metrics, onDone }: { metrics: number[]; onDone: (score: number) => void }) {
  const [sorted, setSorted] = useState<number | null>(null);
  if (sorted !== null) return <PanelBuilder onDone={(s) => onDone(sorted + s)} />;
  return (
    <BasketLevel
      key="metrics"
      intro={
        <HowTo
          goal="за кілька днів після релізу цифр стало забагато. Розберіть їх, щоб зрозуміти, яка з них що каже."
          steps={basketSteps(G.METRIC_BINS.map((b) => b.name))}
          tip="Підказка: якщо число каже про майбутнє, воно випереджальне. Якщо про минуле, запізніле. Якщо рішення з нього не випливає, марнославне."
        />
      }
      items={G.METRIC_CARDS}
      bins={G.METRIC_BINS}
      order={metrics}
      allRight="Тепер видно, які цифри попереджають, які підбивають підсумок, а які лише приємно показувати."
      onDone={setSorted}
    />
  );
}

// What a quarter did to the numbers.
function TrendBars({ title, rows }: { title: string; rows: G.Trend[] }) {
  return (
    <div className="mt-4 rounded-[6px] bg-surface-raised p-4">
      <p className="text-sm font-medium">{title}</p>
      <dl className="mt-3 space-y-3">
        {rows.map((r) => {
          const top = Math.max(r.before, r.after);
          return (
            <div key={r.name}>
              <dt className="flex flex-wrap justify-between gap-x-3 text-[13px]">
                <span>{r.name}</span>
                <span className="tabular-nums">
                  було {r.before}
                  {r.unit}, стало {r.after}
                  {r.unit}
                </span>
              </dt>
              <dd className="mt-1 space-y-1" aria-hidden>
                <div className="h-1.5 rounded-full bg-foreground/25" style={{ width: `${(r.before / top) * 100}%` }} />
                <div className="h-1.5 rounded-full bg-accent" style={{ width: `${(r.after / top) * 100}%` }} />
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-3 text-[13px] text-muted">Сіра смуга показує, як було, а бірюзова показує, як стало.</p>
    </div>
  );
}

// Level 2: sign the bonus, see it gamed, add the paired metric.
function BonusLevel({ cases, options, onDone }: { cases: number[]; options: Orders["caseOptions"]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [step, setStep] = useState<"hack" | "pair">("hack");
  const [score, setScore] = useState(0);
  const k = cases[i];
  const c = G.BONUS_CASES[k];
  const last = i === cases.length - 1;

  return (
    <div>
      <HowTo
        goal="побачити, як премія за одне число псує роботу, і врівноважити її парним показником."
        steps={[
          "Прочитайте наказ про премію і вгадайте, що зробить команда. За правильну відповідь отримаєте одну віху.",
          "Подивіться, що стало з цифрами через квартал.",
          "Додайте парний показник, який перешкодить підгонці. За правильний вибір отримаєте дві віхи.",
        ]}
        tip="Підказка: добра пара рахує те, що страждає від підгонки. Підігнати одне число легко, а одразу два значно складніше."
      />
      <p className="mt-5 text-sm text-muted tabular-nums">
        Випадок {i + 1} з {cases.length}: {c.who}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-4 leading-relaxed sm:p-5">{c.bonus}</div>
      {step === "pair" && <TrendBars title="Через квартал, з премією за одне число" rows={c.gamed} />}
      <Ask
        key={`${k}-${step}`}
        q={step === "hack" ? c.hack : c.pair}
        order={step === "hack" ? options[k].hack : options[k].pair}
        next={step === "hack" ? "Подивитися, що стало" : last ? "До наступного рівня" : "До наступного випадку"}
        result={step === "pair" && <TrendBars title="Ще через квартал, із парним показником" rows={c.fixed} />}
        onAnswer={(right) => {
          if (right) setScore((v) => v + (step === "hack" ? 1 : 2));
        }}
        onNext={() => {
          if (step === "hack") return setStep("pair");
          if (last) return onDone(score);
          setI(i + 1);
          setStep("hack");
        }}
      />
    </div>
  );
}

// Level 3: the inbox of a project nobody closed, a project to stop, the lessons.
function ZombieLevel({ letters, stop, lessons, onDone }: { letters: number[]; stop: number[][]; lessons: number[]; onDone: (score: number) => void }) {
  const [phase, setPhase] = useState<"inbox" | "stop" | "lessons">("inbox");
  const [score, setScore] = useState(0);
  const add = (s: number, next: typeof phase) => {
    setScore((v) => v + s);
    setPhase(next);
  };

  if (phase === "inbox") {
    return (
      <div>
        <HowTo
          goal="з'ясувати, чому проєкт досі забирає час, хоча реліз був три місяці тому. Кожен лист показує пропущений пункт закриття."
          steps={["Прочитайте лист.", "Виберіть пункт закриття, який пропустили.", "Прочитайте пояснення і натисніть «Далі». Лічильник угорі покаже, скільки часу проєкт іще забирає."]}
          tip="Підказка: подумайте, хто пише і чого йому бракує, щоб спокійно працювати далі."
        />
        <Deck
          key="letters"
          label="Лист"
          question="Який пункт закриття пропустили?"
          items={G.LETTERS}
          order={letters}
          choices={G.CLOSING_ITEMS}
          doneLabel="До наступного кроку"
          above={(answered) => {
            const left = G.TOTAL_HOURS - answered.reduce((a, c) => a + (c as G.Letter).hours, 0);
            return (
              <div className="rounded-[6px] bg-surface-raised p-3" aria-live="polite">
                <div className="flex flex-wrap justify-between gap-x-3 text-sm">
                  <span className="font-medium">Проєкт досі забирає</span>
                  <span className="font-display font-semibold tabular-nums">{left} год на тиждень</span>
                </div>
                <div aria-hidden className="mt-1.5 h-2 overflow-hidden rounded-full bg-foreground/15">
                  <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(left / G.TOTAL_HOURS) * 100}%` }} />
                </div>
              </div>
            );
          }}
          onDone={(s) => add(s, "stop")}
        />
      </div>
    );
  }

  if (phase === "stop") {
    return (
      <div>
        <HowTo goal="вирішити, що робити з проєктом, вигоди якого вже недосяжні." steps={["Прочитайте ситуацію.", "Виберіть пораду для спонсора.", "Прочитайте пояснення і переходьте далі."]} />
        <Questions key="stop" items={[G.STOP_ASK]} orders={stop} doneLabel="До реєстру уроків" onDone={(s) => add(s, "lessons")} />
      </div>
    );
  }

  return (
    <BasketLevel
      key="lessons"
      intro={
        <HowTo
          goal="записати уроки проєкту так, щоб наступний проєкт почався з них, а не з тих самих помилок."
          steps={basketSteps(G.LESSON_BINS.map((b) => b.name))}
          tip="Підказка: якщо все минуло добре, запитайте себе, чи це заслуга команди. Те, що спрацювало випадково, наступного разу може не спрацювати."
        />
      }
      items={G.LESSON_CARDS}
      bins={G.LESSON_BINS}
      columns="sm:grid-cols-2"
      order={lessons}
      allRight="Реєстр готовий. Особливо корисна колонка про удачу: її найчастіше забувають, а саме там сховані ризики наступного проєкту."
      onDone={(s) => onDone(score + s)}
    />
  );
}

const W = 360;
const H = 190;
const P = { left: 34, right: 10, top: 12, bottom: 34 };
const mx = (m: number) => P.left + (m / 12) * (W - P.left - P.right);
const my = (v: number) => H - P.bottom - (v / G.PLAN_END) * (H - P.top - P.bottom);

// Plan against fact, with every month numbered.
function BenefitChart({ points }: { points: { month: number; value: number }[] }) {
  const fact = [{ month: 0, value: 0 }, ...points];
  const line = fact.map((p, k) => `${k ? "L" : "M"}${mx(p.month)} ${my(p.value)}`).join(" ");
  const label = points.length ? points.map((p) => `місяць ${p.month}: ${fmt(p.value)} тисяч`).join(", ") : "фактичних даних ще немає";
  return (
    <figure className="mt-5 rounded-[6px] bg-surface-raised p-3 sm:p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Активні клієнти за місяцями: план 24 тисячі за рік, факт: ${label}`}>
        {[0, 6, 12, 18, 24].map((v) => (
          <g key={v}>
            <line x1={P.left} x2={W - P.right} y1={my(v)} y2={my(v)} className="stroke-foreground/10" />
            <text x={P.left - 5} y={my(v) + 3} textAnchor="end" className="fill-muted text-[10px] tabular-nums">
              {v}
            </text>
          </g>
        ))}
        {Array.from({ length: 12 }, (_, k) => k + 1).map((m) => (
          <text key={m} x={mx(m)} y={H - P.bottom + 14} textAnchor="middle" className={`text-[10px] tabular-nums ${G.CHECK_MONTHS.includes(m) ? "fill-foreground font-semibold" : "fill-muted"}`}>
            {m}
          </text>
        ))}
        <text x={(P.left + W - P.right) / 2} y={H - 5} textAnchor="middle" className="fill-muted text-[10px]">
          місяці після релізу
        </text>
        <line x1={mx(0)} y1={my(0)} x2={mx(12)} y2={my(24)} className="stroke-foreground/50" strokeWidth={1.5} strokeDasharray="5 4" />
        <path d={line} fill="none" className="stroke-accent" strokeWidth={2.5} />
        {points.map((p) => (
          <g key={p.month}>
            <circle cx={mx(p.month)} cy={my(p.value)} r={4} className="fill-accent" />
            <text x={mx(p.month)} y={my(p.value) + 16} textAnchor="middle" className="fill-foreground text-[10px] font-semibold tabular-nums">
              {fmt(p.value)}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-[13px] text-muted">Активні клієнти, тисяч. Пунктир показує план, а суцільна лінія показує факт.</figcaption>
    </figure>
  );
}

function Readout({ items }: { items: { name: string; value: string }[] }) {
  return (
    <dl className="mt-3 grid gap-2 sm:grid-cols-3">
      {items.map((r) => (
        <div key={r.name} className="rounded-[4px] bg-background p-3">
          <dt className="text-[13px] text-muted">{r.name}</dt>
          <dd className="mt-0.5 font-medium tabular-nums">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Level 4: the owner of the benefits and three checks. Every decision moves the next point.
function ChecksLevel({ orders, onDone }: { orders: number[][]; onDone: (score: number) => void }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  // Whether the checks at months 3 and 6 went the right way, decided on answering.
  const [right3, setRight3] = useState(false);
  const [right6, setRight6] = useState(false);

  const at6 = right3 ? 9 : 6.5;
  const at12 = right3 && right6 ? 21 : right3 || right6 ? 17 : 13;
  const rating12 = right6 ? "4,4" : "3,8";
  const repeat12 = right6 ? 43 : 24;
  const npv = at12 === 21 ? "додатна" : at12 === 17 ? "близька до нуля" : "від'ємна";

  const points = [
    { month: 3, value: 3.6 },
    { month: 6, value: at6 },
    { month: 12, value: at12 },
  ].slice(0, step);

  const steps: { q: Question; read?: { name: string; value: string }[] }[] = [
    { q: G.OWNER_ASK },
    {
      q: {
        text: `Минуло три місяці. Активних клієнтів ${thousands(3.6)} замість ${thousands(6)}, але повторно замовляють 45% людей при цілі 40%. Що порадите власнику вигод?`,
        options: G.CHECK_3_OPTIONS,
      },
      read: [
        { name: "Клієнти", value: `${fmt(3.6)} тис. з 6 тис.` },
        { name: "Рейтинг", value: "4,4 при цілі 4,3" },
        { name: "Повторні замовлення", value: "45% при цілі 40%" },
      ],
    },
    {
      q: {
        text: `Минуло пів року. Активних клієнтів ${thousands(at6)} замість ${thousands(12)}, рейтинг упав до 4,0, а повторно замовляють лише 28% людей. У відгуках пишуть про запізнення кур'єрів. Що порадите власнику вигод?`,
        options: G.CHECK_6_OPTIONS,
      },
      read: [
        { name: "Клієнти", value: `${fmt(at6)} тис. з 12 тис.` },
        { name: "Рейтинг", value: "4,0 при цілі 4,3" },
        { name: "Повторні замовлення", value: "28% при цілі 40%" },
      ],
    },
    {
      q: {
        text: `Минув рік. Активних клієнтів ${thousands(at12)} замість 24 тисяч, рейтинг ${rating12}, повторно замовляють ${repeat12}% людей, а NPV (чиста приведена вартість) ${npv}. Що робить власник вигод?`,
        options: G.CHECK_12_OPTIONS,
      },
      read: [
        { name: "Клієнти", value: `${at12} тис. з 24 тис.` },
        { name: "Рейтинг", value: `${rating12} при цілі 4,3` },
        { name: "NPV", value: npv },
      ],
    },
  ];
  const s = steps[step];
  const last = step === steps.length - 1;

  return (
    <div>
      <HowTo
        goal="дотягнути застосунок якомога ближче до цілі у 24 тисячі клієнтів. Вигоди з'являються після проєкту, тому їх перевіряють через 3, 6 і 12 місяців."
        steps={[
          "Подивіться на графік і цифри останньої перевірки.",
          "Виберіть рішення і прочитайте пояснення.",
          "Натисніть «Далі»: ваше рішення змінить наступну точку на графіку.",
        ]}
        tip="Підказка: спершу зрозумійте причину відставання. Показники кажуть, чи людей мало, чи вони не повертаються, а це різні проблеми."
      />
      <BenefitChart points={points} />
      {s.read && <Readout items={s.read} />}
      <Ask
        key={step}
        q={s.q}
        order={orders[step]}
        next={last ? "До наступного рівня" : "Далі"}
        onAnswer={(right) => {
          if (right) setScore((v) => v + 3);
          if (step === 1) setRight3(right);
          if (step === 2) setRight6(right);
        }}
        onNext={() => {
          if (last) return onDone(score);
          setStep(step + 1);
        }}
      />
    </div>
  );
}

// Level 5, step 1: find what the AI got wrong by checking against the facts.
function Proofread({ onDone }: { onDone: (score: number) => void }) {
  const [picks, setPicks] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const errors = G.REPORT.filter((r) => r.wrong);
  const hits = picks.filter((k) => G.REPORT[k].wrong).length;
  const falseHits = picks.length - hits;
  const score = Math.max(0, hits - falseHits);
  const toggle = (k: number) => setPicks((v) => (v.includes(k) ? v.filter((x) => x !== k) : [...v, k]));

  return (
    <div>
      <HowTo
        goal="перевірити річний звіт, який написав ШІ, перш ніж надсилати його власнику мережі."
        steps={[
          "Порівняйте кожне речення звіту з таблицею фактів.",
          `Натисніть на речення, у яких є помилка. Таких речень ${errors.length}.`,
          "Натисніть «Перевірити звіт». Кожна знайдена помилка дає віху, а кожне зайве позначення забирає одну.",
        ]}
        tip="Підказка: ШІ помиляється впевнено. Перевіряйте цифри, джерела і рішення, яких ніхто не ухвалював."
      />
      <div className="mt-5 rounded-[6px] bg-surface-raised p-4">
        <p className="text-sm font-medium">Факти з системи звітності</p>
        <p className="mt-0.5 text-[13px] text-muted">На цьому рівні цифри однакові для всіх гравців і не залежать від ваших рішень на попередньому.</p>
        <dl className="mt-2 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
          {G.REPORT_FACTS.map((f) => (
            <div key={f.name}>
              <dt className="text-[13px] text-muted">{f.name}</dt>
              <dd className="leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-4 font-medium">Чернетка звіту від ШІ</p>
      <div className="mt-2 grid gap-1.5" role="group" aria-label="Речення звіту">
        {G.REPORT.map((r, k) => {
          const on = picks.includes(k);
          const missed = checked && !!r.wrong && !on;
          const extra = checked && !r.wrong && on;
          return (
            <button key={r.text} type="button" disabled={checked} aria-pressed={on} onClick={() => toggle(k)} className={optionClass(on && !extra, checked && !on && !missed)}>
              {checked && (r.wrong ? (on ? "✓ " : "Пропущено: ") : on ? "✗ " : "")}
              {r.text}
            </button>
          );
        })}
      </div>
      {!checked ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setChecked(true)} disabled={picks.length === 0} className={primary}>
            Перевірити звіт
          </button>
          {picks.length === 0 && <span className="text-sm text-muted">Спершу позначте хоча б одне речення.</span>}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <Feedback ok={hits === errors.length && falseHits === 0} title={`Знайдено помилок: ${hits} з ${errors.length}. Зайвих позначень: ${falseHits}.`}>
            {errors.map((r) => r.wrong).join(" ")}
          </Feedback>
          <button type="button" onClick={() => onDone(score)} className={primary}>
            До останніх запитань
          </button>
        </div>
      )}
    </div>
  );
}

// Level 5: the report, then what AI and the coming years change.
function AiLevel({ last, onDone }: { last: number[][]; onDone: (score: number) => void }) {
  const [proofed, setProofed] = useState<number | null>(null);
  if (proofed === null) return <Proofread onDone={setProofed} />;
  return (
    <div>
      <HowTo goal="вирішити, що робить ШІ, що лишається за людиною і як змінюється сама робота." steps={["Прочитайте ситуацію.", "Виберіть відповідь.", "Прочитайте пояснення і натисніть «Далі»."]} />
      <Questions key="last" label="Запитання" items={G.LAST_ASKS} orders={last} doneLabel="Завершити курс" onDone={(s) => onDone(proofed + s)} />
    </div>
  );
}

const ALL_MODULES = Array.from({ length: 14 }, (_, k) => `module-${String(k + 1).padStart(2, "0")}`);

const isCompleted = (slug: string) => {
  try {
    return !!JSON.parse(localStorage.getItem(`vikha-assignment-${slug}`) ?? "null")?.completedAt;
  } catch {
    return false;
  }
};

// The end of the course. Rendered only after the last level, so storage is there to read.
function CourseFinish() {
  const [done] = useState(() => ALL_MODULES.filter(isCompleted));
  return (
    <div className="mt-8 rounded-[4px] bg-accent-soft p-4 sm:p-5">
      <p className="font-display text-xl font-semibold">{done.length === ALL_MODULES.length ? "Курс пройдено" : "Це останнє завдання курсу"}</p>
      <ol className="mt-3 flex flex-wrap gap-2" aria-label="Завдання модулів">
        {ALL_MODULES.map((slug, k) => {
          const on = done.includes(slug);
          return (
            <li key={slug}>
              <a href={assignmentHref(slug)} title={`Завдання модуля ${k + 1}`} aria-label={`Завдання модуля ${k + 1}${on ? ", пройдено" : ""}`} className="grid size-6 place-items-center">
                <span aria-hidden className={`block size-3.5 rotate-45 rounded-[2px] ${on ? "bg-accent" : "bg-foreground/15"}`} />
              </a>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-sm text-muted tabular-nums">
        Завдань пройдено: {done.length} з {ALL_MODULES.length}.
        {done.length < ALL_MODULES.length && " Сірі ромби ведуть до завдань, які ще можна пройти."}
      </p>
      <p className="mt-3 max-w-[60ch] leading-relaxed">
        Навичка з&apos;являється в практиці. Візьміть невеликий проєкт, свій, робочий чи волонтерський, і пройдіть його за курсом: статут, зацікавлені сторони, зміст, розклад, бюджет, ризики, якість, закриття.
      </p>
    </div>
  );
}

export function AfterReleaseGame() {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-14"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        metrics: shuffled(G.METRIC_CARDS.length),
        cases: shuffled(G.BONUS_CASES.length),
        caseOptions: G.BONUS_CASES.map((c) => ({ hack: shuffled(c.hack.options.length), pair: shuffled(c.pair.options.length) })),
        letters: shuffled(G.LETTERS.length),
        stop: [shuffled(G.STOP_ASK.options.length)],
        lessons: shuffled(G.LESSON_CARDS.length),
        checks: [G.OWNER_ASK.options, G.CHECK_3_OPTIONS, G.CHECK_6_OPTIONS, G.CHECK_12_OPTIONS].map((o) => shuffled(o.length)),
        last: G.LAST_ASKS.map((q) => shuffled(q.options.length)),
      })}
      levels={[
        { name: "Панель після релізу", play: (o, done) => <PanelLevel metrics={o.metrics} onDone={done} /> },
        { name: "Премія для команди", play: (o, done) => <BonusLevel cases={o.cases} options={o.caseOptions} onDone={done} /> },
        { name: "Зомбі-проєкт", play: (o, done) => <ZombieLevel letters={o.letters} stop={o.stop} lessons={o.lessons} onDone={done} /> },
        { name: "Три перевірки", play: (o, done) => <ChecksLevel orders={o.checks} onDone={done} /> },
        { name: "Чернетка від ШІ", play: (o, done) => <AiLevel last={o.last} onDone={done} /> },
      ]}
      startLabel="Почати"
      period="За гру"
      finalTitle="Чотирнадцята віха!"
      finalText="Модуль 14 пройдено. Тепер ви знаєте, як вибрати показники, чесно закрити проєкт і перевірити, чи настала вигода."
      nextHref="/my-project"
      nextLabel="До паспорта проєкту"
    >
      <CourseFinish />
      <BenefitBonus />
    </AssignmentGame>
  );
}
