"use client";

import { useState } from "react";
import { field } from "./profile-fields";

// A password field with «Показати»: people check what they typed instead of typing it twice.
export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  invalid?: boolean;
  describedBy?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative mt-1">
      <input
        id={id}
        type={shown ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={`${field} pr-24`}
      />
      <button
        type="button"
        onClick={() => setShown(!shown)}
        aria-controls={id}
        className="absolute inset-y-0 right-0 rounded-md px-3 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
      >
        {shown ? "Сховати" : "Показати"}
      </button>
    </div>
  );
}
