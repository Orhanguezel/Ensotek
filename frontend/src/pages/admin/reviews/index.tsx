// =============================================================
// FILE: src/pages/admin/reviews/index.tsx
// Ensotek – Admin Reviews Liste Sayfası
// =============================================================

import React, { useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  ReviewsHeader,
  type ReviewFilters,
  type LocaleOption,
} from "@/components/admin/reviews/ReviewsHeader";
import { ReviewsList } from "@/components/admin/reviews/ReviewsList";

import {
  useListReviewsAdminQuery,
  useDeleteReviewAdminMutation,
} from "@/integrations/rtk/endpoints/admin/reviews_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import type { AdminReviewDto } from "@/integrations/types/review_admin.types";

/* site_settings.app_locales -> LocaleOption[] */
const useLocaleOptions = (): {
  locales: LocaleOption[];
  loading: boolean;
} => {
  const { data, isLoading } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const locales = useMemo<LocaleOption[]>(() => {
    if (!data || !data.length) {
      return [
        { value: "tr", label: "Türkçe (tr)" },
        { value: "en", label: "İngilizce (en)" },
      ];
    }

    const row = data.find((r) => r.key === "app_locales");
    const v = row?.value;
    let arr: string[] = [];

    if (Array.isArray(v)) {
      arr = v.map((x) => String(x)).filter(Boolean);
    } else if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) {
          arr = parsed.map((x) => String(x)).filter(Boolean);
        }
      } catch {
        // ignore
      }
    }

    if (!arr.length) {
      arr = ["tr", "en"];
    }

    const uniq = Array.from(new Set(arr.map((x) => x.toLowerCase())));
    return uniq.map((code) => {
      if (code === "tr") return { value: "tr", label: "Türkçe (tr)" };
      if (code === "en") return { value: "en", label: "İngilizce (en)" };
      if (code === "de") return { value: "de", label: "Almanca (de)" };
      return { value: code, label: code.toUpperCase() };
    });
  }, [data]);

  return { locales, loading: isLoading };
};

const AdminReviewsIndexPage: NextPage = () => {
  const router = useRouter();
  const { locales, loading: localesLoading } = useLocaleOptions();

  const [filters, setFilters] = useState<ReviewFilters>({
    search: "",
    locale: "",
    approval: "all",
    active: "all",
  });

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      search: filters.search || undefined,
      locale: filters.locale || undefined,
      limit: 50,
      offset: 0,
      orderBy: "display_order",
      order: "asc",
    };

    if (filters.approval === "approved") {
      params.approved = 1;
    } else if (filters.approval === "pending") {
      params.approved = 0;
    }

    if (filters.active === "active") {
      params.active = 1;
    } else if (filters.active === "inactive") {
      params.active = 0;
    }

    return params;
  }, [filters]);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListReviewsAdminQuery(queryParams);

  const [deleteReview, { isLoading: isDeleting }] =
    useDeleteReviewAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting;

  const items: AdminReviewDto[] = data?.items ?? [];
  const total = data?.total ?? items.length;

  const handleDelete = async (r: AdminReviewDto) => {
    try {
      await deleteReview({ id: r.id }).unwrap();
      toast.success("Yorum başarıyla silindi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Yorum silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleCreateClick = () => {
    router.push("/admin/reviews/new");
  };

  return (
    <div className="container-fluid py-3">
      <ReviewsHeader
        filters={filters}
        total={total}
        loading={busy}
        locales={locales}
        localesLoading={localesLoading}
        defaultLocale={router.locale}
        onFiltersChange={setFilters}
        onRefresh={refetch}
        onCreateClick={handleCreateClick}
      />

      <ReviewsList items={items} loading={busy} onDelete={handleDelete} />
    </div>
  );
};

export default AdminReviewsIndexPage;
