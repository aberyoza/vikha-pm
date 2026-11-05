import "server-only";
import type { NextRequest } from "next/server";

// Refuses a request sent from another site, on top of the SameSite session cookie.
export const isSameOrigin = (request: NextRequest) => {
  const origin = request.headers.get("origin");
  return !!origin && origin === request.nextUrl.origin;
};

export const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
