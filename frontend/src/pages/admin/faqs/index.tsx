// =============================================================
// FILE: src/pages/admin/faqs/index.tsx
// Ensotek – Admin FAQ Sayfası (Liste + filtreler + create/edit modal)
// =============================================================

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useListFaqsAdminQuery,
  useCreateFaqAdminMutation,
  useUpdateFaqAdminMutation,
  useDeleteFaqAdminMutation,
} from "@/integrations/rtk/endpoints/admin/faqs_admin.endpoints";

import type {
  FaqDto,
  FaqListQueryParams,
} from "@/integrations/types/faqs.types";
import { FaqsHeader } from "@/components/admin/faqs/FaqsHeader";
import { FaqsList } from "@/components/admin/faqs/FaqsList";

type FormMode = "create" | "edit";

type FaqFormState = {
  id?: string;
  is_active: boolean;
  display_order: number;
  question: string;
  answer: string;
  slug: string;
  category: string;
};

const FaqsAdminPage: React.FC = () => {
  /* -------------------- Filtre state -------------------- */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  const [orderBy, setOrderBy] =
    useState<"created_at" | "updated_at" | "display_order">(
      "display_order",
    );
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");

  /* -------------------- Liste + filtreler -------------------- */

  const listParams: FaqListQueryParams = useMemo(
    () => ({
      q: search || undefined,
      category: category || undefined,
      // BoolLike ile uyumlu: boolean kullanıyoruz
      is_active: showOnlyActive ? true : undefined,
      sort: orderBy,
      orderDir,
      limit: 200,
      offset: 0,
    }),
    [search, category, showOnlyActive, orderBy, orderDir],
  );

  const {
    data: listData,
    isLoading,
    isFetching,
    refetch,
  } = useListFaqsAdminQuery(listParams);

  const [rows, setRows] = useState<FaqDto[]>([]);

  useEffect(() => {
    setRows(listData ?? []);
  }, [listData]);

  const total = rows.length;

  /* -------------------- Mutations ----------------------------- */

  const [createFaq, { isLoading: isCreating }] =
    useCreateFaqAdminMutation();
  const [updateFaq, { isLoading: isUpdating }] =
    useUpdateFaqAdminMutation();
  const [deleteFaq, { isLoading: isDeleting }] =
    useDeleteFaqAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isCreating || isUpdating || isDeleting;

  /* -------------------- Form / Modal state -------------------- */

  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formState, setFormState] = useState<FaqFormState | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  const openCreateModal = () => {
    setFormMode("create");
    setFormState({
      id: undefined,
      is_active: true,
      display_order: total + 1,
      question: "",
      answer: "",
      slug: "",
      category: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item: FaqDto) => {
    setFormMode("edit");
    setFormState({
      id: item.id,
      // Backend 0 | 1 döndürüyor
      is_active: item.is_active === 1,
      display_order: item.display_order ?? 0,
      question: item.question ?? "",
      answer: item.answer ?? "",
      slug: item.slug ?? "",
      category: item.category ?? "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (busy) return;
    setShowModal(false);
    setFormState(null);
  };

  const handleFormChange = (
    field: keyof FaqFormState,
    value: string | boolean | number,
  ) => {
    setFormState((prev) =>
      prev ? { ...prev, [field]: value } : prev,
    );
  };

  const handleSaveForm = async () => {
    if (!formState) return;

    const payloadBase = {
      question: formState.question.trim(),
      answer: formState.answer.trim(),
      slug: formState.slug.trim(),
      category: formState.category.trim() || undefined,
      is_active: formState.is_active,
      display_order: formState.display_order ?? 0,
    };

    if (!payloadBase.question || !payloadBase.answer || !payloadBase.slug) {
      toast.error("Soru, cevap ve slug alanları zorunludur.");
      return;
    }

    try {
      if (formMode === "create") {
        await createFaq({
          ...payloadBase,
        }).unwrap();
        toast.success("FAQ kaydı oluşturuldu.");
      } else if (formMode === "edit" && formState.id) {
        await updateFaq({
          id: formState.id,
          patch: {
            ...payloadBase,
          },
        }).unwrap();
        toast.success("FAQ kaydı güncellendi.");
      }

      closeModal();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "FAQ kaydedilirken bir hata oluştu.";
      if (msg === "slug_already_exists") {
        toast.error("Bu slug ile zaten bir kayıt var.");
      } else {
        toast.error(msg);
      }
    }
  };

  /* -------------------- Delete / Toggle ----------------------- */

  const handleDelete = async (item: FaqDto) => {
    if (
      !window.confirm(
        `"${item.question || item.slug || item.id}" FAQ kaydını silmek üzeresin. Devam etmek istiyor musun?`,
      )
    ) {
      return;
    }

    try {
      await deleteFaq(item.id).unwrap();
      toast.success(`"${item.question || item.slug || item.id}" silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "FAQ silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (item: FaqDto, value: boolean) => {
    try {
      await updateFaq({
        id: item.id,
        patch: { is_active: value },
      }).unwrap();

      setRows((prev) =>
        prev.map((r) =>
          r.id === item.id
            ? {
                ...r,
                is_active: value ? 1 : 0,
              }
            : r,
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

  /* -------------------- Render -------------------- */

  return (
    <div className="container-fluid py-4">
      <FaqsHeader
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
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
          <FaqsList
            items={rows}
            loading={busy}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
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
                      ? "Yeni Soru Oluştur"
                      : "Soru Düzenle"}
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
                      <div className="form-check form-switch small">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="faq-modal-active"
                          checked={formState.is_active}
                          onChange={(e) =>
                            handleFormChange(
                              "is_active",
                              e.target.checked,
                            )
                          }
                        />
                        <label
                          className="form-check-label ms-1"
                          htmlFor="faq-modal-active"
                        >
                          Aktif
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small">
                        Soru (question)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.question}
                        onChange={(e) =>
                          handleFormChange(
                            "question",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">
                        Cevap (answer)
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={6}
                        value={formState.answer}
                        onChange={(e) =>
                          handleFormChange(
                            "answer",
                            e.target.value,
                          )
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
                        Kategori (opsiyonel)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formState.category}
                        onChange={(e) =>
                          handleFormChange(
                            "category",
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

export default FaqsAdminPage;
