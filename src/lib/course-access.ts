import "server-only";
import { paywallEnabled } from "./paywall";
import { createClient } from "./supabase/server";

export type AccessBasis = "paid" | "free" | "free_plus";

// A failure of any kind counts as "no access": the student can reload the page,
// while a paid lesson shown by mistake can't be taken back.
export async function hasCourseAccess() {
  if (!paywallEnabled) return true;
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return false;
    const { data, error } = await supabase.rpc("has_course_access");
    return !error && data === true;
  } catch {
    return false;
  }
}
