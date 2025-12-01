import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type {
  Iguezelwebdesignprod,
  guezelwebdesignCategory,
  ProductsListParams,
  ApiEnvelope,
} from "./types";

/** abs("/guezelwebdesignprod") → https://.../api/guezelwebdesignprod */
async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute(); // "https://.../api"
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

/** SSR/RSC: /guezelwebdesignprod (list) */
export async function fetchProductsListServer(
  params?: ProductsListParams,
  cookie?: string
): Promise<Iguezelwebdesignprod[]> {
  const urlBase = await abs("guezelwebdesignprod");
  const url = new URL(urlBase);

  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.categorySlug) url.searchParams.set("category", params.categorySlug);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.sort) url.searchParams.set("sort", params.sort);
  if (typeof params?.minPrice === "number") url.searchParams.set("minPrice", String(params.minPrice));
  if (typeof params?.maxPrice === "number") url.searchParams.set("maxPrice", String(params.maxPrice));
  if (params?.brand) url.searchParams.set("brand", params.brand);
  if (typeof params?.isPublished === "boolean") url.searchParams.set("isPublished", String(params.isPublished));

  const tenant = await resolveTenant();
  const l = normalizeLocale(params?.locale as SupportedLocale | undefined);

  const r = await fetch(url.toString(), {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`products list failed: ${r.status}`);

  const j = (await r.json()) as ApiEnvelope<Iguezelwebdesignprod[]>;
  return j.data ?? [];
}

/** SSR/RSC: /guezelwebdesignprod/slug/:slug (single) */
export async function fetchProductBySlugServer(
  slug: string,
  locale?: SupportedLocale,
  cookie?: string
): Promise<Iguezelwebdesignprod | null> {
  const url = await abs(`guezelwebdesignprod/slug/${encodeURIComponent(slug)}`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`product bySlug failed: ${r.status}`);

  const j = (await r.json()) as ApiEnvelope<Iguezelwebdesignprod>;
  return j.data ?? null;
}

/** SSR/RSC: /guezelwebdesignprod/:id (single by id) */
export async function fetchProductByIdServer(
  id: string,
  locale?: SupportedLocale,
  cookie?: string
): Promise<Iguezelwebdesignprod | null> {
  const url = await abs(`guezelwebdesignprod/${encodeURIComponent(id)}`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`product byId failed: ${r.status}`);

  const j = (await r.json()) as ApiEnvelope<Iguezelwebdesignprod>;
  return j.data ?? null;
}

/** SSR/RSC: /guezelwebdesigncategory (public list) */
export async function fetchProductCategoriesServer(
  locale?: SupportedLocale,
  cookie?: string
): Promise<guezelwebdesignCategory[]> {
  const url = await abs("guezelwebdesigncategory");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`product categories failed: ${r.status}`);

  const j = (await r.json()) as ApiEnvelope<guezelwebdesignCategory[]>;
  return j.data ?? [];
}
