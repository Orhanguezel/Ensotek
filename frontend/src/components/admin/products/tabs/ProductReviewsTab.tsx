// =============================================================
// FILE: src/components/admin/products/tabs/ProductReviewsTab.tsx
// =============================================================

"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import {
  useListProductReviewsAdminQuery,
  useCreateProductReviewAdminMutation,
  useToggleProductReviewActiveAdminMutation,
  useDeleteProductReviewAdminMutation,
} from "@/integrations/rtk/hooks";
import type {
  AdminProductReviewDto,
  AdminProductReviewCreatePayload,
} from "@/integrations/types/product_reviews_admin.types";

export type ProductReviewsTabProps = {
  productId?: string;
  disabled?: boolean;
};

export const ProductReviewsTab: React.FC<ProductReviewsTabProps> = ({
  productId,
  disabled,
}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListProductReviewsAdminQuery(
    { productId: productId as string, order: "desc" },
    { skip: !productId },
  );

  const [createReview, { isLoading: isCreating }] =
    useCreateProductReviewAdminMutation();
  const [toggleActive, { isLoading: isToggling }] =
    useToggleProductReviewActiveAdminMutation();
  const [deleteReview, { isLoading: isDeleting }] =
    useDeleteProductReviewAdminMutation();

  const [newReview, setNewReview] =
    useState<AdminProductReviewCreatePayload>({
      rating: 5,
      comment: "",
      customer_name: "",
      is_active: true,
      review_date: "",
    });

  const busy = isLoading || isFetching;

  if (!productId) {
    return (
      <div className="alert alert-info small mb-0">
        Ürün henüz oluşturulmadı. Yorumlar sekmesi, ürün kaydedildikten
        sonra aktif olur.
      </div>
    );
  }

  const reviews = (data ?? []) as AdminProductReviewDto[];

  const handleNewChange =
    (field: keyof AdminProductReviewCreatePayload) =>
      (
        e:
          | React.ChangeEvent<HTMLInputElement>
          | React.ChangeEvent<HTMLTextAreaElement>,
      ) => {
        const v = e.target.value;
        setNewReview((prev) => ({
          ...prev,
          [field]: field === "rating" ? Number(v) : (v as any),
        }));
      };

  const handleNewActiveChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = e.target.checked;
    setNewReview((prev) => ({
      ...prev,
      is_active: checked,
    }));
  };

  const handleCreate = async () => {
    if (!productId) return;
    if (!newReview.rating || newReview.rating < 0 || newReview.rating > 5) {
      toast.error("Rating 0-5 arasında olmalı.");
      return;
    }

    try {
      await createReview({
        productId,
        payload: {
          ...newReview,
          rating: Number(newReview.rating),
        },
      }).unwrap();
      toast.success("Yeni yorum eklendi.");
      setNewReview({
        rating: 5,
        comment: "",
        customer_name: "",
        is_active: true,
        review_date: "",
      });
      void refetch();
    } catch (err: any) {
      console.error("createProductReviewAdmin error:", err);
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Yorum eklenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (review: AdminProductReviewDto) => {
    if (!productId) return;
    try {
      await toggleActive({
        productId,
        reviewId: review.id,
        is_active: !review.is_active,
      }).unwrap();
      toast.success("Yorum durumu güncellendi.");
      void refetch();
    } catch (err: any) {
      console.error("toggleProductReviewActiveAdmin error:", err);
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Yorum durumu güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleDelete = async (review: AdminProductReviewDto) => {
    if (!productId) return;
    if (
      !window.confirm(
        "Bu yorumu silmek istediğine emin misin? Bu işlem geri alınamaz.",
      )
    ) {
      return;
    }
    try {
      await deleteReview({
        productId,
        reviewId: review.id,
      }).unwrap();
      toast.success("Yorum silindi.");
      void refetch();
    } catch (err: any) {
      console.error("deleteProductReviewAdmin error:", err);
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Yorum silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  return (
    <div>
      {/* Yeni yorum formu */}
      <div className="border rounded-2 p-3 mb-3 bg-light">
        <h6 className="mb-2 small fw-semibold">Yeni Yorum Ekle</h6>
        <div className="row g-2 align-items-center mb-2">
          <div className="col-sm-2">
            <label className="form-label small mb-1">Rating (0-5)</label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.5}
              className="form-control form-control-sm"
              value={newReview.rating}
              onChange={handleNewChange("rating")}
              disabled={disabled || isCreating}
            />
          </div>
          <div className="col-sm-4">
            <label className="form-label small mb-1">
              Müşteri Adı
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={newReview.customer_name ?? ""}
              onChange={handleNewChange("customer_name")}
              disabled={disabled || isCreating}
            />
          </div>
          <div className="col-sm-3">
            <label className="form-label small mb-1">
              Tarih (opsiyonel)
            </label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={newReview.review_date ?? ""}
              onChange={handleNewChange("review_date")}
              disabled={disabled || isCreating}
            />
          </div>
          <div className="col-sm-3 d-flex align-items-end">
            <div className="form-check me-3">
              <input
                id="new_review_active"
                type="checkbox"
                className="form-check-input"
                checked={!!newReview.is_active}
                onChange={handleNewActiveChange}
                disabled={disabled || isCreating}
              />
              <label
                className="form-check-label small"
                htmlFor="new_review_active"
              >
                Aktif
              </label>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm ms-auto"
              onClick={handleCreate}
              disabled={disabled || isCreating}
            >
              {isCreating ? "Ekleniyor..." : "Yorum Ekle"}
            </button>
          </div>
        </div>
        <div>
          <label className="form-label small mb-1">Yorum</label>
          <textarea
            className="form-control form-control-sm"
            rows={2}
            value={newReview.comment ?? ""}
            onChange={handleNewChange("comment")}
            disabled={disabled || isCreating}
          />
        </div>
      </div>

      {/* Mevcut yorumlar */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0 small fw-semibold">
          Mevcut Yorumlar ({reviews.length})
        </h6>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => refetch()}
          disabled={busy || isToggling || isDeleting}
        >
          Yenile
        </button>
      </div>

      {busy && !reviews.length ? (
        <div className="text-muted small">Yükleniyor...</div>
      ) : null}

      {!busy && reviews.length === 0 ? (
        <div className="text-muted small">
          Bu ürün için henüz yorum yok.
        </div>
      ) : null}

      {reviews.length > 0 && (
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr className="small">
                <th style={{ width: 60 }}>Rating</th>
                <th>Müşteri</th>
                <th>Yorum</th>
                <th style={{ width: 120 }}>Tarih</th>
                <th style={{ width: 80 }}>Durum</th>
                <th style={{ width: 120 }}></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="small">
                  <td>
                    <span className="badge bg-primary-subtle text-primary border">
                      {r.rating?.toFixed
                        ? r.rating.toFixed(1)
                        : r.rating}
                    </span>
                  </td>
                  <td>
                    <div className="fw-semibold">
                      {r.customer_name || "-"}
                    </div>
                    <div className="text-muted">
                      {r.user_id || (
                        <span className="fst-italic">anonim</span>
                      )}
                    </div>
                  </td>
                  <td style={{ maxWidth: 320 }}>
                    <div className="text-truncate" title={r.comment || ""}>
                      {r.comment || (
                        <span className="text-muted">-</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="text-muted">
                      {r.review_date
                        ? r.review_date.substring(0, 10)
                        : "-"}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge border ${r.is_active
                          ? "bg-success-subtle text-success"
                          : "bg-secondary-subtle text-secondary"
                        }`}
                    >
                      {r.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm me-1"
                      onClick={() => handleToggleActive(r)}
                      disabled={disabled || isToggling}
                    >
                      {r.is_active ? "Pasifleştir" : "Aktifleştir"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(r)}
                      disabled={disabled || isDeleting}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
