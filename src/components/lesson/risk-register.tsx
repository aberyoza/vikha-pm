import { RISKS } from "@/content/examples/game-risks";
import { Figure } from "./figure";

const money = (v: number) => `${v} тис. грн`;

// Qualitative analysis result: risk, cause, effect, loss, measure, cost.
export function RiskRegister() {
  return (
    <Figure
      title="Якісний аналіз ризиків гри"
      lead="Три кроки для кожного ризику: назва і причина, наслідки в гривнях, захід і його ціна."
      caption="Неконтрольованим ризикам (курс, податки) запобігти не можна, тому їхню суму покриваємо з резерву."
    >
      <ol className="grid gap-3 @3xl:grid-cols-2">
        {RISKS.map((r, i) => (
          <li key={r.key} className="grid gap-3 rounded-[4px] border border-border p-4 @md:grid-cols-3 @md:gap-4 @3xl:grid-cols-1 @5xl:grid-cols-3">
            <div>
              <p className="text-[13px] text-muted">1. Ризик</p>
              <p className="mt-0.5 font-medium">
                <span className="font-display text-accent">{i + 1}.</span> {r.name}
              </p>
              <p className="mt-1 text-sm text-muted">Причина: {r.cause}.</p>
            </div>
            <div>
              <p className="text-[13px] text-muted">2. Наслідки</p>
              <p className="mt-0.5 text-sm">{r.effect}</p>
              <p className="mt-1 font-display font-semibold">−{money(r.loss)}</p>
            </div>
            <div>
              <p className="text-[13px] text-muted">3. Захід</p>
              <p className="mt-0.5 text-sm">{r.measure}</p>
              <p className="mt-1 font-display font-semibold text-accent">
                {r.control === "none" ? `з резерву: ${money(r.measureCost)}` : money(r.measureCost)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
