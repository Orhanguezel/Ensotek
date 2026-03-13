// =============================================================
// FILE: src/modules/gallery/admin.controller.ts
// Admin CRUD for galleries + image management
// =============================================================
import type { RouteHandler } from 'fastify';
import { db } from '@/db/client';
import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

import { galleries, galleryI18n, galleryImages, galleryImageI18n } from './schema';
import { storageAssets } from '@/modules/storage/schema';
import { toBool } from '@/modules/_shared';
import { listGalleries, getGalleryById, getGalleryImages, type GalleryListParams } from './repository';
import {
  galleryCreateSchema,
  galleryUpdateSchema,
  galleryImageCreateSchema,
  galleryBulkImagesSchema,
} from './validation';

/* ================================================================
 * GALLERY CRUD
 * ================================================================ */

/** GET /admin/galleries */
export const adminListGalleries: RouteHandler = async (req, reply) => {
  const q = (req.query || {}) as Record<string, string | undefined>;

  const params: GalleryListParams = {
    module_key: q.module_key,
    source_type: q.source_type,
    source_id: q.source_id,
    locale: q.locale || 'tr',
    is_active: q.is_active !== undefined
      ? (q.is_active === '1' || q.is_active === 'true')
      : undefined,
    is_featured: q.is_featured !== undefined
      ? (q.is_featured === '1' || q.is_featured === 'true')
      : undefined,
    q: q.q,
    limit: q.limit ? Math.min(Number(q.limit) || 50, 100) : 50,
    offset: q.offset ? Math.max(Number(q.offset) || 0, 0) : 0,
    sort: q.sort === 'created_at' ? 'created_at' : 'display_order',
    order: q.order === 'desc' ? 'desc' : 'asc',
  };

  const result = await listGalleries(params);

  reply.header('x-total-count', String(result.total));
  reply.header('content-range', `*/${result.total}`);
  reply.header('access-control-expose-headers', 'x-total-count, content-range');

  return reply.send(result.items);
};

/** GET /admin/galleries/:id */
export const adminGetGallery: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  const { locale } = (req.query || {}) as { locale?: string };

  const gallery = await getGalleryById(id, locale || 'tr');
  if (!gallery) return reply.status(404).send({ error: 'Gallery not found' });

  return reply.send(gallery);
};

/** POST /admin/galleries */
export const adminCreateGallery: RouteHandler = async (req, reply) => {
  const body = galleryCreateSchema.parse(req.body);
  const id = body.id || randomUUID();
  const locale = body.locale || 'tr';

  await db.insert(galleries).values({
    id,
    module_key: body.module_key,
    source_id: body.source_id ?? null,
    source_type: body.source_type,
    is_active: toBool(body.is_active) as any,
    is_featured: toBool(body.is_featured) as any,
    display_order: body.display_order ?? 0,
  });

  await db.insert(galleryI18n).values({
    gallery_id: id,
    locale,
    title: body.title,
    slug: body.slug,
    description: body.description ?? null,
    meta_title: body.meta_title ?? null,
    meta_description: body.meta_description ?? null,
  });

  const created = await getGalleryById(id, locale);
  return reply.status(201).send(created);
};

/** PATCH /admin/galleries/:id */
export const adminUpdateGallery: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  const body = galleryUpdateSchema.parse(req.body);
  const locale = body.locale || 'tr';

  // update base
  const baseFields: Record<string, any> = {};
  if (body.module_key !== undefined) baseFields.module_key = body.module_key;
  if (body.source_id !== undefined) baseFields.source_id = body.source_id;
  if (body.source_type !== undefined) baseFields.source_type = body.source_type;
  if (body.is_active !== undefined) baseFields.is_active = toBool(body.is_active);
  if (body.is_featured !== undefined) baseFields.is_featured = toBool(body.is_featured);
  if (body.display_order !== undefined) baseFields.display_order = body.display_order;

  if (Object.keys(baseFields).length) {
    await db.update(galleries).set(baseFields).where(eq(galleries.id, id));
  }

  // upsert i18n
  const i18nFields: Record<string, any> = {};
  if (body.title !== undefined) i18nFields.title = body.title;
  if (body.slug !== undefined) i18nFields.slug = body.slug;
  if (body.description !== undefined) i18nFields.description = body.description;
  if (body.meta_title !== undefined) i18nFields.meta_title = body.meta_title;
  if (body.meta_description !== undefined) i18nFields.meta_description = body.meta_description;

  if (Object.keys(i18nFields).length) {
    // check exists
    const [existing] = await db
      .select({ gallery_id: galleryI18n.gallery_id })
      .from(galleryI18n)
      .where(and(eq(galleryI18n.gallery_id, id), eq(galleryI18n.locale, locale)))
      .limit(1);

    if (existing) {
      await db
        .update(galleryI18n)
        .set(i18nFields)
        .where(and(eq(galleryI18n.gallery_id, id), eq(galleryI18n.locale, locale)));
    } else {
      await db.insert(galleryI18n).values({
        gallery_id: id,
        locale,
        title: body.title || '',
        slug: body.slug || '',
        ...i18nFields,
      });
    }
  }

  const updated = await getGalleryById(id, locale);
  return reply.send(updated);
};

/** DELETE /admin/galleries/:id */
export const adminDeleteGallery: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  await db.delete(galleries).where(eq(galleries.id, id));
  return reply.status(204).send();
};

/** POST /admin/galleries/reorder */
export const adminReorderGalleries: RouteHandler = async (req, reply) => {
  const { items } = req.body as { items: { id: string; display_order: number }[] };

  if (!Array.isArray(items)) {
    return reply.status(400).send({ error: 'items array required' });
  }

  for (const item of items) {
    await db
      .update(galleries)
      .set({ display_order: item.display_order })
      .where(eq(galleries.id, item.id));
  }

  return reply.send({ ok: true });
};

/* ================================================================
 * GALLERY IMAGES
 * ================================================================ */

/** GET /admin/galleries/:id/images */
export const adminListGalleryImages: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  const { locale } = (req.query || {}) as { locale?: string };

  const images = await getGalleryImages(id, locale || 'tr');
  return reply.send(images);
};

/** POST /admin/galleries/:id/images */
export const adminAddGalleryImage: RouteHandler = async (req, reply) => {
  const { id: galleryId } = req.params as { id: string };
  const body = galleryImageCreateSchema.parse({ ...req.body as any, gallery_id: galleryId });

  const imageId = body.id || randomUUID();
  const locale = body.locale || 'tr';

  await db.insert(galleryImages).values({
    id: imageId,
    gallery_id: galleryId,
    storage_asset_id: body.storage_asset_id ?? null,
    image_url: body.image_url ?? null,
    display_order: body.display_order ?? 0,
    is_cover: toBool(body.is_cover) as any,
  });

  // i18n (alt, caption)
  if (body.alt || body.caption) {
    await db.insert(galleryImageI18n).values({
      image_id: imageId,
      locale,
      alt: body.alt ?? null,
      caption: body.caption ?? null,
    });
  }

  return reply.status(201).send({ id: imageId });
};

/** POST /admin/galleries/:id/images/bulk */
export const adminBulkAddGalleryImages: RouteHandler = async (req, reply) => {
  const { id: galleryId } = req.params as { id: string };
  const body = galleryBulkImagesSchema.parse({ ...req.body as any, gallery_id: galleryId });

  const ids: string[] = [];

  for (const img of body.images) {
    const imageId = randomUUID();
    ids.push(imageId);

    await db.insert(galleryImages).values({
      id: imageId,
      gallery_id: galleryId,
      storage_asset_id: img.storage_asset_id ?? null,
      image_url: img.image_url ?? null,
      display_order: img.display_order ?? 0,
      is_cover: toBool(img.is_cover) as any,
    });
  }

  return reply.status(201).send({ ids });
};

/** PATCH /admin/galleries/:id/images/:imageId */
export const adminUpdateGalleryImage: RouteHandler = async (req, reply) => {
  const { imageId } = req.params as { id: string; imageId: string };
  const body = req.body as Record<string, any>;
  const locale = (body.locale as string) || 'tr';

  // base fields
  const baseFields: Record<string, any> = {};
  if (body.storage_asset_id !== undefined) baseFields.storage_asset_id = body.storage_asset_id;
  if (body.image_url !== undefined) baseFields.image_url = body.image_url;
  if (body.display_order !== undefined) baseFields.display_order = body.display_order;
  if (body.is_cover !== undefined) baseFields.is_cover = toBool(body.is_cover);

  if (Object.keys(baseFields).length) {
    await db.update(galleryImages).set(baseFields).where(eq(galleryImages.id, imageId));
  }

  // i18n
  const i18nFields: Record<string, any> = {};
  if (body.alt !== undefined) i18nFields.alt = body.alt;
  if (body.caption !== undefined) i18nFields.caption = body.caption;

  if (Object.keys(i18nFields).length) {
    const [existing] = await db
      .select({ image_id: galleryImageI18n.image_id })
      .from(galleryImageI18n)
      .where(and(eq(galleryImageI18n.image_id, imageId), eq(galleryImageI18n.locale, locale)))
      .limit(1);

    if (existing) {
      await db
        .update(galleryImageI18n)
        .set(i18nFields)
        .where(and(eq(galleryImageI18n.image_id, imageId), eq(galleryImageI18n.locale, locale)));
    } else {
      await db.insert(galleryImageI18n).values({
        image_id: imageId,
        locale,
        alt: body.alt ?? null,
        caption: body.caption ?? null,
        ...i18nFields,
      });
    }
  }

  return reply.send({ ok: true });
};

/** DELETE /admin/galleries/:id/images/:imageId */
export const adminDeleteGalleryImage: RouteHandler = async (req, reply) => {
  const { imageId } = req.params as { id: string; imageId: string };
  await db.delete(galleryImages).where(eq(galleryImages.id, imageId));
  return reply.status(204).send();
};

/** POST /admin/galleries/:id/images/reorder */
export const adminReorderGalleryImages: RouteHandler = async (req, reply) => {
  const { items } = req.body as { items: { id: string; display_order: number }[] };

  if (!Array.isArray(items)) {
    return reply.status(400).send({ error: 'items array required' });
  }

  for (const item of items) {
    await db
      .update(galleryImages)
      .set({ display_order: item.display_order })
      .where(eq(galleryImages.id, item.id));
  }

  return reply.send({ ok: true });
};
