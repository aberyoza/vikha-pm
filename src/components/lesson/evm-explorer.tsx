"use client";

import { useId, useState } from "react";
import { PV_CURVE, STATUS, STATUS_WEEK, WEEKS, evm, fmt } from "@/content/examples/game-finance";
import { Figure } from "./figure";
import { Legend, SCurve } from "./s-curve";

const signed = (v: number) => `${v >= 0 ? "+" : "−"}${fmt(Math.abs(v))}`;

// Earned value on the game: pick a week and how much was done and spent.
export function EvmExplorer() {
  const id = useId();
  const [week, setWeek] = useState(STATUS_WEEK);
  const [done, setDone] = useState((STATUS.ev / STATUS.pv) * 100);
  const [spent, setSpent] = useState((STATUS.ac / STATUS.pv) * 100);

  const pv = PV_CURVE[week];
  const ev = (pv * done) / 100;
  const ac = (pv * spent) / 100;
  const m = evm(pv, ev, ac);

  const late = m.spi < 0.995;
  const over = m.cpi < 0.995;
  const verdict =
    !late && !over
      ? "Студія йде за планом або випереджає його і не перевитрачає."
      : late && over
        ? "Студія відстає і перевитрачає: роботи зроблено менше, ніж планували, а грошей пішло більше."
        : late
          ? "Студія відстає від графіка, але кожна гривня дає стільки роботи, скільки планували або більше."
          : "Студія встигає, але платить за роботу більше, ніж планувала.";

  const sliders = [
    { key: "week", label: "Тиждень", value: week, min: 1, max: WEEKS, set: setWeek, show: `${week}-й`, step: 1 },
    { key: "done", label: "Зроблено роботи, % від плану", value: done, min: 60, max: 130, set: setDone, show: `${fmt(done, 1)}%`, step: 0.5 },
    { key: "spent", label: "Витрачено грошей, % від плану", value: spent, min: 60, max: 140, set: setSpent, show: `${fmt(spent, 1)}%`, step: 0.5 },
  ];

  return (
    <Figure
      title="Метод освоєного обсягу"
      lead="Скільки мали витратити, скільки зробили і скільки витратили насправді."
      caption="Початкові значення — стан гри на 8-му тижні. Усі суми в тисячах гривень."
    >
      <div className="space-y-3">
        {sliders.map((s) => (
          <div key={s.key}>
            <div className="flex items-baseline justify-between text-sm">
              <label htmlFor={`${id}-${s.key}`}>{s.label}</label>
              <span className="font-display font-semibold tabular-nums">{s.show}</span>
            </div>
            <input
              id={`${id}-${s.key}`}
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="mt-1 w-full accent-[var(--accent)]"
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <SCurve
          label={`S-крива гри з позначками на ${week}-му тижні: план ${fmt(pv)}, освоєно ${fmt(ev)}, витрачено ${fmt(ac)} тис. грн`}
          marker={week}
          points={[
            { w: week, v: pv, tone: "plan" },
            { w: week, v: ev, tone: "ev" },
            { w: week, v: ac, tone: "ac" },
          ]}
        />
        <Legend
          items={[
            { tone: "plan", label: `план (PV) ${fmt(pv)}` },
            { tone: "ev", label: `освоєно (EV) ${fmt(ev)}` },
            { tone: "ac", label: `витрачено (AC) ${fmt(ac)}` },
          ]}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm @xl:grid-cols-4" aria-live="polite">
        {[
          { k: "SV", v: signed(m.sv), bad: m.sv < -0.5 },
          { k: "CV", v: signed(m.cv), bad: m.cv < -0.5 },
          { k: "SPI", v: fmt(m.spi, 2), bad: late },
          { k: "CPI", v: fmt(m.cpi, 2), bad: over },
        ].map((i) => (
          <div key={i.k} className="rounded-[4px] border border-border p-2.5">
            <dt className="text-[12px] text-muted">{i.k}</dt>
            <dd className={`font-display text-lg font-semibold tabular-nums ${i.bad ? "" : "text-sage"}`}>
              {i.v}
              <span className="ml-1 text-[12px] font-normal text-muted">{i.bad ? "гірше за план" : "у нормі"}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed">{verdict}</p>
    </Figure>
  );
}
