import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type {
  IBlog,
  BlogCategory,
  BlogListParams,
  ApiEnvelope,
} from "./types";

/** abs("/blog") → https://.../api/blog */
async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute(); // "https://.../api"
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

/** SSR/RSC: /blog (list) */
export async function fetchBlogListServer(
  params?: BlogListParams,
  cookie?: string
): Promise<IBlog[]> {
  const urlBase = await abs("blog");
  const url = new URL(urlBase);

  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.categorySlug) url.searchParams.set("category", params.categorySlug);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.sort) url.searchParams.set("sort", params.sort);

  const tenant = await resolveTenant();
  const l = normalizeLocale(params?.locale as SupportedLocale | undefined);

  const r = await fetch(url.toString(), {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store", // liste RSC’de taze kalsın (isteğe göre revalidate param. ile oynanır)
  });

  if (!r.ok) {
    throw new Error(`blog list failed: ${r.status}`);
  }
  const j = (await r.json()) as ApiEnvelope<IBlog[]>;
  return j.data ?? [];
}

/** SSR/RSC: /blog/slug/:slug (single) */
export async function fetchBlogBySlugServer(
  slug: string,
  locale?: SupportedLocale,
  cookie?: string
): Promise<IBlog | null> {
  const url = await abs(`blog/slug/${encodeURIComponent(slug)}`);
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
  if (!r.ok) throw new Error(`blog bySlug failed: ${r.status}`);

  const j = (await r.json()) as ApiEnvelope<IBlog>;
  return j.data ?? null;
}

/** SSR/RSC: /blogcategory (public list) */
export async function fetchBlogCategoriesServer(
  locale?: SupportedLocale,
  cookie?: string
): Promise<BlogCategory[]> {
  const url = await abs("blogcategory");
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

  if (!r.ok) throw new Error(`blog categories failed: ${r.status}`);

  const j = (await r.json()) as ApiEnvelope<BlogCategory[]>;
  return j.data ?? [];
}
