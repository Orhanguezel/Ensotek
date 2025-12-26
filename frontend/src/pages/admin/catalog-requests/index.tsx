// =============================================================
// FILE: src/pages/admin/catalog-requests/index.tsx
// Ensotek – Admin Catalog Requests List Page (Bootstrap pattern)
// =============================================================

'use client';

import React, { useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import {
  CatalogRequestsHeader,
  type CatalogFilters,
  type LocaleOption,
} from '@/components/admin/catalog/CatalogRequestsHeader';
import { CatalogRequestsList } from '@/components/admin/catalog/CatalogRequestsList';

import {
  useListCatalogRequestsAdminQuery,
  useRemoveCatalogRequestAdminMutation,
} from '@/integrations/rtk/hooks';

import type {
  CatalogRequestDto,
  CatalogRequestListQueryParams,
  CatalogRequestStatus,
} from '@/integrations/types/catalog.types';

import { useAdminLocales } from '@/components/common/useAdminLocales';

/* -------------------- Status guard -------------------- */

const CATALOG_STATUSES: CatalogRequestStatus[] = ['new', 'sent', 'failed', 'archived'];

const isCatalogStatus = (v: unknown): v is CatalogRequestStatus =>
  typeof v === 'string' && (CATALOG_STATUSES as string[]).includes(v);

const pickFirstString = (v: unknown): string | undefined => {
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
  return undefined;
};

const AdminCatalogRequestsIndexPage: NextPage = () => {
  const router = useRouter();

  const {
    localeOptions: adminLocaleOptions,
    defaultLocaleFromDb,
    coerceLocale,
    loading: localesLoading,
  } = useAdminLocales();

  const locales: LocaleOption[] = useMemo(() => {
    return (adminLocaleOptions ?? [])
      .map((o) => ({
        value: String(o.value || '').toLowerCase(),
        label: o.label,
      }))
      .filter((o) => !!o.value);
  }, [adminLocaleOptions]);

  const [filters, setFilters] = useState<CatalogFilters>({
    search: '',
    status: '' as any,
    locale: '',
  });

  const queryParams = useMemo<CatalogRequestListQueryParams>(() => {
    const status = filters.status && isCatalogStatus(filters.status) ? filters.status : undefined;

    const selectedLocaleRaw = pickFirstString(filters.locale);
    const locale = selectedLocaleRaw
      ? coerceLocale(selectedLocaleRaw, defaultLocaleFromDb) || undefined
      : undefined;

    return {
      q: filters.search || undefined,
      status,
      locale,
      limit: 50,
      offset: 0,
      sort: 'created_at',
      orderDir: 'desc',
    };
  }, [filters, coerceLocale, defaultLocaleFromDb]);

  const { data, isLoading, isFetching, refetch } = useListCatalogRequestsAdminQuery(queryParams);

  const [removeReq, { isLoading: isDeleting }] = useRemoveCatalogRequestAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting;

  const items: CatalogRequestDto[] = data ?? [];
  const total = items.length;

  const handleDelete = async (r: CatalogRequestDto) => {
    try {
      await removeReq({ id: r.id }).unwrap();
      toast.success('Talep silindi.');
      await refetch();
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || 'Silme sırasında hata oluştu.';
      toast.error(msg);
    }
  };

  return (
    <div className="container-fluid py-3">
      <CatalogRequestsHeader
        filters={filters}
        total={total}
        loading={busy}
        locales={locales}
        localesLoading={localesLoading}
        defaultLocale={defaultLocaleFromDb || router.locale || 'de'}
        onFiltersChange={setFilters}
        onRefresh={refetch}
      />

      <CatalogRequestsList items={items} loading={busy} onDelete={handleDelete} />
    </div>
  );
};

export default AdminCatalogRequestsIndexPage;
