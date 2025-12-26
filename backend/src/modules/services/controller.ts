// src/modules/services/controller.ts
// =============================================================
// Ensotek – Public Services Controller
// =============================================================

import type { RouteHandler } from 'fastify';

import { serviceListQuerySchema, type ServiceListQuery } from './validation';
import {
  listServices,
  getServiceMergedById,
  getServiceMergedBySlug,
  listServiceImages,
} from './repository';

// ✅ Dinamik locale/def locale DB’den
import { getAppLocales, getDefaultLocale } from '@/modules/siteSettings/service';
import { normalizeLocale } from '@/core/i18n'; // sadece normalize için kullanıyoruz

type LocaleCode = string;
type LocaleQueryLike = { locale?: string; default_locale?: string };

function normalizeLooseLocale(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (!s) return null;
  return normalizeLocale(s) || s.toLowerCase();
}

/**
 * Public endpoint'ler için DİNAMİK locale çözümü:
 *  - locale: query.locale > req.locale > db default_locale > ilk app_locales > "de"
 *  - default_locale: query.default_locale > db default_locale > "de"
 *
 * Ayrıca: locale app_locales içinde değilse default’a düşer.
 */
async function resolveLocalesPublic(
  req: any,
  query?: LocaleQueryLike,
): Promise<{ locale: LocaleCode; def: LocaleCode }> {
  const q = query ?? ((req.query ?? {}) as LocaleQueryLike);

  const reqRaw = normalizeLooseLocale(q.locale) ?? normalizeLooseLocale(req.locale);
  const defRawFromQuery = normalizeLooseLocale(q.default_locale);

  const appLocales = await getAppLocales(reqRaw);
  const dbDefault = normalizeLooseLocale(await getDefaultLocale(reqRaw)) ?? 'de';

  const safeDefault: string = appLocales.includes(dbDefault) ? dbDefault : appLocales[0] ?? 'de';
  const safeLocale: string = reqRaw && appLocales.includes(reqRaw) ? reqRaw : safeDefault;

  const safeDef: string =
    defRawFromQuery && appLocales.includes(defRawFromQuery) ? defRawFromQuery : safeDefault;

  return { locale: safeLocale, def: safeDef };
}

/* ----------------------------- LIST (PUBLIC) ----------------------------- */

export const listServicesPublic: RouteHandler<{ Querystring: ServiceListQuery }> = async (
  req,
  reply,
) => {
  const parsed = serviceListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: 'invalid_query', issues: parsed.error.issues },
    });
  }

  const q = parsed.data;

  const { locale, def } = await resolveLocalesPublic(req, {
    locale: q.locale,
    default_locale: q.default_locale,
  });

  // Public tarafta default: sadece aktif kayıtlar
  const isActive = typeof q.is_active === 'undefined' ? true : q.is_active;

  const { items, total } = await listServices({
    locale,
    defaultLocale: def,
    orderParam: typeof q.order === 'string' ? q.order : undefined,
    sort: q.sort,
    order: q.orderDir,
    limit: q.limit,
    offset: q.offset,
    q: q.q,
    type: q.type,
    category_id: q.category_id,
    sub_category_id: q.sub_category_id,
    featured: q.featured,
    is_active: isActive,
  });

  reply.header('x-total-count', String(total ?? 0));
  return reply.send(items);
};

/* ----------------------------- GET BY ID (PUBLIC) ----------------------------- */

export const getServicePublic: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const { locale, def } = await resolveLocalesPublic(req);

  const row = await getServiceMergedById(locale, def, req.params.id);
  if (!row || row.is_active !== 1) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  return reply.send(row);
};

/* ----------------------------- GET BY SLUG (PUBLIC) ----------------------------- */

export const getServiceBySlugPublic: RouteHandler<{ Params: { slug: string } }> = async (
  req,
  reply,
) => {
  const { locale, def } = await resolveLocalesPublic(req);

  const row = await getServiceMergedBySlug(locale, def, req.params.slug);
  if (!row || row.is_active !== 1) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  return reply.send(row);
};

/* ----------------------------- IMAGES (PUBLIC) ----------------------------- */

export const listServiceImagesPublic: RouteHandler<{ Params: { id: string } }> = async (
  req,
  reply,
) => {
  const { locale, def } = await resolveLocalesPublic(req);

  const rows = await listServiceImages({
    serviceId: req.params.id,
    locale,
    defaultLocale: def,
    onlyActive: true,
  });

  return reply.send(rows);
};
