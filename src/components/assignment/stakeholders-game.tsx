"use client";

import { useEffect, useRef, useState } from "react";
import { PeopleBonus } from "@/components/my-project/project-people";
import * as G from "@/content/assignments/module-05";
import { ENGAGE_ACTIONS, ENGAGEMENT } from "@/content/my-project";
import { AssignmentGame, chip, Feedback, primary, shuffled } from "./game-kit";

type Orders = { chats: number[][] };

const node = (name: string) => G.NODES.find((n) => n.name === name)!;
const STOPPERS = G.NODES.filter((n) => n.stopper);

// Level 1: talk to people on the map; each talk may reveal new ones.
function MapLevel({ onDone }: { onDone: (score: number) => void }) {
  const [found, setFound] = useState<string[]>(G.START);
  const [talked, setTalked] = useState<string[]>([]);
  const [line, setLine] = useState<{ who: string; text: string; fresh: string[] } | null>(null);
  const [over, setOver] = useState(false);
  const left = G.TALKS - talked.length;
  const caught = STOPPERS.filter((n) => found.includes(n.name));

  const talk = (name: string) => {
    if (over || talked.includes(name) || left === 0) return;
    const n = node(name);
    const fresh = n.reveals.filter((r) => !found.includes(r));
    setTalked((t) => [...t, name]);
    setFound((f) => [...f, ...fresh]);
    setLine({ who: name, text: n.line, fresh });
  };

  return (
    <div>
      <p className="text-muted">
        Це мапа людей навколо гри, від найближчого кола до найдальшого. Натисни на людину, щоб поговорити і спитати:
        «З ким ще нам варто поговорити?» У тебе {G.TALKS} розмов. Знайди тих, хто може зупинити реліз.
      </p>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span>
          Розмов лишилося: <strong className="tabular-nums">{left}</strong>
        </span>
        <span className="text-muted">Знайдено людей: {found.length}</span>
      </div>

      <ol className="mt-3 space-y-1.5">
        {G.RINGS.map((ring, r) => {
          const all = G.NODES.filter((n) => n.ring === r);
          const seen = all.filter((n) => found.includes(n.name));
          return (
            <li
              key={ring}
              className="rounded-[6px] bg-background p-2.5"
              style={{ marginInline: `${Math.min(r, 3) * 6}px` }}
            >
              <p className="text-[12px] text-muted">
                Коло {r + 1}: {ring}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {seen.map((n) => {
                  const done = talked.includes(n.name);
                  const stop = over && n.stopper;
                  return (
                    <button
                      key={n.name}
                      type="button"
                      onClick={() => talk(n.name)}
                      disabled={done || left === 0 || over}
                      className={`rounded-md px-3 py-2 text-sm font-medium press ${
                        stop
                          ? "bg-accent text-accent-foreground"
                          : done
                            ? "bg-foreground/[0.12] text-muted"
                            : "bg-surface-raised hover:bg-foreground/[0.12] disabled:opacity-60"
                      }`}
                    >
                      {done && "✓ "}
                      {n.name}
                    </button>
                  );
                })}
                {all.length > seen.length &&
                  Array.from({ length: all.length - seen.length }, (_, k) => (
                    <span
                      key={k}
                      aria-label="Ще не знайдено"
                      className="grid min-w-10 place-items-center rounded-md border border-dashed border-foreground/25 px-3 py-2 text-sm text-muted"
                    >
                      ?
                    </span>
                  ))}
              </div>
            </li>
          );
        })}
      </ol>

      {line && !over && (
        <div className="mt-5 rounded-[6px] bg-surface-raised px-4 py-3" aria-live="polite">
          <p className="text-[13px] text-muted">{line.who}</p>
          <p className="mt-1 font-display text-lg font-semibold leading-snug">{line.text}</p>
          <p className="mt-2 text-sm text-muted">
            {line.fresh.length > 0 ? `На мапі з'явилися: ${line.fresh.join(", ")}.` : "Нових людей ця розмова не додала."}
          </p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {!over ? (
          <button type="button" onClick={() => setOver(true)} className={left === 0 ? primary : chip(false)}>
            {left === 0 ? "Підбити підсумок" : "Досить розмов"}
          </button>
        ) : (
          <>
            <Feedback ok={caught.length === STOPPERS.length} title={`Знайдено ${caught.length} з ${STOPPERS.length}, хто може зупинити реліз.`}>
              {STOPPERS.map((n) => `${found.includes(n.name) ? "✓" : "✗"} ${n.name}: ${n.stopper}`).join(" ")}
              {" "}Шукай не лише очевидних: питай кожного, з ким ще поговорити, і проходь коло за колом.
            </Feedback>
            <button type="button" onClick={() => onDone(caught.length)} className={primary}>
              До наступного рівня
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Level 2: spread ten hours of attention over five stakeholders.
function AttentionLevel({ onDone }: { onDone: (score: number) => void }) {
  const [hours, setHours] = useState(G.ATTENTION.map(() => 0));
  const [lived, setLived] = useState(false);
  const used = hours.reduce((a, b) => a + b, 0);
  const fits = G.ATTENTION.map((a, k) => hours[k] >= a.min && hours[k] <= a.max);
  const score = fits.filter(Boolean).length;

  const add = (k: number, d: number) =>
    setHours((h) => {
      const sum = h.reduce((a, b) => a + b, 0);
      const v = h[k] + d;
      if (v < 0 || v > G.MAX_HOURS || sum + d > G.HOURS) return h;
      return h.map((x, j) => (j === k ? v : x));
    });

  return (
    <div>
      <p className="text-muted">
        На людей у тебе {G.HOURS} годин на тиждень. Розподіли їх кнопками + і −. Подумай, хто найсильніше може вплинути
        на проєкт і кого найбільше хвилює результат. Потім натисни «Прожити тиждень» і подивись, як кожен відреагує.
      </p>

      <p className="mt-5 text-sm">
        Розподілено: <strong className="tabular-nums">{used}</strong> з {G.HOURS} годин
      </p>
      <div className="mt-1 flex gap-0.5" aria-hidden>
        {Array.from({ length: G.HOURS }, (_, k) => (
          <span key={k} className={`h-2 flex-1 rounded-[1px] transition-colors duration-200 ${k < used ? "bg-accent" : "bg-foreground/15"}`} />
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {G.ATTENTION.map((a, k) => (
          <li key={a.name} className="rounded-[6px] bg-background p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium">{a.name}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => add(k, -1)}
                  disabled={lived || hours[k] === 0}
                  aria-label={`Менше годин: ${a.name}`}
                  className={`${chip(false)} w-10 disabled:opacity-40`}
                >
                  −
                </button>
                <span className="w-14 text-center tabular-nums">{hours[k]} год</span>
                <button
                  type="button"
                  onClick={() => add(k, 1)}
                  disabled={lived || used === G.HOURS || hours[k] === G.MAX_HOURS}
                  aria-label={`Більше годин: ${a.name}`}
                  className={`${chip(false)} w-10 disabled:opacity-40`}
                >
                  +
                </button>
              </div>
            </div>
            <p className="mt-1.5 text-[13px] leading-snug text-muted">
              Влада {a.power}. Інтерес {a.interest}.
            </p>
            {lived && (
              <p className={`mt-2 rounded-[4px] p-2.5 text-sm leading-snug ${fits[k] ? "bg-surface-raised" : "bg-accent-soft"}`}>
                <strong>
                  {fits[k] ? "✓" : "✗"} {a.group}, {a.min === a.max ? a.min : `${a.min}–${a.max}`} год.
                </strong>{" "}
                {hours[k] < a.min ? a.low : hours[k] > a.max ? a.high : a.ok}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-4">
        {!lived ? (
          <>
            <button type="button" onClick={() => setLived(true)} disabled={used < G.HOURS} className={primary}>
              Прожити тиждень
            </button>
            {used < G.HOURS && <p className="text-sm text-muted">Розподіли всі {G.HOURS} годин.</p>}
          </>
        ) : (
          <>
            <Feedback ok={score === G.ATTENTION.length} title={`Влучно: ${score} з ${G.ATTENTION.length}.`}>
              Найбільше уваги потребують ті, в кого і влада, і інтерес високі. Сильних, але байдужих тримай
              задоволеними: коротко й вчасно, без зайвих листів.
            </Feedback>
            <button type="button" onClick={() => onDone(score)} className={primary}>
              До наступного рівня
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Level 3: lift people to their desired level with the right action cards.
function LadderLevel({ onDone }: { onDone: (score: number) => void }) {
  const [levels, setLevels] = useState(G.CLIMBERS.map((c) => c.now));
  const [sel, setSel] = useState<number | null>(null);
  const [moves, setMoves] = useState(G.MOVES);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [over, setOver] = useState(false);
  const exact = G.CLIMBERS.filter((c, k) => levels[k] === c.want).length;
  const all = exact === G.CLIMBERS.length;
  const finished = over || all || moves === 0;

  const play = (a: (typeof ENGAGE_ACTIONS)[number]) => {
    if (sel === null || finished) return;
    const c = G.CLIMBERS[sel];
    const lv = levels[sel];
    setMoves((m) => m - 1);
    if (a.from !== lv) {
      const fit = ENGAGE_ACTIONS.find((x) => x.from === lv);
      setNote({
        ok: false,
        text: `«${a.name}» не спрацювало: ${c.name} зараз на рівні «${ENGAGEMENT[lv].toLowerCase()}». ${
          fit ? `Тут допоможе «${fit.name}».` : "Вище піднятися нікуди."
        } Хід втрачено.`,
      });
      return;
    }
    setLevels((l) => l.map((v, k) => (k === sel ? a.to : v)));
    setNote(
      a.to > c.want
        ? { ok: false, text: `${c.over} Хід витрачено даремно, і ${c.name} тепер вище мітки.` }
        : { ok: true, text: `${c.name}: тепер «${ENGAGEMENT[a.to].toLowerCase()}».` },
    );
  };

  return (
    <div>
      <p className="text-muted">
        Кожна людина стоїть на сходинці залучення, а мітка «Б» показує, де вона потрібна проєкту. Обери людину, потім
        зіграй карту дії. Кожна карта працює лише на своїй сходинці. Довести всіх до мітки треба за {G.MOVES} ходів.
      </p>

      <p className="mt-5 text-sm">
        Ходів лишилося: <strong className="tabular-nums">{moves}</strong>
      </p>

      <ul className="mt-3 space-y-2">
        {G.CLIMBERS.map((c, k) => (
          <li key={c.name}>
            <button
              type="button"
              onClick={() => setSel(k)}
              disabled={finished}
              aria-pressed={sel === k}
              className={`w-full rounded-[6px] border p-3 text-left press ${
                sel === k ? "border-accent bg-accent-soft" : "border-transparent bg-background hover:bg-foreground/[0.06]"
              }`}
            >
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium">
                  {levels[k] === c.want && "✓ "}
                  {c.name}
                </span>
                <span className="text-[13px] text-muted">{ENGAGEMENT[levels[k]]}</span>
              </span>
              <span className="mt-2 grid grid-cols-5 gap-1" aria-hidden>
                {ENGAGEMENT.map((name, s) => (
                  <span
                    key={name}
                    className={`relative grid h-7 place-items-center rounded-[3px] text-[11px] font-semibold transition-colors duration-300 ${
                      s === levels[k] ? "bg-accent text-accent-foreground" : s < levels[k] ? "bg-accent/30" : "bg-foreground/10"
                    } ${s === c.want ? "ring-2 ring-accent ring-offset-1 ring-offset-background" : ""}`}
                  >
                    {s === c.want ? "Б" : ""}
                  </span>
                ))}
              </span>
              <span className="mt-1.5 block text-[13px] leading-snug text-muted">{c.why}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[12px] text-muted">
        Сходинки зліва направо: {ENGAGEMENT.map((e) => e.toLowerCase()).join(" → ")}.
      </p>

      {!finished && (
        <>
          <p className="mt-5 font-medium">{sel === null ? "Спершу обери людину" : `Карта для: ${G.CLIMBERS[sel].name}`}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Карти дій">
            {ENGAGE_ACTIONS.map((a) => (
              <button
                key={a.name}
                type="button"
                onClick={() => play(a)}
                disabled={sel === null}
                className="flex flex-col gap-1.5 rounded-[6px] bg-surface-raised p-3 text-left leading-snug press hover:bg-foreground/[0.12] disabled:opacity-50"
              >
                <span className="font-medium">{a.name}</span>
                <span className="text-[13px] text-muted">{a.note}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {note && !finished && (
        <p className={`mt-4 rounded-[4px] p-3 leading-relaxed ${note.ok ? "bg-surface-raised" : "bg-accent-soft"}`} aria-live="polite">
          {note.text}
        </p>
      )}

      <div className="mt-5 space-y-4">
        {!finished ? (
          <button type="button" onClick={() => setOver(true)} className={chip(false)}>
            Завершити раніше
          </button>
        ) : (
          <>
            <Feedback ok={all} title={all ? "Усі на своїх мітках!" : `На мітці: ${exact} з ${G.CLIMBERS.length}.`}>
              {note && !note.ok && `${note.text} `}
              Різниця між поточним і бажаним рівнем — це план роботи з людьми. І бажаний рівень не завжди «веде»: від
              податкової чи магазину досить нейтральності.
            </Feedback>
            <button type="button" onClick={() => onDone(exact)} className={primary}>
              До наступного рівня
            </button>
          </>
        )}
      </div>
    </div>
  );
}

type Line = { side: "in" | "out" | "note"; who?: string; text: string };

// Level 4: a phone with incoming messages; answer each one.
function ChatLevel({ order, onDone }: { order: number[][]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [log, setLog] = useState<Line[]>([{ side: "in", who: G.CHATS[0].from, text: G.CHATS[0].text }]);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const c = G.CHATS[i];
  const last = i === G.CHATS.length - 1;
  // Keep the newest message in view, like a messenger does.
  const feed = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = feed.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const answer = (k: number) => {
    if (answered) return;
    const o = c.options[k];
    setAnswered(true);
    if (o.right) setScore((v) => v + 1);
    setLog((l) => [
      ...l,
      { side: "out", text: o.reply ?? (o.way ? `${G.WAYS[o.way].name}: ${o.label.toLowerCase()}` : o.label) },
      { side: "note", text: `${o.right ? "✓" : "✗"} ${o.outcome}` },
    ]);
  };
  const next = () => {
    if (last) return onDone(score);
    const n = G.CHATS[i + 1];
    setI(i + 1);
    setAnswered(false);
    setLog((l) => [...l, { side: "in", who: n.from, text: n.text }]);
  };

  return (
    <div>
      <p className="text-muted">
        Тиждень до релізу, і повідомлення сиплються одне за одним. На кожне обери відповідь. Здебільшого треба вибрати
        спосіб комунікації: інтерактивний, розсилку чи доступ за запитом.
      </p>

      <div className="mx-auto mt-5 max-w-md overflow-hidden rounded-[22px] border-4 border-foreground/15 bg-background">
        <div className="flex items-center justify-between bg-surface-raised px-4 py-2.5 text-[13px]">
          <span className="font-medium">Чати студії</span>
          <span className="text-muted tabular-nums">
            {i + 1} / {G.CHATS.length}
          </span>
        </div>
        <ol ref={feed} className="max-h-[22rem] space-y-2 overflow-y-auto p-3" aria-live="polite">
          {log.map((m, k) =>
            m.side === "note" ? (
              <li key={k} className="px-2 py-1 text-center text-[13px] leading-snug text-muted">
                {m.text}
              </li>
            ) : (
              <li key={k} className={`flex ${m.side === "out" ? "justify-end" : ""}`}>
                <div
                  className={`max-w-[85%] rounded-[14px] px-3 py-2 leading-snug ${
                    m.side === "out" ? "rounded-br-[4px] bg-accent text-accent-foreground" : "rounded-bl-[4px] bg-surface-raised"
                  }`}
                >
                  {m.who && <p className="text-[12px] font-medium text-muted">{m.who}</p>}
                  <p>{m.text}</p>
                </div>
              </li>
            ),
          )}
        </ol>
      </div>

      <div className="mx-auto mt-4 max-w-md">
        {!answered ? (
          <>
            <p className="font-medium">{c.ask}</p>
            <div className="mt-2 grid gap-2" role="group" aria-label={c.ask}>
              {order[i].map((k) => {
                const o = c.options[k];
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => answer(k)}
                    className="rounded-[6px] bg-foreground/[0.05] px-4 py-3 text-left leading-snug press hover:bg-foreground/[0.09]"
                  >
                    {o.way && (
                      <span className="block text-[13px] text-muted">
                        <strong className="text-foreground">{G.WAYS[o.way].name}.</strong> {G.WAYS[o.way].note}
                      </span>
                    )}
                    <span className={o.way ? "mt-1 block" : ""}>{o.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <button type="button" onClick={next} className={primary}>
            {last ? "Завершити тиждень" : "Наступне повідомлення"}
          </button>
        )}
      </div>
    </div>
  );
}

// Module 5 game: stakeholders of the cat puzzle release in four levels.
export function StakeholdersGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-05"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({ chats: G.CHATS.map((c) => shuffled(c.options.length)) })}
      levels={[
        { name: "Хто ще?", play: (_, done) => <MapLevel onDone={done} /> },
        { name: "Тиждень уваги", play: (_, done) => <AttentionLevel onDone={done} /> },
        { name: "Драбина залучення", play: (_, done) => <LadderLevel onDone={done} /> },
        { name: "Месенджер", play: (o, done) => <ChatLevel order={o.chats} onDone={done} /> },
      ]}
      startLabel="Почати"
      period="За гру"
      finalTitle="П'ята віха!"
      finalText="Модуль 5 пройдено. Далі — хто ухвалює рішення в проєкті і хто може сказати «стоп»."
      nextHref={nextHref}
      nextLabel="До модуля 6"
    >
      <PeopleBonus />
    </AssignmentGame>
  );
}
