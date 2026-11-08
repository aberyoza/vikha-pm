"use client";

import { currentModuleIndex, useCourseProgress, type ModuleOutline } from "@/lib/lesson-progress";

function useCurrentModule(outline: ModuleOutline[]) {
  const { read, games } = useCourseProgress();
  return currentModuleIndex(outline, read, games);
}

// The «Ви тут» line of the Gantt chart. It sits under the bars so that it never
// crosses their text. Someone who hasn't started has no place yet.
export function GanttHereLine({ outline, labelWidth, endWidth }: { outline: ModuleOutline[]; labelWidth: string; endWidth: string }) {
  const index = useCurrentModule(outline);
  if (index < 0) return null;
  const at = (columns: number) => `calc(${labelWidth} + (100% - ${labelWidth} - ${endWidth}) * ${columns / outline.length})`;
  const nearEnd = index >= outline.length - 3;
  return (
    <div aria-hidden className="pointer-events-none">
      <div className="absolute inset-y-0 z-[5] w-0.5 bg-second" style={{ left: at(index + 0.5) }} />
      {/* In the top row, clear of its bar, which ends at the second column. */}
      <span
        className={`absolute top-[12px] z-[5] bg-surface px-1 text-[13px] font-semibold whitespace-nowrap text-second ${nearEnd ? "-ml-2 -translate-x-full" : "ml-2"}`}
        style={{ left: at(Math.max(index + 0.5, 2)) }}
      >
        Ви тут
      </span>
    </div>
  );
}

export function GanttHereLegend({ outline }: { outline: ModuleOutline[] }) {
  if (useCurrentModule(outline) < 0) return null;
  return (
    <span className="flex items-center gap-2">
      <i className="h-3 w-0.5 bg-second" />
      Ви тут
    </span>
  );
}

// The same place in the list that replaces the chart on narrower screens.
export function ListHere({ outline, index }: { outline: ModuleOutline[]; index: number }) {
  if (useCurrentModule(outline) !== index) return null;
  return <span className="mt-0.5 block text-[13px] font-semibold text-second">Ви тут</span>;
}
