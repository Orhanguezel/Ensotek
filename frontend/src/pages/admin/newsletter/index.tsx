// =============================================================
// FILE: src/pages/admin/newsletter/index.tsx
// Ensotek – Admin Newsletter (Liste + filtreler + edit modal)
// - useAdminLocales() ile dinamik locale
// - RTK hooks import: "@/integrations/rtk/hooks"
// =============================================================

'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  useListNewsletterAdminQuery,
  useUpdateNewsletterAdminMutation,
  useDeleteNewsletterAdminMutation,
} from '@/integrations/rtk/hooks';

import type { NewsletterAdminDto, NewsletterOrderBy } from '@/integrations/types/newsletter.types';

import { useAdminLocales } from '@/components/common/useAdminLocales';
import type { LocaleOption } from '@/components/admin/newsletter/NewsletterHeader';

import { NewsletterHeader } from '@/components/admin/newsletter/NewsletterHeader';
import { NewsletterList } from '@/components/admin/newsletter/NewsletterList';

type NewsletterFormState = {
  id: string;
  email: string;
  is_verified: boolean;
  is_subscribed: boolean;
  locale: string; // short locale
  metaJson: string; // textarea'da JSON string
};

const toShortLocale = (v: unknown): string =>
  String(v || '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

const NewsletterAdminPage: React.FC = () => {
  /* -------------------- Locales (DB) -------------------- */
  const {
    localeOptions: adminLocaleOptions,
    defaultLocaleFromDb,
    coerceLocale,
    loading: localesLoading,
  } = useAdminLocales();

  const localeOptions: LocaleOption[] = useMemo(() => {
    const base = (adminLocaleOptions ?? []).map((x) => ({
      value: String(x.value).toLowerCase(),
      label: x.label,
    }));
    return [{ value: '', label: 'Tüm diller' }, ...base];
  }, [adminLocaleOptions]);

  /* -------------------- Filtre state -------------------- */
  const [search, setSearch] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [localeFilter, setLocaleFilter] = useState(''); // "" => all
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlySubscribed, setOnlySubscribed] = useState(false);

  const [orderBy, setOrderBy] = useState<NewsletterOrderBy>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // localeFilter valid değilse temizle (app_locales değişince)
  useEffect(() => {
    if (!localeFilter) return;
    const set = new Set((adminLocaleOptions ?? []).map((x) => String(x.value).toLowerCase()));
    if (!set.has(localeFilter)) setLocaleFilter('');
  }, [adminLocaleOptions, localeFilter]);

  const handleLocaleFilterChange = useCallback(
    (raw: string) => {
      const v = toShortLocale(raw);
      if (!v) {
        setLocaleFilter('');
        return;
      }
      const coerced = toShortLocale(coerceLocale(v, defaultLocaleFromDb) || v);
      setLocaleFilter(coerced);
    },
    [coerceLocale, defaultLocaleFromDb],
  );

  /* -------------------- Liste + filtreler -------------------- */
  const listParams = useMemo(
    () => ({
      q: search || undefined,
      email: emailFilter || undefined,
      locale: localeFilter || undefined, // "" => undefined (all)
      verified: onlyVerified ? true : undefined,
      subscribed: onlySubscribed ? true : undefined,
      orderBy,
      order,
      limit: 200,
      offset: 0,
    }),
    [search, emailFilter, localeFilter, onlyVerified, onlySubscribed, orderBy, order],
  );

  const {
    data: listData,
    isLoading,
    isFetching,
    refetch,
  } = useListNewsletterAdminQuery(listParams);

  const [rows, setRows] = useState<NewsletterAdminDto[]>([]);
  useEffect(() => {
    setRows(listData ?? []);
  }, [listData]);

  const total = rows.length;

  /* -------------------- Mutations ----------------------------- */
  const [updateNewsletter, { isLoading: isUpdating }] = useUpdateNewsletterAdminMutation();
  const [deleteNewsletter, { isLoading: isDeleting }] = useDeleteNewsletterAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isUpdating || isDeleting;

  /* -------------------- Form / Modal state -------------------- */
  const [formState, setFormState] = useState<NewsletterFormState | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openEditModal = useCallback(
    (item: NewsletterAdminDto) => {
      let metaStr = '';
      try {
        metaStr =
          item.meta == null
            ? ''
            : typeof item.meta === 'string'
            ? item.meta
            : JSON.stringify(item.meta, null, 2);
      } catch {
        metaStr = '';
      }

      const initialLocale = toShortLocale(
        coerceLocale(item.locale ?? '', defaultLocaleFromDb) || item.locale || '',
      );

      setFormState({
        id: String(item.id),
        email: String(item.email ?? ''),
        is_verified: !!item.is_verified,
        is_subscribed: !!item.is_subscribed,
        locale: initialLocale,
        metaJson: metaStr,
      });
      setShowModal(true);
    },
    [coerceLocale, defaultLocaleFromDb],
  );

  const closeModal = useCallback(() => {
    if (busy) return;
    setShowModal(false);
    setFormState(null);
  }, [busy]);

  const handleFormChange = useCallback(
    (field: keyof NewsletterFormState, value: string | boolean) => {
      setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    [],
  );

  const handleSaveForm = useCallback(async () => {
    if (!formState) return;

    let metaObj: Record<string, any> | null = null;
    if (formState.metaJson.trim().length > 0) {
      try {
        metaObj = JSON.parse(formState.metaJson);
      } catch {
        toast.error('Meta alanı geçerli bir JSON olmalıdır. Lütfen kontrol et.');
        return;
      }
    }

    const normalizedLocale = (() => {
      const v = toShortLocale(formState.locale);
      if (!v) return null;
      const coerced = toShortLocale(coerceLocale(v, defaultLocaleFromDb) || v);
      return coerced || null;
    })();

    const patch = {
      verified: !!formState.is_verified,
      subscribed: !!formState.is_subscribed,
      locale: normalizedLocale,
      meta: metaObj,
    };

    try {
      await updateNewsletter({ id: formState.id, patch }).unwrap();
      toast.success('Kayıt güncellendi.');
      closeModal();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.data?.error ||
        err?.message ||
        'Kayıt güncellenirken bir hata oluştu.';
      toast.error(msg);
    }
  }, [formState, coerceLocale, defaultLocaleFromDb, updateNewsletter, closeModal, refetch]);

  /* -------------------- Delete / Toggle ----------------------- */
  const handleDelete = useCallback(
    async (item: NewsletterAdminDto) => {
      if (
        !window.confirm(`"${item.email}" aboneliğini silmek üzeresin. Devam etmek istiyor musun?`)
      )
        return;

      try {
        await deleteNewsletter(String(item.id)).unwrap();
        toast.success(`"${item.email}" silindi.`);
        await refetch();
      } catch (err: any) {
        const msg =
          err?.data?.error?.message ||
          err?.data?.error ||
          err?.message ||
          'Kayıt silinirken bir hata oluştu.';
        toast.error(msg);
      }
    },
    [deleteNewsletter, refetch],
  );

  const handleToggleVerified = useCallback(
    async (item: NewsletterAdminDto, value: boolean) => {
      try {
        await updateNewsletter({ id: String(item.id), patch: { verified: value } }).unwrap();
        setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, is_verified: value } : r)));
      } catch (err: any) {
        const msg =
          err?.data?.error?.message ||
          err?.data?.error ||
          err?.message ||
          'Doğrulama durumu güncellenirken bir hata oluştu.';
        toast.error(msg);
      }
    },
    [updateNewsletter],
  );

  const handleToggleSubscribed = useCallback(
    async (item: NewsletterAdminDto, value: boolean) => {
      try {
        await updateNewsletter({ id: String(item.id), patch: { subscribed: value } }).unwrap();
        setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, is_subscribed: value } : r)));
      } catch (err: any) {
        const msg =
          err?.data?.error?.message ||
          err?.data?.error ||
          err?.message ||
          'Abonelik durumu güncellenirken bir hata oluştu.';
        toast.error(msg);
      }
    },
    [updateNewsletter],
  );

  /* -------------------- Render -------------------- */
  return (
    <div className="container-fluid py-4">
      <NewsletterHeader
        search={search}
        onSearchChange={setSearch}
        email={emailFilter}
        onEmailChange={setEmailFilter}
        locale={localeFilter}
        onLocaleChange={handleLocaleFilterChange}
        locales={localeOptions}
        localesLoading={localesLoading}
        onlyVerified={onlyVerified}
        onOnlyVerifiedChange={setOnlyVerified}
        onlySubscribed={onlySubscribed}
        onOnlySubscribedChange={setOnlySubscribed}
        orderBy={orderBy}
        order={order}
        onOrderByChange={setOrderBy}
        onOrderChange={setOrder}
        loading={busy}
        onRefresh={refetch}
        total={total}
      />

      <div className="row">
        <div className="col-12">
          <NewsletterList
            items={rows}
            loading={busy}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleVerified={handleToggleVerified}
            onToggleSubscribed={handleToggleSubscribed}
          />
        </div>
      </div>

      {/* --------------------- Edit Modal --------------------- */}
      {showModal && formState && (
        <>
          <div className="modal-backdrop fade show" />

          <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h5 className="modal-title small mb-0">Newsletter Kaydı Düzenle</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Kapat"
                    onClick={closeModal}
                    disabled={busy}
                  />
                </div>

                <div className="modal-body">
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label small">Email</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.email}
                        disabled
                      />
                      <div className="form-text small">Email adresi değiştirilemez.</div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">Dil (locale)</label>
                      <select
                        className="form-select form-select-sm"
                        value={formState.locale || ''}
                        onChange={(e) => handleFormChange('locale', e.target.value)}
                        disabled={busy || localesLoading}
                      >
                        <option value="">(boş)</option>
                        {(adminLocaleOptions ?? []).map((opt) => (
                          <option key={opt.value} value={String(opt.value).toLowerCase()}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="form-text small">
                        Uygulama dilleri <code>site_settings.app_locales</code> üzerinden gelir.
                      </div>
                    </div>

                    <div className="col-md-3 d-flex align-items-end">
                      <div className="d-flex flex-column gap-1">
                        <div className="form-check form-switch small">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="newsletter-modal-verified"
                            checked={formState.is_verified}
                            onChange={(e) => handleFormChange('is_verified', e.target.checked)}
                            disabled={busy}
                          />
                          <label
                            className="form-check-label ms-1"
                            htmlFor="newsletter-modal-verified"
                          >
                            Doğrulandı
                          </label>
                        </div>

                        <div className="form-check form-switch small">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="newsletter-modal-subscribed"
                            checked={formState.is_subscribed}
                            onChange={(e) => handleFormChange('is_subscribed', e.target.checked)}
                            disabled={busy}
                          />
                          <label
                            className="form-check-label ms-1"
                            htmlFor="newsletter-modal-subscribed"
                          >
                            Abone (subscribed)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label small">Meta (JSON)</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows={5}
                      value={formState.metaJson}
                      onChange={(e) => handleFormChange('metaJson', e.target.value)}
                      disabled={busy}
                    />
                    <div className="form-text small">
                      İsteğe bağlı metadata. Geçerli bir JSON olmalıdır.
                    </div>
                  </div>
                </div>

                <div className="modal-footer py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={closeModal}
                    disabled={busy}
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveForm}
                    disabled={busy}
                  >
                    {busy ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsletterAdminPage;
