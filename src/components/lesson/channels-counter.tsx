"use client";

import { useId, useState } from "react";
import { Figure } from "./figure";

const SIZE = 240;
const C = SIZE / 2;
const R = 95;

const channels = (n: number) => (n * (n - 1)) / 2;
const point = (i: number, n: number) => {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return [C + R * Math.cos(a), C + R * Math.sin(a)] as const;
};

// Communication channels grow as n(n−1)/2: move the slider to add people.
export function ChannelsCounter() {
  const id = useId();
  const [n, setN] = useState(3);
  const pts = Array.from({ length: n }, (_, i) => point(i, n));
  const lines: [number, number][] = [];
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) lines.push([a, b]);

  return (
    <Figure
      title="Канали комунікації"
      lead="Кожна пара людей — окремий канал, де щось може загубитися."
      caption="Кількість каналів = n × (n − 1) / 2, де n — кількість людей. Додали одну людину — каналів додалося стільки, скільки людей уже було."
    >
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={id}>Людей у команді</label>
        <span className="font-display font-semibold tabular-nums">{n}</span>
      </div>
      <input
        id={id}
        type="range"
        min={2}
        max={12}
        step={1}
        value={n}
        onChange={(e) => setN(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--accent)]"
      />
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto mt-4 h-auto w-full max-w-[260px]" aria-hidden>
        {lines.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={pts[a][0]}
            y1={pts[a][1]}
            x2={pts[b][0]}
            y2={pts[b][1]}
            strokeWidth={1.25}
            style={{ stroke: "var(--accent)", strokeOpacity: 0.55 }}
          />
        ))}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7} strokeWidth={2} style={{ fill: "var(--foreground)", stroke: "var(--surface)" }} />
        ))}
      </svg>
      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {n} {n < 5 ? "людини" : "людей"} —{" "}
        <span className="font-display font-semibold text-accent">{channels(n)}</span>{" "}
        {channels(n) % 10 === 1 && channels(n) % 100 !== 11
          ? "канал"
          : [2, 3, 4].includes(channels(n) % 10) && ![12, 13, 14].includes(channels(n) % 100)
            ? "канали"
            : "каналів"}{" "}
        комунікації.
      </p>
    </Figure>
  );
}
