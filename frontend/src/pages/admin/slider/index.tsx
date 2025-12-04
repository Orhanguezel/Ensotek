// =============================================================
// FILE: src/pages/admin/slider/index.tsx
// Ensotek – Admin Slider Sayfası
// (Liste + filtreler + drag & drop reorder)
//  - Yeni slider:  /admin/slider/new
//  - Düzenle:      /admin/slider/[id]
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  useListSlidersAdminQuery,
  useUpdateSliderAdminMutation,
  useDeleteSliderAdminMutation,
  useReorderSlidersAdminMutation,
  useSetSliderStatusAdminMutation,
} from "@/integrations/rtk/endpoints/admin/sliders_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import type { SliderAdminDto } from "@/integrations/types/slider.types";
import type { LocaleOption } from "@/components/admin/categories/CategoriesHeader";
import { SliderHeader } from "@/components/admin/slider/SliderHeader";
import { SliderList } from "@/components/admin/slider/SliderList";

const SliderAdminPage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [localeFilter, setLocaleFilter] = useState<string>(""); // ilk etapta boş, sonra locales'tan dolduracağız
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  /* -------------------- Locale options (DB'den) --------------- */

  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const localeCodes = useMemo(() => {
    if (!appLocaleRows || appLocaleRows.length === 0) {
      return ["tr", "en"];
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
      return ["tr", "en"];
    }

    return Array.from(new Set(arr));
  }, [appLocaleRows]);

  // Diğer modüllerle aynı: localeFilter boşsa ilk locale'e set et
  useEffect(() => {
    if (localeCodes.length === 0) return;

    // Henüz seçilmemişse → ilk locale
    if (!localeFilter) {
      setLocaleFilter(localeCodes[0]);
      return;
    }

    // Seçili locale listede yoksa → ilk locale
    if (!localeCodes.includes(localeFilter)) {
      setLocaleFilter(localeCodes[0]);
    }
  }, [localeCodes, localeFilter]);

  const localeOptions: LocaleOption[] = useMemo(
    () =>
      localeCodes.map((code) => {
        const lower = code.toLowerCase();
        let label = `${code.toUpperCase()} (${lower})`;

        if (lower === "tr") label = "Türkçe (tr)";
        else if (lower === "en") label = "İngilizce (en)";
        else if (lower === "de") label = "Almanca (de)";

        return { value: lower, label };
      }),
    [localeCodes],
  );

  // Query'ye gidecek gerçek locale (asla undefined değil)
  const queryLocale = localeFilter || (localeCodes[0] ?? "tr");

  /* -------------------- Liste + filtreler -------------------- */

  const {
    data: sliders,
    isLoading,
    isFetching,
    refetch,
  } = useListSlidersAdminQuery({
    q: search || undefined,
    locale: queryLocale, // ✅ HER ZAMAN BİR LOCALE GÖNDER
    is_active: showOnlyActive ? true : undefined,
    sort: "display_order",
    order: "asc",
    offset: 0,
  });

  const [rows, setRows] = useState<SliderAdminDto[]>([]);

  useEffect(() => {
    setRows(sliders || []);
  }, [sliders]);

  /* -------------------- Mutations ----------------------------- */

  const [updateSlider] = useUpdateSliderAdminMutation();
  const [deleteSlider, { isLoading: isDeleting }] =
    useDeleteSliderAdminMutation();
  const [reorderSliders, { isLoading: isReordering }] =
    useReorderSlidersAdminMutation();
  const [setStatus] = useSetSliderStatusAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting || isReordering;

  /* -------------------- Actions (create/edit nav) ------------- */

  const handleCreateClick = () => {
    router.push("/admin/slider/new");
  };

  const handleEdit = (item: SliderAdminDto) => {
    // İstersen locale'i de query param olarak gönderebilirsin:
    // router.push(`/admin/slider/${item.id}?locale=${item.locale}`);
    router.push(`/admin/slider/${item.id}`);
  };

  /* -------------------- Delete / Toggle / Reorder ------------- */

  const handleDelete = async (item: SliderAdminDto) => {
    if (
      !window.confirm(
        `"${item.name}" slider kaydını silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteSlider(item.id).unwrap();
      toast.success(`"${item.name}" slider kaydı silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Slider silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (
    item: SliderAdminDto,
    value: boolean,
  ) => {
    try {
      await setStatus({
        id: item.id,
        payload: { is_active: value },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_active: value } : r,
        ),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Aktif durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleFeatured = async (
    item: SliderAdminDto,
    value: boolean,
  ) => {
    try {
      await updateSlider({
        id: item.id,
        patch: { featured: value },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, featured: value } : r,
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

  const handleReorderLocal = (next: SliderAdminDto[]) => {
    setRows(next);
  };

  const handleSaveOrder = async () => {
    if (!rows.length) return;

    try {
      const ids = rows
        .map((r) => Number(r.id))
        .filter((n) => Number.isFinite(n) && n > 0);

      if (!ids.length) return;

      await reorderSliders({ ids }).unwrap();
      toast.success("Slider sıralaması kaydedildi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Sıralama kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <SliderHeader
        search={search}
        onSearchChange={setSearch}
        locale={queryLocale} // dropdown'da da aynı locale görünsün
        onLocaleChange={setLocaleFilter}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
        loading={busy}
        onRefresh={refetch}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        onCreateClick={handleCreateClick}
      />

      <div className="row">
        <div className="col-12">
          <SliderList
            items={rows}
            loading={busy}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onToggleFeatured={handleToggleFeatured}
            onReorder={handleReorderLocal}
            onSaveOrder={handleSaveOrder}
            savingOrder={isReordering}
          />
        </div>
      </div>
    </div>
  );
};

export default SliderAdminPage;
