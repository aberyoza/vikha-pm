"use client";

import { useId, useState } from "react";
import { findIdea, VALUE_STEPS, WHAT, WHO, type ValueStep } from "@/content/my-project";
import { saveProject, type MyProject } from "@/lib/my-project";

const chip = (on: boolean) =>
  `rounded-md px-3 py-1.5 text-sm font-medium press ${
    on ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
  }`;
const primary =
  "rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground press hover:brightness-110 disabled:opacity-40";
const field =
  "w-full rounded-[4px] bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

const other = <T,>(list: readonly T[], current: T) => {
  const rest = list.filter((x) => x !== current);
  return rest[Math.floor(Math.random() * rest.length)];
};

type DrumProps = {
  label: string;
  prefix?: string;
  value: string;
  locked: boolean;
  own: boolean;
  placeholder: string;
  onLock: () => void;
  onOwn: () => void;
  onChange: (v: string) => void;
};

// One drum of the slot machine: spins with the other, or holds its value.
function Drum({ label, prefix, value, locked, own, placeholder, onLock, onOwn, onChange }: DrumProps) {
  const id = useId();
  return (
    <div className="rounded-[4px] bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-muted">{label}</span>
        <div className="flex gap-1">
          {!own && (
            <button type="button" aria-pressed={locked} onClick={onLock} className={chip(locked)}>
              {locked ? "Закріплено" : "Закріпити"}
            </button>
          )}
          <button type="button" aria-pressed={own} onClick={onOwn} className={chip(own)}>
            Своє
          </button>
        </div>
      </div>
      {own ? (
        <div className="mt-2 flex items-baseline gap-2">
          {prefix && <span className="font-display text-xl font-semibold">{prefix}</span>}
          <label htmlFor={id} className="sr-only">
            {label}
          </label>
          <input
            id={id}
            autoFocus
            maxLength={60}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={field}
          />
        </div>
      ) : (
        <div className="mt-2 flex h-[4.5rem] items-center overflow-hidden">
          <span key={value} className="block animate-drum font-display text-xl font-semibold leading-tight sm:text-2xl">
            {value ? `${prefix ? `${prefix} ` : ""}${value}` : "?"}
          </span>
        </div>
      )}
    </div>
  );
}

// Milestone 1 of the reader's project: what, for whom, and the value chain.
export function ProjectBuilder({ initial, onSaved }: { initial: MyProject | null; onSaved: (p: MyProject) => void }) {
  const id = useId();
  const [step, setStep] = useState<"drums" | "value">("drums");
  const [what, setWhat] = useState(initial?.what ?? "");
  const [who, setWho] = useState(initial?.who ?? "");
  const [lock, setLock] = useState({ what: false, who: false });
  const [own, setOwn] = useState({
    what: !!initial && !(WHAT as readonly string[]).includes(initial.what),
    who: !!initial && !(WHO as readonly string[]).includes(initial.who),
  });
  const [spinning, setSpinning] = useState(false);
  // Name and value belong to one pair: a new pair starts them over.
  const [pairFor, setPairFor] = useState(initial ? `${initial.what}|${initial.who}` : "");
  const [name, setName] = useState(initial?.name ?? "");
  const [value, setValue] = useState<Record<ValueStep, string>>(
    initial?.value ?? { result: "", outcome: "", benefit: "" },
  );

  const idea = findIdea(what, who);
  const holdWhat = lock.what || own.what;
  const holdWho = lock.who || own.who;

  const spin = () => {
    if (spinning || (holdWhat && holdWho)) return;
    const endWhat = holdWhat ? what : other(WHAT, what);
    const endWho = holdWho ? who : other(WHO, who);
    const land = () => {
      setWhat(endWhat);
      setWho(endWho);
      setSpinning(false);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return land();

    // A dozen quick flips that slow down, then the drums stop on the pair.
    setSpinning(true);
    let t = 0;
    const tick = () => {
      if (++t >= 12) return land();
      if (!holdWhat) setWhat(WHAT[Math.floor(Math.random() * WHAT.length)]);
      if (!holdWho) setWho(WHO[Math.floor(Math.random() * WHO.length)]);
      setTimeout(tick, 45 + t * 14);
    };
    tick();
  };

  const toggleOwn = (k: "what" | "who") => {
    const next = !own[k];
    setOwn((o) => ({ ...o, [k]: next }));
    const list: readonly string[] = k === "what" ? WHAT : WHO;
    const set = k === "what" ? setWhat : setWho;
    // Own text starts empty; going back to the drum lands on a drum value.
    if (next) set("");
    else set(list[0]);
  };

  const toValue = () => {
    const pair = `${what.trim()}|${who.trim()}`;
    if (pair !== pairFor) {
      setPairFor(pair);
      setName(idea?.name ?? `${what.trim()} для ${who.trim()}`);
      setValue({ result: "", outcome: "", benefit: "" });
    }
    setStep("value");
  };

  const ready = name.trim() && VALUE_STEPS.every((s) => value[s.key].trim());
  const save = () => {
    // Later milestones stay when the first one is edited.
    const p: MyProject = {
      ...initial,
      version: 1,
      what: what.trim(),
      who: who.trim(),
      name: name.trim(),
      value: {
        result: value.result.trim(),
        outcome: value.outcome.trim(),
        benefit: value.benefit.trim(),
      },
      updatedAt: new Date().toISOString(),
    };
    saveProject(p);
    onSaved(p);
  };

  if (step === "drums")
    return (
      <div>
        <p className="leading-relaxed text-muted">
          Крути барабани, поки не випаде проєкт, який хочеться зробити. Смішна пара теж годиться. Можна закріпити
          барабан або вписати своє.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Drum
            label="Що"
            value={what}
            locked={lock.what}
            own={own.what}
            placeholder="Наприклад: чат підтримки"
            onLock={() => setLock((l) => ({ ...l, what: !l.what }))}
            onOwn={() => toggleOwn("what")}
            onChange={setWhat}
          />
          <Drum
            label="Для кого"
            prefix="для"
            value={who}
            locked={lock.who}
            own={own.who}
            placeholder="бабусі й дідуся"
            onLock={() => setLock((l) => ({ ...l, who: !l.who }))}
            onOwn={() => toggleOwn("who")}
            onChange={setWho}
          />
        </div>

        {what && who && !spinning && (
          <p className="mt-4 text-sm text-muted" aria-live="polite">
            {idea
              ? "Для цієї пари є готові підказки на весь курс."
              : "Незвична пара! Підказки будуть загальні, а деталі допишеш своїми словами."}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={spin}
            disabled={spinning || (holdWhat && holdWho)}
            className={what && who ? chip(false) : primary}
          >
            {what && who ? "Крутнути ще" : "Крутнути"}
          </button>
          {what.trim() && who.trim() && (
            <button type="button" onClick={toValue} disabled={spinning} className={primary}>
              Беру цей проєкт
            </button>
          )}
        </div>
      </div>
    );

  return (
    <div>
      <label htmlFor={`${id}-name`} className="font-medium">
        Назва проєкту
      </label>
      <input
        id={`${id}-name`}
        maxLength={80}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`${field} mt-2 font-display text-xl font-semibold`}
      />

      <p className="mt-6 leading-relaxed text-muted">
        Тепер ланцюжок цінності, як у другому рівні. Обери підказку і зміни її під себе або напиши своє.
      </p>
      <div className="mt-4 space-y-5">
        {VALUE_STEPS.map((s) => (
          <div key={s.key}>
            <label htmlFor={`${id}-${s.key}`} className="font-medium">
              {s.name}: <span className="font-normal text-muted">{s.ask}</span>
            </label>
            {idea && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {idea.hints[s.key].map((h) => (
                  <button
                    key={h}
                    type="button"
                    aria-pressed={value[s.key] === h}
                    onClick={() => setValue((v) => ({ ...v, [s.key]: h }))}
                    className={`${chip(value[s.key] === h)} text-left`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}
            <textarea
              id={`${id}-${s.key}`}
              rows={2}
              maxLength={200}
              value={value[s.key]}
              placeholder={s.placeholder}
              onChange={(e) => setValue((v) => ({ ...v, [s.key]: e.target.value }))}
              className={`${field} mt-2`}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!ready} className={primary}>
          Поставити віху
        </button>
        <button type="button" onClick={() => setStep("drums")} className={chip(false)}>
          Назад до барабанів
        </button>
        {!ready && <span className="text-sm text-muted">Заповни назву і всі три поля.</span>}
      </div>
    </div>
  );
}
