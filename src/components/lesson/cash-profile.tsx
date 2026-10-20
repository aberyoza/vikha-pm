import { FLOWS, thousands } from "@/content/examples/game-studio";
import { Figure } from "./figure";

// One scale for both directions: the tallest bar (the investment) is 120px.
const SCALE = 120 / Math.max(...FLOWS.map(Math.abs));
const UP = Math.max(...FLOWS) * SCALE + 24; // room for the value label
const DOWN = Math.abs(Math.min(...FLOWS)) * SCALE;

export function CashProfile() {
  return (
    <Figure
      title="Грошовий потік гри"
      lead="Рік розробки в мінус, потім чотири роки в плюс."
      caption={`Тис. грн на рік. Разом доходи за 4 роки: ${FLOWS.slice(1).join(" + ")} = ${FLOWS.slice(1).reduce((a, b) => a + b, 0)}. Такий профіль — спочатку витрати, потім доходи — типовий для більшості проєктів.`}
    >
      <div className="grid grid-cols-5 gap-2">
        {FLOWS.map((cf, t) => {
          const h = Math.abs(cf) * SCALE;
          return (
            <div key={t} className="flex flex-col items-center">
              <div className="flex w-full flex-col justify-end" style={{ height: UP }}>
                {cf > 0 && (
                  <>
                    <span className="mb-1 text-center font-display text-sm font-semibold tabular-nums">
                      +{cf}
                    </span>
                    <span className="mx-auto w-3/4 rounded-t-[2px] bg-accent" style={{ height: h }} />
                  </>
                )}
              </div>
              <div className="h-0.5 w-full bg-border" />
              <div className="flex w-full flex-col" style={{ height: DOWN + 24 }}>
                {cf < 0 && (
                  <>
                    <span className="mx-auto w-3/4 rounded-b-[2px] bg-foreground/60" style={{ height: h }} />
                    <span className="mt-1 text-center font-display text-sm font-semibold tabular-nums">
                      {cf}
                    </span>
                  </>
                )}
              </div>
              <span className="text-[13px] text-muted">{t === 0 ? "Старт" : `Рік ${t}`}</span>
            </div>
          );
        })}
      </div>
      <p className="sr-only">
        Старт: витрати {thousands(-FLOWS[0])}. Далі доходи:{" "}
        {FLOWS.slice(1).map((v) => thousands(v)).join(", ")}.
      </p>
    </Figure>
  );
}
