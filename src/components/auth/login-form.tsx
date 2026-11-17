"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { primary } from "@/components/assignment/game-kit";
import { isValidEmail, safeNext } from "@/lib/auth";
import { authErrorText, callbackUrl, rememberEmail } from "@/lib/auth-client";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/use-session";
import { PasswordInput } from "./password-input";
import { field, secondary } from "./profile-fields";

const COOLDOWN = 60;
const EMAIL_ERROR = "Вкажіть коректну email-адресу";

// A password sign-in stays on this page, so it leaves with a full load like Google
// and the letter do: the header, the sync and paid lessons then see the new session.
async function leaveSignedIn(userId: string, next: string) {
  const { data: profile } = await createClient().from("profiles").select("id").eq("id", userId).maybeSingle();
  window.location.assign(profile ? next : `/welcome?next=${encodeURIComponent(next)}`);
}

export function GoogleButton({ next, label }: { next: string; label: string }) {
  const [failed, setFailed] = useState(false);
  const google = async () => {
    setFailed(false);
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callbackUrl(next, "google") } });
    if (error) setFailed(true);
  };
  return (
    <div className="space-y-3">
      <button type="button" onClick={google} className={`${primary} w-full`}>
        {label}
      </button>
      {failed && (
        <p role="alert" className="text-sm">
          Не вдалося відкрити вхід через Google. Спробуйте ще раз
        </p>
      )}
    </div>
  );
}

export function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const user = useSession();
  const id = useId();
  const emailInput = useRef<HTMLInputElement>(null);
  const leaving = useRef(false);
  const next = safeNext(params.get("next"));
  const error = params.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailBad, setEmailBad] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [resent, setResent] = useState(false);

  const [sentTo, setSentTo] = useState<string | null>(null);
  const [left, setLeft] = useState(0);
  const [sending, setSending] = useState(false);
  const [linkProblem, setLinkProblem] = useState<string | null>(null);

  const [notice, setNotice] = useState(error === "google" || error === "link" || error === "signup" ? error : null);

  useEffect(() => {
    // Someone already signed in has nothing to do here; a fresh password sign-in routes itself.
    if (user && !leaving.current) router.replace("/cabinet");
  }, [user, router]);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const address = email.trim();
  const waiting = left > 0 && sentTo === address;

  const clearMessages = () => {
    setNotice(null);
    setProblem(null);
    setUnconfirmed(false);
    setResent(false);
    setLinkProblem(null);
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    const okEmail = isValidEmail(address);
    setEmailBad(!okEmail);
    if (!okEmail) return;
    if (!password) return setProblem("Введіть пароль");
    setSigningIn(true);
    leaving.current = true;
    const { data, error } = await createClient().auth.signInWithPassword({ email: address, password });
    if (error || !data.user) {
      leaving.current = false;
      setSigningIn(false);
      if (error?.code === "email_not_confirmed") return setUnconfirmed(true);
      return setProblem(error ? authErrorText(error, "Не вдалося увійти. Спробуйте ще раз за кілька хвилин") : "Не вдалося увійти. Спробуйте ще раз за кілька хвилин");
    }
    await leaveSignedIn(data.user.id, next);
  };

  const resendConfirmation = async () => {
    setProblem(null);
    const { error } = await createClient().auth.resend({ type: "signup", email: address, options: { emailRedirectTo: callbackUrl(next, "signup") } });
    if (error) return setProblem(authErrorText(error, "Не вдалося надіслати лист. Спробуйте ще раз за кілька хвилин"));
    setResent(true);
  };

  const sendLink = async () => {
    clearMessages();
    const okEmail = isValidEmail(address);
    setEmailBad(!okEmail);
    if (!okEmail) return emailInput.current?.focus();
    setSending(true);
    const { error } = await createClient().auth.signInWithOtp({ email: address, options: { emailRedirectTo: callbackUrl(next, "email") } });
    setSending(false);
    if (error) return setLinkProblem(error.status === 429 ? "Зачекайте хвилину і спробуйте ще раз" : "Не вдалося надіслати лист. Спробуйте ще раз за кілька хвилин");
    setSentTo(address);
    setLeft(COOLDOWN);
  };

  return (
    <div className="space-y-6">
      {notice === "google" && (
        <p role="alert" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
          Вхід через Google не завершено. Спробуйте ще раз
        </p>
      )}
      {notice === "signup" && (
        <p role="alert" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
          Посилання недійсне або застаріло. Якщо ви вже підтвердили пошту, увійдіть з паролем
        </p>
      )}
      {notice === "link" && (
        <div role="alert" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
          <p>Посилання недійсне. Запросіть нове</p>
          <button
            type="button"
            onClick={() => {
              setNotice(null);
              emailInput.current?.focus();
            }}
            className="mt-2 font-medium underline underline-offset-4"
          >
            Надіслати ще раз
          </button>
        </div>
      )}

      <GoogleButton next={next} label="Увійти через Google" />

      <form onSubmit={signIn} noValidate className="space-y-4 border-t border-border pt-6">
        <div>
          <label htmlFor={`${id}-email`} className="block text-sm font-medium">
            Email
          </label>
          <input
            ref={emailInput}
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailBad(false);
            }}
            placeholder="name@example.com"
            aria-invalid={emailBad}
            aria-describedby={emailBad ? `${id}-email-error` : undefined}
            className={`${field} mt-1`}
          />
          {emailBad && (
            <p id={`${id}-email-error`} role="alert" className="mt-1 text-sm">
              {EMAIL_ERROR}
            </p>
          )}
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={`${id}-password`} className="block text-sm font-medium">
              Пароль
            </label>
            <Link href={`/forgot-password?next=${encodeURIComponent(next)}`} onClick={() => rememberEmail(email)} className="text-sm underline underline-offset-4">
              Забули пароль?
            </Link>
          </div>
          <PasswordInput id={`${id}-password`} value={password} onChange={setPassword} autoComplete="current-password" invalid={!!problem} />
        </div>
        {problem && (
          <p role="alert" className="text-sm">
            {problem}
          </p>
        )}
        {unconfirmed && (
          <div role="alert" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
            <p>Підтвердьте email: перейдіть за посиланням у листі, який ми надіслали після реєстрації</p>
            {resent ? (
              <p role="status" className="mt-2 font-medium">
                Надіслали лист ще раз на {address}
              </p>
            ) : (
              <button type="button" onClick={resendConfirmation} className="mt-2 font-medium underline underline-offset-4">
                Надіслати лист ще раз
              </button>
            )}
          </div>
        )}
        <button type="submit" disabled={signingIn} className={secondary}>
          Увійти
        </button>
      </form>

      <div className="space-y-3">
        <p className="leading-relaxed text-muted">Без пароля: надішлемо посилання для входу на цей email</p>
        <button type="button" onClick={sendLink} disabled={sending || waiting} className={secondary}>
          {waiting ? `Надіслати посилання для входу (ще ${left} с)` : "Надіслати посилання для входу"}
        </button>
        {linkProblem && (
          <p role="alert" className="text-sm">
            {linkProblem}
          </p>
        )}
        {sentTo && (
          <p role="status" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
            Перевірте пошту: ми надіслали посилання для входу на {sentTo}
          </p>
        )}
      </div>

      <p className="border-t border-border pt-6 leading-relaxed">
        Ще не маєте акаунта?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-medium underline underline-offset-4">
          Зареєструватися
        </Link>
      </p>
    </div>
  );
}
