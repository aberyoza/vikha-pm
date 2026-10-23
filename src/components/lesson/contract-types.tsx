import { Figure } from "./figure";

const types = [
  { name: "Фіксована ціна", example: "озвучення гри за 30 тис. грн до 1 грудня", risk: "перевитрати несе виконавець" },
  { name: "Час і матеріали", example: "тестувальники за кожну годину перевірки", risk: "ризик ділять" },
  { name: "Витрати плюс винагорода", example: "аутсорс-команда для нової платформи: фактичні витрати + 10%", risk: "перевитрати несе замовник" },
];

// Contract types ordered by who carries the cost risk.
export function ContractTypes() {
  return (
    <Figure
      title="Типи контрактів"
      lead="Хто платить, якщо робота виявиться дорожчою, ніж думали."
      caption="Фіксована ціна підходить, коли обсяг роботи зрозумілий. Що менше студія знає про обсяг, то ближче до правого краю шкали."
    >
      <div aria-hidden className="mb-3 flex justify-between text-[12px] text-muted">
        <span>ризик у виконавця</span>
        <span>ризик у замовника</span>
      </div>
      <div aria-hidden className="mb-4 h-1.5 rounded-full bg-gradient-to-r from-sage to-accent" />
      <ol className="grid gap-3 @xl:grid-cols-3">
        {types.map((t) => (
          <li key={t.name} className="rounded-[4px] border border-border p-3 text-sm">
            <p className="font-medium">{t.name}</p>
            <p className="mt-1 text-muted">{t.example}</p>
            <p className="mt-2 text-[13px]">{t.risk}</p>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
