// Sign-in stays hidden until saving progress exists, so a visitor never signs in for nothing.
export const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "1";

export type Experience = "none" | "lt_1" | "1_3" | "3_plus";

export const EXPERIENCE: { key: Experience; name: string }[] = [
  { key: "none", name: "Немає" },
  { key: "lt_1", name: "До 1 року" },
  { key: "1_3", name: "1–3 роки" },
  { key: "3_plus", name: "3+ роки" },
];

export const NAME_MIN = 2;
export const NAME_MAX = 50;
export const GOAL_MAX = 300;

export const isValidName = (name: string) => {
  const n = name.trim().length;
  return n >= NAME_MIN && n <= NAME_MAX;
};

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// Only paths inside the site: a link in a letter must not send people elsewhere.
export const safeNext = (next: string | null | undefined) =>
  next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/";
