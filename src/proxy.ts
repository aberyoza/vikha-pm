import { NextResponse, type NextRequest } from "next/server";

// Access is blocked for these countries (ISO 3166-1 alpha-2): Russia,
// Belarus, China, Iran, North Korea. The same list should exist as a
// Firewall rule in the Vercel dashboard, which stops traffic before it
// reaches the app; this check is the in-code fallback.
const BLOCKED_COUNTRIES = new Set(["RU", "BY", "CN", "IR", "KP"]);

export function proxy(request: NextRequest) {
  // Set by Vercel's edge from the client IP; clients can't override it there.
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();

  if (country && BLOCKED_COUNTRIES.has(country)) {
    return new NextResponse("Access from your region is not available.", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Every page and data request; static build assets don't need the check.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
