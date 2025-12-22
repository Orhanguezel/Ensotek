// =============================================================
// FILE: src/components/admin/custompage/CustomPageForm.tsx
// Ensotek – Admin Custom Page Create/Edit Form (container)
// FIX:
//  - Locale select: AdminLocaleSelect
//  - Ensure locale always has a concrete value in create/edit (no empty)
// =============================================================

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { CustomPageDto } from "@/integrations/types/custom_pages.types";
import type { CategoryDto } from "@/integrations/types/category.types";
import type { SubCategoryDto } from "@/integrations/types/subcategory.types";

import type { LocaleOption } from "./CustomPageHeader";
import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

import {
  useListSubCategoriesAdminQuery,
  useListCategoriesAdminQuery,
  useLazyListCustomPagesAdminQuery,
} from "@/integrations/rtk/hooks";

import { CustomPageMainColumn } from "./CustomPageMainColumn";
import { CustomPageSidebarColumn } from "./CustomPageSidebarColumn";
import { CustomPageFormImageColumn } from "./CustomPageFormImageColumn";

/* ------------------------------------------------------------- */
/*  Tipler                                                       */
/* ------------------------------------------------------------- */

export type CustomPageFormValues = {
  id?: string;
  page_id?: string;

  locale: string;
  is_published: boolean;
  title: string;
  slug: string;
  content: string;

  featured_image: string;
  featured_image_asset_id: string;
  featured_image_alt: string;

  summary: string;

  meta_title: string;
  meta_description: string;

  tags: string;

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

  /** MUST be a concrete locale like 'tr' */
  defaultLocale?: string;

  onSubmit: (values: CustomPageFormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export type CategoryOption = {
  value: string;
  label: string;
};

export type ContentImageSize = "sm" | "md" | "lg" | "full";

/* ------------------------------------------------------------- */
/*  Yardımcılar                                                   */
/* ------------------------------------------------------------- */

const buildInitialValues = (
  initial: CustomPageDto | undefined,
  fallbackLocale: string | undefined,
): CustomPageFormValues => {
  const safeLocale = (fallbackLocale || "tr").toLowerCase();

  if (!initial) {
    return {
      id: undefined,
      page_id: undefined,

      locale: safeLocale,
      is_published: false,
      title: "",
      slug: "",
      content: "",

      featured_image: "",
      featured_image_asset_id: "",
      featured_image_alt: "",

      summary: "",
      meta_title: "",
      meta_description: "",

      tags: "",

      category_id: "",
      sub_category_id: "",
    };
  }

  const tagsString =
    initial.tags && initial.tags.length
      ? initial.tags.join(", ")
      : (initial as any).tags_raw ?? "";

  const pageId = (initial as any).page_id ?? (initial as any).parent_id ?? initial.id;

  const resolvedLocale =
    (initial as any).locale_resolved ??
    (initial as any).locale ??
    safeLocale;

  return {
    id: initial.id,
    page_id: pageId,

    locale: String(resolvedLocale || safeLocale).toLowerCase(),

    is_published: initial.is_published,

    title: initial.title ?? "",
    slug: initial.slug ?? "",
    content: (initial as any).content ?? (initial as any).content_html ?? "",

    featured_image: initial.featured_image ?? "",
    featured_image_asset_id: initial.featured_image_asset_id ?? "",
    featured_image_alt: (initial as any).featured_image_alt ?? "",

    summary: (initial as any).summary ?? "",
    meta_title: (initial as any).meta_title ?? "",
    meta_description: (initial as any).meta_description ?? "",

    tags: tagsString,

    category_id: (initial as any).category_id ?? "",
    sub_category_id: (initial as any).sub_category_id ?? "",
  };
};

const buildContentImageHtml = (
  url: string,
  alt = "",
  size: ContentImageSize = "lg",
): string => {
  const safeAlt = alt.replace(/"/g, "&quot;");

  let widthStyle: string;
  switch (size) {
    case "sm":
      widthStyle = "width: 50%; max-width: 480px;";
      break;
    case "md":
      widthStyle = "width: 75%; max-width: 720px;";
      break;
    case "full":
      widthStyle = "width: 100%; max-width: 100%;";
      break;
    case "lg":
    default:
      widthStyle = "width: 100%; max-width: 900px;";
      break;
  }

  return `
<figure class="content-image-block content-image-${size}" style="${widthStyle} margin: 1.5rem auto; text-align: center;">
  <img src="${url}" alt="${safeAlt}" loading="lazy"
       style="max-width: 100%; height: auto; display: block; margin: 0 auto;" />
</figure>
`.trim();
};

/* ------------------------------------------------------------- */
/*  Ana Form Component (container)                               */
/* ------------------------------------------------------------- */

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
  const safeDefaultLocale = (defaultLocale || "tr").toLowerCase();

  const [values, setValues] = useState<CustomPageFormValues>(
    buildInitialValues(initialData, safeDefaultLocale),
  );

  const [slugTouched, setSlugTouched] = useState(false);
  const [activeMode, setActiveMode] = useState<"form" | "json">("form");

  const [contentImagePreview, setContentImagePreview] = useState<string>("");
  const [contentImageSize, setContentImageSize] = useState<ContentImageSize>("lg");
  const [manualImageUrl, setManualImageUrl] = useState<string>("");
  const [manualImageAlt, setManualImageAlt] = useState<string>("");

  const [triggerListPages, { isLoading: isLocaleSwitchLoading }] =
    useLazyListCustomPagesAdminQuery();

  useEffect(() => {
    setValues(buildInitialValues(initialData, safeDefaultLocale));
    setSlugTouched(false);
  }, [initialData, safeDefaultLocale]);

  // ✅ locale boş kalmasın (örn: localeOptions geç yükleniyor)
  useEffect(() => {
    if (!values.locale) {
      setValues((p) => ({ ...p, locale: safeDefaultLocale }));
    }
  }, [values.locale, safeDefaultLocale]);

  const disabled = loading || saving;

  const handleChange =
    (field: keyof CustomPageFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setValues((prev) => ({ ...prev, [field]: val } as CustomPageFormValues));
    };

  const handleCheckboxChange =
    (field: keyof CustomPageFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setValues((prev) => ({ ...prev, [field]: checked } as CustomPageFormValues));
    };

  const handleLocaleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = String(e.target.value || safeDefaultLocale).toLowerCase();

    if (mode === "create" || !initialData) {
      setValues((prev) => ({ ...prev, locale: nextLocale }));
      return;
    }

    const basePageId =
      values.page_id ??
      (initialData as any).page_id ??
      (initialData as any).parent_id ??
      null;

    if (!basePageId) {
      setValues((prev) => ({ ...prev, locale: nextLocale }));
      return;
    }

    try {
      const res = await triggerListPages({
        locale: nextLocale || undefined,
        limit: 200,
        offset: 0,
      }).unwrap();

      const items: CustomPageDto[] = (res as any)?.items ?? (res as any) ?? [];

      const match = items.find((item: any) => {
        const itemPageId = (item as any).page_id ?? (item as any).parent_id ?? item.id;
        return itemPageId === basePageId;
      });

      if (match) {
        const nextValues = buildInitialValues(match, safeDefaultLocale);
        nextValues.locale = nextLocale;
        setValues(nextValues);
        setSlugTouched(false);
      } else {
        setValues((prev) => ({ ...prev, locale: nextLocale }));
        toast.info(
          "Seçilen dil için mevcut kayıt bulunamadı, bu dilde yeni içerik oluşturabilirsin.",
        );
      }
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;
      if (status === 400) {
        console.warn("Locale change: /admin/custom_pages 400", err);
        setValues((prev) => ({ ...prev, locale: nextLocale }));
        toast.info(
          "Seçilen dil için kayıt listesi alınamadı. Bu dilde yeni içerik oluşturabilirsin.",
        );
      } else {
        console.error("Locale change error (custom page):", err);
        toast.error("Seçilen dil için özel sayfa yüklenirken bir hata oluştu.");
        setValues((prev) => ({ ...prev, locale: nextLocale }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (!values.title.trim() || !values.slug.trim()) {
      toast.error("Başlık ve slug alanları zorunludur.");
      return;
    }

    void onSubmit({
      ...values,
      locale: (values.locale || safeDefaultLocale).toLowerCase(),
      title: values.title.trim(),
      slug: values.slug.trim(),
      summary: values.summary.trim(),
      meta_title: values.meta_title.trim(),
      meta_description: values.meta_description.trim(),
      tags: values.tags.trim(),
    });
  };

  const effectiveDefaultLocale = safeDefaultLocale;

  /* -------------------- Görsel metadata (storage için) -------------------- */

  const imageMetadata = useMemo<Record<string, string | number | boolean>>(
    () => ({
      module_key: "custom_page",
      locale: values.locale || safeDefaultLocale,
      page_slug: values.slug || values.title || "",
      ...(values.page_id ? { page_id: values.page_id } : {}),
    }),
    [values.locale, values.slug, values.title, values.page_id, safeDefaultLocale],
  );

  /* -------------------- Kategori listesi -------------------- */

  const categoryQueryParams = useMemo(
    () => ({
      limit: 500,
      offset: 0,
      locale: values.locale || undefined,
    }),
    [values.locale],
  );

  const { data: categoryRows, isLoading: isCategoriesLoading } =
    useListCategoriesAdminQuery(categoryQueryParams as any);

  const categoryOptions: CategoryOption[] = useMemo(() => {
    const base: CategoryOption[] = (categoryRows ?? []).map((c: CategoryDto) => ({
      value: c.id,
      label: (c as any).name || (c as any).slug || c.id,
    }));

    if (values.category_id && !base.some((opt) => opt.value === values.category_id)) {
      base.unshift({
        value: values.category_id,
        label:
          (initialData as any)?.category_name ||
          (initialData as any)?.category_slug ||
          values.category_id,
      });
    }

    return base;
  }, [categoryRows, values.category_id, initialData]);

  const subCategoryQueryParams = useMemo(
    () => ({
      category_id: values.category_id || undefined,
      limit: 500,
      offset: 0,
      locale: values.locale || undefined,
    }),
    [values.category_id, values.locale],
  );

  const { data: subCategoryRows, isLoading: isSubCategoriesLoading } =
    useListSubCategoriesAdminQuery(subCategoryQueryParams as any);

  const subCategoryOptions: CategoryOption[] = useMemo(() => {
    const base: CategoryOption[] = (subCategoryRows ?? []).map((sc: SubCategoryDto) => ({
      value: sc.id,
      label: (sc as any).name || (sc as any).slug || sc.id,
    }));

    if (
      values.sub_category_id &&
      !base.some((opt) => opt.value === values.sub_category_id)
    ) {
      base.unshift({
        value: values.sub_category_id,
        label:
          (initialData as any)?.sub_category_name ||
          (initialData as any)?.sub_category_slug ||
          values.sub_category_id,
      });
    }

    return base;
  }, [subCategoryRows, values.sub_category_id, initialData]);

  const categoriesDisabled = disabled || isCategoriesLoading;
  const subCategoriesDisabled = disabled || isSubCategoriesLoading || !values.category_id;

  /* -------------------- İçerik görsel ekleme -------------------- */

  const handleAddContentImage = (url: string, alt?: string) => {
    if (!url) return;

    const htmlBlock = buildContentImageHtml(url, alt ?? "", contentImageSize);

    setContentImagePreview(url);
    setValues((prev) => ({
      ...prev,
      content: (prev.content || "") + "\n\n" + htmlBlock + "\n\n",
    }));
    toast.success(
      "Görsel içerik alanının sonuna eklendi. Metin editöründe konumunu istersen değiştirebilirsin.",
    );
  };

  const handleAddManualImage = () => {
    const url = manualImageUrl.trim();
    if (!url) {
      toast.error("Lütfen geçerli bir görsel URL'i gir.");
      return;
    }
    handleAddContentImage(url, manualImageAlt.trim());
    setManualImageUrl("");
    setManualImageAlt("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header py-2 d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 small fw-semibold">
              {mode === "create" ? "Yeni Sayfa Oluştur" : "Sayfa Düzenle"}
            </h5>
            <div className="text-muted small">
              Başlık, slug, özet, zengin metin içerik (HTML), etiketler ve SEO
              alanlarını doldur. Dilersen Form veya JSON modunda çalışabilirsin.
            </div>
          </div>

          <div className="d-flex flex-column align-items-end gap-2">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={"btn btn-outline-secondary btn-sm" + (activeMode === "form" ? " active" : "")}
                onClick={() => setActiveMode("form")}
              >
                Form
              </button>
              <button
                type="button"
                className={"btn btn-outline-secondary btn-sm" + (activeMode === "json" ? " active" : "")}
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
              <button type="submit" className="btn btn-primary btn-sm" disabled={disabled}>
                {saving
                  ? mode === "create"
                    ? "Oluşturuluyor..."
                    : "Kaydediliyor..."
                  : mode === "create"
                    ? "Sayfayı Oluştur"
                    : "Değişiklikleri Kaydet"}
              </button>
            </div>

            {(loading || isLocaleSwitchLoading) && (
              <span className="badge bg-secondary small mt-1">
                {isLocaleSwitchLoading ? "Dil değiştiriliyor..." : "Yükleniyor..."}
              </span>
            )}
          </div>
        </div>

        <div className="card-body">
          {activeMode === "json" ? (
            <AdminJsonEditor
              value={values}
              disabled={disabled}
              onChange={(next) => setValues(next as CustomPageFormValues)}
              label="Custom Page JSON"
              helperText="Bu JSON, formdaki tüm alanların bire bir karşılığıdır. Kaydetmek için üstteki 'Kaydet' butonunu kullan."
            />
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <CustomPageMainColumn
                  values={values}
                  disabled={disabled}
                  slugTouched={slugTouched}
                  setSlugTouched={setSlugTouched}
                  setValues={setValues}
                  handleChange={handleChange}
                  effectiveDefaultLocale={effectiveDefaultLocale}
                  locales={locales}
                  localesLoading={localesLoading}
                  isLocaleSwitchLoading={isLocaleSwitchLoading}
                  handleLocaleChange={handleLocaleChange}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </div>

              <div className="col-lg-4">
                <CustomPageFormImageColumn
                  metadata={imageMetadata}
                  featuredImageValue={values.featured_image}
                  disabled={disabled}
                  onFeaturedImageChange={(url) =>
                    setValues((prev) => ({
                      ...prev,
                      featured_image: url,
                    }))
                  }
                />

                <div className="mt-3">
                  <CustomPageSidebarColumn
                    values={values}
                    disabled={disabled}
                    categoriesDisabled={categoriesDisabled}
                    subCategoriesDisabled={subCategoriesDisabled}
                    categoryOptions={categoryOptions}
                    subCategoryOptions={subCategoryOptions}
                    isCategoriesLoading={isCategoriesLoading}
                    isSubCategoriesLoading={isSubCategoriesLoading}
                    imageMetadata={imageMetadata}
                    contentImageSize={contentImageSize}
                    setContentImageSize={setContentImageSize}
                    contentImagePreview={contentImagePreview}
                    handleAddContentImage={handleAddContentImage}
                    manualImageUrl={manualImageUrl}
                    manualImageAlt={manualImageAlt}
                    setManualImageUrl={setManualImageUrl}
                    setManualImageAlt={setManualImageAlt}
                    handleAddManualImage={handleAddManualImage}
                    setValues={setValues}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
