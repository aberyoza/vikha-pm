import { Figure } from "./figure";

const pillars = [
  {
    name: "Люди",
    items: ["команда не працює ночами перед кожним релізом", "гру можуть пройти люди з поганим зором", "чесні покупки: без маніпуляцій, особливо з дітьми"],
  },
  {
    name: "Довкілля",
    items: ["гра не розряджає телефон за годину", "сервери в дата-центрах на відновлюваній енергії", "не змушувати оновлювати телефон заради гри"],
  },
  {
    name: "Економіка",
    items: ["гра заробляє не лише в перший місяць", "студія не залежить від одного магазину", "підтримку гри після релізу заплановано й оплачено"],
  },
];

// Sustainability as three lenses: people, planet, prosperity.
export function SustainabilityPillars() {
  return (
    <Figure
      title="Сталий розвиток у проєкті"
      lead="Зважати на вплив проєкту на людей, довкілля й економіку — і не лише сьогодні."
    >
      <div className="grid gap-3 @xl:grid-cols-3">
        {pillars.map((p) => (
          <div key={p.name} className="rounded-[4px] border border-border p-4">
            <p className="font-display text-lg font-semibold">{p.name}</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {p.items.map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rotate-45 rounded-[1px] bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Figure>
  );
}
