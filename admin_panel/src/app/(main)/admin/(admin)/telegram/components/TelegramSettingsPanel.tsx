// =============================================================
// FILE: src/app/(main)/admin/(admin)/telegram/components/TelegramSettingsPanel.tsx
// Telegram Settings Panel (B2B events, i18n)
// Ensotek
// =============================================================

"use client";

import * as React from "react";

import { Save } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Button } from "@/components/ui/button";
import { useBulkUpsertSiteSettingsAdminMutation, useListSiteSettingsAdminQuery } from "@/integrations/hooks";
import type { SiteSettingRow, UpsertSettingBody, ValueType } from "@/integrations/shared";

import TelegramSettingsCard from "./TelegramSettingsCard";

// --- Ensotek B2B keys (matches 202_telegram_templates.sql) ---
const TELEGRAM_KEYS = [
  "telegram_notifications_enabled",
  "telegram_webhook_enabled",

  "telegram_bot_token",
  "telegram_chat_id",
  "telegram_default_chat_id",

  "telegram_event_new_catalog_request_enabled",
  "telegram_event_new_offer_request_enabled",
  "telegram_event_new_contact_enabled",
  "telegram_event_new_ticket_enabled",
  "telegram_event_ticket_replied_enabled",
  "telegram_event_new_newsletter_subscription_enabled",

  "telegram_template_new_catalog_request",
  "telegram_template_new_offer_request",
  "telegram_template_new_contact",
  "telegram_template_new_ticket",
  "telegram_template_ticket_replied",
  "telegram_template_new_newsletter_subscription",
] as const;

type TelegramKey = (typeof TELEGRAM_KEYS)[number];

const TELEGRAM_BOOL_KEYS = new Set<TelegramKey>([
  "telegram_notifications_enabled",
  "telegram_webhook_enabled",
  "telegram_event_new_catalog_request_enabled",
  "telegram_event_new_offer_request_enabled",
  "telegram_event_new_contact_enabled",
  "telegram_event_new_ticket_enabled",
  "telegram_event_ticket_replied_enabled",
  "telegram_event_new_newsletter_subscription_enabled",
]);

export type TelegramSettingsModel = Record<TelegramKey, string>;

const defaults: TelegramSettingsModel = {
  telegram_notifications_enabled: "false",
  telegram_webhook_enabled: "false",

  telegram_bot_token: "",
  telegram_chat_id: "",
  telegram_default_chat_id: "",

  telegram_event_new_catalog_request_enabled: "false",
  telegram_event_new_offer_request_enabled: "false",
  telegram_event_new_contact_enabled: "false",
  telegram_event_new_ticket_enabled: "false",
  telegram_event_ticket_replied_enabled: "false",
  telegram_event_new_newsletter_subscription_enabled: "false",

  telegram_template_new_catalog_request:
    "📚 *Yeni Katalog Talebi*\n\n👤 Ad Soyad: {{customer_name}}\n📧 E-posta: {{customer_email}}\n📱 Telefon: {{customer_phone}}\n🏢 Firma: {{company_name}}\n💬 Mesaj: {{message}}\n📅 Tarih: {{created_at}}",
  telegram_template_new_offer_request:
    "💰 *Yeni Teklif Talebi*\n\n👤 Ad Soyad: {{customer_name}}\n📧 E-posta: {{customer_email}}\n📱 Telefon: {{customer_phone}}\n🏢 Firma: {{company_name}}\n🔧 Ürün/Hizmet: {{product_service}}\n💬 Detay: {{message}}\n📅 Tarih: {{created_at}}",
  telegram_template_new_contact:
    "📞 *Yeni İletişim Talebi*\n\n👤 Ad Soyad: {{customer_name}}\n📧 E-posta: {{customer_email}}\n📱 Telefon: {{customer_phone}}\n🏢 Firma: {{company_name}}\n📝 Konu: {{subject}}\n💬 Mesaj: {{message}}\n📅 Tarih: {{created_at}}",
  telegram_template_new_ticket:
    "🎫 *Yeni Destek Talebi*\n\n👤 Kullanıcı: {{user_name}}\n📧 E-posta: {{user_email}}\n📝 Konu: {{subject}}\n⚠️ Öncelik: {{priority}}\n💬 Mesaj: {{message}}\n📅 Tarih: {{created_at}}",
  telegram_template_ticket_replied:
    "✅ *Destek Talebi Yanıtlandı*\n\n👤 Kullanıcı: {{user_name}}\n📝 Konu: {{subject}}\n⚠️ Öncelik: {{priority}}\n💬 Yanıt: {{message}}\n📅 Tarih: {{created_at}}",
  telegram_template_new_newsletter_subscription:
    "📬 *Yeni Bülten Aboneliği*\n\n📧 E-posta: {{email}}\n👤 Ad: {{name}}\n🌐 Dil: {{locale}}\n📅 Tarih: {{created_at}}",
};

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

const toBoolish = (v: unknown): boolean => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return s === "1" || s === "true" || s === "yes" || s === "on";
  }
  return false;
};

const boolToDb = (b: boolean): "true" | "false" => (b ? "true" : "false");

const normalizeTemplateValue = (v: unknown): string => {
  if (isObject(v) && "template" in v) return String((v as { template?: unknown }).template ?? "");
  return v == null ? "" : String(v);
};

export default function TelegramSettingsPanel() {
  const t = useAdminT("admin.telegram");
  const { data: rows, isLoading, isFetching } = useListSiteSettingsAdminQuery(undefined);
  const [bulkUpsert, { isLoading: saving }] = useBulkUpsertSiteSettingsAdminMutation();

  const [model, setModel] = React.useState<TelegramSettingsModel>(defaults);
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!rows || initialized) return;

    const m: TelegramSettingsModel = { ...defaults };

    for (const item of rows as SiteSettingRow[]) {
      const k = String(item.key ?? "") as TelegramKey;
      if (!TELEGRAM_KEYS.includes(k)) continue;

      let v: unknown = item.value;

      if (k.startsWith("telegram_template_")) v = normalizeTemplateValue(v);

      if (TELEGRAM_BOOL_KEYS.has(k)) {
        m[k] = boolToDb(toBoolish(v));
      } else {
        m[k] = v == null ? "" : String(v);
      }
    }

    setModel(m);
    setInitialized(true);
  }, [rows, initialized]);

  const initialLoading = !initialized && (isLoading || isFetching);

  const handleSave = async () => {
    try {
      const items: UpsertSettingBody[] = (Object.entries(model) as Array<[TelegramKey, string]>).map(
        ([key, value]) => ({
          key,
          value: TELEGRAM_BOOL_KEYS.has(key) ? (toBoolish(value) ? "true" : "false") : value,
          value_type: "string" as ValueType,
          group: null,
          description: null,
        }),
      );

      await bulkUpsert({ items }).unwrap();
      toast.success(t("settings.saved"));
    } catch (e) {
      console.error(e);
      toast.error((e as { message?: string })?.message || t("settings.saveError"));
    }
  };

  if (initialLoading) {
    return <div className="py-8 text-muted-foreground text-sm">{t("settings.loading")}</div>;
  }

  return (
    <div className="space-y-4">
      <TelegramSettingsCard settings={model} setSettings={setModel} />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? t("settings.saving") : t("settings.save")}
        </Button>
      </div>
    </div>
  );
}
