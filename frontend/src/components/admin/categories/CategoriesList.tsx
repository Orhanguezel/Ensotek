// =============================================================
// FILE: src/components/admin/categories/CategoriesList.tsx
// Ensotek – Kategori Liste Bileşeni
//
// Responsive Strategy (Bootstrap 5):
// - < xxl: CARDS (tablet + mobile) ✅
// - xxl+: TABLE (DnD enabled here only) ✅
//
// Notes:
// - Pagination client-side
// - DnD uses full rows (global order); table only to keep UI clean
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import type { CategoryDto } from '@/integrations/types/category.types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

/* ---------------- Helpers ---------------- */

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));

function formatText(v: unknown, max = 80): string {
  const s = safeText(v);
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + '...';
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

export type CategoriesListProps = {
  items?: CategoryDto[];
  loading: boolean;

  onEdit?: (item: CategoryDto) => void;
  onDelete?: (item: CategoryDto) => void;

  onToggleActive?: (item: CategoryDto, value: boolean) => void;
  onToggleFeatured?: (item: CategoryDto, value: boolean) => void;

  onReorder?: (next: CategoryDto[]) => void;
  onSaveOrder?: () => void;
  savingOrder?: boolean;
};

const PAGE_SIZE = 20;

export const CategoriesList: React.FC<CategoriesListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onReorder,
  onSaveOrder,
  savingOrder,
}) => {
  const rows = useMemo(() => items ?? [], [items]);
  const totalItems = rows.length;
  const hasData = totalItems > 0;

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // items değişince sayfa taşmasın
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
  const canReorderXxl = !!onReorder && !busy;

  /* ---------------- DnD (xxl+ table) ---------------- */

  const handleDragStart = (id: string) => {
    if (!canReorderXxl) return;
    setDraggingId(id);
  };

  const handleDragEnd = () => setDraggingId(null);

  const handleDropOn = (targetId: string) => {
    if (!canReorderXxl || !onReorder) return;
    if (!draggingId || draggingId === targetId) return;

    const currentIndex = rows.findIndex((r) => r.id === draggingId);
    const targetIndex = rows.findIndex((r) => r.id === targetId);
    if (currentIndex === -1 || targetIndex === -1) return;

    const next = [...rows];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);

    onReorder(next);
  };

  /* ---------------- Pagination ---------------- */

  const pages = useMemo(() => {
    const out: Array<number | 'ellipsis-left' | 'ellipsis-right'> = [];
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i += 1) out.push(i);
      return out;
    }

    out.push(1);

    const siblings = 1;
    let left = Math.max(2, currentPage - siblings);
    let right = Math.min(pageCount - 1, currentPage + siblings);

    if (left > 2) out.push('ellipsis-left');
    else left = 2;

    for (let i = left; i <= right; i += 1) out.push(i);

    if (right < pageCount - 1) out.push('ellipsis-right');
    else right = pageCount - 1;

    out.push(pageCount);
    return out;
  }, [pageCount, currentPage]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pageCount) return;
    setPage(nextPage);
  };

  /* ---------------- UI fragments ---------------- */

  const renderModuleBadge = (item: CategoryDto) => (
    <span className="badge bg-light text-dark border small">
      {safeText((item as any).module_key) || 'general'}
    </span>
  );

  const renderLocaleBadge = (item: CategoryDto) => {
    const l = safeText((item as any).locale);
    if (!l) return null;
    return (
      <span className="badge bg-light text-dark border small">
        Dil: <code>{l}</code>
      </span>
    );
  };

  const captionText = (
    <span className="text-muted small">
      Sıralama değişikliği (DnD) sadece çok büyük ekranlarda (xxl+) tabloda aktiftir. Kalıcı yapmak
      için <strong>&quot;Sıralamayı Kaydet&quot;</strong> butonunu kullan.
    </span>
  );

  return (
    <div className="card">
      <div className="card-header py-2">
        <div className="d-flex align-items-start align-items-md-center justify-content-between gap-2 flex-wrap">
          <span className="small fw-semibold">Kategori Listesi</span>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {busy && <span className="badge bg-secondary small">İşlem yapılıyor...</span>}

            {onSaveOrder && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={onSaveOrder}
                disabled={!!savingOrder || !hasData || loading}
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
            XXL+ TABLE (DnD here)
           ========================================================= */}
        <div className="d-none d-xxl-block">
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 56 }} />
                  <th style={{ width: '26%' }}>Ad</th>
                  <th style={{ width: '18%' }}>Slug</th>
                  <th style={{ width: '10%' }}>Dil</th>
                  <th style={{ width: '14%' }}>Modül</th>
                  <th style={{ width: '10%' }}>Aktif</th>
                  <th style={{ width: '12%' }}>Öne Çıkan</th>
                  <th style={{ width: '12%' }}>Güncellenme</th>
                  <th style={{ width: 170 }} className="text-end text-nowrap">
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="text-center text-muted small py-3">
                        Kategoriler yükleniyor...
                      </div>
                    </td>
                  </tr>
                ) : hasData ? (
                  pageRows.map((item, index) => {
                    const globalIndex = startIndex + index;

                    const name = safeText((item as any).name) || '(Ad yok)';
                    const slug = safeText((item as any).slug) || '-';
                    const locale = safeText((item as any).locale) || '-';

                    return (
                      <tr
                        key={item.id}
                        draggable={canReorderXxl}
                        onDragStart={() => handleDragStart(item.id)}
                        onDragEnd={canReorderXxl ? handleDragEnd : undefined}
                        onDragOver={canReorderXxl ? (e) => e.preventDefault() : undefined}
                        onDrop={canReorderXxl ? () => handleDropOn(item.id) : undefined}
                        className={draggingId === item.id ? 'table-active' : undefined}
                        style={canReorderXxl ? { cursor: 'move' } : { cursor: 'default' }}
                      >
                        <td className="text-muted small text-nowrap">
                          {canReorderXxl && <span className="me-1">≡</span>}
                          <span>{globalIndex + 1}</span>
                        </td>

                        <td className="align-middle" style={{ minWidth: 260 }}>
                          <div style={{ minWidth: 0 }}>
                            <div className="fw-semibold small text-truncate" title={name}>
                              {name}
                            </div>
                            {(item as any).description ? (
                              <div
                                className="text-muted small text-truncate"
                                title={safeText((item as any).description)}
                              >
                                {formatText((item as any).description, 80)}
                              </div>
                            ) : null}
                          </div>
                        </td>

                        <td className="align-middle" style={{ minWidth: 220 }}>
                          <div className="text-truncate" title={slug}>
                            <code className="small">{slug}</code>
                          </div>
                        </td>

                        <td className="align-middle small text-nowrap">
                          <code>{locale}</code>
                        </td>

                        <td className="align-middle">{renderModuleBadge(item)}</td>

                        <td className="align-middle">
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={!!(item as any).is_active}
                              disabled={busy || !onToggleActive}
                              onChange={(e) => onToggleActive?.(item, e.target.checked)}
                            />
                          </div>
                        </td>

                        <td className="align-middle">
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={!!(item as any).is_featured}
                              disabled={busy || !onToggleFeatured}
                              onChange={(e) => onToggleFeatured?.(item, e.target.checked)}
                            />
                          </div>
                        </td>

                        <td className="align-middle">
                          <span className="text-muted small">
                            {formatDate((item as any).updated_at)}
                          </span>
                        </td>

                        <td className="align-middle text-end text-nowrap">
                          <div className="btn-group btn-group-sm">
                            {onEdit && (
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => onEdit(item)}
                                disabled={busy}
                              >
                                Düzenle
                              </button>
                            )}
                            {onDelete && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => onDelete(item)}
                                disabled={busy}
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
                      <div className="text-center text-muted small py-3">Kayıt bulunamadı.</div>
                    </td>
                  </tr>
                )}
              </tbody>

              <caption className="px-3 py-2 text-start">{captionText}</caption>
            </table>
          </div>
        </div>

        {/* =========================================================
            < XXL : CARDS (tablet + mobile)
           ========================================================= */}
        <div className="d-block d-xxl-none">
          {loading ? (
            <div className="px-3 py-3 text-center text-muted small">Kategoriler yükleniyor...</div>
          ) : hasData ? (
            <div className="p-3">
              <div className="row g-3">
                {pageRows.map((item, index) => {
                  const globalIndex = startIndex + index;

                  const name = safeText((item as any).name) || '(Ad yok)';
                  const slug = safeText((item as any).slug) || '-';
                  const desc = safeText((item as any).description);
                  const updatedAt = formatDate((item as any).updated_at);

                  return (
                    <div key={item.id} className="col-12 col-lg-6">
                      <div className="border rounded-3 p-3 bg-white h-100">
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="badge bg-light text-dark border">
                              #{globalIndex + 1}
                            </span>
                            {renderModuleBadge(item)}
                            {renderLocaleBadge(item)}
                          </div>

                          <div className="text-end">
                            <div className="small text-muted text-nowrap">{updatedAt}</div>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div
                            className="fw-semibold"
                            style={{ wordBreak: 'break-word' }}
                            title={name}
                          >
                            {name}
                          </div>

                          <div
                            className="text-muted small mt-1"
                            style={{ wordBreak: 'break-word' }}
                          >
                            Slug: <code>{slug}</code>
                          </div>

                          {desc ? (
                            <div
                              className="text-muted small mt-2"
                              style={{ wordBreak: 'break-word' }}
                            >
                              {formatText(desc, 120)}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                          <div className="d-flex flex-wrap gap-3">
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={!!(item as any).is_active}
                                disabled={busy || !onToggleActive}
                                onChange={(e) => onToggleActive?.(item, e.target.checked)}
                              />
                              <label className="form-check-label small">Aktif</label>
                            </div>

                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={!!(item as any).is_featured}
                                disabled={busy || !onToggleFeatured}
                                onChange={(e) => onToggleFeatured?.(item, e.target.checked)}
                              />
                              <label className="form-check-label small">Öne çıkan</label>
                            </div>
                          </div>

                          <div className="d-flex gap-2">
                            {onEdit && (
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => onEdit(item)}
                                disabled={busy}
                              >
                                Düzenle
                              </button>
                            )}
                            {onDelete && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => onDelete(item)}
                                disabled={busy}
                              >
                                Sil
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3">{captionText}</div>
            </div>
          ) : (
            <div className="px-3 py-3 text-center text-muted small">Kayıt bulunamadı.</div>
          )}
        </div>

        {/* Pagination (ortak) */}
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
