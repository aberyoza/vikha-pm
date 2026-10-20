"use client";

import { THEME_COLORS, THEME_STORAGE_KEY } from "./theme";

function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[next]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Private mode or blocked storage: the theme still switches for this visit.
  }
}

// Both icons are rendered; CSS shows the right one, so server and client
// markup match whatever theme the inline script picked.
export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Перемкнути світлу або темну тему"
      title="Світла / темна тема"
      className="grid size-10 place-items-center rounded-md text-muted transition-colors duration-200 hover:text-foreground"
    >
      {/* Sun: shown in dark theme, switches to light */}
      <svg viewBox="0 0 24 24" className="size-5 light:hidden" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* Moon: shown in light theme, switches to dark */}
      <svg viewBox="0 0 24 24" className="hidden size-5 light:block" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
