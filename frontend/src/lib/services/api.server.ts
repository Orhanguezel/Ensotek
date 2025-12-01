import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type { IServices, ApiEnvelope, ServicesListParams } from "./types";

/** abs("/services") → https://.../api/services */
async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute(); // "https://.../api"
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

/** SSR/RSC: /services — public list */
export async function fetchServicesListServer(
  args: ServicesListParams = {},
  opts?: { revalidate?: number | false }
): Promise<IServices[]> {
  const urlBase = await abs("services");
  const tenant = await resolveTenant();
  const l = normalizeLocale(args.locale);

  const usp = new URLSearchParams();
  if (args.limit)  usp.set("limit", String(args.limit));
  if (args.offset) usp.set("offset", String(args.offset));
  usp.set("sort", args.sort ?? "-publishedAt");

  // ✅ Public default: always true
  const isPublished = args.isPublished ?? true;
  usp.set("isPublished", String(isPublished));

  if (args.q) usp.set("q", args.q);

  const url = usp.toString() ? `${urlBase}?${usp}` : urlBase;
  const revalidate = opts?.revalidate ?? 300;

  const r = await fetch(url, {
    headers: { ...buildCommonHeaders(l, tenant), "X-Requested-With": "fetch" },
    cache: revalidate === false ? "no-store" : "force-cache",
    ...(revalidate === false ? {} : { next: { revalidate } }),
  });

  if (!r.ok) throw new Error(`services list failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IServices[]> | IServices[];
  return Array.isArray(j) ? j : (j.data ?? []);
}


/** SSR/RSC: /services/admin — admin list */
export async function fetchServicesAdminListServer(
  locale?: SupportedLocale,
  cookie?: string
): Promise<IServices[]> {
  const url = await abs("services/admin");
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

  if (!r.ok) throw new Error(`services admin list failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IServices[]> | IServices[];
  return Array.isArray(j) ? j : (j.data ?? []);
}

/** SSR/RSC: /services/slug/:slug — public single */
export async function fetchServicesBySlugServer(
  slug: string,
  locale?: SupportedLocale
): Promise<IServices | null> {
  const url = await abs(`services/slug/${encodeURIComponent(slug)}`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      "X-Requested-With": "fetch",
    },
    cache: "no-store",
  });

  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`services by slug failed: ${r.status}`);

  const j = (await r.json()) as ApiEnvelope<IServices> | IServices | null;
  if (!j) return null;
  return "data" in (j as any) ? (j as any).data : (j as any);
}
