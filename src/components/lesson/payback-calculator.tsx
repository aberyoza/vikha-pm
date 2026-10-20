"use client";

import { useId, useState } from "react";
import { FLOWS, RATE, npv, pi } from "@/content/examples/game-studio";

const num = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });
const dec = new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const START_INVESTMENT = String(-FLOWS[0]);
const START_INCOMES = FLOWS.slice(1).map(String);

function parse(text: string) {
  const v = Number(text.replace(",", "."));
  return text.trim() !== "" && Number.isFinite(v) && v >= 0 ? v : null;
}

function yearsWord(n: number) {
  if (n === 1) return "рік";
  if (n >= 2 && n <= 4) return "роки";
  return "років";
}

// Live table for PI and DPP: every row shows a year's money, the same money
// in today's terms, and the running total that tells when the game pays back.
export function PaybackCalculator() {
  const rateId = useId();
  const [rate, setRate] = useState(Math.round(RATE * 100));
  const [investment, setInvestment] = useState(START_INVESTMENT);
  const [incomes, setIncomes] = useState(START_INCOMES);

  const inv = parse(investment);
  const inc = incomes.map(parse);
  const valid = inv !== null && inv > 0 && inc.every((v) => v !== null);

  const r = rate / 100;
  const flows = valid ? [-(inv as number), ...(inc as number[])] : [];
  let running = 0;
  const rows = flows.map((cf, t) => {
    const today = cf / (1 + r) ** t;
    running += today;
    return { t, cf, today, cumulative: running };
  });
  const paybackYear = rows.findIndex((row) => row.t > 0 && row.cumulative >= 0);
  const benefitsToday = rows.slice(1).reduce((s, row) => s + row.today, 0);

  const input =
    "h-9 w-full rounded-md border border-border bg-background px-2 text-right font-display font-semibold tabular-nums focus-visible:border-accent";

  return (
    <div className="not-prose my-4 rounded-[4px] border border-border bg-background/60 p-4">
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={rateId}>Ставка, r</label>
        <span className="font-display font-semibold tabular-nums">{rate}% на рік</span>
      </div>
      <input
        id={rateId}
        type="range"
        min={0}
        max={30}
        step={1}
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--accent)]"
      />

      <table className="mt-4 w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">Гроші гри по роках, тис. грн</caption>
        <thead>
          <tr className="text-left text-[12px] leading-tight text-muted">
            <th className="w-[18%] pb-2 font-normal">Рік</th>
            <th className="w-[26%] pb-2 text-right font-normal">Гроші, тис.</th>
            <th className="w-[28%] pb-2 text-right font-normal">У сьогод&shy;нішніх</th>
            <th className="w-[28%] pb-2 text-right font-normal">Накопи&shy;чено</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4].map((t) => {
            const row = rows[t];
            const payback = valid && t === paybackYear;
            return (
              <tr
                key={t}
                className={`border-t border-grid ${payback ? "bg-accent-soft" : ""}`}
              >
                <td className="py-1.5 pl-1">
                  {t === 0 ? "Старт" : t}
                  {payback && <span className="block text-[11px] text-accent">окупився</span>}
                </td>
                <td className="py-1.5 pl-1">
                  <input
                    aria-label={t === 0 ? "Вкладення на старті, тис. грн" : `Дохід року ${t}, тис. грн`}
                    inputMode="decimal"
                    value={t === 0 ? investment : incomes[t - 1]}
                    onChange={(e) =>
                      t === 0
                        ? setInvestment(e.target.value)
                        : setIncomes((prev) => prev.map((v, i) => (i === t - 1 ? e.target.value : v)))
                    }
                    className={input}
                  />
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {row ? `${row.today < 0 ? "−" : ""}${num.format(Math.abs(row.today))}` : "—"}
                </td>
                <td
                  className={`py-1.5 pr-1 text-right font-semibold tabular-nums ${
                    row && row.cumulative < 0 ? "text-muted" : "text-accent"
                  }`}
                >
                  {row ? `${row.cumulative < 0 ? "−" : ""}${num.format(Math.abs(row.cumulative))}` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-1 text-[12px] text-muted">
        На старті — вкладені гроші (зі знаком мінус у розрахунку). Числа можна змінювати.
      </p>

      {!valid ? (
        <p className="mt-3 text-sm text-accent">
          Введіть невід&apos;ємні числа, а вкладення на старті — більше нуля.
        </p>
      ) : (
        <div className="mt-4 space-y-2 rounded-[4px] bg-accent-soft p-3 text-sm leading-relaxed" aria-live="polite">
          <p>
            <span className="font-semibold">PI</span> = {num.format(benefitsToday)} ÷{" "}
            {num.format(inv as number)} ={" "}
            <span className="font-display font-semibold text-accent">{dec.format(pi(r, flows))}</span>
            : на кожну вкладену гривню повертається {dec.format(pi(r, flows))}&nbsp;грн
            {pi(r, flows) >= 1 ? " — вигідно." : " — менше, ніж вклали."}
          </p>
          <p>
            <span className="font-semibold">DPP</span>:{" "}
            {paybackYear > 0 ? (
              <>
                накопичена сума вперше стає не меншою за нуль у році {paybackYear} — проєкт
                окупається за {paybackYear} {yearsWord(paybackYear)}.
              </>
            ) : (
              <>за 4 роки накопичена сума так і не виходить у плюс — проєкт не окупається.</>
            )}
          </p>
          <p className="text-muted">
            NPV = {npv(r, flows) < 0 ? "−" : "+"}
            {num.format(Math.abs(npv(r, flows)))} тис. грн (останнє число в колонці «Накопичено»).
          </p>
        </div>
      )}
    </div>
  );
}
