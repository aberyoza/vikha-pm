import { NextResponse } from "next/server";
import { paymentPurpose, type PaymentDetails } from "@/lib/access";
import { authEnabled } from "@/lib/auth";
import { COURSE_PRICE_UAH, paywallEnabled } from "@/lib/paywall";
import { createClient } from "@/lib/supabase/server";

const noStore = { "cache-control": "private, no-store" };

// The author's bank details live in Vercel, not in this public repository, and
// only a student with a waiting request gets them.
export async function GET() {
  if (!authEnabled || !paywallEnabled) return new NextResponse(null, { status: 404 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "not_signed_in" }, { status: 401, headers: noStore });

  const { data: row } = await supabase
    .from("course_access")
    .select("payment_code")
    .eq("user_id", auth.user.id)
    .eq("status", "pending")
    .maybeSingle();
  if (!row?.payment_code) return NextResponse.json({ error: "no_request" }, { status: 409, headers: noStore });

  const recipient = process.env.PAYMENT_RECIPIENT;
  const iban = process.env.PAYMENT_IBAN;
  const taxId = process.env.PAYMENT_TAX_ID;
  if (!recipient || !iban || !taxId) return NextResponse.json({ error: "not_configured" }, { status: 503, headers: noStore });

  const details: PaymentDetails = {
    recipient,
    iban,
    taxId,
    amount: `${COURSE_PRICE_UAH.toLocaleString("uk-UA")} грн`,
    purpose: paymentPurpose(row.payment_code),
  };
  return NextResponse.json(details, { headers: noStore });
}
