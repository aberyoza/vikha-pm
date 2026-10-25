import type { ReactNode } from "react";

type FigureProps = {
  title?: string;
  lead?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
};

// Frame for lesson illustrations: a tone step from the page (no outline),
// the lead statement, the visual and a takeaway caption. The short title
// names the figure for screen readers only; a visible label above the lead
// would be one more eyebrow.
export function Figure({ title, lead, caption, children }: FigureProps) {
  return (
    <figure aria-label={title} className="@container not-prose my-10 rounded-[4px] bg-surface p-5 sm:p-8">
      {lead && (
        <p className="font-display text-xl font-semibold leading-snug tracking-tight sm:text-[22px]">
          {lead}
        </p>
      )}
      <div className={lead ? "mt-6" : undefined}>{children}</div>
      {caption && (
        <figcaption className="mt-6 text-sm leading-relaxed text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
