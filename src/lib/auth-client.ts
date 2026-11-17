"use client";

import type { AuthError } from "@supabase/supabase-js";
import { PASSWORD_ERROR, type AuthVia } from "./auth";

// Where Google and every letter send the person back to.
export const callbackUrl = (next: string, via: AuthVia) =>
  `${window.location.origin}/auth/callback?via=${via}&next=${encodeURIComponent(next)}`;

const GENERIC = "Щось пішло не так. Спробуйте ще раз за кілька хвилин";

// Supabase answers in English and sometimes names what exists; these texts never
// say whether an account with the address is registered.
export function authErrorText(error: AuthError, fallback = GENERIC) {
  switch (error.code) {
    case "invalid_credentials":
      return "Неправильний email або пароль";
    case "over_email_send_rate_limit":
      return "Зачекайте хвилину і спробуйте ще раз";
    case "over_request_rate_limit":
      return "Забагато спроб. Зачекайте кілька хвилин і спробуйте ще раз";
    case "weak_password":
      return PASSWORD_ERROR;
    case "same_password":
      return "Новий пароль збігається з поточним";
    case "reauthentication_not_valid":
    case "otp_expired":
      return "Код неправильний або застарів";
  }
  if (error.status === 429) return "Забагато спроб. Зачекайте кілька хвилин і спробуйте ще раз";
  return fallback;
}

// The email typed on the login page, carried to «Забули пароль?» without putting it in the address.
const EMAIL_KEY = "vikha-login-email";

export const rememberEmail = (email: string) => {
  try {
    sessionStorage.setItem(EMAIL_KEY, email.trim());
  } catch {
    // Storage may be blocked; the person then types the address again.
  }
};

export const recalledEmail = () => {
  try {
    return sessionStorage.getItem(EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
};
