// =============================================================
// FILE: src/modules/products/helpers.categoryLists.ts
// =============================================================
import type { RouteHandler } from "fastify";
import { db } from "@/db/client";
import { and, asc, eq } from "drizzle-orm";
import { categories } from "@/modules/categories/schema";
import { subCategories } from "@/modules/subcategories/schema";

// küçük yardımcı – query string bool parse
const toBool = (v: unknown): boolean | undefined => {
  if (v === undefined || v === null || v === "") return undefined;
  const s = String(v).toLowerCase();
  if (["1", "true", "yes", "on"].includes(s)) return true;
  if (["0", "false", "no", "off"].includes(s)) return false;
  return undefined;
};

/** Admin panel için kategori drop-down (locale + module_key + is_active destekli) */
export const adminListCategories: RouteHandler = async (req, reply) => {
  const { locale, module_key, is_active } =
    (req.query as {
      locale?: string;
      module_key?: string;
      is_active?: string;
    }) ?? {};

  const conds: any[] = [];
  if (locale && locale.trim()) {
    conds.push(eq(categories.locale, locale.trim()));
  }
  if (module_key && module_key.trim()) {
    conds.push(eq(categories.module_key, module_key.trim()));
  }

  const active = toBool(is_active);
  if (active !== undefined) {
    // categories.is_active drizzle tarafında tinyint/bool olabilir, o yüzden as any
    conds.push(eq(categories.is_active as any, active as any));
  }

  const base = db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      locale: categories.locale,
      module_key: categories.module_key,
    })
    .from(categories);

  const qb = conds.length ? base.where(and(...conds)) : base;

  const rows = await qb.orderBy(
    asc(categories.display_order),
    asc(categories.name),
  );

  return reply.send(rows);
};

/** Admin için alt kategori drop-down (category_id + locale + is_active) */
export const adminListSubcategories: RouteHandler = async (req, reply) => {
  const { category_id, locale, is_active } =
    (req.query as {
      category_id?: string;
      locale?: string;
      is_active?: string;
    }) ?? {};

  const conds: any[] = [];
  if (category_id) {
    conds.push(eq(subCategories.category_id, category_id));
  }
  if (locale && locale.trim()) {
    conds.push(eq(subCategories.locale, locale.trim()));
  }

  const active = toBool(is_active);
  if (active !== undefined) {
    conds.push(eq(subCategories.is_active as any, active as any));
  }

  const base = db
    .select({
      id: subCategories.id,
      name: subCategories.name,
      slug: subCategories.slug,
      category_id: subCategories.category_id,
      locale: subCategories.locale,
    })
    .from(subCategories);

  const qb = conds.length ? base.where(and(...conds)) : base;

  const rows = await qb.orderBy(
    asc(subCategories.display_order),
    asc(subCategories.name),
  );

  return reply.send(rows);
};
