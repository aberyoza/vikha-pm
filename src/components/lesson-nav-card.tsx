import Link from "next/link";

type Props = {
  href: string;
  label: string;
  title: string;
  direction: "prev" | "next";
  highlight?: boolean;
};

function Arrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-5 transition-transform duration-200 ${
        direction === "next" ? "group-hover:translate-x-0.5" : "rotate-180 group-hover:-translate-x-0.5"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Card that links to the previous/next lesson. The arrow sits on the side
// the reader is going, so the card reads as navigation at a glance.
export function LessonNavCard({ href, label, title, direction, highlight }: Props) {
  const next = direction === "next";
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 rounded-[4px] border p-5 transition-colors duration-200 hover:border-accent ${
        highlight ? "border-accent/60 bg-accent-soft/50" : "border-border bg-surface"
      } ${next ? "flex-row-reverse text-right" : ""}`}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-accent transition-colors duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
        <Arrow direction={direction} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`text-sm ${highlight ? "text-accent" : "text-muted"}`}>{label}</span>
        <span className="mt-1 block font-display text-lg font-semibold group-hover:text-accent">
          {title}
        </span>
      </span>
    </Link>
  );
}
