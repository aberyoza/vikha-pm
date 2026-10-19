import { Figure } from "./figure";

const money = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });

// Worked example: invest today, earn the same amount for four years,
// compare at a 10% rate.
const RATE = 0.1;
const INVESTED = 10_000;
const INCOME = 3_000;
const YEARS = [1, 2, 3, 4];

const todayValues = YEARS.map((t) => INCOME / (1 + RATE) ** t);
const nominalTotal = INCOME * YEARS.length;
const todayTotal = todayValues.reduce((a, b) => a + b, 0);
const scaleMax = Math.max(INVESTED, nominalTotal);

function Bar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "invest" | "nominal" | "today";
}) {
  const fill =
    tone === "invest"
      ? "bg-foreground/70"
      : tone === "nominal"
        ? "border-[1.5px] border-dashed border-accent"
        : "bg-accent";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-display font-semibold whitespace-nowrap tabular-nums">
          {money.format(value)} грн
        </span>
      </div>
      <div className="mt-1.5 h-4 rounded-[2px] bg-background">
        <div
          className={`h-full rounded-[2px] ${fill}`}
          style={{ width: `${(value / scaleMax) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function ProjectCashTimeline() {
  return (
    <Figure
      title="Гроші проєкту"
      lead={"Вклали 10\u00a0000\u00a0грн, отримаємо 12\u00a0000\u00a0грн. Чи вигідно?"}
      caption="Приклад зі ставкою 10% на рік. Номінально проєкт приносить більше, ніж коштує, але в сьогоднішніх грошах — менше. За такої ставки він не окупається."
    >
      <div className="space-y-4">
        <Bar label="Вкладаємо сьогодні" value={INVESTED} tone="invest" />
        <Bar label="Отримаємо за 4 роки" value={nominalTotal} tone="nominal" />
        <Bar label="Ті самі доходи в сьогоднішніх грошах" value={todayTotal} tone="today" />
      </div>

      <p className="mt-6 text-sm text-muted">
        Кожні {money.format(INCOME)} грн доходу в сьогоднішніх грошах:
      </p>
      <ol className="mt-2 grid grid-cols-4 gap-2">
        {todayValues.map((v, i) => (
          <li key={i} className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-16 w-full items-end justify-center rounded-[2px] bg-background">
              <span
                className="w-3/5 rounded-t-[2px] bg-accent"
                style={{ height: `${(v / INCOME) * 100}%` }}
              />
            </div>
            <span className="font-display text-sm font-semibold tabular-nums">
              {money.format(v)}
            </span>
            <span className="text-[13px] text-muted">рік {YEARS[i]}</span>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
