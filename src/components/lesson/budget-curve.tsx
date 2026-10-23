import { Figure } from "./figure";
import { Legend, SCurve } from "./s-curve";

// The cost baseline: planned spending accumulated week by week.
export function BudgetCurve() {
  return (
    <Figure
      title="Базовий план вартості гри"
      lead="Бюджет, розподілений у часі: скільки студія витратить до кожного тижня."
      caption="Спершу гроші йдуть повільно (концепція), у середині швидко (дизайн, механіка й сервер паралельно), наприкінці знову повільно."
    >
      <SCurve label="S-крива планових витрат гри: від 0 до 270 тис. грн за 13 тижнів, бюджет з резервом 300 тис." />
      <Legend items={[{ tone: "plan", label: "планові витрати наростаючим підсумком" }]} />
    </Figure>
  );
}
