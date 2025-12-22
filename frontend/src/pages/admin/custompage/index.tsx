// =============================================================
// FILE: src/pages/admin/custompage/index.tsx
// Ensotek – Admin Custom Pages Liste + Filtre + Reorder
// FIX (Locale):
//  - Locale source: /site_settings/app-locales + /site_settings/default-locale
//  - Default filter: default locale (NOT all languages)
//  - Still allows "Tüm diller" option if allowAllOption=true
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { toast } from 'sonner';

import {
  CustomPageHeader,
  type CustomPageFilters,
  type LocaleOption,
} from '@/components/admin/custompage/CustomPageHeader';
import { CustomPageList } from '@/components/admin/custompage/CustomPageList';

import {
  useListCustomPagesAdminQuery,
  useReorderCustomPagesAdminMutation,
  useGetAppLocalesPublicQuery,
  useGetDefaultLocalePublicQuery,
} from '@/integrations/rtk/hooks';


import type {
  CustomPageListAdminQueryParams,
  BoolLike,
  CustomPageDto,
} from '@/integrations/types/custom_pages.types';

const mapPublishedFilterToBoolLike = (
  f: CustomPageFilters['publishedFilter'],
): BoolLike | undefined => {
  if (f === 'all') return undefined;
  if (f === 'published') return 1;
  return 0;
};

const AdminCustomPageIndex: NextPage = () => {
  const [filters, setFilters] = useState<CustomPageFilters>({
    search: '',
    moduleKey: '',
    publishedFilter: 'all',
    locale: '', // ilk load'da default locale'e set edilecek
  });

  const {
    data: appLocalesMeta,
    isLoading: isLocalesLoading1,
    isFetching: isLocalesFetching1,
  } = useGetAppLocalesPublicQuery();

  const {
    data: defaultLocaleMeta,
    isLoading: isLocalesLoading2,
    isFetching: isLocalesFetching2,
  } = useGetDefaultLocalePublicQuery();

  const isLocalesLoading =
    isLocalesLoading1 || isLocalesLoading2 || isLocalesFetching1 || isLocalesFetching2;

  const { localeOptions, defaultLocale } = useMemo(() => {
    const metas = (appLocalesMeta ?? [])
      .filter((m) => m && m.code)
      .filter((m) => m.is_active !== false)
      .map((m) => ({
        code: String(m.code).trim().toLowerCase(),
        label: typeof m.label === 'string' ? m.label.trim() : undefined,
        is_default: m.is_default === true,
      }))
      .filter((m) => !!m.code);

    const uniq = new Map<string, (typeof metas)[number]>();
    for (const m of metas) uniq.set(m.code, m);
    const active = Array.from(uniq.values());

    const metaDefault = active.find((m) => m.is_default)?.code || null;
    const defFromEndpoint =
      typeof defaultLocaleMeta === 'string' ? defaultLocaleMeta.trim().toLowerCase() : null;

    const effectiveDefault = (
      metaDefault ||
      defFromEndpoint ||
      active[0]?.code ||
      'tr'
    ).toLowerCase();

    const options: LocaleOption[] = active.map((m) => {
      const labelBase = (m.label && m.label.length ? m.label : m.code.toUpperCase()).trim();
      return { value: m.code, label: `${labelBase} (${m.code})` };
    });

    return { localeOptions: options, defaultLocale: effectiveDefault };
  }, [appLocalesMeta, defaultLocaleMeta]);

  // ✅ ilk açılışta "tüm diller" değil, default locale seçili gelsin
  useEffect(() => {
    if (!defaultLocale) return;
    setFilters((prev) => {
      if (prev.locale) return prev; // kullanıcı seçtiyse dokunma
      return { ...prev, locale: defaultLocale };
    });
  }, [defaultLocale]);

  const queryParams: CustomPageListAdminQueryParams = useMemo(() => {
    const is_published = mapPublishedFilterToBoolLike(filters.publishedFilter);

    return {
      q: filters.search || undefined,
      module_key: filters.moduleKey || undefined,
      locale: filters.locale || undefined,
      is_published,
      limit: 200,
      offset: 0,
    };
  }, [filters]);

  const { data, isLoading, isFetching, refetch } = useListCustomPagesAdminQuery(queryParams);

  const items: CustomPageDto[] = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? items.length;

  const [rows, setRows] = useState<CustomPageDto[]>([]);
  useEffect(() => setRows(items), [items]);

  const [reorderCustomPages, { isLoading: isReordering }] = useReorderCustomPagesAdminMutation();

  const loading = isLoading || isFetching || isLocalesLoading || isReordering;

  const handleFiltersChange = (next: CustomPageFilters) => setFilters(next);

  const handleReorderLocal = (next: CustomPageDto[]) => setRows(next);

  const handleSaveOrder = async () => {
    if (!rows.length) return;

    try {
      const itemsPayload = rows.map((p, index) => ({
        id: p.id,
        display_order: index,
      }));

      await reorderCustomPages({ items: itemsPayload }).unwrap();
      toast.success('Sayfa sıralaması kaydedildi.');
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'Sıralama kaydedilirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="mb-3">
        <h4 className="h5 mb-1">Özel Sayfalar Yönetimi</h4>
        <p className="text-muted small mb-0">
          Blog, haber, hakkında ve benzeri içerik sayfalarını görüntüle, filtrele, sırala ve yönet.
          Dil seçenekleri aktif locale listesi üzerinden dinamik gelir.
        </p>
      </div>

      <CustomPageHeader
        filters={filters}
        total={total}
        onFiltersChange={handleFiltersChange}
        onRefresh={refetch}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        allowAllOption={true}
      />

      <CustomPageList
        items={rows}
        loading={loading}
        onReorder={handleReorderLocal}
        onSaveOrder={handleSaveOrder}
        savingOrder={isReordering}
      />
    </div>
  );
};

export default AdminCustomPageIndex;
