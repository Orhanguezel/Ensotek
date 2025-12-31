// src/modules/library/router.ts
// =============================================================

import type { FastifyInstance } from 'fastify';

import {
  listLibraryPublic,
  getLibraryPublic,
  getLibraryBySlugPublic,
  listLibraryImagesPublic,
  listLibraryFilesPublic,
} from './controller';

const BASE = '/library';

export async function registerLibrary(app: FastifyInstance) {
  // list + detail
  app.get(`${BASE}`, { config: { public: true } }, listLibraryPublic);
  app.get(`${BASE}/:id`, { config: { public: true } }, getLibraryPublic);
  app.get(`${BASE}/by-slug/:slug`, { config: { public: true } }, getLibraryBySlugPublic);

  // gallery
  app.get(`${BASE}/:id/images`, { config: { public: true } }, listLibraryImagesPublic);

  // files
  app.get(`${BASE}/:id/files`, { config: { public: true } }, listLibraryFilesPublic);
}
