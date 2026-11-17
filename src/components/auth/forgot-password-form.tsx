"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { isValidEmail, safeNext } from "@/lib/auth";
import { authErrorText, callbackUrl, recalledEmail } from "@/lib/auth-client";
import { createClient } from "@/lib/supabase/client";
import { field, secondary } from "./profile-fields";

const COOLDOWN = 60;

export function ForgotPasswordForm() {
  const params = useSearchParams();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const next = safeNext(params.get("next"));

  // This form renders only in the browser (it reads the address bar), so the tab's storage is there.
  const [email, setEmail] = useState(recalledEmail);
  const [bad, setBad] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [left, setLeft] = useState(0);
  const [linkBad, setLinkBad] = useState(params.get("error") === "link");

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const address = email.trim();
  const waiting = left > 0 && sentTo === address;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setProblem(null);
    setLinkBad(false);
    const ok = isValidEmail(address);
    setBad(!ok);
    if (!ok) return;
    setSending(true);
    // The link signs the person in and opens /new-password, whatever page they came from.
    const { error } = await createClient().auth.resetPasswordForEmail(address, { redirectTo: callbackUrl("/cabinet", "recovery") });
    setSending(false);
    if (error) return setProblem(authErrorText(error, "Не вдалося надіслати лист. Спробуйте ще раз за кілька хвилин"));
    setSentTo(address);
    setLeft(COOLDOWN);
  };

  return (
    <div className="space-y-6">
      {linkBad && (
        <div role="alert" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
          <p>Посилання недійсне або застаріло. Запросіть нове</p>
          <button
            type="button"
            onClick={() => {
              setLinkBad(false);
              input.current?.focus();
            }}
            className="mt-2 font-medium underline underline-offset-4"
          >
            Надіслати нове посилання
          </button>
        </div>
      )}
      <p className="leading-relaxed">Вкажіть email акаунта, і ми надішлемо посилання, за яким можна задати новий пароль.</p>
      <form onSubmit={send} noValidate className="space-y-4">
        <div>
          <label htmlFor={id} className="block text-sm font-medium">
            Email
          </label>
          <input
            ref={input}
            id={id}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setBad(false);
            }}
            placeholder="name@example.com"
            aria-invalid={bad}
            className={`${field} mt-1`}
          />
          {bad && (
            <p role="alert" className="mt-1 text-sm">
              Вкажіть коректну email-адресу
            </p>
          )}
        </div>
        {problem && (
          <p role="alert" className="text-sm">
            {problem}
          </p>
        )}
        <button type="submit" disabled={sending || waiting} className={secondary}>
          {waiting ? `Надіслати посилання (ще ${left} с)` : "Надіслати посилання"}
        </button>
        {sentTo && (
          <p role="status" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
            Якщо акаунт з адресою {sentTo} існує, ми надіслали на неї посилання для нового пароля
          </p>
        )}
      </form>
      <p className="border-t border-border pt-6 leading-relaxed">
        Згадали пароль?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium underline underline-offset-4">
          Увійти
        </Link>
      </p>
    </div>
  );
}
