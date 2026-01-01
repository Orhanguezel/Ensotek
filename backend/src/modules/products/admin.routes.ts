// =============================================================
// FILE: src/modules/products/admin.routes.ts  (GÜNCEL)
// =============================================================
import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { requireAdmin } from '@/common/middleware/roles';

/* Products ana controller (CRUD + images + lists) */
import {
  adminListProducts,
  adminGetProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,

  // replace (products table fields)
  adminSetProductImages,

  // reorder
  adminReorderProducts,

  // ✅ NEW: product_images pool
  adminListProductImages,
  adminCreateProductImage,
  adminDeleteProductImage,
} from './admin.controller';

/* Ayrı controller'lar */
import {
  adminListProductFaqs,
  adminCreateProductFaq,
  adminUpdateProductFaq,
  adminToggleFaqActive,
  adminDeleteProductFaq,
  adminReplaceFaqs,
} from './admin.faqs.controller';

import {
  adminListProductSpecs,
  adminCreateProductSpec,
  adminUpdateProductSpec,
  adminDeleteProductSpec,
  adminReplaceSpecs,
} from './admin.specs.controller';

import {
  adminListProductReviews,
  adminCreateProductReview,
  adminUpdateProductReview,
  adminToggleReviewActive,
  adminDeleteProductReview,
} from './admin.reviews.controller';

/* Kategori yardımcı uçları */
import { adminListCategories, adminListSubcategories } from './helpers.categoryLists';

export async function registerProductsAdmin(app: FastifyInstance) {
  const BASE = '/products';

  // -------- Products (CRUD) --------
  app.get(BASE, { preHandler: [requireAuth, requireAdmin] }, adminListProducts);

  app.get(`${BASE}/:id`, { preHandler: [requireAuth, requireAdmin] }, adminGetProduct);

  app.post(BASE, { preHandler: [requireAuth, requireAdmin] }, adminCreateProduct);

  app.patch(`${BASE}/:id`, { preHandler: [requireAuth, requireAdmin] }, adminUpdateProduct);

  app.delete(`${BASE}/:id`, { preHandler: [requireAuth, requireAdmin] }, adminDeleteProduct);

  // =============================================================
  // ✅ Images Pool (product_images)  <-- RTK'nin kullandığı uçlar
  // GET    /admin/products/:id/images
  // POST   /admin/products/:id/images
  // DELETE /admin/products/:id/images/:imageId
  // =============================================================
  app.get(
    `${BASE}/:id/images`,
    { preHandler: [requireAuth, requireAdmin] },
    adminListProductImages,
  );

  app.post(
    `${BASE}/:id/images`,
    { preHandler: [requireAuth, requireAdmin] },
    adminCreateProductImage,
  );

  app.delete(
    `${BASE}/:id/images/:imageId`,
    { preHandler: [requireAuth, requireAdmin] },
    adminDeleteProductImage,
  );

  // =============================================================
  // ✅ Images REPLACE (products fields)  <-- eski PUT çakışmasın diye taşındı
  // PUT /admin/products/:id/images/replace
  // =============================================================
  app.put(
    `${BASE}/:id/images/replace`,
    { preHandler: [requireAuth, requireAdmin] },
    adminSetProductImages,
  );

  // -------- REORDER (drag & drop sıralama kaydı) --------
  app.post(`${BASE}/reorder`, { preHandler: [requireAuth, requireAdmin] }, adminReorderProducts);

  // -------- Category helpers --------
  app.get(`${BASE}/categories`, { preHandler: [requireAuth, requireAdmin] }, adminListCategories);

  app.get(
    `${BASE}/subcategories`,
    { preHandler: [requireAuth, requireAdmin] },
    adminListSubcategories,
  );

  // -------- FAQs --------
  app.get(`${BASE}/:id/faqs`, { preHandler: [requireAuth, requireAdmin] }, adminListProductFaqs);

  app.post(`${BASE}/:id/faqs`, { preHandler: [requireAuth, requireAdmin] }, adminCreateProductFaq);

  app.patch(
    `${BASE}/:id/faqs/:faqId`,
    { preHandler: [requireAuth, requireAdmin] },
    adminUpdateProductFaq,
  );

  app.patch(
    `${BASE}/:id/faqs/:faqId/active`,
    { preHandler: [requireAuth, requireAdmin] },
    adminToggleFaqActive,
  );

  app.delete(
    `${BASE}/:id/faqs/:faqId`,
    { preHandler: [requireAuth, requireAdmin] },
    adminDeleteProductFaq,
  );

  app.put(`${BASE}/:id/faqs`, { preHandler: [requireAuth, requireAdmin] }, adminReplaceFaqs); // replace

  // -------- SPECS --------
  app.get(`${BASE}/:id/specs`, { preHandler: [requireAuth, requireAdmin] }, adminListProductSpecs);

  app.post(
    `${BASE}/:id/specs`,
    { preHandler: [requireAuth, requireAdmin] },
    adminCreateProductSpec,
  );

  app.patch(
    `${BASE}/:id/specs/:specId`,
    { preHandler: [requireAuth, requireAdmin] },
    adminUpdateProductSpec,
  );

  app.delete(
    `${BASE}/:id/specs/:specId`,
    { preHandler: [requireAuth, requireAdmin] },
    adminDeleteProductSpec,
  );

  app.put(`${BASE}/:id/specs`, { preHandler: [requireAuth, requireAdmin] }, adminReplaceSpecs); // replace

  // -------- REVIEWS --------
  app.get(
    `${BASE}/:id/reviews`,
    { preHandler: [requireAuth, requireAdmin] },
    adminListProductReviews,
  );

  app.post(
    `${BASE}/:id/reviews`,
    { preHandler: [requireAuth, requireAdmin] },
    adminCreateProductReview,
  );

  app.patch(
    `${BASE}/:id/reviews/:reviewId`,
    { preHandler: [requireAuth, requireAdmin] },
    adminUpdateProductReview,
  );

  app.patch(
    `${BASE}/:id/reviews/:reviewId/active`,
    { preHandler: [requireAuth, requireAdmin] },
    adminToggleReviewActive,
  );

  app.delete(
    `${BASE}/:id/reviews/:reviewId`,
    { preHandler: [requireAuth, requireAdmin] },
    adminDeleteProductReview,
  );
}
