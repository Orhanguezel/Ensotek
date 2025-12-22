// =============================================================
// FILE: src/components/admin/products/tabs/ProductSpecsTab.tsx
// =============================================================

"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useListProductSpecsAdminQuery,
  useReplaceProductSpecsAdminMutation,
} from "@/integrations/rtk/hooks";
import type {
  AdminProductSpecDto,
  AdminProductSpecCreatePayload,
  AdminProductSpecListParams,
} from "@/integrations/types/product_specs_admin.types";

import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

export type ProductSpecsTabProps = {
  productId?: string;
  // Locale artık zorunlu; parent her zaman string gönderecek
  locale: string;
  disabled?: boolean;
};

type SpecsViewMode = "form" | "json";

export const ProductSpecsTab: React.FC<ProductSpecsTabProps> = ({
  productId,
  locale,
  disabled,
}) => {
  const [items, setItems] = useState<AdminProductSpecCreatePayload[]>([]);
  const [viewMode, setViewMode] = useState<SpecsViewMode>("form");

  // Seçili dil (boş string gelirse trim edip boş kabul ediyoruz)
  const effectiveLocale = (locale || "").trim();

  // -------- LIST QUERY ARG & SKIP --------
  const shouldSkipList =
    !productId || !effectiveLocale; // ürün yoksa veya dil seçili değilse istek atma

  const queryArgs: AdminProductSpecListParams | undefined = !shouldSkipList
    ? {
      productId,
      locale: effectiveLocale,
    }
    : undefined;

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useListProductSpecsAdminQuery(
    queryArgs as AdminProductSpecListParams,
    {
      skip: shouldSkipList,
    },
  );

  const [replaceSpecs, { isLoading: isSaving }] =
    useReplaceProductSpecsAdminMutation();

  useEffect(() => {
    if (!data) return;

    const mapped: AdminProductSpecCreatePayload[] = (
      data as AdminProductSpecDto[]
    ).map((s) => ({
      id: s.id,
      name: s.name,
      value: s.value,
      category: s.category,
      order_num: s.order_num,
    }));

    setItems(mapped);
  }, [data]);

  const busy = isLoading || isFetching || isSaving;

  const handleSave = async () => {
    if (!productId) return;

    if (!effectiveLocale) {
      toast.error("Lütfen önce ürün formundan bir dil (locale) seç.");
      return;
    }

    try {
      const normalized: AdminProductSpecCreatePayload[] = (items ?? []).map(
        (raw) => ({
          id: raw.id,
          name: String(raw.name ?? "").trim(),
          value: String(raw.value ?? "").trim(),
          category: (raw.category as any) ?? "custom",
          order_num:
            typeof raw.order_num === "number"
              ? raw.order_num
              : parseInt(String(raw.order_num ?? "0"), 10) || 0,
        }),
      );

      await replaceSpecs({
        productId,
        locale: effectiveLocale, // mutation arg tipine birebir uyumlu
        payload: {
          items: normalized,
        },
      }).unwrap();

      toast.success("Teknik özellikler kaydedildi.");
      void refetch();
    } catch (err: any) {
      console.error("replaceProductSpecsAdmin error:", err);
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Teknik özellikler kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleItemChange =
    (index: number, field: keyof AdminProductSpecCreatePayload) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setItems((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                ...item,
                [field]:
                  field === "order_num"
                    ? parseInt(value, 10) || 0
                    : (value as any),
              }
              : item,
          ),
        );
      };

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        name: "",
        value: "",
        category: "custom",
        order_num: prev.length,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleJsonChange = (next: any) => {
    if (!Array.isArray(next)) {
      toast.error("Specs JSON formatı geçersiz. Array bekleniyor.");
      return;
    }
    setItems(next as AdminProductSpecCreatePayload[]);
  };

  if (!productId) {
    return (
      <div className="alert alert-info small mb-0">
        Ürün henüz oluşturulmadı. Teknik özellikler sekmesi, ürün
        kaydedildikten sonra aktif olur.
      </div>
    );
  }

  if (!effectiveLocale) {
    return (
      <div className="alert alert-info small mb-0">
        Teknik özellikleri görmek için önce Genel sekmeden bir dil
        (locale) seçmelisin.
      </div>
    );
  }

  return (
    <div>
      {/* Başlık + actions */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h6 className="mb-0 small fw-semibold">
            Teknik Özellikler (product_specs)
          </h6>
          <div className="text-muted small">
            Aktif locale: <code>{effectiveLocale}</code>. Aynı veriyi
            ister form, ister JSON olarak düzenleyebilirsin.
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* View mode toggle */}
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn btn-outline-secondary ${viewMode === "form" ? "active" : ""
                }`}
              onClick={() => setViewMode("form")}
              disabled={busy || disabled}
            >
              Form
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary ${viewMode === "json" ? "active" : ""
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
            {isSaving ? "Kaydediliyor..." : "Specs Kaydet"}
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
              + Satır Ekle
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-muted small">
              Henüz teknik özellik yok. Yukarıdan{" "}
              <strong>“Satır Ekle”</strong> butonu ile yeni satırlar
              ekleyebilirsin.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr className="small">
                    <th style={{ width: "20%" }}>Alan (name)</th>
                    <th>Değer (value)</th>
                    <th style={{ width: "20%" }}>Kategori</th>
                    <th style={{ width: "10%" }}>Sıra</th>
                    <th style={{ width: "6rem" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((spec, index) => (
                    <tr key={spec.id ?? index} className="small">
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={spec.name ?? ""}
                          onChange={handleItemChange(index, "name")}
                          disabled={disabled}
                          placeholder="capacity, fanType..."
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={spec.value ?? ""}
                          onChange={handleItemChange(index, "value")}
                          disabled={disabled}
                          placeholder="1.500 m³/h – 4.500 m³/h..."
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={spec.category ?? "custom"}
                          onChange={handleItemChange(index, "category")}
                          disabled={disabled}
                          placeholder="physical, performance..."
                        />
                      </td>
                      <td style={{ maxWidth: 80 }}>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={spec.order_num ?? 0}
                          onChange={handleItemChange(index, "order_num")}
                          disabled={disabled}
                        />
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
              Specs JSON{" "}
              <span className="text-muted">
                (AdminProductSpecCreatePayload[])
              </span>
            </>
          }
          value={items}
          onChange={handleJsonChange}
          disabled={busy || disabled}
          helperText={
            <>
              Aktif locale: <code>{effectiveLocale}</code>. JSON formatı
              örneği:
            </>
          }
          height={260}
        />
      )}
    </div>
  );
};
