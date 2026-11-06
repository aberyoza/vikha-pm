"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { ButtonLink } from "@/components/ui";
import { publishedModules } from "@/content/course";
import { CONTACT_EMAIL } from "@/content/site";
import { OFFER_VERSION, type AccessStatus, type PaymentDetails } from "@/lib/access";
import { COURSE_PRICE_UAH, FIRST_PAID_MODULE } from "@/lib/paywall";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/use-session";

type Access = { status: AccessStatus; payment_claimed_at: string | null } | null;

const price = `${COURSE_PRICE_UAH.toLocaleString("uk-UA")} грн`;
const firstPaid = publishedModules.find((m) => m.number === FIRST_PAID_MODULE);
const firstPaidHref = firstPaid ? `/modules/${firstPaid.slug}/${firstPaid.lessons[0].slug}` : "/#program";

const mail = (
  <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
    {CONTACT_EMAIL}
  </a>
);

function Terms() {
  return (
    <>
      <p className="text-lg leading-relaxed">
        Модулі 1–{FIRST_PAID_MODULE - 1} відкриті для всіх. Модулі {FIRST_PAID_MODULE}–14 відкриваються після разової оплати{" "}
        {price}, і доступ лишається назавжди.
      </p>
      <h2 className="mt-8 font-display text-2xl font-semibold tracking-tight">Як це працює</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>Ви отримуєте реквізити й особистий код.</li>
        <li>Переказуєте {price} на рахунок ФОП і вказуєте код у призначенні платежу.</li>
        <li>Натискаєте «Я оплатив».</li>
        <li>Автор звіряє переказ і відкриває доступ, зазвичай протягом доби. Про це прийде лист.</li>
      </ol>
      <p className="mt-4 leading-relaxed text-muted">
        Протягом 14 днів після оплати гроші можна повернути без пояснень: напишіть на {mail}.
      </p>
    </>
  );
}

function Request({ revoked, onDone }: { revoked: boolean; onDone: () => void }) {
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const request = async () => {
    if (!agreed) return;
    setBusy(true);
    setFailed(false);
    const { error } = await createClient().rpc("request_course_access", { offer_version: OFFER_VERSION });
    setBusy(false);
    if (error) return setFailed(true);
    onDone();
  };

  return (
    <>
      {revoked && (
        <p className="mb-6 rounded-[4px] bg-surface p-4 leading-relaxed">
          Доступ до модулів {FIRST_PAID_MODULE}–14 закрито. Якщо це помилка, напишіть на {mail}.
        </p>
      )}
      <Terms />
      <label className="mt-6 flex items-start gap-3 leading-relaxed">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1.5 size-4 accent-[var(--accent)]" />
        <span>
          Погоджуюсь з умовами{" "}
          <Link href="/offer" target="_blank" className="underline underline-offset-4">
            договору оферти
          </Link>
        </span>
      </label>
      <button type="button" onClick={request} disabled={!agreed || busy} className={`${primary} mt-4`}>
        Отримати реквізити
      </button>
      {failed && (
        <p role="alert" className="mt-3 text-sm">
          Не вдалося створити запит. Спробуйте ще раз
        </p>
      )}
    </>
  );
}

function CopyRow({ label, value, copy = value }: { label: string; value: string; copy?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard access: the value is on screen to select by hand.
    }
  };
  return (
    <div className="py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 flex items-start justify-between gap-3">
        <span className="min-w-0 font-medium tabular-nums [overflow-wrap:anywhere]">{value}</span>
        <button type="button" onClick={onCopy} className={`${chip(false)} shrink-0`}>
          {copied ? "Скопійовано" : "Копіювати"}
        </button>
      </dd>
    </div>
  );
}

// Groups of four, as banks print it; the copy has no spaces.
const groupIban = (iban: string) => iban.replace(/\s/g, "").replace(/(.{4})(?=.)/g, "$1 ");

function Pending({ claimed, onClaimed }: { claimed: boolean; onClaimed: () => void }) {
  const [details, setDetails] = useState<PaymentDetails | "missing" | "failed" | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/access/details")
      .then(async (r) => (r.ok ? setDetails((await r.json()) as PaymentDetails) : setDetails(r.status === 503 ? "missing" : "failed")))
      .catch(() => setDetails("failed"));
  }, []);

  const claim = async () => {
    setBusy(true);
    setFailed(false);
    const response = await fetch("/api/access/claim", { method: "POST" }).catch(() => null);
    setBusy(false);
    if (!response?.ok) return setFailed(true);
    onClaimed();
  };

  return (
    <>
      <h2 className="font-display text-2xl font-semibold tracking-tight">Реквізити для оплати</h2>
      {details === null && <p className="mt-3 text-muted">Завантажуємо…</p>}
      {details === "missing" && <p className="mt-3 leading-relaxed">Реквізити ще не додані. Напишіть на {mail}, і автор надішле їх.</p>}
      {details === "failed" && <p role="alert" className="mt-3">Не вдалося завантажити реквізити. Оновіть сторінку</p>}
      {typeof details === "object" && details && (
        <>
          <dl className="mt-3 rounded-[4px] bg-surface px-4 py-1">
            <CopyRow label="Отримувач" value={details.recipient} />
            <CopyRow label="IBAN" value={groupIban(details.iban)} copy={details.iban.replace(/\s/g, "")} />
            <CopyRow label="Код отримувача" value={details.taxId} />
            <CopyRow label="Сума" value={details.amount} copy={String(COURSE_PRICE_UAH)} />
            <CopyRow label="Призначення платежу" value={details.purpose} />
          </dl>
          <p className="mt-3 leading-relaxed text-muted">Код у призначенні платежу допомагає знайти ваш переказ серед інших.</p>
        </>
      )}
      <div className="mt-8">
        {claimed ? (
          <p role="status" className="rounded-[4px] bg-accent-soft p-4 leading-relaxed">
            Дякуємо! Автор звірить переказ і відкриє доступ, зазвичай протягом доби. Про це прийде лист.
          </p>
        ) : (
          <>
            <button type="button" onClick={claim} disabled={busy || typeof details !== "object" || !details} className={primary}>
              Я оплатив
            </button>
            {failed && (
              <p role="alert" className="mt-3 text-sm">
                Не вдалося надіслати. Спробуйте ще раз
              </p>
            )}
          </>
        )}
      </div>
      <div className="mt-10 border-t border-border pt-6">
        <Terms />
      </div>
    </>
  );
}

// Static shell: who is here is decided in the browser, and the database guards the data.
export function AccessPanel() {
  const router = useRouter();
  const session = useSession();
  const [access, setAccess] = useState<Access | undefined>(undefined);

  const fetchAccess = useCallback(async (): Promise<Access | undefined> => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      await supabase.auth.signOut({ scope: "local" });
      router.replace("/login?next=/access");
      return undefined;
    }
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", data.user.id).maybeSingle();
    if (!profile) {
      router.replace("/welcome?next=/access");
      return undefined;
    }
    const { data: row } = await supabase
      .from("course_access")
      .select("status, payment_claimed_at")
      .eq("user_id", data.user.id)
      .order("requested_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (row as Access) ?? null;
  }, [router]);
  const load = useCallback(async () => setAccess(await fetchAccess()), [fetchAccess]);

  useEffect(() => {
    if (session) fetchAccess().then(setAccess);
  }, [session, fetchAccess]);

  if (session === undefined) return <p className="text-muted">Завантажуємо…</p>;
  if (session === null) {
    return (
      <>
        <Terms />
        <p className="mt-6 leading-relaxed">Щоб отримати реквізити, увійдіть: доступ відкривається у вашому акаунті.</p>
        <ButtonLink href="/login?next=/access" className="mt-4">
          Увійти
        </ButtonLink>
      </>
    );
  }
  if (access === undefined) return <p className="text-muted">Завантажуємо…</p>;
  if (access?.status === "approved") {
    return (
      <>
        <p role="status" className="text-lg leading-relaxed">
          Доступ відкрито. Модулі {FIRST_PAID_MODULE}–14 чекають на вас.
        </p>
        <ButtonLink href={firstPaidHref} className="mt-6">
          Перейти до модуля {FIRST_PAID_MODULE}
        </ButtonLink>
      </>
    );
  }
  if (access?.status === "pending") {
    return (
      <Pending
        claimed={!!access.payment_claimed_at}
        onClaimed={() => setAccess({ status: "pending", payment_claimed_at: new Date().toISOString() })}
      />
    );
  }
  return <Request revoked={access?.status === "revoked"} onDone={load} />;
}
