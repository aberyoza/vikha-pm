"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { assignmentHref } from "@/content/assignments";
import { findIdea, overloadedRoles, teamChannels } from "@/content/my-project";
import { saveProject, useMyProject, type MyProject } from "@/lib/my-project";

type Row = NonNullable<MyProject["team"]>["blocks"][number];

const MAX_ROLES = 8;

const field =
  "rounded-[4px] bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

const channelWord = (n: number) => {
  const last = n % 10;
  const teen = n % 100 >= 11 && n % 100 <= 14;
  return !teen && last === 1 ? "канал" : !teen && last >= 2 && last <= 4 ? "канали" : "каналів";
};

const roleWord = (n: number) => (n === 1 ? "роль" : n >= 2 && n <= 4 ? "ролі" : "ролей");

// The roles and a small RACI, for the bonus and the passport.
export function TeamList({ team }: { team: NonNullable<MyProject["team"]> }) {
  const channels = teamChannels(team.roles.length);
  const overloaded = overloadedRoles(team.blocks);
  return (
    <div className="mt-3">
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-[13px] text-muted">Ролі</dt>
          <dd className="mt-0.5 leading-snug">{team.roles.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Комунікація</dt>
          <dd className="mt-0.5 leading-snug tabular-nums">
            {channels} {channelWord(channels)}
          </dd>
        </div>
      </dl>
      <div className="-mx-1 mt-3 overflow-x-auto px-1">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="text-[13px] text-muted">
            <tr className="border-b border-border">
              <th scope="col" className="py-1.5 pr-3 font-normal">Блок роботи</th>
              <th scope="col" className="py-1.5 pr-3 font-normal">Робить (R)</th>
              <th scope="col" className="py-1.5 font-normal">Відповідає (A)</th>
            </tr>
          </thead>
          <tbody>
            {team.blocks.map((b) => (
              <tr key={b.name} className="border-b border-border">
                <td className="py-1.5 pr-3 leading-snug">{b.name}</td>
                <td className="py-1.5 pr-3 leading-snug">{b.r}</td>
                <td className="py-1.5 leading-snug">{b.a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {overloaded.length > 0 && (
        <p className="mt-2 text-sm leading-snug text-muted">Забагато роботи в однієї ролі: {overloaded.join(", ")}.</p>
      )}
    </div>
  );
}

function PersonChips({
  label,
  roles,
  value,
  onPick,
}: {
  label: string;
  roles: string[];
  value: string;
  onPick: (role: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5" role="group" aria-label={label}>
      {roles.map((r) => (
        <button key={r} type="button" aria-pressed={value === r} onClick={() => onPick(r)} className={chip(value === r)}>
          {r}
        </button>
      ))}
    </div>
  );
}

// Milestone 9 of the reader's project: the roles, who does each block of work
// and who answers for it.
export function TeamEditor({ project, onSaved }: { project: MyProject; onSaved: () => void }) {
  const id = useId();
  const idea = findIdea(project.what, project.who);
  const saved = project.team;
  const blocks = project.scope?.blocks ?? idea?.scope.blocks ?? [];
  const ideaRoles = idea?.team.roles ?? ["Я"];
  const hints = [...new Set([...ideaRoles, ...(project.people ?? []).map((p) => p.name)])];

  const [roles, setRoles] = useState<string[]>(saved?.roles ?? ideaRoles);
  const [rows, setRows] = useState<Row[]>(
    blocks.map((name) => {
      const old = saved?.blocks.find((b) => b.name === name);
      if (old) return old;
      const k = idea?.scope.blocks.indexOf(name) ?? -1;
      return k >= 0 ? { name, r: idea!.team.raci[k][0], a: idea!.team.raci[k][1] } : { name, r: "", a: "" };
    }),
  );
  const [extra, setExtra] = useState("");

  const ready = roles.length > 0 && rows.length > 0 && rows.every((r) => roles.includes(r.r) && roles.includes(r.a));
  const channels = teamChannels(roles.length);
  const overloaded = overloadedRoles(rows.filter((r) => r.r));

  const clear = (role: string) => setRows((rs) => rs.map((r) => ({ ...r, r: r.r === role ? "" : r.r, a: r.a === role ? "" : r.a })));
  const toggle = (role: string) => {
    if (roles.includes(role)) {
      setRoles((rs) => rs.filter((v) => v !== role));
      clear(role);
    } else if (roles.length < MAX_ROLES) {
      setRoles((rs) => [...rs, role]);
    }
  };
  const add = () => {
    const name = extra.trim();
    if (!name || roles.includes(name) || roles.length >= MAX_ROLES) return;
    setRoles((rs) => [...rs, name]);
    setExtra("");
  };
  const setCell = (k: number, field: "r" | "a", role: string) => setRows((rs) => rs.map((r, j) => (j === k ? { ...r, [field]: role } : r)));
  const save = () => {
    if (!ready) return;
    saveProject({ ...project, team: { roles, blocks: rows }, updatedAt: new Date().toISOString() });
    onSaved();
  };

  return (
    <div>
      <p className="leading-relaxed text-muted">
        Хто робитиме «{project.name}»? Позначте ролі, а потім для кожного блоку роботи виберіть, хто його робить і хто відповідає за
        результат. Відповідальний на кожен блок лише один.
        {idea && !saved && " Для вашої ідеї все вже заповнено. Змініть, якщо у вас інакше."}
      </p>

      {blocks.length === 0 ? (
        <div className="mt-5">
          <p className="leading-relaxed">Спершу потрібні блоки роботи: їх складають у завданні модуля 7.</p>
          <Link href={assignmentHref("module-07")} className={`${primary} mt-3 inline-block`}>
            До завдання модуля 7
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-5 space-y-5">
            <div>
              <p className="font-medium">
                Ролі: <span className="font-normal text-muted">хто потрібен, включно з вами</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Ролі">
                {[...new Set([...hints, ...roles])].map((h) => (
                  <button key={h} type="button" aria-pressed={roles.includes(h)} onClick={() => toggle(h)} className={chip(roles.includes(h))}>
                    {h}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <label htmlFor={`${id}-extra`} className="sr-only">
                  Додати свою роль
                </label>
                <input
                  id={`${id}-extra`}
                  value={extra}
                  maxLength={40}
                  placeholder="Додати свою роль"
                  onChange={(e) => setExtra(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && add()}
                  className={`${field} min-w-0 flex-1`}
                />
                <button type="button" onClick={add} disabled={!extra.trim() || roles.length >= MAX_ROLES} className={`${chip(false)} disabled:opacity-40`}>
                  Додати
                </button>
              </div>
              <p className="mt-2 text-sm text-muted tabular-nums">
                {roles.length} {roleWord(roles.length)}: {channels} {channelWord(channels)} комунікації.
              </p>
            </div>

            <ul className="space-y-2">
              {rows.map((r, k) => (
                <li key={r.name} className="rounded-[6px] bg-background p-3">
                  <p className="font-medium leading-snug">{r.name}</p>
                  <p className="mt-2 text-[13px] text-muted">Хто робить (R)</p>
                  <PersonChips label={`Хто робить: ${r.name}`} roles={roles} value={r.r} onPick={(v) => setCell(k, "r", v)} />
                  <p className="mt-2 text-[13px] text-muted">Хто відповідає (A)</p>
                  <PersonChips label={`Хто відповідає: ${r.name}`} roles={roles} value={r.a} onPick={(v) => setCell(k, "a", v)} />
                </li>
              ))}
            </ul>
          </div>

          {overloaded.length > 0 && (
            <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
              <strong>Забагато роботи в однієї ролі:</strong> {overloaded.join(", ")}. Подумайте, що можна віддати іншим або купити.
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={save} disabled={!ready} className={primary}>
              Поставити віху
            </button>
            {!ready && <span className="text-sm text-muted">Кожен блок має мати того, хто робить, і того, хто відповідає.</span>}
          </div>
        </>
      )}
    </div>
  );
}

// End of the module 10 game: the ninth milestone of the own project.
export function TeamBonus() {
  const project = useMyProject();
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {!project ? (
        <>
          <p className="font-medium">Бонус: дев&apos;ята віха вашого проєкту</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Тут вирішують, хто робитиме ваш власний проєкт. Але спершу його треба зібрати: це хвилина наприкінці гри модуля 1.
          </p>
          <Link href={assignmentHref("module-01")} className={`${primary} mt-4 inline-block`}>
            Зібрати проєкт у модулі 1
          </Link>
        </>
      ) : editing || !project.team ? (
        <>
          <p className="text-[13px] text-muted">Дев&apos;ята віха вашого проєкту</p>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Хто потрібен у команді</h3>
          <TeamEditor project={project} onSaved={() => setEditing(false)} />
        </>
      ) : (
        <>
          <p className="text-[13px] text-muted">{project.name}</p>
          <p className="mt-0.5 font-display text-xl font-semibold">Хто потрібен у команді</p>
          <TeamList team={project.team} />
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
            Дев&apos;ята віха поставлена. Наступну додасте в завданні модуля 11: три головні ризики.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/my-project" className={chip(false)}>
              Паспорт проєкту
            </Link>
            <button type="button" onClick={() => setEditing(true)} className={chip(false)}>
              Змінити
            </button>
          </div>
        </>
      )}
    </div>
  );
}
