import { FLOWS, RATE } from "@/content/examples/game-studio";
import { Figure } from "./figure";

const money = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });

// The game from module 4: invest today, earn for four years, compare at
// the 10% rate. Amounts in hryvnias.
const INVESTED = -FLOWS[0] * 1000;
const INCOMES = FLOWS.slice(1).map((v) => v * 1000);
const YEARS = INCOMES.map((_, i) => i + 1);
const MAX_INCOME = Math.max(...INCOMES);

const todayValues = INCOMES.map((v, i) => v / (1 + RATE) ** (i + 1));
const nominalTotal = INCOMES.reduce((a, b) => a + b, 0);
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
      lead={`Гра коштує ${money.format(INVESTED)}\u00a0грн, а за 4 роки принесе ${money.format(nominalTotal)}\u00a0грн. Наскільки це вигідно?`}
      caption="Ставка 10% на рік. У сьогоднішніх грошах гра все ще приносить більше, ніж коштує, але запас удвічі з половиною менший, ніж здається на папері: близько 58 тис. грн, а не 145."
    >
      <div className="space-y-4">
        <Bar label="Розробка сьогодні" value={INVESTED} tone="invest" />
        <Bar label="Дохід за 4 роки на папері" value={nominalTotal} tone="nominal" />
        <Bar label="Ті самі доходи в сьогоднішніх грошах" value={todayTotal} tone="today" />
      </div>

      <p className="mt-6 text-sm text-muted">
        Дохід кожного року на папері (контур) і в сьогоднішніх грошах:
      </p>
      <ol className="mt-2 grid grid-cols-4 gap-2">
        {todayValues.map((v, i) => (
          <li key={i} className="flex flex-col items-center gap-1.5 text-center">
            <div className="relative flex h-16 w-full items-end justify-center rounded-[2px] bg-background">
              <span
                className="absolute bottom-0 w-3/5 rounded-t-[2px] border-[1.5px] border-dashed border-accent"
                style={{ height: `${(INCOMES[i] / MAX_INCOME) * 100}%` }}
              />
              <span
                className="w-3/5 rounded-t-[2px] bg-accent"
                style={{ height: `${(v / MAX_INCOME) * 100}%` }}
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
