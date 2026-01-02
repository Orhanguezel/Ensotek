// =============================================================
// FILE: src/components/admin/library/LibraryFormPage.tsx
// Ensotek – Library Form Sayfası (Create/Edit + JSON + Image + Files)
// ✅ Schema + validation + types aligned to library.schema.ts + validation.ts
// - Payload boolLike: boolean gönderilir (string '1'/'0' yok)
// - image_url/file_url: url() => boş string gönderilmez, null/undefined kullanılır
// FIX:
// - "Kapak" galeriden seçilince artık sadece FE state değil,
//   backend'e PATCH atıp DB'ye yazar. (Sayfa refresh sonrası kaybolmaz.)
// =============================================================

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import type {
  LibraryDto,
  LibraryCreatePayload,
  LibraryUpdatePayload,
} from '@/integrations/types/library.types';
import type { LocaleOption } from '@/components/admin/library/LibraryHeader';

import {
  useCreateLibraryAdminMutation,
  useUpdateLibraryAdminMutation,
  useLazyGetLibraryAdminQuery,
} from '@/integrations/rtk/hooks';

import { useAdminLocales } from '@/components/common/useAdminLocales';

import { LibraryForm, type LibraryFormValues } from './LibraryForm';
import { LibraryFormHeader, type LibraryFormEditMode } from './LibraryFormHeader';
import { LibraryFormJsonSection } from './LibraryFormJsonSection';
import { LibraryFormImageColumn, type ReferenceImageMetadata } from './LibraryFormImageColumn';
import { LibraryFilesSection } from './LibraryFilesSection';
import { LibraryImagesSection } from './LibraryImagesSection';

/* ------------------------------------------------------------- */

type LibraryFormPageProps = {
  mode: 'create' | 'edit';
  initialData?: LibraryDto | null;
  loading?: boolean;
  onDone?: () => void;
};

type LibraryFormState = LibraryFormValues & { id?: string };

function pickFirstString(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) {
    const first = v.find((x) => typeof x === 'string');
    return typeof first === 'string' ? first : undefined;
  }
  return undefined;
}

const toStr = (v: unknown) => (v === null || v === undefined ? '' : String(v));

const normalizeUuidOrEmpty = (v: string | null | undefined) => (v ? String(v) : '');
const normalizeTextOrEmpty = (v: string | null | undefined) => (v ? String(v) : '');

const mapDtoToFormState = (item: LibraryDto, safeLocale: string): LibraryFormState => ({
  id: item.id,
  locale: safeLocale,

  // parent
  is_published: item.is_published === 1,
  is_active: item.is_active === 1,
  featured: item.featured === 1,
  display_order: item.display_order ?? 0,
  type: item.type ?? 'other',

  category_id: normalizeUuidOrEmpty(item.category_id),
  sub_category_id: normalizeUuidOrEmpty(item.sub_category_id),

  published_at: normalizeTextOrEmpty(item.published_at),

  // i18n
  name: normalizeTextOrEmpty(item.name),
  slug: normalizeTextOrEmpty(item.slug),
  description: normalizeTextOrEmpty(item.description),
  image_alt: normalizeTextOrEmpty(item.image_alt),

  tags: normalizeTextOrEmpty(item.tags),

  meta_title: normalizeTextOrEmpty(item.meta_title),
  meta_description: normalizeTextOrEmpty(item.meta_description),
  meta_keywords: normalizeTextOrEmpty(item.meta_keywords),

  // images
  featured_image: normalizeTextOrEmpty(item.featured_image),
  image_url: normalizeTextOrEmpty(item.image_url),
  image_asset_id: normalizeUuidOrEmpty(item.image_asset_id),
});

const buildJsonModelFromForm = (s: LibraryFormState) => ({
  locale: s.locale,

  // parent
  type: (s.type || 'other').trim(),

  category_id: s.category_id.trim() ? s.category_id.trim() : null,
  sub_category_id: s.sub_category_id.trim() ? s.sub_category_id.trim() : null,

  featured: !!s.featured,
  is_published: !!s.is_published,
  is_active: !!s.is_active,
  display_order: Number.isFinite(s.display_order) ? s.display_order : 0,

  featured_image: s.featured_image.trim() ? s.featured_image.trim() : null,
  image_url: s.image_url.trim() ? s.image_url.trim() : null,
  image_asset_id: s.image_asset_id.trim() ? s.image_asset_id.trim() : null,

  published_at: s.published_at.trim() ? s.published_at.trim() : null,

  // i18n
  name: s.name || '',
  slug: s.slug || '',
  description: s.description || '',
  image_alt: s.image_alt || '',
  tags: s.tags || '',

  meta_title: s.meta_title || '',
  meta_description: s.meta_description || '',
  meta_keywords: s.meta_keywords || '',
});

const applyJsonToState = (
  prev: LibraryFormState,
  json: any,
  coerceLocale: (loc?: string, fallback?: string) => string,
  defaultLocaleFromDb?: string,
): LibraryFormState => {
  const next: LibraryFormState = { ...prev };

  if (typeof json?.locale === 'string') {
    const safe = coerceLocale(json.locale, defaultLocaleFromDb);
    if (safe) next.locale = safe;
  }

  if (typeof json?.type === 'string') next.type = json.type;

  if (typeof json?.category_id === 'string' || json?.category_id === null)
    next.category_id = json.category_id ?? '';
  if (typeof json?.sub_category_id === 'string' || json?.sub_category_id === null)
    next.sub_category_id = json.sub_category_id ?? '';

  if (typeof json?.featured === 'boolean') next.featured = json.featured;
  if (typeof json?.is_published === 'boolean') next.is_published = json.is_published;
  if (typeof json?.is_active === 'boolean') next.is_active = json.is_active;

  if (typeof json?.display_order === 'number' && Number.isFinite(json.display_order))
    next.display_order = json.display_order;

  if (typeof json?.featured_image === 'string' || json?.featured_image === null)
    next.featured_image = json.featured_image ?? '';
  if (typeof json?.image_url === 'string' || json?.image_url === null)
    next.image_url = json.image_url ?? '';
  if (typeof json?.image_asset_id === 'string' || json?.image_asset_id === null)
    next.image_asset_id = json.image_asset_id ?? '';

  if (typeof json?.published_at === 'string' || json?.published_at === null)
    next.published_at = json.published_at ?? '';

  if (typeof json?.name === 'string') next.name = json.name;
  if (typeof json?.slug === 'string') next.slug = json.slug;
  if (typeof json?.description === 'string') next.description = json.description;
  if (typeof json?.image_alt === 'string') next.image_alt = json.image_alt;

  if (typeof json?.tags === 'string') next.tags = json.tags;

  if (typeof json?.meta_title === 'string') next.meta_title = json.meta_title;
  if (typeof json?.meta_description === 'string') next.meta_description = json.meta_description;
  if (typeof json?.meta_keywords === 'string') next.meta_keywords = json.meta_keywords;

  return next;
};

/* ============================================================= */

const LibraryFormPage: React.FC<LibraryFormPageProps> = ({
  mode,
  initialData,
  loading: externalLoading,
  onDone,
}) => {
  const router = useRouter();

  const [formState, setFormState] = useState<LibraryFormState | null>(null);
  const [editMode, setEditMode] = useState<LibraryFormEditMode>('form');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [triggerGetLibrary] = useLazyGetLibraryAdminQuery();
  const [createLibrary, { isLoading: isCreating }] = useCreateLibraryAdminMutation();
  const [updateLibrary, { isLoading: isUpdating }] = useUpdateLibraryAdminMutation();

  const {
    localeOptions: adminLocaleOptions,
    defaultLocaleFromDb,
    coerceLocale,
    loading: localesLoading,
  } = useAdminLocales();

  const saving = isCreating || isUpdating;
  const pageLoading = !!externalLoading || localesLoading;

  const effectiveLocale = useMemo(() => {
    const q = pickFirstString(router.query.locale);
    const r = typeof router.locale === 'string' ? router.locale : undefined;
    return coerceLocale(q ?? r, defaultLocaleFromDb);
  }, [router.query.locale, router.locale, coerceLocale, defaultLocaleFromDb]);

  const localeOptions: LocaleOption[] = useMemo(() => {
    return (adminLocaleOptions ?? [])
      .map((o) => ({ value: String(o.value || '').toLowerCase(), label: o.label }))
      .filter((o) => !!o.value);
  }, [adminLocaleOptions]);

  /* -------------------- INITIAL FORM SETUP -------------------- */

  useEffect(() => {
    if (pageLoading) return;
    if (!effectiveLocale) return;

    if (mode === 'edit') {
      if (initialData && !formState) {
        setFormState(mapDtoToFormState(initialData, effectiveLocale));
      }
      return;
    }

    if (!formState) {
      setFormState({
        id: undefined,
        locale: effectiveLocale,

        type: 'other',

        is_published: true,
        is_active: true,
        featured: false,
        display_order: 0,

        category_id: '',
        sub_category_id: '',

        published_at: '',

        name: '',
        slug: '',
        description: '',
        image_alt: '',

        tags: '',

        meta_title: '',
        meta_description: '',
        meta_keywords: '',

        featured_image: '',
        image_url: '',
        image_asset_id: '',
      });
    }
  }, [mode, initialData, formState, pageLoading, effectiveLocale]);

  /* -------------------- IMAGE METADATA (storage için) -------------------- */

  const imageMetadata: ReferenceImageMetadata | undefined = formState
    ? {
        module_key: 'library',
        locale: formState.locale,
        reference_slug: formState.slug,
        reference_id: formState.id,
      }
    : undefined;

  /* -------------------- LOCALE CHANGE -------------------- */

  const handleLocaleChange = async (nextLocaleRaw: string) => {
    if (!formState) return;

    const nextLocale = coerceLocale(nextLocaleRaw, defaultLocaleFromDb);
    if (!nextLocale) {
      toast.error('Aktif bir dil bulunamadı. Site ayarlarından dilleri kontrol et.');
      return;
    }

    if (mode === 'create') {
      setFormState((prev) => (prev ? { ...prev, locale: nextLocale } : prev));
      return;
    }

    if (!formState.id) return;

    try {
      const data = await triggerGetLibrary({ id: formState.id, locale: nextLocale }).unwrap();
      setFormState(mapDtoToFormState(data as LibraryDto, nextLocale));
      toast.success('Dil içeriği yüklendi.');
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;

      if (status === 404) {
        setFormState((prev) =>
          prev
            ? {
                ...prev,
                locale: nextLocale,
                name: '',
                slug: prev.slug || '',
                description: '',
                image_alt: '',
                tags: '',
                meta_title: '',
                meta_description: '',
                meta_keywords: '',
              }
            : prev,
        );
        toast.info('Bu dil için çeviri yok. Kaydettiğinde bu dil için yeni kayıt oluşturulacak.');
      } else {
        const msg = err?.data?.error?.message || err?.message || 'Dil yükleme hatası.';
        toast.error(msg);
      }
    }
  };

  /* -------------------- JSON → FORM -------------------- */

  const applyJsonToForm = (json: any) => {
    if (!formState) return;
    setFormState((prev) => {
      if (!prev) return prev;
      return applyJsonToState(prev, json, coerceLocale, defaultLocaleFromDb);
    });
  };

  /* -------------------- COVER SELECT (DB WRITE) -------------------- */

  const handleSelectAsCover = async (urlRaw: string) => {
    if (!formState) return;

    const url = toStr(urlRaw).trim();
    if (!url) return;

    // Create modda DB'de parent yok -> sadece state
    if (mode === 'create' || !formState.id) {
      setFormState((prev) => (prev ? { ...prev, image_url: url } : prev));
      return;
    }

    if (saving || pageLoading) return;

    const prevUrl = formState.image_url || '';

    // optimistic UI
    setFormState((prev) => (prev ? { ...prev, image_url: url } : prev));

    try {
      const safeLocale = coerceLocale(formState.locale, defaultLocaleFromDb);

      // sadece image_url patchle (DB’ye yaz)
      const patch: LibraryUpdatePayload = {
        image_url: url,
        locale: safeLocale,
      } as any;

      await updateLibrary({ id: formState.id, patch }).unwrap();
      toast.success('Kapak görseli kaydedildi.');
    } catch (err: any) {
      // rollback
      setFormState((prev) => (prev ? { ...prev, image_url: prevUrl } : prev));
      const msg = err?.data?.error?.message || err?.message || 'Kapak kaydedilemedi.';
      toast.error(msg);
    }
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    if (editMode === 'json' && jsonError) {
      toast.error('JSON geçerli değil.');
      return;
    }

    const safeLocale = coerceLocale(formState.locale, defaultLocaleFromDb);
    if (!safeLocale) {
      toast.error('Geçerli bir dil seçilemedi. Site ayarlarını kontrol et.');
      return;
    }

    if (mode === 'create') {
      if (!formState.name.trim()) {
        toast.error('Name (ad) zorunludur.');
        return;
      }
      if (!formState.slug.trim()) {
        toast.error('Slug zorunludur.');
        return;
      }
    }

    const payloadBase: LibraryCreatePayload = {
      type: (formState.type || 'other').trim(),

      category_id: formState.category_id.trim() ? formState.category_id.trim() : null,
      sub_category_id: formState.sub_category_id.trim() ? formState.sub_category_id.trim() : null,

      featured: !!formState.featured,
      is_published: !!formState.is_published,
      is_active: !!formState.is_active,
      display_order: Number.isFinite(formState.display_order) ? formState.display_order : 0,

      featured_image: formState.featured_image.trim() ? formState.featured_image.trim() : null,
      image_url: formState.image_url.trim() ? formState.image_url.trim() : null,
      image_asset_id: formState.image_asset_id.trim() ? formState.image_asset_id.trim() : null,

      published_at: formState.published_at.trim() ? formState.published_at.trim() : null,

      locale: safeLocale,

      name: formState.name.trim() ? formState.name.trim() : undefined,
      slug: formState.slug.trim() ? formState.slug.trim() : undefined,

      description: formState.description.trim() ? formState.description : undefined,
      image_alt: formState.image_alt.trim() ? formState.image_alt.trim() : undefined,

      tags: formState.tags.trim() ? formState.tags.trim() : undefined,

      meta_title: formState.meta_title.trim() ? formState.meta_title.trim() : undefined,
      meta_description: formState.meta_description.trim()
        ? formState.meta_description.trim()
        : undefined,
      meta_keywords: formState.meta_keywords.trim() ? formState.meta_keywords.trim() : undefined,
    };

    try {
      if (mode === 'create') {
        await createLibrary(payloadBase).unwrap();
        toast.success('Library kaydı oluşturuldu.');
      } else if (mode === 'edit' && formState.id) {
        const patch: LibraryUpdatePayload = { ...payloadBase };
        await updateLibrary({ id: formState.id, patch }).unwrap();
        toast.success('Library kaydı güncellendi.');
      }

      if (onDone) onDone();
      else router.push('/admin/library');
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || 'Library kaydedilirken hata oluştu.';
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    if (onDone) onDone();
    else router.push('/admin/library');
  };

  if (!formState) {
    return (
      <div className="container-fluid py-4 text-muted small">
        <div className="spinner-border spinner-border-sm me-2" />
        Form hazırlanıyor...
      </div>
    );
  }

  const jsonModel = buildJsonModelFromForm(formState);

  return (
    <div className="container-fluid py-4">
      <div className="card">
        <LibraryFormHeader
          mode={mode}
          editMode={editMode}
          saving={saving}
          onChangeEditMode={setEditMode}
          onCancel={handleCancel}
        />

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              {/* LEFT: FORM / JSON */}
              <div className="col-md-7">
                {editMode === 'form' ? (
                  <LibraryForm
                    mode={mode}
                    values={formState}
                    onChange={(field, value) =>
                      setFormState((prev) => (prev ? { ...prev, [field]: value } : prev))
                    }
                    onLocaleChange={handleLocaleChange}
                    saving={saving || pageLoading}
                    localeOptions={localeOptions}
                    localesLoading={pageLoading}
                  />
                ) : (
                  <LibraryFormJsonSection
                    jsonModel={jsonModel}
                    disabled={saving || pageLoading}
                    onChangeJson={applyJsonToForm}
                    onErrorChange={setJsonError}
                  />
                )}
              </div>

              {/* RIGHT: IMAGE + FILES */}
              <div className="col-md-5 d-flex flex-column gap-3">
                <LibraryFormImageColumn
                  metadata={imageMetadata}
                  imageUrl={formState.image_url || ''}
                  disabled={saving || pageLoading}
                  onImageUrlChange={(url) =>
                    setFormState((prev) => (prev ? { ...prev, image_url: toStr(url) } : prev))
                  }
                />

                {formState.id ? (
                  <LibraryImagesSection
                    libraryId={formState.id}
                    locale={formState.locale}
                    disabled={saving || pageLoading}
                    coverUrl={formState.image_url || ''}
                    onSelectAsCover={handleSelectAsCover}
                    metadata={imageMetadata as any}
                  />
                ) : (
                  <div className="card">
                    <div className="card-body small text-muted">
                      <div className="fw-semibold mb-1">Galeri Görselleri</div>
                      Önce kaydı oluştur, ardından galeri görselleri ekleyebilirsin.
                    </div>
                  </div>
                )}

                {formState.id ? (
                  <LibraryFilesSection
                    libraryId={formState.id}
                    locale={formState.locale}
                    disabled={saving || pageLoading}
                  />
                ) : (
                  <div className="card">
                    <div className="card-body small text-muted">
                      <div className="fw-semibold mb-1">PDF / Dosyalar</div>
                      Önce kaydı oluştur, ardından dosya ekleyebilirsin.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card-footer d-flex justify-content-end">
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? 'Kaydediliyor...' : mode === 'create' ? 'Oluştur' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibraryFormPage;
