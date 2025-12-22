import type { FastifyInstance } from 'fastify';
import {
  listSiteSettings,
  getSiteSettingByKey,
  getAppLocalesPublic,
  getDefaultLocalePublic,
} from './controller';

const BASE = '/site_settings';

export async function registerSiteSettings(app: FastifyInstance) {
  app.get(`${BASE}`, { config: { public: true } }, listSiteSettings);
  app.get(`${BASE}/:key`, { config: { public: true } }, getSiteSettingByKey);

  // ✅ META (public)
  app.get(`${BASE}/app-locales`, { config: { public: true } }, getAppLocalesPublic);
  app.get(`${BASE}/default-locale`, { config: { public: true } }, getDefaultLocalePublic);
}
