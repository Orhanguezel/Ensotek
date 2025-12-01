// =============================================================
// FILE: src/pages/admin/products/index.tsx
// Ensotek – Admin Products Liste Sayfası
// =============================================================

import React, { useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  ProductsHeader,
  type ProductFilters,
  type LocaleOption,
} from "@/components/admin/products/ProductsHeader";
import { ProductsList } from "@/components/admin/products/ProductsList";

import {
  useListProductsAdminQuery,
  useDeleteProductAdminMutation,
} from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import type { ProductDto } from "@/integrations/types/product.types";
import type { AdminProductListResponse } from "@/integrations/types/product_admin.types"; // varsayılan; yoksa uygun yere ekle

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

const AdminProductsIndexPage: NextPage = () => {
  const router = useRouter();
  const { locales, loading: localesLoading } = useLocaleOptions();

  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    locale: "",
    isActiveFilter: "all",
  });

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      q: filters.search || undefined,
      locale: filters.locale || undefined,
      limit: 50,
      offset: 0,
    };

    if (filters.isActiveFilter === "active") {
      params.is_active = 1;
    } else if (filters.isActiveFilter === "inactive") {
      params.is_active = 0;
    }

    return params;
  }, [filters]);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListProductsAdminQuery(queryParams);

  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting;

  // data tipi: AdminProductListResponse | undefined
  const list: AdminProductListResponse | undefined = data as
    | AdminProductListResponse
    | undefined;

  const items: ProductDto[] = list?.items ?? [];
  const total: number = list?.total ?? items.length;

  const handleDelete = async (p: ProductDto) => {
    try {
      await deleteProduct({ id: p.id }).unwrap();
      toast.success("Ürün başarıyla silindi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Ürün silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleCreateClick = () => {
    router.push("/admin/products/new");
  };

  return (
    <div className="container-fluid py-3">
      <ProductsHeader
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

      <ProductsList items={items} loading={busy} onDelete={handleDelete} />
    </div>
  );
};

export default AdminProductsIndexPage;
