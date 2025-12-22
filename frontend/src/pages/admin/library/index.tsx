// =============================================================
// FILE: src/pages/admin/library/index.tsx
// Ensotek – Admin Library Sayfası (Liste + filtreler)
// - Dynamic locales from DB (site_settings.app_locales + default_locale)
// - No hardcoded locale map/list
// =============================================================

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import {
  useListLibraryAdminQuery,
  useUpdateLibraryAdminMutation,
  useRemoveLibraryAdminMutation,
} from '@/integrations/rtk/hooks';

import type { LibraryDto, LibraryListQueryParams } from '@/integrations/types/library.types';

import { LibraryHeader, type LocaleOption } from '@/components/admin/library/LibraryHeader';
import { LibraryList } from '@/components/admin/library/LibraryList';

import { useAdminLocales } from '@/components/common/useAdminLocales';

function pickFirstString(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) {
    const first = v.find((x) => typeof x === 'string');
    return typeof first === 'string' ? first : undefined;
  }
  return undefined;
}

const LibraryAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  // UI'de ismini koruyoruz ama backend'de is_active filtresine bağlı
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  const [orderBy, setOrderBy] = useState<
    'created_at' | 'updated_at' | 'published_at' | 'display_order' | 'views' | 'download_count'
  >('display_order');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');

  const {
    defaultLocaleFromDb,
    coerceLocale,
    localeOptions: dbLocaleOptions,
    loading: localesLoading,
  } = useAdminLocales();

  // UI'de filtre için: "" = tüm diller (isteğe bağlı)
  const [locale, setLocale] = useState<string>('');

  // Query param ile locale seçildiyse (örn: /admin/library?locale=de) ilk açılışta uygula
  useEffect(() => {
    if (!router.isReady) return;

    const qLocale = pickFirstString(router.query.locale);
    if (!qLocale) return;

    const safe = coerceLocale(qLocale, defaultLocaleFromDb);
    setLocale(safe || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const localeOptions: LocaleOption[] = useMemo(() => {
    const allOpt: LocaleOption = { value: '', label: 'Tüm diller' };
    const fromDb: LocaleOption[] = (dbLocaleOptions ?? []).map((o) => ({
      value: String(o.value || '').toLowerCase(),
      label: o.label,
    }));
    return [allOpt, ...fromDb];
  }, [dbLocaleOptions]);

  const handleLocaleChange = (next: string) => {
    const normalized = (next ?? '').trim().toLowerCase();

    // "" = tüm diller
    if (!normalized) {
      setLocale('');
      return;
    }

    // DB’de yoksa default’a düşür
    const safe = coerceLocale(normalized, defaultLocaleFromDb);
    setLocale(safe || '');
  };

  /* -------------------- Liste + filtreler -------------------- */

  const listParams = useMemo<LibraryListQueryParams>(() => {
    // locale boş değilse DB’ye göre güvenli hale getir
    const safeLocale = locale ? coerceLocale(locale, defaultLocaleFromDb) : '';

    return {
      q: search || undefined,

      is_published: showOnlyPublished ? '1' : undefined,
      is_active: showOnlyFeatured ? '1' : undefined,

      sort: orderBy,
      orderDir,

      limit: 200,
      offset: 0,

      locale: safeLocale || undefined,
    };
  }, [
    search,
    showOnlyPublished,
    showOnlyFeatured,
    orderBy,
    orderDir,
    locale,
    coerceLocale,
    defaultLocaleFromDb,
  ]);

  const { data: listData, isLoading, isFetching, refetch } = useListLibraryAdminQuery(listParams);

  const [rows, setRows] = useState<LibraryDto[]>([]);

  useEffect(() => {
    setRows(listData ?? []);
  }, [listData]);

  const [updateLibrary, { isLoading: isUpdating }] = useUpdateLibraryAdminMutation();
  const [deleteLibrary, { isLoading: isDeleting }] = useRemoveLibraryAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isUpdating || isDeleting || localesLoading;

  /* -------------------- Handlers ----------------------------- */

  const handleCreateClick = () => {
    router.push('/admin/library/new');
  };

  const handleEditRow = (item: LibraryDto) => {
    // Edit sayfası locale’i query’den okuyabildiği için, filtre locale seçiliyse taşıyalım
    const q = locale ? `?locale=${encodeURIComponent(locale)}` : '';
    router.push(`/admin/library/${item.id}${q}`);
  };

  const handleDelete = async (item: LibraryDto) => {
    if (
      !window.confirm(
        `"${
          item.title || item.slug || item.id
        }" kayıtlı içeriği silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteLibrary(item.id).unwrap();
      toast.success(`"${item.title || item.slug || item.id}" silindi.`);
      await refetch();
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || 'Kayıt silinirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  const handleTogglePublished = async (item: LibraryDto, value: boolean) => {
    try {
      await updateLibrary({
        id: item.id,
        patch: { is_published: value ? '1' : '0' },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, is_published: value ? 1 : 0 } : r)),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'Yayın durumu güncellenirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  const handleToggleFeatured = async (item: LibraryDto, value: boolean) => {
    try {
      await updateLibrary({
        id: item.id,
        patch: { is_active: value ? '1' : '0' },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, is_active: value ? 1 : 0 } : r)),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        'Aktiflik durumu güncellenirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <LibraryHeader
        search={search}
        onSearchChange={setSearch}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        locales={localeOptions}
        localesLoading={localesLoading}
        showOnlyPublished={showOnlyPublished}
        onShowOnlyPublishedChange={setShowOnlyPublished}
        showOnlyFeatured={showOnlyFeatured}
        onShowOnlyFeaturedChange={setShowOnlyFeatured}
        orderBy={orderBy}
        orderDir={orderDir}
        onOrderByChange={setOrderBy}
        onOrderDirChange={setOrderDir}
        loading={busy}
        onRefresh={refetch}
        onCreateClick={handleCreateClick}
      />

      <div className="row">
        <div className="col-12">
          <LibraryList
            items={rows}
            loading={busy}
            onEdit={handleEditRow}
            onDelete={handleDelete}
            onTogglePublished={handleTogglePublished}
            onToggleFeatured={handleToggleFeatured}
          />
        </div>
      </div>
    </div>
  );
};

export default LibraryAdminPage;
