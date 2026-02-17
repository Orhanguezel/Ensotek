import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/layout/Layout';
import Banner from '@/components/layout/banner/Banner';
import FaqsPageContent from '@/components/containers/faqs/FaqsPageContent';

export const metadata: Metadata = {
  title: 'FAQs | Ensotek',
};

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
