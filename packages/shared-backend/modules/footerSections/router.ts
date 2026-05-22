import type { FastifyInstance } from "fastify";
import { listFooterSections } from "./controller";

export async function registerFooterSections(app: FastifyInstance) {
  app.get("/footer_sections", { config: { public: true } }, listFooterSections);
}
