// =============================================================
// FILE: src/components/admin/menuitem/MenuItemForm.tsx
// Ensotek – Admin Menu Item Create / Edit Form (locale aware)
// Form-only, state/submit yok; state parent'ta tutuluyor
// =============================================================

"use client";

import React from "react";
import type {
  MenuLocation,
  MenuItemType,
} from "@/integrations/types/menu_items.types";

export type MenuItemFormValues = {
  title: string;
  url: string;
  type: MenuItemType;
  page_id: string | null;
  parent_id: string | null;
  location: MenuLocation;
  icon: string;
  section_id: string | null;
  is_active: boolean;
  display_order: number;
  locale: string;
};

export type MenuItemFormProps = {
  mode: "create" | "edit";
  values: MenuItemFormValues;
  saving: boolean;
  loading?: boolean;
  localeOptions: { value: string; label: string }[];
  localesLoading?: boolean;
  onChange: (field: keyof MenuItemFormValues, value: any) => void;
};

export const MenuItemForm: React.FC<MenuItemFormProps> = ({
  mode,
  values,
  saving,
  loading,
  localeOptions,
  localesLoading,
  onChange,
}) => {
  const disabled = saving || loading;

  const handleChange =
    (field: keyof MenuItemFormValues) =>
      (
        e:
          | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
          | React.ChangeEvent<HTMLTextAreaElement>,
      ) => {
        const target = e.target as HTMLInputElement;
        let value: any = target.value;

        if (field === "is_active") {
          value = (target as HTMLInputElement).checked;
        } else if (field === "display_order") {
          const n = Number(value);
          value = Number.isFinite(n) ? n : 0;
        }

        onChange(field, value);
      };

  return (
    <div className="row g-3">
      {/* Başlık */}
      <div className="col-md-6">
        <label className="form-label form-label-sm">
          Başlık <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={values.title}
          onChange={handleChange("title")}
          disabled={disabled}
          required
        />
      </div>

      {/* Locale – dinamik select (app_locales) */}
      <div className="col-md-3">
        <label className="form-label form-label-sm">Locale</label>
        <select
          className="form-select form-select-sm"
          value={values.locale}
          onChange={handleChange("locale")}
          disabled={disabled || localesLoading}
        >
          <option value="">Seçiniz...</option>
          {localeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="form-text">
          Değerler <code>app_locales</code> ayarından gelir (site_settings).
        </div>
      </div>

      {/* Sıra */}
      <div className="col-md-3">
        <label className="form-label form-label-sm">Görünüm Sırası</label>
        <input
          type="number"
          className="form-control form-control-sm"
          value={values.display_order}
          onChange={handleChange("display_order")}
          disabled={disabled}
          min={0}
        />
      </div>

      {/* Tür */}
      <div className="col-md-3">
        <label className="form-label form-label-sm">
          Tür <span className="text-danger">*</span>
        </label>
        <select
          className="form-select form-select-sm"
          value={values.type}
          onChange={handleChange("type")}
          disabled={disabled}
        >
          <option value="custom">Özel URL</option>
          <option value="page">Sayfa</option>
        </select>
      </div>

      {/* Konum */}
      <div className="col-md-3">
        <label className="form-label form-label-sm">
          Konum <span className="text-danger">*</span>
        </label>
        <select
          className="form-select form-select-sm"
          value={values.location}
          onChange={handleChange("location")}
          disabled={disabled}
        >
          <option value="header">Header</option>
          <option value="footer">Footer</option>
        </select>
      </div>

      {/* URL */}
      <div className="col-md-6">
        <label className="form-label form-label-sm">
          URL{" "}
          {values.type === "custom" && (
            <span className="text-danger">*</span>
          )}
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder={
            values.type === "custom"
              ? "https://... veya /ornek"
              : "Sayfa tipi için opsiyonel"
          }
          value={values.url}
          onChange={handleChange("url")}
          disabled={disabled}
        />
        <div className="form-text">
          Tür <code>custom</code> ise URL zorunludur.
        </div>
      </div>

      {/* Icon */}
      <div className="col-md-6">
        <label className="form-label form-label-sm">İkon</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Bootstrap / custom icon class"
          value={values.icon}
          onChange={handleChange("icon")}
          disabled={disabled}
        />
      </div>

      {/* Aktif checkbox */}
      <div className="col-md-3 d-flex align-items-end">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="menuitem-active-switch"
            checked={values.is_active}
            onChange={handleChange("is_active")}
            disabled={disabled}
          />
          <label
            className="form-check-label small"
            htmlFor="menuitem-active-switch"
          >
            Aktif
          </label>
        </div>
      </div>

      {/* Not: page_id / parent_id / section_id sadece JSON modunda */}
      <div className="col-12">
        <div className="form-text small text-muted">
          <code>page_id</code>, <code>parent_id</code> ve{" "}
          <code>section_id</code> alanları gelişmiş kullanım içindir ve sadece{" "}
          <strong>JSON modunda</strong> düzenlenebilir.
        </div>
      </div>
    </div>
  );
};
