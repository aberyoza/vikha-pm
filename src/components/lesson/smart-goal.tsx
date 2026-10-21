import { Fragment } from "react";
import { Figure } from "./figure";

type Part = { text: string; letter?: string };

// The SMART goal, split into the pieces each letter points at.
const goal: Part[] = [
  { text: "Випустити гру-головоломку в App Store і Google Play", letter: "S" },
  { text: " " },
  { text: "до 1 березня 2027 року", letter: "T" },
  { text: " " },
  { text: "силами команди з трьох людей у бюджеті 300 тис. грн", letter: "A" },
  { text: " і " },
  { text: "набрати 50 000 завантажень за перші три місяці", letter: "M" },
  { text: "." },
];

const letters = [
  { letter: "S", name: "Конкретна", note: "Що саме: гра-головоломка в обох магазинах, а не «гра колись»." },
  { letter: "M", name: "Вимірювана", note: "50 000 завантажень — зрозуміло, досягнуто чи ні." },
  { letter: "A", name: "Досяжна", note: "Під мету є люди й гроші, а не лише бажання." },
  { letter: "R", name: "Релевантна", note: "Студія виходить на ринок головоломок — це її стратегія." },
  { letter: "T", name: "Обмежена в часі", note: "Чіткий дедлайн — 1 березня 2027 року." },
];

export function SmartGoal() {
  return (
    <Figure
      title="SMART на прикладі"
      lead="Як нечітке бажання перетворюється на мету, яку можна виконати."
    >
      <div className="grid gap-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-[13px] text-muted">Нечітко</p>
          <p className="mt-1 text-muted line-through decoration-muted/60">
            «Зробити класну гру»
          </p>
        </div>

        <div className="rounded-lg border border-accent p-4">
          <p className="text-[13px] text-accent">SMART</p>
          <p className="mt-2 text-lg leading-loose">
            «
            {goal.map((part, i) =>
              part.letter ? (
                <span
                  key={i}
                  className="rounded bg-accent-soft px-1 py-0.5 box-decoration-clone"
                >
                  {part.text}
                  <sup className="ml-1 font-semibold text-accent">{part.letter}</sup>
                </span>
              ) : (
                <Fragment key={i}>{part.text}</Fragment>
              ),
            )}
            »
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 text-sm @md:grid-cols-2">
        {letters.map((l) => (
          <div key={l.letter}>
            <dt className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-accent">{l.letter}</span>
              <span className="font-medium">{l.name}</span>
            </dt>
            <dd className="mt-1 text-muted">{l.note}</dd>
          </div>
        ))}
      </dl>
    </Figure>
  );
}
