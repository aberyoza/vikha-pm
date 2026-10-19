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

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 font-display text-[22px] font-semibold tracking-tight"
    >
      <MilestoneMark />
      Віха
    </Link>
  );
}
