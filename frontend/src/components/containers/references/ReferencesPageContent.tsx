// =============================================================
// FILE: src/components/containers/references/ReferencesPageContent.tsx
// Ensotek – Full References Page Content (UI IMPROVED + PAGINATION RESTORED)
//   - ✅ “Önce tamamı gelsin” modu: total uygunsa tek request ile tüm kayıtlar
//   - ✅ Category + SubCategory filtre UI (tabs) – daha iyi spacing + hit-area
//   - ✅ Backend filtrelemezse bile client-side filtre (garanti)
//   - ✅ Total çok büyükse server-side pagination fallback
//   - ✅ Grid spacing + card styling iyileştirildi
//   - ✅ Pagination geri eklendi:
//       - canFetchAll=true  => client-side pagination (slice)
//       - canFetchAll=false => server-side pagination (limit/offset)
// =============================================================
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { toCdnSrc } from '@/shared/media';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// RTK hooks
import {
  useListReferencesQuery,
  useListCategoriesQuery,
  useListSubCategoriesQuery,
} from '@/integrations/rtk/hooks';

import type { ReferenceDto } from '@/integrations/types/references.types';
import type { CategoryDto } from '@/integrations/types/category.types';
import type { SubCategoryDto } from '@/integrations/types/subcategory.types';

// Pagination UI
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

// Fallback image
import One from 'public/img/brand/1.png';

const CARD_W = 220;
const CARD_H = 100;

const PAGE_SIZE = 24;
const MAX_ALL_LIMIT = 5000;

const altFromSlug = (slug?: string | null) => (slug || 'reference').replace(/[-_]+/g, ' ').trim();

const toLocaleShort = (l: any) =>
  String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'de';

type OptionTab = { id: string; label: string };

const ReferencesPageContent: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_references', locale);

  const sectionSubtitlePrefix = ui('ui_references_subprefix', 'Ensotek');
  const sectionSubtitleLabel = ui(
    'ui_references_sublabel',
    locale === 'de' ? 'Referanslarımız' : 'References',
  );
  const sectionTitle = ui(
    'ui_references_page_title',
    locale === 'de' ? 'Referanslarımız' : 'Our References',
  );
  const sectionIntro = ui(
    'ui_references_page_intro',
    locale === 'de'
      ? 'Yurt içi ve yurt dışında tamamladığımız projelerden seçili referanslarımız.'
      : 'Selected references from our completed projects in Turkey and abroad.',
  );

  // -------------------- FILTER STATE --------------------
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<string>('all');
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setActiveSubCategoryId('all');
    setPage(1);
  }, [activeCategoryId]);

  useEffect(() => {
    setPage(1);
  }, [activeSubCategoryId]);

  // -------------------- DATA: CATEGORIES --------------------
  const { data: categoriesRaw, isLoading: isCategoriesLoading } = useListCategoriesQuery({
    locale,
    module_key: 'references',
    is_active: 1,
    sort: 'display_order',
    orderDir: 'asc',
  } as any);

  const categories: CategoryDto[] = useMemo(
    () => (Array.isArray(categoriesRaw) ? categoriesRaw : []),
    [categoriesRaw],
  );

  const categoryTabs: OptionTab[] = useMemo(() => {
    const tabs: OptionTab[] = [
      { id: 'all', label: ui('ui_references_tab_all', locale === 'de' ? 'Tümü' : 'All') },
    ];

    for (const c of categories) {
      const label =
        String((c as any)?.title || (c as any)?.name || (c as any)?.label || '').trim() ||
        (locale === 'de' ? 'Kategori' : 'Category');

      tabs.push({ id: (c as any).id, label });
    }
    return tabs;
  }, [categories, ui, locale]);

  // -------------------- DATA: SUBCATEGORIES --------------------
  const shouldFetchSubs = activeCategoryId !== 'all';

  const { data: subCatsRaw, isLoading: isSubCatsLoading } = useListSubCategoriesQuery(
    shouldFetchSubs
      ? ({
          category_id: activeCategoryId,
          locale,
          is_active: 1,
          sort: 'display_order',
          orderDir: 'asc',
        } as any)
      : (undefined as any),
    { skip: !shouldFetchSubs } as any,
  );

  const subCategories: SubCategoryDto[] = useMemo(
    () => (Array.isArray(subCatsRaw) ? subCatsRaw : []),
    [subCatsRaw],
  );

  const subCategoryTabs: OptionTab[] = useMemo(() => {
    if (!shouldFetchSubs) return [];
    const tabs: OptionTab[] = [
      { id: 'all', label: ui('ui_references_subtab_all', locale === 'de' ? 'Tümü' : 'All') },
    ];

    for (const s of subCategories) {
      const label =
        String((s as any)?.title || (s as any)?.name || (s as any)?.label || '').trim() ||
        (locale === 'de' ? 'Alt Kategori' : 'Subcategory');

      tabs.push({ id: (s as any).id, label });
    }
    return tabs;
  }, [subCategories, shouldFetchSubs, ui, locale]);

  // -------------------- REFERENCES QUERY STRATEGY --------------------
  const baseFilterArgs = useMemo(() => {
    return {
      is_published: 1,
      sort: 'display_order',
      orderDir: 'asc',
      locale,
      category_id: activeCategoryId !== 'all' ? activeCategoryId : undefined,
      sub_category_id: activeSubCategoryId !== 'all' ? activeSubCategoryId : undefined,
    };
  }, [activeCategoryId, activeSubCategoryId, locale]);

  // total probe (limit=1)
  const {
    data: probeRes,
    isLoading: isProbeLoading,
    isFetching: isProbeFetching,
  } = useListReferencesQuery({
    ...baseFilterArgs,
    limit: 1,
    offset: 0,
  } as any);

  const totalFromServer = Number(probeRes?.total ?? 0) || 0;
  const canFetchAll = totalFromServer > 0 && totalFromServer <= MAX_ALL_LIMIT;

  // fetch all (single request)
  const {
    data: allRes,
    isLoading: isAllLoading,
    isFetching: isAllFetching,
  } = useListReferencesQuery(
    canFetchAll
      ? ({
          ...baseFilterArgs,
          limit: totalFromServer,
          offset: 0,
        } as any)
      : (undefined as any),
    { skip: !canFetchAll } as any,
  );

  // server pagination fallback
  const serverOffset = useMemo(() => (page - 1) * PAGE_SIZE, [page]);

  const {
    data: pagedRes,
    isLoading: isPagedLoading,
    isFetching: isPagedFetching,
  } = useListReferencesQuery(
    !canFetchAll
      ? ({
          ...baseFilterArgs,
          limit: PAGE_SIZE,
          offset: serverOffset,
        } as any)
      : (undefined as any),
    { skip: canFetchAll } as any,
  );

  const activeRes = canFetchAll ? allRes : pagedRes;

  // -------------------- ITEMS (GUARANTEED CLIENT FILTER) --------------------
  // Not: canFetchAll=true iken burada "tüm liste" var. false iken "o sayfanın listesi" var.
  const filteredItems: ReferenceDto[] = useMemo(() => {
    const list: ReferenceDto[] = (activeRes?.items ?? []) as any;

    const published = list.filter((r) => Number((r as any).is_published) === 1);

    const byCat =
      activeCategoryId === 'all'
        ? published
        : published.filter((r) => String((r as any).category_id || '') === activeCategoryId);

    const bySub =
      activeSubCategoryId === 'all'
        ? byCat
        : byCat.filter((r) => String((r as any).sub_category_id || '') === activeSubCategoryId);

    return bySub;
  }, [activeRes, activeCategoryId, activeSubCategoryId]);

  // -------------------- PAGINATION MODEL (CLIENT OR SERVER) --------------------
  // - canFetchAll=true  => client pagination: filteredItems üzerinden slice
  // - canFetchAll=false => server pagination: filteredItems zaten sayfa datası (PAGE_SIZE), total server'dan
  const totalItems = useMemo(() => {
    if (canFetchAll) return filteredItems.length;
    return Number(activeRes?.total ?? totalFromServer ?? 0) || 0;
  }, [canFetchAll, filteredItems.length, activeRes?.total, totalFromServer]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  }, [totalItems]);

  const safePage = Math.min(page, pageCount);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  const pagedItems: ReferenceDto[] = useMemo(() => {
    if (!canFetchAll) {
      // server mode: zaten o sayfanın items'ı geliyor
      return filteredItems;
    }
    // client mode: slice
    const start = (safePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredItems.slice(start, end);
  }, [canFetchAll, filteredItems, safePage]);

  const paginationNumbers = useMemo(() => {
    const pages: (number | 'ellipsis-left' | 'ellipsis-right')[] = [];

    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) pages.push(i);
      return pages;
    }

    const showLeftEllipsis = safePage > 4;
    const showRightEllipsis = safePage < pageCount - 3;

    pages.push(1);
    if (showLeftEllipsis) pages.push('ellipsis-left');

    const startPage = Math.max(2, safePage - 1);
    const endPage = Math.min(pageCount - 1, safePage + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    if (showRightEllipsis) pages.push('ellipsis-right');
    pages.push(pageCount);

    return pages;
  }, [safePage, pageCount]);

  const isBusy =
    isCategoriesLoading ||
    isSubCatsLoading ||
    isProbeLoading ||
    isProbeFetching ||
    isAllLoading ||
    isAllFetching ||
    isPagedLoading ||
    isPagedFetching;

  const showPagination = pageCount > 1;

  // -------------------- RENDER --------------------
  return (
    <section className="brand__area grey-bg pt-120 pb-80">
      <div className="container">
        {/* Heading */}
        <div className="row justify-content-center mb-40">
          <div className="col-xl-8 col-lg-9">
            <div className="section__title-wrapper text-center">
              <span className="section__subtitle-2">
                <span>{sectionSubtitlePrefix}</span> {sectionSubtitleLabel}
              </span>
              <h2 className="section__title-2">{sectionTitle}</h2>
              {sectionIntro && <p className="references__intro">{sectionIntro}</p>}
            </div>
          </div>
        </div>

        {/* Filters block */}
        {(categoryTabs.length > 1 || subCategoryTabs.length > 1) && (
          <div className="references__filters">
            {/* Category Tabs */}
            {categoryTabs.length > 1 && (
              <div className="references__tabs">
                {categoryTabs.map((tab) => {
                  const isActive = activeCategoryId === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={'references__tab' + (isActive ? ' is-active' : '')}
                      onClick={() => setActiveCategoryId(tab.id)}
                      disabled={isBusy}
                    >
                      <span className="references__tabInner">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* SubCategory Tabs */}
            {subCategoryTabs.length > 1 && (
              <div className="references__tabs references__tabs--sub">
                {subCategoryTabs.map((tab) => {
                  const isActive = activeSubCategoryId === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={
                        'references__tab references__tab--sub' + (isActive ? ' is-active' : '')
                      }
                      onClick={() => setActiveSubCategoryId(tab.id)}
                      disabled={isBusy}
                    >
                      <span className="references__tabInner">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {isBusy && (
          <div className="row mb-24">
            <div className="col-12">
              <div className="references__loadingLine" aria-hidden />
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="references__gridWrap" data-aos="fade-up" data-aos-delay="200">
          {totalItems === 0 && !isBusy && (
            <div className="references__empty">
              {ui(
                'ui_references_empty',
                locale === 'de'
                  ? 'Şu anda görüntülenecek referans bulunmamaktadır.'
                  : 'There are no references to display at the moment.',
              )}
            </div>
          )}

          <div className="references__grid">
            {pagedItems.map((ref, idx) => {
              const imgRaw =
                (ref as any).featured_image_url_resolved ||
                (ref as any).featured_asset?.url ||
                (ref as any).featured_image ||
                null;

              const imgSrc =
                (imgRaw && (toCdnSrc(imgRaw, CARD_W, CARD_H, 'fit') || imgRaw)) || (One as any);

              const name = String((ref as any).title ?? '').trim() || '—';
              const alt = (ref as any).featured_image_alt || name || altFromSlug((ref as any).slug);

              const website = String((ref as any).website_url ?? '').trim();

              return (
                <div className="references__cell" key={(ref as any).id}>
                  {website ? (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="references__cardLink"
                    >
                      <div className="references__card">
                        <div className="references__media">
                          <Image
                            src={imgSrc as any}
                            alt={alt}
                            width={CARD_W}
                            height={CARD_H}
                            loading={idx < 6 ? 'eager' : 'lazy'}
                            decoding="async"
                            draggable={false}
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                        <div className="references__title">{name}</div>
                      </div>
                    </a>
                  ) : (
                    <div className="references__card" role="group" aria-label={name}>
                      <div className="references__media">
                        <Image
                          src={imgSrc as any}
                          alt={alt}
                          width={CARD_W}
                          height={CARD_H}
                          loading={idx < 6 ? 'eager' : 'lazy'}
                          decoding="async"
                          draggable={false}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <div className="references__title">{name}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination (CLIENT + SERVER) */}
        {showPagination && (
          <div className="row mt-30">
            <div className="col-12 d-flex flex-column align-items-center gap-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={safePage === 1}
                      onClick={(e) => {
                        e.preventDefault();
                        if (safePage > 1) setPage(safePage - 1);
                      }}
                    />
                  </PaginationItem>

                  {paginationNumbers.map((item, idx) => {
                    if (item === 'ellipsis-left' || item === 'ellipsis-right') {
                      return (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    const pageNumber = item as number;
                    const isActive = pageNumber === safePage;

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={isActive}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={safePage === pageCount}
                      onClick={(e) => {
                        e.preventDefault();
                        if (safePage < pageCount) setPage(safePage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="references__meta">
                {locale === 'de'
                  ? `${totalItems} kayıt · Sayfa ${safePage} / ${pageCount}`
                  : `${totalItems} records · Page ${safePage} of ${pageCount}`}
              </div>
            </div>
          </div>
        )}

        {/* Tek sayfaysa küçük info */}
        {!showPagination && totalItems > 0 && (
          <div className="row mt-18">
            <div className="col-12 d-flex justify-content-center">
              <div className="references__meta">
                {locale === 'de'
                  ? `${totalItems} kayıt görüntüleniyor`
                  : `${totalItems} records displayed`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* UI improvements */}
      <style jsx>{`
        .references__intro {
          margin-top: 12px;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .references__filters {
          margin-top: 18px;
          margin-bottom: 34px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .references__tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .references__tab {
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fff;
          border-radius: 999px;
          padding: 0;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease,
            border-color 0.15s ease;
          user-select: none;
          min-height: 40px;
        }

        .references__tabInner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 18px;
          font-size: 13px;
          line-height: 1;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }

        .references__tab--sub .references__tabInner {
          padding: 9px 16px;
          font-size: 12.5px;
          opacity: 0.95;
        }

        .references__tab:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
        }

        .references__tab.is-active {
          background: var(--tp-theme-1, #5a57ff);
          border-color: transparent;
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);
        }

        .references__tab.is-active .references__tabInner {
          color: #fff;
        }

        .references__tab:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .references__loadingLine {
          height: 12px;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.06);
        }

        .references__gridWrap {
          margin-top: 6px;
        }

        .references__empty {
          text-align: center;
          padding: 20px 0 10px;
          opacity: 0.85;
        }

        .references__grid {
          display: grid;
          gap: 22px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          align-items: stretch;
        }

        @media (max-width: 1199px) {
          .references__grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 767px) {
          .references__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }
        }

        .references__cell {
          display: block;
        }

        .references__cardLink {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .references__card {
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          padding: 14px 14px 12px;
          height: 100%;
          transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
        }

        .references__card:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 0, 0, 0.12);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
        }

        .references__media {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 10px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.02);
          min-height: 120px;
        }

        .references__title {
          margin-top: 12px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          opacity: 0.92;
        }

        .references__meta {
          font-size: 13px;
          opacity: 0.7;
          margin-top: 6px;
        }
      `}</style>
    </section>
  );
};

export default ReferencesPageContent;
