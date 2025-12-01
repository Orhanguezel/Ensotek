// =============================================================
// FILE: src/pages/admin/categories/index.tsx
// Ensotek – Admin Kategoriler Sayfası
// (Liste + filtreler + drag & drop reorder + create/edit modal)
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useListCategoriesAdminQuery,
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
  useDeleteCategoryAdminMutation,
  useReorderCategoriesAdminMutation,
  useToggleCategoryActiveAdminMutation,
  useToggleCategoryFeaturedAdminMutation,
} from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import type { CategoryDto } from "@/integrations/types/category.types";
import type {
  LocaleOption,
  ModuleOption,
} from "@/components/admin/categories/CategoriesHeader";
import { CategoriesHeader } from "@/components/admin/categories/CategoriesHeader";
import { CategoriesList } from "@/components/admin/categories/CategoriesList";

/* ------------------------------------------------------------- */
/*  Form state tipi                                               */
/* ------------------------------------------------------------- */

type CategoryFormState = {
  id?: string;
  locale: string;
  module_key: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
};

type FormMode = "create" | "edit";

/* ------------------------------------------------------------- */
/*  Sayfa bileşeni                                               */
/* ------------------------------------------------------------- */

const CategoriesAdminPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [localeFilter, setLocaleFilter] = useState<string>("");
  const [moduleFilter, setModuleFilter] = useState<string>("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  // Liste + filtreler
  const {
    data: categories,
    isLoading,
    isFetching,
    refetch,
  } = useListCategoriesAdminQuery({
    q: search || undefined,
    locale: localeFilter || undefined,
    module_key: moduleFilter || undefined,
    is_active: showOnlyActive ? true : undefined,
    is_featured: showOnlyFeatured ? true : undefined,
  });

  // Sıralama için lokal state (drag & drop)
  const [rows, setRows] = useState<CategoryDto[]>([]);

  useEffect(() => {
    setRows(categories || []);
  }, [categories]);

  // app_locales kaydını (site_settings) üzerinden dilleri çek
  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  // Mutations
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryAdminMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryAdminMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryAdminMutation();
  const [reorderCategories, { isLoading: isReordering }] =
    useReorderCategoriesAdminMutation();
  const [toggleActive] = useToggleCategoryActiveAdminMutation();
  const [toggleFeatured] = useToggleCategoryFeaturedAdminMutation();

  const loading = isLoading || isFetching;
  const busy =
    loading || isCreating || isUpdating || isDeleting || isReordering;

  /* -------------------- Locale options (DB'den) -------------------- */

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

  /* -------------------- Module options (DB'den dinamik) -------------------- */

  const moduleCodes = useMemo(() => {
    const set = new Set<string>();

    // API'den gelen tüm kategorilerdeki module_key'leri topla
    (categories ?? []).forEach((c) => {
      if (c.module_key) {
        set.add(String(c.module_key));
      }
    });

    // Hiç kayıt yoksa fallback (boş sistemde bile en azından bunlar görünsün)
    if (!set.size) {
      [
        "general",
        "product",
        "services",
        "blog",
        "news",
        "library",
        "references",
      ].forEach((m) => set.add(m));
    }

    return Array.from(set);
  }, [categories]);

  const moduleOptions: ModuleOption[] = useMemo(
    () => [
      { value: "", label: "Tüm Modüller" },
      ...moduleCodes.map((code) => {
        const lower = code.toLowerCase();
        let label = code;

        if (lower === "general") label = "Genel";
        else if (lower === "product") label = "Ürünler";
        else if (lower === "services") label = "Hizmetler";
        else if (lower === "blog") label = "Blog";
        else if (lower === "news") label = "Haberler";
        else if (lower === "library") label = "Kütüphane";
        else if (lower === "references") label = "Referanslar";

        return { value: code, label };
      }),
    ],
    [moduleCodes],
  );

  /* -------------------- Form / Modal state -------------------- */

  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formState, setFormState] = useState<CategoryFormState | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openCreateModal = () => {
    const defaultLocale = localeFilter || (localeOptions[0]?.value ?? "tr");

    // Boş olmayan ilk module_key'i bul ("" = Tüm Modüller hariç)
    const firstModule =
      moduleOptions.find((m) => m.value)?.value || "general";
    const defaultModule = moduleFilter || firstModule;

    setFormMode("create");
    setFormState({
      id: undefined,
      locale: defaultLocale,
      module_key: defaultModule,
      name: "",
      slug: "",
      description: "",
      icon: "",
      is_active: true,
      is_featured: false,
      display_order: rows.length,
    });
    setShowModal(true);
  };

  const openEditModal = (item: CategoryDto) => {
    setFormMode("edit");
    setFormState({
      id: item.id,
      locale: item.locale || "tr",
      module_key: item.module_key || "general",
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      icon: item.icon || "",
      is_active: !!item.is_active,
      is_featured: !!item.is_featured,
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
    field: keyof CategoryFormState,
    value: string | boolean | number,
  ) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveForm = async () => {
    if (!formState) return;

    const payloadBase = {
      locale: formState.locale || "tr",
      module_key: formState.module_key || "general",
      name: formState.name.trim(),
      slug: formState.slug.trim(),
      description: formState.description.trim() || undefined,
      icon: formState.icon.trim() || undefined,
      is_active: formState.is_active,
      is_featured: formState.is_featured,
      display_order: formState.display_order ?? 0,
    };

    try {
      if (!payloadBase.name || !payloadBase.slug) {
        toast.error("Ad ve slug alanları zorunludur.");
        return;
      }

      if (formMode === "create") {
        await createCategory(payloadBase).unwrap();
        toast.success("Kategori oluşturuldu.");
      } else if (formMode === "edit" && formState.id) {
        await updateCategory({
          id: formState.id,
          patch: payloadBase,
        }).unwrap();
        toast.success("Kategori güncellendi.");
      }

      closeModal();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Kategori kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Silme / Toggle / Reorder -------------------- */

  const handleDelete = async (item: CategoryDto) => {
    if (
      !window.confirm(
        `"${item.name}" kategorisini silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteCategory(item.id).unwrap();
      toast.success(`"${item.name}" kategorisi silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Kategori silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (item: CategoryDto, value: boolean) => {
    try {
      await toggleActive({ id: item.id, is_active: value }).unwrap();
      // Lokal state'i de güncelle
      setRows((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, is_active: value } : r)),
      );
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Aktif durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleFeatured = async (item: CategoryDto, value: boolean) => {
    try {
      await toggleFeatured({
        id: item.id,
        is_featured: value,
      }).unwrap();
      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_featured: value } : r,
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

  const handleReorderLocal = (next: CategoryDto[]) => {
    setRows(next);
  };

  const handleSaveOrder = async () => {
    if (!rows.length) return;

    try {
      const items = rows.map((r, index) => ({
        id: r.id,
        display_order: index,
      }));

      await reorderCategories({ items }).unwrap();
      toast.success("Sıralama kaydedildi.");
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
      <CategoriesHeader
        search={search}
        onSearchChange={setSearch}
        locale={localeFilter}
        onLocaleChange={setLocaleFilter}
        moduleKey={moduleFilter}
        onModuleKeyChange={setModuleFilter}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
        showOnlyFeatured={showOnlyFeatured}
        onShowOnlyFeaturedChange={setShowOnlyFeatured}
        loading={busy}
        onRefresh={refetch}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        modules={moduleOptions}
        onCreateClick={openCreateModal}
      />

      <div className="row">
        <div className="col-12">
          <CategoriesList
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

      {/* --------------------- Sabit Create/Edit Modal --------------------- */}
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
                      ? "Yeni Kategori Oluştur"
                      : "Kategori Düzenle"}
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
                    <div className="col-md-4">
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

                    <div className="col-md-4">
                      <label className="form-label small">Modül</label>
                      <select
                        className="form-select form-select-sm"
                        value={formState.module_key}
                        onChange={(e) =>
                          handleFormChange("module_key", e.target.value)
                        }
                      >
                        {/* Boş value'lu "Tüm Modüller" modalda gösterilmesin */}
                        {moduleOptions
                          .filter((opt) => opt.value)
                          .map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="col-md-4">
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

                    <div className="col-md-6">
                      <label className="form-label small">Ad</label>
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
                      <label className="form-label small">Slug</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.slug}
                        onChange={(e) =>
                          handleFormChange("slug", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">
                        Icon (opsiyonel)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.icon}
                        onChange={(e) =>
                          handleFormChange("icon", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6 d-flex align-items-end">
                      <div className="d-flex flex-wrap gap-3 small">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="modal-active"
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
                            htmlFor="modal-active"
                          >
                            Aktif
                          </label>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="modal-featured"
                            checked={formState.is_featured}
                            onChange={(e) =>
                              handleFormChange(
                                "is_featured",
                                e.target.checked,
                              )
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="modal-featured"
                          >
                            Öne çıkan
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small">
                        Açıklama (opsiyonel)
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={4}
                        value={formState.description}
                        onChange={(e) =>
                          handleFormChange("description", e.target.value)
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

export default CategoriesAdminPage;
