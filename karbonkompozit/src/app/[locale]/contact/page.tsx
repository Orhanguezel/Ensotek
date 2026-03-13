import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { InfoListPanel } from '@/components/patterns/InfoListPanel';
import { ContactFormClient } from '@/components/sections/ContactForm';
import { GoogleMap } from '@/components/widgets/GoogleMap';
import { fetchSetting } from '@/i18n/server';
import { JsonLd, buildPageMetadata, jsonld, localizedUrl, organizationJsonLd } from '@/seo';

async function fetchContactInfo(locale: string) {
  try {
    return await fetchSetting('contact_info', locale, { revalidate: 3600 });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return buildPageMetadata({
    locale,
    pathname: '/contact',
    title: locale.startsWith('en')
      ? `${t('title')} - Technical Contact for Sampling and Quotes`
      : `${t('title')} - Numune ve Teklif Icin Teknik Iletisim`,
    description: t('description'),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const contactSetting = await fetchContactInfo(locale);

  const info = contactSetting?.value
    ? typeof contactSetting.value === 'string'
      ? JSON.parse(contactSetting.value)
      : contactSetting.value
    : {};

  const companyName = info.company_name || 'MOE Kompozit';
  const address = info.address || '';
  const phone = info.phone || '';
  const email = info.email || 'info@karbonkompozit.com.tr';
  const hours = info.hours || 'Pazartesi - Cuma, 09:00 - 18:00';
  const responseItems = Object.values(t.raw('contact.response.items') as Record<string, string>);

  return (
    <div className="section-py">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <JsonLd
          data={jsonld.graph([
            jsonld.org(
              organizationJsonLd(locale, {
                description: t('contact.description'),
                email,
                telephone: phone,
                address,
              }),
            ),
            jsonld.localBusiness({
              name: companyName,
              url: localizedUrl(locale, '/contact'),
              description: t('contact.description'),
              email,
              telephone: phone,
              address,
              openingHours: hours,
            }),
          ])}
        />
        <ContentPageHeader
          title={t('contact.title')}
          description={t('contact.description')}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <ContactFormClient locale={locale} />

          <div className="space-y-6">
            <section className="surface-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold">{t('contact.info.title')}</h2>
              <div className="mt-5 space-y-4 text-sm text-[var(--color-text-secondary)]">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {t('contact.info.address')}
                  </p>
                  <p>{companyName}</p>
                  {address && <p>{address}</p>}
                </div>
                {phone && (
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {t('contact.info.phone')}
                    </p>
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="hover:text-[var(--color-brand)]"
                    >
                      {phone}
                    </a>
                  </div>
                )}
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {t('contact.info.email')}
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-[var(--color-brand)]"
                  >
                    {email}
                  </a>
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {t('contact.info.hours')}
                  </p>
                  <p>{hours}</p>
                </div>
              </div>
            </section>

            <InfoListPanel
              title={t('contact.response.title')}
              items={responseItems}
            />

            <div className="surface-card overflow-hidden rounded-2xl p-2">
              <GoogleMap className="h-64 w-full overflow-hidden rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
