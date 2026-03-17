// =============================================================
// FILE: src/modules/review/admin.controller.ts (ADMIN)
// =============================================================
import type { FastifyRequest } from "fastify";

// Zod şemaları (runtime değerler)
import {
  ReviewListParamsSchema,
  ReviewCreateSchema,
  ReviewUpdateSchema,
  IdParamSchema,
} from "./validation";

// Tipler gerekiyorsa ayrıca import type ile alabilirsin
// import type { ReviewCreateInput, ReviewUpdateInput } from "./validation";

import {
  repoListReviewsAdmin,
  repoGetReviewAdmin,
  repoCreateReviewAdmin,
  repoUpdateReviewAdmin,
  repoDeleteReviewAdmin,
} from "./repository";
import { type Locale } from "@/core/i18n";

export async function listReviewsAdmin(req: FastifyRequest) {
  const q = ReviewListParamsSchema.parse(req.query);

  const locale: Locale =
    (q.locale as Locale) ??
    ((req as any).locale as Locale | undefined) ??
    req.defaultLocale;

  return await repoListReviewsAdmin(
    req.server,
    q,
    locale,
    req.defaultLocale,
  );
}

export async function getReviewAdmin(req: FastifyRequest) {
  const { id } = IdParamSchema.parse(req.params);

  const locale: Locale =
    ((req as any).locale as Locale | undefined) ?? req.defaultLocale;

  return await repoGetReviewAdmin(
    req.server,
    id,
    locale,
    req.defaultLocale,
  );
}

export async function createReviewAdmin(req: FastifyRequest) {
  const body = ReviewCreateSchema.parse((req as any).body);

  const locale: Locale =
    (body.locale as Locale) ??
    ((req as any).locale as Locale | undefined) ??
    req.defaultLocale;

  return await repoCreateReviewAdmin(req.server, body, locale);
}

export async function updateReviewAdmin(req: FastifyRequest) {
  const { id } = IdParamSchema.parse(req.params);
  const body = ReviewUpdateSchema.parse((req as any).body);

  const locale: Locale =
    (body.locale as Locale) ??
    ((req as any).locale as Locale | undefined) ??
    req.defaultLocale;

  return await repoUpdateReviewAdmin(
    req.server,
    id,
    body,
    locale,
    req.defaultLocale,
  );
}

export async function removeReviewAdmin(req: FastifyRequest) {
  const { id } = IdParamSchema.parse(req.params);
  const ok = await repoDeleteReviewAdmin(req.server, id);
  return { ok };
}
