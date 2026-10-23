import { METRICS } from "@/content/examples/game-quality";
import { Figure } from "./figure";

// Quality metrics of the game against the beta-test results.
export function QualityScorecard() {
  const failed = METRICS.filter((m) => m.verdict === "fail");

  return (
    <Figure
      title="Бета-тест проти цілей"
      lead="Показники якості, про які команда домовилась, і що показав бета-тест."
      caption={`Не проходить ${failed.length === 1 ? "один показник" : `${failed.length} показники`}: ${failed.map((m) => m.name.toLowerCase()).join(", ")}. З нього почнеться робота в наступних уроках.`}
    >
      <ul className="divide-y divide-border text-sm">
        {METRICS.map((m) => (
          <li key={m.name} className="grid gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0 @md:grid-cols-[minmax(0,1fr)_auto] @md:items-center">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-muted">ціль: {m.target}</p>
            </div>
            <div className="flex items-center gap-3 @md:justify-end">
              <span className="font-display font-semibold tabular-nums">{m.beta}</span>
              <span
                className={`rounded-[4px] px-2 py-0.5 text-[13px] font-medium ${
                  m.verdict === "pass" ? "border border-border text-muted" : "bg-accent text-accent-foreground"
                }`}
              >
                {m.verdict === "pass" ? "✓ проходить" : "✗ не проходить"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
