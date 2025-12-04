// =============================================================
// FILE: src/components/admin/products/ProductsList.tsx
// Ensotek – Admin Products Listesi (drag & drop + pagination)
// =============================================================

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { ProductDto } from "@/integrations/types/product.types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export type ProductsListProps = {
  items?: ProductDto[];
  loading: boolean;
  onDelete?: (item: ProductDto) => void;

  // drag & drop reorder desteği
  onReorder?: (next: ProductDto[]) => void;
  onSaveOrder?: () => void;
  savingOrder?: boolean;
};

const PAGE_SIZE = 20;

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

const formatPrice = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "-";
  return `${value.toFixed(2)} ₺`;
};

export const ProductsList: React.FC<ProductsListProps> = ({
  items,
  loading,
  onDelete,
  onReorder,
  onSaveOrder,
  savingOrder,
}) => {
  const rows = items ?? [];
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

  const handleDelete = (p: ProductDto) => {
    if (!onDelete) return;
    const ok = window.confirm(
      `Bu ürünü silmek üzeresin.\n\n` +
        `Başlık: ${p.title}\n` +
        `Slug: ${p.slug}\n\n` +
        `Devam etmek istiyor musun?`,
    );
    if (!ok) return;
    onDelete(p);
  };

  /* ---------- Drag & Drop ---------- */

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

  return (
    <div className="card">
      <div className="card-header py-2 d-flex align-items-center justify-content-between">
        <span className="small fw-semibold">Ürün Listesi</span>
        <div className="d-flex align-items-center gap-2">
          {busy && (
            <span className="badge bg-secondary small">
              İşlem yapılıyor...
            </span>
          )}
          {onSaveOrder && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={onSaveOrder}
              disabled={savingOrder || !hasData}
            >
              {savingOrder ? "Sıralama kaydediliyor..." : "Sıralamayı Kaydet"}
            </button>
          )}
          <span className="text-muted small">
            Toplam: <strong>{totalItems}</strong>
          </span>
        </div>
      </div>

      <div className="card-body p-0">
        {/* ========= Desktop / Tablet – Table görünümü ========= */}
        <div className="d-none d-md-block">
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "5%" }} />
                  <th style={{ width: "24%" }}>Başlık</th>
                  <th style={{ width: "14%" }}>Slug</th>
                  <th style={{ width: "10%" }}>Fiyat</th>
                  <th style={{ width: "8%" }}>Stok</th>
                  <th style={{ width: "6%" }}>Dil</th>
                  <th style={{ width: "10%" }}>Durum</th>
                  <th style={{ width: "14%" }}>Tarih</th>
                  <th style={{ width: "9%" }} className="text-end">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="text-center text-muted small py-3">
                        Ürünler yükleniyor...
                      </div>
                    </td>
                  </tr>
                ) : hasData ? (
                  pageRows.map((p, index) => {
                    const globalIndex = startIndex + index;
                    return (
                      <tr
                        key={p.id}
                        draggable={!!onReorder}
                        onDragStart={() => onReorder && handleDragStart(p.id)}
                        onDragEnd={onReorder ? handleDragEnd : undefined}
                        onDragOver={
                          onReorder
                            ? (e) => e.preventDefault()
                            : undefined
                        }
                        onDrop={
                          onReorder ? () => handleDropOn(p.id) : undefined
                        }
                        className={
                          draggingId === p.id ? "table-active" : undefined
                        }
                        style={
                          onReorder ? { cursor: "move" } : { cursor: "default" }
                        }
                      >
                        <td className="text-muted small">
                          {onReorder && <span className="me-1">≡</span>}
                          <span>{globalIndex + 1}</span>
                        </td>
                        <td className="small">
                          <div className="fw-semibold text-truncate">
                            {p.title}
                          </div>
                          {p.product_code && (
                            <div className="text-muted small">
                              Kod: <code>{p.product_code}</code>
                            </div>
                          )}
                        </td>
                        <td className="small">
                          <div
                            className="text-truncate"
                            style={{ maxWidth: 200 }}
                          >
                            <code>{p.slug}</code>
                          </div>
                        </td>
                        <td className="small">{formatPrice(p.price)}</td>
                        <td className="small">{p.stock_quantity}</td>
                        <td className="small">
                          <code>{p.locale}</code>
                        </td>
                        <td className="small">
                          <div className="d-flex flex-column gap-1">
                            {p.is_active ? (
                              <span className="badge bg-success-subtle text-success border border-success-subtle">
                                Aktif
                              </span>
                            ) : (
                              <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                                Pasif
                              </span>
                            )}
                            {p.is_featured && (
                              <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                                Öne çıkan
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="small">
                          <div>{formatDate(p.created_at)}</div>
                          <div className="text-muted small">
                            Güncelleme: {formatDate(p.updated_at)}
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <Link
                              href={`/admin/products/${encodeURIComponent(
                                p.id,
                              )}`}
                              className="btn btn-outline-primary btn-sm"
                            >
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
              <caption className="px-3 py-2 text-start">
                <span className="text-muted small">
                  Satırları sürükleyip bırakarak sıralamayı değiştirebilirsin.
                  Değişiklikleri kalıcı yapmak için{" "}
                  <strong>&quot;Sıralamayı Kaydet&quot;</strong> butonunu
                  kullanman gerekir.
                </span>
              </caption>
            </table>
          </div>
        </div>

        {/* ========= Mobil – Card görünümü ========= */}
        <div className="d-block d-md-none">
          {loading ? (
            <div className="px-3 py-3 text-center text-muted small">
              Ürünler yükleniyor...
            </div>
          ) : hasData ? (
            pageRows.map((p, index) => {
              const globalIndex = startIndex + index;
              return (
                <div
                  key={p.id}
                  className="border-bottom px-3 py-2"
                  draggable={!!onReorder}
                  onDragStart={() => onReorder && handleDragStart(p.id)}
                  onDragEnd={onReorder ? handleDragEnd : undefined}
                  onDragOver={
                    onReorder ? (e) => e.preventDefault() : undefined
                  }
                  onDrop={onReorder ? () => handleDropOn(p.id) : undefined}
                  style={
                    onReorder ? { cursor: "move" } : { cursor: "default" }
                  }
                >
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-semibold small">
                        {onReorder && (
                          <span className="text-muted me-1">≡</span>
                        )}
                        <span className="text-muted me-1">
                          #{globalIndex + 1}
                        </span>
                        {p.title}
                      </div>
                      <div className="text-muted small">
                        <code>{p.slug}</code>
                      </div>
                      {p.product_code && (
                        <div className="text-muted small mt-1">
                          Kod: <code>{p.product_code}</code>
                        </div>
                      )}
                      <div className="text-muted small mt-1">
                        <span className="me-1">Fiyat:</span>
                        {formatPrice(p.price)}
                        <span className="ms-2 me-1">Stok:</span>
                        {p.stock_quantity}
                      </div>
                      <div className="text-muted small mt-1">
                        <span className="me-1">Dil:</span>
                        <code>{p.locale}</code>
                      </div>
                      <div className="text-muted small mt-1">
                        <span className="me-1">Oluşturma:</span>
                        {formatDate(p.created_at)}
                      </div>
                      <div className="text-muted small">
                        <span className="me-1">Güncelleme:</span>
                        {formatDate(p.updated_at)}
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-end gap-1">
                      <div className="d-flex flex-column gap-1">
                        <span
                          className={
                            "badge border small " +
                            (p.is_active
                              ? "bg-success-subtle text-success border-success-subtle"
                              : "bg-secondary-subtle text-secondary border-secondary-subtle")
                          }
                        >
                          {p.is_active ? "Aktif" : "Pasif"}
                        </span>
                        {p.is_featured && (
                          <span className="badge bg-warning-subtle text-warning border border-warning-subtle small">
                            Öne çıkan
                          </span>
                        )}
                      </div>
                      <div className="d-flex gap-1 mt-1">
                        <Link
                          href={`/admin/products/${encodeURIComponent(p.id)}`}
                          className="btn btn-outline-primary btn-sm"
                        >
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
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-3 py-3 text-center text-muted small">
              Henüz kayıtlı ürün bulunmuyor.
            </div>
          )}

          <div className="px-3 py-2 border-top">
            <span className="text-muted small">
              Kartları sürükleyip bırakarak sıralamayı değiştirebilirsin.
              Değişiklikleri kaydetmek için{" "}
              <strong>Sıralamayı Kaydet</strong> butonunu kullan.
            </span>
          </div>
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
