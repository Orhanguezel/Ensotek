// =============================================================
// FILE: src/components/containers/references/ReferencesPageContent.tsx
// Ensotek – Full References Page Content
//   - Tüm referansların grid listesi + kategori tab filtreleri
//   - UI i18n: site_settings.ui_references
//   - Data: RTK /references (useListReferencesQuery)
//   - Pagination: src/components/ui/pagination.tsx
// =============================================================
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";

// RTK – References public
import { useListReferencesQuery } from "@/integrations/rtk/endpoints/references.endpoints";
import type { ReferenceDto } from "@/integrations/types/references.types";

// Ortak helper'lar
import { toCdnSrc } from "@/shared/media";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";


// Pagination UI
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// Fallback görsel (logo yoksa)
import One from "public/img/brand/1.png";

const CARD_W = 180;
const CARD_H = 80;
const PAGE_SIZE = 24; // bir sayfada gösterilecek referans sayısı

const altFromSlug = (slug?: string | null) =>
  (slug || "reference").replace(/[-_]+/g, " ").trim();

type CategoryTab = {
  id: string; // "all" | "uncategorized" | gerçek category_id
  label: string;
};

const ReferencesPageContent: React.FC = () => {
  const locale = useResolvedLocale();

  // UI: başlık, alt metin vs.
  const { ui } = useUiSection("ui_references", locale);

  const sectionSubtitlePrefix = ui("ui_references_subprefix", "Ensotek");
  const sectionSubtitleLabel = ui(
    "ui_references_sublabel",
    locale === "tr" ? "Referanslarımız" : "References",
  );

  const sectionTitle = ui(
    "ui_references_page_title",
    locale === "tr" ? "Referanslarımız" : "Our References",
  );

  const sectionIntro = ui(
    "ui_references_page_intro",
    locale === "tr"
      ? "Yurt içi ve yurt dışında tamamladığımız projelerden seçili referanslarımız."
      : "Selected references from our completed projects in Turkey and abroad.",
  );

  const { data, isLoading } = useListReferencesQuery({
    limit: 200, // backend pagination’a geçince PAGE_SIZE kullanarak sayfa bazlı istek atılabilir
    sort: "display_order",
    orderDir: "asc",
    is_published: 1,
  });

  const items: ReferenceDto[] = useMemo(() => {
    const list: ReferenceDto[] = data?.items ?? [];
    return list.filter((r) => r.is_published === 1);
  }, [data]);

  // -------------------- KATEGORİ TAB’LERİ --------------------
  const categoryTabs: CategoryTab[] = useMemo(() => {
    const tabs: CategoryTab[] = [];

    // 1) Tümü tab’ı
    tabs.push({
      id: "all",
      label: ui(
        "ui_references_tab_all",
        locale === "tr" ? "Tümü" : "All",
      ),
    });

    // 2) Kategorili referanslardan dinamik tab’ler
    const seen = new Set<string>();

    items.forEach((ref) => {
      const rawCategoryId = ref.category_id || null;
      const key = rawCategoryId ?? "uncategorized";

      if (key === "uncategorized") {
        // “Diğer projeler” tab’ını bir kere ekle
        if (!seen.has(key)) {
          tabs.push({
            id: key,
            label: ui(
              "ui_references_tab_other",
              locale === "tr" ? "Diğer Projeler" : "Other Projects",
            ),
          });
          seen.add(key);
        }
        return;
      }

      if (seen.has(key)) return;
      seen.add(key);

      // Label fallback:
      // - meta_title başı
      // - yoksa title
      // - en son “Kategori N”
      const baseTitle =
        (ref.meta_title || ref.title || "").split("|")[0].trim();

      const label =
        baseTitle ||
        (locale === "tr"
          ? `Kategori ${tabs.length}` // Tümü hariç say
          : `Category ${tabs.length}`);

      tabs.push({
        id: key,
        label,
      });
    });

    return tabs;
  }, [items, ui, locale]);

  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  // Kategori değişince sayfayı 1’e çek
  useEffect(() => {
    setPage(1);
  }, [activeCategoryId]);

  const filteredItems = useMemo(() => {
    if (activeCategoryId === "all") return items;
    if (activeCategoryId === "uncategorized") {
      return items.filter((ref) => !ref.category_id);
    }
    return items.filter((ref) => ref.category_id === activeCategoryId);
  }, [items, activeCategoryId]);

  const totalItems = filteredItems.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // Page out-of-range safety (örn: filtre değişince)
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pagedItems = filteredItems.slice(start, end);

  // Sayfa numaralarını (ellipsişli) üret
  const paginationNumbers = useMemo(() => {
    const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [];
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) pages.push(i);
      return pages;
    }

    // 1, ..., mid-1, mid, mid+1, ..., last
    const showLeftEllipsis = safePage > 4;
    const showRightEllipsis = safePage < pageCount - 3;

    pages.push(1);
    if (showLeftEllipsis) {
      pages.push("ellipsis-left");
    }

    const startPage = Math.max(2, safePage - 1);
    const endPage = Math.min(pageCount - 1, safePage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (showRightEllipsis) {
      pages.push("ellipsis-right");
    }
    pages.push(pageCount);

    return pages;
  }, [safePage, pageCount]);

  // -------------------- RENDER --------------------
  return (
    <section className="brand__area grey-bg pt-120 pb-80">
      <div className="container">
        {/* Başlık */}
        <div className="row justify-content-center mb-40">
          <div className="col-xl-8 col-lg-9">
            <div className="section__title-wrapper text-center">
              <span className="section__subtitle-2">
                <span>{sectionSubtitlePrefix}</span>{" "}
                {sectionSubtitleLabel}
              </span>
              <h2 className="section__title-2">{sectionTitle}</h2>
              {sectionIntro && (
                <p
                  style={{
                    marginTop: 12,
                    maxWidth: 640,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {sectionIntro}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Kategori Tab’leri */}
        {categoryTabs.length > 1 && (
          <div className="row mb-30">
            <div className="col-12">
              <div className="references__tabs">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={
                      "references__tab-btn" +
                      (activeCategoryId === tab.id
                        ? " references__tab-btn--active"
                        : "")
                    }
                    onClick={() => setActiveCategoryId(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skeleton */}
        {isLoading && (
          <div className="row mb-40">
            <div className="col-12">
              <div
                className="skeleton-line"
                style={{ height: 12 }}
                aria-hidden
              />
            </div>
          </div>
        )}

        {/* Grid */}
        <div
          className="row g-4 mb-40"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {totalItems === 0 && !isLoading && (
            <div className="col-12">
              <p className="text-center">
                {ui(
                  "ui_references_empty",
                  locale === "tr"
                    ? "Şu anda görüntülenecek referans bulunmamaktadır."
                    : "There are no references to display at the moment.",
                )}
              </p>
            </div>
          )}

          {pagedItems.map((ref, idx) => {
            const imgRaw =
              ref.featured_image_url_resolved ||
              ref.featured_asset?.url ||
              ref.featured_image ||
              null;

            const imgSrc =
              (imgRaw &&
                (toCdnSrc(imgRaw, CARD_W, CARD_H, "fit") || imgRaw)) ||
              (One as any);

            const name = (ref.title ?? "").trim() || "—";
            const alt =
              ref.featured_image_alt ||
              name ||
              altFromSlug(ref.slug);

            const website = (ref.website_url ?? "").trim();

            const CardInner = (
              <div
                className="brand__line"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className="singel__brand">
                  <Image
                    src={imgSrc as any}
                    alt={alt}
                    width={CARD_W}
                    height={CARD_H}
                    loading={idx < 4 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    style={{ objectFit: "contain" }}
                  />
                  <p
                    style={{
                      fontSize: 14,
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    {name}
                  </p>
                </div>
              </div>
            );

            return (
              <div
                className="col-6 col-sm-4 col-md-3 col-lg-3"
                key={ref.id}
              >
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="brand__card-link"
                  >
                    {CardInner}
                  </a>
                ) : (
                  CardInner
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalItems > PAGE_SIZE && (
          <div className="row">
            <div className="col-12 d-flex flex-column align-items-center gap-2">
              <Pagination>
                <PaginationContent>
                  {/* Previous */}
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

                  {/* Page numbers + ellipsis */}
                  {paginationNumbers.map((item, idx) => {
                    if (item === "ellipsis-left" || item === "ellipsis-right") {
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

                  {/* Next */}
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

              {/* Küçük info satırı */}
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                {locale === "tr"
                  ? `${totalItems} kayıt · Sayfa ${safePage} / ${pageCount}`
                  : `${totalItems} records · Page ${safePage} of ${pageCount}`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Basit tab stilleri */}
      <style jsx>{`
        .references__tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .references__tab-btn {
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fff;
          padding: 6px 14px;
          font-size: 14px;
          line-height: 1.3;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .references__tab-btn--active {
          background: var(--tp-theme-1, #5a57ff);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .references__tab-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
};

export default ReferencesPageContent;
