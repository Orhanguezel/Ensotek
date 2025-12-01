// =============================================================
// FILE: src/components/admin/services/ServicesHeader.tsx
// Ensotek – Admin Services Header (filtreler + özet)
// =============================================================

import React from "react";
import type {
  BoolLike,
  ServiceType,
} from "@/integrations/types/services.types";

export type ServicesFilterState = {
  q?: string;
  type?: ServiceType;
  is_active?: BoolLike;
  featured?: BoolLike;
};

export type ServicesHeaderProps = {
  loading: boolean;
  total: number;
  filters: ServicesFilterState;
  onChangeFilters: (patch: Partial<ServicesFilterState>) => void;
  onRefresh?: () => void;
  onCreateNew?: () => void;
};

const boolLikeToSelectValue = (v: BoolLike | undefined): string => {
  if (v === undefined) return "";
  if (v === true || v === 1 || v === "1" || v === "true") return "1";
  if (v === false || v === 0 || v === "0" || v === "false") return "0";
  return "";
};

const selectValueToBoolLike = (v: string): BoolLike | undefined => {
  if (v === "") return undefined;
  if (v === "1") return 1;
  if (v === "0") return 0;
  return undefined;
};

export const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  loading,
  total,
  filters,
  onChangeFilters,
  onRefresh,
  onCreateNew,
}) => {
  const handleReset = () => {
    onChangeFilters({
      q: undefined,
      type: undefined,
      is_active: undefined,
      featured: undefined,
    });
  };

  const activeValue = boolLikeToSelectValue(filters.is_active);
  const featuredValue = boolLikeToSelectValue(filters.featured);

  return (
    <div className="card mb-3">
      <div className="card-body py-3">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
          {/* Sol taraf: başlık + arama */}
          <div style={{ minWidth: 0, flex: 2 }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h5 className="mb-0 small fw-semibold">
                  Hizmetler (Services) Yönetimi
                </h5>
                <div className="text-muted small">
                  Mezarlık hizmetleri, bahçe bakımı, toprak dolgusu vb. kayıtları
                  yönet.
                </div>
              </div>
              <div className="text-end d-none d-lg-block">
                <div className="small text-muted">
                  Toplam kayıt:
                  <span className="fw-semibold ms-1">{total}</span>
                </div>
                {loading && (
                  <span className="badge bg-secondary mt-1">Yükleniyor...</span>
                )}
              </div>
            </div>

            <div className="row g-2 align-items-end">
              <div className="col-sm-6 col-md-5">
                <label className="form-label small mb-1">Ara (isim / slug / açıklama)</label>
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Örn: bahçe bakımı, toprak, sulama..."
                  value={filters.q ?? ""}
                  onChange={(e) =>
                    onChangeFilters({
                      q: e.target.value || undefined,
                    })
                  }
                />
              </div>

              <div className="col-sm-6 col-md-3">
                <label className="form-label small mb-1">Hizmet tipi</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.type ?? ""}
                  onChange={(e) =>
                    onChangeFilters({
                      type: (e.target.value || undefined) as ServiceType | undefined,
                    })
                  }
                >
                  <option value="">Tümü</option>
                  <option value="gardening">Gardening / Bahçe</option>
                  <option value="soil">Soil / Toprak</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div className="col-sm-6 col-md-2">
                <label className="form-label small mb-1">Durum</label>
                <select
                  className="form-select form-select-sm"
                  value={activeValue}
                  onChange={(e) =>
                    onChangeFilters({
                      is_active: selectValueToBoolLike(e.target.value),
                    })
                  }
                >
                  <option value="">Hepsi</option>
                  <option value="1">Sadece aktif</option>
                  <option value="0">Sadece pasif</option>
                </select>
              </div>

              <div className="col-sm-6 col-md-2">
                <label className="form-label small mb-1">Öne çıkan</label>
                <select
                  className="form-select form-select-sm"
                  value={featuredValue}
                  onChange={(e) =>
                    onChangeFilters({
                      featured: selectValueToBoolLike(e.target.value),
                    })
                  }
                >
                  <option value="">Hepsi</option>
                  <option value="1">Öne çıkanlar</option>
                  <option value="0">Diğerleri</option>
                </select>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleReset}
                disabled={loading}
              >
                Filtreleri temizle
              </button>
              {onRefresh && (
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={onRefresh}
                  disabled={loading}
                >
                  Yenile
                </button>
              )}
            </div>
          </div>

          {/* Sağ taraf: toplam + yeni ekle */}
          <div
            className="border-top pt-2 mt-2 d-flex flex-row justify-content-between align-items-center gap-2 flex-lg-column border-lg-start pt-lg-0 mt-lg-0"
            style={{ minWidth: 0, flex: 1 }}
          >
            <div className="d-block d-lg-none">
              <div className="small text-muted">
                Toplam kayıt:
                <span className="fw-semibold ms-1">{total}</span>
              </div>
              {loading && (
                <span className="badge bg-secondary mt-1">Yükleniyor...</span>
              )}
            </div>

            <div className="ms-lg-auto">
              {onCreateNew && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onCreateNew}
                  disabled={loading}
                >
                  + Yeni Hizmet Ekle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
