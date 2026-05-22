import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middleware/auth";
import {
  adminCreateFooterSection,
  adminDeleteFooterSection,
  adminGetFooterSectionById,
  adminGetFooterSectionBySlug,
  adminListFooterSections,
  adminUpdateFooterSection,
} from "./admin.controller";

const BASE = "/footer_sections";

export async function registerFooterSectionsAdmin(app: FastifyInstance) {
  app.get(BASE, { preHandler: [requireAuth] }, adminListFooterSections);
  app.get(`${BASE}/by-slug/:slug`, { preHandler: [requireAuth] }, adminGetFooterSectionBySlug);
  app.get(`${BASE}/:id`, { preHandler: [requireAuth] }, adminGetFooterSectionById);
  app.post(BASE, { preHandler: [requireAuth] }, adminCreateFooterSection);
  app.patch(`${BASE}/:id`, { preHandler: [requireAuth] }, adminUpdateFooterSection);
  app.delete(`${BASE}/:id`, { preHandler: [requireAuth] }, adminDeleteFooterSection);
}
