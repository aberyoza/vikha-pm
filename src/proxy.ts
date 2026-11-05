import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPaidPath, paywallEnabled } from "@/lib/paywall";

// Access is blocked for these countries (ISO 3166-1 alpha-2): Russia,
// Belarus, China, Iran, North Korea. The same list should exist as a
// Firewall rule in the Vercel dashboard, which stops traffic before it
// reaches the app; this check is the in-code fallback.
const BLOCKED_COUNTRIES = new Set(["RU", "BY", "CN", "IR", "KP"]);

// The admin area answers 404 to anyone else, so its existence isn't confirmed
// either. A failure of any kind counts as "not an admin". Row-level security
// still guards the data on its own.
async function adminGate(request: NextRequest) {
  const response = NextResponse.next({ request });
  const denied = () => NextResponse.rewrite(new URL("/not-found-admin", request.url), { status: 404 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return denied();

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          for (const { name, value, options } of cookies) response.cookies.set(name, value, options);
        },
      },
    });
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return denied();
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", auth.user.id).maybeSingle();
    if (!profile?.is_admin) return denied();
  } catch {
    return denied();
  }
  response.headers.set("cache-control", "private, no-store");
  return response;
}

// Server Components can't write cookies, so without this a student who comes back
// after the access token expired would look signed out and lose their paid lessons.
// Guests have no session cookie and cost no request to Supabase.
async function refreshSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!url || !key || !hasSession) return NextResponse.next();

  let response = NextResponse.next({ request });
  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies, headers) => {
          for (const { name, value } of cookies) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookies) response.cookies.set(name, value, options);
          for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
        },
      },
    });
    await supabase.auth.getUser();
  } catch {
    // The page then treats the student as signed out, which fails closed.
  }
  return response;
}

export async function proxy(request: NextRequest) {
  // Set by Vercel's edge from the client IP; clients can't override it there.
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();

  if (country && BLOCKED_COUNTRIES.has(country)) {
    return new NextResponse("Access from your region is not available.", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  if (request.nextUrl.pathname === "/admin" || request.nextUrl.pathname.startsWith("/admin/")) {
    return adminGate(request);
  }

  if (paywallEnabled && isPaidPath(request.nextUrl.pathname)) {
    return refreshSession(request);
  }

  return NextResponse.next();
}

export const config = {
  // Every page and data request; static build assets don't need the check.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
