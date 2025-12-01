// =============================================================
// FILE: src/components/admin/reviews/ReviewsForm.tsx
// Ensotek – Admin Review Create/Edit Form
// =============================================================

import React, { useEffect, useState } from "react";
import type { AdminReviewDto } from "@/integrations/types/review_admin.types";
import type { LocaleOption } from "./ReviewsHeader";

export type ReviewFormValues = {
  locale: string;
  name: string;
  email: string;
  rating: string; // input olarak string; submit'te number'a çevrilecek
  comment: string;
  is_active: boolean;
  is_approved: boolean;
  display_order: string;
};

export type ReviewsFormProps = {
  mode: "create" | "edit";
  initialData?: AdminReviewDto;
  loading: boolean;
  saving: boolean;
  locales: LocaleOption[];
  localesLoading?: boolean;
  defaultLocale?: string;
  onSubmit: (values: ReviewFormValues) => void | Promise<void>;
  onCancel?: () => void;
};

const buildInitialValues = (
  initial: AdminReviewDto | undefined,
  fallbackLocale: string | undefined,
): ReviewFormValues => {
  if (!initial) {
    return {
      locale: fallbackLocale ?? "",
      name: "",
      email: "",
      rating: "5",
      comment: "",
      is_active: true,
      is_approved: false,
      display_order: "0",
    };
  }

  return {
    locale: initial.locale_resolved ?? fallbackLocale ?? "",
    name: initial.name ?? "",
    email: initial.email ?? "",
    rating: String(initial.rating ?? 5),
    comment: initial.comment ?? "",
    is_active: initial.is_active ?? true,
    is_approved: initial.is_approved ?? false,
    display_order: String(initial.display_order ?? 0),
  };
};

export const ReviewsForm: React.FC<ReviewsFormProps> = ({
  mode,
  initialData,
  loading,
  saving,
  locales,
  localesLoading,
  defaultLocale,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<ReviewFormValues>(
    buildInitialValues(initialData, defaultLocale),
  );

  useEffect(() => {
    setValues(buildInitialValues(initialData, defaultLocale));
  }, [initialData, defaultLocale]);

  const disabled = loading || saving;
  const effectiveDefaultLocale = defaultLocale ?? "tr";

  const handleChange =
    (field: keyof ReviewFormValues) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      const val = e.target.value;
      setValues((prev) => ({ ...prev, [field]: val }));
    };

  const handleCheckboxChange =
    (field: keyof ReviewFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setValues((prev) => ({ ...prev, [field]: checked as never }));
    };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, locale: val }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    void onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header py-2 d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 small fw-semibold">
              {mode === "create" ? "Yeni Yorum Oluştur" : "Yorum Düzenle"}
            </h5>
            <div className="text-muted small">
              Müşteri yorumlarını, puan ve onay durumlarını buradan
              yönetebilirsin.
            </div>
          </div>

          <div className="d-flex gap-2">
            {onCancel && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onCancel}
                disabled={disabled}
              >
                Geri
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={disabled}
            >
              {saving
                ? mode === "create"
                  ? "Oluşturuluyor..."
                  : "Kaydediliyor..."
                : mode === "create"
                  ? "Yorumu Oluştur"
                  : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row g-4">
            {/* Sol kolon – temel bilgiler */}
            <div className="col-lg-8">
              {/* Locale + durumlar */}
              <div className="row g-2 mb-3">
                <div className="col-sm-4">
                  <label className="form-label small mb-1">
                    Locale (Dil)
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={values.locale}
                    onChange={handleLocaleChange}
                    disabled={disabled || (localesLoading && !locales.length)}
                  >
                    <option value="">
                      (Site varsayılanı
                      {effectiveDefaultLocale
                        ? `: ${effectiveDefaultLocale}`
                        : ""}
                      )
                    </option>
                    {locales.map((loc) => (
                      <option key={loc.value} value={loc.value}>
                        {loc.label}
                      </option>
                    ))}
                  </select>
                  <div className="form-text small">
                    Yorum metni bu locale için saklanır. Boş bırakırsan
                    backend varsayılan locale kullanır.
                  </div>
                </div>
                <div className="col-sm-8 d-flex align-items-end">
                  <div className="form-check me-3">
                    <input
                      id="is_active"
                      type="checkbox"
                      className="form-check-input"
                      checked={values.is_active}
                      onChange={handleCheckboxChange("is_active")}
                      disabled={disabled}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="is_active"
                    >
                      Aktif olsun
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      id="is_approved"
                      type="checkbox"
                      className="form-check-input"
                      checked={values.is_approved}
                      onChange={handleCheckboxChange("is_approved")}
                      disabled={disabled}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="is_approved"
                    >
                      Onaylı (sitede göster)
                    </label>
                  </div>
                </div>
              </div>

              {/* İsim, e-posta */}
              <div className="row g-2 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small mb-1">İsim</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={values.name}
                    onChange={handleChange("name")}
                    disabled={disabled}
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small mb-1">E-posta</label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    value={values.email}
                    onChange={handleChange("email")}
                    disabled={disabled}
                    required
                  />
                </div>
              </div>

              {/* Yorum metni */}
              <div className="mb-0">
                <label className="form-label small mb-1">Yorum</label>
                <textarea
                  className="form-control form-control-sm"
                  rows={5}
                  value={values.comment}
                  onChange={handleChange("comment")}
                  disabled={disabled}
                  required
                />
              </div>
            </div>

            {/* Sağ kolon – puan + sıralama */}
            <div className="col-lg-4">
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Puan (1 - 5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="1"
                  className="form-control form-control-sm"
                  value={values.rating}
                  onChange={handleChange("rating")}
                  disabled={disabled}
                  required
                />
                <div className="form-text small">
                  Ortalama puan hesaplamaları için kullanılır.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small mb-1">
                  Görünüm Sırası
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="form-control form-control-sm"
                  value={values.display_order}
                  onChange={handleChange("display_order")}
                  disabled={disabled}
                />
                <div className="form-text small">
                  Küçük değerler listede daha üstte gösterilir.
                </div>
              </div>

              <div className="mb-0 small text-muted">
                Yorumlar public tarafta sadece <strong>onaylı</strong> ve{" "}
                <strong>aktif</strong> ise listelenir. Bu alanları
                değiştirerek anında görünürlüğü kontrol edebilirsin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
