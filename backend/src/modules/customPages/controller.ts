// =============================================================
// FILE: src/modules/customPages/controller.ts
// =============================================================

import type { RouteHandler } from "fastify";

import { listCustomPages, getCustomPageMergedById, getCustomPageMergedBySlug } from "./repository";

import { customPageBySlugParamsSchema, customPageBySlugQuerySchema } from "./validation";

// ✅ i18n core (DEFAULT_LOCALE YOK)
import { LOCALES, normalizeLocale, ensureLocalesLoadedFromSettings } from "@/core/i18n";

// ✅ DB okuma (default_locale için)
import { db } from "@/db/client";
import { siteSettings } from "@/modules/siteSettings/schema";
import { eq } from "drizzle-orm";

/* ----------------------------- shared helpers ----------------------------- */

type LocaleCode = string;
type LocaleQueryLike = { locale?: string; default_locale?: string };

const DEFAULT_LOCALE_SETTING_KEY = "default_locale";

// default_locale cache (çok sık DB vurmasın)
let lastDefaultLocaleLoadedAt = 0;
let cachedDbDefaultLocale: string | null = null;
const DEFAULT_LOCALE_REFRESH_MS = 60_000;

function normalizeLooseLocale(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return normalizeLocale(s) || s.toLowerCase();
}

async function getDbDefaultLocale(): Promise<string | null> {
  const now = Date.now();
  if (cachedDbDefaultLocale && now - lastDefaultLocaleLoadedAt < DEFAULT_LOCALE_REFRESH_MS) {
    return cachedDbDefaultLocale;
  }

  try {
    const rows = await db
      .select({ value: siteSettings.value })
      .from(siteSettings)
      .where(eq(siteSettings.key, DEFAULT_LOCALE_SETTING_KEY))
      .limit(1);

    const raw = rows[0]?.value;
    const n = normalizeLooseLocale(typeof raw === "string" ? raw : String(raw ?? ""));
    cachedDbDefaultLocale = n ?? null;
    lastDefaultLocaleLoadedAt = now;
    return cachedDbDefaultLocale;
  } catch (err) {
    console.error("customPages.getDbDefaultLocale failed:", err);
    lastDefaultLocaleLoadedAt = now;
    cachedDbDefaultLocale = null;
    return null;
  }
}

/**
 * Public için DİNAMİK locale çözümü:
 *  - locale: query.locale > req.locale > db default_locale > ilk app_locales > "tr"
 *  - default_locale: query.default_locale > db default_locale > ilk app_locales > "tr"
 */
async function resolveLocales(req: any, query?: LocaleQueryLike): Promise<{ locale: LocaleCode; def: LocaleCode }> {
  await ensureLocalesLoadedFromSettings();

  const q = query ?? ((req.query ?? {}) as LocaleQueryLike);

  const reqRaw = normalizeLooseLocale(q.locale) ?? normalizeLooseLocale(req.locale);
  const defRawFromQuery = normalizeLooseLocale(q.default_locale);

  const appLocales = Array.isArray(LOCALES) ? LOCALES : [];
  const dbDefaultRaw = normalizeLooseLocale(await getDbDefaultLocale());

  const safeDefaultBase = (() => {
    if (dbDefaultRaw && appLocales.includes(dbDefaultRaw)) return dbDefaultRaw;
    if (appLocales[0]) return appLocales[0];
    return "tr";
  })();

  const safeLocale = reqRaw && appLocales.includes(reqRaw) ? reqRaw : safeDefaultBase;
  const safeDef = defRawFromQuery && appLocales.includes(defRawFromQuery) ? defRawFromQuery : safeDefaultBase;

  return { locale: safeLocale, def: safeDef };
}

/* ----------------------------- handlers ----------------------------- */

type ListQuery = {
  order?: string;
  sort?: "created_at" | "updated_at" | "display_order";
  orderDir?: "asc" | "desc";
  limit?: string | number;
  offset?: string | number;
  is_published?: "0" | "1" | "true" | "false";
  q?: string;
  slug?: string;

  category_id?: string;
  sub_category_id?: string;

  module_key?: string;

  // ✅ locale override (dynamic)
  locale?: string;

  // opsiyonel: default override
  default_locale?: string;
};

/** LIST (public) */
export const listPages: RouteHandler<{ Querystring: ListQuery }> = async (req, reply) => {
  const q = (req.query ?? {}) as ListQuery;

  const limitNum = q.limit != null && q.limit !== "" ? Number(q.limit) : undefined;
  const offsetNum = q.offset != null && q.offset !== "" ? Number(q.offset) : undefined;

  const { locale, def } = await resolveLocales(req, {
    locale: q.locale,
    default_locale: q.default_locale,
  });

  const { items, total } = await listCustomPages({
    orderParam: typeof q.order === "string" ? q.order : undefined,
    sort: q.sort,
    order: q.orderDir,
    limit: Number.isFinite(limitNum as number) ? (limitNum as number) : undefined,
    offset: Number.isFinite(offsetNum as number) ? (offsetNum as number) : undefined,
    is_published: q.is_published,
    q: q.q,
    slug: q.slug,
    category_id: q.category_id,
    sub_category_id: q.sub_category_id,
    module_key: q.module_key,
    locale,
    defaultLocale: def,
  });

  reply.header("x-total-count", String(total ?? 0));
  return reply.send(items);
};

/** GET BY ID (public) */
export const getPage: RouteHandler<{
  Params: { id: string };
  Querystring?: { locale?: string; default_locale?: string };
}> = async (req, reply) => {
  const { locale, def } = await resolveLocales(req, req.query as any);

  const row = await getCustomPageMergedById(locale, def, req.params.id);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });

  return reply.send(row);
};

/** GET BY SLUG (public) */
export const getPageBySlug: RouteHandler<{
  Params: { slug: string };
  Querystring?: { locale?: string; default_locale?: string };
}> = async (req, reply) => {
  const { slug } = customPageBySlugParamsSchema.parse(req.params ?? {});
  const q = customPageBySlugQuerySchema.parse(req.query ?? {});

  const { locale, def } = await resolveLocales(req, {
    locale: (q as any)?.locale,
    default_locale: (q as any)?.default_locale,
  });

  const row = await getCustomPageMergedBySlug(locale, def, slug);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });

  return reply.send(row);
};
