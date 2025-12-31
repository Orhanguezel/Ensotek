// src/modules/library/admin.controller.ts
// =============================================================
// Ensotek – Admin Library Controller (DYNAMIC LOCALES + FILES)
// FIX:
// - published_at PATCH/POST body'den string gelebiliyor.
// - Drizzle datetime(mode:"date") Date beklediği için string gelince
//   "value.toISOString is not a function" 500 hatası oluşuyordu.
// - Bu dosyada published_at artık Date/null'a normalize edilir.
//
// EXTRA FIX (COVER IMAGE PERSIST/UI COMPAT):
// - featured_image ile image_url aynı "kapak" anlamında kullanılabiliyor.
// - FE bazen featured_image okuyor, bazen image_url set ediyor.
// - Bu yüzden create/update sırasında iki alanı senkron tutuyoruz.
// =============================================================

import type { RouteHandler } from 'fastify';
import { randomUUID } from 'crypto';

import {
  libraryListQuerySchema,
  upsertLibraryBodySchema,
  patchLibraryBodySchema,
  upsertLibraryImageBodySchema,
  patchLibraryImageBodySchema,
  upsertLibraryFileBodySchema,
  patchLibraryFileBodySchema,
  type LibraryListQuery,
  type UpsertLibraryBody,
  type PatchLibraryBody,
  type UpsertLibraryImageBody,
  type PatchLibraryImageBody,
  type UpsertLibraryFileBody,
  type PatchLibraryFileBody,
} from './validation';

import {
  listLibrary,
  getLibraryMergedById,
  getLibraryMergedBySlug,
  createLibraryParent,
  upsertLibraryI18n,
  upsertLibraryI18nAllLocales,
  updateLibraryParent,
  deleteLibraryParent,
  listLibraryImages,
  createLibraryImage,
  upsertLibraryImageI18n,
  upsertLibraryImageI18nAllLocales,
  updateLibraryImage,
  deleteLibraryImage,
  reorderLibrary,

  // FILES
  listLibraryFiles,
  createLibraryFile,
  updateLibraryFile,
  deleteLibraryFile,
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

const toBool = (v: unknown): boolean => v === true || v === 1 || v === '1' || v === 'true';
const to01 = (v: unknown): 0 | 1 | undefined => {
  if (v === true || v === 1 || v === '1' || v === 'true') return 1;
  if (v === false || v === 0 || v === '0' || v === 'false') return 0;
  return undefined;
};

/**
 * ✅ Date normalization:
 * - API body'den "2025-12-31T03:32:12.432Z" gibi ISO string gelebilir.
 * - Drizzle datetime(mode:"date") Date bekler.
 */
const toDateOrNull = (value: unknown): Date | null => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : null;

  if (typeof value === 'string') {
    const s = value.trim();
    if (!s) return null;

    const d = new Date(s);
    return Number.isFinite(d.getTime()) ? d : null;
  }

  // bazı client’lar timestamp number gönderebilir
  if (typeof value === 'number') {
    const d = new Date(value);
    return Number.isFinite(d.getTime()) ? d : null;
  }

  return null;
};

/**
 * ✅ Cover normalization (featured_image <-> image_url):
 * - Eğer iki alandan sadece biri geldiyse, diğerini de aynı değere set ederiz.
 * - Eğer ikisi de geldiyse dokunmayız (explicit override).
 * - Eğer ikisi de undefined ise dokunmayız.
 */
const normalizeCoverPatch = (
  b: any,
  patch: Record<string, any>,
): { hasAny: boolean; coverUrl: string | null | undefined } => {
  const hasImageUrl = typeof b.image_url !== 'undefined';
  const hasFeaturedImage = typeof b.featured_image !== 'undefined';

  // explicit set
  if (hasImageUrl) patch.image_url = b.image_url ?? null;
  if (hasFeaturedImage) patch.featured_image = b.featured_image ?? null;

  // alias sync
  if (hasImageUrl && !hasFeaturedImage) {
    patch.featured_image = b.image_url ?? null;
  }
  if (!hasImageUrl && hasFeaturedImage) {
    patch.image_url = b.featured_image ?? null;
  }

  const hasAny = hasImageUrl || hasFeaturedImage;
  const coverUrl = hasImageUrl
    ? b.image_url ?? null
    : hasFeaturedImage
    ? b.featured_image ?? null
    : undefined;

  return { hasAny, coverUrl };
};

async function resolveLocales(
  req: any,
  query?: LocaleQueryLike,
): Promise<{ locale: LocaleCode; def: LocaleCode }> {
  await ensureLocalesLoadedFromSettings();

  const pick = (raw?: unknown): string | null => {
    if (typeof raw !== 'string') return null;
    const n = normalizeLocale(raw);
    if (!n) return null;
    return isSupported(n) ? n : null;
  };

  const fallback = (LOCALES[0] as string) || (getRuntimeDefaultLocale() as string) || 'de';

  const q = query ?? req?.query ?? {};
  const qLocale = pick(q.locale);
  const qDef = pick(q.default_locale);

  const reqLocale = pick(req?.locale);
  const runtimeDef = pick(getRuntimeDefaultLocale() as unknown as string);

  const locale = qLocale || reqLocale || runtimeDef || fallback;
  const def = qDef || runtimeDef || fallback;

  return { locale, def };
}

/* ----------------------------- list/get ----------------------------- */

export const listLibraryAdmin: RouteHandler<{ Querystring: LibraryListQuery }> = async (
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
  const { locale, def } = await resolveLocales(req, {
    locale: q.locale,
    default_locale: q.default_locale,
  });

  const { items, total } = await listLibrary({
    locale,
    defaultLocale: def,
    orderParam: typeof q.order === 'string' ? q.order : undefined,
    sort: q.sort,
    order: q.orderDir,
    limit: q.limit,
    offset: q.offset,

    q: q.q,
    type: (q as any).type,

    category_id: q.category_id,
    sub_category_id: q.sub_category_id,

    featured: (q as any).featured,
    is_active: q.is_active,
  });

  reply.header('x-total-count', String(total ?? 0));
  return reply.send(items);
};

export const getLibraryAdmin: RouteHandler<{
  Params: { id: string };
  Querystring: LocaleQueryLike;
}> = async (req, reply) => {
  const { locale, def } = await resolveLocales(req);
  const row = await getLibraryMergedById(locale, def, req.params.id);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

export const getLibraryBySlugAdmin: RouteHandler<{
  Params: { slug: string };
  Querystring: LocaleQueryLike;
}> = async (req, reply) => {
  const { locale, def } = await resolveLocales(req);
  const row = await getLibraryMergedBySlug(locale, def, req.params.slug);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

/* ----------------------------- create/update/delete (library) ----------------------------- */

export const createLibraryAdmin: RouteHandler<{
  Body: UpsertLibraryBody;
  Querystring: LocaleQueryLike;
}> = async (req, reply) => {
  const parsed = upsertLibraryBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', issues: parsed.error.issues } });
  }
  const b = parsed.data;

  const id = randomUUID();
  const now = new Date();

  const featured01 = to01((b as any).featured) ?? 0;
  const active01 = to01((b as any).is_active) ?? 1;
  const published01 = to01((b as any).is_published) ?? 0;

  // ✅ FIX: published_at normalize
  const publishedAt =
    typeof (b as any).published_at !== 'undefined' ? toDateOrNull((b as any).published_at) : null;

  // ✅ Cover (featured_image <-> image_url) normalize on CREATE
  // - create'da tek kaynak coverUrl, iki kolona da yaz.
  const coverUrl =
    typeof (b as any).image_url !== 'undefined'
      ? (b as any).image_url ?? null
      : typeof (b as any).featured_image !== 'undefined'
      ? (b as any).featured_image ?? null
      : null;

  await createLibraryParent({
    id,
    type: typeof (b as any).type === 'string' ? (b as any).type : 'other',

    category_id: typeof b.category_id !== 'undefined' ? b.category_id ?? null : null,
    sub_category_id: typeof b.sub_category_id !== 'undefined' ? b.sub_category_id ?? null : null,

    featured: featured01,
    is_published: published01,
    is_active: active01,
    display_order: typeof b.display_order === 'number' ? b.display_order : 0,

    // ✅ write both
    featured_image: coverUrl,
    image_url: coverUrl,
    image_asset_id:
      typeof (b as any).image_asset_id !== 'undefined' ? (b as any).image_asset_id ?? null : null,

    published_at: publishedAt as any,

    created_at: now as any,
    updated_at: now as any,
  } as any);

  const hasI18nFields =
    typeof (b as any).name !== 'undefined' ||
    typeof (b as any).slug !== 'undefined' ||
    typeof (b as any).description !== 'undefined' ||
    typeof (b as any).image_alt !== 'undefined' ||
    typeof (b as any).tags !== 'undefined' ||
    typeof (b as any).meta_title !== 'undefined' ||
    typeof (b as any).meta_description !== 'undefined' ||
    typeof (b as any).meta_keywords !== 'undefined';

  const { locale: reqLocale, def } = await resolveLocales(req, { locale: (b as any).locale });

  if (hasI18nFields) {
    if (!((b as any).name && (b as any).slug)) {
      return reply.code(400).send({ error: { message: 'missing_required_translation_fields' } });
    }

    const payload = {
      name: String((b as any).name).trim(),
      slug: String((b as any).slug).trim(),
      description:
        typeof (b as any).description !== 'undefined' ? (b as any).description : undefined,
      image_alt: typeof (b as any).image_alt !== 'undefined' ? (b as any).image_alt : undefined,
      tags: typeof (b as any).tags !== 'undefined' ? (b as any).tags : undefined,
      meta_title: typeof (b as any).meta_title !== 'undefined' ? (b as any).meta_title : undefined,
      meta_description:
        typeof (b as any).meta_description !== 'undefined'
          ? (b as any).meta_description
          : undefined,
      meta_keywords:
        typeof (b as any).meta_keywords !== 'undefined' ? (b as any).meta_keywords : undefined,
    };

    const replicateAll = (b as any).replicate_all_locales ?? true;
    if (replicateAll) {
      await upsertLibraryI18nAllLocales(id, payload as any);
    } else {
      await upsertLibraryI18n(id, reqLocale, payload as any);
    }
  }

  const row = await getLibraryMergedById(reqLocale, def, id);
  return reply.code(201).send(row);
};

export const updateLibraryAdmin: RouteHandler<{
  Params: { id: string };
  Body: PatchLibraryBody;
  Querystring: LocaleQueryLike;
}> = async (req, reply) => {
  const parsed = patchLibraryBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', issues: parsed.error.issues } });
  }
  const b = parsed.data;

  // parent patch
  const parentPatch: any = {};
  if (typeof (b as any).type !== 'undefined') parentPatch.type = (b as any).type;

  if (typeof b.category_id !== 'undefined') parentPatch.category_id = b.category_id ?? null;
  if (typeof b.sub_category_id !== 'undefined')
    parentPatch.sub_category_id = b.sub_category_id ?? null;

  if (typeof (b as any).featured !== 'undefined')
    parentPatch.featured = to01((b as any).featured) ?? 0;
  if (typeof (b as any).is_published !== 'undefined')
    parentPatch.is_published = to01((b as any).is_published) ?? 0;
  if (typeof (b as any).is_active !== 'undefined')
    parentPatch.is_active = to01((b as any).is_active) ?? 1;

  if (typeof b.display_order !== 'undefined') parentPatch.display_order = b.display_order;

  // ✅ Cover fields sync (featured_image <-> image_url)
  normalizeCoverPatch(b as any, parentPatch);

  // asset id
  if (typeof b.image_asset_id !== 'undefined')
    parentPatch.image_asset_id = b.image_asset_id ?? null;

  // ✅ FIX: published_at normalize (string -> Date)
  if (typeof (b as any).published_at !== 'undefined') {
    parentPatch.published_at = toDateOrNull((b as any).published_at);
  }

  if (Object.keys(parentPatch).length) {
    await updateLibraryParent(req.params.id, parentPatch);
  }

  // i18n patch
  const hasI18n =
    typeof (b as any).name !== 'undefined' ||
    typeof (b as any).slug !== 'undefined' ||
    typeof (b as any).description !== 'undefined' ||
    typeof (b as any).image_alt !== 'undefined' ||
    typeof (b as any).tags !== 'undefined' ||
    typeof (b as any).meta_title !== 'undefined' ||
    typeof (b as any).meta_description !== 'undefined' ||
    typeof (b as any).meta_keywords !== 'undefined';

  if (hasI18n) {
    const { locale: loc } = await resolveLocales(req, { locale: (b as any).locale });

    const payload: any = {};
    if (typeof (b as any).name !== 'undefined')
      payload.name = (b as any).name?.trim?.() ?? (b as any).name;
    if (typeof (b as any).slug !== 'undefined')
      payload.slug = (b as any).slug?.trim?.() ?? (b as any).slug;
    if (typeof (b as any).description !== 'undefined') payload.description = (b as any).description;
    if (typeof (b as any).image_alt !== 'undefined') payload.image_alt = (b as any).image_alt;

    if (typeof (b as any).tags !== 'undefined') payload.tags = (b as any).tags;
    if (typeof (b as any).meta_title !== 'undefined') payload.meta_title = (b as any).meta_title;
    if (typeof (b as any).meta_description !== 'undefined')
      payload.meta_description = (b as any).meta_description;
    if (typeof (b as any).meta_keywords !== 'undefined')
      payload.meta_keywords = (b as any).meta_keywords;

    if ((b as any).apply_all_locales) {
      await upsertLibraryI18nAllLocales(req.params.id, payload);
    } else {
      await upsertLibraryI18n(req.params.id, loc, payload);
    }
  }

  const { locale, def } = await resolveLocales(req, { locale: (b as any).locale });
  const row = await getLibraryMergedById(locale, def, req.params.id);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

export const removeLibraryAdmin: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const affected = await deleteLibraryParent(req.params.id);
  if (!affected) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.code(204).send();
};

/* ----------------------------- images (gallery) ----------------------------- */

export const listLibraryImagesAdmin: RouteHandler<{
  Params: { id: string };
  Querystring: LocaleQueryLike;
}> = async (req, reply) => {
  const { locale, def } = await resolveLocales(req);
  const rows = await listLibraryImages({ libraryId: req.params.id, locale, defaultLocale: def });
  return reply.send(rows);
};

export const createLibraryImageAdmin: RouteHandler<{
  Params: { id: string };
  Body: UpsertLibraryImageBody;
  Querystring: LocaleQueryLike;
}> = async (req, reply) => {
  const parsed = upsertLibraryImageBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', issues: parsed.error.issues } });
  }
  const b = parsed.data;

  const id = randomUUID();
  const now = new Date();

  await createLibraryImage({
    id,
    library_id: req.params.id,
    image_asset_id:
      typeof (b as any).image_asset_id !== 'undefined' ? (b as any).image_asset_id ?? null : null,
    image_url: typeof (b as any).image_url !== 'undefined' ? (b as any).image_url ?? null : null,
    is_active: toBool((b as any).is_active) ? 1 : 0,
    display_order: typeof (b as any).display_order === 'number' ? (b as any).display_order : 0,
    created_at: now as any,
    updated_at: now as any,
  } as any);

  const { locale: loc, def } = await resolveLocales(req, { locale: (b as any).locale });

  const hasI18nFields =
    typeof (b as any).title !== 'undefined' ||
    typeof (b as any).alt !== 'undefined' ||
    typeof (b as any).caption !== 'undefined';

  if (hasI18nFields) {
    const payload: any = {};
    if (typeof (b as any).title !== 'undefined') payload.title = (b as any).title ?? null;
    if (typeof (b as any).alt !== 'undefined') payload.alt = (b as any).alt ?? null;
    if (typeof (b as any).caption !== 'undefined') payload.caption = (b as any).caption ?? null;

    const replicateAll = (b as any).replicate_all_locales ?? true;
    if (replicateAll) {
      await upsertLibraryImageI18nAllLocales(id, payload);
    } else {
      await upsertLibraryImageI18n(id, loc, payload);
    }
  }

  const rows = await listLibraryImages({
    libraryId: req.params.id,
    locale: loc,
    defaultLocale: def,
  });
  return reply.code(201).send(rows);
};

export const updateLibraryImageAdmin: RouteHandler<{
  Params: { id: string; imageId: string };
  Body: PatchLibraryImageBody;
  Querystring: LocaleQueryLike;
}> = async (req, reply) => {
  const parsed = patchLibraryImageBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', issues: parsed.error.issues } });
  }
  const b = parsed.data;

  const patch: any = {};
  if (typeof (b as any).image_asset_id !== 'undefined')
    patch.image_asset_id = (b as any).image_asset_id ?? null;
  if (typeof (b as any).image_url !== 'undefined') patch.image_url = (b as any).image_url ?? null;
  if (typeof (b as any).is_active !== 'undefined')
    patch.is_active = toBool((b as any).is_active) ? 1 : 0;
  if (typeof (b as any).display_order !== 'undefined')
    patch.display_order = (b as any).display_order;

  if (Object.keys(patch).length) {
    await updateLibraryImage(req.params.imageId, patch);
  }

  const hasI18nFields =
    typeof (b as any).title !== 'undefined' ||
    typeof (b as any).alt !== 'undefined' ||
    typeof (b as any).caption !== 'undefined';

  const { locale: loc, def } = await resolveLocales(req, { locale: (b as any).locale });

  if (hasI18nFields) {
    const payload: any = {};
    if (typeof (b as any).title !== 'undefined') payload.title = (b as any).title ?? null;
    if (typeof (b as any).alt !== 'undefined') payload.alt = (b as any).alt ?? null;
    if (typeof (b as any).caption !== 'undefined') payload.caption = (b as any).caption ?? null;

    if ((b as any).apply_all_locales) {
      await upsertLibraryImageI18nAllLocales(req.params.imageId, payload);
    } else {
      await upsertLibraryImageI18n(req.params.imageId, loc, payload);
    }
  }

  const rows = await listLibraryImages({
    libraryId: req.params.id,
    locale: loc,
    defaultLocale: def,
  });
  return reply.send(rows);
};

export const removeLibraryImageAdmin: RouteHandler<{
  Params: { id: string; imageId: string };
}> = async (req, reply) => {
  const affected = await deleteLibraryImage(req.params.imageId);
  if (!affected) return reply.code(404).send({ error: { message: 'not_found' } });

  const { locale, def } = await resolveLocales(req);
  const rows = await listLibraryImages({ libraryId: req.params.id, locale, defaultLocale: def });
  return reply.send(rows);
};

/* ----------------------------- reorder (display_order) ----------------------------- */

type ReorderLibraryBody = { items?: { id: string; display_order: number }[] };

export const reorderLibraryAdmin: RouteHandler<{ Body: ReorderLibraryBody }> = async (
  req,
  reply,
) => {
  const body = (req.body ?? {}) as ReorderLibraryBody;
  const items = Array.isArray(body.items) ? body.items : [];

  if (!items.length) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', details: 'items boş olamaz' } });
  }

  try {
    await reorderLibrary(items);
    return reply.code(204).send();
  } catch (err) {
    (req as any).log?.error?.({ err }, 'library_reorder_failed');
    return reply.code(500).send({ error: { message: 'reorder_failed' } });
  }
};

/* ----------------------------- FILES (admin) ----------------------------- */

export const listLibraryFilesAdmin: RouteHandler<{ Params: { id: string } }> = async (
  req,
  reply,
) => {
  const rows = await listLibraryFiles({ libraryId: req.params.id, onlyActive: false });
  return reply.send(rows);
};

export const createLibraryFileAdmin: RouteHandler<{
  Params: { id: string };
  Body: UpsertLibraryFileBody;
}> = async (req, reply) => {
  const parsed = upsertLibraryFileBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', issues: parsed.error.issues } });
  }
  const b = parsed.data;

  const id = randomUUID();
  const now = new Date();

  await createLibraryFile({
    id,
    library_id: req.params.id,
    asset_id: typeof (b as any).asset_id !== 'undefined' ? (b as any).asset_id ?? null : null,
    file_url: typeof (b as any).file_url !== 'undefined' ? (b as any).file_url ?? null : null,
    name: String((b as any).name),
    size_bytes: typeof (b as any).size_bytes !== 'undefined' ? (b as any).size_bytes ?? null : null,
    mime_type: typeof (b as any).mime_type !== 'undefined' ? (b as any).mime_type ?? null : null,
    tags_json:
      typeof (b as any).tags !== 'undefined' ? JSON.stringify((b as any).tags ?? []) : null,
    display_order: typeof (b as any).display_order === 'number' ? (b as any).display_order : 0,
    is_active: toBool((b as any).is_active) ? 1 : 0,
    created_at: now as any,
    updated_at: now as any,
  } as any);

  const rows = await listLibraryFiles({ libraryId: req.params.id, onlyActive: false });
  return reply.code(201).send(rows);
};

export const updateLibraryFileAdmin: RouteHandler<{
  Params: { id: string; fileId: string };
  Body: PatchLibraryFileBody;
}> = async (req, reply) => {
  const parsed = patchLibraryFileBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', issues: parsed.error.issues } });
  }
  const b = parsed.data as any;

  const patch: any = {};
  if (typeof b.asset_id !== 'undefined') patch.asset_id = b.asset_id ?? null;
  if (typeof b.file_url !== 'undefined') patch.file_url = b.file_url ?? null;
  if (typeof b.name !== 'undefined') patch.name = b.name;
  if (typeof b.size_bytes !== 'undefined') patch.size_bytes = b.size_bytes ?? null;
  if (typeof b.mime_type !== 'undefined') patch.mime_type = b.mime_type ?? null;
  if (typeof b.tags !== 'undefined')
    patch.tags_json = b.tags === null ? null : JSON.stringify(b.tags ?? []);
  if (typeof b.display_order !== 'undefined') patch.display_order = b.display_order;
  if (typeof b.is_active !== 'undefined') patch.is_active = toBool(b.is_active) ? 1 : 0;

  if (Object.keys(patch).length) {
    await updateLibraryFile(req.params.fileId, patch);
  }

  const rows = await listLibraryFiles({ libraryId: req.params.id, onlyActive: false });
  return reply.send(rows);
};

export const removeLibraryFileAdmin: RouteHandler<{
  Params: { id: string; fileId: string };
}> = async (req, reply) => {
  const affected = await deleteLibraryFile(req.params.fileId);
  if (!affected) return reply.code(404).send({ error: { message: 'not_found' } });

  const rows = await listLibraryFiles({ libraryId: req.params.id, onlyActive: false });
  return reply.send(rows);
};
