import { Figure } from "./figure";

const sides = [
  {
    name: "Невизначеність",
    traits: ["об'єктивна: існує незалежно від нас", "якісна: її не виміряти числом", "це неповна чи неточна інформація, а не її повна відсутність"],
    example: "Ніхто точно не знає, скільки людей завантажить гру і чи не зміняться податки.",
  },
  {
    name: "Ризик",
    traits: ["суб'єктивний: у кожного проєкту свій", "вимірюваний: має ймовірність і суму", "це можливе відхилення грошей проєкту від очікуваних"],
    example: "З імовірністю 30% доходи першого року будуть на 20% нижчі: мінус 24 тис. грн.",
  },
];

// Uncertainty vs risk on the game example.
export function UncertaintyVsRisk() {
  return (
    <Figure
      title="Невизначеність і ризик"
      lead="Невизначеність — туман навколо проєкту. Ризик — те, що ми в цьому тумані виміряли."
    >
      <div className="grid gap-4 @xl:grid-cols-2">
        {sides.map((s, i) => (
          <div
            key={s.name}
            className={`rounded-[4px] border p-4 ${i ? "border-accent bg-accent-soft/60" : "border-border"}`}
          >
            <p className="font-display text-lg font-semibold">{s.name}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {s.traits.map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rotate-45 rounded-[1px] bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-3 text-sm text-muted">
              <span className="font-medium text-foreground">У грі: </span>
              {s.example}
            </p>
          </div>
        ))}
      </div>
    </Figure>
  );
}
