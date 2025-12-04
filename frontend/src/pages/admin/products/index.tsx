// =============================================================
// FILE: src/pages/admin/products/index.tsx
// Ensotek – Admin Products Liste Sayfası (Kuleler)
// =============================================================

import React, { useEffect, useMemo, useState } from "react";
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
import type { AdminProductListResponse } from "@/integrations/types/product_admin.types";

// ⚙️ Yedek parça root kategorileri (TR + EN)
const SPAREPART_CATEGORY_IDS = new Set<string>([
  "aaaa1001-1111-4111-8111-aaaaaaaa1001", // TR sparepart root
  "caaa1001-1111-4111-8111-cccccccc1001", // EN sparepart root
]);

const AdminProductsIndexPage: NextPage = () => {
  const router = useRouter();

  // 🔹 Locale’leri site_settings üzerinden merkezi çekiyoruz
  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const locales: LocaleOption[] = useMemo(() => {
    if (!appLocaleRows || !appLocaleRows.length) {
      return [
        { value: "tr", label: "Türkçe (tr)" },
        { value: "en", label: "İngilizce (en)" },
      ];
    }

    const row = appLocaleRows.find((r) => r.key === "app_locales");
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
  }, [appLocaleRows]);

  // 🔹 Başlangıç locale'i: router.locale varsa onu kullan, yoksa boş (Hepsi)
  const initialLocale =
    typeof router.locale === "string" ? router.locale.toLowerCase() : "";

  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    locale: initialLocale,
    isActiveFilter: "all",
  });

  // Kullanıcı ne seçtiyse direkt onu göndereceğiz.
  // Eğer "" ise backend'e locale paramı YOLLAMAYACAĞIZ (Hepsi).
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

  const { data, isLoading, isFetching, refetch } =
    useListProductsAdminQuery(queryParams);

  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting;

  const list: AdminProductListResponse | undefined =
    data as AdminProductListResponse | undefined;

  // 🔹 API'den gelen ürünler (kule, sparepart hariç)
  const baseItems: ProductDto[] = useMemo(() => {
    const items = (list?.items ?? []) as ProductDto[];

    return items.filter((p) => {
      const catId = p.category_id;
      if (!catId) return true;
      return !SPAREPART_CATEGORY_IDS.has(catId);
    });
  }, [list]);

  // 🔹 Drag & drop için local sıralama state'i
  const [orderedItems, setOrderedItems] = useState<ProductDto[]>([]);

  // API'den gelen liste değişince local sıralamayı güncelle
  useEffect(() => {
    setOrderedItems(baseItems);
  }, [baseItems]);

  const total = orderedItems.length;

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

  // 🔹 Sıralamayı kaydet – şimdilik sadece log + info (backend endpoint yok)
  const handleSaveOrder = async () => {
    if (!orderedItems.length) return;

    console.log(
      "Yeni sıralama:",
      orderedItems.map((p, index) => ({ index: index + 1, id: p.id })),
    );

    toast.info(
      "Sıralama ekranda güncellendi.",
    );
  };

  const isSavingOrder = false; // şimdilik sabit; endpoint gelince RTK mutation ile bağlanır

  return (
    <div className="container-fluid py-3">
      <ProductsHeader
        filters={filters}
        total={total}
        loading={busy}
        locales={locales}
        localesLoading={isLocalesLoading}
        defaultLocale={initialLocale || (router.locale as string)}
        onFiltersChange={setFilters}
        onRefresh={refetch}
        onCreateClick={handleCreateClick}
      />

      <ProductsList
        items={orderedItems}
        loading={busy}
        onDelete={handleDelete}
        onReorder={setOrderedItems}   // ⬅ drag-drop burada aktif
        onSaveOrder={handleSaveOrder} // ⬅ buton da çalışır (şimdilik sadece log + toast)
        savingOrder={isSavingOrder}
      />
    </div>
  );
};

export default AdminProductsIndexPage;
