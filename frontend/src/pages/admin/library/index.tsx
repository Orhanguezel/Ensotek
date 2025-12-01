// =============================================================
// FILE: src/pages/admin/library/index.tsx
// Ensotek – Admin Library Sayfası
// (Liste + filtreler + create/edit modal + media modal)
// =============================================================

"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import {
  useListLibraryAdminQuery,
  useCreateLibraryAdminMutation,
  useUpdateLibraryAdminMutation,
  useRemoveLibraryAdminMutation,
} from "@/integrations/rtk/endpoints/admin/library_admin.endpoints";

import type { LibraryDto } from "@/integrations/types/library.types";
import { LibraryHeader } from "@/components/admin/library/LibraryHeader";
import { LibraryList } from "@/components/admin/library/LibraryList";
import { LibraryMediaModal } from "@/components/admin/library/LibraryMediaModal";

/* ------------------------------------------------------------- */
/*  Form state tipi                                               */
/* ------------------------------------------------------------- */

type FormMode = "create" | "edit";

type LibraryFormState = {
  id?: string;

  // parent
  is_published: boolean;
  is_active: boolean;
  display_order: number;

  tags: string; // formda virgülle ayrılmış string

  category_id: string;
  sub_category_id: string;
  author: string;
  published_at: string;

  // i18n
  locale: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  meta_title: string;
  meta_description: string;

  // i18n davranış flag'leri
  replicate_all_locales: boolean; // create
  apply_all_locales: boolean; // update
};

/* ------------------------------------------------------------- */
/*  Sayfa bileşeni                                               */
/* ------------------------------------------------------------- */

const LibraryAdminPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // Liste + filtreler
  const {
    data: libraryItems,
    isLoading,
    isFetching,
    refetch,
  } = useListLibraryAdminQuery({
    q: search || undefined,
    is_published: showOnlyPublished ? true : undefined,
    is_active: showOnlyActive ? true : undefined,
  });

  const rows: LibraryDto[] = libraryItems || [];

  // Mutations
  const [createLibrary, { isLoading: isCreating }] =
    useCreateLibraryAdminMutation();
  const [updateLibrary, { isLoading: isUpdating }] =
    useUpdateLibraryAdminMutation();
  const [removeLibrary, { isLoading: isDeleting }] =
    useRemoveLibraryAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isCreating || isUpdating || isDeleting;

  /* -------------------- Form / Modal state -------------------- */

  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formState, setFormState] = useState<LibraryFormState | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Media modal state
  const [mediaLibrary, setMediaLibrary] = useState<LibraryDto | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const openCreateModal = () => {
    setFormMode("create");
    setFormState({
      id: undefined,
      is_published: false,
      is_active: true,
      display_order: rows.length,

      tags: "",
      category_id: "",
      sub_category_id: "",
      author: "",
      published_at: "",

      locale: "tr",
      title: "",
      slug: "",
      summary: "",
      content: "",
      meta_title: "",
      meta_description: "",

      replicate_all_locales: true,
      apply_all_locales: false,
    });
    setShowModal(true);
  };

  const openEditModal = (item: LibraryDto) => {
    // content: {"html": "..."} ise html'i çekmeye çalış
    const rawContent = (() => {
      if (!item.content) return "";
      try {
        const parsed = JSON.parse(item.content) as any;
        if (parsed && typeof parsed === "object" && typeof parsed.html === "string") {
          return parsed.html;
        }
      } catch {
        // ignore
      }
      return item.content ?? "";
    })();

    setFormMode("edit");
    setFormState({
      id: item.id,
      is_published: !!item.is_published,
      is_active: !!item.is_active,
      display_order: item.display_order ?? 0,

      tags: (item.tags ?? []).join(", "),
      category_id: item.category_id ?? "",
      sub_category_id: item.sub_category_id ?? "",
      author: item.author ?? "",
      published_at: item.published_at ?? "",

      locale: item.locale_resolved || "tr",
      title: item.title ?? "",
      slug: item.slug ?? "",
      summary: item.summary ?? "",
      content: rawContent,
      meta_title: item.meta_title ?? "",
      meta_description: item.meta_description ?? "",

      replicate_all_locales: true,
      apply_all_locales: false,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (busy) return;
    setShowModal(false);
    setFormState(null);
  };

  const handleFormChange = (
    field: keyof LibraryFormState,
    value: string | boolean | number,
  ) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  /* -------------------- Medya Modal handler'ları -------------- */

  const openMediaModal = (item: LibraryDto) => {
    setMediaLibrary(item);
    setShowMediaModal(true);
  };

  const closeMediaModal = () => {
    setShowMediaModal(false);
    setMediaLibrary(null);
  };

  /* -------------------- Kaydet (create / update) -------------- */

  const handleSaveForm = async () => {
    if (!formState) return;

    const title = formState.title.trim();
    const slug = formState.slug.trim();
    const content = formState.content.trim();

    // Basit validasyon – yeni kayıt için title/slug/content zorunlu
    if (!title || !slug || !content) {
      toast.error(
        "Başlık, slug ve içerik alanları zorunludur. Lütfen doldur.",
      );
      return;
    }

    const tagsArr =
      formState.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [];

    const basePayload = {
      is_published: formState.is_published,
      is_active: formState.is_active,
      display_order: formState.display_order ?? 0,
      tags: tagsArr.length ? tagsArr : undefined,
      category_id: formState.category_id || null,
      sub_category_id: formState.sub_category_id || null,
      author: formState.author || null,
      published_at: formState.published_at || null,
      locale: formState.locale || "tr",
      title,
      slug,
      summary: formState.summary.trim() || null,
      content,
      meta_title: formState.meta_title.trim() || null,
      meta_description: formState.meta_description.trim() || null,
    };

    try {
      if (formMode === "create") {
        const payload = {
          ...basePayload,
          replicate_all_locales: formState.replicate_all_locales,
        };
        await createLibrary(payload).unwrap();
        toast.success("İçerik oluşturuldu.");
      } else if (formMode === "edit" && formState.id) {
        const patch = {
          ...basePayload,
          apply_all_locales: formState.apply_all_locales,
        };
        await updateLibrary({
          id: formState.id,
          patch,
        }).unwrap();
        toast.success("İçerik güncellendi.");
      }

      closeModal();
      await refetch();
    } catch (err: any) {
      const code = err?.data?.error?.message;
      if (code === "slug_already_exists") {
        toast.error("Bu slug başka bir içerikte kullanılıyor.");
        return;
      }
      const msg =
        code ||
        err?.data?.error ||
        err?.message ||
        "İçerik kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Silme / Toggle işlemleri -------------- */

  const handleDelete = async (item: LibraryDto) => {
    if (
      !window.confirm(
        `"${item.title || item.slug || item.id}" kaydını silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await removeLibrary(item.id).unwrap();
      toast.success("Kayıt silindi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Kayıt silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleTogglePublished = async (item: LibraryDto, value: boolean) => {
    try {
      await updateLibrary({
        id: item.id,
        patch: { is_published: value },
      }).unwrap();
      // Arka planda refetch ile güncellenir
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Yayın durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (item: LibraryDto, value: boolean) => {
    try {
      await updateLibrary({
        id: item.id,
        patch: { is_active: value },
      }).unwrap();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Aktif durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <LibraryHeader
        search={search}
        onSearchChange={setSearch}
        showOnlyPublished={showOnlyPublished}
        onShowOnlyPublishedChange={setShowOnlyPublished}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
        loading={busy}
        onRefresh={refetch}
        onCreateClick={openCreateModal}
      />

      <div className="row">
        <div className="col-12">
          <LibraryList
            items={rows}
            loading={busy}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onTogglePublished={handleTogglePublished}
            onToggleActive={handleToggleActive}
            onManageMedia={openMediaModal}
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
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h5 className="modal-title small mb-0">
                    {formMode === "create"
                      ? "Yeni Library İçeriği Oluştur"
                      : "Library İçeriğini Düzenle"}
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
                    {/* Üst satır: dil + display_order + flags */}
                    <div className="col-md-3">
                      <label className="form-label small">Dil (locale)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.locale}
                        onChange={(e) =>
                          handleFormChange("locale", e.target.value)
                        }
                        placeholder="tr, en, de..."
                      />
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
                            id="modal-published"
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
                            htmlFor="modal-published"
                          >
                            Yayında (is_published)
                          </label>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="modal-active"
                            checked={formState.is_active}
                            onChange={(e) =>
                              handleFormChange("is_active", e.target.checked)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="modal-active"
                          >
                            Aktif (is_active)
                          </label>
                        </div>

                        {formMode === "create" ? (
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="modal-replicate-all"
                              checked={formState.replicate_all_locales}
                              onChange={(e) =>
                                handleFormChange(
                                  "replicate_all_locales",
                                  e.target.checked,
                                )
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="modal-replicate-all"
                            >
                              Yeni çeviriyi tüm dillere kopyala
                            </label>
                          </div>
                        ) : (
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="modal-apply-all"
                              checked={formState.apply_all_locales}
                              onChange={(e) =>
                                handleFormChange(
                                  "apply_all_locales",
                                  e.target.checked,
                                )
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="modal-apply-all"
                            >
                              Bu değişikliği tüm dillere uygula
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Kategori / alt kategori / author / published_at */}
                    <div className="col-md-3">
                      <label className="form-label small">
                        Kategori ID (category_id)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.category_id}
                        onChange={(e) =>
                          handleFormChange("category_id", e.target.value)
                        }
                        placeholder="Kategori UUID (opsiyonel)"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">
                        Alt Kategori ID (sub_category_id)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.sub_category_id}
                        onChange={(e) =>
                          handleFormChange("sub_category_id", e.target.value)
                        }
                        placeholder="Alt kategori UUID (opsiyonel)"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">Yazar (author)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.author}
                        onChange={(e) =>
                          handleFormChange("author", e.target.value)
                        }
                        placeholder="Yazar ismi (opsiyonel)"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">
                        Yayın Tarihi (published_at)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.published_at}
                        onChange={(e) =>
                          handleFormChange("published_at", e.target.value)
                        }
                        placeholder="2025-01-01T12:00:00 (opsiyonel)"
                      />
                    </div>

                    {/* Başlık / slug */}
                    <div className="col-md-6">
                      <label className="form-label small">Başlık (title)</label>
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
                      <label className="form-label small">Slug</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.slug}
                        onChange={(e) =>
                          handleFormChange("slug", e.target.value)
                        }
                        placeholder="kucuk-harf-rakam-tire"
                      />
                    </div>

                    {/* Tags */}
                    <div className="col-12">
                      <label className="form-label small">
                        Etiketler (tags) – virgülle ayır
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.tags}
                        onChange={(e) =>
                          handleFormChange("tags", e.target.value)
                        }
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>

                    {/* Özet */}
                    <div className="col-12">
                      <label className="form-label small">
                        Özet (summary – opsiyonel)
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={3}
                        value={formState.summary}
                        onChange={(e) =>
                          handleFormChange("summary", e.target.value)
                        }
                      />
                    </div>

                    {/* İçerik */}
                    <div className="col-12">
                      <label className="form-label small">
                        İçerik (content – HTML veya JSON)
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={8}
                        value={formState.content}
                        onChange={(e) =>
                          handleFormChange("content", e.target.value)
                        }
                        placeholder='HTML veya JSON formatında içerik girin (örneğin: {"{"} "html": "<p>...</p>" {"}"})'
                      />
                    </div>

                    {/* Meta başlık / açıklama */}
                    <div className="col-md-6">
                      <label className="form-label small">
                        Meta Title (opsiyonel)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.meta_title}
                        onChange={(e) =>
                          handleFormChange("meta_title", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">
                        Meta Description (opsiyonel)
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={3}
                        value={formState.meta_description}
                        onChange={(e) =>
                          handleFormChange("meta_description", e.target.value)
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

      {/* --------------------- Media Modal --------------------- */}
      <LibraryMediaModal
        open={showMediaModal}
        onClose={closeMediaModal}
        library={mediaLibrary}
      />
    </div>
  );
};

export default LibraryAdminPage;
