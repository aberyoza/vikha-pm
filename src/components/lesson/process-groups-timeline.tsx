import { Figure } from "./figure";

// Schematic share of the project's time each group is active (0–100%).
const groups = [
  { name: "Ініціація", from: 0, to: 14, note: "" },
  { name: "Планування", from: 8, to: 72, note: "пік інтелектуальної праці" },
  { name: "Виконання", from: 22, to: 90, note: "найбільша частина бюджету" },
  { name: "Моніторинг і контроль", from: 3, to: 100, note: "діє від початку до кінця" },
  { name: "Закриття", from: 88, to: 100, note: "" },
];

export function ProcessGroupsTimeline() {
  return (
    <Figure
      title="Групи процесів у часі"
      lead="Це не послідовні фази: групи накладаються одна на одну."
      caption="Схематично. Ті самі п'ять груп повторюються і всередині кожного окремого етапу проєкту."
    >
      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.name}>
            <p className="text-sm font-medium">{g.name}</p>
            <div className="relative mt-1.5 h-3 rounded-[2px] bg-background">
              <span
                className="absolute inset-y-0 rounded-[2px] bg-accent"
                style={{ left: `${g.from}%`, width: `${g.to - g.from}%` }}
              />
            </div>
            {g.note && <p className="mt-1 text-[13px] text-muted">{g.note}</p>}
          </div>
        ))}
        <div className="flex justify-between border-t border-border pt-2 text-[13px] text-muted">
          <span>Старт проєкту</span>
          <span>Завершення</span>
        </div>
      </div>
    </Figure>
  );
}
