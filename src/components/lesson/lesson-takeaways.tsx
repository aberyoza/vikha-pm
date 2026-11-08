import type { ReactNode } from "react";

// «Головне з уроку», the last block of every lesson: a summary makes sense only
// after the text, so it sits at the end, in a tone step rather than the accent.
export function LessonTakeaways({ children }: { children: ReactNode }) {
  return (
    <aside className="my-10 rounded-[4px] bg-surface p-5 sm:p-8 [&>:last-child]:mb-0">
      <p className="mt-0 font-display text-lg font-semibold">Головне з уроку</p>
      {children}
    </aside>
  );
}
