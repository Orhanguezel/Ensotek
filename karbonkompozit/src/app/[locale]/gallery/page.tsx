import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { MediaOverlayCard } from '@/components/patterns/MediaOverlayCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { buildMediaAlt, buildMediaSchemaText } from '@/lib/media-seo';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';
import { getFallbackGalleries } from '@/lib/content-fallbacks';

const GALLERY_PLACEHOLDER_SRC = '/media/gallery-placeholder.svg';

async function fetchGalleries(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/galleries?module_key=kompozit&is_active=1&locale=${locale}&limit=50&sort=display_order&orderDir=asc`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });
  return buildPageMetadata({
    locale,
    pathname: '/gallery',
    title: locale.startsWith('en')
      ? `${t('title')} - Composite Production and Project Visuals`
      : `${t('title')} - Kompozit Uretim ve Proje Gorselleri`,
    description: t('description'),
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const galleries = await fetchGalleries(locale);
  const visibleGalleries = galleries.length > 0 ? galleries : getFallbackGalleries(locale);

  return (
    <div className="section-py">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: t('gallery.title'),
              description: t('gallery.description'),
              url: localizedUrl(locale, '/gallery'),
              mainEntity: jsonld.itemList(
                visibleGalleries.map((gallery: any) => ({
                  name: gallery.title,
                  url: gallery.slug
                    ? localizedUrl(locale, `/gallery/${gallery.slug}`)
                    : localizedUrl(locale, '/gallery'),
                })),
              ),
            }),
          ])}
        />
        <SectionHeader
          title={t('gallery.title')}
          description={t('gallery.description')}
        />

        {galleries.length === 0 ? (
          <>
            <SeoIssueBeacon
              type="soft-404"
              pathname={localizedPath(locale, '/gallery')}
              reason="gallery-list-empty"
            />
            <p className="mt-12 text-center text-[var(--color-text-secondary)]">
              {t('gallery.noGalleries')}
            </p>
            <p className="mt-3 text-center text-sm text-[var(--color-text-muted)]">
              {locale === 'en'
                ? 'Sample gallery topics are shown below until live project visuals become available.'
                : 'Canli proje gorselleri gelene kadar asagida ornek galeri basliklari gosterilmektedir.'}
            </p>
          </>
        ) : null}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGalleries.map((g: any) => {
            const media = buildMediaSchemaText({
              locale,
              kind: 'gallery-cover',
              title: g.title,
              alt: g.cover_image_alt,
              description: g.description,
            });

            return (
              <MediaOverlayCard
                key={g.id ?? g.title}
                href={g.slug ? localizedPath(locale, `/gallery/${g.slug}`) : localizedPath(locale, '/gallery')}
                src={g.cover_image_url_resolved || g.cover_image || g.imageSrc || GALLERY_PLACEHOLDER_SRC}
                alt={media.alt}
                title={g.title}
                description={g.description}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
