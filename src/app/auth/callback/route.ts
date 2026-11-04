import { NextResponse, type NextRequest } from "next/server";
import { authEnabled, safeNext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Google and the link from a letter both land here with a one-time code.
export async function GET(request: NextRequest) {
  if (!authEnabled) return new NextResponse(null, { status: 404 });

  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const go = (path: string) => NextResponse.redirect(new URL(path, origin));
  const fail = () => go(`/login?error=${searchParams.get("via") === "google" ? "google" : "link"}&next=${encodeURIComponent(next)}`);

  const code = searchParams.get("code");
  if (!code) return fail();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return fail();

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", data.user.id).maybeSingle();
  return go(profile ? next : `/welcome?next=${encodeURIComponent(next)}`);
}
