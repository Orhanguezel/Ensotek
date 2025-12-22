// =============================================================
// FILE: src/components/admin/library/LibraryForm.tsx
// Ensotek – Library Form Fields (LEFT COLUMN ONLY)
// - All RTK hooks imported from "@/integrations/rtk/hooks"
// =============================================================

'use client';

import React from 'react';
import type { LocaleOption } from '@/components/admin/library/LibraryHeader';

import type { CategoryDto } from '@/integrations/types/category.types';
import type { SubCategoryDto } from '@/integrations/types/subcategory.types';

import {
  useListCategoriesAdminQuery,
  useListSubCategoriesAdminQuery,
} from '@/integrations/rtk/hooks';

export type LibraryFormValues = {
  locale: string;

  is_published: boolean;
  is_active: boolean;
  display_order: number;

  tags: string[] | null | undefined;

  category_id: string;
  sub_category_id: string;

  author: string;
  published_at: string;

  title: string;
  slug: string;
  summary: string;
  content: string;

  meta_title: string;
  meta_description: string;
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

type CategoryOption = {
  value: string;
  label: string;
};

export const LibraryForm: React.FC<LibraryFormProps> = ({
  values,
  onChange,
  onLocaleChange,
  saving,
  localeOptions,
  localesLoading,
}) => {
  const tagsInputValue = Array.isArray(values.tags) ? values.tags.join(', ') : '';

  const handleTagsChange = (raw: string) => {
    const arr = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onChange('tags', arr);
  };

  /* -------------------- Kategori listesi (module_key=library) -------------------- */

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

  const categoryOptions: CategoryOption[] = React.useMemo(
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

  const subCategoryOptions: CategoryOption[] = React.useMemo(
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
    <div className="row g-2">
      {/* Locale */}
      <div className="col-md-4">
        <label className="form-label small">
          Dil {localesLoading && <span className="spinner-border spinner-border-sm ms-1" />}
        </label>
        <select
          className="form-select form-select-sm"
          disabled={saving}
          value={values.locale}
          onChange={(e) => {
            const locale = e.target.value;
            onChange('locale', locale);
            onLocaleChange?.(locale);
          }}
        >
          {localeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* display_order */}
      <div className="col-md-4">
        <label className="form-label small">Sıralama (display_order)</label>
        <input
          type="number"
          className="form-control form-control-sm"
          disabled={saving}
          value={values.display_order}
          onChange={(e) => onChange('display_order', Number(e.target.value) || 0)}
        />
      </div>

      {/* flags */}
      <div className="col-md-4 d-flex align-items-end">
        <div className="d-flex gap-3 small">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={saving}
              checked={values.is_published}
              onChange={(e) => onChange('is_published', e.target.checked)}
            />
            <label className="form-check-label">Yayında (is_published)</label>
          </div>
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={saving}
              checked={values.is_active}
              onChange={(e) => onChange('is_active', e.target.checked)}
            />
            <label className="form-check-label">Aktif (is_active)</label>
          </div>
        </div>
      </div>

      {/* tags */}
      <div className="col-12">
        <label className="form-label small">Etiketler (tags – tags_json)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          placeholder="Örn: brochure, pdf, kurumsal"
          value={tagsInputValue}
          onChange={(e) => handleTagsChange(e.target.value)}
        />
        <div className="form-text small">
          Virgülle ayırarak birden fazla etiket girebilirsin. Backend&apos;de <code>tags_json</code>{' '}
          kolonuna JSON array olarak yazılacak.
        </div>
      </div>

      {/* category_id / sub_category_id */}
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
        <div className="form-text small">
          Kategoriler, <code>module_key = &apos;library&apos;</code> olan kategori modülünden gelir.
        </div>
        {isCategoriesLoading && <div className="form-text small">Kategoriler yükleniyor...</div>}
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
        <div className="form-text small">Alt kategoriler, seçili kategoriye göre filtrelenir.</div>
        {isSubCategoriesLoading && (
          <div className="form-text small">Alt kategoriler yükleniyor...</div>
        )}
      </div>

      {/* title */}
      <div className="col-md-6">
        <label className="form-label small">Başlık (title)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.title}
          onChange={(e) => onChange('title', e.target.value)}
        />
      </div>

      {/* slug */}
      <div className="col-md-6">
        <label className="form-label small">Slug</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.slug}
          onChange={(e) => onChange('slug', e.target.value)}
        />
      </div>

      {/* author */}
      <div className="col-md-6">
        <label className="form-label small">Yazar / Kaynak (author)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.author}
          onChange={(e) => onChange('author', e.target.value)}
        />
      </div>

      {/* published_at */}
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

      {/* summary */}
      <div className="col-12">
        <label className="form-label small">Kısa özet (summary)</label>
        <textarea
          className="form-control form-control-sm"
          rows={2}
          disabled={saving}
          value={values.summary}
          onChange={(e) => onChange('summary', e.target.value)}
        />
      </div>

      {/* SEO */}
      <div className="col-md-6">
        <label className="form-label small">Meta title</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.meta_title}
          onChange={(e) => onChange('meta_title', e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small">Meta description</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.meta_description}
          onChange={(e) => onChange('meta_description', e.target.value)}
        />
      </div>
    </div>
  );
};
