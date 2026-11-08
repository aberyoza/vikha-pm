"use client";

import { lessonKey, useCourseProgress } from "@/lib/lesson-progress";

// Marks of the module track. They show real progress, so they live in the
// browser: the page itself is static and renders them as «not read» first.
export function LessonMark({ moduleSlug, lessonSlug, current }: { moduleSlug: string; lessonSlug: string; current: boolean }) {
  const { read } = useCourseProgress();
  const done = !!read[lessonKey(moduleSlug, lessonSlug)];
  return (
    <>
      <span
        aria-hidden
        className={`absolute top-[15px] left-px size-3 rounded-full border-2 ${
          current
            ? "border-accent bg-surface ring-4 ring-accent-soft"
            : done
              ? "border-second bg-second"
              : "border-border-strong bg-surface"
        }`}
      />
      {done && <span className="sr-only">Прочитано. </span>}
    </>
  );
}

// The assignment's diamond: an outline until the game is finished, then filled.
export function AssignmentMark({ slug, current }: { slug: string; current: boolean }) {
  const { games } = useCourseProgress();
  const done = games.has(slug);
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

export function ModuleProgress({ moduleSlug, lessons, game }: { moduleSlug: string; lessons: string[]; game: boolean }) {
  const { read, games } = useCourseProgress();
  const total = lessons.length + (game ? 1 : 0);
  const done = lessons.filter((l) => read[lessonKey(moduleSlug, l)]).length + (game && games.has(moduleSlug) ? 1 : 0);
  return (
    <div className="mt-4">
      <div
        role="progressbar"
        aria-label="Пройдено в модулі"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="h-1 overflow-hidden rounded-[2px] bg-foreground/10"
      >
        <div className="h-full rounded-[2px] bg-second transition-[width] duration-200" style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <p className="mt-2 text-sm text-muted tabular-nums">
        Пройдено {done} з {total}
      </p>
    </div>
  );
}
