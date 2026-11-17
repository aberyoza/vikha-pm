import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { authEnabled, safeNext, type AuthVia } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const VIA: AuthVia[] = ["google", "email", "signup", "recovery"];
const OTP_TYPES: EmailOtpType[] = ["email", "signup", "magiclink", "recovery"];

// Google and every letter (sign-in link, address confirmation, password reset) land here.
// A letter brings either a one-time `code`, which works only in the browser that asked
// for it, or a `token_hash` from the email template, which works on any device.
export async function GET(request: NextRequest) {
  if (!authEnabled) return new NextResponse(null, { status: 404 });

  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const via = VIA.find((v) => v === searchParams.get("via")) ?? "email";
  const go = (path: string) => NextResponse.redirect(new URL(path, origin));
  const fail = () => {
    if (via === "recovery") return go("/forgot-password?error=link");
    const error = via === "google" ? "google" : via === "signup" ? "signup" : "link";
    return go(`/login?error=${error}&next=${encodeURIComponent(next)}`);
  };

  const supabase = await createClient();
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = OTP_TYPES.find((t) => t === searchParams.get("type"));

  let user;
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return fail();
    user = data.user;
  } else if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) return fail();
    user = data.user;
  }
  if (!user) return fail();

  // The reset link has signed the person in; the new password comes before anything else.
  if (via === "recovery") return go("/new-password");

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  return go(profile ? next : `/welcome?next=${encodeURIComponent(next)}`);
}
