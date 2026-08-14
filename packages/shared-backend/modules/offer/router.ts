// =============================================================
// FILE: src/modules/offer/router.ts
// Ensotek – Offer Module Public Routes
// =============================================================

import type { FastifyInstance } from "fastify";
import { createOfferPublic } from "./controller";

const BASE = "/offers";

export async function registerOffer(app: FastifyInstance) {
  // Public teklif talebi oluşturma
  // Rate limit: /contacts ve /catalog-requests ile ayni (5/dk). Onceden teklif
  // ucunda HIC limit yoktu — ticari olarak en degerli form, en korumasiz olani idi.
  app.post(
    `${BASE}`,
    { config: { public: true, rateLimit: { max: 5, timeWindow: '1 minute' } } },
    createOfferPublic,
  );

  // İleride public status tracking vs. eklenecekse buraya gelir.
}
