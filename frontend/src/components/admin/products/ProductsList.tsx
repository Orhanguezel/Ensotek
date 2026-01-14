// =============================================================
// FILE: src/components/admin/products/ProductsList.tsx
// Ensotek – Admin Products/Sparepart List (shared)
// - < xxl: CARDS
// - xxl+: TABLE (DnD enabled only if onReorder provided)
// - Admin rule: NO locale in URL
// - Route is dynamic via basePath (/admin/products OR /admin/sparepart)
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import type { ProductDto } from '@/integrations/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

import { localeShortClient } from '@/i18n/localeShortClient';

export type ProductsListProps = {
  items?: ProductDto[];
  loading: boolean;
  onDelete?: (item: ProductDto) => void;

  onReorder?: (next: ProductDto[]) => void;
  onSaveOrder?: () => void;
  savingOrder?: boolean;

  // ✅ hangi admin route altında kullanılacak?
  // products:  "/admin/products"
  // sparepart: "/admin/sparepart"
  basePath?: string;

  // (opsiyonel) başlık
  title?: string;

  // parent’ın hesapladığı efektif locale (sadece display/logic için; URL’e yazmayacağız)
  activeLocale?: string;
};

const PAGE_SIZE = 20;

/* ---------------- Helpers ---------------- */

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

const formatPrice = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(2)} ₺`;
};

/* ---------------- Component ---------------- */

export const ProductsList: React.FC<ProductsListProps> = ({
  items,
  loading,
  onDelete,
  onReorder,
  onSaveOrder,
  savingOrder,
  basePath = '/admin/products',
  title = 'Ürün Listesi',
  activeLocale,
}) => {
  const rows = items ?? [];
  const totalItems = rows.length;
  const hasData = totalItems > 0;

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  useEffect(() => {
    setPage((prev) => {
      const maxPage = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
      return Math.min(prev, maxPage);
    });
  }, [totalItems]);

  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pageRows = rows.slice(startIndex, endIndex);

  const busy = loading || !!savingOrder;

  // ✅ Admin: locale sadece display/isteğe bağlı; URL’e yazmayacağız.
  const effectiveLocale = useMemo(() => localeShortClient(activeLocale) || '', [activeLocale]);

  // ✅ edit route: basePath + id (locale query YOK)
  const editHref = (id: string) => ({
    pathname: `${basePath}/${encodeURIComponent(id)}`,
  });

  const handleDelete = (p: ProductDto) => {
    if (!onDelete) return;
    const ok = window.confirm(
      `Bu ürünü silmek üzeresin.\n\n` +
        `Başlık: ${safeText((p as any).title)}\n` +
        `Slug: ${safeText((p as any).slug)}\n\n` +
        `Devam etmek istiyor musun?`,
    );
    if (!ok) return;
    onDelete(p);
  };

  /* ---------------- DnD (xxl+ table) ---------------- */

  const handleDragStart = (id: string) => setDraggingId(id);
  const handleDragEnd = () => setDraggingId(null);

  const handleDropOn = (targetId: string) => {
    if (!draggingId || draggingId === targetId || !onReorder) return;

    const currentIndex = rows.findIndex((r) => r.id === draggingId);
    const targetIndex = rows.findIndex((r) => r.id === targetId);
    if (currentIndex === -1 || targetIndex === -1) return;

    const next = [...rows];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);

    onReorder(next);
  };

  /* ---------------- Pagination helpers ---------------- */

  const buildPages = () => {
    const pages: Array<number | 'ellipsis-left' | 'ellipsis-right'> = [];
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i += 1) pages.push(i);
      return pages;
    }

    pages.push(1);
    const siblings = 1;
    let left = Math.max(2, currentPage - siblings);
    let right = Math.min(pageCount - 1, currentPage + siblings);

    if (left > 2) pages.push('ellipsis-left');
    else left = 2;

    for (let i = left; i <= right; i += 1) pages.push(i);

    if (right < pageCount - 1) pages.push('ellipsis-right');
    else right = pageCount - 1;

    pages.push(pageCount);
    return pages;
  };

  const pages = buildPages();

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pageCount) return;
    setPage(nextPage);
  };

  /* ---------------- UI fragments ---------------- */

  const renderStatus = (p: ProductDto) => (
    <div className="d-flex flex-wrap gap-1">
      {p.is_active ? (
        <span className="badge bg-success-subtle text-success border border-success-subtle">
          Aktif
        </span>
      ) : (
        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
          Pasif
        </span>
      )}
      {p.is_featured ? (
        <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
          Öne çıkan
        </span>
      ) : null}
    </div>
  );

  const captionText = (
    <span className="text-muted small">
      Sıralama değişikliği için satırları sürükleyip bırakabilirsin. Kalıcı yapmak için{' '}
      <strong>&quot;Sıralamayı Kaydet&quot;</strong> butonunu kullan.
      <span className="ms-2">(Kart görünümü: tablet/mobil, Tablo: çok büyük ekranlar/xxl+)</span>
      {effectiveLocale ? (
        <span className="ms-2">
          Aktif dil: <code>{effectiveLocale}</code>
        </span>
      ) : null}
    </span>
  );

  return (
    <div className="card">
      <div className="card-header py-2">
        <div className="d-flex align-items-start align-items-md-center justify-content-between gap-2 flex-wrap">
          <span className="small fw-semibold">{title}</span>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {busy && <span className="badge bg-secondary small">İşlem yapılıyor...</span>}

            {onSaveOrder && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={onSaveOrder}
                disabled={!!savingOrder || !hasData}
              >
                {savingOrder ? 'Sıralama kaydediliyor...' : 'Sıralamayı Kaydet'}
              </button>
            )}

            <span className="text-muted small">
              Toplam: <strong>{totalItems}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        {/* =========================================================
            XXL+ TABLE
           ========================================================= */}
        <div className="d-none d-xxl-block">
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 56 }} />
                  <th style={{ width: '30%' }}>Başlık</th>
                  <th style={{ width: '18%' }}>Slug</th>
                  <th style={{ width: '10%' }}>Fiyat</th>
                  <th style={{ width: '8%' }}>Stok</th>
                  <th style={{ width: '8%' }}>Dil</th>
                  <th style={{ width: '12%' }}>Durum</th>
                  <th style={{ width: '14%' }}>Tarih</th>
                  <th style={{ width: 170 }} className="text-end text-nowrap">
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="text-center text-muted small py-3">Ürünler yükleniyor...</div>
                    </td>
                  </tr>
                ) : hasData ? (
                  pageRows.map((p, index) => {
                    const globalIndex = startIndex + index;

                    const canReorder = !!onReorder;
                    const title = safeText((p as any).title) || '(Başlık yok)';
                    const slug = safeText((p as any).slug) || '-';

                    return (
                      <tr
                        key={p.id}
                        draggable={canReorder}
                        onDragStart={() => canReorder && handleDragStart(p.id)}
                        onDragEnd={canReorder ? handleDragEnd : undefined}
                        onDragOver={canReorder ? (e) => e.preventDefault() : undefined}
                        onDrop={canReorder ? () => handleDropOn(p.id) : undefined}
                        className={draggingId === p.id ? 'table-active' : undefined}
                        style={canReorder ? { cursor: 'move' } : { cursor: 'default' }}
                      >
                        <td className="text-muted small text-nowrap">
                          {canReorder && <span className="me-1">≡</span>}
                          <span>{globalIndex + 1}</span>
                        </td>

                        <td className="small" style={{ minWidth: 320 }}>
                          <div style={{ minWidth: 0 }}>
                            <div className="fw-semibold text-truncate" title={title}>
                              {title}
                            </div>
                            {(p as any).product_code ? (
                              <div className="text-muted small text-truncate">
                                Kod: <code>{safeText((p as any).product_code)}</code>
                              </div>
                            ) : null}
                          </div>
                        </td>

                        <td className="small" style={{ minWidth: 240 }}>
                          <div className="text-truncate" title={slug}>
                            <code>{slug}</code>
                          </div>
                        </td>

                        <td className="small text-nowrap">{formatPrice((p as any).price)}</td>
                        <td className="small text-nowrap">
                          {safeText((p as any).stock_quantity) || '-'}
                        </td>

                        <td className="small text-nowrap">
                          <code>{safeText((p as any).locale) || '-'}</code>
                        </td>

                        <td className="small">{renderStatus(p)}</td>

                        <td className="small text-nowrap">
                          <div>{formatDate((p as any).created_at)}</div>
                          <div className="text-muted small">
                            Güncelleme: {formatDate((p as any).updated_at)}
                          </div>
                        </td>

                        <td className="text-end text-nowrap">
                          <div className="btn-group btn-group-sm">
                            <Link href={editHref(p.id)} className="btn btn-outline-primary btn-sm">
                              Düzenle
                            </Link>
                            {onDelete && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                disabled={busy}
                                onClick={() => handleDelete(p)}
                              >
                                Sil
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <div className="text-center text-muted small py-3">
                        Henüz kayıtlı ürün bulunmuyor.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              <caption className="px-3 py-2 text-start">{captionText}</caption>
            </table>
          </div>
        </div>

        {/* =========================================================
            < XXL : CARDS
           ========================================================= */}
        <div className="d-block d-xxl-none">
          {loading ? (
            <div className="px-3 py-3 text-center text-muted small">Ürünler yükleniyor...</div>
          ) : hasData ? (
            <div className="p-3">
              <div className="row g-3">
                {pageRows.map((p, index) => {
                  const globalIndex = startIndex + index;

                  const title = safeText((p as any).title) || '(Başlık yok)';
                  const slug = safeText((p as any).slug) || '-';
                  const code = safeText((p as any).product_code);
                  const locale = safeText((p as any).locale) || '-';
                  const stock = safeText((p as any).stock_quantity) || '-';

                  return (
                    <div key={p.id} className="col-12 col-lg-6">
                      <div className="border rounded-3 p-3 bg-white h-100">
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="badge bg-light text-dark border">
                              #{globalIndex + 1}
                            </span>
                            {renderStatus(p)}
                            <span className="badge bg-light text-dark border">
                              Dil: <code>{locale}</code>
                            </span>
                          </div>

                          <div className="text-end">
                            <div className="small text-muted text-nowrap">
                              {formatDate((p as any).created_at)}
                            </div>
                            <div className="small text-nowrap mt-1">
                              <span className="text-muted me-1">Fiyat:</span>
                              <span className="fw-semibold">{formatPrice((p as any).price)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div
                            className="fw-semibold"
                            style={{ wordBreak: 'break-word' }}
                            title={title}
                          >
                            {title}
                          </div>

                          <div
                            className="text-muted small mt-1"
                            style={{ wordBreak: 'break-word' }}
                          >
                            Slug: <code>{slug}</code>
                          </div>

                          {code ? (
                            <div
                              className="text-muted small mt-1"
                              style={{ wordBreak: 'break-word' }}
                            >
                              Kod: <code>{code}</code>
                            </div>
                          ) : null}

                          <div className="text-muted small mt-2 d-flex flex-wrap gap-3">
                            <div>
                              <span className="me-1">Stok:</span>
                              <span className="fw-semibold">{stock}</span>
                            </div>
                            <div className="text-muted">
                              Güncelleme:{' '}
                              <span className="fw-semibold">
                                {formatDate((p as any).updated_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 d-grid gap-2">
                          <Link href={editHref(p.id)} className="btn btn-outline-primary btn-sm">
                            Düzenle
                          </Link>
                          {onDelete ? (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              disabled={busy}
                              onClick={() => handleDelete(p)}
                            >
                              Sil
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3">{captionText}</div>
            </div>
          ) : (
            <div className="px-3 py-3 text-center text-muted small">
              Henüz kayıtlı ürün bulunmuyor.
            </div>
          )}
        </div>

        {pageCount > 1 && (
          <div className="py-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {pages.map((p, idx) =>
                  typeof p === 'number' ? (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={`${p}-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};
