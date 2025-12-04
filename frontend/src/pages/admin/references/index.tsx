// =============================================================
// FILE: src/pages/admin/references/index.tsx
// Ensotek – Admin References Sayfası (Liste + filtreler)
// Create/Edit artık ayrı sayfalarda
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  useListReferencesAdminQuery,
  useUpdateReferenceAdminMutation,
  useDeleteReferenceAdminMutation,
} from "@/integrations/rtk/endpoints/admin/references_admin.endpoints";

import type {
  ReferenceDto,
  ReferenceListQueryParams,
} from "@/integrations/types/references.types";

import { ReferencesHeader } from "@/components/admin/references/ReferencesHeader";
import { ReferencesList } from "@/components/admin/references/ReferencesList";

/* ------------------------------------------------------------- */

const ReferencesAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  const [orderBy, setOrderBy] =
    useState<"created_at" | "updated_at" | "display_order">("display_order");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");

  // Not: şimdilik locale sabit "tr"
  const locale = "tr";

  /* -------------------- Liste + filtreler -------------------- */

  const listParams = useMemo<ReferenceListQueryParams>(
    () => ({
      // arama
      q: search || undefined,

      // filtreler
      is_published: showOnlyPublished ? "1" : undefined,
      is_featured: showOnlyFeatured ? "1" : undefined,

      // sıralama (BE shared util: sort + orderDir destekli)
      sort: orderBy,
      orderDir,

      // pagination
      limit: 200,
      offset: 0,

      // references modülü için module_key + locale
      module_key: "references",
      locale,
    }),
    [search, showOnlyPublished, showOnlyFeatured, orderBy, orderDir, locale],
  );

  const {
    data: listData,
    isLoading,
    isFetching,
    refetch,
  } = useListReferencesAdminQuery(listParams);

  const [rows, setRows] = useState<ReferenceDto[]>([]);

  useEffect(() => {
    setRows(listData?.items ?? []);
  }, [listData]);

  const [updateReference, { isLoading: isUpdating }] =
    useUpdateReferenceAdminMutation();
  const [deleteReference, { isLoading: isDeleting }] =
    useDeleteReferenceAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isUpdating || isDeleting;

  /* -------------------- Handlers ----------------------------- */

  const handleCreateClick = () => {
    router.push("/admin/references/new");
  };

  const handleEditRow = (item: ReferenceDto) => {
    router.push(`/admin/references/${item.id}`);
  };

  const handleDelete = async (item: ReferenceDto) => {
    if (
      !window.confirm(
        `"${item.title || item.slug || item.id}" referans kaydını silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteReference(item.id).unwrap();
      toast.success(`"${item.title || item.slug || item.id}" silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Referans silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleTogglePublished = async (
    item: ReferenceDto,
    value: boolean,
  ) => {
    try {
      await updateReference({
        id: item.id,
        patch: { is_published: value ? "1" : "0" }, // BoolLike
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_published: value ? 1 : 0 } : r,
        ),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Yayın durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleFeatured = async (
    item: ReferenceDto,
    value: boolean,
  ) => {
    try {
      await updateReference({
        id: item.id,
        patch: { is_featured: value ? "1" : "0" }, // BoolLike
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_featured: value ? 1 : 0 } : r,
        ),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Öne çıkarma durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <ReferencesHeader
        search={search}
        onSearchChange={setSearch}
        showOnlyPublished={showOnlyPublished}
        onShowOnlyPublishedChange={setShowOnlyPublished}
        showOnlyFeatured={showOnlyFeatured}
        onShowOnlyFeaturedChange={setShowOnlyFeatured}
        orderBy={orderBy}
        orderDir={orderDir}
        onOrderByChange={setOrderBy}
        onOrderDirChange={setOrderDir}
        loading={busy}
        onRefresh={refetch}
        onCreateClick={handleCreateClick}
      />

      <div className="row">
        <div className="col-12">
          <ReferencesList
            items={rows}
            loading={busy}
            onEdit={handleEditRow}
            onDelete={handleDelete}
            onTogglePublished={handleTogglePublished}
            onToggleFeatured={handleToggleFeatured}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferencesAdminPage;
