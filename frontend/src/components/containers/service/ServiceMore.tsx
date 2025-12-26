// =============================================================
// FILE: src/components/containers/service/ServiceMore.tsx
// "More services" section for Service Detail
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';

import { useListServicesPublicQuery, useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';
import type { ServiceDto } from '@/integrations/types/services.types';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';
import { localizePath } from '@/i18n/url';

import { normLocaleTag } from '@/i18n/localeUtils';
import { SkeletonLine, SkeletonStack } from '@/components/ui/skeleton';

import { FiArrowRight } from 'react-icons/fi';

const FALLBACK_IMG = '/img/project/project-thumb.jpg';

const toLocaleShort = (l: unknown) =>
  String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'de';

interface ServiceMoreProps {
  currentSlug?: string;
}

const ServiceMore: React.FC<ServiceMoreProps> = ({ currentSlug }) => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_services', locale);

  // ✅ default_locale DB’den
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: 'default_locale' });
  const defaultLocale = useMemo(() => {
    const v = normLocaleTag(defaultLocaleRow?.value);
    return v || 'de';
  }, [defaultLocaleRow?.value]);

  const { data, isLoading } = useListServicesPublicQuery({
    limit: 6,
    order: 'display_order.asc,created_at.desc',
    locale,
    default_locale: defaultLocale,
  });

  const items: ServiceDto[] = useMemo(() => {
    const raw: ServiceDto[] = (data?.items ?? []) as any;

    const filtered = raw.filter((s) => {
      const sSlug = String((s as any)?.slug || '').trim();
      if (!sSlug) return true;
      if (!currentSlug) return true;
      return sSlug !== currentSlug;
    });

    return filtered.slice(0, 3);
  }, [data?.items, currentSlug]);

  if (!items.length && !isLoading) {
    return null;
  }

  return (
    <div className="service__area pt-60 pb-90 service__bg-2">
      <div className="container">
        <div className="row tik">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-50">
              <span className="section__subtitle">
                {ui('ui_services_more_subtitle', 'Discover our other services')}
              </span>
              <h2 className="section__title">
                {ui('ui_services_more_title', 'You may also be interested in')}
              </h2>
            </div>
          </div>
        </div>

        <div className="row tik">
          {items.map((s: any) => {
            const imgBase =
              (s.featured_image_url || s.image_url || s.featured_image || '')?.trim() || '';
            const src =
              (imgBase && (toCdnSrc(imgBase, 640, 420, 'fill') || imgBase)) || FALLBACK_IMG;

            const title = s.name || ui('ui_services_placeholder_title', 'Our service');

            const summaryRaw = s.description || s.includes || '';
            const summary = summaryRaw
              ? excerpt(String(summaryRaw), 140)
              : ui('ui_services_placeholder_summary', 'Service description is coming soon.');

            const href = s.slug
              ? localizePath(locale, `/service/${encodeURIComponent(s.slug)}`)
              : localizePath(locale, '/service');

            return (
              <div className="col-xl-4 col-lg-6 col-md-6" key={String(s.id)}>
                <div className="service__item mb-30">
                  <div
                    className="service__thumb include__bg service-two-cmn"
                    style={{
                      backgroundImage: `url('${src}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    aria-hidden="true"
                  />
                  <div className="service__content">
                    <h3>
                      <Link href={href}>{title}</Link>
                    </h3>
                    <p>{summary}</p>
                  </div>
                  <div className="service__link">
                    <Link
                      href={href}
                      aria-label={`${title} — ${ui(
                        'ui_services_details_aria',
                        'view service details',
                      )}`}
                    >
                      <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading ? (
            <div className="col-12 mt-10" aria-hidden>
              <SkeletonStack>
                <SkeletonLine style={{ height: 8 }} />
              </SkeletonStack>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ServiceMore;
