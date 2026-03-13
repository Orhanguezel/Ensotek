// =============================================================
// FILE: src/modules/gallery/admin.routes.ts
// =============================================================
import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { requireAdmin } from '@/common/middleware/roles';

import {
  adminListGalleries,
  adminGetGallery,
  adminCreateGallery,
  adminUpdateGallery,
  adminDeleteGallery,
  adminReorderGalleries,
  // images
  adminListGalleryImages,
  adminAddGalleryImage,
  adminBulkAddGalleryImages,
  adminUpdateGalleryImage,
  adminDeleteGalleryImage,
  adminReorderGalleryImages,
} from './admin.controller';

export async function registerGalleryAdmin(app: FastifyInstance) {
  const BASE = '/galleries';
  const guard = { preHandler: [requireAuth, requireAdmin] };

  // -------- Galleries CRUD --------
  app.get(BASE, guard, adminListGalleries);
  app.get(`${BASE}/:id`, guard, adminGetGallery);
  app.post(BASE, guard, adminCreateGallery);
  app.patch(`${BASE}/:id`, guard, adminUpdateGallery);
  app.delete(`${BASE}/:id`, guard, adminDeleteGallery);

  // -------- Reorder --------
  app.post(`${BASE}/reorder`, guard, adminReorderGalleries);

  // -------- Gallery Images --------
  app.get(`${BASE}/:id/images`, guard, adminListGalleryImages);
  app.post(`${BASE}/:id/images`, guard, adminAddGalleryImage);
  app.post(`${BASE}/:id/images/bulk`, guard, adminBulkAddGalleryImages);
  app.patch(`${BASE}/:id/images/:imageId`, guard, adminUpdateGalleryImage);
  app.delete(`${BASE}/:id/images/:imageId`, guard, adminDeleteGalleryImage);

  // -------- Image Reorder --------
  app.post(`${BASE}/:id/images/reorder`, guard, adminReorderGalleryImages);
}
