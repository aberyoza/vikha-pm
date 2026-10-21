import { Figure } from "./figure";

const stages = [
  { name: "Під час проєктування", cost: 1, note: "змінити рядок у документі" },
  { name: "Під час розробки", cost: 5, note: "переписати частину коду" },
  { name: "Під час тестування", cost: 10, note: "виправити, перезібрати, перетестувати" },
  { name: "Після релізу", cost: 50, note: "оновлення в магазинах, погані відгуки, втрачені гравці" },
];
const MAX = stages[stages.length - 1].cost;

// The later a defect is found, the more it costs to fix.
export function DefectCost() {
  return (
    <Figure
      title="Ціна помилки"
      lead="Що пізніше знайшли помилку, то дорожче її виправити."
      caption="Співвідношення орієнтовні, у кожному проєкті свої. Але тенденція однакова скрізь, тому якість закладають із самого початку, а не перевіряють наприкінці."
    >
      <ul className="space-y-3">
        {stages.map((s) => (
          <li key={s.name}>
            <p className="flex flex-wrap justify-between gap-x-3 text-sm">
              <span className="font-medium">{s.name}</span>
              <span className="font-display font-semibold tabular-nums text-accent">×{s.cost}</span>
            </p>
            <div aria-hidden className="mt-1 h-3 rounded-[2px] bg-background">
              <div className="h-full rounded-[2px] bg-accent" style={{ width: `${Math.max(2, (s.cost / MAX) * 100)}%` }} />
            </div>
            <p className="mt-0.5 text-[13px] text-muted">{s.note}</p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
