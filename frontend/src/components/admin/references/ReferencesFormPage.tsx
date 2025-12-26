// =============================================================
// FILE: src/components/admin/references/ReferencesFormPage.tsx
// Ensotek – Referans Form Sayfası (Create/Edit + JSON + Image)
// SliderFormPage pattern’i + useAdminLocales standardı
// =============================================================

'use client';

import React, { useEffect, useMemo, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import type { ReferenceDto } from '@/integrations/types/references.types';
import type { LocaleOption } from '@/components/admin/categories/CategoriesHeader';

import {
  useCreateReferenceAdminMutation,
  useUpdateReferenceAdminMutation,
  useLazyGetReferenceAdminQuery,
} from '@/integrations/rtk/hooks';

import { useAdminLocales } from '@/components/common/useAdminLocales';

import { ReferencesForm, type ReferencesFormValues } from './ReferencesForm';
import { ReferencesFormHeader, type ReferencesFormEditMode } from './ReferencesFormHeader';
import { ReferencesFormJsonSection } from './ReferencesFormJsonSection';
import {
  ReferencesFormImageColumn,
  type ReferenceImageMetadata,
} from './ReferencesFormImageColumn';

/* -------------------- boolLike helper -------------------- */
const isTruthyBoolLike = (v: any) => v === true || v === 1 || v === '1' || v === 'true';

function pickFirstString(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
  return undefined;
}

/* ------------------------------------------------------------- */

type ReferencesFormPageProps = {
  mode: 'create' | 'edit';
  initialData?: ReferenceDto | null;
  loading?: boolean;
  onDone?: () => void;
};

type ReferencesFormState = ReferencesFormValues & {
  id?: string; // base id
};

/* map DTO → form state */
const mapDtoToFormState = (item: ReferenceDto): ReferencesFormState => ({
  id: String((item as any).id ?? ''),
  locale: String((item as any).locale ?? 'de').toLowerCase(),

  is_published: isTruthyBoolLike((item as any).is_published),
  is_featured: isTruthyBoolLike((item as any).is_featured),
  display_order: (item as any).display_order ?? 0,

  featured_image: (item as any).featured_image ?? '',
  website_url: (item as any).website_url ?? '',

  title: (item as any).title ?? '',
  slug: (item as any).slug ?? '',
  summary: (item as any).summary ?? '',
  content: (item as any).content ?? '',

  featured_image_alt: (item as any).featured_image_alt ?? '',
  meta_title: (item as any).meta_title ?? '',
  meta_description: (item as any).meta_description ?? '',
});

/* JSON model builder */
const buildJsonModelFromForm = (s: ReferencesFormState) => ({
  locale: s.locale,

  is_published: !!s.is_published,
  is_featured: !!s.is_featured,
  display_order: Number(s.display_order) || 0,

  featured_image: s.featured_image || '',
  website_url: s.website_url || '',

  title: s.title || '',
  slug: s.slug || '',
  summary: s.summary || '',
  content: s.content || '',

  featured_image_alt: s.featured_image_alt || '',
  meta_title: s.meta_title || '',
  meta_description: s.meta_description || '',
});

const ReferencesFormPage: React.FC<ReferencesFormPageProps> = ({
  mode,
  initialData,
  loading: externalLoading,
  onDone,
}) => {
  const router = useRouter();

  const [formState, setFormState] = useState<ReferencesFormState | null>(null);
  const [editMode, setEditMode] = useState<ReferencesFormEditMode>('form');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [isLocaleChanging, setIsLocaleChanging] = useState(false);

  const [triggerGetReference] = useLazyGetReferenceAdminQuery();

  const [createReference, { isLoading: isCreating }] = useCreateReferenceAdminMutation();
  const [updateReference, { isLoading: isUpdating }] = useUpdateReferenceAdminMutation();

  const {
    localeOptions: adminLocaleOptions,
    coerceLocale,
    defaultLocaleFromDb,
    loading: localesLoading,
  } = useAdminLocales();

  // LocaleOption shape uyumu (value/label)
  const localeOptions: LocaleOption[] = useMemo(
    () => (adminLocaleOptions ?? []) as unknown as LocaleOption[],
    [adminLocaleOptions],
  );

  // page locale priority: query.locale > router.locale > db default
  const effectiveLocale = useMemo(() => {
    const q = pickFirstString(router.query.locale);
    const r = typeof router.locale === 'string' ? router.locale : undefined;
    return coerceLocale(q ?? r, defaultLocaleFromDb);
  }, [router.query.locale, router.locale, coerceLocale, defaultLocaleFromDb]);

  const saving = isCreating || isUpdating;
  const loading = !!externalLoading || localesLoading;

  /* -------------------- INITIAL FORM SETUP -------------------- */

  useEffect(() => {
    if (mode === 'edit') {
      if (initialData && !formState) {
        setFormState(mapDtoToFormState(initialData));
      }
      return;
    }

    // create
    if (!formState && !localesLoading && localeOptions.length > 0) {
      setFormState({
        id: undefined,
        locale: effectiveLocale || String(localeOptions[0]?.value || 'de').toLowerCase(),

        is_published: true,
        is_featured: false,
        display_order: 0,

        featured_image: '',
        website_url: '',

        title: '',
        slug: '',
        summary: '',
        content: '',

        featured_image_alt: '',
        meta_title: '',
        meta_description: '',
      });
    }
  }, [mode, initialData, formState, localeOptions, localesLoading, effectiveLocale]);

  /* -------------------- IMAGE METADATA -------------------- */

  const imageMetadata: ReferenceImageMetadata | undefined = useMemo(() => {
    if (!formState) return undefined;
    return {
      module_key: 'references',
      locale: formState.locale,
      reference_slug: formState.slug || '',
      reference_id: formState.id,
    };
  }, [formState]);

  /* -------------------- URL SYNC (locale) -------------------- */

  const setUrlLocale = (nextLocale: string) => {
    // mevcut query'yi bozmadan locale set et
    const nextQuery = { ...router.query, locale: nextLocale };
    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
  };

  /* -------------------- LOCALE CHANGE (edit i18n fetch) -------------------- */

  const handleLocaleChange = async (nextLocaleRaw: string) => {
    if (!formState) return;

    const nextLocale = (coerceLocale(nextLocaleRaw, defaultLocaleFromDb) || 'de').toLowerCase();

    // UI anında güncellensin (header/form)
    setFormState((prev) => (prev ? { ...prev, locale: nextLocale } : prev));

    // URL sync (page priority zinciri için kritik)
    setUrlLocale(nextLocale);

    // create: sadece locale set yeterli
    if (mode === 'create') return;

    const baseId = formState.id || String((initialData as any)?.id ?? '');
    if (!baseId) return;

    try {
      setIsLocaleChanging(true);

      // IMPORTANT:
      // - Eğer endpoint cache key'i locale'i dikkate almıyorsa, burada dahi aynı cache dönebilir.
      // - Bu dosya seviyesinde yapabileceğimiz en güvenilir şey URL sync + state update + request trigger.
      const data = await triggerGetReference({ id: String(baseId), locale: nextLocale }).unwrap();

      setFormState(mapDtoToFormState(data as ReferenceDto));
      toast.success('Dil içeriği yüklendi.');
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;

      if (status === 404) {
        toast.info(
          'Bu dil için referans kaydı bulunamadı. Kaydettiğinde bu dil için yeni kayıt oluşturulacak (aynı referans id ile).',
        );
        // locale zaten set edildi; kullanıcı doldurup kaydedecek.
      } else {
        // locale zaten set edildi; hata mesajı göster
        console.error('Reference locale change error:', err);
        toast.error('Seçilen dil için referans yüklenirken bir hata oluştu.');
      }
    } finally {
      setIsLocaleChanging(false);
    }
  };

  /* -------------------- JSON → FORM -------------------- */

  const applyJsonToForm = (json: any) => {
    if (!formState) return;

    setFormState((prev) => {
      if (!prev) return prev;
      const next: ReferencesFormState = { ...prev };

      if (typeof json.locale === 'string') {
        const coerced = coerceLocale(json.locale, defaultLocaleFromDb) || prev.locale;
        next.locale = String(coerced).toLowerCase();
        setUrlLocale(next.locale);
      }

      if (typeof json.is_published === 'boolean') next.is_published = json.is_published;
      if (typeof json.is_featured === 'boolean') next.is_featured = json.is_featured;

      if (typeof json.display_order === 'number' && Number.isFinite(json.display_order)) {
        next.display_order = json.display_order;
      }

      if (typeof json.featured_image === 'string') next.featured_image = json.featured_image;
      if (typeof json.website_url === 'string') next.website_url = json.website_url;

      if (typeof json.title === 'string') next.title = json.title;
      if (typeof json.slug === 'string') next.slug = json.slug;
      if (typeof json.summary === 'string') next.summary = json.summary;
      if (typeof json.content === 'string') next.content = json.content;

      if (typeof json.featured_image_alt === 'string')
        next.featured_image_alt = json.featured_image_alt;
      if (typeof json.meta_title === 'string') next.meta_title = json.meta_title;
      if (typeof json.meta_description === 'string') next.meta_description = json.meta_description;

      return next;
    });
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    if (editMode === 'json' && jsonError) {
      toast.error('JSON geçerli değil.');
      return;
    }

    const normalizedLocale = (
      coerceLocale(formState.locale, defaultLocaleFromDb) ||
      formState.locale ||
      'de'
    ).toLowerCase();

    const payload = {
      locale: normalizedLocale,

      is_published: !!formState.is_published,
      is_featured: !!formState.is_featured,
      display_order: Number(formState.display_order) || 0,

      featured_image: formState.featured_image.trim() || undefined,
      website_url: formState.website_url.trim() || undefined,

      title: formState.title.trim() || undefined,
      slug: formState.slug.trim() || undefined,
      summary: formState.summary.trim() || undefined,
      content: formState.content.trim() || undefined,

      featured_image_alt: formState.featured_image_alt.trim() || undefined,
      meta_title: formState.meta_title.trim() || undefined,
      meta_description: formState.meta_description.trim() || undefined,
    };

    if (!payload.title || !payload.slug) {
      toast.error('Title ve slug zorunludur.');
      return;
    }

    try {
      if (mode === 'create') {
        await createReference(payload as any).unwrap();
        toast.success('Referans oluşturuldu.');
      } else if (mode === 'edit' && formState.id) {
        await updateReference({ id: String(formState.id), patch: payload as any }).unwrap();
        toast.success('Referans güncellendi.');
      } else {
        await createReference(payload as any).unwrap();
        toast.success('Referans oluşturuldu.');
      }

      if (onDone) onDone();
      else router.push('/admin/references');
    } catch (err: any) {
      console.error('Reference save error:', err);
      toast.error(
        err?.data?.error?.message || err?.message || 'Referans kaydedilirken hata oluştu.',
      );
    }
  };

  /* -------------------- CANCEL -------------------- */

  const handleCancel = () => {
    if (onDone) onDone();
    else router.push('/admin/references');
  };

  /* -------------------- LOADING STATES -------------------- */

  if (mode === 'edit' && externalLoading && !initialData) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center text-muted small py-5">
          <div className="spinner-border spinner-border-sm me-2" />
          Referans yükleniyor...
        </div>
      </div>
    );
  }

  if (mode === 'edit' && !externalLoading && !initialData) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning small">Referans bulunamadı veya silinmiş olabilir.</div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>
          ← Listeye dön
        </button>
      </div>
    );
  }

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
        <ReferencesFormHeader
          mode={mode}
          locale={formState.locale}
          editMode={editMode}
          onChangeEditMode={setEditMode}
          saving={saving}
          localesLoading={localesLoading}
          isLocaleChanging={isLocaleChanging}
          onCancel={handleCancel}
        />

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-7">
                {editMode === 'form' ? (
                  <ReferencesForm
                    mode={mode}
                    values={formState}
                    onChange={(field, value) =>
                      setFormState((prev) => (prev ? { ...prev, [field]: value } : prev))
                    }
                    onLocaleChange={handleLocaleChange}
                    saving={saving || loading || isLocaleChanging}
                    localeOptions={localeOptions}
                    localesLoading={localesLoading || isLocaleChanging}
                  />
                ) : (
                  <ReferencesFormJsonSection
                    jsonModel={jsonModel}
                    disabled={saving || loading || isLocaleChanging}
                    onChangeJson={applyJsonToForm}
                    onErrorChange={setJsonError}
                  />
                )}
              </div>

              <div className="col-md-5">
                <ReferencesFormImageColumn
                  metadata={imageMetadata}
                  imageUrl={formState.featured_image}
                  disabled={saving || loading || isLocaleChanging}
                  onImageUrlChange={(url) =>
                    setFormState((prev) => (prev ? { ...prev, featured_image: url } : prev))
                  }
                />
              </div>
            </div>
          </div>

          <div className="card-footer d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={saving || isLocaleChanging}
            >
              {saving ? 'Kaydediliyor...' : mode === 'create' ? 'Oluştur' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferencesFormPage;
