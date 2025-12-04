// =============================================================
// FILE: src/components/admin/services/ServiceForm.tsx
// Ensotek – Admin Service Create/Edit Form
//  - Çoklu dil desteği (locale seçimi)
//  - Form / JSON modu
//  - Kategori / Alt Kategori select (isimle, module_key=services)
//  - Teknik alanlar (area, duration, maintenance, ...)
//  - Storage tabanlı öne çıkan görsel
//  - i18n alanlar: name, slug, description, price, vs.
// =============================================================

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { ServiceDto } from "@/integrations/types/services.types";
import type { CategoryDto } from "@/integrations/types/category.types";
import type { SubCategoryDto } from "@/integrations/types/subcategory.types";

import type { LocaleOption } from "@/components/admin/custompage/CustomPageHeader";

import { AdminImageUploadField } from "@/components/common/AdminImageUploadField";
import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

import { useListCategoriesAdminQuery } from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";
import { useListSubCategoriesAdminQuery } from "@/integrations/rtk/endpoints/admin/subcategories_admin.endpoints";

/* ------------------------------------------------------------- */
/*  Form tipi                                                     */
/* ------------------------------------------------------------- */

export type ServiceFormValues = {
  id?: string;
  locale: string;

  // i18n alanlar
  name: string;
  slug: string;
  description: string;
  material: string;
  price: string;
  includes: string;
  warranty: string;
  image_alt: string;

  // parent alanlar
  category_id: string;
  sub_category_id: string;
  is_active: boolean;
  featured: boolean;
  display_order: string;

  featured_image: string;
  image_url: string;
  image_asset_id: string;

  // teknik alanlar
  area: string;
  duration: string;
  maintenance: string;
  season: string;
  thickness: string;
  equipment: string;

  // i18n copy opsiyonları
  replicate_all_locales: boolean;
  apply_all_locales: boolean;
};

export type ServiceFormProps = {
  mode: "create" | "edit";
  initialData?: ServiceDto;
  loading: boolean;
  saving: boolean;
  locales: LocaleOption[];
  localesLoading?: boolean;
  defaultLocale?: string;
  onSubmit: (values: ServiceFormValues) => void | Promise<void>;
  onCancel?: () => void;
  onLocaleChange?: (locale: string) => void;
};

/* ------------------------------------------------------------- */
/*  Yardımcılar                                                   */
/* ------------------------------------------------------------- */

/**
 * Locale-aware slugify:
 *  - TR, DE karakterlerini normalize et
 *  - küçük harfe çevir
 *  - harf/rakam ve tire dışında her şeyi temizle
 */
const slugify = (value: string): string => {
  if (!value) return "";

  let s = value.trim();

  const trMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };
  s = s
    .split("")
    .map((ch) => trMap[ch] ?? ch)
    .join("");

  s = s.replace(/ß/g, "ss").replace(/ẞ/g, "ss");

  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const buildInitialValues = (
  initial: ServiceDto | undefined,
  fallbackLocale: string | undefined,
): ServiceFormValues => {
  if (!initial) {
    return {
      id: undefined,
      locale: fallbackLocale ?? "",
      name: "",
      slug: "",
      description: "",
      material: "",
      price: "",
      includes: "",
      warranty: "",
      image_alt: "",

      category_id: "",
      sub_category_id: "",
      is_active: true,
      featured: false,
      display_order: "1",

      featured_image: "",
      image_url: "",
      image_asset_id: "",

      area: "",
      duration: "",
      maintenance: "",
      season: "",
      thickness: "",
      equipment: "",

      replicate_all_locales: true,
      apply_all_locales: false,
    };
  }

  return {
    id: initial.id,
    locale: initial.locale_resolved ?? fallbackLocale ?? "",
    name: initial.name ?? "",
    slug: initial.slug ?? "",
    description: initial.description ?? "",
    material: initial.material ?? "",
    price: initial.price ?? "",
    includes: initial.includes ?? "",
    warranty: initial.warranty ?? "",
    image_alt: initial.image_alt ?? "",

    category_id: initial.category_id ?? "",
    sub_category_id: initial.sub_category_id ?? "",
    is_active: initial.is_active,
    featured: initial.featured,
    display_order:
      typeof initial.display_order === "number"
        ? String(initial.display_order)
        : initial.display_order
        ? String(initial.display_order)
        : "1",

    featured_image: initial.featured_image ?? "",
    image_url: initial.image_url ?? "",
    image_asset_id: initial.image_asset_id ?? "",

    area: initial.area ?? "",
    duration: initial.duration ?? "",
    maintenance: initial.maintenance ?? "",
    season: initial.season ?? "",
    thickness: initial.thickness ?? "",
    equipment: initial.equipment ?? "",

    replicate_all_locales: true,
    apply_all_locales: false,
  };
};

type CategoryOption = {
  value: string;
  label: string;
};

/* ------------------------------------------------------------- */
/*  Ana Form Component                                            */
/* ------------------------------------------------------------- */

export const ServiceForm: React.FC<ServiceFormProps> = ({
  mode,
  initialData,
  loading,
  saving,
  locales,
  localesLoading,
  defaultLocale,
  onSubmit,
  onCancel,
  onLocaleChange,
}) => {
  const effectiveDefaultLocale = defaultLocale ?? "tr";

  // 🔹 Aktif form state (seçili locale için)
  const [values, setValues] = useState<ServiceFormValues>(
    buildInitialValues(initialData, effectiveDefaultLocale),
  );

  const [slugTouched, setSlugTouched] = useState(false);
  const [activeMode, setActiveMode] = useState<"form" | "json">("form");

  // initialData veya defaultLocale değişince formu resetle
  useEffect(() => {
    const base = buildInitialValues(initialData, effectiveDefaultLocale);
    setValues(base);
    setSlugTouched(false);
  }, [initialData, effectiveDefaultLocale]);

  const disabled = loading || saving;

  const handleChange =
    (field: keyof ServiceFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setValues((prev) => ({ ...prev, [field]: val }));
    };

  const handleCheckboxChange =
    (field: keyof ServiceFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setValues((prev) => ({ ...prev, [field]: checked as never }));
    };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;

    setValues((prev) => ({
      ...prev,
      locale: nextLocale || effectiveDefaultLocale,
    }));

    const resolved = nextLocale || effectiveDefaultLocale;
    if (resolved && onLocaleChange) {
      onLocaleChange(resolved);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (!values.name.trim() || !values.slug.trim()) {
      toast.error("İsim ve slug alanları zorunludur.");
      return;
    }

    void onSubmit({
      ...values,
      name: values.name.trim(),
      slug: values.slug.trim(),
    });
  };

  /* -------------------- Kategori listesi (services modülü) -------------------- */

  const categoryQueryParams = useMemo(
    () => ({
      locale: values.locale || undefined,
      module_key: "services",
      limit: 500,
      offset: 0,
    }),
    [values.locale],
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
      locale: values.locale || undefined,
      category_id: values.category_id || undefined,
      limit: 500,
      offset: 0,
    }),
    [values.locale, values.category_id],
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

  const categoriesDisabled = disabled || isCategoriesLoading;
  const subCategoriesDisabled =
    disabled || isSubCategoriesLoading || !values.category_id;

  /* -------------------- Image metadata -------------------- */

  const imageMetadata = useMemo(
    () => ({
      module_key: "service",
      locale: values.locale || "",
      service_slug: values.slug || values.name || "",
      ...(values.id ? { service_id: values.id } : {}),
    }),
    [values.locale, values.slug, values.name, values.id],
  );

  /* -------------------- Render -------------------- */

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header py-2 d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 small fw-semibold">
              {mode === "create" ? "Yeni Hizmet Oluştur" : "Hizmet Düzenle"}
            </h5>
            <div className="text-muted small">
              İsim, slug, teknik alanlar ve görsel bilgilerini doldur. Dilersen
              Form veya JSON modunda çalışabilirsin.
            </div>
          </div>

          <div className="d-flex flex-column align-items-end gap-2">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={
                  "btn btn-outline-secondary btn-sm" +
                  (activeMode === "form" ? " active" : "")
                }
                onClick={() => setActiveMode("form")}
              >
                Form
              </button>
              <button
                type="button"
                className={
                  "btn btn-outline-secondary btn-sm" +
                  (activeMode === "json" ? " active" : "")
                }
                onClick={() => setActiveMode("json")}
              >
                JSON
              </button>
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
                    ? "Hizmeti Oluştur"
                    : "Değişiklikleri Kaydet"}
              </button>
            </div>

            {loading && (
              <span className="badge bg-secondary small mt-1">
                Yükleniyor...
              </span>
            )}
          </div>
        </div>

        <div className="card-body">
          {activeMode === "json" ? (
            <AdminJsonEditor
              value={values}
              disabled={disabled}
              onChange={(next) => setValues(next as ServiceFormValues)}
              label="Service JSON"
              helperText="Bu JSON, formdaki tüm alanların bire bir karşılığıdır (i18n ve teknik alanlar dahil). Değişiklikleri kaydetmek için üstteki 'Kaydet' butonunu kullan."
            />
          ) : (
            <div className="row g-4">
              {/* Sol kolon – i18n + teknik açıklama */}
              <div className="col-lg-8">
                {/* Locale + durum/öne çıkarma */}
                <div className="row g-2 mb-3">
                  <div className="col-sm-4">
                    <label className="form-label small mb-1">
                      Locale (Dil)
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={values.locale}
                      onChange={handleLocaleChange}
                      disabled={
                        disabled || (localesLoading && !locales.length)
                      }
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
                      Boş bırakırsan backend{" "}
                      <code>req.locale</code> / varsayılan locale kullanır.
                    </div>
                  </div>

                  <div className="col-sm-4 d-flex align-items-end">
                    <div className="form-check me-3">
                      <input
                        id="svc_is_active"
                        type="checkbox"
                        className="form-check-input"
                        checked={values.is_active}
                        onChange={handleCheckboxChange("is_active")}
                        disabled={disabled}
                      />
                      <label
                        htmlFor="svc_is_active"
                        className="form-check-label small"
                      >
                        Aktif
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        id="svc_featured"
                        type="checkbox"
                        className="form-check-input"
                        checked={values.featured}
                        onChange={handleCheckboxChange("featured")}
                        disabled={disabled}
                      />
                      <label
                        htmlFor="svc_featured"
                        className="form-check-label small"
                      >
                        Öne çıkan
                      </label>
                    </div>
                  </div>
                </div>

                {/* İsim + slug */}
                <div className="mb-3">
                  <label className="form-label small mb-1">
                    Hizmet Adı
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={values.name}
                    onChange={(e) => {
                      const nameValue = e.target.value;
                      setValues((prev) => {
                        const next: ServiceFormValues = {
                          ...prev,
                          name: nameValue,
                        };
                        if (!slugTouched) {
                          next.slug = slugify(nameValue);
                        }
                        return next;
                      });
                    }}
                    disabled={disabled}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small mb-1">Slug</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={values.slug}
                    onFocus={() => setSlugTouched(true)}
                    onChange={(e) => {
                      setSlugTouched(true);
                      const val = e.target.value;
                      setValues((prev) => ({ ...prev, slug: val }));
                    }}
                    disabled={disabled}
                    required
                  />
                  <div className="form-text small">
                    Otomatik oluşur; istersen manuel değiştirebilirsin. Küçük
                    harf, rakam ve tire kullan:{" "}
                    <code>bakim-ve-onarim</code>,{" "}
                    <code>modernizasyon</code> gibi.
                  </div>
                </div>

                {/* Açıklama */}
                <div className="mb-3">
                  <label className="form-label small mb-1">Açıklama</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={4}
                    value={values.description}
                    onChange={handleChange("description")}
                    disabled={disabled}
                  />
                  <div className="form-text small">
                    Hizmetin kısa/orta uzunlukta açıklaması. Public tarafta
                    kartlarda ve detay sayfasında kullanılabilir.
                  </div>
                </div>

                {/* Diğer i18n alanlar */}
                <div className="row g-2 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label small mb-1">
                      Malzeme / İçerik
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={values.material}
                      onChange={handleChange("material")}
                      disabled={disabled}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small mb-1">
                      Fiyat (serbest format)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Örn: Teklif üzerine, 1200 € + KDV"
                      value={values.price}
                      onChange={handleChange("price")}
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small mb-1">
                    Dahil Olanlar (includes)
                  </label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={2}
                    value={values.includes}
                    onChange={handleChange("includes")}
                    disabled={disabled}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small mb-1">
                    Garanti / Koşullar
                  </label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={2}
                    value={values.warranty}
                    onChange={handleChange("warranty")}
                    disabled={disabled}
                  />
                </div>

                {/* Teknik alanlar */}
                <div className="row g-2">
                  <div className="col-sm-6">
                    <label className="form-label small mb-1">
                      Alan / Kapasite
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Örn: 1000 m³/h, 3 hücre"
                      value={values.area}
                      onChange={handleChange("area")}
                      disabled={disabled}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small mb-1">
                      Süre / Periyot
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Örn: 2 gün, yıllık bakım"
                      value={values.duration}
                      onChange={handleChange("duration")}
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-sm-6">
                    <label className="form-label small mb-1">
                      Bakım Planı (maintenance)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={values.maintenance}
                      onChange={handleChange("maintenance")}
                      disabled={disabled}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small mb-1">
                      Sezon / Çalışma Koşulları
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={values.season}
                      onChange={handleChange("season")}
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-sm-6">
                    <label className="form-label small mb-1">
                      Kalınlık (thickness)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={values.thickness}
                      onChange={handleChange("thickness")}
                      disabled={disabled}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small mb-1">
                      Ekipman / Donanım
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={values.equipment}
                      onChange={handleChange("equipment")}
                      disabled={disabled}
                    />
                  </div>
                </div>
              </div>

              {/* Sağ kolon – kategori, görseller, i18n opsiyonları */}
              <div className="col-lg-4">
                {/* Görüntüleme sırası */}
                <div className="mb-3">
                  <label className="form-label small mb-1">
                    Görüntüleme Sırası
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min={0}
                    value={values.display_order}
                    onChange={handleChange("display_order")}
                    disabled={disabled}
                  />
                  <div className="form-text small">
                    Listeleme sırası için kullanılır. Küçük sayı önce gelir.
                  </div>
                </div>

                {/* Kategori (module_key=services) */}
                <div className="mb-3">
                  <label className="form-label small mb-1">Kategori</label>
                  <select
                    className="form-select form-select-sm"
                    value={values.category_id}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        category_id: e.target.value,
                        sub_category_id: "",
                      }))
                    }
                    disabled={categoriesDisabled}
                  >
                    <option value="">(Kategori seç)</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="form-text small">
                    Kategoriler, <code>module_key = `services`</code> olan
                    Ensotek kategori modülünden gelir.
                  </div>
                  {isCategoriesLoading && (
                    <div className="form-text small">
                      Kategoriler yükleniyor...
                    </div>
                  )}
                </div>

                {/* Alt kategori */}
                <div className="mb-3">
                  <label className="form-label small mb-1">
                    Alt Kategori
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={values.sub_category_id}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        sub_category_id: e.target.value,
                      }))
                    }
                    disabled={subCategoriesDisabled}
                  >
                    <option value="">(Alt kategori seç)</option>
                    {subCategoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="form-text small">
                    Alt kategoriler, seçili hizmet kategorisine göre
                    filtrelenir. (Örn: Üretim, Bakım & Onarım, Modernizasyon
                    vb.)
                  </div>
                  {isSubCategoriesLoading && (
                    <div className="form-text small">
                      Alt kategoriler yükleniyor...
                    </div>
                  )}
                </div>

                {/* Öne çıkan görsel */}
                <div className="mb-3">
                  <AdminImageUploadField
                    label="Öne Çıkan Görsel"
                    helperText={
                      <>
                        Hizmet kartlarında ve detay sayfasında kullanılacak ana
                        görseli buradan yükleyebilirsin. Yüklenen görsel
                        URL&apos;i aşağıdaki alana otomatik yazılır.
                      </>
                    }
                    bucket="public"
                    folder="services"
                    metadata={imageMetadata}
                    value={values.featured_image}
                    onChange={(url) =>
                      setValues((prev) => ({
                        ...prev,
                        featured_image: url,
                      }))
                    }
                    disabled={disabled}
                    openLibraryHref="/admin/storage"
                  />
                </div>

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
                </div>

                <div className="mb-3">
                  <label className="form-label small mb-1">
                    Görsel Asset ID
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={values.image_asset_id}
                    onChange={handleChange("image_asset_id")}
                    disabled={disabled}
                  />
                  <div className="form-text small">
                    Storage modülü ile ilişkili asset ID (opsiyonel).
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small mb-1">
                    Görsel Alt Metni
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={values.image_alt}
                    onChange={handleChange("image_alt")}
                    disabled={disabled}
                  />
                </div>

                {/* i18n replicate/apply */}
                <div className="mb-0">
                  <label className="form-label small mb-1">
                    Çok Dilli İşlem
                  </label>
                  <div className="form-check">
                    <input
                      id="svc_replicate_all"
                      type="checkbox"
                      className="form-check-input"
                      checked={values.replicate_all_locales}
                      onChange={handleCheckboxChange("replicate_all_locales")}
                      disabled={disabled}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="svc_replicate_all"
                    >
                      Oluştururken tüm dillere kopyala{" "}
                      <code>replicate_all_locales</code>
                    </label>
                  </div>
                  <div className="form-check mt-1">
                    <input
                      id="svc_apply_all"
                      type="checkbox"
                      className="form-check-input"
                      checked={values.apply_all_locales}
                      onChange={handleCheckboxChange("apply_all_locales")}
                      disabled={disabled}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="svc_apply_all"
                    >
                      Güncellerken tüm dillere uygula{" "}
                      <code>apply_all_locales</code>
                    </label>
                  </div>
                  <div className="form-text small">
                    Create isteğinde sadece{" "}
                    <code>replicate_all_locales</code>, update isteğinde ise{" "}
                    <code>apply_all_locales</code> backend&apos;e gönderilir.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
