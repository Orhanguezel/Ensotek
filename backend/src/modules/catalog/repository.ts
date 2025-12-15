// =============================================================
// FILE: src/modules/catalog/repository.ts
// =============================================================

import { db } from "@/db/client";
import { and, asc, desc, eq, like, or, sql, type SQL, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";

import { catalogRequestsTable, type CatalogRequestRow, type NewCatalogRequestRow } from "./schema";
import type { CatalogRequestStatus } from "./validation";

export type CatalogListParams = {
  orderParam?: string;
  sort?: "created_at" | "updated_at";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;

  status?: CatalogRequestStatus;
  locale?: string;
  country_code?: string;

  q?: string;
  email?: string;

  created_from?: string;
  created_to?: string;
};

const parseOrder = (
  orderParam?: string,
  sort?: CatalogListParams["sort"],
  ord?: CatalogListParams["order"],
): { col: "created_at" | "updated_at"; dir: "asc" | "desc" } | null => {
  if (orderParam) {
    const m = orderParam.match(/^([a-zA-Z0-9_]+)\.(asc|desc)$/);
    const col = m?.[1] as "created_at" | "updated_at" | undefined;
    const dir = m?.[2] as "asc" | "desc" | undefined;
    if (col && dir && (col === "created_at" || col === "updated_at")) return { col, dir };
  }
  if (sort && ord) return { col: sort, dir: ord };
  return null;
};

export async function listCatalogRequests(
  params: CatalogListParams,
): Promise<{ items: CatalogRequestRow[]; total: number }> {
  const conds: (SQL | undefined)[] = [];

  if (params.status) conds.push(eq(catalogRequestsTable.status, params.status));
  if (params.locale) conds.push(eq(catalogRequestsTable.locale, params.locale));
  if (params.country_code) conds.push(eq(catalogRequestsTable.country_code, params.country_code));
  if (params.email) conds.push(eq(catalogRequestsTable.email, params.email));

  if (params.q && params.q.trim()) {
    const s = `%${params.q.trim()}%`;
    conds.push(
      or(
        like(catalogRequestsTable.customer_name, s),
        like(catalogRequestsTable.company_name, s),
        like(catalogRequestsTable.email, s),
      ),
    );
  }

  if (params.created_from && params.created_from.trim()) {
    conds.push(
      gte(
        catalogRequestsTable.created_at,
        sql`CAST(${params.created_from.trim()} AS DATETIME(3))`,
      ),
    );
  }
  if (params.created_to && params.created_to.trim()) {
    conds.push(
      lte(
        catalogRequestsTable.created_at,
        sql`CAST(${params.created_to.trim()} AS DATETIME(3))`,
      ),
    );
  }

  const ord = parseOrder(params.orderParam, params.sort, params.order);

  const orderExpr: SQL =
    ord
      ? ord.dir === "asc"
        ? asc(ord.col === "created_at" ? catalogRequestsTable.created_at : catalogRequestsTable.updated_at)
        : desc(ord.col === "created_at" ? catalogRequestsTable.created_at : catalogRequestsTable.updated_at)
      : desc(catalogRequestsTable.created_at);

  const take = params.limit && params.limit > 0 ? params.limit : 50;
  const skip = params.offset && params.offset >= 0 ? params.offset : 0;

  const whereCond =
    conds.length > 0 ? (and(...(conds.filter(Boolean) as SQL[])) as SQL) : undefined;

  const baseQuery = db.select().from(catalogRequestsTable);
  const rowsQuery = whereCond ? baseQuery.where(whereCond as SQL) : baseQuery;

  const rows = await rowsQuery
    .orderBy(orderExpr, desc(catalogRequestsTable.id))
    .limit(take)
    .offset(skip);

  const countBase = db
    .select({ c: sql<number>`COUNT(*)` })
    .from(catalogRequestsTable);
  const countQuery = whereCond ? countBase.where(whereCond as SQL) : countBase;

  const cnt = await countQuery;
  const total = cnt[0]?.c ?? 0;

  return { items: rows as CatalogRequestRow[], total };
}

export async function getCatalogRequestById(id: string): Promise<CatalogRequestRow | null> {
  const rows = await db
    .select()
    .from(catalogRequestsTable)
    .where(eq(catalogRequestsTable.id, id))
    .limit(1);

  return (rows[0] as CatalogRequestRow | undefined) ?? null;
}

export async function createCatalogRequest(
  values: Omit<NewCatalogRequestRow, "id" | "created_at" | "updated_at"> & { id?: string },
): Promise<string> {
  const id = values.id ?? randomUUID();

  const insertVals: NewCatalogRequestRow = {
    id,
    status: values.status ?? ("new" as any),

    locale: values.locale ?? null,
    country_code: values.country_code ?? null,

    customer_name: values.customer_name,
    company_name: typeof values.company_name === "undefined" ? null : values.company_name,
    email: values.email,
    phone: typeof values.phone === "undefined" ? null : values.phone,
    message: typeof values.message === "undefined" ? null : values.message,

    consent_marketing: typeof values.consent_marketing === "undefined" ? (0 as any) : values.consent_marketing,
    consent_terms: typeof values.consent_terms === "undefined" ? (0 as any) : values.consent_terms,

    admin_notes: typeof values.admin_notes === "undefined" ? null : values.admin_notes,
    email_sent_at: typeof values.email_sent_at === "undefined" ? null : values.email_sent_at,

    created_at: new Date() as any,
    updated_at: new Date() as any,
  };

  await db.insert(catalogRequestsTable).values(insertVals);
  return id;
}

export async function updateCatalogRequest(id: string, patch: Partial<NewCatalogRequestRow>) {
  if (!Object.keys(patch).length) return;

  await db
    .update(catalogRequestsTable)
    .set({ ...patch, updated_at: new Date() as any })
    .where(eq(catalogRequestsTable.id, id));
}

export async function deleteCatalogRequest(id: string): Promise<number> {
  const res = await db.delete(catalogRequestsTable).where(eq(catalogRequestsTable.id, id)).execute();
  return typeof (res as any)?.affectedRows === "number" ? (res as any).affectedRows : 0;
}
