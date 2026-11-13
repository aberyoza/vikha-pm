"use client";

import { useState } from "react";
import { ScopeBonus } from "@/components/my-project/project-scope";
import * as G from "@/content/assignments/module-07";
import { AssignmentGame, chip, Feedback, HowTo, primary, shuffled } from "./game-kit";

type Orders = { ideas: number[]; missing: number[]; build: number[]; actions: number[]; results: number[] };

// Level 1: pack the suitcase. A card shows its need once it has been packed.
function SuitcaseLevel({ order, onDone }: { order: number[]; onDone: (score: number) => void }) {
  const [packed, setPacked] = useState<number[]>([]);
  const [seen, setSeen] = useState<number[]>([]);
  const [closed, setClosed] = useState(false);
  const used = packed.reduce((sum, k) => sum + G.IDEAS[k].weeks, 0);
  const free = G.CAPACITY - used;
  const score = G.suitcaseScore(packed);

  const toggle = (k: number) => {
    if (closed) return;
    setPacked((p) => (p.includes(k) ? p.filter((v) => v !== k) : [...p, k]));
    setSeen((s) => (s.includes(k) ? s : [...s, k]));
  };

  const missed = G.IDEAS.filter((d, k) => d.must && !packed.includes(k));
  const useless = packed.map((k) => G.IDEAS[k]).filter((d) => !d.need);
  const left = G.IDEAS.filter((_, k) => !packed.includes(k));

  return (
    <div>
      <HowTo
        goal="покласти у валізу на 15 тижнів лише те, що справді потрібне, і нічого не забути."
        steps={[
          "Унизу 10 ідей. На картці видно, хто просить і скільки тижнів це займе.",
          "Натисніть на картку, щоб покласти її у валізу. Вона покаже, до якої потреби бізнесу веде. Такий зв'язок «вимога → потреба» і є матрицею відстеження.",
          "Натисніть на картку ще раз, щоб вийняти її. Те, що вже не вміщається, позначено «Не влізе».",
          "Коли визначитеся, натисніть «Закрити валізу». Решта ідей потрапить у список «Не входить».",
        ]}
        tip="Підказка: ідея може звучати чудово і все одно ні до чого не вести. Перевірте кілька карток, вийняти їх можна будь-коли."
      />

      <div className="mt-5 rounded-[6px] bg-background p-4">
        <p className="text-[13px] text-muted">Потреби бізнесу</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {G.NEEDS.map((n) => (
            <span key={n} className="rounded-[4px] bg-foreground/[0.07] px-2.5 py-1 text-sm">
              {n}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-muted">Умова</p>
        <p className="mt-0.5 text-sm">{G.CONDITION}</p>

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <p className="font-medium">Валіза</p>
          <p className="text-sm tabular-nums" aria-live="polite">
            Зайнято {used} з {G.CAPACITY} тиж.
          </p>
        </div>
        <div className="mt-1.5 flex h-10 gap-0.5 rounded-[4px] border border-dashed border-foreground/25 p-0.5">
          {packed.map((k) => (
            <div
              key={k}
              title={G.IDEAS[k].name}
              style={{ flexGrow: G.IDEAS[k].weeks, flexBasis: 0 }}
              className="grid min-w-0 place-items-center overflow-hidden rounded-[2px] bg-accent text-xs font-semibold tabular-nums text-accent-foreground"
            >
              {G.IDEAS[k].weeks}
            </div>
          ))}
          {free > 0 && <div style={{ flexGrow: free, flexBasis: 0 }} />}
        </div>
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {order.map((k) => {
          const d = G.IDEAS[k];
          const inside = packed.includes(k);
          const noRoom = !inside && d.weeks > free;
          return (
            <li key={k}>
              <button
                type="button"
                aria-pressed={inside}
                onClick={() => toggle(k)}
                disabled={closed || noRoom}
                className={`flex h-full w-full flex-col gap-1 rounded-[6px] p-3 text-left leading-snug press ${
                  inside ? "bg-accent-soft ring-2 ring-accent" : "bg-background hover:bg-foreground/[0.08] disabled:hover:bg-background"
                } ${noRoom ? "opacity-60" : ""}`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-medium">{d.name}</span>
                  <span className="shrink-0 text-sm tabular-nums text-muted">{d.weeks} тиж.</span>
                </span>
                <span className="text-[13px] text-muted">Просить: {d.from}</span>
                {seen.includes(k) && (
                  <span className="text-[13px]">{d.need ? `Вимога → потреба: ${d.need}` : "Вимога → ні до чого не веде"}</span>
                )}
                {noRoom && <span className="text-[13px] text-muted">Не влізе: вільно {free} тиж.</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 space-y-4">
        {!closed ? (
          <button type="button" onClick={() => setClosed(true)} disabled={packed.length === 0} className={primary}>
            Закрити валізу
          </button>
        ) : (
          <>
            <Feedback ok={score === G.SUITCASE_MAX} title={score === G.SUITCASE_MAX ? "Усе на місці!" : `${score} з ${G.SUITCASE_MAX}.`}>
              {score === G.SUITCASE_MAX
                ? "Усі обов'язкові вимоги у валізі, а решта місця пішла на те, що веде до потреб бізнесу."
                : [
                    ...missed.map((d) => `«${d.name}» обов'язкове: ${d.why}`),
                    ...useless.map((d) => `«${d.name}»: ${d.why}`),
                    useless.length === 0 && missed.length === 0 ? "У валізі лишилося вільне місце під ще одну корисну ідею." : "",
                  ].join(" ")}
            </Feedback>
            <div className="rounded-[6px] bg-background p-4">
              <p className="font-medium">Опис змісту: не входить</p>
              <p className="mt-1 text-sm text-muted">
                Опис змісту фіксує і те, що входить у проєкт, і те, що ні. Якщо не записати, про це запитають ще раз.
              </p>
              <ul className="mt-3 space-y-2">
                {left.map((d) => (
                  <li key={d.name} className="text-sm leading-snug">
                    <strong className="font-medium">{d.name}.</strong> <span className="text-muted">{d.why}</span>
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
  );
}

function PackageRow({ code, name, hours, muted }: { code: string; name: string; hours: number; muted?: boolean }) {
  return (
    <span className="flex items-baseline justify-between gap-3">
      <span className={muted ? "text-muted line-through" : "font-medium"}>
        <span className="mr-2 text-sm font-normal tabular-nums text-muted">{code}</span>
        {name}
      </span>
      <span className="shrink-0 text-sm tabular-nums text-muted">{hours} год</span>
    </span>
  );
}

// Level 2: cut the WBS by the 8/80 rule, then compare it with the scope.
function ScissorsLevel({ order, onDone }: { order: number[]; onDone: (score: number) => void }) {
  const [cuts, setCuts] = useState<Record<string, G.Cut>>({});
  const [missing, setMissing] = useState<number | null>(null);
  const cutScore = G.LEAVES.filter((l) => cuts[l.code] === l.cut).length;
  const allCut = G.LEAVES.every((l) => cuts[l.code]);
  const picked = missing === null ? null : G.MISSING[missing];
  const merged = G.MERGED.of.every((code) => cuts[code]);

  return (
    <div>
      <HowTo
        goal="довести дерево робіт до робочих пакетів, які можна оцінити і доручити, і знайти, чого в ньому бракує."
        steps={[
          "Перед вами WBS, ієрархічна структура робіт. Коди показують, де в дереві стоїть кожен елемент. Найнижчий рівень — робочий пакет.",
          "Подивіться на години елемента і натисніть «Розбити», «Об'єднати» чи «Залишити». Під кожною кнопкою написано, коли вона підходить.",
          "Дерево одразу зміниться: велике розгорнеться на частини, а дрібне об'єднається.",
          "Коли обробите усі елементи, звірте дерево з описом змісту і виберіть, чого бракує.",
        ]}
        tip="Підказка: елемент 3.1 уже обрізано правильно. Це зразок робочого пакета."
      />

      <p className="mt-4 rounded-[4px] border border-dashed border-foreground/25 px-3 py-2 text-sm leading-relaxed">
        <strong>Правило 8/80.</strong> Робочий пакет займає не менше 8 годин (один робочий день) і не більше 80 (два робочі
        тижні). Коротше об&apos;єднуємо, довше розбиваємо.
      </p>

      <div className="mt-5 space-y-5">
        {G.TREE.map((b) => (
          <section key={b.code}>
            <h3 className="font-display text-lg font-semibold">
              <span className="mr-2 tabular-nums text-accent">{b.code}</span>
              {b.name}
            </h3>
            <ul className="mt-2 space-y-2 border-l-2 border-foreground/15 pl-3">
              {b.leaves.map((l) => {
                const cut = cuts[l.code];
                if (!l.cut)
                  return (
                    <li key={l.code} className="rounded-[6px] bg-background p-3">
                      <PackageRow code={l.code} name={l.name} hours={l.hours} />
                      <p className="mt-1 text-[13px] text-muted">Робочий пакет: 16 год, у межах правила.</p>
                    </li>
                  );
                const ok = cut === l.cut;
                return (
                  <li key={l.code} className="rounded-[6px] bg-background p-3">
                    <PackageRow code={l.code} name={l.name} hours={l.hours} muted={!!cut && l.cut === "merge"} />
                    {!cut ? (
                      <div className="mt-2.5 grid grid-cols-3 gap-1.5" role="group" aria-label={`Що зробити: ${l.name}`}>
                        {G.CUTS.map((c) => (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setCuts((v) => ({ ...v, [l.code]: c.key }))}
                            className="rounded-md bg-foreground/[0.07] px-1.5 py-2 text-center leading-tight press hover:bg-foreground/[0.12]"
                          >
                            <span className="block text-sm font-medium">{c.name}</span>
                            <span className="mt-0.5 block text-xs text-muted">{c.note}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm leading-snug" aria-live="polite">
                        {ok ? "✓ " : `✗ Тут не «${G.CUTS.find((c) => c.key === cut)!.name}». `}
                        {l.why}
                      </p>
                    )}
                    {cut && l.parts && (
                      <ul className="mt-2.5 space-y-1.5 border-l-2 border-accent/50 pl-3">
                        {l.parts.map((p, k) => (
                          <li key={p.name} className="animate-drum text-sm">
                            <PackageRow code={`${l.code}.${k + 1}`} name={p.name} hours={p.hours} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              {b.code === "1" && merged && (
                <li className="animate-drum rounded-[6px] bg-accent-soft p-3">
                  <PackageRow code={G.MERGED.code} name={G.MERGED.name} hours={G.MERGED.hours} />
                </li>
              )}
            </ul>
          </section>
        ))}
        {picked && (
          <section className="animate-drum">
            <h3 className="font-display text-lg font-semibold">
              <span className="mr-2 tabular-nums text-accent">{G.NEW_BRANCH.code}</span>
              {G.NEW_BRANCH.name}
            </h3>
          </section>
        )}
      </div>

      {allCut && (
        <div className="mt-6 rounded-[6px] bg-surface-raised p-4">
          <p className="font-display text-lg font-semibold">Чого бракує в дереві?</p>
          <p className="mt-1 leading-relaxed">
            <strong className="font-medium">В описі змісту:</strong> {G.SCOPE_STATEMENT}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Чого бракує в дереві">
            {order.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={missing === k}
                disabled={missing !== null}
                onClick={() => setMissing(k)}
                className={`${chip(missing === k)} disabled:cursor-default`}
              >
                {G.MISSING[k].text}
              </button>
            ))}
          </div>
        </div>
      )}

      {picked && (
        <div className="mt-5 space-y-4">
          <Feedback ok={!!picked.right}>
            {picked.right ? picked.why : `${picked.why} Бракує публікації в магазинах: в описі змісту вона є, а в дереві немає.`}
          </Feedback>
          <button type="button" onClick={() => onDone(cutScore + (picked.right ? 1 : 0))} className={primary}>
            До наступного рівня
          </button>
        </div>
      )}
    </div>
  );
}

// Level 3: spot what differs between the baseline and the build, name each
// extra and decide what to do with all of it.
function SpotLevel({ build, actions, onDone }: { build: number[]; actions: number[]; onDone: (score: number) => void }) {
  const [tab, setTab] = useState<"plan" | "build">("plan");
  const [marks, setMarks] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [kinds, setKinds] = useState<(G.Drift | null)[]>(G.EXTRAS.map(() => null));
  const [action, setAction] = useState<number | null>(null);

  const key = (side: "plan" | "build", text: string) => `${side}:${text}`;
  const toggle = (id: string) => {
    if (checked) return;
    setMarks((m) => (m.includes(id) ? m.filter((v) => v !== id) : [...m, id]));
  };
  const diffs = [
    ...G.PLAN.filter((p) => p.skipped).map((p) => key("plan", p.text)),
    ...G.BUILD.filter((b) => b.extra).map((b) => key("build", b.text)),
  ];
  const found = marks.filter((m) => diffs.includes(m)).length;
  const falseTaps = marks.length - found;
  const foundScore = Math.max(0, found - falseTaps);
  const kindScore = G.EXTRAS.filter((e, k) => kinds[k] === e.kind).length;
  const sorted = kinds.every((k) => k !== null);
  const picked = action === null ? null : G.ACTIONS[action];

  const row = (side: "plan" | "build", text: string, isDiff: boolean) => {
    const id = key(side, text);
    const on = marks.includes(id);
    return (
      <li key={id}>
        <button
          type="button"
          aria-pressed={on}
          disabled={checked}
          onClick={() => toggle(id)}
          className={`w-full rounded-[4px] px-3 py-2 text-left text-sm leading-snug press ${
            checked
              ? isDiff
                ? "bg-accent text-accent-foreground"
                : on
                  ? "bg-foreground/[0.12] line-through"
                  : "bg-foreground/[0.04]"
              : on
                ? "bg-accent-soft ring-2 ring-accent"
                : "bg-foreground/[0.04] hover:bg-foreground/[0.1]"
          }`}
        >
          {checked && isDiff && (on ? "✓ " : "Пропущено: ")}
          {text}
        </button>
      </li>
    );
  };

  return (
    <div>
      <HowTo
        goal="знайти всі розбіжності між базовим планом змісту і збіркою та вирішити, що з ними робити."
        steps={[
          "Це аналіз відхилень: зліва затверджений план, справа те, що реально є в збірці. На телефоні перемикайте їх вкладками.",
          "Натисніть на кожен рядок, якого немає на іншому боці. Розбіжність може бути і в плані, і в збірці.",
          "Натисніть «Перевірити». Кожне правильне знаходження дає алмаз, а зайвий тап один забирає.",
          "Прочитайте, звідки взялася кожна зайва робота, і назвіть її: розростання змісту чи позолота.",
          "Виберіть, що робити з усім знайденим.",
        ]}
        tip="Підказка: порядок рядків у збірці перемішаний, тож звіряйте назви, а не позиції."
      />

      <div className="mt-5 flex gap-1.5 sm:hidden" role="group" aria-label="Що показати">
        <button type="button" aria-pressed={tab === "plan"} onClick={() => setTab("plan")} className={chip(tab === "plan")}>
          Базовий план
        </button>
        <button type="button" aria-pressed={tab === "build"} onClick={() => setTab("build")} className={chip(tab === "build")}>
          Збірка
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:mt-5 sm:grid-cols-2">
        <div className={`rounded-[6px] bg-background p-3 ${tab === "plan" ? "" : "hidden sm:block"}`}>
          <p className="mb-2 font-medium">Базовий план</p>
          <ul className="space-y-1.5">{G.PLAN.map((p) => row("plan", p.text, !!p.skipped))}</ul>
        </div>
        <div className={`rounded-[6px] bg-background p-3 ${tab === "build" ? "" : "hidden sm:block"}`}>
          <p className="mb-2 font-medium">Збірка</p>
          <ul className="space-y-1.5">
            {build.map((k) => row("build", G.BUILD[k].text, !!G.BUILD[k].extra))}
          </ul>
        </div>
      </div>

      {!checked && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setChecked(true)} disabled={marks.length === 0} className={primary}>
            Перевірити
          </button>
          <span className="text-sm text-muted tabular-nums">Позначено: {marks.length}</span>
        </div>
      )}

      {checked && (
        <div className="mt-5 space-y-4">
          <Feedback
            ok={foundScore === diffs.length}
            title={`Знайдено ${found} з ${diffs.length}${falseTaps ? `, зайвих тапів: ${falseTaps}` : ""}.`}
          >
            {G.SKIPPED_WHY} Решта розбіжностей — у збірці. Звідки вони взялися?
          </Feedback>

          <ul className="space-y-2">
            {G.EXTRAS.map((e, k) => {
              const kind = kinds[k];
              return (
                <li key={e.text} className="rounded-[6px] bg-background p-3 sm:p-4">
                  <p className="font-medium">{e.text}</p>
                  <p className="mt-0.5 text-sm leading-snug text-muted">{e.story}</p>
                  <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2" role="group" aria-label={`Що це: ${e.text}`}>
                    {G.DRIFTS.map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        aria-pressed={kind === d.key}
                        disabled={kind !== null}
                        onClick={() => setKinds((v) => v.map((x, j) => (j === k ? d.key : x)))}
                        className={`rounded-md px-3 py-2 text-left leading-snug press ${
                          kind === d.key ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] enabled:hover:bg-foreground/[0.12] disabled:opacity-60"
                        }`}
                      >
                        <span className="block text-sm font-medium">{d.name}</span>
                        <span className={`mt-0.5 block text-xs ${kind === d.key ? "" : "text-muted"}`}>{d.note}</span>
                      </button>
                    ))}
                  </div>
                  {kind && (
                    <p className="mt-2 text-sm leading-snug" aria-live="polite">
                      {kind === e.kind ? "✓ " : `✗ Не «${G.DRIFTS.find((d) => d.key === kind)!.name}». `}
                      {e.why}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          {sorted && (
            <div className="rounded-[6px] bg-surface-raised p-4">
              <p className="font-display text-lg font-semibold">Що робити з усім знайденим?</p>
              <div className="mt-3 grid gap-1.5" role="group" aria-label="Що робити з усім знайденим">
                {actions.map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={action === k}
                    disabled={action !== null}
                    onClick={() => setAction(k)}
                    className={`rounded-md px-3 py-2 text-left text-sm font-medium leading-snug press ${
                      action === k ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] enabled:hover:bg-foreground/[0.12] disabled:opacity-60"
                    }`}
                  >
                    {G.ACTIONS[k].text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {picked && (
            <>
              <Feedback ok={!!picked.right}>
                {picked.right ? picked.why : `${picked.why} Правильний шлях — запит на зміни.`}
              </Feedback>
              <button type="button" onClick={() => onDone(foundScore + kindScore + (picked.right ? 1 : 0))} className={primary}>
                До наступного рівня
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Level 4: inspect each result by its acceptance criterion and the definition
// of done, then give the verdict.
function DemoLevel({ order, onDone }: { order: number[]; onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<G.Verdict | null>(null);
  const [score, setScore] = useState(0);
  const r = G.RESULTS[order[i]];
  const last = i === G.RESULTS.length - 1;

  const judge = (v: G.Verdict) => {
    if (pick) return;
    setPick(v);
    if (v === r.right) setScore((s) => s + 1);
  };

  return (
    <div>
      <HowTo
        goal="на демо ухвалити правильне рішення про кожен результат."
        steps={[
          "На картці три речі: критерій приймання (за чим приймає замовник), факт на демо і визначення «готово» (перевірки, які проходить кожна робота).",
          "Спершу подивіться на перевірки: якщо хоч одна не пройдена, показувати результат зарано.",
          "Якщо перевірки пройдено, порівняйте факт із критерієм. Слухайте критерій, а не настрій у кімнаті.",
          "Виберіть одне з трьох рішень. Під кожним сказано, коли воно підходить.",
        ]}
        tip="Підказка: нове побажання на демо не скасовує виконаного критерію."
      />

      <p className="mt-5 text-sm text-muted tabular-nums">
        Результат {i + 1} з {G.RESULTS.length}
      </p>
      <div className="mt-2 rounded-[6px] bg-surface-raised p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold">{r.name}</h3>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-[13px] text-muted">Критерій приймання</dt>
            <dd className="mt-0.5 leading-snug">{r.criterion}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted">Факт на демо</dt>
            <dd className="mt-0.5 leading-snug">{r.fact}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[13px] text-muted">Визначення «готово»</p>
        <ul className="mt-1 space-y-0.5 text-sm">
          {r.done.map((d) => (
            <li key={d.text} className={d.ok ? "" : "font-semibold"}>
              {d.ok ? "✓" : "✗"} {d.text}
            </li>
          ))}
        </ul>
        {r.remark && <p className="mt-3 border-l-2 border-accent pl-3 leading-snug">{r.remark}</p>}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3" role="group" aria-label="Рішення">
        {G.VERDICTS.map((v) => {
          const right = pick !== null && v.key === r.right;
          const wrong = pick === v.key && v.key !== r.right;
          return (
            <button
              key={v.key}
              type="button"
              aria-pressed={pick === v.key}
              disabled={!!pick}
              onClick={() => judge(v.key)}
              className={`flex flex-col gap-1 rounded-[6px] p-3 text-left leading-snug press ${
                right ? "bg-accent text-accent-foreground" : wrong ? "bg-foreground/[0.12]" : "bg-background hover:bg-foreground/[0.08] disabled:opacity-60"
              }`}
            >
              <span className={`font-medium ${wrong ? "line-through decoration-2" : ""}`}>{v.name}</span>
              <span className={`text-[13px] ${right ? "" : "text-muted"}`}>{v.note}</span>
            </button>
          );
        })}
      </div>

      {pick && (
        <div className="mt-5 space-y-4">
          <Feedback ok={pick === r.right}>
            {pick === r.right ? "" : `Тут правильно «${G.VERDICTS.find((v) => v.key === r.right)!.name}». `}
            {r.why}
          </Feedback>
          <button
            type="button"
            onClick={() => {
              if (last) return onDone(score);
              setI(i + 1);
              setPick(null);
            }}
            className={primary}
          >
            {last ? "Завершити демо" : "Наступний результат"}
          </button>
        </div>
      )}
    </div>
  );
}

export function ScopeGame({ nextHref }: { nextHref: string }) {
  return (
    <AssignmentGame<Orders>
      storeKey="vikha-assignment-module-07"
      title={G.TITLE}
      intro={G.INTRO}
      max={G.MAX_DIAMONDS}
      newOrders={() => ({
        ideas: shuffled(G.IDEAS.length),
        missing: shuffled(G.MISSING.length),
        build: shuffled(G.BUILD.length),
        actions: shuffled(G.ACTIONS.length),
        results: shuffled(G.RESULTS.length),
      })}
      levels={[
        { name: "Валіза", play: (o, done) => <SuitcaseLevel order={o.ideas} onDone={done} /> },
        { name: "Ножиці", play: (o, done) => <ScissorsLevel order={o.missing} onDone={done} /> },
        { name: "Знайдіть різницю", play: (o, done) => <SpotLevel build={o.build} actions={o.actions} onDone={done} /> },
        { name: "Демо", play: (o, done) => <DemoLevel order={o.results} onDone={done} /> },
      ]}
      startLabel="Почати"
      period="За гру"
      finalTitle="Сьома віха!"
      finalText="Модуль 7 пройдено. Далі — розклад: у якому порядку робити роботу і коли вийде гра."
      nextHref={nextHref}
      nextLabel="До модуля 8"
    >
      <ScopeBonus />
    </AssignmentGame>
  );
}
