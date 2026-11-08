import type { ReactNode } from "react";

// Collapsible block for formulas: the lesson reads fine without them,
// curious readers can open it.
export function FormulaNote({
  title = "Формули для допитливих",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <details className="group my-6 rounded-[4px] border border-border bg-surface px-5 py-3 [&>:last-child]:mb-1">
      <summary className="flex list-none items-center gap-3 font-medium marker:hidden [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="size-2.5 rotate-45 rounded-[1px] border-2 border-accent transition-colors duration-200 group-open:bg-accent"
        />
        {title}
      </summary>
      {children}
    </details>
  );
}

// What the reader can do after the module, at the top of its first lesson.
// Closed by default so that it doesn't compete with the lesson title.
export function ModuleGoals({ children }: { children: ReactNode }) {
  return <FormulaNote title="Після завершення цього модуля ви зможете">{children}</FormulaNote>;
}
