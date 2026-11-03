"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { QualityBonus } from "@/components/my-project/project-quality";
import * as G from "@/content/assignments/module-12";
import { BUILD_MEAN, BUILDS, COMPLAINTS, LCL, TOLERANCE, UCL, outOfControl } from "@/content/examples/game-quality";
import { AssignmentGame, Feedback, HowTo, primary, shuffled } from "./game-kit";

type Orders = {
  reviews: number[];
  wishes: number[][];
  readings: number[];
  bill: number[];
  signals: number[];
  stop: number[];
  activities: number[];
  chart: number[][];
  stable: number[];
  pdca: number[];
  complaints: number[];
  versions: number[];
  whys: number[][];
};

const optionClass = (on: boolean, off: boolean) =>
  `rounded-md px-3 py-2 text-left text-sm font-medium leading-snug press ${
    on ? "bg-accent text-accent-foreground" : `bg-foreground/[0.07] enabled:hover:bg-foreground/[0.12] ${off ? "opacity-60" : ""}`
  }`;

const cardClass = (right: boolean, wrong: boolean) =>
  `flex flex-col gap-1 rounded-[6px] p-3 text-left leading-snug press ${
    right ? "bg-accent text-accent-foreground" : wrong ? "bg-foreground/[0.12]" : "bg-background enabled:hover:bg-foreground/[0.08] disabled:opacity-60"
  }`;

const fmt1 = (v: number) => new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v);

// A pile of cards, each answered with one of a few fixed choices. `above` draws
// whatever grows as cards get answered: a wheel, a skeleton.
function Deck<K extends string>({
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
  items: G.Card<K>[];
  order: number[];
  choices: G.Choice<K>[];
  columns?: string;
  doneLabel: string;
  above?: (answered: G.Card<K>[]) => ReactNode;
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
function Questions({
  label,
  items,
  orders,
  doneLabel,
  above,
  onDone,
}: {
  label?: string;
  items: G.Question[];
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

// Level 1: sort the players' letters between the team and the founders.
function InboxLevel({ reviews, onDone }: { reviews: number[]; onDone: (score: number) => void }) {
  return (
    <div>
      <HowTo
        goal="вирішити, кому передати кожен лист від гравця. Проблеми якості виправляє команда, а питання сорту вирішують засновники."
        steps={[
          "Прочитай лист від гравця.",
          "Запитай себе, чи гра порушує те, що обіцяла, чи гравець просто хоче іншу гру.",
          "Натисни на одну з двох кнопок. Гра пояснить відповідь, а кнопка «Далі» відкриє наступний лист.",
        ]}
        tip="Підказка: сорт показує, скільки можливостей має гра, а якість показує, чи вони працюють так, як обіцяно. Проста гра може бути якісною."
      />
      <Deck
        label="Лист"
        question="Кому передаєш цей лист?"
        items={G.REVIEWS}
        order={reviews}
        choices={G.DESKS}
        doneLabel="До наступного рівня"
        onDone={onDone}
      />
    </div>
  );
}

// Level 2: wishes become metrics, then the beta results meet the tolerance.
function NumberLevel({ wishes, readings, onDone }: { wishes: number[][]; readings: number[]; onDone: (score: number) => void }) {
  const [phase, setPhase] = useState<"wishes" | "stamps">("wishes");
  const [first, setFirst] = useState(0);
  const [i, setI] = useState(0);
  const [stamp, setStamp] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  if (phase === "wishes") {
    return (
      <div>
        <HowTo
          goal="перетворити побажання на вимоги, які можна перевірити."
          steps={[
            "Прочитай, чого хоче людина.",
            "Вибери вимогу, за якою будь-хто отримає той самий результат перевірки.",
            "Прочитай пояснення і натисни «Далі».",
          ]}
          tip="Підказка: добра вимога містить число або однозначний результат і пояснює, як його перевіряти. Слова на кшталт «дуже» нічого не вимірюють."
        />
        <Questions
          label="Побажання"
          items={G.WISHES}
          orders={wishes}
          doneLabel="До результатів бета-тесту"
          onDone={(s) => {
            setFirst(s);
            setPhase("stamps");
          }}
        />
      </div>
    );
  }

  const r = G.READINGS[readings[i]];
  const last = i === G.READINGS.length - 1;

  return (
    <div>
      <HowTo
        goal="порівняти кожен результат бета-тесту з вимогою і поставити штамп."
        steps={[
          "Прочитай вимогу і результат на картці.",
          "Постав штамп «Вкладається в допуск» або «Не вкладається». Допуск є межею, у якій результат ще прийнятний.",
          "Прочитай пояснення і натисни «Далі». Після останнього штампа гра покаже, чим закінчилася суперечка.",
        ]}
        tip="Підказка: результат не мусить збігатися з бажаним числом. Достатньо, щоб він не виходив за межу."
      />
      <p className="mt-5 text-sm text-muted tabular-nums">
        Результат {i + 1} з {G.READINGS.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-4 sm:p-5">
        <p className="font-display text-xl font-semibold">{r.metric}</p>
        <p className="mt-2 text-sm leading-relaxed">
          <span className="text-muted">Вимога:</span> {r.target}.
        </p>
        <p className="mt-1 text-sm">
          <span className="text-muted">Результат бета-тесту:</span> <strong className="font-semibold tabular-nums">{r.result}</strong>.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Штамп">
        {[
          { v: true, name: "Вкладається в допуск" },
          { v: false, name: "Не вкладається" },
        ].map((b) => (
          <button
            key={b.name}
            type="button"
            disabled={stamp !== null}
            aria-pressed={stamp === b.v}
            onClick={() => {
              setStamp(b.v);
              if (b.v === r.ok) setScore((v) => v + 1);
            }}
            className={optionClass(stamp !== null && b.v === r.ok, stamp !== null)}
          >
            {b.name}
          </button>
        ))}
      </div>
      {stamp !== null && (
        <div className="mt-4 space-y-4">
          <Feedback ok={stamp === r.ok}>{r.why}</Feedback>
          {last && <div className="rounded-[6px] bg-surface-raised p-4 leading-relaxed">{G.READINGS_VERDICT}</div>}
          <button
            type="button"
            onClick={() => {
              if (last) return onDone(first + score);
              setI(i + 1);
              setStamp(null);
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

// The two options as icebergs: what the budget shows and what it hides.
function Iceberg() {
  const top = Math.max(...G.ICEBERG.map((s) => s.total));
  const w = (v: number) => `${(v / top) * 100}%`;
  return (
    <figure className="rounded-[6px] bg-background p-4">
      <figcaption className="font-medium">Скільки коштує якість разом із дефектами, тис. грн</figcaption>
      <ul className="mt-3 space-y-4">
        {G.ICEBERG.map((s) => (
          <li key={s.name}>
            <p className="flex justify-between gap-3 text-sm">
              <span>{s.name}</span>
              <span className="font-display font-semibold tabular-nums">{s.total}</span>
            </p>
            <div aria-hidden className="mt-1 flex h-4 gap-0.5" style={{ width: w(s.total) }}>
              <span className="rounded-l-[2px] bg-sage" style={{ width: `${(s.visible / s.total) * 100}%` }} />
              <span className="flex-1 rounded-r-[2px] bg-accent" />
            </div>
            <p className="mt-1 text-[13px] text-muted tabular-nums">
              У бюджеті видно {s.visible}, а приховано {s.hidden}.
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-[2px] bg-sage" />
          запобігання й оцінювання
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-[2px] bg-accent" />
          внутрішні й зовнішні втрати
        </span>
      </div>
    </figure>
  );
}

// Level 3: sort the bill, bet on the saving, then stop or release.
function CostLevel({
  bill,
  signals,
  stop,
  onDone,
}: {
  bill: number[];
  signals: number[];
  stop: number[];
  onDone: (score: number) => void;
}) {
  const [phase, setPhase] = useState<"bill" | "bet" | "signals" | "stop">("bill");
  const [score, setScore] = useState(0);
  const [bet, setBet] = useState<string | null>(null);

  if (phase === "bill") {
    return (
      <div>
        <HowTo
          goal="розібратися, куди йдуть гроші на якість. Перші дві частини закладають у бюджет, а дві інші забирають дефекти."
          steps={[
            "Прочитай рядок із рахунку студії.",
            "Натисни на частину вартості якості, до якої він належить. Під кожною частиною написано, що до неї входить.",
            "Прочитай пояснення і натисни «Далі».",
          ]}
          tip="Підказка: запитай себе, чи дефект уже є. Якщо його ще немає, це запобігання. Якщо його шукають, це оцінювання. Якщо його виправляють, важливо, хто знайшов його першим."
        />
        <Deck
          key="bill"
          label="Рядок рахунку"
          question="До якої частини він належить?"
          items={G.BILL}
          order={bill}
          choices={G.PART_CHOICES}
          doneLabel="До пропозиції засновника"
          onDone={(s) => {
            setScore((v) => v + s);
            setPhase("bet");
          }}
        />
      </div>
    );
  }

  if (phase === "bet") {
    return (
      <div>
        <HowTo
          goal="оцінити, чи справді вигідно заощаджувати на якості."
          steps={[
            "Прочитай пропозицію засновника.",
            "Вибери варіант, який, на твою думку, обійдеться дешевше.",
            "Гра покаже витрати, яких не видно в бюджеті. Потім натисни «Далі».",
          ]}
        />
        <p className="mt-5 rounded-[6px] bg-surface-raised p-4 leading-relaxed sm:p-5">{G.BET_TEXT}</p>
        <div className="mt-4 grid gap-1.5" role="group" aria-label="Який варіант дешевший">
          {G.BETS.map((b) => (
            <button
              key={b.key}
              type="button"
              disabled={bet !== null}
              aria-pressed={bet === b.key}
              onClick={() => {
                setBet(b.key);
                if (b.key === "invest") setScore((v) => v + 1);
              }}
              className={`${optionClass(bet !== null && b.key === "invest", bet !== null)} ${bet === b.key && b.key !== "invest" ? "line-through decoration-2" : ""}`}
            >
              {b.name}
            </button>
          ))}
        </div>
        {bet && (
          <div className="mt-4 space-y-4">
            <Iceberg />
            <Feedback ok={bet === "invest"}>{G.BET_WHY}</Feedback>
            <button type="button" onClick={() => setPhase("signals")} className={primary}>
              Далі
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === "signals") {
    return (
      <div>
        <HowTo
          goal="вирішити, які сигнали перед релізом справді зупиняють роботу. Це право і обов'язок кожного в команді."
          steps={[
            "Прочитай сигнал.",
            "Вибери, чи зупинити реліз, чи записати задачу й випускати гру.",
            "Прочитай пояснення і натисни «Далі».",
          ]}
          tip="Підказка: порівняй сигнал із вимогами. Якщо вимога порушена і гравці постраждають, реліз зупиняють. Якщо результат у межах допуску, зупиняти нічого."
        />
        <Deck
          key="signals"
          label="Сигнал"
          question="Що робимо?"
          items={G.SIGNALS}
          order={signals}
          choices={G.SIGNAL_CHOICES}
          doneLabel="Далі"
          onDone={(s) => {
            setScore((v) => v + s);
            setPhase("stop");
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <HowTo
        goal="захистити людину, яка зупинила реліз. Шнур нічого не дає, якщо люди бояться за нього смикати."
        steps={["Прочитай, що сталося і що питає засновник.", "Вибери свою відповідь як керівника проєкту.", "Прочитай пояснення і переходь до наступного рівня."]}
      />
      <Questions key="stop" items={[G.STOP_ASK]} orders={[stop]} doneLabel="До наступного рівня" onDone={(s) => onDone(score + s)} />
    </div>
  );
}

const CW = 380;
const CH = 210;
const CP = { left: 34, right: 74, top: 12, bottom: 34 };
const C_MIN = 98.5;
const C_MAX = 100;
const cx = (k: number) => CP.left + ((k + 0.5) / BUILDS.length) * (CW - CP.left - CP.right);
const cy = (v: number) => CP.top + ((C_MAX - v) / (C_MAX - C_MIN)) * (CH - CP.top - CP.bottom);

// The control chart of all twelve builds, one of them in focus.
function BuildChart({ focus, answered }: { focus: number; answered: boolean }) {
  const line = BUILDS.map((v, k) => `${k === 0 ? "M" : "L"}${cx(k)} ${cy(v)}`).join(" ");
  const value = BUILDS[focus - 1];
  return (
    <figure className="rounded-[6px] bg-background p-3 sm:p-4">
      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        className="w-full"
        role="img"
        aria-label={`Частка сесій без вильотів по збірках 1–12. Збірка ${focus}: ${fmt1(value)}%, межі контролю від ${fmt1(LCL)} до ${fmt1(UCL)}, допуск ${fmt1(TOLERANCE)}.`}
      >
        {[98.5, 99, 99.5, 100].map((t) => (
          <text key={t} x={CP.left - 5} y={cy(t) + 3} textAnchor="end" className="fill-muted text-[10px] tabular-nums">
            {fmt1(t)}
          </text>
        ))}
        {[UCL, LCL].map((v) => (
          <line key={v} x1={CP.left} x2={CW - CP.right} y1={cy(v)} y2={cy(v)} className="stroke-foreground/70" strokeWidth={1.5} strokeDasharray="5 4" />
        ))}
        <line x1={CP.left} x2={CW - CP.right} y1={cy(BUILD_MEAN)} y2={cy(BUILD_MEAN)} className="stroke-muted" />
        <line x1={CP.left} x2={CW - CP.right} y1={cy(TOLERANCE)} y2={cy(TOLERANCE)} className="stroke-sage" strokeWidth={1.5} />
        {[
          { label: "верхня межа", y: cy(UCL) + 3 },
          { label: "середнє", y: cy(BUILD_MEAN) - 1 },
          { label: "допуск", y: cy(TOLERANCE) + 9 },
          { label: "нижня межа", y: cy(LCL) + 3 },
        ].map((l) => (
          <text key={l.label} x={CW - CP.right + 5} y={l.y} className="fill-muted text-[10px]">
            {l.label}
          </text>
        ))}
        <path d={line} fill="none" className="stroke-foreground/50" strokeWidth={1.5} />
        {BUILDS.map((v, k) => {
          const on = k === focus - 1;
          return (
            <g key={k}>
              {on && <circle cx={cx(k)} cy={cy(v)} r={8} fill="none" className="stroke-accent" strokeWidth={2} />}
              <circle cx={cx(k)} cy={cy(v)} r={on ? 4.5 : 3} className={outOfControl(v) || on ? "fill-accent" : "fill-foreground"} />
              <text x={cx(k)} y={CH - CP.bottom + 14} textAnchor="middle" className={`text-[10px] tabular-nums ${on ? "fill-foreground font-semibold" : "fill-muted"}`}>
                {k + 1}
              </text>
            </g>
          );
        })}
        <text x={(CP.left + CW - CP.right) / 2} y={CH - 4} textAnchor="middle" className="fill-muted text-[10px]">
          номер збірки
        </text>
      </svg>
      <figcaption className="mt-1 text-[13px] text-muted">
        Частка сесій без вильотів, %. Зараз обговорюємо збірку {focus}: {fmt1(value)}%.
        {answered && ` Межі контролю лежать від ${fmt1(LCL)}% до ${fmt1(UCL)}%, а допуск становить ${fmt1(TOLERANCE)}%.`}
      </figcaption>
    </figure>
  );
}

const WHEEL_CLOCKWISE: G.Pdca[] = ["plan", "do", "act", "check"];

// The PDCA wheel, filling up sector by sector.
function PdcaWheel({ answered }: { answered: G.Card<G.Pdca>[] }) {
  return (
    <div className="grid grid-cols-2 gap-1.5" aria-label="Колесо PDCA">
      {WHEEL_CLOCKWISE.map((key) => {
        const sector = G.PDCA_CHOICES.find((c) => c.key === key)!;
        const card = answered.find((a) => a.answer === key);
        return (
          <div key={key} className={`min-h-20 rounded-[6px] p-3 text-sm leading-snug ${card ? "bg-accent-soft" : "bg-background"}`}>
            <p className="font-display font-semibold">{sector.name}</p>
            {card && <p className="mt-1 text-[13px]">{card.text}</p>}
          </div>
        );
      })}
    </div>
  );
}

// Level 4: three kinds of quality work, the control chart, the PDCA wheel.
function BuildsLevel({
  activities,
  chart,
  stable,
  pdca,
  onDone,
}: {
  activities: number[];
  chart: number[][];
  stable: number[];
  pdca: number[];
  onDone: (score: number) => void;
}) {
  const [phase, setPhase] = useState<"sort" | "chart" | "stable" | "wheel">("sort");
  const [score, setScore] = useState(0);
  const add = (s: number, next: typeof phase) => {
    setScore((v) => v + s);
    setPhase(next);
  };

  if (phase === "sort") {
    return (
      <div>
        <HowTo
          goal="розрізнити три частини роботи з якістю. Планування задає показники, забезпечення стежить за процесом, а контроль перевіряє результат."
          steps={["Прочитай, що робить команда.", "Вибери, до якої частини це належить. Під кожною назвою є запитання, на яке вона відповідає.", "Прочитай пояснення і натисни «Далі»."]}
          tip="Підказка: якщо вже є готовий рівень і його міряють, це контроль. Якщо команда домовляється, як працювати, це забезпечення."
        />
        <Deck
          label="Дія"
          question="До якої частини вона належить?"
          items={G.ACTIVITIES}
          order={activities}
          choices={G.ACTIVITY_CHOICES}
          columns="sm:grid-cols-3"
          doneLabel="До контрольної карти"
          onDone={(s) => add(s, "chart")}
        />
      </div>
    );
  }

  if (phase === "chart") {
    return (
      <div>
        <HowTo
          goal="відрізнити звичайне коливання від справжньої проблеми. Менеджер панікує чотири рази, і щоразу треба вирішити, що робити."
          steps={[
            "На карті кожна точка показує одну збірку, а кружечком обведено ту, про яку пише менеджер.",
            "Подивись, чи лежить ця точка між двома пунктирними межами контролю.",
            "Прочитай повідомлення і вибери, що робиш.",
          ]}
          tip="Підказка: поки точка між межами, процес поводиться як завжди, і реагувати на кожне коливання не треба. Зелена лінія показує допуск, тобто вимогу замовника."
        />
        <Questions
          key="chart"
          label="Повідомлення"
          items={G.CHART_QUESTIONS}
          orders={chart}
          doneLabel="Далі"
          above={(i, answered) => <BuildChart focus={G.CHART_QUESTIONS[i].build} answered={answered} />}
          onDone={(s) => add(s, "stable")}
        />
      </div>
    );
  }

  if (phase === "stable") {
    return (
      <div>
        <HowTo
          goal="зрозуміти різницю між межами контролю і допуском."
          steps={["Прочитай ситуацію сусіднього проєкту.", "Вибери, що вона означає.", "Прочитай пояснення і натисни «До колеса»."]}
        />
        <Questions key="stable" items={[G.STABLE_ASK]} orders={[stable]} doneLabel="До колеса" onDone={(s) => add(s, "wheel")} />
      </div>
    );
  }

  return (
    <div>
      <HowTo
        goal="пройти цикл PDCA на історії зі збіркою 9 і поставити кожен крок у свій сектор колеса."
        steps={["Прочитай, що зробила команда.", "Вибери сектор: план, зробити, перевірити чи діяти. Крок одразу ляже на колесо.", "Прочитай пояснення і натисни «Далі»."]}
        tip="Підказка: картки йдуть у випадковому порядку, тому спершу подумай, що в цій історії мало статися раніше."
      />
      <Deck
        label="Крок"
        question="До якого сектора він належить?"
        items={G.PDCA_CARDS}
        order={pdca}
        choices={G.PDCA_CHOICES}
        doneLabel="До наступного рівня"
        above={(answered) => <PdcaWheel answered={answered} />}
        onDone={(s) => onDone(score + s)}
      />
    </div>
  );
}

// The check sheet: pick two fixes, then see the Pareto chart.
function ParetoStep({ order, onDone }: { order: number[]; onDone: (score: number) => void }) {
  const [picks, setPicks] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const shares = picks.reduce((s, n) => s + COMPLAINTS.find((c) => c.name === n)!.count, 0);
  const right = G.TOP_FIXES.every((n) => picks.includes(n));
  const top = G.SORTED_COMPLAINTS[0].count;

  const toggle = (name: string) => setPicks((v) => (v.includes(name) ? v.filter((x) => x !== name) : v.length < 2 ? [...v, name] : v));

  return (
    <div>
      <HowTo
        goal="з'ясувати, з чого почати. Сил вистачить лише на дві правки, тому вони мають закрити якомога більше скарг."
        steps={[
          "Перед тобою контрольний листок: 100 скарг із бета-тесту, розкладених за причинами.",
          "Натисни на дві причини, які виправиш першими.",
          "Натисни «Перевірити». Гра побудує діаграму Парето і покаже, яку частку скарг закриває твій вибір.",
        ]}
        tip="Підказка: причини нерівноцінні, тому порівнюй кількість скарг, а не те, що здається найнеприємнішим."
      />
      <div className="mt-5 grid gap-1.5" role="group" aria-label="Контрольний листок">
        {order.map((k) => COMPLAINTS[k]).map((c) => (
          <button
            key={c.name}
            type="button"
            disabled={checked}
            aria-pressed={picks.includes(c.name)}
            onClick={() => toggle(c.name)}
            className={`flex items-center justify-between gap-3 ${optionClass(picks.includes(c.name), checked)}`}
          >
            <span>{c.name}</span>
            <span className="font-display font-semibold tabular-nums">{c.count}</span>
          </button>
        ))}
      </div>
      {!checked ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setChecked(true)} disabled={picks.length < 2} className={primary}>
            Перевірити
          </button>
          {picks.length < 2 && <span className="text-sm text-muted">Вибери дві причини.</span>}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <figure className="rounded-[6px] bg-background p-4">
            <figcaption className="font-medium">Діаграма Парето: скарги від найчастішої причини до найрідшої</figcaption>
            <ul className="mt-3 space-y-2">
              {G.SORTED_COMPLAINTS.map((c) => (
                <li key={c.name} className="text-sm">
                  <p className="flex justify-between gap-3">
                    <span>{c.name}</span>
                    <span className="text-muted tabular-nums">
                      {c.count}, разом {c.running}%
                    </span>
                  </p>
                  <div aria-hidden className="mt-1 h-2.5 rounded-[2px] bg-foreground/[0.07]">
                    <div className={`h-full rounded-[2px] ${picks.includes(c.name) ? "bg-accent" : "bg-foreground/40"}`} style={{ width: `${(c.count / top) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] text-muted">Твій вибір виділено кольором. Він закриває {shares}% скарг.</p>
          </figure>
          <Feedback ok={right}>
            {right
              ? `Дві причини з шести дають ${G.TOP_SHARE}% скарг, тому починати варто саме з них.`
              : `Твої правки закривають ${shares}% скарг, а вильоти на старих Android і довге завантаження дали б ${G.TOP_SHARE}%. Невелика частина причин дає більшість проблем.`}
          </Feedback>
          <button type="button" onClick={() => onDone(right ? 1 : 0)} className={primary}>
            До «риб&apos;ячого скелета»
          </button>
        </div>
      )}
    </div>
  );
}

// The Ishikawa skeleton, its bones filling up with versions.
function Skeleton({ answered }: { answered: G.Card<string>[] }) {
  return (
    <div className="rounded-[6px] bg-background p-3">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_7.5rem] sm:items-center">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {G.BONE_CHOICES.map((b) => {
            const card = answered.find((a) => a.answer === b.key);
            return (
              <div key={b.key} className={`min-h-16 rounded-[4px] border-l-2 p-2 text-[13px] leading-snug ${card ? "border-accent bg-accent-soft" : "border-foreground/30 bg-foreground/[0.04]"}`}>
                <p className="font-medium">{b.name}</p>
                {card && <p className="mt-0.5">{card.text}</p>}
              </div>
            );
          })}
        </div>
        <p className="rounded-[4px] bg-accent-soft p-2 text-center text-[13px] font-medium leading-snug">40% гравців кидають гру на 3-му рівні</p>
      </div>
    </div>
  );
}

// The chain of «why» so far, ending with the current question.
function WhyChain({ count }: { count: number }) {
  return (
    <ol className="space-y-1 text-sm leading-snug">
      {G.WHYS.slice(0, count).map((q, k) => (
        <li key={q.text} className="rounded-[4px] bg-background p-2.5" style={{ marginLeft: `${k * 0.5}rem` }}>
          <span className="text-muted">{q.text}</span> {q.options.find((o) => o.right)!.text}
        </li>
      ))}
    </ol>
  );
}

// Level 5: Pareto, then the fishbone, then the five whys.
function InquiryLevel({ complaints, versions, whys, onDone }: { complaints: number[]; versions: number[]; whys: number[][]; onDone: (score: number) => void }) {
  const [phase, setPhase] = useState<"pareto" | "fish" | "whys">("pareto");
  const [score, setScore] = useState(0);
  const [root, setRoot] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (root !== null) rootRef.current?.scrollIntoView({ block: "start" });
  }, [root]);

  if (phase === "pareto") {
    return (
      <ParetoStep
        order={complaints}
        onDone={(s) => {
          setScore(s);
          setPhase("fish");
        }}
      />
    );
  }

  if (phase === "fish") {
    return (
      <div>
        <HowTo
          goal="розкласти версії, чому гравці кидають 3-й рівень, за групами причин. Діаграма Ісікави дає версії, а відповідь дають дані."
          steps={[
            "Прочитай версію причини.",
            "Натисни на групу причин, до якої вона належить. Версія ляже на кістку «скелета».",
            "Прочитай, як цю версію перевіряють, і натисни «Далі».",
          ]}
          tip="Підказка: кістка «Процес» лишиться порожньою. До неї ти дійдеш на наступному кроці через «5 чому»."
        />
        <Deck
          label="Версія"
          question="До якої групи вона належить?"
          items={G.VERSIONS}
          order={versions}
          choices={G.BONE_CHOICES}
          columns="grid-cols-2 sm:grid-cols-3"
          doneLabel="До «5 чому»"
          above={(answered) => <Skeleton answered={answered} />}
          onDone={(s) => {
            setScore((v) => v + s);
            setPhase("whys");
          }}
        />
      </div>
    );
  }

  if (root !== null) {
    return (
      <div ref={rootRef} className="scroll-mt-4 space-y-4">
        <WhyChain count={G.WHYS.length} />
        <div className="rounded-[6px] bg-surface-raised p-4 leading-relaxed">{G.ROOT_NOTE}</div>
        <button type="button" onClick={() => onDone(score + root)} className={primary}>
          Завершити гру
        </button>
      </div>
    );
  }

  return (
    <div>
      <HowTo
        goal="докопатися до причини, яку можна усунути. Питай «чому?», доки не дійдеш до неї."
        steps={[
          "Прочитай запитання.",
          "Вибери відповідь, яка спирається на факт і веде глибше.",
          "Правильна відповідь ляже в ланцюжок за будь-якого вибору. Натисни «Далі», щоб поставити наступне «чому?».",
        ]}
        tip="Підказка: відповідь, яка звинувачує людину, зупиняє пошук. Відповідь, яка повторює запитання, теж нікуди не веде."
      />
      <Questions
        label="Чому"
        items={G.WHYS}
        orders={whys}
        doneLabel="Подивитися корінь проблеми"
        above={(i, answered) => <WhyChain count={answered ? i + 1 : i} />}
        onDone={setRoot}
      />
    </div>
  );
}

export function QualityGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-12"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        reviews: shuffled(G.REVIEWS.length),
        wishes: G.WISHES.map((q) => shuffled(q.options.length)),
        readings: shuffled(G.READINGS.length),
        bill: shuffled(G.BILL.length),
        signals: shuffled(G.SIGNALS.length),
        stop: shuffled(G.STOP_ASK.options.length),
        activities: shuffled(G.ACTIVITIES.length),
        chart: G.CHART_QUESTIONS.map((q) => shuffled(q.options.length)),
        stable: shuffled(G.STABLE_ASK.options.length),
        pdca: shuffled(G.PDCA_CARDS.length),
        complaints: shuffled(COMPLAINTS.length),
        versions: shuffled(G.VERSIONS.length),
        whys: G.WHYS.map((q) => shuffled(q.options.length)),
      })}
      levels={[
        { name: "Скринька відгуків", play: (o, done) => <InboxLevel reviews={o.reviews} onDone={done} /> },
        { name: "Число замість слова", play: (o, done) => <NumberLevel wishes={o.wishes} readings={o.readings} onDone={done} /> },
        { name: "Рахунок і шнур", play: (o, done) => <CostLevel bill={o.bill} signals={o.signals} stop={o.stop} onDone={done} /> },
        { name: "Збірки", play: (o, done) => <BuildsLevel activities={o.activities} chart={o.chart} stable={o.stable} pdca={o.pdca} onDone={done} /> },
        { name: "Слідство", play: (o, done) => <InquiryLevel complaints={o.complaints} versions={o.versions} whys={o.whys} onDone={done} /> },
      ]}
      startLabel="Почати"
      period="За гру"
      finalTitle="Дванадцята віха!"
      finalText="Модуль 12 пройдено. Далі можна розкласти роботу на перші задачі й вести її на дошці."
      nextHref={nextHref}
      nextLabel="До модуля 13"
    >
      <QualityBonus />
    </AssignmentGame>
  );
}
