import { NextResponse, type NextRequest } from "next/server";
import { CONTACT_EMAIL, SITE_URL } from "@/content/site";
import { isSameOrigin } from "@/lib/api-guard";
import { authEnabled } from "@/lib/auth";
import { COURSE_PRICE_UAH, paywallEnabled } from "@/lib/paywall";
import { escapeHtml, sendEmail } from "@/lib/send-email";
import { createClient } from "@/lib/supabase/server";

// The student says the transfer is done. The author gets one letter per request.
export async function POST(request: NextRequest) {
  if (!authEnabled || !paywallEnabled) return new NextResponse(null, { status: 404 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "not_signed_in" }, { status: 401 });

  const { data: code, error } = await supabase.rpc("claim_course_payment");
  if (error) return NextResponse.json({ error: "not_saved" }, { status: 500 });

  if (typeof code === "string") {
    const { data: profile } = await supabase.from("profiles").select("name").eq("id", auth.user.id).maybeSingle();
    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `Оплата курсу: ${code}`,
      html: `<p>${escapeHtml(profile?.name ?? "Учень")} (${escapeHtml(auth.user.email ?? "без email")}) повідомляє, що переказав ${COURSE_PRICE_UAH.toLocaleString("uk-UA")} грн. Код у призначенні платежу: <b>${escapeHtml(code)}</b>.</p>
<p>Звірте переказ у банку й відкрийте доступ: <a href="${SITE_URL}/admin/access?q=${encodeURIComponent(code)}">запити на доступ</a></p>`,
    });
  }

  return NextResponse.json({ ok: true });
}
