// =============================================================
// FILE: src/components/admin/services/ServicesList.tsx
// Ensotek – Admin Services Liste Bileşeni
// (Bootstrap table + mobile cards + client-side pagination)
// =============================================================

import React, { useEffect, useState } from "react";
import type { ServiceDto } from "@/integrations/types/services.types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PAGE_SIZE = 20;

export type ServicesListProps = {
  items?: ServiceDto[];
  loading: boolean;
  onToggleActive?: (service: ServiceDto, value: boolean) => void;
  onToggleFeatured?: (service: ServiceDto, value: boolean) => void;
  onEdit?: (service: ServiceDto) => void;
  onDelete?: (service: ServiceDto) => void;
};

function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatType(t: ServiceDto["type"]): string {
  if (!t) return "Diğer";
  if (t === "gardening") return "Bahçe / Gardening";
  if (t === "soil") return "Toprak / Soil";
  if (t === "other") return "Diğer";
  return t;
}

function formatPrice(price: string | null): string {
  if (!price) return "-";
  return price;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  items,
  loading,
  onToggleActive,
  onToggleFeatured,
  onEdit,
  onDelete,
}) => {
  const rows = items ?? [];
  const totalItems = rows.length;
  const hasData = totalItems > 0;

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

    for (let i = left; i <= right; i += 1) pages.push(i);

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

  const renderStatusBadges = (s: ServiceDto) => {
    return (
      <div className="d-flex flex-column gap-1 small">
        <span
          className={
            "badge rounded-pill " +
            (s.is_active
              ? "bg-success-subtle text-success"
              : "bg-light text-muted")
          }
        >
          {s.is_active ? "Aktif" : "Pasif"}
        </span>
        <span
          className={
            "badge rounded-pill " +
            (s.featured
              ? "bg-warning-subtle text-warning"
              : "bg-light text-muted")
          }
        >
          {s.featured ? "Öne çıkan" : "Normal"}
        </span>
      </div>
    );
  };

  const renderTypeBadge = (s: ServiceDto) => {
    const t = s.type;
    let cls = "bg-secondary";
    if (t === "gardening") cls = "bg-success";
    else if (t === "soil") cls = "bg-info";
    return (
      <span className={`badge ${cls} ms-1`} style={{ fontSize: "0.7rem" }}>
        {formatType(t)}
      </span>
    );
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex align-items-center justify-content-between">
        <span className="small fw-semibold">Hizmet Listesi</span>
        <div className="d-flex align-items-center gap-2">
          {loading && (
            <span className="badge bg-secondary small">Yükleniyor...</span>
          )}
          <span className="text-muted small">
            Toplam: <strong>{totalItems}</strong>
          </span>
        </div>
      </div>

      <div className="card-body p-0">
        {/* Desktop / tablet */}
        <div className="d-none d-md-block">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle table-sm">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th style={{ width: "30%" }}>Hizmet</th>
                  <th style={{ width: "15%" }}>Tip</th>
                  <th style={{ width: "15%" }}>Durum</th>
                  <th style={{ width: "20%" }}>Fiyat / Tarihler</th>
                  <th style={{ width: "15%" }} className="text-end">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {hasData ? (
                  pageRows.map((s, index) => {
                    const globalIndex = startIndex + index;
                    return (
                      <tr key={s.id}>
                        <td className="text-muted small">{globalIndex + 1}</td>
                        <td>
                          <div className="fw-semibold small">
                            {s.name || (
                              <span className="text-muted">İsim yok</span>
                            )}
                            {renderTypeBadge(s)}
                          </div>
                          <div className="text-muted small">
                            {s.slug ? (
                              <>
                                Slug: <code>{s.slug}</code>
                              </>
                            ) : (
                              <span className="text-muted">Slug yok</span>
                            )}
                          </div>
                          {s.description && (
                            <div
                              className="text-muted small text-truncate"
                              style={{ maxWidth: 320 }}
                            >
                              {s.description}
                            </div>
                          )}
                        </td>
                        <td className="small">{formatType(s.type)}</td>
                        <td>{renderStatusBadges(s)}</td>
                        <td className="small">
                          <div>
                            <span className="text-muted me-1">Fiyat:</span>
                            {formatPrice(s.price)}
                          </div>
                          <div>
                            <span className="text-muted me-1">Kayıt:</span>
                            {formatDate(s.created_at)}
                          </div>
                          <div>
                            <span className="text-muted me-1">Güncelleme:</span>
                            {formatDate(s.updated_at)}
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            {onToggleFeatured && (
                              <button
                                type="button"
                                className={
                                  "btn " +
                                  (s.featured
                                    ? "btn-outline-warning"
                                    : "btn-outline-secondary")
                                }
                                onClick={() =>
                                  onToggleFeatured(s, !s.featured)
                                }
                              >
                                {s.featured ? "Öne çıkarma" : "Öne çıkar"}
                              </button>
                            )}
                            {onToggleActive && (
                              <button
                                type="button"
                                className={
                                  "btn " +
                                  (s.is_active
                                    ? "btn-outline-danger"
                                    : "btn-outline-success")
                                }
                                onClick={() =>
                                  onToggleActive(s, !s.is_active)
                                }
                              >
                                {s.is_active ? "Pasif yap" : "Aktif yap"}
                              </button>
                            )}
                            {onEdit && (
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => onEdit(s)}
                              >
                                Düzenle
                              </button>
                            )}
                            {onDelete && (
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => onDelete(s)}
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
                    <td colSpan={6}>
                      <div className="text-center text-muted small py-3">
                        Kayıtlı hizmet bulunamadı.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile – card görünümü */}
        <div className="d-block d-md-none">
          {hasData ? (
            pageRows.map((s, index) => {
              const globalIndex = startIndex + index;
              return (
                <div key={s.id} className="border-bottom px-3 py-2">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-semibold small">
                        <span className="text-muted me-1">
                          #{globalIndex + 1}
                        </span>
                        {s.name || (
                          <span className="text-muted">İsim yok</span>
                        )}
                        {renderTypeBadge(s)}
                      </div>
                      <div className="text-muted small">
                        {s.slug ? (
                          <>
                            Slug: <code>{s.slug}</code>
                          </>
                        ) : (
                          <span className="text-muted">Slug yok</span>
                        )}
                      </div>
                      {s.description && (
                        <div className="text-muted small mt-1">
                          {s.description}
                        </div>
                      )}
                      <div className="mt-1">{renderStatusBadges(s)}</div>
                      <div className="text-muted small mt-1">
                        <div>
                          <span className="me-1">Fiyat:</span>
                          {formatPrice(s.price)}
                        </div>
                        <div>
                          <span className="me-1">Kayıt:</span>
                          {formatDate(s.created_at)}
                        </div>
                        <div>
                          <span className="me-1">Güncelleme:</span>
                          {formatDate(s.updated_at)}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-end gap-1">
                      {onToggleFeatured && (
                        <button
                          type="button"
                          className={
                            "btn btn-sm w-100 " +
                            (s.featured
                              ? "btn-outline-warning"
                              : "btn-outline-secondary")
                          }
                          onClick={() => onToggleFeatured(s, !s.featured)}
                        >
                          {s.featured ? "Öne çıkarma" : "Öne çıkar"}
                        </button>
                      )}
                      {onToggleActive && (
                        <button
                          type="button"
                          className={
                            "btn btn-sm w-100 " +
                            (s.is_active
                              ? "btn-outline-danger"
                              : "btn-outline-success")
                          }
                          onClick={() => onToggleActive(s, !s.is_active)}
                        >
                          {s.is_active ? "Pasif yap" : "Aktif yap"}
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm w-100"
                          onClick={() => onEdit(s)}
                        >
                          Düzenle
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm w-100"
                          onClick={() => onDelete(s)}
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-3 py-3 text-center text-muted small">
              Kayıtlı hizmet bulunamadı.
            </div>
          )}
        </div>

        {/* Pagination */}
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
