"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { primary } from "@/components/assignment/game-kit";
import { isValidEmail, safeNext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/use-session";
import { field } from "./profile-fields";

const COOLDOWN = 60;

const callback = (next: string, via: "google" | "email") =>
  `${window.location.origin}/auth/callback?via=${via}&next=${encodeURIComponent(next)}`;

export function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const user = useSession();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const next = safeNext(params.get("next"));

  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [left, setLeft] = useState(0);
  const [sending, setSending] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [linkBad, setLinkBad] = useState(params.get("error") === "link");
  const [googleBad, setGoogleBad] = useState(params.get("error") === "google");

  useEffect(() => {
    if (user) router.replace("/cabinet");
  }, [user, router]);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const waiting = left > 0 && sentTo === email.trim();

  const google = async () => {
    setGoogleBad(false);
    setProblem(null);
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback(next, "google") } });
    if (error) setGoogleBad(true);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkBad(false);
    setProblem(null);
    const address = email.trim();
    if (!isValidEmail(address)) return setProblem("Вкажіть коректну email-адресу");
    setSending(true);
    const { error } = await createClient().auth.signInWithOtp({ email: address, options: { emailRedirectTo: callback(next, "email") } });
    setSending(false);
    if (error) return setProblem(error.status === 429 ? "Зачекайте хвилину і спробуйте ще раз" : "Не вдалося надіслати лист. Спробуйте ще раз за кілька хвилин");
    setSentTo(address);
    setLeft(COOLDOWN);
  };

  return (
    <div className="space-y-6">
      {googleBad && (
        <p role="alert" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
          Вхід через Google не завершено. Спробуйте ще раз
        </p>
      )}
      {linkBad && (
        <div role="alert" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
          <p>Посилання недійсне. Запросіть нове</p>
          <button
            type="button"
            onClick={() => {
              setLinkBad(false);
              input.current?.focus();
            }}
            className="mt-2 font-medium underline underline-offset-4"
          >
            Надіслати ще раз
          </button>
        </div>
      )}

      <button type="button" onClick={google} className={`${primary} w-full`}>
        Увійти через Google
      </button>

      <form onSubmit={send} noValidate className="space-y-3 border-t border-border pt-6">
        <label htmlFor={id} className="block text-sm font-medium">
          Або отримайте посилання для входу на email
        </label>
        <input
          ref={input}
          id={id}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          aria-invalid={!!problem}
          className={field}
        />
        {problem && (
          <p role="alert" className="text-sm">
            {problem}
          </p>
        )}
        <button type="submit" disabled={sending || waiting} className="w-full rounded-md bg-foreground/[0.07] px-5 py-2.5 font-semibold press enabled:hover:bg-foreground/[0.12] disabled:opacity-60">
          {waiting ? `Надіслати посилання (ще ${left} с)` : "Надіслати посилання"}
        </button>
        {sentTo && (
          <p role="status" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
            Перевірте пошту: ми надіслали посилання для входу на {sentTo}
          </p>
        )}
      </form>
    </div>
  );
}
