// =============================================================
// FILE: src/components/admin/products/ProductsForm.tsx
// Ensotek – Admin Product Create/Edit Form (Modüler + Tab'li)
// Tabs:
//  - Genel (temel bilgiler, kategori, görseller, SEO)  [Form <-> JSON]
//  - Specs (product_specs tablosu – ayrı modül, kendi içinde Form/JSON)
//  - FAQs (product_faqs tablosu – ayrı modül, kendi içinde Form/JSON)
//  - Reviews (product_reviews tablosu – ayrı modül)
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type {
  ProductDto,
  ProductSpecifications,
} from "@/integrations/types/product.types";
import type { LocaleOption } from "./ProductsHeader";

import {
  useListProductCategoriesAdminQuery,
  useListProductSubcategoriesAdminQuery,
} from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";
import type {
  AdminProductCategoryDto,
  AdminProductSubCategoryDto,
} from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";

import { AdminImageUploadField } from "@/components/common/AdminImageUploadField";
import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

import { ProductSpecsTab } from "./tabs/ProductSpecsTab";
import { ProductFaqsTab } from "./tabs/ProductFaqsTab";
import { ProductReviewsTab } from "./tabs/ProductReviewsTab";

export type ProductFormValues = {
  // durum / dil
  locale: string;
  is_active: boolean;
  is_featured: boolean;

  // temel bilgiler
  title: string;
  slug: string;
  price: string;
  description: string;

  // kategori
  category_id: string;
  sub_category_id: string;

  // görsel alanları
  image_url: string;
  storage_asset_id: string;
  alt: string;
  storage_image_ids: string;

  // etiketler (CSV)
  tags: string;

  // sıralama
  order_num: string;

  // stok / kod / rating
  product_code: string;
  stock_quantity: string;
  rating: string;

  // SEO
  meta_title: string;
  meta_description: string;

  // JSON specifications (tip dosyasından)
  specifications: ProductSpecifications | Record<string, any> | null;
};

export type ProductsFormProps = {
  mode: "create" | "edit";
  initialData?: ProductDto;
  loading: boolean;
  saving: boolean;
  locales: LocaleOption[];
  localesLoading?: boolean;
  defaultLocale?: string;
  /**
   * onSubmit: UI'den gelen değerler (string + JSON)
   * Sayfa tarafında AdminProductCreatePayload / UpdatePayload'a çevirebilirsin.
   */
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  onCancel?: () => void;

  /**
   * Dil değiştiğinde parent'a haber ver.
   * Genellikle parent burada API'den yeni locale için ürün datasını çeker
   * ve initialData prop'unu günceller.
   */
  onLocaleChange?: (locale: string) => void | Promise<void>;
};

const buildInitialValues = (
  initial: ProductDto | undefined,
  fallbackLocale: string | undefined,
): ProductFormValues => {
  if (!initial) {
    return {
      locale: fallbackLocale ?? "",
      is_active: true,
      is_featured: false,

      title: "",
      slug: "",
      price: "",
      description: "",

      category_id: "",
      sub_category_id: "",

      image_url: "",
      storage_asset_id: "",
      alt: "",
      storage_image_ids: "",

      tags: "",

      order_num: "",

      product_code: "",
      stock_quantity: "",
      rating: "",

      meta_title: "",
      meta_description: "",

      specifications: {},
    };
  }

  return {
    locale: initial.locale ?? fallbackLocale ?? "",
    is_active: initial.is_active,
    is_featured: initial.is_featured,

    title: initial.title ?? "",
    slug: initial.slug ?? "",
    price:
      initial.price != null && !Number.isNaN(Number(initial.price))
        ? String(initial.price)
        : "",
    description: initial.description ?? "",

    category_id: initial.category_id ?? "",
    sub_category_id: initial.sub_category_id ?? "",

    image_url: initial.image_url ?? "",
    storage_asset_id: initial.storage_asset_id ?? "",
    alt: initial.alt ?? "",
    storage_image_ids: (initial.storage_image_ids ?? []).join(","),

    tags: (initial.tags ?? []).join(","),

    order_num:
      typeof (initial as any).order_num === "number"
        ? String((initial as any).order_num)
        : "",

    product_code: initial.product_code ?? "",
    stock_quantity:
      initial.stock_quantity != null
        ? String(initial.stock_quantity)
        : "",
    rating:
      initial.rating != null && !Number.isNaN(Number(initial.rating))
        ? String(initial.rating)
        : "",

    meta_title: initial.meta_title ?? "",
    meta_description: initial.meta_description ?? "",

    specifications:
      (initial.specifications as ProductSpecifications | null) ?? {},
  };
};

type ProductFormTab = "general" | "specs" | "faqs" | "reviews";
type GeneralViewMode = "form" | "json";

export const ProductsForm: React.FC<ProductsFormProps> = ({
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
  const [values, setValues] = useState<ProductFormValues>(
    buildInitialValues(initialData, defaultLocale),
  );
  const [activeTab, setActiveTab] =
    useState<ProductFormTab>("general");
  const [generalViewMode, setGeneralViewMode] =
    useState<GeneralViewMode>("form");

  const disabled = loading || saving;
  const effectiveDefaultLocale = defaultLocale ?? "tr";
  const productId = initialData?.id;

  // initialData değişince formu güncelle ama mevcut seçili locale'i koru
  useEffect(() => {
    setValues((prev) => {
      const base = buildInitialValues(initialData, defaultLocale);
      return {
        ...base,
        // Eğer kullanıcı select'ten bir locale seçtiyse onu koru;
        // yoksa backend'den geleni kullan.
        locale:
          prev.locale ||
          base.locale ||
          defaultLocale ||
          "",
      };
    });
  }, [initialData, defaultLocale]);

  /* ----------------- KATEGORİ / ALT KATEGORİ VERİLERİ ----------------- */

  const {
    data: categoryData,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useListProductCategoriesAdminQuery(
    { is_active: 1 }, // istersen buraya module_key: 'product' / 'sparepart' koyabilirsin
  );

  const {
    data: subCategoryData,
    isLoading: subCategoriesLoading,
    isFetching: subCategoriesFetching,
  } = useListProductSubcategoriesAdminQuery(
    values.category_id
      ? { category_id: values.category_id, is_active: 1 }
      : undefined,
    {
      skip: !values.category_id,
    },
  );

  const categoryOptions = useMemo(
    () =>
      ((categoryData ?? []) as AdminProductCategoryDto[]).map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        module_key: c.module_key ?? undefined,
      })),
    [categoryData],
  );

  const subCategoryOptions = useMemo(
    () =>
      ((subCategoryData ?? []) as AdminProductSubCategoryDto[]).map(
        (s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          category_id: s.category_id,
        }),
      ),
    [subCategoryData],
  );

  const categoriesBusy = categoriesLoading || categoriesFetching;
  const subCategoriesBusy =
    subCategoriesLoading || subCategoriesFetching;

  /* ----------------- HANDLERLAR ----------------- */

  const handleChange =
    (field: keyof ProductFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setValues((prev) => ({ ...prev, [field]: val }));
    };

  const handleCheckboxChange =
    (field: keyof ProductFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setValues((prev) => ({ ...prev, [field]: checked as never }));
    };

  const handleLocaleChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const val = e.target.value;

    // Önce state'teki locale'i güncelle
    setValues((prev) => ({ ...prev, locale: val }));

    // Edit modunda, ürün varsa ve callback gelmişse parent'a haber ver
    if (mode === "edit" && productId && onLocaleChange) {
      try {
        await onLocaleChange(val);
      } catch (err) {
        console.error("onLocaleChange error:", err);
        toast.error(
          "Dil değiştirilirken bir hata oluştu. Lütfen tekrar deneyin.",
        );
      }
    }
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const id = e.target.value;
    setValues((prev) => ({
      ...prev,
      category_id: id,
      sub_category_id: "",
    }));
  };

  const handleSubCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const id = e.target.value;
    setValues((prev) => ({
      ...prev,
      sub_category_id: id,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    void onSubmit(values);
  };

  const handleGeneralJsonChange = (next: any) => {
    if (!next || typeof next !== "object" || Array.isArray(next)) {
      toast.error("Genel JSON formatı geçersiz. Object bekleniyor.");
      return;
    }
    setValues(next as ProductFormValues);
  };

  // Seçili kategori / alt kategori isimleri
  const selectedCategory = categoryOptions.find(
    (c) => c.id === values.category_id,
  );
  const selectedSubCategory = subCategoryOptions.find(
    (s) => s.id === values.sub_category_id,
  );

  // Storage upload için meta
  const storageMeta = {
    module_key: "product",
    locale: values.locale || effectiveDefaultLocale,
    slug: values.slug || "",
  };

  const changeTab =
    (tab: ProductFormTab) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setActiveTab(tab);
    };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header py-2 d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 small fw-semibold">
              {mode === "create" ? "Yeni Ürün Oluştur" : "Ürün Düzenle"}
            </h5>
            <div className="text-muted small">
              Ürün için başlık, slug, fiyat, kategori, görseller ve SEO
              alanlarını doldur. Diğer detaylar alttaki sekmelerde.
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
                  ? "Ürünü Oluştur"
                  : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Sekmeler */}
          <ul className="nav nav-tabs small mb-3">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${
                  activeTab === "general" ? "active" : ""
                }`}
                onClick={changeTab("general")}
              >
                Genel
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${
                  activeTab === "specs" ? "active" : ""
                }`}
                onClick={changeTab("specs")}
                disabled={!productId}
              >
                Teknik Özellikler (Specs)
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${
                  activeTab === "faqs" ? "active" : ""
                }`}
                onClick={changeTab("faqs")}
                disabled={!productId}
              >
                Sık Sorulanlar (FAQs)
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={changeTab("reviews")}
                disabled={!productId}
              >
                Yorumlar (Reviews)
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {/* ------------ TAB: GENEL ------------ */}
            <div
              className={`tab-pane fade ${
                activeTab === "general" ? "show active" : ""
              }`}
            >
              {/* Genel tab içi Form / JSON toggle */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 small fw-semibold">Genel Bilgiler</h6>
                  <div className="text-muted small">
                    Ürünün temel alanları. İstersen formdan, istersen JSON
                    olarak düzenleyebilirsin. Dil seçimi ürüne ait ilgili
                    çeviri kaydını getirir.
                  </div>
                </div>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    className={`btn btn-outline-secondary ${
                      generalViewMode === "form" ? "active" : ""
                    }`}
                    onClick={() => setGeneralViewMode("form")}
                    disabled={disabled}
                  >
                    Form
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-secondary ${
                      generalViewMode === "json" ? "active" : ""
                    }`}
                    onClick={() => setGeneralViewMode("json")}
                    disabled={disabled}
                  >
                    JSON
                  </button>
                </div>
              </div>

              {generalViewMode === "form" && (
                <>
                  <div className="row g-4">
                    {/* Sol kolon – Temel bilgiler */}
                    <div className="col-lg-8">
                      {/* Locale + durumlar */}
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
                              disabled ||
                              (localesLoading && !locales.length)
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
                            Dil listesi veritabanındaki{" "}
                            <code>site_settings.app_locales</code>{" "}
                            kaydından gelir. Boş bırakırsan backend
                            varsayılan locale kullanır. Edit modunda dil
                            değiştirince ilgili locale kaydı yüklenmelidir
                            (parent bileşen <code>onLocaleChange</code>{" "}
                            ile API çağrısı yapar).
                          </div>
                        </div>
                        <div className="col-sm-4 d-flex align-items-end">
                          <div className="form-check me-3">
                            <input
                              id="is_active"
                              type="checkbox"
                              className="form-check-input"
                              checked={values.is_active}
                              onChange={handleCheckboxChange("is_active")}
                              disabled={disabled}
                            />
                            <label
                              className="form-check-label small"
                              htmlFor="is_active"
                            >
                              Aktif olsun
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              id="is_featured"
                              type="checkbox"
                              className="form-check-input"
                              checked={values.is_featured}
                              onChange={handleCheckboxChange(
                                "is_featured",
                              )}
                              disabled={disabled}
                            />
                            <label
                              className="form-check-label small"
                              htmlFor="is_featured"
                            >
                              Öne çıkan
                            </label>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <label className="form-label small mb-1">
                            Sıralama (order_num)
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={values.order_num}
                            onChange={handleChange("order_num")}
                            disabled={disabled}
                            min="0"
                          />
                          <div className="form-text small">
                            Liste sıralaması için kullanılır. Drag &amp;
                            drop <code>Reorder</code> uçları da bu alanı
                            günceller.
                          </div>
                        </div>
                      </div>

                      {/* Başlık + slug */}
                      <div className="mb-3">
                        <label className="form-label small mb-1">
                          Başlık
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
                          <code> beton-kule</code>,{" "}
                          <code>pompa-200</code> gibi.
                          <br />
                          <code>(locale, slug)</code> birlikte unique
                          tutulur.
                        </div>
                      </div>

                      {/* Fiyat + stok + ürün kodu */}
                      <div className="row g-2 mb-3">
                        <div className="col-sm-4">
                          <label className="form-label small mb-1">
                            Fiyat (₺)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-control form-control-sm"
                            value={values.price}
                            onChange={handleChange("price")}
                            disabled={disabled}
                            required
                          />
                        </div>
                        <div className="col-sm-4">
                          <label className="form-label small mb-1">
                            Stok Adedi
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="form-control form-control-sm"
                            value={values.stock_quantity}
                            onChange={handleChange("stock_quantity")}
                            disabled={disabled}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label className="form-label small mb-1">
                            Ürün Kodu
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={values.product_code}
                            onChange={handleChange("product_code")}
                            disabled={disabled}
                          />
                          <div className="form-text small">
                            <code>product_code</code> veritabanında
                            unique.
                          </div>
                        </div>
                      </div>

                      {/* Açıklama */}
                      <div className="mb-3">
                        <label className="form-label small mb-1">
                          Kısa Açıklama
                        </label>
                        <textarea
                          className="form-control form-control-sm"
                          rows={4}
                          value={values.description}
                          onChange={handleChange("description")}
                          disabled={disabled}
                        />
                      </div>

                      {/* Etiketler */}
                      <div className="mb-0">
                        <label className="form-label small mb-1">
                          Etiketler
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="virgülle ayır: kule,sogutma,endustriyel..."
                          value={values.tags}
                          onChange={handleChange("tags")}
                          disabled={disabled}
                        />
                        <div className="form-text small">
                          Backend bu alanı{" "}
                          <code>tags: string[]</code> olarak saklar.
                          Virgülle ayırarak yaz.{" "}
                          <code>ürün,sogutma,kule</code> gibi.
                        </div>
                      </div>
                    </div>

                    {/* Sağ kolon – Kategori + Görsel + SEO / Rating */}
                    <div className="col-lg-4">
                      {/* Kategoriler */}
                      <div className="mb-3">
                        <label className="form-label small mb-1">
                          Kategori
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={values.category_id}
                          onChange={handleCategoryChange}
                          disabled={disabled || categoriesBusy}
                        >
                          <option value="">
                            {categoriesBusy
                              ? "Kategoriler yükleniyor..."
                              : "Kategori seç..."}
                          </option>
                          {categoryOptions.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}{" "}
                              {c.module_key
                                ? `(${
                                    c.module_key === "sparepart"
                                      ? "Yedek parça"
                                      : c.module_key
                                  })`
                                : ""}
                            </option>
                          ))}
                        </select>
                        <div className="form-text small">
                          Seçilen kategori ID:
                          <code className="ms-1">
                            {values.category_id || "-"}
                          </code>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small mb-1">
                          Alt Kategori
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={values.sub_category_id}
                          onChange={handleSubCategoryChange}
                          disabled={
                            disabled ||
                            subCategoriesBusy ||
                            !values.category_id
                          }
                        >
                          <option value="">
                            {!values.category_id
                              ? "Önce kategori seç"
                              : subCategoriesBusy
                                ? "Alt kategoriler yükleniyor..."
                                : "Alt kategori (opsiyonel)"}
                          </option>
                          {subCategoryOptions
                            .filter(
                              (s) => s.category_id === values.category_id,
                            )
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                        <div className="form-text small">
                          Seçilen alt kategori ID:
                          <code className="ms-1">
                            {values.sub_category_id || "-"}
                          </code>
                          <br />
                          Boş bırakırsan ürün doğrudan üst kategori
                          altında listelenir.
                        </div>
                      </div>

                      {/* Görsel upload (storage) */}
                      <div className="mb-3">
                        <AdminImageUploadField
                          label="Kapak Görseli"
                          helperText={
                            <>
                              Storage üzerinden görsel yüklemek için
                              kullanılır. Yüklenen görselin URL&apos;i{" "}
                              <code>image_url</code> alanına yazılır.
                              İstersen asset id&apos;yi aşağıdaki
                              alanlardan manuel doldurup{" "}
                              <code>setProductImagesAdmin</code> ile de
                              güncelleyebilirsin.
                            </>
                          }
                          bucket="public"
                          folder="products"
                          metadata={storageMeta}
                          value={values.image_url}
                          onChange={(url) =>
                            setValues((prev) => ({
                              ...prev,
                              image_url: url,
                            }))
                          }
                          disabled={disabled}
                        />
                      </div>

                      {/* Görsel alanları (raw id / url) */}
                      <div className="mb-3">
                        <label className="form-label small mb-1">
                          Kapak Görsel URL
                        </label>
                        <input
                          type="url"
                          className="form-control form-control-sm"
                          placeholder="https://..."
                          value={values.image_url}
                          onChange={handleChange("image_url")}
                          disabled={disabled}
                        />
                        <div className="form-text small">
                          Boş bırakıp sadece storage asset id ile de
                          çalışabilirsin. Public site tarafında{" "}
                          <code>image_url</code> gösterilecek.
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small mb-1">
                          Kapak Görsel Asset ID
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="storage_asset_id"
                          value={values.storage_asset_id}
                          onChange={handleChange("storage_asset_id")}
                          disabled={disabled}
                        />
                        <div className="form-text small">
                          <code>adminSetProductImages</code> uçlarıyla
                          da güncellenir. Buradaki id, storage
                          tablosundaki kayda karşılık gelir.
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small mb-1">
                          Galeri Asset ID&apos;leri
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="id1,id2,id3..."
                          value={values.storage_image_ids}
                          onChange={handleChange("storage_image_ids")}
                          disabled={disabled}
                        />
                        <div className="form-text small">
                          Virgülle ayırarak storage asset id listesi
                          girebilirsin. Backend bunları{" "}
                          <code>storage_image_ids: string[]</code>{" "}
                          olarak saklar.
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small mb-1">
                          Görsel Alt Metni
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={values.alt}
                          onChange={handleChange("alt")}
                          disabled={disabled}
                        />
                      </div>

                      {/* Rating + SEO */}
                      <div className="mb-3">
                        <label className="form-label small mb-1">
                          Ortalama Puan (0-5)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          className="form-control form-control-sm"
                          value={values.rating}
                          onChange={handleChange("rating")}
                          disabled={disabled}
                        />
                        <div className="form-text small">
                          İstersen burayı readonly tutup review
                          modülünden otomatik hesaplatabilirsin.
                        </div>
                      </div>

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
                          Arama motorları için kısa özet. ~140–160
                          karakter idealdir.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Özet */}
                  {selectedCategory && (
                    <div className="mt-3 text-muted small">
                      Seçilen kategori:{" "}
                      <strong>{selectedCategory.name}</strong>
                      {selectedSubCategory && (
                        <>
                          {" "}
                          / alt kategori:{" "}
                          <strong>{selectedSubCategory.name}</strong>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

              {generalViewMode === "json" && (
                <AdminJsonEditor
                  label={
                    <>
                      Ürün Genel JSON{" "}
                      <span className="text-muted">
                        (ProductFormValues)
                      </span>
                    </>
                  }
                  value={values}
                  onChange={handleGeneralJsonChange}
                  disabled={disabled}
                  helperText={
                    <>
                      Bu alan formdaki tüm genel alanların JSON
                      karşılığıdır. Buradan düzenlediğin değerler form
                      tarafına da yansır.
                      <pre className="mb-0 mt-1 small">
{`{
  "locale": "tr",
  "title": "Örnek ürün",
  "price": "1000",
  "category_id": "1",
  "specifications": {
    "capacity": "1.500 m³/h – 4.500 m³/h"
  }
}`}
                      </pre>
                    </>
                  }
                  height={320}
                />
              )}
            </div>

            {/* ------------ TAB: SPECS ------------ */}
            <div
              className={`tab-pane fade ${
                activeTab === "specs" ? "show active" : ""
              }`}
            >
              <ProductSpecsTab
                productId={productId}
                disabled={disabled || !productId}
              />
            </div>

            {/* ------------ TAB: FAQS ------------ */}
            <div
              className={`tab-pane fade ${
                activeTab === "faqs" ? "show active" : ""
              }`}
            >
              <ProductFaqsTab
                productId={productId}
                disabled={disabled || !productId}
              />
            </div>

            {/* ------------ TAB: REVIEWS ------------ */}
            <div
              className={`tab-pane fade ${
                activeTab === "reviews" ? "show active" : ""
              }`}
            >
              <ProductReviewsTab
                productId={productId}
                disabled={disabled || !productId}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
