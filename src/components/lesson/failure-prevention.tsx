import { Figure } from "./figure";

const pairs = [
  {
    cause: "Погане планування",
    fix: "Реалістичні оцінки та резерв часу й бюджету",
  },
  {
    cause: "Недостатній контроль",
    fix: "Відповідальний за кожну ділянку й контрольні точки",
  },
  {
    cause: "Невдалий підбір команди",
    fix: "Підбір виконавців під складність задач",
  },
  {
    cause: "Низька мотивація",
    fix: "Інструментальні цілі: система мотивації команди",
  },
  {
    cause: "Невірні постачальники або матеріали",
    fix: "Перевірка постачальників і запас критичних ресурсів",
  },
  {
    cause: "Ігнорування інформації",
    fix: "Регулярний моніторинг ринку й законодавства",
  },
];

export function FailurePrevention() {
  return (
    <Figure
      title="Причина → запобіжник"
      lead="Кожна типова причина провалу має свою протидію."
    >
      <ol className="divide-y divide-border">
        {pairs.map((pair, n) => (
          <li
            key={pair.cause}
            className="grid gap-1 py-3 first:pt-0 last:pb-0 @xl:grid-cols-[1fr_auto_1fr] @xl:items-center @xl:gap-4"
          >
            <p className="flex gap-3 font-medium">
              <span className="w-4 shrink-0 text-sm tabular-nums text-muted">
                {n + 1}
              </span>
              {pair.cause}
            </p>
            <span aria-hidden className="hidden text-accent @xl:block">
              →
            </span>
            <p className="pl-7 text-sm text-muted @xl:pl-0">
              <span className="text-accent @xl:hidden">→ </span>
              {pair.fix}
            </p>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
