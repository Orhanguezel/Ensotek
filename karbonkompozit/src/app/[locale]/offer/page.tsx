import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { InfoListPanel } from '@/components/patterns/InfoListPanel';
import { OfferFormClient } from '@/components/sections/OfferForm';
import { buildPageMetadata } from '@/seo';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { product } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'offer' });
  return buildPageMetadata({
    locale,
    pathname: '/offer',
    title: locale.startsWith('en')
      ? `${t('title')} - Composite Quote, Feasibility and Lead Time`
      : `${t('title')} - Kompozit Teklif, Uygunluk ve Termin`,
    description: t('description'),
    noIndex: Boolean(product),
  });
}

export default async function OfferPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale } = await params;
  const { product } = await searchParams;
  const t = await getTranslations({ locale });
  const benefitItems = Object.values(t.raw('offer.benefits.items') as Record<string, string>);

  return (
    <div className="section-py">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <ContentPageHeader
          title={t('offer.title')}
          description={t('offer.description')}
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <OfferFormClient locale={locale} preselectedProduct={product} />
          <aside>
            <InfoListPanel
              title={t('offer.benefits.title')}
              items={benefitItems}
              accentText={t('common.freeOfObligation')}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
