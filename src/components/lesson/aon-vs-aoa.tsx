import { Figure } from "./figure";

const line = { stroke: "var(--muted)" };
const text = { fill: "var(--foreground)" };

function Marker({ id }: { id: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--muted)" }} />
    </marker>
  );
}

// The same three activities drawn activity-on-node and activity-on-arrow.
export function AonVsAoa() {
  return (
    <Figure
      title="AON проти AOA"
      lead="Ті самі три роботи: дизайн і механіка паралельно, потім рівні."
      caption="В AOA дві паралельні роботи між тими самими подіями отримали б однакове позначення (1–2). Щоб їх розрізнити, додають фіктивну роботу тривалістю 0 (пунктир) і ще одну подію."
    >
      <div className="grid gap-6 @xl:grid-cols-2">
        <div>
          <p className="font-medium">AON — робота у вузлі</p>
          <p className="mt-0.5 text-[13px] text-muted">блок — робота, стрілка — залежність</p>
          <svg viewBox="0 0 260 150" className="mt-3 h-auto w-full max-w-[320px]" role="img" aria-label="AON: блоки Дизайн і Механіка ведуть стрілками до блоку Рівні">
            <defs>
              <Marker id="aon-arrow" />
            </defs>
            {[
              { x: 10, y: 15, label: "Дизайн" },
              { x: 10, y: 95, label: "Механіка" },
              { x: 160, y: 55, label: "Рівні" },
            ].map((n) => (
              <g key={n.label}>
                <rect x={n.x} y={n.y} width={90} height={40} rx={4} strokeWidth={1.5} style={{ fill: "var(--surface)", stroke: "var(--accent)" }} />
                <text x={n.x + 45} y={n.y + 21} textAnchor="middle" dominantBaseline="central" fontSize={15} style={text}>
                  {n.label}
                </text>
              </g>
            ))}
            <path d="M100,35 L158,70" strokeWidth={1.5} markerEnd="url(#aon-arrow)" style={line} />
            <path d="M100,115 L158,80" strokeWidth={1.5} markerEnd="url(#aon-arrow)" style={line} />
          </svg>
        </div>
        <div>
          <p className="font-medium">AOA — робота на стрілці</p>
          <p className="mt-0.5 text-[13px] text-muted">коло — подія (віха), стрілка — робота</p>
          <svg viewBox="0 0 280 150" className="mt-3 h-auto w-full max-w-[340px]" role="img" aria-label="AOA: події 1, 2 і 3; дизайн іде з 1 у 2, механіка з 1 у додаткову подію 2а, звідти фіктивна робота в 2; рівні з 2 у 3">
            <defs>
              <Marker id="aoa-arrow" />
            </defs>
            <path d="M42,70 L148,30" strokeWidth={1.5} markerEnd="url(#aoa-arrow)" style={line} />
            <text x={80} y={36} fontSize={13} style={text}>Дизайн</text>
            <path d="M42,82 L98,118" strokeWidth={1.5} markerEnd="url(#aoa-arrow)" style={line} />
            <text x={14} y={134} fontSize={13} style={text}>Механіка</text>
            <path d="M128,118 L154,50" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#aoa-arrow)" style={line} />
            <text x={146} y={100} fontSize={12} style={{ fill: "var(--muted)" }}>фіктивна, 0</text>
            <path d="M184,35 L238,70" strokeWidth={1.5} markerEnd="url(#aoa-arrow)" style={line} />
            <text x={214} y={42} fontSize={13} style={text}>Рівні</text>
            {[
              { x: 26, y: 75, label: "1" },
              { x: 166, y: 30, label: "2" },
              { x: 114, y: 126, label: "2а" },
              { x: 254, y: 78, label: "3" },
            ].map((e) => (
              <g key={e.label}>
                <circle cx={e.x} cy={e.y} r={16} strokeWidth={1.5} style={{ fill: "var(--surface)", stroke: "var(--accent)" }} />
                <text x={e.x} y={e.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={600} style={text}>
                  {e.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </Figure>
  );
}
