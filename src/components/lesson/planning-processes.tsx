import { Figure } from "./figure";

const core = [
  { name: "Зміст", note: "що входить у гру: 20 рівнів, таблиця рекордів" },
  { name: "Вартість і кошторис", note: "ті самі 300 тис. грн з модуля 4" },
  { name: "Перелік робіт", note: "структура робіт, WBS" },
  { name: "Послідовність робіт", note: "що після чого" },
  { name: "Тривалість робіт", note: "скільки тижнів на кожну" },
  { name: "Розклад", note: "дата релізу" },
  { name: "Відповідальні", note: "хто що робить" },
];

const support = [
  { name: "Якість" },
  { name: "Організаційне планування" },
  { name: "Підбір людей" },
  { name: "Комунікації" },
  { name: "Постачання" },
  { name: "Ризики", key: true },
];

// Two groups of planning processes: the core chain that produces the
// schedule, and supporting processes around it.
export function PlanningProcesses() {
  return (
    <Figure
      title="Процеси планування"
      lead="Основні процеси дають розклад, допоміжні — роблять його реалістичним."
      caption="Ризики — чи не найважливіший допоміжний процес: без них план виходить надто оптимістичним."
    >
      <div className="grid gap-6 @xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <p className="font-display text-lg font-semibold">Основні</p>
          <ol className="relative mt-3 space-y-3 border-l-2 border-border pl-5">
            {core.map((p, i) => (
              <li key={p.name} className="relative text-sm">
                <span
                  aria-hidden
                  className={`absolute top-1.5 -left-[26px] size-2.5 rotate-45 rounded-[1px] ${
                    i === core.length - 2 ? "bg-accent" : "border-2 border-accent bg-surface"
                  }`}
                />
                <span className="font-medium">{p.name}</span>
                <span className="text-muted"> — {p.note}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="font-display text-lg font-semibold">Допоміжні</p>
          <ul className="mt-3 grid gap-2">
            {support.map((p) => (
              <li
                key={p.name}
                className={`rounded-[4px] border px-3 py-2 text-sm ${
                  p.key ? "border-accent bg-accent-soft font-medium" : "border-border"
                }`}
              >
                {p.name}
                {p.key && <span className="block text-[13px] font-normal text-muted">найважливіший</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Figure>
  );
}
