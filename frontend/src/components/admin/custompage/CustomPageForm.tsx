// =============================================================
// FILE: src/components/admin/custompage/CustomPageForm.tsx
// Ensotek – Admin Custom Page Create/Edit Form
// =============================================================

import React, { useEffect, useState } from "react";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";
import { RichTextEditorBasic } from "@/components/ui/RichTextEditorBasic";
import type { LocaleOption } from "./CustomPageHeader";

export type CustomPageFormValues = {
  locale: string;
  is_published: boolean;
  title: string;
  slug: string;
  content: string;

  featured_image: string;
  featured_image_asset_id: string;
  featured_image_alt: string;

  meta_title: string;
  meta_description: string;

  category_id: string;
  sub_category_id: string;
};

export type CustomPageFormProps = {
  mode: "create" | "edit";
  initialData?: CustomPageDto;
  loading: boolean;
  saving: boolean;
  locales: LocaleOption[];
  localesLoading?: boolean;
  defaultLocale?: string;
  onSubmit: (values: CustomPageFormValues) => void | Promise<void>;
  onCancel?: () => void;
};

/** Backend'ten gelen content JSON ise {"html": "..."} -> html'e çevir */
const unpackContent = (raw: string | null | undefined): string => {
  if (!raw) return "";
  const s = String(raw);
  const trimmed = s.trim();
  if (!trimmed) return "";

  // {"html":"..."} formatını çöz
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (
        parsed &&
        typeof parsed === "object" &&
        typeof (parsed as any).html === "string"
      ) {
        return (parsed as any).html;
      }
    } catch {
      // JSON değilse ignore
    }
  }

  return s;
};

const buildInitialValues = (
  initial: CustomPageDto | undefined,
  fallbackLocale: string | undefined,
): CustomPageFormValues => {
  if (!initial) {
    return {
      locale: fallbackLocale ?? "",
      is_published: false,
      title: "",
      slug: "",
      content: "",

      featured_image: "",
      featured_image_asset_id: "",
      featured_image_alt: "",

      meta_title: "",
      meta_description: "",

      category_id: "",
      sub_category_id: "",
    };
  }

  return {
    locale: initial.locale_resolved ?? fallbackLocale ?? "",
    is_published: initial.is_published,

    title: initial.title ?? "",
    slug: initial.slug ?? "",
    content: unpackContent(initial.content),

    featured_image: initial.featured_image ?? "",
    featured_image_asset_id: initial.featured_image_asset_id ?? "",
    featured_image_alt: initial.featured_image_alt ?? "",

    meta_title: initial.meta_title ?? "",
    meta_description: initial.meta_description ?? "",

    category_id: initial.category_id ?? "",
    sub_category_id: initial.sub_category_id ?? "",
  };
};

export const CustomPageForm: React.FC<CustomPageFormProps> = ({
  mode,
  initialData,
  loading,
  saving,
  locales,
  localesLoading,
  defaultLocale,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<CustomPageFormValues>(
    buildInitialValues(initialData, defaultLocale),
  );

  // initialData veya defaultLocale değiştiğinde formu yeniden doldur
  useEffect(() => {
    setValues(buildInitialValues(initialData, defaultLocale));
  }, [initialData, defaultLocale]);

  const disabled = loading || saving;

  const handleChange =
    (field: keyof CustomPageFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setValues((prev) => ({ ...prev, [field]: val }));
    };

  const handleCheckboxChange =
    (field: keyof CustomPageFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setValues((prev) => ({ ...prev, [field]: checked as never }));
    };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, locale: val }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    void onSubmit(values);
  };

  const effectiveDefaultLocale = defaultLocale ?? "tr";

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header py-2 d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 small fw-semibold">
              {mode === "create" ? "Yeni Sayfa Oluştur" : "Sayfa Düzenle"}
            </h5>
            <div className="text-muted small">
              Başlık, slug, zengin metin içerik (HTML) ve SEO alanlarını doldur.
            </div>
          </div>
          <div className="d-flex gap-2">
            {onCancel && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onCancel}
                disabled={disabled}
              >
                Geri
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={disabled}
            >
              {saving
                ? mode === "create"
                  ? "Oluşturuluyor..."
                  : "Kaydediliyor..."
                : mode === "create"
                  ? "Sayfayı Oluştur"
                  : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row g-4">
            {/* Sol kolon: içerik */}
            <div className="col-lg-8">
              {/* Locale + yayın durumu */}
              <div className="row g-2 mb-3">
                <div className="col-sm-4">
                  <label className="form-label small mb-1">
                    Locale (Dil)
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={values.locale}
                    onChange={handleLocaleChange}
                    disabled={disabled || (localesLoading && !locales.length)}
                  >
                    <option value="">
                      (Site varsayılanı
                      {effectiveDefaultLocale
                        ? `: ${effectiveDefaultLocale}`
                        : ""}
                      )
                    </option>
                    {locales.map((loc) => (
                      <option key={loc.value} value={loc.value}>
                        {loc.label}
                      </option>
                    ))}
                  </select>
                  <div className="form-text small">
                    Dil listesi veritabanındaki{" "}
                    <code>site_settings.app_locales</code> kaydından gelir.
                    Boş bırakırsan backend{" "}
                    <code>req.locale</code> / varsayılan locale kullanır.
                  </div>
                </div>
                <div className="col-sm-4 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      id="is_published"
                      type="checkbox"
                      className="form-check-input"
                      checked={values.is_published}
                      onChange={handleCheckboxChange("is_published")}
                      disabled={disabled}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="is_published"
                    >
                      Yayında olsun
                    </label>
                  </div>
                </div>
              </div>

              {/* Başlık ve slug */}
              <div className="mb-3">
                <label className="form-label small mb-1">Başlık</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={values.title}
                  onChange={handleChange("title")}
                  disabled={disabled}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={values.slug}
                  onChange={handleChange("slug")}
                  disabled={disabled}
                  required
                />
                <div className="form-text small">
                  Sadece küçük harf, rakam ve tire:
                  <code> hakkimizda</code>,{" "}
                  <code>blog-yazi-1</code> gibi.
                </div>
              </div>

              {/* İçerik (zengin HTML) */}
              <div className="mb-0">
                <label className="form-label small mb-1">
                  İçerik (zengin metin / HTML)
                </label>
                <RichTextEditorBasic
                  value={values.content}
                  onChange={(html) =>
                    setValues((prev) => ({ ...prev, content: html }))
                  }
                  disabled={disabled}
                />
                <div className="form-text small">
                  Zengin metin editörü HTML içerik üretir. Backend bu alanı{" "}
                  <code>packContent</code> ile{" "}
                  <code>{'{"html":"..."}'}</code> formatına çevirerek kaydeder.
                  Eğer backend&apos;den JSON{" "}
                  <code>{'{"html":"..."}'}</code> gelirse, FE otomatik olarak
                  sadece <code>html</code> içeriğini editöre basar.
                </div>
              </div>
            </div>

            {/* Sağ kolon: görsel + kategori + SEO */}
            <div className="col-lg-4">
              {/* Kategori alanları */}
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Kategori ID
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="category_id (opsiyonel)"
                  value={values.category_id}
                  onChange={handleChange("category_id")}
                  disabled={disabled}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Alt Kategori ID
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="sub_category_id (opsiyonel)"
                  value={values.sub_category_id}
                  onChange={handleChange("sub_category_id")}
                  disabled={disabled}
                />
              </div>

              {/* Görsel alanları */}
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Öne Çıkan Görsel URL
                </label>
                <input
                  type="url"
                  className="form-control form-control-sm"
                  placeholder="https://..."
                  value={values.featured_image}
                  onChange={handleChange("featured_image")}
                  disabled={disabled}
                />
                <div className="form-text small">
                  Eski/serbest URL. Storage asset kullanıyorsan boş bırak.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small mb-1">
                  Öne Çıkan Görsel Asset ID
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="storage asset id (36 char)"
                  value={values.featured_image_asset_id}
                  onChange={handleChange("featured_image_asset_id")}
                  disabled={disabled}
                />
                <div className="form-text small">
                  Storage modülüyle ilişkilendirmek için{" "}
                  <code>featured_image_asset_id</code>.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small mb-1">
                  Görsel Alt Metni
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={values.featured_image_alt}
                  onChange={handleChange("featured_image_alt")}
                  disabled={disabled}
                />
              </div>

              {/* SEO alanları */}
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={values.meta_title}
                  onChange={handleChange("meta_title")}
                  disabled={disabled}
                />
              </div>
              <div className="mb-0">
                <label className="form-label small mb-1">
                  Meta Description
                </label>
                <textarea
                  className="form-control form-control-sm"
                  rows={3}
                  value={values.meta_description}
                  onChange={handleChange("meta_description")}
                  disabled={disabled}
                />
                <div className="form-text small">
                  Arama motorları için kısa özet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
