// src/components/containers/library/LibraryMore.tsx
'use client';

import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useListLibraryQuery } from '@/integrations/rtk/hooks';
import { toCdnSrc } from '@/shared/media';
import { stripHtml, excerpt } from '@/shared/text';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

// Carousel (shadcn / embla)
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// BG pattern
import WorkflowBg from 'public/img/shape/work-flow.png';

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

interface LibraryMoreProps {
  currentId?: string;
}

type MoreItemVM = {
  id: string;
  title: string;
  summary: string;
  hero: string;
  href: string;
};

const LibraryMore: React.FC<LibraryMoreProps> = ({ currentId }) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_library', locale as any);

  const t = useCallback(
    (key: string, fallbackEn: string) => {
      const v = safeStr(ui(key, fallbackEn));
      return v || fallbackEn;
    },
    [ui],
  );

  const { data = [], isLoading } = useListLibraryQuery({
    locale,
    limit: 12,
    is_published: '1',
    is_active: '1',
    order: 'display_order.desc',
    sort: 'published_at',
    orderDir: 'desc',
  } as any);

  const items: MoreItemVM[] = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr
      .filter((it: any) => !currentId || safeStr(it?.id) !== safeStr(currentId))
      .map((it: any) => {
        const title =
          safeStr(it?.title) || safeStr(it?.slug) || t('ui_library_untitled', 'Untitled content');

        const sumRaw = safeStr(it?.summary) || safeStr(it?.content) || '';
        const summary = excerpt(stripHtml(sumRaw), 160) || '—';

        const img = Array.isArray(it?.images) && it.images.length ? it.images[0] : null;
        const imgSrc =
          safeStr(img?.webp) ||
          safeStr(img?.url) ||
          safeStr(img?.thumbnail) ||
          safeStr(img?.asset?.url);

        const hero = imgSrc ? toCdnSrc(imgSrc, 480, 320, 'fill') || imgSrc : '';

        const href = safeStr(it?.slug)
          ? localizePath(locale, `/library/${encodeURIComponent(safeStr(it.slug))}`)
          : localizePath(locale, '/library');

        return {
          id: safeStr(it?.id) || safeStr(it?._id) || title,
          title,
          summary,
          hero,
          href,
        };
      });
  }, [data, locale, t, currentId]);

  if (!isLoading && items.length === 0) return null;

  const autoplay = Autoplay({
    delay: 4500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  return (
    <section className="blog__area library-more-section pt-70 pb-100">
      <div className="library-more-pattern">
        <Image src={WorkflowBg} alt="pattern" loading="lazy" sizes="400px" />
      </div>

      <div className="container library-more-inner">
        <div className="row justify-content-center mb-40">
          <div className="col-xl-8 col-lg-9 text-center">
            <div className="section__title-wrapper mb-10">
              <span className="section__subtitle">
                <span>{t('ui_library_more_subprefix', 'Ensotek')}</span>{' '}
                {t('ui_library_more_sublabel', 'Knowledge Hub')}
              </span>
              <h2 className="section__title">{t('ui_library_more_title', 'More documents')}</h2>
            </div>
          </div>
        </div>

        {isLoading && items.length === 0 && (
          <div className="row">
            <div className="col-12">
              <div className="skeleton-line ens-skel--h12" />
              <div className="skeleton-line ens-skel--h12 mt-2" />
            </div>
          </div>
        )}

        {items.length > 0 && (
          <Carousel opts={{ loop: true }} plugins={[autoplay]} className="library-more-carousel">
            <CarouselContent>
              {items.map((it) => (
                <CarouselItem key={it.id} className="library-more-item">
                  <div className="library-more-card blog__item blog__item-3 mb-30">
                    {it.hero ? (
                      <div className="blog__thumb w-img mb-20">
                        <Link href={it.href}>
                          <Image
                            src={it.hero as any}
                            alt={it.title}
                            width={480}
                            height={320}
                            sizes="(max-width: 992px) 100vw, 33vw"
                            className="ens-media--fluid"
                            loading="lazy"
                          />
                        </Link>
                      </div>
                    ) : null}

                    <div className="blog__content-3">
                      <h3 className="blog__title-3">
                        <Link href={it.href}>{it.title}</Link>
                      </h3>

                      <p className="library-more-summary">{it.summary}</p>

                      <div className="blog__btn-3 mt-15">
                        <Link
                          href={it.href}
                          className="link-more"
                          aria-label={`${it.title} – ${t(
                            'ui_library_view_detail_aria',
                            'view details',
                          )}`}
                        >
                          {t('ui_library_view_detail', 'View details')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="library-more-nav library-more-prev" />
            <CarouselNext className="library-more-nav library-more-next" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default LibraryMore;
