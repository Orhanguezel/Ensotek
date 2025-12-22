// =============================================================
// FILE: src/components/admin/custompage/CustomPageSidebarColumn.tsx
// Responsive spacing fix:
// - Reduce excessive vertical spacing on small screens
// - Keep readability on lg+
// =============================================================

import React from 'react';
import { AdminImageUploadField } from '@/components/common/AdminImageUploadField';
import type { CategoryOption, ContentImageSize, CustomPageFormValues } from './CustomPageForm';

type Props = {
  values: CustomPageFormValues;
  disabled: boolean;

  categoriesDisabled: boolean;
  subCategoriesDisabled: boolean;
  categoryOptions: CategoryOption[];
  subCategoryOptions: CategoryOption[];
  isCategoriesLoading: boolean;
  isSubCategoriesLoading: boolean;

  imageMetadata: Record<string, string | number | boolean>;
  contentImageSize: ContentImageSize;
  setContentImageSize: (s: ContentImageSize) => void;
  contentImagePreview: string;
  handleAddContentImage: (url: string, alt?: string) => void;

  manualImageUrl: string;
  manualImageAlt: string;
  setManualImageUrl: (v: string) => void;
  setManualImageAlt: (v: string) => void;
  handleAddManualImage: () => void;

  setValues: React.Dispatch<React.SetStateAction<CustomPageFormValues>>;
};

export const CustomPageSidebarColumn: React.FC<Props> = ({
  values,
  disabled,
  categoriesDisabled,
  subCategoriesDisabled,
  categoryOptions,
  subCategoryOptions,
  isCategoriesLoading,
  isSubCategoriesLoading,
  imageMetadata,
  contentImageSize,
  setContentImageSize,
  contentImagePreview,
  handleAddContentImage,
  manualImageUrl,
  manualImageAlt,
  setManualImageUrl,
  setManualImageAlt,
  handleAddManualImage,
  setValues,
}) => {
  const blockCls = 'mb-2 mb-lg-3'; // ✅ small: tight, lg+: normal

  return (
    <>
      {/* Kategori */}
      <div className={blockCls}>
        <label className="form-label small mb-1">Kategori</label>
        <select
          className="form-select form-select-sm"
          value={values.category_id}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              category_id: e.target.value,
              sub_category_id: '',
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
        {isCategoriesLoading && <div className="form-text small">Kategoriler yükleniyor...</div>}
      </div>

      {/* Alt kategori */}
      <div className={blockCls}>
        <label className="form-label small mb-1">Alt Kategori</label>
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
        {isSubCategoriesLoading && (
          <div className="form-text small">Alt kategoriler yükleniyor...</div>
        )}
      </div>

      {/* Etiketler */}
      <div className={blockCls}>
        <label className="form-label small mb-1">Etiketler (Tags)</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="ör: ensotek,su sogutma,kule,blog"
          value={values.tags}
          onChange={(e) => setValues((prev) => ({ ...prev, tags: e.target.value }))}
          disabled={disabled}
        />
      </div>

      {/* Öne çıkan görsel */}
      <div className={blockCls}>
        <AdminImageUploadField
          label="Öne Çıkan Görsel"
          helperText={
            <>
              Storage modülü üzerinden özel sayfa için görsel yükleyebilirsin. URL otomatik yazılır.
            </>
          }
          bucket="public"
          folder="custom_pages"
          metadata={imageMetadata}
          value={values.featured_image}
          onChange={(url) => setValues((prev) => ({ ...prev, featured_image: url }))}
          disabled={disabled}
          openLibraryHref="/admin/storage"
        />
      </div>

      <div className={blockCls}>
        <label className="form-label small mb-1">Öne Çıkan Görsel URL</label>
        <input
          type="url"
          className="form-control form-control-sm"
          placeholder="https://..."
          value={values.featured_image}
          onChange={(e) => setValues((prev) => ({ ...prev, featured_image: e.target.value }))}
          disabled={disabled}
        />
      </div>

      <div className={blockCls}>
        <label className="form-label small mb-1">Öne Çıkan Görsel Asset ID</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="storage asset id (36 char)"
          value={values.featured_image_asset_id}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, featured_image_asset_id: e.target.value }))
          }
          disabled={disabled}
        />
      </div>

      <div className={blockCls}>
        <label className="form-label small mb-1">Görsel Alt Metni</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={values.featured_image_alt}
          onChange={(e) => setValues((prev) => ({ ...prev, featured_image_alt: e.target.value }))}
          disabled={disabled}
        />
      </div>

      {/* İçerik görsel boyutu */}
      <div className={blockCls}>
        <label className="form-label small mb-1">İçerik Görsel Boyutu</label>
        <select
          className="form-select form-select-sm"
          value={contentImageSize}
          onChange={(e) => setContentImageSize(e.target.value as ContentImageSize)}
          disabled={disabled}
        >
          <option value="sm">Küçük (1/2)</option>
          <option value="md">Orta (3/4)</option>
          <option value="lg">Büyük (varsayılan)</option>
          <option value="full">Tam genişlik</option>
        </select>
      </div>

      {/* İçerik görselleri */}
      <div className={blockCls}>
        <AdminImageUploadField
          label="İçerik Görselleri (Yükle)"
          helperText={<>Yüklenen görsel içerik alanının sonuna blok olarak eklenir.</>}
          bucket="public"
          folder="custom_pages/content"
          metadata={{
            module_key: 'custom_page',
            locale: values.locale || '',
            page_slug: values.slug || values.title || '',
            section: 'content',
            ...(values.page_id ? { page_id: values.page_id } : {}),
          }}
          multiple
          value={contentImagePreview}
          onChange={(url) => handleAddContentImage(url)}
          disabled={disabled}
          openLibraryHref="/admin/storage"
        />
      </div>

      {/* Serbest URL */}
      <div className={blockCls}>
        <label className="form-label small mb-1">Serbest URL ile İçerik Görseli</label>
        <input
          type="url"
          className="form-control form-control-sm mb-2"
          placeholder="https://... (görsel URL'i)"
          value={manualImageUrl}
          onChange={(e) => setManualImageUrl(e.target.value)}
          disabled={disabled}
        />
        <input
          type="text"
          className="form-control form-control-sm mb-2"
          placeholder="Alt metin (opsiyonel)"
          value={manualImageAlt}
          onChange={(e) => setManualImageAlt(e.target.value)}
          disabled={disabled}
        />
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleAddManualImage}
          disabled={disabled}
        >
          Serbest URL&apos;yi İçeriğe Ekle
        </button>
      </div>

      {/* SEO */}
      <div className={blockCls}>
        <label className="form-label small mb-1">Meta Title</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={values.meta_title}
          onChange={(e) => setValues((prev) => ({ ...prev, meta_title: e.target.value }))}
          disabled={disabled}
        />
      </div>

      <div className="mb-0">
        <label className="form-label small mb-1">Meta Description</label>
        <textarea
          className="form-control form-control-sm"
          rows={3}
          value={values.meta_description}
          onChange={(e) => setValues((prev) => ({ ...prev, meta_description: e.target.value }))}
          disabled={disabled}
        />
      </div>
    </>
  );
};
