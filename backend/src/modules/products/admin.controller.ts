// =============================================================
// FILE: src/modules/products/admin.controller.ts
// =============================================================
import type { RouteHandler } from 'fastify';
import { db } from '@/db/client';
import { z } from 'zod';
import { and, asc, desc, eq, inArray, like, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

import { products, productI18n } from './schema';
import { storageAssets } from '@/modules/storage/schema';
import {
  productCreateSchema,
  productUpdateSchema,
  productSetImagesSchema,
  type ProductSetImagesInput,
} from './validation';
import { buildPublicUrl } from '@/modules/storage/_util';

// ✅ single source locale helpers
import { getEffectiveLocale, getLocalesForCreate, normalizeLocale } from './i18n';

/* ----------------- helpers ----------------- */

const toNum = (x: any) =>
  x === null || x === undefined ? x : Number.isNaN(Number(x)) ? x : Number(x);

function normalizeProduct(row: any) {
  if (!row) return row;
  const p: any = { ...row };

  // sayısal
  p.price = toNum(p.price);
  p.rating = toNum(p.rating);
  p.review_count = toNum(p.review_count) ?? 0;
  p.stock_quantity = toNum(p.stock_quantity) ?? 0;

  // JSON kolonları string geliyorsa parse et
  if (typeof p.images === 'string') {
    try {
      p.images = JSON.parse(p.images);
    } catch {
      /* noop */
    }
  }
  if (!Array.isArray(p.images)) p.images = [];

  if (typeof p.tags === 'string') {
    try {
      p.tags = JSON.parse(p.tags);
    } catch {
      /* noop */
    }
  }
  if (!Array.isArray(p.tags)) p.tags = [];

  if (typeof p.specifications === 'string') {
    try {
      p.specifications = JSON.parse(p.specifications);
    } catch {
      /* noop */
    }
  }

  if (typeof p.storage_image_ids === 'string') {
    try {
      p.storage_image_ids = JSON.parse(p.storage_image_ids);
    } catch {
      /* noop */
    }
  }
  if (!Array.isArray(p.storage_image_ids)) {
    p.storage_image_ids = [];
  }

  return p;
}

async function urlsForAssets(ids: string[]) {
  if (!ids.length) return {};
  const rows = await db
    .select({
      id: storageAssets.id,
      bucket: storageAssets.bucket,
      path: storageAssets.path,
      url: storageAssets.url,
    })
    .from(storageAssets)
    .where(inArray(storageAssets.id, ids));

  const map: Record<string, string> = {};
  for (const a of rows) {
    map[a.id] = buildPublicUrl(a.bucket, a.path, a.url ?? null);
  }
  return map;
}

/* ----------------- LIST / GET ----------------- */

/**
 * GET /admin/products
 *  ?q=&category_id=&sub_category_id=&locale=&is_active=&limit=&offset=&sort=&order=
 *
 * products + product_i18n join (locale bazlı)
 */
export const adminListProducts: RouteHandler = async (req, reply) => {
  const q = (req.query || {}) as {
    q?: string;
    category_id?: string;
    sub_category_id?: string;
    locale?: string;
    is_active?: string | number | boolean;
    limit?: string | number;
    offset?: string | number;
    sort?: 'order_num' | 'price' | 'rating' | 'created_at';
    order?: 'asc' | 'desc';
  };

  // ✅ locale artık DB default_locale fallback ile çözülür
  const locale = getEffectiveLocale(req);

  const conds: any[] = [eq(productI18n.locale, locale)];

  if (q.q) conds.push(like(productI18n.title, `%${q.q}%`));
  if (q.category_id) conds.push(eq(products.category_id, q.category_id));
  if (q.sub_category_id) conds.push(eq(products.sub_category_id, q.sub_category_id));

  if (q.is_active !== undefined) {
    const v = String(q.is_active).toLowerCase();
    conds.push(eq(products.is_active, (v === '1' || v === 'true') as any));
  }

  const whereExpr = conds.length ? and(...conds) : undefined;

  const limit = Math.min(Number(q.limit ?? 50) || 50, 100);
  const offset = Math.max(Number(q.offset ?? 0) || 0, 0);

  const colMap = {
    order_num: products.order_num,
    price: products.price,
    rating: products.rating,
    created_at: products.created_at,
  } as const;

  const sortKey = (q.sort && q.sort in colMap ? q.sort : 'order_num') as keyof typeof colMap;
  const dir = q.order === 'asc' ? 'asc' : 'desc';
  const orderExpr = dir === 'asc' ? asc(colMap[sortKey]) : desc(colMap[sortKey]);

  const countBase = db
    .select({ total: sql<number>`COUNT(*)` })
    .from(products)
    .innerJoin(productI18n, eq(productI18n.product_id, products.id));

  const [{ total }] = await (whereExpr ? countBase.where(whereExpr as any) : countBase);

  const dataBase = db
    .select({ p: products, i: productI18n })
    .from(products)
    .innerJoin(productI18n, eq(productI18n.product_id, products.id));

  const rows = await (whereExpr ? dataBase.where(whereExpr as any) : dataBase)
    .orderBy(orderExpr)
    .limit(limit)
    .offset(offset);

  reply.header('x-total-count', String(Number(total || 0)));
  reply.header('content-range', `*/${Number(total || 0)}`);
  reply.header('access-control-expose-headers', 'x-total-count, content-range');

  // ✅ FIX: base + i18n merge order (i18n overrides)
  const out = rows.map(({ p, i }) => normalizeProduct({ ...p, ...(i ?? {}) }));
  return reply.send(out);
};

/**
 * GET /admin/products/:id?locale=
 * Base ürün + product_i18n merge
 */
export const adminGetProduct: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };

  const locale = getEffectiveLocale(req);

  const rows = await db
    .select({ p: products, i: productI18n })
    .from(products)
    .leftJoin(
      productI18n,
      and(eq(productI18n.product_id, products.id), eq(productI18n.locale, locale)),
    )
    .where(eq(products.id, id))
    .limit(1);

  if (!rows.length || !rows[0].p) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  const { p, i } = rows[0];

  // ✅ FIX: base + i18n merge order
  const merged = normalizeProduct({ ...p, ...(i ?? {}) });
  return reply.send(merged);
};

/* ----------------- CREATE / UPDATE / DELETE ----------------- */

/**
 * CREATE (çoklu dil)
 *
 * - Base ürün tek ID
 * - DB’den gelen app_locales listesine göre product_i18n kayıtları açılır
 * - Response: baseLocale için merge edilmiş ürün
 */
export const adminCreateProduct: RouteHandler = async (req, reply) => {
  try {
    const input = productCreateSchema.parse(req.body ?? {});

    const baseLocale = normalizeLocale((input as any).locale) ?? getEffectiveLocale(req);
    const targetLocales = getLocalesForCreate(req, baseLocale);

    const productId = (input as any).id ?? randomUUID();

    const coverId = (input as any).storage_asset_id ?? null;
    const galleryIds = (input as any).storage_image_ids ?? [];
    const urlMap = await urlsForAssets([...(coverId ? [coverId] : []), ...galleryIds]);

    const image_url = coverId
      ? urlMap[coverId] ?? (input as any).image_url ?? null
      : (input as any).image_url ?? null;

    const images = galleryIds.map((aid: string) => urlMap[aid]).filter(Boolean) as string[];

    const now = new Date();

    const baseRow: any = {
      id: productId,
      category_id: (input as any).category_id,
      sub_category_id: (input as any).sub_category_id ?? null,
      price: (input as any).price,
      image_url,
      storage_asset_id: coverId,
      images,
      storage_image_ids: galleryIds,
      is_active:
        (input as any).is_active === undefined
          ? true
          : !!(
              (input as any).is_active === true ||
              (input as any).is_active === 1 ||
              (input as any).is_active === '1' ||
              (input as any).is_active === 'true'
            ),
      is_featured:
        (input as any).is_featured === undefined
          ? false
          : !!(
              (input as any).is_featured === true ||
              (input as any).is_featured === 1 ||
              (input as any).is_featured === '1' ||
              (input as any).is_featured === 'true'
            ),
      order_num: (input as any).order_num ?? 0,
      product_code: (input as any).product_code ?? null,
      stock_quantity: (input as any).stock_quantity ?? 0,
      rating: (input as any).rating ?? 5,
      review_count: (input as any).review_count ?? 0,
      created_at: now,
      updated_at: now,
    };

    await db.insert(products).values(baseRow);

    const i18nRows = targetLocales.map((loc) => ({
      product_id: productId,
      locale: loc,
      title: (input as any).title,
      slug: (input as any).slug,
      description: (input as any).description ?? null,
      alt: (input as any).alt ?? null,
      tags: (input as any).tags ?? [],
      specifications: (input as any).specifications ?? null,
      meta_title: (input as any).meta_title ?? null,
      meta_description: (input as any).meta_description ?? null,
      created_at: now,
      updated_at: now,
    }));

    await db.insert(productI18n).values(i18nRows as any);

    const [row] = await db
      .select({ p: products, i: productI18n })
      .from(products)
      .leftJoin(
        productI18n,
        and(eq(productI18n.product_id, products.id), eq(productI18n.locale, baseLocale)),
      )
      .where(eq(products.id, productId))
      .limit(1);

    // ✅ FIX merge order
    const merged = normalizeProduct({
      ...(row?.p ?? {}),
      ...(row?.i ?? {}),
    });

    return reply.code(201).send(merged);
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      return reply.code(422).send({
        error: { message: 'validation_error', details: e.issues },
      });
    }
    req.log.error(e);
    return reply.code(500).send({ error: { message: 'internal_error' } });
  }
};

export const adminUpdateProduct: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };

  try {
    const patch = productUpdateSchema.parse(req.body ?? {});
    const baseLocale =
      normalizeLocale((patch as any).locale) ??
      normalizeLocale((req.query as any)?.locale) ??
      getEffectiveLocale(req);

    const [curRow] = await db
      .select({ p: products, i: productI18n })
      .from(products)
      .leftJoin(
        productI18n,
        and(eq(productI18n.product_id, products.id), eq(productI18n.locale, baseLocale)),
      )
      .where(eq(products.id, id))
      .limit(1);

    if (!curRow || !curRow.p) {
      return reply.code(404).send({ error: { message: 'not_found' } });
    }

    // ✅ FIX merge order
    const curMerged = normalizeProduct({
      ...curRow.p,
      ...(curRow.i ?? {}),
    });

    const {
      id: _ignoreId,
      locale: _ignoreLocale,
      title,
      slug,
      description,
      alt,
      tags,
      specifications,
      meta_title,
      meta_description,
      ...basePatch
    } = patch as any;

    const coverId = (patch as any).storage_asset_id ?? curMerged.storage_asset_id ?? null;
    const galleryIds =
      (patch as any).storage_image_ids ?? (curMerged.storage_image_ids as string[]) ?? [];

    const urlMap = await urlsForAssets([...(coverId ? [coverId] : []), ...galleryIds]);

    const image_url =
      (patch as any).storage_asset_id !== undefined || (patch as any).image_url !== undefined
        ? coverId
          ? urlMap[coverId] ?? (patch as any).image_url ?? null
          : (patch as any).image_url ?? null
        : curMerged.image_url;

    const images =
      (patch as any).storage_image_ids !== undefined || (patch as any).images !== undefined
        ? (galleryIds.map((aid: string) => urlMap[aid]).filter(Boolean) as string[])
        : (curMerged.images as string[]);

    const now = new Date();

    const baseUpdate: any = {
      ...basePatch,
      storage_asset_id: coverId,
      image_url,
      storage_image_ids: galleryIds,
      images,
      updated_at: now,
    };

    await db.update(products).set(baseUpdate).where(eq(products.id, id));

    const i18nPatch: any = { updated_at: now };
    if (title !== undefined) i18nPatch.title = title;
    if (slug !== undefined) i18nPatch.slug = slug;
    if (description !== undefined) i18nPatch.description = description;
    if (alt !== undefined) i18nPatch.alt = alt;
    if (tags !== undefined) i18nPatch.tags = tags;
    if (specifications !== undefined) i18nPatch.specifications = specifications;
    if (meta_title !== undefined) i18nPatch.meta_title = meta_title;
    if (meta_description !== undefined) i18nPatch.meta_description = meta_description;

    if (Object.keys(i18nPatch).length > 1) {
      const updated = await db
        .update(productI18n)
        .set(i18nPatch)
        .where(and(eq(productI18n.product_id, id), eq(productI18n.locale, baseLocale)));

      if ((updated as any).rowsAffected === 0) {
        await db.insert(productI18n).values({
          product_id: id,
          locale: baseLocale,
          title: title ?? curRow.i?.title ?? '',
          slug: slug ?? curRow.i?.slug ?? '',
          description: description ?? curRow.i?.description ?? null,
          alt: alt ?? curRow.i?.alt ?? null,
          tags: tags ?? curRow.i?.tags ?? [],
          specifications: specifications ?? curRow.i?.specifications ?? null,
          meta_title: meta_title ?? curRow.i?.meta_title ?? null,
          meta_description: meta_description ?? curRow.i?.meta_description ?? null,
          created_at: now,
          updated_at: now,
        } as any);
      }
    }

    const [row] = await db
      .select({ p: products, i: productI18n })
      .from(products)
      .leftJoin(
        productI18n,
        and(eq(productI18n.product_id, products.id), eq(productI18n.locale, baseLocale)),
      )
      .where(eq(products.id, id))
      .limit(1);

    // ✅ FIX merge order
    const merged = normalizeProduct({
      ...(row?.p ?? {}),
      ...(row?.i ?? {}),
    });

    return reply.send(merged);
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      return reply.code(422).send({
        error: { message: 'validation_error', details: e.issues },
      });
    }
    req.log.error(e);
    return reply.code(500).send({ error: { message: 'internal_error' } });
  }
};

export const adminDeleteProduct: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  await db.delete(products).where(eq(products.id, id));
  return reply.code(204).send();
};

/* ----------------- IMAGES: REPLACE (storage uyumlu) ----------------- */

export const adminSetProductImages: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };

  const parsed = productSetImagesSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: 'invalid_body', issues: parsed.error.flatten() },
    });
  }

  const body: ProductSetImagesInput = parsed.data;
  const galleryIds = body.image_ids ?? [];
  const coverId = body.cover_id ?? null;

  const urlMap = await urlsForAssets([...(coverId ? [coverId] : []), ...galleryIds]);

  const coverUrl = coverId ? urlMap[coverId] ?? null : null;
  const images = galleryIds.map((aid) => urlMap[aid]).filter(Boolean) as string[];

  const patch: Record<string, unknown> = {
    storage_asset_id: coverId,
    image_url: coverUrl,
    storage_image_ids: galleryIds,
    images,
    updated_at: new Date(),
  };

  // ⚠️ alt i18n kolonu ise productI18n’de olmalı; sende base’de de var gibi duruyor.
  // Mevcut davranışı bozmamak için patch’e dokunmuyorum.
  if (body.alt !== undefined) {
    patch.alt = body.alt as string | null;
  }

  await db
    .update(products)
    .set(patch as any)
    .where(eq(products.id, id));

  // ✅ Hardcode "tr" yok: aktif locale ile merge
  const locale = getEffectiveLocale(req);

  const [row] = await db
    .select({ p: products, i: productI18n })
    .from(products)
    .leftJoin(
      productI18n,
      and(eq(productI18n.product_id, products.id), eq(productI18n.locale, locale)),
    )
    .where(eq(products.id, id))
    .limit(1);

  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });

  // ✅ FIX merge order
  const merged = normalizeProduct({
    ...row.p,
    ...(row.i ?? {}),
  });

  return reply.send(merged);
};

/* ----------------- REORDER ----------------- */

const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string().min(1), order_num: z.number().int().min(0) })).min(1),
});

export const adminReorderProducts: RouteHandler = async (req, reply) => {
  const parsed = reorderSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: 'invalid_body', issues: parsed.error.flatten() },
    });
  }

  const { items } = parsed.data;

  await db.transaction(async (tx) => {
    for (const { id, order_num } of items) {
      await tx
        .update(products)
        .set({ order_num, updated_at: new Date() } as any)
        .where(eq(products.id, id));
    }
  });

  return reply.send({ ok: true });
};
