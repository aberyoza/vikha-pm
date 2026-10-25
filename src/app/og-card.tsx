import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { modules } from "@/content/course";

// Shared look of the link-preview images (1200×630): the wordmark, a kicker,
// a large title and the course drawn as a one-line Gantt strip.

export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  background: "#121211",
  foreground: "#ecebe6",
  muted: "#a3a29b",
  accent: "#e8a33d",
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
            <div style={{ width: 22, height: 22, background: C.accent, borderRadius: 3, transform: "rotate(45deg)" }} />
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
