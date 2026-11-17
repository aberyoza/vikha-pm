"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { isValidEmail, isValidPassword, PASSWORD_ERROR, PASSWORD_MIN, safeNext } from "@/lib/auth";
import { authErrorText, callbackUrl } from "@/lib/auth-client";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/use-session";
import { GoogleButton } from "./login-form";
import { PasswordInput } from "./password-input";
import { field, secondary } from "./profile-fields";

export function SignupForm() {
  const params = useSearchParams();
  const router = useRouter();
  const user = useSession();
  const id = useId();
  const leaving = useRef(false);
  const next = safeNext(params.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailBad, setEmailBad] = useState(false);
  const [passwordBad, setPasswordBad] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    if (user && !leaving.current) router.replace("/cabinet");
  }, [user, router]);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setProblem(null);
    const address = email.trim();
    const okEmail = isValidEmail(address);
    const okPassword = isValidPassword(password);
    setEmailBad(!okEmail);
    setPasswordBad(!okPassword);
    if (!okEmail || !okPassword) return;
    setSending(true);
    leaving.current = true;
    const { data, error } = await createClient().auth.signUp({ email: address, password, options: { emailRedirectTo: callbackUrl(next, "signup") } });
    if (error) {
      leaving.current = false;
      setSending(false);
      if (error.code === "weak_password") return setPasswordBad(true);
      return setProblem(authErrorText(error, "Не вдалося зареєструватися. Спробуйте ще раз за кілька хвилин"));
    }
    // Only when Supabase stops asking to confirm the address: the account is ready at once.
    if (data.session) {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      return window.location.assign(`/welcome?next=${encodeURIComponent(next)}`);
    }
    leaving.current = false;
    setSending(false);
    // The same answer for a new and a taken address, so the form doesn't reveal who is registered.
    setSentTo(address);
  };

  if (sentTo) {
    return (
      <div role="status" className="space-y-3 rounded-[4px] bg-accent-soft p-4 leading-relaxed">
        <p className="font-medium">Перевірте пошту: ми надіслали лист для підтвердження на {sentTo}</p>
        <p>Перейдіть за посиланням у листі, щоб завершити реєстрацію. Посилання діє одну годину.</p>
        <p>
          Якщо ви вже маєте акаунт з цією адресою, лист не прийде: увійдіть як раніше або скористайтеся{" "}
          <Link href={`/forgot-password?next=${encodeURIComponent(next)}`} className="underline underline-offset-4">
            «Забули пароль?»
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoogleButton next={next} label="Продовжити через Google" />

      <form onSubmit={signUp} noValidate className="space-y-4 border-t border-border pt-6">
        <div>
          <label htmlFor={`${id}-email`} className="block text-sm font-medium">
            Email
          </label>
          <input
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
              Вкажіть коректну email-адресу
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-password`} className="block text-sm font-medium">
            Пароль
          </label>
          <PasswordInput
            id={`${id}-password`}
            value={password}
            onChange={(v) => {
              setPassword(v);
              setPasswordBad(false);
            }}
            autoComplete="new-password"
            invalid={passwordBad}
            describedBy={`${id}-password-hint`}
          />
          <p id={`${id}-password-hint`} role={passwordBad ? "alert" : undefined} className={`mt-1 text-sm ${passwordBad ? "" : "text-muted"}`}>
            {passwordBad ? PASSWORD_ERROR : `Щонайменше ${PASSWORD_MIN} символів`}
          </p>
        </div>
        {problem && (
          <p role="alert" className="text-sm">
            {problem}
          </p>
        )}
        <button type="submit" disabled={sending} className={secondary}>
          Зареєструватися
        </button>
      </form>

      <p className="border-t border-border pt-6 leading-relaxed">
        Уже маєте акаунт?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium underline underline-offset-4">
          Увійти
        </Link>
      </p>
    </div>
  );
}
