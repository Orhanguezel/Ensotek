// =============================================================
// FILE: src/pages/admin/library/[id].tsx
// Ensotek – Library Düzenleme Sayfası
// =============================================================

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";

import { useGetLibraryAdminQuery } from "@/integrations/rtk/endpoints/admin/library_admin.endpoints";
import LibraryFormPage from "@/components/admin/library/LibraryFormPage";
import type { LibraryDto } from "@/integrations/types/library.types";

const AdminLibraryEditPage: React.FC = () => {
  const router = useRouter();
  const rawId = router.query.id;

  const id = useMemo(() => {
    if (typeof rawId === "string") return rawId;
    if (Array.isArray(rawId)) return rawId[0];
    return "";
  }, [rawId]);

  const locale =
    (router.locale as string | undefined)?.toLowerCase() ?? "tr";

  const shouldSkip = !router.isReady || !id;

  const { data, isLoading, isFetching } = useGetLibraryAdminQuery(
    { id, locale },
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
