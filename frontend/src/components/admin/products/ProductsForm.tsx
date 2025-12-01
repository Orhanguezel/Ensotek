// =============================================================
// FILE: src/components/admin/products/ProductsForm.tsx
// Ensotek – Admin Product Create/Edit Form
// =============================================================

import React, { useEffect, useState, useMemo } from "react";
import type { ProductDto } from "@/integrations/types/product.types";
import type { LocaleOption } from "./ProductsHeader";
import {
  useListProductCategoriesAdminQuery,
  useListProductSubcategoriesAdminQuery,
} from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";
import type {
  AdminProductCategoryDto,
  AdminProductSubCategoryDto,
} from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";

export type ProductFormValues = {
  locale: string;
  is_active: boolean;
  is_featured: boolean;

  title: string;
  slug: string;
  price: string;
  description: string;

  category_id: string;
  sub_category_id: string;

  image_url: string;
  storage_asset_id: string;
  alt: string;
  storage_image_ids: string;

  tags: string;

  product_code: string;
  stock_quantity: string;
  rating: string;

  meta_title: string;
  meta_description: string;
};

export type ProductsFormProps = {
  mode: "create" | "edit";
  initialData?: ProductDto;
  loading: boolean;
  saving: boolean;
  locales: LocaleOption[];
  localesLoading?: boolean;
  defaultLocale?: string;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  onCancel?: () => void;
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

      product_code: "",
      stock_quantity: "",
      rating: "",

      meta_title: "",
      meta_description: "",
    };
  }

  return {
    locale: initial.locale ?? fallbackLocale ?? "",
    is_active: initial.is_active,
    is_featured: initial.is_featured,

    title: initial.title ?? "",
    slug: initial.slug ?? "",
    price: initial.price != null ? String(initial.price) : "",
    description: initial.description ?? "",

    category_id: initial.category_id ?? "",
    sub_category_id: initial.sub_category_id ?? "",

    image_url: initial.image_url ?? "",
    storage_asset_id: initial.storage_asset_id ?? "",
    alt: initial.alt ?? "",
    storage_image_ids: (initial.storage_image_ids ?? []).join(","),

    tags: (initial.tags ?? []).join(","),

    product_code: initial.product_code ?? "",
    stock_quantity:
      initial.stock_quantity != null
        ? String(initial.stock_quantity)
        : "",
    rating: initial.rating != null ? String(initial.rating) : "",

    meta_title: initial.meta_title ?? "",
    meta_description: initial.meta_description ?? "",
  };
};

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
}) => {
  const [values, setValues] = useState<ProductFormValues>(
    buildInitialValues(initialData, defaultLocale),
  );

  useEffect(() => {
    setValues(buildInitialValues(initialData, defaultLocale));
  }, [initialData, defaultLocale]);

  const disabled = loading || saving;
  const effectiveDefaultLocale = defaultLocale ?? "tr";

  /* ----------------- KATEGORİ / ALT KATEGORİ VERİLERİ ----------------- */

  // Tüm aktif kategoriler (hem "product" hem "sparepart" – module_key label'da gösterilecek)
  const {
    data: categoryData,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useListProductCategoriesAdminQuery(
    { is_active: 1 }, // istersen buraya module_key: 'product' vs ekleyebilirsin
  );

  // Seçili kategoriye bağlı alt kategoriler
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

  const handleLocaleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, locale: val }));
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const id = e.target.value;
    setValues((prev) => ({
      ...prev,
      category_id: id,
      // kategori değişince alt kategoriyi sıfırla
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

  // Seçili kategori üzerinden label’lar
  const selectedCategory = categoryOptions.find(
    (c) => c.id === values.category_id,
  );
  const selectedSubCategory = subCategoryOptions.find(
    (s) => s.id === values.sub_category_id,
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header py-2 d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 small fw-semibold">
              {mode === "create" ? "Yeni Ürün Oluştur" : "Ürün Düzenle"}
            </h5>
            <div className="text-muted small">
              Ürün için başlık, slug, fiyat, açıklama ve SEO alanlarını doldur.
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
                    Dil listesi veritabanındaki{" "}
                    <code>site_settings.app_locales</code> kaydından gelir.
                    Boş bırakırsan backend varsayılan locale kullanır.
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
                      onChange={handleCheckboxChange("is_featured")}
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
              </div>

              {/* Başlık + slug */}
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
                <label className="form-label small mb-1">Slug</label>
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
                  <code> beton-kule</code>, <code>pompa-200</code> gibi.
                </div>
              </div>

              {/* Fiyat + açıklama */}
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
                </div>
              </div>

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
                  placeholder="virgülle ayır: mezar,mermer,istanbul..."
                  value={values.tags}
                  onChange={handleChange("tags")}
                  disabled={disabled}
                />
                <div className="form-text small">
                  Backend bu alanı <code>tags: string[]</code> olarak
                  saklar. Virgülle ayırarak yaz.
                </div>
              </div>
            </div>

            {/* Sağ kolon – Kategori + görsel + SEO */}
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
                        ? `(${c.module_key === "sparepart" ? "Yedek parça" : c.module_key})`
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
                  Boş bırakırsan ürün doğrudan üst kategori altında
                  listelenir.
                </div>
              </div>

              {/* Görsel alanları */}
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
                  Storage modülü kullanıyorsan, burayı boş bırakıp
                  sadece asset id ile çalışabilirsin.
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
                  <code>adminSetProductImages</code> uçlarıyla da
                  güncellenir.
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
                  <code>storage_image_ids: string[]</code> olarak saklar.
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

              {/* SEO alanları */}
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
                  İstersen burayı sadece okunur bırakıp, review
                  modülünden hesaplayabilirsin.
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
                  Arama motorları için kısa özet.
                </div>
              </div>
            </div>
          </div>

          {/* Seçilen kategori / alt kategori isimlerini küçük bir özet olarak göstermek istersen: */}
          {selectedCategory && (
            <div className="mt-3 text-muted small">
              Seçilen kategori: <strong>{selectedCategory.name}</strong>
              {selectedSubCategory && (
                <>
                  {" "}
                  / alt kategori:{" "}
                  <strong>{selectedSubCategory.name}</strong>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
