// =============================================================
// FILE: src/pages/admin/categories/[id].tsx
// Ensotek – Kategori Düzenleme Sayfası
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import { useGetCategoryAdminQuery } from '@/integrations/rtk/hooks';
import CategoryFormPage from '@/components/admin/categories/CategoryFormPage';
import type { CategoryDto } from '@/integrations/types';

import { useAdminLocales } from '@/components/common/useAdminLocales';

const AdminCategoryEditPage: React.FC = () => {
  const router = useRouter();
  const rawId = router.query.id;

  const id = useMemo(() => {
    if (typeof rawId === 'string') return rawId;
    if (Array.isArray(rawId)) return rawId[0];
    return '';
  }, [rawId]);

  // ✅ locale source priority: query.locale > router.locale > DB default
  const rawLocaleFromQuery = router.query.locale;
  const rawLocaleFromRouter = router.locale;

  const { coerceLocale, defaultLocaleFromDb, loading: localesLoading } = useAdminLocales();

  const effectiveLocale = useMemo(() => {
    const q =
      typeof rawLocaleFromQuery === 'string'
        ? rawLocaleFromQuery
        : Array.isArray(rawLocaleFromQuery)
        ? rawLocaleFromQuery[0]
        : undefined;

    return coerceLocale(q ?? rawLocaleFromRouter, defaultLocaleFromDb);
  }, [rawLocaleFromQuery, rawLocaleFromRouter, coerceLocale, defaultLocaleFromDb]);

  const shouldSkip = !router.isReady || !id || localesLoading;

  const {
    data: category,
    isLoading,
    isFetching,
  } = useGetCategoryAdminQuery({ id, locale: effectiveLocale || undefined }, { skip: shouldSkip });

  const loading = isLoading || isFetching || shouldSkip;

  const handleDone = () => {
    router.push('/admin/categories');
  };

  return (
    <CategoryFormPage
      mode="edit"
      initialData={(category as CategoryDto) ?? null}
      loading={loading}
      onDone={handleDone}
    />
  );
};

export default AdminCategoryEditPage;
