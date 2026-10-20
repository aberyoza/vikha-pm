import { useId } from "react";
import { TASKS, type Scheduled } from "@/content/examples/game-plan";

// Activity-on-node network of the module 5 game plan. Used inside client
// figures (GameNetwork, CpmExplorer), which decide what to highlight.

const W = 140;
const H = 84;
const BAND = 26;
const COL = 180;
const ROW = 120;
const PAD = 10;

// Column and row of every task, left to right.
const GRID: Record<number, [number, number]> = {
  1: [0, 1],
  2: [1, 0],
  3: [1, 1],
  4: [1, 2],
  5: [2, 1],
  6: [2, 0],
  7: [3, 1],
  8: [4, 1],
};

const box = (id: number) => {
  const [c, r] = GRID[id];
  return { x: PAD + c * COL, y: PAD + r * ROW };
};

export const edgeKey = (from: number, to: number) => `${from}-${to}`;

export const EDGES = TASKS.flatMap((t) => t.after.map((p) => [p, t.id] as const));

// Neighbouring columns: a straight line. Longer jumps run along the source
// row and turn into the target from above or below, so they never cross a node.
function edgePath(from: number, to: number) {
  const a = box(from);
  const b = box(to);
  const x1 = a.x + W;
  const y1 = a.y + H / 2;
  if (GRID[to][0] - GRID[from][0] === 1) return `M${x1},${y1} L${b.x - 2},${b.y + H / 2}`;
  const cx = b.x + W / 2;
  const y2 = b.y > a.y ? b.y - 2 : b.y + H + 2;
  return `M${x1},${y1} L${cx},${y1} L${cx},${y2}`;
}

type NetworkDiagramProps = {
  label: string;
  // "name": task names and durations; "cpm": the six-cell AON box.
  mode?: "name" | "cpm";
  plan?: Scheduled[];
  showEarly?: boolean;
  showLate?: boolean;
  highlightNodes?: ReadonlySet<number>;
  highlightEdges?: ReadonlySet<string>;
  // Fade everything that is not highlighted.
  dim?: boolean;
};

export function NetworkDiagram({
  label,
  mode = "name",
  plan,
  showEarly = false,
  showLate = false,
  highlightNodes = new Set(),
  highlightEdges = new Set(),
  dim = false,
}: NetworkDiagramProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const width = PAD * 2 + 4 * COL + W;
  const height = PAD * 2 + 2 * ROW + H;
  const byId = new Map(plan?.map((t) => [t.id, t]));

  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[640px]"
        role="img"
        aria-label={label}
      >
        <defs>
          {(["muted", "accent"] as const).map((tone) => (
            <marker
              key={tone}
              id={`${uid}-${tone}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="9"
              markerHeight="9"
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10 z" style={{ fill: `var(--${tone})` }} />
            </marker>
          ))}
        </defs>

        {EDGES.map(([from, to]) => {
          const on = highlightEdges.has(edgeKey(from, to));
          return (
            <path
              key={edgeKey(from, to)}
              d={edgePath(from, to)}
              fill="none"
              strokeWidth={on ? 3 : 1.5}
              strokeLinejoin="round"
              opacity={dim && !on ? 0.35 : 1}
              markerEnd={`url(#${uid}-${on ? "accent" : "muted"})`}
              style={{ stroke: on ? "var(--accent)" : "var(--muted)" }}
              className="transition-[stroke,opacity] duration-200"
            />
          );
        })}

        {TASKS.map((t) => {
          const { x, y } = box(t.id);
          const on = highlightNodes.has(t.id);
          const s = byId.get(t.id);
          const cell = (i: number) => x + (W / 3) * i + W / 6;
          return (
            <g
              key={t.id}
              opacity={dim && !on ? 0.35 : 1}
              className="transition-opacity duration-200"
            >
              <rect
                x={x}
                y={y}
                width={W}
                height={H}
                rx={4}
                strokeWidth={on ? 2.5 : 1.5}
                style={{
                  fill: on ? "var(--accent-soft)" : "var(--surface)",
                  stroke: on ? "var(--accent)" : "var(--border)",
                }}
              />
              {mode === "name" ? (
                <>
                  <text x={x + 10} y={y + 20} fontSize={14} style={{ fill: "var(--muted)" }}>
                    {t.id}
                  </text>
                  <text
                    x={x + W / 2}
                    y={y + H / 2 + 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={17}
                    fontWeight={600}
                    style={{ fill: "var(--foreground)" }}
                  >
                    {t.name}
                  </text>
                  <text
                    x={x + W / 2}
                    y={y + H - 12}
                    textAnchor="middle"
                    fontSize={14}
                    style={{ fill: "var(--muted)" }}
                  >
                    {t.weeks} тиж.
                  </text>
                </>
              ) : (
                <>
                  <g strokeWidth={1} style={{ stroke: "var(--border)" }}>
                    <line x1={x} x2={x + W} y1={y + BAND} y2={y + BAND} />
                    <line x1={x} x2={x + W} y1={y + H - BAND} y2={y + H - BAND} />
                    {[1, 2].map((i) => (
                      <g key={i}>
                        <line x1={x + (W / 3) * i} x2={x + (W / 3) * i} y1={y} y2={y + BAND} />
                        <line
                          x1={x + (W / 3) * i}
                          x2={x + (W / 3) * i}
                          y1={y + H - BAND}
                          y2={y + H}
                        />
                      </g>
                    ))}
                  </g>
                  {[
                    showEarly ? s?.es : undefined,
                    t.weeks,
                    showEarly ? s?.ef : undefined,
                  ].map((v, i) => (
                    <text
                      key={`top-${i}`}
                      x={cell(i)}
                      y={y + BAND / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={15}
                      fontWeight={i === 1 ? 400 : 600}
                      style={{ fill: i === 1 ? "var(--muted)" : "var(--foreground)" }}
                    >
                      {v}
                    </text>
                  ))}
                  <text
                    x={x + W / 2}
                    y={y + H / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={15}
                    fontWeight={600}
                    style={{ fill: "var(--foreground)" }}
                  >
                    {t.id}. {t.name}
                  </text>
                  {[
                    showLate ? s?.ls : undefined,
                    showLate ? s?.slack : undefined,
                    showLate ? s?.lf : undefined,
                  ].map((v, i) => (
                    <text
                      key={`bottom-${i}`}
                      x={cell(i)}
                      y={y + H - BAND / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={15}
                      fontWeight={600}
                      style={{
                        fill: i === 1 && v === 0 ? "var(--accent)" : "var(--foreground)",
                      }}
                    >
                      {v}
                    </text>
                  ))}
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Key to the six-cell node: what each number means.
export function NodeKey() {
  const cell = "border-border px-2 py-1 text-center";
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
      <div className="grid w-44 shrink-0 grid-cols-3 rounded-[4px] border border-border text-[13px]">
        <span className={`${cell} border-r border-b font-semibold`}>ES</span>
        <span className={`${cell} border-r border-b text-muted`}>t</span>
        <span className={`${cell} border-b font-semibold`}>EF</span>
        <span className={`${cell} col-span-3 border-b font-semibold`}>Робота</span>
        <span className={`${cell} border-r font-semibold`}>LS</span>
        <span className={`${cell} border-r font-semibold`}>R</span>
        <span className={`${cell} font-semibold`}>LF</span>
      </div>
      <dl className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-0.5 text-[13px] leading-snug">
        <dt className="font-semibold">t</dt>
        <dd className="text-muted">тривалість у тижнях</dd>
        <dt className="font-semibold">ES, EF</dt>
        <dd className="text-muted">ранній старт і ранній фініш (Early Start, Early Finish)</dd>
        <dt className="font-semibold">LS, LF</dt>
        <dd className="text-muted">пізній старт і пізній фініш (Late Start, Late Finish)</dd>
        <dt className="font-semibold">R</dt>
        <dd className="text-muted">резерв часу (Reserve)</dd>
      </dl>
    </div>
  );
}
