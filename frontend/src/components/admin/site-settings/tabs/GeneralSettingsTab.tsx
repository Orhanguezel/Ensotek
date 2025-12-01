// =============================================================
// FILE: src/components/admin/site-settings/tabs/GeneralSettingsTab.tsx
// Genel / UI Ayarları Tab (contact_info, socials, businessHours, company_profile)
// =============================================================

import React from "react";
import { toast } from "sonner";
import {
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
  type SiteSetting,
} from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import type { SettingValue } from "@/integrations/types/site";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type GeneralSettingsTabProps = {
  locale: string;
};

const GENERAL_KEYS = [
  "contact_info",
  "socials",
  "businessHours",
  "company_profile",
] as const;

type GeneralKey = (typeof GENERAL_KEYS)[number];

type FormState = Record<GeneralKey, string>;

const EMPTY_FORM: FormState = {
  contact_info: "",
  socials: "",
  businessHours: "",
  company_profile: "",
};

function stringifyValuePretty(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

/**
 * Ham textarea string'ini SettingValue'a çevir
 * - Boş → null
 * - Geçerli JSON → JSON.parse sonucu (string | number | boolean | null | obje | array)
 * - JSON parse hatası → düz string
 */
function parseValue(raw: string): SettingValue {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);

    // JSON.parse çıktısı zaten SettingValue union'ına uyuyor:
    // string | number | boolean | null | object | array
    return parsed as SettingValue;
  } catch {
    // JSON değilse düz string olarak sakla
    return trimmed;
  }
}

function toMap(settings?: SiteSetting[] | undefined) {
  const map = new Map<string, SiteSetting>();
  if (settings) {
    for (const s of settings) {
      map.set(s.key, s);
    }
  }
  return map;
}

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
  locale,
}) => {
  const {
    data: settings,
    isLoading,
    isFetching,
    refetch,
  } = useListSiteSettingsAdminQuery({
    keys: GENERAL_KEYS as unknown as string[],
    locale: locale || undefined,
  });

  const [updateSetting, { isLoading: isSaving }] =
    useUpdateSiteSettingAdminMutation();

  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);

  // Backend’ten gelen değerleri forma bas
  React.useEffect(() => {
    const map = toMap(settings);
    const next: FormState = { ...EMPTY_FORM };

    GENERAL_KEYS.forEach((key) => {
      const row = map.get(key);
      next[key] = row ? stringifyValuePretty(row.value) : "";
    });

    setForm(next);
  }, [settings, locale]);

  const loading = isLoading || isFetching;

  const handleChange = (field: GeneralKey, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = async () => {
    try {
      const localeParam = locale || undefined;

      for (const key of GENERAL_KEYS) {
        const raw = form[key].trim();

        // Boş bıraktıysa bu key için update göndermiyoruz; istersen burada
        // "null yaz ve kaydet" davranışına da çevirebilirsin.
        if (!raw) continue;

        const value: SettingValue = parseValue(raw);

        await updateSetting({
          key,
          value,
          locale: localeParam,
        }).unwrap();
      }

      toast.success("Genel / UI ayarları kaydedildi.");
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Genel ayarlar kaydedilirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex justify-content-between align-items-center">
        <span className="small fw-semibold">Genel / UI Ayarları</span>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border">
            Aktif dil: {locale || "varsayılan (fallback zinciri)"}
          </span>
          {loading && (
            <span className="badge bg-secondary">Yükleniyor...</span>
          )}
        </div>
      </div>

      <div className="card-body">
        <p className="text-muted small mb-3">
          Bu bölümde, <code>contact_info</code>, <code>socials</code>,{" "}
          <code>businessHours</code> ve <code>company_profile</code> JSON
          yapılarını düzenleyebilirsin. Her dil için ayrı kayıt yönetebilmek
          için üstteki dil seçicisini kullan.
        </p>

        {/* contact_info */}
        <div className="mb-3">
          <label className="form-label small">
            İletişim Bilgileri (<code>contact_info</code>)
          </label>
          <Textarea
            rows={6}
            value={form.contact_info}
            onChange={(e) => handleChange("contact_info", e.target.value)}
            placeholder={`Örnek JSON:
{
  "companyName": "Ensotek Enerji Sistemleri",
  "phones": ["+90 212 ...", "+49 152 ..."],
  "email": "info@ensotek.com",
  "address": "...",
  "whatsappNumber": "+49 ..."
}`}
          />
          <div className="form-text">
            Geçerli JSON girerseniz nesne/array olarak saklanır.
          </div>
        </div>

        {/* socials */}
        <div className="mb-3">
          <label className="form-label small">
            Sosyal Medya (<code>socials</code>)
          </label>
          <Textarea
            rows={4}
            value={form.socials}
            onChange={(e) => handleChange("socials", e.target.value)}
            placeholder={`Örnek JSON:
{
  "instagram": "https://instagram.com/ensotek",
  "facebook": "https://facebook.com/ensotek"
}`}
          />
        </div>

        {/* businessHours */}
        <div className="mb-3">
          <label className="form-label small">
            Çalışma Saatleri (<code>businessHours</code>)
          </label>
          <Textarea
            rows={6}
            value={form.businessHours}
            onChange={(e) => handleChange("businessHours", e.target.value)}
            placeholder={`Örnek JSON:
[
  { "day": "Pazartesi", "open": "09:00", "close": "18:00", "isClosed": false },
  { "day": "Pazar", "open": null, "close": null, "isClosed": true }
]`}
          />
        </div>

        {/* company_profile */}
        <div className="mb-3">
          <label className="form-label small">
            Şirket Profili (<code>company_profile</code>)
          </label>
          <Textarea
            rows={6}
            value={form.company_profile}
            onChange={(e) => handleChange("company_profile", e.target.value)}
            placeholder={`Örnek JSON:
{
  "headline": "Ensotek ile Akıllı Enerji ve Otomasyon Çözümleri",
  "subline": "Kısa alt başlık...",
  "body": "Uzun açıklama..."
}`}
          />
        </div>

        <div className="d-flex justify-content-end">
          <Button
            type="button"
            variant="default"
            disabled={isSaving}
            onClick={handleSaveAll}
          >
            {isSaving ? "Kaydediliyor..." : "Tümünü Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
};
