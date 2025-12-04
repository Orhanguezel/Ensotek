// =============================================================
// FILE: src/pages/admin/references/[id].tsx
// Ensotek – Referans Düzenleme Sayfası
// =============================================================

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";

import { useGetReferenceAdminQuery } from "@/integrations/rtk/endpoints/admin/references_admin.endpoints";
import ReferencesFormPage from "@/components/admin/references/ReferencesFormPage";
import type { ReferenceDto as ReferenceAdminDto } from "@/integrations/types/references.types";

const AdminReferenceEditPage: React.FC = () => {
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

  const { data, isLoading, isFetching } = useGetReferenceAdminQuery(
    { id, locale },
    { skip: shouldSkip },
  );

  const loading = isLoading || isFetching || shouldSkip;

  return (
    <ReferencesFormPage
      mode="edit"
      initialData={(data as ReferenceAdminDto) ?? null}
      loading={loading}
    />
  );
};

export default AdminReferenceEditPage;
