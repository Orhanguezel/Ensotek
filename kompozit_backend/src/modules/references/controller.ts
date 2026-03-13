// =============================================================
// FILE: src/modules/references/controller.ts  (PUBLIC)
// =============================================================
import type { RouteHandler } from 'fastify';

import {
  publicReferencesListQuerySchema,
  referenceBySlugParamsSchema,
  referenceBySlugQuerySchema,
  type PublicReferencesListQuery,
  type ReferenceBySlugQuery,
  resolveLocaleOrUndefined,
} from './validation';

import {
  listReferences,
  getReferenceMergedById,
  getReferenceMergedBySlug,
  listReferenceImagesForReference,
} from './repository';

// ✅ Core dynamic i18n
import { type Locale, ensureLocalesLoadedFromSettings, getRuntimeDefaultLocale } from '@/core/i18n';

/** LIST (public) – sadece is_published = 1 */
export const listReferencesPublic: RouteHandler = async (req, reply) => {
  // ✅ locales runtime load (app_locales / default_locale)
  await ensureLocalesLoadedFromSettings();

  const parsed = publicReferencesListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: 'invalid_query', issues: parsed.error.flatten() },
    });
  }
  const q = parsed.data as PublicReferencesListQuery;

  const runtimeDefault = getRuntimeDefaultLocale();

  // ✅ locale resolution:
  // 1) explicit query locale if supported
  // 2) req.locale (from middleware) if any
  // 3) runtime default
  const locale: Locale =
    resolveLocaleOrUndefined(q.locale as any) ??
    ((req as any).locale as Locale | undefined) ??
    runtimeDefault;

  const { items, total } = await listReferences({
    orderParam: typeof q.order === 'string' ? q.order : undefined,
    sort: q.sort,
    order: q.orderDir,
    limit: q.limit,
    offset: q.offset,
    is_published: true,
    is_featured: q.is_featured,
    q: q.q,
    slug: q.slug,
    category_id: q.category_id,
    sub_category_id: q.sub_category_id,
    module_key: q.module_key,
    has_website: q.has_website,
    locale,
    defaultLocale: runtimeDefault,
  });

  reply.header('x-total-count', String(total ?? 0));
  return reply.send(items);
};

/** GET BY ID (public) – referans + gallery, locale-aware (?locale=) */
export const getReferencePublic: RouteHandler = async (req, reply) => {
  await ensureLocalesLoadedFromSettings();

  const { id } = (req.params ?? {}) as { id: string };
  const q = (req.query ?? {}) as { locale?: string };

  const runtimeDefault = getRuntimeDefaultLocale();

  const locale: Locale =
    resolveLocaleOrUndefined(q.locale) ??
    ((req as any).locale as Locale | undefined) ??
    runtimeDefault;

  const row = await getReferenceMergedById(locale, runtimeDefault, id);
  if (!row || !row.is_published) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  const gallery = await listReferenceImagesForReference(row.id, locale, runtimeDefault);

  return reply.send({ ...row, gallery });
};

/** GET BY SLUG (public) – referans + gallery */
export const getReferenceBySlugPublic: RouteHandler = async (req, reply) => {
  await ensureLocalesLoadedFromSettings();

  const { slug } = referenceBySlugParamsSchema.parse(req.params ?? {});
  const q = referenceBySlugQuerySchema.parse(req.query ?? {}) as ReferenceBySlugQuery;

  const runtimeDefault = getRuntimeDefaultLocale();

  const locale: Locale =
    resolveLocaleOrUndefined(q.locale as any) ??
    ((req as any).locale as Locale | undefined) ??
    runtimeDefault;

  const row = await getReferenceMergedBySlug(locale, runtimeDefault, slug);
  if (!row || !row.is_published) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  const gallery = await listReferenceImagesForReference(row.id, locale, runtimeDefault);

  return reply.send({ ...row, gallery });
};
