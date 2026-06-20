/**
 * Custom page içerik & SEO kalite skorlaması.
 *
 * Amaç: blog / custom page içeriklerinin Google'da indekslenmesini zorlaştıran
 * eksiklikleri (ince içerik, eksik meta, zayıf yapı) yayın öncesi yakalamak.
 * Tamamen sayfa satırından hesaplanır — dış servis / API bağımlılığı yoktur.
 *
 * hal-fiyatlari analysis/quality.ts mantığından uyarlanmıştır; kompozit
 * customPages şemasında bulunan alanlara göre sadeleştirilmiştir
 * (tags / og_image / image_alt kolonları bu şemada yok).
 */

export type QualityBreakItem = {
  key: string;
  label: string;
  points: number;
  max: number;
  pass: boolean;
  detail?: string;
  /** Geçmediğinde gösterilecek, içeriği iyileştirmeye yönelik somut öneri. */
  hint?: string;
};

export type QualityScoreBlock = {
  score: number;
  breakdown: QualityBreakItem[];
};

export type CustomPageQuality = {
  pageId: string;
  locale: string | null;
  slug: string | null;
  status: 'published' | 'draft';
  readiness: number;
  content: QualityScoreBlock & { wordCount: number; headings: number };
  seo: QualityScoreBlock;
};

export type ScoreableCustomPage = {
  id: string;
  locale?: string | null;
  title?: string | null;
  slug?: string | null;
  content?: string | null;
  summary?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  featured_image?: string | null;
  image_url?: string | null;
  is_published?: number | boolean | null;
};

function textFromHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countMatches(html: string, re: RegExp): number {
  return (html.match(re) ?? []).length;
}

function scoreContent(page: ScoreableCustomPage) {
  const html = page.content ?? '';
  const text = textFromHtml(html);
  const wordCount = text ? text.split(' ').filter(Boolean).length : 0;
  const headings = countMatches(html, /<h[23][\s>]/gi);
  const hasStructure = /<(ul|ol|table)[\s>]/i.test(html);
  const summaryLen = (page.summary ?? '').trim().length;
  const hasCover = Boolean((page.featured_image ?? '').trim() || (page.image_url ?? '').trim());

  const wordPts = wordCount >= 600 ? 35 : wordCount >= 350 ? 22 : wordCount >= 150 ? 10 : 0;
  const headingPts = headings >= 3 ? 20 : headings >= 1 ? 10 : 0;
  const structurePts = hasStructure ? 15 : 0;
  const summaryPts = summaryLen >= 120 && summaryLen <= 320 ? 20 : summaryLen > 0 ? 8 : 0;
  const coverPts = hasCover ? 10 : 0;

  const breakdown: QualityBreakItem[] = [
    {
      key: 'words',
      label: 'İçerik derinliği (gövde kelime)',
      points: wordPts,
      max: 35,
      pass: wordPts >= 22,
      detail: `${wordCount} kelime`,
      hint: 'Gövde metnini en az 350-600 kelimeye çıkar; ince içerik indekslenmeyi zorlaştırır.',
    },
    {
      key: 'headings',
      label: 'Bölüm başlıkları (H2/H3)',
      points: headingPts,
      max: 20,
      pass: headings >= 1,
      detail: `${headings} başlık`,
      hint: 'İçeriği H2/H3 başlıklarıyla bölümle; en az 3 başlık tarama ve okunabilirliği artırır.',
    },
    {
      key: 'structure',
      label: 'Yapılandırılmış içerik (liste/tablo)',
      points: structurePts,
      max: 15,
      pass: hasStructure,
      hint: 'En az bir madde listesi (ul/ol) veya tablo ekle; yapılandırılmış içerik zengin sonuç şansını artırır.',
    },
    {
      key: 'summary',
      label: 'Özet uzunluğu (120-320 krk)',
      points: summaryPts,
      max: 20,
      pass: summaryPts === 20,
      detail: `${summaryLen} karakter`,
      hint: 'Özeti 120-320 karakter aralığında, içeriği anlatan özgün bir metinle doldur.',
    },
    {
      key: 'cover',
      label: 'Kapak görseli',
      points: coverPts,
      max: 10,
      pass: hasCover,
      hint: 'Bir kapak görseli ekle; sosyal paylaşım ve listeleme kartları için gereklidir.',
    },
  ];

  const score = Math.min(100, breakdown.reduce((s, b) => s + b.points, 0));
  return { score, breakdown, wordCount, headings };
}

function scoreSeo(page: ScoreableCustomPage): QualityScoreBlock {
  const metaTitle = (page.meta_title ?? '').trim();
  const metaDesc = (page.meta_description ?? '').trim();
  const slug = (page.slug ?? '').trim();
  const titleLen = (page.title ?? '').trim().length;
  const hasCover = Boolean((page.featured_image ?? '').trim() || (page.image_url ?? '').trim());

  const mtPts = metaTitle.length >= 30 && metaTitle.length <= 60 ? 25 : metaTitle.length >= 15 && metaTitle.length <= 70 ? 14 : metaTitle ? 5 : 0;
  const mdPts = metaDesc.length >= 120 && metaDesc.length <= 160 ? 25 : metaDesc.length >= 80 && metaDesc.length <= 185 ? 15 : metaDesc ? 6 : 0;
  const slugPts = slug && /^[a-z0-9-]+$/.test(slug) && slug.length <= 80 ? 20 : slug ? 8 : 0;
  const titlePts = titleLen >= 30 && titleLen <= 65 ? 15 : titleLen ? 6 : 0;
  const coverPts = hasCover ? 15 : 0;

  const breakdown: QualityBreakItem[] = [
    {
      key: 'metaTitle',
      label: 'Meta başlık (30-60 krk)',
      points: mtPts,
      max: 25,
      pass: mtPts === 25,
      detail: `${metaTitle.length} krk`,
      hint: 'Meta başlığı 30-60 karakter, anahtar kelimeyi içeren özgün bir metin yap.',
    },
    {
      key: 'metaDesc',
      label: 'Meta açıklama (120-160 krk)',
      points: mdPts,
      max: 25,
      pass: mdPts === 25,
      detail: `${metaDesc.length} krk`,
      hint: 'Meta açıklamayı 120-160 karakter, tıklamayı teşvik eden bir metinle doldur.',
    },
    {
      key: 'slug',
      label: 'Temiz slug',
      points: slugPts,
      max: 20,
      pass: slugPts === 20,
      detail: slug || '—',
      hint: 'Slug yalnızca küçük harf, rakam ve tire içermeli; 80 karakteri aşmamalı.',
    },
    {
      key: 'title',
      label: 'Başlık uzunluğu (30-65 krk)',
      points: titlePts,
      max: 15,
      pass: titlePts === 15,
      detail: `${titleLen} krk`,
      hint: 'Başlığı 30-65 karakter aralığında, açıklayıcı ve özgün tut.',
    },
    {
      key: 'cover',
      label: 'Kapak / OG görseli',
      points: coverPts,
      max: 15,
      pass: hasCover,
      hint: 'Sosyal paylaşımda kullanılacak bir kapak görseli ekle.',
    },
  ];

  const score = Math.min(100, breakdown.reduce((s, b) => s + b.points, 0));
  return { score, breakdown };
}

export function scoreCustomPageQuality(page: ScoreableCustomPage): CustomPageQuality {
  const published = Boolean(
    typeof page.is_published === 'boolean' ? page.is_published : Number(page.is_published ?? 0),
  );
  const content = scoreContent(page);
  const seo = scoreSeo(page);
  const readiness = Math.min(
    100,
    Math.round(content.score * 0.45 + seo.score * 0.45 + (published ? 10 : 0)),
  );
  return {
    pageId: page.id,
    locale: page.locale ?? null,
    slug: page.slug ?? null,
    status: published ? 'published' : 'draft',
    readiness,
    content,
    seo,
  };
}
