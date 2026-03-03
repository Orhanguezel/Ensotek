// =============================================================
// FILE: src/modules/sites/admin.controller.ts
// Admin CRUD for sites + site_locales
// =============================================================

import type { RouteHandler } from 'fastify';
import { randomUUID } from 'crypto';
import { db } from '@/db/client';
import { and, asc, desc, eq, like, sql } from 'drizzle-orm';
import { sites, siteLocales, type NewSiteRow, type NewSiteLocaleRow } from './schema';
import {
  adminSiteListQuerySchema,
  adminSiteCreateSchema,
  adminSiteUpdateSchema,
  adminSiteLocaleCreateSchema,
  adminSiteLocaleUpdateSchema,
  type AdminSiteListQuery,
  type AdminSiteCreate,
  type AdminSiteUpdate,
  type AdminSiteLocaleCreate,
  type AdminSiteLocaleUpdate,
} from './validation';

function toBool(v: unknown): boolean | undefined {
  if (v === true || v === 'true' || v === 1 || v === '1') return true;
  if (v === false || v === 'false' || v === 0 || v === '0') return false;
  return undefined;
}

function mapSite(r: typeof sites.$inferSelect) {
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

function mapLocale(r: typeof siteLocales.$inferSelect) {
  return {
    id: r.id,
    site_id: r.site_id,
    locale_code: r.locale_code,
    is_default: !!r.is_default,
    is_active: !!r.is_active,
    created_at: r.created_at ? new Date(r.created_at as any).toISOString() : undefined,
    updated_at: r.updated_at ? new Date(r.updated_at as any).toISOString() : undefined,
  };
}

/* ============================================================
   SITES
   ============================================================ */

/** GET /admin/sites */
export const adminListSites: RouteHandler = async (req, reply) => {
  const parsed = adminSiteListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: 'INVALID_QUERY', details: parsed.error.flatten() });
  }
  const q = parsed.data as AdminSiteListQuery;

  const filters: any[] = [];

  if (q.q?.trim()) {
    const like_ = `%${q.q.trim()}%`;
    filters.push(
      sql`(${sites.name} LIKE ${like_} OR ${sites.slug} LIKE ${like_} OR ${sites.domain} LIKE ${like_})`,
    );
  }

  if (typeof q.is_active !== 'undefined') {
    const b = toBool(q.is_active);
    if (b !== undefined) filters.push(eq(sites.is_active, b ? 1 : 0));
  }

  const whereExpr = filters.length > 0 ? (and(...filters) as any) : undefined;

  const dir = q.order === 'desc' ? 'desc' : 'asc';
  let orderCol: any;
  if (q.sort === 'slug') orderCol = sites.slug;
  else if (q.sort === 'domain') orderCol = sites.domain;
  else if (q.sort === 'created_at') orderCol = sites.created_at;
  else orderCol = sites.name;

  const [cntRows, rows] = await Promise.all([
    (whereExpr
      ? db.select({ total: sql<number>`COUNT(1)` }).from(sites).where(whereExpr)
      : db.select({ total: sql<number>`COUNT(1)` }).from(sites)) as any,
    (whereExpr
      ? db
          .select()
          .from(sites)
          .where(whereExpr)
          .orderBy(dir === 'desc' ? desc(orderCol) : asc(orderCol))
          .limit(q.limit ?? 200)
          .offset(q.offset ?? 0)
      : db
          .select()
          .from(sites)
          .orderBy(dir === 'desc' ? desc(orderCol) : asc(orderCol))
          .limit(q.limit ?? 200)
          .offset(q.offset ?? 0)) as any,
  ]);

  const total = cntRows[0]?.total ?? 0;
  reply.header('x-total-count', String(total));
  reply.header('content-range', `*/${total}`);
  reply.header('access-control-expose-headers', 'x-total-count, content-range');

  return reply.send(rows.map(mapSite));
};

/** GET /admin/sites/:id */
export const adminGetSiteById: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };

  const rows = await db.select().from(sites).where(eq(sites.id, id)).limit(1);

  if (!rows.length) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  return reply.send(mapSite(rows[0]));
};

/** POST /admin/sites */
export const adminCreateSite: RouteHandler = async (req, reply) => {
  try {
    const body = adminSiteCreateSchema.parse(req.body ?? {}) as AdminSiteCreate;

    // slug + domain unique kontrolü
    const [existing] = await db
      .select({ id: sites.id })
      .from(sites)
      .where(sql`${sites.slug} = ${body.slug} OR ${sites.domain} = ${body.domain}`)
      .limit(1);

    if (existing) {
      return reply
        .code(409)
        .send({ error: { message: 'slug_or_domain_conflict' } });
    }

    const id = randomUUID();
    const row: NewSiteRow = {
      id,
      name: body.name,
      slug: body.slug,
      domain: body.domain,
      is_active: (toBool(body.is_active) ?? true) ? 1 : 0,
      created_at: new Date() as any,
      updated_at: new Date() as any,
    };

    await db.insert(sites).values(row);

    const [created] = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
    return reply.code(201).send(mapSite(created));
  } catch (e: any) {
    req.log.error(e);
    if (e?.name === 'ZodError') {
      return reply
        .code(400)
        .send({ error: { message: 'validation_error', details: e.issues } });
    }
    return reply.code(500).send({ error: { message: 'site_create_failed' } });
  }
};

/** PATCH /admin/sites/:id */
export const adminUpdateSite: RouteHandler = async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const patch = adminSiteUpdateSchema.parse(req.body ?? {}) as AdminSiteUpdate;

    const set: Partial<NewSiteRow> = {};
    if (typeof patch.name !== 'undefined') set.name = patch.name;
    if (typeof patch.slug !== 'undefined') set.slug = patch.slug;
    if (typeof patch.domain !== 'undefined') set.domain = patch.domain;
    if (typeof patch.is_active !== 'undefined') {
      set.is_active = (toBool(patch.is_active) ?? true) ? 1 : 0;
    }

    if (Object.keys(set).length > 0) {
      await db
        .update(sites)
        .set({ ...set, updated_at: new Date() as any })
        .where(eq(sites.id, id));
    }

    const rows = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
    if (!rows.length) {
      return reply.code(404).send({ error: { message: 'not_found' } });
    }

    return reply.send(mapSite(rows[0]));
  } catch (e: any) {
    req.log.error(e);
    if (e?.name === 'ZodError') {
      return reply
        .code(400)
        .send({ error: { message: 'validation_error', details: e.issues } });
    }
    return reply.code(500).send({ error: { message: 'site_update_failed' } });
  }
};

/** DELETE /admin/sites/:id */
export const adminDeleteSite: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  await db.delete(sites).where(eq(sites.id, id));
  return reply.code(204).send();
};

/* ============================================================
   SITE LOCALES
   ============================================================ */

/** GET /admin/sites/:id/locales */
export const adminListSiteLocales: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };

  const rows = await db
    .select()
    .from(siteLocales)
    .where(eq(siteLocales.site_id, id))
    .orderBy(desc(siteLocales.is_default), asc(siteLocales.locale_code));

  return reply.send(rows.map(mapLocale));
};

/** POST /admin/sites/:id/locales */
export const adminCreateSiteLocale: RouteHandler = async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const body = adminSiteLocaleCreateSchema.parse(
      req.body ?? {},
    ) as AdminSiteLocaleCreate;

    // Site var mı?
    const [siteRow] = await db
      .select({ id: sites.id })
      .from(sites)
      .where(eq(sites.id, id))
      .limit(1);
    if (!siteRow) {
      return reply.code(404).send({ error: { message: 'site_not_found' } });
    }

    // Eğer default yapılıyorsa, diğerlerini default=0'a çek
    if (toBool(body.is_default)) {
      await db
        .update(siteLocales)
        .set({ is_default: 0, updated_at: new Date() as any })
        .where(eq(siteLocales.site_id, id));
    }

    const localeId = randomUUID();
    const row: NewSiteLocaleRow = {
      id: localeId,
      site_id: id,
      locale_code: body.locale_code,
      is_default: (toBool(body.is_default) ?? false) ? 1 : 0,
      is_active: (toBool(body.is_active) ?? true) ? 1 : 0,
      created_at: new Date() as any,
      updated_at: new Date() as any,
    };

    await db.insert(siteLocales).values(row);

    const [created] = await db
      .select()
      .from(siteLocales)
      .where(eq(siteLocales.id, localeId))
      .limit(1);

    return reply.code(201).send(mapLocale(created));
  } catch (e: any) {
    req.log.error(e);
    if (e?.name === 'ZodError') {
      return reply
        .code(400)
        .send({ error: { message: 'validation_error', details: e.issues } });
    }
    if ((e as any)?.code === 'ER_DUP_ENTRY') {
      return reply
        .code(409)
        .send({ error: { message: 'locale_already_exists' } });
    }
    return reply.code(500).send({ error: { message: 'site_locale_create_failed' } });
  }
};

/** PATCH /admin/sites/:siteId/locales/:localeId */
export const adminUpdateSiteLocale: RouteHandler = async (req, reply) => {
  try {
    const { siteId, localeId } = req.params as { siteId: string; localeId: string };
    const patch = adminSiteLocaleUpdateSchema.parse(
      req.body ?? {},
    ) as AdminSiteLocaleUpdate;

    const set: Partial<NewSiteLocaleRow> = {};
    if (typeof patch.locale_code !== 'undefined') set.locale_code = patch.locale_code;
    if (typeof patch.is_active !== 'undefined') {
      set.is_active = (toBool(patch.is_active) ?? true) ? 1 : 0;
    }

    // Eğer default yapılıyorsa, diğerlerini sıfırla
    if (typeof patch.is_default !== 'undefined') {
      const isDefault = toBool(patch.is_default) ?? false;
      set.is_default = isDefault ? 1 : 0;
      if (isDefault) {
        await db
          .update(siteLocales)
          .set({ is_default: 0, updated_at: new Date() as any })
          .where(and(eq(siteLocales.site_id, siteId), sql`${siteLocales.id} != ${localeId}`));
      }
    }

    if (Object.keys(set).length > 0) {
      await db
        .update(siteLocales)
        .set({ ...set, updated_at: new Date() as any })
        .where(and(eq(siteLocales.id, localeId), eq(siteLocales.site_id, siteId)));
    }

    const rows = await db
      .select()
      .from(siteLocales)
      .where(and(eq(siteLocales.id, localeId), eq(siteLocales.site_id, siteId)))
      .limit(1);

    if (!rows.length) {
      return reply.code(404).send({ error: { message: 'not_found' } });
    }

    return reply.send(mapLocale(rows[0]));
  } catch (e: any) {
    req.log.error(e);
    if (e?.name === 'ZodError') {
      return reply
        .code(400)
        .send({ error: { message: 'validation_error', details: e.issues } });
    }
    return reply.code(500).send({ error: { message: 'site_locale_update_failed' } });
  }
};

/** DELETE /admin/sites/:siteId/locales/:localeId */
export const adminDeleteSiteLocale: RouteHandler = async (req, reply) => {
  const { siteId, localeId } = req.params as { siteId: string; localeId: string };

  // Default locale silinmesin
  const [row] = await db
    .select({ is_default: siteLocales.is_default })
    .from(siteLocales)
    .where(and(eq(siteLocales.id, localeId), eq(siteLocales.site_id, siteId)))
    .limit(1);

  if (!row) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  if (row.is_default) {
    return reply
      .code(400)
      .send({ error: { message: 'cannot_delete_default_locale' } });
  }

  await db
    .delete(siteLocales)
    .where(and(eq(siteLocales.id, localeId), eq(siteLocales.site_id, siteId)));

  return reply.code(204).send();
};
