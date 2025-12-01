// =============================================================
// FILE: src/pages/admin/subcategories/index.tsx
// Ensotek – Admin Alt Kategoriler Sayfası
// (Liste + filtreler + drag & drop reorder + create/edit modal)
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useListSubCategoriesAdminQuery,
  useCreateSubCategoryAdminMutation,
  useUpdateSubCategoryAdminMutation,
  useDeleteSubCategoryAdminMutation,
  useReorderSubCategoriesAdminMutation,
  useToggleSubCategoryActiveAdminMutation,
  useToggleSubCategoryFeaturedAdminMutation,
} from "@/integrations/rtk/endpoints/admin/subcategories_admin.endpoints";

import { useListCategoriesAdminQuery } from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";
import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";

import type { SubCategoryDto } from "@/integrations/types/subcategory.types";
import type { CategoryDto } from "@/integrations/types/category.types";
import type {
  LocaleOption,
  CategoryOption,
} from "@/components/admin/subcategories/SubCategoriesHeader";
import { SubCategoriesHeader } from "@/components/admin/subcategories/SubCategoriesHeader";
import { SubCategoriesList } from "@/components/admin/subcategories/SubCategoriesList";

/* ------------------------------------------------------------- */
/*  Form state tipi                                               */
/* ------------------------------------------------------------- */

type SubCategoryFormState = {
  id?: string;
  category_id: string;
  locale: string;
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

const SubCategoriesAdminPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [localeFilter, setLocaleFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  // Alt kategoriler listesi + filtreler
  const {
    data: subCategories,
    isLoading,
    isFetching,
    refetch,
  } = useListSubCategoriesAdminQuery(
    {
      q: search || undefined,
      locale: localeFilter || undefined,
      category_id: categoryFilter || undefined,
      is_active: showOnlyActive ? true : undefined,
      is_featured: showOnlyFeatured ? true : undefined,
    },
  );

  // Lokal state (drag & drop için)
  const [rows, setRows] = useState<SubCategoryDto[]>([]);

  useEffect(() => {
    setRows(subCategories || []);
  }, [subCategories]);

  // Locale'ler (site_settings.app_locales üzerinden)
  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  // Kategori listesi (filter + form için)
  const {
    data: categoryRows,
    isLoading: isCategoriesLoading,
  } = useListCategoriesAdminQuery({
    q: undefined,
    locale: localeFilter || undefined,
    module_key: undefined,
    is_active: undefined,
    is_featured: undefined,
  });

  // Mutations
  const [createSubCategory, { isLoading: isCreating }] =
    useCreateSubCategoryAdminMutation();
  const [updateSubCategory, { isLoading: isUpdating }] =
    useUpdateSubCategoryAdminMutation();
  const [deleteSubCategory, { isLoading: isDeleting }] =
    useDeleteSubCategoryAdminMutation();
  const [reorderSubCategories, { isLoading: isReordering }] =
    useReorderSubCategoriesAdminMutation();
  const [toggleActive] = useToggleSubCategoryActiveAdminMutation();
  const [toggleFeatured] = useToggleSubCategoryFeaturedAdminMutation();

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

  /* -------------------- Category options + map --------------------- */

  const categoryOptions: CategoryOption[] = useMemo(() => {
    const base: CategoryOption[] = [
      { value: "", label: "Tüm Kategoriler" },
    ];

    if (!categoryRows || categoryRows.length === 0) return base;

    return [
      ...base,
      ...categoryRows.map((c) => ({
        value: c.id,
        label: `${c.name} (${c.locale || "tr"})`,
      })),
    ];
  }, [categoryRows]);

  const categoriesMap: Record<string, CategoryDto | undefined> =
    useMemo(() => {
      const map: Record<string, CategoryDto> = {};
      (categoryRows ?? []).forEach((c) => {
        map[c.id] = c;
      });
      return map;
    }, [categoryRows]);

  /* -------------------- Form / Modal state -------------------- */

  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formState, setFormState] =
    useState<SubCategoryFormState | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openCreateModal = () => {
    if (!categoryRows || categoryRows.length === 0) {
      toast.error(
        "Önce en az bir üst kategori (Kategori) oluşturman gerekiyor.",
      );
      return;
    }

    const defaultLocale = localeFilter || (localeOptions[0]?.value ?? "tr");
    const defaultCategory =
      categoryFilter || categoryRows[0]?.id || "";

    setFormMode("create");
    setFormState({
      id: undefined,
      category_id: defaultCategory,
      locale: defaultLocale,
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

  const openEditModal = (item: SubCategoryDto) => {
    setFormMode("edit");
    setFormState({
      id: item.id,
      category_id: item.category_id,
      locale: item.locale || "tr",
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
    field: keyof SubCategoryFormState,
    value: string | boolean | number,
  ) => {
    setFormState((prev) =>
      prev ? { ...prev, [field]: value } : prev,
    );
  };

  const handleSaveForm = async () => {
    if (!formState) return;

    if (!formState.category_id) {
      toast.error("Bir üst kategori seçmelisin.");
      return;
    }

    const payloadBase = {
      category_id: formState.category_id,
      locale: formState.locale || "tr",
      name: formState.name.trim(),
      slug: formState.slug.trim(),
      description: formState.description.trim() || undefined,
      icon: formState.icon.trim() || undefined,
      is_active: formState.is_active,
      is_featured: formState.is_featured,
      display_order: formState.display_order ?? 0,
    };

    if (!payloadBase.name || !payloadBase.slug) {
      toast.error("Ad ve slug alanları zorunludur.");
      return;
    }

    try {
      if (formMode === "create") {
        await createSubCategory(payloadBase).unwrap();
        toast.success("Alt kategori oluşturuldu.");
      } else if (formMode === "edit" && formState.id) {
        await updateSubCategory({
          id: formState.id,
          patch: payloadBase,
        }).unwrap();
        toast.success("Alt kategori güncellendi.");
      }

      closeModal();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Alt kategori kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Silme / Toggle / Reorder -------------------- */

  const handleDelete = async (item: SubCategoryDto) => {
    if (
      !window.confirm(
        `"${item.name}" alt kategorisini silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteSubCategory(item.id).unwrap();
      toast.success(`"${item.name}" alt kategorisi silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Alt kategori silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (
    item: SubCategoryDto,
    value: boolean,
  ) => {
    try {
      await toggleActive({ id: item.id, is_active: value }).unwrap();
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
    item: SubCategoryDto,
    value: boolean,
  ) => {
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

  const handleReorderLocal = (next: SubCategoryDto[]) => {
    setRows(next);
  };

  const handleSaveOrder = async () => {
    if (!rows.length) return;

    try {
      const items = rows.map((r, index) => ({
        id: r.id,
        display_order: index,
      }));

      await reorderSubCategories({ items }).unwrap();
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
      <SubCategoriesHeader
        search={search}
        onSearchChange={setSearch}
        locale={localeFilter}
        onLocaleChange={setLocaleFilter}
        categoryId={categoryFilter}
        onCategoryIdChange={setCategoryFilter}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
        showOnlyFeatured={showOnlyFeatured}
        onShowOnlyFeaturedChange={setShowOnlyFeatured}
        loading={busy}
        onRefresh={refetch}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
        categories={categoryOptions}
        categoriesLoading={isCategoriesLoading}
        onCreateClick={openCreateModal}
      />

      <div className="row">
        <div className="col-12">
          <SubCategoriesList
            items={rows}
            loading={busy}
            categoriesMap={categoriesMap}
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
                      ? "Yeni Alt Kategori Oluştur"
                      : "Alt Kategori Düzenle"}
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

                    <div className="col-md-8">
                      <label className="form-label small">
                        Üst Kategori (category_id)
                      </label>
                      <select
                        className="form-select form-select-sm"
                        value={formState.category_id}
                        onChange={(e) =>
                          handleFormChange("category_id", e.target.value)
                        }
                      >
                        {(categoryRows ?? []).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.locale || "tr"})
                          </option>
                        ))}
                      </select>
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
                            id="sub-modal-active"
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
                            htmlFor="sub-modal-active"
                          >
                            Aktif
                          </label>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="sub-modal-featured"
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
                            htmlFor="sub-modal-featured"
                          >
                            Öne çıkan
                          </label>
                        </div>
                      </div>
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

export default SubCategoriesAdminPage;
