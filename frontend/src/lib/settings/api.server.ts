// src/lib/settings/api.server.ts

import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type { ISetting, ApiEnvelope } from "./types";

/** abs("/settings") → https://.../api/settings */
async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute(); // "https://.../api"
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

/** SSR/RSC: /settings — public list */
export async function fetchSettingsServer(
  locale?: SupportedLocale,
  cookie?: string
): Promise<ISetting[]> {
  const url = await abs("settings");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
      "X-Requested-With": "fetch",
    },
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`settings list failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<ISetting[]> | ISetting[];
  return Array.isArray(j) ? j : (j.data ?? []);
}

/** SSR/RSC: /settings/admin — admin list */
export async function fetchSettingsAdminServer(
  locale?: SupportedLocale,
  cookie?: string
): Promise<ISetting[]> {
  const url = await abs("settings/admin");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
      "X-Requested-With": "fetch",
    },
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`settings admin list failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<ISetting[]> | ISetting[];
  return Array.isArray(j) ? j : (j.data ?? []);
}

export async function fetchSettingByKeyServer(
  key: string,
  locale?: SupportedLocale,
  cookie?: string
): Promise<ISetting | null> {
  const all = await fetchSettingsServer(locale, cookie);
  return all.find((s) => s.key === key) ?? null;
}
