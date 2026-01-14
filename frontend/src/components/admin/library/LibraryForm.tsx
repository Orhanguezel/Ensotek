'use client';

import React from 'react';
import type { LocaleOption } from '@/components/admin/library/LibraryHeader';

import type {
  CategoryDto,
  SubCategoryDto
} from '@/integrations/types';

import {
  useListCategoriesAdminQuery,
  useListSubCategoriesAdminQuery,
} from '@/integrations/rtk/hooks';

import RichContentEditor from '@/components/common/RichContentEditor';

export type LibraryFormValues = {
  locale: string;

  is_published: boolean;
  is_active: boolean;
  featured: boolean;

  display_order: number;
  type: string;

  category_id: string;
  sub_category_id: string;

  published_at: string;

  name: string;
  slug: string;

  description: string;

  image_alt: string;
  tags: string;

  meta_title: string;
  meta_description: string;
  meta_keywords: string;

  featured_image: string;
  image_url: string;
  image_asset_id: string;
};

export type LibraryFormProps = {
  mode: 'create' | 'edit';
  values: LibraryFormValues;

  onChange: <K extends keyof LibraryFormValues>(field: K, value: LibraryFormValues[K]) => void;
  onLocaleChange?: (locale: string) => void;

  saving: boolean;
  localeOptions: LocaleOption[];
  localesLoading?: boolean;
};

type SelectOption = { value: string; label: string };

export const LibraryForm: React.FC<LibraryFormProps> = ({
  values,
  onChange,
  onLocaleChange,
  saving,
  localeOptions,
  localesLoading,
}) => {
  const categoryQueryParams = React.useMemo(
    () => ({
      locale: values.locale || undefined,
      module_key: 'library',
      limit: 500,
      offset: 0,
    }),
    [values.locale],
  );

  const { data: categoryRows, isLoading: isCategoriesLoading } = useListCategoriesAdminQuery(
    categoryQueryParams as any,
  );

  const categoryOptions: SelectOption[] = React.useMemo(
    () =>
      (categoryRows ?? []).map((c: CategoryDto) => ({
        value: c.id,
        label: (c as any).name || (c as any).slug || (c as any).name_default || c.id,
      })),
    [categoryRows],
  );

  const subCategoryQueryParams = React.useMemo(
    () => ({
      locale: values.locale || undefined,
      category_id: values.category_id || undefined,
      limit: 500,
      offset: 0,
    }),
    [values.locale, values.category_id],
  );

  const { data: subCategoryRows, isLoading: isSubCategoriesLoading } =
    useListSubCategoriesAdminQuery(subCategoryQueryParams as any);

  const subCategoryOptions: SelectOption[] = React.useMemo(
    () =>
      (subCategoryRows ?? []).map((sc: SubCategoryDto) => ({
        value: sc.id,
        label: (sc as any).name || (sc as any).slug || (sc as any).name_default || sc.id,
      })),
    [subCategoryRows],
  );

  const categoriesDisabled = saving || isCategoriesLoading;
  const subCategoriesDisabled = saving || isSubCategoriesLoading || !values.category_id;

  return (
    <div className="row g-3">
      {/* Üst satır */}
      <div className="col-md-4">
        <label className="form-label small">
          Dil {localesLoading && <span className="spinner-border spinner-border-sm ms-1" />}
        </label>
        <select
          className="form-select form-select-sm"
          disabled={saving}
          value={values.locale}
          onChange={(e) => {
            const nextLocale = e.target.value;
            onChange('locale', nextLocale);
            onLocaleChange?.(nextLocale);
          }}
        >
          {localeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label small">Tür (type)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.type}
          onChange={(e) => onChange('type', e.target.value)}
          placeholder="Örn: other / brochure / principle"
          maxLength={32}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">Sıralama (display_order)</label>
        <input
          type="number"
          className="form-control form-control-sm"
          disabled={saving}
          value={values.display_order}
          min={0}
          onChange={(e) => onChange('display_order', Number(e.target.value) || 0)}
        />
      </div>

      {/* Flags */}
      <div className="col-12">
        <div className="d-flex flex-wrap gap-3">
          <div className="form-check form-switch small">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={saving}
              checked={values.is_published}
              onChange={(e) => onChange('is_published', e.target.checked)}
              id="lib-is-published"
            />
            <label className="form-check-label" htmlFor="lib-is-published">
              Yayında (is_published)
            </label>
          </div>

          <div className="form-check form-switch small">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={saving}
              checked={values.is_active}
              onChange={(e) => onChange('is_active', e.target.checked)}
              id="lib-is-active"
            />
            <label className="form-check-label" htmlFor="lib-is-active">
              Aktif (is_active)
            </label>
          </div>

          <div className="form-check form-switch small">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={saving}
              checked={values.featured}
              onChange={(e) => onChange('featured', e.target.checked)}
              id="lib-featured"
            />
            <label className="form-check-label" htmlFor="lib-featured">
              Öne Çıkan (featured)
            </label>
          </div>
        </div>
      </div>

      <div className="col-12">
        <hr className="my-1" />
      </div>

      {/* Kategoriler */}
      <div className="col-md-6">
        <label className="form-label small">Kategori (category_id)</label>
        <select
          className="form-select form-select-sm"
          value={values.category_id}
          onChange={(e) => {
            const val = e.target.value;
            onChange('category_id', val);
            onChange('sub_category_id', '');
          }}
          disabled={categoriesDisabled}
        >
          <option value="">(Kategori seç)</option>
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label small">Alt kategori (sub_category_id)</label>
        <select
          className="form-select form-select-sm"
          value={values.sub_category_id}
          onChange={(e) => onChange('sub_category_id', e.target.value)}
          disabled={subCategoriesDisabled}
        >
          <option value="">(Alt kategori seç)</option>
          {subCategoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Yayın + başlık */}
      <div className="col-md-6">
        <label className="form-label small">Yayın tarihi (published_at – ISO)</label>
        <div className="input-group input-group-sm">
          <input
            className="form-control form-control-sm"
            disabled={saving}
            placeholder="Örn: 2025-01-01T12:00:00Z"
            value={values.published_at}
            onChange={(e) => onChange('published_at', e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            disabled={saving}
            onClick={() => onChange('published_at', new Date().toISOString())}
          >
            Şu an
          </button>
        </div>
      </div>

      <div className="col-md-6">
        <label className="form-label small">Ad (name)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          maxLength={255}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">Slug</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.slug}
          onChange={(e) => onChange('slug', e.target.value)}
          placeholder="kucuk-harf-ve-tire"
          maxLength={255}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">Görsel alt metni (image_alt)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.image_alt}
          onChange={(e) => onChange('image_alt', e.target.value)}
          maxLength={255}
        />
      </div>

      <div className="col-12">
        <label className="form-label small">Etiketler (tags)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          placeholder="Örn: brochure, pdf, kurumsal"
          value={values.tags}
          onChange={(e) => onChange('tags', e.target.value)}
          maxLength={255}
        />
      </div>

      <div className="col-12">
        <hr className="my-1" />
      </div>

      {/* İçerik */}
      <div className="col-12">
        <RichContentEditor
          label="Açıklama / İçerik (description – HTML + Önizleme)"
          value={values.description}
          onChange={(val) => onChange('description', val)}
          disabled={saving}
          height="280px"
        />
      </div>

      <div className="col-12">
        <hr className="my-1" />
      </div>

      {/* SEO */}
      <div className="col-md-4">
        <label className="form-label small">Meta title</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.meta_title}
          onChange={(e) => onChange('meta_title', e.target.value)}
          maxLength={255}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">Meta description</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.meta_description}
          onChange={(e) => onChange('meta_description', e.target.value)}
          maxLength={500}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">Meta keywords</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.meta_keywords}
          onChange={(e) => onChange('meta_keywords', e.target.value)}
          maxLength={255}
        />
      </div>

      <div className="col-12">
        <hr className="my-1" />
      </div>

      {/* Legacy/storage */}
      <div className="col-md-4">
        <label className="form-label small">featured_image (legacy)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.featured_image}
          onChange={(e) => onChange('featured_image', e.target.value)}
          maxLength={500}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">image_url (legacy url)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.image_url}
          onChange={(e) => onChange('image_url', e.target.value)}
          placeholder="https://..."
          maxLength={500}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small">image_asset_id (storage)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.image_asset_id}
          onChange={(e) => onChange('image_asset_id', e.target.value)}
          maxLength={36}
        />
      </div>
    </div>
  );
};
