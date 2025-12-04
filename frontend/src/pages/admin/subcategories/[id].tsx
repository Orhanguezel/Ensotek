// =============================================================
// FILE: src/pages/admin/subcategories/[id].tsx
// Ensotek – Alt Kategori Düzenleme Sayfası
// =============================================================

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";

import {
  useGetSubCategoryAdminQuery,
} from "@/integrations/rtk/endpoints/admin/subcategories_admin.endpoints";

import SubCategoryFormPage from "@/components/admin/subcategories/SubCategoryFormPage";
import type { SubCategoryDto } from "@/integrations/types/subcategory.types";

const AdminSubCategoryEditPage: React.FC = () => {
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
    data: subCategory,
    isLoading,
    isFetching,
  } = useGetSubCategoryAdminQuery(
    { id, locale: currentLocale },
    { skip: shouldSkip },
  );

  const loading = isLoading || isFetching || shouldSkip;

  const handleDone = () => {
    router.push("/admin/subcategories");
  };

  return (
    <SubCategoryFormPage
      mode="edit"
      initialData={(subCategory as SubCategoryDto) ?? null}
      loading={loading}
      onDone={handleDone}
    />
  );
};

export default AdminSubCategoryEditPage;
