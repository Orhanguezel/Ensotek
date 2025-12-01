// src/modules/services/admin.controller.ts
// =============================================================

import type { RouteHandler } from "fastify";
import { randomUUID } from "crypto";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/core/i18n";
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
} from "./repository";

const toBool = (v: unknown): boolean =>
  v === true || v === 1 || v === "1" || v === "true";

/* ----------------------------- list/get ----------------------------- */

export const listServicesAdmin: RouteHandler<{
  Querystring: ServiceListQuery;
}> = async (req, reply) => {
  const parsed = serviceListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: "invalid_query", issues: parsed.error.issues } });
  }
  const q = parsed.data;
  const locale: Locale = (req as any).locale ?? DEFAULT_LOCALE;
  const def = DEFAULT_LOCALE;

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

export const getServiceAdmin: RouteHandler<{
  Params: { id: string };
}> = async (req, reply) => {
  const locale: Locale = (req as any).locale ?? DEFAULT_LOCALE;
  const def = DEFAULT_LOCALE;
  const row = await getServiceMergedById(locale, def, req.params.id);
  if (!row)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

export const getServiceBySlugAdmin: RouteHandler<{
  Params: { slug: string };
}> = async (req, reply) => {
  const locale: Locale = (req as any).locale ?? DEFAULT_LOCALE;
  const def = DEFAULT_LOCALE;
  const row = await getServiceMergedBySlug(
    locale,
    def,
    req.params.slug,
  );
  if (!row)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

/* ----------------------------- create/update/delete (service) ----------------------------- */

export const createServiceAdmin: RouteHandler<{
  Body: UpsertServiceBody;
}> = async (req, reply) => {
  const parsed = upsertServiceBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: "invalid_body", issues: parsed.error.issues } });
  }
  const b = parsed.data;
  const id = randomUUID();
  const now = new Date();

  // parent (non-i18n)
  await createServiceParent({
    id,
    type: b.type ?? "other",

    category_id:
      typeof b.category_id !== "undefined"
        ? b.category_id ?? null
        : null,
    sub_category_id:
      typeof b.sub_category_id !== "undefined"
        ? b.sub_category_id ?? null
        : null,

    featured: toBool(b.featured) ? 1 : 0,
    is_active: toBool(b.is_active) ? 1 : 0,
    display_order:
      typeof b.display_order === "number" ? b.display_order : 1,

    featured_image:
      typeof b.featured_image !== "undefined"
        ? b.featured_image ?? null
        : null,
    image_url:
      typeof b.image_url !== "undefined" ? b.image_url ?? null : null,
    image_asset_id:
      typeof b.image_asset_id !== "undefined"
        ? b.image_asset_id ?? null
        : null,

    area: typeof b.area === "string" ? b.area : null,
    duration: typeof b.duration === "string" ? b.duration : null,
    maintenance:
      typeof b.maintenance === "string" ? b.maintenance : null,
    season: typeof b.season === "string" ? b.season : null,

    soil_type:
      typeof b.soil_type === "string" ? b.soil_type : null,
    thickness:
      typeof b.thickness === "string" ? b.thickness : null,
    equipment:
      typeof b.equipment === "string" ? b.equipment : null,

    created_at: now as any,
    updated_at: now as any,
  });

  // i18n alanları: opsiyonel ama veriliyorsa zorunlu alanlar dolu olmalı
  const hasI18nFields =
    typeof b.name !== "undefined" ||
    typeof b.slug !== "undefined" ||
    typeof b.description !== "undefined" ||
    typeof b.material !== "undefined" ||
    typeof b.price !== "undefined" ||
    typeof b.includes !== "undefined" ||
    typeof b.warranty !== "undefined" ||
    typeof b.image_alt !== "undefined";

  const reqLocale: Locale =
    (b.locale as Locale) ??
    ((req as any).locale as Locale) ??
    DEFAULT_LOCALE;

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
    };

    const replicateAll = b.replicate_all_locales ?? true;
    if (replicateAll) {
      await upsertServiceI18nAllLocales(id, payload);
    } else {
      await upsertServiceI18n(id, reqLocale, payload);
    }
  }

  const row = await getServiceMergedById(
    reqLocale,
    DEFAULT_LOCALE,
    id,
  );
  return reply.code(201).send(row);
};

export const updateServiceAdmin: RouteHandler<{
  Params: { id: string };
  Body: PatchServiceBody;
}> = async (req, reply) => {
  const parsed = patchServiceBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: "invalid_body", issues: parsed.error.issues } });
  }
  const b = parsed.data;

  // parent patch
  const hasParentPatch =
    typeof b.type !== "undefined" ||
    typeof b.category_id !== "undefined" ||
    typeof b.sub_category_id !== "undefined" ||
    typeof b.featured !== "undefined" ||
    typeof b.is_active !== "undefined" ||
    typeof b.display_order !== "undefined" ||
    typeof b.featured_image !== "undefined" ||
    typeof b.image_url !== "undefined" ||
    typeof b.image_asset_id !== "undefined" ||
    typeof b.area !== "undefined" ||
    typeof b.duration !== "undefined" ||
    typeof b.maintenance !== "undefined" ||
    typeof b.season !== "undefined" ||
    typeof b.soil_type !== "undefined" ||
    typeof b.thickness !== "undefined" ||
    typeof b.equipment !== "undefined";

  if (hasParentPatch) {
    const parentPatch: any = {};

    if (typeof b.type !== "undefined") parentPatch.type = b.type;
    if (typeof b.category_id !== "undefined")
      parentPatch.category_id = b.category_id ?? null;
    if (typeof b.sub_category_id !== "undefined")
      parentPatch.sub_category_id = b.sub_category_id ?? null;
    if (typeof b.featured !== "undefined")
      parentPatch.featured = toBool(b.featured) ? 1 : 0;
    if (typeof b.is_active !== "undefined")
      parentPatch.is_active = toBool(b.is_active) ? 1 : 0;
    if (typeof b.display_order !== "undefined")
      parentPatch.display_order = b.display_order;

    if (typeof b.featured_image !== "undefined")
      parentPatch.featured_image = b.featured_image ?? null;
    if (typeof b.image_url !== "undefined")
      parentPatch.image_url = b.image_url ?? null;
    if (typeof b.image_asset_id !== "undefined")
      parentPatch.image_asset_id = b.image_asset_id ?? null;

    for (const key of [
      "area",
      "duration",
      "maintenance",
      "season",
      "soil_type",
      "thickness",
      "equipment",
    ] as const) {
      if (typeof (b as any)[key] !== "undefined") {
        (parentPatch as any)[key] = (b as any)[key];
      }
    }

    await updateServiceParent(req.params.id, parentPatch);
  }

  // i18n patch (varsa)
  const hasI18n =
    typeof b.name !== "undefined" ||
    typeof b.slug !== "undefined" ||
    typeof b.description !== "undefined" ||
    typeof b.material !== "undefined" ||
    typeof b.price !== "undefined" ||
    typeof b.includes !== "undefined" ||
    typeof b.warranty !== "undefined" ||
    typeof b.image_alt !== "undefined";

  if (hasI18n) {
    const loc: Locale =
      (b.locale as Locale) ??
      ((req as any).locale as Locale) ??
      DEFAULT_LOCALE;

    const payload = {
      name:
        typeof b.name === "string" ? b.name.trim() : undefined,
      slug:
        typeof b.slug === "string" ? b.slug.trim() : undefined,
      description:
        typeof b.description !== "undefined"
          ? b.description
          : undefined,
      material:
        typeof b.material !== "undefined" ? b.material : undefined,
      price:
        typeof b.price !== "undefined" ? b.price : undefined,
      includes:
        typeof b.includes !== "undefined" ? b.includes : undefined,
      warranty:
        typeof b.warranty !== "undefined" ? b.warranty : undefined,
      image_alt:
        typeof b.image_alt !== "undefined"
          ? b.image_alt
          : undefined,
    };

    if (b.apply_all_locales) {
      await upsertServiceI18nAllLocales(req.params.id, payload);
    } else {
      await upsertServiceI18n(req.params.id, loc, payload);
    }
  }

  const locale: Locale =
    (b.locale as Locale) ??
    ((req as any).locale as Locale) ??
    DEFAULT_LOCALE;
  const row = await getServiceMergedById(
    locale,
    DEFAULT_LOCALE,
    req.params.id,
  );
  if (!row)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.send(row);
};

export const removeServiceAdmin: RouteHandler<{
  Params: { id: string };
}> = async (req, reply) => {
  const affected = await deleteServiceParent(req.params.id);
  if (!affected)
    return reply.code(404).send({ error: { message: "not_found" } });
  return reply.code(204).send();
};

/* ----------------------------- images (gallery) ----------------------------- */

export const listServiceImagesAdmin: RouteHandler<{
  Params: { id: string };
}> = async (req, reply) => {
  const locale: Locale = (req as any).locale ?? DEFAULT_LOCALE;
  const def = DEFAULT_LOCALE;
  const rows = await listServiceImages({
    serviceId: req.params.id,
    locale,
    defaultLocale: def,
  });
  return reply.send(rows);
};

export const createServiceImageAdmin: RouteHandler<{
  Params: { id: string };
  Body: UpsertServiceImageBody;
}> = async (req, reply) => {
  const parsed = upsertServiceImageBodySchema.safeParse(
    req.body ?? {},
  );
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: "invalid_body", issues: parsed.error.issues } });
  }
  const b = parsed.data;
  const id = randomUUID();
  const now = new Date();

  await createServiceImage({
    id,
    service_id: req.params.id,
    image_asset_id:
      typeof b.image_asset_id !== "undefined"
        ? b.image_asset_id ?? null
        : null,
    image_url:
      typeof b.image_url !== "undefined" ? b.image_url ?? null : null,
    is_active: toBool(b.is_active) ? 1 : 0,
    display_order:
      typeof b.display_order === "number" ? b.display_order : 0,
    created_at: now as any,
    updated_at: now as any,
  });

  const loc: Locale =
    (b.locale as Locale) ??
    ((req as any).locale as Locale) ??
    DEFAULT_LOCALE;

  const hasI18nFields =
    typeof b.title !== "undefined" ||
    typeof b.alt !== "undefined" ||
    typeof b.caption !== "undefined";

  if (hasI18nFields) {
    const payload = {
      title:
        typeof b.title !== "undefined"
          ? b.title ?? null
          : undefined,
      alt:
        typeof b.alt !== "undefined" ? b.alt ?? null : undefined,
      caption:
        typeof b.caption !== "undefined"
          ? b.caption ?? null
          : undefined,
    };

    const replicateAll = b.replicate_all_locales ?? true;
    if (replicateAll) {
      await upsertServiceImageI18nAllLocales(id, payload);
    } else {
      await upsertServiceImageI18n(id, loc, payload);
    }
  }

  const rows = await listServiceImages({
    serviceId: req.params.id,
    locale: loc,
    defaultLocale: DEFAULT_LOCALE,
  });
  return reply.code(201).send(rows);
};

export const updateServiceImageAdmin: RouteHandler<{
  Params: { id: string; imageId: string };
  Body: PatchServiceImageBody;
}> = async (req, reply) => {
  const parsed = patchServiceImageBodySchema.safeParse(
    req.body ?? {},
  );
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: "invalid_body", issues: parsed.error.issues } });
  }
  const b = parsed.data;

  const patch: any = {};
  if (typeof b.image_asset_id !== "undefined")
    patch.image_asset_id = b.image_asset_id ?? null;
  if (typeof b.image_url !== "undefined")
    patch.image_url = b.image_url ?? null;
  if (typeof b.is_active !== "undefined")
    patch.is_active = toBool(b.is_active) ? 1 : 0;
  if (typeof b.display_order !== "undefined")
    patch.display_order = b.display_order;

  if (Object.keys(patch).length) {
    await updateServiceImage(req.params.imageId, patch);
  }

  const hasI18nFields =
    typeof b.title !== "undefined" ||
    typeof b.alt !== "undefined" ||
    typeof b.caption !== "undefined";

  const loc: Locale =
    (b.locale as Locale) ??
    ((req as any).locale as Locale) ??
    DEFAULT_LOCALE;

  if (hasI18nFields) {
    const payload = {
      title:
        typeof b.title !== "undefined"
          ? b.title ?? null
          : undefined,
      alt:
        typeof b.alt !== "undefined" ? b.alt ?? null : undefined,
      caption:
        typeof b.caption !== "undefined"
          ? b.caption ?? null
          : undefined,
    };

    if (b.apply_all_locales) {
      await upsertServiceImageI18nAllLocales(
        req.params.imageId,
        payload,
      );
    } else {
      await upsertServiceImageI18n(
        req.params.imageId,
        loc,
        payload,
      );
    }
  }

  const rows = await listServiceImages({
    serviceId: req.params.id,
    locale: loc,
    defaultLocale: DEFAULT_LOCALE,
  });
  return reply.send(rows);
};

export const removeServiceImageAdmin: RouteHandler<{
  Params: { id: string; imageId: string };
}> = async (req, reply) => {
  const affected = await deleteServiceImage(req.params.imageId);
  if (!affected)
    return reply.code(404).send({ error: { message: "not_found" } });
  const rows = await listServiceImages({
    serviceId: req.params.id,
    locale: (req as any).locale ?? DEFAULT_LOCALE,
    defaultLocale: DEFAULT_LOCALE,
  });
  return reply.send(rows);
};
