// =============================================================
// FILE: src/pages/admin/references/index.tsx
// Ensotek – Admin References (Liste + filtreler)
// - Locales: useAdminLocales()
// - locale: "" => all locales
// =============================================================

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import {
  useListReferencesAdminQuery,
  useUpdateReferenceAdminMutation,
  useDeleteReferenceAdminMutation,
} from '@/integrations/rtk/hooks';

import { useAdminLocales } from '@/components/common/useAdminLocales';

import type { ReferenceDto, ReferenceListQueryParams } from '@/integrations/types/references.types';

import {
  ReferencesHeader,
  type LocaleOption,
} from '@/components/admin/references/ReferencesHeader';
import { ReferencesList } from '@/components/admin/references/ReferencesList';

const ReferencesAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  const [orderBy, setOrderBy] = useState<'created_at' | 'updated_at' | 'display_order'>(
    'display_order',
  );
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');

  // "" => all locales
  const [locale, setLocale] = useState<string>('');

  const {
    localeOptions: adminLocaleOptions,
    defaultLocaleFromDb,
    coerceLocale,
    loading: localesLoading,
  } = useAdminLocales();

  const baseLocales: LocaleOption[] = useMemo(() => {
    const arr = adminLocaleOptions ?? [];
    return arr.map((x) => ({
      value: String(x.value).toLowerCase(),
      label: x.label,
    }));
  }, [adminLocaleOptions]);

  const localeOptions: LocaleOption[] = useMemo(() => {
    return [{ value: '', label: 'Tüm Diller' }, ...baseLocales];
  }, [baseLocales]);

  useEffect(() => {
    if (!baseLocales.length) return;
    if (!locale) return; // all ok

    const valid = new Set(baseLocales.map((x) => x.value));
    if (!valid.has(locale)) setLocale('');
  }, [baseLocales, locale]);

  const handleLocaleChange = (next: string) => {
    const raw = (next ?? '').trim();
    if (!raw) {
      setLocale('');
      return;
    }
    const coerced = coerceLocale(raw, defaultLocaleFromDb) || raw;
    setLocale(String(coerced).toLowerCase());
  };

  const listParams = useMemo<ReferenceListQueryParams>(
    () => ({
      q: search || undefined,
      is_published: showOnlyPublished ? '1' : undefined,
      is_featured: showOnlyFeatured ? '1' : undefined,
      sort: orderBy,
      orderDir,
      limit: 200,
      offset: 0,
      module_key: 'references',
      locale: locale || undefined, // "" => undefined => all
    }),
    [search, showOnlyPublished, showOnlyFeatured, orderBy, orderDir, locale],
  );

  const {
    data: listData,
    isLoading,
    isFetching,
    refetch,
  } = useListReferencesAdminQuery(listParams);

  const [rows, setRows] = useState<ReferenceDto[]>([]);
  useEffect(() => {
    setRows(listData?.items ?? []);
  }, [listData]);

  const [updateReference, { isLoading: isUpdating }] = useUpdateReferenceAdminMutation();
  const [deleteReference, { isLoading: isDeleting }] = useDeleteReferenceAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isUpdating || isDeleting;

  const handleCreateClick = () => {
    router.push('/admin/references/new');
  };

  const handleEditRow = (item: ReferenceDto) => {
    // listte locale seçiliyse edit sayfasına da taşı
    const qs = locale ? `?locale=${encodeURIComponent(locale)}` : '';
    router.push(`/admin/references/${encodeURIComponent(String(item.id))}${qs}`);
  };

  const handleDelete = async (item: ReferenceDto) => {
    const label = item.title || item.slug || String(item.id);

    if (!window.confirm(`"${label}" referans kaydını silmek üzeresin. Devam etmek istiyor musun?`))
      return;

    try {
      await deleteReference(String(item.id)).unwrap();
      toast.success(`"${label}" silindi.`);
      await refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.error?.message || err?.message || 'Referans silinirken bir hata oluştu.',
      );
    }
  };

  const handleTogglePublished = async (item: ReferenceDto, value: boolean) => {
    try {
      await updateReference({
        id: String(item.id),
        patch: { is_published: value ? '1' : '0' },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          String(r.id) === String(item.id) ? { ...r, is_published: value ? 1 : 0 } : r,
        ),
      );
    } catch (err: any) {
      toast.error(
        err?.data?.error?.message || err?.message || 'Yayın durumu güncellenirken bir hata oluştu.',
      );
    }
  };

  const handleToggleFeatured = async (item: ReferenceDto, value: boolean) => {
    try {
      await updateReference({
        id: String(item.id),
        patch: { is_featured: value ? '1' : '0' },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          String(r.id) === String(item.id) ? { ...r, is_featured: value ? 1 : 0 } : r,
        ),
      );
    } catch (err: any) {
      toast.error(
        err?.data?.error?.message ||
          err?.message ||
          'Öne çıkarma durumu güncellenirken bir hata oluştu.',
      );
    }
  };

  return (
    <div className="container-fluid py-4">
      <ReferencesHeader
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
          <ReferencesList
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

export default ReferencesAdminPage;
