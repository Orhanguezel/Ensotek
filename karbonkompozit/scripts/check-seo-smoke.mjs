import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'src', 'app', '[locale]');

const requiredFiles = [
  path.join(ROOT, 'src', 'app', 'robots.ts'),
  path.join(ROOT, 'src', 'app', 'sitemap.ts'),
  path.join(ROOT, 'src', 'app', 'manifest.ts'),
  path.join(ROOT, 'src', 'app', 'opengraph-image.tsx'),
  path.join(ROOT, 'src', 'app', 'twitter-image.tsx'),
  path.join(ROOT, 'src', 'app', 'icon.tsx'),
  path.join(ROOT, 'src', 'app', 'apple-icon.tsx'),
  path.join(ROOT, 'src', 'seo', 'helpers.ts'),
  path.join(ROOT, 'src', 'components', 'seo', 'Breadcrumbs.tsx'),
  path.join(ROOT, 'src', 'components', 'seo', 'RelatedLinks.tsx'),
];

const pageFiles = [
  path.join(APP_DIR, 'page.tsx'),
  path.join(APP_DIR, 'about', 'page.tsx'),
  path.join(APP_DIR, 'products', 'page.tsx'),
  path.join(APP_DIR, 'products', '[slug]', 'page.tsx'),
  path.join(APP_DIR, 'blog', 'page.tsx'),
  path.join(APP_DIR, 'blog', '[slug]', 'page.tsx'),
  path.join(APP_DIR, 'gallery', 'page.tsx'),
  path.join(APP_DIR, 'gallery', '[slug]', 'page.tsx'),
  path.join(APP_DIR, 'contact', 'page.tsx'),
  path.join(APP_DIR, 'offer', 'page.tsx'),
  path.join(APP_DIR, 'legal', '[slug]', 'page.tsx'),
];

const failures = [];

for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    failures.push(`Missing required SEO file: ${path.relative(ROOT, file)}`);
  }
}

for (const file of pageFiles) {
  try {
    const source = await readFile(file, 'utf8');
    if (!source.includes('generateMetadata')) {
      failures.push(`${path.relative(ROOT, file)}: missing generateMetadata`);
    }
    if (!source.includes('buildPageMetadata')) {
      failures.push(`${path.relative(ROOT, file)}: missing buildPageMetadata usage`);
    }
  } catch {
    failures.push(`Missing page file: ${path.relative(ROOT, file)}`);
  }
}

for (const file of [
  path.join(APP_DIR, 'products', '[slug]', 'page.tsx'),
  path.join(APP_DIR, 'blog', '[slug]', 'page.tsx'),
  path.join(APP_DIR, 'gallery', '[slug]', 'page.tsx'),
]) {
  const source = await readFile(file, 'utf8');
  if (!source.includes('Breadcrumbs')) {
    failures.push(`${path.relative(ROOT, file)}: missing breadcrumb UI`);
  }
  if (!source.includes('jsonld.breadcrumb')) {
    failures.push(`${path.relative(ROOT, file)}: missing breadcrumb schema`);
  }
  if (!source.includes('RelatedLinks')) {
    failures.push(`${path.relative(ROOT, file)}: missing related links cluster`);
  }
}

const helpersSource = await readFile(path.join(ROOT, 'src', 'seo', 'helpers.ts'), 'utf8');
if (
  !helpersSource.includes('localeAlternates') ||
  !helpersSource.includes('buildPageMetadata') ||
  !helpersSource.includes("/opengraph-image")
) {
  failures.push('src/seo/helpers.ts: missing metadata helper contract');
}

const sitemapSource = await readFile(path.join(ROOT, 'src', 'app', 'sitemap.ts'), 'utf8');
for (const pattern of ['/products', '/gallery', '/blog', '/legal']) {
  if (!sitemapSource.includes(pattern)) {
    failures.push(`src/app/sitemap.ts: missing ${pattern} coverage`);
  }
}
if (!sitemapSource.includes('images: resolveSitemapImages')) {
  failures.push('src/app/sitemap.ts: missing image sitemap coverage');
}

if (failures.length > 0) {
  console.error('SEO smoke check failed:\n' + failures.map((line) => `- ${line}`).join('\n'));
  process.exit(1);
}

console.log('SEO smoke check passed');
