import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type { ICompany, ApiEnvelope } from "./types";

/** abs("/company") → https://.../api/company */
async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute(); // "https://.../api"
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

/**
 * SSR/RSC: GET /company (tekil kayıt)
 * @param locale
 * @param cookie
 * @param opts   cache davranışı için opsiyon (varsayılan: 'force-cache')
 */
export async function fetchCompanyServer(
  locale?: SupportedLocale,
  cookie?: string,
  opts?: { cache?: RequestCache }
): Promise<ICompany | null> {
  const url = await abs("company");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
      "X-Requested-With": "fetch",
    },
    cache: opts?.cache ?? "force-cache",
  });

  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`company fetch failed: ${r.status}`);

  const j = (await r.json()) as ApiEnvelope<ICompany> | ICompany;
  return (j as any)?.data ?? (j as ICompany);
}
