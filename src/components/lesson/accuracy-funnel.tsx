import { Figure } from "./figure";

const BASE = 300;
const MIN = 200;
const MAX = 540;
const stages = [
  { name: "Ідея", low: -0.25, high: 0.75, note: "груба оцінка" },
  { name: "Перед розробкою", low: -0.05, high: 0.1, note: "точна оцінка за WBS" },
  { name: "За місяць до релізу", low: -0.02, high: 0.04, note: "більшість робіт уже позаду" },
];
const pct = (v: number) => `${((v - MIN) / (MAX - MIN)) * 100}%`;

// The estimate range narrows as the project learns more.
export function AccuracyFunnel() {
  return (
    <Figure
      title="Точність оцінки"
      lead="Що більше студія знає про гру, то вужчий діапазон вартості."
      caption="Діапазони для грубої і точної оцінки — орієнтири PMBOK. Останній рядок — приклад для нашої гри."
    >
      <ul className="space-y-4">
        {stages.map((s) => {
          const lo = BASE * (1 + s.low);
          const hi = BASE * (1 + s.high);
          return (
            <li key={s.name}>
              <p className="flex flex-wrap justify-between gap-x-3 text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted tabular-nums">
                  {Math.round(lo)}–{Math.round(hi)} тис. грн
                </span>
              </p>
              <div aria-hidden className="relative mt-1.5 h-3 rounded-[2px] bg-background">
                <span className="absolute inset-y-0 rounded-[2px] bg-accent/70" style={{ left: pct(lo), width: `calc(${pct(hi)} - ${pct(lo)})` }} />
                <span className="absolute -inset-y-1 w-0.5 bg-foreground" style={{ left: pct(BASE) }} />
              </div>
              <p className="mt-0.5 text-[13px] text-muted">{s.note}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[12px] text-muted">Риска — оцінка 300 тис. грн.</p>
    </Figure>
  );
}
