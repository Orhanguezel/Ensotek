// =============================================================
// FILE: src/pages/admin/faqs/[id].tsx
// Ensotek – FAQ Düzenleme Sayfası
// =============================================================

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";

import {
  useGetFaqAdminQuery,
} from "@/integrations/rtk/endpoints/admin/faqs_admin.endpoints";
import FaqsFormPage from "@/components/admin/faqs/FaqsFormPage";
import type { FaqDto } from "@/integrations/types/faqs.types";

const AdminFaqsEditPage: React.FC = () => {
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

  const { data, isLoading, isFetching } = useGetFaqAdminQuery(
    { id, locale },
    { skip: shouldSkip },
  );

  const loading = isLoading || isFetching || shouldSkip;

  return (
    <FaqsFormPage
      mode="edit"
      initialData={(data as FaqDto) ?? null}
      loading={loading}
    />
  );
};

export default AdminFaqsEditPage;
