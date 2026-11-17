"use client";

import { useId, useState } from "react";
import { primary } from "@/components/assignment/game-kit";
import { isValidPassword, PASSWORD_ERROR, PASSWORD_MIN } from "@/lib/auth";
import { authErrorText } from "@/lib/auth-client";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "./password-input";
import { field } from "./profile-fields";

const FAILED = "Не вдалося зберегти пароль. Спробуйте ще раз";

// Sets or changes the password of whoever is signed in. Supabase asks for a code
// from a letter when the sign-in is more than a day old (Secure password change).
export function PasswordForm({ email, onSaved }: { email: string; onSaved?: () => void }) {
  const id = useId();
  const [password, setPassword] = useState("");
  const [bad, setBad] = useState(false);
  const [needsCode, setNeedsCode] = useState(false);
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [codeProblem, setCodeProblem] = useState<string | null>(null);
  const [codeResent, setCodeResent] = useState(false);
  const [saved, setSaved] = useState(false);

  const sendCode = async () => {
    const { error } = await createClient().auth.reauthenticate();
    if (error) {
      setProblem(authErrorText(error, "Не вдалося надіслати код. Спробуйте ще раз за кілька хвилин"));
      return false;
    }
    return true;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setProblem(null);
    setCodeProblem(null);
    setCodeResent(false);
    setSaved(false);
    const ok = isValidPassword(password);
    setBad(!ok);
    if (!ok) return;
    if (needsCode && !code.trim()) return setCodeProblem("Введіть код із листа");
    setSaving(true);
    const { error } = await createClient().auth.updateUser(needsCode ? { password, nonce: code.trim() } : { password });
    if (!error) {
      setSaving(false);
      setPassword("");
      setCode("");
      setNeedsCode(false);
      setSaved(true);
      return onSaved?.();
    }
    if (error.code === "reauthentication_needed") {
      if (await sendCode()) setNeedsCode(true);
    } else if (error.code === "weak_password") {
      setBad(true);
    } else if (needsCode && (error.code === "reauthentication_not_valid" || error.code === "otp_expired")) {
      setCodeProblem(authErrorText(error));
    } else {
      setProblem(authErrorText(error, FAILED));
    }
    setSaving(false);
  };

  const resendCode = async () => {
    setCodeProblem(null);
    setProblem(null);
    if (await sendCode()) setCodeResent(true);
  };

  return (
    <form onSubmit={save} noValidate className="space-y-4">
      <div>
        <label htmlFor={`${id}-password`} className="block text-sm font-medium">
          Новий пароль
        </label>
        <PasswordInput
          id={`${id}-password`}
          value={password}
          onChange={(v) => {
            setPassword(v);
            setBad(false);
            setSaved(false);
          }}
          autoComplete="new-password"
          invalid={bad}
          describedBy={`${id}-hint`}
        />
        <p id={`${id}-hint`} role={bad ? "alert" : undefined} className={`mt-1 text-sm ${bad ? "" : "text-muted"}`}>
          {bad ? PASSWORD_ERROR : `Щонайменше ${PASSWORD_MIN} символів`}
        </p>
      </div>
      {needsCode && (
        <div className="rounded-[4px] bg-accent-soft p-3">
          <p role="status" className="leading-relaxed">
            Ви входили понад добу тому. Ми надіслали код на {email}: введіть його, щоб зберегти пароль
          </p>
          <label htmlFor={`${id}-code`} className="mt-3 block text-sm font-medium">
            Код із листа
          </label>
          <input
            id={`${id}-code`}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setCodeProblem(null);
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-invalid={!!codeProblem}
            className={`${field} mt-1 block max-w-[12rem] tabular-nums`}
          />
          {codeProblem && (
            <p role="alert" className="mt-1 text-sm">
              {codeProblem}
            </p>
          )}
          {codeResent ? (
            <p role="status" className="mt-2 text-sm font-medium">
              Надіслали новий код на {email}
            </p>
          ) : (
            <button type="button" onClick={resendCode} className="mt-2 block text-sm font-medium underline underline-offset-4">
              Надіслати код ще раз
            </button>
          )}
        </div>
      )}
      {problem && (
        <p role="alert" className="text-sm">
          {problem}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving} className={primary}>
          Зберегти пароль
        </button>
        {saved && !onSaved && <span role="status">Пароль збережено</span>}
      </div>
    </form>
  );
}
