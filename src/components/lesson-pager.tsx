import Link from "next/link";

export type PagerTarget = { href: string; label: string; title: string };

function Arrow({ back }: { back?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-5 shrink-0 ${back ? "rotate-180" : ""}`}
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

// The last block of a lesson or assignment, always in the same place. «Далі» is
// the one filled button of a lesson. A game has its own filled button, so there
// `quiet` keeps this one in a tone.
export function LessonPager({ prev, next, quiet }: { prev?: PagerTarget; next: PagerTarget; quiet?: boolean }) {
  return (
    <nav
      aria-label="Перехід між уроками"
      className="mt-16 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between print:hidden"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="flex min-w-0 items-center gap-3 text-muted transition-colors duration-200 hover:text-foreground sm:max-w-[40%]"
        >
          <Arrow back />
          <span className="min-w-0">
            <span className="block text-sm">{prev.label}</span>
            <span className="block font-medium">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      <Link
        href={next.href}
        className={`flex min-w-0 items-center justify-between gap-4 rounded-md px-5 py-3 press sm:max-w-[60%] ${
          quiet ? "bg-surface hover:bg-surface-raised" : "bg-accent text-accent-foreground hover:brightness-110"
        }`}
      >
        <span className="min-w-0">
          <span className="block text-sm">{next.label}</span>
          <span className="block font-display text-lg leading-snug font-semibold">{next.title}</span>
        </span>
        <Arrow />
      </Link>
    </nav>
  );
}
