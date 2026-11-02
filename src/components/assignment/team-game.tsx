"use client";

import { useId, useState } from "react";
import { TeamBonus } from "@/components/my-project/project-team";
import * as G from "@/content/assignments/module-10";
import { CRITERIA, VENDORS, type Criterion } from "@/content/examples/game-vendors";
import { AssignmentGame, chip, Feedback, HowTo, primary, shuffled } from "./game-kit";

type Orders = {
  terms: number[];
  contracts: number[];
  people: number[][];
  size: number[];
  scenes: number[][];
};

const optionClass = (on: boolean, off: boolean) =>
  `rounded-md px-3 py-2 text-left text-sm font-medium leading-snug press ${
    on ? "bg-accent text-accent-foreground" : `bg-foreground/[0.07] enabled:hover:bg-foreground/[0.12] ${off ? "opacity-60" : ""}`
  }`;

const weekGrid = { gridTemplateColumns: `repeat(${G.CALENDAR_WEEKS}, minmax(0, 1fr))` };
const WEEK_LINES = {
  backgroundImage: "linear-gradient(to right, var(--grid) 1px, transparent 1px)",
  backgroundSize: `${100 / G.CALENDAR_WEEKS}% 100%`,
};
const WEEK_NUMBERS = Array.from({ length: G.CALENDAR_WEEKS }, (_, k) => k + 1);

function WeekAxis() {
  return (
    <div aria-hidden className="grid text-center text-[10px] text-muted tabular-nums sm:text-[11px]" style={weekGrid}>
      {WEEK_NUMBERS.map((w) => (
        <span key={w}>{w}</span>
      ))}
    </div>
  );
}

// One work on the calendar, with arrows when it can be moved.
function CalendarRow({
  name,
  color,
  es,
  ef,
  note,
  onMove,
  canBack,
  canForward,
}: {
  name: string;
  color: string;
  es: number;
  ef: number;
  note: string;
  onMove?: (delta: number) => void;
  canBack?: boolean;
  canForward?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="text-sm">
          <span className="font-medium">{name}</span>
          <span className="text-muted tabular-nums"> · {note}</span>
        </p>
        {onMove && (
          <div className="flex gap-1">
            <button type="button" onClick={() => onMove(-1)} disabled={!canBack} aria-label={`${name}: на тиждень раніше`} className={`${chip(false)} px-3 py-1 disabled:opacity-40`}>
              ←
            </button>
            <button type="button" onClick={() => onMove(1)} disabled={!canForward} aria-label={`${name}: на тиждень пізніше`} className={`${chip(false)} px-3 py-1 disabled:opacity-40`}>
              →
            </button>
          </div>
        )}
      </div>
      <div aria-hidden className="mt-1 grid h-6 rounded-[3px] bg-foreground/[0.04]" style={{ ...weekGrid, ...WEEK_LINES }}>
        <span className={`rounded-[3px] ${color}`} style={{ gridColumn: `${es + 1} / ${ef + 1}` }} />
      </div>
    </div>
  );
}

const weekRange = (es: number, ef: number) => (ef - es > 1 ? `${es + 1}–${ef}-й тиждень` : `${ef}-й тиждень`);

// Level 1: move the programmer's works until one person does one thing at a time.
function LoadLevel({ terms, onDone }: { terms: number[]; onDone: (score: number) => void }) {
  const [round, setRound] = useState(0);
  const [mechanics, setMechanics] = useState(G.EARLIEST);
  const [server, setServer] = useState(G.EARLIEST);
  const [shown, setShown] = useState(false);
  const [term, setTerm] = useState<G.Term | null>(null);
  const [score, setScore] = useState(0);
  const r = G.LOAD_ROUNDS[round];
  const plan = G.reschedule(mechanics, r.serverLocked ?? server);
  const load = G.programmerLoad(plan.tasks);
  const over = load.flatMap((n, w) => (n > 1 ? [w + 1] : []));
  const task = (id: number) => plan.tasks.find((t) => t.id === id)!;
  const m = task(G.MECHANICS);
  const s = task(G.SERVER);
  const rel = task(G.RELEASE);
  const ok = mechanics === r.right.mechanics && (r.serverLocked ?? server) === r.right.server;

  const show = () => {
    setShown(true);
    if (ok) setScore((v) => v + 1);
  };
  const name = (t: G.Term) => {
    setTerm(t);
    if (t === r.term) setScore((v) => v + 1);
  };
  const next = () => {
    if (round === G.LOAD_ROUNDS.length - 1) return onDone(score);
    setRound(round + 1);
    setMechanics(G.EARLIEST);
    setServer(G.EARLIEST);
    setShown(false);
    setTerm(null);
  };

  return (
    <div>
      <HowTo
        goal="зробити так, щоб програміст виконував одну роботу за раз, і зберегти якнайранішу дату релізу."
        steps={[
          "Унизу календар роботи програміста, одна клітинка — один тиждень. Усі три роботи робить одна людина.",
          "Стрілками ← → посувай роботи. Рівні, тестування й реліз залежать від них, тож дата релізу перераховується сама.",
          "Гістограма показує, скільки робіт у програміста на кожному тижні. Стовпчик вище лінії — перевантаження.",
          "Коли визначишся, натисни «Показати розклад», а потім назви цей прийом: вирівнювання чи згладжування.",
        ]}
        tip="Підказка: у механіки резерву немає, вона на критичному шляху. У сервера резерв 5 тижнів."
      />

      <p className="mt-5 text-sm text-muted tabular-nums">
        Раунд {round + 1} з {G.LOAD_ROUNDS.length}
      </p>
      <p className="mt-1 leading-relaxed">{r.lead}</p>

      <div className="mt-3 rounded-[6px] bg-background p-3 sm:p-4">
        <p className="font-medium" aria-live="polite">
          Реліз на <span className="tabular-nums">{plan.total}</span>-му тижні
          <span className="font-normal text-muted"> · {over.length > 0 ? `перевантаження: ${weekRange(over[0] - 1, over[over.length - 1])}` : "перевантаження немає"}</span>
        </p>
        <div className="mt-3 space-y-3">
          <CalendarRow
            name="Механіка"
            color="bg-accent"
            es={m.es}
            ef={m.ef}
            note={weekRange(m.es, m.ef)}
            onMove={shown ? undefined : (d) => setMechanics((v) => v + d)}
            canBack={mechanics > G.EARLIEST}
            canForward={mechanics < G.LATEST.mechanics}
          />
          <CalendarRow
            name="Сервер"
            color="bg-sage"
            es={s.es}
            ef={s.ef}
            note={r.serverLocked ? `${weekRange(s.es, s.ef)}, не посунути` : weekRange(s.es, s.ef)}
            onMove={shown || r.serverLocked ? undefined : (d) => setServer((v) => v + d)}
            canBack={server > G.EARLIEST}
            canForward={server < G.LATEST.server}
          />
          <CalendarRow name="Реліз" color="bg-foreground/35" es={rel.es} ef={rel.ef} note={weekRange(rel.es, rel.ef)} />
        </div>

        <p className="mt-4 text-[13px] text-muted">Робіт у програміста на тиждень</p>
        <div className="relative mt-1">
          <div aria-hidden className="grid h-14 items-end" style={{ ...weekGrid, ...WEEK_LINES }}>
            {load.map((n, w) => (
              <span key={w} className="flex flex-col-reverse gap-px px-px">
                {Array.from({ length: n }, (_, k) => (
                  <span key={k} className={`h-[26px] rounded-[2px] ${k === 0 ? "bg-foreground/35" : "bg-accent"}`} />
                ))}
              </span>
            ))}
          </div>
          <span aria-hidden className="absolute inset-x-0 bottom-[27px] border-t-2 border-dashed border-foreground/60" />
        </div>
        <WeekAxis />
        <p className="mt-1 text-center text-[12px] text-muted">Тиждень · пунктир: один програміст</p>
      </div>

      <div className="mt-4 space-y-4">
        {!shown ? (
          <button type="button" onClick={show} className={primary}>
            Показати розклад
          </button>
        ) : (
          <>
            <Feedback ok={ok} title={ok ? "Розклад реальний!" : "Можна краще."}>
              {ok ? r.ok : r.miss}
            </Feedback>
            <div>
              <p className="font-medium">Як це називається?</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2" role="group" aria-label="Як це називається">
                {terms.map((k) => G.TERMS[k]).map((t) => {
                  const right = term !== null && t.key === r.term;
                  const wrong = term === t.key && t.key !== r.term;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      disabled={term !== null}
                      aria-pressed={term === t.key}
                      onClick={() => name(t.key)}
                      className={`flex flex-col gap-1 rounded-[6px] p-3 text-left leading-snug press ${
                        right ? "bg-accent text-accent-foreground" : wrong ? "bg-foreground/[0.12]" : "bg-background enabled:hover:bg-foreground/[0.08] disabled:opacity-60"
                      }`}
                    >
                      <span className={`font-medium ${wrong ? "line-through decoration-2" : ""}`}>{t.name}</span>
                      <span className={`text-[13px] ${right ? "" : "text-muted"}`}>{t.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {term && (
              <>
                <Feedback ok={term === r.term}>{r.termWhy}</Feedback>
                <button type="button" onClick={next} className={primary}>
                  {round === G.LOAD_ROUNDS.length - 1 ? "До наступного рівня" : "Наступний раунд"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Who pays for the overrun on this contract.
function OverrunBill({ overrun, contractor }: { overrun: number; contractor: number }) {
  const vendor = overrun * contractor;
  const studio = overrun - vendor;
  return (
    <div className="rounded-[6px] bg-background p-4">
      <p className="font-medium">
        Рахунок за перевитрату: <span className="tabular-nums">{overrun}</span> тис. грн
      </p>
      <div aria-hidden className="mt-2 flex h-4 gap-0.5 overflow-hidden rounded-full">
        {vendor > 0 && <span className="bg-sage" style={{ width: `${contractor * 100}%` }} />}
        {studio > 0 && <span className="bg-accent" style={{ width: `${(1 - contractor) * 100}%` }} />}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-[2px] bg-sage" />
          Виконавець: <span className="tabular-nums">{vendor} тис.</span>
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-[2px] bg-accent" />
          Студія: <span className="tabular-nums">{studio} тис.</span>
        </span>
      </div>
    </div>
  );
}

// Level 2: make or buy, then pick the contract and see who pays.
function BuyLevel({ contracts, onDone }: { contracts: number[]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [way, setWay] = useState<"make" | "buy" | null>(null);
  const [deal, setDeal] = useState<G.Contract | null>(null);
  const [score, setScore] = useState(0);
  const j = G.JOBS[i];
  const last = i === G.JOBS.length - 1;
  const ready = way !== null && (!j.deal || deal !== null);
  const picked = deal ? G.CONTRACTS.find((c) => c.key === deal)! : null;

  const choose = (w: "make" | "buy") => {
    setWay(w);
    if (w === j.right) setScore((v) => v + 1);
  };
  const sign = (c: G.Contract) => {
    setDeal(c);
    if (c === j.deal!.right) setScore((v) => v + 1);
  };
  const next = () => {
    if (last) return onDone(score);
    setI(i + 1);
    setWay(null);
    setDeal(null);
  };

  return (
    <div>
      <HowTo
        goal="для кожної великої роботи вирішити, робити самим чи купувати, а для купленої вибрати контракт."
        steps={[
          "Порівняй два варіанти на картках: вартість, строки і чи потрібні студії ці знання. Натисни на той, який обираєш.",
          "Якщо роботу купують, вибери тип контракту. Під назвою сказано, хто несе ризик.",
          "Далі робота виходить дорожчою, ніж думали, а рахунок показує, хто за це платить.",
        ]}
        tip="Підказка: зрозумілий обсяг можна зафіксувати в договорі. Що менше відомо про обсяг, то менше сенсу в фіксованій ціні."
      />

      <p className="mt-5 text-sm text-muted tabular-nums">
        Робота {i + 1} з {G.JOBS.length}
      </p>
      <h3 className="mt-1 font-display text-xl font-semibold">{j.name}</h3>

      <div className="mt-3 grid gap-2 sm:grid-cols-2" role="group" aria-label={`Робити чи купувати: ${j.name}`}>
        {(
          [
            { key: "make", name: "Робимо самі", o: j.make },
            { key: "buy", name: "Купуємо", o: j.buy },
          ] as const
        ).map(({ key, name, o }) => {
          const right = way !== null && key === j.right;
          const wrong = way === key && key !== j.right;
          return (
            <button
              key={key}
              type="button"
              disabled={way !== null}
              aria-pressed={way === key}
              onClick={() => choose(key)}
              className={`flex flex-col gap-1 rounded-[6px] p-3 text-left leading-snug press ${
                right ? "bg-accent text-accent-foreground" : wrong ? "bg-foreground/[0.12]" : "bg-background enabled:hover:bg-foreground/[0.08] disabled:opacity-60"
              }`}
            >
              <span className={`font-medium ${wrong ? "line-through decoration-2" : ""}`}>{name}</span>
              <span className="text-sm tabular-nums">
                {o.sum} · {o.time}
              </span>
              <span className={`text-[13px] ${right ? "" : "text-muted"}`}>{o.note}</span>
            </button>
          );
        })}
      </div>

      {way && (
        <div className="mt-4">
          <Feedback ok={way === j.right}>{j.why}</Feedback>
        </div>
      )}

      {way && j.deal && (
        <div className="mt-4">
          <p className="font-medium">Який контракт підпишеш?</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3" role="group" aria-label="Тип контракту">
            {contracts.map((k) => G.CONTRACTS[k]).map((c) => {
              const right = deal !== null && c.key === j.deal!.right;
              const wrong = deal === c.key && c.key !== j.deal!.right;
              return (
                <button
                  key={c.key}
                  type="button"
                  disabled={deal !== null}
                  aria-pressed={deal === c.key}
                  onClick={() => sign(c.key)}
                  className={`flex flex-col gap-1 rounded-[6px] p-3 text-left leading-snug press ${
                    right ? "bg-accent text-accent-foreground" : wrong ? "bg-foreground/[0.12]" : "bg-background enabled:hover:bg-foreground/[0.08] disabled:opacity-60"
                  }`}
                >
                  <span className={`font-medium ${wrong ? "line-through decoration-2" : ""}`}>{c.name}</span>
                  <span className={`text-[13px] ${right ? "" : "text-muted"}`}>{c.note}</span>
                </button>
              );
            })}
          </div>
          {picked && (
            <div className="mt-4 space-y-4">
              <p className="leading-relaxed">{j.deal.story}</p>
              <OverrunBill overrun={j.deal.overrun} contractor={picked.contractor} />
              <Feedback ok={deal === j.deal.right}>{j.deal.outcomes[deal!]}</Feedback>
            </div>
          )}
        </div>
      )}

      {ready && (
        <button type="button" onClick={next} className={`${primary} mt-4`}>
          {last ? "До наступного рівня" : "Наступна робота"}
        </button>
      )}
    </div>
  );
}

const fmtScore = (v: number) => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(v);

// Level 3: set the weights for the brief and see who wins the tender.
function TenderLevel({ onDone }: { onDone: (score: number) => void }) {
  const id = useId();
  const [round, setRound] = useState(0);
  const [w, setW] = useState<Record<Criterion, number>>({ price: 50, quality: 50, time: 50 });
  const [signed, setSigned] = useState(false);
  const [score, setScore] = useState(0);
  const b = G.BRIEFS[round];
  const total = w.price + w.quality + w.time || 1;
  const scored = G.weightedScores(w);
  const best = scored.reduce((a, c) => (c.sum > a.sum ? c : a));
  const heaviest = Math.max(w.price, w.quality, w.time);
  const ok = best.name === b.winner && w[b.top] === heaviest && CRITERIA.every((c) => c.key === b.top || w[c.key] < heaviest);

  const sign = () => {
    setSigned(true);
    if (ok) setScore((v) => v + 1);
  };
  const next = () => {
    if (round === G.BRIEFS.length - 1) return onDone(score);
    setRound(round + 1);
    setSigned(false);
  };

  return (
    <div>
      <HowTo
        goal="розставити ваги критеріїв під потреби проєкту і чесно вибрати студію звуку."
        steps={[
          "Прочитай бриф: що зараз важить для студії найбільше.",
          "Рухай повзунки ваг. Найважливіший критерій має отримати найбільшу вагу.",
          "Таблиця одразу рахує зважену суму балів. Рядок переможця виділено.",
          "Натисни «Підписати договір». У другому раунді ваги лишаться з першого, і їх доведеться змінити.",
        ]}
        tip="Підказка: найвища сума ще нічого не доводить, якщо ваги не відповідають брифу. Пропозиції не змінюються, змінюється те, що для тебе важливо."
      />

      <p className="mt-5 text-sm text-muted tabular-nums">
        Бриф {round + 1} з {G.BRIEFS.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-4 leading-relaxed sm:p-5">{b.text}</div>

      <div className="mt-3 rounded-[6px] bg-background p-4">
        <div className="space-y-3">
          {CRITERIA.map((c) => (
            <div key={c.key}>
              <label htmlFor={`${id}-${c.key}`} className="flex items-baseline justify-between text-sm">
                <span>Вага: {c.label.toLowerCase()}</span>
                <span className="font-display font-semibold tabular-nums">{Math.round((w[c.key] / total) * 100)}%</span>
              </label>
              <input
                id={`${id}-${c.key}`}
                type="range"
                min={0}
                max={100}
                step={5}
                value={w[c.key]}
                disabled={signed}
                onChange={(e) => setW((prev) => ({ ...prev, [c.key]: Number(e.target.value) }))}
                className="mt-1 w-full accent-[var(--accent)]"
              />
            </div>
          ))}
        </div>

        <div className="-mx-1 mt-4 overflow-x-auto px-1">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="text-[13px] text-muted">
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-3 font-normal">Студія</th>
                {CRITERIA.map((c) => (
                  <th key={c.key} scope="col" className="py-2 pr-3 text-center font-normal">{c.label}</th>
                ))}
                <th scope="col" className="py-2 text-right font-normal">Сума</th>
              </tr>
            </thead>
            <tbody>
              {VENDORS.map((v, k) => (
                <tr key={v.name} className={`border-b border-border ${v.name === best.name ? "bg-accent-soft font-medium" : ""}`}>
                  <td className="py-2 pr-3 leading-snug">
                    {v.name}
                    <span className="block text-[12px] font-normal text-muted">{v.offer}</span>
                  </td>
                  {CRITERIA.map((c) => (
                    <td key={c.key} className="py-2 pr-3 text-center tabular-nums">{v.scores[c.key]}</td>
                  ))}
                  <td className="py-2 text-right font-display font-semibold tabular-nums">{fmtScore(scored[k].sum)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {!signed ? (
          <button type="button" onClick={sign} className={primary}>
            Підписати договір
          </button>
        ) : (
          <>
            <Feedback ok={ok}>{ok ? b.ok : b.miss}</Feedback>
            <button type="button" onClick={next} className={primary}>
              {round === G.BRIEFS.length - 1 ? "До наступного рівня" : "Наступний бриф"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Everyone linked with everyone: the channels of communication in a team.
function ChannelsWeb({ n, label }: { n: number; label: string }) {
  const size = 150;
  const c = size / 2;
  const r = c - 10;
  const points = Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)] as const;
  });
  return (
    <figure className="rounded-[6px] bg-background p-3 text-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label={`${n} людей: ${G.channels(n)} каналів комунікації`}>
        {points.flatMap((p, k) =>
          points.slice(k + 1).map((q, m) => <line key={`${k}-${m}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} strokeWidth={1} style={{ stroke: "var(--muted)", opacity: 0.55 }} />),
        )}
        {points.map((p, k) => (
          <circle key={k} cx={p[0]} cy={p[1]} r={5} style={{ fill: "var(--accent)" }} />
        ))}
      </svg>
      <figcaption className="mt-1 text-sm">
        {label}: <strong className="tabular-nums">{G.channels(n)}</strong> каналів
      </figcaption>
    </figure>
  );
}

const CODE_TONE: Record<G.Code, string> = {
  A: "bg-accent text-accent-foreground",
  R: "bg-accent-soft text-foreground",
  C: "bg-foreground/[0.07] text-foreground",
  I: "bg-foreground/[0.07] text-muted",
  "": "bg-foreground/[0.03] text-muted",
};

// Level 4: pick two people, answer about the size, then fix the RACI matrix.
function RaciLevel({ people, size, onDone }: { people: number[][]; size: number[]; onDone: (score: number) => void }) {
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [rows, setRows] = useState(G.RACI_START);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const hiring = step < G.CANDIDATE_ROLES.length;
  const asking = step === G.CANDIDATE_ROLES.length;
  const role = hiring ? G.CANDIDATE_ROLES[step] : null;
  const results = G.RACI_CHECKS.map((c) => c.test(rows));

  const hire = (k: number) => {
    setPick(k);
    if (role!.people[k].right) setScore((v) => v + 1);
  };
  const answer = (k: number) => {
    setPick(k);
    if (G.SIZE_ASK.options[k].right) setScore((v) => v + 1);
  };
  const next = () => {
    setStep(step + 1);
    setPick(null);
  };
  const cycle = (id: number, col: number) => {
    if (checked) return;
    setRows((rs) =>
      rs.map((r) =>
        r.id === id
          ? { ...r, codes: r.codes.map((c, k) => (k === col ? G.CODES[(G.CODES.indexOf(c) + 1) % G.CODES.length] : c)) }
          : r,
      ),
    );
  };
  const check = () => {
    setChecked(true);
    setScore((v) => v + results.filter(Boolean).length);
  };

  return (
    <div>
      <HowTo
        goal="додати в команду двох людей, не роздути її і зробити так, щоб жодна робота не лишилася нічиєю."
        steps={[
          "Спершу вибери людину на кожну роль. На картках доступність, вартість, досвід і часовий пояс: дивись на все разом.",
          "Потім дай відповідь засновникам про розмір команди.",
          "Наприкінці виправ матрицю RACI. Натискання на клітинку змінює літеру по колу. На телефоні таблицю можна гортати вбік.",
          "Перевір кожен рядок: чи є хоча б один R і рівно один A. Перевір стовпець програміста: чи не забагато в нього R. Потім натисни «Перевірити матрицю».",
        ]}
        tip={`Підказка: у матриці чотири помилки. У програміста має лишитися не більше ${G.MAX_R} R.`}
      />

      {role && (
        <div className="mt-5">
          <h3 className="font-display text-xl font-semibold">{role.role}</h3>
          <p className="mt-1 leading-relaxed">{role.need}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3" role="group" aria-label={role.role}>
            {people[step].map((k) => [role.people[k], k] as const).map(([p, k]) => {
              const right = pick !== null && p.right;
              const wrong = pick === k && !p.right;
              return (
                <button
                  key={p.name}
                  type="button"
                  disabled={pick !== null}
                  aria-pressed={pick === k}
                  onClick={() => hire(k)}
                  className={`flex flex-col gap-1 rounded-[6px] p-3 text-left text-[13px] leading-snug press ${
                    right ? "bg-accent text-accent-foreground" : wrong ? "bg-foreground/[0.12]" : "bg-background enabled:hover:bg-foreground/[0.08] disabled:opacity-60"
                  }`}
                >
                  <span className={`text-base font-medium ${wrong ? "line-through decoration-2" : ""}`}>{p.name}</span>
                  <span>{p.free}</span>
                  <span className="tabular-nums">{p.cost}</span>
                  <span>{p.exp}</span>
                  <span>{p.zone}</span>
                </button>
              );
            })}
          </div>
          {pick !== null && (
            <div className="mt-4 space-y-4">
              <Feedback ok={!!role.people[pick].right}>{role.people[pick].why}</Feedback>
              <button type="button" onClick={next} className={primary}>
                Далі
              </button>
            </div>
          )}
        </div>
      )}

      {asking && (
        <div className="mt-5">
          <div className="rounded-[6px] bg-surface-raised p-4 sm:p-5">
            <p className="text-[13px] text-muted">Засновники</p>
            <p className="mt-0.5 leading-relaxed">{G.SIZE_ASK.text}</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ChannelsWeb n={G.TEAM_NOW} label={`${G.TEAM_NOW} людей`} />
            <ChannelsWeb n={G.TEAM_BIG} label={`${G.TEAM_BIG} людей`} />
          </div>
          <div className="mt-3 grid gap-1.5" role="group" aria-label="Що відповісти засновникам">
            {size.map((k) => (
              <button
                key={k}
                type="button"
                disabled={pick !== null}
                aria-pressed={pick === k}
                onClick={() => answer(k)}
                className={optionClass(pick !== null ? !!G.SIZE_ASK.options[k].right : false, pick !== null)}
              >
                {G.SIZE_ASK.options[k].text}
              </button>
            ))}
          </div>
          {pick !== null && (
            <div className="mt-4 space-y-4">
              <Feedback ok={!!G.SIZE_ASK.options[pick].right}>{G.SIZE_ASK.why}</Feedback>
              <button type="button" onClick={next} className={primary}>
                До матриці
              </button>
            </div>
          )}
        </div>
      )}

      {!hiring && !asking && (
        <div className="mt-5">
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[13px] leading-snug sm:grid-cols-4">
            {G.CODE_NOTES.map((c) => (
              <div key={c.code}>
                <dt className="font-medium">
                  {c.code} — {c.name.toLowerCase()}
                </dt>
                <dd className="text-muted">{c.note}</dd>
              </div>
            ))}
          </dl>
          <div className="-mx-1 mt-3 overflow-x-auto px-1">
            <table className="w-full min-w-[480px] table-fixed text-center text-sm">
              <thead className="text-[12px] text-muted">
                <tr className="border-b border-border">
                  <th scope="col" className="w-[26%] py-2 text-left font-normal">Робота</th>
                  {G.RACI_SHORT.map((s, k) => (
                    <th key={s} scope="col" className="py-2 font-normal" title={G.RACI_ROLES[k]}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border">
                    <th scope="row" className="py-1 pr-2 text-left font-normal leading-snug">{G.taskName(r.id)}</th>
                    {r.codes.map((c, k) => (
                      <td key={k} className="p-0.5">
                        <button
                          type="button"
                          disabled={checked}
                          onClick={() => cycle(r.id, k)}
                          aria-label={`${G.taskName(r.id)}, ${G.RACI_ROLES[k]}: ${c || "порожньо"}`}
                          className={`h-9 w-full rounded-[4px] font-display font-semibold press disabled:cursor-default ${CODE_TONE[c]}`}
                        >
                          {c}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[13px] text-muted tabular-nums" aria-live="polite">
            R у програміста: {rows.filter((r) => r.codes[G.PROGRAMMER_COLUMN] === "R").length}
          </p>
          <div className="mt-4 space-y-4">
            {!checked ? (
              <button type="button" onClick={check} className={primary}>
                Перевірити матрицю
              </button>
            ) : (
              <>
                <div className="rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
                  <p className="font-display text-lg font-semibold">
                    Виправлено: {results.filter(Boolean).length} з {results.length}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {G.RACI_CHECKS.map((c, k) => (
                      <li key={k}>
                        {results[k] ? "✓" : "✗"} {results[k] ? c.ok : c.miss}
                      </li>
                    ))}
                  </ul>
                </div>
                <button type="button" onClick={() => onDone(score)} className={primary}>
                  До наступного рівня
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const CURVE = { W: 460, H: 170, L: 16, R: 16, T: 26, B: 26 };
const curveX = (i: number) => CURVE.L + 30 + (i / (G.SCENES.length - 1)) * (CURVE.W - CURVE.L - CURVE.R - 60);
const curveY = (height: number) => CURVE.T + (1 - height / 100) * (CURVE.H - CURVE.T - CURVE.B);

// The team's way through the stages, drawn as the scenes go.
function TeamCurve({ reached }: { reached: number }) {
  const points = G.SCENES.slice(0, reached).map((s, i) => ({ x: curveX(i), y: curveY(G.STAGES[s.stage].height), name: G.STAGES[s.stage].name, stage: s.stage }));
  return (
    <svg
      viewBox={`0 0 ${CURVE.W} ${CURVE.H}`}
      className="h-auto w-full"
      role="img"
      aria-label={reached ? `Шлях команди: ${points.map((p) => p.name).join(", ")}` : "Шлях команди ще не почався"}
    >
      <line x1={CURVE.L} x2={CURVE.W - CURVE.R} y1={CURVE.H - CURVE.B} y2={CURVE.H - CURVE.B} strokeWidth={1} style={{ stroke: "var(--grid)" }} />
      <text x={CURVE.L} y={14} fontSize={12} style={{ fill: "var(--muted)" }}>результативність</text>
      <text x={CURVE.W - CURVE.R} y={CURVE.H - 6} textAnchor="end" fontSize={12} style={{ fill: "var(--muted)" }}>час</text>
      {points.length > 1 && <polyline points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" strokeWidth={2.5} strokeLinejoin="round" style={{ stroke: "var(--accent)" }} />}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={5.5} strokeWidth={2} style={{ fill: "var(--accent)", stroke: "var(--background)" }} />
          <text
            x={p.stage === 2 ? p.x - 4 : p.stage === 4 ? p.x + 24 : p.x}
            y={p.stage === 1 ? p.y + 19 : p.y - 11}
            textAnchor={p.stage === 2 || p.stage === 4 ? "end" : "middle"}
            fontSize={12}
            fontWeight={600}
            style={{ fill: "var(--foreground)" }}
          >
            {p.stage === 3 ? "Продуктивна" : p.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Level 5: name the stage of each scene, then decide what to do.
function YearLevel({ scenes, onDone }: { scenes: number[][]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [stage, setStage] = useState<number | null>(null);
  const [act, setAct] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const s = G.SCENES[i];
  const last = i === G.SCENES.length - 1;

  const name = (k: number) => {
    setStage(k);
    if (k === s.stage) setScore((v) => v + 1);
  };
  const choose = (k: number) => {
    setAct(k);
    if (s.options[k].right) setScore((v) => v + 1);
  };
  const next = () => {
    if (last) return onDone(score);
    setI(i + 1);
    setStage(null);
    setAct(null);
  };

  return (
    <div>
      <HowTo
        goal="у кожній сцені зрозуміти, на якому етапі команда, і зробити те, що їй зараз потрібно."
        steps={[
          "Прочитай сцену і вибери етап розвитку команди. Під назвою етапу сказано, чим він вирізняється.",
          "Точка ляже на криву: так видно шлях команди за весь проєкт.",
          "Потім вибери, що робиш як керівник проєкту, і прочитай, що з цього вийшло.",
        ]}
        tip="Підказка: етапи не йдуть строго по прямій. Шторм не означає, що команда погана, а нова людина може до нього повернути."
      />

      <div className="mt-5 rounded-[6px] bg-background p-3">
        <TeamCurve reached={stage === null ? i : i + 1} />
      </div>

      <p className="mt-4 text-sm text-muted tabular-nums">
        Сцена {i + 1} з {G.SCENES.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-4 leading-relaxed sm:p-5">{s.text}</div>

      <p className="mt-4 font-medium">Який це етап?</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2" role="group" aria-label="Етап розвитку команди">
        {G.STAGES.map((t, k) => {
          const right = stage !== null && k === s.stage;
          const wrong = stage === k && k !== s.stage;
          return (
            <button
              key={t.name}
              type="button"
              disabled={stage !== null}
              aria-pressed={stage === k}
              onClick={() => name(k)}
              className={`flex flex-col gap-0.5 rounded-[6px] p-2.5 text-left leading-snug press ${
                right ? "bg-accent text-accent-foreground" : wrong ? "bg-foreground/[0.12]" : "bg-background enabled:hover:bg-foreground/[0.08] disabled:opacity-60"
              }`}
            >
              <span className={`text-sm font-medium ${wrong ? "line-through decoration-2" : ""}`}>{t.name}</span>
              <span className={`text-[13px] ${right ? "" : "text-muted"}`}>{t.note}</span>
            </button>
          );
        })}
      </div>

      {stage !== null && (
        <div className="mt-4">
          <Feedback ok={stage === s.stage}>{s.stageWhy}</Feedback>
          <p className="mt-4 font-medium">Що робиш?</p>
          <div className="mt-2 grid gap-1.5" role="group" aria-label="Що робиш">
            {scenes[i].map((k) => (
              <button
                key={k}
                type="button"
                disabled={act !== null}
                aria-pressed={act === k}
                onClick={() => choose(k)}
                className={optionClass(act !== null ? !!s.options[k].right : false, act !== null)}
              >
                {s.options[k].text}
              </button>
            ))}
          </div>
          {act !== null && (
            <div className="mt-4 space-y-4">
              <Feedback ok={!!s.options[act].right}>{s.options[act].why}</Feedback>
              <button type="button" onClick={next} className={primary}>
                {last ? "Завершити гру" : "Наступна сцена"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TeamGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-10"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        terms: shuffled(G.TERMS.length),
        contracts: shuffled(G.CONTRACTS.length),
        people: G.CANDIDATE_ROLES.map((r) => shuffled(r.people.length)),
        size: shuffled(G.SIZE_ASK.options.length),
        scenes: G.SCENES.map((s) => shuffled(s.options.length)),
      })}
      levels={[
        { name: "Один на двох", play: (o, done) => <LoadLevel terms={o.terms} onDone={done} /> },
        { name: "Купити чи робити", play: (o, done) => <BuyLevel contracts={o.contracts} onDone={done} /> },
        { name: "Тендер", play: (_, done) => <TenderLevel onDone={done} /> },
        { name: "Нічийна робота", play: (o, done) => <RaciLevel people={o.people} size={o.size} onDone={done} /> },
        { name: "Рік команди", play: (o, done) => <YearLevel scenes={o.scenes} onDone={done} /> },
      ]}
      startLabel="Почати"
      period="За гру"
      finalTitle="Десята віха!"
      finalText="Модуль 10 пройдено. Далі — ризики: що може піти не так і що робити заздалегідь."
      nextHref={nextHref}
      nextLabel="До модуля 11"
    >
      <TeamBonus />
    </AssignmentGame>
  );
}
