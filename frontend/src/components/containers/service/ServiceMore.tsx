// =============================================================
// FILE: src/components/containers/service/ServiceMore.tsx
// "More services" section for Service Detail
// Fixes:
// - ❌ toLocaleShort removed
// - ✅ locale source: useLocaleShort()
// - ✅ no default_locale dependency (backend fallback assumed)
// - ✅ no inline styles (uses next/image instead of backgroundImage)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useListServicesPublicQuery } from '@/integrations/rtk/hooks';
import type { ServiceDto } from '@/integrations/types';

import { useUiSection } from '@/i18n/uiDb';
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { localizePath } from '@/i18n/url';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

import { SkeletonLine, SkeletonStack } from '@/components/ui/skeleton';
import { FiArrowRight } from 'react-icons/fi';

const FALLBACK_IMG = '/img/project/project-thumb.jpg';

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function cryptoRandomId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {}
  return `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export interface ServiceMoreProps {
  currentSlug?: string;
}

const ServiceMore: React.FC<ServiceMoreProps> = ({ currentSlug }) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_services', locale as any);

  const { data, isLoading } = useListServicesPublicQuery({
    limit: 6,
    order: 'display_order.asc,created_at.desc',
    locale,
  } as any);

  const items = useMemo<ServiceDto[]>(() => {
    const raw: ServiceDto[] = ((data as any)?.items ?? []) as any;

    const curr = safeStr(currentSlug);
    const filtered = raw.filter((s: any) => {
      const sSlug = safeStr(s?.slug);
      if (!sSlug) return true;
      if (!curr) return true;
      return sSlug !== curr;
    });

    return filtered.slice(0, 3);
  }, [data, currentSlug]);

  if (!items.length && !isLoading) return null;

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
          {items.map((s: any, idx: number) => {
            const id = safeStr(s?.id) || safeStr(s?.slug) || `more-${idx}-${cryptoRandomId()}`;

            const imgBase =
              safeStr(s?.featured_image_url) || safeStr(s?.image_url) || safeStr(s?.featured_image);

            const src =
              (imgBase && (toCdnSrc(imgBase, 640, 420, 'fill') || imgBase)) || FALLBACK_IMG;

            const title = safeStr(s?.name) || ui('ui_services_placeholder_title', 'Our service');

            const summaryRaw = safeStr(s?.description) || safeStr(s?.includes);
            const summary = summaryRaw
              ? excerpt(summaryRaw, 140)
              : ui('ui_services_placeholder_summary', 'Service description is coming soon.');

            const href = safeStr(s?.slug)
              ? localizePath(locale, `/service/${encodeURIComponent(safeStr(s.slug))}`)
              : localizePath(locale, '/service');

            return (
              <div className="col-xl-4 col-lg-6 col-md-6" key={id}>
                <div className="service__item mb-30">
                  {/* NO inline style: use Image */}
                  <div className="service__thumb include__bg service-two-cmn" aria-hidden="true">
                    <Image src={src} alt="" width={640} height={420} loading="lazy" />
                  </div>

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
