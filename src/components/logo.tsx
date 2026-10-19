import Link from "next/link";

// A milestone is drawn as a diamond on a Gantt chart — hence the mark.
export function MilestoneMark({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <rect
        x="3"
        y="3"
        width="10"
        height="10"
        rx="1.5"
        transform="rotate(45 8 8)"
        style={{ fill: "var(--accent)" }}
      />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight"
    >
      <MilestoneMark />
      Віха
    </Link>
  );
}
