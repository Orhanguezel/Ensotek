// =============================================================
// FILE: src/components/admin/offer/OfferFormJsonSection.tsx
// Teklif Formu – JSON mod alanı (AdminJsonEditor sarmalayıcı)
// =============================================================

"use client";

import React from "react";
import { AdminJsonEditor } from "@/components/common/AdminJsonEditor";

export type OfferFormJsonSectionProps = {
  jsonModel: any;
  disabled: boolean;
  onChangeJson: (json: any) => void;
  onErrorChange: (err: string | null) => void;
};

export const OfferFormJsonSection: React.FC<OfferFormJsonSectionProps> = ({
  jsonModel,
  disabled,
  onChangeJson,
  onErrorChange,
}) => {
  return (
    <AdminJsonEditor
      label="Offer JSON (create/update payload)"
      value={jsonModel}
      onChange={onChangeJson}
      onErrorChange={onErrorChange}
      disabled={disabled}
      height={420}
      helperText={
        <>
          Bu JSON, teklif create / update API payload’ı ile bire bir uyumludur.
          Düzenleyebileceğin başlıca alanlar:
          <ul className="mt-2 mb-0 small">
            <li>customer_name, company_name, email, phone</li>
            <li>locale, country_code</li>
            <li>subject, message</li>
            <li>product_id</li>
            <li>status, currency, net_total, vat_total, gross_total</li>
            <li>valid_until, admin_notes</li>
            <li>pdf_url, pdf_asset_id, email_sent_at</li>
            <li>form_data (dinamik teknik form JSON’u)</li>
          </ul>
        </>
      }
    />
  );
};
