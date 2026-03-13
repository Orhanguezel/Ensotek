// =============================================================
// FILE: src/app.ts
// FIX: Audit module single-entry mount (registerAudit) + remove duplicate stream mount
// =============================================================

import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import authPlugin from './plugins/authPlugin';
import mysqlPlugin from '@/plugins/mysql';
import staticUploads from './plugins/staticUploads';
import { localeMiddleware } from '@/common/middleware/locale';

import type { FastifyInstance } from 'fastify';
import { env } from '@/core/env';
import { registerErrorHandlers } from '@/core/error';

// Public modüller
import { registerAuth } from '@/modules/auth/router';
import { registerStorage } from '@/modules/storage/router';
import { registerCustomPages } from '@/modules/customPages/router';
import { registerSiteSettings } from '@/modules/siteSettings/router';
import { registerReferences } from '@/modules/references/router';
import { registerMenuItems } from '@/modules/menuItems/router';
import { registerCategories } from '@/modules/categories/router';
import { registerSubCategories } from '@/modules/subcategories/router';
import { registerContacts } from '@/modules/contact/router';
import { registerLibrary } from '@/modules/library/router';
import { registerNotifications } from '@/modules/notifications/router';
import { registerProducts } from '@/modules/products/router';
import { registerReviews } from '@/modules/review/router';
import { registerContentReactions } from '@/modules/contentReactions/router';
import { registerOffer } from '@/modules/offer/router';
import { registerGallery } from '@/modules/gallery/router';

// ✅ Audit single entry
import { registerAudit } from '@/modules/audit/router';
import { shouldSkipAuditLog, writeRequestAuditLog, startRetentionJob } from '@/modules/audit/service';

// Admin modüller
import { registerCustomPagesAdmin } from '@/modules/customPages/admin.routes';
import { registerSiteSettingsAdmin } from '@/modules/siteSettings/admin.routes';
import { registerUserAdmin } from '@/modules/auth/admin.routes';
import { registerReferencesAdmin } from '@/modules/references/admin.routes';
import { registerStorageAdmin } from '@/modules/storage/admin.routes';
import { registerMenuItemsAdmin } from '@/modules/menuItems/admin.routes';
import { registerCategoriesAdmin } from '@/modules/categories/admin.routes';
import { registerSubCategoriesAdmin } from '@/modules/subcategories/admin.routes';
import { registerContactsAdmin } from '@/modules/contact/admin.routes';
import { registerLibraryAdmin } from '@/modules/library/admin.routes';
import { registerProductsAdmin } from '@/modules/products/admin.routes';
import { registerReviewsAdmin } from '@/modules/review/admin.routes';
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';
import { registerOfferAdmin } from '@/modules/offer/admin.routes';
import { registerGalleryAdmin } from '@/modules/gallery/admin.routes';

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

function parseCorsOrigins(v?: string | string[]): boolean | string[] {
  if (!v) return true;
  if (Array.isArray(v)) return v;
  const s = String(v).trim();
  if (!s) return true;
  const arr = s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  return arr.length ? arr : true;
}

export async function createApp() {
  const { default: buildFastify } = (await import('fastify')) as unknown as {
    default: (opts?: Parameters<FastifyInstance['log']['child']>[0]) => FastifyInstance;
  };

  const app = buildFastify({
    logger: env.NODE_ENV !== 'production',
  }) as FastifyInstance;

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
    origin: parseCorsOrigins(env.CORS_ORIGIN as any),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-lang',
      'Prefer',
      'Accept',
      'Accept-Language',
      'X-Locale',
      'x-skip-auth',
      'Range',
    ],
    exposedHeaders: ['x-total-count', 'content-range', 'range'],
  });

  // Swagger docs
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'MOE Kompozit API',
        description: 'MOE Kompozit Backend API Documentation',
        version: '0.1.0',
      },
      servers: [
        {
          url: `http://${process.env.HOST || 'localhost'}:${env.PORT}`,
          description: 'Local server',
        },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    // transformStaticCSP allow 'unsafe-inline' because of Swagger UI inline styles issue
    staticCSP: true,
    transformStaticCSP: (header) => {
      return header.replace('style-src', "style-src 'unsafe-inline'");
    },
  });

  const cookieSecret =
    (globalThis as any).Bun?.env?.COOKIE_SECRET ?? process.env.COOKIE_SECRET ?? 'cookie-secret';

  await app.register(cookie, {
    secret: cookieSecret,
    hook: 'onRequest',
    parseOptions: {
      httpOnly: true,
      path: '/',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
    },
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: { cookieName: 'access_token', signed: false },
  });

  app.addHook('onRequest', localeMiddleware);

  await app.register(authPlugin);
  await app.register(mysqlPlugin);

  app.get('/health', async () => ({ ok: true }));

  await app.register(multipart, {
    throwFileSizeLimit: true,
    limits: { fileSize: 20 * 1024 * 1024 },
  });

  await app.register(staticUploads);

  await app.register(
    async (api) => {
      api.get('/health', async () => ({ ok: true }));

      // ✅ Audit request logger: /api scope'unda — TÜM API trafiğini loglar
      api.addHook('onResponse', async (req, reply) => {
        try {
          if (shouldSkipAuditLog(req)) return;
          const reqId = String((req as any).id || (req as any).reqId || '');
          const elapsed =
            typeof (reply as any).elapsedTime === 'number' ? (reply as any).elapsedTime : 0;
          await writeRequestAuditLog({ req, reply, reqId, responseTimeMs: elapsed });
        } catch (err) {
          (req as any).log?.warn?.({ err }, 'audit_request_log_failed');
        }
      });

      // Audit admin endpoints + SSE stream
      await api.register(async (i) => registerAudit(i), { prefix: '/admin' });
      await api.register(async (i) => registerCustomPagesAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerSiteSettingsAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerUserAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerReferencesAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerStorageAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerMenuItemsAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerCategoriesAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerSubCategoriesAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerContactsAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerLibraryAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerProductsAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerReviewsAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerDashboardAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerOfferAdmin(i), { prefix: '/admin' });
      await api.register(async (i) => registerGalleryAdmin(i), { prefix: '/admin' });

      // --- Public modüller: /api/...
      await registerAuth(api);
      await registerStorage(api);
      await registerCustomPages(api);
      await registerSiteSettings(api);
      await registerReferences(api);
      await registerMenuItems(api);
      await registerCategories(api);
      await registerSubCategories(api);
      await registerContacts(api);
      await registerLibrary(api);
      await registerNotifications(api);
      await registerProducts(api);
      await registerReviews(api);
      await registerContentReactions(api);
      await registerOffer(api);
      await registerGallery(api);
    },
    { prefix: '/api' },
  );

  registerErrorHandlers(app);

  // Audit log retention cleanup (runs daily)
  startRetentionJob();

  return app;
}
