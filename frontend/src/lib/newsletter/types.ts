import type { SupportedLocale } from "@/types/common";

/** BE response zarfı */
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
};

export interface INewsletter {
  _id: string;            // Mongo ObjectId
  tenant: string;
  email: string;
  verified: boolean;
  subscribeDate: string;  // ISO
  unsubscribeDate?: string;
  lang?: SupportedLocale;
  meta?: any;
}

/** Public: subscribe payload (honeypot + reCAPTCHA + time-to-submit) */
export type SubscribePayload = {
  email: string;
  lang?: string;
  meta?: any;
  recaptchaToken?: string; // reCAPTCHA v3
  hp?: string;             // honeypot
  tts?: number;            // time-to-submit (ms)
};

/** Admin: bulk send payload */
export type BulkSendPayload = {
  subject: string;
  html: string;
  filter?: any;
};
