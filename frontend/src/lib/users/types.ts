import type { SupportedLocale } from "@/types/common";

/* ------- backend ile birebir tipler ------- */
export type Provider = "local" | "google" | "facebook";

export type LiteUserPayload = {
  id: string;
  role: string;
  email?: string;
  name?: string;
  isActive?: boolean;
};

export type RegisterBody = { email: string; password: string; name?: string };
export type LoginBody    = { email: string; password: string };
export type GoogleBody   = { idToken: string };       // DEV: "debug:mail@domain" destekli
export type FacebookBody = { accessToken: string };   // DEV: "debug:mail@domain" destekli

export type ForgotPasswordBody = { email: string };
export type ResetPasswordBody  = {
  email: string;
  code?: string;
  token?: string;
  newPassword: string;
};

/* ------- genel API zarfı ------- */
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: unknown;
};

/* ------- kullanıcı oturum durumu ------- */
export type AuthMe = LiteUserPayload | null;

/* ------- yardımcı ------- */
export type LocaleParam = { locale?: SupportedLocale };
