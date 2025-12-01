// =============================================================
// FILE: src/modules/categories/admin.controller.ts
// =============================================================
import type { RouteHandler } from "fastify";
import { db } from "@/db/client";
import { categories } from "./schema";
import { and, or, like, eq, sql, asc, desc } from "drizzle-orm";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  categorySetImageSchema,
  type CategoryCreateInput,
  type CategoryUpdateInput,
  type CategorySetImageInput,
} from "./validation";
import { buildInsertPayload, buildUpdatePayload } from "./controller";
import { storageAssets } from "@/modules/storage/schema";
import { buildPublicUrl } from "@/modules/storage/_util";
import { randomUUID } from "crypto";

const toBool = (v: unknown): boolean | undefined => {
  if (v === undefined) return undefined;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase();
  if (s === "true" || s === "1") return true;
  if (s === "false" || s === "0") return false;
  return undefined;
};
const toNum = (v: unknown, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

export type AdminListCategoriesQS = {
  q?: string;
  is_active?: string | boolean;
  is_featured?: string | boolean;
  limit?: number | string;
  offset?: number | string;
  sort?: "display_order" | "name" | "created_at" | "updated_at";
  order?: "asc" | "desc";
  locale?: string;
  module_key?: string;
};

function isDup(err: any) {
  const code = err?.code ?? err?.errno;
  return code === "ER_DUP_ENTRY" || code === 1062;
}

/* 🌍 Çoklu dil helper'ları (products/subCategories ile aynı mantık) */

const FALLBACK_LOCALES = ["tr"];

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

/** POST /categories (admin) — 🌍 çoklu dil create */
export const adminCreateCategory: RouteHandler<{
  Body: CategoryCreateInput;
}> = async (req, reply) => {
  const parsed = categoryCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.code(400).send({
      error: {
        message: "invalid_body",
        issues: parsed.error.flatten(),
      },
    });
  }

  // Base payload (id + locale + diğer alanlar burada normalize ediliyor)
  const basePayload = buildInsertPayload(parsed.data);
  const baseLocale = normalizeLocale(basePayload.locale) ?? "tr";
  const locales = getLocalesForCreate(baseLocale);

  // base payload'ın locale'ini normalize edilmiş haliyle güncelle
  basePayload.locale = baseLocale;
  const baseId = basePayload.id;

  // Tüm locale'ler için satır üret
  const rows = locales.map((loc) => {
    if (loc === baseLocale) {
      return basePayload;
    }
    return {
      ...basePayload,
      id: randomUUID(),
      locale: loc,
    };
  });

  try {
    await db.insert(categories).values(rows as any);
  } catch (err: any) {
    if (isDup(err)) {
      return reply
        .code(409)
        .send({ error: { message: "duplicate_slug" } });
    }
    return reply.code(500).send({
      error: {
        message: "db_error",
        detail: String(err?.message ?? err),
      },
    });
  }

  const [row] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, baseId))
    .limit(1);
  return reply.code(201).send(row);
};

/** PUT /categories/:id (admin) */
export const adminPutCategory: RouteHandler<{
  Params: { id: string };
  Body: CategoryUpdateInput;
}> = async (req, reply) => {
  const { id } = req.params;

  const parsed = categoryUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.code(400).send({
      error: {
        message: "invalid_body",
        issues: parsed.error.flatten(),
      },
    });
  }

  const set = buildUpdatePayload(parsed.data);

  try {
    await db.update(categories).set(set as any).where(eq(categories.id, id));
  } catch (err: any) {
    if (isDup(err))
      return reply
        .code(409)
        .send({ error: { message: "duplicate_slug" } });
    return reply.code(500).send({
      error: {
        message: "db_error",
        detail: String(err?.message ?? err),
      },
    });
  }

  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  if (!rows.length)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(rows[0]);
};

/** PATCH /categories/:id (admin) */
export const adminPatchCategory: RouteHandler<{
  Params: { id: string };
  Body: CategoryUpdateInput;
}> = async (req, reply) => {
  const { id } = req.params;

  const parsed = categoryUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.code(400).send({
      error: {
        message: "invalid_body",
        issues: parsed.error.flatten(),
      },
    });
  }

  const set = buildUpdatePayload(parsed.data);

  try {
    await db.update(categories).set(set as any).where(eq(categories.id, id));
  } catch (err: any) {
    if (isDup(err))
      return reply
        .code(409)
        .send({ error: { message: "duplicate_slug" } });
    return reply.code(500).send({
      error: {
        message: "db_error",
        detail: String(err?.message ?? err),
      },
    });
  }

  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  if (!rows.length)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(rows[0]);
};

/** DELETE /categories/:id (admin) */
export const adminDeleteCategory: RouteHandler<{
  Params: { id: string };
}> = async (req, reply) => {
  const { id } = req.params;
  await db.delete(categories).where(eq(categories.id, id));
  return reply.code(204).send();
};

/** POST /categories/reorder (admin) */
export const adminReorderCategories: RouteHandler<{
  Body: { items: Array<{ id: string; display_order: number }> };
}> = async (req, reply) => {
  const items = Array.isArray(req.body?.items)
    ? req.body.items
    : [];
  if (!items.length) return reply.send({ ok: true });

  for (const it of items) {
    const n = Number(it.display_order) || 0;
    await db
      .update(categories)
      .set({
        display_order: n,
        updated_at: sql`CURRENT_TIMESTAMP(3)`,
      } as any)
      .where(eq(categories.id, it.id));
  }
  return reply.send({ ok: true });
};

/** PATCH /categories/:id/active (admin) */
export const adminToggleActive: RouteHandler<{
  Params: { id: string };
  Body: { is_active: boolean };
}> = async (req, reply) => {
  const { id } = req.params;
  const v = !!req.body?.is_active;
  await db
    .update(categories)
    .set({
      is_active: v,
      updated_at: sql`CURRENT_TIMESTAMP(3)`,
    } as any)
    .where(eq(categories.id, id));

  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  if (!rows.length)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(rows[0]);
};

/** PATCH /categories/:id/featured (admin) */
export const adminToggleFeatured: RouteHandler<{
  Params: { id: string };
  Body: { is_featured: boolean };
}> = async (req, reply) => {
  const { id } = req.params;
  const v = !!req.body?.is_featured;
  await db
    .update(categories)
    .set({
      is_featured: v,
      updated_at: sql`CURRENT_TIMESTAMP(3)`,
    } as any)
    .where(eq(categories.id, id));

  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  if (!rows.length)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(rows[0]);
};

/** ✅ PATCH /categories/:id/image (admin)
 * Body: { asset_id?: string | null, alt?: string | null }
 */
export const adminSetCategoryImage: RouteHandler<{
  Params: { id: string };
  Body: CategorySetImageInput;
}> = async (req, reply) => {
  const { id } = req.params;

  const parsed = categorySetImageSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: {
        message: "invalid_body",
        issues: parsed.error.flatten(),
      },
    });
  }
  const assetId = parsed.data.asset_id ?? null;
  const alt = parsed.data.alt; // undefined ⇒ dokunma, null ⇒ temizle

  // Görseli kaldır
  if (!assetId) {
    const patch: Record<string, unknown> = {
      image_url: null,
      storage_asset_id: null,
      updated_at: sql`CURRENT_TIMESTAMP(3)`,
    };
    if (alt !== undefined) patch.alt = alt as string | null;

    await db
      .update(categories)
      .set(patch as any)
      .where(eq(categories.id, id));

    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    if (!rows.length)
      return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(rows[0]);
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
    return reply
      .code(404)
      .send({ error: { message: "asset_not_found" } });
  }

  // ✅ Storage modülünün URL builder’ı
  const publicUrl = buildPublicUrl(
    asset.bucket,
    asset.path,
    asset.url ?? null,
  );

  const patch: Record<string, unknown> = {
    image_url: publicUrl,
    storage_asset_id: assetId,
    updated_at: sql`CURRENT_TIMESTAMP(3)`,
  };
  if (alt !== undefined) patch.alt = alt as string | null;

  await db
    .update(categories)
    .set(patch as any)
    .where(eq(categories.id, id));

  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  if (!rows.length)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(rows[0]);
};

// ✅ LIST /categories — locale + module_key ile filtrelenebilir
export const adminListCategories: RouteHandler<{
  Querystring: AdminListCategoriesQS;
}> = async (req, reply) => {
  const {
    q,
    is_active,
    is_featured,
    limit = 500,
    offset = 0,
    sort = "display_order",
    order = "asc",
    locale,
    module_key,
  } = req.query ?? {};

  const conds: any[] = [];

  if (q && q.trim()) {
    const pattern = `%${q.trim()}%`;
    conds.push(
      or(
        like(categories.name, pattern),
        like(categories.slug, pattern),
      ),
    );
  }
  const a = toBool(is_active);
  if (a !== undefined) conds.push(eq(categories.is_active, a));
  const f = toBool(is_featured);
  if (f !== undefined) conds.push(eq(categories.is_featured, f));

  if (locale && locale.trim()) {
    conds.push(eq(categories.locale, locale.trim()));
  }
  if (module_key && module_key.trim()) {
    conds.push(eq(categories.module_key, module_key.trim()));
  }

  const col =
    sort === "name"
      ? categories.name
      : sort === "created_at"
        ? categories.created_at
        : sort === "updated_at"
          ? categories.updated_at
          : categories.display_order;

  let qb = db.select().from(categories).$dynamic();
  if (conds.length) qb = qb.where(and(...conds));

  const rows = await qb
    .orderBy(order === "desc" ? desc(col) : asc(col))
    .limit(toNum(limit, 500))
    .offset(toNum(offset, 0));

  return reply.send(rows);
};

// ✅ GET /categories/:id
export const adminGetCategoryById: RouteHandler<{
  Params: { id: string };
}> = async (req, reply) => {
  const { id } = req.params;
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  if (!rows.length)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(rows[0]);
};

// ✅ GET /categories/by-slug/:slug
export const adminGetCategoryBySlug: RouteHandler<{
  Params: { slug: string };
}> = async (req, reply) => {
  const { slug } = req.params;
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  if (!rows.length)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(rows[0]);
};
