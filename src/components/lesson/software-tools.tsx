import { Figure } from "./figure";

const kinds = [
  {
    name: "Відкриті моделі",
    examples: "фінансова модель у MS Excel чи Google Таблицях",
    plus: "видно всі формули, їх можна змінювати під проєкт",
    minus: "формулу легко випадково зламати",
  },
  {
    name: "Закриті програми",
    examples: "COMFAR (розробка UNIDO, Організації ООН з промислового розвитку)",
    plus: "єдиний стандарт розрахунків, звичний для іноземних інвесторів",
    minus: "«чорна скринька»: алгоритм не змінити",
  },
  {
    name: "Планування робіт",
    examples: "MS Project",
    plus: "календарний план і ресурси",
    minus: "не рахує NPV та IRR",
  },
  {
    name: "Моделювання ризиків",
    examples: "надбудови до Excel для методу Монте-Карло, наприклад @RISK",
    plus: "тисячі сценаріїв за хвилину",
    minus: "потрібно розуміти статистику",
  },
];

// Kinds of business-planning software with their trade-offs.
export function SoftwareTools() {
  return (
    <Figure title="Програми для бізнес-плану" lead="Відкритість дає гнучкість, закритість — надійний стандарт.">
      <div className="grid gap-3 @xl:grid-cols-2">
        {kinds.map((k) => (
          <div key={k.name} className="rounded-[4px] border border-border p-4">
            <p className="font-medium">{k.name}</p>
            <p className="mt-1 text-sm text-muted">{k.examples}</p>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="shrink-0 font-display font-semibold text-accent">+</dt>
                <dd>{k.plus}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 font-display font-semibold text-muted">−</dt>
                <dd>{k.minus}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </Figure>
  );
}
