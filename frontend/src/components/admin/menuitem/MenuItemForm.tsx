// =============================================================
// FILE: src/components/admin/menuitem/MenuItemForm.tsx
// Ensotek – Admin Menu Item Create / Edit Form
// =============================================================

import React, { useEffect, useState } from "react";
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
  initialValues?: Partial<MenuItemFormValues>;
  loading: boolean;
  saving: boolean;
  onSubmit: (values: MenuItemFormValues) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  onCancel: () => void;
};

export const MenuItemForm: React.FC<MenuItemFormProps> = ({
  mode,
  initialValues,
  loading,
  saving,
  onSubmit,
  onDelete,
  onCancel,
}) => {
  const [values, setValues] = useState<MenuItemFormValues>(() => ({
    title: initialValues?.title ?? "",
    url: initialValues?.url ?? "",
    type: initialValues?.type ?? "custom",
    page_id: initialValues?.page_id ?? null,
    parent_id: initialValues?.parent_id ?? null,
    location: initialValues?.location ?? "header",
    icon: initialValues?.icon ?? "",
    section_id: initialValues?.section_id ?? null,
    is_active:
      typeof initialValues?.is_active === "boolean"
        ? initialValues.is_active
        : true,
    display_order: initialValues?.display_order ?? 0,
    locale: initialValues?.locale ?? "",
  }));

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      title: initialValues?.title ?? "",
      url: initialValues?.url ?? "",
      type: initialValues?.type ?? "custom",
      page_id: initialValues?.page_id ?? null,
      parent_id: initialValues?.parent_id ?? null,
      location: initialValues?.location ?? "header",
      icon: initialValues?.icon ?? "",
      section_id: initialValues?.section_id ?? null,
      is_active:
        typeof initialValues?.is_active === "boolean"
          ? initialValues.is_active
          : prev.is_active,
      display_order: initialValues?.display_order ?? prev.display_order,
      locale: initialValues?.locale ?? "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, mode]);

  const disabled = loading || saving;

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
      } else if (field === "page_id" || field === "parent_id" || field === "section_id") {
        value = value ? value : null;
      }

      setValues((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(values);
  };

  const handleDeleteClick = async () => {
    if (!onDelete) return;
    const ok = window.confirm(
      "Bu menü öğesini silmek istediğinize emin misiniz?",
    );
    if (!ok) return;
    await onDelete();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 small fw-semibold">
            {mode === "create"
              ? "Yeni Menü Öğesi"
              : "Menü Öğesini Düzenle"}
          </h5>
          <span className="text-muted small">
            {mode === "create" ? "Oluştur" : "Güncelle"}
          </span>
        </div>

        <div className="card-body">
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

            {/* Locale */}
            <div className="col-md-3">
              <label className="form-label form-label-sm">
                Locale
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="tr, en, de..."
                value={values.locale}
                onChange={handleChange("locale")}
                disabled={disabled}
              />
            </div>

            {/* Sıra */}
            <div className="col-md-3">
              <label className="form-label form-label-sm">
                Görünüm Sırası
              </label>
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

            {/* Page ID */}
            <div className="col-md-6">
              <label className="form-label form-label-sm">
                Sayfa ID (page_id)
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Sayfa ile ilişkilendirilecekse ID girin"
                value={values.page_id ?? ""}
                onChange={handleChange("page_id")}
                disabled={disabled}
              />
              <div className="form-text">
                Tür <code>page</code> ise, ilgili sayfanın ID&apos;sini
                girebilirsin (opsiyonel).
              </div>
            </div>

            {/* Parent ID */}
            <div className="col-md-6">
              <label className="form-label form-label-sm">
                Üst Menü (parent_id)
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Alt menü olacaksa üst menü ID"
                value={values.parent_id ?? ""}
                onChange={handleChange("parent_id")}
                disabled={disabled}
              />
            </div>

            {/* Section ID */}
            <div className="col-md-6">
              <label className="form-label form-label-sm">
                Section ID
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Belirli bir section ile ilişkilendirilecekse"
                value={values.section_id ?? ""}
                onChange={handleChange("section_id")}
                disabled={disabled}
              />
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
          </div>
        </div>

        <div className="card-footer d-flex justify-content-between align-items-center">
          <div className="text-muted small">
            {mode === "create"
              ? "Yeni menü öğesi ekleyeceksiniz."
              : "Mevcut menü öğesini düzenliyorsunuz."}
          </div>
          <div className="d-flex gap-2">
            {mode === "edit" && onDelete && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleDeleteClick}
                disabled={disabled}
              >
                Sil
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={onCancel}
              disabled={disabled}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={disabled}
            >
              {saving
                ? "Kaydediliyor..."
                : mode === "create"
                ? "Oluştur"
                : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
