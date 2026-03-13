import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { ListingCard } from '@/components/patterns/ListingCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { getFallbackBlogPosts } from '@/lib/content-fallbacks';
import { buildMediaAlt } from '@/lib/media-seo';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';

async function fetchBlogPosts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages?module_key=kompozit_blog&is_active=1&locale=${locale}&limit=50`,
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
  const t = await getTranslations({ locale, namespace: 'blog' });
  return buildPageMetadata({
    locale,
    pathname: '/blog',
    title: locale.startsWith('en')
      ? `${t('title')} - Composite Engineering and Production Insights`
      : `${t('title')} - Kompozit Muhendislik ve Uretim Notlari`,
    description: t('description'),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const posts = await fetchBlogPosts(locale);
  const fallbackPosts = getFallbackBlogPosts(locale);
  const visiblePosts = posts.length > 0 ? posts : fallbackPosts;

  return (
    <div className="section-py">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: t('blog.title'),
              description: t('blog.description'),
              url: localizedUrl(locale, '/blog'),
              mainEntity: jsonld.itemList(
                visiblePosts.slice(0, 12).map((item: any) => ({
                  name: item.title,
                  url: item.slug ? localizedUrl(locale, `/blog/${item.slug}`) : localizedUrl(locale, '/contact'),
                })),
              ),
            }),
          ])}
        />
        <SectionHeader
          title={t('blog.title')}
          description={t('blog.description')}
        />

        {posts.length === 0 ? (
          <>
            <SeoIssueBeacon
              type="soft-404"
              pathname={localizedPath(locale, '/blog')}
              reason="blog-list-empty"
            />
            <p className="mt-12 text-center text-[var(--color-text-secondary)]">
              {t('blog.noPosts')}
            </p>
            <p className="mt-3 text-center text-sm text-[var(--color-text-muted)]">
              {locale === 'en'
                ? 'Sample editorial topics are shown below until live blog content becomes available.'
                : 'Canli blog icerigi gelene kadar asagida ornek editoriyel basliklar gosterilmektedir.'}
            </p>
          </>
        ) : (
          null
        )}
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post: any) => (
            <ListingCard
              key={post.id ?? post.title}
              href={post.slug ? localizedPath(locale, `/blog/${post.slug}`) : localizedPath(locale, '/contact')}
              title={post.title}
              description={post.description}
              imageSrc={post.image_url}
              imageAlt={buildMediaAlt({
                locale,
                kind: 'blog',
                title: post.title,
                alt: post.alt,
                caption: post.description,
                description: post.description,
              })}
              imageSizes="(max-width: 768px) 100vw, 33vw"
              imageAspectClassName="aspect-[16/9]"
              footer={<p className="text-sm font-medium text-[var(--color-brand)]">{t('blog.readMore')} &rarr;</p>}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
