// =============================================================
// FILE: src/components/admin/faqs/FaqsHeader.tsx
// Admin FAQ Header (filtreler + aksiyonlar)
// =============================================================

import React from "react";

interface FaqsHeaderProps {
  search: string;
  onSearchChange: (v: string) => void;

  category: string;
  onCategoryChange: (v: string) => void;

  showOnlyActive: boolean;
  onShowOnlyActiveChange: (v: boolean) => void;

  orderBy: "created_at" | "updated_at" | "display_order";
  orderDir: "asc" | "desc";
  onOrderByChange: (
    v: "created_at" | "updated_at" | "display_order",
  ) => void;
  onOrderDirChange: (v: "asc" | "desc") => void;

  loading: boolean;
  onRefresh: () => void;
  onCreateClick: () => void;
}

export const FaqsHeader: React.FC<FaqsHeaderProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  showOnlyActive,
  onShowOnlyActiveChange,
  orderBy,
  orderDir,
  onOrderByChange,
  onOrderDirChange,
  loading,
  onRefresh,
  onCreateClick,
}) => {
  return (
    <div className="row align-items-center mb-3">
      <div className="col-md-4 mb-2 mb-md-0">
        <label className="form-label small mb-1">
          Ara (soru / slug / kategori)
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Ara..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="col-md-3 mb-2 mb-md-0">
        <label className="form-label small mb-1">
          Kategori (opsiyonel)
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Kategori filtresi..."
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
      </div>

      <div className="col-md-2 mb-2 mb-md-0">
        <label className="form-label small mb-1 d-block">
          Sıralama
        </label>
        <div className="d-flex gap-1">
          <select
            className="form-select form-select-sm"
            value={orderBy}
            onChange={(e) =>
              onOrderByChange(
                e.target.value as
                  | "created_at"
                  | "updated_at"
                  | "display_order",
              )
            }
          >
            <option value="display_order">Sıralama</option>
            <option value="created_at">Oluşturma</option>
            <option value="updated_at">Güncelleme</option>
          </select>
          <select
            className="form-select form-select-sm"
            value={orderDir}
            onChange={(e) =>
              onOrderDirChange(e.target.value as "asc" | "desc")
            }
          >
            <option value="asc">Artan</option>
            <option value="desc">Azalan</option>
          </select>
        </div>
      </div>

      <div className="col-md-3 d-flex flex-column flex-md-row justify-content-md-end align-items-md-center gap-2 mt-2 mt-md-0">
        <div className="form-check form-switch small">
          <input
            className="form-check-input"
            type="checkbox"
            id="faq-header-active"
            checked={showOnlyActive}
            onChange={(e) =>
              onShowOnlyActiveChange(e.target.checked)
            }
          />
          <label
            className="form-check-label ms-1"
            htmlFor="faq-header-active"
          >
            Sadece aktifler
          </label>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? "Yükleniyor..." : "Yenile"}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onCreateClick}
          >
            + Yeni Soru
          </button>
        </div>
      </div>
    </div>
  );
};
