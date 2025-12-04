// =============================================================
// FILE: src/pages/admin/categories/[id].tsx
// Ensotek – Kategori Düzenleme Sayfası
// =============================================================

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";

import {
  useGetCategoryAdminQuery,
} from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";
import CategoryFormPage from "@/components/admin/categories/CategoryFormPage";
import type { CategoryDto } from "@/integrations/types/category.types";

const AdminCategoryEditPage: React.FC = () => {
  const router = useRouter();
  const rawId = router.query.id;

  const id = useMemo(() => {
    if (typeof rawId === "string") return rawId;
    if (Array.isArray(rawId)) return rawId[0];
    return "";
  }, [rawId]);

  const currentLocale =
    (router.locale as string | undefined)?.toLowerCase() ?? "tr";

  const shouldSkip = !router.isReady || !id;

  const {
    data: category,
    isLoading,
    isFetching,
  } = useGetCategoryAdminQuery(
    { id, locale: currentLocale },
    { skip: shouldSkip },
  );

  const loading = isLoading || isFetching || shouldSkip;

  const handleDone = () => {
    router.push("/admin/categories");
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
