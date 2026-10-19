import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "text";
};

const buttonVariants = {
  primary:
    "inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 font-semibold text-accent-foreground transition-[filter] duration-200 hover:brightness-110",
  text: "inline-flex h-12 items-center font-medium text-foreground underline decoration-border decoration-2 underline-offset-[6px] transition-colors duration-200 hover:decoration-accent",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return <Link className={`${buttonVariants[variant]} ${className}`} {...props} />;
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[34px]">
      {children}
    </h2>
  );
}

// Ukrainian plural: 1 урок, 2–4 уроки, 5+ уроків.
export function lessonsLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} урок`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} уроки`;
  return `${n} уроків`;
}
