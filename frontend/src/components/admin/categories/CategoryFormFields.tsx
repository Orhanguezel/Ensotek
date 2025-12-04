// =============================================================
// FILE: src/components/admin/categories/CategoryFormFields.tsx
// Kategori Form – Sol kolon (Form mode alanları)
// =============================================================

import React from "react";
import type { LocaleOption, ModuleOption } from "./CategoriesHeader";

export type CategoryFormStateLike = {
  locale: string;
  module_key: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
};

export type CategoryFormFieldsProps = {
  formState: CategoryFormStateLike;
  localeOptions: LocaleOption[];
  moduleOptions: ModuleOption[];

  disabled: boolean;
  isLocaleLoading: boolean;

  onLocaleChange: (nextLocale: string) => void;
  onFieldChange: (
    field: keyof CategoryFormStateLike,
    value: string | boolean | number,
  ) => void;
  onNameChange: (nameValue: string) => void;
  onSlugChange: (slugValue: string) => void;
};

export const CategoryFormFields: React.FC<CategoryFormFieldsProps> = ({
  formState,
  localeOptions,
  moduleOptions,
  disabled,
  isLocaleLoading,
  onLocaleChange,
  onFieldChange,
  onNameChange,
  onSlugChange,
}) => {
  return (
    <div className="row g-2">
      <div className="col-md-4">
        <label className="form-label small">Dil</label>
        <select
          className="form-select form-select-sm"
          value={formState.locale}
          onChange={(e) => onLocaleChange(e.target.value)}
          disabled={disabled || isLocaleLoading}
        >
          {localeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label small">Modül</label>
        <select
          className="form-select form-select-sm"
          value={formState.module_key}
          onChange={(e) => onFieldChange("module_key", e.target.value)}
          disabled={disabled}
        >
          {moduleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label small">Sıralama (display_order)</label>
        <input
          type="number"
          className="form-control form-control-sm"
          value={formState.display_order}
          onChange={(e) =>
            onFieldChange("display_order", Number(e.target.value) || 0)
          }
          disabled={disabled}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">Ad</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={formState.name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">Slug</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={formState.slug}
          onChange={(e) => onSlugChange(e.target.value)}
          disabled={disabled}
        />
        <div className="form-text small">
          İsim alanını doldururken otomatik oluşur, istersen slug&apos;ı manuel
          değiştirebilirsin.
        </div>
      </div>

      <div className="col-md-6">
        <label className="form-label small">Icon / Görsel URL</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={formState.icon}
          onChange={(e) => onFieldChange("icon", e.target.value)}
          disabled={disabled}
          placeholder="Örn: https://... veya /images/cat.jpg"
        />
        <div className="form-text small">
          Şimdilik bu alan hem ikon metni hem de görsel URL için kullanılıyor.
          Storage üzerinden yüklediğinde otomatik doldurulur.
        </div>
      </div>

      <div className="col-md-6 d-flex align-items-end">
        <div className="d-flex flex-wrap gap-3 small">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="form-active"
              checked={formState.is_active}
              onChange={(e) => onFieldChange("is_active", e.target.checked)}
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor="form-active">
              Aktif
            </label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="form-featured"
              checked={formState.is_featured}
              onChange={(e) =>
                onFieldChange("is_featured", e.target.checked)
              }
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor="form-featured">
              Öne çıkan
            </label>
          </div>
        </div>
      </div>

      <div className="col-12">
        <label className="form-label small">Açıklama (opsiyonel)</label>
        <textarea
          className="form-control form-control-sm"
          rows={4}
          value={formState.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
