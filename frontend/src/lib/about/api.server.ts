import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type { IAbout, AboutCategory, ApiEnvelope } from "./types";

/** abs("/aboutus") → https://.../api/aboutus */
async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute();
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

export type ServerAboutListParams = {
  category?: string;
  onlyLocalized?: boolean;
  locale?: SupportedLocale;
};

/** GET /aboutus — public list */
export async function fetchAboutListServer(
  params: ServerAboutListParams = {},
  cookie?: string
): Promise<IAbout[]> {
  const urlBase = await abs("aboutus");
  const url = new URL(urlBase);

  if (params.category)      url.searchParams.set("category", String(params.category));
  if (params.onlyLocalized) url.searchParams.set("onlyLocalized", "true");

  const tenant = await resolveTenant();
  const l = normalizeLocale(params.locale);

  const r = await fetch(url.toString(), {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
      "X-Requested-With": "fetch",
    },
    cache: "force-cache",
    next: { revalidate: 300 },
  });

  if (!r.ok) throw new Error(`aboutus list failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IAbout[]> | IAbout[];
  return Array.isArray(j) ? j : (j?.data ?? []);
}

/** GET /aboutus/slug/:slug — public single */
export async function fetchAboutBySlugServer(
  slug: string,
  locale?: SupportedLocale,
  cookie?: string
): Promise<IAbout | null> {
  const url = await abs(`aboutus/slug/${encodeURIComponent(slug)}`);
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

  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`aboutus bySlug failed: ${r.status}`);

  const j = (await r.json()) as ApiEnvelope<IAbout> | IAbout | null;
  return (j as any)?.data ?? (j as IAbout) ?? null;
}

/** GET /aboutcategory — public list */
export async function fetchAboutCategoriesServer(
  locale?: SupportedLocale,
  cookie?: string
): Promise<AboutCategory[]> {
  const url = await abs("aboutcategory");
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

  if (!r.ok) throw new Error(`aboutcategory failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<AboutCategory[]> | AboutCategory[];
  return Array.isArray(j) ? j : (j?.data ?? []);
}
