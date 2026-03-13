import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Settings, Truck } from 'lucide-react';

import { absoluteAssetUrl, API_BASE_URL } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, organizationJsonLd, siteUrlBase } from '@/seo';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { DarkCtaPanel } from '@/components/patterns/DarkCtaPanel';
import { FeatureCard } from '@/components/patterns/FeatureCard';
import { ListingCard } from '@/components/patterns/ListingCard';
import { MediaOverlayCard } from '@/components/patterns/MediaOverlayCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { getFallbackBlogPosts, getFallbackGalleries, getFallbackProducts } from '@/lib/content-fallbacks';
import { buildMediaAlt } from '@/lib/media-seo';

const GALLERY_PLACEHOLDER_SRC = '/media/gallery-placeholder.svg';
const BLOG_PLACEHOLDER_SRC = '/media/blog-placeholder.svg';

async function fetchFeaturedProducts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products?item_type=kompozit&is_active=1&is_featured=1&locale=${locale}&limit=8`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchFeaturedGalleries(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/galleries?module_key=kompozit&is_active=1&is_featured=1&locale=${locale}&limit=6`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

async function fetchFeaturedBlogPosts(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages?module_key=kompozit_blog&is_active=1&locale=${locale}&limit=3`,
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
  const t = await getTranslations({ locale, namespace: 'seo' });

  return buildPageMetadata({
    locale,
    pathname: '/',
    title: locale.startsWith('en')
      ? 'Carbon Fiber, FRP and Fiberglass Composite Manufacturing'
      : 'Karbon Fiber, CTP ve Cam Elyaf Kompozit Uretimi',
    description: t('defaultDescription'),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const [products, galleries, blogPosts] = await Promise.all([
    fetchFeaturedProducts(locale),
    fetchFeaturedGalleries(locale),
    fetchFeaturedBlogPosts(locale),
  ]);

  const siteUrl = siteUrlBase();
  const heroMetrics = t.raw('home.hero.metrics') as Record<string, string>;
  const heroSteps = t.raw('home.hero.steps') as Record<string, string>;
  const heroStats = t.raw('home.hero.stats') as Record<string, string>;
  const visibleProducts = products.length > 0 ? products.slice(0, 8) : getFallbackProducts(locale);
  const visibleBlogPosts = blogPosts.length > 0 ? blogPosts.slice(0, 3) : getFallbackBlogPosts(locale);
  const visibleGalleries = galleries.length > 0 ? galleries.slice(0, 6) : getFallbackGalleries(locale);
  const [featuredBlogPost, ...secondaryBlogPosts] = visibleBlogPosts;
  const featuredBlogImageSrc =
    absoluteAssetUrl(featuredBlogPost?.image_url || featuredBlogPost?.featured_image) ||
    BLOG_PLACEHOLDER_SRC;

  const whyUsItems = [
    { icon: Shield, key: 'quality' },
    { icon: Zap, key: 'experience' },
    { icon: Settings, key: 'custom' },
    { icon: Truck, key: 'delivery' },
  ] as const;

  return (
    <>
      <JsonLd
        data={jsonld.graph([
          jsonld.org({
            ...organizationJsonLd(locale, {
              description: t('seo.defaultDescription'),
            }),
            url: siteUrl,
          }),
          jsonld.website({
            name: 'MOE Kompozit',
            url: siteUrl,
          }),
        ])}
      />

      {/* Hero */}
      <section className="surface-dark-shell">
        <div className="surface-hero-glow-brand motion-float-soft absolute left-[-8rem] top-16 h-72 w-72 rounded-full blur-3xl" />
        <div className="surface-hero-glow-muted motion-float-soft absolute right-[-6rem] top-24 h-80 w-80 rounded-full blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)] lg:px-8 lg:py-24">
          <div className="motion-fade-up max-w-3xl">
            <span className="surface-glass-dark inline-flex rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-light)]">
              {t('home.hero.badge')}
            </span>
            <h1 className="surface-dark-heading motion-fade-up motion-delay-1 mt-6 max-w-4xl text-balance text-4xl font-bold lg:text-6xl">
              {t('home.hero.title')}
            </h1>
            <p className="surface-dark-text motion-fade-up motion-delay-2 mt-6 max-w-2xl text-lg leading-8">
              {t('home.hero.subtitle')}
            </p>
            <div className="motion-fade-up motion-delay-3 mt-10 flex flex-wrap gap-4">
              <Link
                href={localizedPath(locale, '/products')}
                className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
              >
                {t('home.hero.cta')}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={localizedPath(locale, '/offer')}
                className="surface-glass-dark surface-glass-hover surface-dark-heading inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
              >
                {t('home.hero.ctaSecondary')}
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="surface-glass-dark motion-fade-up motion-delay-2 rounded-2xl px-4 py-4">
                <p className="surface-dark-heading text-2xl font-bold">{heroMetrics.prototypeTitle}</p>
                <p className="surface-dark-text mt-1 text-sm">{heroMetrics.prototypeDesc}</p>
              </div>
              <div className="surface-glass-dark motion-fade-up motion-delay-3 rounded-2xl px-4 py-4">
                <p className="surface-dark-heading text-2xl font-bold">{heroMetrics.productionTitle}</p>
                <p className="surface-dark-text mt-1 text-sm">{heroMetrics.productionDesc}</p>
              </div>
              <div className="surface-glass-dark motion-fade-up motion-delay-4 rounded-2xl px-4 py-4">
                <p className="surface-dark-heading text-2xl font-bold">{heroMetrics.engineeringTitle}</p>
                <p className="surface-dark-text mt-1 text-sm">{heroMetrics.engineeringDesc}</p>
              </div>
            </div>
          </div>

          <div className="motion-slide-right motion-delay-2 flex items-stretch justify-center lg:justify-end">
            <div className="surface-glass-dark shadow-hero-panel w-full max-w-xl rounded-[2rem] p-5">
              <div className="surface-glass-dark rounded-[1.6rem] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="surface-dark-text text-sm font-medium uppercase tracking-[0.18em]">
                      {t('home.hero.workflowLabel')}
                    </p>
                    <h2 className="surface-dark-heading mt-3 text-2xl font-bold">
                      {t('home.hero.workflowTitle')}
                    </h2>
                  </div>
                  <div className="surface-glass-dark rounded-2xl px-4 py-3 text-right">
                    <p className="surface-dark-heading text-2xl font-bold">{t('home.hero.workflowBadgeTitle')}</p>
                    <p className="surface-dark-text text-xs">{t('home.hero.workflowBadgeSubtitle')}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="surface-glass-dark rounded-2xl px-4 py-4">
                    <p className="surface-dark-heading text-sm font-semibold">{heroSteps.oneTitle}</p>
                    <p className="surface-dark-text mt-1 text-sm">
                      {heroSteps.oneDesc}
                    </p>
                  </div>
                  <div className="surface-glass-dark rounded-2xl px-4 py-4">
                    <p className="surface-dark-heading text-sm font-semibold">{heroSteps.twoTitle}</p>
                    <p className="surface-dark-text mt-1 text-sm">
                      {heroSteps.twoDesc}
                    </p>
                  </div>
                  <div className="surface-glass-dark rounded-2xl px-4 py-4">
                    <p className="surface-dark-heading text-sm font-semibold">{heroSteps.threeTitle}</p>
                    <p className="surface-dark-text mt-1 text-sm">
                      {heroSteps.threeDesc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="surface-glass-dark rounded-2xl px-4 py-4">
                    <p className="surface-dark-heading text-3xl font-bold">{heroStats.stepsValue}</p>
                    <p className="surface-dark-text mt-1 text-sm">{heroStats.stepsLabel}</p>
                  </div>
                  <div className="surface-glass-dark rounded-2xl px-4 py-4">
                    <p className="surface-dark-heading text-3xl font-bold">{heroStats.b2bValue}</p>
                    <p className="surface-dark-text mt-1 text-sm">{heroStats.b2bLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section-py">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="motion-fade-up">
            <SectionHeader
            title={t('home.whyUs.title')}
            description={t('home.whyUs.subtitle')}
            align="center"
            />
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyUsItems.map(({ icon: Icon, key }, index) => (
              <div key={key} className={`motion-fade-up motion-delay-${Math.min(index + 1, 4)}`}>
                <FeatureCard
                  icon={<Icon className="size-7 text-[var(--color-brand)]" />}
                  title={t(`home.whyUs.${key}`)}
                  description={t(`home.whyUs.${key}Desc`)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-py bg-[var(--color-bg-muted)]">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="motion-fade-up">
              <SectionHeader
              title={t('home.products.title')}
              description={t('home.products.subtitle')}
              action={(
                <Link
                  href={localizedPath(locale, '/products')}
                  className="hidden items-center gap-1 text-sm font-medium text-[var(--color-brand)] hover:underline sm:flex"
                >
                  {t('common.viewAll')} <ArrowRight className="size-3.5" />
                </Link>
              )}
              />
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((p: any, index: number) => (
                <div key={p.id ?? p.title} className={`motion-fade-up motion-delay-${(index % 4) + 1}`}>
                  <ListingCard
                    href={p.slug ? localizedPath(locale, `/products/${p.slug}`) : `${localizedPath(locale, '/offer')}?product=${encodeURIComponent(p.title)}`}
                    title={p.title}
                    description={p.description}
                    imageSrc={p.image_url}
                    imageAlt={buildMediaAlt({
                      locale,
                      kind: 'product',
                      title: p.title,
                      alt: p.alt,
                      caption: p.caption,
                      description: p.description,
                    })}
                    imageSizes="(max-width: 768px) 50vw, 25vw"
                    imageAspectClassName="aspect-[4/3]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Gallery preview */}
      <section className="section-py">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="motion-fade-up">
            <SectionHeader
            title={t('home.gallery.title')}
            description={t('home.gallery.subtitle')}
            action={(
              <Link
                href={localizedPath(locale, '/gallery')}
                className="hidden items-center gap-1 text-sm font-medium text-[var(--color-brand)] hover:underline sm:flex"
              >
                {t('common.viewAll')} <ArrowRight className="size-3.5" />
              </Link>
            )}
            />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGalleries.map((g: any, index: number) => (
              <Reveal key={g.id ?? g.title} delay={120 * (index + 1)}>
                <MediaOverlayCard
                  href={g.slug ? localizedPath(locale, `/gallery/${g.slug}`) : localizedPath(locale, '/gallery')}
                  src={absoluteAssetUrl(g.cover_image_url_resolved || g.cover_image || g.imageSrc) || GALLERY_PLACEHOLDER_SRC}
                  alt={buildMediaAlt({
                    locale,
                    kind: 'gallery-cover',
                    title: g.title,
                    alt: g.cover_image_alt,
                    description: g.description,
                  })}
                  title={g.title}
                  meta={g.image_count != null ? `${g.image_count} ${t('gallery.viewAll').toLowerCase()}` : undefined}
                  description={g.description}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py bg-[var(--color-bg-muted)]">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <SectionHeader
            title={t('home.blog.title')}
            description={t('home.blog.subtitle')}
            />
          </Reveal>
          <Reveal className="mt-8" delay={120}>
            {featuredBlogPost ? (
              <article className="surface-card rounded-[2rem] p-6 lg:p-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_14rem] lg:items-start">
                  <div>
                    <h3 className="text-balance text-2xl font-semibold text-[var(--color-text-primary)] lg:text-3xl">
                      {t('home.blog.spotlightTitle')}
                    </h3>
                    <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
                      {t('home.blog.spotlightBodyPrimary')}
                    </p>
                    <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
                      {t('home.blog.spotlightBodySecondary')}
                    </p>
                    <div className="surface-card-muted mt-6 rounded-[1.5rem] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                        {t('home.blog.insightLabel')}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                        {t('home.blog.insightText')}
                      </p>
                    </div>
                    <Link
                      href={featuredBlogPost?.slug ? localizedPath(locale, `/blog/${featuredBlogPost.slug}`) : localizedPath(locale, '/blog')}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] transition-opacity hover:opacity-80"
                    >
                      {t('blog.readMore')}
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>

                  <div className="surface-card-muted rounded-[1.5rem] p-3">
                      <div className="relative aspect-[5/4] overflow-hidden rounded-[1.1rem] bg-[var(--color-border)]">
                        <OptimizedImage
                          src={featuredBlogImageSrc}
                          alt={buildMediaAlt({
                            locale,
                            kind: 'blog',
                            title: featuredBlogPost.title,
                            alt: featuredBlogPost.alt,
                            caption: featuredBlogPost.description,
                            description: featuredBlogPost.description,
                          })}
                          fill
                          sizes="(max-width: 1024px) 100vw, 14rem"
                          className="object-cover"
                        />
                      </div>
                    </div>
                </div>
              </article>
            ) : null}
          </Reveal>
        </div>
      </section>

      <section className="section-py bg-[var(--color-bg-muted)] pt-0">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <SectionHeader
            title={t('home.blog.archiveLabel')}
            description={t('home.blog.archiveSubtitle')}
            action={(
              <Link
                href={localizedPath(locale, '/blog')}
                className="hidden items-center gap-1 text-sm font-medium text-[var(--color-brand)] hover:underline sm:flex"
              >
                {t('common.viewAll')} <ArrowRight className="size-3.5" />
              </Link>
            )}
            />
          </Reveal>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {secondaryBlogPosts.map((post: any, index: number) => (
              <Reveal key={post.id ?? post.title} delay={120 * (index + 1)}>
                <article
                  className="surface-card rounded-[2rem] p-5 lg:p-6"
                >
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                    {post.description}
                  </p>
                  <Link
                    href={post.slug ? localizedPath(locale, `/blog/${post.slug}`) : localizedPath(locale, '/blog')}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] transition-opacity hover:opacity-80"
                  >
                    {t('blog.readMore')}
                    <ArrowRight className="size-4" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="surface-dark-shell">
        <div className="surface-hero-glow-brand motion-float-soft absolute right-0 top-0 h-40 w-40 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="motion-fade-up">
            <DarkCtaPanel
            title={t('common.offerCtaTitle')}
            description={t('common.offerCtaDescription')}
            action={(
              <Link
                href={localizedPath(locale, '/offer')}
                className="btn-primary mt-8 inline-flex items-center gap-2 rounded-lg px-8 py-3 font-medium transition-colors"
              >
                {t('common.requestOffer')}
                <ArrowRight className="size-4" />
              </Link>
            )}
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-py bg-[var(--color-bg-muted)]">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="motion-fade-up">
            <h2 className="text-2xl font-bold">{t('home.newsletter.title')}</h2>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              {t('home.newsletter.subtitle')}
            </p>
          </div>
          <div className="motion-fade-up motion-delay-2">
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
