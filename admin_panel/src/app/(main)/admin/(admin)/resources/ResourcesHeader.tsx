// =============================================================
// FILE: src/components/admin/resources/ResourcesHeader.tsx
// guezelwebdesign – Admin Resources Header (Filters + Summary)
// FINAL — TR UI
// =============================================================

import type React from "react";

import type { ResourceType } from "@/integrations/shared/resources.types";

export type ResourcesFilters = {
  q: string;
  type: "" | ResourceType;
  status: "all" | "active" | "inactive";
  sort: "updated_at" | "created_at" | "title" | "type";
  order: "desc" | "asc";
};

export type ResourcesHeaderProps = {
  filters: ResourcesFilters;
  total: number;
  loading?: boolean;
  onFiltersChange: (next: ResourcesFilters) => void;
  onRefresh?: () => void;
};

const TYPE_LABEL: Record<string, string> = {
  therapist: "Terapist",
  doctor: "Doktor",
  table: "Masa",
  room: "Oda",
  staff: "Personel",
  other: "Diğer",
};

const ALL = "__all__" as const;

export const ResourcesHeader: React.FC<ResourcesHeaderProps> = ({
  filters,
  total,
  loading,
  onFiltersChange,
  onRefresh,
}) => {
  return (
    <div className="card mb-3">
      <div className="card-body py-3">
        <div className="d-flex justify-content-between flex-column flex-lg-row gap-3">
          <div style={{ minWidth: 0, flex: 2 }}>
            <div className="mb-2">
              <h5 className="small fw-semibold mb-0">Kaynaklar</h5>
              <div className="small text-muted">Kaynakları filtrele ve yönet.</div>
            </div>

            <div className="row g-2 align-items-end">
              <div className="col-md-4">
                <label className="form-label small mb-1">Arama</label>
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Ad ile ara"
                  value={filters.q}
                  onChange={(e) => onFiltersChange({ ...filters, q: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small mb-1">Tür</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.type}
                  onChange={(e) => onFiltersChange({ ...filters, type: (e.target.value as any) || "" })}
                >
                  <option value={ALL}>Tümü</option>
                  {(Object.keys(TYPE_LABEL) as Array<ResourceType>).map((k) => (
                    <option key={k} value={k}>
                      {TYPE_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small mb-1">Durum</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.status}
                  onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any })}
                >
                  <option value="all">Hepsi</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label small mb-1">Sırala</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.sort}
                  onChange={(e) => onFiltersChange({ ...filters, sort: e.target.value as any })}
                >
                  <option value="updated_at">Güncelleme</option>
                  <option value="created_at">Oluşturma</option>
                  <option value="title">Ad</option>
                  <option value="type">Tür</option>
                </select>
              </div>
            </div>

            <div className="row g-2 mt-0 align-items-end">
              <div className="col-md-2">
                <label className="form-label small mb-1">Yön</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.order}
                  onChange={(e) => onFiltersChange({ ...filters, order: e.target.value as any })}
                >
                  <option value="desc">Azalan</option>
                  <option value="asc">Artan</option>
                </select>
              </div>
            </div>
          </div>

          <div
            className="d-flex justify-content-between ms-lg-3 flex-column border-start ps-lg-3"
            style={{ minWidth: 0, flex: 1 }}
          >
            <div className="d-flex justify-content-between mb-2 align-items-center">
              <div>
                <div className="small fw-semibold">Toplam</div>
                <div className="display-6 fs-4 fw-bold">{total}</div>
              </div>

              {onRefresh ? (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onRefresh}
                  disabled={!!loading}
                >
                  Yenile
                </button>
              ) : null}
            </div>

            <div className="small text-muted">
              {loading ? <span className="badge bg-secondary">Yükleniyor...</span> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
