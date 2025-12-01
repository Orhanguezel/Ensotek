import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type { IComment, ApiListResponse, ApiItemResponse, CreateCommentBody } from "./types";

/* ---------- abs helper ---------- */
async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute(); // "https://.../api"
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

/* ---------- Public: Testimonials ---------- */
export async function fetchTestimonialsPublicServer(
  args?: { page?: number; limit?: number; minRating?: number; locale?: SupportedLocale },
  cookie?: string,
  opts?: { cache?: RequestCache }
): Promise<ApiListResponse<IComment>> {
  const urlBase = await abs("comment/testimonials");
  const p = new URLSearchParams();
  if (args?.page) p.set("page", String(args.page));
  if (args?.limit) p.set("limit", String(args.limit));
  if (args?.minRating) p.set("minRating", String(args.minRating));
  const url = `${urlBase}?${p.toString()}`;

  const tenant = await resolveTenant();
  const l = normalizeLocale(args?.locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
      "X-Requested-With": "fetch",
    },
    cache: opts?.cache ?? "force-cache",
  });

  if (!r.ok) throw new Error(`testimonials fetch failed: ${r.status}`);
  return (await r.json()) as ApiListResponse<IComment>;
}

/* ---------- Public: İçeriğe göre yorum ---------- */
export async function fetchCommentsForContentServer(
  contentType: string,
  contentId: string,
  args?: { page?: number; limit?: number; type?: string; locale?: SupportedLocale },
  cookie?: string,
  opts?: { cache?: RequestCache }
): Promise<ApiListResponse<IComment>> {
  const urlBase = await abs(`comment/${encodeURIComponent(contentType)}/${encodeURIComponent(contentId)}`);
  const p = new URLSearchParams();
  if (args?.page) p.set("page", String(args.page));
  if (args?.limit) p.set("limit", String(args.limit));
  if (args?.type) p.set("type", String(args.type));
  const url = `${urlBase}?${p.toString()}`;

  const tenant = await resolveTenant();
  const l = normalizeLocale(args?.locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
      "X-Requested-With": "fetch",
    },
    cache: opts?.cache ?? "force-cache",
  });

  if (!r.ok) throw new Error(`comments fetch failed: ${r.status}`);
  return (await r.json()) as ApiListResponse<IComment>;
}

/* ---------- Create (public/auth) ---------- */
export async function createCommentServer(
  body: CreateCommentBody,
  args?: { locale?: SupportedLocale },
  cookie?: string
): Promise<ApiItemResponse<IComment>> {
  const url = await abs("comment");
  const tenant = await resolveTenant();
  const l = normalizeLocale(args?.locale);

  const r = await fetch(url, {
    method: "POST",
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
      "X-Requested-With": "fetch",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`comment create failed: ${r.status}`);
  return (await r.json()) as ApiItemResponse<IComment>;
}
