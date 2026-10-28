"use client";

import { useState } from "react";
import { ApproachBonus } from "@/components/my-project/project-approach";
import * as G from "@/content/assignments/module-03";
import { AssignmentGame, chip, Feedback, Meter, primary } from "./game-kit";

const option = (on: boolean) =>
  `flex flex-col gap-1.5 rounded-[6px] p-3 text-left leading-snug press ${
    on ? "bg-accent text-accent-foreground" : "bg-background hover:bg-foreground/[0.08]"
  }`;

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-1.5" aria-label={`${n} з 5`}>
      {[0, 1, 2, 3, 4].map((k) => (
        <span key={k} className={`block size-3.5 rotate-45 rounded-[2px] ${k < n ? "bg-accent" : "bg-foreground/15"}`} />
      ))}
    </span>
  );
}

// Twelve planned weeks; weeks past the plan are drawn as overrun.
function Timeline({ week }: { week: number }) {
  const cells = Math.max(G.PLAN_WEEKS, week);
  const over = week - G.PLAN_WEEKS;
  return (
    <div>
      <div className="flex justify-between text-[13px]">
        <span className="text-muted">Тиждень</span>
        <span className="tabular-nums">
          {week} з {G.PLAN_WEEKS}
          {over > 0 && <span className="text-accent"> (+{over})</span>}
        </span>
      </div>
      <div className="mt-1 flex gap-0.5" aria-hidden>
        {Array.from({ length: cells }, (_, k) => (
          <span
            key={k}
            className={`h-2 flex-1 rounded-[1px] transition-colors duration-300 ${
              k >= week ? "bg-foreground/15" : k >= G.PLAN_WEEKS ? "bg-accent/45" : "bg-accent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

type Attempt = { approach: G.Approach; process: G.Process; stars: number };
const approachName = (a: G.Approach) => G.APPROACHES.find((x) => x.key === a)!.name;
const processName = (p: G.Process) => G.PROCESSES.find((x) => x.key === p)!.name;

// One mission: pick approach and process, live through the project, see the
// result, and try again with another approach if you like.
function MissionLevel({ mission, last, onDone }: { mission: G.Mission; last: boolean; onDone: (score: number) => void }) {
  const [phase, setPhase] = useState<"setup" | "play" | "result">("setup");
  const [approach, setApproach] = useState<G.Approach | null>(null);
  const [process, setProcess] = useState<G.Process | null>(null);
  const [sim, setSim] = useState<G.Sim | null>(null);
  const [i, setI] = useState(0);
  const [outcome, setOutcome] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const finish = (s: G.Sim) => {
    const end = s.stopped ? s : (mission.release?.(s) ?? s);
    setSim(end);
    setAttempts((prev) => [...prev, { approach: end.approach, process: end.process, stars: G.rate(mission, end).stars }]);
    setPhase("result");
  };
  const goTo = (k: number, s: G.Sim) => {
    setOutcome(null);
    if (k >= mission.moments.length) return finish(s);
    setSim(mission.moments[k].enter?.(s) ?? s);
    setI(k);
  };
  const begin = () => {
    if (!approach || !process) return;
    setPhase("play");
    goTo(0, G.newSim(mission, approach, process));
  };
  const choose = (o: G.Option) => {
    if (!sim || outcome !== null) return;
    const r = o.apply(sim);
    setSim(r.s);
    if (r.s.stopped) return finish(r.s);
    if (!r.outcome) return goTo(i + 1, r.s);
    setOutcome(r.outcome);
  };

  if (phase === "setup")
    return (
      <div>
        <p className="text-muted">
          Обери підхід до розробки і скільки процесу, а потім веди проєкт. Від цих двох рішень залежить, що станеться
          далі. Місію можна переграти іншим підходом.
        </p>
        <div className="mt-5 rounded-[6px] bg-surface-raised p-5">
          <p className="font-display text-xl font-semibold">{mission.name}</p>
          <p className="mt-1 leading-relaxed">{mission.brief}</p>
        </div>

        <p className="mt-6 font-medium">Підхід до розробки</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3" role="group" aria-label="Підхід до розробки">
          {G.APPROACHES.map((a) => (
            <button
              key={a.key}
              type="button"
              aria-pressed={approach === a.key}
              onClick={() => setApproach(a.key)}
              className={option(approach === a.key)}
            >
              <span className="font-medium">{a.name}</span>
              <span className={`text-[13px] ${approach === a.key ? "" : "text-muted"}`}>{a.note}</span>
            </button>
          ))}
        </div>

        <p className="mt-5 font-medium">Скільки процесу</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2" role="group" aria-label="Скільки процесу">
          {G.PROCESSES.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-pressed={process === p.key}
              onClick={() => setProcess(p.key)}
              className={option(process === p.key)}
            >
              <span className="font-medium">{p.name}</span>
              <span className={`text-[13px] ${process === p.key ? "" : "text-muted"}`}>{p.note}</span>
            </button>
          ))}
        </div>

        <button type="button" onClick={begin} disabled={!approach || !process} className={`${primary} mt-6`}>
          Почати місію
        </button>
      </div>
    );

  if (!sim) return null;

  if (phase === "result") {
    const { stars, checks } = G.rate(mission, sim);
    const best = Math.max(...attempts.map((a) => a.stars));
    return (
      <div>
        <p className="text-sm text-muted">{mission.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-4">
          <h3 className="font-display text-2xl font-semibold tracking-tight">
            {sim.stopped ? "Проєкт зупинено" : `Реліз на ${G.PLAN_WEEKS + sim.delay}-му тижні`}
          </h3>
          <Stars n={stars} />
        </div>
        <p className="mt-1 text-sm text-muted">
          {approachName(sim.approach)} підхід, процес «{processName(sim.process).toLowerCase()}»
        </p>

        {checks.length > 0 && (
          <ul className="mt-5 space-y-1.5">
            {checks.map((c) => (
              <li key={c.text} className={`flex gap-2 ${c.ok ? "" : "text-muted"}`}>
                <span aria-hidden className="w-4 shrink-0 font-semibold">
                  {c.ok ? "✓" : "✗"}
                </span>
                {c.text}
              </li>
            ))}
          </ul>
        )}

        {sim.notes.length > 0 && (
          <div className="mt-5">
            <p className="font-medium">Що вплинуло</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 leading-relaxed">
              {sim.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed">{mission.moral}</p>

        {attempts.length > 1 && (
          <div className="mt-5">
            <p className="font-medium">Твої спроби</p>
            <ul className="mt-2 space-y-1.5">
              {attempts.map((a, k) => (
                <li
                  key={k}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-[4px] bg-foreground/[0.05] px-3 py-2 text-sm"
                >
                  <span>
                    {approachName(a.approach)}, {processName(a.process).toLowerCase()}
                  </span>
                  <Stars n={a.stars} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={() => onDone(best)} className={primary}>
            {last ? "Завершити" : "До наступної місії"}
          </button>
          <button
            type="button"
            onClick={() => {
              setApproach(null);
              setProcess(null);
              setPhase("setup");
            }}
            className={chip(false)}
          >
            Зіграти іншим підходом
          </button>
        </div>
        {attempts.length > 1 && <p className="mt-3 text-sm text-muted">Зараховується найкраща спроба: {best} з 5.</p>}
      </div>
    );
  }

  const m = mission.moments[i];
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Timeline week={m.week + sim.delay} />
        <Meter label="Дух команди" value={sim.morale} />
        {sim.seen ? (
          <Meter label={mission.meterName} value={Math.min(100, sim.meter)} />
        ) : (
          <div>
            <div className="flex justify-between text-[13px]">
              <span className="text-muted">{mission.meterName}</span>
              <span>?</span>
            </div>
            <p className="mt-1 text-[12px] leading-snug text-muted">{mission.meterHidden}</p>
          </div>
        )}
      </div>

      <p className="mt-6 inline-block rounded-md bg-foreground/[0.07] px-2.5 py-1 text-[13px]">
        Фокусна область: {m.area}
        {sim.approach === "adaptive" && m.week > 0 && (
          <span className="text-muted"> · в адаптивному підході цикл повторюється щоспринту</span>
        )}
      </p>
      <div className="mt-3 rounded-[6px] bg-surface-raised p-5">
        <p className="text-[13px] text-muted">{m.title}</p>
        <p className="mt-1 font-display text-xl font-semibold leading-snug sm:text-2xl">{m.text(sim)}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Рішення">
        {m.options(sim).map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => choose(o)}
            disabled={outcome !== null}
            className={`${chip(false)} py-2.5 disabled:opacity-50`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {outcome !== null && (
        <div className="mt-5 space-y-4">
          <Feedback ok={false} title="Що сталося">
            {outcome}
          </Feedback>
          <button type="button" onClick={() => goTo(i + 1, sim)} className={primary}>
            {i === mission.moments.length - 1 ? "До релізу" : "Далі"}
          </button>
        </div>
      )}
    </div>
  );
}

// Module 3 game: a project simulator in two missions, then the approach for
// the own project.
export function ApproachesGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Record<string, never>>
      storeKey="vikha-assignment-module-03"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({})}
      levels={G.MISSIONS.map((mission, k) => ({
        name: `Місія ${k + 1}: ${mission.name}`,
        play: (_, done) => <MissionLevel mission={mission} last={k === G.MISSIONS.length - 1} onDone={done} />,
      }))}
      startLabel="Почати"
      period="За дві місії"
      finalTitle="Третя віха!"
      finalText="Модуль 3 пройдено. Далі — як порахувати, чи вигідно братися за проєкт."
      nextHref={nextHref}
      nextLabel="До модуля 4"
    >
      <ApproachBonus />
    </AssignmentGame>
  );
}
