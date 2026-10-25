"use client";

import { useState } from "react";
import { TASKS, successors } from "@/content/examples/game-plan";
import { Figure } from "./figure";
import { EDGES, NetworkDiagram, edgeKey } from "./network-diagram";

const merges = TASKS.filter((t) => t.after.length > 1).map((t) => t.id);
const bursts = TASKS.filter((t) => successors(t.id).length > 1).map((t) => t.id);
// Tasks that all start right after the concept and don't depend on each other.
const parallel = successors(1);

const concepts = [
  {
    key: "merge",
    label: "Злиття",
    nodes: merges,
    edges: EDGES.filter(([, to]) => merges.includes(to)),
    text: "Рівні (5) не почнуться, поки не готові і дизайн, і механіка. Тестування (7) чекає на рівні та сервер, а реліз (8) — на тестування та маркетинг.",
  },
  {
    key: "burst",
    label: "Розбивка",
    nodes: bursts,
    edges: EDGES.filter(([from]) => bursts.includes(from)),
    text: "Щойно готова концепція (1), стартують одразу три роботи. Після дизайну (2) можна братися і за рівні, і за сторінку в магазині.",
  },
  {
    key: "parallel",
    label: "Паралельні",
    nodes: parallel,
    edges: EDGES.filter(([from, to]) => from === 1 && parallel.includes(to)),
    text: "Дизайн, механіку і сервер роблять одночасно різні люди: ці роботи не залежать одна від одної.",
  },
] as const;

// The game plan as an AON network; buttons highlight merge, burst and
// parallel activities.
export function GameNetwork() {
  const [active, setActive] = useState<(typeof concepts)[number]["key"] | null>(null);
  const concept = concepts.find((c) => c.key === active);

  return (
    <Figure
      title="Мережевий графік гри"
      lead="Вісім робіт від концепції до релізу: кожна — блок, кожна залежність — стрілка."
      caption="Номер роботи стоїть у лівому куті блоку, тривалість у тижнях — унизу. На вузькому екрані схему можна гортати вбік."
    >
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Що показати на схемі">
        {concepts.map((c) => {
          const on = c.key === active;
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(on ? null : c.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
                on
                  ? "bg-accent text-accent-foreground"
                  : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <NetworkDiagram
        label="Мережевий графік гри: концепція, далі паралельно дизайн, механіка і сервер; потім рівні та маркетинг, тестування і реліз"
        highlightNodes={new Set(concept?.nodes)}
        highlightEdges={new Set(concept?.edges.map(([a, b]) => edgeKey(a, b)))}
        dim={Boolean(concept)}
      />

      <p className="mt-5 min-h-[3.5rem] rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {concept ? concept.text : "Натисніть кнопку вище, щоб побачити на схемі злиття, розбивку чи паралельні роботи."}
      </p>
    </Figure>
  );
}
