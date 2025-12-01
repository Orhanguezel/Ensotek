// =============================================================
// FILE: src/modules/categories/controller.ts  (PUBLIC)
// =============================================================
import type { RouteHandler } from "fastify";
import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { categories } from "./schema";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from "./validation";

const nullIfEmpty = (v: unknown) => (v === "" ? null : v);

// FE’den gelen her türü -> boolean
function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  const s = String(v).toLowerCase();
  return s === "1" || s === "true";
}

const ORDER_WHITELIST = {
  display_order: categories.display_order,
  name: categories.name,
  created_at: categories.created_at,
  updated_at: categories.updated_at,
} as const;

function parseOrder(q: Record<string, unknown>) {
  const sort = typeof q.sort === "string" ? q.sort : undefined;
  const dir1 = typeof q.order === "string" ? q.order : undefined;
  const combined =
    typeof q.order === "string" && q.order.includes(".")
      ? q.order
      : undefined;

  let col: keyof typeof ORDER_WHITELIST = "created_at";
  let dir: "asc" | "desc" = "desc";

  if (combined) {
    const [c, d] = combined.split(".");
    if (c && c in ORDER_WHITELIST)
      col = c as keyof typeof ORDER_WHITELIST;
    if (d === "asc" || d === "desc") dir = d;
  } else {
    if (sort && sort in ORDER_WHITELIST)
      col = sort as keyof typeof ORDER_WHITELIST;
    if (dir1 === "asc" || dir1 === "desc") dir = dir1;
  }

  const colExpr = ORDER_WHITELIST[col];
  const primary = dir === "asc" ? asc(colExpr) : desc(colExpr);
  return { primary, primaryCol: col };
}

/** GET /categories (public) — üst kategoriler (çok dilli + module_key destekli) */
export const listCategories: RouteHandler<{
  Querystring: {
    q?: string;
    is_active?: string | number | boolean;
    is_featured?: string | number | boolean;
    limit?: string | number;
    offset?: string | number;
    sort?: string;
    order?: string;
    locale?: string;
    module_key?: string;
  };
}> = async (req, reply) => {
  const q = req.query ?? {};
  const conds: any[] = [];

  if (q.q) {
    const s = `%${String(q.q).trim()}%`;
    conds.push(
      sql`${categories.name} LIKE ${s} OR ${categories.slug} LIKE ${s}`,
    );
  }

  if (q.is_active !== undefined)
    conds.push(eq(categories.is_active, toBool(q.is_active)));
  if (q.is_featured !== undefined)
    conds.push(eq(categories.is_featured, toBool(q.is_featured)));

  // ✅ Çoklu dil filtresi
  const locale = typeof q.locale === "string" && q.locale.trim()
    ? q.locale.trim()
    : undefined;
  if (locale) {
    conds.push(eq(categories.locale, locale));
  }

  // ✅ Modul/domain filtresi (blog, news, library, product, docs, ...)
  const moduleKey =
    typeof q.module_key === "string" && q.module_key.trim()
      ? q.module_key.trim()
      : undefined;
  if (moduleKey) {
    conds.push(eq(categories.module_key, moduleKey));
  }

  const where = conds.length ? and(...conds) : undefined;

  const limit = Math.min(Number(q.limit ?? 50) || 50, 100);
  const offset = Math.max(Number(q.offset ?? 0) || 0, 0);
  const { primary, primaryCol } = parseOrder(q as any);

  const countBase = db
    .select({ total: sql<number>`COUNT(*)` })
    .from(categories);
  const [{ total }] = where
    ? await countBase.where(where as any)
    : await countBase;

  const rowsBase = db.select().from(categories);
  const rowsQ = where ? rowsBase.where(where as any) : rowsBase;

  const orderExprs: any[] = [primary as any];
  if (primaryCol !== "display_order")
    orderExprs.push(asc(categories.display_order));

  const rows = await rowsQ
    .orderBy(...orderExprs)
    .limit(limit)
    .offset(offset);

  reply.header("x-total-count", String(total));
  reply.header("content-range", `*/${total}`);
  reply.header(
    "access-control-expose-headers",
    "x-total-count, content-range",
  );

  return reply.send(rows);
};

/** GET /categories/:id (public) */
export const getCategoryById: RouteHandler<{
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

/** GET /categories/by-slug/:slug (public) — opsiyonel locale + module_key */
export const getCategoryBySlug: RouteHandler<{
  Params: { slug: string };
  Querystring?: { locale?: string; module_key?: string };
}> = async (req, reply) => {
  const { slug } = req.params;
  const locale = req.query?.locale?.trim();
  const moduleKey = req.query?.module_key?.trim();

  let q = db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .$dynamic();

  if (locale) {
    q = q.where(eq(categories.locale, locale));
  }
  if (moduleKey) {
    q = q.where(eq(categories.module_key, moduleKey));
  }

  const rows = await q.limit(1);
  if (!rows.length)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(rows[0]);
};

/** Ortak payload yardımcıları (admin controller da kullanıyor) */
export function buildInsertPayload(input: CategoryCreateInput) {
  const id = input.id ?? randomUUID();
  const name = String(input.name ?? "").trim();
  const slug = String(input.slug ?? "").trim();
  const locale = (input.locale ?? "tr").trim();
  const module_key = (input.module_key ?? "general").trim();

  return {
    id,
    locale,
    module_key,
    name,
    slug,
    description:
      (nullIfEmpty(input.description) as string | null) ?? null,
    image_url:
      (nullIfEmpty(input.image_url) as string | null) ?? null,
    alt: (nullIfEmpty(input.alt) as string | null) ?? null,
    icon: (nullIfEmpty(input.icon) as string | null) ?? null,

    // boolean kolonlar
    is_active:
      input.is_active === undefined
        ? true
        : toBool(input.is_active),
    is_featured:
      input.is_featured === undefined
        ? false
        : toBool(input.is_featured),

    display_order: input.display_order ?? 0,
  };
}

export function buildUpdatePayload(patch: CategoryUpdateInput) {
  const set: Record<string, unknown> = {
    updated_at: (sql as any)`CURRENT_TIMESTAMP(3)`,
  };

  if (patch.locale !== undefined) {
    set.locale = String(patch.locale).trim().slice(0, 8);
  }
  if (patch.module_key !== undefined) {
    set.module_key = String(patch.module_key).trim().slice(0, 64);
  }

  if (patch.name !== undefined)
    set.name = String(patch.name).trim();
  if (patch.slug !== undefined)
    set.slug = String(patch.slug).trim();
  if (patch.description !== undefined)
    set.description = nullIfEmpty(
      patch.description,
    ) as string | null;
  if (patch.image_url !== undefined)
    set.image_url = nullIfEmpty(
      patch.image_url,
    ) as string | null;
  if (patch.alt !== undefined)
    set.alt = nullIfEmpty(patch.alt) as string | null;
  if (patch.icon !== undefined)
    set.icon = nullIfEmpty(patch.icon) as string | null;

  if (patch.is_active !== undefined)
    set.is_active = toBool(patch.is_active);
  if (patch.is_featured !== undefined)
    set.is_featured = toBool(patch.is_featured);

  if (patch.display_order !== undefined)
    set.display_order = Number(patch.display_order) || 0;
  return set;
}
