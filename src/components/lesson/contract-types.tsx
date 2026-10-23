import { Figure } from "./figure";

// Share of an overrun the contractor pays, from 0 to 1; the client pays the rest.
const types = [
  { name: "Фіксована ціна", example: "озвучення гри за 30 тис. грн до 1 грудня", risk: "перевитрати несе виконавець", contractor: 1 },
  { name: "Час і матеріали", example: "тестувальники за кожну годину перевірки", risk: "ризик ділять", contractor: 0.5 },
  { name: "Витрати плюс винагорода", example: "аутсорс-команда для нової платформи: фактичні витрати + 10%", risk: "перевитрати несе замовник", contractor: 0 },
];

const mix = (contractor: number) =>
  `color-mix(in oklab, var(--sage) ${contractor * 100}%, var(--accent))`;

function Badge({ n, contractor }: { n: number; contractor: number }) {
  return (
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-semibold text-accent-foreground ring-2 ring-surface"
      style={{ background: mix(contractor) }}
    >
      {n}
    </span>
  );
}

// Contract types ordered by who carries the cost risk.
export function ContractTypes() {
  return (
    <Figure
      title="Типи контрактів"
      lead="Хто платить, якщо робота виявиться дорожчою, ніж думали."
      caption="Фіксована ціна підходить, коли обсяг роботи зрозумілий. Що менше студія знає про обсяг, то ближче до правого краю шкали."
    >
      <div aria-hidden className="mb-3 flex justify-between text-[12px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-sage" /> ризик у виконавця
        </span>
        <span className="flex items-center gap-1.5">
          ризик у замовника <span className="size-2.5 rounded-full bg-accent" />
        </span>
      </div>
      <div aria-hidden className="relative mx-3 mb-6 h-6">
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-sage to-accent" />
        {types.map((t, i) => (
          <span
            key={t.name}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${(1 - t.contractor) * 100}%` }}
          >
            <Badge n={i + 1} contractor={t.contractor} />
          </span>
        ))}
      </div>
      <ol className="grid gap-3 @xl:grid-cols-3">
        {types.map((t, i) => (
          <li key={t.name} className="rounded-[4px] border border-border p-3 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <Badge n={i + 1} contractor={t.contractor} />
              {t.name}
            </p>
            <p className="mt-2 text-muted">{t.example}</p>
            <div aria-hidden className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
              {t.contractor > 0 && <span className="bg-sage" style={{ flex: t.contractor }} />}
              {t.contractor < 1 && <span className="bg-accent" style={{ flex: 1 - t.contractor }} />}
            </div>
            <p className="mt-2 text-[13px]">{t.risk}</p>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
