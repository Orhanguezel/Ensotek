// src/plugins/i18n-locale.ts
import type { FastifyPluginCallback } from "fastify";
import { resolveLocaleFromHeaders, fallbackChain } from "@/core/i18n";

export const i18nLocalePlugin: FastifyPluginCallback = (app, _opts, done) => {
  app.addHook("onRequest", async (req) => {
    const { locale, defaultLocale } = resolveLocaleFromHeaders(req.headers as any);
    (req as any).locale = locale;
    (req as any).defaultLocale = defaultLocale;
    (req as any).localeFallbacks = fallbackChain(locale);
  });
  done();
};
