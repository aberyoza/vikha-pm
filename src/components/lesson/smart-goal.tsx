import { Fragment } from "react";
import { Figure } from "./figure";

type Part = { text: string; letter?: string };

// The SMART goal, split into the pieces each letter points at.
const goal: Part[] = [
  { text: "Збільшити онлайн-продажі магазину", letter: "S" },
  { text: " " },
  { text: "на 15%", letter: "M" },
  { text: " " },
  { text: "до кінця II кварталу 2027 року", letter: "T" },
  { text: " " },
  { text: "завдяки програмі лояльності з бюджетом 50 000 грн", letter: "A" },
  { text: "." },
];

const letters = [
  { letter: "S", name: "Конкретна", note: "Що саме: онлайн-продажі, а не «продажі взагалі»." },
  { letter: "M", name: "Вимірювана", note: "+15% — зрозуміло, досягнуто чи ні." },
  { letter: "A", name: "Досяжна", note: "Є інструмент і бюджет, а не лише бажання." },
  { letter: "R", name: "Релевантна", note: "Онлайн-канал — стратегічний пріоритет компанії." },
  { letter: "T", name: "Обмежена в часі", note: "Чіткий дедлайн — кінець II кварталу 2027." },
];

export function SmartGoal() {
  return (
    <Figure
      title="SMART на прикладі"
      lead="Як нечітке бажання перетворюється на мету, яку можна виконати."
    >
      <div className="grid gap-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Нечітко</p>
          <p className="mt-1 text-muted line-through decoration-muted/60">
            «Збільшити продажі»
          </p>
        </div>

        <div className="rounded-lg border border-accent p-4">
          <p className="text-xs uppercase tracking-wide text-accent">SMART</p>
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

      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
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
