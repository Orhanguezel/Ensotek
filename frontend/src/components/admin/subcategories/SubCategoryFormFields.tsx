// =============================================================
// FILE: src/components/admin/subcategories/SubCategoryFormFields.tsx
// Ensotek – Alt Kategori Form Alanları
// =============================================================

import React from "react";
import type {
  LocaleOption,
  CategoryOption,
} from "./SubCategoriesHeader";

export type SubCategoryFormStateLike = {
  category_id: string;
  locale: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
};

export type SubCategoryFormFieldsProps = {
  formState: SubCategoryFormStateLike;
  localeOptions: LocaleOption[];
  categoryOptions: CategoryOption[];
  disabled?: boolean;
  isLocaleLoading?: boolean;
  onLocaleChange: (locale: string) => void;
  onFieldChange: (
    field: keyof SubCategoryFormStateLike,
    value: string | boolean | number,
  ) => void;
  onNameChange: (name: string) => void;
  onSlugChange: (slug: string) => void;
};

export const SubCategoryFormFields: React.FC<
  SubCategoryFormFieldsProps
> = ({
  formState,
  localeOptions,
  categoryOptions,
  disabled,
  isLocaleLoading,
  onLocaleChange,
  onFieldChange,
  onNameChange,
  onSlugChange,
}) => {
  const handleChange =
    (field: keyof SubCategoryFormStateLike) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = e.target;
      const value =
        target.type === "checkbox"
          ? (target as HTMLInputElement).checked
          : target.value;
      onFieldChange(field, value);
    };

  return (
    <div className="row g-3">
      {/* Dil */}
      <div className="col-md-4">
        <label className="form-label small">
          Dil{" "}
          {isLocaleLoading && (
            <span className="ms-1 spinner-border spinner-border-sm" />
          )}
        </label>
        <select
          className="form-select form-select-sm"
          value={formState.locale}
          disabled={disabled}
          onChange={(e) => onLocaleChange(e.target.value)}
        >
          {localeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Üst kategori */}
      <div className="col-md-8">
        <label className="form-label small">Üst Kategori (category_id)</label>
        <select
          className="form-select form-select-sm"
          value={formState.category_id}
          disabled={disabled}
          onChange={(e) =>
            onFieldChange("category_id", e.target.value)
          }
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ad */}
      <div className="col-md-6">
        <label className="form-label small">Ad</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={formState.name}
          disabled={disabled}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      {/* Slug */}
      <div className="col-md-6">
        <label className="form-label small">Slug</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={formState.slug}
          disabled={disabled}
          onChange={(e) => onSlugChange(e.target.value)}
        />
        <div className="form-text small">
          URL için kullanılacak kısa ad. Dil başına farklı olabilir.
        </div>
      </div>

      {/* Icon */}
      <div className="col-md-6">
        <label className="form-label small">Icon (opsiyonel)</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={formState.icon}
          disabled={disabled}
          onChange={handleChange("icon")}
        />
      </div>

      {/* Flagler */}
      <div className="col-md-6 d-flex align-items-end">
        <div className="d-flex flex-wrap gap-3 small">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="subcat-active"
              checked={formState.is_active}
              disabled={disabled}
              onChange={handleChange("is_active")}
            />
            <label
              className="form-check-label"
              htmlFor="subcat-active"
            >
              Aktif
            </label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="subcat-featured"
              checked={formState.is_featured}
              disabled={disabled}
              onChange={handleChange("is_featured")}
            />
            <label
              className="form-check-label"
              htmlFor="subcat-featured"
            >
              Öne çıkan
            </label>
          </div>
        </div>
      </div>

      {/* Sıralama */}
      <div className="col-md-4">
        <label className="form-label small">
          Sıralama (display_order)
        </label>
        <input
          type="number"
          className="form-control form-control-sm"
          value={formState.display_order}
          disabled={disabled}
          onChange={(e) =>
            onFieldChange(
              "display_order",
              Number(e.target.value) || 0,
            )
          }
        />
      </div>

      {/* Açıklama */}
      <div className="col-12">
        <label className="form-label small">Açıklama (opsiyonel)</label>
        <textarea
          className="form-control form-control-sm"
          rows={4}
          value={formState.description}
          disabled={disabled}
          onChange={handleChange("description")}
        />
      </div>
    </div>
  );
};
