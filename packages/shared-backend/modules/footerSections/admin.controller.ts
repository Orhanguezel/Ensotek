import type { RouteHandler } from "fastify";
import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, like, sql, type SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

import { db } from "../../db/client";
import { DEFAULT_LOCALE } from "../../core/i18n";

const SITE_ID = 'kompozit' as const;
import { menuItems } from "../menuItems/schema";
import { footerSections, footerSectionsI18n, type NewFooterSectionRow, type NewFooterSectionI18nRow } from "./schema";
import {
  footerSectionCreateSchema,
  footerSectionListQuerySchema,
  footerSectionUpdateSchema,
  type FooterSectionCreateInput,
  type FooterSectionListQuery,
  type FooterSectionUpdateInput,
} from "./validation";

function toBool(v: unknown): boolean | undefined {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  if (v === false || v === "false" || v === 0 || v === "0") return false;
  return undefined;
}

type FooterSectionMerged = {
  id: string;
  site_id: string | null;
  is_active: boolean;
  display_order: number;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  title: string | null;
  slug: string | null;
  description: string | null;
  locale_resolved: string | null;
};

function baseSelect(i18nReq: any, i18nDef: any) {
  return {
    id: footerSections.id,
    site_id: footerSections.site_id,
    is_active: footerSections.is_active,
    display_order: footerSections.display_order,
    created_at: footerSections.created_at,
    updated_at: footerSections.updated_at,
    title: sql<string>`COALESCE(${i18nReq.title}, ${i18nDef.title})`.as("title"),
    slug: sql<string>`COALESCE(${i18nReq.slug}, ${i18nDef.slug})`.as("slug"),
    description: sql<string>`COALESCE(${i18nReq.description}, ${i18nDef.description})`.as("description"),
    locale_resolved: sql<string>`
      CASE
        WHEN ${i18nReq.id} IS NOT NULL THEN ${i18nReq.locale}
        ELSE ${i18nDef.locale}
      END
    `.as("locale_resolved"),
  };
}

function mapRowToAdmin(r: FooterSectionMerged) {
  return {
    id: r.id,
    site_id: r.site_id ?? null,
    is_active: !!r.is_active,
    display_order: r.display_order ?? 0,
    created_at: r.created_at ? new Date(r.created_at as any).toISOString() : "",
    updated_at: r.updated_at ? new Date(r.updated_at as any).toISOString() : "",
    title: r.title ?? "",
    slug: r.slug ?? "",
    description: r.description ?? null,
    locale: r.locale_resolved,
    locale_resolved: r.locale_resolved,
  };
}

async function getFooterSectionI18nRow(sectionId: string, locale: string) {
  const rows = await db
    .select()
    .from(footerSectionsI18n)
    .where(and(eq(footerSectionsI18n.section_id, sectionId), eq(footerSectionsI18n.locale, locale)))
    .limit(1);
  return rows[0] ?? null;
}

async function upsertFooterSectionI18n(
  sectionId: string,
  locale: string,
  data: Partial<Pick<NewFooterSectionI18nRow, "title" | "slug" | "description">> & { id?: string },
) {
  const insertVals: NewFooterSectionI18nRow = {
    id: data.id ?? randomUUID(),
    section_id: sectionId,
    locale,
    title: data.title ?? "",
    slug: data.slug ?? "",
    description: data.description ?? null,
    created_at: new Date() as any,
    updated_at: new Date() as any,
  };

  const setObj: Record<string, any> = { updated_at: new Date() };
  if (typeof data.title !== "undefined") setObj.title = data.title;
  if (typeof data.slug !== "undefined") setObj.slug = data.slug;
  if (typeof data.description !== "undefined") setObj.description = data.description;
  if (Object.keys(setObj).length === 1) return;

  await db.insert(footerSectionsI18n).values(insertVals).onDuplicateKeyUpdate({ set: setObj });
}

async function findMergedById(id: string, locale: string) {
  const i18nReq = alias(footerSectionsI18n, "fsi_req");
  const i18nDef = alias(footerSectionsI18n, "fsi_def");

  const rows = (await db
    .select(baseSelect(i18nReq, i18nDef))
    .from(footerSections)
    .leftJoin(i18nReq, and(eq(i18nReq.section_id, footerSections.id), eq(i18nReq.locale, locale)))
    .leftJoin(i18nDef, and(eq(i18nDef.section_id, footerSections.id), eq(i18nDef.locale, DEFAULT_LOCALE)))
    .where(eq(footerSections.id, id))
    .limit(1)) as FooterSectionMerged[];

  return rows[0] ?? null;
}

export const adminListFooterSections: RouteHandler = async (req, reply) => {
  const parsed = footerSectionListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) return reply.code(400).send({ error: "INVALID_QUERY", details: parsed.error.flatten() });

  const q = parsed.data as FooterSectionListQuery;
  const locale = q.locale || ((req as any).locale as string | undefined) || DEFAULT_LOCALE;
  const i18nReq = alias(footerSectionsI18n, "fsi_req");
  const i18nDef = alias(footerSectionsI18n, "fsi_def");

  const filters: SQL[] = [];
  if (typeof q.is_active !== "undefined") {
    const b = toBool(q.is_active);
    if (b !== undefined) filters.push(eq(footerSections.is_active, b));
  }
  if (q.slug) filters.push(sql`COALESCE(${i18nReq.slug}, ${i18nDef.slug}) = ${q.slug}`);
  if (q.q?.trim()) {
    const term = `%${q.q.trim()}%`;
    filters.push(
      sql`(COALESCE(${i18nReq.title}, ${i18nDef.title}) LIKE ${term} OR COALESCE(${i18nReq.slug}, ${i18nDef.slug}) LIKE ${term})`,
    );
  }
  const whereExpr = filters.length ? (and(...filters) as SQL) : undefined;

  const countBase = db
    .select({ total: sql<number>`COUNT(1)` })
    .from(footerSections)
    .leftJoin(i18nReq, and(eq(i18nReq.section_id, footerSections.id), eq(i18nReq.locale, locale)))
    .leftJoin(i18nDef, and(eq(i18nDef.section_id, footerSections.id), eq(i18nDef.locale, DEFAULT_LOCALE)));
  const countRows = await (whereExpr ? (countBase as any).where(whereExpr) : countBase);
  const total = Number(countRows[0]?.total ?? 0);

  const dataBase = db
    .select(baseSelect(i18nReq, i18nDef))
    .from(footerSections)
    .leftJoin(i18nReq, and(eq(i18nReq.section_id, footerSections.id), eq(i18nReq.locale, locale)))
    .leftJoin(i18nDef, and(eq(i18nDef.section_id, footerSections.id), eq(i18nDef.locale, DEFAULT_LOCALE)));
  const dataQuery = (whereExpr ? (dataBase as any).where(whereExpr) : dataBase) as any;

  const sortExpr =
    q.sort === "created_at" ? footerSections.created_at : q.sort === "updated_at" ? footerSections.updated_at : footerSections.display_order;
  const dir = q.orderDir === "desc" ? "desc" : "asc";

  const rows = (await dataQuery
    .orderBy(dir === "desc" ? desc(sortExpr) : asc(sortExpr))
    .limit(q.limit ?? 1000)
    .offset(q.offset ?? 0)) as FooterSectionMerged[];

  reply.header("x-total-count", String(total));
  reply.header("content-range", `*/${total}`);
  reply.header("access-control-expose-headers", "x-total-count, content-range");
  return reply.send(rows.map(mapRowToAdmin));
};

export const adminGetFooterSectionById: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  const q = (req.query ?? {}) as { locale?: string };
  const locale = q.locale || ((req as any).locale as string | undefined) || DEFAULT_LOCALE;
  const row = await findMergedById(id, locale);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(mapRowToAdmin(row));
};

export const adminGetFooterSectionBySlug: RouteHandler = async (req, reply) => {
  const { slug } = req.params as { slug: string };
  const q = (req.query ?? {}) as { locale?: string };
  const locale = q.locale || ((req as any).locale as string | undefined) || DEFAULT_LOCALE;

  const rows = await db
    .select({ id: footerSections.id })
    .from(footerSections)
    .innerJoin(footerSectionsI18n, eq(footerSections.id, footerSectionsI18n.section_id))
    .where(and(eq(footerSectionsI18n.locale, locale), eq(footerSectionsI18n.slug, slug)))
    .limit(1);

  if (!rows.length) return reply.code(404).send({ error: { message: "not_found" } });
  const row = await findMergedById(rows[0].id, locale);
  return reply.send(mapRowToAdmin(row!));
};

export const adminCreateFooterSection: RouteHandler = async (req, reply) => {
  try {
    const body = footerSectionCreateSchema.parse(req.body ?? {}) as FooterSectionCreateInput;
    const locale = body.locale || ((req as any).locale as string | undefined) || DEFAULT_LOCALE;
    const id = randomUUID();

    const parentInsert: NewFooterSectionRow = {
      id,
      site_id: SITE_ID,
      is_active: toBool(body.is_active) ?? true,
      display_order: body.display_order ?? 0,
      created_at: new Date() as any,
      updated_at: new Date() as any,
    };

    await db.insert(footerSections).values(parentInsert);
    await upsertFooterSectionI18n(id, locale, {
      title: body.title.trim(),
      slug: body.slug.trim(),
      description: body.description ?? null,
    });

    const row = await findMergedById(id, locale);
    return reply.code(201).send(mapRowToAdmin(row!));
  } catch (e: any) {
    req.log.error(e);
    if (e?.name === "ZodError") return reply.code(400).send({ error: { message: "validation_error", details: e.issues } });
    return reply.code(500).send({ error: { message: "footer_section_create_failed" } });
  }
};

export const adminUpdateFooterSection: RouteHandler = async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const patch = footerSectionUpdateSchema.parse(req.body ?? {}) as FooterSectionUpdateInput;
    const locale = patch.locale || ((req as any).locale as string | undefined) || DEFAULT_LOCALE;

    const parentPatch: Partial<NewFooterSectionRow> = {};
    if (typeof patch.is_active !== "undefined") parentPatch.is_active = toBool(patch.is_active) ?? true;
    if (typeof patch.display_order !== "undefined") parentPatch.display_order = patch.display_order;
    if (Object.keys(parentPatch).length) {
      await db.update(footerSections).set({ ...parentPatch, updated_at: new Date() as any }).where(eq(footerSections.id, id));
    }

    const hasI18n = typeof patch.title !== "undefined" || typeof patch.slug !== "undefined" || typeof patch.description !== "undefined";
    if (hasI18n) {
      const exists = await getFooterSectionI18nRow(id, locale);
      if (!exists && (!patch.title || !patch.slug)) {
        return reply.code(400).send({ error: { message: "missing_required_translation_fields" } });
      }
      await upsertFooterSectionI18n(id, locale, {
        title: typeof patch.title === "string" ? patch.title.trim() : undefined,
        slug: typeof patch.slug === "string" ? patch.slug.trim() : undefined,
        description: typeof patch.description !== "undefined" ? patch.description ?? null : undefined,
      });
    }

    const row = await findMergedById(id, locale);
    if (!row) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(mapRowToAdmin(row));
  } catch (e: any) {
    req.log.error(e);
    if (e?.name === "ZodError") return reply.code(400).send({ error: { message: "validation_error", details: e.issues } });
    return reply.code(500).send({ error: { message: "footer_section_update_failed" } });
  }
};

export const adminDeleteFooterSection: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };

  await db.transaction(async (tx) => {
    await tx.update(menuItems).set({ section_id: null, updated_at: new Date() as any }).where(eq(menuItems.section_id, id));
    await tx.delete(footerSections).where(eq(footerSections.id, id));
  });

  return reply.code(204).send();
};
