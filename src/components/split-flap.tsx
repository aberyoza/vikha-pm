"use client";

import { useEffect, useState } from "react";

const ALPHABET = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ0123456789";
const STEPS = 8;
const STAGGER = 35;
const TICK = 55;

const random = () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

// One row of a split-flap board: each tile flips through letters and lands
// on its own character, left to right.
function useFlap(target: string) {
  const [shown, setShown] = useState(target);

  useEffect(() => {
    // With reduced motion the board shows the final text on the first frame.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    let frame = 0;
    const step = () => {
      const t = reduce ? Infinity : performance.now() - started;
      const next = [...target]
        .map((ch, i) => {
          if (ch === " ") return " ";
          const flips = Math.floor((t - i * STAGGER) / TICK);
          return flips >= STEPS ? ch : flips < 0 ? " " : random();
        })
        .join("");
      setShown(next);
      if (next !== target) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return shown;
}

export function SplitFlapRow({ text, width }: { text: string; width: number }) {
  const padded = text.toUpperCase().padEnd(width, " ").slice(0, width);
  const shown = useFlap(padded);
  return (
    <div className="grid gap-[3px] sm:gap-1" style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))` }} aria-label={text}>
      {[...shown].map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[3px] bg-surface-raised font-display text-[clamp(0.7rem,3.2vw,1.5rem)] font-semibold"
        >
          {ch}
          <span className="absolute inset-x-0 top-1/2 h-px bg-background/70" />
        </span>
      ))}
    </div>
  );
}
