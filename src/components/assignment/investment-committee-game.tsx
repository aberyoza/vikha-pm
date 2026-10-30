"use client";

import { useState } from "react";
import { InvestBonus } from "@/components/my-project/project-invest";
import * as G from "@/content/assignments/module-04";
import { AssignmentGame, primary, shuffled } from "./game-kit";

type Pick = { decision: number; opened: G.Fact[] };
// The founder levels `record` their picks and the reveal reads them. Levels
// remount one after another, so a plain array shared through orders is enough.
type Orders = { decisions: number[][]; picks: Pick[]; record: (index: number, pick: Pick) => void };

const newOrders = (): Orders => {
  const picks: Pick[] = [];
  return {
    decisions: G.FOUNDERS.map((f) => shuffled(f.decisions.length)),
    picks,
    record: (index, pick) => {
      picks[index] = pick;
    },
  };
};

const factName = (f: G.Fact) => G.FACTS.find((x) => x.key === f)!.name;
const invested = (picks: Pick[]) => picks.reduce((s, p, k) => s + G.FOUNDERS[k].decisions[p.decision].amount, 0);
const money = (n: number) => `${n} тис. грн`;

// One founder: open up to three fact cards, then decide.
function FounderLevel({ index, orders, onDone }: { index: number; orders: Orders; onDone: (score: number) => void }) {
  const f = G.FOUNDERS[index];
  const left = G.FUND - invested(orders.picks.slice(0, index));
  const [opened, setOpened] = useState<G.Fact[]>([]);
  const [choice, setChoice] = useState<number | null>(null);
  const full = opened.length >= G.MAX_OPEN;

  const open = (k: G.Fact) => setOpened((prev) => (prev.includes(k) || prev.length >= G.MAX_OPEN ? prev : [...prev, k]));
  const decide = () => {
    if (choice === null) return;
    orders.record(index, { decision: choice, opened });
    onDone((f.decisions[choice].right ? 2 : 0) + (opened.includes(f.key) ? 1 : 0));
  };

  return (
    <div>
      <p className="text-muted">
        Засновник розповідає про проєкт і просить грошей. Відкрий до трьох карток з фактами, а потім виріши: дати
        гроші, відмовити чи дати з умовою. Усіх фактів не дізнаєшся, тож обирай, про що спитати. Що вийшло з рішення,
        покаже фінал.
      </p>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="text-muted tabular-nums">
          Засновник {index + 1} з {G.FOUNDERS.length}
        </span>
        <span>
          У фонді: <strong className="tabular-nums">{money(left)}</strong>
        </span>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <span
          aria-hidden
          className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-raised font-display text-xl font-semibold"
        >
          {f.who[0]}
        </span>
        <div className="rounded-[6px] bg-surface-raised px-4 py-3">
          <p className="text-[13px] text-muted">
            {f.who} · {f.project}
          </p>
          <p className="mt-1 font-display text-xl font-semibold leading-snug">{f.pitch}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">Що спитати?</p>
        <p className="text-sm text-muted tabular-nums">
          Відкрито {opened.length} з {G.MAX_OPEN}
        </p>
      </div>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {G.FACTS.map((c) => {
          const on = opened.includes(c.key);
          return (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => open(c.key)}
                disabled={on || full}
                aria-expanded={on}
                className={`flex h-full w-full flex-col gap-1.5 rounded-[6px] p-3 text-left leading-snug transition-colors duration-200 ${
                  on ? "bg-accent-soft" : "bg-background press hover:bg-foreground/[0.08] disabled:opacity-50 disabled:hover:bg-background"
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <span aria-hidden className={`block size-2 shrink-0 rotate-45 rounded-[1px] ${on ? "bg-accent" : "bg-current opacity-50"}`} />
                  {c.name}
                </span>
                {on ? (
                  <span className="text-[15px]">{f.facts[c.key]}</span>
                ) : (
                  <span className="text-[13px] text-muted">{c.note}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {full && <p className="mt-2 text-sm text-muted">Три питання поставлено. Час вирішувати.</p>}

      <p className="mt-6 font-medium">Твоє рішення</p>
      <div className="mt-2 grid gap-2" role="group" aria-label="Рішення">
        {orders.decisions[index].map((k) => {
          const d = f.decisions[k];
          const short = d.amount > left;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setChoice(k)}
              disabled={short}
              aria-pressed={choice === k}
              className={`rounded-[4px] border px-4 py-3 text-left press disabled:opacity-50 ${
                choice === k ? "border-accent bg-accent-soft" : "border-transparent bg-foreground/[0.05] hover:bg-foreground/[0.09]"
              }`}
            >
              {d.label}
              {short && <span className="block text-[13px] text-muted">У фонді лишилося лише {money(left)}</span>}
            </button>
          );
        })}
      </div>

      <button type="button" onClick={decide} disabled={choice === null} className={`${primary} mt-5`}>
        {index === G.FOUNDERS.length - 1 ? "Записати рішення і закрити засідання" : "Записати рішення"}
      </button>
    </div>
  );
}

// The finale: what came of every decision, one founder at a time, then the fund.
function RevealLevel({ orders, onDone }: { orders: Orders; onDone: (score: number) => void }) {
  const [shown, setShown] = useState(1);
  const all = shown > G.FOUNDERS.length;
  const spent = invested(orders.picks);
  const back = orders.picks.reduce((s, p, k) => s + G.FOUNDERS[k].decisions[p.decision].returned, 0);
  const kept = G.deposit(G.FUND - spent);
  const total = back + kept;
  const safe = G.deposit(G.FUND);

  return (
    <div>
      <p className="text-muted">
        Засідання закрито, минуло чотири роки. Невкладені гроші весь цей час лежали на депозиті під 10%.
        Подивимось, що сталося з кожним рішенням.
      </p>

      <ol className="mt-5 space-y-3">
        {G.FOUNDERS.slice(0, shown).map((f, k) => {
          const p = orders.picks[k];
          const d = f.decisions[p.decision];
          const best = f.decisions.find((x) => x.right)!;
          return (
            <li key={f.project} className="rounded-[6px] bg-surface-raised p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-lg font-semibold">{f.project}</p>
                {d.amount > 0 && (
                  <p className="text-sm tabular-nums">
                    {money(d.amount)} → <strong>{money(d.returned)}</strong>
                  </p>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">Твоє рішення: {d.label.toLowerCase()}</p>
              <p className="mt-3 leading-relaxed">{d.outcome}</p>
              <p className="mt-3 rounded-[4px] bg-accent-soft p-3 leading-relaxed">
                <strong>{d.right ? "Влучне рішення." : `Краще було: ${best.label.toLowerCase()}.`}</strong> {f.lesson}
              </p>
              <p className="mt-2 text-sm text-muted">
                {p.opened.includes(f.key) ? "✓" : "✗"} Головна картка тут — «{factName(f.key)}»
                {p.opened.includes(f.key) ? ", і її відкрито." : ", але її не відкрито."}
              </p>
            </li>
          );
        })}
      </ol>

      {!all ? (
        <button type="button" onClick={() => setShown((v) => v + 1)} className={`${primary} mt-5`}>
          {shown === G.FOUNDERS.length ? "Підсумок фонду" : "Наступний засновник"}
        </button>
      ) : (
        <div className="mt-6">
          <dl className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-[4px] bg-foreground/[0.05] p-3">
              <dt className="text-[13px] text-muted">Вкладено в проєкти</dt>
              <dd className="mt-0.5 tabular-nums">
                {money(spent)} → {money(back)}
              </dd>
            </div>
            <div className="rounded-[4px] bg-foreground/[0.05] p-3">
              <dt className="text-[13px] text-muted">Лежало на депозиті</dt>
              <dd className="mt-0.5 tabular-nums">
                {money(G.FUND - spent)} → {money(kept)}
              </dd>
            </div>
            <div className="rounded-[4px] bg-accent p-3 text-accent-foreground">
              <dt className="text-[13px]">Фонд через чотири роки</dt>
              <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums">{money(total)}</dd>
            </div>
          </dl>
          <p className="mt-4 leading-relaxed">
            {total > safe
              ? `Це більше, ніж ${money(safe)}, які дав би депозит на всю суму. Твої рішення заробили фонду ${money(total - safe)}.`
              : total === safe
                ? `Стільки ж дав би депозит на всю суму. Фонд нічого не втратив, але й не заробив.`
                : `Депозит на всю суму дав би ${money(safe)}, тобто на ${money(safe - total)} більше. Зіграй ще раз і постав інші питання.`}
          </p>
          <button type="button" onClick={() => onDone(0)} className={`${primary} mt-5`}>
            Завершити
          </button>
        </div>
      )}
    </div>
  );
}

// Module 4 game: an investment committee of four founders and a reveal.
export function InvestmentCommitteeGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-04"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={newOrders}
      levels={[
        ...G.FOUNDERS.map((f, k) => ({
          name: f.project,
          play: (o: Orders, done: (score: number) => void) => <FounderLevel index={k} orders={o} onDone={done} />,
        })),
        { name: "Минуло чотири роки", play: (o, done) => <RevealLevel orders={o} onDone={done} /> },
      ]}
      startLabel="Відкрити засідання"
      period="За засідання"
      finalTitle="Четверта віха!"
      finalText="Модуль 4 пройдено. Далі — люди навколо проєкту: хто на нього впливає і кого він зачіпає."
      nextHref={nextHref}
      nextLabel="До модуля 5"
    >
      <InvestBonus />
    </AssignmentGame>
  );
}
