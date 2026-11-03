import Link from "next/link";

// A milestone is drawn as a diamond on a Gantt chart — hence the mark.
export function MilestoneMark({ className = "size-3" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rotate-45 rounded-[2px] bg-accent ${className}`}
    />
  );
}

// The brand: Ψ with a milestone diamond on its stem. Teal, so it does not read as a blue app icon.
export function Emblem({ className = "size-6" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`shrink-0 text-emblem ${className}`}>
      <path d="M5 4v7a7 7 0 0 0 14 0V4M12 8v14" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <rect x="9.5" y="1.7" width="5" height="5" rx=".7" transform="rotate(45 12 4.2)" fill="currentColor" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 font-display text-[22px] font-semibold tracking-tight"
    >
      <Emblem />
      Віха
    </Link>
  );
}
