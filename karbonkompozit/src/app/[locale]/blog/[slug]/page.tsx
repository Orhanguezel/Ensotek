import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { absoluteAssetUrl, API_BASE_URL } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl, organizationJsonLd } from '@/seo';
import { BrandCtaPanel } from '@/components/patterns/BrandCtaPanel';
import { fetchRelatedContent } from '@/lib/related-content';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { buildMediaAlt } from '@/lib/media-seo';
import { BlogEngagementPanelClient } from '@/components/blog/BlogEngagementPanelClient';
import { SocialShare } from '@/components/blog/SocialShare';

const BLOG_PLACEHOLDER_SRC = '/media/blog-placeholder.svg';

async function fetchPost(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages/by-slug/${encodeURIComponent(slug)}?locale=${locale}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await fetchPost(slug, locale);
  if (!post) return {};
  return buildPageMetadata({
    locale,
    pathname: `/blog/${slug}`,
    title:
      post.meta_title ||
      (locale.startsWith('en')
        ? `${post.title} - Composite Engineering Insight`
        : `${post.title} - Kompozit Muhendislik Notu`),
    description:
      post.meta_description ||
      (locale.startsWith('en')
        ? `${post.title}. Read technical guidance on material selection, production methods and industrial composite applications.`
        : `${post.title}. Malzeme secimi, uretim yontemleri ve endustriyel kompozit uygulamalari icin teknik icerigi inceleyin.`),
    ogImage: post.image_url,
    openGraphType: 'article',
    includeLocaleAlternates: false,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const post = await fetchPost(slug, locale);
  if (!post) notFound();
  const content = normalizeRichContent(post.content);
  const related = await fetchRelatedContent(post, slug, locale);
  const org = organizationJsonLd(locale);
  const imageSrc = absoluteAssetUrl(post.image_url) || BLOG_PLACEHOLDER_SRC;
  const breadcrumbs = [
    { label: t('nav.home'), href: localizedPath(locale, '/') },
    { label: t('nav.blog'), href: localizedPath(locale, '/blog') },
    { label: post.title },
  ];
  const postUrl = localizedUrl(locale, `/blog/${slug}`);

  return (
    <article className="section-py">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <JsonLd
          data={jsonld.graph([
            jsonld.org(org),
            jsonld.article({
              headline: post.title,
              description: post.description,
              image: post.image_url,
              datePublished: post.created_at,
              dateModified: post.updated_at,
              publisher: {
                name: org.name,
                logo: org.logo as string | undefined,
              },
            }),
            jsonld.breadcrumb(
              breadcrumbs.map((item) => ({
                name: item.label,
                url: item.href ? localizedUrl(locale, item.href.replace(`/${locale}`, '') || '/') : localizedUrl(locale, `/blog/${slug}`),
              })),
            ),
          ])}
        />
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="mt-6 text-3xl font-bold lg:text-4xl">{post.title}</h1>

        {post.created_at && (
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            {t('blog.publishedAt')}:{' '}
            {new Date(post.created_at).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-[2rem] bg-[var(--color-border)]">
          <OptimizedImage
            src={imageSrc}
            alt={buildMediaAlt({
              locale,
              kind: 'blog',
              title: post.title,
              alt: post.featured_image_alt,
              caption: post.description,
              description: post.description,
            })}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        {content && (
          <div
            className="prose prose-theme mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        <SocialShare
          url={postUrl}
          title={post.title}
          texts={{
            label: t('blog.share.label'),
            copyLink: t('blog.share.copyLink'),
            copied: t('blog.share.copied'),
            copyError: t('blog.share.copyError'),
            buttonTitle: t('blog.share.buttonTitle'),
          }}
        />

        <BlogEngagementPanelClient
          locale={locale}
          postId={post.id}
          texts={{
            title: t('blog.engagement.title'),
            subtitle: t('blog.engagement.subtitle'),
            likeButton: t('blog.engagement.likeButton'),
            emptyTitle: t('blog.engagement.emptyTitle'),
            emptyText: t('blog.engagement.emptyText'),
            formLabel: t('blog.engagement.formLabel'),
            formTitle: t('blog.engagement.formTitle'),
            formDescription: t('blog.engagement.formDescription'),
            namePlaceholder: t('blog.engagement.namePlaceholder'),
            emailPlaceholder: t('blog.engagement.emailPlaceholder'),
            commentPlaceholder: t('blog.engagement.commentPlaceholder'),
            moderationNote: t('blog.engagement.moderationNote'),
            submit: t('blog.engagement.submit'),
            submitSuccess: t('blog.engagement.submitSuccess'),
            submitError: t('blog.engagement.submitError'),
          }}
          commonTexts={{
            loading: t('common.loading'),
            error: t('common.error'),
          }}
        />

        <div className="mt-10">
          <BrandCtaPanel
            title={t('common.offerCtaTitle')}
            description={t('common.offerCtaDescription')}
            action={(
              <Link
                href={`${localizedPath(locale, '/offer')}?product=${encodeURIComponent(post.title)}`}
                className="btn-contrast mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                {t('nav.offer')}
                <ArrowRight className="size-4" />
              </Link>
            )}
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <RelatedLinks
            title={t('common.relatedArticles')}
            hrefBase={localizedPath(locale, '/blog')}
            items={related.blogPosts}
          />
          <RelatedLinks
            title={t('common.relatedProducts')}
            hrefBase={localizedPath(locale, '/products')}
            items={related.products}
          />
          <RelatedLinks
            title={t('common.relatedGallery')}
            hrefBase={localizedPath(locale, '/gallery')}
            items={related.galleries}
          />
        </div>
      </div>
    </article>
  );
}
