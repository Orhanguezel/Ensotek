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

/* ----------------- types ----------------- */
type ItemType = 'product' | 'sparepart';

type AdminListQuery = {
  q?: string;
  category_id?: string;
  sub_category_id?: string;
  locale?: string;
  is_active?: string | number | boolean;
  item_type?: ItemType;
  limit?: string | number;
  offset?: string | number;
  sort?: 'order_num' | 'price' | 'rating' | 'created_at';
  order?: 'asc' | 'desc';
};

const normalizeItemType = (raw?: unknown, fallback: ItemType = 'product'): ItemType => {
  if (raw === 'sparepart') return 'sparepart';
  if (raw === 'product') return 'product';
  return fallback;
};

/* ----------------- helpers ----------------- */
const toNum = (x: any) =>
  x === null || x === undefined ? x : Number.isNaN(Number(x)) ? x : Number(x);

function normalizeProduct(row: any) {
  if (!row) return row;
  const p: any = { ...row };

  p.price = toNum(p.price);
  p.rating = toNum(p.rating);
  p.review_count = toNum(p.review_count) ?? 0;
  p.stock_quantity = toNum(p.stock_quantity) ?? 0;

  if (typeof p.images === 'string') {
    try {
      p.images = JSON.parse(p.images);
    } catch {}
  }
  if (!Array.isArray(p.images)) p.images = [];

  if (typeof p.tags === 'string') {
    try {
      p.tags = JSON.parse(p.tags);
    } catch {}
  }
  if (!Array.isArray(p.tags)) p.tags = [];

  if (typeof p.specifications === 'string') {
    try {
      p.specifications = JSON.parse(p.specifications);
    } catch {}
  }

  if (typeof p.storage_image_ids === 'string') {
    try {
      p.storage_image_ids = JSON.parse(p.storage_image_ids);
    } catch {}
  }
  if (!Array.isArray(p.storage_image_ids)) p.storage_image_ids = [];

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
 *  ?q=&category_id=&sub_category_id=&locale=&is_active=&item_type=&limit=&offset=&sort=&order=
 */
export const adminListProducts: RouteHandler = async (req, reply) => {
  const q = (req.query || {}) as AdminListQuery;

  const locale = getEffectiveLocale(req);
  const itemType = normalizeItemType(q.item_type, 'product'); // ✅ default product

  const conds: any[] = [
    eq(productI18n.locale, locale),
    eq(products.item_type, itemType as any), // ✅ FIX
  ];

  if (q.q) conds.push(like(productI18n.title, `%${q.q}%`));
  if (q.category_id) conds.push(eq(products.category_id, q.category_id));
  if (q.sub_category_id) conds.push(eq(products.sub_category_id, q.sub_category_id));

  if (q.is_active !== undefined) {
    const v = String(q.is_active).toLowerCase();
    conds.push(eq(products.is_active, (v === '1' || v === 'true') as any));
  }

  const whereExpr = and(...conds);

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

  const [{ total }] = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(products)
    .innerJoin(productI18n, eq(productI18n.product_id, products.id))
    .where(whereExpr as any);

  const rows = await db
    .select({ p: products, i: productI18n })
    .from(products)
    .innerJoin(productI18n, eq(productI18n.product_id, products.id))
    .where(whereExpr as any)
    .orderBy(orderExpr)
    .limit(limit)
    .offset(offset);

  reply.header('x-total-count', String(Number(total || 0)));
  reply.header('content-range', `*/${Number(total || 0)}`);
  reply.header('access-control-expose-headers', 'x-total-count, content-range');

  // ✅ FIX: base + i18n (i18n overrides)
  const out = rows.map(({ p, i }) => normalizeProduct({ ...p, ...(i ?? {}) }));
  return reply.send(out);
};

/**
 * GET /admin/products/:id?locale=&item_type=
 * Admin detail: item_type zorunlu değil ama karışmayı önlemek için destekliyoruz.
 * Default: product
 */
export const adminGetProduct: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  const q = (req.query || {}) as { item_type?: ItemType };

  const locale = getEffectiveLocale(req);
  const itemType = normalizeItemType(q.item_type, 'product');

  const rows = await db
    .select({ p: products, i: productI18n })
    .from(products)
    .leftJoin(
      productI18n,
      and(eq(productI18n.product_id, products.id), eq(productI18n.locale, locale)),
    )
    .where(and(eq(products.id, id), eq(products.item_type, itemType as any))) // ✅ FIX
    .limit(1);

  if (!rows.length || !rows[0].p) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  const { p, i } = rows[0];
  const merged = normalizeProduct({ ...p, ...(i ?? {}) }); // ✅ FIX merge order
  return reply.send(merged);
};

/* ----------------- CREATE / UPDATE / DELETE ----------------- */

export const adminCreateProduct: RouteHandler = async (req, reply) => {
  try {
    const input = productCreateSchema.parse(req.body ?? {}) as any;

    const baseLocale = normalizeLocale(input.locale) ?? getEffectiveLocale(req);
    const targetLocales = getLocalesForCreate(req, baseLocale);

    const productId: string = input.id ?? randomUUID();

    const itemType: ItemType = normalizeItemType(input.item_type, 'product'); // ✅ FIX

    const coverId = input.storage_asset_id ?? null;
    const galleryIds: string[] = input.storage_image_ids ?? [];
    const urlMap = await urlsForAssets([...(coverId ? [coverId] : []), ...galleryIds]);

    const image_url = coverId
      ? urlMap[coverId] ?? input.image_url ?? null
      : input.image_url ?? null;
    const images = galleryIds.map((aid) => urlMap[aid]).filter(Boolean) as string[];

    const now = new Date();

    const baseRow: any = {
      id: productId,
      item_type: itemType, // ✅ FIX (DB’ye yaz)
      category_id: input.category_id,
      sub_category_id: input.sub_category_id ?? null,
      price: input.price,

      image_url,
      storage_asset_id: coverId,
      images,
      storage_image_ids: galleryIds,

      is_active:
        input.is_active === undefined
          ? true
          : !!(
              input.is_active === true ||
              input.is_active === 1 ||
              input.is_active === '1' ||
              input.is_active === 'true'
            ),

      is_featured:
        input.is_featured === undefined
          ? false
          : !!(
              input.is_featured === true ||
              input.is_featured === 1 ||
              input.is_featured === '1' ||
              input.is_featured === 'true'
            ),

      order_num: input.order_num ?? 0,
      product_code: input.product_code ?? null,
      stock_quantity: input.stock_quantity ?? 0,
      rating: input.rating ?? 5,
      review_count: input.review_count ?? 0,

      created_at: now,
      updated_at: now,
    };

    await db.insert(products).values(baseRow);

    const i18nRows = targetLocales.map((loc) => ({
      product_id: productId,
      locale: loc,
      title: input.title,
      slug: input.slug,
      description: input.description ?? null,
      alt: input.alt ?? null,
      tags: input.tags ?? [],
      specifications: input.specifications ?? null,
      meta_title: input.meta_title ?? null,
      meta_description: input.meta_description ?? null,
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

    const merged = normalizeProduct({ ...(row?.p ?? {}), ...(row?.i ?? {}) });
    return reply.code(201).send(merged);
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      return reply.code(422).send({ error: { message: 'validation_error', details: e.issues } });
    }
    req.log.error(e);
    return reply.code(500).send({ error: { message: 'internal_error' } });
  }
};

export const adminUpdateProduct: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };

  try {
    const patch = productUpdateSchema.parse(req.body ?? {}) as any;

    const baseLocale =
      normalizeLocale(patch.locale) ??
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

    const curMerged = normalizeProduct({ ...curRow.p, ...(curRow.i ?? {}) });

    const {
      id: _ignoreId,
      locale: _ignoreLocale,
      item_type, // ✅ allow patch
      title,
      slug,
      description,
      alt,
      tags,
      specifications,
      meta_title,
      meta_description,
      ...basePatch
    } = patch;

    const coverId = patch.storage_asset_id ?? curMerged.storage_asset_id ?? null;
    const galleryIds = patch.storage_image_ids ?? (curMerged.storage_image_ids as string[]) ?? [];

    const urlMap = await urlsForAssets([...(coverId ? [coverId] : []), ...galleryIds]);

    const image_url =
      patch.storage_asset_id !== undefined || patch.image_url !== undefined
        ? coverId
          ? urlMap[coverId] ?? patch.image_url ?? null
          : patch.image_url ?? null
        : curMerged.image_url;

    const images =
      patch.storage_image_ids !== undefined || patch.images !== undefined
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

    // ✅ FIX: item_type update (if provided)
    if (item_type !== undefined) {
      baseUpdate.item_type = normalizeItemType(item_type, curMerged.item_type ?? 'product');
    }

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

    const merged = normalizeProduct({ ...(row?.p ?? {}), ...(row?.i ?? {}) });
    return reply.send(merged);
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      return reply.code(422).send({ error: { message: 'validation_error', details: e.issues } });
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

/* ----------------- IMAGES: REPLACE ----------------- */

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

  if (body.alt !== undefined) {
    patch.alt = body.alt as string | null;
  }

  await db
    .update(products)
    .set(patch as any)
    .where(eq(products.id, id));

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

  const merged = normalizeProduct({ ...row.p, ...(row.i ?? {}) });
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
