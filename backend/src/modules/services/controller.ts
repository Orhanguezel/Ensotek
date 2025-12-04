// src/modules/services/controller.ts
// =============================================================
// Ensotek – Public Services Controller
//  - GET /services
//  - GET /services/:id
//  - GET /services/by-slug/:slug
//  - GET /services/:id/images
// =============================================================

import type { RouteHandler } from "fastify";
import { DEFAULT_LOCALE, type Locale } from "@/core/i18n";

import {
  serviceListQuerySchema,
  type ServiceListQuery,
} from "./validation";

import {
  listServices,
  getServiceMergedById,
  getServiceMergedBySlug,
  listServiceImages,
} from "./repository";

/* ----------------------------- LIST (PUBLIC) ----------------------------- */
/**
 * GET /services
 * - Public liste endpoint'i
 * - Varsayılan olarak sadece is_active = 1 kayıtları döner
 * - Admin'deki listServicesAdmin ile aynı query şemasını kullanır
 */
export const listServicesPublic: RouteHandler<{
  Querystring: ServiceListQuery;
}> = async (req, reply) => {
  const parsed = serviceListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_query", issues: parsed.error.issues },
    });
  }

  const q = parsed.data;
  const locale: Locale = (req as any).locale ?? DEFAULT_LOCALE;
  const def = DEFAULT_LOCALE;

  // Public tarafta default: sadece aktif kayıtlar
  const isActive =
    typeof q.is_active === "undefined" ? true : q.is_active;

  const { items, total } = await listServices({
    locale,
    defaultLocale: def,
    orderParam: typeof q.order === "string" ? q.order : undefined,
    sort: q.sort,
    order: q.orderDir,
    limit: q.limit,
    offset: q.offset,
    q: q.q,
    type: q.type,
    category_id: q.category_id,
    sub_category_id: q.sub_category_id,
    featured: q.featured,
    is_active: isActive,
  });

  reply.header("x-total-count", String(total ?? 0));
  return reply.send(items);
};

/* ----------------------------- GET BY ID (PUBLIC) ----------------------------- */
/**
 * GET /services/:id
 * - Public detay
 * - Varsayılan locale + fallback
 * - is_active = 0 olanlar için 404 döndürmek mantıklı
 */
export const getServicePublic: RouteHandler<{
  Params: { id: string };
}> = async (req, reply) => {
  const locale: Locale = (req as any).locale ?? DEFAULT_LOCALE;
  const def = DEFAULT_LOCALE;

  const row = await getServiceMergedById(locale, def, req.params.id);
  if (!row || row.is_active !== 1) {
    return reply.code(404).send({ error: { message: "not_found" } });
  }

  return reply.send(row);
};

/* ----------------------------- GET BY SLUG (PUBLIC) ----------------------------- */
/**
 * GET /services/by-slug/:slug
 * - Public detay (slug ile)
 * - is_active = 0 olanlar için 404
 */
export const getServiceBySlugPublic: RouteHandler<{
  Params: { slug: string };
}> = async (req, reply) => {
  const locale: Locale = (req as any).locale ?? DEFAULT_LOCALE;
  const def = DEFAULT_LOCALE;

  const row = await getServiceMergedBySlug(
    locale,
    def,
    req.params.slug,
  );

  if (!row || row.is_active !== 1) {
    return reply.code(404).send({ error: { message: "not_found" } });
  }

  return reply.send(row);
};

/* ----------------------------- IMAGES (PUBLIC) ----------------------------- */
/**
 * GET /services/:id/images
 * - Public gallery
 * - Varsayılan: sadece aktif görseller (onlyActive: true)
 */
export const listServiceImagesPublic: RouteHandler<{
  Params: { id: string };
}> = async (req, reply) => {
  const locale: Locale = (req as any).locale ?? DEFAULT_LOCALE;
  const def = DEFAULT_LOCALE;

  const rows = await listServiceImages({
    serviceId: req.params.id,
    locale,
    defaultLocale: def,
    onlyActive: true,
  });

  return reply.send(rows);
};
