// =============================================================
// FILE: src/modules/sites/controller.ts
// Public endpoints
// =============================================================

import type { RouteHandler } from 'fastify';
import { db } from '@/db/client';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { sites, siteLocales } from './schema';
import { siteListQuerySchema, type SiteListQuery } from './validation';

function toBool(v: unknown): boolean | undefined {
  if (v === true || v === 'true' || v === 1 || v === '1') return true;
  if (v === false || v === 'false' || v === 0 || v === '0') return false;
  return undefined;
}

function mapSitePublic(r: typeof sites.$inferSelect) {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    domain: r.domain,
    is_active: !!r.is_active,
    created_at: r.created_at ? new Date(r.created_at as any).toISOString() : undefined,
    updated_at: r.updated_at ? new Date(r.updated_at as any).toISOString() : undefined,
  };
}

function mapLocalePublic(r: typeof siteLocales.$inferSelect) {
  return {
    id: r.id,
    site_id: r.site_id,
    locale_code: r.locale_code,
    is_default: !!r.is_default,
    is_active: !!r.is_active,
  };
}

/** GET /sites */
export const listSites: RouteHandler = async (req, reply) => {
  const parsed = siteListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: 'INVALID_QUERY', details: parsed.error.flatten() });
  }
  const q = parsed.data as SiteListQuery;

  const filters: any[] = [];

  // Public varsayılan: sadece aktif siteler
  const isActiveBool = typeof q.is_active !== 'undefined' ? toBool(q.is_active) : true;
  if (isActiveBool !== undefined) {
    filters.push(eq(sites.is_active, isActiveBool ? 1 : 0));
  }

  const whereExpr = filters.length > 0 ? filters[0] : undefined;

  const [cntRows, rows] = await Promise.all([
    (whereExpr
      ? db.select({ total: sql<number>`COUNT(1)` }).from(sites).where(whereExpr)
      : db.select({ total: sql<number>`COUNT(1)` }).from(sites)) as any,
    (whereExpr
      ? db
          .select()
          .from(sites)
          .where(whereExpr)
          .orderBy(asc(sites.name))
          .limit(q.limit ?? 200)
          .offset(q.offset ?? 0)
      : db
          .select()
          .from(sites)
          .orderBy(asc(sites.name))
          .limit(q.limit ?? 200)
          .offset(q.offset ?? 0)) as any,
  ]);

  const total = cntRows[0]?.total ?? 0;

  reply.header('x-total-count', String(total));
  reply.header('content-range', `*/${total}`);
  reply.header('access-control-expose-headers', 'x-total-count, content-range');

  return reply.send(rows.map(mapSitePublic));
};

/** GET /sites/:idOrSlug */
export const getSiteBySlug: RouteHandler = async (req, reply) => {
  const { idOrSlug } = req.params as { idOrSlug: string };

  // UUID formatı mı, yoksa slug mı?
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    idOrSlug,
  );

  const rows = await db
    .select()
    .from(sites)
    .where(isUuid ? eq(sites.id, idOrSlug) : eq(sites.slug, idOrSlug))
    .limit(1);

  if (!rows.length) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  return reply.send(mapSitePublic(rows[0]));
};

/** GET /sites/:id/locales */
export const getSiteLocales: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };

  const rows = await db
    .select()
    .from(siteLocales)
    .where(eq(siteLocales.site_id, id))
    .orderBy(desc(siteLocales.is_default), asc(siteLocales.locale_code));

  return reply.send(rows.map(mapLocalePublic));
};
