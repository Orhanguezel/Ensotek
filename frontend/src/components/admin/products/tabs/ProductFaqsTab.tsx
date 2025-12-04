// =============================================================
// FILE: src/components/admin/products/tabs/ProductFaqsTab.tsx
// Admin – Product FAQs Tab (product_faqs tablosu)
// - Listeyi çeker
// - Form veya JSON modunda aynı veriyi düzenler
// - PUT /faqs (replaceProductFaqsAdmin) ile kaydeder
// =============================================================

"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useListProductFaqsAdminQuery,
  useReplaceProductFaqsAdminMutation,
} from "@/integrations/rtk/endpoints/admin/products_admin.faqs.endpoints";
import type {
  AdminProductFaqDto,
  AdminProductFaqCreatePayload,
} from "@/integrations/types/product_faqs_admin.types";

import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

export type ProductFaqsTabProps = {
  productId?: string;
  disabled?: boolean;
};

type FaqsViewMode = "form" | "json";

export const ProductFaqsTab: React.FC<ProductFaqsTabProps> = ({
  productId,
  disabled,
}) => {
  const [items, setItems] = useState<AdminProductFaqCreatePayload[]>([]);
  const [viewMode, setViewMode] = useState<FaqsViewMode>("form");

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListProductFaqsAdminQuery(
    { productId: productId as string },
    { skip: !productId },
  );

  const [replaceFaqs, { isLoading: isSaving }] =
    useReplaceProductFaqsAdminMutation();

  useEffect(() => {
    if (!data) return;
    const mapped: AdminProductFaqCreatePayload[] = (data as AdminProductFaqDto[]).map(
      (f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        display_order: f.display_order,
        is_active: f.is_active,
      }),
    );
    setItems(mapped);
  }, [data]);

  const busy = isLoading || isFetching || isSaving;

  const handleSave = async () => {
    if (!productId) return;

    try {
      const normalized: AdminProductFaqCreatePayload[] = (items ?? []).map(
        (raw) => ({
          id: raw.id,
          question: String(raw.question ?? "").trim(),
          answer: String(raw.answer ?? ""),
          display_order:
            typeof raw.display_order === "number"
              ? raw.display_order
              : parseInt(String(raw.display_order ?? "0"), 10) || 0,
          is_active:
            raw.is_active === false ||
            raw.is_active === "0" ||
            raw.is_active === 0
              ? false
              : true,
        }),
      );

      await replaceFaqs({
        productId,
        payload: { items: normalized },
      }).unwrap();
      toast.success("SSS (FAQ) kayıtları kaydedildi.");
      void refetch();
    } catch (err: any) {
      console.error("replaceProductFaqsAdmin error:", err);
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "FAQ kayıtları kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleItemChange =
    (index: number, field: keyof AdminProductFaqCreatePayload) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      const value = e.target.value;
      setItems((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                [field]:
                  field === "display_order"
                    ? (parseInt(value, 10) || 0)
                    : value,
              }
            : item,
        ),
      );
    };

  const handleActiveChange =
    (index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setItems((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                is_active: checked,
              }
            : item,
        ),
      );
    };

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        question: "",
        answer: "",
        display_order: prev.length,
        is_active: true,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleJsonChange = (next: any) => {
    if (!Array.isArray(next)) {
      toast.error("FAQs JSON formatı geçersiz. Array bekleniyor.");
      return;
    }
    setItems(next as AdminProductFaqCreatePayload[]);
  };

  if (!productId) {
    return (
      <div className="alert alert-info small mb-0">
        Ürün henüz oluşturulmadı. SSS sekmesi, ürün kaydedildikten sonra
        aktif olur.
      </div>
    );
  }

  return (
    <div>
      {/* Başlık + actions */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h6 className="mb-0 small fw-semibold">
            Sık Sorulan Sorular (product_faqs)
          </h6>
          <div className="text-muted small">
            Aynı veriyi ister form, ister JSON olarak düzenleyebilirsin.
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* View mode toggle */}
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn btn-outline-secondary ${
                viewMode === "form" ? "active" : ""
              }`}
              onClick={() => setViewMode("form")}
              disabled={busy || disabled}
            >
              Form
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary ${
                viewMode === "json" ? "active" : ""
              }`}
              onClick={() => setViewMode("json")}
              disabled={busy || disabled}
            >
              JSON
            </button>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => refetch()}
            disabled={busy}
          >
            Yenile
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={busy || disabled}
          >
            {isSaving ? "Kaydediliyor..." : "FAQs Kaydet"}
          </button>
        </div>
      </div>

      {/* FORM MODE */}
      {viewMode === "form" && (
        <div>
          <div className="d-flex justify-content-end mb-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={handleAddRow}
              disabled={disabled}
            >
              + Soru Ekle
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-muted small">
              Henüz soru yok. <strong>“Soru Ekle”</strong> ile listeye
              başlayabilirsin.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr className="small">
                    <th style={{ width: "35%" }}>Soru</th>
                    <th>Cevap</th>
                    <th style={{ width: "10%" }}>Sıra</th>
                    <th style={{ width: "10%" }}>Aktif</th>
                    <th style={{ width: "6rem" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((faq, index) => (
                    <tr key={faq.id ?? index} className="small">
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={faq.question ?? ""}
                          onChange={handleItemChange(index, "question")}
                          disabled={disabled}
                          placeholder="Teslim süresi nedir?"
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control form-control-sm"
                          rows={2}
                          value={faq.answer ?? ""}
                          onChange={handleItemChange(index, "answer")}
                          disabled={disabled}
                          placeholder="Proje detayına göre 4-6 hafta..."
                        />
                      </td>
                      <td style={{ maxWidth: 80 }}>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={faq.display_order ?? 0}
                          onChange={handleItemChange(
                            index,
                            "display_order",
                          )}
                          disabled={disabled}
                        />
                      </td>
                      <td className="text-center">
                        <div className="form-check d-inline-flex">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={!!faq.is_active}
                            onChange={handleActiveChange(index)}
                            disabled={disabled}
                          />
                        </div>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveRow(index)}
                          disabled={disabled}
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
      )}

      {/* JSON MODE */}
      {viewMode === "json" && (
        <AdminJsonEditor
          label={
            <>
              FAQs JSON{" "}
              <span className="text-muted">
                (AdminProductFaqCreatePayload[])
              </span>
            </>
          }
          value={items}
          onChange={handleJsonChange}
          disabled={busy || disabled}
          helperText={
            <>
              JSON formatı örneği:
              <pre className="mb-0 mt-1 small">
{`[
  {
    "question": "Teslim süresi nedir?",
    "answer": "Proje detayına göre 4-6 hafta.",
    "display_order": 0,
    "is_active": true
  }
]`}
              </pre>
            </>
          }
          height={260}
        />
      )}
    </div>
  );
};
