"use client";

import { useState, type ReactNode } from "react";
import { BoardBonus } from "@/components/my-project/project-board";
import * as G from "@/content/assignments/module-13";
import type { Card } from "@/content/assignments/types";
import { AssignmentGame, chip, Deck, Feedback, HowTo, optionClass, primary, Questions, shuffled } from "./game-kit";

type Orders = {
  scenes: number[];
  stories: number[];
  poker: number[];
  events: number[];
  sprint: number[][];
  lanes: number[];
  flow: number[][];
  wastes: number[];
  teams: number[];
  last: number[][];
};

const dayWord = (n: number) => (n === 1 ? "день" : n >= 2 && n <= 4 ? "дні" : "днів");
const hours = (h: number) => (h < 1 ? `${h * 60} хв` : `${new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 }).format(h)} год`);

// Level 1: walk past the teams and tell what you see.
function PaperLevel({ scenes, onDone }: { scenes: number[]; onDone: (score: number) => void }) {
  return (
    <div>
      <HowTo
        goal="відрізнити справжню гнучку роботу від формальності. Назви й зустрічі ще нічого не доводять."
        steps={[
          "Прочитайте, що відбувається в команді.",
          "Виберіть, що ви бачите: живий Agile чи Agile на папері.",
          "Прочитайте пояснення і натисніть «Далі».",
        ]}
        tip="Підказка: запитайте себе, чи ця дія щось змінює в роботі. Маніфест не скасовує план і документацію, він лише ставить людей і робочий результат вище."
      />
      <Deck key="scenes" label="Сцена" question="Що ви бачите?" items={G.SCENES} order={scenes} choices={G.VERDICTS} doneLabel="До наступного рівня" onDone={onDone} />
    </div>
  );
}

// Level 2, step 2: load the sprint with what leads to the goal.
function SprintLoad({ onDone }: { onDone: (score: number) => void }) {
  const [picks, setPicks] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const points = G.SPRINT_STORIES.filter((s) => picks.includes(s.name)).reduce((a, s) => a + s.points, 0);
  const over = points > G.CAPACITY;
  const right = G.SPRINT_STORIES.every((s) => s.goal === picks.includes(s.name));
  const missing = G.SPRINT_STORIES.filter((s) => s.goal && !picks.includes(s.name));
  const extra = G.SPRINT_STORIES.filter((s) => !s.goal && picks.includes(s.name));

  const toggle = (name: string) => setPicks((v) => (v.includes(name) ? v.filter((x) => x !== name) : [...v, name]));

  return (
    <div>
      <HowTo
        goal="вибрати на спринт ті історії, що ведуть до цілі, і вкластися в можливості команди."
        steps={[
          `Прочитайте ціль спринту. Команда закриває близько ${G.CAPACITY} поінтів.`,
          "Натискайте на історії, які берете. Лічильник угорі покаже, скільки поінтів уже заплановано.",
          "Коли набір готовий, натисніть «Почати спринт». Кнопка не спрацює, якщо поінтів забагато.",
        ]}
        tip="Підказка: питайте про кожну історію, чи наближає вона до цілі. Те, що історія маленька, ще не причина її брати."
      />
      <div className="mt-5 rounded-[6px] bg-surface-raised p-4 leading-relaxed sm:p-5">
        <span className="text-muted">Ціль спринту:</span> {G.SPRINT_GOAL}.
      </div>
      <div className="sticky top-2 z-10 mt-3 rounded-[6px] bg-surface-raised p-3 shadow-sm" aria-live="polite">
        <div className="flex flex-wrap justify-between gap-x-3 text-sm">
          <span className="font-medium">Заплановано поінтів</span>
          <span className={`font-display font-semibold tabular-nums ${over ? "text-accent" : ""}`}>
            {points} з {G.CAPACITY}
          </span>
        </div>
        <div aria-hidden className="mt-1.5 h-2 overflow-hidden rounded-full bg-foreground/15">
          <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, (points / G.CAPACITY) * 100)}%` }} />
        </div>
      </div>
      <div className="mt-3 grid gap-1.5" role="group" aria-label="Історії беклогу">
        {G.SPRINT_STORIES.map((s) => (
          <button
            key={s.name}
            type="button"
            disabled={checked}
            aria-pressed={picks.includes(s.name)}
            onClick={() => toggle(s.name)}
            className={`flex items-center justify-between gap-3 ${optionClass(picks.includes(s.name), checked)}`}
          >
            <span>{s.name}</span>
            <span className="shrink-0 font-display font-semibold tabular-nums">{s.points}</span>
          </button>
        ))}
      </div>
      {!checked ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setChecked(true)} disabled={picks.length === 0 || over} className={primary}>
            Почати спринт
          </button>
          {picks.length === 0 && <span className="text-sm text-muted">Виберіть хоча б одну історію.</span>}
          {over && <span className="text-sm text-muted">Поінтів забагато, тому приберіть частину історій.</span>}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <Feedback ok={right}>
            {right
              ? `Чотири історії разом дають ${G.GOAL_POINTS} поінти і повністю ведуть до цілі. Один вільний поінт лишається запасом, а скін можна взяти наступного разу.`
              : [
                  missing.length > 0 && `Без цих історій цілі не досягти: ${missing.map((s) => s.name).join(", ")}.`,
                  extra.length > 0 && `Ці історії до цілі не ведуть: ${extra.map((s) => s.name).join(", ")}.`,
                ]
                  .filter(Boolean)
                  .join(" ")}
          </Feedback>
          <button type="button" onClick={() => onDone(right ? 1 : 0)} className={primary}>
            До покеру планування
          </button>
        </div>
      )}
    </div>
  );
}

// Level 2: broken stories, the sprint, planning poker.
function BacklogLevel({ stories, poker, onDone }: { stories: number[]; poker: number[]; onDone: (score: number) => void }) {
  const [phase, setPhase] = useState<"stories" | "sprint" | "poker">("stories");
  const [score, setScore] = useState(0);
  const add = (s: number, next: typeof phase) => {
    setScore((v) => v + s);
    setPhase(next);
  };

  if (phase === "stories") {
    return (
      <div>
        <HowTo
          goal="знайти ваду в кожній користувацькій історії. Добру історію перевіряють за шістьма ознаками INVEST."
          steps={["Прочитайте історію з беклогу.", "Виберіть ознаку, якої їй бракує. Під кожною назвою написано, що вона означає.", "Прочитайте пояснення і натисніть «Далі»."]}
          tip="Підказка: у кожній історії порушено одну ознаку, яка найбільше впадає в очі."
        />
        <Deck
          key="stories"
          label="Історія"
          question="Якої ознаки їй бракує?"
          items={G.BAD_STORIES}
          order={stories}
          choices={G.INVEST_CHOICES}
          columns="grid-cols-2 sm:grid-cols-3"
          doneLabel="До планування спринту"
          onDone={(s) => add(s, "sprint")}
        />
      </div>
    );
  }

  if (phase === "sprint") return <SprintLoad onDone={(s) => add(s, "poker")} />;

  return (
    <div>
      <HowTo
        goal="зрозуміти, навіщо потрібен покер планування. Важлива не лише оцінка, а й розмова про неї."
        steps={["Подивіться, які картки показали учасники.", "Виберіть, що робите далі.", "Прочитайте пояснення і переходьте до наступного рівня."]}
      />
      <Questions
        key="poker"
        items={[G.POKER_ASK]}
        orders={[poker]}
        doneLabel="До наступного рівня"
        above={() => (
          <ul className="flex flex-wrap justify-center gap-3" aria-label="Оцінки учасників">
            {G.POKER_VOTES.map((v) => (
              <li key={v.who} className="flex w-24 flex-col items-center gap-1 rounded-[6px] bg-surface-raised p-3 text-center">
                <span className="font-display text-3xl font-semibold tabular-nums text-accent">{v.vote}</span>
                <span className="text-[13px] leading-tight text-muted">{v.who}</span>
              </li>
            ))}
          </ul>
        )}
        onDone={(s) => onDone(score + s)}
      />
    </div>
  );
}

const DAY_NUMBERS = Array.from({ length: G.SPRINT_DAYS }, (_, k) => k + 1);

// A two-week sprint with every day numbered; the events fill up with cards.
function SprintStrip({ answered }: { answered: Card<G.Event>[] }) {
  const rows: { key: G.Event; from: number; to: number }[] = [
    { key: "planning", from: 1, to: 1 },
    { key: "daily", from: 1, to: G.SPRINT_DAYS },
    { key: "review", from: G.SPRINT_DAYS, to: G.SPRINT_DAYS },
    { key: "retro", from: G.SPRINT_DAYS, to: G.SPRINT_DAYS },
  ];
  return (
    <div className="rounded-[6px] bg-background p-3" aria-label="Двотижневий спринт">
      <p className="text-[13px] text-muted">Робочий день спринту</p>
      <div aria-hidden className="mt-1 grid grid-cols-10 gap-0.5 text-center text-[12px] text-muted tabular-nums">
        {DAY_NUMBERS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <ul className="mt-2 space-y-2">
        {rows.map((r) => {
          const choice = G.EVENT_CHOICES.find((c) => c.key === r.key)!;
          const cards = answered.filter((a) => a.answer === r.key);
          return (
            <li key={r.key}>
              <div aria-hidden className="grid grid-cols-10 gap-0.5">
                {DAY_NUMBERS.map((d) => (
                  <span key={d} className={`h-2 rounded-[1px] ${d >= r.from && d <= r.to ? "bg-accent" : "bg-foreground/[0.07]"}`} />
                ))}
              </div>
              <p className="mt-1 text-sm font-medium">{choice.name}</p>
              {cards.length > 0 && (
                <ul className="mt-0.5 space-y-0.5 text-[13px] leading-snug text-muted">
                  {cards.map((c) => (
                    <li key={c.text}>{c.text}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Level 3: put what happens on the sprint, then handle the middle of it.
function SprintLevel({ events, sprint, onDone }: { events: number[]; sprint: number[][]; onDone: (score: number) => void }) {
  const [phase, setPhase] = useState<"events" | "asks">("events");
  const [score, setScore] = useState(0);

  if (phase === "events") {
    return (
      <div>
        <HowTo
          goal="розібратися, що й коли відбувається у двотижневому спринті."
          steps={["Прочитайте, що робить команда.", "Виберіть подію, на якій це відбувається. Картка ляже на стрічку спринту.", "Прочитайте пояснення і натисніть «Далі»."]}
          tip="Підказка: огляд спринту стосується продукту, а ретроспектива стосується того, як працювала команда. Обидві події припадають на останній день."
        />
        <Deck
          key="events"
          label="Картка"
          question="На якій події це відбувається?"
          items={G.EVENT_CARDS}
          order={events}
          choices={G.EVENT_CHOICES}
          above={(answered) => <SprintStrip answered={answered} />}
          doneLabel="До ситуацій посеред спринту"
          onDone={(s) => {
            setScore(s);
            setPhase("asks");
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <HowTo
        goal="утримати спринт, коли посеред нього щось іде не за планом."
        steps={["Прочитайте, що сталося.", "Виберіть, що має статися далі.", "Прочитайте пояснення і натисніть «Далі»."]}
        tip="Підказка: довжина спринту фіксована, а що робити першим, вирішує власник продукту."
      />
      <Questions key="asks" label="Ситуація" items={G.SPRINT_ASKS} orders={sprint} doneLabel="До наступного рівня" onDone={(s) => onDone(score + s)} />
    </div>
  );
}

function BoardColumn({ name, count, limit, children }: { name: string; count: number; limit?: number; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-[4px] bg-background p-2">
      <p className="flex justify-between gap-2 text-[13px] text-muted">
        <span>{name}</span>
        <span className="tabular-nums">{limit ? `${count} з ${limit}` : count}</span>
      </p>
      <ul className="mt-1.5 space-y-1">{children}</ul>
    </div>
  );
}

// Level 4, step 1: run the board day by day under a limit of your choice.
function BoardRun({ onDone }: { onDone: (score: number) => void }) {
  const [limit, setLimit] = useState(G.START_LIMIT);
  const [day, setDay] = useState(0);
  const [firstRun, setFirstRun] = useState(true);
  const [score, setScore] = useState<number | null>(null);
  const finished = day === G.BOARD_TASKS.length;
  const board = G.boardAt(limit, day);
  const reached = limit <= G.GOAL_DAYS;
  const pickingAllowed = !firstRun && day === 0;

  const nextDay = () => {
    const next = day + 1;
    setDay(next);
    if (next === G.BOARD_TASKS.length && !firstRun && score === null) setScore(reached ? 1 : 0);
  };
  const again = () => {
    setFirstRun(false);
    setDay(0);
    setLimit(G.GOAL_DAYS + 1);
  };

  return (
    <div>
      <HowTo
        goal={`зробити так, щоб кожна задача йшла не довше ${G.GOAL_DAYS} днів. Команда закриває одну задачу на день за будь-якого обмеження.`}
        steps={[
          `Спершу подивіться, як працює дошка, коли в роботі ${G.START_LIMIT} задач. Натискайте «Наступний день», доки всі задачі не будуть готові.`,
          "На кожній готовій картці написано, скільки днів вона була в роботі.",
          "Потім виберіть своє обмеження незавершеної роботи і пройдіть дошку ще раз.",
        ]}
        tip="Підказка: поки в роботі багато задач, кожна чекає своєї черги, хоча команда працює так само швидко."
      />

      {pickingAllowed && (
        <div className="mt-5">
          <p className="font-medium">Яке обмеження незавершеної роботи ставите?</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Обмеження незавершеної роботи">
            {G.LIMITS.map((l) => (
              <button key={l} type="button" aria-pressed={limit === l} onClick={() => setLimit(l)} className={`${chip(limit === l)} tabular-nums`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-5 text-sm text-muted tabular-nums">
        Минуло днів: {day} з {G.BOARD_TASKS.length}. Обмеження: {limit}.
      </p>
      <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3" aria-live="polite">
        <BoardColumn name="Черга" count={board.queue.length}>
          {board.queue.map((t) => (
            <li key={t} className="rounded-[3px] bg-foreground/[0.06] px-2 py-1.5 text-[13px] leading-snug">
              {t}
            </li>
          ))}
        </BoardColumn>
        <BoardColumn name="В роботі" count={board.doing.length} limit={limit}>
          {board.doing.map((c) => (
            <li key={c.task} className="rounded-[3px] bg-accent-soft px-2 py-1.5 text-[13px] leading-snug">
              {c.task}
              <span className="block text-[12px] text-muted tabular-nums">
                уже в роботі: {c.age} {dayWord(c.age)}
              </span>
            </li>
          ))}
        </BoardColumn>
        <BoardColumn name="Готово" count={board.done.length}>
          {board.done.map((c) => (
            <li key={c.task} className="rounded-[3px] bg-foreground/[0.06] px-2 py-1.5 text-[13px] leading-snug">
              {c.task}
              <span className="block text-[12px] text-muted tabular-nums">
                в роботі: {c.age} {dayWord(c.age)}
              </span>
            </li>
          ))}
        </BoardColumn>
      </div>

      <div className="mt-4 space-y-4">
        {!finished ? (
          <button type="button" onClick={nextDay} className={primary}>
            Наступний день
          </button>
        ) : firstRun ? (
          <>
            <div className="rounded-[6px] bg-surface-raised p-4 leading-relaxed">
              Команда закрила {G.BOARD_TASKS.length} задач за {G.BOARD_TASKS.length} днів, але кожна задача йшла {limit} днів. Скарга про вильоти теж чекала весь цей час. Тепер спробуйте обмежити незавершену роботу.
            </div>
            <button type="button" onClick={again} className={primary}>
              Вибрати обмеження
            </button>
          </>
        ) : (
          <>
            <Feedback ok={reached} title={reached ? "Так!" : "Ще завелике обмеження."}>
              {reached
                ? `Кожна задача тепер іде ${limit} ${dayWord(limit)}, хоча команда закрила ті самі ${G.BOARD_TASKS.length} задач за ті самі ${G.BOARD_TASKS.length} днів. Час задачі дорівнює кількості задач у роботі, поділеній на те, скільки команда закінчує за день.`
                : `Кожна задача йде ${limit} ${dayWord(limit)}, а треба не більше ${G.GOAL_DAYS}. Команда не стала повільнішою, просто в роботі все ще забагато задач. Спробуйте менше обмеження.`}
            </Feedback>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setDay(0)} className={reached ? chip(false) : primary}>
                Вибрати інше обмеження
              </button>
              {reached && (
                <button type="button" onClick={() => onDone(score ?? 0)} className={primary}>
                  До класів обслуговування
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// The four swimlanes, filling up with cards.
function Swimlanes({ answered }: { answered: Card<G.Lane>[] }) {
  return (
    <ul className="space-y-1.5" aria-label="Смуги канбан-дошки">
      {G.LANE_CHOICES.map((l) => {
        const cards = answered.filter((a) => a.answer === l.key);
        return (
          <li key={l.key} className="rounded-[4px] bg-background p-2.5">
            <p className="text-sm font-medium">{l.name}</p>
            {cards.length > 0 && (
              <ul className="mt-1 space-y-0.5 text-[13px] leading-snug text-muted">
                {cards.map((c) => (
                  <li key={c.text}>{c.text}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// Level 4: the board, classes of service and reading the flow.
function BoardLevel({ lanes, flow, onDone }: { lanes: number[]; flow: number[][]; onDone: (score: number) => void }) {
  const [phase, setPhase] = useState<"run" | "lanes" | "flow">("run");
  const [score, setScore] = useState(0);
  const add = (s: number, next: typeof phase) => {
    setScore((v) => v + s);
    setPhase(next);
  };

  if (phase === "run") return <BoardRun onDone={(s) => add(s, "lanes")} />;

  if (phase === "lanes") {
    return (
      <div>
        <HowTo
          goal="розкласти задачі на смуги дошки. Не всі задачі однаково термінові, тому кожен клас має своє правило."
          steps={["Прочитайте задачу.", "Виберіть смугу. Під кожною назвою написано її правило. Задача ляже на дошку.", "Прочитайте пояснення і натисніть «Далі»."]}
          tip="Підказка: те, що людина назвала задачу терміновою, ще не робить її такою. Запитайте, що станеться, якщо задача почекає."
        />
        <Deck
          key="lanes"
          label="Задача"
          question="На яку смугу її покласти?"
          items={G.LANE_CARDS}
          order={lanes}
          choices={G.LANE_CHOICES}
          above={(answered) => <Swimlanes answered={answered} />}
          doneLabel="До показників потоку"
          onDone={(s) => add(s, "flow")}
        />
      </div>
    );
  }

  return (
    <div>
      <HowTo
        goal="навчитися читати потік роботи за показниками."
        steps={["Прочитайте запитання.", "Виберіть відповідь.", "Прочитайте пояснення і натисніть «Далі»."]}
        tip="Підказка: час виконання рахують від прохання, а час циклу рахують від початку роботи."
      />
      <Questions key="flow" label="Запитання" items={G.FLOW_ASKS} orders={flow} doneLabel="До наступного рівня" onDone={(s) => onDone(score + s)} />
    </div>
  );
}

// Level 5, step 2: two moves on the path of one bug.
function FlowMap({ onDone }: { onDone: (score: number) => void }) {
  const [picks, setPicks] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const base = G.vsTotals([]);
  const now = G.vsTotals(picks);
  const right = picks.every((k) => G.VS_MOVES.find((m) => m.key === k)!.kind === "wait");
  const best = G.vsTotals(["triage", "release"]);
  const w = (v: number) => `${(v / base.total) * 100}%`;

  const toggle = (key: string) => setPicks((v) => (v.includes(key) ? v.filter((x) => x !== key) : v.length < G.VS_PICKS ? [...v, key] : v));

  return (
    <div>
      <HowTo
        goal="скоротити шлях одного бага від скарги гравця до релізу. Сил вистачить на дві зміни."
        steps={[
          "Подивіться на карту потоку: скільки часу задача чекає і скільки над нею працюють.",
          "Натисніть на дві зміни, які запровадите. Смуга одразу покаже, що вони дають.",
          "Натисніть «Перевірити» і прочитайте пояснення.",
        ]}
        tip="Підказка: порівняйте, скільки годин іде на роботу і скільки на очікування."
      />
      <figure className="mt-5 rounded-[6px] bg-background p-4">
        <figcaption className="font-medium">Шлях одного бага</figcaption>
        <div className="-mx-1 mt-2 overflow-x-auto px-1">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead className="text-[13px] text-muted">
              <tr className="border-b border-border">
                <th scope="col" className="py-1.5 pr-3 font-normal">Крок</th>
                <th scope="col" className="py-1.5 pr-3 text-right font-normal">Очікування</th>
                <th scope="col" className="py-1.5 text-right font-normal">Робота</th>
              </tr>
            </thead>
            <tbody>
              {G.VS_STEPS.map((s, k) => {
                const move = G.VS_MOVES.filter((m) => m.step === k && picks.includes(m.key));
                const wait = move.find((m) => m.kind === "wait")?.to ?? s.wait;
                const work = move.find((m) => m.kind === "work")?.to ?? s.work;
                return (
                  <tr key={s.name} className="border-b border-border">
                    <td className="py-1.5 pr-3 leading-snug">{s.name}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{wait ? hours(wait) : "немає"}</td>
                    <td className="py-1.5 text-right tabular-nums">{hours(work)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div aria-hidden className="mt-3 flex h-4 gap-0.5" style={{ width: w(now.total) }}>
          <span className="flex-1 rounded-l-[2px] bg-foreground/40" />
          <span className="rounded-r-[2px] bg-accent" style={{ width: `max(3px, ${(now.work / now.total) * 100}%)` }} />
        </div>
        <p className="mt-2 text-sm tabular-nums" aria-live="polite">
          Весь шлях становить {hours(now.total)}, із них робота {hours(now.work)}. Ефективність потоку становить{" "}
          {new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(now.efficiency)}%.
        </p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-2.5 rounded-[2px] bg-foreground/40" />
            очікування
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-2.5 rounded-[2px] bg-accent" />
            робота
          </span>
        </div>
      </figure>
      <div className="mt-4 grid gap-1.5" role="group" aria-label="Зміни в потоці">
        {G.VS_MOVES.map((m) => (
          <button key={m.key} type="button" disabled={checked} aria-pressed={picks.includes(m.key)} onClick={() => toggle(m.key)} className={optionClass(picks.includes(m.key), checked)}>
            {m.name}
          </button>
        ))}
      </div>
      {!checked ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setChecked(true)} disabled={picks.length < G.VS_PICKS} className={primary}>
            Перевірити
          </button>
          {picks.length < G.VS_PICKS && <span className="text-sm text-muted">Виберіть дві зміни.</span>}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <Feedback ok={right}>
            {right
              ? `Найбільше виграють не тоді, коли пришвидшують роботу, а коли скорочують очікування. Найсильніша пара, щоденний розбір і реліз будь-якого дня, скорочує шлях із ${hours(base.total)} до ${hours(best.total)}.`
              : `Робота забирає лише ${hours(base.work)} із ${hours(base.total)}, тому її пришвидшення майже нічого не дає. Щоденний розбір скарг і реліз будь-якого дня скоротили б шлях до ${hours(best.total)}.`}
          </Feedback>
          <button type="button" onClick={() => onDone(right ? 1 : 0)} className={primary}>
            До вибору методу
          </button>
        </div>
      )}
    </div>
  );
}

// Level 5: wastes, the map of the flow, the method and three more traps.
function WasteLevel({ wastes, teams, last, onDone }: { wastes: number[]; teams: number[]; last: number[][]; onDone: (score: number) => void }) {
  const [phase, setPhase] = useState<"wastes" | "map" | "teams" | "last">("wastes");
  const [score, setScore] = useState(0);
  const add = (s: number, next: typeof phase) => {
    setScore((v) => v + s);
    setPhase(next);
  };

  if (phase === "wastes") {
    return (
      <div>
        <HowTo
          goal="побачити втрати: усе, що забирає час і гроші, але цінності не додає."
          steps={["Прочитайте сцену.", "Виберіть втрату, яку вона показує.", "Прочитайте пояснення і натисніть «Далі»."]}
          tip="Підказка: у кожній сцені одна втрата, і кожна втрата трапляється один раз."
        />
        <Deck
          key="wastes"
          label="Сцена"
          question="Яку втрату вона показує?"
          items={G.WASTE_CARDS}
          order={wastes}
          choices={G.WASTE_CHOICES}
          columns="grid-cols-2 sm:grid-cols-3"
          doneLabel="До карти потоку"
          onDone={(s) => add(s, "map")}
        />
      </div>
    );
  }

  if (phase === "map") return <FlowMap onDone={(s) => add(s, "teams")} />;

  if (phase === "teams") {
    return (
      <div>
        <HowTo
          goal="порадити кожній команді метод, який підходить до її роботи."
          steps={["Прочитайте, чим займається команда.", "Виберіть метод. Під кожною назвою написано, для чого він.", "Прочитайте пояснення і натисніть «Далі»."]}
          tip="Підказка: подивіться, чи робота нова і велика, чи приходить потоком, і чи потрібен регулярний огляд."
        />
        <Deck
          key="teams"
          label="Команда"
          question="Який метод порадите?"
          items={G.TEAMS}
          order={teams}
          choices={G.METHOD_CHOICES}
          columns="sm:grid-cols-3"
          doneLabel="До останніх запитань"
          onDone={(s) => add(s, "last")}
        />
      </div>
    );
  }

  return (
    <div>
      <HowTo
        goal="уникнути трьох поширених пасток із показниками й методами."
        steps={["Прочитайте ситуацію.", "Виберіть відповідь.", "Прочитайте пояснення і натисніть «Далі»."]}
      />
      <Questions key="last" label="Запитання" items={G.LAST_ASKS} orders={last} doneLabel="Завершити гру" onDone={(s) => onDone(score + s)} />
    </div>
  );
}

export function AgileGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-13"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        scenes: shuffled(G.SCENES.length),
        stories: shuffled(G.BAD_STORIES.length),
        poker: shuffled(G.POKER_ASK.options.length),
        events: shuffled(G.EVENT_CARDS.length),
        sprint: G.SPRINT_ASKS.map((q) => shuffled(q.options.length)),
        lanes: shuffled(G.LANE_CARDS.length),
        flow: G.FLOW_ASKS.map((q) => shuffled(q.options.length)),
        wastes: shuffled(G.WASTE_CARDS.length),
        teams: shuffled(G.TEAMS.length),
        last: G.LAST_ASKS.map((q) => shuffled(q.options.length)),
      })}
      levels={[
        { name: "Agile на папері", play: (o, done) => <PaperLevel scenes={o.scenes} onDone={done} /> },
        { name: "Беклог", play: (o, done) => <BacklogLevel stories={o.stories} poker={o.poker} onDone={done} /> },
        { name: "Спринт за днями", play: (o, done) => <SprintLevel events={o.events} sprint={o.sprint} onDone={done} /> },
        { name: "Дошка", play: (o, done) => <BoardLevel lanes={o.lanes} flow={o.flow} onDone={done} /> },
        { name: "Куди зникає час", play: (o, done) => <WasteLevel wastes={o.wastes} teams={o.teams} last={o.last} onDone={done} /> },
      ]}
      startLabel="Почати"
      period="За гру"
      finalTitle="Тринадцята віха!"
      finalText="Модуль 13 пройдено. Далі лишився останній крок: як завершити проєкт і зрозуміти, що вигода справді настала."
      nextHref={nextHref}
      nextLabel="До модуля 14"
    >
      <BoardBonus />
    </AssignmentGame>
  );
}
