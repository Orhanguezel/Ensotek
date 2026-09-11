import { createHash, timingSafeEqual } from 'node:crypto';
import type { FastifyInstance } from 'fastify';

export const CONTRACT = 'ensotek-family-content@1.0';
export type ContentSite = 'ensotek_de' | 'ensotek_com_tr' | 'kuhlturm' | 'kompozit';
const profiles = {
  ensotek_de: { origin: 'https://ensotek.de', locale: 'de', locales: ['de', 'en', 'tr'] },
  ensotek_com_tr: { origin: 'https://www.ensotek.com.tr', locale: 'tr', locales: ['tr', 'en'] },
  kuhlturm: { origin: 'https://kuhlturm.com', locale: 'de', locales: ['de', 'en'] },
  kompozit: { origin: 'https://www.karbonkompozit.com.tr', locale: 'tr', locales: ['tr', 'en'] },
};
type Row = Record<string, any>;
type Query = (sql: string, values: any[]) => Promise<Row[]>;
const BASE = '/api/integrations/tanitio';
const digest = (value: string) => createHash('sha256').update(value).digest();
function html(value: unknown): string {
  if (typeof value !== 'string') return '';
  try { const parsed = JSON.parse(value); return typeof parsed?.html === 'string' ? parsed.html : ''; }
  catch { return value; }
}
function timestamp(value: any): string | null {
  if (!value) return null;
  const date = new Date(typeof value === 'string' && !/[TZ+]\d*/.test(value) ? value.replace(' ', 'T') + 'Z' : value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}
function asset(origin: string, value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try { const url = new URL(value, origin); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
export function contentPath(site: ContentSite, locale: string, row: Row, product: boolean): string {
  const canonicalSlug = site === 'ensotek_com_tr' && product
    ? String(row.slug).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i')
    : row.slug;
  const slug = encodeURIComponent(canonicalSlug);
  if (product) return `/${locale}/${site === 'kompozit' ? 'products' : site === 'ensotek_com_tr' ? (locale === 'tr' ? 'urunler' : 'products') : row.item_type === 'sparepart' ? 'sparepart' : 'product'}/${slug}`;
  const module = String(row.module_key).replace(/^kompozit_/, '');
  if (site === 'ensotek_com_tr' && module !== 'blog') return `/${locale}/${locale === 'tr' ? 'kurumsal' : 'about'}`;
  if (site === 'kuhlturm' && ['mission', 'vision', 'quality'].includes(module)) return `/${locale}/about/${slug}`;
  if (site === 'kompozit' && module === 'about') return `/${locale}/about`;
  const section = ['mission', 'vision'].includes(module) ? 'mission-vision' : module;
  return `/${locale}/${section}/${slug}`;
}

/** Only this backend's own pool is supplied; request input never selects a DB or origin. */
export async function registerTanitioContent(app: FastifyInstance, options: {
  site: ContentSite; query: Query; apiKey: () => string | undefined;
}) {
  const profile = profiles[options.site];
  await app.register(async api => {
    api.addHook('onRequest', (req, reply, done) => {
      reply.header('Cache-Control', 'private, no-store');
      const expected = options.apiKey();
      if (!expected) { reply.code(503).send({ error: { code: 'NOT_CONFIGURED', message: 'Content connection is not configured' } }); return; }
      const token = req.headers.authorization?.match(/^Bearer (\S+)$/)?.[1] || '';
      if (!token || !timingSafeEqual(digest(token), digest(expected))) { reply.code(401).send({ error: { code: 'UNAUTHORIZED', message: 'Valid bearer key required' } }); return; }
      done();
    });
    api.get(BASE, { config: { public: true } }, async () => ({
      contract: CONTRACT, site: options.site, websiteUrl: profile.origin,
      defaultLocale: profile.locale, locales: profile.locales,
      resources: ['articles', 'products', 'pages'], fullContent: true,
      pagination: { mode: 'offset', maxLimit: 60 },
      sync: { updatedSince: true, tombstones: false, fullReconciliationRequired: true },
    }));
    for (const resource of ['articles', 'products', 'pages'] as const) {
      const product = resource === 'products';
      const handler = async (req: any, reply: any) => {
        const q = req.query || {};
        const locale = q.locale || profile.locale;
        const limit = Number(q.limit ?? 24), offset = Number(q.offset ?? 0);
        if (!profile.locales.includes(locale) || !Number.isInteger(limit) || limit < 1 || limit > 60 || !Number.isInteger(offset) || offset < 0 || offset > 100000 || (q.q && (typeof q.q !== 'string' || q.q.length > 256)) || q.cursor || (q.updated_since && !/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(q.updated_since)) || (q.updated_since && !Number.isFinite(Date.parse(q.updated_since))) || (q.sort && !['recent', 'popular'].includes(q.sort))) {
          return reply.code(400).send({ error: { code: 'INVALID_QUERY', message: 'Invalid locale, pagination, sort or updated_since' } });
        }
        const id = req.params?.id;
        if (id && !/^[a-f0-9-]{36}$/i.test(id)) return reply.code(400).send({ error: { code: 'INVALID_ID', message: 'Use the resource UUID' } });
        const table = product ? 'products p JOIN product_i18n i ON i.product_id=p.id' : 'custom_pages p JOIN custom_pages_i18n i ON i.page_id=p.id';
        const where = [product ? 'p.is_active=1' : 'p.is_published=1', 'i.locale=?', "TRIM(i.slug)<>''", "TRIM(i.title)<>''"];
        const values: any[] = [locale];
        if (!product) {
          const modules = resource === 'articles' && q.type !== 'page' ? (options.site === 'kompozit' ? ['kompozit_blog'] : ['blog', 'news']) : options.site === 'kompozit' ? ['kompozit_about','kompozit_solutions','kompozit_legal'] : options.site === 'ensotek_com_tr' ? ['about','mission','vision','quality'] : ['about','mission','vision','quality','solutions','team','legal'];
          where.push(`p.module_key IN (${modules.map(() => '?').join(',')})`); values.push(...modules);
        }
        if (id) { where.push('p.id=?'); values.push(id); }
        if (q.q) { where.push('(i.title LIKE ? OR i.slug LIKE ?)'); values.push(`%${q.q}%`, `%${q.q}%`); }
        if (q.updated_since) { where.push('GREATEST(p.updated_at,i.updated_at)>=?'); values.push(new Date(q.updated_since).toISOString().slice(0,23).replace('T',' ')); }
        const clause = where.join(' AND ');
        const count = await options.query(`SELECT COUNT(*) total FROM ${table} WHERE ${clause}`, values);
        const fields = product ? 'p.item_type,p.image_url,p.images,i.description AS content,NULL AS summary,NULL AS module_key' : 'p.module_key,COALESCE(NULLIF(p.featured_image,\'\'),p.image_url) AS image_url,p.images,i.content,i.summary';
        const rows = await options.query(`SELECT p.id,i.locale,i.title,i.slug,${fields},p.created_at,GREATEST(p.updated_at,i.updated_at) AS updated_at FROM ${table} WHERE ${clause} ORDER BY ${product && q.sort === 'popular' ? 'p.is_featured DESC,' : ''}GREATEST(p.updated_at,i.updated_at) DESC,p.id ASC LIMIT ? OFFSET ?`, [...values, id ? 1 : limit, id ? 0 : offset]);
        const items = rows.map(row => {
          const body = html(row.content);
          let images: unknown[] = []; try { const parsed = typeof row.images === 'string' ? JSON.parse(row.images) : row.images; if (Array.isArray(parsed)) images = parsed; } catch {}
          return { id: row.id, kind: product ? 'product' : 'article', contentType: product ? row.item_type : String(row.module_key).replace(/^kompozit_/, ''), locale: row.locale, title: row.title,
            url: profile.origin + contentPath(options.site, locale, row, product),
            imageUrl: asset(profile.origin, row.image_url), image_url: asset(profile.origin, row.image_url), imageUrls: images.map(v => asset(profile.origin,v)).filter(Boolean),
            excerpt: row.summary || body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0,1000) || null,
            contentHtml: body, updatedAt: timestamp(row.updated_at), publishedAt: timestamp(row.created_at),
            price: null, popularity: null };
        });
        if (id) return items[0] || reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Published content not found in this locale' } });
        const total = Number(count[0]?.total || 0);
        return { contract: CONTRACT, items, total, limit, offset, hasMore: offset + items.length < total };
      };
      api.get(`${BASE}/${resource}`, { config: { public: true } }, handler);
      api.get(`${BASE}/${resource}/:id`, { config: { public: true } }, handler);
    }
  });
}
