import { Figure } from "./figure";

const phases = [
  { name: "Концепція", weeks: "2 тижні", gate: "Чи варто вкладати гроші?" },
  { name: "Прототип", weeks: "3 тижні", gate: "Чи чіпляє механіка гравців?" },
  { name: "Розробка", weeks: "спринти по 2 тижні", gate: "Чи готова гра до релізу?" },
  { name: "Реліз", weeks: "1 тиждень", gate: "Чи прийняли гру магазини?" },
  { name: "Підтримка", weeks: "операційна робота", gate: "" },
];

// The game's life cycle: phases separated by go/no-go gates.
export function LifeCycleGates() {
  return (
    <Figure
      title="Життєвий цикл гри"
      lead="Фази, а між ними — контрольні точки, де вирішують: іти далі, змінити курс чи зупинитися."
      caption="Остання фаза — уже не проєкт, а операційна робота: гру підтримують, доки вона приносить користь."
    >
      <ol className="grid gap-2 @2xl:grid-cols-5">
        {phases.map((p, i) => (
          <li key={p.name} className="flex flex-col gap-2 @2xl:contents">
            <div
              className={`rounded-[4px] border p-3 @2xl:row-start-1 ${i === phases.length - 1 ? "border-dashed border-border" : "border-border bg-surface"}`}
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-[13px] text-muted">{p.weeks}</p>
            </div>
            {p.gate && (
              <div className="flex items-start gap-2 text-[13px] @2xl:row-start-2">
                <span aria-hidden className="mt-1 size-2.5 shrink-0 rotate-45 rounded-[1px] bg-accent" />
                <span>{p.gate}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </Figure>
  );
}
