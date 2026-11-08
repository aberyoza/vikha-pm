"use client";

import { useSyncExternalStore } from "react";
import { subscribeGames } from "@/lib/my-project";

const isDone = (slug: string) => {
  try {
    return !!JSON.parse(localStorage.getItem(`vikha-assignment-${slug}`) ?? "null")?.completedAt;
  } catch {
    return false;
  }
};

// The diamond of a module's assignment: filled once the game is finished.
export function AssignmentMark({ slug, current }: { slug: string; current: boolean }) {
  const done = useSyncExternalStore(subscribeGames, () => isDone(slug), () => false);
  return (
    <>
      <span
        aria-hidden
        className={`absolute top-[15px] left-px size-3 rotate-45 rounded-[2px] border-2 border-accent ${done ? "bg-accent" : "bg-surface"} ${current ? "ring-4 ring-accent-soft" : ""}`}
      />
      {done && <span className="sr-only">Пройдено. </span>}
    </>
  );
}
