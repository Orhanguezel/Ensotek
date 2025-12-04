// =============================================================
// FILE: src/components/admin/services/ServicesHeader.tsx
// Ensotek – Admin Services Header (filtreler + özet)
//  - Dinamik kategori / alt kategori (module_key = "services")
//  - Locale'e göre i18n isimler
// =============================================================

import React, { useMemo } from "react";
import type { BoolLike } from "@/integrations/types/services.types";
import type { LocaleOption } from "@/components/admin/custompage/CustomPageHeader";

import type { CategoryDto } from "@/integrations/types/category.types";
import type { SubCategoryDto } from "@/integrations/types/subcategory.types";

import { useListCategoriesAdminQuery } from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";
import { useListSubCategoriesAdminQuery } from "@/integrations/rtk/endpoints/admin/subcategories_admin.endpoints";

export type ServicesFilterState = {
  q?: string;
  category_id?: string;
  sub_category_id?: string;
  is_active?: BoolLike;
  featured?: BoolLike;
  locale?: string;
};

export type ServicesHeaderProps = {
  loading: boolean;
  total: number;
  filters: ServicesFilterState;
  onChangeFilters: (patch: Partial<ServicesFilterState>) => void;
  onRefresh?: () => void;
  onCreateNew?: () => void;
  locales: LocaleOption[];
  localesLoading?: boolean;
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

type CategoryOption = {
  value: string;
  label: string;
};

export const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  loading,
  total,
  filters,
  onChangeFilters,
  onRefresh,
  onCreateNew,
  locales,
  localesLoading,
}) => {
  const handleReset = () => {
    onChangeFilters({
      q: undefined,
      category_id: undefined,
      sub_category_id: undefined,
      is_active: undefined,
      featured: undefined,
      locale: undefined,
    });
  };

  const activeValue = boolLikeToSelectValue(filters.is_active);
  const featuredValue = boolLikeToSelectValue(filters.featured);

  /* -------------------- Kategori / Alt kategori (services modülü) -------------------- */

  const categoryQueryParams = useMemo(
    () => ({
      locale: filters.locale || undefined,
      module_key: "services",
      limit: 500,
      offset: 0,
    }),
    [filters.locale],
  );

  const {
    data: categoryRows,
    isLoading: isCategoriesLoading,
  } = useListCategoriesAdminQuery(categoryQueryParams as any);

  const categoryOptions: CategoryOption[] = useMemo(
    () =>
      (categoryRows ?? []).map((c: CategoryDto) => ({
        value: c.id,
        label:
          (c as any).name ||
          (c as any).slug ||
          (c as any).name_default ||
          c.id,
      })),
    [categoryRows],
  );

  const subCategoryQueryParams = useMemo(
    () => ({
      locale: filters.locale || undefined,
      category_id: filters.category_id || undefined,
      limit: 500,
      offset: 0,
    }),
    [filters.locale, filters.category_id],
  );

  const {
    data: subCategoryRows,
    isLoading: isSubCategoriesLoading,
  } = useListSubCategoriesAdminQuery(subCategoryQueryParams as any);

  const subCategoryOptions: CategoryOption[] = useMemo(
    () =>
      (subCategoryRows ?? []).map((sc: SubCategoryDto) => ({
        value: sc.id,
        label:
          (sc as any).name ||
          (sc as any).slug ||
          (sc as any).name_default ||
          sc.id,
      })),
    [subCategoryRows],
  );

  const categoriesDisabled = loading || isCategoriesLoading;
  const subCategoriesDisabled =
    loading || isSubCategoriesLoading || !filters.category_id;

  /* -------------------- Render -------------------- */

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
                  Ensotek endüstriyel soğutma kulesi hizmetlerini (üretim,
                  bakım, modernizasyon, mühendislik desteği vb.) yönet.
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
              {/* Arama */}
              <div className="col-sm-6 col-md-3">
                <label className="form-label small mb-1">
                  Ara (isim / slug / açıklama)
                </label>
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Örn: bakım, modernizasyon, üretim..."
                  value={filters.q ?? ""}
                  onChange={(e) =>
                    onChangeFilters({
                      q: e.target.value || undefined,
                    })
                  }
                />
              </div>

              {/* Dil */}
              <div className="col-sm-6 col-md-3">
                <label className="form-label small mb-1">Dil</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.locale ?? ""}
                  onChange={(e) =>
                    onChangeFilters({
                      locale: e.target.value || undefined,
                      // locale değişince alt seçimleri koruyabilirsin;
                      // istersen burada category_id / sub_category_id'yi de sıfırlayabilirsin.
                    })
                  }
                  disabled={localesLoading && !locales.length}
                >
                  <option value="">Tüm diller</option>
                  {locales.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {localesLoading && (
                  <div className="form-text small">
                    Diller yükleniyor...
                  </div>
                )}
              </div>

              {/* Kategori (services) */}
              <div className="col-sm-6 col-md-3">
                <label className="form-label small mb-1">
                  Kategori (Hizmet)
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.category_id ?? ""}
                  onChange={(e) =>
                    onChangeFilters({
                      category_id: e.target.value || undefined,
                      sub_category_id: undefined,
                    })
                  }
                  disabled={categoriesDisabled}
                >
                  <option value="">Tüm kategoriler</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {isCategoriesLoading && (
                  <div className="form-text small">
                    Kategoriler yükleniyor...
                  </div>
                )}
              </div>

              {/* Alt kategori */}
              <div className="col-sm-6 col-md-3">
                <label className="form-label small mb-1">Alt kategori</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.sub_category_id ?? ""}
                  onChange={(e) =>
                    onChangeFilters({
                      sub_category_id: e.target.value || undefined,
                    })
                  }
                  disabled={subCategoriesDisabled}
                >
                  <option value="">Tüm alt kategoriler</option>
                  {subCategoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {isSubCategoriesLoading && (
                  <div className="form-text small">
                    Alt kategoriler yükleniyor...
                  </div>
                )}
              </div>

              {/* Durum */}
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

              {/* Öne çıkan */}
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
