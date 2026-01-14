// =============================================================
// FILE: src/components/admin/support/SupportHeader.tsx
// Ensotek – Admin Support Tickets Header / Filters
// =============================================================

import React from "react";
import type {
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/integrations/types";

export type SupportFilters = {
  search: string;
  status: "all" | SupportTicketStatus;
  priority: "all" | SupportTicketPriority;
  sort: "created_at" | "updated_at";
  order: "asc" | "desc";
};

export type SupportHeaderProps = {
  filters: SupportFilters;
  total: number;
  loading: boolean;
  onFiltersChange: (next: SupportFilters) => void;
  // RTK Query refetch ile uyumlu olacak şekilde gevşek tip
  onRefresh: () => unknown;
};

export const SupportHeader: React.FC<SupportHeaderProps> = ({
  filters,
  total,
  loading,
  onFiltersChange,
  onRefresh,
}) => {
  const handleInputChange =
    (field: keyof SupportFilters) =>
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
            <h5 className="mb-1 small fw-semibold">Destek Talepleri</h5>
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
                placeholder="Konu / mesaj içinde ara..."
                value={filters.search}
                onChange={handleInputChange("search")}
                disabled={loading}
              />
            </div>

            {/* Durum filtresi */}
            <select
              className="form-select form-select-sm"
              value={filters.status}
              onChange={handleInputChange("status")}
              disabled={loading}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="open">Açık</option>
              <option value="in_progress">İşlemde</option>
              <option value="waiting_response">Yanıt Bekleniyor</option>
              <option value="closed">Kapalı</option>
            </select>

            {/* Öncelik filtresi */}
            <select
              className="form-select form-select-sm"
              value={filters.priority}
              onChange={handleInputChange("priority")}
              disabled={loading}
            >
              <option value="all">Tüm Öncelikler</option>
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
              <option value="urgent">Acil</option>
            </select>

            {/* Sıralama alanı */}
            <select
              className="form-select form-select-sm"
              value={filters.sort}
              onChange={handleInputChange("sort")}
              disabled={loading}
            >
              <option value="created_at">Oluşturulma Tarihi</option>
              <option value="updated_at">Son Güncelleme</option>
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
              onClick={() => {
                void onRefresh();
              }}
            >
              Yenile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
