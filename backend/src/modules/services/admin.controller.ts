// src/modules/services/admin.controller.ts
// =============================================================

import type { RouteHandler } from "fastify";
import { randomUUID } from "crypto";

import {
  serviceListQuerySchema,
  upsertServiceBodySchema,
  patchServiceBodySchema,
  upsertServiceImageBodySchema,
  patchServiceImageBodySchema,
  type ServiceListQuery,
  type UpsertServiceBody,
  type PatchServiceBody,
  type UpsertServiceImageBody,
  type PatchServiceImageBody,
} from "./validation";

import {
  listServices,
  getServiceMergedById,
  getServiceMergedBySlug,
  createServiceParent,
  upsertServiceI18n,
  upsertServiceI18nAllLocales,
  updateServiceParent,
  deleteServiceParent,
  listServiceImages,
  createServiceImage,
  upsertServiceImageI18n,
  upsertServiceImageI18nAllLocales,
  updateServiceImage,
  deleteServiceImage,
  reorderServices,
} from "./repository";

// ✅ Dinamik locale/def locale DB’den
import { getAppLocales, getDefaultLocale } from "@/modules/siteSettings/service";
import { normalizeLocale } from "@/core/i18n";

type LocaleCode = string;
type LocaleQueryLike = { locale?: string; default_locale?: string };

const toBool = (v: unknown): boolean => v === true || v === 1 || v === "1" || v === "true";

function normalizeLooseLocale(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return normalizeLocale(s) || s.toLowerCase();
}

/**
 * Admin için DİNAMİK locale çözümü:
 *  - locale: query.locale > req.locale > db default_locale > ilk app_locales > "tr"
 *  - default_locale: query.default_locale > db default_locale > "tr"
 */
async function resolveLocales(req: any, query?: LocaleQueryLike): Promise<{ locale: LocaleCode; def: LocaleCode }> {
  const q = query ?? ((req.query ?? {}) as LocaleQueryLike);

  const reqRaw = normalizeLooseLocale(q.locale) ?? normalizeLooseLocale(req.locale);
  const defRawFromQuery = normalizeLooseLocale(q.default_locale);

  const appLocales = await getAppLocales(reqRaw);
  const dbDefault = normalizeLooseLocale(await getDefaultLocale(reqRaw)) ?? "tr";

  const safeDefault = appLocales.includes(dbDefault) ? dbDefault : appLocales[0] ?? "tr";
  const safeLocale = reqRaw && appLocales.includes(reqRaw) ? reqRaw : safeDefault;

  const safeDef = defRawFromQuery && appLocales.includes(defRawFromQuery) ? defRawFromQuery : safeDefault;

  return { locale: safeLocale, def: safeDef };
}

/* ----------------------------- list/get ----------------------------- */

export const listServicesAdmin: RouteHandler<{ Querystring: ServiceListQuery }> = async (req, reply) => {
  const parsed = serviceListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_query", issues: parsed.error.issues },
    });
  }

  const q = parsed.data;

  const { locale, def } = await resolveLocales(req, {
    locale: q.locale,
    default_locale: q.default_locale,
  });

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
    is_active: q.is_active,
  });

  reply.header("x-total-count", String(total ?? 0));
  return reply.send(items);
};

export const getServiceAdmin: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const { locale, def } = await resolveLocales(req);
  const row = await getServiceMergedById(locale, def, req.params.id);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

export const getServiceBySlugAdmin: RouteHandler<{ Params: { slug: string } }> = async (req, reply) => {
  const { locale, def } = await resolveLocales(req);
  const row = await getServiceMergedBySlug(locale, def, req.params.slug);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/* ----------------------------- create/update/delete (service) ----------------------------- */

export const createServiceAdmin: RouteHandler<{ Body: UpsertServiceBody }> = async (req, reply) => {
  const parsed = upsertServiceBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_body", issues: parsed.error.issues },
    });
  }
  const b = parsed.data;

  const id = randomUUID();
  const now = new Date();

  await createServiceParent({
    id,
    type: b.type ?? "other",

    category_id: typeof b.category_id !== "undefined" ? b.category_id ?? null : null,
    sub_category_id: typeof b.sub_category_id !== "undefined" ? b.sub_category_id ?? null : null,

    featured: toBool(b.featured) ? 1 : 0,
    is_active: toBool(b.is_active) ? 1 : 0,
    display_order: typeof b.display_order === "number" ? b.display_order : 1,

    featured_image: typeof b.featured_image !== "undefined" ? b.featured_image ?? null : null,
    image_url: typeof b.image_url !== "undefined" ? b.image_url ?? null : null,
    image_asset_id: typeof b.image_asset_id !== "undefined" ? b.image_asset_id ?? null : null,

    created_at: now as any,
    updated_at: now as any,
  });

  const hasI18nFields =
    typeof b.name !== "undefined" ||
    typeof b.slug !== "undefined" ||
    typeof b.description !== "undefined" ||
    typeof b.material !== "undefined" ||
    typeof b.price !== "undefined" ||
    typeof b.includes !== "undefined" ||
    typeof b.warranty !== "undefined" ||
    typeof b.image_alt !== "undefined" ||
    typeof b.tags !== "undefined" ||
    typeof b.meta_title !== "undefined" ||
    typeof b.meta_description !== "undefined" ||
    typeof b.meta_keywords !== "undefined";

  // ✅ request locale’i dinamik çöz
  const { locale: reqLocale, def } = await resolveLocales(req, { locale: b.locale });

  if (hasI18nFields) {
    if (!b.name || !b.slug) {
      return reply.code(400).send({
        error: { message: "missing_required_translation_fields" },
      });
    }

    const payload = {
      name: b.name.trim(),
      slug: b.slug.trim(),
      description: b.description,
      material: b.material,
      price: b.price,
      includes: b.includes,
      warranty: b.warranty,
      image_alt: b.image_alt,

      tags: b.tags,
      meta_title: b.meta_title,
      meta_description: b.meta_description,
      meta_keywords: b.meta_keywords,
    };

    const replicateAll = b.replicate_all_locales ?? true;
    if (replicateAll) {
      await upsertServiceI18nAllLocales(id, payload);
    } else {
      await upsertServiceI18n(id, reqLocale, payload);
    }
  }

  const row = await getServiceMergedById(reqLocale, def, id);
  return reply.code(201).send(row);
};

export const updateServiceAdmin: RouteHandler<{ Params: { id: string }; Body: PatchServiceBody }> = async (req, reply) => {
  const parsed = patchServiceBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_body", issues: parsed.error.issues },
    });
  }
  const b = parsed.data;

  const hasParentPatch =
    typeof b.type !== "undefined" ||
    typeof b.category_id !== "undefined" ||
    typeof b.sub_category_id !== "undefined" ||
    typeof b.featured !== "undefined" ||
    typeof b.is_active !== "undefined" ||
    typeof b.display_order !== "undefined" ||
    typeof b.featured_image !== "undefined" ||
    typeof b.image_url !== "undefined" ||
    typeof b.image_asset_id !== "undefined";

  if (hasParentPatch) {
    const parentPatch: any = {};

    if (typeof b.type !== "undefined") parentPatch.type = b.type;
    if (typeof b.category_id !== "undefined") parentPatch.category_id = b.category_id ?? null;
    if (typeof b.sub_category_id !== "undefined") parentPatch.sub_category_id = b.sub_category_id ?? null;
    if (typeof b.featured !== "undefined") parentPatch.featured = toBool(b.featured) ? 1 : 0;
    if (typeof b.is_active !== "undefined") parentPatch.is_active = toBool(b.is_active) ? 1 : 0;
    if (typeof b.display_order !== "undefined") parentPatch.display_order = b.display_order;

    if (typeof b.featured_image !== "undefined") parentPatch.featured_image = b.featured_image ?? null;
    if (typeof b.image_url !== "undefined") parentPatch.image_url = b.image_url ?? null;
    if (typeof b.image_asset_id !== "undefined") parentPatch.image_asset_id = b.image_asset_id ?? null;

    await updateServiceParent(req.params.id, parentPatch);
  }

  const hasI18n =
    typeof b.name !== "undefined" ||
    typeof b.slug !== "undefined" ||
    typeof b.description !== "undefined" ||
    typeof b.material !== "undefined" ||
    typeof b.price !== "undefined" ||
    typeof b.includes !== "undefined" ||
    typeof b.warranty !== "undefined" ||
    typeof b.image_alt !== "undefined" ||
    typeof b.tags !== "undefined" ||
    typeof b.meta_title !== "undefined" ||
    typeof b.meta_description !== "undefined" ||
    typeof b.meta_keywords !== "undefined";

  if (hasI18n) {
    const { locale: loc } = await resolveLocales(req, { locale: b.locale });

    const payload = {
      name: typeof b.name === "string" ? b.name.trim() : undefined,
      slug: typeof b.slug === "string" ? b.slug.trim() : undefined,
      description: typeof b.description !== "undefined" ? b.description : undefined,
      material: typeof b.material !== "undefined" ? b.material : undefined,
      price: typeof b.price !== "undefined" ? b.price : undefined,
      includes: typeof b.includes !== "undefined" ? b.includes : undefined,
      warranty: typeof b.warranty !== "undefined" ? b.warranty : undefined,
      image_alt: typeof b.image_alt !== "undefined" ? b.image_alt : undefined,

      tags: typeof b.tags !== "undefined" ? b.tags : undefined,
      meta_title: typeof b.meta_title !== "undefined" ? b.meta_title : undefined,
      meta_description: typeof b.meta_description !== "undefined" ? b.meta_description : undefined,
      meta_keywords: typeof b.meta_keywords !== "undefined" ? b.meta_keywords : undefined,
    };

    if (b.apply_all_locales) {
      await upsertServiceI18nAllLocales(req.params.id, payload);
    } else {
      await upsertServiceI18n(req.params.id, loc, payload);
    }
  }

  const { locale, def } = await resolveLocales(req, {
    locale: (b.locale as string | undefined) ?? undefined,
    default_locale: undefined,
  });

  const row = await getServiceMergedById(locale, def, req.params.id);
  if (!row) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

export const removeServiceAdmin: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const affected = await deleteServiceParent(req.params.id);
  if (!affected) return reply.code(404).send({ error: { message: "not_found" } });
  return reply.code(204).send();
};

/* ----------------------------- images (gallery) ----------------------------- */

export const listServiceImagesAdmin: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const { locale, def } = await resolveLocales(req);
  const rows = await listServiceImages({ serviceId: req.params.id, locale, defaultLocale: def });
  return reply.send(rows);
};

export const createServiceImageAdmin: RouteHandler<{ Params: { id: string }; Body: UpsertServiceImageBody }> = async (
  req,
  reply,
) => {
  const parsed = upsertServiceImageBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({
      error: { message: "invalid_body", issues: parsed.error.issues },
    });
  }
  const b = parsed.data;

  const id = randomUUID();
  const now = new Date();

  await createServiceImage({
    id,
    service_id: req.params.id,
    image_asset_id: typeof b.image_asset_id !== "undefined" ? b.image_asset_id ?? null : null,
    image_url: typeof b.image_url !== "undefined" ? b.image_url ?? null : null,
    is_active: toBool(b.is_active) ? 1 : 0,
    display_order: typeof b.display_order === "number" ? b.display_order : 0,
    created_at: now as any,
    updated_at: now as any,
  });

  const { locale: loc, def } = await resolveLocales(req, { locale: b.locale });

  const hasI18nFields = typeof b.title !== "undefined" || typeof b.alt !== "undefined" || typeof b.caption !== "undefined";
  if (hasI18nFields) {
    const payload = {
      title: typeof b.title !== "undefined" ? b.title ?? null : undefined,
      alt: typeof b.alt !== "undefined" ? b.alt ?? null : undefined,
      caption: typeof b.caption !== "undefined" ? b.caption ?? null : undefined,
    };

    const replicateAll = b.replicate_all_locales ?? true;
    if (replicateAll) {
      await upsertServiceImageI18nAllLocales(id, payload);
    } else {
      await upsertServiceImageI18n(id, loc, payload);
    }
  }

  const rows = await listServiceImages({ serviceId: req.params.id, locale: loc, defaultLocale: def });
  return reply.code(201).send(rows);
};

export const updateServiceImageAdmin: RouteHandler<{ Params: { id: string; imageId: string }; Body: PatchServiceImageBody }> =
  async (req, reply) => {
    const parsed = patchServiceImageBodySchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return reply.code(400).send({
        error: { message: "invalid_body", issues: parsed.error.issues },
      });
    }
    const b = parsed.data;

    const patch: any = {};
    if (typeof b.image_asset_id !== "undefined") patch.image_asset_id = b.image_asset_id ?? null;
    if (typeof b.image_url !== "undefined") patch.image_url = b.image_url ?? null;
    if (typeof b.is_active !== "undefined") patch.is_active = toBool(b.is_active) ? 1 : 0;
    if (typeof b.display_order !== "undefined") patch.display_order = b.display_order;

    if (Object.keys(patch).length) {
      await updateServiceImage(req.params.imageId, patch);
    }

    const hasI18nFields = typeof b.title !== "undefined" || typeof b.alt !== "undefined" || typeof b.caption !== "undefined";
    const { locale: loc, def } = await resolveLocales(req, { locale: b.locale });

    if (hasI18nFields) {
      const payload = {
        title: typeof b.title !== "undefined" ? b.title ?? null : undefined,
        alt: typeof b.alt !== "undefined" ? b.alt ?? null : undefined,
        caption: typeof b.caption !== "undefined" ? b.caption ?? null : undefined,
      };

      if (b.apply_all_locales) {
        await upsertServiceImageI18nAllLocales(req.params.imageId, payload);
      } else {
        await upsertServiceImageI18n(req.params.imageId, loc, payload);
      }
    }

    const rows = await listServiceImages({ serviceId: req.params.id, locale: loc, defaultLocale: def });
    return reply.send(rows);
  };

export const removeServiceImageAdmin: RouteHandler<{ Params: { id: string; imageId: string } }> = async (req, reply) => {
  const affected = await deleteServiceImage(req.params.imageId);
  if (!affected) return reply.code(404).send({ error: { message: "not_found" } });

  const { locale, def } = await resolveLocales(req);
  const rows = await listServiceImages({ serviceId: req.params.id, locale, defaultLocale: def });
  return reply.send(rows);
};

/* ----------------------------- reorder (display_order) ----------------------------- */

type ReorderServicesBody = { items?: { id: string; display_order: number }[] };

export const reorderServicesAdmin: RouteHandler<{ Body: ReorderServicesBody }> = async (req, reply) => {
  const body = (req.body ?? {}) as ReorderServicesBody;
  const items = Array.isArray(body.items) ? body.items : [];

  if (!items.length) {
    return reply.code(400).send({
      error: { message: "invalid_body", details: "items boş olamaz" },
    });
  }

  try {
    await reorderServices(items);
    return reply.code(204).send();
  } catch (err) {
    (req as any).log?.error?.({ err }, "services_reorder_failed");
    return reply.code(500).send({ error: { message: "reorder_failed" } });
  }
};
