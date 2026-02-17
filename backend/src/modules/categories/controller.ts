// =============================================================
// FILE: src/modules/categories/controller.ts  (PUBLIC)
// =============================================================
import type { RouteHandler } from 'fastify';
import { db } from '@/db/client';
import { categories, categoryI18n } from './schema';
import { and, asc, eq, sql, or, like } from 'drizzle-orm';
import { toBool, toBoolOrUndefined, toInt, normalizeLocale } from '@/modules/_shared';
import { CATEGORY_VIEW_FIELDS, parseOrder } from './helpers';

/** GET /categories (public) — çok dilli + module_key destekli */
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

  const rawLocale = typeof q.locale === 'string' && q.locale.trim() ? q.locale.trim() : undefined;
  const effectiveLocale = normalizeLocale(rawLocale) ?? 'de';

  if (q.q) {
    const pattern = `%${String(q.q).trim()}%`;
    conds.push(or(like(categoryI18n.name, pattern), like(categoryI18n.slug, pattern)));
  }

  const isActive = toBoolOrUndefined(q.is_active);
  if (isActive !== undefined) conds.push(eq(categories.is_active, isActive));

  const isFeatured = toBoolOrUndefined(q.is_featured);
  if (isFeatured !== undefined) conds.push(eq(categories.is_featured, isFeatured));

  // 🌍 i18n locale filtresi
  conds.push(eq(categoryI18n.locale, effectiveLocale));

  // ✅ Modul/domain filtresi
  const moduleKey =
    typeof q.module_key === 'string' && q.module_key.trim() ? q.module_key.trim() : undefined;
  if (moduleKey) conds.push(eq(categories.module_key, moduleKey));

  const where = conds.length ? and(...conds) : undefined;

  const limit = Math.min(toInt(q.limit, 50), 100);
  const offset = Math.max(toInt(q.offset, 0), 0);
  const { primary, primaryCol } = parseOrder(q as any);

  // COUNT
  const countBase = db
    .select({ total: sql<number>`COUNT(*)` })
    .from(categories)
    .innerJoin(categoryI18n, eq(categoryI18n.category_id, categories.id));

  const countQ = where ? countBase.where(where as any) : countBase;
  const [{ total }] = await countQ;

  // ROWS
  const rowsBase = db
    .select(CATEGORY_VIEW_FIELDS)
    .from(categories)
    .innerJoin(categoryI18n, eq(categoryI18n.category_id, categories.id));

  const rowsQ = where ? rowsBase.where(where as any) : rowsBase;

  const orderExprs: any[] = [primary as any];
  if (primaryCol !== 'display_order') orderExprs.push(asc(categories.display_order));

  const rows = await rowsQ
    .orderBy(...orderExprs)
    .limit(limit)
    .offset(offset);

  reply.header('x-total-count', String(total));
  reply.header('content-range', `*/${total}`);
  reply.header('access-control-expose-headers', 'x-total-count, content-range');

  return reply.send(rows);
};

/** GET /categories/:id (public) */
export const getCategoryById: RouteHandler<{
  Params: { id: string };
  Querystring: { locale?: string };
}> = async (req, reply) => {
  const { id } = req.params;
  const rawLocale =
    typeof req.query?.locale === 'string' && req.query.locale.trim()
      ? req.query.locale.trim()
      : undefined;
  const effectiveLocale = normalizeLocale(rawLocale) ?? 'de';

  const rows = await db
    .select(CATEGORY_VIEW_FIELDS)
    .from(categories)
    .innerJoin(categoryI18n, eq(categoryI18n.category_id, categories.id))
    .where(and(eq(categories.id, id), eq(categoryI18n.locale, effectiveLocale)))
    .limit(1);

  if (!rows.length) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(rows[0]);
};

/** GET /categories/by-slug/:slug (public) */
export const getCategoryBySlug: RouteHandler<{
  Params: { slug: string };
  Querystring?: { locale?: string; module_key?: string };
}> = async (req, reply) => {
  const { slug } = req.params;
  const rawLocale =
    typeof req.query?.locale === 'string' && req.query.locale.trim()
      ? req.query.locale.trim()
      : undefined;
  const effectiveLocale = normalizeLocale(rawLocale) ?? 'de';

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
