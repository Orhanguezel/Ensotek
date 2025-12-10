// =============================================================
// FILE: src/components/admin/faqs/FaqsForm.tsx
// Ensotek – FAQ Form Fields (LEFT COLUMN ONLY)
// RTK FaqCreate/Update payloadları ile uyumlu
// =============================================================

"use client";

import React from "react";
import type { LocaleOption } from "@/components/admin/faqs/FaqsHeader";

export type FaqsFormValues = {
  locale: string;

  is_active: boolean;
  display_order: number;

  question: string;
  answer: string;
  slug: string;

  category_id: string;
  sub_category_id: string;
};

export type FaqsFormProps = {
  mode: "create" | "edit";
  values: FaqsFormValues;

  onChange: <K extends keyof FaqsFormValues>(
    field: K,
    value: FaqsFormValues[K],
  ) => void;

  onLocaleChange?: (locale: string) => void;

  saving: boolean;
  localeOptions: LocaleOption[];
  localesLoading?: boolean;
};

export const FaqsForm: React.FC<FaqsFormProps> = ({
  values,
  onChange,
  onLocaleChange,
  saving,
  localeOptions,
  localesLoading,
}) => {
  return (
    <div className="row g-2">
      {/* Locale */}
      <div className="col-md-4">
        <label className="form-label small">
          Dil{" "}
          {localesLoading && (
            <span className="spinner-border spinner-border-sm ms-1" />
          )}
        </label>
        <select
          className="form-select form-select-sm"
          disabled={saving}
          value={values.locale}
          onChange={(e) => {
            const locale = e.target.value;
            onChange("locale", locale);
            onLocaleChange?.(locale);
          }}
        >
          {localeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* display_order */}
      <div className="col-md-4">
        <label className="form-label small">Sıralama</label>
        <input
          type="number"
          className="form-control form-control-sm"
          disabled={saving}
          value={values.display_order}
          onChange={(e) =>
            onChange("display_order", Number(e.target.value) || 0)
          }
        />
      </div>

      {/* aktif flag */}
      <div className="col-md-4 d-flex align-items-end">
        <div className="form-check form-switch small">
          <input
            type="checkbox"
            className="form-check-input"
            disabled={saving}
            checked={values.is_active}
            onChange={(e) => onChange("is_active", e.target.checked)}
          />
          <label className="form-check-label">Aktif</label>
        </div>
      </div>

      {/* question */}
      <div className="col-12">
        <label className="form-label small">Soru (question)</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.question}
          onChange={(e) => onChange("question", e.target.value)}
        />
      </div>

      {/* answer */}
      <div className="col-12">
        <label className="form-label small">Cevap (answer)</label>
        <textarea
          className="form-control form-control-sm"
          rows={5}
          disabled={saving}
          value={values.answer}
          onChange={(e) => onChange("answer", e.target.value)}
        />
      </div>

      {/* slug */}
      <div className="col-md-6">
        <label className="form-label small">Slug</label>
        <input
          className="form-control form-control-sm"
          disabled={saving}
          value={values.slug}
          onChange={(e) => onChange("slug", e.target.value)}
        />
      </div>
    </div>
  );
};
