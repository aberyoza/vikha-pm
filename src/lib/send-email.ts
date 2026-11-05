import "server-only";
import { SITE_NAME } from "@/content/site";

// Returns whether the letter went out. A letter is only a notice, so a failure
// must never undo what the person has just done on the site.
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const response = await fetch(process.env.RESEND_API_URL ?? "https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from: `${SITE_NAME} <no-reply@vikha-pm.com>`, to, subject, html }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
