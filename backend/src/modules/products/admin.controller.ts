// =============================================================
// FILE: src/modules/products/admin.controller.ts
// =============================================================
import type { RouteHandler } from "fastify";
import { db } from "@/db/client";
import { and, asc, desc, eq, inArray, like, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { products } from "./schema";
import { storageAssets } from "@/modules/storage/schema";
import {
  productCreateSchema,
  productUpdateSchema,
  productSetImagesSchema,
  type ProductSetImagesInput,
} from "./validation";
import { buildPublicUrl } from "@/modules/storage/_util";

/* ----------------- helpers ----------------- */

const toNum = (x: any) =>
  x === null || x === undefined
    ? x
    : Number.isNaN(Number(x))
      ? x
      : Number(x);

function normalizeProduct(row: any) {
  if (!row) return row;
  const p: any = { ...row };

  // sayısal
  p.price = toNum(p.price);
  p.rating = toNum(p.rating);
  p.review_count = toNum(p.review_count) ?? 0;
  p.stock_quantity = toNum(p.stock_quantity) ?? 0;

  // JSON kolonları string geliyorsa parse et
  if (typeof p.images === "string") {
    try {
      p.images = JSON.parse(p.images);
    } catch {
      /* noop */
    }
  }
  if (!Array.isArray(p.images)) p.images = [];

  if (typeof p.tags === "string") {
    try {
      p.tags = JSON.parse(p.tags);
    } catch {
      /* noop */
    }
  }
  if (!Array.isArray(p.tags)) p.tags = [];

  if (typeof p.specifications === "string") {
    try {
      p.specifications = JSON.parse(p.specifications);
    } catch {
      /* noop */
    }
  }

  if (typeof p.storage_image_ids === "string") {
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

/* 🌍 Çoklu dil helper'ları (subCategories ile aynı mantık) */

const FALLBACK_LOCALES = ["tr"];

/** Locale string normalizasyonu */
function normalizeLocale(loc: unknown): string | null {
  if (!loc) return null;
  const s = String(loc).trim();
  if (!s) return null;
  return s.toLowerCase();
}

/**
 * CREATE sırasında kullanılacak locale listesi:
 *  1) APP_LOCALES / NEXT_PUBLIC_APP_LOCALES / LOCALES (örn: "tr,en,de")
 *  2) Fallback: ["tr"]
 *  3) Base locale yoksa başa eklenir
 *
 * İleride burası site_settings'ten okuyan bir helper ile değiştirilebilir.
 */
function getLocalesForCreate(baseLocale: string): string[] {
  const base = normalizeLocale(baseLocale) ?? "tr";

  const envLocalesRaw =
    process.env.APP_LOCALES ||
    process.env.NEXT_PUBLIC_APP_LOCALES ||
    process.env.LOCALES ||
    "";

  let envLocales: string[] = [];
  if (envLocalesRaw) {
    envLocales = envLocalesRaw
      .split(",")
      .map((x) => normalizeLocale(x))
      .filter((x): x is string => !!x);
  }

  let list = envLocales.length ? envLocales : [...FALLBACK_LOCALES];

  if (!list.includes(base)) list.unshift(base);

  // tekilleştir
  list = Array.from(new Set(list));

  return list;
}

/* ----------------- LIST / GET ----------------- */

export const adminListProducts: RouteHandler = async (req, reply) => {
  const q = (req.query || {}) as {
    q?: string;
    category_id?: string;
    sub_category_id?: string;
    locale?: string;
    is_active?: string | number | boolean;
    limit?: string | number;
    offset?: string | number;
    sort?: "price" | "rating" | "created_at";
    order?: "asc" | "desc";
  };

  const conds: any[] = [];
  if (q.q) conds.push(like(products.title, `%${q.q}%`));
  if (q.category_id) conds.push(eq(products.category_id, q.category_id));
  if (q.sub_category_id)
    conds.push(eq(products.sub_category_id, q.sub_category_id));
  if (q.locale && q.locale.trim())
    conds.push(eq(products.locale, q.locale.trim()));
  if (q.is_active !== undefined) {
    const v = String(q.is_active).toLowerCase();
    conds.push(eq(products.is_active, (v === "1" || v === "true") as any));
  }
  const whereExpr = conds.length ? and(...conds) : undefined;

  const limit = Math.min(Number(q.limit ?? 50) || 50, 100);
  const offset = Math.max(Number(q.offset ?? 0) || 0, 0);

  const colMap = {
    price: products.price,
    rating: products.rating,
    created_at: products.created_at,
  } as const;
  const sortKey = (q.sort && q.sort in colMap
    ? q.sort
    : "created_at") as keyof typeof colMap;
  const dir = q.order === "asc" ? "asc" : "desc";
  const orderExpr =
    dir === "asc" ? asc(colMap[sortKey]) : desc(colMap[sortKey]);

  const countBase = db
    .select({ total: sql<number>`COUNT(*)` })
    .from(products);
  const [{ total }] = await (whereExpr
    ? countBase.where(whereExpr)
    : countBase);

  const rows = await (whereExpr
    ? db.select().from(products).where(whereExpr)
    : db.select().from(products)
  )
    .orderBy(orderExpr)
    .limit(limit)
    .offset(offset);

  reply.header("x-total-count", String(Number(total || 0)));
  reply.header("content-range", `*/${Number(total || 0)}`);
  reply.header(
    "access-control-expose-headers",
    "x-total-count, content-range",
  );

  return reply.send(rows.map(normalizeProduct));
};

export const adminGetProduct: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!rows.length) {
    return reply.code(404).send({ error: { message: "not_found" } });
  }

  return reply.send(normalizeProduct(rows[0]));
};

/* ----------------- CREATE / UPDATE / DELETE ----------------- */

/**
 * CREATE (çoklu dil)
 *
 * - İstekten gelen locale → base locale (yoksa "tr")
 * - Env/sistemden gelen tüm locale'ler için (örn: tr,en,de) ayrı ürün kaydı açar.
 * - Her locale için ayrı id üretilir (base locale, gönderilen id'yi kullanabilir).
 * - Response sadece base locale kaydını döndürür.
 */
export const adminCreateProduct: RouteHandler = async (req, reply) => {
  try {
    const input = productCreateSchema.parse(req.body ?? {});

    const baseLocale = normalizeLocale(input.locale) ?? "tr";
    const targetLocales = getLocalesForCreate(baseLocale);

    // Base locale kaydı için id (istekte geldiyse onu kullan)
    const baseId = input.id ?? randomUUID();

    // Storage id → URL çöz
    const coverId = input.storage_asset_id ?? null;
    const galleryIds = input.storage_image_ids ?? [];
    const urlMap = await urlsForAssets([
      ...(coverId ? [coverId] : []),
      ...galleryIds,
    ]);

    const image_url = coverId
      ? urlMap[coverId] ?? input.image_url ?? null
      : input.image_url ?? null;

    const images = galleryIds
      .map((aid) => urlMap[aid])
      .filter(Boolean) as string[];

    const now = new Date();

    // Tüm locale'ler için insert payload listesi
    const rows = targetLocales.map((loc) => {
      const id = loc === baseLocale ? baseId : randomUUID();
      return {
        ...input,
        id,
        locale: loc,
        image_url,
        images,
        created_at: now,
        updated_at: now,
      } as any;
    });

    await db.insert(products).values(rows as any);

    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.id, baseId))
      .limit(1);

    return reply.code(201).send(normalizeProduct(row));
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return reply.code(422).send({
        error: { message: "validation_error", details: e.issues },
      });
    }
    req.log.error(e);
    return reply
      .code(500)
      .send({ error: { message: "internal_error" } });
  }
};

export const adminUpdateProduct: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const patch = productUpdateSchema.parse(req.body ?? {});
    const [cur] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!cur) {
      return reply.code(404).send({ error: { message: "not_found" } });
    }

    const curNorm = normalizeProduct(cur);

    const coverId =
      patch.storage_asset_id ?? curNorm.storage_asset_id ?? null;
    const galleryIds =
      patch.storage_image_ids ??
      ((curNorm.storage_image_ids as string[]) ?? []);

    const urlMap = await urlsForAssets([
      ...(coverId ? [coverId] : []),
      ...galleryIds,
    ]);

    const image_url =
      patch.storage_asset_id !== undefined ||
      patch.image_url !== undefined
        ? coverId
          ? urlMap[coverId] ?? patch.image_url ?? null
          : patch.image_url ?? null
        : curNorm.image_url;

    const images =
      patch.storage_image_ids !== undefined ||
      patch.images !== undefined
        ? (galleryIds
            .map((aid: string) => urlMap[aid])
            .filter(Boolean) as string[])
        : (curNorm.images as string[]);

    const nextLocale =
      patch.locale !== undefined
        ? (patch.locale || "tr").trim() || "tr"
        : curNorm.locale;

    await db
      .update(products)
      .set({
        ...patch,
        locale: nextLocale,
        image_url,
        images,
        updated_at: new Date(),
      } as any)
      .where(eq(products.id, id));

    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return reply.send(normalizeProduct(row));
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return reply.code(422).send({
        error: { message: "validation_error", details: e.issues },
      });
    }
    req.log.error(e);
    return reply
      .code(500)
      .send({ error: { message: "internal_error" } });
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
      error: {
        message: "invalid_body",
        issues: parsed.error.flatten(),
      },
    });
  }

  const body: ProductSetImagesInput = parsed.data;
  const galleryIds = body.image_ids ?? [];
  const coverId = body.cover_id ?? null;

  const urlMap = await urlsForAssets([
    ...(coverId ? [coverId] : []),
    ...galleryIds,
  ]);

  const coverUrl = coverId ? urlMap[coverId] ?? null : null;
  const images = galleryIds
    .map((aid) => urlMap[aid])
    .filter(Boolean) as string[];

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

  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!row) {
    return reply.code(404).send({ error: { message: "not_found" } });
  }

  return reply.send(normalizeProduct(row));
};
