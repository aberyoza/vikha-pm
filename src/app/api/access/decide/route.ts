import { NextResponse, type NextRequest } from "next/server";
import { publishedModules } from "@/content/course";
import { SITE_URL } from "@/content/site";
import { ACCESS_BASES, type AccessBasis } from "@/lib/access";
import { isSameOrigin, isUuid } from "@/lib/api-guard";
import { authEnabled } from "@/lib/auth";
import { FIRST_PAID_MODULE } from "@/lib/paywall";
import { sendEmail } from "@/lib/send-email";
import { createClient } from "@/lib/supabase/server";

type Action = AccessBasis | "revoke";

// The author opens or closes access. Works with the paywall off too, so access
// can be given before launch.
export async function POST(request: NextRequest) {
  if (!authEnabled) return new NextResponse(null, { status: 404 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "not_signed_in" }, { status: 401 });

  // The database decides too; this answers a non-admin before anything is parsed.
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", auth.user.id).maybeSingle();
  if (!profile?.is_admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const payload = (await request.json().catch(() => null)) as { userId?: unknown; action?: unknown } | null;
  const userId = typeof payload?.userId === "string" ? payload.userId : "";
  const action = payload?.action as Action;
  if (!isUuid(userId) || !(action === "revoke" || ACCESS_BASES.includes(action))) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { data: before } = await supabase
    .from("course_access")
    .select("status")
    .eq("user_id", userId)
    .eq("status", "approved")
    .maybeSingle();

  const { error } =
    action === "revoke"
      ? await supabase.rpc("revoke_course_access", { target_user: userId })
      : await supabase.rpc("approve_course_access", { target_user: userId, access_basis: action });
  if (error) return NextResponse.json({ error: "not_saved" }, { status: 500 });

  // One letter when access opens; changing the basis later sends nothing.
  if (action !== "revoke" && !before) {
    const { data: email } = await supabase.rpc("course_access_contact", { target_user: userId });
    const first = publishedModules.find((m) => m.number === FIRST_PAID_MODULE);
    if (typeof email === "string" && first) {
      await sendEmail({
        to: email,
        subject: "Доступ до курсу «Віха» відкрито",
        html: `<p>Модулі ${FIRST_PAID_MODULE}–14 курсу «Віха» тепер відкриті у вашому акаунті.</p>
<p><a href="${SITE_URL}/modules/${first.slug}/${first.lessons[0].slug}">Перейти до модуля ${FIRST_PAID_MODULE}</a></p>`,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
