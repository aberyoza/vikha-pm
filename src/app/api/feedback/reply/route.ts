import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/content/site";
import { isSameOrigin, isUuid } from "@/lib/api-guard";
import { authEnabled } from "@/lib/auth";
import { FEEDBACK_REPLY_MAX } from "@/lib/feedback";
import { sendEmail } from "@/lib/send-email";
import { createClient } from "@/lib/supabase/server";

// The author answers. The letter has no text of the reply in it, only the way to
// read it on the site.
export async function POST(request: NextRequest) {
  if (!authEnabled) return new NextResponse(null, { status: 404 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "not_signed_in" }, { status: 401 });

  // Row-level security decides too; this answers a non-admin before anything is parsed.
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", auth.user.id).maybeSingle();
  if (!profile?.is_admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const payload = (await request.json().catch(() => null)) as { requestId?: unknown; body?: unknown } | null;
  const requestId = typeof payload?.requestId === "string" ? payload.requestId : "";
  const body = typeof payload?.body === "string" ? payload.body.trim() : "";
  if (!isUuid(requestId) || !body || body.length > FEEDBACK_REPLY_MAX) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { error } = await supabase.from("feedback_replies").insert({ request_id: requestId, author_id: auth.user.id, body });
  if (error) return NextResponse.json({ error: "not_saved" }, { status: error.code === "42501" ? 409 : 500 });

  const { data: contact } = await supabase.rpc("feedback_student_contact", { request_id: requestId });
  const to = contact?.[0];
  if (to?.email && to.emails_enabled) {
    await sendEmail({
      to: to.email,
      subject: "Автор відповів на ваш запит",
      html: `<p>Автор курсу «Віха» прочитав ваш паспорт проєкту і написав відповідь.</p>
<p><a href="${SITE_URL}/cabinet/feedback?id=${requestId}">Прочитати відповідь</a></p>
<p>Листи про фідбек можна вимкнути в розділі «Мій кабінет».</p>`,
    });
  }

  return NextResponse.json({ ok: true });
}
