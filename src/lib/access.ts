// Shared by the browser and the server: names and shapes of course access.

export type AccessBasis = "paid" | "free" | "free_plus";
export type AccessStatus = "pending" | "approved" | "revoked";

export const ACCESS_BASIS_LABEL: Record<AccessBasis, string> = {
  paid: "Оплатив",
  free: "Безкоштовний",
  free_plus: "Безкоштовний+",
};

export const ACCESS_BASES = Object.keys(ACCESS_BASIS_LABEL) as AccessBasis[];

// Recorded with each request. Raise it when the terms on /access change.
export const OFFER_VERSION = "2026-11-draft";

export type PaymentDetails = {
  recipient: string;
  iban: string;
  taxId: string;
  amount: string;
  purpose: string;
};

export const paymentPurpose = (code: string) => `Оплата за курс «Віха», ${code}`;
