import { COVERAGE_NEEDED, RESERVE, RISKS } from "@/content/examples/game-risks";
import { Figure } from "./figure";

const SCALE = Math.max(COVERAGE_NEEDED, RESERVE) * 1.05;
const pct = (v: number) => `${(v / SCALE) * 100}%`;

// Stacked bar: what protection costs vs the reserve in the budget.
export function ReserveCoverage() {
  const gap = COVERAGE_NEEDED - RESERVE;

  return (
    <Figure
      title="Резерв проти ризиків"
      lead={`Резерв — ${RESERVE} тис. грн, а на захист від усіх ризиків потрібно ${COVERAGE_NEEDED}.`}
      caption={`Не вистачає ${gap} тис. грн. Ризики, які не покриває резерв, перевіряємо кількісно: наскільки вони вдарять по NPV гри.`}
    >
      <div className="space-y-4 text-sm">
        <div>
          <p className="mb-1.5 flex justify-between">
            <span className="font-medium">Резерв у бюджеті</span>
            <span className="font-display font-semibold tabular-nums">{RESERVE} тис.</span>
          </p>
          <div className="h-8 rounded-[3px] bg-background">
            <div className="h-full rounded-[3px] bg-foreground/75" style={{ width: pct(RESERVE) }} />
          </div>
        </div>
        <div>
          <p className="mb-1.5 flex justify-between">
            <span className="font-medium">Потрібно на ризики</span>
            <span className="font-display font-semibold tabular-nums">{COVERAGE_NEEDED} тис.</span>
          </p>
          <div className="relative flex h-8 gap-0.5 rounded-[3px] bg-background">
            {RISKS.map((r) => (
              <div
                key={r.key}
                title={`${r.name}: ${r.measureCost} тис. грн`}
                className={`h-full first:rounded-l-[3px] last:rounded-r-[3px] ${
                  r.control === "none" ? "bg-foreground/45" : "bg-accent"
                }`}
                style={{ width: pct(r.measureCost) }}
              />
            ))}
            <span
              aria-hidden
              className="absolute -top-1 -bottom-1 w-0.5 bg-foreground"
              style={{ left: pct(RESERVE) }}
            />
          </div>
          <p className="mt-1 text-[12px] text-muted" style={{ paddingLeft: `calc(${pct(RESERVE)} - 2rem)` }}>
            межа резерву
          </p>
        </div>
      </div>

      <ul className="mt-5 grid gap-1.5 text-[13px] @md:grid-cols-2">
        {RISKS.map((r) => (
          <li key={r.key} className="flex items-center gap-2">
            <span
              aria-hidden
              className={`size-2.5 shrink-0 rounded-[2px] ${r.control === "none" ? "bg-foreground/45" : "bg-accent"}`}
            />
            <span>
              {r.short} <span className="text-muted">— {r.measureCost} тис.</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] text-muted">
        Медовий колір — вартість заходів захисту, сірий — неконтрольовані ризики, які покриваємо лише
        грошима з резерву.
      </p>
    </Figure>
  );
}
