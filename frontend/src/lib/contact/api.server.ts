import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type { ApiEnvelope } from "./types";
import type { IContactMessage, ContactSendPayload } from "./types";

async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute();
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

/** POST /contact — SSR/RSC'de kullanmak istersen */
export async function sendContactMessageServer(payload: ContactSendPayload, locale?: SupportedLocale, cookie?: string) {
  const url = await abs("contact");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
      "X-Requested-With": "fetch",
    },
    body: JSON.stringify(payload),
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`contact send failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IContactMessage> | IContactMessage;
  return (j as any)?.data ?? (j as IContactMessage);
}

/** GET /contact — admin list (auth cookie gerekli) */
export async function fetchContactMessagesServer(cookie?: string) {
  const url = await abs("contact");
  const tenant = await resolveTenant();

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(undefined, tenant),
      ...(cookie ? { cookie } : {}),
      "X-Requested-With": "fetch",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`contact list failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IContactMessage[]> | IContactMessage[];
  return Array.isArray(j) ? j : (j?.data ?? []);
}
