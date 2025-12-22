// =============================================================
// FILE: src/pages/admin/offers/index.tsx
// Ensotek – Offer Admin List Page (Bootstrap pattern)
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  useListOffersAdminQuery,
  useRemoveOfferAdminMutation,
} from "@/integrations/rtk/hooks";

import type { OfferRow, OfferStatus } from "@/integrations/types/offers.types";
import { OfferHeader } from "@/components/admin/offer/OfferHeader";
import { OfferList } from "@/components/admin/offer/OfferList";

const DEFAULT_LIMIT = 50;

const OfferListPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OfferStatus | "">("");

  const listParams = useMemo(
    () => ({
      sort: "created_at" as const,
      orderDir: "desc" as const,
      limit: DEFAULT_LIMIT,
      q: search || undefined,
      status: status || undefined,
    }),
    [search, status],
  );

  const { data, isLoading, isFetching, refetch } =
    useListOffersAdminQuery(listParams);

  const [rows, setRows] = useState<OfferRow[]>([]);

  useEffect(() => {
    setRows(data ?? []);
  }, [data]);

  const [removeOffer, { isLoading: isDeleting }] =
    useRemoveOfferAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting;

  /* -------------------- Handlers -------------------- */

  const handleCreateClick = () => {
    router.push("/admin/offers/new");
  };

  const handleEdit = (item: OfferRow) => {
    router.push(`/admin/offers/${item.id}`);
  };

  const handleDelete = async (item: OfferRow) => {
    if (
      !window.confirm(
        `"${item.customer_name}" teklif kaydını silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await removeOffer(item.id).unwrap();
      toast.success(`"${item.customer_name}" teklifi silindi.`);
      await refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.error?.message ||
        err?.message ||
        "Teklif silinirken bir hata oluştu.",
      );
    }
  };

  /* -------------------- RENDER -------------------- */

  return (
    <div className="container-fluid py-4">
      <OfferHeader
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        loading={busy}
        onRefresh={refetch}
        onCreateClick={handleCreateClick}
      />

      <OfferList
        items={rows}
        loading={busy}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default OfferListPage;
