// =============================================================
// FILE: src/components/containers/service/Service.tsx
// Public Services List
// =============================================================
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';

// RTK – public services
import { useListServicesPublicQuery, useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

// Ortak yardımcılar
import { excerpt } from '@/shared/text';
import { toCdnSrc } from '@/shared/media';

// UI / i18n – site_settings üzerinden
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

import { localizePath } from '@/i18n/url';
import { normLocaleTag } from '@/i18n/localeUtils';

import { SkeletonLine, SkeletonStack } from '@/components/ui/skeleton';

// Icons
import {
  FiTool,
  FiLayers,
  FiPackage,
  FiRefreshCcw,
  FiSettings,
  FiTarget,
  FiUserPlus,
  FiFileText,
  FiShoppingCart,
  FiArrowRight,
} from 'react-icons/fi';
import { MdAdsClick } from 'react-icons/md';
import { GiFactory } from 'react-icons/gi';

const FALLBACK_IMG = '/img/project/project-thumb.jpg';

const toLocaleShort = (l: unknown) =>
  String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'de';

function ServiceIcon({ label, size = 40 }: { label: string; size?: number }) {
  const t = (label || '').toLowerCase();
  if (/\bppc|\bads?|\breklam|\badvert/i.test(t)) return <MdAdsClick size={size} />;
  if (/performans|content|içerik|contenido/i.test(t)) return <FiFileText size={size} />;
  if (/lead|müşteri|cliente|prospect/i.test(t)) return <FiUserPlus size={size} />;
  if (/strateji|planlam|strategy|estrateg/i.test(t)) return <FiTarget size={size} />;
  if (/ürün|product|producto|danışman/i.test(t)) return <FiShoppingCart size={size} />;
  if (/mühendis|engineer|soporte|support/i.test(t)) return <FiTool size={size} />;
  if (/uygulama|referans|aplicac|reference/i.test(t)) return <FiLayers size={size} />;
  if (/parça|parca|repuesto|component|komponent/i.test(t)) return <FiPackage size={size} />;
  if (/modern|upgrade|moderniz/i.test(t)) return <FiRefreshCcw size={size} />;
  if (/bakım|onarım|mantenimiento|repar|maintenance|repair/i.test(t))
    return <FiSettings size={size} />;
  if (/üretim|uretim|producción|production|manufact/i.test(t)) return <GiFactory size={size} />;
  return <FiLayers size={size} />;
}

const Service: React.FC = () => {
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
    locale,
    default_locale: defaultLocale,
    limit: 6,
    order: 'display_order.asc',
  });

  const cards = useMemo(() => {
    const items = Array.isArray(data?.items) ? data!.items : [];

    const arr = items.map((s: any) => {
      const imgBase = (s.featured_image_url || s.image_url || s.featured_image || '').trim();

      const title = (s.name as string | null) ?? ui('ui_services_placeholder_title', 'Our service');

      const rawSummary = (s.description as string | null) ?? (s.includes as string | null) ?? null;

      const summary = rawSummary?.trim().length
        ? excerpt(String(rawSummary), 150)
        : ui('ui_services_placeholder_summary', 'Service description is coming soon.');

      return {
        id: String(s.id ?? ''),
        title,
        summary,
        slug: String(s.slug || '').trim(),
        src: toCdnSrc(imgBase, 640, 420, 'fill') || FALLBACK_IMG,
      };
    });

    if (!arr.length) {
      return new Array(3).fill(0).map((_, i) => ({
        id: `ph-${i + 1}`,
        title: ui('ui_services_placeholder_title', 'Our service'),
        summary: ui('ui_services_placeholder_summary', 'Service description is coming soon.'),
        slug: '',
        src: FALLBACK_IMG,
      }));
    }

    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.items, ui]);

  return (
    <div className="service__area service__bg z-index-1 pt-120 pb-90">
      <div className="container">
        {/* Başlık */}
        <div className="row tik">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-65">
              <span className="section__subtitle">
                <span>{ui('ui_services_subprefix', 'Ensotek')}</span>{' '}
                {ui('ui_services_sublabel', 'Services')}
              </span>
              <h2 className="section__title">
                {ui('ui_services_title', 'What we do')}
                <span className="down__mark-middle"></span>
              </h2>
            </div>
          </div>
        </div>

        {/* Kartlar */}
        <div className="row tik" data-aos="fade-left" data-aos-delay="300">
          {cards.map((it) => {
            const href = it.slug
              ? localizePath(locale, `/service/${encodeURIComponent(it.slug)}`)
              : localizePath(locale, '/service');

            return (
              <div className="col-xl-4 col-lg-6 col-md-6" key={it.id}>
                <div className="service__item mb-30">
                  <div
                    className="service__thumb include__bg service-two-cmn"
                    style={{
                      backgroundImage: `url('${it.src}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    aria-hidden="true"
                  />
                  <div className="service__icon transition-3" aria-hidden="true">
                    <ServiceIcon label={it.title} />
                  </div>

                  <div className="service__content">
                    <h3>
                      <Link href={href}>{it.title}</Link>
                    </h3>
                    <p>{it.summary}</p>
                  </div>

                  <div className="service__link">
                    <Link
                      href={href}
                      aria-label={`${it.title} — ${ui(
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

          {isLoading && (
            <div className="col-12 mt-10" aria-hidden>
              <SkeletonStack>
                <SkeletonLine style={{ height: 8 }} />
              </SkeletonStack>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Service;
