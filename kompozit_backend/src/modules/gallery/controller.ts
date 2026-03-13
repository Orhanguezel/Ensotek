// =============================================================
// FILE: src/modules/gallery/controller.ts
// Public gallery endpoints
// =============================================================
import type { RouteHandler } from 'fastify';
import { listGalleries, getGalleryBySlug, type GalleryListParams } from './repository';

/* ---- LIST ---- */
export const listGalleriesPublic: RouteHandler = async (req, reply) => {
  const q = (req.query || {}) as Record<string, string | undefined>;

  const params: GalleryListParams = {
    module_key: q.module_key,
    source_type: q.source_type,
    source_id: q.source_id,
    locale: q.locale || 'tr',
    is_active: true,
    is_featured: q.is_featured === '1' || q.is_featured === 'true' ? true : undefined,
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

/* ---- GET BY SLUG ---- */
export const getGalleryBySlugPublic: RouteHandler = async (req, reply) => {
  const { slug } = req.params as { slug: string };
  const { locale } = (req.query || {}) as { locale?: string };

  const gallery = await getGalleryBySlug(slug, locale || 'tr');

  if (!gallery) {
    return reply.status(404).send({ error: 'Gallery not found' });
  }

  return reply.send(gallery);
};
