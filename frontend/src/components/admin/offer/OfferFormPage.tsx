// =============================================================
// FILE: src/components/admin/offer/OfferFormPage.tsx
// Ensotek – Offer Admin Form Page (Create / Edit + JSON + PDF)
//   ✅ Public form_data alanlarını admin panelde okunur göster
//   ✅ form_data string/obj her türlü normalize et
//   ✅ PDF üretimi ve email gönderimi ayrı süreç
//   ✅ PDF URL normalize: host eklemez; absolute ise aynen kullanır,
//      relative ise /uploads/... formatına çeker (API EKLEMEZ, VARSA SÖKER)
//   ✅ Admin fiyatlandırma formu: net + vat_rate + shipping + (otomatik) vat_total + gross_total
// =============================================================

"use client";

import React, { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import type { OfferRow } from "@/integrations/types/offers.types";
import {
  useCreateOfferAdminMutation,
  useUpdateOfferAdminMutation,
  useGenerateOfferPdfAdminMutation,
  useSendOfferEmailAdminMutation,
} from "@/integrations/rtk/endpoints/admin/offers_admin.endpoints";

import { OfferForm, type OfferFormValues } from "./OfferForm";
import { OfferFormHeader, type OfferFormEditMode } from "./OfferFormHeader";
import { OfferFormJsonSection } from "./OfferFormJsonSection";
import { OfferPdfPreview } from "./OfferPdfPreview";

/* ------------------------------------------------------------- */

export type OfferFormPageProps = {
  mode: "create" | "edit";
  initialData?: OfferRow | null;
  loading?: boolean;
  onDone?: () => void;
};

type OfferFormState = OfferFormValues & { id?: string };

/* -------------------------------------------------------------
 * HELPERS – Backend → FE normalizasyon
 * ------------------------------------------------------------- */

const toIsoStringOrNull = (value: unknown): string | null => {
  if (!value) return null;
  try {
    const d =
      value instanceof Date
        ? value
        : typeof value === "string"
          ? new Date(value)
          : null;

    if (!d || Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
};

const toBoolFromTinyInt = (v: unknown): boolean => {
  if (v === true) return true;
  if (v === false) return false;
  if (v === 1 || v === "1" || v === "true") return true;
  return false;
};

const toStrFromNumberOrNull = (v: unknown): string => {
  if (v === null || typeof v === "undefined") return "";
  return String(v);
};

const safeParseJsonObject = (input: unknown): Record<string, any> => {
  if (!input) return {};
  if (typeof input === "object") return input as Record<string, any>;
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return parsed && typeof parsed === "object"
        ? (parsed as Record<string, any>)
        : {};
    } catch {
      return {};
    }
  }
  return {};
};

/**
 * pdf_url normalize (HOST EKLEMEZ):
 * - absolute URL ise aynen kullan
 * - relative path ise:
 *    "/api/uploads/..." -> "/uploads/..."
 *    "api/uploads/..."  -> "/uploads/..."
 *    "/uploads/..."     -> aynen
 *    "uploads/..."      -> "/uploads/..."
 * - "/api/api/..." gibi saçmalıkları da temizler
 */
const normalizeUploadsPathNoApi = (pathLike: string): string => {
  const s = (pathLike || "").trim();
  if (!s) return "/uploads";

  // query/hash varsa ayır (koruyacağız)
  const [pathOnly, suffix = ""] = s.split(/(?=[?#])/);

  // origin kaçarsa temizle (defansif)
  const cleaned = pathOnly.replace(/^https?:\/\/[^/]+/i, "");

  // slash garanti
  let p = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;

  // /api/api/... düzelt
  while (p.startsWith("/api/api/")) p = p.replace("/api/api/", "/api/");

  // "/api/uploads/..." -> "/uploads/..."
  if (p === "/api/uploads") return `/uploads${suffix}`;
  if (p.startsWith("/api/uploads/")) return `${p.replace(/^\/api/, "")}${suffix}`;

  // "/uploads/..." -> aynen
  if (p === "/uploads" || p.startsWith("/uploads/")) return `${p}${suffix}`;

  // path içinde "/uploads/" geçiyorsa oradan itibaren al
  const idx = p.indexOf("/uploads/");
  if (idx >= 0) return `${p.substring(idx)}${suffix}`;

  // son çare
  return `/uploads${p}${suffix}`;
};

const resolvePdfUrl = (pdfUrl: string | null): string | null => {
  if (!pdfUrl) return null;

  // absolute ise elleme (prod’da full url gelebilir)
  if (/^https?:\/\//i.test(pdfUrl)) return pdfUrl;

  // relative ise /uploads/... formatına normalize et (API EKLEME, VARSA SÖK)
  return normalizeUploadsPathNoApi(pdfUrl);
};

/* -------------------------------------------------------------
 * DTO → STATE MAP
 * ------------------------------------------------------------- */

const mapDtoToFormState = (row: OfferRow): OfferFormState => {
  const anyRow = row as any;

  const parsed = safeParseJsonObject(anyRow.form_data_parsed);
  const fallback = safeParseJsonObject(anyRow.form_data);
  const normalizedFormData = Object.keys(parsed).length ? parsed : fallback;

  return {
    id: row.id,

    customer_name: row.customer_name,
    company_name: row.company_name ?? null,
    email: row.email,
    phone: row.phone ?? null,

    locale: row.locale ?? null,
    country_code: row.country_code ?? null,

    subject: row.subject ?? null,
    message: row.message ?? null,

    product_id: row.product_id ?? null,

    consent_marketing: toBoolFromTinyInt(anyRow.consent_marketing),
    consent_terms: toBoolFromTinyInt(anyRow.consent_terms),

    status: row.status as any,
    currency: row.currency ?? "EUR",

    net_total: toStrFromNumberOrNull((row as any).net_total),
    vat_rate: toStrFromNumberOrNull((row as any).vat_rate),
    shipping_total: toStrFromNumberOrNull((row as any).shipping_total),
    vat_total: toStrFromNumberOrNull((row as any).vat_total),
    gross_total: toStrFromNumberOrNull((row as any).gross_total),

    valid_until: toIsoStringOrNull((row as any).valid_until),
    offer_no: (row as any).offer_no ?? null,

    admin_notes: (row as any).admin_notes ?? null,

    pdf_url: (row as any).pdf_url ?? null,
    pdf_asset_id: (row as any).pdf_asset_id ?? null,

    email_sent_at: toIsoStringOrNull((row as any).email_sent_at),

    form_data: normalizedFormData ?? {},
  };
};

/* EMPTY STATE */
const buildDefaultFormState = (): OfferFormState => ({
  id: undefined,

  customer_name: "",
  company_name: null,
  email: "",
  phone: null,

  locale: null,
  country_code: null,

  subject: null,
  message: null,

  product_id: null,

  consent_marketing: false,
  consent_terms: true,

  status: "new" as any,
  currency: "EUR",

  net_total: "",
  vat_rate: "",
  shipping_total: "",
  vat_total: "",
  gross_total: "",

  valid_until: null,
  offer_no: null,

  admin_notes: null,

  pdf_url: null,
  pdf_asset_id: null,

  email_sent_at: null,

  form_data: {},
});

/* küçük helper – string → number | null */
const parseDecimalOrNull = (s: string): number | null => {
  if (!s) return null;
  const trimmed = s.replace(",", ".").trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isNaN(n) ? null : n;
};

/* -------------------------------------------------------------
 * Admin panelde Public form_data alanlarını okunur göster
 * ------------------------------------------------------------- */

type FieldDef = { key: string; label: string };

const FIELD_DEFS: FieldDef[] = [
  { key: "related_type", label: "Talep Türü" },
  { key: "contact_role", label: "Yetkili Görevi" },

  { key: "related_product_id", label: "Ürün ID (form_data)" },
  { key: "related_product_name", label: "Ürün Adı (form_data)" },
  { key: "related_service_id", label: "Hizmet ID (form_data)" },
  { key: "related_service_name", label: "Hizmet Adı (form_data)" },

  { key: "tower_process", label: "Proses" },
  { key: "tower_city", label: "İl / City" },
  { key: "tower_district", label: "İlçe / District" },
  { key: "water_flow_m3h", label: "Su Debisi (m³/h)" },
  { key: "inlet_temperature_c", label: "Giriş Sıcaklığı (°C)" },
  { key: "outlet_temperature_c", label: "Çıkış Sıcaklığı (°C)" },
  { key: "wet_bulb_temperature_c", label: "Yaş Termometre (°C)" },
  { key: "capacity_kcal_kw", label: "Kapasite (kcal/h, kW)" },
  { key: "water_quality", label: "Su Kalitesi" },
  { key: "pool_type", label: "Havuz Tipi" },
  { key: "tower_location", label: "Konum / Zemin" },
  { key: "existing_tower_info", label: "Mevcut Kule Bilgisi" },
  { key: "referral_source", label: "Bizi Nereden Tanıyor" },

  { key: "notes", label: "Ek Notlar (form_data)" },
  { key: "product_name", label: "Ürün Adı (legacy)" },
];

const formatValue = (v: unknown): string => {
  if (v === null || typeof v === "undefined") return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.length ? v.map(String).join(", ") : "";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return "[object]";
    }
  }
  return String(v);
};

const buildVisiblePairs = (formData: Record<string, any>) => {
  const pairs = FIELD_DEFS
    .map((f) => ({
      key: f.key,
      label: f.label,
      value: formatValue(formData?.[f.key]),
    }))
    .filter((p) => p.value);

  const known = new Set(FIELD_DEFS.map((x) => x.key));
  const extras = Object.keys(formData || {})
    .filter((k) => !known.has(k))
    .map((k) => ({
      key: k,
      label: `Ek Alan: ${k}`,
      value: formatValue(formData?.[k]),
    }))
    .filter((p) => p.value);

  return { pairs, extras };
};

/* ============================================================= */

export const OfferFormPage: React.FC<OfferFormPageProps> = ({
  mode,
  initialData,
  loading: externalLoading,
  onDone,
}) => {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [formState, setFormState] = useState<OfferFormState | null>(null);
  const [editMode, setEditMode] = useState<OfferFormEditMode>("form");

  const [createOffer, createState] = useCreateOfferAdminMutation();
  const [updateOffer, updateState] = useUpdateOfferAdminMutation();
  const [generatePdf, pdfState] = useGenerateOfferPdfAdminMutation();
  const [sendEmail, emailState] = useSendOfferEmailAdminMutation();

  const saving = createState.isLoading || updateState.isLoading;
  const loading = !!externalLoading;

  /* INITIALIZE FORM */
  useEffect(() => {
    if (isEdit) {
      if (initialData && !formState) setFormState(mapDtoToFormState(initialData));
    } else {
      if (!formState) setFormState(buildDefaultFormState());
    }
  }, [isEdit, initialData, formState]);

  const { pairs: formDataPairs, extras: formDataExtras } = useMemo(() => {
    return buildVisiblePairs(formState?.form_data ?? {});
  }, [formState?.form_data]);

  const pdfHref = useMemo(() => {
    return resolvePdfUrl(formState?.pdf_url ?? null);
  }, [formState?.pdf_url]);

  /**
   * ✅ Fiyat hesapları:
   * - net_total + vat_rate + shipping_total -> vat_total + gross_total
   * - Sadece net geçerliyse hesap yapar; net boşsa boş bırakır.
   */
  const computedTotals = useMemo(() => {
    const net = parseDecimalOrNull(formState?.net_total ?? "");
    const vatRate = parseDecimalOrNull(formState?.vat_rate ?? "");
    const shipping = parseDecimalOrNull(formState?.shipping_total ?? "");

    let vatTotal: number | null = null;
    let grossTotal: number | null = null;

    if (net != null) {
      if (vatRate != null) vatTotal = Number((net * (vatRate / 100)).toFixed(2));
      const shippingForGross = shipping != null && !Number.isNaN(shipping) ? shipping : 0;
      grossTotal = Number((net + (vatTotal ?? 0) + shippingForGross).toFixed(2));
    }

    return { net, vatRate, shipping, vatTotal, grossTotal };
  }, [formState?.net_total, formState?.vat_rate, formState?.shipping_total]);

  // vat_total & gross_total state senkron (payload/DB için)
  useEffect(() => {
    if (!formState) return;

    const nextVat = computedTotals.vatTotal != null ? computedTotals.vatTotal.toFixed(2) : "";
    const nextGross =
      computedTotals.grossTotal != null ? computedTotals.grossTotal.toFixed(2) : "";

    // döngüyü engelle
    if (formState.vat_total === nextVat && formState.gross_total === nextGross) return;

    setFormState((prev) =>
      prev
        ? {
          ...prev,
          vat_total: nextVat,
          gross_total: nextGross,
        }
        : prev,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedTotals.vatTotal, computedTotals.grossTotal]);

  /* SUBMIT */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    const payload = {
      locale: formState.locale || undefined,
      country_code: formState.country_code || undefined,
      customer_name: formState.customer_name,
      company_name: formState.company_name || null,
      email: formState.email,
      phone: formState.phone || null,
      subject: formState.subject || null,
      message: formState.message || null,
      product_id: formState.product_id || null,

      form_data: formState.form_data ?? {},

      consent_marketing: formState.consent_marketing,
      consent_terms: formState.consent_terms,

      status: formState.status,
      currency: formState.currency,

      // ✅ backend'e number/null gönder (PDF ctx'ye sağlıklı geçsin)
      // ✅ backend'e number gönder, boşsa alanı hiç gönderme (undefined)
      net_total: computedTotals.net ?? undefined,
      vat_rate: computedTotals.vatRate ?? undefined,
      shipping_total: computedTotals.shipping ?? undefined,
      vat_total: computedTotals.vatTotal ?? undefined,
      gross_total: computedTotals.grossTotal ?? undefined,


      valid_until: formState.valid_until || null,
      offer_no: formState.offer_no || null,

      admin_notes: formState.admin_notes || null,

      pdf_url: formState.pdf_url || null,
      pdf_asset_id: formState.pdf_asset_id || null,

      // backend yazacak
      email_sent_at: null,
    };

    try {
      if (isEdit && formState.id) {
        const res = await updateOffer({ id: formState.id, body: payload }).unwrap();
        setFormState(mapDtoToFormState(res));
        toast.success("Teklif güncellendi.");
        onDone ? onDone() : router.push(`/admin/offers/${res.id}`);
      } else {
        const res = await createOffer(payload).unwrap();
        setFormState(mapDtoToFormState(res));
        toast.success("Teklif oluşturuldu.");
        onDone ? onDone() : router.push(`/admin/offers/${res.id}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || "Kaydedilemedi.");
    }
  };

  /* PDF üret (ayrı) */
  const handleGeneratePdf = async () => {
    if (!formState?.id) return;
    try {
      const hadPdfBefore = !!formState.pdf_url;
      const res = await generatePdf({ id: formState.id }).unwrap();
      setFormState(mapDtoToFormState(res));
      toast.success(hadPdfBefore ? "PDF yeniden oluşturuldu." : "PDF oluşturuldu.");
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || "PDF üretim hatası.");
    }
  };

  /* Email gönder (ayrı) */
  const handleSendEmail = async () => {
    if (!formState?.id) return;
    if (!formState.pdf_url) {
      toast.error("Önce PDF oluşturmalısın.");
      return;
    }
    try {
      const res = await sendEmail({ id: formState.id }).unwrap();
      setFormState(mapDtoToFormState(res));
      toast.success("E-posta gönderildi.");
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || "E-posta gönderim hatası.");
    }
  };

  const handleCancel = () => router.push("/admin/offers");

  if (!formState) {
    return (
      <div className="container-fluid py-4 small text-muted">
        <span className="spinner-border spinner-border-sm me-2" />
        Form hazırlanıyor...
      </div>
    );
  }

  const headerBusy = saving || loading || pdfState.isLoading || emailState.isLoading;

  return (
    <div className="container-fluid py-4">
      <div className="card">
        <OfferFormHeader
          mode={mode}
          editMode={editMode}
          saving={headerBusy}
          onChangeEditMode={setEditMode}
          onCancel={handleCancel}
        />

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            {/* ✅ Müşteri form detayları (public form_data) */}
            {isEdit && (
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fw-semibold mb-2">Müşteri Form Detayları</h6>
                  <span className="badge text-bg-light">
                    form_data: {Object.keys(formState.form_data ?? {}).length} alan
                  </span>
                </div>

                {Object.keys(formState.form_data ?? {}).length === 0 ? (
                  <div className="alert alert-warning small mb-0">
                    Bu teklifte form_data boş görünüyor. Backend /admin/offers/:id response’unda form_data alanını doğrula.
                  </div>
                ) : (
                  <div className="border rounded p-2">
                    <div className="row g-2">
                      {formDataPairs.map((p) => (
                        <div key={p.key} className="col-md-6">
                          <div className="small text-muted">{p.label}</div>
                          <div className="fw-semibold">{p.value}</div>
                        </div>
                      ))}

                      {formDataExtras.length > 0 && (
                        <div className="col-12">
                          <hr className="my-2" />
                          <div className="small text-muted mb-1">Diğer Alanlar</div>
                          <div className="row g-2">
                            {formDataExtras.map((p) => (
                              <div key={p.key} className="col-md-6">
                                <div className="small text-muted">{p.label}</div>
                                <div className="font-monospace small">{p.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PDF PREVIEW AREA */}
            {isEdit && formState.id && (
              <div className="mb-4">
                <h6 className="fw-semibold mb-2">Teklif PDF Önizleme</h6>

                {/* ✅ /api yok: pdfHref /uploads/... döner */}
                <OfferPdfPreview pdfUrl={pdfHref} />

                <div className="d-flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleGeneratePdf}
                    disabled={pdfState.isLoading || saving}
                  >
                    {pdfState.isLoading
                      ? "PDF hazırlanıyor..."
                      : formState.pdf_url
                        ? "PDF’yi Yeniden Oluştur"
                        : "PDF Oluştur"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSendEmail}
                    disabled={emailState.isLoading || saving || !formState.pdf_url}
                    title={!formState.pdf_url ? "Önce PDF oluştur" : undefined}
                  >
                    {emailState.isLoading ? "E-posta gönderiliyor..." : "E-posta Gönder"}
                  </button>

                  {pdfHref && (
                    <a className="btn btn-secondary btn-sm" href={pdfHref} target="_blank" rel="noreferrer">
                      PDF’i Yeni Sekmede Aç
                    </a>
                  )}
                </div>

                {formState.email_sent_at && (
                  <div className="small text-muted mt-2">
                    Son gönderim: <code>{formState.email_sent_at}</code>
                  </div>
                )}
              </div>
            )}

            {/* FORM / JSON */}
            {editMode === "form" ? (
              <OfferForm
                mode={mode}
                values={formState}
                saving={headerBusy}
                onChange={(field, value) =>
                  setFormState((prev) => (prev ? { ...prev, [field]: value } : prev))
                }
              />
            ) : (
              <div className="row">
                <div className="col-12">
                  <label className="form-label small">Teknik Form Verileri (JSON)</label>

                  <OfferFormJsonSection
                    jsonModel={formState.form_data}
                    disabled={headerBusy}
                    onChangeJson={(next) =>
                      setFormState((prev) => (prev ? { ...prev, form_data: next } : prev))
                    }
                    onErrorChange={() => toast.error("Geçersiz JSON.")}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="card-footer d-flex justify-content-end">
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? "Kaydediliyor..." : mode === "create" ? "Oluştur" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
