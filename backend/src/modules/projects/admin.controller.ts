// ---------------------------------------------------------------------
// FILE: modules/projects/admin.controller.ts
// Ensotek endüstriyel proje modülü — admin CRUD
// ---------------------------------------------------------------------
import type { RouteHandler } from 'fastify';
import { randomUUID } from 'crypto';
import {
  projectListQuerySchema,
  upsertProjectBodySchema,
  patchProjectBodySchema,
  type ProjectListQuery,
  type UpsertProjectBody,
  type PatchProjectBody,
  upsertProjectImageBodySchema,
  patchProjectImageBodySchema,
  type UpsertProjectImageBody,
  type PatchProjectImageBody,
} from './validation';
import {
  listProjects,
  getProjectMergedById,
  getProjectMergedBySlug,
  createProjectParent,
  updateProjectParent,
  deleteProjectParent,
  upsertProjectI18n,
  getProjectI18nRow,
  packContent,
  listProjectImagesMerged,
  createProjectImageParent,
  updateProjectImageParent,
  deleteProjectImageParent,
  upsertProjectImageI18n,
} from './repository';

import { toBool, packStringArray } from '@/modules/_shared';



/* ================= projects: LIST/GET ================= */
export const listProjectsAdmin: RouteHandler<{ Querystring: ProjectListQuery }> = async (
  req,
  reply,
) => {
  const parsed = projectListQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_query', issues: parsed.error.issues } });
  }
  const q = parsed.data;

  const { items, total } = await listProjects({
    orderParam: typeof q.order === 'string' ? q.order : undefined,
    sort: q.sort,
    order: q.orderDir,
    limit: q.limit,
    offset: q.offset,

    is_published: q.is_published,
    is_featured: q.is_featured,

    q: q.q,
    slug: q.slug,

    category: q.category,
    location: q.location,
    client: q.client,

    locale: (req as any).locale,
    defaultLocale: req.defaultLocale,
  });

  reply.header('x-total-count', String(total ?? 0));
  return reply.send(items);
};

export const getProjectAdmin: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const row = await getProjectMergedById((req as any).locale, req.defaultLocale, req.params.id);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

export const getProjectBySlugAdmin: RouteHandler<{ Params: { slug: string } }> = async (
  req,
  reply,
) => {
  const row = await getProjectMergedBySlug((req as any).locale, req.defaultLocale, req.params.slug);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(row);
};

/* ================= projects: CREATE ================= */
export const createProjectAdmin: RouteHandler<{ Body: UpsertProjectBody }> = async (req, reply) => {
  const parsed = upsertProjectBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', issues: parsed.error.issues } });
  }
  const b = parsed.data;
  const locale = b.locale ?? (req as any).locale;

  try {
    const id = randomUUID();

    await createProjectParent({
      id,
      is_published: toBool(b.is_published) ? 1 : 0,
      is_featured: toBool(b.is_featured) ? 1 : 0,
      display_order: typeof b.display_order === 'number' ? b.display_order : 0,

      featured_image: typeof b.featured_image !== 'undefined' ? (b.featured_image ?? null) : null,
      featured_image_asset_id:
        typeof b.featured_image_asset_id !== 'undefined'
          ? (b.featured_image_asset_id ?? null)
          : null,

      // Ensotek industrial fields
      category: typeof b.category !== 'undefined' ? (b.category ?? null) : null,
      product_type: typeof b.product_type !== 'undefined' ? (b.product_type ?? null) : null,
      location: typeof b.location !== 'undefined' ? (b.location ?? null) : null,
      client_name: typeof b.client_name !== 'undefined' ? (b.client_name ?? null) : null,
      unit_count: typeof b.unit_count === 'number' ? b.unit_count : null,
      fan_count: typeof b.fan_count === 'number' ? b.fan_count : null,
      start_date: typeof b.start_date !== 'undefined' ? (b.start_date ?? null) : null,
      complete_date: typeof b.complete_date !== 'undefined' ? (b.complete_date ?? null) : null,
      completion_time_label:
        typeof b.completion_time_label !== 'undefined' ? (b.completion_time_label ?? null) : null,
      website_url: typeof b.website_url !== 'undefined' ? (b.website_url ?? null) : null,
      youtube_url: typeof b.youtube_url !== 'undefined' ? (b.youtube_url ?? null) : null,
      services: typeof b.services === 'undefined' ? (null as any) : packStringArray(b.services),
      techs: typeof b.techs === 'undefined' ? (null as any) : packStringArray(b.techs),

      created_at: new Date() as any,
      updated_at: new Date() as any,
    } as any);

    await upsertProjectI18n(id, locale, {
      title: b.title.trim(),
      slug: b.slug.trim(),
      summary: typeof b.summary === 'string' ? b.summary : (b.summary ?? null),
      content: packContent(b.content),
      featured_image_alt:
        typeof b.featured_image_alt === 'string'
          ? b.featured_image_alt.trim()
          : (b.featured_image_alt ?? null),
      meta_title: typeof b.meta_title === 'string' ? b.meta_title.trim() : (b.meta_title ?? null),
      meta_description:
        typeof b.meta_description === 'string'
          ? b.meta_description.trim()
          : (b.meta_description ?? null),
    });

    const row = await getProjectMergedById(locale, req.defaultLocale, id);
    return reply.code(201).send(row);
  } catch (err: any) {
    if (err?.code === 'ER_DUP_ENTRY') {
      return reply.code(409).send({ error: { message: 'slug_already_exists' } });
    }
    req.log.error({ err }, 'projects_create_failed');
    return reply.code(500).send({ error: { message: 'projects_create_failed' } });
  }
};

/* ================= projects: UPDATE ================= */
export const updateProjectAdmin: RouteHandler<{
  Params: { id: string };
  Body: PatchProjectBody;
}> = async (req, reply) => {
  const parsed = patchProjectBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', issues: parsed.error.issues } });
  }
  const b = parsed.data;
  const locale = b.locale ?? (req as any).locale;

  try {
    // parent patch (varsa)
    if (
      typeof b.is_published !== 'undefined' ||
      typeof b.is_featured !== 'undefined' ||
      typeof b.display_order !== 'undefined' ||
      typeof b.featured_image !== 'undefined' ||
      typeof b.featured_image_asset_id !== 'undefined' ||
      // Ensotek industrial fields
      typeof b.category !== 'undefined' ||
      typeof b.product_type !== 'undefined' ||
      typeof b.location !== 'undefined' ||
      typeof b.client_name !== 'undefined' ||
      typeof b.unit_count !== 'undefined' ||
      typeof b.fan_count !== 'undefined' ||
      typeof b.start_date !== 'undefined' ||
      typeof b.complete_date !== 'undefined' ||
      typeof b.completion_time_label !== 'undefined' ||
      typeof b.website_url !== 'undefined' ||
      typeof b.youtube_url !== 'undefined' ||
      typeof b.services !== 'undefined' ||
      typeof b.techs !== 'undefined'
    ) {
      await updateProjectParent(req.params.id, {
        is_published:
          typeof b.is_published !== 'undefined' ? (toBool(b.is_published) ? 1 : 0) : undefined,
        is_featured:
          typeof b.is_featured !== 'undefined' ? (toBool(b.is_featured) ? 1 : 0) : undefined,
        display_order: typeof b.display_order === 'number' ? b.display_order : undefined,

        featured_image:
          typeof b.featured_image !== 'undefined' ? (b.featured_image ?? null) : undefined,
        featured_image_asset_id:
          typeof b.featured_image_asset_id !== 'undefined'
            ? (b.featured_image_asset_id ?? null)
            : undefined,

        category: typeof b.category !== 'undefined' ? (b.category ?? null) : undefined,
        product_type: typeof b.product_type !== 'undefined' ? (b.product_type ?? null) : undefined,
        location: typeof b.location !== 'undefined' ? (b.location ?? null) : undefined,
        client_name: typeof b.client_name !== 'undefined' ? (b.client_name ?? null) : undefined,
        unit_count:
          typeof b.unit_count !== 'undefined'
            ? typeof b.unit_count === 'number'
              ? b.unit_count
              : null
            : undefined,
        fan_count:
          typeof b.fan_count !== 'undefined'
            ? typeof b.fan_count === 'number'
              ? b.fan_count
              : null
            : undefined,
        start_date: typeof b.start_date !== 'undefined' ? (b.start_date ?? null) : undefined,
        complete_date:
          typeof b.complete_date !== 'undefined' ? (b.complete_date ?? null) : undefined,
        completion_time_label:
          typeof b.completion_time_label !== 'undefined'
            ? (b.completion_time_label ?? null)
            : undefined,
        website_url: typeof b.website_url !== 'undefined' ? (b.website_url ?? null) : undefined,
        youtube_url: typeof b.youtube_url !== 'undefined' ? (b.youtube_url ?? null) : undefined,
        services: typeof b.services === 'undefined' ? undefined : packStringArray(b.services),
        techs: typeof b.techs === 'undefined' ? undefined : packStringArray(b.techs),
      } as any);
    }

    // i18n patch (varsa)
    const hasI18nFields =
      typeof b.title !== 'undefined' ||
      typeof b.slug !== 'undefined' ||
      typeof b.summary !== 'undefined' ||
      typeof b.content !== 'undefined' ||
      typeof b.featured_image_alt !== 'undefined' ||
      typeof b.meta_title !== 'undefined' ||
      typeof b.meta_description !== 'undefined';

    if (hasI18nFields) {
      const exists = await getProjectI18nRow(req.params.id, locale);

      if (!exists) {
        if (!b.title || !b.slug || !b.content) {
          return reply
            .code(400)
            .send({ error: { message: 'missing_required_translation_fields' } });
        }
        await upsertProjectI18n(req.params.id, locale, {
          title: b.title!.trim(),
          slug: b.slug!.trim(),
          summary: typeof b.summary === 'string' ? b.summary : (b.summary ?? null),
          content: packContent(b.content!),
          featured_image_alt:
            typeof b.featured_image_alt === 'string'
              ? b.featured_image_alt.trim()
              : (b.featured_image_alt ?? null),
          meta_title:
            typeof b.meta_title === 'string' ? b.meta_title.trim() : (b.meta_title ?? null),
          meta_description:
            typeof b.meta_description === 'string'
              ? b.meta_description.trim()
              : (b.meta_description ?? null),
        });
      } else {
        await upsertProjectI18n(req.params.id, locale, {
          title: typeof b.title === 'string' ? b.title.trim() : undefined,
          slug: typeof b.slug === 'string' ? b.slug.trim() : undefined,
          summary:
            typeof b.summary !== 'undefined'
              ? typeof b.summary === 'string'
                ? b.summary
                : (b.summary ?? null)
              : undefined,
          content: typeof b.content === 'string' ? packContent(b.content) : undefined,
          featured_image_alt:
            typeof b.featured_image_alt !== 'undefined'
              ? typeof b.featured_image_alt === 'string'
                ? b.featured_image_alt.trim()
                : (b.featured_image_alt ?? null)
              : undefined,
          meta_title:
            typeof b.meta_title !== 'undefined'
              ? typeof b.meta_title === 'string'
                ? b.meta_title.trim()
                : (b.meta_title ?? null)
              : undefined,
          meta_description:
            typeof b.meta_description !== 'undefined'
              ? typeof b.meta_description === 'string'
                ? b.meta_description.trim()
                : (b.meta_description ?? null)
              : undefined,
        });
      }
    }

    const row = await getProjectMergedById(locale, req.defaultLocale, req.params.id);
    if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
    return reply.send(row);
  } catch (err: any) {
    if (err?.code === 'ER_DUP_ENTRY') {
      return reply.code(409).send({ error: { message: 'slug_already_exists' } });
    }
    req.log.error({ err }, 'projects_update_failed');
    return reply.code(500).send({ error: { message: 'projects_update_failed' } });
  }
};

/* ================= projects: DELETE ================= */
export const removeProjectAdmin: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const affected = await deleteProjectParent(req.params.id);
  if (!affected) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.code(204).send();
};

/* ================= gallery: LIST ================= */
export const listProjectImagesAdmin: RouteHandler<{ Params: { id: string } }> = async (
  req,
  reply,
) => {
  const items = await listProjectImagesMerged(req.params.id, (req as any).locale, req.defaultLocale);
  return reply.send(items);
};

/* ================= gallery: CREATE ================= */
export const createProjectImageAdmin: RouteHandler<{
  Params: { id: string };
  Body: UpsertProjectImageBody;
}> = async (req, reply) => {
  const parsed = upsertProjectImageBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', issues: parsed.error.issues } });
  }
  const b = parsed.data;
  const locale = b.locale ?? (req as any).locale;

  const imageId = randomUUID();
  await createProjectImageParent({
    id: imageId,
    project_id: req.params.id,
    asset_id: b.asset_id,
    image_url: typeof b.image_url !== 'undefined' ? (b.image_url ?? null) : null,
    display_order: typeof b.display_order === 'number' ? b.display_order : 0,
    is_active: toBool(b.is_active) ? 1 : 0,
    created_at: new Date() as any,
    updated_at: new Date() as any,
  } as any);

  await upsertProjectImageI18n(imageId, locale, {
    alt: typeof b.alt === 'string' ? b.alt.trim() : (b.alt ?? null),
    caption: typeof b.caption === 'string' ? b.caption.trim() : (b.caption ?? null),
  });

  const items = await listProjectImagesMerged(req.params.id, locale, req.defaultLocale);
  return reply.code(201).send(items);
};

/* ================= gallery: UPDATE ================= */
export const updateProjectImageAdmin: RouteHandler<{
  Params: { id: string; imageId: string };
  Body: PatchProjectImageBody;
}> = async (req, reply) => {
  const parsed = patchProjectImageBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply
      .code(400)
      .send({ error: { message: 'invalid_body', issues: parsed.error.issues } });
  }
  const b = parsed.data;
  const locale = b.locale ?? (req as any).locale;

  if (
    typeof b.asset_id !== 'undefined' ||
    typeof b.image_url !== 'undefined' ||
    typeof b.display_order !== 'undefined' ||
    typeof b.is_active !== 'undefined'
  ) {
    await updateProjectImageParent(req.params.imageId, {
      asset_id: typeof b.asset_id === 'string' ? b.asset_id : undefined,
      image_url: typeof b.image_url !== 'undefined' ? (b.image_url ?? null) : undefined,
      display_order: typeof b.display_order === 'number' ? b.display_order : undefined,
      is_active: typeof b.is_active !== 'undefined' ? (toBool(b.is_active) ? 1 : 0) : undefined,
    } as any);
  }

  if (typeof b.alt !== 'undefined' || typeof b.caption !== 'undefined') {
    await upsertProjectImageI18n(req.params.imageId, locale, {
      alt:
        typeof b.alt !== 'undefined'
          ? typeof b.alt === 'string'
            ? b.alt.trim()
            : (b.alt ?? null)
          : undefined,
      caption:
        typeof b.caption !== 'undefined'
          ? typeof b.caption === 'string'
            ? b.caption.trim()
            : (b.caption ?? null)
          : undefined,
    });
  }

  const items = await listProjectImagesMerged(req.params.id, locale, req.defaultLocale);
  return reply.send(items);
};

/* ================= gallery: DELETE ================= */
export const removeProjectImageAdmin: RouteHandler<{
  Params: { id: string; imageId: string };
}> = async (req, reply) => {
  const affected = await deleteProjectImageParent(req.params.imageId);
  if (!affected) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.code(204).send();
};
