// =============================================================
// FILE: src/pages/admin/references/[id].tsx
// Ensotek – Referans Düzenleme Sayfası
// (SubCategory edit page pattern)
// - locale: router.locale -> coerceLocale -> defaultLocaleFromDb
// - uses useAdminLocales()
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import { useGetReferenceAdminQuery } from '@/integrations/rtk/hooks';
import ReferencesFormPage from '@/components/admin/references/ReferencesFormPage';
import type { ReferenceDto as ReferenceAdminDto } from '@/integrations/types';

import { useAdminLocales } from '@/components/common/useAdminLocales';

const AdminReferenceEditPage: React.FC = () => {
  const router = useRouter();
  const rawId = router.query.id;

  const id = useMemo(() => {
    if (typeof rawId === 'string') return rawId;
    if (Array.isArray(rawId)) return rawId[0];
    return '';
  }, [rawId]);

  const { defaultLocaleFromDb, coerceLocale, loading: localesLoading } = useAdminLocales();

  const routerLocale = (router.locale as string | undefined)?.toLowerCase();

  const currentLocale = useMemo(() => {
    return coerceLocale(routerLocale, defaultLocaleFromDb) || defaultLocaleFromDb || '';
  }, [coerceLocale, routerLocale, defaultLocaleFromDb]);

  const shouldSkip = !router.isReady || !id || localesLoading || !currentLocale;

  const { data, isLoading, isFetching } = useGetReferenceAdminQuery(
    { id: String(id), locale: currentLocale },
    { skip: shouldSkip },
  );

  const loading = isLoading || isFetching || shouldSkip;

  const handleDone = () => {
    router.push('/admin/references');
  };

  return (
    <ReferencesFormPage
      mode="edit"
      initialData={(data as ReferenceAdminDto) ?? null}
      loading={loading}
      onDone={handleDone}
    />
  );
};

export default AdminReferenceEditPage;
