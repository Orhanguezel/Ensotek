// =============================================================
// FILE: src/pages/admin/library/[id].tsx
// Ensotek – Library Düzenleme Sayfası (Dynamic locale + DB default)
// Priority: query.locale > router.locale > db default
// - No hardcoded locale list
// =============================================================

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";

import { useAdminLocales } from "@/components/common/useAdminLocales";
import { useGetLibraryAdminQuery } from "@/integrations/rtk/hooks";
import LibraryFormPage from "@/components/admin/library/LibraryFormPage";
import type { LibraryDto } from "@/integrations/types";

function pickFirstString(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) {
    const first = v.find((x) => typeof x === "string");
    return typeof first === "string" ? first : undefined;
  }
  return undefined;
}

const AdminLibraryEditPage: React.FC = () => {
  const router = useRouter();
  const rawId = router.query.id;

  const id = useMemo(() => {
    if (typeof rawId === "string") return rawId;
    if (Array.isArray(rawId)) return rawId[0] ?? "";
    return "";
  }, [rawId]);

  const { defaultLocaleFromDb, coerceLocale, loading: localesLoading } = useAdminLocales();

  // priority: query.locale > router.locale > db default
  const effectiveLocale = useMemo(() => {
    const q = pickFirstString(router.query.locale);
    const r = typeof router.locale === "string" ? router.locale : undefined;
    return coerceLocale(q ?? r, defaultLocaleFromDb);
  }, [router.query.locale, router.locale, coerceLocale, defaultLocaleFromDb]);

  // locale boş dönerse (DB'de aktif locale yoksa) query'i skip edelim
  const shouldSkip = !router.isReady || !id || localesLoading || !effectiveLocale;

  const { data, isLoading, isFetching } = useGetLibraryAdminQuery(
    { id, locale: effectiveLocale },
    { skip: shouldSkip },
  );

  const loading = isLoading || isFetching || shouldSkip;

  return (
    <LibraryFormPage
      mode="edit"
      initialData={(data as LibraryDto) ?? null}
      loading={loading}
    />
  );
};

export default AdminLibraryEditPage;
