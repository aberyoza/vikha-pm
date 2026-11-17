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

// The author's choice (2026-11-17): length only, no forced digits or capitals.
// The same minimum is set in Supabase, which checks it again on the server.
export const PASSWORD_MIN = 8;
export const PASSWORD_ERROR = `Пароль має бути щонайменше ${PASSWORD_MIN} символів`;
export const isValidPassword = (password: string) => password.length >= PASSWORD_MIN;

// How a person came back from Google or a letter, so a failed link explains itself.
export type AuthVia = "google" | "email" | "signup" | "recovery";
