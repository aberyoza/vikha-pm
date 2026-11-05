import { NextResponse, type NextRequest } from "next/server";
import { CONTACT_EMAIL, SITE_URL } from "@/content/site";
import { isSameOrigin } from "@/lib/api-guard";
import { authEnabled } from "@/lib/auth";
import { FEEDBACK_NOTE_MAX } from "@/lib/feedback";
import { doneMilestones } from "@/lib/milestones";
import type { MyProject } from "@/lib/my-project";
import { escapeHtml, sendEmail } from "@/lib/send-email";
import { createClient } from "@/lib/supabase/server";

// A student sends the passport as saved in the account.
export async function POST(request: NextRequest) {
  if (!authEnabled) return new NextResponse(null, { status: 404 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "not_signed_in" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { note?: unknown } | null;
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, FEEDBACK_NOTE_MAX) : "";

  const { data: passport } = await supabase.from("project_passports").select("data").eq("user_id", auth.user.id).maybeSingle();
  if (!passport) return NextResponse.json({ error: "no_passport" }, { status: 400 });
  const project = passport.data as MyProject;
  const milestones = doneMilestones(project);
  if (milestones === 0) return NextResponse.json({ error: "empty_passport" }, { status: 400 });

  const { data: created, error } = await supabase
    .from("feedback_requests")
    .insert({ user_id: auth.user.id, snapshot: project, milestones, note: note || null })
    .select("id")
    .single();
  if (error?.code === "VK429") return NextResponse.json({ error: "too_many" }, { status: 429 });
  if (error) return NextResponse.json({ error: error.code === "23505" ? "already_pending" : "not_saved" }, { status: error.code === "23505" ? 409 : 500 });

  const { data: profile } = await supabase.from("profiles").select("name").eq("id", auth.user.id).maybeSingle();
  await sendEmail({
    to: CONTACT_EMAIL,
    subject: "Новий запит на фідбек",
    html: `<p>${escapeHtml(profile?.name ?? "Учень")} надсилає паспорт проєкту. Заповнено віх: ${milestones}.</p>
<p><a href="${SITE_URL}/admin/feedback?id=${created.id}">Відкрити запит</a></p>`,
  });

  return NextResponse.json({ id: created.id });
}
