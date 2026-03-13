const API_BASE = (process.env.SMOKE_API_BASE_URL || 'http://127.0.0.1:8086/api').replace(/\/$/, '');
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

async function request(pathname, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${pathname}`, options);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`request failed for ${API_BASE}${pathname}: ${reason}`);
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

async function expectStatus(pathname, options, expected, context) {
  const { res, data, text } = await request(pathname, options);
  if (res.status !== expected) {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    throw new Error(`${context} failed: expected ${expected}, got ${res.status}. payload=${payload || text}`);
  }
  return data;
}

async function deleteIfExists(token, pathname) {
  const { res } = await request(pathname, {
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

async function main() {
  const health = await fetch(`${API_ORIGIN}/health`);
  if (!health.ok) {
    throw new Error(`backend health check failed: ${health.status}`);
  }

  log(`Health OK: ${API_ORIGIN}/health`);

  const auth = await expectStatus(
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
  if (!token) throw new Error('admin auth failed: access_token missing');

  const commonHeaders = {
    Authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  };

  const ts = Date.now();

  try {
    const page = await expectStatus(
      '/admin/custom_pages',
      {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({
          module_key: 'kompozit_blog',
          locale: 'tr',
          title: `Smoke Kompozit Page ${ts}`,
          slug: `smoke-kompozit-page-${ts}`,
          content: '<p>Smoke content</p>',
          summary: 'Smoke summary',
          is_published: true,
        }),
      },
      201,
      'custom page create',
    );
    created.pageId = page.id;
    log(`Custom page create OK: ${created.pageId}`);

    const updatedPage = await expectStatus(
      `/admin/custom_pages/${created.pageId}`,
      {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify({
          locale: 'tr',
          title: 'Smoke Kompozit Page Updated',
          summary: 'Updated summary',
        }),
      },
      200,
      'custom page update',
    );
    if (updatedPage?.title !== 'Smoke Kompozit Page Updated') {
      throw new Error('custom page update failed: title mismatch');
    }
    log('Custom page update OK');

    await expectStatus(
      `/admin/custom_pages/${created.pageId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
      204,
      'custom page delete',
    );
    log('Custom page delete OK');
    created.pageId = null;

    const product = await expectStatus(
      '/admin/products',
      {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({
          item_type: 'kompozit',
          locale: 'tr',
          title: `Smoke Kompozit Product ${ts}`,
          slug: `smoke-kompozit-product-${ts}`,
          description: 'Smoke product',
          price: 0,
          category_id: KOMPOZIT_CATEGORY_ID,
          is_active: true,
          meta_title: 'Smoke Meta',
          meta_description: 'Smoke Meta Desc',
        }),
      },
      201,
      'kompozit product create',
    );
    created.productId = product.id;
    log(`Kompozit product create OK: ${created.productId}`);

    const updatedProduct = await expectStatus(
      `/admin/products/${created.productId}`,
      {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify({
          locale: 'tr',
          title: 'Smoke Kompozit Product Updated',
          specifications: {
            lif: 'hafif',
            surec: 'prototype',
          },
        }),
      },
      200,
      'kompozit product update',
    );
    if (updatedProduct?.title !== 'Smoke Kompozit Product Updated') {
      throw new Error('kompozit product update failed: title mismatch');
    }

    const fetchedProduct = await expectStatus(
      `/admin/products/${created.productId}?locale=tr&item_type=kompozit`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      200,
      'kompozit product get',
    );
    if (fetchedProduct?.item_type !== 'kompozit') {
      throw new Error('kompozit product get failed: item_type mismatch');
    }
    log('Kompozit product get/update OK');

    await expectStatus(
      `/admin/products/${created.productId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
      204,
      'kompozit product delete',
    );
    log('Kompozit product delete OK');
    created.productId = null;

    const gallery = await expectStatus(
      '/admin/galleries',
      {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({
          module_key: 'kompozit',
          source_type: 'standalone',
          locale: 'tr',
          title: `Smoke Gallery ${ts}`,
          slug: `smoke-kompozit-gallery-${ts}`,
          description: 'Smoke gallery',
          is_active: true,
          is_featured: false,
          display_order: 99,
        }),
      },
      201,
      'kompozit gallery create',
    );
    created.galleryId = gallery.id;
    log(`Kompozit gallery create OK: ${created.galleryId}`);

    const updatedGallery = await expectStatus(
      `/admin/galleries/${created.galleryId}`,
      {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify({
          locale: 'tr',
          title: 'Smoke Gallery Updated',
          meta_title: 'Updated Gallery Meta',
        }),
      },
      200,
      'kompozit gallery update',
    );
    if (updatedGallery?.title !== 'Smoke Gallery Updated') {
      throw new Error('kompozit gallery update failed: title mismatch');
    }

    const image = await expectStatus(
      `/admin/galleries/${created.galleryId}/images`,
      {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({
          locale: 'tr',
          image_url: `${API_ORIGIN}/uploads/smoke-image.jpg`,
          display_order: 10,
          is_cover: true,
          alt: 'Smoke image alt',
          caption: 'Smoke caption',
        }),
      },
      201,
      'gallery image create',
    );
    created.imageId = image.id;

    await expectStatus(
      `/admin/galleries/${created.galleryId}/images/${created.imageId}`,
      {
        method: 'PATCH',
        headers: commonHeaders,
        body: JSON.stringify({
          locale: 'tr',
          alt: 'Smoke image alt updated',
          caption: 'Smoke caption updated',
          display_order: 20,
        }),
      },
      200,
      'gallery image update',
    );

    const images = await expectStatus(
      `/admin/galleries/${created.galleryId}/images?locale=tr`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      200,
      'gallery image list',
    );
    const matched = Array.isArray(images) ? images.find((item) => item?.id === created.imageId) : null;
    if (!matched || matched.alt !== 'Smoke image alt updated') {
      throw new Error('gallery image list failed: updated image not found');
    }
    log('Gallery image create/update/list OK');

    await expectStatus(
      `/admin/galleries/${created.galleryId}/images/${created.imageId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
      204,
      'gallery image delete',
    );
    created.imageId = null;
    log('Gallery image delete OK');

    await expectStatus(
      `/admin/galleries/${created.galleryId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
      204,
      'kompozit gallery delete',
    );
    created.galleryId = null;
    log('Kompozit gallery delete OK');

    log('Kompozit admin smoke passed');
  } catch (error) {
    await cleanup(token);
    throw error;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
