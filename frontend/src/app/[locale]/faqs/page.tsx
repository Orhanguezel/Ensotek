import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Layout from '@/components/layout/Layout';
import Banner from '@/components/layout/banner/Banner';
import FaqsPageContent from '@/components/containers/faqs/FaqsPageContent';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return { title: t('faqs_title'), description: t('faqs_description') };
}

export default async function FaqsRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const titleByLocale: Record<string, string> = {
    tr: 'Sık Sorulan Sorular',
    en: 'Frequently Asked Questions',
    de: 'Haufig gestellte Fragen',
  };
  const title = titleByLocale[locale] || 'FAQs';

  return (
    <Layout header={1} footer={1}>
      <Banner title={title || 'FAQs'} />
      <FaqsPageContent />
    </Layout>
  );
}
