// lighthouserc.cjs
const baseUrl =
  process.env.LH_BASE_URL ||
  process.env.PLAYWRIGHT_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

const locales = (process.env.LH_LOCALES || 'tr,en,de')
  .split(',')
  .map((x) => x.trim().toLowerCase())
  .filter(Boolean);

const defaultNoPrefix = (process.env.LH_DEFAULT_NO_PREFIX || '1') === '1';
const defaultLocale = (process.env.LH_DEFAULT_LOCALE || 'tr').trim().toLowerCase();

function withLocalePath(path, locale) {
  const p = `/${String(path || '').replace(/^\/+/, '')}`;
  const loc =
    String(locale || '')
      .trim()
      .toLowerCase() || defaultLocale;

  if (defaultNoPrefix && loc === defaultLocale) return p === '/' ? '/' : p;
  if (p === '/') return `/${loc}`;
  return `/${loc}${p}`;
}

const routes = [
  '/', // home
  '/product',
  '/service',
  '/news',
  '/library',
  '/references',
  '/contact',
  '/offer',
  '/faqs',
  '/terms',
  '/privacy-policy',
  '/privacy-notice',
  '/cookie-policy',
  '/legal-notice',
  '/kvkk',
  '/mission-vision',
  '/quality',
  '/team',
];

// URL listesi: locale x route
const urls = [];
for (const loc of locales) {
  for (const r of routes) {
    urls.push(new URL(withLocalePath(r, loc), baseUrl).toString());
  }
}

// Detay sayfaları (opsiyonel env ile)
function addIfSlug(envKey, templatePath) {
  const slug = (process.env[envKey] || '').trim();
  if (!slug) return;
  for (const loc of locales) {
    const path = templatePath.replace('[slug]', encodeURIComponent(slug));
    urls.push(new URL(withLocalePath(path, loc), baseUrl).toString());
  }
}
addIfSlug('LH_PRODUCT_SLUG', '/product/[slug]');
addIfSlug('LH_SERVICE_SLUG', '/service/[slug]');
addIfSlug('LH_NEWS_SLUG', '/news/[slug]');
addIfSlug('LH_LIBRARY_SLUG', '/library/[slug]');
addIfSlug('LH_TEAM_SLUG', '/team/[slug]');

module.exports = {
  ci: {
    collect: {
      url: urls,
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      },
    },
    assert: {
      // İlk aşamada çok agresif threshold koyma; stabilize edince sıkılaştır.
      assertions: {
        'categories:performance': ['warn', { minScore: 0.6 }],
        'categories:accessibility': ['warn', { minScore: 0.8 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
