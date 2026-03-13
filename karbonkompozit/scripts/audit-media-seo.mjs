const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8086/api';

async function fetchJson(pathname) {
  const res = await fetch(`${API_BASE_URL}${pathname}`);
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      data: [],
    };
  }
  const data = await res.json();
  return {
    ok: true,
    status: res.status,
    data: Array.isArray(data) ? data : data?.items ?? data ?? [],
  };
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isWeakAlt(value, title) {
  const normalized = normalizeText(value).toLocaleLowerCase();
  const normalizedTitle = normalizeText(title).toLocaleLowerCase();
  return !normalized || normalized.length < 6 || normalized === normalizedTitle;
}

function hasDate(value) {
  return Boolean(value) && Number.isFinite(Date.parse(value));
}

function metricLine(label, value, total) {
  return `- ${label}: ${value}/${total}`;
}

try {
  const warnings = [];

  const [productResult, galleryResult, postResult] = await Promise.all([
    fetchJson('/products?item_type=kompozit&is_active=1&limit=20'),
    fetchJson('/galleries?module_key=kompozit&is_active=1&limit=20'),
    fetchJson('/custom_pages?module_key=kompozit_blog&is_active=1&limit=20'),
  ]);

  const products = productResult.data;
  const galleries = galleryResult.data;
  const posts = postResult.data;

  for (const [label, pathname, result] of [
    ['products', '/products?item_type=kompozit&is_active=1&limit=20', productResult],
    ['galleries', '/galleries?module_key=kompozit&is_active=1&limit=20', galleryResult],
    ['blog', '/custom_pages?module_key=kompozit_blog&is_active=1&limit=20', postResult],
  ]) {
    if (!result.ok) {
      warnings.push(`Skipped ${label}: ${pathname} -> ${result.status}`);
    }
  }

  const galleryImagesNested = await Promise.all(
    galleries.slice(0, 10).map(async (gallery) => {
      if (!gallery?.id) return [];
      const result = await fetchJson(`/galleries/${encodeURIComponent(gallery.id)}/images`);
      if (!result.ok) {
        warnings.push(
          `Skipped gallery images for ${gallery.id}: /galleries/${encodeURIComponent(gallery.id)}/images -> ${result.status}`,
        );
        return [];
      }
      return result.data;
    }),
  );

  const galleryImages = galleryImagesNested.flat();

  const report = [
    'Media SEO audit report',
    `API: ${API_BASE_URL}`,
    '',
    'Products',
    metricLine(
      'weak alt',
      products.filter((item) => isWeakAlt(item.alt, item.title)).length,
      products.length,
    ),
    metricLine(
      'missing updated_at',
      products.filter((item) => !hasDate(item.updated_at)).length,
      products.length,
    ),
    '',
    'Galleries',
    metricLine(
      'weak cover alt',
      galleries.filter((item) => isWeakAlt(item.cover_image_alt, item.title)).length,
      galleries.length,
    ),
    metricLine(
      'missing updated_at',
      galleries.filter((item) => !hasDate(item.updated_at)).length,
      galleries.length,
    ),
    '',
    'Gallery Images',
    metricLine(
      'weak alt',
      galleryImages.filter((item) => isWeakAlt(item.alt, item.caption ?? item.gallery_title)).length,
      galleryImages.length,
    ),
    metricLine(
      'missing caption',
      galleryImages.filter((item) => !normalizeText(item.caption)).length,
      galleryImages.length,
    ),
    metricLine(
      'missing width',
      galleryImages.filter((item) => !(Number(item.width) > 0)).length,
      galleryImages.length,
    ),
    metricLine(
      'missing height',
      galleryImages.filter((item) => !(Number(item.height) > 0)).length,
      galleryImages.length,
    ),
    metricLine(
      'missing updated_at',
      galleryImages.filter((item) => !hasDate(item.updated_at)).length,
      galleryImages.length,
    ),
    '',
    'Blog',
    metricLine(
      'missing updated_at',
      posts.filter((item) => !hasDate(item.updated_at)).length,
      posts.length,
    ),
  ];

  if (warnings.length > 0) {
    report.push('', 'Warnings', ...warnings.map((line) => `- ${line}`));
  }

  console.log(report.join('\n'));
} catch (error) {
  console.error(`Media SEO audit could not run against ${API_BASE_URL}`);
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
