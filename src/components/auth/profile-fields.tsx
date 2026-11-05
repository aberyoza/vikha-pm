"use client";

import { useId } from "react";
import { chip } from "@/components/assignment/game-kit";
import { EXPERIENCE, GOAL_MAX, NAME_MAX, NAME_MIN, type Experience } from "@/lib/auth";

export const field =
  "w-full rounded-[4px] bg-foreground/[0.07] px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

export const NAME_ERROR = `Вкажіть ім'я (від ${NAME_MIN} символів)`;

export type ProfileDraft = { name: string; experience: Experience | null; goal: string };

// Name, experience and goal: the same fields on the first login and in the cabinet.
export function ProfileFields({ value, nameError, onChange }: { value: ProfileDraft; nameError: boolean; onChange: (v: ProfileDraft) => void }) {
  const id = useId();
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={`${id}-name`} className="block text-sm font-medium">
          Ім&apos;я
        </label>
        <input
          id={`${id}-name`}
          value={value.name}
          maxLength={NAME_MAX}
          autoComplete="name"
          aria-invalid={nameError}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className={`${field} mt-1`}
        />
        {nameError && (
          <p role="alert" className="mt-1 text-sm">
            {NAME_ERROR}
          </p>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">Досвід в управлінні проєктами (необов&apos;язково)</p>
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Досвід в управлінні проєктами">
          {EXPERIENCE.map((x) => (
            <button
              key={x.key}
              type="button"
              aria-pressed={value.experience === x.key}
              onClick={() => onChange({ ...value, experience: value.experience === x.key ? null : x.key })}
              className={chip(value.experience === x.key)}
            >
              {x.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-goal`} className="block text-sm font-medium">
          Ваша мета на курсі (необов&apos;язково)
        </label>
        <textarea
          id={`${id}-goal`}
          value={value.goal}
          maxLength={GOAL_MAX}
          rows={3}
          onChange={(e) => onChange({ ...value, goal: e.target.value })}
          className={`${field} mt-1`}
        />
        <p className="mt-1 text-[13px] text-muted tabular-nums">
          {value.goal.length} з {GOAL_MAX}
        </p>
      </div>
    </div>
  );
}
