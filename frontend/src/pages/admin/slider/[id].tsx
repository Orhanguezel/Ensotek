// =============================================================
// FILE: src/pages/admin/slider/[id].tsx
// =============================================================

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";

import { useGetSliderAdminQuery } from "@/integrations/rtk/endpoints/admin/sliders_admin.endpoints";
import SliderFormPage from "@/components/admin/slider/SliderFormPage";
import type { SliderAdminDto } from "@/integrations/types/slider.types";

const AdminSliderEditPage: React.FC = () => {
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

  const { data, isLoading, isFetching } = useGetSliderAdminQuery(
    { id, locale },
    { skip: shouldSkip },
  );

  const loading = isLoading || isFetching || shouldSkip;

  return (
    <SliderFormPage
      mode="edit"
      initialData={(data as SliderAdminDto) ?? null}
      loading={loading}
    />
  );
};

export default AdminSliderEditPage;
