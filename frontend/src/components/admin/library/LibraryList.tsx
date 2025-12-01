// =============================================================
// FILE: src/components/admin/library/LibraryList.tsx
// Ensotek – Library Liste Bileşeni
// (Bootstrap table + mobile cards + client-side pagination)
// =============================================================

import React, { useEffect, useState } from "react";
import type { LibraryDto } from "@/integrations/types/library.types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

/* Küçük yardımcı – text kısaltma */
function formatText(v: unknown, max = 80): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + "...";
}

export type LibraryListProps = {
  items?: LibraryDto[];
  loading: boolean;

  onEdit?: (item: LibraryDto) => void;
  onDelete?: (item: LibraryDto) => void;

  onTogglePublished?: (item: LibraryDto, value: boolean) => void;
  onToggleActive?: (item: LibraryDto, value: boolean) => void;
  onManageMedia?: (item: LibraryDto) => void;
};

const PAGE_SIZE = 20;

export const LibraryList: React.FC<LibraryListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleActive,
  onManageMedia,
}) => {
  const rows = items || [];
  const totalItems = rows.length;
  const hasData = totalItems > 0;

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

  /* ---------- Pagination page butonları ---------- */

  const buildPages = () => {
    const pages: Array<number | "ellipsis-left" | "ellipsis-right"> = [];
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i += 1) pages.push(i);
      return pages;
    }

    pages.push(1);
    const siblings = 1;
    let left = Math.max(2, currentPage - siblings);
    let right = Math.min(pageCount - 1, currentPage + siblings);

    if (left > 2) {
      pages.push("ellipsis-left");
    } else {
      left = 2;
    }

    for (let i = left; i <= right; i += 1) {
      pages.push(i);
    }

    if (right < pageCount - 1) {
      pages.push("ellipsis-right");
    } else {
      right = pageCount - 1;
    }

    pages.push(pageCount);
    return pages;
  };

  const pages = buildPages();

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pageCount) return;
    setPage(nextPage);
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex align-items-center justify-content-between">
        <span className="small fw-semibold">Library İçerik Listesi</span>
        <div className="d-flex align-items-center gap-2">
          {loading && (
            <span className="badge bg-secondary">Yükleniyor...</span>
          )}
        </div>
      </div>

      <div className="card-body p-0">
        {/* ========= Desktop / Tablet (md ve üstü) – Table görünümü ========= */}
        <div className="d-none d-md-block">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "25%" }}>Başlık / Slug</th>
                <th style={{ width: "15%" }}>Kategori</th>
                <th style={{ width: "10%" }}>Durum</th>
                <th style={{ width: "15%" }}>İstatistik</th>
                <th style={{ width: "15%" }}>Yayın / Güncelleme</th>
                <th style={{ width: "15%" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                pageRows.map((item, index) => {
                  const globalIndex = startIndex + index; // 0-based
                  const tagsStr =
                    (item.tags ?? []).map((t) => `#${t}`).join(" ") || "";
                  return (
                    <tr key={item.id}>
                      <td className="text-muted small">{globalIndex + 1}</td>
                      <td>
                        <div className="fw-semibold small">
                          {item.title || (
                            <span className="text-muted">Başlık yok</span>
                          )}
                        </div>
                        <div className="text-muted small">
                          <code>{item.slug || "-"}</code>
                          {item.locale_resolved && (
                            <span className="ms-2 badge bg-light text-dark border">
                              {item.locale_resolved.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {tagsStr && (
                          <div className="text-muted small mt-1">
                            {formatText(tagsStr, 80)}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="text-muted small">
                          <div>
                            <span className="me-1">Kategori:</span>
                            {item.category_id || (
                              <span className="text-muted">-</span>
                            )}
                          </div>
                          <div>
                            <span className="me-1">Alt kategori:</span>
                            {item.sub_category_id || (
                              <span className="text-muted">-</span>
                            )}
                          </div>
                          {item.author && (
                            <div className="mt-1">
                              <span className="me-1">Yazar:</span>
                              {item.author}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1 small">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={!!item.is_published}
                              onChange={(e) =>
                                onTogglePublished &&
                                onTogglePublished(item, e.target.checked)
                              }
                            />
                            <label className="form-check-label">
                              Yayında
                            </label>
                          </div>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={!!item.is_active}
                              onChange={(e) =>
                                onToggleActive &&
                                onToggleActive(item, e.target.checked)
                              }
                            />
                            <label className="form-check-label">Aktif</label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-muted small">
                          <div>
                            <span className="me-1">Görüntüleme:</span>
                            {item.views ?? 0}
                          </div>
                          <div>
                            <span className="me-1">İndirme:</span>
                            {item.download_count ?? 0}
                          </div>
                          <div>
                            <span className="me-1">Sıra:</span>
                            {item.display_order ?? 0}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-muted small">
                          <div>
                            <span className="me-1">Yayın:</span>
                            {item.published_at
                              ? new Date(item.published_at).toLocaleString()
                              : "-"}
                          </div>
                          <div>
                            <span className="me-1">Güncel:</span>
                            {item.updated_at
                              ? new Date(item.updated_at).toLocaleString()
                              : "-"}
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          {onManageMedia && (
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => onManageMedia(item)}
                            >
                              Medya
                            </button>
                          )}
                          {onEdit && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => onEdit(item)}
                            >
                              Düzenle
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => onDelete(item)}
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
                  <td colSpan={7}>
                    <div className="text-center text-muted small py-3">
                      Kayıt bulunamadı.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ========= Mobil (sm ve altı) – Card görünümü ========= */}
        <div className="d-block d-md-none">
          {hasData ? (
            pageRows.map((item, index) => {
              const globalIndex = startIndex + index;
              const tagsStr =
                (item.tags ?? []).map((t) => `#${t}`).join(" ") || "";
              return (
                <div key={item.id} className="border-bottom px-3 py-2">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-semibold small">
                        <span className="text-muted me-1">
                          #{globalIndex + 1}
                        </span>
                        {item.title || (
                          <span className="text-muted">Başlık yok</span>
                        )}
                      </div>
                      <div className="text-muted small">
                        <code>{item.slug || "-"}</code>
                        {item.locale_resolved && (
                          <span className="ms-2 badge bg-light text-dark border">
                            {item.locale_resolved.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {tagsStr && (
                        <div className="text-muted small mt-1">
                          {formatText(tagsStr, 80)}
                        </div>
                      )}
                      <div className="text-muted small mt-1">
                        <div>
                          <span className="me-1">Kategori:</span>
                          {item.category_id || (
                            <span className="text-muted">-</span>
                          )}
                        </div>
                        <div>
                          <span className="me-1">Alt kategori:</span>
                          {item.sub_category_id || (
                            <span className="text-muted">-</span>
                          )}
                        </div>
                        {item.author && (
                          <div>
                            <span className="me-1">Yazar:</span>
                            {item.author}
                          </div>
                        )}
                      </div>
                      <div className="text-muted small mt-1">
                        <div>
                          <span className="me-1">Görüntüleme:</span>
                          {item.views ?? 0}
                        </div>
                        <div>
                          <span className="me-1">İndirme:</span>
                          {item.download_count ?? 0}
                        </div>
                        <div>
                          <span className="me-1">Yayın:</span>
                          {item.published_at
                            ? new Date(item.published_at).toLocaleString()
                            : "-"}
                        </div>
                        <div>
                          <span className="me-1">Güncel:</span>
                          {item.updated_at
                            ? new Date(item.updated_at).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-end gap-1">
                      <div className="form-check form-switch small">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={!!item.is_published}
                          onChange={(e) =>
                            onTogglePublished &&
                            onTogglePublished(item, e.target.checked)
                          }
                        />
                        <label className="form-check-label">Yayında</label>
                      </div>
                      <div className="form-check form-switch small">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={!!item.is_active}
                          onChange={(e) =>
                            onToggleActive &&
                            onToggleActive(item, e.target.checked)
                          }
                        />
                        <label className="form-check-label">Aktif</label>
                      </div>
                      <div className="d-flex flex-wrap gap-1 mt-1 justify-content-end">
                        {onManageMedia && (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onManageMedia(item)}
                          >
                            Medya
                          </button>
                        )}
                        {onEdit && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => onEdit(item)}
                          >
                            Düzenle
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => onDelete(item)}
                          >
                            Sil
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-3 py-3 text-center text-muted small">
              Kayıt bulunamadı.
            </div>
          )}
        </div>

        {/* Pagination (her iki görünüm için ortak) */}
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
                  typeof p === "number" ? (
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
