// =============================================================
// FILE: src/pages/admin/subcategories/[id].tsx
// Ensotek – Alt Kategori Düzenleme Sayfası
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import { useGetSubCategoryAdminQuery } from '@/integrations/rtk/hooks';
import SubCategoryFormPage from '@/components/admin/subcategories/SubCategoryFormPage';
import type { SubCategoryDto } from '@/integrations/types/subcategory.types';

// ✅ DB’den locale + default locale
import { useAdminLocales } from '@/components/common/useAdminLocales';

const AdminSubCategoryEditPage: React.FC = () => {
  const router = useRouter();
  const rawId = router.query.id;

  const id = useMemo(() => {
    if (typeof rawId === 'string') return rawId;
    if (Array.isArray(rawId)) return rawId[0];
    return '';
  }, [rawId]);

  const {
    defaultLocaleFromDb,
    coerceLocale,
    loading: localesLoading,
  } = useAdminLocales();

  const routerLocale = (router.locale as string | undefined)?.toLowerCase();
  const currentLocale = useMemo(() => {
    // router locale DB’de yoksa default’a düş
    return coerceLocale(routerLocale, defaultLocaleFromDb) || defaultLocaleFromDb || '';
  }, [coerceLocale, routerLocale, defaultLocaleFromDb]);

  const shouldSkip = !router.isReady || !id || localesLoading || !currentLocale;

  const {
    data: subCategory,
    isLoading,
    isFetching,
  } = useGetSubCategoryAdminQuery(
    { id, locale: currentLocale },
    {
      skip: shouldSkip,
      refetchOnMountOrArgChange: true, 
    },
  );


  const loading = isLoading || isFetching || shouldSkip;

  const handleDone = () => {
    router.push('/admin/subcategories');
  };

  return (
    <SubCategoryFormPage
      mode="edit"
      initialData={(subCategory as SubCategoryDto) ?? null}
      loading={loading}
      onDone={handleDone}
      // localeOptions gerekirse form içinde kullanılacaksa şimdiden hazır:
      // (SubCategoryFormPage zaten kendi içinde useAdminLocales kullanacaksa buna gerek yok)
      // localeOptions={localeOptions}
    />
  );
};

export default AdminSubCategoryEditPage;
