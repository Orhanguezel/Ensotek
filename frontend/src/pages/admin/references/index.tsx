// =============================================================
// FILE: src/pages/admin/references/index.tsx
// Ensotek – Admin References Sayfası
// (Liste + filtreler + create/edit modal)
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useListReferencesAdminQuery,
  useCreateReferenceAdminMutation,
  useUpdateReferenceAdminMutation,
  useDeleteReferenceAdminMutation,
} from "@/integrations/rtk/endpoints/admin/references_admin.endpoints";

import type { ReferenceDto, ReferenceListQueryParams, } from "@/integrations/types/references.types";
import { ReferencesHeader } from "@/components/admin/references/ReferencesHeader";
import { ReferencesList } from "@/components/admin/references/ReferencesList";

/* ------------------------------------------------------------- */
/*  Yardımcı: content JSON-string -> HTML                        */
/* ------------------------------------------------------------- */

const unpackContent = (content: string | null): string => {
  if (!content) return "";
  try {
    const parsed = JSON.parse(content) as any;
    if (parsed && typeof parsed === "object" && typeof parsed.html === "string") {
      return parsed.html;
    }
  } catch {
    // ignore
  }
  return content;
};

/* ------------------------------------------------------------- */
/*  Form state tipi                                               */
/* ------------------------------------------------------------- */

type ReferenceFormState = {
  id?: string;

  is_published: boolean;
  is_featured: boolean;
  display_order: number;

  featured_image: string;
  website_url: string;

  title: string;
  slug: string;
  summary: string;
  content: string;

  featured_image_alt: string;
  meta_title: string;
  meta_description: string;
};

type FormMode = "create" | "edit";

/* ------------------------------------------------------------- */
/*  Sayfa bileşeni                                               */
/* ------------------------------------------------------------- */

const ReferencesAdminPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  const [orderBy, setOrderBy] =
    useState<"created_at" | "updated_at" | "display_order">(
      "display_order",
    );
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");

 /* -------------------- Liste + filtreler -------------------- */

  const listParams = useMemo<ReferenceListQueryParams>(
    () => ({
      q: search || undefined,
      // 👇 BoolLike bekliyor → "1" string literal kullanalım
      is_published: showOnlyPublished ? "1" : undefined,
      is_featured: showOnlyFeatured ? "1" : undefined,
      sort: orderBy,
      orderDir,
      limit: 200,
      offset: 0,
    }),
    [search, showOnlyPublished, showOnlyFeatured, orderBy, orderDir],
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

  const total = listData?.total ?? rows.length;

  /* -------------------- Mutations ----------------------------- */

  const [createReference, { isLoading: isCreating }] =
    useCreateReferenceAdminMutation();
  const [updateReference, { isLoading: isUpdating }] =
    useUpdateReferenceAdminMutation();
  const [deleteReference, { isLoading: isDeleting }] =
    useDeleteReferenceAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isCreating || isUpdating || isDeleting;

  /* -------------------- Form / Modal state -------------------- */

  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formState, setFormState] = useState<ReferenceFormState | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  const openCreateModal = () => {
    setFormMode("create");
    setFormState({
      id: undefined,
      is_published: true,
      is_featured: false,
      display_order: total + 1,
      featured_image: "",
      website_url: "",
      title: "",
      slug: "",
      summary: "",
      content: "",
      featured_image_alt: "",
      meta_title: "",
      meta_description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item: ReferenceDto) => {
    setFormMode("edit");
    setFormState({
      id: item.id,
      is_published: item.is_published === 1,
      is_featured: item.is_featured === 1,
      display_order: item.display_order ?? 0,
      featured_image: item.featured_image ?? "",
      website_url: item.website_url ?? "",
      title: item.title ?? "",
      slug: item.slug ?? "",
      summary: item.summary ?? "",
      content: unpackContent(item.content as string | null),
      featured_image_alt: item.featured_image_alt ?? "",
      meta_title: item.meta_title ?? "",
      meta_description: item.meta_description ?? "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (busy) return;
    setShowModal(false);
    setFormState(null);
  };

  const handleFormChange = (
    field: keyof ReferenceFormState,
    value: string | boolean | number,
  ) => {
    setFormState((prev) =>
      prev ? { ...prev, [field]: value } : prev,
    );
  };

  const handleSaveForm = async () => {
    if (!formState) return;

    const payloadBase = {
      is_published: formState.is_published,
      is_featured: formState.is_featured,
      display_order: formState.display_order ?? 0,

      featured_image: formState.featured_image.trim() || undefined,
      website_url: formState.website_url.trim() || undefined,

      title: formState.title.trim() || undefined,
      slug: formState.slug.trim() || undefined,
      summary: formState.summary.trim() || undefined,
      content: formState.content.trim() || undefined,

      featured_image_alt:
        formState.featured_image_alt.trim() || undefined,
      meta_title: formState.meta_title.trim() || undefined,
      meta_description: formState.meta_description.trim() || undefined,
    };

    try {
      // i18n gönderiyorsak minimum zorunlu alanları kontrol et
      const wantsI18n =
        payloadBase.title || payloadBase.slug || payloadBase.content;

      if (wantsI18n) {
        if (!payloadBase.title || !payloadBase.slug || !payloadBase.content) {
          toast.error(
            "Başlık, slug ve içerik alanları birlikte doldurulmalıdır.",
          );
          return;
        }
      }

      if (formMode === "create") {
        await createReference({
          ...payloadBase,
          // create tarafında default: tüm dillere çoğalt
          replicate_all_locales: true,
        }).unwrap();
        toast.success("Referans kaydı oluşturuldu.");
      } else if (formMode === "edit" && formState.id) {
        await updateReference({
          id: formState.id,
          patch: {
            ...payloadBase,
            // update tarafında locale çoğaltma şimdilik false (tek dil)
            apply_all_locales: false,
          },
        }).unwrap();
        toast.success("Referans kaydı güncellendi.");
      }

      closeModal();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Referans kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Delete / Toggle ----------------------- */

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
        patch: { is_published: value },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id
            ? { ...r, is_published: value ? 1 : 0 }
            : r,
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
        patch: { is_featured: value },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id
            ? { ...r, is_featured: value ? 1 : 0 }
            : r,
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
        onCreateClick={openCreateModal}
      />

      <div className="row">
        <div className="col-12">
          <ReferencesList
            items={rows}
            loading={busy}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onTogglePublished={handleTogglePublished}
            onToggleFeatured={handleToggleFeatured}
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
                      ? "Yeni Referans Oluştur"
                      : "Referans Düzenle"}
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

                    <div className="col-md-9 d-flex align-items-end">
                      <div className="d-flex flex-wrap gap-3 small">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="ref-modal-published"
                            checked={formState.is_published}
                            onChange={(e) =>
                              handleFormChange(
                                "is_published",
                                e.target.checked,
                              )
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="ref-modal-published"
                          >
                            Yayında
                          </label>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="ref-modal-featured"
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
                            htmlFor="ref-modal-featured"
                          >
                            Öne çıkan
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">
                        Başlık (title)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.title}
                        onChange={(e) =>
                          handleFormChange("title", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">
                        Slug
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
                        Küçük harf, rakam ve tire kullanılmalıdır.
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">
                        Website URL (opsiyonel)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.website_url}
                        onChange={(e) =>
                          handleFormChange(
                            "website_url",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">
                        Öne çıkan görsel URL (featured_image)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.featured_image}
                        onChange={(e) =>
                          handleFormChange(
                            "featured_image",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">
                        Kısa özet (summary)
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={2}
                        value={formState.summary}
                        onChange={(e) =>
                          handleFormChange(
                            "summary",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">
                        İçerik (HTML veya zengin metin HTML&apos;i)
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={6}
                        value={formState.content}
                        onChange={(e) =>
                          handleFormChange(
                            "content",
                            e.target.value,
                          )
                        }
                      />
                      <div className="form-text small">
                        Backend bu alanı JSON içine paketleyerek
                        saklayacak. Şimdilik düz HTML yazabilirsin.
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small">
                        Görsel alt metni
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.featured_image_alt}
                        onChange={(e) =>
                          handleFormChange(
                            "featured_image_alt",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small">
                        Meta title
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.meta_title}
                        onChange={(e) =>
                          handleFormChange(
                            "meta_title",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small">
                        Meta description
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.meta_description}
                        onChange={(e) =>
                          handleFormChange(
                            "meta_description",
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

export default ReferencesAdminPage;
