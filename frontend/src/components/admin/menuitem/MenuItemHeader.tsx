// =============================================================
// FILE: src/components/admin/menuitem/MenuItemHeader.tsx
// Ensotek – Admin Menu Items Header / Filters
// =============================================================

import React from "react";

export type MenuItemFilters = {
  search: string;
  location: "all" | "header" | "footer";
  active: "all" | "active" | "inactive";
  sort: "display_order" | "created_at" | "title";
  order: "asc" | "desc";
};

export type MenuItemHeaderProps = {
  filters: MenuItemFilters;
  total: number;
  loading: boolean;
  onFiltersChange: (next: MenuItemFilters) => void;
  onRefresh: () => void;
  onCreateClick: () => void;
};

export const MenuItemHeader: React.FC<MenuItemHeaderProps> = ({
  filters,
  total,
  loading,
  onFiltersChange,
  onRefresh,
  onCreateClick,
}) => {
  const handleInputChange =
    (field: keyof MenuItemFilters) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value as any;
      onFiltersChange({ ...filters, [field]: value });
    };

  const handleOrderToggle = () => {
    onFiltersChange({
      ...filters,
      order: filters.order === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body py-3">
        <div className="d-flex flex-wrap align-items-center gap-3 justify-content-between">
          <div>
            <h5 className="mb-1 small fw-semibold">Menü Öğeleri</h5>
            <div className="text-muted small">
              Toplam{" "}
              <span className="fw-semibold">
                {Number.isFinite(total) ? total : 0}
              </span>{" "}
              kayıt görüntüleniyor.
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-end">
            {/* Arama */}
            <div
              className="input-group input-group-sm"
              style={{ minWidth: 220 }}
            >
              <span className="input-group-text">Ara</span>
              <input
                type="text"
                className="form-control"
                placeholder="Başlık / URL içinde ara..."
                value={filters.search}
                onChange={handleInputChange("search")}
                disabled={loading}
              />
            </div>

            {/* Konum filtresi */}
            <select
              className="form-select form-select-sm"
              value={filters.location}
              onChange={handleInputChange("location")}
              disabled={loading}
            >
              <option value="all">Tüm Konumlar</option>
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>

            {/* Aktif filtresi */}
            <select
              className="form-select form-select-sm"
              value={filters.active}
              onChange={handleInputChange("active")}
              disabled={loading}
            >
              <option value="all">Tümü (Aktif/Pasif)</option>
              <option value="active">Sadece Aktif</option>
              <option value="inactive">Sadece Pasif</option>
            </select>

            {/* Sıralama alanı */}
            <select
              className="form-select form-select-sm"
              value={filters.sort}
              onChange={handleInputChange("sort")}
              disabled={loading}
            >
              <option value="display_order">Sıra (display_order)</option>
              <option value="created_at">Oluşturulma Tarihi</option>
              <option value="title">Başlık</option>
            </select>

            {/* Sıralama yönü */}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={loading}
              onClick={handleOrderToggle}
            >
              {filters.order === "asc" ? "Artan ↑" : "Azalan ↓"}
            </button>

            {/* Yenile */}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              disabled={loading}
              onClick={onRefresh}
            >
              Yenile
            </button>

            {/* Yeni ekle */}
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={loading}
              onClick={onCreateClick}
            >
              + Yeni Menü Öğesi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
