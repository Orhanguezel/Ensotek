// =============================================================
// FILE: src/pages/admin/menuitem/[slug].tsx
// Ensotek – Admin Menu Item Detail (Create / Edit, Form + JSON)
// - Dynamic locales: useAdminLocales() => site_settings.app_locales
// - Base locale: router.locale -> coerceLocale(..., defaultLocaleFromDb)
// - Edit modda: formState.locale (kullanıcı seçimi) istek locale’i belirler
// =============================================================

'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { MenuItemForm, type MenuItemFormValues } from '@/components/admin/menuitem/MenuItemForm';
import { AdminJsonEditor } from '@/components/common/AdminJsonEditor';
import { useAdminLocales } from '@/components/common/useAdminLocales';

import {
  useGetMenuItemAdminQuery,
  useCreateMenuItemAdminMutation,
  useUpdateMenuItemAdminMutation,
  useDeleteMenuItemAdminMutation,
} from '@/integrations/rtk/hooks';

import type {
  AdminMenuItemDto,
  AdminMenuItemCreatePayload,
  AdminMenuItemUpdatePayload,
} from '@/integrations/types/menu_items.types';

type EditMode = 'form' | 'json';
type MenuItemFormState = MenuItemFormValues & { id?: string };

/* -------------------- helpers -------------------- */

const toShortLocale = (v: unknown): string =>
  String(v || '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

/** BE DTO -> form state (locale dışarıdan verilir) */
const mapDtoToFormState = (item: AdminMenuItemDto, localeForForm: string): MenuItemFormState => ({
  id: item.id,
  title: item.title ?? '',
  url: item.url ?? '',
  type: item.type ?? 'custom',
  page_id: item.page_id ?? null,
  parent_id: item.parent_id ?? null,
  location: item.location ?? 'header',
  icon: item.icon ?? '',
  section_id: item.section_id ?? null,
  is_active: !!item.is_active,
  display_order: item.display_order ?? 0,
  locale: localeForForm,
});

const buildJsonModelFromForm = (s: MenuItemFormState) => ({
  id: s.id,
  title: s.title,
  url: s.url,
  type: s.type,
  page_id: s.page_id,
  parent_id: s.parent_id,
  location: s.location,
  icon: s.icon,
  section_id: s.section_id,
  is_active: s.is_active,
  display_order: s.display_order,
  locale: s.locale,
});

/* ============================================================ */
/*  Page                                                        */
/* ============================================================ */

const AdminMenuItemDetailPage: NextPage = () => {
  const router = useRouter();
  const rawSlug = router.query.slug;

  const id = useMemo(() => {
    if (typeof rawSlug === 'string') return rawSlug;
    if (Array.isArray(rawSlug) && typeof rawSlug[0] === 'string') return rawSlug[0];
    return '';
  }, [rawSlug]);

  const isNew = !id || id === 'new';
  const mode: 'create' | 'edit' = isNew ? 'create' : 'edit';

  /* -------------------- Locales (DB + router.locale) -------------------- */

  const {
    localeOptions: adminLocaleOptions,
    defaultLocaleFromDb,
    coerceLocale,
    loading: localesLoading,
  } = useAdminLocales();

  const routerLocale = (router.locale as string | undefined) ?? undefined;

  // router.locale DB’de yoksa default’a, o da yoksa kısa formata düşer
  const baseLocale = useMemo(
    () =>
      coerceLocale(routerLocale, defaultLocaleFromDb) ||
      defaultLocaleFromDb ||
      toShortLocale(routerLocale) ||
      '',
    [coerceLocale, routerLocale, defaultLocaleFromDb],
  );

  const localeOptions = useMemo(
    () =>
      (adminLocaleOptions ?? []).map((x) => ({
        value: x.value,
        label: x.label,
      })),
    [adminLocaleOptions],
  );

  /* -------------------- Form state + edit mode -------------------- */

  const [formState, setFormState] = useState<MenuItemFormState | null>(null);
  const [editMode, setEditMode] = useState<EditMode>('form');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // CREATE init – locale = baseLocale (veya ilk aktif locale)
  const didInitCreateRef = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (mode !== 'create') return;
    if (localesLoading) return;
    if (formState) return;
    if (didInitCreateRef.current) return;

    didInitCreateRef.current = true;

    const firstOpt = localeOptions[0]?.value;
    const initLocale =
      coerceLocale(baseLocale || firstOpt, defaultLocaleFromDb) || baseLocale || firstOpt || '';

    setFormState({
      id: undefined,
      title: '',
      url: '',
      type: 'custom',
      page_id: null,
      parent_id: null,
      location: 'header',
      icon: '',
      section_id: null,
      is_active: true,
      display_order: 0,
      locale: initLocale,
    });
  }, [
    router.isReady,
    mode,
    localesLoading,
    formState,
    localeOptions,
    baseLocale,
    coerceLocale,
    defaultLocaleFromDb,
  ]);

  // EDIT init – sadece locale’i kur, DTO gelince doldur
  const didInitEditRef = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (mode !== 'edit') return;
    if (localesLoading) return;
    if (formState) return;
    if (didInitEditRef.current) return;

    didInitEditRef.current = true;

    const initLocale =
      coerceLocale(baseLocale, defaultLocaleFromDb) || baseLocale || defaultLocaleFromDb || '';

    if (!id) return;

    setFormState({
      id,
      title: '',
      url: '',
      type: 'custom',
      page_id: null,
      parent_id: null,
      location: 'header',
      icon: '',
      section_id: null,
      is_active: true,
      display_order: 0,
      locale: initLocale,
    });
  }, [
    router.isReady,
    mode,
    localesLoading,
    formState,
    id,
    baseLocale,
    coerceLocale,
    defaultLocaleFromDb,
  ]);

  /* -------------------- Fetch locale (edit) -------------------- */

  const fetchLocale = useMemo(() => {
    if (isNew) return '';
    const raw = formState?.locale || baseLocale || defaultLocaleFromDb;
    if (!raw) return '';
    return coerceLocale(raw, defaultLocaleFromDb) || toShortLocale(raw) || '';
  }, [isNew, formState?.locale, baseLocale, coerceLocale, defaultLocaleFromDb]);

  const shouldSkipQuery =
    !router.isReady || localesLoading || isNew || !id || !fetchLocale || !formState;

  /* -------------------- RTK Query (edit) -------------------- */

  const { data, isLoading, isFetching } = useGetMenuItemAdminQuery(
    { id, locale: fetchLocale || undefined },
    { skip: shouldSkipQuery },
  );

  const [createMenuItem, { isLoading: isCreating }] = useCreateMenuItemAdminMutation();
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemAdminMutation();
  const [deleteMenuItem, { isLoading: isDeleting }] = useDeleteMenuItemAdminMutation();

  const saving = isCreating || isUpdating || isDeleting;
  const loading = localesLoading || (!isNew && (isLoading || isFetching));

  /* -------------------- Data -> formState sync (EDIT) -------------------- */

  useEffect(() => {
    if (mode !== 'edit') return;
    if (!router.isReady) return;
    if (!id) return;
    if (!data) return;

    const dto = data as AdminMenuItemDto;

    setFormState((prev) => {
      // Mevcut locale’i hesapla (fetchLocale varsa onu tercih et)
      const currentLocale =
        coerceLocale(fetchLocale || prev?.locale, defaultLocaleFromDb) ||
        fetchLocale ||
        prev?.locale ||
        baseLocale ||
        defaultLocaleFromDb ||
        '';

      // Aynı id + locale için tekrar yazma (gereksiz render kaçınma)
      if (prev && prev.id === dto.id && prev.locale === currentLocale && prev.title) {
        return prev;
      }

      return mapDtoToFormState(dto, currentLocale);
    });
  }, [mode, router.isReady, id, data, fetchLocale, coerceLocale, defaultLocaleFromDb, baseLocale]);

  /* -------------------- Form change handler -------------------- */

  const handleFormChange = useCallback(
    (field: keyof MenuItemFormValues, value: any) => {
      setFormState((prev) => {
        if (!prev) return prev;

        if (field === 'locale') {
          const normalized =
            coerceLocale(value, defaultLocaleFromDb) ||
            toShortLocale(value) ||
            prev.locale ||
            baseLocale ||
            defaultLocaleFromDb ||
            '';

          if (mode === 'edit') {
            // Locale değişince: içerik temizlenir, yeni locale için DTO beklenir
            return {
              ...prev,
              locale: normalized,
              title: '',
              url: '',
              type: prev.type ?? 'custom',
              icon: prev.icon ?? '',
            } as MenuItemFormState;
          }

          return { ...prev, locale: normalized } as MenuItemFormState;
        }

        return { ...prev, [field]: value } as MenuItemFormState;
      });
    },
    [mode, coerceLocale, defaultLocaleFromDb, baseLocale],
  );

  /* -------------------- JSON -> Form sync -------------------- */

  const applyJsonToForm = useCallback(
    (json: any) => {
      setFormState((prev) => {
        if (!prev) return prev;
        const next: MenuItemFormState = { ...prev };

        if (typeof json.title === 'string') next.title = json.title;
        if (typeof json.url === 'string') next.url = json.url;

        if (json.type === 'custom' || json.type === 'page') next.type = json.type;

        if ('page_id' in json)
          next.page_id = json.page_id === null || json.page_id === '' ? null : String(json.page_id);
        if ('parent_id' in json)
          next.parent_id =
            json.parent_id === null || json.parent_id === '' ? null : String(json.parent_id);
        if ('section_id' in json)
          next.section_id =
            json.section_id === null || json.section_id === '' ? null : String(json.section_id);

        if (json.location === 'header' || json.location === 'footer') next.location = json.location;
        if (typeof json.icon === 'string') next.icon = json.icon;

        if (typeof json.is_active === 'boolean') next.is_active = json.is_active;
        if (typeof json.display_order === 'number' && Number.isFinite(json.display_order))
          next.display_order = json.display_order;

        if (typeof json.locale === 'string') {
          const normalized =
            coerceLocale(json.locale, defaultLocaleFromDb) ||
            toShortLocale(json.locale) ||
            next.locale;
          next.locale = normalized;
        }

        return next;
      });
    },
    [coerceLocale, defaultLocaleFromDb],
  );

  /* -------------------- Submit / Delete / Cancel -------------------- */

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!formState) return;

    if (editMode === 'json' && jsonError) {
      toast.error('JSON geçerli değil. Hataları düzeltmeden kaydedemezsin.');
      return;
    }

    const s = formState;

    const normalizedLocale =
      coerceLocale(s.locale, defaultLocaleFromDb) ||
      toShortLocale(s.locale) ||
      baseLocale ||
      defaultLocaleFromDb ||
      '';

    const payloadBase = {
      title: s.title.trim(),
      url: s.type === 'custom' ? (s.url || '').trim() : s.url || null,
      type: s.type,
      page_id: s.type === 'page' ? s.page_id ?? null : null,
      parent_id: s.parent_id ?? null,
      location: s.location,
      icon: s.icon ? s.icon.trim() : null,
      section_id: s.section_id ?? null,
      is_active: !!s.is_active,
      display_order: Number.isFinite(Number(s.display_order)) ? Number(s.display_order) : 0,
      locale: normalizedLocale || undefined,
    };

    try {
      if (isNew) {
        const payload = payloadBase as AdminMenuItemCreatePayload;
        const created = await createMenuItem(payload).unwrap();

        toast.success('Menü öğesi oluşturuldu.');
        router.replace(`/admin/menuitem/${encodeURIComponent(created.id)}`);
      } else {
        const payload = payloadBase as AdminMenuItemUpdatePayload;
        await updateMenuItem({ id, data: payload }).unwrap();
        toast.success('Menü öğesi güncellendi.');
      }
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || 'İşlem sırasında bir hata oluştu.');
    }
  };

  const handleDelete = async () => {
    if (isNew || !id) return;
    const ok = window.confirm('Bu menü öğesini silmek istediğinize emin misiniz?');
    if (!ok) return;

    try {
      await deleteMenuItem({ id }).unwrap();
      toast.success('Menü öğesi silindi.');
      router.push('/admin/menuitem');
    } catch (err: any) {
      toast.error(
        err?.data?.error?.message || err?.message || 'Silme işlemi sırasında bir hata oluştu.',
      );
    }
  };

  const handleCancel = () => {
    // Deterministik: her zaman listeye dön
    router.push('/admin/menuitem');
  };

  /* -------------------- Loading guard -------------------- */

  if (!formState || localesLoading) {
    return (
      <div className="container-fluid py-4 text-muted small">
        <div className="spinner-border spinner-border-sm me-2" />
        Menü formu hazırlanıyor...
      </div>
    );
  }

  const jsonModel = buildJsonModelFromForm(formState);

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">
              {mode === 'create' ? 'Yeni Menü Öğesi' : 'Menü Öğesini Düzenle'}
            </h5>
            <small className="text-muted">
              Form modunda temel alanları, JSON modunda ise tüm payload’ı (parent_id, section_id
              vb.) yönetebilirsin.
            </small>
            {!isNew && (
              <div className="small text-muted mt-1">
                Aktif locale:{' '}
                <code>{formState.locale || fetchLocale || baseLocale || defaultLocaleFromDb}</code>{' '}
                {loading ? <span className="ms-2">yükleniyor…</span> : null}
              </div>
            )}
          </div>

          <div className="d-flex gap-2 align-items-center">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={'btn btn-outline-primary ' + (editMode === 'form' ? 'active' : '')}
                disabled={saving || loading}
                onClick={() => setEditMode('form')}
              >
                Form
              </button>
              <button
                type="button"
                className={'btn btn-outline-primary ' + (editMode === 'json' ? 'active' : '')}
                disabled={saving || loading}
                onClick={() => setEditMode('json')}
              >
                JSON
              </button>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={saving}
              onClick={handleCancel}
            >
              ← Geri
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            {editMode === 'form' ? (
              <MenuItemForm
                mode={mode}
                values={formState}
                saving={saving}
                loading={loading}
                localeOptions={localeOptions}
                localesLoading={localesLoading}
                onChange={handleFormChange}
              />
            ) : (
              <AdminJsonEditor
                label="Menu Item JSON"
                value={jsonModel}
                disabled={saving || loading}
                onChange={applyJsonToForm}
                onErrorChange={setJsonError}
                helperText={
                  <>
                    <div>
                      Burada tüm payload&apos;ı yönetebilirsin. <code>page_id</code>,{' '}
                      <code>parent_id</code>, <code>section_id</code> gibi alanlar sadece burada
                      düzenlenir.
                    </div>
                    <div>
                      <strong>Not:</strong> <code>id</code> alanı sadece gösterim amaçlıdır,
                      route&apos;taki id kullanılır.
                    </div>
                  </>
                }
                height={260}
              />
            )}
          </div>

          <div className="card-footer d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              {mode === 'create'
                ? 'Yeni menü öğesi ekleyeceksiniz.'
                : 'Mevcut menü öğesini düzenliyorsunuz.'}
            </div>

            <div className="d-flex gap-2">
              {mode === 'edit' && !isNew && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Sil
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCancel}
                disabled={saving}
              >
                İptal
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving || loading}>
                {saving ? 'Kaydediliyor...' : mode === 'create' ? 'Oluştur' : 'Kaydet'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMenuItemDetailPage;
