import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { HelpCircle, Mail } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { getFaqs } from '@ensotek/core/services';
import type { Faq } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'FAQ – Häufig gestellte Fragen',
    description:
      'Antworten auf häufig gestellte Fragen zu Kühltürmen, Kühltechnik und unseren Dienstleistungen.',
  };
}

export default async function FaqsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('faqs');

  const faqs: Faq[] = await getFaqs(API_BASE_URL, {
    language: locale,
    is_active: true,
  }).catch(() => []);

  return (
    <main>
      <PageBanner
        locale={locale}
        breadcrumbs={[{ label: t('title') }]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* FAQ accordion */}
      <section className="py-(--section-py) bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.length === 0 ? (
            <p className="text-center py-24 text-slate-400 text-lg">{t('noResults')}</p>
          ) : (
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {faqs.map((faq, i) => (
                <details
                  key={faq.id}
                  className="group py-5"
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <span className="font-semibold text-slate-900 text-base md:text-lg group-open:text-blue-600 transition-colors">
                      {faq.question}
                    </span>
                    <span className="text-xl font-light text-slate-400 group-open:rotate-45 transition-transform shrink-0 leading-none mt-0.5 select-none">
                      +
                    </span>
                  </summary>
                  <div
                    className="mt-4 text-slate-600 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </details>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-(--section-py) bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            {t('ctaTitle')}
          </h2>
          <p className="text-slate-500 mb-8">{t('ctaSubtitle')}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail size={16} />
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
}
