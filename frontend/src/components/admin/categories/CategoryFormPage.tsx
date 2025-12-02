// =============================================================
// FILE: src/components/admin/categories/CategoryFormPage.tsx
// Ensotek – Kategori Form Sayfası (Create/Edit + Görsel Upload)
//  - Çoklu dil desteği (locale değişince ilgili satırı çek)
//  - İsimden otomatik slug üret (ama manuel override edilebilir)
//  - Alternatif JSON editörü (aynı payload ile create/update)
// =============================================================

"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  FormEvent,
} from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import type { CategoryDto } from "@/integrations/types/category.types";
import type {
  LocaleOption,
  ModuleOption,
} from "./CategoriesHeader";

import {
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
  useLazyListCategoriesAdminQuery,
} from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import { AdminImageUploadField } from "@/components/common/AdminImageUploadField";
import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

/* ------------------------------------------------------------- */
/*  Form state tipi                                               */
/* ------------------------------------------------------------- */

type CategoryFormState = {
  id?: string;
  locale: string;
  module_key: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Şimdilik hem icon class hem de image URL için kullanıyoruz
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
};

type CategoryFormMode = "create" | "edit";
type EditMode = "form" | "json";

type CategoryFormPageProps = {
  mode: CategoryFormMode;
  initialData?: CategoryDto | null;
  loading?: boolean; // Edit sayfasında data fetch loading
  onDone?: () => void; // Kaydedince / iptal edince geri dönmek için
};

/* ------------------------------------------------------------- */
/*  Yardımcılar                                                  */
/* ------------------------------------------------------------- */

const STATIC_MODULE_OPTIONS: ModuleOption[] = [
  { value: "about",      label: "Hakkımızda" },
  { value: "product",    label: "Ürünler" },
  { value: "services",   label: "Hizmetler" },
  { value: "sparepart",  label: "Yedek Parça" },
  { value: "news",       label: "Haberler" },
  { value: "library",    label: "Kütüphane" },
  { value: "references", label: "Referanslar" },
];

const mapDtoToFormState = (item: CategoryDto): CategoryFormState => ({
  id: item.id,
  locale: item.locale || "tr",
  module_key: item.module_key || "about",
  name: item.name,
  slug: item.slug,
  description: item.description || "",
  icon: item.icon || "",
  is_active: !!item.is_active,
  is_featured: !!item.is_featured,
  display_order: item.display_order ?? 0,
});

/**
 * Locale-aware slugify:
 *  - TR, DE karakterlerini normalize et
 *  - küçük harfe çevir
 *  - harf/rakam ve tire dışında her şeyi temizle
 */
const slugify = (value: string): string => {
  if (!value) return "";

  let s = value.trim();

  // TR özel harfleri
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

  // DE: ß -> ss
  s = s.replace(/ß/g, "ss").replace(/ẞ/g, "ss");

  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // aksanları at
    .replace(/[^a-z0-9\s-]/g, "") // geçersiz karakterleri at
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Form state → JSON modeli (backend'e giden payload ile uyumlu)
const buildJsonModelFromForm = (state: CategoryFormState) => ({
  locale: state.locale,
  module_key: state.module_key,
  name: state.name,
  slug: state.slug,
  description: state.description || "",
  icon: state.icon || "",
  is_active: state.is_active,
  is_featured: state.is_featured,
  display_order: state.display_order,
});

/* ------------------------------------------------------------- */
/*  Component                                                     */
/* ------------------------------------------------------------- */

const CategoryFormPage: React.FC<CategoryFormPageProps> = ({
  mode,
  initialData,
  loading: externalLoading,
  onDone,
}) => {
  const router = useRouter();

  const [formState, setFormState] = useState<CategoryFormState | null>(null);
  const [slugTouched, setSlugTouched] = useState(false); // slug manuel mi değiştirildi?
  const [editMode, setEditMode] = useState<EditMode>("form");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryAdminMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryAdminMutation();

  const [triggerListCategories, { isLoading: isLocaleLoading }] =
    useLazyListCategoriesAdminQuery();

  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const saving = isCreating || isUpdating;
  const loading = !!externalLoading || isLocalesLoading;

  /* -------------------- Locale options -------------------- */

  const localeCodes = useMemo(() => {
    if (!appLocaleRows || appLocaleRows.length === 0) {
      return ["tr", "en"];
    }
    const row = appLocaleRows.find((r) => r.key === "app_locales");
    const v = row?.value;

    let arr: string[] = [];

    if (Array.isArray(v)) {
      arr = v.map((x) => String(x)).filter(Boolean);
    } else if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) {
          arr = parsed.map((x) => String(x)).filter(Boolean);
        }
      } catch {
        // ignore
      }
    }

    if (!arr.length) {
      return ["tr", "en"];
    }

    return Array.from(new Set(arr));
  }, [appLocaleRows]);

  const localeOptions: LocaleOption[] = useMemo(
    () =>
      localeCodes.map((code) => {
        const lower = code.toLowerCase();
        let label = `${code.toUpperCase()} (${lower})`;

        if (lower === "tr") label = "Türkçe (tr)";
        else if (lower === "en") label = "İngilizce (en)";
        else if (lower === "de") label = "Almanca (de)";

        return { value: lower, label };
      }),
    [localeCodes],
  );

  const moduleOptions: ModuleOption[] = useMemo(
    () => STATIC_MODULE_OPTIONS,
    [],
  );

  /* -------------------- Form state init -------------------- */

  useEffect(() => {
    // Edit modunda: initialData geldiyse doldur
    if (mode === "edit") {
      if (initialData && !formState) {
        setFormState(mapDtoToFormState(initialData));
        setSlugTouched(false);
      }
      return;
    }

    // Create modunda: localeOptions hazırsa default state kur
    if (mode === "create" && !formState && localeOptions.length > 0) {
      const defaultLocale = localeOptions[0]?.value ?? "tr";
      const defaultModule = moduleOptions[0]?.value ?? "about";

      setFormState({
        id: undefined,
        locale: defaultLocale,
        module_key: defaultModule,
        name: "",
        slug: "",
        description: "",
        icon: "",
        is_active: true,
        is_featured: false,
        display_order: 0,
      });
      setSlugTouched(false);
    }
  }, [mode, initialData, formState, localeOptions, moduleOptions]);

  /* -------------------- Görsel metadata (storage için) -------------------- */

  const imageMetadata = useMemo(() => {
    if (!formState) return undefined;
    return {
      module_key: formState.module_key || "",
      locale: formState.locale || "",
      category_slug: formState.slug || "",
    };
  }, [formState]);

  /* -------------------- JSON → Form normalize edici -------------------- */

  const applyJsonToForm = (json: any) => {
    if (!formState) return;

    setFormState((prev) => {
      if (!prev) return prev;
      const next: CategoryFormState = { ...prev };

      if (typeof json.locale === "string") next.locale = json.locale;
      if (typeof json.module_key === "string")
        next.module_key = json.module_key;

      if (typeof json.name === "string") next.name = json.name;
      if (typeof json.slug === "string") {
        next.slug = json.slug;
        setSlugTouched(true);
      }

      if (typeof json.description === "string")
        next.description = json.description;

      if (typeof json.icon === "string") next.icon = json.icon;

      if (typeof json.is_active === "boolean")
        next.is_active = json.is_active;
      if (typeof json.is_featured === "boolean")
        next.is_featured = json.is_featured;

      if (
        typeof json.display_order === "number" &&
        Number.isFinite(json.display_order)
      ) {
        next.display_order = json.display_order;
      }

      return next;
    });
  };

  /* -------------------- Handlers -------------------- */

  const handleChange = (
    field: keyof CategoryFormState,
    value: string | boolean | number,
  ) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleLocaleChange = async (nextLocale: string) => {
    if (!formState) return;

    // Create modunda sadece locale'i değiştir, diğer alanları elle doldurursun
    if (mode === "create") {
      setFormState((prev) =>
        prev ? { ...prev, locale: nextLocale } : prev,
      );
      return;
    }

    // Edit modunda: aynı "logik kategori" için selected locale satırını çek
    const baseSlug = initialData?.slug || formState.slug;
    const baseModule = initialData?.module_key || formState.module_key;

    try {
      const rows = await triggerListCategories({
        module_key: baseModule,
        locale: nextLocale,
        q: baseSlug, // slug üzerinden arama
        limit: 20,
      }).unwrap();

      const match = (rows || []).find(
        (item) =>
          item.slug === baseSlug &&
          item.module_key === baseModule &&
          item.locale === nextLocale,
      );

      if (match) {
        setFormState(mapDtoToFormState(match));
        setSlugTouched(false);
      } else {
        // İlgili dilde satır bulunamadıysa en azından locale'i değiştir
        setFormState((prev) =>
          prev ? { ...prev, locale: nextLocale } : prev,
        );
        toast.info(
          "Seçilen dil için kayıt bulunamadı, mevcut içerik üzerinden düzenleyebilirsin.",
        );
      }
    } catch (err) {
      console.error("Locale change error", err);
      toast.error("Seçilen dil için kategori yüklenirken hata oluştu.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    // JSON modunda parse hatası varsa kayda izin vermeyelim
    if (editMode === "json" && jsonError) {
      toast.error("JSON geçerli değil. Lütfen JSON hatasını düzeltin.");
      return;
    }

    const payloadBase = {
      locale: formState.locale || "tr",
      module_key: formState.module_key || "about",
      name: formState.name.trim(),
      slug: formState.slug.trim(),
      description: formState.description.trim() || undefined,
      icon: formState.icon.trim() || undefined, // image URL veya icon class
      is_active: formState.is_active,
      is_featured: formState.is_featured,
      display_order: formState.display_order ?? 0,
    };

    if (!payloadBase.name || !payloadBase.slug) {
      toast.error("Ad ve slug alanları zorunludur.");
      return;
    }

    try {
      if (mode === "create") {
        await createCategory(payloadBase as any).unwrap();
        toast.success("Kategori oluşturuldu.");
      } else if (mode === "edit" && formState.id) {
        await updateCategory({
          id: formState.id,
          patch: payloadBase as any,
        }).unwrap();
        toast.success("Kategori güncellendi.");
      }

      if (onDone) onDone();
      else router.push("/admin/categories");
    } catch (err: any) {
      console.error("Category save error:", err);
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Kategori kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    if (onDone) onDone();
    else router.push("/admin/categories");
  };

  /* -------------------- Loading / not found state -------------------- */

  if (mode === "edit" && externalLoading && !initialData) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center text-muted small py-5">
          <div className="spinner-border spinner-border-sm me-2" />
          Kategori yükleniyor...
        </div>
      </div>
    );
  }

  if (mode === "edit" && !externalLoading && !initialData) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning small">
          Kategori bulunamadı veya silinmiş olabilir.
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleCancel}
        >
          ← Listeye dön
        </button>
      </div>
    );
  }

  if (!formState) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center text-muted small py-5">
          <div className="spinner-border spinner-border-sm me-2" />
          Form hazırlanıyor...
        </div>
      </div>
    );
  }

  const jsonModel = buildJsonModelFromForm(formState);

  /* -------------------- Render form -------------------- */

  return (
    <div className="container-fluid py-4">
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-link btn-sm px-0"
          onClick={handleCancel}
        >
          ← Kategori listesine dön
        </button>
      </div>

      <div className="card">
        <div className="card-header py-2 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h5 mb-0">
              {mode === "create" ? "Yeni Kategori" : "Kategori Düzenle"}
            </h1>
            <div className="small text-muted">
              {formState.module_key} · {formState.locale.toUpperCase()}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn btn-outline-secondary ${
                  editMode === "form" ? "active" : ""
                }`}
                onClick={() => setEditMode("form")}
                disabled={saving}
              >
                Form
              </button>
              <button
                type="button"
                className={`btn btn-outline-secondary ${
                  editMode === "json" ? "active" : ""
                }`}
                onClick={() => setEditMode("json")}
                disabled={saving}
              >
                JSON
              </button>
            </div>

            {(saving || isLocaleLoading) && (
              <span className="badge bg-secondary small">
                {isLocaleLoading ? "Dil değiştiriliyor..." : "Kaydediliyor..."}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              {/* Sol kolon: Form veya JSON mode */}
              <div className="col-md-7">
                {editMode === "form" ? (
                  <div className="row g-2">
                    <div className="col-md-4">
                      <label className="form-label small">Dil</label>
                      <select
                        className="form-select form-select-sm"
                        value={formState.locale}
                        onChange={(e) =>
                          handleLocaleChange(e.target.value)
                        }
                        disabled={saving || loading || isLocaleLoading}
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
                        onChange={(e) =>
                          handleChange("module_key", e.target.value)
                        }
                        disabled={saving}
                      >
                        {moduleOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small">
                        Sıralama (display_order)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formState.display_order}
                        onChange={(e) =>
                          handleChange(
                            "display_order",
                            Number(e.target.value) || 0,
                          )
                        }
                        disabled={saving}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Ad</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.name}
                        onChange={(e) => {
                          const nameValue = e.target.value;
                          setFormState((prev) => {
                            if (!prev) return prev;
                            const next: CategoryFormState = {
                              ...prev,
                              name: nameValue,
                            };
                            // slug henüz manuel dokunulmadıysa otomatik doldur
                            if (!slugTouched) {
                              next.slug = slugify(nameValue);
                            }
                            return next;
                          });
                        }}
                        disabled={saving}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Slug</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.slug}
                        onFocus={() => setSlugTouched(true)}
                        onChange={(e) => {
                          setSlugTouched(true);
                          handleChange("slug", e.target.value);
                        }}
                        disabled={saving}
                      />
                      <div className="form-text small">
                        İsim alanını doldururken otomatik oluşur, istersen
                        slug&apos;ı manuel değiştirebilirsin.
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">
                        Icon / Görsel URL
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.icon}
                        onChange={(e) =>
                          handleChange("icon", e.target.value)
                        }
                        disabled={saving}
                        placeholder="Örn: https://... veya /images/cat.jpg"
                      />
                      <div className="form-text small">
                        Şimdilik bu alan hem ikon metni hem de görsel URL için
                        kullanılıyor. Storage üzerinden yüklediğinde otomatik
                        doldurulur.
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
                            onChange={(e) =>
                              handleChange("is_active", e.target.checked)
                            }
                            disabled={saving}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form-active"
                          >
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
                              handleChange(
                                "is_featured",
                                e.target.checked,
                              )
                            }
                            disabled={saving}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form-featured"
                          >
                            Öne çıkan
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small">
                        Açıklama (opsiyonel)
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={4}
                        value={formState.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        disabled={saving}
                      />
                    </div>
                  </div>
                ) : (
                  <AdminJsonEditor
                    label="Kategori JSON (create/update payload)"
                    value={jsonModel}
                    onChange={applyJsonToForm}
                    onErrorChange={setJsonError}
                    disabled={saving}
                    height={340}
                    helperText={
                      <>
                        Bu JSON, create / update isteğine gönderilecek payload
                        ile uyumludur.{" "}
                        <code>locale</code>, <code>module_key</code>,{" "}
                        <code>name</code>, <code>slug</code>,{" "}
                        <code>description</code>, <code>icon</code>,{" "}
                        <code>is_active</code>, <code>is_featured</code>,{" "}
                        <code>display_order</code> alanlarını düzenleyebilirsin.
                        Geçerli JSON&apos;da yaptığın değişiklikler forma
                        yansır.
                      </>
                    }
                  />
                )}
              </div>

              {/* Sağ kolon – Görsel alanı (ortak bileşen) */}
              <div className="col-md-5">
                <AdminImageUploadField
                  label="Kategori Görseli"
                  helperText={
                    <>
                      Storage modülü üzerinden kategori için bir görsel
                      yükleyebilirsin. Yüklenen görselin URL&apos;i yukarıdaki{" "}
                      <strong>Icon / Görsel URL</strong> alanına otomatik
                      yazılır (ve JSON modeline de yansır).
                    </>
                  }
                  bucket="public"
                  folder="categories"
                  metadata={imageMetadata}
                  value={formState.icon}
                  onChange={(url) =>
                    setFormState((prev) =>
                      prev ? { ...prev, icon: url } : prev,
                    )
                  }
                  disabled={saving}
                  openLibraryHref="/admin/storage"
                  onOpenLibraryClick={() => router.push("/admin/storage")}
                />
              </div>
            </div>
          </div>

          <div className="card-footer py-2 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleCancel}
              disabled={saving}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={saving}
            >
              {saving
                ? "Kaydediliyor..."
                : mode === "create"
                  ? "Oluştur"
                  : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormPage;
