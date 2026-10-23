import { AC_CURVE, BAC, EV_CURVE, STATUS, STATUS_WEEK, evm, fmt } from "@/content/examples/game-finance";
import { Figure } from "./figure";
import { Legend, SCurve } from "./s-curve";

const m = evm(STATUS.pv, STATUS.ev, STATUS.ac);

// Forecast at week 8: if the trend holds, where the money and the date end up.
export function EvmForecast() {
  return (
    <Figure
      title="Прогноз на 8-му тижні"
      lead={`Якщо нічого не змінити, гра коштуватиме ≈ ${fmt(m.eac)} тис. грн замість ${BAC} і вийде на ${fmt(m.weeks - 13, 0)} тиждень пізніше.`}
      caption="Пунктир — прогноз від поточного факту до кінця проєкту за нинішньої ефективності витрат і темпу."
    >
      <SCurve
        label={`Прогноз гри: витрачено ${fmt(STATUS.ac)} тис. на 8-му тижні, прогноз ${fmt(m.eac)} тис. грн і близько ${fmt(m.weeks, 0)} тижнів`}
        series={[
          { values: EV_CURVE, tone: "ev" },
          { values: AC_CURVE, tone: "ac" },
        ]}
        forecast={{ from: [STATUS_WEEK, STATUS.ac], to: [m.weeks, m.eac] }}
        marker={STATUS_WEEK}
      />
      <Legend
        items={[
          { tone: "plan", label: "план" },
          { tone: "ev", label: "освоєно" },
          { tone: "ac", label: "витрачено" },
          { tone: "forecast", label: "прогноз витрат" },
        ]}
      />
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm @xl:grid-cols-4">
        {[
          { k: "Прогноз вартості (EAC)", v: fmt(m.eac) },
          { k: "Ще треба (ETC)", v: fmt(m.etc) },
          { k: "Відхилення в кінці (VAC)", v: `−${fmt(Math.abs(m.vac))}` },
          { k: "Прогноз строку", v: `≈ ${fmt(m.weeks, 0)} тиж.` },
        ].map((i) => (
          <div key={i.k} className="rounded-[4px] border border-border p-2.5">
            <dt className="text-[12px] text-muted">{i.k}</dt>
            <dd className="font-display text-lg font-semibold tabular-nums">{i.v}</dd>
          </div>
        ))}
      </dl>
    </Figure>
  );
}
