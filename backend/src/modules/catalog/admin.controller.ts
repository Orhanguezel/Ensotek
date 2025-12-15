// =============================================================
// FILE: src/modules/catalog/admin.controller.ts
// Ensotek – Catalog Request Admin Controller
//   - LIST / GET / PATCH / DELETE
//   - RESEND: POST /catalog-requests/:id/resend
// =============================================================

import type { RouteHandler } from "fastify";
import {
  catalogListQuerySchema,
  patchCatalogAdminBodySchema,
  catalogIdParamsSchema,
  type CatalogListQuery,
  type PatchCatalogAdminBody,
  type CatalogIdParams,
} from "./validation";

import {
  listCatalogRequests,
  getCatalogRequestById,
  updateCatalogRequest,
  deleteCatalogRequest,
} from "./repository";

import { sendCatalogToCustomer } from "./service";
import { setContentRange } from "@/common/utils/contentRange";

/* -------------------------------------------------------------
 * LIST
 * ------------------------------------------------------------- */

export const listCatalogRequestsAdmin: RouteHandler = async (req, reply) => {
  const parsed = catalogListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_query", issues: parsed.error.flatten() },
    });
  }

  const q = parsed.data as CatalogListQuery;

  const { items, total } = await listCatalogRequests({
    orderParam: typeof q.order === "string" ? q.order : undefined,
    sort: q.sort,
    order: q.orderDir,
    limit: q.limit,
    offset: q.offset,

    status: q.status,
    locale: q.locale,
    country_code: q.country_code,

    q: q.q,
    email: q.email,

    created_from: q.created_from,
    created_to: q.created_to,
  });

  const offset = q.offset ?? 0;
  const limit = q.limit ?? items.length ?? 0;

  setContentRange(reply, offset, limit, total);
  reply.header("x-total-count", String(total ?? 0));
  return reply.send(items);
};

/* -------------------------------------------------------------
 * GET
 * ------------------------------------------------------------- */

export const getCatalogRequestAdmin: RouteHandler = async (req, reply) => {
  const { id } = catalogIdParamsSchema.parse(req.params ?? {}) as CatalogIdParams;
  const row = await getCatalogRequestById(id);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/* -------------------------------------------------------------
 * PATCH
 * ------------------------------------------------------------- */

export const updateCatalogRequestAdmin: RouteHandler = async (req, reply) => {
  const { id } = catalogIdParamsSchema.parse(req.params ?? {}) as CatalogIdParams;

  const parsed = patchCatalogAdminBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_body", issues: parsed.error.flatten() },
    });
  }

  const b = parsed.data as PatchCatalogAdminBody;

  try {
    const patch: any = {};
    if (typeof b.status !== "undefined") patch.status = b.status;
    if (typeof b.admin_notes !== "undefined") patch.admin_notes = b.admin_notes ?? null;

    await updateCatalogRequest(id, patch);

    const row = await getCatalogRequestById(id);
    if (!row) return reply.code(404).send({ error: { message: "not_found" } });
    return reply.send(row);
  } catch (err: any) {
    (req as any).log?.error({ err }, "catalog_update_admin_failed");
    return reply.code(500).send({ error: { message: "catalog_update_admin_failed" } });
  }
};

/* -------------------------------------------------------------
 * DELETE
 * ------------------------------------------------------------- */

export const removeCatalogRequestAdmin: RouteHandler = async (req, reply) => {
  const { id } = catalogIdParamsSchema.parse(req.params ?? {}) as CatalogIdParams;

  const affected = await deleteCatalogRequest(id);
  if (!affected) return reply.code(404).send({ error: { message: "not_found" } });

  return reply.code(204).send();
};

/* -------------------------------------------------------------
 * RESEND – POST /catalog-requests/:id/resend
 *   - müşteri mailini tekrar yollar, email_sent_at/status günceller
 * ------------------------------------------------------------- */

export const resendCatalogMailAdmin: RouteHandler = async (req, reply) => {
  const { id } = catalogIdParamsSchema.parse(req.params ?? {}) as CatalogIdParams;

  const row = await getCatalogRequestById(id);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });

  const ok = await sendCatalogToCustomer({
    id,
    locale: row.locale ?? "en",
    country_code: row.country_code ?? null,
    customer_name: row.customer_name,
    company_name: row.company_name ?? null,
    email: row.email,
    phone: row.phone ?? null,
    message: row.message ?? null,
  });

  if (!ok) {
    return reply.code(502).send({
      error: { message: "catalog_mail_failed" },
    });
  }

  const finalRow = await getCatalogRequestById(id);
  return reply.send(finalRow);
};
