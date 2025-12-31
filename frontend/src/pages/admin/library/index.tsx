// =============================================================
// FILE: src/pages/admin/library/index.tsx
// Ensotek – Admin Library Sayfası (Liste + filtreler)
// - Dynamic locales from DB (site_settings.app_locales + default_locale)
// - No hardcoded locale map/list
// - ✅ Schema-aligned: featured uses `featured`
// - ✅ DTO-aligned: uses `name` (NOT title)
// - ✅ Adds Active toggle (is_active) to avoid accidental DELETE for "Pasif yap"
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

const getItemLabel = (item: LibraryDto): string => {
  const name = (item as any)?.name;
  if (typeof name === 'string' && name.trim()) return name.trim();

  const slug = (item as any)?.slug;
  if (typeof slug === 'string' && slug.trim()) return slug.trim();

  return item.id;
};

const LibraryAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
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

  // UI'de filtre için: "" = tüm diller
  const [locale, setLocale] = useState<string>('');

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
    if (!normalized) {
      setLocale('');
      return;
    }
    const safe = coerceLocale(normalized, defaultLocaleFromDb);
    setLocale(safe || '');
  };

  /* -------------------- Liste + filtreler -------------------- */

  const listParams = useMemo<LibraryListQueryParams>(() => {
    const safeLocale = locale ? coerceLocale(locale, defaultLocaleFromDb) : '';

    return {
      q: search || undefined,

      // backend filters
      is_published: showOnlyPublished ? '1' : undefined,
      featured: showOnlyFeatured ? '1' : undefined,

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
    const q = locale ? `?locale=${encodeURIComponent(locale)}` : '';
    router.push(`/admin/library/${item.id}${q}`);
  };

  const handleDelete = async (item: LibraryDto) => {
    const label = getItemLabel(item);

    if (!window.confirm(`"${label}" kayıtlı içeriği silmek üzeresin. Devam etmek istiyor musun?`)) {
      return;
    }

    try {
      await deleteLibrary(item.id).unwrap();
      toast.success(`"${label}" silindi.`);
      await refetch();
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || 'Kayıt silinirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  const patchAndUpdateLocalRow = async (
    id: string,
    patch: any,
    localPatch: Partial<LibraryDto>,
  ) => {
    await updateLibrary({ id, patch }).unwrap();
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...localPatch } : r)));
  };

  const handleTogglePublished = async (item: LibraryDto, value: boolean) => {
    try {
      await patchAndUpdateLocalRow(
        item.id,
        { is_published: value }, // ✅ boolean
        { is_published: value ? 1 : 0 },
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'Yayın durumu güncellenirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  const handleToggleFeatured = async (item: LibraryDto, value: boolean) => {
    try {
      await patchAndUpdateLocalRow(
        item.id,
        { featured: value }, // ✅ boolean
        { featured: value ? 1 : 0 },
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'Öne çıkarma güncellenirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  // ✅ NEW: Active toggle (Pasif/Aktif) - delete ile karışmasın
  const handleToggleActive = async (item: LibraryDto, value: boolean) => {
    try {
      await patchAndUpdateLocalRow(
        item.id,
        { is_active: value }, // ✅ boolean
        { is_active: value ? 1 : 0 },
      );
      toast.success(value ? 'Kayıt aktif edildi.' : 'Kayıt pasif edildi.');
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'Aktif/Pasif güncellenirken bir hata oluştu.';
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
            // ✅ IMPORTANT: LibraryList bu prop'u kullanmalı
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>
    </div>
  );
};

export default LibraryAdminPage;
