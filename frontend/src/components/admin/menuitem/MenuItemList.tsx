// =============================================================
// FILE: src/components/admin/menuitem/MenuItemList.tsx
// Ensotek – Admin Menu Items Table (drag & drop + responsive)
// =============================================================

import React, { useEffect, useState } from "react";
import type { AdminMenuItemDto } from "@/integrations/types/menu_items.types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export type MenuItemListProps = {
  items?: AdminMenuItemDto[];
  loading: boolean;

  onEdit?: (item: AdminMenuItemDto) => void;
  onDelete?: (item: AdminMenuItemDto) => void;

  // Aktif toggle etmek istersen opsiyonel
  onToggleActive?: (item: AdminMenuItemDto, value: boolean) => void;

  // Sürükle-bırak sonrası yeni sıra
  onReorder?: (next: AdminMenuItemDto[]) => void;

  // "Sıralamayı Kaydet" butonu için
  onSaveOrder?: () => void;
  savingOrder?: boolean;
};

const PAGE_SIZE = 50;

const fmtDate = (value?: string | null) => {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("tr-TR");
  } catch {
    return value ?? "-";
  }
};

const fmtLocation = (loc?: string | null) => {
  if (loc === "header") return "Header";
  if (loc === "footer") return "Footer";
  return loc ?? "-";
};

const formatText = (v: unknown, max = 80): string => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + "...";
};

export const MenuItemList: React.FC<MenuItemListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
  onSaveOrder,
  savingOrder,
}) => {
  const rows = items || [];
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

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

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

  const handleDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: AdminMenuItemDto,
  ) => {
    e.stopPropagation();
    onDelete?.(item);
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex align-items-center justify-content-between">
        <span className="small fw-semibold">Menü Öğeleri</span>
        <div className="d-flex align-items-center gap-2">
          {loading && (
            <span className="badge bg-secondary">Yükleniyor...</span>
          )}
          {onSaveOrder && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={onSaveOrder}
              disabled={savingOrder || !hasData}
            >
              {savingOrder
                ? "Sıralama kaydediliyor..."
                : "Sıralamayı Kaydet"}
            </button>
          )}
        </div>
      </div>

      <div className="card-body p-0">
        {/* ========= Desktop / Tablet (md ve üstü) – Table görünümü ========= */}
        <div className="d-none d-md-block">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ width: "6%" }} />
                <th style={{ width: "20%" }}>Başlık</th>
                <th style={{ width: "22%" }}>URL</th>
                <th style={{ width: "10%" }}>Tür</th>
                <th style={{ width: "10%" }}>Konum</th>
                <th style={{ width: "8%" }}>Aktif</th>
                <th style={{ width: "10%" }}>Locale</th>
                <th style={{ width: "14%" }}>Oluşturulma</th>
                <th style={{ width: "10%" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                pageRows.map((item, index) => {
                  const globalIndex = startIndex + index; // 0-based

                  return (
                    <tr
                      key={item.id}
                      draggable={!!onReorder}
                      onDragStart={
                        onReorder ? () => handleDragStart(item.id) : undefined
                      }
                      onDragEnd={onReorder ? handleDragEnd : undefined}
                      onDragOver={
                        onReorder
                          ? (e) => {
                              e.preventDefault();
                            }
                          : undefined
                      }
                      onDrop={onReorder ? () => handleDropOn(item.id) : undefined}
                      className={
                        draggingId === item.id ? "table-active" : undefined
                      }
                      style={{
                        cursor: onReorder ? "move" : "pointer",
                      }}
                      onClick={() => onEdit?.(item)}
                    >
                      <td className="text-muted small align-middle">
                        {/* Drag handle + display_order */}
                        {onReorder && <span className="me-1">≡</span>}
                        <span className="me-1">#{globalIndex + 1}</span>
                        <span className="badge bg-secondary-subtle text-muted border">
                          {item.display_order ?? 0}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="fw-semibold small">
                          {item.title || "-"}
                        </div>
                        {item.icon && (
                          <div className="text-muted small">
                            <span className="me-1">Icon:</span>
                            <code>{item.icon}</code>
                          </div>
                        )}
                      </td>
                      <td className="align-middle text-muted small">
                        {item.url ? (
                          <span title={item.url}>
                            {formatText(item.url, 40)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="align-middle">
                        <span className="badge bg-light text-muted border small">
                          {item.type === "page" ? "Sayfa" : "Özel URL"}
                        </span>
                      </td>
                      <td className="align-middle text-muted small">
                        {fmtLocation(item.location)}
                      </td>
                      <td className="align-middle">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={!!item.is_active}
                            onChange={(e) =>
                              onToggleActive &&
                              onToggleActive(item, e.target.checked)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </td>
                      <td className="align-middle text-muted small">
                        {item.locale || <span className="text-muted">-</span>}
                      </td>
                      <td className="align-middle text-muted small">
                        {fmtDate(item.created_at)}
                      </td>
                      <td className="align-middle text-end">
                        <div className="d-inline-flex gap-1">
                          {onEdit && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(item);
                              }}
                            >
                              Düzenle
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={(e) => handleDeleteClick(e, item)}
                              disabled={loading}
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
                      Henüz menü öğesi oluşturulmamış.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <caption className="px-3 py-2 text-start">
              <span className="text-muted small">
                Satırları sürükleyip bırakarak menü öğelerinin sırasını
                değiştirebilirsin. Değişiklikleri kalıcı yapmak için{" "}
                <strong>&quot;Sıralamayı Kaydet&quot;</strong> butonunu
                kullanman gerekir.
              </span>
            </caption>
          </table>
        </div>

        {/* ========= Mobil (sm ve altı) – Card görünümü ========= */}
        <div className="d-block d-md-none">
          {hasData ? (
            pageRows.map((item, index) => {
              const globalIndex = startIndex + index;

              return (
                <div
                  key={item.id}
                  className="border-bottom px-3 py-2"
                  draggable={!!onReorder}
                  onDragStart={
                    onReorder ? () => handleDragStart(item.id) : undefined
                  }
                  onDragEnd={onReorder ? handleDragEnd : undefined}
                  onDragOver={
                    onReorder
                      ? (e) => {
                          e.preventDefault();
                        }
                      : undefined
                  }
                  onDrop={onReorder ? () => handleDropOn(item.id) : undefined}
                  style={{ cursor: onReorder ? "move" : "pointer" }}
                  onClick={() => onEdit?.(item)}
                >
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-semibold small">
                        <span className="text-muted me-1">
                          #{globalIndex + 1}
                        </span>
                        {item.title || "-"}
                      </div>
                      <div className="text-muted small">
                        <span className="me-1">Tür:</span>
                        <span className="badge bg-light text-dark border">
                          {item.type === "page" ? "Sayfa" : "Özel URL"}
                        </span>
                      </div>
                      <div className="text-muted small mt-1">
                        <span className="me-1">URL:</span>
                        {item.url ? (
                          <code>{formatText(item.url, 40)}</code>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </div>
                      <div className="text-muted small mt-1">
                        <span className="me-1">Konum:</span>
                        {fmtLocation(item.location)}
                        <span className="ms-2 me-1">Dil:</span>
                        {item.locale || (
                          <span className="text-muted">-</span>
                        )}
                      </div>
                      <div className="text-muted small mt-1">
                        <span className="me-1">Oluşturulma:</span>
                        {fmtDate(item.created_at)}
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-end gap-1">
                      <div className="form-check form-switch small">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={!!item.is_active}
                          onChange={(e) =>
                            onToggleActive &&
                            onToggleActive(item, e.target.checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label className="form-check-label">Aktif</label>
                      </div>
                      <div className="d-flex gap-1 mt-1">
                        {onEdit && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(item);
                            }}
                          >
                            Düzenle
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item);
                            }}
                            disabled={loading}
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
              Henüz menü öğesi oluşturulmamış.
            </div>
          )}

          <div className="px-3 py-2 border-top">
            <span className="text-muted small">
              Mobil görünümde kayıtlar kart formatında listelenir. Kartları
              sürükleyerek sıralamayı değiştirebilirsin. Değişiklikleri kalıcı
              yapmak için üstteki{" "}
              <strong>Sıralamayı Kaydet</strong> butonunu kullan.
            </span>
          </div>
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
