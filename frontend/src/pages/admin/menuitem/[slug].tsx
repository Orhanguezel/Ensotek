// =============================================================
// FILE: src/pages/admin/menuitem/[slug].tsx
// Ensotek – Admin Menu Item Detail (Create / Edit, Form + JSON)
// ReferencesFormPage pattern'i + AdminJsonEditor
// =============================================================

"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  FormEvent,
} from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  MenuItemForm,
  type MenuItemFormValues,
} from "@/components/admin/menuitem/MenuItemForm";

import {
  useGetMenuItemAdminQuery,
  useCreateMenuItemAdminMutation,
  useUpdateMenuItemAdminMutation,
  useDeleteMenuItemAdminMutation,
} from "@/integrations/rtk/endpoints/admin/menu_items_admin.endpoints";

import type {
  AdminMenuItemDto,
  AdminMenuItemCreatePayload,
  AdminMenuItemUpdatePayload,
} from "@/integrations/types/menu_items.types";

import { useListSiteSettingsAdminQuery } from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

type EditMode = "form" | "json";

type MenuItemFormState = MenuItemFormValues & {
  id?: string;
};

/* JSON model builder */
const buildJsonModelFromForm = (s: MenuItemFormState) => ({
  id: s.id,
  title: s.title,
  url: s.url,
  type: s.type,
  page_id: s.page_id,
  parent_id: s.parent_id,
  location: s.location,
  icon: s.icon,
  section_id: s.section_id,
  is_active: s.is_active,
  display_order: s.display_order,
  locale: s.locale,
});

/* Map DTO -> form state */
const mapDtoToFormState = (
  item: AdminMenuItemDto,
  localeFallback: string,
): MenuItemFormState => ({
  id: item.id,
  title: item.title ?? "",
  url: item.url ?? "",
  type: item.type ?? "custom",
  page_id: item.page_id ?? null,
  parent_id: item.parent_id ?? null,
  location: item.location ?? "header",
  icon: item.icon ?? "",
  section_id: item.section_id ?? null,
  is_active: item.is_active ?? true,
  display_order: item.display_order ?? 0,
  locale: item.locale ?? localeFallback,
});

const AdminMenuItemDetailPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const id =
    typeof slug === "string"
      ? slug
      : Array.isArray(slug)
        ? slug[0]
        : "";

  const isNew = !id || id === "new";
  const mode: "create" | "edit" = isNew ? "create" : "edit";

  // URL'den locale paramı (örn: ?locale=en)
  const localeFromQuery =
    typeof router.query.locale === "string"
      ? router.query.locale.trim().toLowerCase()
      : "";

  // app_locales – dinamik locale options
  const {
    data: localeRows,
    isLoading: localesLoading,
  } = useListSiteSettingsAdminQuery({ keys: ["app_locales"] });

  const localeCodes = useMemo(() => {
    if (!localeRows?.length) return ["tr", "en"];
    const row = localeRows.find((r: any) => r.key === "app_locales");
    const v = row?.value;

    let arr: string[] = [];

    if (Array.isArray(v)) {
      arr = v
        .filter((x): x is string => typeof x === "string")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    } else if (typeof v === "string") {
      try {
        const parsed: unknown = JSON.parse(v);
        if (Array.isArray(parsed)) {
          arr = parsed
            .filter((x): x is string => typeof x === "string")
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);
        }
      } catch {
        // ignore
      }
    }

    return arr.length ? arr : ["tr", "en"];
  }, [localeRows]);

  const localeOptions = useMemo(
    () =>
      localeCodes.map((c) => ({
        value: c,
        label:
          c === "tr"
            ? "Türkçe (tr)"
            : c === "en"
              ? "English (en)"
              : c === "de"
                ? "Deutsch (de)"
                : c.toUpperCase(),
      })),
    [localeCodes],
  );

  const defaultLocale =
    localeFromQuery || localeOptions[0]?.value || "tr";

  // GET /admin/menu_items/:id?locale=xx
  const { data, isLoading: isLoadingItem } = useGetMenuItemAdminQuery(
    { id, locale: localeFromQuery || undefined },
    {
      skip: isNew || !id,
    },
  );

  const [createMenuItem, { isLoading: isCreating }] =
    useCreateMenuItemAdminMutation();
  const [updateMenuItem, { isLoading: isUpdating }] =
    useUpdateMenuItemAdminMutation();
  const [deleteMenuItem, { isLoading: isDeleting }] =
    useDeleteMenuItemAdminMutation();

  const [formState, setFormState] =
    useState<MenuItemFormState | null>(null);
  const [editMode, setEditMode] = useState<EditMode>("form");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const saving = isCreating || isUpdating;
  const loading = (!isNew && isLoadingItem) || localesLoading;

  /* -------------------- INITIAL FORM SETUP -------------------- */

  useEffect(() => {
    // Edit mode: DTO geldiyse formState'i doldur
    if (mode === "edit") {
      if (data && !formState && !localesLoading) {
        const item = data as AdminMenuItemDto;
        setFormState(mapDtoToFormState(item, defaultLocale));
      }
      return;
    }

    // Create mode: localeOptions hazırsa default state
    if (!formState && !localesLoading && localeOptions.length > 0) {
      setFormState({
        id: undefined,
        title: "",
        url: "",
        type: "custom",
        page_id: null,
        parent_id: null,
        location: "header",
        icon: "",
        section_id: null,
        is_active: true,
        display_order: 0,
        locale: defaultLocale,
      });
    }
  }, [
    mode,
    data,
    formState,
    localesLoading,
    localeOptions,
    defaultLocale,
  ]);

  /* -------------------- JSON → FORM APPLY -------------------- */

  const applyJsonToForm = (json: any) => {
    setFormState((prev) => {
      if (!prev) return prev;
      const next: MenuItemFormState = { ...prev };

      if (typeof json.title === "string") next.title = json.title;
      if (typeof json.url === "string") next.url = json.url;

      if (json.type === "custom" || json.type === "page") {
        next.type = json.type;
      }

      if ("page_id" in json) {
        next.page_id =
          json.page_id === null || json.page_id === ""
            ? null
            : String(json.page_id);
      }

      if ("parent_id" in json) {
        next.parent_id =
          json.parent_id === null || json.parent_id === ""
            ? null
            : String(json.parent_id);
      }

      if ("section_id" in json) {
        next.section_id =
          json.section_id === null || json.section_id === ""
            ? null
            : String(json.section_id);
      }

      if (json.location === "header" || json.location === "footer") {
        next.location = json.location;
      }

      if (typeof json.icon === "string") next.icon = json.icon;

      if (typeof json.is_active === "boolean") {
        next.is_active = json.is_active;
      }

      if (
        typeof json.display_order === "number" &&
        Number.isFinite(json.display_order)
      ) {
        next.display_order = json.display_order;
      }

      if (typeof json.locale === "string") {
        next.locale = json.locale.trim().toLowerCase();
      }

      // json.id'yi özellikle görmezden geliyoruz; route'daki id kullanılıyor

      return next;
    });
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    if (editMode === "json" && jsonError) {
      toast.error("JSON geçerli değil. Hataları düzeltmeden kaydedemezsin.");
      return;
    }

    const s = formState;

    const payloadBase = {
      title: s.title.trim(),
      url: s.type === "custom" ? s.url || "" : s.url || null,
      type: s.type,
      page_id: s.type === "page" ? s.page_id ?? null : null,
      parent_id: s.parent_id ?? null,
      location: s.location,
      icon: s.icon ? s.icon.trim() : null,
      section_id: s.section_id ?? null,
      is_active: s.is_active,
      display_order: s.display_order ?? 0,
      locale: s.locale || undefined,
    };

    try {
      if (isNew) {
        const payload: AdminMenuItemCreatePayload =
          payloadBase as AdminMenuItemCreatePayload;

        const created = await createMenuItem(payload).unwrap();
        toast.success("Menü öğesi oluşturuldu.");

        const nextLocale = s.locale || localeFromQuery || "";
        const localeParam = nextLocale
          ? `?locale=${encodeURIComponent(nextLocale)}`
          : "";

        router.replace(`/admin/menuitem/${created.id}${localeParam}`);
      } else {
        const payload: AdminMenuItemUpdatePayload =
          payloadBase as AdminMenuItemUpdatePayload;

        await updateMenuItem({ id, data: payload }).unwrap();
        toast.success("Menü öğesi güncellendi.");
      }
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "İşlem sırasında bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- DELETE / CANCEL -------------------- */

  const handleDelete = async () => {
    if (isNew || !id) return;
    const ok = window.confirm(
      "Bu menü öğesini silmek istediğinize emin misiniz?",
    );
    if (!ok) return;

    try {
      await deleteMenuItem({ id }).unwrap();
      toast.success("Menü öğesi silindi.");
      router.push("/admin/menuitem");
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Silme işlemi sırasında bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    router.push("/admin/menuitem");
  };

  /* -------------------- LOADING STATE -------------------- */

  if (!formState || localesLoading) {
    return (
      <div className="container-fluid py-4 text-muted small">
        <div className="spinner-border spinner-border-sm me-2" />
        Menü formu hazırlanıyor...
      </div>
    );
  }

  const jsonModel = buildJsonModelFromForm(formState);

  /* -------------------- RENDER -------------------- */

  return (
    <div className="container-fluid py-4">
      <div className="card">
        {/* Header: Form / JSON toggle + Geri */}
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">
              {mode === "create"
                ? "Yeni Menü Öğesi"
                : "Menü Öğesini Düzenle"}
            </h5>
            <small className="text-muted">
              Form modunda temel alanları, JSON modunda ise tüm payload’ı
              (id, parent_id, section_id vb.) yönetebilirsin.
            </small>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={
                  "btn btn-outline-primary " +
                  (editMode === "form" ? "active" : "")
                }
                disabled={saving || loading}
                onClick={() => setEditMode("form")}
              >
                Form
              </button>
              <button
                type="button"
                className={
                  "btn btn-outline-primary " +
                  (editMode === "json" ? "active" : "")
                }
                disabled={saving || loading}
                onClick={() => setEditMode("json")}
              >
                JSON
              </button>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={saving}
              onClick={handleCancel}
            >
              ← Geri
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            {editMode === "form" ? (
              <MenuItemForm
                mode={mode}
                values={formState}
                saving={saving}
                loading={loading}
                localeOptions={localeOptions}
                localesLoading={localesLoading}
                onChange={(field, value) =>
                  setFormState((prev) =>
                    prev ? { ...prev, [field]: value } : prev,
                  )
                }
              />
            ) : (
              <AdminJsonEditor
                label="Menu Item JSON"
                value={jsonModel}
                disabled={saving || loading}
                onChange={applyJsonToForm}
                onErrorChange={setJsonError}
                helperText={
                  <>
                    <div>
                      Burada tüm payload&apos;ı yönetebilirsin.{" "}
                      <code>page_id</code>, <code>parent_id</code>,{" "}
                      <code>section_id</code> gibi alanlar sadece burada
                      düzenlenir.
                    </div>
                    <div>
                      <strong>Not:</strong> <code>id</code> alanı sadece
                      gösterim amaçlıdır, route&apos;taki id kullanılır.
                    </div>
                  </>
                }
                height={260}
              />
            )}
          </div>

          <div className="card-footer d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              {mode === "create"
                ? "Yeni menü öğesi ekleyeceksiniz."
                : "Mevcut menü öğesini düzenliyorsunuz."}
            </div>
            <div className="d-flex gap-2">
              {mode === "edit" && !isNew && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Sil
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCancel}
                disabled={saving}
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={saving}
              >
                {saving
                  ? "Kaydediliyor..."
                  : mode === "create"
                    ? "Oluştur"
                    : "Kaydet"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMenuItemDetailPage;
