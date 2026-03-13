// =============================================================
// FILE: src/modules/categories/admin.controller.ts  (FINAL FIXED)
// =============================================================
import type { RouteHandler } from 'fastify';
import { db } from '@/db/client';
import { categories, categoryI18n } from './schema';
import { and, or, like, eq, sql, asc, desc } from 'drizzle-orm';
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  categorySetImageSchema,
  type CategoryCreateInput,
  type CategoryUpdateInput,
  type CategorySetImageInput,
} from './validation';
import { storageAssets } from '@/modules/storage/schema';
import { buildPublicUrl } from '@/modules/storage/_util';
import { randomUUID } from 'crypto';
import {
  toBool,
  toBoolOrUndefined,
  toInt,
  nullIfEmpty,
  isDuplicateError,
  normalizeLocale,
  getLocalesForCreate,
  buildBasePayload,
  buildI18nRows,
} from '@/modules/_shared';
import { CATEGORY_VIEW_FIELDS, fetchCategoryViewByIdAndLocale } from './helpers';

export type AdminListCategoriesQS = {
  q?: string;
  is_active?: string | boolean;
  is_featured?: string | boolean;
  limit?: number | string;
  offset?: number | string;
  sort?: 'display_order' | 'name' | 'created_at' | 'updated_at';
  order?: 'asc' | 'desc';
  locale?: string;
  module_key?: string;
};

/** POST /categories (admin) */
export const adminCreateCategory: RouteHandler<{
  Body: CategoryCreateInput;
}> = async (req, reply) => {
  const parsed = categoryCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn(
      { where: 'adminCreateCategory', body: req.body, issues: parsed.error.flatten() },
      'category create invalid_body',
    );
    return reply.code(400).send({
      error: { message: 'invalid_body', issues: parsed.error.flatten() },
    });
  }

  const data = parsed.data;

  const baseId = data.id ?? randomUUID();
  const baseLocale = normalizeLocale(data.locale) ?? 'de';
  const locales = getLocalesForCreate(baseLocale);

  const basePayload = {
    id: baseId,
    ...buildBasePayload(data),
  };

  const i18nRows = buildI18nRows(baseId, locales, {
    name: data.name,
    slug: data.slug,
    description: data.description,
    alt: data.alt,
    i18n_data: (data as any).i18n_data,
  });

  try {
    await db.transaction(async (tx) => {
      await tx.insert(categories).values(basePayload as any);
      await tx.insert(categoryI18n).values(i18nRows as any);
    });
  } catch (err: any) {
    if (isDuplicateError(err)) return reply.code(409).send({ error: { message: 'duplicate_slug' } });
    return reply
      .code(500)
      .send({ error: { message: 'db_error', detail: String(err?.message ?? err) } });
  }

  const created = await fetchCategoryViewByIdAndLocale(baseId, baseLocale);
  return reply.code(201).send(created);
};

/** PUT /categories/:id (admin) */
export const adminPutCategory: RouteHandler<{
  Params: { id: string };
  Body: CategoryUpdateInput;
}> = async (req, reply) => {
  const { id } = req.params;

  const parsed = categoryUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn(
      { where: 'adminPutCategory', id, body: req.body, issues: parsed.error.flatten() },
      'category put invalid_body',
    );
    return reply.code(400).send({
      error: { message: 'invalid_body', issues: parsed.error.flatten() },
    });
  }

  const patch = parsed.data;
  const targetLocale = normalizeLocale(patch.locale) ?? 'de';

  const baseSet: Record<string, unknown> = { updated_at: sql`CURRENT_TIMESTAMP(3)` };
  const i18nSet: Record<string, unknown> = { updated_at: sql`CURRENT_TIMESTAMP(3)` };
  let hasBase = false;
  let hasI18n = false;

  if (patch.module_key !== undefined) {
    baseSet.module_key = String(patch.module_key).trim().slice(0, 64);
    hasBase = true;
  }
  if (patch.image_url !== undefined) {
    baseSet.image_url = nullIfEmpty(patch.image_url);
    hasBase = true;
  }
  if ((patch as any).storage_asset_id !== undefined) {
    baseSet.storage_asset_id = nullIfEmpty((patch as any).storage_asset_id);
    hasBase = true;
  }
  if (patch.icon !== undefined) {
    baseSet.icon = nullIfEmpty(patch.icon);
    hasBase = true;
  }
  if (patch.is_active !== undefined) {
    baseSet.is_active = toBool(patch.is_active);
    hasBase = true;
  }
  if (patch.is_featured !== undefined) {
    baseSet.is_featured = toBool(patch.is_featured);
    hasBase = true;
  }
  if (patch.display_order !== undefined) {
    baseSet.display_order = Number(patch.display_order) || 0;
    hasBase = true;
  }

  if (patch.name !== undefined) {
    i18nSet.name = String(patch.name).trim();
    hasI18n = true;
  }
  if (patch.slug !== undefined) {
    i18nSet.slug = String(patch.slug).trim();
    hasI18n = true;
  }
  if (patch.description !== undefined) {
    i18nSet.description = nullIfEmpty(patch.description);
    hasI18n = true;
  }
  if (patch.alt !== undefined) {
    const altVal = nullIfEmpty(patch.alt);
    i18nSet.alt = altVal;
    baseSet.alt = altVal;
    hasI18n = true;
    hasBase = true;
  }
  if ((patch as any).i18n_data !== undefined) {
    const jsonVal = (patch as any).i18n_data;
    i18nSet.i18n_data = jsonVal ? JSON.stringify(jsonVal) : null;
    hasI18n = true;
  }

  try {
    await db.transaction(async (tx) => {
      if (hasBase) {
        await tx
          .update(categories)
          .set(baseSet as any)
          .where(eq(categories.id, id));
      }
      if (hasI18n) {
        await tx
          .update(categoryI18n)
          .set(i18nSet as any)
          .where(and(eq(categoryI18n.category_id, id), eq(categoryI18n.locale, targetLocale)));
      }
    });
  } catch (err: any) {
    if (isDuplicateError(err)) return reply.code(409).send({ error: { message: 'duplicate_slug' } });
    return reply
      .code(500)
      .send({ error: { message: 'db_error', detail: String(err?.message ?? err) } });
  }

  const row = await fetchCategoryViewByIdAndLocale(id, targetLocale);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

/** PATCH /categories/:id (admin) */
export const adminPatchCategory: RouteHandler<{
  Params: { id: string };
  Body: CategoryUpdateInput;
}> = async (req, reply) => {
  const { id } = req.params;

  const parsed = categoryUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn(
      { where: 'adminPatchCategory', id, body: req.body, issues: parsed.error.flatten() },
      'category patch invalid_body',
    );
    return reply.code(400).send({
      error: { message: 'invalid_body', issues: parsed.error.flatten() },
    });
  }

  const patch = parsed.data;
  const targetLocale = normalizeLocale(patch.locale) ?? 'de';

  const baseSet: Record<string, unknown> = { updated_at: sql`CURRENT_TIMESTAMP(3)` };
  const i18nSet: Record<string, unknown> = { updated_at: sql`CURRENT_TIMESTAMP(3)` };
  let hasBase = false;
  let hasI18n = false;

  if (patch.module_key !== undefined) {
    baseSet.module_key = String(patch.module_key).trim().slice(0, 64);
    hasBase = true;
  }
  if (patch.image_url !== undefined) {
    baseSet.image_url = nullIfEmpty(patch.image_url);
    hasBase = true;
  }
  if ((patch as any).storage_asset_id !== undefined) {
    baseSet.storage_asset_id = nullIfEmpty((patch as any).storage_asset_id);
    hasBase = true;
  }
  if (patch.icon !== undefined) {
    baseSet.icon = nullIfEmpty(patch.icon);
    hasBase = true;
  }
  if (patch.is_active !== undefined) {
    baseSet.is_active = toBool(patch.is_active);
    hasBase = true;
  }
  if (patch.is_featured !== undefined) {
    baseSet.is_featured = toBool(patch.is_featured);
    hasBase = true;
  }
  if (patch.display_order !== undefined) {
    baseSet.display_order = Number(patch.display_order) || 0;
    hasBase = true;
  }

  if (patch.name !== undefined) {
    i18nSet.name = String(patch.name).trim();
    hasI18n = true;
  }
  if (patch.slug !== undefined) {
    i18nSet.slug = String(patch.slug).trim();
    hasI18n = true;
  }
  if (patch.description !== undefined) {
    i18nSet.description = nullIfEmpty(patch.description);
    hasI18n = true;
  }
  if (patch.alt !== undefined) {
    const altVal = nullIfEmpty(patch.alt);
    i18nSet.alt = altVal;
    baseSet.alt = altVal;
    hasI18n = true;
    hasBase = true;
  }
  if ((patch as any).i18n_data !== undefined) {
    const jsonVal = (patch as any).i18n_data;
    i18nSet.i18n_data = jsonVal ? JSON.stringify(jsonVal) : null;
    hasI18n = true;
  }

  try {
    await db.transaction(async (tx) => {
      if (hasBase) {
        await tx
          .update(categories)
          .set(baseSet as any)
          .where(eq(categories.id, id));
      }
      if (hasI18n) {
        await tx
          .update(categoryI18n)
          .set(i18nSet as any)
          .where(and(eq(categoryI18n.category_id, id), eq(categoryI18n.locale, targetLocale)));
      }
    });
  } catch (err: any) {
    if (isDuplicateError(err)) return reply.code(409).send({ error: { message: 'duplicate_slug' } });
    return reply
      .code(500)
      .send({ error: { message: 'db_error', detail: String(err?.message ?? err) } });
  }

  const row = await fetchCategoryViewByIdAndLocale(id, targetLocale);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

/** DELETE /categories/:id (admin) */
export const adminDeleteCategory: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const { id } = req.params;
  await db.delete(categories).where(eq(categories.id, id));
  return reply.code(204).send();
};

/** POST /categories/reorder (admin) */
export const adminReorderCategories: RouteHandler<{
  Body: { items: Array<{ id: string; display_order: number }> };
}> = async (req, reply) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length) return reply.send({ ok: true });

  for (const it of items) {
    const n = Number(it.display_order) || 0;
    await db
      .update(categories)
      .set({ display_order: n, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
      .where(eq(categories.id, it.id));
  }

  return reply.send({ ok: true });
};

/** PATCH /categories/:id/active (admin) */
export const adminToggleActive: RouteHandler<{
  Params: { id: string };
  Body: { is_active: boolean };
  Querystring?: { locale?: string };
}> = async (req, reply) => {
  const { id } = req.params;
  const v = !!req.body?.is_active;

  await db
    .update(categories)
    .set({ is_active: v, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
    .where(eq(categories.id, id));

  const loc = normalizeLocale((req.query as any)?.locale) ?? 'de';
  const row = await fetchCategoryViewByIdAndLocale(id, loc);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

/** PATCH /categories/:id/featured (admin) */
export const adminToggleFeatured: RouteHandler<{
  Params: { id: string };
  Body: { is_featured: boolean };
  Querystring?: { locale?: string };
}> = async (req, reply) => {
  const { id } = req.params;
  const v = !!req.body?.is_featured;

  await db
    .update(categories)
    .set({ is_featured: v, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
    .where(eq(categories.id, id));

  const loc = normalizeLocale((req.query as any)?.locale) ?? 'de';
  const row = await fetchCategoryViewByIdAndLocale(id, loc);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

/** ✅ PATCH /categories/:id/image (admin) */
export const adminSetCategoryImage: RouteHandler<{
  Params: { id: string };
  Querystring?: { locale?: string };
  Body: CategorySetImageInput;
}> = async (req, reply) => {
  const { id } = req.params;

  const parsed = categorySetImageSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    req.log.warn(
      { where: 'adminSetCategoryImage', id, body: req.body, issues: parsed.error.flatten() },
      'category setImage invalid_body',
    );
    return reply.code(400).send({
      error: { message: 'invalid_body', issues: parsed.error.flatten() },
    });
  }

  // ✅ validation FINAL: assetId = storage_asset_id (transform)
  const assetId = (parsed.data as any).storage_asset_id ?? null;
  const alt = (parsed.data as any).alt; // null | string | undefined

  const targetLocale = normalizeLocale(req.query?.locale) ?? 'de';

  // Görseli kaldır
  if (!assetId) {
    await db.transaction(async (tx) => {
      const basePatch: Record<string, unknown> = {
        image_url: null,
        storage_asset_id: null,
        updated_at: sql`CURRENT_TIMESTAMP(3)`,
      };

      if (alt !== undefined) {
        basePatch.alt = alt as string | null;
      }

      await tx
        .update(categories)
        .set(basePatch as any)
        .where(eq(categories.id, id));

      if (alt !== undefined) {
        await tx
          .update(categoryI18n)
          .set({ alt: alt as string | null, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
          .where(and(eq(categoryI18n.category_id, id), eq(categoryI18n.locale, targetLocale)));
      }
    });

    const row = await fetchCategoryViewByIdAndLocale(id, targetLocale);
    if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
    return reply.send(row);
  }

  // Asset’i getir
  const [asset] = await db
    .select({
      bucket: storageAssets.bucket,
      path: storageAssets.path,
      url: storageAssets.url,
    })
    .from(storageAssets)
    .where(eq(storageAssets.id, assetId))
    .limit(1);

  if (!asset) {
    return reply.code(404).send({ error: { message: 'asset_not_found' } });
  }

  const publicUrl = buildPublicUrl(asset.bucket, asset.path, asset.url ?? null);

  await db.transaction(async (tx) => {
    const basePatch: Record<string, unknown> = {
      image_url: publicUrl,
      storage_asset_id: assetId,
      updated_at: sql`CURRENT_TIMESTAMP(3)`,
    };

    if (alt !== undefined) {
      basePatch.alt = alt as string | null;
    }

    await tx
      .update(categories)
      .set(basePatch as any)
      .where(eq(categories.id, id));

    if (alt !== undefined) {
      await tx
        .update(categoryI18n)
        .set({ alt: alt as string | null, updated_at: sql`CURRENT_TIMESTAMP(3)` } as any)
        .where(and(eq(categoryI18n.category_id, id), eq(categoryI18n.locale, targetLocale)));
    }
  });

  const row = await fetchCategoryViewByIdAndLocale(id, targetLocale);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

/** ✅ LIST /categories/list — locale + module_key ile filtrelenebilir */
export const adminListCategories: RouteHandler<{ Querystring: AdminListCategoriesQS }> = async (
  req,
  reply,
) => {
  const {
    q,
    is_active,
    is_featured,
    limit = 500,
    offset = 0,
    sort = 'display_order',
    order = 'asc',
    locale,
    module_key,
  } = req.query ?? {};

  const conds: any[] = [];

  const effectiveLocale = normalizeLocale(locale) ?? 'de';
  conds.push(eq(categoryI18n.locale, effectiveLocale));

  if (q && q.trim()) {
    const pattern = `%${q.trim()}%`;
    conds.push(or(like(categoryI18n.name, pattern), like(categoryI18n.slug, pattern)));
  }

  const a = toBoolOrUndefined(is_active);
  if (a !== undefined) conds.push(eq(categories.is_active, a));
  const f = toBoolOrUndefined(is_featured);
  if (f !== undefined) conds.push(eq(categories.is_featured, f));

  if (module_key && module_key.trim()) conds.push(eq(categories.module_key, module_key.trim()));

  const col =
    sort === 'name'
      ? categoryI18n.name
      : sort === 'created_at'
      ? categories.created_at
      : sort === 'updated_at'
      ? categories.updated_at
      : categories.display_order;

  let qb = db
    .select(CATEGORY_VIEW_FIELDS)
    .from(categories)
    .innerJoin(categoryI18n, eq(categoryI18n.category_id, categories.id))
    .$dynamic();

  if (conds.length) qb = qb.where(and(...conds));

  const rows = await qb
    .orderBy(order === 'desc' ? desc(col) : asc(col))
    .limit(toInt(limit, 500))
    .offset(toInt(offset, 0));

  // Parse i18n_data JSON strings
  const parsed = rows.map((row) => {
    if (row.i18n_data && typeof row.i18n_data === 'string') {
      try {
        return { ...row, i18n_data: JSON.parse(row.i18n_data) };
      } catch {
        return { ...row, i18n_data: {} };
      }
    }
    return row;
  });

  return reply.send(parsed);
};

export const adminGetCategoryById: RouteHandler<{
  Params: { id: string };
  Querystring: { locale?: string };
}> = async (req, reply) => {
  const { id } = req.params;
  const effectiveLocale = normalizeLocale(req.query?.locale) ?? 'de';

  const row = await fetchCategoryViewByIdAndLocale(id, effectiveLocale);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

export const adminGetCategoryBySlug: RouteHandler<{
  Params: { slug: string };
  Querystring: { locale?: string; module_key?: string };
}> = async (req, reply) => {
  const { slug } = req.params;
  const effectiveLocale = normalizeLocale(req.query?.locale) ?? 'de';
  const moduleKey =
    typeof req.query?.module_key === 'string' && req.query.module_key.trim()
      ? req.query.module_key.trim()
      : undefined;

  const conds: any[] = [eq(categoryI18n.slug, slug), eq(categoryI18n.locale, effectiveLocale)];
  if (moduleKey) conds.push(eq(categories.module_key, moduleKey));

  const rows = await db
    .select(CATEGORY_VIEW_FIELDS)
    .from(categories)
    .innerJoin(categoryI18n, eq(categoryI18n.category_id, categories.id))
    .where(and(...conds))
    .limit(1);

  if (!rows.length) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(rows[0]);
};
