// =============================================================
// FILE: src/pages/admin/offer/[id].tsx
// Ensotek – Offer Admin Edit Page
// =============================================================

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";

import { useGetOfferAdminQuery } from "@/integrations/rtk/endpoints/admin/offers_admin.endpoints";
import { OfferFormPage } from "@/components/admin/offer/OfferFormPage";
import type { OfferRow } from "@/integrations/types/offers.types";

const AdminOfferEditPage: React.FC = () => {
  const router = useRouter();
  const rawId = router.query.id;

  const id = useMemo(() => {
    if (typeof rawId === "string") return rawId;
    if (Array.isArray(rawId)) return rawId[0];
    return "";
  }, [rawId]);

  const shouldSkip = !router.isReady || !id;

  const { data, isLoading, isFetching } = useGetOfferAdminQuery(id, {
    skip: shouldSkip,
  });

  const loading = isLoading || isFetching || shouldSkip;

  return (
    <OfferFormPage
      mode="edit"
      initialData={(data as OfferRow) ?? null}
      loading={loading}
    />
  );
};

export default AdminOfferEditPage;
