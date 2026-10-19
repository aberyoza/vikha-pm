import { Figure } from "./figure";

const money = new Intl.NumberFormat("uk-UA");
const RATE = 0.1;
const START = 10_000;

const points = [0, 1, 2, 3].map((t) => ({
  label: t === 0 ? "Сьогодні" : `${t} ${t === 1 ? "рік" : "роки"}`,
  value: Math.round(START * (1 + RATE) ** t),
}));

function Direction({
  text,
  tone,
  reverse,
}: {
  text: string;
  tone: "accent" | "sage";
  reverse?: boolean;
}) {
  const color = tone === "accent" ? "bg-accent" : "bg-sage";
  const textColor = tone === "accent" ? "text-accent" : "text-sage";
  return (
    <div className={`flex items-center gap-2 text-sm ${textColor}`}>
      {reverse && <span aria-hidden>←</span>}
      <span aria-hidden className={`h-0.5 flex-1 ${color}`} />
      <span className="shrink-0">{text}</span>
      <span aria-hidden className={`h-0.5 flex-1 ${color}`} />
      {!reverse && <span aria-hidden>→</span>}
    </div>
  );
}

export function MoneyTimeline() {
  return (
    <Figure
      title="Гроші в часі"
      lead="Ті самі гроші в різні роки — різні суми."
      caption="Приклад зі ставкою 10% на рік."
    >
      <Direction text="вперед: нарощення" tone="accent" />

      <ol className="relative my-5 grid grid-cols-4 before:absolute before:top-[7px] before:right-[12.5%] before:left-[12.5%] before:h-0.5 before:bg-border">
        {points.map((p, i) => (
          <li key={p.label} className="relative flex flex-col items-center text-center">
            <span
              aria-hidden
              className={`size-3.5 rotate-45 rounded-[2px] ${i === 0 ? "bg-accent" : "border-2 border-accent bg-surface"}`}
            />
            <span className="mt-3 font-display text-[15px] font-semibold whitespace-nowrap tabular-nums">
              {money.format(p.value)}
            </span>
            <span className="text-[13px] text-muted">{p.label}</span>
          </li>
        ))}
      </ol>

      <Direction text="назад: дисконтування" tone="sage" reverse />
    </Figure>
  );
}
