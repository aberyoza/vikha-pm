"use client";

import { useId, useState } from "react";
import { Figure } from "./figure";

const CRITERIA = [
  { key: "price", label: "Ціна" },
  { key: "quality", label: "Якість" },
  { key: "time", label: "Строки" },
] as const;

type Key = (typeof CRITERIA)[number]["key"];

// Scores 1–10 for three sound studios bidding to voice the game.
const VENDORS: { name: string; offer: string; scores: Record<Key, number> }[] = [
  { name: "Студія «Тиша»", offer: "30 тис., 3 тижні", scores: { price: 9, quality: 6, time: 8 } },
  { name: "Студія «Ехо»", offer: "45 тис., 4 тижні", scores: { price: 6, quality: 9, time: 7 } },
  { name: "Студія «Відлуння»", offer: "38 тис., 5 тижнів", scores: { price: 7, quality: 8, time: 5 } },
];

const fmt = (v: number) => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(v);

// Weighted scoring matrix: move the weights and watch the winner change.
export function VendorMatrix() {
  const id = useId();
  const [w, setW] = useState<Record<Key, number>>({ price: 40, quality: 40, time: 20 });
  const total = w.price + w.quality + w.time || 1;
  const scored = VENDORS.map((v) => ({
    ...v,
    sum: CRITERIA.reduce((s, c) => s + (v.scores[c.key] * w[c.key]) / total, 0),
  }));
  const best = scored.reduce((a, b) => (b.sum > a.sum ? b : a));

  return (
    <Figure
      title="Вибір студії звуку"
      lead="Зважена матриця: що важливіше для студії, те й вирішує."
      caption="Бали від 1 до 10 за кожним критерієм. Ваги нормуються до 100%, тож важить їхнє співвідношення."
    >
      <div className="space-y-3">
        {CRITERIA.map((c) => (
          <div key={c.key}>
            <div className="flex items-baseline justify-between text-sm">
              <label htmlFor={`${id}-${c.key}`}>Вага: {c.label.toLowerCase()}</label>
              <span className="font-display font-semibold tabular-nums">{Math.round((w[c.key] / total) * 100)}%</span>
            </div>
            <input
              id={`${id}-${c.key}`}
              type="range"
              min={0}
              max={100}
              step={5}
              value={w[c.key]}
              onChange={(e) => setW((s) => ({ ...s, [c.key]: Number(e.target.value) }))}
              className="mt-1 w-full accent-[var(--accent)]"
            />
          </div>
        ))}
      </div>

      <table className="mt-5 w-full text-left text-sm">
        <thead className="text-[13px] text-muted">
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-2 font-normal">Студія</th>
            {CRITERIA.map((c) => (
              <th key={c.key} scope="col" className="py-2 pr-2 text-center font-normal">
                {c.label}
              </th>
            ))}
            <th scope="col" className="py-2 text-right font-normal">Сума</th>
          </tr>
        </thead>
        <tbody>
          {scored.map((v) => (
            <tr key={v.name} className={`border-b border-border last:border-0 ${v === best ? "bg-accent-soft" : ""}`}>
              <td className="py-2 pr-2">
                <span className="font-medium">{v.name}</span>
                <span className="block text-[12px] text-muted">{v.offer}</span>
              </td>
              {CRITERIA.map((c) => (
                <td key={c.key} className="py-2 pr-2 text-center tabular-nums">
                  {v.scores[c.key]}
                </td>
              ))}
              <td className="py-2 text-right font-display font-semibold tabular-nums">{fmt(v.sum)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        За цих ваг перемагає <span className="font-medium">{best.name}</span>.
      </p>
    </Figure>
  );
}
