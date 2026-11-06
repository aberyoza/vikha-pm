"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AccessStatus as Status } from "@/lib/access";
import { FIRST_PAID_MODULE } from "@/lib/paywall";
import { createClient } from "@/lib/supabase/client";

// The student sees whether access is open, never the basis it was given on.
export function AccessStatus({ userId }: { userId: string }) {
  const [row, setRow] = useState<{ status: Status; payment_claimed_at: string | null } | null | undefined>(undefined);

  useEffect(() => {
    createClient()
      .from("course_access")
      .select("status, payment_claimed_at")
      .eq("user_id", userId)
      .order("requested_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setRow(data ?? null));
  }, [userId]);

  if (row === undefined) return null;
  const text =
    row?.status === "approved"
      ? "Відкрито."
      : row?.status === "pending"
        ? row.payment_claimed_at
          ? "Автор звіряє вашу оплату."
          : "Чекаємо на оплату."
        : "Відкривається після оплати.";
  return (
    <section className="mt-12 border-t border-border pt-6">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Модулі {FIRST_PAID_MODULE}–14</h2>
      <p className="mt-2 leading-relaxed">
        {text}{" "}
        {row?.status !== "approved" && (
          <Link href="/access" className="underline underline-offset-4">
            {row?.status === "pending" ? "Реквізити й деталі" : "Отримати доступ"}
          </Link>
        )}
      </p>
    </section>
  );
}
