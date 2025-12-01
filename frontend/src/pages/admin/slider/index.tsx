// =============================================================
// FILE: src/pages/admin/slider/index.tsx
// Ensotek – Admin Slider Sayfası
// (Liste + filtreler + drag & drop reorder + create/edit modal)
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useListSlidersAdminQuery,
  useCreateSliderAdminMutation,
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

/* ------------------------------------------------------------- */
/*  Form state tipi                                               */
/* ------------------------------------------------------------- */

type SliderFormState = {
  id?: string;
  locale: string;

  name: string;
  slug: string;
  description: string;

  image_url: string;
  alt: string;
  buttonText: string;
  buttonLink: string;

  featured: boolean;
  is_active: boolean;
  display_order: number;
};

type FormMode = "create" | "edit";

/* ------------------------------------------------------------- */
/*  Sayfa bileşeni                                               */
/* ------------------------------------------------------------- */

const SliderAdminPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [localeFilter, setLocaleFilter] = useState<string>("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  /* -------------------- Liste + filtreler -------------------- */

  const {
    data: sliders,
    isLoading,
    isFetching,
    refetch,
  } = useListSlidersAdminQuery(
    {
      q: search || undefined,
      locale: localeFilter || undefined,
      is_active: showOnlyActive ? true : undefined,
      sort: "display_order",
      order: "asc",
      offset: 0,
    },
  );

  const [rows, setRows] = useState<SliderAdminDto[]>([]);

  useEffect(() => {
    setRows(sliders || []);
  }, [sliders]);

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

  /* -------------------- Mutations ----------------------------- */

  const [createSlider, { isLoading: isCreating }] =
    useCreateSliderAdminMutation();
  const [updateSlider, { isLoading: isUpdating }] =
    useUpdateSliderAdminMutation();
  const [deleteSlider, { isLoading: isDeleting }] =
    useDeleteSliderAdminMutation();
  const [reorderSliders, { isLoading: isReordering }] =
    useReorderSlidersAdminMutation();
  const [setStatus] = useSetSliderStatusAdminMutation();

  const loading = isLoading || isFetching;
  const busy =
    loading || isCreating || isUpdating || isDeleting || isReordering;

  /* -------------------- Form / Modal state -------------------- */

  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formState, setFormState] = useState<SliderFormState | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openCreateModal = () => {
    const defaultLocale = localeFilter || (localeOptions[0]?.value ?? "tr");

    setFormMode("create");
    setFormState({
      id: undefined,
      locale: defaultLocale,
      name: "",
      slug: "",
      description: "",
      image_url: "",
      alt: "",
      buttonText: "",
      buttonLink: "",
      featured: false,
      is_active: true,
      display_order: rows.length + 1,
    });
    setShowModal(true);
  };

  const openEditModal = (item: SliderAdminDto) => {
    setFormMode("edit");
    setFormState({
      id: item.id,
      locale: item.locale || "tr",
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
      image_url: item.image_url ?? "",
      alt: item.alt ?? "",
      buttonText: item.buttonText ?? "",
      buttonLink: item.buttonLink ?? "",
      featured: !!item.featured,
      is_active: !!item.is_active,
      display_order: item.display_order ?? 0,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (busy) return;
    setShowModal(false);
    setFormState(null);
  };

  const handleFormChange = (
    field: keyof SliderFormState,
    value: string | boolean | number,
  ) => {
    setFormState((prev) =>
      prev ? { ...prev, [field]: value } : prev,
    );
  };

  const handleSaveForm = async () => {
    if (!formState) return;

    const payloadBase = {
      locale: formState.locale || "tr",
      name: formState.name.trim(),
      slug: formState.slug.trim() || undefined, // boşsa backend name'den üretir
      description: formState.description.trim() || undefined,
      image_url: formState.image_url.trim() || undefined,
      alt: formState.alt.trim() || undefined,
      buttonText: formState.buttonText.trim() || undefined,
      buttonLink: formState.buttonLink.trim() || undefined,
      featured: formState.featured,
      is_active: formState.is_active,
      display_order: formState.display_order ?? 0,
    };

    try {
      if (!payloadBase.name) {
        toast.error("Başlık (name) alanı zorunludur.");
        return;
      }

      if (formMode === "create") {
        await createSlider(payloadBase).unwrap();
        toast.success("Slider kaydı oluşturuldu.");
      } else if (formMode === "edit" && formState.id) {
        await updateSlider({
          id: formState.id,
          patch: payloadBase,
        }).unwrap();
        toast.success("Slider kaydı güncellendi.");
      }

      closeModal();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Slider kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
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
      // backend int id istiyor => Number'a çevir
      const ids = rows
        .map((r) => Number(r.id))
        .filter((n) => Number.isFinite(n) && n > 0);

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
        locale={localeFilter}
        onLocaleChange={setLocaleFilter}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
        loading={busy}
        onRefresh={refetch}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        onCreateClick={openCreateModal}
      />

      <div className="row">
        <div className="col-12">
          <SliderList
            items={rows}
            loading={busy}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onToggleFeatured={handleToggleFeatured}
            onReorder={handleReorderLocal}
            onSaveOrder={handleSaveOrder}
            savingOrder={isReordering}
          />
        </div>
      </div>

      {/* --------------------- Create/Edit Modal --------------------- */}
      {showModal && formState && (
        <>
          {/* Backdrop */}
          <div className="modal-backdrop fade show" />

          {/* Modal */}
          <div
            className="modal d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h5 className="modal-title small mb-0">
                    {formMode === "create"
                      ? "Yeni Slider Oluştur"
                      : "Slider Düzenle"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Kapat"
                    onClick={closeModal}
                    disabled={busy}
                  />
                </div>

                <div className="modal-body">
                  <div className="row g-2">
                    <div className="col-md-3">
                      <label className="form-label small">Dil</label>
                      <select
                        className="form-select form-select-sm"
                        value={formState.locale}
                        onChange={(e) =>
                          handleFormChange("locale", e.target.value)
                        }
                      >
                        {localeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">
                        Sıralama (display_order)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formState.display_order}
                        onChange={(e) =>
                          handleFormChange(
                            "display_order",
                            Number(e.target.value) || 0,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-6 d-flex align-items-end">
                      <div className="d-flex flex-wrap gap-3 small">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="slider-modal-active"
                            checked={formState.is_active}
                            onChange={(e) =>
                              handleFormChange(
                                "is_active",
                                e.target.checked,
                              )
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="slider-modal-active"
                          >
                            Aktif
                          </label>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="slider-modal-featured"
                            checked={formState.featured}
                            onChange={(e) =>
                              handleFormChange(
                                "featured",
                                e.target.checked,
                              )
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="slider-modal-featured"
                          >
                            Öne çıkan (priority)
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Başlık (name)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">
                        Slug (opsiyonel)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.slug}
                        onChange={(e) =>
                          handleFormChange("slug", e.target.value)
                        }
                      />
                      <div className="form-text small">
                        Boş bırakırsan backend başlıktan slug üretecek.
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small">
                        Açıklama (opsiyonel)
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={3}
                        value={formState.description}
                        onChange={(e) =>
                          handleFormChange(
                            "description",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label small">
                        Görsel URL (image_url)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.image_url}
                        onChange={(e) =>
                          handleFormChange("image_url", e.target.value)
                        }
                      />
                      <div className="form-text small">
                        Storage modülü ile image_asset_id
                        bağlayacağın UI&apos;yi daha sonra ekleyebilirsin.
                        Şimdilik direkt URL ile çalışır.
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small">
                        Alt metin (alt)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.alt}
                        onChange={(e) =>
                          handleFormChange("alt", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small">
                        Buton Metni (buttonText)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.buttonText}
                        onChange={(e) =>
                          handleFormChange(
                            "buttonText",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label small">
                        Buton Linki (buttonLink)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.buttonLink}
                        onChange={(e) =>
                          handleFormChange(
                            "buttonLink",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={closeModal}
                    disabled={busy}
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveForm}
                    disabled={busy}
                  >
                    {busy
                      ? "Kaydediliyor..."
                      : formMode === "create"
                        ? "Oluştur"
                        : "Kaydet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SliderAdminPage;
