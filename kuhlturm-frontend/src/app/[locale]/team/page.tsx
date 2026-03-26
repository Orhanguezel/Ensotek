import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { fetchCustomPagesByModuleKey } from '@/i18n/server';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Unser Team',
    description: 'Lernen Sie das erfahrene Team hinter Kühlturm kennen.',
  };
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tCommon] = await Promise.all([
    getTranslations('team'),
    getTranslations('common'),
  ]);

  const members = await fetchCustomPagesByModuleKey('team', locale, 50);

  return (
    <main>
      <PageBanner
        locale={locale}
        breadcrumbs={[{ label: t('title') }]}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
      />

      {/* Team grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {members.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">{t('noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => {
                const photo = member.featured_image ?? member.image_url;
                return (
                  <Link
                    key={member.id}
                    href={`/${locale}/team/${member.slug}`}
                    className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-xl transition-all"
                  >
                    {/* Photo */}
                    <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                      {photo ? (
                        <Image
                          src={resolveMediaUrl(photo)}
                          alt={member.featured_image_alt ?? member.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-slate-300 text-5xl font-display font-bold">
                            {member.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h2 className="font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg leading-snug">
                        {member.title}
                      </h2>
                      {member.summary && (
                        <p className="mt-1.5 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          {member.summary}
                        </p>
                      )}
                      <span className="mt-3 inline-block text-xs font-semibold text-blue-600 group-hover:underline">
                        {tCommon('readMore')} →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-(--section-py) bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-slate-300 text-lg mb-8">{t('ctaSubtitle')}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('contactCta')}
          </Link>
        </div>
      </section>
    </main>
  );
}
