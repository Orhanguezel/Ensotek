// =============================================================
// FILE: src/modules/catalog/controller.ts (PUBLIC)
// =============================================================

import type { RouteHandler } from "fastify";
import { catalogRequestBodySchema, type CatalogRequestBody } from "./validation";
import { createCatalogRequest, getCatalogRequestById } from "./repository";
import { triggerNewCatalogRequestNotifications } from "./service";

const isTruthyBoolLike = (v: any) => v === true || v === 1 || v === "1" || v === "true";

export const createCatalogRequestPublic: RouteHandler = async (req, reply) => {
  const parsed = catalogRequestBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_body", issues: parsed.error.flatten() },
    });
  }

  const b = parsed.data as CatalogRequestBody;

  try {
    const id = await createCatalogRequest({
      status: "new",
      locale: b.locale ?? (req as any).locale ?? null,
      country_code: b.country_code ?? null,

      customer_name: b.customer_name.trim(),
      company_name:
        typeof b.company_name === "string" ? b.company_name.trim() : b.company_name ?? null,

      email: b.email.toLowerCase(),
      phone: typeof b.phone === "string" ? b.phone.trim() : b.phone ?? null,
      message: typeof b.message === "string" ? b.message.trim() : b.message ?? null,

      consent_marketing: isTruthyBoolLike(b.consent_marketing) ? (1 as any) : (0 as any),
      consent_terms: isTruthyBoolLike(b.consent_terms) ? (1 as any) : (0 as any),

      admin_notes: null,
      email_sent_at: null,
    } as any);

    const row = await getCatalogRequestById(id);

    // Admin notify + admin mail
    try {
      await triggerNewCatalogRequestNotifications({
        id,
        locale: row?.locale ?? b.locale ?? (req as any).locale ?? "en",
        country_code: row?.country_code ?? b.country_code ?? null,
        customer_name: row?.customer_name ?? b.customer_name,
        company_name: row?.company_name ?? (b.company_name ?? null),
        email: row?.email ?? b.email,
        phone: row?.phone ?? (b.phone ?? null),
        message: row?.message ?? (b.message ?? null),
      });
    } catch (err: any) {
      req.log?.error?.({ err }, "catalog_public_admin_notify_failed");
    }

    return reply.code(201).send(row ?? { id });
  } catch (err: any) {
    req.log?.error?.({ err }, "catalog_create_public_failed");
    return reply.code(500).send({ error: { message: "catalog_create_public_failed" } });
  }
};
