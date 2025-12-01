// src/modules/library/controller.ts
// =============================================================

import type { RouteHandler } from "fastify";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/core/i18n";
import {
  listLibraries,
  getLibraryMergedById,
  getLibraryMergedBySlug,
  listLibraryImagesMerged,
  listLibraryFilesMerged,
} from "./repository";

type ListQuery = {
  order?: string;
  sort?:
    | "created_at"
    | "updated_at"
    | "published_at"
    | "display_order"
    | "views"
    | "download_count";
  orderDir?: "asc" | "desc";
  limit?: string;
  offset?: string;
  is_published?: "0" | "1" | "true" | "false";
  is_active?: "0" | "1" | "true" | "false";
  q?: string;
  slug?: string;
  select?: string;

  category_id?: string;
  sub_category_id?: string;

  // 🔥 yeni: frontend’den gelen locale query
  locale?: string;
};

const normalizeLocale = (raw?: unknown): Locale => {
  const cand = String(raw || "")
    .split("-")[0]
    .toLowerCase();
  if ((LOCALES as readonly string[]).includes(cand)) {
    return cand as Locale;
  }
  return DEFAULT_LOCALE;
};

/** LIST (public) */
export const listLibraryPublic: RouteHandler<{
  Querystring: ListQuery;
}> = async (req, reply) => {
  const q = (req.query ?? {}) as ListQuery;

  // ÖNCE query.locale, yoksa req.locale, en sonda DEFAULT
  const locale: Locale = normalizeLocale(
    q.locale ?? (req as any).locale,
  );

  const limitNum = q.limit ? Number(q.limit) : undefined;
  const offsetNum = q.offset ? Number(q.offset) : undefined;

  const { items, total } = await listLibraries({
    orderParam: typeof q.order === "string" ? q.order : undefined,
    sort: q.sort,
    order: q.orderDir,
    limit: Number.isFinite(limitNum as number)
      ? (limitNum as number)
      : undefined,
    offset: Number.isFinite(offsetNum as number)
      ? (offsetNum as number)
      : undefined,
    is_published: q.is_published,
    is_active: q.is_active,
    q: q.q,
    slug: q.slug,
    category_id: q.category_id,
    sub_category_id: q.sub_category_id,
    locale,
    defaultLocale: DEFAULT_LOCALE,
  });

  reply.header("x-total-count", String(total ?? 0));
  return reply.send(items);
};

/** GET BY ID (public) */
export const getLibraryPublic: RouteHandler<{
  Params: { id: string };
}> = async (req, reply) => {
  const q = (req.query ?? {}) as { locale?: string };
  const locale: Locale = normalizeLocale(
    q.locale ?? (req as any).locale,
  );

  const row = await getLibraryMergedById(
    locale,
    DEFAULT_LOCALE,
    req.params.id,
  );
  if (!row)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/** GET BY SLUG (public) */
export const getLibraryBySlugPublic: RouteHandler<{
  Params: { slug: string };
}> = async (req, reply) => {
  const q = (req.query ?? {}) as { locale?: string };
  const locale: Locale = normalizeLocale(
    q.locale ?? (req as any).locale,
  );

  const row = await getLibraryMergedBySlug(
    locale,
    DEFAULT_LOCALE,
    req.params.slug,
  );
  if (!row)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/** LIST IMAGES of a library (public) */
export const listLibraryImagesPublic: RouteHandler<{
  Params: { id: string };
}> = async (req, reply) => {
  const q = (req.query ?? {}) as { locale?: string };
  const locale: Locale = normalizeLocale(
    q.locale ?? (req as any).locale,
  );

  const items = await listLibraryImagesMerged(
    req.params.id,
    locale,
    DEFAULT_LOCALE,
  );
  return reply.send(items);
};

/** LIST FILES of a library (public) */
export const listLibraryFilesPublic: RouteHandler<{
  Params: { id: string };
}> = async (req, reply) => {
  const items = await listLibraryFilesMerged(req.params.id);
  return reply.send(items);
};
