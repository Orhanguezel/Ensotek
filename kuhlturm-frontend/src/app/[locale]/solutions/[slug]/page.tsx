import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { getCustomPages, getCustomPageBySlug, parseCustomPageContent, getSiteSetting } from '@ensotek/core/services';
import type { CustomPage } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';
import { ContactInfoCard, type ContactInfo } from '@/components/sections/ContactInfoCard';
import { SocialShareCard } from '@/components/sections/SocialShareCard';
import { ReviewsSection } from '@/components/sections/ReviewsSection';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const items = await getCustomPages(API_BASE_URL, {
    module_key: 'solutions',
    is_published: true,
    limit: 200,
  }).catch(() => []);
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getCustomPageBySlug(API_BASE_URL, slug, locale).catch(() => null);
  if (!item) return { title: 'Lösungen' };
  return {
    title: item.meta_title ?? item.title,
    description: item.meta_description ?? item.summary ?? undefined,
    openGraph: item.featured_image
      ? { images: [{ url: item.featured_image }] }
      : undefined,
  };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, tCommon, tReviews] = await Promise.all([
    getTranslations('solutions'),
    getTranslations('common'),
    getTranslations('reviews'),
  ]);

  const item = await getCustomPageBySlug(API_BASE_URL, slug, locale).catch(() => null);

  if (!item) {
    return (
      <main>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-lg mb-6">{t('noResults')}</p>
            <Link
              href={`/${locale}/solutions`}
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              <ArrowLeft size={16} />
              {t('backToSolutions')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const htmlContent = parseCustomPageContent(item.content);

  const date = new Date(item.created_at).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const tags = item.tags
    ? item.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  // Related solutions (same category, excluding current)
  const related: CustomPage[] = await getCustomPages(API_BASE_URL, {
    module_key: 'solutions',
    language: locale,
    is_published: true,
    category_id: item.category_id ?? undefined,
    sort: 'display_order',
    order: 'asc',
    limit: 4,
  })
    .then((all) => all.filter((p) => p.slug !== slug).slice(0, 3))
    .catch(() => []);

  // Contact info
  const contactInfoRaw = await getSiteSetting(API_BASE_URL, 'contact_info', locale).catch(() => null);
  const contactInfo: ContactInfo = contactInfoRaw?.value
    ? (typeof contactInfoRaw.value === 'string'
        ? (() => { try { return JSON.parse(contactInfoRaw.value); } catch { return {}; } })()
        : contactInfoRaw.value as ContactInfo)
    : {};

  return (
    <main>
      {/* Article header */}
      <div className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} />
            <Link href={`/${locale}/solutions`} className="hover:text-white transition-colors">
              {t('title')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white line-clamp-1">{item.title}</span>
          </nav>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
            {item.category_name && (
              <span className="uppercase font-semibold tracking-wide text-blue-400">
                {item.category_name}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {date}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            {item.title}
          </h1>

          {item.summary && (
            <p className="mt-4 text-lg text-slate-300 leading-relaxed max-w-3xl">
              {item.summary}
            </p>
          )}
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main content */}
            <div className="lg:col-span-2">
              {item.featured_image && (
                <div className="mb-10 rounded-2xl overflow-hidden">
                  <img
                    src={item.featured_image}
                    alt={item.featured_image_alt ?? item.title}
                    className="w-full max-h-120 object-cover"
                  />
                </div>
              )}

              {htmlContent ? (
                <div
                  className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-a:text-blue-600"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <p className="text-slate-400">{t('noContent')}</p>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={14} className="text-slate-400" />
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back link */}
              <div className="mt-10">
                <Link
                  href={`/${locale}/solutions`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
                >
                  <ArrowLeft size={16} />
                  {t('backToSolutions')}
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              <ContactInfoCard
                info={contactInfo}
                labels={{
                  title: tCommon('contactCardTitle'),
                  callUs: tCommon('callUs'),
                  emailUs: tCommon('emailUs'),
                  address: tCommon('addressLabel'),
                  whatsapp: tCommon('whatsappContact'),
                }}
              />
              <SocialShareCard
                path={`/${locale}/solutions/${item.slug}`}
                title={item.title}
                labels={{
                  title: tCommon('shareTitle'),
                  copyLink: tCommon('copyLink'),
                  copied: tCommon('copied'),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Related solutions */}
      {related.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
              {t('related')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => {
                const relDate = new Date(rel.created_at).toLocaleDateString('de-DE', {
                  day: '2-digit', month: 'short', year: 'numeric',
                });
                return (
                  <Link
                    key={rel.id}
                    href={`/${locale}/solutions/${rel.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-4/3 overflow-hidden bg-slate-100">
                      {rel.featured_image ? (
                        <img
                          src={rel.featured_image}
                          alt={rel.featured_image_alt ?? rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                          <span className="text-blue-200 text-4xl font-display font-bold">L</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Calendar size={11} /> {relDate}
                      </p>
                      <h3 className="font-display font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-snug">
                        {rel.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <ReviewsSection
        targetType="custom_page"
        targetId={item.id}
        locale={locale}
        labels={{
          title: tReviews('title'),
          noReviews: tReviews('noReviews'),
          beFirst: tReviews('beFirst'),
          avgRating: tReviews('avgRating'),
          totalReviews: tReviews('totalReviews'),
          helpful: tReviews('helpful'),
          adminReply: tReviews('adminReply'),
          formTitle: tReviews('formTitle'),
          nameLabel: tReviews('nameLabel'),
          emailLabel: tReviews('emailLabel'),
          ratingLabel: tReviews('ratingLabel'),
          titleLabel: tReviews('titleLabel'),
          commentLabel: tReviews('commentLabel'),
          submitLabel: tReviews('submitLabel'),
          submittingLabel: tReviews('submittingLabel'),
          successTitle: tReviews('successTitle'),
          successDetail: tReviews('successDetail'),
          errorMessage: tReviews('errorMessage'),
          namePlaceholder: tReviews('namePlaceholder'),
          emailPlaceholder: tReviews('emailPlaceholder'),
          titlePlaceholder: tReviews('titlePlaceholder'),
          commentPlaceholder: tReviews('commentPlaceholder'),
        }}
      />
    </main>
  );
}
