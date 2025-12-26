// =============================================================
// FILE: src/pages/admin/custompage/index.tsx
// Ensotek – Admin Custompage List
// ID bazlı detail route: /admin/custompage/:id
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { useAdminLocales } from '@/components/common/useAdminLocales';

import {
  useListCustomPagesAdminQuery,
  useReorderCustomPagesAdminMutation,
} from '@/integrations/rtk/hooks';

import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import {
  CustomPageHeader,
  type CustomPageFilters,
} from '@/components/admin/custompage/CustomPageHeader';
import { CustomPageList } from '@/components/admin/custompage/CustomPageList';

const toShortLocale = (v: unknown): string =>
  String(v || '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

const AdminCustomPageIndex: NextPage = () => {
  const router = useRouter();

  const {
    localeOptions,
    defaultLocaleFromDb,
    loading: localesLoading,
    fetching: localesFetching,
  } = useAdminLocales();

  const localeSet = useMemo(
    () => new Set((localeOptions ?? []).map((x) => toShortLocale(x.value))),
    [localeOptions],
  );

  const initialLocale = useMemo(() => {
    const qLocale = toShortLocale(router.query?.locale);
    if (qLocale && localeSet.has(qLocale)) return qLocale;

    const dbDef = toShortLocale(defaultLocaleFromDb);
    if (dbDef && localeSet.has(dbDef)) return dbDef;

    const first = toShortLocale(localeOptions?.[0]?.value);
    return first || 'de';
  }, [router.query?.locale, defaultLocaleFromDb, localeOptions, localeSet]);

  const [filters, setFilters] = useState<CustomPageFilters>({
    search: '',
    moduleKey: '',
    publishedFilter: 'all',
    locale: '',
  });

  useEffect(() => {
    if (!router.isReady) return;
    if (!localeOptions || localeOptions.length === 0) return;

    setFilters((prev) => {
      const p = toShortLocale(prev.locale);
      if (p && localeSet.has(p)) return prev;
      return { ...prev, locale: initialLocale };
    });
  }, [router.isReady, localeOptions, localeSet, initialLocale]);

  // URL sync
  useEffect(() => {
    if (!router.isReady) return;

    const cur = toShortLocale(router.query?.locale);
    const next = toShortLocale(filters.locale);

    if (!next) {
      if (cur) {
        const q = { ...router.query };
        delete (q as any).locale;
        void router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
      }
      return;
    }

    if (next === cur) return;

    void router.replace(
      { pathname: router.pathname, query: { ...router.query, locale: next } },
      undefined,
      { shallow: true },
    );
  }, [filters.locale, router]);

  const apiLocale = useMemo(() => {
    const f = toShortLocale(filters.locale);
    if (f && localeSet.has(f)) return f;

    const dbDef = toShortLocale(defaultLocaleFromDb);
    if (dbDef && localeSet.has(dbDef)) return dbDef;

    const first = toShortLocale(localeOptions?.[0]?.value);
    return first || 'de';
  }, [filters.locale, defaultLocaleFromDb, localeOptions, localeSet]);

  const is_published = useMemo(() => {
    if (filters.publishedFilter === 'all') return undefined;
    if (filters.publishedFilter === 'published') return 1;
    return 0;
  }, [filters.publishedFilter]);

  const queryParams = useMemo(
    () => ({
      q: filters.search || undefined,
      module_key: filters.moduleKey || undefined,
      is_published,
      locale: apiLocale || undefined,
      limit: 200,
      offset: 0,
    }),
    [filters.search, filters.moduleKey, is_published, apiLocale],
  );

  const { data, isLoading, isFetching, refetch } = useListCustomPagesAdminQuery(
    queryParams as any,
    {
      refetchOnMountOrArgChange: true,
    } as any,
  );

  const items: CustomPageDto[] = useMemo(() => (data as any)?.items ?? [], [data]);
  const total: number = useMemo(() => (data as any)?.total ?? items.length, [data, items.length]);

  const [rows, setRows] = useState<CustomPageDto[]>([]);
  useEffect(() => setRows(items), [items]);

  const [reorder, { isLoading: isReordering }] = useReorderCustomPagesAdminMutation();
  const busy = isLoading || isFetching || localesLoading || localesFetching || isReordering;

  const handleSaveOrder = async () => {
    try {
      const payload = {
        items: rows.map((p, idx) => ({ id: p.id, display_order: idx })),
      };
      await reorder(payload as any).unwrap();
      toast.success('Sıralama kaydedildi.');
      await refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.error?.message || err?.message || 'Sıralama kaydedilirken hata oluştu.',
      );
    }
  };

  const handleCreate = () => {
    void router.push({
      pathname: '/admin/custompage/new',
      query: apiLocale ? { locale: apiLocale } : undefined,
    });
  };

  return (
    <div className="container-fluid py-3">
      <div className="mb-3 d-flex align-items-start justify-content-between gap-2 flex-wrap">
        <div style={{ minWidth: 0 }}>
          <h4 className="h5 mb-1">Custom Pages</h4>
          <p className="text-muted small mb-0">
            Özel sayfaları listele, filtrele ve sırala. Locale DB’den gelir ve URL ile senkron
            çalışır.
          </p>
        </div>

        <button type="button" className="btn btn-sm btn-primary" onClick={handleCreate}>
          Yeni Sayfa
        </button>
      </div>

      <CustomPageHeader
        filters={filters}
        total={total}
        onFiltersChange={setFilters}
        onRefresh={refetch}
        locales={localeOptions as any}
        localesLoading={localesLoading || localesFetching}
        allowAllOption={false}
      />

      <CustomPageList
        items={rows}
        loading={busy}
        onReorder={setRows}
        onSaveOrder={handleSaveOrder}
        savingOrder={isReordering}
        activeLocale={apiLocale}
      />
    </div>
  );
};

export default AdminCustomPageIndex;
