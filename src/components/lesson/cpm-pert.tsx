import { Figure } from "./figure";

const methods = [
  {
    name: "CPM",
    full: "Critical Path Method",
    uk: "метод критичного шляху",
    focus: "Оптимізація відомого: точний розрахунок часу для детермінованих задач.",
  },
  {
    name: "PERT",
    full: "Program Evaluation and Review Technique",
    uk: "метод оцінки та перегляду програм",
    focus: "Оцінка невідомого: робота з імовірностями та невизначеними змінними.",
  },
];

export function CpmPert() {
  return (
    <Figure
      title="Порівняння методів"
      lead="CPM проти PERT"
      caption={
        <>
          <strong className="font-medium text-foreground">Спільна мета:</strong>{" "}
          обидва методи революціонізували роботу з графіками, перетворивши хаос
          на вимірювану науку.
        </>
      }
    >
      <div className="grid gap-4 @xl:grid-cols-2">
        {methods.map((m) => (
          <div key={m.name} className="rounded-lg border border-border p-5">
            <p className="text-3xl font-semibold tracking-tight text-accent">
              {m.name}
            </p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Розшифровка
                </dt>
                <dd className="mt-1">
                  {m.full} <span className="text-muted">({m.uk})</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Фокус
                </dt>
                <dd className="mt-1">{m.focus}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </Figure>
  );
}
