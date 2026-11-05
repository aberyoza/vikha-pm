import { COURSE_PRICE_UAH, FIRST_PAID_MODULE } from "@/lib/paywall";
import { ButtonLink } from "./ui";

// What someone without access sees in place of a paid lesson or assignment.
export function Paywall() {
  return (
    <section className="not-prose max-w-[70ch] rounded-[4px] bg-accent-soft p-6 sm:p-8">
      <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        Цей матеріал у платній частині курсу
      </h2>
      <p className="mt-3 text-lg">
        Модулі 1–{FIRST_PAID_MODULE - 1} відкриті для всіх. Модулі {FIRST_PAID_MODULE}–14 відкриваються після разової
        оплати {COURSE_PRICE_UAH.toLocaleString("uk-UA")} грн, і доступ лишається назавжди.
      </p>
      <p className="mt-2 text-muted">Протягом 14 днів гроші можна повернути без пояснень.</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <ButtonLink href="/access">Отримати доступ</ButtonLink>
        <ButtonLink href="/#program" variant="text">
          Програма курсу
        </ButtonLink>
      </div>
    </section>
  );
}
