import type { ReactNode } from "react";

type CalloutProps = {
  title: string;
  children: ReactNode;
};

// Highlighted box for key takeaways, e.g. a module's conclusions.
export function Callout({ title, children }: CalloutProps) {
  return (
    <aside className="my-10 rounded-[4px] bg-accent-soft p-5 sm:p-8 [&>:last-child]:mb-0">
      <p className="mt-0 font-display text-lg font-semibold">
        {title}
      </p>
      {children}
    </aside>
  );
}
