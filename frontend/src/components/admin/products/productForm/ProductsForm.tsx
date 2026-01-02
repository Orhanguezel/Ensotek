// =============================================================
// FILE: src/components/admin/products/productForm/ProductsForm.tsx
// Ensotek – Admin Product Create/Edit Form (Modüler + Tab'li)
// - ✅ Cover + Gallery yönetimi: ProductFormImageColumn (import)
// - ✅ Kategori/Alt kategori locale'a göre çekilir + FALLBACK (kategori boş dönmesin)
// - ✅ Description: RichContentEditor (import)
// - ✅ SEO alanı: Sağ (resim) kolondan alındı, "Genel Bilgiler" içinde render edilir
// - ✅ Sağ kolon: Sınıflandırma + Görseller (SEO yok)
// =============================================================

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { ProductDto, ProductSpecifications } from '@/integrations/types/product.types';

import { AdminLocaleSelect, type AdminLocaleOption } from '@/components/common/AdminLocaleSelect';

import {
  useListProductCategoriesAdminQuery,
  useListProductSubcategoriesAdminQuery,
} from '@/integrations/rtk/hooks';

import { AdminJsonEditor } from '@/components/common/AdminJsonEditor';

import { ProductSpecsTab } from '../tabs/ProductSpecsTab';
import { ProductFaqsTab } from '../tabs/ProductFaqsTab';
import { ProductReviewsTab } from '../tabs/ProductReviewsTab';

import { ProductFormImageColumn } from './ProductFormImageColumn';

import RichContentEditor from '@/components/common/RichContentEditor';

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

  order_num: string;

  product_code: string;
  stock_quantity: string;
  rating: string;

  meta_title: string;
  meta_description: string;

  specifications: ProductSpecifications | Record<string, any> | null;
};

export type ProductsFormProps = {
  mode: 'create' | 'edit';
  initialData?: ProductDto;
  loading: boolean;
  saving: boolean;

  locales: AdminLocaleOption[];
  localesLoading?: boolean;
  defaultLocale?: string;

  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  onCancel?: () => void;
  onLocaleChange?: (locale: string) => void | Promise<void>;
};

const normLower = (v: unknown) => (typeof v === 'string' ? v.trim().toLowerCase() : '');

const buildInitialValues = (
  initial: ProductDto | undefined,
  fallbackLocale: string | undefined,
): ProductFormValues => {
  if (!initial) {
    return {
      locale: fallbackLocale ?? '',
      is_active: true,
      is_featured: false,

      title: '',
      slug: '',
      price: '',
      description: '',

      category_id: '',
      sub_category_id: '',

      image_url: '',
      storage_asset_id: '',
      alt: '',
      storage_image_ids: '',

      tags: '',

      order_num: '',

      product_code: '',
      stock_quantity: '',
      rating: '',

      meta_title: '',
      meta_description: '',

      specifications: {},
    };
  }

  const storageIds = (initial as any)?.storage_image_ids;
  const storageIdsJoined = Array.isArray(storageIds)
    ? storageIds.filter(Boolean).join(',')
    : typeof storageIds === 'string'
    ? storageIds
    : '';

  return {
    locale: initial.locale ?? fallbackLocale ?? '',
    is_active: !!initial.is_active,
    is_featured: !!initial.is_featured,

    title: initial.title ?? '',
    slug: initial.slug ?? '',
    price:
      initial.price != null && !Number.isNaN(Number(initial.price)) ? String(initial.price) : '',
    description: (initial.description as any) ?? '',

    category_id: initial.category_id ?? '',
    sub_category_id: initial.sub_category_id ?? '',

    image_url: initial.image_url ?? '',
    storage_asset_id: (initial as any).storage_asset_id ?? '',
    alt: initial.alt ?? '',
    storage_image_ids: storageIdsJoined,

    tags: (initial.tags ?? []).join(','),

    order_num:
      typeof (initial as any).order_num === 'number' ? String((initial as any).order_num) : '',

    product_code: (initial as any).product_code ?? '',
    stock_quantity:
      (initial as any).stock_quantity != null ? String((initial as any).stock_quantity) : '',
    rating:
      (initial as any).rating != null && !Number.isNaN(Number((initial as any).rating))
        ? String((initial as any).rating)
        : '',

    meta_title: (initial as any).meta_title ?? '',
    meta_description: (initial as any).meta_description ?? '',

    specifications: ((initial as any).specifications as ProductSpecifications | null) ?? {},
  };
};

type ProductFormTab = 'general' | 'specs' | 'faqs' | 'reviews';
type GeneralViewMode = 'form' | 'json';

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
  const [activeTab, setActiveTab] = useState<ProductFormTab>('general');
  const [generalViewMode, setGeneralViewMode] = useState<GeneralViewMode>('form');

  const disabled = loading || saving;
  const effectiveDefaultLocale = normLower(defaultLocale) || 'de';
  const productId = initialData?.id;

  const itemType = (initialData as any)?.item_type ?? undefined;

  useEffect(() => {
    setValues((prev) => {
      const base = buildInitialValues(initialData, defaultLocale);
      return {
        ...base,
        locale: normLower(prev.locale) || normLower(base.locale) || normLower(defaultLocale) || '',
      };
    });
  }, [initialData, defaultLocale]);

  const effectiveLocale = values.locale || effectiveDefaultLocale;

  /* ----------------- Categories (locale-aware + fallback) ----------------- */

  const {
    data: categoryDataPrimary,
    isLoading: categoriesLoadingPrimary,
    isFetching: categoriesFetchingPrimary,
  } = useListProductCategoriesAdminQuery(
    {
      is_active: 1,
      locale: effectiveLocale,
      ...(itemType ? { item_type: String(itemType) } : {}),
    } as any,
    { skip: !effectiveLocale },
  );

  const primaryRowsLen = Array.isArray(categoryDataPrimary) ? categoryDataPrimary.length : 0;

  const {
    data: categoryDataFallback,
    isLoading: categoriesLoadingFallback,
    isFetching: categoriesFetchingFallback,
  } = useListProductCategoriesAdminQuery(
    {
      is_active: 1,
      ...(itemType ? { item_type: String(itemType) } : {}),
    } as any,
    { skip: !!primaryRowsLen },
  );

  const categoryData = primaryRowsLen ? categoryDataPrimary : categoryDataFallback;

  const categoriesBusy =
    categoriesLoadingPrimary ||
    categoriesFetchingPrimary ||
    (!primaryRowsLen && (categoriesLoadingFallback || categoriesFetchingFallback));

  const {
    data: subCategoryData,
    isLoading: subCategoriesLoading,
    isFetching: subCategoriesFetching,
  } = useListProductSubcategoriesAdminQuery(
    values.category_id
      ? ({
          category_id: values.category_id,
          is_active: 1,
          locale: effectiveLocale,
          ...(itemType ? { item_type: String(itemType) } : {}),
        } as any)
      : (undefined as any),
    { skip: !values.category_id || !effectiveLocale },
  );

  const subCategoriesBusy = subCategoriesLoading || subCategoriesFetching;

  const categoryOptions = useMemo(() => {
    const rows = (categoryData ?? []) as any[];
    const seen = new Set<string>();

    return rows
      .filter((c) => c?.id && !seen.has(c.id) && (seen.add(c.id), true))
      .map((c) => {
        const label = c?.name || c?.title || c?.label || c?.slug || c?.code || c?.id;

        return {
          id: String(c.id),
          name: String(label),
          slug: c.slug ? String(c.slug) : undefined,
        };
      });
  }, [categoryData]);

  const subCategoryOptions = useMemo(() => {
    const rows = (subCategoryData ?? []) as any[];
    const seen = new Set<string>();

    return rows
      .filter((s) => s?.id && !seen.has(s.id) && (seen.add(s.id), true))
      .map((s) => {
        const label = s?.name || s?.title || s?.label || s?.slug || s?.code || s?.id;

        return {
          id: String(s.id),
          name: String(label),
          slug: s.slug ? String(s.slug) : undefined,
          category_id: s.category_id ? String(s.category_id) : '',
        };
      });
  }, [subCategoryData]);

  /* ----------------- Handlers ----------------- */

  const handleChange =
    (field: keyof ProductFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleCheckboxChange =
    (field: keyof ProductFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.checked as never }));
    };

  const handleLocaleChange = async (nextLocale: string) => {
    const val = normLower(nextLocale);

    setValues((prev) => ({
      ...prev,
      locale: val,
    }));

    if (mode === 'edit' && productId && onLocaleChange) {
      try {
        await onLocaleChange(val);
      } catch (_err) {
        toast.error('Dil değiştirilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setValues((prev) => ({ ...prev, category_id: id, sub_category_id: '' }));
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setValues((prev) => ({ ...prev, sub_category_id: id }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    void onSubmit(values);
  };

  const handleGeneralJsonChange = (next: any) => {
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      toast.error('Genel JSON formatı geçersiz. Object bekleniyor.');
      return;
    }
    setValues(next as ProductFormValues);
  };

  const storageMeta = {
    module_key: 'product',
    locale: effectiveLocale,
    slug: values.slug || '',
    ...(itemType ? { item_type: String(itemType) } : {}),
  };

  const changeTab = (tab: ProductFormTab) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  const localeSelectOptions: AdminLocaleOption[] = useMemo(() => {
    const base = (locales ?? []).map((x) => ({ value: normLower(x.value), label: x.label }));
    const siteDefaultLabel = effectiveDefaultLocale
      ? `(Site varsayılanı: ${effectiveDefaultLocale})`
      : '(Site varsayılanı)';
    return [{ value: '', label: siteDefaultLabel }, ...base];
  }, [locales, effectiveDefaultLocale]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header py-2 d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 small fw-semibold">
              {mode === 'create' ? 'Yeni Ürün Oluştur' : 'Ürün Düzenle'}
            </h5>
            <div className="text-muted small">
              Ürün için başlık, slug, fiyat, kategori ve görselleri doldur. Diğer detaylar alttaki
              sekmelerde.
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
            <button type="submit" className="btn btn-primary btn-sm" disabled={disabled}>
              {saving
                ? mode === 'create'
                  ? 'Oluşturuluyor...'
                  : 'Kaydediliyor...'
                : mode === 'create'
                ? 'Ürünü Oluştur'
                : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>

        <div className="card-body">
          <ul className="nav nav-tabs small mb-3">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                onClick={changeTab('general')}
              >
                Genel
              </button>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={changeTab('specs')}
                disabled={!productId}
              >
                Teknik Özellikler (Specs)
              </button>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'faqs' ? 'active' : ''}`}
                onClick={changeTab('faqs')}
                disabled={!productId}
              >
                Sık Sorulanlar (FAQs)
              </button>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={changeTab('reviews')}
                disabled={!productId}
              >
                Yorumlar (Reviews)
              </button>
            </li>
          </ul>

          <div className="tab-content">
            <div className={`tab-pane fade ${activeTab === 'general' ? 'show active' : ''}`}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 small fw-semibold">Genel Bilgiler</h6>
                  <div className="text-muted small">
                    Ürünün temel alanları. İstersen formdan, istersen JSON olarak düzenleyebilirsin.
                  </div>
                </div>

                <div className="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    className={`btn btn-outline-secondary ${
                      generalViewMode === 'form' ? 'active' : ''
                    }`}
                    onClick={() => setGeneralViewMode('form')}
                    disabled={disabled}
                  >
                    Form
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-secondary ${
                      generalViewMode === 'json' ? 'active' : ''
                    }`}
                    onClick={() => setGeneralViewMode('json')}
                    disabled={disabled}
                  >
                    JSON
                  </button>
                </div>
              </div>

              {generalViewMode === 'form' && (
                <div className="row g-4">
                  {/* LEFT */}
                  <div className="col-lg-8">
                    <div className="row g-2 mb-3">
                      <div className="col-sm-4">
                        <label className="form-label small mb-1">Dil</label>
                        <AdminLocaleSelect
                          value={values.locale}
                          onChange={handleLocaleChange}
                          options={localeSelectOptions}
                          loading={!!localesLoading}
                          disabled={disabled || (!!localesLoading && !locales.length)}
                          label="Dil"
                        />
                        <div className="form-text small">
                          Seçim; aynı zamanda Specs/SSS sekmelerinde hangi dil kaydını
                          düzenleyeceğini belirler.
                        </div>
                      </div>

                      <div className="col-sm-4 d-flex align-items-end">
                        <div className="form-check me-3">
                          <input
                            id="is_active"
                            type="checkbox"
                            className="form-check-input"
                            checked={values.is_active}
                            onChange={handleCheckboxChange('is_active')}
                            disabled={disabled}
                          />
                          <label className="form-check-label small" htmlFor="is_active">
                            Aktif olsun
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            id="is_featured"
                            type="checkbox"
                            className="form-check-input"
                            checked={values.is_featured}
                            onChange={handleCheckboxChange('is_featured')}
                            disabled={disabled}
                          />
                          <label className="form-check-label small" htmlFor="is_featured">
                            Öne çıkan
                          </label>
                        </div>
                      </div>

                      <div className="col-sm-4">
                        <label className="form-label small mb-1">Sıralama (order_num)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={values.order_num}
                          onChange={handleChange('order_num')}
                          disabled={disabled}
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small mb-1">Başlık</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={values.title}
                        onChange={handleChange('title')}
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
                        onChange={handleChange('slug')}
                        disabled={disabled}
                        required
                      />
                      <div className="form-text small">
                        <code>(locale, slug)</code> birlikte unique tutulur.
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-sm-4">
                        <label className="form-label small mb-1">Fiyat (₺)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control form-control-sm"
                          value={values.price}
                          onChange={handleChange('price')}
                          disabled={disabled}
                          required
                        />
                      </div>

                      <div className="col-sm-4">
                        <label className="form-label small mb-1">Stok Adedi</label>
                        <input
                          type="number"
                          min="0"
                          className="form-control form-control-sm"
                          value={values.stock_quantity}
                          onChange={handleChange('stock_quantity')}
                          disabled={disabled}
                        />
                      </div>

                      <div className="col-sm-4">
                        <label className="form-label small mb-1">Ürün Kodu</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={values.product_code}
                          onChange={handleChange('product_code')}
                          disabled={disabled}
                        />
                      </div>
                    </div>

                    <RichContentEditor
                      label="Açıklama (Zengin İçerik)"
                      value={values.description}
                      onChange={(v) => setValues((p) => ({ ...p, description: v }))}
                      disabled={disabled}
                      height="260px"
                    />

                    <div className="mt-3">
                      <label className="form-label small mb-1">Etiketler</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="virgülle ayır: kule,sogutma,endustriyel..."
                        value={values.tags}
                        onChange={handleChange('tags')}
                        disabled={disabled}
                      />
                      <div className="form-text small">
                        Virgülle ayrılmış değerler <code>string[]</code> olarak saklanır.
                      </div>
                    </div>

                    {/* ✅ SEO (moved here from right/image side) */}
                    <div className="border rounded-2 p-3 mt-3">
                      <div className="small fw-semibold mb-2">SEO</div>

                      <div className="mb-3">
                        <label className="form-label small mb-1">Meta Title</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={values.meta_title}
                          onChange={handleChange('meta_title')}
                          disabled={disabled}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small mb-1">Meta Description</label>
                        <textarea
                          className="form-control form-control-sm"
                          rows={3}
                          value={values.meta_description}
                          onChange={handleChange('meta_description')}
                          disabled={disabled}
                        />
                      </div>

                      <div className="mb-0">
                        <label className="form-label small mb-1">Ortalama Puan (0-5)</label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          className="form-control form-control-sm"
                          value={values.rating}
                          onChange={handleChange('rating')}
                          disabled={disabled}
                        />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="col-lg-4">
                    <div className="border rounded-2 p-3 mb-3">
                      <div className="small fw-semibold mb-2">Sınıflandırma</div>

                      <div className="mb-3">
                        <label className="form-label small mb-1">Kategori</label>
                        <select
                          className="form-select form-select-sm"
                          value={values.category_id}
                          onChange={handleCategoryChange}
                          disabled={disabled || categoriesBusy}
                        >
                          <option value="">
                            {categoriesBusy
                              ? 'Kategoriler yükleniyor...'
                              : categoryOptions.length
                              ? 'Kategori seç...'
                              : 'Kategori bulunamadı'}
                          </option>

                          {categoryOptions.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>

                        <div className="form-text small">
                          Önce <code>locale</code> ile denenir; boşsa locale’siz fallback yapılır.
                        </div>
                      </div>

                      <div className="mb-0">
                        <label className="form-label small mb-1">Alt Kategori</label>
                        <select
                          className="form-select form-select-sm"
                          value={values.sub_category_id}
                          onChange={handleSubCategoryChange}
                          disabled={disabled || subCategoriesBusy || !values.category_id}
                        >
                          <option value="">
                            {!values.category_id
                              ? 'Önce kategori seç'
                              : subCategoriesBusy
                              ? 'Alt kategoriler yükleniyor...'
                              : 'Alt kategori (opsiyonel)'}
                          </option>

                          {subCategoryOptions
                            .filter((s) => s.category_id === values.category_id)
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="border rounded-2 p-3 mb-0">
                      <div className="small fw-semibold mb-2">Görseller</div>

                      <ProductFormImageColumn
                        productId={productId}
                        locale={effectiveLocale}
                        itemType={itemType}
                        disabled={disabled}
                        metadata={storageMeta}
                        coverValue={values.image_url}
                        onCoverChange={(url) => setValues((p) => ({ ...p, image_url: url }))}
                        onGalleryChange={() => {
                          /* no-op */
                        }}
                        // ✅ NEW: legacy fallback
                        legacyUrls={
                          Array.isArray((initialData as any)?.images)
                            ? ((initialData as any).images as any)
                            : []
                        }
                        onLegacyUrlsChange={(urls) => {
                          // UI state’i de güncel tutmak istersen burada yapabilirsin (opsiyonel)
                          // values’da images alanı yok → sadece initialData refresh’le güncellenir.
                          void urls;
                        }}
                      />

                      <div className="mt-3">
                        <label className="form-label small mb-1">Görsel Alt Metni</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={values.alt}
                          onChange={handleChange('alt')}
                          disabled={disabled}
                        />
                      </div>

                      <div className="mt-3">
                        <label className="form-label small mb-1">Kapak Görsel Asset ID</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="storage_asset_id (opsiyonel/legacy)"
                          value={values.storage_asset_id}
                          onChange={handleChange('storage_asset_id')}
                          disabled={disabled}
                        />
                        <div className="form-text small">
                          Kapakta URL bazlı çalışıyoruz; bu alan legacy/opsiyonel.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {generalViewMode === 'json' && (
                <AdminJsonEditor
                  label={
                    <>
                      Ürün Genel JSON <span className="text-muted">(ProductFormValues)</span>
                    </>
                  }
                  value={values}
                  onChange={handleGeneralJsonChange}
                  disabled={disabled}
                  helperText={
                    <>
                      Bu alan formdaki tüm genel alanların JSON karşılığıdır. Buradan düzenlediğin
                      değerler forma da yansır.
                    </>
                  }
                  height={320}
                />
              )}
            </div>

            <div className={`tab-pane fade ${activeTab === 'specs' ? 'show active' : ''}`}>
              <ProductSpecsTab
                productId={productId}
                locale={effectiveLocale}
                disabled={disabled || !productId}
              />
            </div>

            <div className={`tab-pane fade ${activeTab === 'faqs' ? 'show active' : ''}`}>
              <ProductFaqsTab
                productId={productId}
                locale={effectiveLocale}
                disabled={disabled || !productId}
              />
            </div>

            <div className={`tab-pane fade ${activeTab === 'reviews' ? 'show active' : ''}`}>
              <ProductReviewsTab productId={productId} disabled={disabled || !productId} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
