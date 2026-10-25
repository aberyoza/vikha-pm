import { Figure } from "./figure";

const baselines = [
  { name: "Базовий план змісту", note: "опис змісту, WBS, словник WBS", module: 7 },
  { name: "Базовий план розкладу", note: "графік і дата релізу", module: 8 },
  { name: "Базовий план вартості", note: "бюджет, розподілений у часі", module: 9 },
];

const subsidiary = ["ризики", "комунікації", "якість", "ресурси", "зміни"];

// The project management plan as a stack: baselines plus subsidiary plans.
export function PlanStack() {
  return (
    <Figure
      title="План управління проєктом гри"
      lead="Усі плани проєкту і правила керування ним в одному документі."
      caption="Базові плани змінюють лише через контроль змін. Допоміжні плани описують, як команда керує кожним напрямом."
    >
      <div className="rounded-[4px] border border-border p-3">
        <p className="text-[13px] text-muted">Базові плани</p>
        <ul className="mt-2 space-y-1.5">
          {baselines.map((b) => (
            <li key={b.name} className="flex flex-wrap items-baseline justify-between gap-x-3 rounded-[3px] bg-accent-soft px-3 py-2 text-sm">
              <span>
                <span className="font-medium">{b.name}</span>
                <span className="block text-[13px] text-muted">{b.note}</span>
              </span>
              <span className="text-[12px] text-muted">модуль {b.module}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] text-muted">Допоміжні плани</p>
        <ul className="mt-2 flex flex-wrap gap-1.5 text-sm">
          {subsidiary.map((s) => (
            <li key={s} className="rounded-[3px] border border-border px-2 py-1">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}
