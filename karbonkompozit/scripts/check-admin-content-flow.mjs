import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BUILD_ID_FILE = path.join(ROOT, '.next', 'BUILD_ID');
const STANDALONE_DIR = path.join(ROOT, '.next', 'standalone', 'karbonkompozit');
const STANDALONE_SERVER = path.join(STANDALONE_DIR, 'server.js');
const PREPARE_SCRIPT = path.join(ROOT, 'scripts', 'prepare-standalone.mjs');

const FRONTEND_PORT = 3122;
const FRONTEND_BASE_URL = process.env.SMOKE_FRONTEND_BASE_URL || `http://127.0.0.1:${FRONTEND_PORT}`;
const API_BASE = (process.env.SMOKE_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8086/api').replace(/\/$/, '');
const API_ORIGIN = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : API_BASE;
const ADMIN_EMAIL = process.env.SMOKE_ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || 'orhanguzell@gmail.com';
const ADMIN_PASSWORD = process.env.SMOKE_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || 'admin123';
const KOMPOZIT_CATEGORY_ID = 'cccc0001-4001-4001-8001-cccccccc0001';

const created = {
  pageId: null,
  productId: null,
  galleryId: null,
  imageId: null,
};

function log(message) {
  process.stdout.write(`${message}\n`);
}

async function ensureBuildExists() {
  try {
    await access(BUILD_ID_FILE);
    await access(STANDALONE_SERVER);
    await access(PREPARE_SCRIPT);
  } catch {
    throw new Error('Missing standalone build output. Run `npm run build` before `npm run test:smoke:admin-content`.');
  }
}

async function prepareStandaloneAssets() {
  await new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [PREPARE_SCRIPT], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });

    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('exit', (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }

      reject(new Error(stderr.trim() || `prepare-standalone exited with code ${code}`));
    });
  });
}

async function waitForServer(proc) {
  const start = Date.now();

  while (Date.now() - start < 20000) {
    if (proc.exitCode != null) {
      throw new Error(`frontend standalone server exited early with code ${proc.exitCode}`);
    }

    try {
      const res = await fetch(`${FRONTEND_BASE_URL}/tr`, { redirect: 'manual' });
      if (res.ok) return;
    } catch {
      // frontend still booting
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error('Timed out waiting for frontend standalone server.');
}

async function frontendGet(pathname) {
  const res = await fetch(`${FRONTEND_BASE_URL}${pathname}`, { redirect: 'manual' });
  const text = await res.text();
  return { res, text };
}

async function expectFrontend(pathname, patterns) {
  const { res, text } = await frontendGet(pathname);

  if (!res.ok) {
    throw new Error(`frontend route ${pathname} failed: expected 200, got ${res.status}`);
  }

  for (const pattern of patterns) {
    if (!text.includes(pattern)) {
      throw new Error(`frontend route ${pathname} missing pattern: ${pattern}`);
    }
  }
}

async function apiRequest(pathname, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${pathname}`, options);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`API request failed for ${API_BASE}${pathname}: ${reason}`);
  }

  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { res, data, text };
}

async function expectApiStatus(pathname, options, expected, context) {
  const { res, data, text } = await apiRequest(pathname, options);
  if (res.status !== expected) {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    throw new Error(`${context} failed: expected ${expected}, got ${res.status}. payload=${payload || text}`);
  }
  return data;
}

async function deleteIfExists(token, pathname) {
  const { res } = await apiRequest(pathname, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (![204, 404].includes(res.status)) {
    throw new Error(`cleanup failed for ${pathname}: ${res.status}`);
  }
}

async function cleanup(token) {
  if (!token) return;

  if (created.imageId && created.galleryId) {
    await deleteIfExists(token, `/admin/galleries/${created.galleryId}/images/${created.imageId}`);
  }
  if (created.galleryId) {
    await deleteIfExists(token, `/admin/galleries/${created.galleryId}`);
  }
  if (created.productId) {
    await deleteIfExists(token, `/admin/products/${created.productId}`);
  }
  if (created.pageId) {
    await deleteIfExists(token, `/admin/custom_pages/${created.pageId}`);
  }
}

async function createAdminContent() {
  const auth = await expectApiStatus(
    '/auth/token',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'password',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    },
    200,
    'admin auth',
  );

  const token = auth?.access_token;
  if (!token) {
    throw new Error('admin auth failed: access_token missing');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  };

  const ts = Date.now();
  const pageSlug = `frontend-smoke-blog-${ts}`;
  const productSlug = `frontend-smoke-product-${ts}`;
  const gallerySlug = `frontend-smoke-gallery-${ts}`;

  const pageTitle = `Frontend Smoke Blog ${ts}`;
  const productTitle = `Frontend Smoke Product ${ts}`;
  const galleryTitle = `Frontend Smoke Gallery ${ts}`;
  const pageTitleEn = `Frontend Smoke Blog EN ${ts}`;
  const productTitleEn = `Frontend Smoke Product EN ${ts}`;
  const galleryTitleEn = `Frontend Smoke Gallery EN ${ts}`;

  try {
    const page = await expectApiStatus(
      '/admin/custom_pages',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          module_key: 'kompozit_blog',
          locale: 'tr',
          title: pageTitle,
          slug: pageSlug,
          content: `<p>Admin flow blog body ${ts}</p>`,
          summary: `Admin flow blog summary ${ts}`,
          meta_title: `${pageTitle} Meta`,
          meta_description: `Admin flow blog meta description ${ts}`,
          is_published: true,
        }),
      },
      201,
      'frontend smoke blog create',
    );
    created.pageId = page.id;

    await expectApiStatus(
      `/admin/custom_pages/${created.pageId}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          locale: 'en',
          title: pageTitleEn,
          slug: pageSlug,
          content: `<p>Admin flow blog body EN ${ts}</p>`,
          summary: `Admin flow blog summary EN ${ts}`,
          meta_title: `${pageTitleEn} Meta`,
          meta_description: `Admin flow blog meta description EN ${ts}`,
        }),
      },
      200,
      'frontend smoke blog en update',
    );

    const product = await expectApiStatus(
      '/admin/products',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          item_type: 'kompozit',
          locale: 'tr',
          title: productTitle,
          slug: productSlug,
          description: `<p>Admin flow product body ${ts}</p>`,
          image_url: `${API_ORIGIN}/media/gallery-placeholder.svg`,
          alt: `Admin flow product alt ${ts}`,
          price: 0,
          category_id: KOMPOZIT_CATEGORY_ID,
          tags: ['admin-flow', 'kompozit'],
          meta_title: `${productTitle} Meta`,
          meta_description: `Admin flow product meta description ${ts}`,
          is_active: true,
        }),
      },
      201,
      'frontend smoke product create',
    );
    created.productId = product.id;

    await expectApiStatus(
      `/admin/products/${created.productId}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          locale: 'en',
          title: productTitleEn,
          slug: productSlug,
          description: `<p>Admin flow product body EN ${ts}</p>`,
          alt: `Admin flow product alt EN ${ts}`,
          tags: ['admin-flow-en', 'composite'],
          meta_title: `${productTitleEn} Meta`,
          meta_description: `Admin flow product meta description EN ${ts}`,
        }),
      },
      200,
      'frontend smoke product en update',
    );

    const gallery = await expectApiStatus(
      '/admin/galleries',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          module_key: 'kompozit',
          source_type: 'standalone',
          locale: 'tr',
          title: galleryTitle,
          slug: gallerySlug,
          description: `Admin flow gallery description ${ts}`,
          meta_title: `${galleryTitle} Meta`,
          meta_description: `Admin flow gallery meta description ${ts}`,
          is_active: true,
          is_featured: false,
          display_order: 999,
        }),
      },
      201,
      'frontend smoke gallery create',
    );
    created.galleryId = gallery.id;

    await expectApiStatus(
      `/admin/galleries/${created.galleryId}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          locale: 'en',
          title: galleryTitleEn,
          slug: gallerySlug,
          description: `Admin flow gallery description EN ${ts}`,
          meta_title: `${galleryTitleEn} Meta`,
          meta_description: `Admin flow gallery meta description EN ${ts}`,
        }),
      },
      200,
      'frontend smoke gallery en update',
    );

    const image = await expectApiStatus(
      `/admin/galleries/${created.galleryId}/images`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          locale: 'tr',
          image_url: `${API_ORIGIN}/media/gallery-placeholder.svg`,
          display_order: 10,
          is_cover: true,
          alt: `Admin flow gallery alt ${ts}`,
          caption: `Admin flow gallery caption ${ts}`,
          description: `Admin flow gallery image description ${ts}`,
        }),
      },
      201,
      'frontend smoke gallery image create',
    );
    created.imageId = image.id;

    await expectApiStatus(
      `/admin/galleries/${created.galleryId}/images/${created.imageId}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          locale: 'en',
          alt: `Admin flow gallery alt EN ${ts}`,
          caption: `Admin flow gallery caption EN ${ts}`,
          description: `Admin flow gallery image description EN ${ts}`,
        }),
      },
      200,
      'frontend smoke gallery image en update',
    );

    return {
      token,
      blog: {
        slug: pageSlug,
        tr: {
          title: pageTitle,
          body: `Admin flow blog body ${ts}`,
          metaTitle: `${pageTitle} Meta`,
          metaDescription: `Admin flow blog meta description ${ts}`,
        },
        en: {
          title: pageTitleEn,
          body: `Admin flow blog body EN ${ts}`,
          metaTitle: `${pageTitleEn} Meta`,
          metaDescription: `Admin flow blog meta description EN ${ts}`,
        },
      },
      product: {
        slug: productSlug,
        tr: {
          title: productTitle,
          body: `Admin flow product body ${ts}`,
          metaTitle: `${productTitle} Meta`,
          metaDescription: `Admin flow product meta description ${ts}`,
          alt: `Admin flow product alt ${ts}`,
        },
        en: {
          title: productTitleEn,
          body: `Admin flow product body EN ${ts}`,
          metaTitle: `${productTitleEn} Meta`,
          metaDescription: `Admin flow product meta description EN ${ts}`,
          alt: `Admin flow product alt EN ${ts}`,
        },
      },
      gallery: {
        slug: gallerySlug,
        tr: {
          title: galleryTitle,
          description: `Admin flow gallery description ${ts}`,
          metaTitle: `${galleryTitle} Meta`,
          metaDescription: `Admin flow gallery meta description ${ts}`,
          alt: `Admin flow gallery alt ${ts}`,
          caption: `Admin flow gallery caption ${ts}`,
        },
        en: {
          title: galleryTitleEn,
          description: `Admin flow gallery description EN ${ts}`,
          metaTitle: `${galleryTitleEn} Meta`,
          metaDescription: `Admin flow gallery meta description EN ${ts}`,
          alt: `Admin flow gallery alt EN ${ts}`,
          caption: `Admin flow gallery caption EN ${ts}`,
        },
      },
    };
  } catch (error) {
    await cleanup(token);
    throw error;
  }
}

async function main() {
  const health = await fetch(`${API_ORIGIN}/health`);
  if (!health.ok) {
    throw new Error(`backend health check failed: ${health.status}`);
  }

  await ensureBuildExists();
  await prepareStandaloneAssets();

  const content = await createAdminContent();

  const proc = spawn(process.execPath, [STANDALONE_SERVER], {
    cwd: STANDALONE_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      PORT: String(FRONTEND_PORT),
      HOSTNAME: '127.0.0.1',
    },
  });

  let stdout = '';
  proc.stdout.on('data', (chunk) => {
    stdout += chunk.toString();
  });

  let stderr = '';
  proc.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForServer(proc);

    await expectFrontend('/tr/about', ['MOE Kompozit', 'Karbon fiber', 'Calisma Modelimiz']);
    await expectFrontend('/en/about', ['MOE Kompozit', 'carbon fiber', 'How We Work']);
    await expectFrontend('/tr/legal/privacy', ['MOE Kompozit', '/tr/legal/privacy', '<link rel="canonical"']);
    await expectFrontend('/en/legal/privacy', ['MOE Kompozit', '/en/legal/privacy', '<link rel="canonical"']);

    await expectFrontend(`/tr/blog/${content.blog.slug}`, [
      content.blog.tr.metaTitle,
      content.blog.tr.title,
      content.blog.tr.body,
      content.blog.tr.metaDescription,
    ]);
    await expectFrontend('/en/blog/what-is-carbon-fiber', [
      'What is Carbon Fiber?',
      'Carbon fiber is an advanced material',
    ]);

    await expectFrontend(`/tr/products/${content.product.slug}`, [
      content.product.tr.metaTitle,
      content.product.tr.title,
      content.product.tr.body,
      content.product.tr.alt,
      content.product.tr.metaDescription,
    ]);
    await expectFrontend('/en/products/carbon-fiber-panel-prototype', [
      'Carbon Fiber Panel Prototype',
      'Sample carbon fiber panel prototype entry',
    ]);

    await expectFrontend(`/tr/gallery/${content.gallery.slug}`, [
      content.gallery.tr.metaTitle,
      content.gallery.tr.title,
      content.gallery.tr.description,
      content.gallery.tr.alt,
      content.gallery.tr.caption,
      content.gallery.tr.metaDescription,
    ]);
    await expectFrontend('/en/gallery/carbon-fiber-panel-application-gallery', [
      'Carbon Fiber Panel Application Gallery',
      'Sample application gallery showing a carbon fiber panel',
      'Carbon fiber panel prototype surface',
      'Prototype surface inspection',
    ]);

    await expectFrontend('/sitemap.xml', [
      '/tr/blog/karbon-fiber-nedir',
      '/tr/products/karbon-fiber-panel-prototipi',
      '/tr/gallery/karbon-fiber-panel-uygulama-galerisi',
      '/en/blog/what-is-carbon-fiber',
      '/en/products/carbon-fiber-panel-prototype',
      '/en/gallery/carbon-fiber-panel-application-gallery',
    ]);

    log('Frontend admin content flow smoke passed (tr + en)');
  } catch (error) {
    if (stdout.trim()) {
      console.error(stdout.trim());
    }
    if (stderr.trim()) {
      console.error(stderr.trim());
    }
    throw error;
  } finally {
    proc.kill('SIGTERM');
    await cleanup(content.token);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
