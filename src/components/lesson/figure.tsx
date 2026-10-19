import type { ReactNode } from "react";

type FigureProps = {
  title?: string;
  lead?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
};

// Frame for lesson illustrations: small label, optional lead statement,
// the visual itself and a takeaway caption.
export function Figure({ title, lead, caption, children }: FigureProps) {
  return (
    <figure className="@container not-prose my-10 rounded-[4px] border border-border bg-surface p-5 sm:p-8">
      {title && (
        <p className="text-sm text-muted">
          {title}
        </p>
      )}
      {lead && (
        <p className="mt-1 font-display text-xl font-semibold leading-snug tracking-tight sm:text-[22px]">
          {lead}
        </p>
      )}
      <div className="mt-6">{children}</div>
      {caption && (
        <figcaption className="mt-6 border-t border-border pt-4 text-sm leading-relaxed text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
