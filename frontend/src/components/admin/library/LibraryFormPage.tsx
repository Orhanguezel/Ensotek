// =============================================================
// FILE: src/components/admin/library/LibraryFormPage.tsx
// Ensotek – Library Form Sayfası (Create/Edit + JSON + Image + Files)
// - Dynamic locale from DB via useAdminLocales()
// - All RTK hooks imported from "@/integrations/rtk/hooks"
// - No hardcoded locales/defaults
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

import RichContentEditor from '@/components/common/RichContentEditor';

/* ------------------------------------------------------------- */

type LibraryFormPageProps = {
  mode: 'create' | 'edit';
  initialData?: LibraryDto | null;
  loading?: boolean;
  onDone?: () => void;
};

type LibraryFormState = LibraryFormValues & {
  id?: string;
  image_url?: string;
};

function pickFirstString(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) {
    const first = v.find((x) => typeof x === 'string');
    return typeof first === 'string' ? first : undefined;
  }
  return undefined;
}

/**
 * Backend'ten gelen tags:
 *  - string[] veya null gelir (LibraryDto.tags)
 */
const normalizeTags = (raw: LibraryDto['tags']): string[] => {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.filter((t): t is string => typeof t === 'string');
};

/**
 * map DTO → form state
 * localeOverride varsa, formState.locale her zaman o olur.
 * Locale normalize/validate dışarıda (useAdminLocales.coerceLocale) yapılır.
 */
const mapDtoToFormState = (item: LibraryDto, safeLocale: string): LibraryFormState => ({
  id: item.id,
  locale: safeLocale,

  // parent
  is_published: item.is_published === 1,
  is_active: item.is_active === 1,
  display_order: item.display_order ?? 0,

  // tags / kategori alanları
  tags: normalizeTags(item.tags),
  category_id: item.category_id ?? '',
  sub_category_id: item.sub_category_id ?? '',

  author: item.author ?? '',
  published_at: item.published_at ?? '',

  // i18n
  title: item.title ?? '',
  slug: item.slug ?? '',
  summary: item.summary ?? '',
  content: item.content ?? '',

  meta_title: item.meta_title ?? '',
  meta_description: item.meta_description ?? '',

  // UI-only
  image_url: '',
});

/* JSON model builder – sadece contract'ta olan alanlar (image_url yok) */
const buildJsonModelFromForm = (s: LibraryFormState) => ({
  locale: s.locale,

  is_published: s.is_published,
  is_active: s.is_active,
  display_order: s.display_order,

  tags: s.tags ?? [],
  category_id: s.category_id || null,
  sub_category_id: s.sub_category_id || null,

  author: s.author || '',
  published_at: s.published_at || '',

  title: s.title || '',
  slug: s.slug || '',
  summary: s.summary || '',
  content: s.content || '',

  meta_title: s.meta_title || '',
  meta_description: s.meta_description || '',
});

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
  const loading = !!externalLoading || localesLoading;

  // priority: query.locale > router.locale > db default
  const effectiveLocale = useMemo(() => {
    const q = pickFirstString(router.query.locale);
    const r = typeof router.locale === 'string' ? router.locale : undefined;
    return coerceLocale(q ?? r, defaultLocaleFromDb);
  }, [router.query.locale, router.locale, coerceLocale, defaultLocaleFromDb]);

  // LibraryForm, LocaleOption ister: {value,label}
  const localeOptions: LocaleOption[] = useMemo(() => {
    return (adminLocaleOptions ?? [])
      .map((o) => ({
        value: String(o.value || '').toLowerCase(),
        label: o.label,
      }))
      .filter((o) => !!o.value);
  }, [adminLocaleOptions]);

  /* -------------------- INITIAL FORM SETUP -------------------- */

  useEffect(() => {
    if (loading) return;

    if (!effectiveLocale) {
      // DB’de aktif locale yoksa form başlatmayalım (güvenli davranış)
      return;
    }

    if (mode === 'edit') {
      if (initialData && !formState) {
        // initialData locale alanı güvenilir olmayabilir; her zaman safe locale kullan
        setFormState(mapDtoToFormState(initialData, effectiveLocale));
      }
      return;
    }

    // create mode
    if (!formState) {
      setFormState({
        id: undefined,
        locale: effectiveLocale,

        is_published: true,
        is_active: true,
        display_order: 0,

        tags: [],
        category_id: '',
        sub_category_id: '',

        author: '',
        published_at: '',

        title: '',
        slug: '',
        summary: '',
        content: '',

        meta_title: '',
        meta_description: '',

        image_url: '',
      });
    }
  }, [mode, initialData, formState, loading, effectiveLocale]);

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
      const data = await triggerGetLibrary({
        id: formState.id,
        locale: nextLocale,
      }).unwrap();

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
                // Bu dilde kayıt yok; kullanıcı doldurup kaydeder
                title: '',
                slug: prev.slug || '',
                summary: '',
                content: '',
                meta_title: '',
                meta_description: '',
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

      const next: LibraryFormState = { ...prev };

      if (typeof json.locale === 'string') {
        const safe = coerceLocale(json.locale, defaultLocaleFromDb);
        if (safe) next.locale = safe;
      }

      if (typeof json.is_published === 'boolean') next.is_published = json.is_published;
      if (typeof json.is_active === 'boolean') next.is_active = json.is_active;

      if (typeof json.display_order === 'number' && Number.isFinite(json.display_order)) {
        next.display_order = json.display_order;
      }

      if (Array.isArray(json.tags)) {
        next.tags = json.tags.filter((t: unknown): t is string => typeof t === 'string');
      }

      if (typeof json.category_id === 'string') next.category_id = json.category_id;
      if (typeof json.sub_category_id === 'string') next.sub_category_id = json.sub_category_id;

      if (typeof json.author === 'string') next.author = json.author;
      if (typeof json.published_at === 'string') next.published_at = json.published_at;

      if (typeof json.title === 'string') next.title = json.title;
      if (typeof json.slug === 'string') next.slug = json.slug;
      if (typeof json.summary === 'string') next.summary = json.summary;
      if (typeof json.content === 'string') next.content = json.content;

      if (typeof json.meta_title === 'string') next.meta_title = json.meta_title;
      if (typeof json.meta_description === 'string') next.meta_description = json.meta_description;

      return next;
    });
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

    const cleanedTags = Array.isArray(formState.tags)
      ? formState.tags.map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    const payloadBase: Omit<LibraryCreatePayload, 'replicate_all_locales'> = {
      locale: safeLocale,

      is_published: formState.is_published ? '1' : '0',
      is_active: formState.is_active ? '1' : '0',
      display_order: formState.display_order ?? 0,

      tags: cleanedTags,

      category_id: formState.category_id.trim() !== '' ? formState.category_id.trim() : null,
      sub_category_id:
        formState.sub_category_id.trim() !== '' ? formState.sub_category_id.trim() : null,

      author: formState.author.trim() || undefined,
      published_at: formState.published_at.trim() || null,

      title: formState.title.trim() || undefined,
      slug: formState.slug.trim() || undefined,
      summary: formState.summary.trim() || undefined,
      content: formState.content.trim() || undefined,

      meta_title: formState.meta_title.trim() || undefined,
      meta_description: formState.meta_description.trim() || undefined,
    };

    try {
      if (mode === 'create') {
        const createPayload: LibraryCreatePayload = { ...payloadBase };
        await createLibrary(createPayload).unwrap();
        toast.success('Library kaydı oluşturuldu.');
      } else if (mode === 'edit' && formState.id) {
        const updatePayload: LibraryUpdatePayload = { ...payloadBase };
        await updateLibrary({ id: formState.id, patch: updatePayload }).unwrap();
        toast.success('Library kaydı güncellendi.');
      }

      if (onDone) onDone();
      else router.push('/admin/library');
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || 'Library kaydedilirken hata oluştu.';
      toast.error(msg);
    }
  };

  /* -------------------- CANCEL -------------------- */

  const handleCancel = () => {
    if (onDone) onDone();
    else router.push('/admin/library');
  };

  /* -------------------- LOADING -------------------- */

  if (!formState) {
    return (
      <div className="container-fluid py-4 text-muted small">
        <div className="spinner-border spinner-border-sm me-2" />
        Form hazırlanıyor...
      </div>
    );
  }

  const jsonModel = buildJsonModelFromForm(formState);

  /* -------------------- RENDER -------------------- */

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
              {/* LEFT: FORM / JSON + İÇERİK */}
              <div className="col-md-7">
                {editMode === 'form' ? (
                  <>
                    <LibraryForm
                      mode={mode}
                      values={formState}
                      onChange={(field, value) =>
                        setFormState((prev) => (prev ? { ...prev, [field]: value } : prev))
                      }
                      onLocaleChange={handleLocaleChange}
                      saving={saving || loading}
                      localeOptions={localeOptions}
                      localesLoading={loading}
                    />

                    <RichContentEditor
                      label="İçerik (content – HTML + önizleme)"
                      value={formState.content}
                      disabled={saving || loading}
                      onChange={(val) =>
                        setFormState((prev) => (prev ? { ...prev, content: val } : prev))
                      }
                      height="260px"
                    />
                  </>
                ) : (
                  <LibraryFormJsonSection
                    jsonModel={jsonModel}
                    disabled={saving || loading}
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
                  disabled={saving || loading}
                  onImageUrlChange={(url) =>
                    setFormState((prev) => (prev ? { ...prev, image_url: url } : prev))
                  }
                />

                {formState.id ? (
                  <LibraryFilesSection libraryId={formState.id} disabled={saving || loading} />
                ) : (
                  <div className="card h-100">
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
