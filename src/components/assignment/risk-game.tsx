"use client";

import { useEffect, useId, useState } from "react";
import { RisksBonus } from "@/components/my-project/project-risks";
import * as G from "@/content/assignments/module-11";
import { npvWith, type Factor } from "@/content/examples/game-risks";
import { AssignmentGame, chip, Feedback, HowTo, primary, shuffled } from "./game-kit";

type Orders = {
  fogs: number[];
  tools: number[];
  stickers: Record<G.Part, number[]>[];
  map: number[];
  link: number[];
  say: number[];
  trees: number[][];
  shop: number[][];
  mondays: number[][];
};

const optionClass = (on: boolean, off: boolean) =>
  `rounded-md px-3 py-2 text-left text-sm font-medium leading-snug press ${
    on ? "bg-accent text-accent-foreground" : `bg-foreground/[0.07] enabled:hover:bg-foreground/[0.12] ${off ? "opacity-60" : ""}`
  }`;

const cardClass = (right: boolean, wrong: boolean) =>
  `flex flex-col gap-1 rounded-[6px] p-3 text-left leading-snug press ${
    right ? "bg-accent text-accent-foreground" : wrong ? "bg-foreground/[0.12]" : "bg-background enabled:hover:bg-foreground/[0.08] disabled:opacity-60"
  }`;

const fmt = (v: number) => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 }).format(Math.abs(v));
const signedFmt = (v: number) => (v === 0 ? "0" : `${v > 0 ? "+" : "−"}${fmt(v)}`);

// A question with three answers: pick one, read why. Used by several levels.
function Ask({
  text,
  options,
  order,
  label,
  onAnswer,
}: {
  text: string;
  options: { text: string; right?: boolean; why: string }[];
  order: number[];
  label: string;
  onAnswer: (right: boolean) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div>
      <p className="font-medium leading-snug">{text}</p>
      <div className="mt-2 grid gap-1.5" role="group" aria-label={label}>
        {order.map((k) => (
          <button
            key={k}
            type="button"
            disabled={pick !== null}
            aria-pressed={pick === k}
            onClick={() => {
              setPick(k);
              onAnswer(!!options[k].right);
            }}
            className={optionClass(pick !== null && !!options[k].right, pick !== null)}
          >
            {options[k].text}
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className="mt-3">
          <Feedback ok={!!options[pick].right}>{options[pick].why}</Feedback>
        </div>
      )}
    </div>
  );
}

// Level 1: choose a tool for each kind of uncertainty, then make vague stickers precise.
function FogLevel({
  fogs,
  tools,
  stickers,
  onDone,
}: {
  fogs: number[];
  tools: number[];
  stickers: Record<G.Part, number[]>[];
  onDone: (score: number) => void;
}) {
  const [i, setI] = useState(0);
  const [tool, setTool] = useState<G.Tool | null>(null);
  const [s, setS] = useState(0);
  const [parts, setParts] = useState<Partial<Record<G.Part, number>>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const building = i >= G.FOGS.length;

  const pickTool = (t: G.Tool) => {
    setTool(t);
    if (t === G.FOGS[fogs[i]].tool) setScore((v) => v + 1);
  };

  if (!building) {
    const f = G.FOGS[fogs[i]];
    return (
      <div>
        <HowTo
          goal="команда прийшла до тебе з чотирма тривогами перед релізом. Для кожної вибери дію, яка справді допоможе, бо різні види невизначеності вирішують по-різному."
          steps={[
            "Прочитай на картці, що турбує команду.",
            "Вибери одну з чотирьох дій, яку запропонуєш команді. Під кожною дією написано, що вона дасть.",
            "Після вибору гра покаже правильну дію, назве вид невизначеності і пояснить, чому ця дія працює.",
          ]}
          tip="Підказка: подумай, чого бракує команді. Їй може бракувати знань про гравців, розуміння зв'язків між частинами гри, стабільних умов або плану на конкретну подію."
        />
        <p className="mt-5 text-sm text-muted tabular-nums">
          Тривога {i + 1} з {G.FOGS.length}
        </p>
        <div className="mt-2 rounded-[6px] bg-surface-raised p-4 leading-relaxed sm:p-5">{f.text}</div>
        <p className="mt-4 font-medium">Що ти запропонуєш команді?</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2" role="group" aria-label="Що запропонувати команді">
          {tools.map((k) => G.TOOLS[k]).map((t) => {
            const right = tool !== null && t.key === f.tool;
            const wrong = tool === t.key && t.key !== f.tool;
            return (
              <button
                key={t.key}
                type="button"
                disabled={tool !== null}
                aria-pressed={tool === t.key}
                onClick={() => pickTool(t.key)}
                className={cardClass(right, wrong)}
              >
                <span className={`font-medium ${wrong ? "line-through decoration-2" : ""}`}>{t.name}</span>
                <span className={`text-[13px] ${right ? "" : "text-muted"}`}>{t.note}</span>
              </button>
            );
          })}
        </div>
        {tool && (
          <div className="mt-4 space-y-4">
            <Feedback ok={tool === f.tool} title={tool === f.tool ? `Так, це ${f.kind.toLowerCase()}.` : `Тут потрібна інша дія, бо це ${f.kind.toLowerCase()}.`}>
              {f.why}
            </Feedback>
            <button
              type="button"
              onClick={() => {
                setI(i + 1);
                setTool(null);
              }}
              className={primary}
            >
              {i === G.FOGS.length - 1 ? "Перейти до стікерів" : "Наступна тривога"}
            </button>
          </div>
        )}
      </div>
    );
  }

  const st = G.STICKERS[s];
  const ready = G.PARTS.every((p) => parts[p.key] !== undefined);
  const rightAll = G.PARTS.every((p) => parts[p.key] === 0);

  return (
    <div>
      <HowTo
        goal="перетворити розмите слово на ризик, з яким можна щось зробити."
        steps={[
          "Після мозкового штурму на дошці лишилося три стікери із загальними словами.",
          "У кожному з трьох рядків вибери один варіант: причину, подію і наслідок.",
          "Угорі збирається речення. Прочитай його вголос: чи є в ньому сенс?",
          "Натисни «Перевірити». Навіть за помилки гра покаже правильне речення.",
        ]}
        tip="Підказка: причина вже існує зараз, подія може статися, а наслідок показує, що станеться після неї. Слова на кшталт «буде погано» нічого не пояснюють."
      />
      <p className="mt-5 text-sm text-muted tabular-nums">
        Стікер {s + 1} з {G.STICKERS.length}
      </p>
      <p className="mt-2 inline-block -rotate-1 rounded-[2px] bg-accent-soft px-4 py-3 font-display text-xl font-semibold">{st.word}</p>

      <div className="mt-4 rounded-[6px] bg-surface-raised p-4 leading-relaxed" aria-live="polite">
        {G.PARTS.map((p) => {
          const k = checked ? 0 : parts[p.key];
          return (
            <span key={p.key}>
              <span className="text-muted">{p.lead}</span>{" "}
              <strong className="font-medium">{k === undefined ? "…" : st.parts[p.key][k]}</strong>{" "}
            </span>
          );
        })}
      </div>

      <div className="mt-4 space-y-3">
        {G.PARTS.map((p) => (
          <div key={p.key}>
            <p className="text-sm font-medium">{p.name}</p>
            <div className="mt-1.5 grid gap-1.5" role="group" aria-label={p.name}>
              {stickers[s][p.key].map((k) => (
                <button
                  key={k}
                  type="button"
                  disabled={checked}
                  aria-pressed={parts[p.key] === k}
                  onClick={() => setParts((v) => ({ ...v, [p.key]: k }))}
                  className={optionClass(checked ? k === 0 : parts[p.key] === k, checked)}
                >
                  {st.parts[p.key][k]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {!checked ? (
          <button
            type="button"
            disabled={!ready}
            onClick={() => {
              setChecked(true);
              if (rightAll) setScore((v) => v + 1);
            }}
            className={primary}
          >
            Перевірити
          </button>
        ) : (
          <>
            <Feedback ok={rightAll}>
              {rightAll ? "" : "Частини переплутано: подивись на правильне речення вище. "}
              {st.why}
            </Feedback>
            <button
              type="button"
              onClick={() => {
                if (s === G.STICKERS.length - 1) return onDone(score);
                setS(s + 1);
                setParts({});
                setChecked(false);
              }}
              className={primary}
            >
              {s === G.STICKERS.length - 1 ? "До наступного рівня" : "Наступний стікер"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// The 5×5 heat map; only the cell of the current risk answers to a click.
function HeatMap({
  placed,
  onCell,
  active,
}: {
  placed: { key: string; p: number; i: number }[];
  onCell?: (p: number, i: number) => void;
  active: boolean;
}) {
  return (
    <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-1.5">
      <span className="self-center text-[12px] text-muted [writing-mode:vertical-rl] rotate-180">імовірність</span>
      <div>
        <div className="grid grid-cols-5 gap-1">
          {[...G.SCALE].reverse().map((p) =>
            G.SCALE.map((i) => {
              const here = placed.filter((r) => r.p === p && r.i === i);
              return (
                <button
                  key={`${p}-${i}`}
                  type="button"
                  disabled={!active}
                  aria-label={`Імовірність ${p}, вплив ${i}: ${p * i}${here.length ? `, тут ${here.map((r) => G.RISK_ID(r.key)).join(", ")}` : ""}`}
                  onClick={() => onCell?.(p, i)}
                  className={`flex min-h-12 flex-col items-start justify-between gap-0.5 rounded-[3px] p-1 text-left sm:min-h-14 sm:p-1.5 ${G.zoneClass(p, i)} ${
                    active ? "press hover:ring-2 hover:ring-accent" : ""
                  }`}
                >
                  <span aria-hidden className="text-[11px] text-muted tabular-nums">{p * i}</span>
                  <span className="flex flex-wrap gap-0.5">
                    {here.map((r) => (
                      <span key={r.key} className="rounded-[2px] bg-surface/90 px-1 font-display text-[11px] leading-tight font-semibold text-foreground">
                        {G.RISK_ID(r.key)}
                      </span>
                    ))}
                  </span>
                </button>
              );
            }),
          )}
        </div>
        <div aria-hidden className="mt-1 grid grid-cols-5 gap-1 text-center text-[12px] text-muted tabular-nums">
          {G.SCALE.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
        <p className="mt-0.5 text-center text-[12px] text-muted">вплив</p>
      </div>
    </div>
  );
}

// Level 2: place the risks, spend the attention on the top two, re-rank after the news.
function MapLevel({ order, onDone }: { order: number[]; onDone: (score: number) => void }) {
  const [placed, setPlaced] = useState(0);
  const [miss, setMiss] = useState(false);
  const [picks, setPicks] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [moved, setMoved] = useState(false);
  const [first, setFirst] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const queue = order.map((k) => G.RISKS[k]);
  const current = queue[placed];
  const onMap = queue.slice(0, placed).map((r) => ({
    key: r.key,
    p: r.key === G.OFFER.key && moved ? G.OFFER.p : r.probability,
    i: r.impact,
  }));
  const placing = placed < queue.length;
  const dev = G.RISKS.find((r) => r.key === G.OFFER.key)!;

  const onCell = (p: number, i: number) => {
    if (placing) {
      if (p === current.probability && i === current.impact) {
        setPlaced(placed + 1);
        setMiss(false);
      } else setMiss(true);
      return;
    }
    if (p === G.OFFER.p && i === dev.impact) {
      setMoved(true);
      setMiss(false);
    } else setMiss(true);
  };

  const toggle = (key: string) => {
    if (checked) return;
    setPicks((v) => (v.includes(key) ? v.filter((x) => x !== key) : v.length < 2 ? [...v, key] : v));
  };
  const check = () => {
    setChecked(true);
    setScore((v) => v + picks.filter((k) => G.TOP_TWO.includes(k)).length);
  };
  const answer = (key: string) => {
    setFirst(key);
    if (key === G.OFFER.key) setScore((v) => v + 1);
  };

  return (
    <div>
      <HowTo
        goal="розставити пріоритети: ризиків завжди більше, ніж сил на них."
        steps={[
          "Над картою показано ризик з оцінками від 1 до 5. Натисни на клітинку, де перетинаються його імовірність і вплив.",
          "Число в клітинці показує пріоритет: імовірність, помножену на вплив. Пріоритет від 12 вважають високим, а від 6 середнім.",
          "Коли всі ризики на карті, вибери два, на які витратиш сили до релізу.",
          "Потім прийде новина, і один ризик доведеться пересунути.",
        ]}
        tip="Підказка: порівнюй числа в клітинках, бо найстрашніший на вигляд ризик не завжди має найвищий пріоритет."
      />

      <div className="mt-5">
        {placing ? (
          <div className="rounded-[6px] bg-surface-raised p-4 leading-snug" aria-live="polite">
            <p className="text-sm text-muted tabular-nums">
              Ризик {placed + 1} з {queue.length}
            </p>
            <p className="mt-1 font-medium">
              {G.RISK_ID(current.key)}. {current.name}
            </p>
            <p className="mt-1 text-sm tabular-nums">
              Імовірність {current.probability}, вплив {current.impact}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted">Усі ризики на карті.</p>
        )}
        {miss && <p className="mt-2 text-sm text-muted" aria-live="polite">Це не та клітинка. Імовірність збільшується знизу вгору, а вплив зліва направо.</p>}
      </div>

      <div className="mt-4 rounded-[6px] bg-background p-3 sm:p-4">
        <HeatMap placed={onMap} active={placing || (checked && !moved)} onCell={onCell} />
      </div>

      {!placing && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-medium">Сил до релізу вистачить на два ризики. Які вибираєш?</p>
            <div className="mt-2 grid gap-1.5 sm:grid-cols-2" role="group" aria-label="Два ризики">
              {G.RISKS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  disabled={checked}
                  aria-pressed={picks.includes(r.key)}
                  onClick={() => toggle(r.key)}
                  className={optionClass(checked ? G.TOP_TWO.includes(r.key) : picks.includes(r.key), checked)}
                >
                  {G.RISK_ID(r.key)}. {r.name}
                </button>
              ))}
            </div>
            {!checked && (
              <button type="button" onClick={check} disabled={picks.length < 2} className={`${primary} mt-3`}>
                Перевірити
              </button>
            )}
          </div>

          {checked && <Feedback ok={picks.every((k) => G.TOP_TWO.includes(k))}>{G.PICK_WHY}</Feedback>}

          {checked && (
            <div className="rounded-[6px] bg-surface-raised p-4 leading-relaxed" aria-live="polite">
              {moved ? G.OFFER.why : `${G.OFFER.text} Постав ${G.RISK_ID(G.OFFER.key)} на нове місце на карті вище.`}
            </div>
          )}

          {moved && (
            <div>
              <p className="font-medium">Який ризик обговорюємо першим на наступному перегляді реєстру?</p>
              <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Перший ризик">
                {G.RISKS.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    disabled={first !== null}
                    aria-pressed={first === r.key}
                    onClick={() => answer(r.key)}
                    className={optionClass(first !== null && r.key === G.OFFER.key, first !== null)}
                  >
                    {r.short}
                  </button>
                ))}
              </div>
              {first && (
                <div className="mt-4 space-y-4">
                  <Feedback ok={first === G.OFFER.key}>
                    {first === G.OFFER.key ? "Найвищий пріоритет обговорюють першим." : "Першим обговорюють найвищий пріоритет, а тепер це програміст: 20."} Ця сама логіка діє щотижня.
                  </Feedback>
                  <button type="button" onClick={() => onDone(score)} className={primary}>
                    До наступного рівня
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// The sensitivity tornado: NPV when each factor moves ten percent either way.
function Tornado() {
  const lo = 0;
  const hi = 100;
  const x = (v: number) => `${((v - lo) / (hi - lo)) * 100}%`;
  return (
    <figure className="rounded-[6px] bg-background p-4">
      <figcaption className="font-medium">Діаграма «торнадо»</figcaption>
      <p className="mt-1 text-[13px] text-muted">Смуга показує NPV у тисячах гривень, коли фактор змінюється на 10% у гірший і кращий бік. Що ширша смуга, то небезпечніший фактор.</p>
      <ul className="mt-3 space-y-3">
        {G.TORNADO.map((t) => (
          <li key={t.key}>
            <p className="flex justify-between gap-3 text-sm">
              <span>{t.label}</span>
              <span className="text-muted tabular-nums">
                {G.round(t.low)}…{G.round(t.high)}
              </span>
            </p>
            <div aria-hidden className="relative mt-1 h-3 rounded-[2px] bg-foreground/[0.07]">
              <span className="absolute inset-y-0 rounded-l-[2px] bg-accent" style={{ left: x(t.low), width: `calc(${x(G.BASE_NPV)} - ${x(t.low)})` }} />
              <span className="absolute inset-y-0 rounded-r-[2px] bg-sage" style={{ left: x(G.BASE_NPV), width: `calc(${x(t.high)} - ${x(G.BASE_NPV)})` }} />
              <span className="absolute -inset-y-1 w-0.5 bg-foreground" style={{ left: x(G.BASE_NPV) }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-[2px] bg-accent" />
          гірше за план
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-[2px] bg-sage" />
          краще за план
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-0.5 bg-foreground" />
          план, +{G.round(G.BASE_NPV)}
        </span>
      </div>
    </figure>
  );
}

// A growing histogram of a thousand random futures of the game.
function FutureChart({ runs }: { runs: number }) {
  const counts = G.mcCounts(runs);
  const top = Math.max(1, ...counts);
  return (
    <figure className="rounded-[6px] bg-background p-4">
      <p className="text-sm text-muted tabular-nums">Зіграно варіантів: {runs}</p>
      <div
        className="mt-3 flex h-32 items-end gap-0.5"
        role="img"
        aria-label={`Розподіл NPV за ${runs} варіантами${runs === G.RUNS ? `: середнє ${G.signed(G.MC_MEAN)} тис. грн, збиткових ${G.round(G.MC_LOSS * 100)}%` : ""}`}
      >
        {counts.map((c, k) => (
          <span
            key={G.MC_BINS[k]}
            title={`${G.MC_BINS[k]}…${G.MC_BINS[k] + G.MC_BIN} тис. грн: ${c}`}
            className={`flex-1 rounded-t-[2px] ${G.MC_BINS[k] < 0 ? "bg-foreground/45" : "bg-accent"}`}
            style={{ height: `${(c / top) * 100}%` }}
          />
        ))}
      </div>
      <div aria-hidden className="relative mt-1 h-4 text-[12px] text-muted tabular-nums">
        <span className="absolute left-0">{G.MC_MIN}</span>
        <span className="absolute -translate-x-1/2" style={{ left: `${((0 - G.MC_MIN) / (G.MC_MAX - G.MC_MIN)) * 100}%` }}>0</span>
        <span className="absolute right-0">+{G.MC_MAX}</span>
      </div>
      <figcaption className="mt-1 text-[13px] text-muted">Вісь показує NPV у тисячах гривень. Сірі стовпчики позначають варіанти, у яких гра збиткова.</figcaption>
    </figure>
  );
}

// Level 3: bet on the thinnest factor, break the game with sliders, read the
// tornado, then play a thousand futures.
function ThinLevel({ link, say, onDone }: { link: number[]; say: number[]; onDone: (score: number) => void }) {
  const id = useId();
  const [bet, setBet] = useState<Factor | null>(null);
  const [values, setValues] = useState<Record<Factor, number>>({ revenue: 0, cost: 0, rate: 10 });
  const [found, setFound] = useState<Factor[]>([]);
  const [linked, setLinked] = useState(false);
  const [future, setFuture] = useState<"higher" | "same" | "lower" | null>(null);
  const [runs, setRuns] = useState(0);
  const [said, setSaid] = useState(false);
  const [score, setScore] = useState(0);
  const allFound = found.length === G.SLIDERS.length;

  // The histogram grows in a few steps, so the shape appears before the player's eyes.
  useEffect(() => {
    if (runs === 0 || runs >= G.RUNS) return;
    const t = setTimeout(() => setRuns((r) => Math.min(G.RUNS, r < 100 ? r + 25 : r + 150)), 90);
    return () => clearTimeout(t);
  }, [runs]);

  const slide = (s: (typeof G.SLIDERS)[number], v: number) => {
    setValues((prev) => ({ ...prev, [s.key]: v }));
    if (npvWith(s.key, s.change(v)) <= 0 && !found.includes(s.key)) {
      const next = [...found, s.key];
      setFound(next);
      if (next.length === G.SLIDERS.length && bet === G.THIN_FACTOR) setScore((p) => p + 1);
    }
  };
  const betFuture = (k: "higher" | "same" | "lower") => {
    setFuture(k);
    if (k === "lower") setScore((v) => v + 1);
  };

  return (
    <div>
      <HowTo
        goal="знайти фактор, через який гра найшвидше стане збитковою."
        steps={[
          "Спочатку спробуй угадати: який фактор найнебезпечніший?",
          "Рухай кожен повзунок, доки NPV не впаде до нуля. NPV (чиста приведена вартість) показує, скільки гра заробить понад вкладене. Гра запише межу кожного фактора.",
          "З трьох меж збудується діаграма «торнадо». Прочитай її і дай відповідь засновнику.",
          "Потім дай ще один прогноз і зіграй тисячу варіантів майбутнього.",
        ]}
        tip="Підказка: тут нічого не треба рахувати. Гра рахує сама, а тобі треба зрозуміти, що показує кожен метод."
      />

      <div className="mt-5">
        <p className="font-medium">Як думаєш, через який фактор гра найшвидше стане збитковою?</p>
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Прогноз: найнебезпечніший фактор">
          {G.SLIDERS.map((s) => (
            <button key={s.key} type="button" disabled={bet !== null} aria-pressed={bet === s.key} onClick={() => setBet(s.key)} className={chip(bet === s.key)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {bet && (
        <div className="mt-4 rounded-[6px] bg-background p-4">
          <p className="font-medium">Рухай повзунки, доки NPV не впаде до нуля</p>
          <div className="mt-3 space-y-4">
            {G.SLIDERS.map((s) => {
              const value = npvWith(s.key, s.change(values[s.key]));
              const isFound = found.includes(s.key);
              return (
                <div key={s.key}>
                  <label htmlFor={`${id}-${s.key}`} className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                    <span>
                      {s.label}: <span className="font-medium tabular-nums">{s.show(values[s.key])}</span>
                      <span className="block text-[13px] text-muted">{s.hint}</span>
                    </span>
                    <span className={`font-display font-semibold tabular-nums ${value <= 0 ? "text-accent" : ""}`}>NPV {G.signed(value)} тис. грн</span>
                  </label>
                  <input
                    id={`${id}-${s.key}`}
                    type="range"
                    min={s.min}
                    max={s.max}
                    value={values[s.key]}
                    onChange={(e) => slide(s, Number(e.target.value))}
                    className="mt-1 w-full accent-[var(--accent)]"
                  />
                  {isFound && <p className="text-[13px] text-muted" aria-live="polite">{s.limit}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {allFound && (
        <div className="mt-4 space-y-4">
          <Feedback ok={bet === G.THIN_FACTOR}>
            Найтонше місце в грі — це доходи, бо вона стає збитковою, коли вони падають на 16%. Вартість розробки може зрости на 19%, а ставка майже подвоїться, перш ніж це станеться.
          </Feedback>
          <Tornado />
          <Ask
            text={G.LINK_ASK.text}
            options={G.LINK_ASK.options}
            order={link}
            label="Де помилка засновника"
            onAnswer={(right) => {
              setLinked(true);
              if (right) setScore((v) => v + 1);
            }}
          />
        </div>
      )}

      {linked && (
        <div className="mt-5 space-y-4">
          <div>
            <p className="font-medium">
              Метод Монте-Карло зіграє гру тисячу разів: щоразу доходи й витрати будуть випадковими. Де буде середнє порівняно з планом у +{G.round(G.BASE_NPV)} тис. грн?
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Прогноз: середнє">
              {G.MC_BETS.map((b) => (
                <button key={b.key} type="button" disabled={future !== null} aria-pressed={future === b.key} onClick={() => betFuture(b.key)} className={chip(future === b.key)}>
                  {b.name}
                </button>
              ))}
            </div>
          </div>
          {future && runs === 0 && (
            <button type="button" onClick={() => setRuns(25)} className={primary}>
              Зіграти {G.RUNS} разів
            </button>
          )}
          {runs > 0 && <FutureChart runs={runs} />}
          {runs >= G.RUNS && (
            <>
              <Feedback ok={future === "lower"}>
                {G.MC_BET_WHY} У мінусі {G.round(G.MC_LOSS * 100)}% варіантів.
              </Feedback>
              <Ask
                text={G.SAY_ASK.text}
                options={G.SAY_ASK.options}
                order={say}
                label="Що сказати засновникам"
                onAnswer={(right) => {
                  setSaid(true);
                  if (right) setScore((v) => v + 1);
                }}
              />
            </>
          )}
          {said && (
            <button type="button" onClick={() => onDone(score)} className={primary}>
              До наступного рівня
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// One decision of the tree: a branch with its measure and two outcomes.
function TreeBranch({
  b,
  tree,
  picked,
  answered,
  onPick,
}: {
  b: G.Branch;
  tree: (typeof G.TREES)[number];
  picked: boolean;
  answered: boolean;
  onPick: () => void;
}) {
  const right = answered && !!b.right;
  const wrong = picked && !b.right;
  const sub = right ? "" : "text-muted";
  return (
    <button type="button" disabled={answered} aria-pressed={picked} onClick={onPick} className={cardClass(right, wrong)}>
      <span className={`font-medium ${wrong ? "line-through decoration-2" : ""}`}>{b.name}</span>
      <span className={`text-[13px] tabular-nums ${sub}`}>Заплатити зараз: {b.cost > 0 ? `${b.cost} тис.` : "нічого"}</span>
      <span className={`mt-1 space-y-0.5 border-l-2 border-current/30 pl-2.5 text-[13px] tabular-nums ${sub}`}>
        <span className="block">
          {tree.happens}, шанс {b.chance}%: {signedFmt(tree.sum)} тис.
        </span>
        <span className="block">
          {tree.misses}, шанс {100 - b.chance}%: 0
        </span>
      </span>
      {answered && (
        <span className="mt-1 text-sm font-semibold tabular-nums">Очікувана вартість: {signedFmt(G.branchValue(b, tree.sum))} тис. грн</span>
      )}
    </button>
  );
}

const riskOf = (key: string) => G.RISKS.find((r) => r.key === key)!;

// Level 4: decision trees, then a response for each risk within the reserve, and a year to see the result.
function ShieldLevel({ trees, shop, onDone }: { trees: number[][]; shop: number[][]; onDone: (score: number) => void }) {
  const [t, setT] = useState(0);
  const [branch, setBranch] = useState<number | null>(null);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [extra, setExtra] = useState(false);
  const [approved, setApproved] = useState(false);
  const [year, setYear] = useState(false);
  const [score, setScore] = useState(0);

  const tree = G.TREES[t];
  const inTrees = t < G.TREES.length;
  const chosen = G.SHOP.map((s) => ({ key: s.key, o: picks[s.key] !== undefined ? s.options[picks[s.key]] : null }));
  const planned = chosen.reduce((sum, c) => sum + (c.o?.cost ?? 0), 0);
  const limit = G.RESERVE + (extra ? G.EXTRA_RESERVE : 0);
  const allPicked = chosen.every((c) => c.o);
  const within = planned <= limit;

  const pickBranch = (k: number) => {
    setBranch(k);
    if (tree.branches[k].right) setScore((v) => v + 1);
  };
  const approve = () => {
    setApproved(true);
    setScore((v) => v + chosen.filter((c) => c.o!.ok).length);
  };

  if (inTrees) {
    return (
      <div>
        <HowTo
          goal="порівняти рішення за очікуваною вартістю, тобто врахувати і суму, і шанс того, що подія станеться."
          steps={[
            "Прочитай, що може статися і скільки це коштуватиме.",
            "На кожній гілці дерева є ціна рішення і шанс події. Вибери гілку, яка в середньому вигідніша.",
            "Після вибору побачиш очікувану вартість кожної гілки: ціна рішення плюс шанс, помножений на суму.",
          ]}
          tip="Підказка: 60% від 18 тис. становить приблизно 11 тис. Точний розрахунок не потрібен, вистачить оцінити на око. Не забудь додати ціну рішення."
        />
        <p className="mt-5 text-sm text-muted tabular-nums">
          Рішення {t + 1} з {G.TREES.length}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold">{tree.name}</h3>
        <div className="mt-2 rounded-[6px] bg-surface-raised p-4 leading-relaxed">{tree.text}</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3" role="group" aria-label={`Гілки рішення: ${tree.name}`}>
          {trees[t].map((k) => (
            <TreeBranch key={k} b={tree.branches[k]} tree={tree} picked={branch === k} answered={branch !== null} onPick={() => pickBranch(k)} />
          ))}
        </div>
        {branch !== null && (
          <div className="mt-4 space-y-4">
            <Feedback ok={!!tree.branches[branch].right}>{tree.why}</Feedback>
            <button
              type="button"
              onClick={() => {
                setT(t + 1);
                setBranch(null);
              }}
              className={primary}
            >
              {t === G.TREES.length - 1 ? "До плану захисту" : "Наступне рішення"}
            </button>
          </div>
        )}
      </div>
    );
  }

  const results = chosen.filter((c) => c.o).map((c) => ({
    key: c.key,
    paid: c.o!.held ? 0 : c.o!.cost,
    loss: G.YEAR_FIRES.includes(c.key) ? c.o!.loss : 0,
  }));
  const spent = results.reduce((s, r) => s + r.paid + r.loss, 0);
  const docs = chosen.find((c) => c.key === "developer")?.o?.loss === 5;

  return (
    <div>
      <HowTo
        goal={`вибрати реакцію на кожен із шести ризиків і вкластися в резерв ${G.RESERVE} тис. грн.`}
        steps={[
          "Для кожного ризику вибери один варіант. На картці вказано реакцію і суму.",
          `Угорі видно, скільки вже заплановано. Правильних наборів кілька, але реакції з уроку разом коштують 53 тис.`,
          `Якщо сума не вміщається в резерв, вибери дешевшу реакцію, свідомо прийми ризик або попроси засновників збільшити резерв на ${G.EXTRA_RESERVE} тис.`,
          "Натисни «Затвердити план», прочитай відгук, а тоді подивись, що станеться за рік.",
        ]}
        tip="Підказка: захист не має бути дорожчим за збиток, а ризики з високим пріоритетом не варто лишати без реакції."
      />

      <div className="sticky top-2 z-10 mt-5 rounded-[6px] bg-surface-raised p-3 shadow-sm" aria-live="polite">
        <div className="flex flex-wrap justify-between gap-x-3 text-sm">
          <span className="font-medium">Заплановано із резерву</span>
          <span className={`font-display font-semibold tabular-nums ${within ? "" : "text-accent"}`}>
            {planned} з {limit} тис. грн
          </span>
        </div>
        <div aria-hidden className="mt-1.5 h-2 overflow-hidden rounded-full bg-foreground/15">
          <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, (planned / limit) * 100)}%` }} />
        </div>
        {!within && <p className="mt-1 text-[13px] text-accent">Понад резерв на {planned - limit} тис. грн.</p>}
      </div>

      <ul className="mt-3 space-y-2">
        {G.SHOP.map((s, n) => {
          const r = riskOf(s.key);
          const p = s.key === G.OFFER.key ? G.OFFER.p : r.probability;
          return (
            <li key={s.key} className="rounded-[6px] bg-background p-3">
              <p className="font-medium leading-snug">{r.name}</p>
              <p className="mt-0.5 text-[13px] text-muted tabular-nums">
                Збиток {r.loss} тис. · пріоритет {p * r.impact}
              </p>
              <div className="mt-2 grid gap-1.5 sm:grid-cols-3" role="group" aria-label={`Реакція: ${r.name}`}>
                {shop[n].map((k) => {
                  const o = s.options[k];
                  const on = picks[s.key] === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      disabled={approved}
                      aria-pressed={on}
                      onClick={() => setPicks((v) => ({ ...v, [s.key]: k }))}
                      className={`flex flex-col gap-0.5 rounded-[4px] p-2.5 text-left text-sm leading-snug press ${
                        on ? "bg-accent text-accent-foreground" : `bg-foreground/[0.07] enabled:hover:bg-foreground/[0.12] ${approved ? "opacity-60" : ""}`
                      }`}
                    >
                      <span className="font-medium">{o.name}</span>
                      <span className={`text-[13px] tabular-nums ${on ? "" : "text-muted"}`}>
                        {o.reaction} · {o.cost > 0 ? `${o.cost} тис.` : "0"}
                        {o.held ? " у резерві" : ""}
                      </span>
                      {o.note && <span className={`text-[13px] ${on ? "" : "text-muted"}`}>{o.note}</span>}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <label className="mt-3 flex items-start gap-3 rounded-[6px] bg-background p-3 text-sm leading-snug">
        <input type="checkbox" checked={extra} disabled={approved} onChange={(e) => setExtra(e.target.checked)} className="mt-0.5 size-4 accent-[var(--accent)]" />
        <span>
          Попросити засновників збільшити резерв на {G.EXTRA_RESERVE} тис. грн
          <span className="block text-[13px] text-muted">У плані NPV впаде з +{G.round(G.BASE_NPV)} до +{G.round(G.EXTRA_NPV)} тис. грн, а запас міцності стане тоншим.</span>
        </span>
      </label>

      <div className="mt-4 space-y-4">
        {!approved ? (
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={approve} disabled={!allPicked || !within} className={primary}>
              Затвердити план
            </button>
            {!allPicked && <span className="text-sm text-muted">Вибери реакцію для кожного ризику.</span>}
            {allPicked && !within && <span className="text-sm text-muted">План не вміщається в резерв.</span>}
          </div>
        ) : (
          <>
            <div className="rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
              <p className="font-display text-lg font-semibold tabular-nums">
                Вдалих реакцій: {chosen.filter((c) => c.o!.ok).length} з {chosen.length}
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                {chosen.map((c) => (
                  <li key={c.key}>
                    <span className="font-medium">
                      {c.o!.ok ? "✓" : "✗"} {riskOf(c.key).short}: {c.o!.name}.
                    </span>{" "}
                    {c.o!.why}
                  </li>
                ))}
              </ul>
            </div>
            {!year ? (
              <button type="button" onClick={() => setYear(true)} className={primary}>
                Минув рік
              </button>
            ) : (
              <>
                <div className="rounded-[6px] bg-background p-4">
                  <p className="font-display text-lg font-semibold">Що сталося за рік</p>
                  <ul className="mt-1 space-y-1 text-sm">
                    {G.YEAR_FIRES.map((k) => (
                      <li key={k}>{G.YEAR_EVENTS[k]}</li>
                    ))}
                  </ul>
                  <div className="-mx-1 mt-3 overflow-x-auto px-1">
                    <table className="w-full min-w-[360px] text-left text-sm">
                      <thead className="text-[13px] text-muted">
                        <tr className="border-b border-border">
                          <th scope="col" className="py-1.5 pr-3 font-normal">Ризик</th>
                          <th scope="col" className="py-1.5 pr-3 text-right font-normal">Захід</th>
                          <th scope="col" className="py-1.5 text-right font-normal">Збиток</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r) => (
                          <tr key={r.key} className="border-b border-border">
                            <td className="py-1.5 pr-3">{riskOf(r.key).short}</td>
                            <td className="py-1.5 pr-3 text-right tabular-nums">{r.paid}</td>
                            <td className="py-1.5 text-right tabular-nums">{r.loss}</td>
                          </tr>
                        ))}
                        <tr className="font-medium">
                          <td className="py-1.5 pr-3">Разом витрачено</td>
                          <td colSpan={2} className="py-1.5 text-right font-display font-semibold tabular-nums">
                            {spent} з {limit} тис. грн
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <Feedback ok={false} title={spent <= limit ? `Резерв вистояв: лишилося ${limit - spent} тис. грн.` : `Резерву не вистачило: бракує ${spent - limit} тис. грн.`}>
                  {spent > limit ? "Цю суму доведеться взяти з доходів гри. " : "Гроші, які не знадобилися, лишаються в студії. "}
                  {docs
                    ? "Навіть із документацією вихід програміста коштував 5 тис. грн. Це залишковий ризик: захист його зменшує, але не прибирає повністю."
                    : "Програміст пішов, а результат видно в таблиці. Те, що лишається після реакції, називають залишковим ризиком."}
                </Feedback>
                <button type="button" onClick={() => onDone(score)} className={primary}>
                  До наступного рівня
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Level 5, step 1: tap the four cells that kill a register.
function DeadRegister({ onDone }: { onDone: (score: number) => void }) {
  const [marks, setMarks] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const flaws = G.DEAD_FLAWS.map((c) => c.id);
  const found = marks.filter((id) => flaws.includes(id)).length;
  const wrong = marks.length - found;
  const result = Math.max(0, found - wrong);

  const toggle = (id: string) => {
    if (!checked) setMarks((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  };
  const cell = (c: G.DeadCell) => {
    const on = marks.includes(c.id);
    const show = checked && !!c.flaw;
    return (
      <button
        type="button"
        disabled={checked}
        aria-pressed={on}
        onClick={() => toggle(c.id)}
        className={`w-full rounded-[3px] px-2 py-1.5 text-left leading-snug press ${
          show ? "bg-accent text-accent-foreground" : on ? (checked ? "bg-foreground/[0.15] line-through" : "bg-accent text-accent-foreground") : "enabled:hover:bg-foreground/[0.08]"
        }`}
      >
        {c.text}
      </button>
    );
  };

  return (
    <div>
      <HowTo
        goal="знайти чотири вади в реєстрі сусідньої команди. Реєстр у них є, але він уже не допомагає."
        steps={[
          "Перед тобою реєстр ризиків. Натискай на клітинки, у яких щось не так: вони підсвітяться. Повторне натискання знімає позначку.",
          "Шукай за ознаками живого реєстру: у кожного ризику є власник, конкретний тригер, для високого пріоритету обрано реакцію, а сам реєстр нещодавно переглядали.",
          "Коли позначиш чотири, натисни «Перевірити». За зайву позначку знімається віха.",
        ]}
        tip="Підказка: одна з вад не в таблиці, а над нею."
      />
      <div className="mt-5 rounded-[6px] bg-background p-3">
        <div className="text-sm">{cell(G.DEAD_REVIEW)}</div>
        <div className="-mx-1 mt-2 overflow-x-auto px-1">
          <table className="w-full min-w-[560px] table-fixed text-left text-sm">
            <thead className="text-[13px] text-muted">
              <tr className="border-b border-border">
                {G.DEAD_HEADS.map((h) => (
                  <th key={h} scope="col" className="px-2 py-1.5 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {G.DEAD_ROWS.map((row) => (
                <tr key={row[0].id} className="border-b border-border align-top last:border-0">
                  {row.map((c) => (
                    <td key={c.id} className="py-1">{cell(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {!checked ? (
          <button type="button" onClick={() => setChecked(true)} disabled={marks.length !== flaws.length} className={primary}>
            Перевірити
          </button>
        ) : (
          <>
            <div className="rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
              <p className="font-display text-lg font-semibold tabular-nums">
                Знайдено вад: {found} з {flaws.length}
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {G.DEAD_FLAWS.map((c) => (
                  <li key={c.id}>
                    <span className="font-medium">«{c.text}».</span> {c.flaw}
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" onClick={() => onDone(result)} className={primary}>
              Перейти до понеділків
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// The living register: rows change as the Mondays go by.
function LiveRegister({ rows, changed }: { rows: G.Row[]; changed: string | null }) {
  return (
    <ul className="space-y-1.5">
      {rows.map((r) => (
        <li
          key={r.id}
          className={`grid gap-x-3 gap-y-0.5 rounded-[4px] p-2.5 text-sm leading-snug transition-colors duration-300 sm:grid-cols-[minmax(0,1fr)_7rem_8rem] ${
            r.key === changed ? "bg-accent-soft" : "bg-background"
          }`}
        >
          <div>
            <p className="font-medium">
              <span className="font-display text-accent">{r.id}</span> {r.name}
            </p>
            <p className="text-[13px] text-muted">Тригер: {r.trigger}</p>
          </div>
          <p className="text-[13px] text-muted">
            <span className="tabular-nums">{r.prio}</span>
            <span className="block">{r.owner}</span>
          </p>
          <p className="font-medium">{r.status}</p>
        </li>
      ))}
    </ul>
  );
}

// Level 5: first the dead register, then six Mondays with the living one.
function MondayLevel({ mondays, onDone }: { mondays: number[][]; onDone: (score: number) => void }) {
  const [dead, setDead] = useState<number | null>(null);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  if (dead === null) return <DeadRegister onDone={setDead} />;

  const m = G.MONDAYS[i];
  const last = i === G.MONDAYS.length - 1;
  const rows = G.applyMondays(pick === null ? i : i + 1);

  return (
    <div>
      <HowTo
        goal="шість тижнів вести живий реєстр. Щопонеділка приходить новина, і на кожну треба реагувати по-своєму."
        steps={[
          "Прочитай новину цього тижня.",
          "Звір її з реєстром унизу: чи є такий ризик, який у нього тригер і хто власник.",
          "Вибери, що робиш. Реєстр оновиться, а змінений рядок підсвітиться.",
        ]}
        tip="Підказка: ризик, що стався, стає проблемою. Тригер, який не спрацював, не вимагає дій. Рішення про те, чого ніхто не передбачав, ухвалює спонсор."
      />
      <p className="mt-5 text-sm text-muted tabular-nums">
        Понеділок {i + 1} з {G.MONDAYS.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-4 leading-relaxed sm:p-5">{m.text}</div>
      <div className="mt-4 grid gap-1.5" role="group" aria-label="Що робиш">
        {mondays[i].map((k) => (
          <button
            key={k}
            type="button"
            disabled={pick !== null}
            aria-pressed={pick === k}
            onClick={() => {
              setPick(k);
              if (m.options[k].right) setScore((v) => v + 1);
            }}
            className={optionClass(pick !== null && !!m.options[k].right, pick !== null)}
          >
            {m.options[k].text}
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className="mt-4 space-y-4">
          <Feedback ok={!!m.options[pick].right}>{m.options[pick].why}</Feedback>
          <button
            type="button"
            onClick={() => {
              if (last) return onDone(dead + score);
              setI(i + 1);
              setPick(null);
            }}
            className={primary}
          >
            {last ? "Завершити гру" : "Наступний понеділок"}
          </button>
        </div>
      )}
      <p className="mt-5 font-medium">Реєстр ризиків</p>
      <div className="mt-2">
        <LiveRegister rows={rows} changed={pick === null ? null : m.effect.key} />
      </div>
    </div>
  );
}

export function RiskGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-11"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        fogs: shuffled(G.FOGS.length),
        tools: shuffled(G.TOOLS.length),
        stickers: G.STICKERS.map((s) => ({
          cause: shuffled(s.parts.cause.length),
          event: shuffled(s.parts.event.length),
          effect: shuffled(s.parts.effect.length),
        })),
        map: shuffled(G.RISKS.length),
        link: shuffled(G.LINK_ASK.options.length),
        say: shuffled(G.SAY_ASK.options.length),
        trees: G.TREES.map((t) => shuffled(t.branches.length)),
        shop: G.SHOP.map((s) => shuffled(s.options.length)),
        mondays: G.MONDAYS.map((m) => shuffled(m.options.length)),
      })}
      levels={[
        { name: "Туман", play: (o, done) => <FogLevel fogs={o.fogs} tools={o.tools} stickers={o.stickers} onDone={done} /> },
        { name: "Теплова карта", play: (o, done) => <MapLevel order={o.map} onDone={done} /> },
        { name: "Де тонко", play: (o, done) => <ThinLevel link={o.link} say={o.say} onDone={done} /> },
        { name: "Захист за резерв", play: (o, done) => <ShieldLevel trees={o.trees} shop={o.shop} onDone={done} /> },
        { name: "Понеділок", play: (o, done) => <MondayLevel mondays={o.mondays} onDone={done} /> },
      ]}
      startLabel="Почати"
      period="За гру"
      finalTitle="Одинадцята віха!"
      finalText="Модуль 11 пройдено. Далі — якість: коли результат справді готовий."
      nextHref={nextHref}
      nextLabel="До модуля 12"
    >
      <RisksBonus />
    </AssignmentGame>
  );
}
