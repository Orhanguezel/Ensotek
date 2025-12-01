import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type {
  INewsletter,
  ApiEnvelope,
  SubscribePayload,
  BulkSendPayload,
} from "./types";

/** abs("/newsletter") → https://.../api/newsletter */
async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute();
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

/* ---------- PUBLIC ---------- */

/** POST /newsletter — subscribe */
export async function subscribeNewsletterServer(
  payload: SubscribePayload,
  locale?: SupportedLocale,
  cookie?: string
): Promise<INewsletter> {
  const url = await abs("newsletter");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`newsletter subscribe failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<INewsletter>;
  return j.data;
}

/** POST /newsletter/unsubscribe */
export async function unsubscribeNewsletterServer(
  email: string,
  locale?: SupportedLocale,
  cookie?: string
): Promise<INewsletter> {
  const url = await abs("newsletter/unsubscribe");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({ email }),
  });
  if (!r.ok) throw new Error(`newsletter unsubscribe failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<INewsletter>;
  return j.data;
}

/* ---------- ADMIN ---------- */

/** GET /newsletter — all subscribers */
export async function fetchNewsletterListServer(
  locale?: SupportedLocale,
  cookie?: string
): Promise<INewsletter[]> {
  const url = await abs("newsletter");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);
  const r = await fetch(url, {
    method: "GET",
    headers: { ...buildCommonHeaders(l, tenant), ...(cookie ? { cookie } : {}) },
    credentials: "include",
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`newsletter list failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<INewsletter[]>;
  return j.data ?? [];
}

/** DELETE /newsletter/:id */
export async function deleteSubscriberServer(
  id: string,
  locale?: SupportedLocale,
  cookie?: string
): Promise<void> {
  const url = await abs(`newsletter/${encodeURIComponent(id)}`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);
  const r = await fetch(url, {
    method: "DELETE",
    headers: { ...buildCommonHeaders(l, tenant), ...(cookie ? { cookie } : {}) },
    credentials: "include",
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`newsletter delete failed: ${r.status}`);
}

/** PATCH /newsletter/:id/verify */
export async function verifySubscriberServer(
  id: string,
  locale?: SupportedLocale,
  cookie?: string
): Promise<INewsletter> {
  const url = await abs(`newsletter/${encodeURIComponent(id)}/verify`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);
  const r = await fetch(url, {
    method: "PATCH",
    headers: { ...buildCommonHeaders(l, tenant), ...(cookie ? { cookie } : {}) },
    credentials: "include",
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`newsletter verify failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<INewsletter>;
  return j.data;
}

/** POST /newsletter/send-bulk */
export async function sendBulkNewsletterServer(
  payload: BulkSendPayload,
  locale?: SupportedLocale,
  cookie?: string
): Promise<{ sent: number; total: number }> {
  const url = await abs("newsletter/send-bulk");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`newsletter send-bulk failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<{ sent: number; total: number }>;
  return j.data;
}

/** POST /newsletter/:id/send */
export async function sendSingleNewsletterServer(
  id: string,
  payload: { subject: string; html: string },
  locale?: SupportedLocale,
  cookie?: string
): Promise<void> {
  const url = await abs(`newsletter/${encodeURIComponent(id)}/send`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`newsletter send-single failed: ${r.status}`);
}
