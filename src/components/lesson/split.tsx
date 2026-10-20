import { Children, type ReactNode } from "react";

// Lesson text beside an illustration. In MDX the last child is the
// illustration, everything before it is the text:
//
//   <Split>
//
//   Paragraphs, lists…
//
//   <CriticalPath />
//
//   </Split>
//
// On wide screens they sit side by side; otherwise the illustration
// follows the text.
export function Split({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(
    (child) => typeof child !== "string" || child.trim() !== "",
  );
  const aside = items.pop();

  return (
    <div
      data-split
      className="my-10 grid gap-x-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-start"
    >
      <div className="min-w-0 [&>:first-child]:mt-0">{items}</div>
      <div className="min-w-0 xl:[&>*]:mt-0">{aside}</div>
    </div>
  );
}

// A figure that needs the full content width (e.g. a mind map).
export function Wide({ children }: { children: ReactNode }) {
  return (
    <div data-split className="my-10 [&>figure]:my-0">
      {children}
    </div>
  );
}

// A long list flowed into two columns on wide screens.
export function Columns({ children }: { children: ReactNode }) {
  return (
    <div
      data-split
      className="my-6 xl:columns-2 xl:gap-12 [&>:first-child]:mt-0 [&_li]:break-inside-avoid [&_li:first-child]:mt-0"
    >
      {children}
    </div>
  );
}

type CalloutProps = {
  title: string;
  children: ReactNode;
};

// Highlighted box for key takeaways, e.g. lesson outcomes.
export function Callout({ title, children }: CalloutProps) {
  return (
    <aside className="my-10 rounded-[4px] border border-accent/60 bg-accent-soft/50 p-5 sm:p-8 [&>:last-child]:mb-0">
      <p className="mt-0 font-display text-lg font-semibold text-accent">
        {title}
      </p>
      {children}
    </aside>
  );
}
