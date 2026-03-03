// ---------------------------------------------------------------------
// FILE: modules/projects/controller.ts
// FINAL — FE Project type ile uyumlu response (card/detail)
// ---------------------------------------------------------------------
import type { RouteHandler } from 'fastify';
import { DEFAULT_LOCALE } from '@/core/i18n';
import {
  listProjects,
  getProjectMergedById,
  getProjectMergedBySlug,
  listProjectImagesMerged,
} from './repository';

import { toDetail,toCard } from '@/modules/_shared';
import type { ListQuery } from '@/modules/_shared';


/** LIST (public) */
export const listProjectsPublic: RouteHandler<{ Querystring: ListQuery }> = async (req, reply) => {
  const q = (req.query ?? {}) as ListQuery;

  const limitNum = q.limit ? Number(q.limit) : undefined;
  const offsetNum = q.offset ? Number(q.offset) : undefined;

  const orderParam =
    typeof q.order === 'string' && q.order.trim()
      ? q.order.trim()
      : q.orderBy && q.orderDir
        ? `${q.orderBy}.${q.orderDir}`
        : q.sort && q.orderDir
          ? `${q.sort}.${q.orderDir}`
          : undefined;

  const { items, total } = await listProjects({
    orderParam,
    sort: q.sort as any,
    order: q.orderDir,
    limit: Number.isFinite(limitNum as number) ? (limitNum as number) : undefined,
    offset: Number.isFinite(offsetNum as number) ? (offsetNum as number) : undefined,

    is_published: q.is_published,
    is_featured: q.is_featured,
    q: q.q,
    slug: q.slug,

    category: q.category,
    client: q.client,

    locale: (req as any).locale,
    defaultLocale: DEFAULT_LOCALE,
  });

  reply.header('x-total-count', String(total ?? 0));

  if (q.view === 'detail') return reply.send(items.map(toDetail));
  return reply.send(items.map(toCard));
};

/** GET BY ID (public) */
export const getProjectPublic: RouteHandler<{ Params: { id: string } }> = async (req, reply) => {
  const row = await getProjectMergedById((req as any).locale, DEFAULT_LOCALE, req.params.id);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply.send(toDetail(row));
};

/** GET BY SLUG (public) + optional include=images */
export const getProjectBySlugPublic: RouteHandler<{
  Params: { slug: string };
  Querystring: { include?: string };
}> = async (req, reply) => {
  const row = await getProjectMergedBySlug((req as any).locale, DEFAULT_LOCALE, req.params.slug);
  if (!row) return reply.code(404).send({ error: { message: 'not_found' } });

  const detail = toDetail(row);

  if ((req.query as any)?.include === 'images') {
    const images = await listProjectImagesMerged(row.id, (req as any).locale, DEFAULT_LOCALE);
    return reply.send({ ...detail, images });
  }

  return reply.send(detail);
};

/** LIST IMAGES of a project (public) */
export const listProjectImagesPublic: RouteHandler<{ Params: { id: string } }> = async (
  req,
  reply,
) => {
  const items = await listProjectImagesMerged(req.params.id, (req as any).locale, DEFAULT_LOCALE);
  return reply.send(items);
};
