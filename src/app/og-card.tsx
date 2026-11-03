import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { modules } from "@/content/course";

// Shared look of the link-preview images (1200×630): the wordmark, a kicker,
// a large title and the course drawn as a one-line Gantt strip.

export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  background: "#111316",
  foreground: "#dde1e6",
  muted: "#9aa1aa",
  accent: "#8aa8dc",
  emblem: "#86c5bd",
};

const fonts = Promise.all([
  readFile(join(process.cwd(), "src/fonts/og/FixelDisplay-SemiBold.ttf")),
  readFile(join(process.cwd(), "src/fonts/og/FixelText-Medium.ttf")),
]);

export async function ogCard({ kicker, title, current }: { kicker: string; title: string; current?: number }) {
  const [display, text] = await fonts;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: C.background,
          color: C.foreground,
          fontFamily: "Fixel Text",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width={44} height={44} viewBox="0 0 24 24">
              <path d="M5 4v7a7 7 0 0 0 14 0V4M12 8v14" fill="none" stroke={C.emblem} strokeWidth="2.6" />
              <rect x="9.5" y="1.7" width="5" height="5" rx=".7" transform="rotate(45 12 4.2)" fill={C.emblem} />
            </svg>
            <div style={{ fontFamily: "Fixel Display", fontSize: 40 }}>Віха</div>
          </div>
          <div style={{ fontSize: 26, color: C.muted }}>vikha-pm.com</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, color: C.muted }}>{kicker}</div>
          <div style={{ fontFamily: "Fixel Display", fontSize: title.length > 40 ? 64 : 80, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 1000 }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {modules.map((m) => (
            <div
              key={m.number}
              style={{
                flex: 1,
                height: 12,
                borderRadius: 3,
                background: C.accent,
                opacity: current === undefined || m.number === current ? 1 : 0.28,
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fixel Display", data: display, style: "normal", weight: 600 },
        { name: "Fixel Text", data: text, style: "normal", weight: 500 },
      ],
    },
  );
}
