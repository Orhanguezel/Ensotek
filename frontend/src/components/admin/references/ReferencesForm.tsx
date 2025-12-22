// =============================================================
// FILE: src/components/admin/references/ReferencesForm.tsx
// Ensotek – References Form Fields (LEFT COLUMN ONLY)
// - Locale select: AdminLocaleSelect + useAdminLocales standardı
// =============================================================

'use client';

import React from 'react';

import { AdminLocaleSelect } from '@/components/common/AdminLocaleSelect';
import type { AdminLocaleOption } from '@/components/common/AdminLocaleSelect';

export type ReferencesFormValues = {
  locale: string;

  is_published: boolean;
  is_featured: boolean;
  display_order: number;

  featured_image: string;
  website_url: string;

  title: string;
  slug: string;
  summary: string;
  content: string;

  featured_image_alt: string;
  meta_title: string;
  meta_description: string;
};

export type ReferencesFormProps = {
  mode: 'create' | 'edit';
  values: ReferencesFormValues;

  onChange: <K extends keyof ReferencesFormValues>(
    field: K,
    value: ReferencesFormValues[K],
  ) => void;

  // locale değişince edit sayfasında GET tetiklenebilir
  onLocaleChange?: (locale: string) => void;

  saving: boolean;

  // ✅ tek kaynak: useAdminLocales().localeOptions
  localeOptions: AdminLocaleOption[];
  localesLoading?: boolean;
  localeDisabled?: boolean;
};

const toShort = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

export const ReferencesForm: React.FC<ReferencesFormProps> = ({
  values,
  onChange,
  onLocaleChange,
  saving,
  localeOptions,
  localesLoading = false,
  localeDisabled = false,
}) => {
  const normalizedValue = toShort(values.locale);

  // ✅ kritik: value option’larla eşleşmiyorsa select “seçilmiyor” gibi davranır
  const safeValue =
    normalizedValue && localeOptions.some((o) => toShort(o.value) === normalizedValue)
      ? normalizedValue
      : toShort(localeOptions[0]?.value) || '';

  const handleLocaleSelect = (raw: string) => {
    const next = toShort(raw);
    if (!next) return;

    // UI anında değişsin
    onChange('locale', next);

    // edit modda içerik fetch
    onLocaleChange?.(next);
  };

  return (
    <div className="row g-2">
      {/* Locale */}
      <div className="col-md-4">
        <label className="form-label small mb-1">Dil</label>

        <AdminLocaleSelect
          id="ref-locale"
          value={safeValue}
          onChange={handleLocaleSelect}
          options={localeOptions}
          loading={localesLoading}
          disabled={saving || localeDisabled}
          label="Dil"
        />
      </div>

      {/* display_order */}
      <div className="col-md-4">
        <label className="form-label small mb-1">Sıralama</label>
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
              checked={!!values.is_published}
              onChange={(e) => onChange('is_published', e.target.checked)}
              id="ref-is-published"
            />
            <label className="form-check-label" htmlFor="ref-is-published">
              Yayında
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={saving}
              checked={!!values.is_featured}
              onChange={(e) => onChange('is_featured', e.target.checked)}
              id="ref-is-featured"
            />
            <label className="form-check-label" htmlFor="ref-is-featured">
              Öne çıkan
            </label>
          </div>
        </div>
      </div>

      {/* title */}
      <div className="col-md-6">
        <label className="form-label small mb-1">Başlık (title)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.title}
          onChange={(e) => onChange('title', e.target.value)}
        />
      </div>

      {/* slug */}
      <div className="col-md-6">
        <label className="form-label small mb-1">Slug</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.slug}
          onChange={(e) => onChange('slug', e.target.value)}
        />
      </div>

      {/* website_url */}
      <div className="col-md-6">
        <label className="form-label small mb-1">Website URL (opsiyonel)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.website_url}
          onChange={(e) => onChange('website_url', e.target.value)}
        />
      </div>

      {/* featured_image */}
      <div className="col-md-6">
        <label className="form-label small mb-1">Öne çıkan görsel URL (featured_image)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.featured_image}
          onChange={(e) => onChange('featured_image', e.target.value)}
        />
      </div>

      {/* summary */}
      <div className="col-12">
        <label className="form-label small mb-1">Kısa özet (summary)</label>
        <textarea
          className="form-control form-control-sm"
          rows={2}
          disabled={saving}
          value={values.summary}
          onChange={(e) => onChange('summary', e.target.value)}
        />
      </div>

      {/* content */}
      <div className="col-12">
        <label className="form-label small mb-1">İçerik (HTML veya zengin metin HTML&apos;i)</label>
        <textarea
          className="form-control form-control-sm"
          rows={6}
          disabled={saving}
          value={values.content}
          onChange={(e) => onChange('content', e.target.value)}
        />
        <div className="form-text small">
          Backend bu alanı JSON içine paketleyerek saklayabilir; şimdilik düz HTML yazabilirsin.
        </div>
      </div>

      {/* SEO / alt */}
      <div className="col-md-4">
        <label className="form-label small mb-1">Görsel alt metni</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.featured_image_alt}
          onChange={(e) => onChange('featured_image_alt', e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small mb-1">Meta title</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.meta_title}
          onChange={(e) => onChange('meta_title', e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label small mb-1">Meta description</label>
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
