// src/modules/library/controller.ts
// =============================================================
// Ensotek – Public Library Controller (DYNAMIC LOCALES + FILES)
// =============================================================

import type { RouteHandler } from 'fastify';

import { libraryListQuerySchema, type LibraryListQuery } from './validation';
import {
  listLibrary,
  getLibraryMergedById,
  getLibraryMergedBySlug,
  listLibraryImages,
  listLibraryFiles,
} from './repository';

import {
  ensureLocalesLoadedFromSettings,
  LOCALES,
  normalizeLocale,
  isSupported,
  getRuntimeDefaultLocale,
} from '@/core/i18n';

type LocaleCode = string;
type LocaleQueryLike = { locale?: string; default_locale?: string };

async function resolveLocalesPublic(
  req: { locale?: string; headers?: Record<string, unknown> },
  q?: LocaleQueryLike,
): Promise<{ locale: LocaleCode; def: LocaleCode }> {
  // ✅ runtime locales load (site_settings.app_locales + default_locale)
  await ensureLocalesLoadedFromSettings();

  const fallback = (LOCALES[0] as string) || (getRuntimeDefaultLocale() as string) || 'de';

  const pick = (raw?: string | null): string | null => {
    const n = normalizeLocale(raw);
    if (!n) return null;
    // isSupported uses LOCALES (mutated runtime) -> dynamic
    if (isSupported(n)) return n;
    return null;
  };

  // locale (primary)
  const qLocale = pick(q?.locale);
  const reqLocale = pick(req?.locale);
  const runtimeDef = pick(getRuntimeDefaultLocale() as unknown as string);

  const locale = qLocale || reqLocale || runtimeDef || fallback;

  // default_locale (fallback locale)
  const qDef = pick(q?.default_locale);
  const def = qDef || runtimeDef || fallback;

  return { locale, def };
}

/* ----------------------------- LIST (PUBLIC) ----------------------------- */

export const listLibraryPublic: RouteHandler<{ Querystring: LibraryListQuery }> = async (
  req,
  reply,
) => {
  const parsed = libraryListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: 'invalid_query', issues: parsed.error.issues },
    });
  }

  const q = parsed.data;

  const { locale, def } = await resolveLocalesPublic(req as any, {
    locale: q.locale,
    default_locale: q.default_locale,
  });

  // Public tarafta default: sadece aktif kayıtlar
  const isActive = typeof q.is_active === 'undefined' ? true : q.is_active;

  const { items, total } = await listLibrary({
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

    // public: sadece active (opsiyonel featured filtresi serbest)
    featured: q.featured,
    is_active: isActive,

    // (varsa validation’da) yayın/published filtrelerini public’te istemiyorsan burada göndermeyebilirsin
  });

  reply.header('x-total-count', String(total ?? 0));
  return reply.send(items);
};

/* ----------------------------- GET BY ID (PUBLIC) ----------------------------- */

export const getLibraryPublic: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const { locale, def } = await resolveLocalesPublic(req as any);

  const row = await getLibraryMergedById(locale, def, req.params.id);
  if (!row || row.is_active !== 1) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  return reply.send(row);
};

/* ----------------------------- GET BY SLUG (PUBLIC) ----------------------------- */

export const getLibraryBySlugPublic: RouteHandler<{ Params: { slug: string } }> = async (
  req,
  reply,
) => {
  const { locale, def } = await resolveLocalesPublic(req as any);

  const row = await getLibraryMergedBySlug(locale, def, req.params.slug);
  if (!row || row.is_active !== 1) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  return reply.send(row);
};

/* ----------------------------- IMAGES (PUBLIC) ----------------------------- */

export const listLibraryImagesPublic: RouteHandler<{ Params: { id: string } }> = async (
  req,
  reply,
) => {
  const { locale, def } = await resolveLocalesPublic(req as any);

  const rows = await listLibraryImages({
    libraryId: req.params.id,
    locale,
    defaultLocale: def,
    onlyActive: true,
  });

  return reply.send(rows);
};

/* ----------------------------- FILES (PUBLIC) ----------------------------- */

export const listLibraryFilesPublic: RouteHandler<{ Params: { id: string } }> = async (
  req,
  reply,
) => {
  // locale şu an file tablosunda yok; ama public endpoint standardı için resolver’ı yine çalıştırıyoruz
  await resolveLocalesPublic(req as any);

  const rows = await listLibraryFiles({
    libraryId: req.params.id,
    onlyActive: true,
  });

  return reply.send(rows);
};
