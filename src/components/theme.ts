// Shared by the server layout (inline script) and the client toggle.
// Kept out of the "use client" module so the server gets real strings.

export const THEME_STORAGE_KEY = "vikha-theme";

export const THEME_COLORS = { dark: "#17140f", light: "#f7f2e9" } as const;

// Runs in <head> before first paint, so a saved light theme never flashes dark.
export const themeInitScript = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light"){document.documentElement.setAttribute("data-theme","light");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","${THEME_COLORS.light}")}}catch(e){}})()`;
