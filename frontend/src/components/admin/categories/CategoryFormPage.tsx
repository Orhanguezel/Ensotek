// =============================================================
// FILE: src/components/admin/categories/CategoryFormPage.tsx
// Ensotek – Kategori Form Sayfası (Create/Edit + Görsel Upload)
// =============================================================

'use client';

import React, { useEffect, useMemo, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import type { CategoryDto } from '@/integrations/types';
import type { LocaleOption, ModuleOption } from './CategoriesHeader';

import {
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
  useLazyGetCategoryAdminQuery,
} from '@/integrations/rtk/hooks';

import { useAdminLocales } from '@/components/common/useAdminLocales';

import { CategoryFormHeader } from './CategoryFormHeader';
import { CategoryFormFields, type CategoryFormStateLike } from './CategoryFormFields';
import { CategoryFormJsonSection } from './CategoryFormJsonSection';
import { CategoryFormImageColumn } from './CategoryFormImageColumn';
import { CategoryFormFooter } from './CategoryFormFooter';

/* ------------------------------------------------------------- */

type CategoryFormState = CategoryFormStateLike & {
  id?: string; // base kategori id (tüm dillerde aynı)
};

type CategoryFormMode = 'create' | 'edit';
type EditMode = 'form' | 'json';

type CategoryFormPageProps = {
  mode: CategoryFormMode;
  initialData?: CategoryDto | null;
  loading?: boolean;
  onDone?: () => void;
};

/* ------------------------------------------------------------- */
/* Module options */

const STATIC_MODULE_OPTIONS: ModuleOption[] = [
  { value: 'about', label: 'Hakkımızda' },
  { value: 'product', label: 'Ürünler' },
  { value: 'services', label: 'Hizmetler' },
  { value: 'sparepart', label: 'Yedek Parça' },
  { value: 'news', label: 'Haberler' },
  { value: 'library', label: 'Kütüphane' },
  { value: 'references', label: 'Referanslar' },
];

const slugify = (value: string): string => {
  if (!value) return '';

  let s = value.trim();

  const trMap: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    I: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
  };

  s = s
    .split('')
    .map((ch) => trMap[ch] ?? ch)
    .join('');

  s = s.replace(/ß/g, 'ss').replace(/ẞ/g, 'ss');

  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const buildJsonModelFromForm = (state: CategoryFormState) => ({
  locale: state.locale,
  module_key: state.module_key,
  name: state.name,
  slug: state.slug,
  description: state.description || '',
  icon: state.icon || '',
  is_active: state.is_active,
  is_featured: state.is_featured,
  display_order: state.display_order,
});

function mapDtoToFormState(
  item: CategoryDto,
  defaults: { locale: string; module_key: string },
): CategoryFormState {
  return {
    id: item.id,
    locale: item.locale || defaults.locale,
    module_key: item.module_key || defaults.module_key,
    name: item.name,
    slug: item.slug,
    description: item.description || '',
    icon: (item.icon as any) || '', // (UI preview için string)
    is_active: !!item.is_active,
    is_featured: !!item.is_featured,
    display_order: item.display_order ?? 0,
  };
}

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

/* ------------------------------------------------------------- */

const CategoryFormPage: React.FC<CategoryFormPageProps> = ({
  mode,
  initialData,
  loading: externalLoading,
  onDone,
}) => {
  const router = useRouter();

  const currentLocaleFromRouter = (router.locale as string | undefined)?.toLowerCase();

  // ✅ Locales from DB
  const {
    localeOptions: adminLocaleOptions,
    defaultLocaleFromDb,
    coerceLocale,
    hasLocale,
    loading: isLocalesLoading,
  } = useAdminLocales();

  const localeOptions: LocaleOption[] = useMemo(
    () =>
      (adminLocaleOptions ?? []).map((x) => ({
        value: x.value,
        label: x.label,
      })),
    [adminLocaleOptions],
  );

  const moduleOptions: ModuleOption[] = useMemo(() => STATIC_MODULE_OPTIONS, []);

  const defaultModule = useMemo(() => moduleOptions[0]?.value ?? 'about', [moduleOptions]);

  const effectiveDefaultLocale = useMemo(() => {
    return coerceLocale(currentLocaleFromRouter, defaultLocaleFromDb) || defaultLocaleFromDb || '';
  }, [coerceLocale, currentLocaleFromRouter, defaultLocaleFromDb]);

  const [formState, setFormState] = useState<CategoryFormState | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>('form');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryAdminMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryAdminMutation();

  const [triggerGetCategory, { isLoading: isLocaleChanging }] = useLazyGetCategoryAdminQuery();

  const saving = isCreating || isUpdating;
  const loading = !!externalLoading || isLocalesLoading;

  const defaults = useMemo(
    () => ({
      locale: effectiveDefaultLocale || (localeOptions[0]?.value ?? ''),
      module_key: defaultModule,
    }),
    [effectiveDefaultLocale, localeOptions, defaultModule],
  );

  /* -------------------- Form state init -------------------- */

  useEffect(() => {
    if (loading) return;

    if (mode === 'edit') {
      if (initialData && !formState) {
        const next = mapDtoToFormState(initialData, defaults);
        next.locale = coerceLocale(next.locale, defaults.locale);
        setFormState(next);
        setSlugTouched(false);
      }
      return;
    }

    if (mode === 'create' && !formState) {
      const safeLocale = coerceLocale(defaults.locale, defaults.locale);
      const safeModule = defaults.module_key;

      setFormState({
        id: undefined,
        locale: safeLocale,
        module_key: safeModule,
        name: '',
        slug: '',
        description: '',
        icon: '',
        is_active: true,
        is_featured: false,
        display_order: 0,
      });
      setSlugTouched(false);
    }
  }, [mode, initialData, formState, loading, defaults, coerceLocale]);

  /* -------------------- Görsel metadata -------------------- */

  const imageMetadata = useMemo(() => {
    if (!formState) return undefined;
    return {
      module_key: safeStr(formState.module_key),
      locale: safeStr(formState.locale),
      category_slug: safeStr(formState.slug),
    };
  }, [formState]);

  /* -------------------- JSON → Form -------------------- */

  const applyJsonToForm = (json: any) => {
    if (!formState) return;

    setFormState((prev) => {
      if (!prev) return prev;
      const next: CategoryFormState = { ...prev };

      if (typeof json.locale === 'string') {
        next.locale = coerceLocale(json.locale, prev.locale);
      }
      if (typeof json.module_key === 'string') next.module_key = json.module_key;
      if (typeof json.name === 'string') next.name = json.name;

      if (typeof json.slug === 'string') {
        next.slug = json.slug;
        setSlugTouched(true);
      }

      if (typeof json.description === 'string') next.description = json.description;
      if (typeof json.icon === 'string') next.icon = json.icon;

      if (typeof json.is_active === 'boolean') next.is_active = json.is_active;
      if (typeof json.is_featured === 'boolean') next.is_featured = json.is_featured;

      if (typeof json.display_order === 'number' && Number.isFinite(json.display_order)) {
        next.display_order = json.display_order;
      }

      return next;
    });
  };

  /* -------------------- Handlers -------------------- */

  const handleFieldChange = (
    field: keyof CategoryFormStateLike,
    value: string | boolean | number,
  ) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleNameChange = (nameValue: string) => {
    setFormState((prev) => {
      if (!prev) return prev;

      const next: CategoryFormState = { ...prev, name: nameValue };
      if (!slugTouched) next.slug = slugify(nameValue);

      return next;
    });
  };

  const handleSlugChange = (slugValue: string) => {
    setSlugTouched(true);
    setFormState((prev) => (prev ? { ...prev, slug: slugValue } : prev));
  };

  const handleLocaleChange = async (nextLocaleRaw: string) => {
    if (!formState) return;

    const nextLocale = coerceLocale(nextLocaleRaw, formState.locale);

    if (!nextLocale || (hasLocale && !hasLocale(nextLocale))) {
      toast.error('Geçersiz dil seçimi.');
      return;
    }

    if (mode === 'create') {
      setFormState((prev) => (prev ? { ...prev, locale: nextLocale } : prev));
      return;
    }

    const baseId = (initialData?.id ?? formState.id) as string | undefined;
    if (!baseId) {
      setFormState((prev) => (prev ? { ...prev, locale: nextLocale } : prev));
      return;
    }

    try {
      const row = await triggerGetCategory({ id: baseId, locale: nextLocale }).unwrap();
      const next = mapDtoToFormState(row, { locale: nextLocale, module_key: formState.module_key });
      next.locale = coerceLocale(next.locale, nextLocale);
      setFormState(next);
      setSlugTouched(false);
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;

      if (status === 404) {
        setFormState((prev) => (prev ? { ...prev, locale: nextLocale } : prev));
        setSlugTouched(false);
        toast.info(
          'Seçilen dil için kategori kaydı bulunamadı. Kaydettiğinde bu dil için yeni bir çeviri oluşturulacak (aynı kategori id ile).',
        );
      } else {
        console.error('Locale change error (category):', err);
        toast.error('Seçilen dil için kategori yüklenirken bir hata oluştu.');
        setFormState((prev) => (prev ? { ...prev, locale: nextLocale } : prev));
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    if (editMode === 'json' && jsonError) {
      toast.error('JSON geçerli değil. Lütfen JSON hatasını düzeltin.');
      return;
    }

    const payloadBase = {
      locale: coerceLocale(formState.locale, defaults.locale),
      module_key: formState.module_key || defaults.module_key,
      name: formState.name.trim(),
      slug: formState.slug.trim(),
      description: formState.description.trim() || undefined,
      icon: formState.icon.trim() || undefined,
      is_active: formState.is_active,
      is_featured: formState.is_featured,
      display_order: formState.display_order ?? 0,
    };

    if (!payloadBase.locale) {
      toast.error('Dil bilgisi alınamadı. Lütfen site ayarlarında app_locales kontrol edin.');
      return;
    }

    if (!payloadBase.name || !payloadBase.slug) {
      toast.error('Ad ve slug alanları zorunludur.');
      return;
    }

    try {
      if (mode === 'create') {
        await createCategory(payloadBase as any).unwrap();
        toast.success('Kategori oluşturuldu.');
      } else if (mode === 'edit' && formState.id) {
        await updateCategory({ id: formState.id, patch: payloadBase as any }).unwrap();
        toast.success('Kategori güncellendi.');
      } else {
        await createCategory(payloadBase as any).unwrap();
        toast.success('Kategori oluşturuldu.');
      }

      if (onDone) onDone();
      else router.push('/admin/categories');
    } catch (err: any) {
      console.error('Category save error:', err);
      const msg =
        err?.data?.error?.message || err?.message || 'Kategori kaydedilirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    if (onDone) onDone();
    else router.push('/admin/categories');
  };

  /* -------------------- States -------------------- */

  if (mode === 'edit' && externalLoading && !initialData) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center text-muted small py-5">
          <div className="spinner-border spinner-border-sm me-2" />
          Kategori yükleniyor...
        </div>
      </div>
    );
  }

  if (mode === 'edit' && !externalLoading && !initialData) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning small">Kategori bulunamadı veya silinmiş olabilir.</div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>
          ← Listeye dön
        </button>
      </div>
    );
  }

  if (loading && !formState) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center text-muted small py-5">
          <div className="spinner-border spinner-border-sm me-2" />
          Form hazırlanıyor...
        </div>
      </div>
    );
  }

  if (!formState) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning small">
          Form state oluşturulamadı. Lütfen site ayarlarında <code>app_locales</code> ve{' '}
          <code>default_locale</code> değerlerini kontrol edin.
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>
          ← Listeye dön
        </button>
      </div>
    );
  }

  const jsonModel = buildJsonModelFromForm(formState);

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <div className="mb-3">
        <button type="button" className="btn btn-link btn-sm px-0" onClick={handleCancel}>
          ← Kategori listesine dön
        </button>
      </div>

      <div className="card">
        <CategoryFormHeader
          mode={mode}
          moduleKey={formState.module_key}
          locale={formState.locale}
          editMode={editMode}
          onChangeEditMode={setEditMode}
          saving={saving}
          isLocaleLoading={isLocaleChanging}
        />

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-7">
                {editMode === 'form' ? (
                  <CategoryFormFields
                    formState={formState}
                    localeOptions={localeOptions}
                    moduleOptions={moduleOptions}
                    disabled={saving || loading}
                    isLocaleLoading={isLocaleChanging}
                    onLocaleChange={handleLocaleChange}
                    onFieldChange={handleFieldChange}
                    onNameChange={handleNameChange}
                    onSlugChange={(slug) => {
                      setSlugTouched(true);
                      handleSlugChange(slug);
                    }}
                  />
                ) : (
                  <CategoryFormJsonSection
                    jsonModel={jsonModel}
                    disabled={saving}
                    onChangeJson={applyJsonToForm}
                    onErrorChange={setJsonError}
                  />
                )}
              </div>

              <div className="col-md-5">
                <CategoryFormImageColumn
                  metadata={imageMetadata}
                  iconValue={safeStr(formState.icon)}
                  disabled={saving || loading}
                  onIconChange={(url) =>
                    setFormState((prev) => (prev ? { ...prev, icon: safeStr(url) } : prev))
                  }
                />
              </div>
            </div>
          </div>

          <CategoryFormFooter mode={mode} saving={saving} onCancel={handleCancel} />
        </form>
      </div>
    </div>
  );
};

export default CategoryFormPage;
