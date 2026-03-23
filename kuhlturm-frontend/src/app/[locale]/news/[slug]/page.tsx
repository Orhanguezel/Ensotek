import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { getCustomPages, getCustomPageBySlug, parseCustomPageContent, getSiteSetting } from '@ensotek/core/services';
import type { CustomPage } from '@ensotek/core/types';
import { getCustomPageBySlugWithLocale, getCustomPagesWithLocale } from '@/lib/api';
import { fetchSetting } from '@/i18n/server';
import { ContactInfoCard, type ContactInfo } from '@/components/sections/ContactInfoCard';
import { SocialShareCard } from '@/components/sections/SocialShareCard';
import { ReviewsSection } from '@/components/sections/ReviewsSection';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getCustomPagesWithLocale('de', {
    module_key: 'news',
    is_published: 1,
    limit: 200,
  });
  return (articles as any[] ?? []).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getCustomPageBySlugWithLocale(slug, locale);
  if (!article) return { title: 'Nachricht' };
  return {
    title: (article as any).meta_title ?? (article as any).title,
    description: (article as any).meta_description ?? (article as any).summary ?? undefined,
    openGraph: article.featured_image
      ? { images: [{ url: article.featured_image }] }
      : undefined,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, tCommon, tReviews] = await Promise.all([
    getTranslations('news'),
    getTranslations('common'),
    getTranslations('reviews'),
  ]);

  const article = await getCustomPageBySlugWithLocale(slug, locale);

  if (!article) {
    return (
      <main>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-lg mb-6">{t('noResults')}</p>
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              <ArrowLeft size={16} />
              {t('backToNews')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const htmlContent = parseCustomPageContent(article.content);

  const date = new Date(article.created_at).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const tags = article.tags
    ? (article.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
    : [];

  // Related articles (same category, excluding current)
  const relatedRaw = await getCustomPagesWithLocale(locale, {
    module_key: 'news',
    is_published: 1,
    category_id: article.category_id ?? undefined,
    sort: 'created_at',
    order: 'desc',
    limit: 4,
  });

  const related: CustomPage[] = (relatedRaw as any[] ?? [])
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  // Contact info
  const contactInfoRaw = await fetchSetting('contact_info', locale, { revalidate: 3600 });
  const contactInfo: any = contactInfoRaw?.value || {};

  return (
    <main>
      {/* Article header */}
      <div className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {tCommon('home')}
            </Link>
            <ChevronRight size={14} />
            <Link href={`/${locale}/news`} className="hover:text-white transition-colors">
              {t('title')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white line-clamp-1">{article.title}</span>
          </nav>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
            {article.category_name && (
              <span className="uppercase font-semibold tracking-wide text-blue-400">
                {article.category_name}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {date}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            {article.title}
          </h1>

          {article.summary && (
            <p className="mt-4 text-lg text-slate-300 leading-relaxed max-w-3xl">
              {article.summary}
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
              {article.featured_image && (
                <div className="mb-10 rounded-2xl overflow-hidden">
                  <img
                    src={article.featured_image}
                    alt={article.featured_image_alt ?? article.title}
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
                    {tags.map((tag: string) => (
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
                  href={`/${locale}/news`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
                >
                  <ArrowLeft size={16} />
                  {t('backToNews')}
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
                path={`/${locale}/news/${article.slug}`}
                title={article.title}
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

      {/* Related articles */}
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
                    href={`/${locale}/news/${rel.slug}`}
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
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-slate-300 text-4xl font-display font-bold">N</span>
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
        targetId={article.id}
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
