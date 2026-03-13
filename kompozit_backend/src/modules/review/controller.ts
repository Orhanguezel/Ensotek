// =============================================================
// FILE: src/modules/review/controller.ts (PUBLIC)
// =============================================================
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  ReviewListParamsSchema,
  ReviewCreateSchema,
  IdParamSchema,
  // ReviewReactionSchema  // ❌ artık kullanmıyoruz
} from "./validation";
import { isRecaptchaEnabled, shouldBypassRecaptchaForOrigin, verifyRecaptchaToken } from './recaptcha';

import {
  repoListReviewsPublic,
  repoGetReviewPublic,
  repoCreateReviewPublic,
  repoAddReactionPublic,
} from "./repository";
import { DEFAULT_LOCALE, type Locale } from "@/core/i18n";

export async function listReviewsPublic(req: FastifyRequest) {
  const q = ReviewListParamsSchema.parse(req.query);

  const locale: Locale =
    (q.locale as Locale) ??
    ((req as any).locale as Locale | undefined) ??
    DEFAULT_LOCALE;

  return await repoListReviewsPublic(
    req.server,
    q,
    locale,
    DEFAULT_LOCALE,
  );
}

export async function getReviewPublic(req: FastifyRequest) {
  const { id } = IdParamSchema.parse(req.params);

  const locale: Locale =
    ((req as any).locale as Locale | undefined) ?? DEFAULT_LOCALE;

  return await repoGetReviewPublic(
    req.server,
    id,
    locale,
    DEFAULT_LOCALE,
  );
}

/** Public form submit */
export async function createReviewPublic(req: FastifyRequest, reply: FastifyReply) {
  const body = ReviewCreateSchema.parse((req as any).body);
  const requestOrigin = typeof req.headers.origin === 'string' ? req.headers.origin : '';

  if (isRecaptchaEnabled() && !shouldBypassRecaptchaForOrigin(requestOrigin)) {
    if (!body.captcha_token) {
      return reply.code(400).send({ error: { message: 'captcha_required' } });
    }

    const remoteIp =
      ((req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] || '').trim() ||
      req.ip;

    const verification = await verifyRecaptchaToken(body.captcha_token, remoteIp || undefined);

    if (!verification.success) {
      return reply
        .code(400)
        .send({ error: { message: 'captcha_verification_failed', details: verification.errorCodes } });
    }
  }

  const locale: Locale =
    (body.locale as Locale) ??
    ((req as any).locale as Locale | undefined) ??
    DEFAULT_LOCALE;

  return await repoCreateReviewPublic(req.server, body, locale);
}

/** Public reaction (like/helpful) */
export async function addReviewReactionPublic(req: FastifyRequest) {
  const { id } = IdParamSchema.parse(req.params);

  // Şimdilik body'deki type'ı (like/dislike) kullanmıyoruz.
  // Eğer ileride ihtiyacın olursa burada ReviewReactionSchema.parse ile
  // parse edip repoAddReactionPublic'e type geçirirsin.

  const locale: Locale =
    ((req as any).locale as Locale | undefined) ?? DEFAULT_LOCALE;

  return await repoAddReactionPublic(
    req.server,
    id,
    locale,
    DEFAULT_LOCALE,
  );
}
