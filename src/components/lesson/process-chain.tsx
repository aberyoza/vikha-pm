import { Figure } from "./figure";

const groups = [
  { name: "Ініціація", output: "статут проєкту, керівник, зацікавлені сторони" },
  { name: "Планування", output: "базовий план за змістом, розкладом і вартістю" },
  { name: "Виконання", output: "результати запланованих робіт" },
  { name: "Закриття", output: "підсумкові документи" },
];

// Process groups as a chain: each group's output is the next group's input;
// monitoring & control runs alongside planning and execution.
export function ProcessChain() {
  return (
    <Figure
      title="Входи й виходи"
      lead="Вихід однієї групи процесів — вхід для наступної."
      caption="Моніторинг і контроль працює паралельно: знаходить відхилення й повертає зміни в базові плани."
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4">
        <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[6px] before:w-0.5 before:bg-border">
          {groups.map((g, i) => (
            <li key={g.name} className="relative pl-8">
              <span
                aria-hidden
                className={`absolute top-1.5 left-px size-3 rotate-45 rounded-[2px] border-2 border-accent ${
                  i === groups.length - 1 ? "bg-accent" : "bg-surface"
                }`}
              />
              <p className="font-display text-lg font-semibold">{g.name}</p>
              <p className="text-sm text-muted">
                <span className="text-foreground">Вихід:</span> {g.output}
              </p>
            </li>
          ))}
        </ol>

        {/* Monitoring & control spans planning and execution. */}
        <div className="grid grid-rows-[1fr_2fr_1fr] pt-11 pb-14">
          <div className="row-start-2 flex w-28 items-stretch gap-2">
            <span className="w-1 shrink-0 rounded-full bg-sage" />
            <span className="self-center text-sm leading-snug text-sage">
              Моніторинг і контроль
            </span>
          </div>
        </div>
      </div>
    </Figure>
  );
}
