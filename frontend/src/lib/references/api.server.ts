import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type {
  IReferences,
  ReferencesCategory,
  ReferencesListParams,
  ApiEnvelope,
} from "./types";

/** abs("/references") → https://.../api/references */
async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute();
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

/** Liste sonucunu meta ile döndürür */
export type ReferencesListResult = {
  items: IReferences[];
  page: number;
  totalPages: number;
  totalItems: number;
};

/** SSR/RSC: /references (list) */
export async function fetchReferencesListServer(
  params?: ReferencesListParams,
  cookie?: string
): Promise<ReferencesListResult> {
  const urlBase = await abs("references");
  const url = new URL(urlBase);

  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.categorySlug) url.searchParams.set("category", params.categorySlug);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.sort) url.searchParams.set("sort", params.sort);

  const tenant = await resolveTenant();
  const l = normalizeLocale(params?.locale as SupportedLocale | undefined);

  const r = await fetch(url.toString(), {
    headers: { ...buildCommonHeaders(l, tenant), ...(cookie ? { cookie } : {}) },
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`references list failed: ${r.status}`);

  // Header üzerinden toplam sayıları yakalamayı dene
  const hdrTotal =
    Number(r.headers.get("x-total-count")) ||
    Number(r.headers.get("x-totalitems")) ||
    Number(r.headers.get("x-total")) ||
    undefined;

  const hdrTotalPages =
    Number(r.headers.get("x-total-pages")) ||
    Number(r.headers.get("x-pages")) ||
    undefined;

  const j = (await r.json()) as ApiEnvelope<IReferences[]> & {
    meta?: {
      page?: number;
      totalPages?: number;
      totalItems?: number;
      itemCount?: number;
      limit?: number;
      pagination?: { page?: number; totalPages?: number; totalItems?: number; perPage?: number };
    };
  };

  const items = j.data ?? [];
  const m = j.meta ?? {};
  const mp = (m as any).pagination || {};

  const page = Number(m.page ?? mp.page ?? params?.page ?? 1);

  // perPage: önce meta/limit -> yoksa params.limit -> en son eldeki sayıyı kullan
  const perPage = Number(
    m.limit ?? mp.perPage ?? (params?.limit ?? (items.length || 1))
  );

  const totalItems = Number(
    m.totalItems ?? m.itemCount ?? mp.totalItems ?? hdrTotal ?? (items.length || 0)
  );

  // totalPages öncelik: meta/header; yoksa fallback
  let totalPages = Number(m.totalPages ?? mp.totalPages ?? hdrTotalPages ?? 0);
  if (!totalPages || !Number.isFinite(totalPages)) {
    // Fallback: Bu sayfada perPage kadar kayıt varsa en az bir sonraki sayfa olabilir
    const maybeHasNext = items.length >= perPage;
    totalPages = maybeHasNext ? page + 1 : page;
  }

  return { items, page, totalPages, totalItems };
}

/** SSR/RSC: /references/slug/:slug (single) */
export async function fetchReferencesBySlugServer(
  slug: string,
  locale?: SupportedLocale,
  cookie?: string
): Promise<IReferences | null> {
  const url = await abs(`references/slug/${encodeURIComponent(slug)}`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: { ...buildCommonHeaders(l, tenant), ...(cookie ? { cookie } : {}) },
    credentials: "include",
    cache: "no-store",
  });

  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`references bySlug failed: ${r.status}`);

  const j = (await r.json()) as ApiEnvelope<IReferences>;
  return j.data ?? null;
}

/** SSR/RSC: /referencescategory (public list) */
export async function fetchReferencesCategoriesServer(
  locale?: SupportedLocale,
  cookie?: string
): Promise<ReferencesCategory[]> {
  const url = await abs("referencescategory");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: { ...buildCommonHeaders(l, tenant), ...(cookie ? { cookie } : {}) },
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`references categories failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<ReferencesCategory[]>;
  return j.data ?? [];
}
