// =============================================================
// FILE: src/components/admin/subcategories/SubCategoriesList.tsx
// Ensotek – SubCategory Listesi (Bootstrap table + drag & drop + pagination)
// =============================================================

import React, { useEffect, useState } from "react";
import type { SubCategoryDto } from "@/integrations/types/subcategory.types";
import type { CategoryDto } from "@/integrations/types/category.types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export type SubCategoriesListProps = {
  items: SubCategoryDto[];
  loading: boolean;

  categoriesMap: Record<string, CategoryDto | undefined>;

  onEdit: (item: SubCategoryDto) => void;
  onDelete: (item: SubCategoryDto) => void;
  onToggleActive: (item: SubCategoryDto, value: boolean) => void;
  onToggleFeatured: (item: SubCategoryDto, value: boolean) => void;

  onReorder: (next: SubCategoryDto[]) => void;
  onSaveOrder: () => void;
  savingOrder: boolean;
};

const PAGE_SIZE = 20;

export const SubCategoriesList: React.FC<SubCategoriesListProps> = ({
  items,
  loading,
  categoriesMap,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onReorder,
  onSaveOrder,
  savingOrder,
}) => {
  const [dragId, setDragId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const totalItems = items.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // items sayısı değişince sayfa taşmasın
  useEffect(() => {
    setPage((prev) => {
      const maxPage = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
      return Math.min(prev, maxPage);
    });
  }, [items.length]);

  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pageItems = items.slice(startIndex, endIndex);

  const hasData = totalItems > 0;

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    id: string,
  ) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;

    const currentIndex = items.findIndex((i) => i.id === dragId);
    const targetIndex = items.findIndex((i) => i.id === targetId);
    if (currentIndex === -1 || targetIndex === -1) return;

    const next = [...items];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);

    onReorder(next);
    setDragId(null);
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
      <div className="card-header d-flex justify-content-between align-items-center py-2">
        <div className="small fw-semibold">Alt Kategori Listesi</div>
        <div className="d-flex align-items-center gap-2">
          {loading && (
            <span className="small text-muted d-flex align-items-center gap-1">
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              />
              <span>Yükleniyor...</span>
            </span>
          )}
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={onSaveOrder}
            disabled={!hasData || savingOrder}
          >
            {savingOrder ? "Sıralama kaydediliyor..." : "Sıralamayı Kaydet"}
          </button>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 32 }}>#</th>
                <th>Alt Kategori</th>
                <th>Kategori</th>
                <th>Dil</th>
                <th className="text-center">Aktif</th>
                <th className="text-center">Öne Çıkan</th>
                <th className="text-center" style={{ width: 90 }}>
                  Sıra
                </th>
                <th style={{ width: 120 }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {!hasData && (
                <tr>
                  <td colSpan={8} className="text-center py-4 small text-muted">
                    {loading
                      ? "Alt kategoriler yükleniyor..."
                      : "Henüz alt kategori bulunmuyor."}
                  </td>
                </tr>
              )}

              {pageItems.map((item, index) => {
                const category = categoriesMap[item.category_id];
                const categoryLabel = category
                  ? `${category.name} (${category.locale || "tr"})`
                  : item.category_id;

                const globalIndex = startIndex + index; // 0-based

                return (
                  <tr
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.id)}
                    style={{
                      cursor: "move",
                      opacity:
                        dragId && dragId === item.id ? 0.6 : 1,
                    }}
                  >
                    <td className="text-muted small align-middle">
                      <span className="me-1">≡</span>
                      {globalIndex + 1}
                    </td>
                    <td className="align-middle">
                      <div className="fw-semibold small">
                        {item.name}
                        {item.icon && (
                          <span className="text-muted ms-1">
                            <small>({item.icon})</small>
                          </span>
                        )}
                      </div>
                      <div className="text-muted small">
                        <code>{item.slug}</code>
                      </div>
                    </td>
                    <td className="align-middle small">{categoryLabel}</td>
                    <td className="align-middle small">
                      {item.locale || "tr"}
                    </td>
                    <td className="align-middle text-center">
                      <div className="form-check form-switch d-inline-flex">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={!!item.is_active}
                          onChange={(e) =>
                            onToggleActive(item, e.target.checked)
                          }
                        />
                      </div>
                    </td>
                    <td className="align-middle text-center">
                      <div className="form-check form-switch d-inline-flex">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={!!item.is_featured}
                          onChange={(e) =>
                            onToggleFeatured(item, e.target.checked)
                          }
                        />
                      </div>
                    </td>
                    <td className="align-middle text-center small">
                      {item.display_order ?? 0}
                    </td>
                    <td className="align-middle text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => onEdit(item)}
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDelete(item)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
